/*
 * SSRS course extension — extra sections and worked examples merged into
 * courses-data/ssrs.js at load time. Dataset queries are written in portable
 * SQL with their own sample data so they run in the Playground (SQLite);
 * T-SQL-specific syntax is shown in the text. RDL excerpts target SSRS
 * 2019/2022 and Power BI Report Server.
 */

const SALES = `-- Sample data (in SQL Server this is your reporting view/table) --
CREATE TABLE Sales (
  OrderID INTEGER PRIMARY KEY, OrderDate TEXT, Region TEXT, Country TEXT,
  Category TEXT, Product TEXT, SalesRep TEXT, Qty INTEGER, Amount REAL
);
INSERT INTO Sales VALUES
 (1,'2026-01-05','Europe','Portugal','Hardware','Laptop','Ana',2,2400),
 (2,'2026-01-17','Europe','Germany','Accessories','Mouse','Ben',10,250),
 (3,'2026-02-02','Europe','Germany','Hardware','Monitor','Ben',3,660),
 (4,'2026-02-11','Americas','USA','Hardware','Laptop','Cy',1,1250),
 (5,'2026-02-25','Americas','Canada','Accessories','Keyboard','Cy',6,540),
 (6,'2026-03-03','Europe','Portugal','Accessories','Mouse','Ana',4,100),
 (7,'2026-03-14','Asia','Japan','Hardware','Monitor','Dee',5,1100),
 (8,'2026-03-29','Americas','USA','Accessories','Keyboard','Cy',2,180);
-- ---------------------------------------------------------------
`;

export default {
  examples: {
    'Example Query Configuration': [
      {
        title: 'Parameterised dataset query (multi-value + optional filter)',
        language: 'sql',
        explanation: 'In the SSRS dataset you write `@Region` exactly like this; SSRS creates the matching report parameter. A **multi-value** parameter is expanded by SSRS into a comma list, so `IN (@Region)` works. Here the parameters are emulated with a small `params` CTE so the query runs in SQLite.',
        code: SALES + `
-- SSRS dataset text:
--   SELECT ... WHERE Region IN (@Region)
--     AND (@Category IS NULL OR Category = @Category)
--     AND OrderDate BETWEEN @StartDate AND @EndDate
WITH params AS (
  SELECT 'Hardware' AS Category, '2026-01-01' AS StartDate, '2026-03-31' AS EndDate
)
SELECT s.Region, s.Country, s.Product, SUM(s.Qty) AS Units, SUM(s.Amount) AS Revenue
FROM Sales s, params p
WHERE s.Region IN ('Europe', 'Americas')               -- @Region (multi-value)
  AND (p.Category IS NULL OR s.Category = p.Category)   -- optional @Category
  AND s.OrderDate BETWEEN p.StartDate AND p.EndDate
GROUP BY s.Region, s.Country, s.Product
ORDER BY s.Region, Revenue DESC;`,
      },
    ],
  },

  sections: [
    {
      title: 'Data Sources & Datasets',
      after: 'Report Creation Process',
      content: `| Object | What it is | Tip |
|---|---|---|
| **Shared data source** (\`.rds\`) | connection string + credentials on the server | one per database; reused by many reports |
| **Embedded data source** | connection stored inside one report | avoid — hard to repoint between environments |
| **Shared dataset** (\`.rsd\`) | a query reusable across reports, cacheable | great for parameter lists (regions, years) |
| **Embedded dataset** | query inside the report | fine for report-specific queries |

### Credentials

Prefer **stored credentials** of a least-privilege, read-only SQL/Windows account (needed for subscriptions and caching) or **Windows integrated** security with Kerberos for per-user data.

### Write datasets well

- Call **stored procedures** or views — easier to tune and secure than ad-hoc SQL in RDL.
- Return **only the columns and rows** the report shows; aggregate in SQL, not in the report.
- Avoid \`SELECT *\` — adding a column can break field mappings.
- \`SET NOCOUNT ON\` in procedures; avoid temp-table schema surprises (SSRS reads the first result set's metadata).`,
      code: SALES + `
-- Dataset for a "Monthly sales by category" matrix
-- (T-SQL: FORMAT(OrderDate,'yyyy-MM') or DATEFROMPARTS(YEAR(OrderDate), MONTH(OrderDate), 1))
SELECT
  substr(OrderDate, 1, 7)          AS SalesMonth,
  Category,
  COUNT(*)                         AS Orders,
  SUM(Qty)                         AS Units,
  ROUND(SUM(Amount), 2)            AS Revenue,
  ROUND(SUM(Amount) / SUM(Qty), 2) AS AvgUnitPrice
FROM Sales
GROUP BY substr(OrderDate, 1, 7), Category
ORDER BY SalesMonth, Category;

-- Shared dataset feeding the @Region parameter's available values
SELECT DISTINCT Region AS Value, Region AS Label FROM Sales ORDER BY Region;`,
      codeLabel: 'Aggregated report dataset + parameter list dataset',
      codeLanguage: 'sql',
      keyPoints: [
        'Use shared data sources so reports can be repointed per environment.',
        'Store least-privilege credentials so subscriptions and caching work.',
        'Aggregate in SQL and return only what the report displays.',
        'Use shared datasets for parameter value lists.',
      ],
    },
    {
      title: 'Report Parameters',
      after: 'Data Sources & Datasets',
      content: `Parameters let users filter reports and let other reports drill through with context.

| Setting | Options |
|---|---|
| Data type | Text, Integer, Float, Date/Time, Boolean |
| Available values | none (free input), specified list, **from a dataset** |
| Default values | constant, expression (\`=Today()\`), or dataset |
| Allow multiple values | user can tick several → \`IN (@Param)\` in SQL |
| Allow null / blank | optional filters |
| Visibility | visible, hidden (set by drillthrough/URL), internal |

### Cascading parameters

\`@Country\`'s dataset filters by \`@Region\` — SSRS refreshes it automatically when \`@Region\` changes. Order matters: dependent parameters must come **after** the ones they use.

### Useful expressions

- Default start date to the first of the month: \`=DateSerial(Year(Today()), Month(Today()), 1)\`
- Show selections in a header: \`=Join(Parameters!Region.Label, ", ")\`
- Pass multi-value to a stored procedure: send \`=Join(Parameters!Region.Value, ",")\` and split with \`STRING_SPLIT\` in T-SQL.`,
      code: SALES + `
-- Cascading parameter dataset: countries for the selected region(s)
-- SSRS:  SELECT DISTINCT Country FROM Sales WHERE Region IN (@Region) ORDER BY Country
SELECT DISTINCT Country
FROM Sales
WHERE Region IN ('Europe')            -- @Region chosen by the user
ORDER BY Country;

-- Stored-procedure pattern for multi-value parameters (T-SQL, SQL Server 2016+):
--   CREATE PROCEDURE dbo.rpt_SalesByCountry @Countries NVARCHAR(MAX), @From DATE, @To DATE AS
--   SELECT ... FROM Sales
--   WHERE Country IN (SELECT value FROM STRING_SPLIT(@Countries, ','))
--     AND OrderDate >= @From AND OrderDate < DATEADD(day, 1, @To);
-- Dataset parameter value in SSRS:  =Join(Parameters!Country.Value, ",")

-- Portable equivalent with a comma list:
WITH params AS (SELECT ',Portugal,Germany,' AS Countries)
SELECT s.Country, SUM(s.Amount) AS Revenue
FROM Sales s, params p
WHERE instr(p.Countries, ',' || s.Country || ',') > 0
GROUP BY s.Country;`,
      codeLabel: 'Cascading and multi-value parameter queries',
      codeLanguage: 'sql',
      keyPoints: [
        'Populate parameter lists from (shared) datasets.',
        'Cascading parameters filter on earlier parameters — keep them ordered.',
        'Multi-value parameters work directly with `IN (@Param)` in dataset text.',
        'For stored procedures, join the values and split them in T-SQL.',
      ],
    },
    {
      title: 'Expressions & Built-in Functions',
      after: 'Report Parameters',
      content: `Almost every property in SSRS can be an **expression** — VB.NET-like code starting with \`=\`.

| Collection | Example |
|---|---|
| \`Fields!\` | \`=Fields!Amount.Value\` |
| \`Parameters!\` | \`=Parameters!StartDate.Value\`, \`.Label\` |
| \`Globals!\` | \`=Globals!ExecutionTime\`, \`Globals!PageNumber\`, \`Globals!TotalPages\`, \`Globals!ReportName\` |
| \`User!\` | \`=User!UserID\` |
| \`ReportItems!\` | value of another textbox (headers/footers) |

### Common functions

| Purpose | Expression |
|---|---|
| Conditional | \`=IIf(Fields!Margin.Value < 0, "Red", "Black")\` |
| Multiple cases | \`=Switch(x < 50, "Low", x < 80, "Mid", True, "High")\` |
| Aggregates with scope | \`=Sum(Fields!Amount.Value, "RegionGroup")\` |
| Percent of total | \`=Sum(Fields!Amount.Value) / Sum(Fields!Amount.Value, "DataSet1")\` |
| Running total | \`=RunningValue(Fields!Amount.Value, Sum, "DataSet1")\` |
| Row banding | \`=IIf(RowNumber(Nothing) Mod 2 = 0, "WhiteSmoke", "White")\` |
| Lookup from another dataset | \`=Lookup(Fields!RepId.Value, Fields!Id.Value, Fields!Name.Value, "Reps")\` |
| Safe division | \`=IIf(Sum(Fields!Qty.Value) = 0, Nothing, Sum(Fields!Amount.Value) / IIf(Sum(Fields!Qty.Value) = 0, 1, Sum(Fields!Qty.Value)))\` |

Format numbers with the **Format** property (\`C2\`, \`N0\`, \`P1\`) instead of \`FormatNumber()\` so Excel exports keep numeric types.`,
      code: SALES + `
-- Compute in SQL what you would otherwise build with report expressions:
-- running total (RunningValue), percent of total, and a status colour (Switch)
SELECT
  OrderDate,
  Product,
  Amount,
  SUM(Amount) OVER (ORDER BY OrderDate)                         AS RunningRevenue,
  ROUND(100.0 * Amount / SUM(Amount) OVER (), 1)                AS PctOfTotal,
  CASE WHEN Amount >= 1000 THEN 'Green'
       WHEN Amount >= 300  THEN 'Orange'
       ELSE 'Red' END                                            AS StatusColor
FROM Sales
ORDER BY OrderDate;

-- Matching SSRS expressions (textbox properties):
--   Value      =RunningValue(Fields!Amount.Value, Sum, "DataSet1")
--   Value      =Fields!Amount.Value / Sum(Fields!Amount.Value, "DataSet1")      Format: P1
--   Color      =Switch(Fields!Amount.Value >= 1000, "Green", Fields!Amount.Value >= 300, "Orange", True, "Red")
--   Header     ="Sales " & Format(Parameters!StartDate.Value, "dd MMM yyyy") & " – " & Join(Parameters!Region.Label, ", ")
--   Footer     ="Page " & Globals!PageNumber & " of " & Globals!TotalPages`,
      codeLabel: 'Window functions vs equivalent report expressions',
      codeLanguage: 'sql',
      keyPoints: [
        'Any property can be an expression starting with `=`.',
        'Aggregates take an optional scope name (group or dataset).',
        'Use the Format property so exports keep numeric data types.',
        'Push heavy calculations into SQL; keep expressions for presentation.',
      ],
    },
    {
      title: 'Tablix: Grouping, Totals & Drilldown',
      after: 'Expressions & Built-in Functions',
      content: `**Tablix** is the engine behind tables, matrices and lists.

| Data region | Shape | Typical use |
|---|---|---|
| **Table** | fixed columns, row groups | detail listings with subtotals |
| **Matrix** | row **and** column groups | pivots: products × months |
| **List** | free-form repeated panel | cards, letters, invoices |

### Grouping

Add **row groups** (Region → Country) and **column groups** (Year → Month). Totals: right-click the group → *Add Total* (before/after).

### Interactive drilldown

Set a child group's **Visibility** to *Hidden* and **Toggle by** the parent group's textbox — users expand Region to see Countries. Combine with **document map** labels and **interactive sort** on headers.

### Pagination

Use *page breaks between instances* of a group (one region per page) and *repeat header rows on each page* (Advanced Mode → \`RepeatOnNewPage = True\`).`,
      code: `<!-- RDL excerpt: row group Region with a drilldown Country group -->
<TablixRowHierarchy>
  <TablixMembers>
    <TablixMember>
      <Group Name="Region">
        <GroupExpressions><GroupExpression>=Fields!Region.Value</GroupExpression></GroupExpressions>
        <PageBreak><BreakLocation>Between</BreakLocation></PageBreak>
      </Group>
      <SortExpressions><SortExpression><Value>=Fields!Region.Value</Value></SortExpression></SortExpressions>
      <TablixHeader>
        <Size>1.5in</Size>
        <CellContents>
          <Textbox Name="RegionTextbox">
            <Paragraphs><Paragraph><TextRuns><TextRun>
              <Value>=Fields!Region.Value</Value>
            </TextRun></TextRuns></Paragraph></Paragraphs>
          </Textbox>
        </CellContents>
      </TablixHeader>
      <TablixMembers>
        <TablixMember>
          <Group Name="Country">
            <GroupExpressions><GroupExpression>=Fields!Country.Value</GroupExpression></GroupExpressions>
          </Group>
          <Visibility>
            <Hidden>true</Hidden>
            <ToggleItem>RegionTextbox</ToggleItem>   <!-- click Region to expand -->
          </Visibility>
        </TablixMember>
      </TablixMembers>
    </TablixMember>
    <TablixMember>
      <KeepWithGroup>Before</KeepWithGroup>       <!-- grand total row -->
    </TablixMember>
  </TablixMembers>
</TablixRowHierarchy>

<!-- Cell values:
     Revenue      =Sum(Fields!Amount.Value)
     % of region  =Sum(Fields!Amount.Value) / Sum(Fields!Amount.Value, "Region")
     Grand total  =Sum(Fields!Amount.Value, "DataSet1") -->`,
      codeLabel: 'Row groups with toggle visibility and page breaks (RDL)',
      codeLanguage: 'xml',
      keyPoints: [
        'Tables, matrices and lists are all tablix data regions.',
        'Matrices add column groups for pivot-style layouts.',
        'Drilldown = hidden child group toggled by the parent textbox.',
        'Use group page breaks and repeating headers for printable reports.',
      ],
    },
    {
      title: 'Charts, Indicators & Sparklines',
      after: 'Tablix: Grouping, Totals & Drilldown',
      content: `| Visual | Best for |
|---|---|
| Column / bar | comparing categories |
| Line | trends over time |
| Pie / doughnut | share of a whole (≤ 5 slices) |
| **Sparkline** (in a tablix cell) | mini trend per row |
| **Data bar** | magnitude per row |
| **Indicator** (arrows, traffic lights) | status vs target (KPIs) |
| **Gauge** | single KPI vs range |
| Map | values by geography |

### Tips

- Feed charts **pre-aggregated** datasets; charts with thousands of points render slowly.
- Category groups = X axis, series groups = legend entries, values = Y.
- Use **expressions** for colours (\`=IIf(Sum(Fields!Revenue.Value) < Sum(Fields!Target.Value), "Tomato", "SeaGreen")\`).
- Sparklines and indicators must sit inside a tablix row group to get one per row.`,
      code: SALES + `
-- Dataset for a KPI table with a monthly sparkline and a target indicator
WITH monthly AS (
  SELECT Region, substr(OrderDate, 1, 7) AS SalesMonth, SUM(Amount) AS Revenue
  FROM Sales GROUP BY Region, substr(OrderDate, 1, 7)
),
targets(Region, QuarterTarget) AS (
  VALUES ('Europe', 3000), ('Americas', 2500), ('Asia', 1500)
)
SELECT m.Region,
       m.SalesMonth,                  -- sparkline category group
       m.Revenue,                     -- sparkline value
       SUM(m.Revenue) OVER (PARTITION BY m.Region) AS QuarterRevenue,
       t.QuarterTarget,
       ROUND(100.0 * SUM(m.Revenue) OVER (PARTITION BY m.Region) / t.QuarterTarget, 1) AS PctOfTarget
FROM monthly m JOIN targets t ON t.Region = m.Region
ORDER BY m.Region, m.SalesMonth;

-- Indicator (3 states) on PctOfTarget:  Red < 80  ≤ Yellow < 100 ≤ Green`,
      codeLabel: 'KPI dataset for sparklines and indicators',
      codeLanguage: 'sql',
      keyPoints: [
        'Choose the visual by the question: comparison, trend, share or status.',
        'Aggregate data in the dataset before charting.',
        'Sparklines, data bars and indicators live inside tablix rows.',
        'Drive colours and indicator states with expressions or SQL columns.',
      ],
    },
    {
      title: 'Subreports & Drillthrough',
      after: 'Charts, Indicators & Sparklines',
      content: `| Technique | How it works | Cost |
|---|---|---|
| **Drillthrough** | Action → *Go to report* with parameters; opens a new report on click | cheap — runs only when clicked |
| **Subreport** | a report embedded in a cell, executed **once per row** | expensive for many rows |
| **Lookup / LookupSet** | join a second dataset in expressions | cheap for small lookup sets |
| **Go to URL** | link to an app or another system | — |

Prefer **drillthrough** or a single joined dataset over subreports in large tables — a subreport inside a 1 000-row table runs its query 1 000 times.

Pass context with parameters: \`Region = Fields!Region.Value\`, \`StartDate = Parameters!StartDate.Value\`. In the target report, mark those parameters **hidden** if users shouldn't change them.`,
      code: `<!-- Textbox action: click a product to open the detail report with context -->
<Textbox Name="ProductName">
  <ActionInfo>
    <Actions>
      <Action>
        <Drillthrough>
          <ReportName>/Sales/Product Detail</ReportName>
          <Parameters>
            <Parameter Name="Product"><Value>=Fields!Product.Value</Value></Parameter>
            <Parameter Name="StartDate"><Value>=Parameters!StartDate.Value</Value></Parameter>
            <Parameter Name="EndDate"><Value>=Parameters!EndDate.Value</Value></Parameter>
            <Parameter Name="Region"><Value>=Parameters!Region.Value</Value></Parameter>  <!-- multi-value OK -->
          </Parameters>
        </Drillthrough>
      </Action>
    </Actions>
  </ActionInfo>
  <Style><Color>Blue</Color><TextDecoration>Underline</TextDecoration></Style>
</Textbox>

<!-- Link to an external app (URL encoded) -->
<Action>
  <Hyperlink>="https://crm.example.com/accounts/" &amp; Fields!AccountId.Value</Hyperlink>
</Action>

<!-- Lookup instead of a subreport: rep name from a second dataset "Reps" -->
<!-- =Lookup(Fields!SalesRep.Value, Fields!RepCode.Value, Fields!RepFullName.Value, "Reps") -->`,
      codeLabel: 'Drillthrough action with parameters (RDL)',
      codeLanguage: 'xml',
      keyPoints: [
        'Drillthrough runs the detail report only when the user clicks.',
        'Subreports execute once per row — avoid them in large tables.',
        'Use `Lookup` to join small datasets without a subreport.',
        'Pass filters as parameters and hide them in the target report.',
      ],
    },
    {
      title: 'Subscriptions, Caching & Snapshots',
      after: 'Deployment & Configuration',
      content: `### Subscriptions

| Type | Description |
|---|---|
| **Standard** | fixed recipients, format and parameters on a schedule |
| **Data-driven** (Enterprise) | recipients/parameters/format read from a query — one email per row |

Delivery extensions: **email** (configure SMTP in Report Server Configuration Manager), **file share**, Power BI Report Server also supports SharePoint libraries. Subscriptions require **stored credentials** in the data source.

### Performance features

| Feature | Effect |
|---|---|
| **Cached report** | first run's result reused for N minutes per parameter combination |
| **Shared dataset caching** | cache a dataset used by many reports |
| **Snapshot** | report executed on a schedule; users view the stored result instantly |
| **History** | keep past snapshots ("month-end as it was") |

Schedules run via **SQL Server Agent**, so Agent must be running on the catalog's instance.`,
      code: `# PowerShell — automate SSRS with the ReportingServicesTools module
Install-Module ReportingServicesTools -Scope CurrentUser

$portal = "https://reports.example.com/reports"
$server = "https://reports.example.com/ReportServer"

# Deploy a data source and a report (CI/CD friendly)
Write-RsRestCatalogItem -ReportPortalUri $portal -Path .\\Shared\\SalesDW.rds -RsFolder "/Data Sources" -Overwrite
Write-RsRestCatalogItem -ReportPortalUri $portal -Path ".\\Sales\\Monthly Sales.rdl" -RsFolder "/Sales" -Overwrite
Set-RsDataSourceReference -ReportServerUri $server -Path "/Sales/Monthly Sales" \`
    -DataSourceName "SalesDW" -DataSourcePath "/Data Sources/SalesDW"

# Email the report as PDF every Monday 07:00
$schedule = New-RsScheduleXml -Weekly -DaysOfWeek Monday -Start (Get-Date "07:00")
New-RsSubscription -ReportServerUri $server -RsItem "/Sales/Monthly Sales" \`
    -Description "Weekly sales to managers" -Destination "Email" \`
    -To "sales-managers@example.com" -Subject "Weekly sales @ExecutionTime" \`
    -RenderFormat "PDF" -Schedule $schedule \`
    -Parameters @{ Region = "Europe" }

# Inventory and export existing subscriptions (e.g. before a migration)
Get-RsSubscription -ReportServerUri $server -RsItem "/Sales/Monthly Sales" |
    Export-RsSubscriptionXml -Path .\\subscriptions.xml`,
      codeLabel: 'Deploying reports and creating subscriptions from PowerShell',
      codeLanguage: 'powershell',
      keyPoints: [
        'Standard subscriptions deliver fixed reports; data-driven ones personalise per row.',
        'Subscriptions and caching need stored credentials on the data source.',
        'Caching and snapshots trade freshness for instant report loads.',
        'Script deployments and subscriptions with ReportingServicesTools for CI/CD.',
      ],
    },
    {
      title: 'Monitoring & Performance Tuning',
      after: 'Subscriptions, Caching & Snapshots',
      content: `The report server logs every execution in the catalog view **\`ExecutionLog3\`** (ReportServer database). Its time split tells you where to optimise:

| Column | Meaning | If high… |
|---|---|---|
| \`TimeDataRetrieval\` | running dataset queries (ms) | tune SQL: indexes, fewer columns, aggregate earlier |
| \`TimeProcessing\` | grouping, sorting, expressions | move logic to SQL, avoid subreports, fewer groups |
| \`TimeRendering\` | producing HTML/PDF/Excel | reduce pages, images, complex layout |
| \`Status\` | \`rsSuccess\` or error code | investigate failures |
| \`ByteCount\`, \`RowCount\` | output size | huge exports → paginate or use a data extract |
| \`Source\` | Live, Cache, Snapshot, History | is caching working? |

Also watch the report server log files (\`LogFiles\` folder) and keep the **ReportServerTempDB** healthy.`,
      code: `-- Sample of ExecutionLog3 (in SQL Server query ReportServer.dbo.ExecutionLog3 directly)
CREATE TABLE ExecutionLog3 (
  ItemPath TEXT, UserName TEXT, Format TEXT, Source TEXT, Status TEXT,
  TimeStart TEXT, TimeDataRetrieval INTEGER, TimeProcessing INTEGER, TimeRendering INTEGER, RowCount INTEGER
);
INSERT INTO ExecutionLog3 VALUES
 ('/Sales/Monthly Sales','CORP\\ana','RPL','Live','rsSuccess','2026-10-20 08:01',4200,800,300,12000),
 ('/Sales/Monthly Sales','CORP\\ben','PDF','Live','rsSuccess','2026-10-20 08:05',3900,750,2100,12000),
 ('/Sales/Monthly Sales','CORP\\cy','RPL','Cache','rsSuccess','2026-10-20 08:07',0,0,280,12000),
 ('/Finance/Ledger','CORP\\dee','EXCELOPENXML','Live','rsSuccess','2026-10-20 09:00',900,9100,5200,250000),
 ('/Finance/Ledger','CORP\\dee','EXCELOPENXML','Live','rsProcessingAborted','2026-10-20 09:20',950,0,0,0),
 ('/HR/Headcount','CORP\\eve','RPL','Live','rsSuccess','2026-10-21 10:00',120,60,90,300);

-- Slowest reports and where the time goes (T-SQL: add TOP (10) and use WHERE TimeStart >= DATEADD(day,-30,GETDATE()))
SELECT ItemPath,
       COUNT(*)                                        AS Runs,
       SUM(Status <> 'rsSuccess')                      AS Failures,
       ROUND(AVG(TimeDataRetrieval + TimeProcessing + TimeRendering) / 1000.0, 1) AS AvgSeconds,
       ROUND(AVG(TimeDataRetrieval) / 1000.0, 1)       AS AvgDataSec,
       ROUND(AVG(TimeProcessing) / 1000.0, 1)          AS AvgProcessingSec,
       ROUND(AVG(TimeRendering) / 1000.0, 1)           AS AvgRenderSec,
       ROUND(100.0 * SUM(Source = 'Cache') / COUNT(*)) AS CacheHitPct,
       MAX(RowCount)                                   AS MaxRows
FROM ExecutionLog3
WHERE TimeStart >= '2026-10-01'
GROUP BY ItemPath
ORDER BY AvgSeconds DESC
LIMIT 10;`,
      codeLabel: 'Finding slow reports from the execution log',
      codeLanguage: 'sql',
      keyPoints: [
        '`ExecutionLog3` splits time into data retrieval, processing and rendering.',
        'High data time → tune SQL; high processing → simplify the report; high rendering → simplify layout/export.',
        'Track failures and cache hit rates per report.',
        'Review the log regularly to find reports worth caching or redesigning.',
      ],
    },
  ],
};

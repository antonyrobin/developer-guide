/*
 * ETL course extension — extra sections and worked examples merged into
 * courses-data/etl.js at load time. Python examples use only the standard
 * library (csv, json, sqlite3) so they run anywhere with `python etl.py`;
 * the same ideas map directly onto pandas, SSIS data flows or Talend jobs.
 */

const RAW_CSV = `RAW_CSV = """order_id,customer,email,amount,currency,ordered_at
1001,Ana Silva, ANA@EXAMPLE.COM ,120.50,EUR,2026-03-01
1002,Ben Ode,ben@example.com,80,usd,2026-03-01
1003,,cy@example.com,45.00,EUR,2026-03-02
1004,Dee Park,dee@example,-5,EUR,2026-03-02
1002,Ben Ode,ben@example.com,80,usd,2026-03-01
1005,Eli Moss,eli@example.com,300.00,GBP,03/04/2026
"""
`;

export default {
  examples: {
    'Introduction to ETL': [
      {
        title: 'A complete mini ETL job in 30 lines',
        language: 'python',
        explanation: 'Extract a CSV, transform (clean, convert currency, drop bad rows), load into SQLite, then query the result. Each stage is a plain function so it can be tested on its own.',
        code: `import csv, io, sqlite3

SOURCE = """id,name,amount,currency
1,Ana,100,EUR
2,Ben,50,USD
3,Cy,abc,EUR
"""
RATES = {"EUR": 1.0, "USD": 0.92}

def extract(text):
    return list(csv.DictReader(io.StringIO(text)))

def transform(rows):
    for r in rows:
        try:
            amount = float(r["amount"]) * RATES[r["currency"]]
        except (ValueError, KeyError):
            print("rejected:", r)
            continue
        yield (int(r["id"]), r["name"].strip(), round(amount, 2))

def load(records, conn):
    conn.execute("CREATE TABLE IF NOT EXISTS sales (id INTEGER PRIMARY KEY, name TEXT, amount_eur REAL)")
    conn.executemany("INSERT OR REPLACE INTO sales VALUES (?, ?, ?)", records)
    conn.commit()

conn = sqlite3.connect(":memory:")
load(transform(extract(SOURCE)), conn)
print(conn.execute("SELECT * FROM sales").fetchall())`,
        output: `rejected: {'id': '3', 'name': 'Cy', 'amount': 'abc', 'currency': 'EUR'}
[(1, 'Ana', 100.0), (2, 'Ben', 46.0)]`,
      },
    ],
  },

  sections: [
    {
      title: 'ETL vs ELT & Pipeline Architecture',
      after: 'Introduction to ETL',
      content: `| | ETL | ELT |
|---|---|---|
| Where transforms run | integration server (SSIS, Talend, Python) | inside the warehouse (SQL, dbt) |
| Load raw data? | no — only cleaned data | yes, into a staging/raw layer |
| Best for | on-prem DBs, strict schemas, sensitive data masking | cloud warehouses (Snowflake, BigQuery, Synapse) |
| Re-processing | re-extract from source | re-run SQL on stored raw data |

### Layered (medallion) design

1. **Raw / Bronze** — data exactly as extracted, plus load metadata (\`_loaded_at\`, \`_source_file\`).
2. **Staging / Silver** — typed, de-duplicated, validated.
3. **Mart / Gold** — business-ready facts and dimensions for reporting.

### Pipeline properties to design for

- **Idempotent** — re-running a batch produces the same result (upserts, partition overwrite).
- **Incremental** — process only new/changed data using a watermark.
- **Observable** — row counts in/out, rejects, duration, alerts.
- **Restartable** — failed step can be retried without duplicating data.`,
      code: `from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Callable

@dataclass
class StepResult:
    name: str
    rows_in: int
    rows_out: int
    seconds: float

@dataclass
class Pipeline:
    name: str
    steps: list[tuple[str, Callable[[list], list]]] = field(default_factory=list)

    def step(self, name):
        def register(fn):
            self.steps.append((name, fn))
            return fn
        return register

    def run(self, data):
        results = []
        for name, fn in self.steps:
            start = datetime.now(timezone.utc)
            out = fn(data)
            secs = (datetime.now(timezone.utc) - start).total_seconds()
            results.append(StepResult(name, len(data), len(out), round(secs, 4)))
            data = out
        return data, results

p = Pipeline("orders")

@p.step("dedupe")
def dedupe(rows):
    return list({r["id"]: r for r in rows}.values())

@p.step("valid_amounts")
def valid(rows):
    return [r for r in rows if r["amount"] > 0]

data, report = p.run([{"id": 1, "amount": 5}, {"id": 1, "amount": 5}, {"id": 2, "amount": -1}])
print(data)
for r in report:
    print(f"{r.name:<14} in={r.rows_in} out={r.rows_out}")`,
      codeLabel: 'Pipeline skeleton with per-step row counts',
      keyPoints: [
        'ETL transforms before loading; ELT loads raw data and transforms in the warehouse.',
        'Keep raw, staging and mart layers separate so you can reprocess safely.',
        'Design every job to be idempotent and restartable.',
        'Record rows in/out per step — it is the cheapest observability you can add.',
      ],
    },
    {
      title: 'Extract: Files, APIs & Databases',
      after: 'ETL vs ELT & Pipeline Architecture',
      content: `Common sources and how to read them robustly:

| Source | Python | Watch out for |
|---|---|---|
| CSV | \`csv.DictReader\`, \`pandas.read_csv\` | delimiters, quotes, encodings (\`utf-8-sig\` for BOM) |
| JSON / JSON Lines | \`json.load\`, line-by-line \`json.loads\` | nested objects → flatten |
| REST API | \`requests\` / \`httpx\` | pagination, rate limits, retries |
| Database | DB-API cursor, SQLAlchemy | fetch in chunks; read from a replica |
| Excel | \`openpyxl\`, \`pandas.read_excel\` | merged cells, header rows |

### Extract rules of thumb

- **Stream** large files instead of loading them fully — generators keep memory flat.
- Keep the raw copy (file or table) so you can replay transforms.
- Capture **metadata**: source name, extract time, row count, checksum.
- For APIs, follow \`next\` links / cursors until exhausted and back off on HTTP 429.`,
      code: `import csv, io, json, hashlib, time

CSV_TEXT = "\\ufeffid;name;city\\n1;Ana;Lisbon\\n2;\\"Ode, Ben\\";Berlin\\n"
JSONL = '{"id": 1, "user": {"name": "Ana", "tags": ["vip"]}}\\n{"id": 2, "user": {"name": "Ben", "tags": []}}\\n'

def read_csv(text, delimiter=";"):
    text = text.lstrip("\\ufeff")                       # strip byte-order mark
    yield from csv.DictReader(io.StringIO(text), delimiter=delimiter)

def read_jsonl(text):
    for line_no, line in enumerate(text.splitlines(), 1):
        if line.strip():
            yield line_no, json.loads(line)

def flatten(obj, prefix=""):
    out = {}
    for k, v in obj.items():
        key = f"{prefix}{k}"
        if isinstance(v, dict):
            out.update(flatten(v, key + "_"))
        else:
            out[key] = ",".join(v) if isinstance(v, list) else v
    return out

def fetch_all_pages(fetch_page):
    """Generic cursor pagination with retry/backoff."""
    cursor, attempt = None, 0
    while True:
        try:
            page = fetch_page(cursor)
        except ConnectionError:
            attempt += 1
            time.sleep(min(2 ** attempt, 30) / 100)        # scaled down for the demo
            continue
        yield from page["items"]
        cursor = page.get("next")
        if not cursor:
            break

print(list(read_csv(CSV_TEXT)))
print([flatten(rec) for _, rec in read_jsonl(JSONL)])

PAGES = {None: {"items": [1, 2], "next": "p2"}, "p2": {"items": [3], "next": None}}
calls = {"n": 0}
def fake_api(cursor):
    calls["n"] += 1
    if calls["n"] == 2:
        raise ConnectionError("flaky")
    return PAGES[cursor]
print(list(fetch_all_pages(fake_api)), "calls:", calls["n"])
print("checksum:", hashlib.sha256(CSV_TEXT.encode()).hexdigest()[:12])`,
      codeLabel: 'CSV with BOM, JSON Lines flattening, paginated API with retry',
      keyPoints: [
        'Use generators to stream large inputs instead of reading everything into memory.',
        'Handle encodings and BOMs explicitly — they are the #1 CSV surprise.',
        'Flatten nested JSON into columns before loading into tables.',
        'Paginate APIs until no cursor remains and retry transient failures with backoff.',
      ],
    },
    {
      title: 'Transform: Cleaning & Standardising Data',
      after: 'Extract: Files, APIs & Databases',
      content: `Typical transformations, in the order they usually run:

| Step | Example |
|---|---|
| Trim & normalise | \`" ANA@X.COM "\` → \`"ana@x.com"\` |
| Type conversion | \`"120.50"\` → \`Decimal("120.50")\`, mixed date formats → ISO dates |
| Standardise codes | \`usd\` → \`USD\`, \`"M"/"Male"\` → \`M\` |
| De-duplicate | keep latest per business key |
| Validate | required fields, ranges, formats → **reject** bad rows with a reason |
| Enrich / derive | currency conversion, lookups, \`order_month\` |

### Reject, don't drop

Send invalid rows to a **reject/quarantine** table with the error so someone can fix the source. Silently dropping rows hides data problems.

Use \`Decimal\` for money — floats cannot represent \`0.1\` exactly.`,
      code: RAW_CSV + `import csv, io, re
from datetime import datetime
from decimal import Decimal, InvalidOperation

RATES = {"EUR": Decimal("1"), "USD": Decimal("0.92"), "GBP": Decimal("1.17")}
EMAIL = re.compile(r"^[^@\\s]+@[^@\\s]+\\.[a-z]{2,}$")

def parse_date(value):
    for fmt in ("%Y-%m-%d", "%m/%d/%Y", "%d.%m.%Y"):
        try:
            return datetime.strptime(value.strip(), fmt).date()
        except ValueError:
            pass
    raise ValueError(f"bad date {value!r}")

def clean(row):
    errors = []
    email = row["email"].strip().lower()
    if not EMAIL.match(email):
        errors.append("invalid email")
    if not row["customer"].strip():
        errors.append("missing customer")
    try:
        amount = Decimal(row["amount"])
        if amount <= 0:
            errors.append("amount must be > 0")
    except InvalidOperation:
        errors.append("amount not numeric")
        amount = None
    currency = row["currency"].strip().upper()
    if currency not in RATES:
        errors.append(f"unknown currency {currency}")
    try:
        ordered = parse_date(row["ordered_at"])
    except ValueError as e:
        errors.append(str(e))
    if errors:
        return None, errors
    return {
        "order_id": int(row["order_id"]),
        "customer": row["customer"].strip().title(),
        "email": email,
        "amount_eur": (amount * RATES[currency]).quantize(Decimal("0.01")),
        "order_date": ordered.isoformat(),
        "order_month": ordered.strftime("%Y-%m"),
    }, []

good, rejects, seen = [], [], set()
for raw in csv.DictReader(io.StringIO(RAW_CSV)):
    if raw["order_id"] in seen:
        rejects.append((raw["order_id"], ["duplicate"]))
        continue
    seen.add(raw["order_id"])
    row, errs = clean(raw)
    (good.append(row) if row else rejects.append((raw["order_id"], errs)))

for g in good:
    print(g)
print("rejects:", rejects)`,
      codeLabel: 'Clean, validate, de-duplicate and reject with reasons',
      keyPoints: [
        'Normalise text, types and codes before applying business rules.',
        'Quarantine invalid rows with error reasons instead of silently dropping them.',
        'De-duplicate on the business key, not the whole row.',
        'Use `Decimal` for currency and ISO-8601 for dates.',
      ],
    },
    {
      title: 'Load: Bulk Inserts & Upserts',
      after: 'Transform: Cleaning & Standardising Data',
      content: `Loading strategies:

| Strategy | When | SQL pattern |
|---|---|---|
| **Full refresh** | small tables | \`TRUNCATE\` + insert (in a transaction) |
| **Append** | immutable events/logs | \`INSERT\` only |
| **Upsert / merge** | dimensions, changing records | \`INSERT … ON CONFLICT DO UPDATE\` / \`MERGE\` |
| **Partition swap** | large fact tables | load a partition, then switch it in |

### Performance

- Insert in **batches** (\`executemany\`, \`COPY\`, \`BULK INSERT\`, SSIS *fast load*) — never row by row with a commit each.
- Load into a **staging table** first, then merge into the target in one set-based statement.
- Disable/rebuild non-clustered indexes for very large loads.
- Wrap each batch in a transaction so a failure leaves no half-loaded data.`,
      code: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE dim_customer (
    customer_id INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    city TEXT,
    updated_at TEXT
);
CREATE TABLE stg_customer (customer_id INTEGER, email TEXT, city TEXT);
INSERT INTO dim_customer VALUES (1, 'ana@example.com', 'Lisbon', '2026-01-01'),
                                (2, 'ben@example.com', 'Berlin', '2026-01-01');
""")

batch = [(2, "ben@example.com", "Munich"),   # changed
         (3, "cy@example.com", "Paris"),     # new
         (1, "ana@example.com", "Lisbon")]   # unchanged

with conn:                                   # one transaction for the batch
    conn.execute("DELETE FROM stg_customer")
    conn.executemany("INSERT INTO stg_customer VALUES (?, ?, ?)", batch)
    cur = conn.execute("""
        INSERT INTO dim_customer (customer_id, email, city, updated_at)
        SELECT customer_id, email, city, date('now') FROM stg_customer WHERE true
        ON CONFLICT (customer_id) DO UPDATE SET
            email = excluded.email,
            city = excluded.city,
            updated_at = excluded.updated_at
        WHERE dim_customer.city IS NOT excluded.city
           OR dim_customer.email IS NOT excluded.email
    """)
    print("rows inserted/updated:", cur.rowcount)

for row in conn.execute("SELECT customer_id, city, updated_at > '2026-01-01' AS touched FROM dim_customer"):
    print(row)`,
      codeLabel: 'Stage, then set-based upsert in one transaction',
      keyPoints: [
        'Batch inserts and commit per batch, not per row.',
        'Load into staging, then merge into the target with one set-based statement.',
        'Only update rows that actually changed to keep audit columns meaningful.',
        'Transactions make a failed load roll back cleanly.',
      ],
    },
    {
      title: 'Incremental Loads & Change Data Capture',
      after: 'Load: Bulk Inserts & Upserts',
      content: `Re-reading a whole source every run does not scale. Incremental techniques:

| Technique | How it works | Caveat |
|---|---|---|
| **High-watermark** | \`WHERE updated_at > :last_watermark\` | needs a reliable \`updated_at\`; misses hard deletes |
| **Rowversion / sequence** | monotonically increasing column | DB-specific |
| **CDC** | read the DB transaction log (SQL Server CDC, Debezium) | infrastructure to run |
| **Snapshot diff** | compare today's full extract with yesterday's | expensive but catches deletes |

### Watermark rules

- Store the watermark in a **control table**, updated in the same transaction as the load.
- Use the **max value actually loaded**, not "now", to avoid gaps with clock skew.
- Allow a small **overlap window** and rely on idempotent upserts to absorb re-reads.`,
      code: `import sqlite3

src = sqlite3.connect(":memory:")
src.executescript("""
CREATE TABLE orders (id INTEGER PRIMARY KEY, total REAL, updated_at TEXT);
INSERT INTO orders VALUES (1, 10, '2026-03-01T10:00'), (2, 20, '2026-03-01T11:00');
""")
dwh = sqlite3.connect(":memory:")
dwh.executescript("""
CREATE TABLE fact_orders (id INTEGER PRIMARY KEY, total REAL, updated_at TEXT);
CREATE TABLE etl_control (job TEXT PRIMARY KEY, watermark TEXT);
INSERT INTO etl_control VALUES ('orders', '1970-01-01T00:00');
""")

def run_incremental():
    (wm,) = dwh.execute("SELECT watermark FROM etl_control WHERE job='orders'").fetchone()
    rows = src.execute("SELECT id, total, updated_at FROM orders WHERE updated_at > ? ORDER BY updated_at",
                       (wm,)).fetchall()
    if not rows:
        print("nothing new since", wm)
        return
    with dwh:   # load + watermark move together
        dwh.executemany("INSERT INTO fact_orders VALUES (?, ?, ?) "
                        "ON CONFLICT(id) DO UPDATE SET total=excluded.total, updated_at=excluded.updated_at", rows)
        dwh.execute("UPDATE etl_control SET watermark=? WHERE job='orders'", (rows[-1][2],))
    print(f"loaded {len(rows)} rows, watermark -> {rows[-1][2]}")

run_incremental()                                         # initial load
run_incremental()                                         # no changes
src.execute("UPDATE orders SET total=25, updated_at='2026-03-02T09:00' WHERE id=2")
src.execute("INSERT INTO orders VALUES (3, 30, '2026-03-02T09:30')")
run_incremental()                                         # only the delta
print(dwh.execute("SELECT * FROM fact_orders").fetchall())`,
      codeLabel: 'High-watermark incremental load with a control table',
      keyPoints: [
        'Incremental loads read only rows changed since the last successful run.',
        'Persist the watermark in a control table, committed with the data.',
        'Watermarks miss hard deletes — use CDC or snapshot diffs if deletes matter.',
        'Idempotent upserts make overlapping windows safe.',
      ],
    },
    {
      title: 'Slowly Changing Dimensions (SCD)',
      after: 'Incremental Loads & Change Data Capture',
      content: `Dimensions change over time (a customer moves city). SCD types define how history is kept:

| Type | Behaviour | Use when |
|---|---|---|
| **0** | never change | fixed attributes (birth date) |
| **1** | overwrite | corrections, no history needed |
| **2** | new row per change with \`valid_from\` / \`valid_to\` / \`is_current\` | reports must reflect history ("sales by city at the time") |
| **3** | keep previous value in an extra column | only one level of history |

### SCD Type 2 load steps

1. Find incoming rows whose tracked attributes differ from the **current** row.
2. **Expire** the current row (\`valid_to = load_date\`, \`is_current = 0\`).
3. **Insert** a new current row with a new surrogate key.
4. Insert brand-new business keys as current rows.

Facts reference the **surrogate key**, so old sales stay attached to the old city.`,
      code: `-- SCD Type 2 with SQLite (MERGE in SQL Server / Snowflake does the same in one statement)
CREATE TABLE dim_customer (
  sk INTEGER PRIMARY KEY AUTOINCREMENT,     -- surrogate key
  customer_id INTEGER, city TEXT,
  valid_from TEXT, valid_to TEXT, is_current INTEGER
);
CREATE TABLE stg_customer (customer_id INTEGER, city TEXT);

INSERT INTO dim_customer (customer_id, city, valid_from, valid_to, is_current) VALUES
  (1, 'Lisbon', '2025-01-01', '9999-12-31', 1),
  (2, 'Berlin', '2025-01-01', '9999-12-31', 1);
INSERT INTO stg_customer VALUES (1, 'Porto'), (2, 'Berlin'), (3, 'Paris');

-- 1+2: expire current rows whose tracked attribute changed
UPDATE dim_customer
SET valid_to = '2026-03-01', is_current = 0
WHERE is_current = 1
  AND EXISTS (SELECT 1 FROM stg_customer s
              WHERE s.customer_id = dim_customer.customer_id AND s.city <> dim_customer.city);

-- 3+4: insert new versions and brand-new customers
INSERT INTO dim_customer (customer_id, city, valid_from, valid_to, is_current)
SELECT s.customer_id, s.city, '2026-03-01', '9999-12-31', 1
FROM stg_customer s
LEFT JOIN dim_customer d ON d.customer_id = s.customer_id AND d.is_current = 1
WHERE d.sk IS NULL;

SELECT sk, customer_id, city, valid_from, valid_to, is_current
FROM dim_customer ORDER BY customer_id, valid_from;`,
      codeLabel: 'Expire-and-insert SCD Type 2',
      codeLanguage: 'sql',
      keyPoints: [
        'Type 1 overwrites; Type 2 keeps full history with validity ranges.',
        'Type 2 dimensions need a surrogate key separate from the business key.',
        'Expire the current row, then insert the new version, in one transaction.',
        'Point-in-time queries filter on `valid_from <= date < valid_to`.',
      ],
    },
    {
      title: 'Data Quality Checks',
      after: 'Slowly Changing Dimensions (SCD)',
      content: `Run automated checks after each load and **fail the pipeline** (or alert) when they break.

| Check | Example rule |
|---|---|
| Completeness | \`email IS NOT NULL\` for ≥ 99% of rows |
| Uniqueness | no duplicate \`order_id\` |
| Validity | \`amount > 0\`, \`status IN (...)\` |
| Referential integrity | every \`fact.customer_sk\` exists in the dimension |
| Freshness | newest \`loaded_at\` < 2 hours old |
| Volume | row count within ±30% of the 7-day average |
| Reconciliation | source total = target total |

Tools: **Great Expectations**, **dbt tests** (\`unique\`, \`not_null\`, \`relationships\`), **Soda**, or plain SQL like below.`,
      code: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE dim_customer (sk INTEGER PRIMARY KEY, email TEXT);
CREATE TABLE fact_sales (id INTEGER, customer_sk INTEGER, amount REAL);
INSERT INTO dim_customer VALUES (1, 'a@x.com'), (2, NULL);
INSERT INTO fact_sales VALUES (1, 1, 10), (2, 2, 25), (2, 2, 25), (3, 9, -4);
""")

CHECKS = {
    "fact_sales.id is unique":
        "SELECT COUNT(*) FROM (SELECT id FROM fact_sales GROUP BY id HAVING COUNT(*) > 1)",
    "fact_sales.amount > 0":
        "SELECT COUNT(*) FROM fact_sales WHERE amount <= 0",
    "fact_sales.customer_sk exists in dim_customer":
        "SELECT COUNT(*) FROM fact_sales f LEFT JOIN dim_customer d ON d.sk = f.customer_sk WHERE d.sk IS NULL",
    "dim_customer.email not null":
        "SELECT COUNT(*) FROM dim_customer WHERE email IS NULL",
}

failures = 0
for name, sql in CHECKS.items():
    (bad,) = conn.execute(sql).fetchone()
    status = "PASS" if bad == 0 else f"FAIL ({bad} rows)"
    failures += bad > 0
    print(f"{status:<14} {name}")

src_total, tgt_total = 60.0, conn.execute("SELECT SUM(amount) FROM fact_sales").fetchone()[0]
print("reconciliation:", "PASS" if abs(src_total - tgt_total) < 0.01 else f"FAIL {src_total} vs {tgt_total}")
print("pipeline status:", "FAILED" if failures else "OK")`,
      codeLabel: 'SQL-based quality gate after a load',
      keyPoints: [
        'Express each rule as a query that counts violating rows.',
        'Check uniqueness, nulls, ranges, referential integrity, freshness and volume.',
        'Reconcile totals between source and target for financial data.',
        'Fail or alert the pipeline — a silent bad load is worse than a late one.',
      ],
    },
    {
      title: 'Orchestration & Scheduling',
      after: 'Compilation & Execution',
      content: `An orchestrator runs jobs on a schedule, in dependency order, with retries and alerting.

| Tool | Notes |
|---|---|
| **SQL Server Agent** | schedules SSIS packages and T-SQL jobs |
| **Apache Airflow** | Python DAGs, rich operators, backfills |
| **Azure Data Factory / Synapse** | managed pipelines, copy activities, triggers |
| **Prefect / Dagster** | Python-native, strong typing and observability |
| **cron + scripts** | fine for one or two simple jobs |

### What a good schedule needs

- **Dependencies** — load dimensions before facts.
- **Retries with backoff** for transient failures; **alerts** on final failure.
- **Parameterised run dates** so you can **backfill** a past day.
- **Idempotent tasks** so retries and backfills are safe.
- **SLAs** — alert if a job hasn't finished by a deadline.`,
      code: `# dags/daily_sales.py — Apache Airflow 2.x DAG (TaskFlow API)
from datetime import datetime, timedelta
from airflow.decorators import dag, task

default_args = {"retries": 3, "retry_delay": timedelta(minutes=5), "email_on_failure": True}

@dag(schedule="0 2 * * *", start_date=datetime(2026, 1, 1), catchup=False,
     default_args=default_args, tags=["sales"])
def daily_sales():

    @task
    def extract(ds=None):                  # ds = logical run date, enables backfills
        return f"s3://raw/sales/{ds}.csv"

    @task
    def transform(path: str) -> str:
        print("cleaning", path)
        return path.replace("raw", "staging")

    @task
    def load_dimensions(): ...

    @task
    def load_facts(path: str): ...

    @task
    def quality_checks(): ...

    staged = transform(extract())
    load_dimensions() >> load_facts(staged) >> quality_checks()

daily_sales()`,
      codeLabel: 'Airflow DAG with retries and dependencies',
      codeLanguage: 'python',
      keyPoints: [
        'Orchestrators handle scheduling, dependencies, retries and alerts.',
        'Pass the logical run date into tasks so backfills reprocess the right data.',
        'Load dimensions before facts and run quality checks last.',
        'Retries are only safe when tasks are idempotent.',
      ],
    },
  ],
};

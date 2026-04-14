export const ssrsCourse = {
  id: 'ssrs',
  title: 'SSRS Report Development',
  description: 'SQL Server Reporting Services for creating, deploying, and managing enterprise reports.',
  icon: 'Database',
  category: 'Databases',
  sections: [
    {
      id: 'ssrs-intro',
      title: 'Introduction to SSRS',
      image: '/images/courses/ssrs_1776186131197.png',
      content: `SQL Server Reporting Services (SSRS) is a server-based report generating software system from Microsoft. It provides a set of on-premises tools and services to create, deploy, and manage mobile and paginated reports.`
    },
    {
      id: 'ssrs-setup',
      title: 'Installation & Setup',
      content: `### Installation Requirements
1. **SQL Server Engine:** Acts as the backend for report data.
2. **SSRS Service:** Download and install SQL Server Reporting Services.
3. **Report Builder / SSDT:** Install SQL Server Data Tools (SSDT) through Visual Studio or download the standalone MS Report Builder.

### Configuration
1. Open up **Reporting Services Configuration Manager**.
2. Configure **Service Account** and **Web Service URL**.
3. Create a Report Server database using the **Database** tab.
4. Set up the **Web Portal URL** for user access.`
    },
    {
      id: 'ssrs-creation',
      title: 'Report Creation Process',
      content: `### Step-by-Step
1. **Data Source:** Define a connection to a database (e.g., standard SQL connection string).
2. **Dataset:** Write a SQL query or call a Stored Procedure to fetch structured data.
3. **Design:** Map dataset fields directly onto tables, matrices, or charts.
4. **Parameters:** Introduce query parameters to allow users to filter report dynamically (e.g., \`WHERE OrderDate >= @StartDate\`).`
    },
    {
      id: 'ssrs-example',
      title: 'Example Query Configuration',
      content: `### Dealing with Procedures
When using Stored Procedures in SSRS:
\`\`\`sql
CREATE PROCEDURE GetSalesByRegion
    @RegionName VARCHAR(50)
AS
BEGIN
    SELECT RegionName, TotalSales, OrderDate 
    FROM Sales
    WHERE RegionName = @RegionName
END
\`\`\`
In SSRS, map the dataset query type to "Stored Procedure", pick \`GetSalesByRegion\`, and SSRS will automatically detect \`@RegionName\` as a report parameter.`
    },
    {
      id: 'ssrs-deployment',
      title: 'Deployment & Configuration',
      content: `### Deploying the Project
1. In Visual Studio (SSDT), go to project **Properties**.
2. Set \`TargetServerURL\` to your Reporting Services Web Service URL (e.g., \`http://machine/ReportServer\`).
3. Set default deployment folders.
4. Right-click the project and select **Deploy**.

### Execution & Subscriptions
Deployed reports are accessible via the Web Portal URL. SSRS allows you to schedule Data Driven Subscriptions and automatically email exported reports (PDF, Excel) periodically.`
    }
  ]
};

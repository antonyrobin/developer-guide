export const etlCourse = {
  id: 'etl',
  title: 'ETL - Talend & SSIS',
  description: 'Extract, Transform, Load processes using Talend Open Studio and MS SSIS.',
  icon: 'GitMerge',
  category: 'Databases',
  sections: [
    {
      id: 'etl-intro',
      title: 'Introduction to ETL',
      image: '/images/courses/etl_1776186157797.png',
      content: `ETL (Extract, Transform, Load) refers to collecting data from multiple systems, standardizing/cleaning it, and pushing it into a Central Data Warehouse or Data Lake. 
- **SSIS** (SQL Server Integration Services) is Microsoft's primary ETL tool.
- **Talend** (Open Studio / DI) is an open-source data integration platform utilizing Java under the hood.`
    },
    {
      id: 'etl-ssis',
      title: 'SQL Server Integration Services (SSIS)',
      content: `### Setup
Install SQL Server Data Tools (SSDT) via Visual Studio installer and include 'Integration Services'.

### Key Concepts
- **Control Flow:** The orchestrator loop (e.g., Execute SQL Task, For Loop Container).
- **Data Flow:** The actual data pipeline mapping source to destination (e.g., OLE DB Source -> Data Conversion -> OLE DB Destination).

### Deployment
SSIS Projects map out to \`.ispac\` files, which are then deployed to the **SSISDB Catalog** on SQL Server.`
    },
    {
      id: 'etl-talend',
      title: 'Talend Open Studio',
      content: `### Setup
Download Talend Open Studio (TOS) for Data Integration. Requires JDK installed and explicitly configured inside TOS.

### Key Concepts
- **Job:** A standalone program that executes ETL tasks.
- **Components:** Built-in connectors (e.g., \`tFileInputDelimited\`, \`tMap\`, \`tMysqlOutput\`).
- **tMap:** Central mapping component used to join inputs, transform fields via expressions, and map to outputs.

### Example Workflow
1. Read a CSV using \`tFileInputDelimited\`.
2. Connect to \`tMap\`. Convert strings to Upper Case.
3. Pipe transformed data to \`tPostgresqlOutput\`.`
    },
    {
      id: 'etl-comparison',
      title: 'Compilation & Execution',
      content: `### SSIS Execution
- Visual Studio tests are run interactively. 
- Using **SQL Server Agent**, packages are scheduled on configured frequencies.

### Talend Compilation
- Talend generates native Java code under the hood. 
- Building a Job produces a standalone zip with \`.bat\`/\`.sh\` scripts and \`.jar\` artifacts. Standard cron jobs or enterprise schedulers can trigger this without installing Talend on servers.`
    }
  ]
};

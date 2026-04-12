export const jmeterCourse = {
  id: 'jmeter',
  title: 'Apache JMeter',
  description: 'Performance and Load Testing for Web Apps and APIs.',
  icon: 'BarChart3',
  category: 'Testing',
  sections: [
    {
      id: 'jmeter-intro',
      title: 'Introduction to JMeter',
      content: `Apache JMeter is a popular open-source tool designed to load test functional behavior and measure performance. It can be used to test static and dynamic resources, Web dynamic applications, and APIs.

### Key Applications:
- **Load Testing:** Simulating heavy loads.
- **Stress Testing:** Finding the breaking point of the system.
- **Spike Testing:** Sudden increase in users.
- **Database Testing:** Testing JDBC queries.`,
      image: '/artifacts/jmeter_logo_1775988793048.png'
    },
    {
      id: 'jmeter-setup',
      title: 'Installation & Setup',
      content: `### 1. Install Java
JMeter is a 100% Java application. Ensure Java 8 or higher is installed.

### 2. Download JMeter
Download the latest binaries (.zip or .tgz) from the Apache JMeter website.

### 3. Launching
Extract the files and navigate to the \`bin\` directory. Run \`jmeter.bat\` (Windows) or \`jmeter.sh\` (Linux/macOS).`
    },
    {
      id: 'jmeter-api-testing',
      title: 'API Testing Flow',
      content: `### Manual API Setup
1. **Thread Group:** Right-click Plan -> Add -> Threads -> Thread Group.
2. **HTTP Request:** Add -> Sampler -> HTTP Request. Enter Server Name/IP and Path.
3. **Listeners:** Add -> Listener -> View Results Tree to see response data.

### Generate from Network Tab (HAR)
1. Open Browser Dev Tools -> Network tab.
2. Refresh page or trigger actions.
3. Right-click any request -> **Save all as HAR with content**.
4. Use a tool online or a JMeter plugin to convert HAR to .jmx file.`
    },
    {
      id: 'jmeter-reports',
      title: 'Generating HTML Reports',
      content: `While JMeter provides real-time listeners, a professional HTML report is better for analysis.

### Command Line Execution
Run your test without GUI for better performance:
\`\`\`bash
jmeter -n -t your_test_plan.jmx -l results.jtl -e -o ./report-folder
\`\`\`

- \`-n\`: Non-GUI mode.
- \`-t\`: Location of JMX file.
- \`-l\`: Output JTL file.
- \`-e\`: Generate report dashboard.
- \`-o\`: Output folder.`,
      image: '/artifacts/jmeter_report_1775988812071.png'
    },
    {
      id: 'jmeter-db-testing',
      title: 'Stored Procedure Testing (JDBC)',
      content: `### Configuration
1. **Download JDBC Driver:** Add your DB driver (.jar) to JMeter's \`lib\` folder.
2. **JDBC Connection Configuration:** Add -> Config Element -> JDBC Connection Configuration. Enter URL and credentials.
3. **JDBC Request:** Add -> Sampler -> JDBC Request.
   - Set **Query Type** to "Callable Statement".
   - Enter query: \`{call procedure_name(?, ?)}\`
   - Set Parameter values and types.`
    },
    {
      id: 'jmeter-best-practices',
      title: 'Best Practices',
      content: `### Do's
- Run load tests in **CLI mode** to save resources.
- Use **CSV Data Set Config** for parameterized testing.
- Increase Heap Size in the JMeter startup script for large tests.

### Don'ts
- Don't use heavy listeners (like View Results Tree) during high-load tests.
- Don't run JMeter on the same server as the application under test.
- Don't forget to clear cookies/cache between iterations if needed.`
    }
  ]
};

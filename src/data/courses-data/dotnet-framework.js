export const dotnetFrameworkCourse = {
  id: 'dotnet-framework',
  title: '.NET Framework (Legacy & Enterprise)',
  description: 'Development platform for building windows-based web and desktop applications.',
  icon: 'Codepen',
  category: 'Backend Frameworks',
  sections: [
    {
      id: 'dotnet-intro',
      title: 'Introduction to .NET Framework',
      image: '/images/courses/dotnet_framework_1776186270622.png',
      content: `.NET Framework is a software development framework for building and running applications on Windows. It includes a large class library, common language runtime (CLR), and support for multiple programming languages like C#, F#, and VB.NET.`
    },
    {
      id: 'aspnet-webforms',
      title: 'ASP.NET Web Applications',
      content: `ASP.NET provides several models for building web applications:
- **Web Forms:** Component-based model for building dynamic websites.
- **MVC (Model-View-Controller):** Pattern-based way to build dynamic websites that gives you full control over markup.`
    },
    {
      id: 'wcf-threading',
      title: 'WCF & Multi-threading',
      content: `### WCF (Windows Communication Foundation)
A framework for building service-oriented applications. It allows sending data as asynchronous messages from one service endpoint to another.

### Multi-threading
.NET provides robust support for multi-threading via the \`System.Threading\` namespace.
\`\`\`csharp
Thread t = new Thread(new ThreadStart(MyMethod));
t.Start();
\`\`\``
    },
    {
      id: 'linq-best-practices',
      title: '12 Best Practices for LINQ',
      content: `**LINQ (Language Integrated Query)** is a powerful tool, but misuse can lead to performance bottlenecks and unreadable code. Follow these best practices for efficient data querying.\n\n### Core Best Practices\n\n1. **Filter Early**: Use \`Where()\` first to reduce items before performing expensive operations.\n2. **Project only what you need**: Use \`Select()\` to retrieve only specific fields rather than full objects.\n3. **Force Execution wisely**: Use \`ToList()\` or \`ToArray()\` only when you need to materialize the results.\n4. **Efficient Existence Check**: Use \`Any()\` instead of \`Count() > 0\` for faster checks.\n5. **Validation with Early Exit**: Use \`All()\` for full collection validation; it exits as soon as one item fails.\n6. **Avoid Multiple Enumeration**: Materialize the query with \`ToList()\` once if you need to iterate over it multiple times.\n7. **Prefer Predicate Overloads**: Use \`FirstOrDefault(x => x.Id == id)\` instead of \`Where(x => x.Id == id).FirstOrDefault()\`.\n8. **Flatten Nested Collections**: Use \`SelectMany()\` to flatten lists of lists efficiently.\n9. **Remove Duplicates**: Use \`Distinct()\` or \`DistinctBy()\` for efficient uniqueness.\n10. **Modern Joins**: In .NET 10, prefer \`LeftJoin()\` and \`RightJoin()\` for clearer syntax.\n11. **Keep Logic Simple**: Extract complex logic out of \`Where()\` and \`Select()\` into separate methods.\n12. **Sort Sparingly**: Use \`OrderBy()\` only when needed, and chain with \`ThenBy()\` for multi-level sorting.`,
      code: `// 1. Filter early & 2. Project specific fields\nvar activeUsers = users\n    .Where(u => u.IsActive)       // Filter early\n    .Select(u => new { u.Name })  // Project only Name\n    .ToList();\n\n// 4. Any() vs Count()\nif (users.Any(u => u.Role == "Admin")) { /* fast */ }\n\n// 7. Predicate Overload\nvar user = users.FirstOrDefault(u => u.Id == 5);\n\n// 8. SelectMany\nvar allTags = posts.SelectMany(p => p.Tags).Distinct();`,
      keyPoints: ['Filter items early to reduce processing load.', 'Use Any() instead of Count() for existence checks.', 'Avoid multiple enumerations by materializing with ToList().', 'Keep LINQ queries simple and readable.']
    },
    {
      id: 'ado-net-details',
      title: 'Deep Dive: ADO.NET',
      content: `**ADO.NET** is the foundational data access technology in .NET. It provides direct, low-level access to relational databases like SQL Server, PostgreSQL, and Oracle.\n\n### Core Components\n\n- **Connection**: (\`SqlConnection\`) Manages the physical link to the database.\n- **Command**: (\`SqlCommand\`) Executes SQL queries or stored procedures.\n- **DataReader**: (\`SqlDataReader\`) Fast, forward-only stream for reading data.\n- **DataAdapter**: Bridges between a DataStore and a **DataSet** (in-memory cache).\n\n### Best Practices\n\n- **Always use \`using\` blocks**: Ensures connections are closed and disposed of even if an error occurs.\n- **Parameterized Queries**: Never use string concatenation for SQL. Use parameters to prevent **SQL Injection**.\n- **Connection Pooling**: Handled automatically by .NET; just open and close connections as quickly as possible.`,
      code: `using (SqlConnection conn = new SqlConnection(connectionString))\n{\n    string sql = "SELECT Name, Email FROM Users WHERE Role = @role";\n    SqlCommand cmd = new SqlCommand(sql, conn);\n    cmd.Parameters.AddWithValue("@role", "Admin");\n\n    conn.Open();\n    using (SqlDataReader reader = cmd.ExecuteReader())\n    {\n        while (reader.Read())\n        {\n            Console.WriteLine($"{reader["Name"]} - {reader["Email"]}");\n        }\n    }\n}`,
      codeLabel: 'ADO.NET Pattern',
      keyPoints: ['Use the using statement for automatic disposal of connections.', 'Always use parameters to prevent SQL Injection.', 'DataReader is faster for read-only, forward-only access.', 'Connection pooling is built-in and efficient.']
    },
    {
      id: 'dotnet-setup',
      title: 'Setup & Installation',
      content: `### Visual Studio
Install Visual Studio and select the **.NET desktop development** and **ASP.NET and web development** workloads.

### Target Framework
Ensure your projects target the desired version (e.g., .NET Framework 4.8).`
    }
  ]
};

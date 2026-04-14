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
      id: 'linq-ado',
      title: 'Data Access: LINQ & ADO.NET',
      content: `### ADO.NET
Traditional way to interact with databases using \`SqlConnection\`, \`SqlCommand\`, and \`SqlDataReader\`.

### LINQ (Language Integrated Query)
Allows you to write queries directly in C# for various data sources (Objects, SQL, XML).
\`\`\`csharp
var results = from c in customers
              where c.City == "London"
              select c;
\`\`\``
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

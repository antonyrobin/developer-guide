/*
 * .NET Framework course extension — extra sections and worked examples merged
 * into courses-data/dotnet-framework.js at load time. Examples target .NET
 * Framework 4.8 / 4.8.1 (C# 7.3), ASP.NET MVC 5, Web API 2, WCF and EF6 — the
 * stack still found in many enterprise systems — plus the path to modern .NET.
 */

export default {
  examples: {
    'ASP.NET Web Applications': [
      {
        title: 'Web Forms page with code-behind and validation',
        language: 'csharp',
        explanation: 'Web Forms uses server controls, **ViewState** and a page lifecycle (`Page_Load`, control events). Check `IsPostBack` so initial data loads only once, and `Page.IsValid` before acting on input.',
        code: `<%-- Contact.aspx --%>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Contact.aspx.cs" Inherits="Shop.Contact" %>
<form id="form1" runat="server">
    <asp:TextBox ID="EmailBox" runat="server" TextMode="Email" />
    <asp:RequiredFieldValidator runat="server" ControlToValidate="EmailBox"
        ErrorMessage="Email is required" Display="Dynamic" />
    <asp:DropDownList ID="TopicList" runat="server" />
    <asp:Button ID="SendButton" runat="server" Text="Send" OnClick="SendButton_Click" />
    <asp:Label ID="ResultLabel" runat="server" />
</form>

// Contact.aspx.cs
using System;
using System.Web.UI;

namespace Shop
{
    public partial class Contact : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)                                  // only on first GET
            {
                TopicList.DataSource = new[] { "Order", "Billing", "Other" };
                TopicList.DataBind();
            }
        }

        protected void SendButton_Click(object sender, EventArgs e)
        {
            if (!Page.IsValid) return;                        // server-side validation
            ResultLabel.Text = Server.HtmlEncode(
                $"Thanks! We'll reply to {EmailBox.Text} about {TopicList.SelectedValue}.");
        }
    }
}`,
      },
    ],
  },

  sections: [
    {
      title: 'CLR, Assemblies & the GAC',
      after: 'Introduction to .NET Framework',
      content: `### How code runs

1. C#/VB compiles to **IL** inside an **assembly** (\`.dll\` / \`.exe\`) with metadata and a manifest.
2. The **CLR** loads assemblies, verifies them and **JIT-compiles** IL to native code.
3. The CLR provides garbage collection, type safety, exceptions, threading and security.

| Concept | Meaning |
|---|---|
| **Strong name** | assembly identity = name + version + culture + public key token |
| **GAC** (Global Assembly Cache) | machine-wide store for shared strong-named assemblies (\`gacutil\`) |
| **Binding redirect** | \`app.config\`/\`web.config\` rule mapping old versions to a new one |
| **AppDomain** | isolation boundary inside a process (gone in .NET Core+) |
| **Target framework** | \`<TargetFrameworkVersion>v4.8</TargetFrameworkVersion>\` |
| **NuGet** | \`packages.config\` (legacy) or \`PackageReference\` |

### Version facts

.NET Framework **4.8.x is the final version** — it receives security fixes as part of Windows but no new features. New development should target modern **.NET (8/9/10)**, which is cross-platform and much faster.`,
      code: `using System;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;

class RuntimeInfo
{
    static void Main()
    {
        // Which runtime and framework are we on?
        Console.WriteLine("Runtime     : " + RuntimeInformation.FrameworkDescription);   // ".NET Framework 4.8.9xxx"
        Console.WriteLine("CLR version : " + Environment.Version);
        Console.WriteLine("64-bit      : " + Environment.Is64BitProcess);

        // Assemblies loaded into the current AppDomain
        foreach (var asm in AppDomain.CurrentDomain.GetAssemblies().OrderBy(a => a.GetName().Name).Take(5))
        {
            AssemblyName n = asm.GetName();
            string token = BitConverter.ToString(n.GetPublicKeyToken() ?? new byte[0]).Replace("-", "").ToLowerInvariant();
            Console.WriteLine($"{n.Name,-25} {n.Version,-12} token={token,-16} GAC={asm.GlobalAssemblyCache}");
        }
    }
}

/* app.config — binding redirect so all callers use Newtonsoft.Json 13
<configuration>
  <runtime>
    <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
      <dependentAssembly>
        <assemblyIdentity name="Newtonsoft.Json" publicKeyToken="30ad4fe6b2a6aeed" culture="neutral" />
        <bindingRedirect oldVersion="0.0.0.0-13.0.0.0" newVersion="13.0.0.0" />
      </dependentAssembly>
    </assemblyBinding>
  </runtime>
</configuration>

Check installed framework release (PowerShell):
(Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\NET Framework Setup\\NDP\\v4\\Full').Release   # 528040+ = 4.8
*/`,
      codeLabel: 'Inspecting the runtime and loaded assemblies',
      keyPoints: [
        'Code compiles to IL in assemblies and is JIT-compiled by the CLR.',
        'Strong-named shared assemblies can live in the GAC.',
        'Binding redirects resolve version conflicts between dependencies.',
        '.NET Framework 4.8.x is final — target modern .NET for new work.',
      ],
    },
    {
      title: 'Configuration: web.config & app.config',
      after: 'CLR, Assemblies & the GAC',
      content: `.NET Framework apps read XML configuration: \`app.config\` (copied to \`MyApp.exe.config\`) for desktop/services, \`web.config\` for ASP.NET (hierarchical — subfolders can override).

| Section | Holds |
|---|---|
| \`<appSettings>\` | key/value settings → \`ConfigurationManager.AppSettings["key"]\` |
| \`<connectionStrings>\` | DB connections → \`ConfigurationManager.ConnectionStrings["Shop"]\` |
| \`<system.web>\` | ASP.NET: compilation, authentication, custom errors, session, httpRuntime |
| \`<system.webServer>\` | IIS integrated pipeline: modules, handlers, rewrite, headers |
| \`<system.serviceModel>\` | WCF endpoints and bindings |
| custom sections | your own \`ConfigurationSection\` classes |

### Environment-specific config

**Config transforms** (\`Web.Release.config\`) rewrite values at publish time. Keep secrets out of source control with \`configSource\`/\`file=\` external files, environment-specific deployment, or encryption (\`aspnet_regiis -pef\`).`,
      code: `<!-- web.config (excerpt) -->
<configuration>
  <appSettings file="secrets.config">                     <!-- optional external overrides, not in Git -->
    <add key="Shop:PageSize" value="20" />
    <add key="Shop:SupportEmail" value="support@example.com" />
  </appSettings>
  <connectionStrings>
    <add name="Shop" providerName="System.Data.SqlClient"
         connectionString="Server=.;Database=Shop;Integrated Security=True;Encrypt=True;TrustServerCertificate=True" />
  </connectionStrings>
  <system.web>
    <compilation debug="false" targetFramework="4.8" />
    <httpRuntime targetFramework="4.8" enableVersionHeader="false" maxRequestLength="10240" />
    <customErrors mode="RemoteOnly" defaultRedirect="~/Error" />
    <httpCookies httpOnlyCookies="true" requireSSL="true" />
  </system.web>
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <remove name="X-Powered-By" />
        <add name="X-Content-Type-Options" value="nosniff" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>

// Settings.cs — typed access with defaults
using System.Configuration;

public static class Settings
{
    public static int PageSize =>
        int.TryParse(ConfigurationManager.AppSettings["Shop:PageSize"], out var n) ? n : 10;

    public static string SupportEmail =>
        ConfigurationManager.AppSettings["Shop:SupportEmail"] ?? "help@example.com";

    public static string ShopDb =>
        ConfigurationManager.ConnectionStrings["Shop"]?.ConnectionString
        ?? throw new ConfigurationErrorsException("Missing connection string 'Shop'");
}

<!-- Web.Release.config — transform applied on publish -->
<!--
<connectionStrings>
  <add name="Shop" connectionString="Server=sql-prod;Database=Shop;Integrated Security=True;Encrypt=True"
       xdt:Transform="SetAttributes" xdt:Locator="Match(name)" />
</connectionStrings>
<system.web><compilation xdt:Transform="RemoveAttributes(debug)" /></system.web>
-->`,
      codeLabel: 'web.config, typed settings and a release transform',
      keyPoints: [
        '`appSettings` and `connectionStrings` are read via `ConfigurationManager`.',
        '`system.web` configures ASP.NET; `system.webServer` configures IIS.',
        'Use config transforms for per-environment values.',
        'Disable debug compilation and enable secure cookies in production.',
      ],
    },
    {
      title: 'ASP.NET MVC 5',
      after: 'Configuration: web.config & app.config',
      content: `ASP.NET MVC 5 separates **Models**, **Views** (Razor \`.cshtml\`) and **Controllers**, replacing Web Forms' ViewState/page lifecycle with plain HTTP.

| Piece | Notes |
|---|---|
| Routing | \`RouteConfig\` (\`{controller}/{action}/{id}\`) + attribute routing \`[Route("products/{id:int}")]\` |
| Controllers | inherit \`Controller\`, return \`ActionResult\` (\`View\`, \`RedirectToAction\`, \`Json\`, \`HttpNotFound\`) |
| Model binding & validation | DataAnnotations + \`ModelState.IsValid\` |
| Views | Razor, layouts (\`_Layout.cshtml\`), partials, \`@Html.*\` helpers |
| Filters | \`[Authorize]\`, \`[ValidateAntiForgeryToken]\`, \`[HandleError]\`, custom action filters |
| DI | not built in — add Autofac/Unity/SimpleInjector |

Use the **Post/Redirect/Get** pattern after successful form posts to avoid duplicate submissions.`,
      code: `using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web.Mvc;

namespace Shop.Controllers
{
    public class ProductInput
    {
        [Required, StringLength(100)]
        public string Name { get; set; }

        [Range(0.01, 100000)]
        [DataType(DataType.Currency)]
        public decimal Price { get; set; }
    }

    [RoutePrefix("products")]
    public class ProductsController : Controller
    {
        private readonly IProductRepository _repo;
        public ProductsController(IProductRepository repo) { _repo = repo; }   // via Autofac/Unity

        [HttpGet, Route("")]
        public ActionResult Index(int page = 1)
        {
            var model = _repo.All().OrderBy(p => p.Name).Skip((page - 1) * 20).Take(20).ToList();
            return View(model);                                   // Views/Products/Index.cshtml
        }

        [HttpGet, Route("{id:int}")]
        public ActionResult Details(int id)
        {
            var product = _repo.Find(id);
            if (product == null) return HttpNotFound();
            return View(product);
        }

        [HttpGet, Route("create"), Authorize(Roles = "Admin")]
        public ActionResult Create() => View(new ProductInput());

        [HttpPost, Route("create"), Authorize(Roles = "Admin"), ValidateAntiForgeryToken]
        public ActionResult Create(ProductInput input)
        {
            if (!ModelState.IsValid) return View(input);          // redisplay with errors
            var id = _repo.Add(input.Name, input.Price);
            TempData["Message"] = "Product created";
            return RedirectToAction("Details", new { id });        // Post/Redirect/Get
        }
    }
}

/* Views/Products/Create.cshtml
@model Shop.Controllers.ProductInput
@using (Html.BeginForm()) {
    @Html.AntiForgeryToken()
    @Html.LabelFor(m => m.Name) @Html.TextBoxFor(m => m.Name) @Html.ValidationMessageFor(m => m.Name)
    @Html.LabelFor(m => m.Price) @Html.TextBoxFor(m => m.Price) @Html.ValidationMessageFor(m => m.Price)
    <button type="submit">Save</button>
}
*/`,
      codeLabel: 'Attribute-routed controller with validation and PRG',
      keyPoints: [
        'MVC 5 uses controllers and Razor views instead of Web Forms page events.',
        'Validate with DataAnnotations and check `ModelState.IsValid`.',
        'Protect posts with `[ValidateAntiForgeryToken]` and `[Authorize]`.',
        'Redirect after successful posts (Post/Redirect/Get).',
      ],
    },
    {
      title: 'ASP.NET Web API 2',
      after: 'ASP.NET MVC 5',
      content: `**Web API 2** builds HTTP/JSON services on .NET Framework. Controllers inherit \`ApiController\` and return data or \`IHttpActionResult\`.

| Feature | API |
|---|---|
| Routing | \`config.MapHttpAttributeRoutes()\` + \`[Route]\`, \`[RoutePrefix]\` |
| Results | \`Ok(x)\`, \`Created(uri, x)\`, \`NotFound()\`, \`BadRequest(ModelState)\`, \`StatusCode(...)\` |
| Binding | \`[FromBody]\` complex types, \`[FromUri]\` query objects |
| Content negotiation | JSON (Json.NET) and XML formatters |
| Cross-cutting | message handlers, filters (\`ActionFilterAttribute\`, \`ExceptionFilterAttribute\`) |
| Hosting | IIS or OWIN self-host |
| Docs | Swashbuckle (Swagger) |

Use \`async Task<IHttpActionResult>\` for I/O, and configure camelCase JSON once in \`WebApiConfig\`.`,
      code: `using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Filters;
using Newtonsoft.Json.Serialization;

public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        config.MapHttpAttributeRoutes();
        config.Formatters.Remove(config.Formatters.XmlFormatter);                       // JSON only
        config.Formatters.JsonFormatter.SerializerSettings.ContractResolver =
            new CamelCasePropertyNamesContractResolver();
        config.Filters.Add(new ValidateModelAttribute());
        config.Filters.Add(new NotFoundExceptionFilter());
    }
}

public class ValidateModelAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext ctx)
    {
        if (!ctx.ModelState.IsValid)
            ctx.Response = ctx.Request.CreateErrorResponse(HttpStatusCode.BadRequest, ctx.ModelState);
    }
}

public class NotFoundException : System.Exception { public NotFoundException(string m) : base(m) { } }

public class NotFoundExceptionFilter : ExceptionFilterAttribute
{
    public override void OnException(HttpActionExecutedContext ctx)
    {
        if (ctx.Exception is NotFoundException)
            ctx.Response = ctx.Request.CreateErrorResponse(HttpStatusCode.NotFound, ctx.Exception.Message);
    }
}

[RoutePrefix("api/orders")]
public class OrdersController : ApiController
{
    private readonly IOrderService _orders;
    public OrdersController(IOrderService orders) { _orders = orders; }

    [HttpGet, Route("")]
    public async Task<IHttpActionResult> Get([FromUri] OrderQuery q)
    {
        var page = await _orders.SearchAsync(q?.Status, q?.Page ?? 1);
        return Ok(page);
    }

    [HttpGet, Route("{id:int}", Name = "GetOrder")]
    public async Task<IHttpActionResult> GetById(int id) => Ok(await _orders.GetAsync(id));   // throws NotFoundException

    [HttpPost, Route("")]
    public async Task<IHttpActionResult> Post([FromBody] CreateOrder cmd)
    {
        var created = await _orders.CreateAsync(cmd);
        return CreatedAtRoute("GetOrder", new { id = created.Id }, created);
    }
}

public class OrderQuery { public string Status { get; set; } public int? Page { get; set; } }`,
      codeLabel: 'Web API 2 with attribute routing, filters and camelCase JSON',
      keyPoints: [
        'Inherit `ApiController` and return `IHttpActionResult` helpers.',
        'Use attribute routing and named routes for `CreatedAtRoute`.',
        'Centralise validation and exception mapping with filters.',
        'Use async actions for database and HTTP calls.',
      ],
    },
    {
      title: 'WCF Contracts, Bindings & Hosting',
      after: 'WCF & Multi-threading',
      content: `**WCF** = **A**ddress + **B**inding + **C**ontract.

| Binding | Transport | Use |
|---|---|---|
| \`basicHttpBinding\` | HTTP, SOAP 1.1 | interop with legacy SOAP clients |
| \`wsHttpBinding\` | HTTP, WS-* security/transactions | enterprise SOAP |
| \`netTcpBinding\` | TCP, binary | fast .NET-to-.NET on intranets |
| \`netNamedPipeBinding\` | named pipes | same machine |
| \`webHttpBinding\` | HTTP REST/JSON | simple REST (Web API is better) |

### Contracts

- \`[ServiceContract]\` + \`[OperationContract]\` on an interface.
- \`[DataContract]\` + \`[DataMember]\` on DTOs (versioning: add members with \`IsRequired = false\`).
- \`[FaultContract(typeof(MyFault))]\` for typed SOAP faults.

### Modern options

WCF **server** is not part of modern .NET. For migration use **CoreWCF** (community, mostly compatible) or move to **gRPC** / REST. WCF **clients** are available on modern .NET via \`System.ServiceModel.*\` packages.`,
      code: `using System;
using System.Runtime.Serialization;
using System.ServiceModel;

[DataContract(Namespace = "http://example.com/orders/2026")]
public class OrderDto
{
    [DataMember(Order = 1)] public int Id { get; set; }
    [DataMember(Order = 2)] public decimal Total { get; set; }
    [DataMember(Order = 3, IsRequired = false)] public string Currency { get; set; } = "EUR";   // added in v2
}

[DataContract]
public class OrderFault { [DataMember] public string Code { get; set; } [DataMember] public string Message { get; set; } }

[ServiceContract(Namespace = "http://example.com/orders/2026")]
public interface IOrderService
{
    [OperationContract]
    [FaultContract(typeof(OrderFault))]
    OrderDto GetOrder(int id);
}

[ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall, ConcurrencyMode = ConcurrencyMode.Multiple)]
public class OrderService : IOrderService
{
    public OrderDto GetOrder(int id)
    {
        if (id <= 0)
            throw new FaultException<OrderFault>(new OrderFault { Code = "BAD_ID", Message = "Id must be positive" },
                                                 new FaultReason("Invalid id"));
        return new OrderDto { Id = id, Total = 99.5m };
    }
}

class Program
{
    static void Main()
    {
        var baseUri = new Uri("net.tcp://localhost:8090/orders");
        using (var host = new ServiceHost(typeof(OrderService), baseUri))
        {
            host.AddServiceEndpoint(typeof(IOrderService), new NetTcpBinding(SecurityMode.Transport), "");
            host.Open();
            Console.WriteLine("Hosted at " + baseUri);

            // Client side (normally in another process): channel factory, always Close/Abort
            var factory = new ChannelFactory<IOrderService>(new NetTcpBinding(SecurityMode.Transport),
                                                              new EndpointAddress(baseUri));
            IOrderService proxy = factory.CreateChannel();
            try
            {
                Console.WriteLine(proxy.GetOrder(7).Total);
                proxy.GetOrder(0);
            }
            catch (FaultException<OrderFault> f) { Console.WriteLine($"Fault {f.Detail.Code}: {f.Detail.Message}"); }
            finally
            {
                var channel = (IClientChannel)proxy;
                if (channel.State == CommunicationState.Faulted) channel.Abort(); else channel.Close();
                factory.Close();
            }
        }
    }
}`,
      codeLabel: 'Data/fault contracts, self-hosting and a safe client',
      keyPoints: [
        'Every endpoint is Address + Binding + Contract.',
        'Version data contracts by adding optional members, never renaming.',
        'Use fault contracts for typed errors and abort faulted channels.',
        'Migrate servers to CoreWCF, gRPC or REST when moving to modern .NET.',
      ],
    },
    {
      title: 'Async/Await & the Task Parallel Library',
      after: 'WCF Contracts, Bindings & Hosting',
      content: `.NET Framework 4.5+ has \`async\`/\`await\` and the **TPL**.

| Need | Use |
|---|---|
| I/O-bound work (DB, HTTP, files) | \`async\`/\`await\` with \`*Async\` APIs |
| CPU-bound work in parallel | \`Parallel.ForEach\`, PLINQ \`AsParallel()\`, \`Task.Run\` |
| Several independent operations | \`await Task.WhenAll(...)\` |
| Timeout / cancellation | \`CancellationTokenSource(TimeSpan)\` |
| Producer/consumer | \`BlockingCollection<T>\`, TPL Dataflow |
| Thread-safe collections | \`ConcurrentDictionary\`, \`ConcurrentQueue\` |

### Classic ASP.NET pitfalls

- **Never** block on async code (\`.Result\`, \`.Wait()\`) in ASP.NET (pre-Core) or UI apps — it deadlocks on the synchronization context.
- In library code use \`ConfigureAwait(false)\`.
- Don't use \`Task.Run\` to fake async in ASP.NET — it just moves work to another thread-pool thread.
- \`async void\` only for event handlers.`,
      code: `using System;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

class AsyncDemo
{
    private static readonly HttpClient Http = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };  // reuse!

    static async Task Main()
    {
        // 1. I/O-bound: run requests concurrently, with an overall timeout
        var urls = new[] { "https://example.com", "https://example.org", "https://example.net" };
        using (var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5)))
        {
            var sw = Stopwatch.StartNew();
            Task<int>[] tasks = urls.Select(u => GetLengthAsync(u, cts.Token)).ToArray();
            int[] lengths = await Task.WhenAll(tasks);
            Console.WriteLine($"Fetched {lengths.Sum()} bytes in {sw.ElapsedMilliseconds} ms (parallel)");
        }

        // 2. CPU-bound: partition work across cores
        var primes = new ConcurrentBag<int>();
        Parallel.ForEach(Enumerable.Range(2, 200_000), new ParallelOptions { MaxDegreeOfParallelism = Environment.ProcessorCount },
            n => { if (IsPrime(n)) primes.Add(n); });
        Console.WriteLine($"Found {primes.Count} primes");

        // 3. PLINQ for data-parallel queries
        long sumOfSquares = Enumerable.Range(1, 1_000_000).AsParallel().Select(x => (long)x * x).Sum();
        Console.WriteLine($"Sum of squares: {sumOfSquares}");
    }

    static async Task<int> GetLengthAsync(string url, CancellationToken ct)
    {
        using (var response = await Http.GetAsync(url, ct).ConfigureAwait(false))
        {
            response.EnsureSuccessStatusCode();
            var body = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            return body.Length;
        }
    }

    static bool IsPrime(int n)
    {
        if (n < 2) return false;
        for (int i = 2; i * i <= n; i++) if (n % i == 0) return false;
        return true;
    }
}`,
      codeLabel: 'Concurrent I/O, Parallel.ForEach and PLINQ',
      keyPoints: [
        'Use async/await for I/O and Parallel/PLINQ for CPU-bound work.',
        'Run independent async operations together with `Task.WhenAll`.',
        'Never call `.Result` or `.Wait()` in ASP.NET or UI code.',
        'Reuse a single `HttpClient` and pass cancellation tokens.',
      ],
    },
    {
      title: 'Entity Framework 6',
      after: 'Deep Dive: ADO.NET',
      content: `**EF6** is the ORM of the .NET Framework era (EF Core is its modern successor, and EF6 also runs on modern .NET for migrations).

| Feature | EF6 API |
|---|---|
| Context | \`class ShopContext : DbContext\` with \`DbSet<T>\` properties |
| Mapping | conventions, DataAnnotations, or Fluent API in \`OnModelCreating\` |
| Querying | LINQ to Entities, \`Include()\` for eager loading |
| Read-only queries | \`AsNoTracking()\` |
| Saving | \`Add\`, modify tracked entities, \`SaveChanges()\` (one transaction) |
| Migrations | \`Enable-Migrations\`, \`Add-Migration\`, \`Update-Database\` (Package Manager Console) |
| Raw SQL | \`Database.SqlQuery<T>()\`, \`ExecuteSqlCommand\` (parameterised) |

### Performance tips

Disable lazy loading for APIs (\`Configuration.LazyLoadingEnabled = false\`) to avoid N+1 queries, project to DTOs with \`Select\`, and keep contexts short-lived (one per request).`,
      code: `using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}

public class Order
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public virtual Customer Customer { get; set; }
    public decimal Total { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ShopContext : DbContext
{
    public ShopContext() : base("name=Shop")                   // connection string from web.config
    {
        Configuration.LazyLoadingEnabled = false;             // explicit loading only
    }

    public DbSet<Customer> Customers { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(DbModelBuilder mb)
    {
        mb.Entity<Customer>().Property(c => c.Name).IsRequired().HasMaxLength(100);
        mb.Entity<Order>().Property(o => o.Total).HasPrecision(10, 2);
        mb.Entity<Order>().HasRequired(o => o.Customer).WithMany(c => c.Orders).HasForeignKey(o => o.CustomerId);
    }
}

public class CustomerReport
{
    public static void Run()
    {
        using (var db = new ShopContext())
        {
            // Projection: only the columns we need, one SQL query, no tracking
            var top = db.Customers
                .AsNoTracking()
                .Select(c => new { c.Name, Orders = c.Orders.Count, Revenue = c.Orders.Sum(o => (decimal?)o.Total) ?? 0 })
                .OrderByDescending(x => x.Revenue)
                .Take(5)
                .ToList();
            top.ForEach(x => Console.WriteLine($"{x.Name}: {x.Orders} orders, {x.Revenue:C}"));

            // Eager loading for an edit screen
            var ada = db.Customers.Include(c => c.Orders).Single(c => c.Name == "Ada");
            ada.Orders.Add(new Order { Total = 42m, CreatedAt = DateTime.UtcNow });
            db.SaveChanges();                                 // INSERT inside a transaction
        }
    }
}

// Package Manager Console:
//   Enable-Migrations
//   Add-Migration AddOrderTotalPrecision
//   Update-Database -Script     # review the SQL first`,
      codeLabel: 'DbContext, Fluent API, projections and migrations',
      keyPoints: [
        'Define a `DbContext` with `DbSet`s and configure mappings with the Fluent API.',
        'Use `Include` for eager loading and projections for read models.',
        'Use `AsNoTracking` for read-only queries and keep contexts short-lived.',
        'Manage schema changes with Code First Migrations.',
      ],
    },
    {
      title: 'Migrating to Modern .NET',
      after: 'Setup & Installation',
      content: `Modern **.NET (8 LTS, 9, 10 LTS)** is cross-platform, container-friendly and dramatically faster. Most code ports; some app models don't.

| .NET Framework | Modern .NET path |
|---|---|
| ASP.NET MVC 5 / Web API 2 | ASP.NET Core MVC / Minimal APIs |
| Web Forms | no port — rewrite (Blazor, Razor Pages) |
| WCF server | CoreWCF, gRPC or REST |
| WCF client | \`System.ServiceModel.*\` NuGet packages |
| EF6 | EF Core (or EF6 on .NET for a stepping stone) |
| \`web.config\` appSettings | \`appsettings.json\` + \`IConfiguration\` / options pattern |
| \`HttpContext.Current\` | inject \`IHttpContextAccessor\` |
| Windows Services | Worker Service + \`UseWindowsService()\` |
| WinForms / WPF | supported on Windows with modern .NET |
| AppDomains, Remoting, CAS | removed — use processes/containers |

### Approach

1. Inventory with **.NET Upgrade Assistant** and the **API Portability** analyzers.
2. Convert projects to **SDK-style** and \`PackageReference\`.
3. Move shared libraries to **.NET Standard 2.0** or multi-target \`net48;net8.0\`.
4. Migrate incrementally (**strangler fig**): YARP proxy in front, route one area at a time to the new ASP.NET Core app (\`Microsoft.AspNetCore.SystemWebAdapters\` helps share session/auth).`,
      code: `<!-- Shop.Core.csproj — SDK-style library multi-targeting old and new runtimes -->
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFrameworks>net48;net8.0</TargetFrameworks>
    <LangVersion>latest</LangVersion>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
  </ItemGroup>

  <!-- APIs that only exist on .NET Framework -->
  <ItemGroup Condition="'$(TargetFramework)' == 'net48'">
    <Reference Include="System.Configuration" />
  </ItemGroup>
</Project>

// Code that differs per target framework
public static class AppConfig
{
    public static string? Get(string key)
    {
#if NETFRAMEWORK
        return System.Configuration.ConfigurationManager.AppSettings[key];
#else
        return Environment.GetEnvironmentVariable(key.Replace(":", "__"));   // e.g. Shop__PageSize
#endif
    }
}

# Tooling (PowerShell)
dotnet tool install -g upgrade-assistant
upgrade-assistant upgrade .\\Shop.Web\\Shop.Web.csproj     # interactive, step by step
dotnet build -f net8.0                                     # compile the modern target`,
      codeLabel: 'Multi-targeting csproj and conditional compilation',
      codeLanguage: 'csharp',
      keyPoints: [
        'Most libraries port; Web Forms, WCF server and AppDomains do not.',
        'Convert to SDK-style projects and multi-target `net48;net8.0` during transition.',
        'Use the .NET Upgrade Assistant to plan and automate steps.',
        'Migrate incrementally behind a YARP proxy instead of a big-bang rewrite.',
      ],
    },
  ],
};

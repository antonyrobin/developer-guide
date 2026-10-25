/*
 * Blazor course extension — extra sections and worked examples merged into
 * courses-data/blazor.js at load time. Examples target .NET 8/9 Blazor Web
 * Apps (Razor components with C#); the .razor markup and @code blocks are
 * shown together the way they appear in a component file.
 */

export default {
  examples: {
    'Components & Data Binding': [
      {
        title: 'Two-way binding with @bind:after and a computed value',
        language: 'csharp',
        explanation: '`@bind` updates the field on `change` by default; `@bind:event="oninput"` updates on every keystroke. `@bind:after` (.NET 7+) runs code after the value changes — handy for searches or saving.',
        code: `@* TemperatureConverter.razor *@
@rendermode InteractiveServer

<label>
    Celsius
    <input type="number" @bind="celsius" @bind:event="oninput" @bind:after="OnChanged" />
</label>
<p>@celsius °C = <strong>@Fahrenheit.ToString("0.0") °F</strong></p>

<select @bind="unit">
    <option value="metric">Metric</option>
    <option value="imperial">Imperial</option>
</select>
<p>Last changed: @lastChanged?.ToString("T")</p>

@code {
    private double celsius = 20;
    private string unit = "metric";
    private DateTime? lastChanged;

    private double Fahrenheit => celsius * 9 / 5 + 32;     // recomputed on every render

    private void OnChanged() => lastChanged = DateTime.Now;
}`,
      },
    ],
  },

  sections: [
    {
      title: 'Render Modes & Hosting Models',
      after: 'What is Blazor',
      content: `Since **.NET 8**, one **Blazor Web App** can mix rendering strategies per page or component:

| Render mode | Where code runs | Interactivity | Good for |
|---|---|---|---|
| **Static SSR** (default) | server, HTML once | none (forms via enhanced POST) | content pages, SEO, fast first load |
| **Streaming SSR** (\`@attribute [StreamRendering]\`) | server | none, but streams updates while loading | slow data on static pages |
| **InteractiveServer** | server, UI diff over **SignalR** | full | intranet apps, small payload, direct DB access |
| **InteractiveWebAssembly** | browser (.NET on WASM) | full, offline-capable | rich client apps, scale-out, PWA |
| **InteractiveAuto** | Server first, then WASM once downloaded | full | best of both, more complexity |

Apply with \`@rendermode InteractiveServer\` on a component/page, on a component instance (\`<Counter @rendermode="InteractiveWebAssembly" />\`), or globally on \`<Routes>\` in \`App.razor\`.

### Choosing

- Server: tiny download, but every click is a network round-trip and each user holds a circuit (memory).
- WASM: larger first download, runs offline, but code and data **are visible to the client** — never put secrets there; call APIs instead.`,
      code: `// Program.cs — enable both interactive render modes
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents()
    .AddInteractiveWebAssemblyComponents();

var app = builder.Build();
app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .AddInteractiveWebAssemblyRenderMode()
    .AddAdditionalAssemblies(typeof(MyApp.Client._Imports).Assembly);

app.Run();

/* Pages/Weather.razor — static SSR page that streams data as it arrives
@page "/weather"
@attribute [StreamRendering]

@if (forecasts is null) { <p><em>Loading…</em></p> }
else { <ul>@foreach (var f in forecasts) { <li>@f.Date: @f.TemperatureC °C</li> }</ul> }

<Counter @rendermode="InteractiveAuto" />   @* only this island is interactive *@

@code {
    private WeatherForecast[]? forecasts;
    protected override async Task OnInitializedAsync()
    {
        await Task.Delay(500);                     // simulate a slow query
        forecasts = Enumerable.Range(1, 3)
            .Select(i => new WeatherForecast(DateOnly.FromDateTime(DateTime.Today.AddDays(i)), Random.Shared.Next(-5, 30)))
            .ToArray();
    }
    record WeatherForecast(DateOnly Date, int TemperatureC);
}
*/`,
      codeLabel: 'Program.cs with both interactive modes + a streaming SSR page',
      keyPoints: [
        'Static SSR is the default; add interactivity only where needed.',
        'InteractiveServer keeps code on the server and talks over SignalR.',
        'InteractiveWebAssembly runs .NET in the browser — never ship secrets there.',
        'Render modes can be set per page, per component instance or globally.',
      ],
    },
    {
      title: 'Component Parameters & Lifecycle',
      after: 'Components & Data Binding',
      content: `### Parameters

\`[Parameter]\` properties receive values from the parent. Use \`[EditorRequired]\` to flag required ones, \`RenderFragment\` for child content, and \`[Parameter(CaptureUnmatchedValues = true)]\` to pass through extra HTML attributes.

### Lifecycle methods (in order)

| Method | Runs | Use for |
|---|---|---|
| \`SetParametersAsync\` | before parameters are applied | rare, advanced |
| \`OnInitialized{Async}\` | **once**, when first created | load initial data |
| \`OnParametersSet{Async}\` | after each parameter change | react to new route/parent values |
| \`OnAfterRender{Async}(firstRender)\` | after rendering to the DOM | JS interop, focus elements |
| \`ShouldRender\` | before re-render | skip renders for performance |
| \`Dispose{Async}\` | when removed | unsubscribe events, cancel work |

### Gotchas

- With prerendering, \`OnInitializedAsync\` can run **twice** (prerender + interactive) — persist state with \`PersistentComponentState\` if loading is expensive.
- Route parameter changes (\`/products/1\` → \`/products/2\`) reuse the component: load data in \`OnParametersSetAsync\`, not only \`OnInitializedAsync\`.
- Call \`StateHasChanged()\` when state changes outside Blazor's event handlers (timers, events).`,
      code: `@* ProductDetails.razor *@
@page "/products/{Id:int}"
@implements IDisposable
@inject IProductService Products

@if (product is null)
{
    <p>Loading…</p>
}
else
{
    <ProductCard Product="product" class="highlight" data-testid="product-card">
        <Footer><small>Refreshed @refreshed.ToString("T")</small></Footer>
    </ProductCard>
}

@code {
    [Parameter] public int Id { get; set; }

    private Product? product;
    private DateTime refreshed;
    private int loadedId;
    private readonly CancellationTokenSource cts = new();
    private System.Threading.Timer? timer;

    protected override void OnInitialized()
    {
        // refresh every 30 s; timer callbacks are outside Blazor's sync context
        timer = new System.Threading.Timer(async _ =>
        {
            await LoadAsync();
            await InvokeAsync(StateHasChanged);
        }, null, TimeSpan.FromSeconds(30), TimeSpan.FromSeconds(30));
    }

    protected override async Task OnParametersSetAsync()
    {
        if (Id != loadedId) await LoadAsync();        // route changed: /products/1 → /products/2
    }

    private async Task LoadAsync()
    {
        product = await Products.GetAsync(Id, cts.Token);
        loadedId = Id;
        refreshed = DateTime.Now;
    }

    public void Dispose()
    {
        timer?.Dispose();
        cts.Cancel();
        cts.Dispose();
    }
}

@* ProductCard.razor
<div @attributes="Extra" class="card">
    <h3>@Product.Name</h3>
    <p>@Product.Price.ToString("C")</p>
    @Footer
</div>

@code {
    [Parameter, EditorRequired] public Product Product { get; set; } = default!;
    [Parameter] public RenderFragment? Footer { get; set; }
    [Parameter(CaptureUnmatchedValues = true)] public Dictionary<string, object>? Extra { get; set; }
}
*@`,
      codeLabel: 'Route parameters, lifecycle, timers and disposal',
      keyPoints: [
        'Load data in `OnParametersSetAsync` when route parameters can change.',
        'Use `RenderFragment` parameters for slots and `CaptureUnmatchedValues` for attribute pass-through.',
        'Call `InvokeAsync(StateHasChanged)` for updates from timers or background events.',
        'Implement `IDisposable` to stop timers and cancel work.',
      ],
    },
    {
      title: 'Component Communication',
      after: 'Component Parameters & Lifecycle',
      content: `| Direction | Mechanism |
|---|---|
| Parent → child | \`[Parameter]\` properties |
| Child → parent | **\`EventCallback<T>\`** parameters (\`OnSelected\`) |
| Two-way between components | \`Value\` + \`ValueChanged\` parameters → \`@bind-Value\` |
| Ancestor → many descendants | **\`<CascadingValue>\`** + \`[CascadingParameter]\` |
| Unrelated components | a scoped **state service** with a change event |
| Call a child method | \`@ref\` to the child component |

\`EventCallback\` automatically re-renders the parent after the handler runs — prefer it over plain \`Action\` delegates.

For app-wide state (cart, user preferences) register a service and have components subscribe to its \`OnChange\` event.`,
      code: `// Services/CartState.cs — shared state (register: builder.Services.AddScoped<CartState>())
public class CartState
{
    private readonly List<CartLine> lines = new();
    public IReadOnlyList<CartLine> Lines => lines;
    public decimal Total => lines.Sum(l => l.Price * l.Qty);
    public event Action? OnChange;

    public void Add(string sku, decimal price)
    {
        var line = lines.FirstOrDefault(l => l.Sku == sku);
        if (line is null) lines.Add(new CartLine(sku, price, 1));
        else lines[lines.IndexOf(line)] = line with { Qty = line.Qty + 1 };
        OnChange?.Invoke();
    }
}
public record CartLine(string Sku, decimal Price, int Qty);

@* QuantityPicker.razor — child supporting @bind-Value *@
<button @onclick="() => Change(-1)" disabled="@(Value <= Min)">−</button>
<span>@Value</span>
<button @onclick="() => Change(1)">+</button>

@code {
    [Parameter] public int Value { get; set; }
    [Parameter] public EventCallback<int> ValueChanged { get; set; }
    [Parameter] public int Min { get; set; } = 1;
    [Parameter] public EventCallback<string> OnLimitReached { get; set; }

    private async Task Change(int delta)
    {
        var next = Math.Max(Min, Value + delta);
        if (next == Value) { await OnLimitReached.InvokeAsync($"Minimum is {Min}"); return; }
        await ValueChanged.InvokeAsync(next);
    }
}

@* ProductRow.razor — parent *@
@inject CartState Cart
@implements IDisposable

<QuantityPicker @bind-Value="qty" OnLimitReached="msg => warning = msg" />
<button @onclick="AddToCart">Add @qty</button>
<p>@warning</p>
<p>Cart total: @Cart.Total.ToString("C")</p>

@code {
    private int qty = 1;
    private string? warning;

    protected override void OnInitialized() => Cart.OnChange += StateHasChanged;
    private void AddToCart() { for (var i = 0; i < qty; i++) Cart.Add("LAP-01", 999m); }
    public void Dispose() => Cart.OnChange -= StateHasChanged;
}`,
      codeLabel: '@bind-Value child, EventCallback and a shared state service',
      keyPoints: [
        'Parameters flow down; `EventCallback` flows up and re-renders the parent.',
        '`Value` + `ValueChanged` parameters enable `@bind-Value` on your components.',
        'Use cascading values for context like theme or current user.',
        'Share app state through a scoped service and unsubscribe on dispose.',
      ],
    },
    {
      title: 'Dependency Injection & Services',
      after: 'State Management & Navigation',
      content: `Blazor uses ASP.NET Core's DI container. Inject with \`@inject\` in markup or \`[Inject]\` in code-behind.

| Lifetime | Blazor Server | Blazor WebAssembly |
|---|---|---|
| **Singleton** | shared by **all users** on the server | one per browser tab (app) |
| **Scoped** | one per **circuit** (user connection) | same as singleton |
| **Transient** | new every injection | new every injection |

### Rules

- On the server, never keep user data in **singletons** — it leaks between users.
- **DbContext** is not thread-safe and circuits are long-lived: inject \`IDbContextFactory<T>\` and create a short-lived context per operation.
- For components that need their own scope, inherit \`OwningComponentBase<T>\`.
- Typed \`HttpClient\`s (\`AddHttpClient<T>\`) for calling APIs — required in WASM.`,
      code: `// Program.cs
builder.Services.AddDbContextFactory<ShopDb>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("Shop")));
builder.Services.AddScoped<CartState>();                       // per user circuit
builder.Services.AddSingleton<ICurrencyRates, CachedCurrencyRates>();   // shared, user-agnostic
builder.Services.AddHttpClient<CatalogApiClient>(c =>
    c.BaseAddress = new Uri(builder.Configuration["CatalogApi:BaseUrl"]!));

// Services/OrderService.cs
public class OrderService(IDbContextFactory<ShopDb> dbFactory, ILogger<OrderService> log)
{
    public async Task<List<OrderSummary>> RecentAsync(string userId, CancellationToken ct)
    {
        await using var db = await dbFactory.CreateDbContextAsync(ct);    // short-lived context
        return await db.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Take(10)
            .Select(o => new OrderSummary(o.Id, o.Total, o.Status))
            .AsNoTracking()
            .ToListAsync(ct);
    }
}

public class CatalogApiClient(HttpClient http)
{
    public Task<Product[]?> SearchAsync(string term, CancellationToken ct) =>
        http.GetFromJsonAsync<Product[]>($"products?q={Uri.EscapeDataString(term)}", ct);
}

/* Orders.razor
@page "/orders"
@inject OrderService Orders
@inject AuthenticationStateProvider Auth

<ul>@foreach (var o in orders) { <li>#@o.Id — @o.Total.ToString("C") (@o.Status)</li> }</ul>

@code {
    private List<OrderSummary> orders = [];
    protected override async Task OnInitializedAsync()
    {
        var user = (await Auth.GetAuthenticationStateAsync()).User;
        orders = await Orders.RecentAsync(user.FindFirst("sub")?.Value ?? "", CancellationToken.None);
    }
}
*/
public record OrderSummary(int Id, decimal Total, string Status);`,
      codeLabel: 'DbContext factory, typed HttpClient and per-circuit state',
      keyPoints: [
        'Scoped means per circuit on Blazor Server and per app in WebAssembly.',
        'Never store user-specific data in server-side singletons.',
        'Use `IDbContextFactory` for short-lived DbContexts in components.',
        'Use typed `HttpClient`s to call APIs, especially from WebAssembly.',
      ],
    },
    {
      title: 'Authentication & Authorization',
      after: 'Dependency Injection & Services',
      content: `Blazor builds on ASP.NET Core auth (cookies, OpenID Connect, Entra ID, Identity).

| Tool | Use |
|---|---|
| \`[Authorize]\` / \`@attribute [Authorize(Roles = "Admin")]\` | protect a routable page |
| \`<AuthorizeView>\` with \`<Authorized>\` / \`<NotAuthorized>\` | show/hide UI parts |
| \`<AuthorizeView Policy="CanEditOrders">\` | policy-based UI |
| \`[CascadingParameter] Task<AuthenticationState>\` | read the user in code |
| \`AuthenticationStateProvider\` | the source of the current user |
| \`AddCascadingAuthenticationState()\` | makes auth state available everywhere |

The **.NET 8+ template with "Individual Accounts"** scaffolds ASP.NET Core Identity pages as Razor components.

**Hiding a button is not security.** Always re-check authorisation in the service/API that performs the action — especially in WebAssembly, where the client can be modified.`,
      code: `// Program.cs
builder.Services.AddCascadingAuthenticationState();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(o => o.LoginPath = "/account/login");
builder.Services.AddAuthorization(o =>
{
    o.AddPolicy("CanEditOrders", p => p.RequireRole("Admin", "Support"));
    o.AddPolicy("EuStaff", p => p.RequireClaim("region", "eu"));
});
// ...
app.UseAuthentication();
app.UseAuthorization();

/* Pages/Admin/Orders.razor
@page "/admin/orders"
@attribute [Authorize(Policy = "CanEditOrders")]
@inject IAuthorizationService AuthZ
@inject OrderService Orders

<AuthorizeView>
    <Authorized>
        <p>Signed in as @context.User.Identity?.Name</p>
    </Authorized>
</AuthorizeView>

<AuthorizeView Roles="Admin">
    <Authorized><button @onclick="RefundAll">Refund all pending</button></Authorized>
    <NotAuthorized><p>Only admins can issue bulk refunds.</p></NotAuthorized>
</AuthorizeView>

@code {
    [CascadingParameter] private Task<AuthenticationState> AuthState { get; set; } = default!;

    private async Task RefundAll()
    {
        var user = (await AuthState).User;
        // Re-check on the server side of the action — never trust the UI alone
        var result = await AuthZ.AuthorizeAsync(user, "CanEditOrders");
        if (!result.Succeeded || !user.IsInRole("Admin")) return;
        await Orders.RefundPendingAsync(user.Identity!.Name!);
    }
}
*/`,
      codeLabel: 'Policies, [Authorize] pages and AuthorizeView',
      keyPoints: [
        'Protect pages with `[Authorize]` and UI fragments with `<AuthorizeView>`.',
        'Define named policies for roles and claims in one place.',
        'Read the user via the cascading `AuthenticationState` task.',
        'Always enforce authorisation in the action itself, not just the UI.',
      ],
    },
    {
      title: 'JavaScript Interop',
      after: 'Authentication & Authorization',
      content: `Call browser APIs or JS libraries with \`IJSRuntime\`, and let JS call .NET with \`DotNetObjectReference\`.

| Task | API |
|---|---|
| Call a JS function | \`await JS.InvokeVoidAsync("fn", args)\` / \`InvokeAsync<T>\` |
| Load a module per component | \`await JS.InvokeAsync<IJSObjectReference>("import", "./Map.razor.js")\` |
| Pass an element | \`@ref="input"\` → \`ElementReference\` |
| JS → .NET instance | \`DotNetObjectReference.Create(this)\` + \`[JSInvokable]\` method |
| JS → static .NET | \`DotNet.invokeMethodAsync("Assembly", "Method")\` |

### Rules

- Only call JS in \`OnAfterRenderAsync\` (the DOM doesn't exist during prerendering).
- Use **collocated JS modules** (\`Component.razor.js\`) instead of global scripts.
- Dispose \`IJSObjectReference\` and \`DotNetObjectReference\` to avoid leaks.`,
      code: `@* Components/CopyBox.razor *@
@implements IAsyncDisposable
@inject IJSRuntime JS

<input @ref="input" value="@Text" readonly />
<button @onclick="CopyAsync">@label</button>
<p>Window width: @width px</p>

@code {
    [Parameter] public string Text { get; set; } = "";
    private ElementReference input;
    private IJSObjectReference? module;
    private DotNetObjectReference<CopyBox>? selfRef;
    private string label = "Copy";
    private int width;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;
        module = await JS.InvokeAsync<IJSObjectReference>("import", "./Components/CopyBox.razor.js");
        selfRef = DotNetObjectReference.Create(this);
        await module.InvokeVoidAsync("watchResize", selfRef);
    }

    private async Task CopyAsync()
    {
        if (module is null) return;
        await module.InvokeVoidAsync("selectAndCopy", input);
        label = "Copied!";
    }

    [JSInvokable]                         // called from JS
    public void OnResize(int newWidth)
    {
        width = newWidth;
        StateHasChanged();
    }

    public async ValueTask DisposeAsync()
    {
        if (module is not null)
        {
            try { await module.InvokeVoidAsync("stopWatching"); await module.DisposeAsync(); }
            catch (JSDisconnectedException) { }       // circuit already gone
        }
        selfRef?.Dispose();
    }
}

/* Components/CopyBox.razor.js — collocated ES module
let handler;
export function selectAndCopy(el) { el.select(); return navigator.clipboard.writeText(el.value); }
export function watchResize(dotnet) {
  handler = () => dotnet.invokeMethodAsync("OnResize", window.innerWidth);
  window.addEventListener("resize", handler);
  handler();
}
export function stopWatching() { window.removeEventListener("resize", handler); }
*/`,
      codeLabel: 'Collocated JS module, ElementReference and JS → .NET callbacks',
      keyPoints: [
        'Call JS only from `OnAfterRenderAsync` — the DOM is not ready earlier.',
        'Prefer collocated JS modules loaded with `import`.',
        'Use `DotNetObjectReference` and `[JSInvokable]` for JS → .NET calls.',
        'Dispose module and object references to avoid memory leaks.',
      ],
    },
    {
      title: 'Performance: Rendering & Virtualization',
      after: 'JavaScript Interop',
      content: `Blazor re-renders a component when its parameters change or an event handler runs. Keep renders cheap:

| Technique | Effect |
|---|---|
| \`<Virtualize Items="..." >\` / \`ItemsProvider\` | renders only visible rows of long lists |
| \`@key="item.Id"\` | stable identity when lists reorder/insert — avoids re-creating components |
| Override \`ShouldRender()\` | skip renders when nothing visible changed |
| Immutable/primitive parameters | Blazor can skip child renders when values are unchanged |
| Avoid lambdas capturing loop vars in big lists | fewer delegate allocations |
| \`@bind:event="oninput"\` + debounce | avoid a server round-trip per keystroke |
| \`QuickGrid\` | fast built-in data grid with paging, sorting, virtualization |
| AOT / trimming (WASM) | faster runtime, smaller download |

Measure first: browser dev tools + \`dotnet-counters\`, or log render counts in \`OnAfterRender\`.`,
      code: `@* Pages/Customers.razor — 100k rows rendered smoothly *@
@page "/customers"
@using Microsoft.AspNetCore.Components.Web.Virtualization
@inject CustomerService Customers

<input placeholder="Search…" @bind="filter" @bind:event="oninput" @bind:after="OnFilterChanged" />

<table class="table">
    <thead><tr><th>Name</th><th>City</th><th>Orders</th></tr></thead>
    <tbody>
        <Virtualize @ref="virtualize" ItemsProvider="LoadCustomers" ItemSize="36" OverscanCount="10" Context="c">
            <ItemContent>
                <tr @key="c.Id">
                    <td>@c.Name</td><td>@c.City</td><td>@c.OrderCount</td>
                </tr>
            </ItemContent>
            <Placeholder><tr><td colspan="3">Loading…</td></tr></Placeholder>
        </Virtualize>
    </tbody>
</table>

@code {
    private Virtualize<CustomerRow>? virtualize;
    private string filter = "";
    private CancellationTokenSource? debounce;

    // Called with the visible window only (StartIndex, Count)
    private async ValueTask<ItemsProviderResult<CustomerRow>> LoadCustomers(ItemsProviderRequest req)
    {
        var (items, total) = await Customers.PageAsync(filter, req.StartIndex, req.Count, req.CancellationToken);
        return new ItemsProviderResult<CustomerRow>(items, total);
    }

    private async Task OnFilterChanged()
    {
        debounce?.Cancel();
        debounce = new CancellationTokenSource();
        try
        {
            await Task.Delay(300, debounce.Token);           // debounce typing
            if (virtualize is not null) await virtualize.RefreshDataAsync();
        }
        catch (TaskCanceledException) { }
    }
}

@* CustomerService.PageAsync: db.Customers.Where(...).OrderBy(c => c.Name)
       .Skip(start).Take(count) + CountAsync() for the total *@`,
      codeLabel: 'Virtualize with an ItemsProvider, @key and debounced search',
      keyPoints: [
        'Use `<Virtualize>` (or QuickGrid) for long lists; load only the visible window.',
        'Add `@key` to list items so Blazor tracks identity correctly.',
        'Debounce input-driven queries to avoid excessive renders and requests.',
        'Measure before optimising; override `ShouldRender` only where it helps.',
      ],
    },
    {
      title: 'Testing Components with bUnit',
      after: 'API Integration & Deploy',
      content: `**bUnit** renders components in memory (no browser) and lets you find elements, trigger events and assert markup — tests run in milliseconds.

| Task | bUnit |
|---|---|
| Render with parameters | \`ctx.Render<Counter>(p => p.Add(c => c.Start, 5))\` (bUnit 2: \`Render\`; v1: \`RenderComponent\`) |
| Find elements | \`cut.Find("button")\`, \`cut.FindAll("li")\` |
| Trigger events | \`.Click()\`, \`.Change("value")\`, \`.Input("text")\` |
| Assert markup | \`cut.MarkupMatches("<p>…</p>")\`, \`Find("p").TextContent\` |
| Inject services | \`ctx.Services.AddSingleton<IFoo>(fake)\` |
| Fake auth | \`this.AddTestAuthorization().SetAuthorized("ada").SetRoles("Admin")\` (v2: \`AddAuthorization()\`) |
| JS interop | \`ctx.JSInterop.Mode = JSRuntimeMode.Loose\` or set up specific calls |
| Async rendering | \`cut.WaitForAssertion(() => ...)\` |

Use it with xUnit, NUnit or MSTest. Keep end-to-end coverage (Playwright) for a few critical flows.`,
      code: `// tests/QuantityPickerTests.cs  (xUnit + bUnit)
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

public class QuantityPickerTests : TestContext
{
    [Fact]
    public void Increments_and_raises_ValueChanged()
    {
        int? received = null;
        var cut = RenderComponent<QuantityPicker>(p => p
            .Add(c => c.Value, 2)
            .Add(c => c.ValueChanged, v => received = v));

        cut.FindAll("button")[1].Click();               // "+"

        Assert.Equal(3, received);
    }

    [Fact]
    public void Minus_is_disabled_at_minimum()
    {
        var cut = RenderComponent<QuantityPicker>(p => p.Add(c => c.Value, 1).Add(c => c.Min, 1));
        Assert.True(cut.Find("button").HasAttribute("disabled"));
    }
}

public class OrdersPageTests : TestContext
{
    [Fact]
    public void Shows_orders_for_signed_in_admin()
    {
        var fake = new FakeOrderService(new OrderSummary(1, 99.5m, "Paid"));
        Services.AddSingleton<IOrderService>(fake);
        this.AddTestAuthorization().SetAuthorized("ada").SetRoles("Admin");

        var cut = RenderComponent<Orders>();

        cut.WaitForAssertion(() =>
            Assert.Contains("#1 — €99.50 (Paid)", cut.Find("ul").TextContent));
        Assert.NotNull(cut.Find("button"));             // admin-only button rendered
    }
}

class FakeOrderService(params OrderSummary[] orders) : IOrderService
{
    public Task<List<OrderSummary>> RecentAsync(string userId, CancellationToken ct) => Task.FromResult(orders.ToList());
}`,
      codeLabel: 'bUnit tests for parameters, events, DI and auth',
      keyPoints: [
        'bUnit renders components in memory for fast unit tests.',
        'Trigger events and assert markup or callback values.',
        'Register fakes in `Services` and fake authentication with `AddTestAuthorization`.',
        'Use `WaitForAssertion` for components that load data asynchronously.',
      ],
    },
  ],
};

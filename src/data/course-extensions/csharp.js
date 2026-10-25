/*
 * C# course extension — extra sections and worked examples merged into
 * courses-data/csharp.js at load time. Snippets target .NET 8+/C# 12 and use
 * top-level statements, so each compiles as a console app.
 */
export default {
  examples: {
    'Language Fundamentals': [
      {
        title: 'Value vs reference types & nullability',
        language: 'csharp',
        code: `// Value types (struct, int, bool, DateTime…) are copied
var p1 = new Point(1, 2);
var p2 = p1;
p2.X = 99;
Console.WriteLine($"{p1.X} {p2.X}");          // 1 99

// Reference types (class, string, arrays…) share the same object
var a = new Box { Value = 1 };
var b = a;
b.Value = 99;
Console.WriteLine($"{a.Value} {b.Value}");    // 99 99

// Nullable reference types (enabled by default in new projects)
string? maybe = null;
Console.WriteLine(maybe?.Length ?? 0);        // null-conditional + null-coalescing
maybe ??= "default";
Console.WriteLine(maybe);

int? count = null;                            // nullable value type
Console.WriteLine(count.HasValue ? count.Value : -1);
Console.WriteLine(count.GetValueOrDefault(7));

// var, const, readonly, implicit typing
const double TaxRate = 0.2;
var total = 100m * (1 + (decimal)TaxRate);    // decimal for money
Console.WriteLine(total.ToString("C2", System.Globalization.CultureInfo.GetCultureInfo("en-US")));

struct Point { public int X; public int Y; public Point(int x, int y) { X = x; Y = y; } }
class Box { public int Value; }`,
      },
    ],
  },

  sections: [
    {
      title: 'Strings & Formatting',
      after: 'Language Fundamentals',
      content: `\`string\` is an immutable reference type. C# offers several literal forms:

| Form | Example | Use |
|---|---|---|
| Regular | \`"Line\\n"\` | escape sequences |
| Verbatim | \`@"C:\\temp\\file.txt"\` | paths, regex — backslashes kept |
| Interpolated | \`$"Hello {name}"\` | formatting values |
| Raw literal (C# 11) | \`"""{ "json": true }"""\` | JSON, SQL, multi-line text without escaping |

### Format specifiers

\`{value:N2}\` number with 2 decimals · \`{value:C}\` currency · \`{value:P1}\` percent · \`{date:yyyy-MM-dd}\` · \`{value,10}\` right-align · \`{value,-10}\` left-align.

### Performance

Use \`StringBuilder\` for loops, \`string.Join\` for collections, and \`StringComparison.OrdinalIgnoreCase\` for culture-safe, case-insensitive comparisons.`,
      code: `using System.Globalization;
using System.Text;

var name = "Ada";
var price = 1234.5m;
var ratio = 0.256;
var date = new DateTime(2026, 10, 25);
var us = CultureInfo.GetCultureInfo("en-US");

Console.WriteLine($"{name,-6}|{price,12:N2}|{ratio:P1}|{date:yyyy-MM-dd}");
Console.WriteLine(string.Format(us, "{0:C}", price));
Console.WriteLine(@"C:\\temp\\logs");

var json = $$"""
    {
      "name": "{{name}}",
      "tags": ["csharp", "dotnet"]
    }
    """;
Console.WriteLine(json);

var csv = "  Java, C#, Python  ";
string[] parts = csv.Trim().Split(',', StringSplitOptions.TrimEntries);
Console.WriteLine(string.Join(" | ", parts));
Console.WriteLine("Hello".Contains("ell") + " " + "Hello"[1..4] + " " + "abc".ToUpperInvariant());
Console.WriteLine(string.Equals("STRASSE", "strasse", StringComparison.OrdinalIgnoreCase));
Console.WriteLine(string.IsNullOrWhiteSpace("   "));

var sb = new StringBuilder();
for (var i = 1; i <= 5; i++) sb.Append(i).Append(i < 5 ? "," : "");
Console.WriteLine(sb.ToString());`,
      codeLabel: 'Interpolation, raw literals and StringBuilder',
      keyPoints: [
        'Strings are immutable; use StringBuilder in loops.',
        'Interpolated strings support alignment and format specifiers.',
        'Raw string literals (""") avoid escaping in JSON/SQL.',
        'Use StringComparison.OrdinalIgnoreCase for case-insensitive checks.',
      ],
    },
    {
      title: 'Collections & Generics',
      after: 'Strings & Formatting',
      content: `| Type | Characteristics | Typical use |
|---|---|---|
| \`T[]\` | fixed size, fastest | known-size buffers |
| \`List<T>\` | dynamic array | most sequences |
| \`Dictionary<TKey, TValue>\` | O(1) key lookup | indexes, caches |
| \`HashSet<T>\` | unique items, O(1) contains | membership, de-dupe |
| \`Queue<T>\` / \`Stack<T>\` | FIFO / LIFO | work queues, undo |
| \`PriorityQueue<T, TPriority>\` | min-heap | scheduling, Dijkstra |
| \`SortedDictionary\` / \`SortedSet\` | kept in order | ordered lookups |
| \`ImmutableList\`, \`FrozenDictionary\` (.NET 8) | read-only, thread-safe | configuration, lookup tables |
| \`ConcurrentDictionary\` | thread-safe | shared caches |

### Generics

Define reusable, type-safe code with \`class Repository<T> where T : IEntity\`. Constraints include \`where T : class\`, \`struct\`, \`new()\`, a base class or interface.

### Interfaces to accept

Accept the most general type you need (\`IEnumerable<T>\`, \`IReadOnlyList<T>\`) and return concrete or read-only types.`,
      code: `var langs = new List<string> { "C#", "Java", "Go" };
langs.Add("Rust");
langs.Insert(0, "F#");
langs.RemoveAll(l => l.Length <= 2 && l != "C#");
langs.Sort();
Console.WriteLine(string.Join(", ", langs));

var ages = new Dictionary<string, int> { ["Ada"] = 36, ["Linus"] = 54 };
ages.TryAdd("Grace", 85);
if (ages.TryGetValue("Ada", out var age)) Console.WriteLine($"Ada is {age}");
foreach (var (person, years) in ages) Console.Write($"{person}:{years} ");
Console.WriteLine();

var wordCounts = new Dictionary<string, int>();
foreach (var w in "to be or not to be".Split(' '))
    wordCounts[w] = wordCounts.GetValueOrDefault(w) + 1;
Console.WriteLine(string.Join(" ", wordCounts.Select(kv => $"{kv.Key}={kv.Value}")));

var tags = new HashSet<string>(["dotnet", "csharp", "dotnet"]);   // collection expression (C# 12)
Console.WriteLine($"{tags.Count} {tags.Contains("csharp")}");

var queue = new PriorityQueue<string, int>();
queue.Enqueue("low", 3); queue.Enqueue("urgent", 1); queue.Enqueue("normal", 2);
Console.WriteLine(queue.Dequeue());

var repo = new Repository<Product>();
repo.Add(new Product(1, "Keyboard"));
Console.WriteLine(repo.Find(1)?.Name);
Console.WriteLine(Max([3, 9, 4]) + " " + Max(["pear", "apple"]));

static T Max<T>(IEnumerable<T> items) where T : IComparable<T> =>
    items.Aggregate((best, x) => x.CompareTo(best) > 0 ? x : best);

interface IEntity { int Id { get; } }
record Product(int Id, string Name) : IEntity;

class Repository<T> where T : IEntity
{
    private readonly Dictionary<int, T> _items = new();
    public void Add(T item) => _items[item.Id] = item;
    public T? Find(int id) => _items.GetValueOrDefault(id);
    public IReadOnlyCollection<T> All => _items.Values;
}`,
      codeLabel: 'Collections and a generic repository',
      keyPoints: [
        'List<T> and Dictionary<TKey,TValue> cover most needs.',
        'TryGetValue/TryAdd avoid exceptions for missing keys.',
        'Generic constraints (where T : …) unlock members on T.',
        'Accept IEnumerable/IReadOnlyList; expose read-only views.',
      ],
    },
    {
      title: 'LINQ',
      after: 'Collections & Generics',
      content: `**Language Integrated Query** adds declarative query operators to any \`IEnumerable<T>\` (in memory) or \`IQueryable<T>\` (translated to SQL by Entity Framework).

| Category | Operators |
|---|---|
| Filter | \`Where\`, \`OfType\`, \`Distinct\`, \`DistinctBy\` |
| Project | \`Select\`, \`SelectMany\` |
| Sort | \`OrderBy\`, \`ThenByDescending\`, \`Order\` (.NET 7) |
| Group / join | \`GroupBy\`, \`Join\`, \`GroupJoin\`, \`ToLookup\` |
| Aggregate | \`Count\`, \`Sum\`, \`Average\`, \`Min/MaxBy\`, \`Aggregate\`, \`CountBy\` (.NET 9) |
| Element | \`First(OrDefault)\`, \`Single\`, \`Last\`, \`ElementAt\` |
| Quantify | \`Any\`, \`All\`, \`Contains\` |
| Partition | \`Take\`, \`Skip\`, \`TakeWhile\`, \`Chunk\` |
| Materialise | \`ToList\`, \`ToArray\`, \`ToDictionary\`, \`ToHashSet\` |

### Deferred execution

Most operators are **lazy** — the query runs when you enumerate it (\`foreach\`, \`ToList()\`). Enumerating twice runs it twice; call \`ToList()\` once if you reuse results.`,
      code: `var employees = new List<Employee>
{
    new("Alice", "Eng", 150_000, new(2018, 3, 1)),
    new("Bob", "Eng", 98_000, new(2020, 7, 15)),
    new("Diana", "Sales", 91_000, new(2017, 1, 20)),
    new("Eve", "Sales", 67_000, new(2022, 5, 9)),
    new("Frank", "Marketing", 73_000, new(2021, 2, 28)),
};

// Method syntax
var seniors = employees
    .Where(e => e.Salary > 90_000)
    .OrderByDescending(e => e.Salary)
    .Select(e => new { e.Name, Band = e.Salary > 120_000 ? "L3" : "L2" })
    .ToList();
seniors.ForEach(s => Console.WriteLine($"{s.Name} {s.Band}"));

// Grouping with aggregates
foreach (var g in employees.GroupBy(e => e.Dept).OrderBy(g => g.Key))
    Console.WriteLine($"{g.Key,-10} n={g.Count()} avg={g.Average(e => e.Salary):N0} top={g.MaxBy(e => e.Salary)!.Name}");

// Query syntax (same thing, SQL-like)
var recent = from e in employees
             where e.Hired.Year >= 2020
             orderby e.Hired
             select e.Name;
Console.WriteLine(string.Join(", ", recent));

// Quantifiers, element operators, dictionary
Console.WriteLine($"{employees.Any(e => e.Dept == "Legal")} {employees.All(e => e.Salary > 50_000)}");
Console.WriteLine(employees.FirstOrDefault(e => e.Name.StartsWith("Z"))?.Name ?? "nobody");
var byName = employees.ToDictionary(e => e.Name, e => e.Salary);
Console.WriteLine(byName["Eve"]);

// Join + SelectMany + Chunk
var depts = new[] { new Dept("Eng", "Berlin"), new Dept("Sales", "Lisbon") };
var located = employees.Join(depts, e => e.Dept, d => d.Name, (e, d) => $"{e.Name}@{d.City}");
Console.WriteLine(string.Join(" ", located));
foreach (var page in employees.Select(e => e.Name).Chunk(2)) Console.WriteLine(string.Join("+", page));

record Employee(string Name, string Dept, decimal Salary, DateOnly Hired);
record Dept(string Name, string City);`,
      codeLabel: 'LINQ from filtering to grouping',
      keyPoints: [
        'LINQ works on any IEnumerable and translates to SQL via IQueryable/EF Core.',
        'Queries are lazy until enumerated — materialise with ToList() when reusing.',
        'GroupBy + aggregates replace manual dictionaries.',
        'MaxBy/MinBy/DistinctBy/Chunk simplify common tasks (.NET 6+).',
      ],
    },
    {
      title: 'Classes, Records & Interfaces',
      after: 'LINQ',
      content: `| Type | Semantics | Use for |
|---|---|---|
| \`class\` | reference, identity equality | services, entities with behaviour |
| \`struct\` | value, copied | small immutable values (\`Point\`, \`Money\`) |
| \`record\` / \`record class\` | reference, **value equality**, immutable by default | DTOs, events, messages |
| \`record struct\` | value type with record features | small value objects |
| \`interface\` | contract, supports default implementations | abstractions for DI and tests |
| \`abstract class\` | partial implementation | template method, shared state |

### Modern member features

- **Primary constructors** (C# 12): \`class Service(ILogger logger)\`.
- **Required members**: \`public required string Name { get; init; }\`.
- **init-only setters**: settable only during object initialisation.
- **Expression-bodied members**: \`public decimal Total => Items.Sum(i => i.Price);\`
- \`with\` expressions create modified copies of records.

### Access modifiers

\`public\`, \`internal\` (same assembly — the default for classes), \`protected\`, \`private\` (default for members), \`protected internal\`, \`private protected\`, \`file\` (C# 11).`,
      code: `var order = new Order(42) { Customer = "Ada" };
order.Add(new LineItem("Book", 20m, 2));
order.Add(new LineItem("Pen", 1.5m, 4));
Console.WriteLine($"{order} total={order.Total:N2}");

var line = new LineItem("Mug", 8m, 1);
var discounted = line with { Price = 6m };               // non-destructive copy
Console.WriteLine($"{line} | {discounted} | equal? {line == new LineItem("Mug", 8m, 1)}");

IShape[] shapes = [new Circle(1), new Rectangle(2, 3)];
foreach (var s in shapes) Console.WriteLine(s.Describe());

var notifier = new EmailNotifier("smtp.local");          // primary constructor
notifier.Notify("Deployment finished");

public record LineItem(string Name, decimal Price, int Qty)
{
    public decimal Subtotal => Price * Qty;
}

public class Order(int id)                               // primary constructor (C# 12)
{
    private readonly List<LineItem> _items = [];
    public int Id { get; } = id;
    public required string Customer { get; init; }       // must be set, then immutable
    public IReadOnlyList<LineItem> Items => _items;
    public decimal Total => _items.Sum(i => i.Subtotal);

    public void Add(LineItem item)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(item.Qty);
        _items.Add(item);
    }

    public override string ToString() => $"Order #{Id} for {Customer} ({_items.Count} items)";
}

public interface IShape
{
    double Area();
    string Describe() => $"{GetType().Name} area={Area():F2}";   // default interface method
}
public record Circle(double Radius) : IShape { public double Area() => Math.PI * Radius * Radius; }
public record Rectangle(double W, double H) : IShape { public double Area() => W * H; }

public class EmailNotifier(string host)
{
    public void Notify(string message) => Console.WriteLine($"[{host}] {message}");
}`,
      codeLabel: 'Records, primary constructors and interfaces',
      keyPoints: [
        'Records give value equality, immutability and with-expressions.',
        'Primary constructors (C# 12) remove constructor boilerplate.',
        'required + init enforce complete, immutable initialisation.',
        'Interfaces can carry default implementations.',
      ],
    },
    {
      title: 'Pattern Matching',
      after: 'Classes, Records & Interfaces',
      content: `C# pattern matching lets you test **shape and values** in a single expression — in \`is\`, \`switch\` statements and **switch expressions**.

| Pattern | Example |
|---|---|
| Type | \`obj is string s\` |
| Constant | \`x is null\`, \`status is "active"\` |
| Relational | \`score is >= 90\` |
| Logical | \`c is >= 'a' and <= 'z' or '_'\`, \`x is not null\` |
| Property | \`order is { Status: "Paid", Total: > 100 }\` |
| Positional | \`point is (0, 0)\` (records / Deconstruct) |
| List (C# 11) | \`args is [var first, .., var last]\` |
| Discard | \`_ => "default"\` |

Switch expressions are exhaustive-checked by the compiler and return a value, replacing long \`if/else\` chains.`,
      code: `Console.WriteLine(Classify(42));
Console.WriteLine(Classify(-3));
Console.WriteLine(Classify("hello"));
Console.WriteLine(Classify(new Order("Paid", 250m)));
Console.WriteLine(Classify(new int[] { 1, 2, 3 }));
Console.WriteLine(Classify(null));

Console.WriteLine(Shipping(new Order("Paid", 30m)) + " / " + Shipping(new Order("Paid", 120m)));
Console.WriteLine(Quadrant(new Point(3, -2)));

static string Classify(object? value) => value switch
{
    null => "nothing",
    int n when n < 0 => "negative int",
    int n when n < 100 => $"small int {n}",
    int => "big int",
    string { Length: 0 } => "empty string",
    string s => $"string '{s}' ({s.Length} chars)",
    Order { Status: "Paid", Total: > 100 } o => $"large paid order {o.Total}",
    Order o => $"order {o.Status}",
    int[] and [var first, .., var last] => $"array {first}..{last}",     // list pattern
    _ => $"something else: {value.GetType().Name}",
};

static decimal Shipping(Order order) => order switch
{
    { Total: >= 100 } => 0m,
    { Status: "Paid" } => 4.99m,
    _ => throw new InvalidOperationException("unpaid order"),
};

static string Quadrant(Point p) => p switch
{
    (0, 0) => "origin",
    ( > 0, > 0) => "I",
    ( < 0, > 0) => "II",
    ( < 0, < 0) => "III",
    ( > 0, < 0) => "IV",
    _ => "on an axis",
};

record Order(string Status, decimal Total);
record Point(int X, int Y);`,
      codeLabel: 'Switch expressions with every pattern kind',
      keyPoints: [
        'Switch expressions return values and are checked for exhaustiveness.',
        'Combine relational, logical, property and positional patterns.',
        'List patterns ([first, .., last]) match arrays and lists.',
        'Use when clauses for conditions that patterns cannot express.',
      ],
    },
    {
      title: 'Delegates, Lambdas & Events',
      after: 'Pattern Matching',
      content: `A **delegate** is a type-safe reference to a method. The built-in generic delegates cover almost every need:

| Delegate | Signature | Example |
|---|---|---|
| \`Action<T>\` | takes T, returns nothing | \`Action<string> log = Console.WriteLine;\` |
| \`Func<T, TResult>\` | takes T, returns TResult | \`Func<int, int> square = x => x * x;\` |
| \`Predicate<T>\` | takes T, returns bool | \`list.FindAll(x => x > 0)\` |

**Lambdas** (\`x => x * 2\`) create delegate instances inline and can capture variables (closures).

### Events

\`event EventHandler<T>\` exposes a delegate that outsiders can only **subscribe** (\`+=\`) or **unsubscribe** (\`-=\`) — they cannot invoke or overwrite it. Raise events with \`Handler?.Invoke(this, args)\`.

Remember to unsubscribe long-lived publishers to avoid memory leaks.`,
      code: `Func<int, int, int> add = (a, b) => a + b;
Func<int, int> square = x => x * x;
Action<string> log = msg => Console.WriteLine($"[log] {msg}");
Predicate<string> isLong = s => s.Length > 4;

log($"{add(2, 3)} {square(7)} {isLong("hello")}");

// Higher-order function returning a function (closure over 'factor')
Func<int, int> Multiplier(int factor) => n => n * factor;
var triple = Multiplier(3);
Console.WriteLine(string.Join(",", new[] { 1, 2, 3 }.Select(triple)));

// Composition
Func<string, string> trim = s => s.Trim();
Func<string, string> upper = s => s.ToUpperInvariant();
Func<string, string> pipeline = s => upper(trim(s));
Console.WriteLine(pipeline("  dotnet  "));

// Events
var stock = new Stock("MSFT", 410m);
stock.PriceChanged += (sender, e) =>
    Console.WriteLine($"{e.Symbol}: {e.OldPrice} -> {e.NewPrice} ({(e.NewPrice > e.OldPrice ? "▲" : "▼")})");

EventHandler<PriceChangedEventArgs> alert = (_, e) => { if (e.NewPrice < 400) Console.WriteLine("ALERT: below 400"); };
stock.PriceChanged += alert;
stock.Price = 415m;
stock.Price = 395m;
stock.PriceChanged -= alert;                     // unsubscribe
stock.Price = 380m;

public record PriceChangedEventArgs(string Symbol, decimal OldPrice, decimal NewPrice);

public class Stock(string symbol, decimal price)
{
    public event EventHandler<PriceChangedEventArgs>? PriceChanged;

    public decimal Price
    {
        get => price;
        set
        {
            if (value == price) return;
            var old = price;
            price = value;
            PriceChanged?.Invoke(this, new PriceChangedEventArgs(symbol, old, value));
        }
    }
}`,
      codeLabel: 'Func, Action, closures and events',
      keyPoints: [
        'Func returns a value, Action does not, Predicate returns bool.',
        'Lambdas capture outer variables (closures).',
        'Events restrict outsiders to += and -=.',
        'Raise events with ?.Invoke and unsubscribe to avoid leaks.',
      ],
    },
    {
      title: 'Exceptions',
      after: 'Delegates, Lambdas & Events',
      content: `### Handling

\`try / catch / finally\`, with the most specific \`catch\` first. **Exception filters** (\`catch (HttpRequestException e) when (e.StatusCode == 404)\`) catch only when a condition holds, without unwinding the stack.

### Throwing

- Use guard helpers: \`ArgumentNullException.ThrowIfNull(x)\`, \`ArgumentException.ThrowIfNullOrEmpty(s)\`, \`ArgumentOutOfRangeException.ThrowIfNegative(n)\`.
- Re-throw with \`throw;\` (keeps the stack trace) — **never** \`throw ex;\`.
- Wrap with context: \`throw new OrderException("…", ex)\` (inner exception preserved).

### Resource clean-up

\`using var stream = File.OpenRead(path);\` disposes at the end of the scope; \`await using\` for \`IAsyncDisposable\`.

### Guidelines

Do not use exceptions for normal control flow (use \`TryParse\`, \`TryGetValue\`). In ASP.NET Core, convert unhandled exceptions to **ProblemDetails** responses with a global exception handler.`,
      code: `Console.WriteLine(ParsePort("8080"));
Console.WriteLine(ParsePort("abc"));

try
{
    PlaceOrder(quantity: 0);
}
catch (OrderException ex) when (ex.InnerException is ArgumentOutOfRangeException)
{
    Console.WriteLine($"Order failed: {ex.Message} <- {ex.InnerException.GetType().Name}");
}

try
{
    using var writer = new TempWriter();        // disposed even if an exception is thrown
    writer.Write("data");
    throw new InvalidOperationException("disk full");
}
catch (InvalidOperationException ex)
{
    Console.WriteLine($"Caught: {ex.Message}");
}
finally
{
    Console.WriteLine("finally runs last");
}

static int ParsePort(string text) =>
    int.TryParse(text, out var port) && port is > 0 and < 65536 ? port : 80;   // no exception needed

static void PlaceOrder(int quantity)
{
    try
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity);
    }
    catch (ArgumentOutOfRangeException ex)
    {
        throw new OrderException("Invalid quantity", ex);                  // wrap with context
    }
}

public class OrderException(string message, Exception inner) : Exception(message, inner);

public sealed class TempWriter : IDisposable
{
    public void Write(string s) => Console.WriteLine($"writing {s}");
    public void Dispose() => Console.WriteLine("TempWriter disposed");
}`,
      codeLabel: 'Filters, guards, wrapping and using',
      keyPoints: [
        'Catch specific exceptions; use when filters for conditions.',
        'Re-throw with throw; to preserve the stack trace.',
        'Prefer Try* methods over exceptions for expected failures.',
        'using / await using guarantee disposal.',
      ],
    },
    {
      title: 'Async / Await',
      after: 'Exceptions',
      content: `\`async\`/\`await\` makes asynchronous I/O read like synchronous code. While awaiting, the thread is **released** to do other work — essential for scalable web APIs.

### Rules of thumb

| Do | Don't |
|---|---|
| Return \`Task\` / \`Task<T>\` (or \`ValueTask\` on hot paths) | \`async void\` (except UI event handlers) |
| \`await\` all the way up | \`.Result\` / \`.Wait()\` — can deadlock and blocks threads |
| Pass \`CancellationToken\` through | Ignore cancellation |
| \`Task.WhenAll\` for independent work | Await independent calls one by one |
| \`Task.Run\` for CPU-bound work in UI apps | \`Task.Run\` around I/O in ASP.NET Core |

### Streams of data

\`IAsyncEnumerable<T>\` + \`await foreach\` processes items as they arrive (paged APIs, database streaming). \`Parallel.ForEachAsync\` runs async work with bounded parallelism.`,
      code: `using System.Diagnostics;

var sw = Stopwatch.StartNew();

// Concurrent independent work
var userTask = FetchAsync("user", 300);
var ordersTask = FetchAsync("orders", 200);
var results = await Task.WhenAll(userTask, ordersTask);
Console.WriteLine($"{string.Join(", ", results)} in ~{sw.ElapsedMilliseconds} ms");

// Cancellation with a timeout
using var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(150));
try
{
    await FetchAsync("slow-report", 1000, cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("report cancelled after timeout");
}

// Streaming with IAsyncEnumerable
await foreach (var page in GetPagesAsync(3))
    Console.WriteLine($"page {page}");

// Bounded parallelism
await Parallel.ForEachAsync(Enumerable.Range(1, 6), new ParallelOptions { MaxDegreeOfParallelism = 2 },
    async (i, ct) => { await Task.Delay(50, ct); Console.Write($"{i} "); });
Console.WriteLine();

static async Task<string> FetchAsync(string name, int ms, CancellationToken ct = default)
{
    await Task.Delay(ms, ct);                    // simulates network I/O
    return $"{name}✓";
}

static async IAsyncEnumerable<int> GetPagesAsync(int count)
{
    for (var i = 1; i <= count; i++)
    {
        await Task.Delay(30);
        yield return i;
    }
}`,
      codeLabel: 'WhenAll, cancellation and async streams',
      keyPoints: [
        'Await all the way — never block with .Result or .Wait().',
        'Avoid async void except for UI event handlers.',
        'Run independent operations together with Task.WhenAll.',
        'Flow CancellationToken through every async call.',
      ],
    },
    {
      title: 'Dependency Injection',
      after: 'ASP.NET Core Basics',
      content: `.NET has a built-in **dependency injection (DI) container** (\`Microsoft.Extensions.DependencyInjection\`), used by ASP.NET Core, worker services and console apps.

### Lifetimes

| Lifetime | One instance per… | Typical services |
|---|---|---|
| \`AddSingleton\` | application | configuration, caches, \`HttpClient\` handlers |
| \`AddScoped\` | request (scope) | \`DbContext\`, unit of work, per-request state |
| \`AddTransient\` | every resolution | lightweight stateless helpers |

> **Captive dependency**: never inject a *scoped* service into a *singleton* — it would live forever. ASP.NET Core validates this in Development.

### Patterns

- Depend on **interfaces** in constructors; register implementations once in \`Program.cs\`.
- Use the **Options pattern** (\`IOptions<T>\`) for typed configuration.
- Use \`IHttpClientFactory\` / typed clients instead of \`new HttpClient()\`.
- Keyed services (.NET 8): \`AddKeyedSingleton<IStorage, S3Storage>("s3")\`.`,
      code: `// Program.cs (ASP.NET Core minimal API — Microsoft.NET.Sdk.Web)
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<PricingOptions>(builder.Configuration.GetSection("Pricing"));
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<IOrderRepository, InMemoryOrderRepository>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddHttpClient<IExchangeRates, ExchangeRatesClient>(c =>
    c.BaseAddress = new Uri("https://api.example.com/"));

var app = builder.Build();

app.MapPost("/orders", async (CreateOrder cmd, OrderService service, CancellationToken ct) =>
{
    var order = await service.PlaceAsync(cmd, ct);
    return Results.Created($"/orders/{order.Id}", order);
});

app.Run();

// ----- Contracts & implementations -----
public record CreateOrder(string Sku, int Qty);
public record Order(Guid Id, string Sku, int Qty, decimal Total, DateTimeOffset At);

public class PricingOptions { public decimal UnitPrice { get; set; } = 9.99m; }

public interface IOrderRepository { Task AddAsync(Order order, CancellationToken ct); }
public interface IExchangeRates { Task<decimal> GetRateAsync(string currency, CancellationToken ct); }

public class InMemoryOrderRepository : IOrderRepository
{
    private readonly List<Order> _orders = [];
    public Task AddAsync(Order order, CancellationToken ct) { _orders.Add(order); return Task.CompletedTask; }
}

public class ExchangeRatesClient(HttpClient http) : IExchangeRates
{
    public async Task<decimal> GetRateAsync(string currency, CancellationToken ct) =>
        decimal.Parse(await http.GetStringAsync($"rates/{currency}", ct));
}

public class OrderService(IOrderRepository repo, IOptions<PricingOptions> options, TimeProvider clock)
{
    public async Task<Order> PlaceAsync(CreateOrder cmd, CancellationToken ct)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(cmd.Qty);
        var order = new Order(Guid.NewGuid(), cmd.Sku, cmd.Qty, cmd.Qty * options.Value.UnitPrice, clock.GetUtcNow());
        await repo.AddAsync(order, ct);
        return order;
    }
}`,
      codeLabel: 'Registering and consuming services (ASP.NET Core)',
      keyPoints: [
        'Singleton = app lifetime, Scoped = per request, Transient = per resolution.',
        'Never inject scoped services into singletons.',
        'Inject interfaces and IOptions<T>; register implementations in Program.cs.',
        'Use IHttpClientFactory/typed clients for HttpClient.',
      ],
    },
    {
      title: 'Unit Testing with xUnit',
      after: 'Build & Deploy',
      content: `**xUnit** is the most widely used .NET test framework (MSTest and NUnit are alternatives). Pair it with **FluentAssertions**/**Shouldly** for readable assertions and **Moq**/**NSubstitute** for test doubles.

| xUnit feature | Purpose |
|---|---|
| \`[Fact]\` | a single test |
| \`[Theory]\` + \`[InlineData]\` / \`[MemberData]\` | data-driven tests |
| Constructor / \`IDisposable\` | per-test set-up / tear-down |
| \`IClassFixture<T>\` | share expensive set-up across a class |
| \`Assert.ThrowsAsync<T>\` | expected exceptions |

### Commands

\`dotnet new xunit -n MyApp.Tests\` · \`dotnet add reference ../MyApp\` · \`dotnet test\` · \`dotnet test --collect:"XPlat Code Coverage"\`.

For ASP.NET Core integration tests use \`WebApplicationFactory<Program>\` to run the real pipeline in memory.`,
      code: `// Test project: dotnet add package xunit NSubstitute
using NSubstitute;
using Xunit;

// ----- Code under test -----
public interface IDiscountPolicy { decimal PercentFor(string customerTier); }

public class PriceCalculator(IDiscountPolicy policy)
{
    public decimal Total(decimal unitPrice, int qty, string tier)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(qty);
        var gross = unitPrice * qty;
        return Math.Round(gross * (1 - policy.PercentFor(tier) / 100m), 2);
    }
}

// ----- Tests -----
public class PriceCalculatorTests
{
    private readonly IDiscountPolicy _policy = Substitute.For<IDiscountPolicy>();
    private readonly PriceCalculator _sut;

    public PriceCalculatorTests() => _sut = new PriceCalculator(_policy);   // fresh per test

    [Fact]
    public void Total_without_discount_is_unit_price_times_quantity()
    {
        _policy.PercentFor("basic").Returns(0m);

        var total = _sut.Total(9.99m, 3, "basic");

        Assert.Equal(29.97m, total);
    }

    [Theory]
    [InlineData("silver", 10, 90.00)]
    [InlineData("gold", 25, 75.00)]
    public void Total_applies_tier_discount(string tier, decimal percent, decimal expected)
    {
        _policy.PercentFor(tier).Returns(percent);
        Assert.Equal(expected, _sut.Total(10m, 10, tier));
        _policy.Received(1).PercentFor(tier);
    }

    [Fact]
    public void Total_rejects_zero_quantity() =>
        Assert.Throws<ArgumentOutOfRangeException>(() => _sut.Total(10m, 0, "basic"));
}`,
      codeLabel: 'xUnit facts, theories and substitutes',
      keyPoints: [
        '[Fact] for single cases, [Theory] + [InlineData] for data-driven tests.',
        'xUnit creates a new class instance per test — use the constructor for set-up.',
        'Mock interfaces with NSubstitute or Moq.',
        'Use WebApplicationFactory for ASP.NET Core integration tests.',
      ],
    },
  ],
};

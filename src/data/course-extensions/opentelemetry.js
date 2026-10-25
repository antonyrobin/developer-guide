/*
 * OpenTelemetry course extension — extra sections and worked examples merged
 * into courses-data/opentelemetry.js at load time. .NET examples target
 * OpenTelemetry .NET 1.9+ on .NET 8; Python examples run as-is with
 * `pip install opentelemetry-sdk` and print spans/metrics to the console.
 */

export default {
  examples: {
    'Implementation in ASP.NET Core': [
      {
        title: 'Full Program.cs with resource, logs and OTLP endpoint',
        language: 'csharp',
        explanation: 'One `UseOtlpExporter()` call (OpenTelemetry.Exporter.OpenTelemetryProtocol 1.9+) sends traces, metrics **and** logs. The endpoint and headers can also come from the standard `OTEL_EXPORTER_OTLP_*` environment variables.',
        code: `using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenTelemetry()
    .ConfigureResource(r => r
        .AddService(serviceName: "orders-api", serviceVersion: "1.4.2")
        .AddAttributes(new Dictionary<string, object>
        {
            ["deployment.environment.name"] = builder.Environment.EnvironmentName
        }))
    .WithTracing(t => t
        .AddAspNetCoreInstrumentation(o => o.Filter = ctx => ctx.Request.Path != "/health")
        .AddHttpClientInstrumentation()
        .AddSource("Orders.*"))                    // our own ActivitySources
    .WithMetrics(m => m
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()
        .AddMeter("Orders.*"))                     // our own Meters
    .WithLogging()                                 // ILogger → OTel logs, correlated with traces
    .UseOtlpExporter();                            // OTEL_EXPORTER_OTLP_ENDPOINT, default http://localhost:4317

var app = builder.Build();
app.MapGet("/health", () => "ok");
app.MapGet("/orders/{id}", (int id, ILogger<Program> log) =>
{
    log.LogInformation("Fetching order {OrderId}", id);   // carries TraceId/SpanId
    return Results.Ok(new { id, status = "paid" });
});
app.Run();`,
      },
    ],
  },

  sections: [
    {
      title: 'Signals: Traces, Metrics & Logs',
      after: 'OpenTelemetry Architecture',
      content: `OpenTelemetry defines three stable **signals** (plus profiles, still evolving) that share context and resource information.

| Signal | Answers | Building blocks |
|---|---|---|
| **Traces** | *Where* did time go in this request across services? | trace → spans (name, start/end, attributes, events, status, parent) |
| **Metrics** | *How much / how often* overall? | counters, up-down counters, histograms, gauges + attributes |
| **Logs** | *What exactly* happened? | records with severity, body, attributes, **trace/span IDs** |

### Key vocabulary

| Term | Meaning |
|---|---|
| **Span kind** | \`SERVER\`, \`CLIENT\`, \`PRODUCER\`, \`CONSUMER\`, \`INTERNAL\` |
| **Attributes** | key/value details: \`http.request.method\`, \`db.system.name\`, \`order.id\` |
| **Events** | timestamped annotations on a span (e.g. an exception) |
| **Resource** | who emitted it: \`service.name\`, \`service.version\`, host, k8s pod |
| **Semantic conventions** | standard attribute names so tools understand your data |

Use metrics for alerting and dashboards (cheap, aggregated), traces for latency investigation, and logs for detail — joined by the trace ID.`,
      code: `# pip install opentelemetry-sdk  •  python signals.py
from opentelemetry import trace, metrics
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor, ConsoleSpanExporter
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import InMemoryMetricReader
from opentelemetry.trace import Status, StatusCode

resource = Resource.create({"service.name": "checkout", "service.version": "2.1.0"})

class OneLineExporter(ConsoleSpanExporter):
    def __init__(self):
        super().__init__(formatter=lambda s: (
            f"span {s.name:<16} kind={s.kind.name:<8} status={s.status.status_code.name:<5} "
            f"parent={'-' if s.parent is None else format(s.parent.span_id, '016x')[:6]} "
            f"attrs={dict(s.attributes)}\\n"))

tp = TracerProvider(resource=resource)
tp.add_span_processor(SimpleSpanProcessor(OneLineExporter()))
trace.set_tracer_provider(tp)
reader = InMemoryMetricReader()
metrics.set_meter_provider(MeterProvider(resource=resource, metric_readers=[reader]))

tracer = trace.get_tracer("checkout")
meter = metrics.get_meter("checkout")
orders = meter.create_counter("orders.placed", unit="{order}")
latency = meter.create_histogram("payment.duration", unit="ms")

with tracer.start_as_current_span("POST /checkout", kind=trace.SpanKind.SERVER) as root:
    root.set_attribute("http.request.method", "POST")
    with tracer.start_as_current_span("charge card", kind=trace.SpanKind.CLIENT) as pay:
        pay.set_attribute("payment.provider", "stripe")
        pay.add_event("retry", {"attempt": 2})
        latency.record(182, {"payment.provider": "stripe"})
    with tracer.start_as_current_span("reserve stock") as stock:
        stock.set_status(Status(StatusCode.ERROR, "out of stock"))
    orders.add(1, {"payment.method": "card"})

for rm in reader.get_metrics_data().resource_metrics:
    for sm in rm.scope_metrics:
        for m in sm.metrics:
            point = m.data.data_points[0]
            value = getattr(point, "value", None) or f"count={point.count} sum={point.sum}"
            print(f"metric {m.name} = {value} {dict(point.attributes)}")`,
      codeLabel: 'Spans, attributes, events, status and metrics (Python SDK)',
      codeLanguage: 'python',
      keyPoints: [
        'Traces show the path of a request; metrics show aggregate trends; logs give detail.',
        'Spans form a tree via parent IDs and carry attributes, events and status.',
        'The resource (`service.name`) identifies who produced the telemetry.',
        'Follow semantic conventions so backends can interpret your attributes.',
      ],
    },
    {
      title: 'Context Propagation (W3C Trace Context)',
      after: 'Signals: Traces, Metrics & Logs',
      content: `A distributed trace only works if every service passes the **trace context** to the next one. OpenTelemetry uses the W3C **\`traceparent\`** header by default:

\`\`\`
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             │  └──────────── trace-id ──────────┘ └─ parent span ─┘ └ flags (01 = sampled)
\`\`\`

| Piece | Purpose |
|---|---|
| **Propagator** | injects/extracts context into carriers (HTTP headers, message headers) |
| \`tracestate\` | vendor-specific data alongside \`traceparent\` |
| **Baggage** | user-defined key/values that travel with the request (\`tenant.id\`) |

Instrumentation libraries for HTTP clients/servers, gRPC and many messaging clients propagate automatically. For anything custom (queues, background jobs, raw sockets) you **inject** on send and **extract** on receive yourself.

Baggage is sent to every downstream service — never put secrets or personal data in it.`,
      code: `# pip install opentelemetry-sdk  •  python propagation.py
from opentelemetry import trace, baggage, context
from opentelemetry.propagate import inject, extract
from opentelemetry.sdk.trace import TracerProvider

trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer("demo")

# --- Service A: start a span and inject context into an outgoing "message" ---
with tracer.start_as_current_span("publish order") as span:
    ctx = baggage.set_baggage("tenant.id", "acme")
    headers = {}
    inject(headers, context=trace.set_span_in_context(span, ctx))
    print("headers sent:", headers)
    a_trace_id = span.get_span_context().trace_id

# --- Service B: extract context from the incoming message and continue the trace ---
incoming = extract(headers)
with tracer.start_as_current_span("handle order", context=incoming) as child:
    sc = child.get_span_context()
    print("same trace:", sc.trace_id == a_trace_id)
    print("trace id  :", format(sc.trace_id, "032x"))
    print("baggage   :", baggage.get_baggage("tenant.id", incoming))`,
      codeLabel: 'Injecting and extracting traceparent + baggage',
      codeLanguage: 'python',
      keyPoints: [
        'The W3C `traceparent` header carries trace ID, parent span ID and sampling flag.',
        'Auto-instrumentation propagates context for HTTP and gRPC.',
        'Inject on send and extract on receive for queues and custom transports.',
        'Baggage travels everywhere — keep it small and free of secrets.',
      ],
    },
    {
      title: 'Manual Tracing in .NET (ActivitySource)',
      after: 'Implementation in ASP.NET Core',
      content: `In .NET, OpenTelemetry tracing is built on \`System.Diagnostics\`: an **\`Activity\`** is a span and an **\`ActivitySource\`** is a tracer. No OTel package is needed in your library code — only the app wires up exporters.

| OTel concept | .NET API |
|---|---|
| Tracer | \`new ActivitySource("Orders.Service")\` |
| Start span | \`source.StartActivity("ReserveStock", ActivityKind.Internal)\` |
| Attribute | \`activity?.SetTag("order.id", id)\` |
| Event | \`activity?.AddEvent(new ActivityEvent("cache.miss"))\` |
| Status | \`activity?.SetStatus(ActivityStatusCode.Error, "msg")\` |
| Exception | \`activity?.AddException(ex)\` (.NET 9) or record an event |
| Current span | \`Activity.Current\` |

\`StartActivity\` returns **null** when nobody is listening or the span isn't sampled — always use \`?.\`. Register the source with \`.AddSource("Orders.*")\`.`,
      code: `using System.Diagnostics;

public sealed class CheckoutService(IInventoryClient inventory, IPaymentClient payments, ILogger<CheckoutService> log)
{
    // One static source per component; the name must match AddSource(...) in Program.cs
    private static readonly ActivitySource Source = new("Orders.Checkout", "1.0.0");

    public async Task<string> PlaceOrderAsync(Order order, CancellationToken ct)
    {
        using var activity = Source.StartActivity("PlaceOrder", ActivityKind.Internal);
        activity?.SetTag("order.id", order.Id);
        activity?.SetTag("order.item_count", order.Items.Count);
        activity?.SetTag("order.total", order.Total);

        try
        {
            using (var reserve = Source.StartActivity("ReserveStock"))
            {
                var ok = await inventory.ReserveAsync(order.Items, ct);
                reserve?.SetTag("inventory.reserved", ok);
                if (!ok)
                {
                    activity?.AddEvent(new ActivityEvent("stock.unavailable"));
                    activity?.SetStatus(ActivityStatusCode.Error, "Out of stock");
                    return "rejected";
                }
            }

            var paymentId = await payments.ChargeAsync(order.CustomerId, order.Total, ct);  // HttpClient → auto CLIENT span
            activity?.SetTag("payment.id", paymentId);
            log.LogInformation("Order {OrderId} paid with {PaymentId}", order.Id, paymentId);
            return "accepted";
        }
        catch (Exception ex)
        {
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            activity?.AddEvent(new ActivityEvent("exception", tags: new ActivityTagsCollection
            {
                ["exception.type"] = ex.GetType().FullName,
                ["exception.message"] = ex.Message,
            }));
            throw;
        }
    }
}

public record Order(string Id, string CustomerId, decimal Total, IReadOnlyList<string> Items);
public interface IInventoryClient { Task<bool> ReserveAsync(IReadOnlyList<string> skus, CancellationToken ct); }
public interface IPaymentClient { Task<string> ChargeAsync(string customerId, decimal amount, CancellationToken ct); }`,
      codeLabel: 'Custom spans with ActivitySource',
      keyPoints: [
        '`Activity` = span and `ActivitySource` = tracer in .NET.',
        '`StartActivity` can return null — always use the null-conditional operator.',
        'Register each source name with `AddSource` or its spans are dropped.',
        'Set error status and record exception details before rethrowing.',
      ],
    },
    {
      title: 'Custom Metrics in .NET (Meter)',
      after: 'Manual Tracing in .NET (ActivitySource)',
      content: `.NET metrics use \`System.Diagnostics.Metrics\`. Create a **\`Meter\`** (ideally through \`IMeterFactory\` for DI and testability) and instruments from it.

| Instrument | Use for | Example |
|---|---|---|
| \`Counter<T>\` | monotonically increasing totals | orders placed, bytes sent |
| \`UpDownCounter<T>\` | values that go up and down | active connections, queue length |
| \`Histogram<T>\` | distributions | request duration, payload size |
| \`ObservableGauge<T>\` | sampled current value via callback | memory used, cache size |

### Attribute (tag) cardinality

Each unique combination of tags is a separate time series. **Never** tag with user IDs, order IDs, URLs with IDs, or timestamps — use bounded values like \`status\`, \`region\`, \`payment.method\`.

Inspect locally with \`dotnet-counters monitor -n Orders.Api --counters Orders.Checkout\`.`,
      code: `using System.Diagnostics.Metrics;

public sealed class CheckoutMetrics
{
    public const string MeterName = "Orders.Checkout";

    private readonly Counter<long> _ordersPlaced;
    private readonly Histogram<double> _checkoutDuration;
    private readonly UpDownCounter<int> _inFlight;
    private int _queueDepth;

    public CheckoutMetrics(IMeterFactory meterFactory)
    {
        var meter = meterFactory.Create(MeterName);
        _ordersPlaced = meter.CreateCounter<long>("orders.placed", unit: "{order}",
            description: "Number of orders successfully placed");
        _checkoutDuration = meter.CreateHistogram<double>("checkout.duration", unit: "s",
            description: "End-to-end checkout time");
        _inFlight = meter.CreateUpDownCounter<int>("checkout.in_flight", unit: "{request}");
        meter.CreateObservableGauge("checkout.queue.depth", () => Volatile.Read(ref _queueDepth));
    }

    public void OrderPlaced(string paymentMethod, string region) =>
        _ordersPlaced.Add(1,
            new KeyValuePair<string, object?>("payment.method", paymentMethod),   // bounded values only
            new KeyValuePair<string, object?>("region", region));

    public IDisposable TrackCheckout()
    {
        _inFlight.Add(1);
        var started = System.Diagnostics.Stopwatch.GetTimestamp();
        return new Scope(() =>
        {
            _inFlight.Add(-1);
            _checkoutDuration.Record(System.Diagnostics.Stopwatch.GetElapsedTime(started).TotalSeconds);
        });
    }

    public void SetQueueDepth(int depth) => Volatile.Write(ref _queueDepth, depth);

    private sealed class Scope(Action onDispose) : IDisposable
    {
        public void Dispose() => onDispose();
    }
}

// Program.cs
// builder.Services.AddSingleton<CheckoutMetrics>();
// builder.Services.AddOpenTelemetry().WithMetrics(m => m.AddMeter(CheckoutMetrics.MeterName));
//
// usage:  using (metrics.TrackCheckout()) { ...; metrics.OrderPlaced("card", "eu-west"); }`,
      codeLabel: 'Counter, histogram, up-down counter and gauge',
      keyPoints: [
        'Pick the instrument by semantics: counter, up-down counter, histogram or gauge.',
        'Create meters through `IMeterFactory` and register names with `AddMeter`.',
        'Keep tag cardinality low — never tag with IDs or timestamps.',
        'Histograms give percentiles (p95/p99) in the backend.',
      ],
    },
    {
      title: 'Instrumenting Python & Node.js',
      after: 'Custom Metrics in .NET (Meter)',
      content: `Every major language has an SDK plus **zero-code (auto) instrumentation** for popular frameworks.

| Language | Zero-code option | Manual API |
|---|---|---|
| Python | \`opentelemetry-instrument python app.py\` (after \`opentelemetry-bootstrap -a install\`) | \`trace.get_tracer(__name__)\` |
| Node.js | \`node --require @opentelemetry/auto-instrumentations-node/register app.js\` | \`trace.getTracer("svc")\` |
| Java | \`-javaagent:opentelemetry-javaagent.jar\` | \`GlobalOpenTelemetry.getTracer\` |
| .NET | \`OpenTelemetry.AutoInstrumentation\` | \`ActivitySource\` |

Configuration is shared through standard **environment variables**, so the same settings work for every language:

| Variable | Example |
|---|---|
| \`OTEL_SERVICE_NAME\` | \`payments\` |
| \`OTEL_EXPORTER_OTLP_ENDPOINT\` | \`http://otel-collector:4317\` |
| \`OTEL_RESOURCE_ATTRIBUTES\` | \`deployment.environment.name=prod,service.version=1.2.0\` |
| \`OTEL_TRACES_SAMPLER\` / \`_ARG\` | \`parentbased_traceidratio\` / \`0.1\` |
| \`OTEL_METRICS_EXPORTER\`, \`OTEL_LOGS_EXPORTER\` | \`otlp\`, \`console\`, \`none\` |`,
      code: `# pip install opentelemetry-sdk  •  python decorators.py
# Manual instrumentation patterns that complement auto-instrumentation.
import functools, time
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter
from opentelemetry.trace import Status, StatusCode

exporter = InMemorySpanExporter()                       # tests/demos; use OTLP in real apps
provider = TracerProvider()
provider.add_span_processor(SimpleSpanProcessor(exporter))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("billing")

def traced(name=None, **static_attrs):
    """Decorator: wrap a function in a span and record exceptions."""
    def wrap(fn):
        @functools.wraps(fn)
        def inner(*args, **kwargs):
            # record_exception=False: we record it ourselves below (the default would add it too)
            with tracer.start_as_current_span(name or fn.__qualname__, attributes=static_attrs,
                                              record_exception=False) as span:
                try:
                    return fn(*args, **kwargs)
                except Exception as exc:
                    span.record_exception(exc)
                    span.set_status(Status(StatusCode.ERROR, str(exc)))
                    raise
        return inner
    return wrap

@traced("invoice.render", template="default")
def render_invoice(order_id):
    trace.get_current_span().set_attribute("invoice.order_id", order_id)
    time.sleep(0.01)
    return f"INV-{order_id}"

@traced()
def send_invoice(order_id):
    if order_id < 0:
        raise ValueError("bad order id")
    return render_invoice(order_id)

send_invoice(42)
try:
    send_invoice(-1)
except ValueError:
    pass

for s in exporter.get_finished_spans():
    parent = s.parent.span_id if s.parent else None
    print(f"{s.name:<28} {s.status.status_code.name:<6} {(s.end_time - s.start_time) / 1e6:6.1f} ms "
          f"child={parent is not None} attrs={dict(s.attributes)} events={[e.name for e in s.events]}")`,
      codeLabel: 'A tracing decorator verified with the in-memory exporter',
      codeLanguage: 'python',
      keyPoints: [
        'Start with zero-code instrumentation, then add manual spans for business logic.',
        'Standard `OTEL_*` environment variables configure every SDK the same way.',
        'Record exceptions and set error status on failing spans.',
        'The in-memory exporter makes instrumentation unit-testable.',
      ],
    },
    {
      title: 'The OpenTelemetry Collector',
      after: 'Instrumenting Python & Node.js',
      content: `The **Collector** is a vendor-neutral agent/gateway that receives, processes and exports telemetry. Apps send OTLP to the collector; the collector decides where data goes.

| Component | Examples |
|---|---|
| **Receivers** | \`otlp\` (gRPC 4317 / HTTP 4318), \`prometheus\`, \`filelog\`, \`hostmetrics\`, \`kafka\` |
| **Processors** | \`memory_limiter\`, \`batch\`, \`attributes\` / \`transform\` (redact), \`resourcedetection\`, \`tail_sampling\`, \`filter\` |
| **Exporters** | \`otlp\` / \`otlphttp\` (Tempo, Jaeger, vendors), \`prometheus\`/\`prometheusremotewrite\`, \`debug\` |
| **Connectors** | \`spanmetrics\` — derive RED metrics from traces |
| **Extensions** | \`health_check\`, \`pprof\`, auth |

### Deployment patterns

- **Agent** (sidecar / DaemonSet) next to apps: adds host/k8s metadata, buffers.
- **Gateway** (central pool): tail sampling, routing, secrets for vendor backends.

Use the **contrib** distribution (\`otel/opentelemetry-collector-contrib\`) for the full component set; always put \`memory_limiter\` first and \`batch\` last in pipelines.`,
      code: `# otel-collector.yaml
receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
      http: { endpoint: 0.0.0.0:4318 }
  hostmetrics:
    collection_interval: 30s
    scrapers: { cpu: {}, memory: {}, filesystem: {} }

processors:
  memory_limiter:
    check_interval: 1s
    limit_percentage: 80
    spike_limit_percentage: 20
  resourcedetection:
    detectors: [env, system, docker]
  attributes/redact:
    actions:
      - key: http.request.header.authorization
        action: delete
      - key: user.email
        action: hash
  batch:
    send_batch_size: 8192
    timeout: 5s

connectors:
  spanmetrics: {}                 # request rate / errors / duration from spans

exporters:
  otlp/tempo:
    endpoint: tempo:4317
    tls: { insecure: true }
  prometheus:
    endpoint: 0.0.0.0:8889
  otlphttp/loki:
    endpoint: http://loki:3100/otlp
  debug:
    verbosity: basic

extensions:
  health_check: {}

service:
  extensions: [health_check]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, resourcedetection, attributes/redact, batch]
      exporters: [otlp/tempo, spanmetrics]
    metrics:
      receivers: [otlp, hostmetrics, spanmetrics]
      processors: [memory_limiter, resourcedetection, batch]
      exporters: [prometheus]
    logs:
      receivers: [otlp]
      processors: [memory_limiter, attributes/redact, batch]
      exporters: [otlphttp/loki]

# docker run -p 4317:4317 -p 4318:4318 -p 8889:8889 \\
#   -v $PWD/otel-collector.yaml:/etc/otelcol-contrib/config.yaml otel/opentelemetry-collector-contrib`,
      codeLabel: 'Collector pipelines for traces, metrics and logs',
      codeLanguage: 'yaml',
      keyPoints: [
        'Apps export OTLP to a collector; the collector routes to any backend.',
        'Pipelines are receivers → processors → exporters per signal.',
        'Put `memory_limiter` first and `batch` last; redact sensitive attributes centrally.',
        'Run agents near workloads and gateways for sampling and routing.',
      ],
    },
    {
      title: 'Sampling Strategies',
      after: 'The OpenTelemetry Collector',
      content: `Recording every span is expensive at scale. **Sampling** keeps a representative subset.

| Strategy | Where | Pros | Cons |
|---|---|---|---|
| **AlwaysOn** | SDK | complete data | cost at high volume |
| **TraceIdRatio** (e.g. 10%) | SDK (head) | cheap, decided at the start | may drop rare errors |
| **ParentBased** | SDK | follows the caller's decision → complete traces | needs a root decision |
| **Tail sampling** | Collector (gateway) | keep all errors and slow traces, sample the rest | needs all spans of a trace in one collector, more memory |

### Practical setup

- SDK: \`parentbased_traceidratio\` with a modest ratio (or 100% and sample in the collector).
- Gateway collector: **tail sampling** policies — keep errors, keep latency > threshold, keep 5–10% of the rest.
- Route spans of a trace to the same gateway instance with the \`loadbalancing\` exporter (by trace ID).
- **Never sample metrics** — they are already aggregated; derive RED metrics before sampling (\`spanmetrics\`).`,
      code: `# Collector gateway: tail sampling keeps what matters
processors:
  tail_sampling:
    decision_wait: 10s                 # wait for late spans of a trace
    num_traces: 100000
    expected_new_traces_per_sec: 2000
    policies:
      - name: keep-errors
        type: status_code
        status_code: { status_codes: [ERROR] }
      - name: keep-slow
        type: latency
        latency: { threshold_ms: 1500 }
      - name: keep-checkout
        type: string_attribute
        string_attribute: { key: http.route, values: ["/checkout", "/payments/.*"], enabled_regex_matching: true }
      - name: baseline
        type: probabilistic
        probabilistic: { sampling_percentage: 5 }

# SDK side (any language) — head sampling via environment variables:
#   OTEL_TRACES_SAMPLER=parentbased_traceidratio
#   OTEL_TRACES_SAMPLER_ARG=0.25
#
# .NET equivalent in code:
#   .WithTracing(t => t.SetSampler(new ParentBasedSampler(new TraceIdRatioBasedSampler(0.25))))`,
      codeLabel: 'Tail-sampling policies + head sampling settings',
      codeLanguage: 'yaml',
      keyPoints: [
        'Head sampling decides at the start; tail sampling decides after seeing the whole trace.',
        'Use parent-based samplers so traces are never half-recorded.',
        'Tail sampling keeps all errors and slow requests while trimming volume.',
        'Generate metrics from spans before sampling; never sample metrics.',
      ],
    },
    {
      title: 'Correlating Logs with Traces',
      after: 'Sampling Strategies',
      content: `The biggest payoff of OpenTelemetry is jumping from a slow span straight to the logs written **during that span**. That works when every log record carries \`trace_id\` and \`span_id\`.

| Stack | How logs get trace IDs |
|---|---|
| .NET \`ILogger\` | \`.WithLogging()\` (OTel logs) or \`ActivityTrackingOptions\` for console/JSON |
| Python \`logging\` | \`LoggingInstrumentor\` or a filter reading the current span |
| Java (Logback/Log4j) | agent injects \`trace_id\` into MDC |
| Node (pino/winston) | instrumentation packages add the fields |

### Practices

- Log in **structured JSON** with consistent keys (\`trace_id\`, \`span_id\`, \`service.name\`).
- Prefer sending logs via OTLP (or the collector's \`filelog\` receiver) so resource attributes match traces.
- Use span **events** for things that only matter inside a trace; use logs for things operators search for.`,
      code: `# pip install opentelemetry-sdk  •  python correlate.py
import json, logging, sys
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider

trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer("api")

class TraceContextFilter(logging.Filter):
    """Copy the active span's IDs onto every log record."""
    def filter(self, record):
        ctx = trace.get_current_span().get_span_context()
        record.trace_id = format(ctx.trace_id, "032x") if ctx.is_valid else None
        record.span_id = format(ctx.span_id, "016x") if ctx.is_valid else None
        return True

class JsonFormatter(logging.Formatter):
    def format(self, record):
        return json.dumps({"level": record.levelname, "msg": record.getMessage(),
                           "service.name": "api", "trace_id": record.trace_id, "span_id": record.span_id})

handler = logging.StreamHandler(sys.stdout)
handler.addFilter(TraceContextFilter())
handler.setFormatter(JsonFormatter())
log = logging.getLogger("api")
log.addHandler(handler)
log.setLevel(logging.INFO)

log.info("startup (no active span)")
with tracer.start_as_current_span("GET /orders/42") as span:
    log.info("loading order 42")
    with tracer.start_as_current_span("SELECT orders"):
        log.warning("slow query: 850 ms")
    print("span trace_id =", format(span.get_span_context().trace_id, "032x"))`,
      codeLabel: 'Injecting trace and span IDs into JSON logs',
      codeLanguage: 'python',
      keyPoints: [
        'Logs need `trace_id` and `span_id` to be correlated with traces.',
        'Use structured JSON logs with consistent field names.',
        'Most SDKs and agents can inject IDs automatically.',
        'Shipping logs via OTLP keeps resource attributes aligned with traces.',
      ],
    },
  ],
};

export const openTelemetryCourse = {
  id: 'opentelemetry',
  title: 'OpenTelemetry (Observability)',
  description: 'The industry standard for collecting traces, metrics, and logs in modern distributed systems.',
  icon: 'Activity',
  category: 'DevOps & Cloud',
  sections: [
    {
      title: 'What is OpenTelemetry?',
      image: '/images/opentelemetry/architecture.png',
      content: `**OpenTelemetry (OTel)** is a vendor-neutral, open-source observability framework for generating, collecting, and exporting telemetry data (Traces, Metrics, Logs).\n\n### Why OpenTelemetry?\nBefore OTel, each vendor (Datadog, New Relic, etc.) had its own SDK. If you wanted to switch vendors, you had to re-instrument your entire codebase. OTel provides a **unified standard**.\n\n### The Three Signals\n1. **Traces**: Tell you exactly what happened to a request across every service it touched. Essential for finding latency bottlenecks.\n2. **Metrics**: Aggregated data over time (CPU usage, request rates, error counts). Helps you see when a system is about to break.\n3. **Logs**: Structured text records correlated with Trace IDs for deep debugging.`,
      keyPoints: [
        'Vendor-neutral standard for observability.',
        'Unified SDK for Traces, Metrics, and Logs.',
        'Prevents vendor lock-in.',
        'Industry-wide adoption by all major cloud providers.'
      ]
    },
    {
      title: 'OpenTelemetry Architecture',
      content: `The OTel architecture consists of three main components: **SDKs**, the **OTLP protocol**, and the **Collector**.\n\n### 1. Instrumentation (SDKs)\nYou add OTel libraries to your app. These can be **Manual** (explicit code) or **Auto-instrumentation** (automatically captures data from frameworks like ASP.NET Core, Spring Boot, or Express).\n\n### 2. OTLP Protocol\nThe standard format used to transmit data between components.\n\n### 3. The Collector\nA standalone service that receives, processes, and exports data. It acts as a buffer and router, allowing you to send data to multiple backends (e.g., Prometheus for metrics and Jaeger for traces) without touching your application code.`,
      keyPoints: [
        'SDKs generate the telemetry data.',
        'OTLP is the universal language for telemetry.',
        'The Collector decouples your app from the monitoring backend.',
        'Collector can batch, filter, and redact data before exporting.'
      ]
    },
    {
      title: 'Implementation in ASP.NET Core',
      content: `Setting up OTel in .NET is straightforward using NuGet packages and the \`Program.cs\` configuration.\n\n### Essential Packages\n- \`OpenTelemetry.Extensions.Hosting\`\n- \`OpenTelemetry.Instrumentation.AspNetCore\`\n- \`OpenTelemetry.Exporter.OpenTelemetryProtocol\` (OTLP)`,
      code: `// Program.cs setup\nbuilder.Services.AddOpenTelemetry()\n    .WithTracing(tracing => {\n        tracing.AddAspNetCoreInstrumentation()\n               .AddHttpClientInstrumentation()\n               .AddEntityFrameworkCoreInstrumentation()\n               .AddOtlpExporter();\n    })\n    .WithMetrics(metrics => {\n        metrics.AddAspNetCoreInstrumentation()\n               .AddRuntimeInstrumentation()\n               .AddOtlpExporter();\n    });`,
      codeLabel: '.NET OTel Setup',
      keyPoints: [
        'Use AddOpenTelemetry() to register services.',
        'Instrumentation libraries automatically capture framework events.',
        'Export data via OTLP to the OTel Collector or a direct backend.',
        'Correlation happens automatically via Trace IDs.'
      ]
    }
  ]
};

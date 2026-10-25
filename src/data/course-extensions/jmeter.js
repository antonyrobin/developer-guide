/*
 * JMeter course extension — extra sections and worked examples merged into
 * courses-data/jmeter.js at load time. Targets Apache JMeter 5.6 (Java 8+);
 * XML snippets are excerpts of .jmx test plans and CLI examples use the
 * scripts in JMeter's bin/ folder.
 */

export default {
  examples: {
    'Generating HTML Reports': [
      {
        title: 'Run headless and build the dashboard in one command',
        language: 'bash',
        explanation: 'Never load-test from the GUI. `-n` runs non-GUI, `-l` writes raw results (JTL), `-e -o` builds the HTML dashboard into an **empty** folder. Use `-J` to pass properties that the plan reads with `${__P(name,default)}`.',
        code: `rm -rf report && mkdir report

jmeter -n -t checkout.jmx \\
  -l results/checkout-$(date +%Y%m%d-%H%M).jtl \\
  -e -o report \\
  -Jthreads=50 -Jrampup=60 -Jduration=600 -Jhost=staging.example.com \\
  -j logs/jmeter.log

# Rebuild a dashboard later from an existing JTL file
jmeter -g results/checkout-20261025-1000.jtl -o report-rebuilt

# Useful dashboard settings (user.properties)
# jmeter.reportgenerator.overall_granularity=60000
# jmeter.reportgenerator.apdex_satisfied_threshold=500
# jmeter.reportgenerator.apdex_tolerated_threshold=1500`,
      },
    ],
  },

  sections: [
    {
      title: 'Test Plan Building Blocks',
      after: 'Introduction to JMeter',
      content: `A JMeter **test plan** (\`.jmx\`, XML) is a tree of elements. Their **scope** follows the tree: an element applies to its parent and siblings' children.

| Element | Purpose | Examples |
|---|---|---|
| **Thread Group** | virtual users, ramp-up, duration | Thread Group, Concurrency / Arrivals (plugins) |
| **Sampler** | sends a request | HTTP Request, JDBC Request, JMS, gRPC (plugin) |
| **Config element** | shared settings / data | HTTP Request Defaults, Header Manager, Cookie Manager, CSV Data Set |
| **Pre-processor** | runs before a sampler | JSR223 PreProcessor, User Parameters |
| **Post-processor** | extracts from responses | JSON Extractor, Regex Extractor, Boundary Extractor |
| **Assertion** | pass/fail checks | Response, JSON, Duration, Size assertions |
| **Timer** | think time / pacing | Constant, Uniform Random, Constant Throughput |
| **Logic controller** | flow | Transaction, If, Loop, While, Throughput, Once Only |
| **Listener** | results | Backend Listener, Simple Data Writer (avoid heavy GUI listeners) |

### Execution order inside a scope

Config → Pre-processors → Timers → **Sampler** → Post-processors → Assertions → Listeners.`,
      code: `<!-- checkout.jmx (excerpt) — the tree shown as XML -->
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
  <hashTree>
    <TestPlan testname="Checkout load test">
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments">
        <collectionProp name="Arguments.arguments">
          <elementProp name="host" elementType="Argument">
            <stringProp name="Argument.name">host</stringProp>
            <stringProp name="Argument.value">\${__P(host,localhost)}</stringProp>
          </elementProp>
        </collectionProp>
      </elementProp>
    </TestPlan>
    <hashTree>
      <ConfigTestElement guiclass="HttpDefaultsGui" testclass="ConfigTestElement" testname="HTTP Request Defaults">
        <stringProp name="HTTPSampler.domain">\${host}</stringProp>
        <stringProp name="HTTPSampler.protocol">https</stringProp>
        <stringProp name="HTTPSampler.connect_timeout">5000</stringProp>
        <stringProp name="HTTPSampler.response_timeout">15000</stringProp>
      </ConfigTestElement>
      <CookieManager testname="HTTP Cookie Manager"/>
      <ThreadGroup testname="Shoppers">
        <stringProp name="ThreadGroup.num_threads">\${__P(threads,10)}</stringProp>
        <stringProp name="ThreadGroup.ramp_time">\${__P(rampup,30)}</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <stringProp name="ThreadGroup.duration">\${__P(duration,300)}</stringProp>
      </ThreadGroup>
      <hashTree>
        <TransactionController testname="TX01 Browse and buy"/>
        <!-- samplers, extractors, assertions and timers go here -->
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>`,
      codeLabel: 'Skeleton of a parameterised test plan',
      codeLanguage: 'xml',
      keyPoints: [
        'A plan is a tree; element scope follows the tree structure.',
        'Put shared settings in config elements such as HTTP Request Defaults.',
        'Elements run in a fixed order: config, pre, timers, sampler, post, assertions, listeners.',
        'Read values with `${__P(name,default)}` so the same plan runs anywhere.',
      ],
    },
    {
      title: 'Thread Groups, Timers & Load Models',
      after: 'Test Plan Building Blocks',
      content: `Choose a load model that matches the question you are answering:

| Test type | Shape | Question |
|---|---|---|
| **Smoke** | 1–5 users, minutes | does the script work? |
| **Load** | expected peak, 30–60 min | do we meet SLAs at normal peak? |
| **Stress** | step up until it breaks | where is the limit, how does it fail? |
| **Spike** | sudden jump | does autoscaling / queueing cope? |
| **Soak / endurance** | moderate load, hours | memory leaks, connection exhaustion? |

### Closed vs open model

- **Thread Group** = *closed* model: N users loop; throughput drops when the system slows (hides problems).
- **Arrivals / Open Model Thread Group** = *open* model: fixed request **rate** regardless of response time (closer to real traffic).

### Timers and pacing

Real users pause. Add **Uniform/Gaussian Random Timers** for think time, and a **Constant Throughput Timer** or **Precise Throughput Timer** to target requests per minute. Without timers a handful of threads can generate unrealistic load.

**Little's law** sizes threads: \`users = throughput × (response time + think time)\`.`,
      code: `<!-- Open Model Thread Group (JMeter 5.5+): ramp to 20 req/s, hold, spike, cool down -->
<OpenModelThreadGroup testname="Open model - checkout">
  <stringProp name="OpenModelThreadGroup.schedule">
    rate(0/s) random_arrivals(2 min) rate(20/s)
    random_arrivals(10 min) rate(20/s)
    random_arrivals(30 s) rate(60/s)
    random_arrivals(2 min) rate(60/s)
    random_arrivals(1 min) rate(0/s)
  </stringProp>
  <stringProp name="OpenModelThreadGroup.random_seed">42</stringProp>
</OpenModelThreadGroup>

<!-- Think time: 1–3 s between steps -->
<UniformRandomTimer testname="Think time 1-3s">
  <stringProp name="ConstantTimer.delay">1000</stringProp>
  <stringProp name="RandomTimer.range">2000</stringProp>
</UniformRandomTimer>

<!-- Closed model alternative: hold 600 requests/minute across all threads -->
<ConstantThroughputTimer testname="600 rpm">
  <intProp name="calcMode">2</intProp>   <!-- all active threads (shared) -->
  <stringProp name="throughput">600</stringProp>
</ConstantThroughputTimer>

<!-- Little's law check:
     target 20 req/s × (0.4 s response + 2 s think) ≈ 48 concurrent users -->`,
      codeLabel: 'Open-model schedule, think time and throughput control',
      codeLanguage: 'xml',
      keyPoints: [
        'Pick smoke, load, stress, spike or soak based on the question you need answered.',
        'Open models (fixed arrival rate) expose slowdowns that closed models hide.',
        'Always add think time; pace with throughput timers.',
        'Size users with Little\'s law instead of guessing.',
      ],
    },
    {
      title: 'Parameterisation with CSV & Functions',
      after: 'API Testing Flow',
      content: `Hard-coded data makes every virtual user identical — caches hit 100% and results look unrealistically good. Feed varied data instead.

| Source | Use |
|---|---|
| **CSV Data Set Config** | users, product IDs, search terms from a file |
| **User Defined Variables** | constants for the plan |
| \`\${__P(name,default)}\` | properties passed with \`-J\` on the command line |
| \`\${__Random(1,100)}\`, \`\${__RandomString(8,abc)}\` | random values |
| \`\${__UUID()}\`, \`\${__time(yyyy-MM-dd)}\` | unique IDs, timestamps |
| \`\${__counter(FALSE,)}\` | global counter |
| \`\${__threadNum}\` | current thread number |

### CSV Data Set options

- **Sharing mode**: *All threads* (each line once across all users) vs *Current thread*.
- **Recycle on EOF / Stop thread on EOF**: loop the data or stop when it runs out (e.g. one-time registrations).
- Put the CSV next to the \`.jmx\` and use a relative path so it works on load generators too.`,
      code: `<!-- users.csv
username,password,productId
alice@example.com,Passw0rd!,1001
bob@example.com,Passw0rd!,1002
carol@example.com,Passw0rd!,1003
-->
<CSVDataSet testname="Users CSV">
  <stringProp name="filename">data/users.csv</stringProp>
  <stringProp name="fileEncoding">UTF-8</stringProp>
  <stringProp name="variableNames"></stringProp>          <!-- empty: read from header -->
  <boolProp name="ignoreFirstLine">false</boolProp>
  <stringProp name="delimiter">,</stringProp>
  <boolProp name="recycle">true</boolProp>
  <boolProp name="stopThread">false</boolProp>
  <stringProp name="shareMode">shareMode.all</stringProp>
</CSVDataSet>

<HTTPSamplerProxy testname="POST /api/login">
  <stringProp name="HTTPSampler.path">/api/login</stringProp>
  <stringProp name="HTTPSampler.method">POST</stringProp>
  <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
  <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
    <collectionProp name="Arguments.arguments">
      <elementProp name="" elementType="HTTPArgument">
        <stringProp name="Argument.value">{
  "email": "\${username}",
  "password": "\${password}",
  "deviceId": "\${__UUID()}",
  "clientTime": "\${__time(yyyy-MM-dd'T'HH:mm:ss)}"
}</stringProp>
      </elementProp>
    </collectionProp>
  </elementProp>
</HTTPSamplerProxy>`,
      codeLabel: 'CSV-driven login with built-in functions',
      codeLanguage: 'xml',
      keyPoints: [
        'Vary test data so caches and databases behave realistically.',
        'CSV Data Set Config feeds one row per iteration to each thread.',
        'Use `${__P()}` properties for environment-specific values.',
        'Functions like `__UUID` and `__Random` generate unique and random values.',
      ],
    },
    {
      title: 'Correlation with Extractors',
      after: 'Parameterisation with CSV & Functions',
      content: `**Correlation** = capturing dynamic values from one response (tokens, IDs, CSRF fields) and sending them in later requests. Without it, recorded scripts replay stale values and fail.

| Extractor | Best for | Example expression |
|---|---|---|
| **JSON Extractor** | JSON APIs | \`$.data.token\`, \`$.items[0].id\`, \`$..id\` |
| **Boundary Extractor** | anything between two strings (fast) | left \`name="csrf" value="\` right \`"\` |
| **Regular Expression Extractor** | complex patterns | \`"orderId":"(.+?)"\` |
| **CSS/JQuery Extractor** | HTML | \`input[name=csrf]\` → attr \`value\` |
| **XPath2 Extractor** | XML / SOAP | \`//order/@id\` |

### Tips

- Set a **default value** like \`NOT_FOUND\` and assert on it so failures are obvious.
- Match number \`-1\` returns all matches (\`var_1\`, \`var_2\`, \`var_matchNr\`) — loop over them with a ForEach Controller.
- Put extractors **as children** of the sampler whose response they read.`,
      code: `<!-- 1. Login → extract the bearer token -->
<HTTPSamplerProxy testname="POST /api/login"/>
<hashTree>
  <JSONPostProcessor testname="Extract token">
    <stringProp name="JSONPostProcessor.referenceNames">token</stringProp>
    <stringProp name="JSONPostProcessor.jsonPathExprs">$.accessToken</stringProp>
    <stringProp name="JSONPostProcessor.match_numbers">1</stringProp>
    <stringProp name="JSONPostProcessor.defaultValues">TOKEN_NOT_FOUND</stringProp>
  </JSONPostProcessor>
</hashTree>

<!-- 2. Send it on every following request -->
<HeaderManager testname="Auth header">
  <collectionProp name="HeaderManager.headers">
    <elementProp name="" elementType="Header">
      <stringProp name="Header.name">Authorization</stringProp>
      <stringProp name="Header.value">Bearer \${token}</stringProp>
    </elementProp>
  </collectionProp>
</HeaderManager>

<!-- 3. Create an order → capture its id with a boundary extractor -->
<HTTPSamplerProxy testname="POST /api/orders"/>
<hashTree>
  <BoundaryExtractor testname="Extract orderId">
    <stringProp name="BoundaryExtractor.refname">orderId</stringProp>
    <stringProp name="BoundaryExtractor.lboundary">"orderId":"</stringProp>
    <stringProp name="BoundaryExtractor.rboundary">"</stringProp>
    <stringProp name="BoundaryExtractor.match_number">1</stringProp>
    <stringProp name="BoundaryExtractor.default">ORDER_NOT_FOUND</stringProp>
  </BoundaryExtractor>
</hashTree>

<!-- 4. Use it in the path of the next call -->
<HTTPSamplerProxy testname="GET /api/orders/{id}">
  <stringProp name="HTTPSampler.path">/api/orders/\${orderId}</stringProp>
  <stringProp name="HTTPSampler.method">GET</stringProp>
</HTTPSamplerProxy>`,
      codeLabel: 'Token and ID correlation across requests',
      codeLanguage: 'xml',
      keyPoints: [
        'Capture dynamic values with extractors and reuse them as `${variables}`.',
        'Prefer JSON and Boundary extractors — they are faster than regex.',
        'Give extractors a sentinel default and assert it never appears.',
        'Place extractors as children of the sampler they read from.',
      ],
    },
    {
      title: 'Assertions & SLAs',
      after: 'Correlation with Extractors',
      content: `A sampler only fails on connection errors or HTTP ≥ 400 unless you add **assertions**. A 200 page saying "Something went wrong" is still a failure.

| Assertion | Checks |
|---|---|
| **Response Assertion** | status code, body contains/matches, headers |
| **JSON Assertion** | JSON path exists / equals / matches regex |
| **Duration Assertion** | response time ≤ N ms |
| **Size Assertion** | body size |
| **JSR223 Assertion** | any custom Groovy logic |

### SLA thresholds for the whole run

Encode SLAs so the run **fails automatically** in CI: e.g. p95 < 800 ms and error rate < 1%. Options: dashboard APDEX thresholds, the **JMeter Maven/Gradle plugin** with checks, or a small script that parses the JTL (below).

Keep assertions lightweight — heavy regex on large bodies consumes load-generator CPU.`,
      code: `# sla_check.py — fail CI if a JMeter JTL (CSV) breaks the SLAs
#   python sla_check.py results.jtl --p95 800 --max-error-rate 1
import argparse, csv, io, math, sys
from collections import defaultdict

SAMPLE = """timeStamp,elapsed,label,responseCode,success
1761400000000,120,GET /products,200,true
1761400000100,340,GET /products,200,true
1761400000200,910,POST /orders,200,true
1761400000300,95,GET /products,200,true
1761400000400,1500,POST /orders,500,false
1761400000500,410,POST /orders,201,true
"""

def percentile(values, p):
    values = sorted(values)
    k = max(0, math.ceil(p / 100 * len(values)) - 1)
    return values[k]

def check(rows, p95_limit, max_err):
    by_label = defaultdict(list)
    for r in rows:
        by_label[r["label"]].append(r)
    ok = True
    for label, items in sorted(by_label.items()):
        times = [int(r["elapsed"]) for r in items]
        errors = sum(r["success"] != "true" for r in items)
        p95, err_rate = percentile(times, 95), 100 * errors / len(items)
        status = "PASS" if p95 <= p95_limit and err_rate <= max_err else "FAIL"
        ok &= status == "PASS"
        print(f"{status}  {label:<15} n={len(items):<3} p95={p95:>5} ms  errors={err_rate:5.1f}%")
    return ok

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("jtl", nargs="?")
    ap.add_argument("--p95", type=int, default=800)
    ap.add_argument("--max-error-rate", type=float, default=1.0)
    a = ap.parse_args()
    source = open(a.jtl, newline="") if a.jtl else io.StringIO(SAMPLE)   # demo data without args
    passed = check(list(csv.DictReader(source)), a.p95, a.max_error_rate)
    print("SLA", "met" if passed else "violated")
    sys.exit(0 if passed else 1 if a.jtl else 0)`,
      codeLabel: 'Per-transaction p95 and error-rate gate for CI',
      codeLanguage: 'python',
      keyPoints: [
        'Add assertions — HTTP 200 does not mean the response is correct.',
        'Check status, key JSON fields and response time per transaction.',
        'Turn SLAs (p95, error rate) into an automatic pass/fail for the run.',
        'Keep assertions cheap so they do not distort the measurements.',
      ],
    },
    {
      title: 'Scripting with JSR223 & Groovy',
      after: 'Assertions & SLAs',
      content: `When built-in elements aren't enough, use **JSR223** elements with **Groovy** (compiled and cached — much faster than BeanShell).

| Variable in scripts | Meaning |
|---|---|
| \`vars\` | thread variables: \`vars.get("token")\`, \`vars.put("k", "v")\` |
| \`props\` | global JMeter properties (shared across threads) |
| \`prev\` | previous \`SampleResult\` (response code, body, time) |
| \`sampler\` | current sampler (modify before it runs) |
| \`ctx\` | thread context |
| \`log\` | write to \`jmeter.log\` |
| \`AssertionResult\` | in JSR223 Assertions: set failure + message |

### Performance rules

- Tick **"Cache compiled script if available"** and reference variables via \`vars.get()\`, **not** \`\${var}\` inside the script text (that defeats caching).
- Prefer built-in elements; scripts run per sample on every thread.`,
      code: `// JSR223 PreProcessor (Groovy): sign the request body with HMAC-SHA256
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import groovy.json.JsonOutput

def body = JsonOutput.toJson([
    orderId : "ORD-" + vars.get("__jm__Shoppers__idx"),
    sku     : vars.get("productId"),
    quantity: new Random().nextInt(3) + 1
])
def secret = props.getProperty("apiSecret", "dev-secret")
def mac = Mac.getInstance("HmacSHA256")
mac.init(new SecretKeySpec(secret.bytes, "HmacSHA256"))
def signature = mac.doFinal(body.bytes).encodeHex().toString()

vars.put("orderBody", body)          // use \${orderBody} as the HTTP sampler body
vars.put("signature", signature)     // and \${signature} in an X-Signature header

// JSR223 Assertion (Groovy): business-level checks on the JSON response
import groovy.json.JsonSlurper

def json = new JsonSlurper().parseText(prev.getResponseDataAsString())
if (json.status != "CONFIRMED") {
    AssertionResult.setFailure(true)
    AssertionResult.setFailureMessage("Unexpected status: " + json.status)
} else if (json.total <= 0) {
    AssertionResult.setFailure(true)
    AssertionResult.setFailureMessage("Order total must be positive")
}

// JSR223 PostProcessor: share a value across threads (e.g. created IDs for cleanup)
synchronized (props) {
    def ids = props.get("createdOrders") ?: []
    ids << json.orderId
    props.put("createdOrders", ids)
}
log.info("Created order {} in {} ms", json.orderId, prev.getTime())`,
      codeLabel: 'Request signing, business assertions and shared state',
      codeLanguage: 'java',
      keyPoints: [
        'Use JSR223 + Groovy for custom logic; avoid BeanShell for performance.',
        'Access data through `vars`, `props`, `prev` and `sampler`.',
        'Use `vars.get()` inside scripts so compiled scripts can be cached.',
        '`props` are shared across threads — synchronise writes.',
      ],
    },
    {
      title: 'Running in CI & Distributed Mode',
      after: 'Stored Procedure Testing (JDBC)',
      content: `### CI integration

Run JMeter headless in a pipeline, publish the HTML dashboard as an artifact, and fail the job when SLAs break. Pin the JMeter version (Docker image or download) so results are comparable over time.

### Distributed testing

One machine can only generate so much load (CPU, network, ephemeral ports). JMeter's controller/worker mode spreads threads across **load generators**:

| Step | Detail |
|---|---|
| Start workers | \`jmeter-server\` on each generator (same JMeter + plugins version) |
| Run from controller | \`jmeter -n -t plan.jmx -R gen1,gen2,gen3\` |
| Threads | each worker runs the **full** thread count → total = threads × workers |
| Data | copy CSV files to every worker (same relative path) |
| Security | RMI uses SSL by default — create keystore with \`create-rmi-keystore\` or set \`server.rmi.ssl.disable=true\` only in isolated networks |

Alternatives at scale: run independent containers per generator and merge JTLs, or use managed services (Azure Load Testing, BlazeMeter, OctoPerf) that run \`.jmx\` files.`,
      code: `# .github/workflows/load-test.yml (excerpt)
#   - run: ./run-load-test.sh staging.example.com
#   - uses: actions/upload-artifact@v4
#     with: { name: jmeter-report, path: report/ }

#!/usr/bin/env bash
# run-load-test.sh — headless JMeter in Docker + SLA gate
set -euo pipefail
HOST="\${1:?usage: run-load-test.sh <host>}"
JMETER_IMAGE="\${JMETER_IMAGE:-justb4/jmeter:latest}"   # any image whose entrypoint is jmeter — pin a tag

rm -rf report results && mkdir -p report results
docker run --rm -v "$PWD":/work -w /work "$JMETER_IMAGE" \\
  -n -t tests/checkout.jmx \\
  -Jhost="$HOST" -Jthreads=50 -Jrampup=60 -Jduration=600 \\
  -l results/results.jtl -e -o report

python3 tests/sla_check.py results/results.jtl --p95 800 --max-error-rate 1

# ---- Distributed run (controller + 3 workers) ----
# on each worker:
#   JVM_ARGS="-Xms2g -Xmx2g" jmeter-server -Djava.rmi.server.hostname=10.0.0.11
# on the controller (threads per worker!):
#   jmeter -n -t tests/checkout.jmx -R 10.0.0.11,10.0.0.12,10.0.0.13 \\
#     -Gthreads=100 -Ghost=staging.example.com -l results/dist.jtl -e -o report
#   (-G sends properties to all workers; -J only to the controller)`,
      codeLabel: 'Dockerised CI run with an SLA gate and distributed mode',
      codeLanguage: 'bash',
      keyPoints: [
        'Run headless in CI, archive the dashboard, and gate on SLAs.',
        'Pin JMeter and plugin versions so runs are comparable.',
        'In distributed mode every worker runs the full thread count.',
        'Use `-G` to pass properties to all workers and copy test data to each one.',
      ],
    },
  ],
};

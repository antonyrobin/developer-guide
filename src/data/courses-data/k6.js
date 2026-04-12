export const k6Course = {
    id: 'k6', title: 'Grafana k6', description: 'Modern load testing tool by Grafana Labs for testing APIs, microservices, and web applications with scriptable JavaScript tests and CI/CD integration.',
    officialDocs: 'https://grafana.com/docs/k6/latest/', tutorialLink: 'https://grafana.com/docs/k6/latest/get-started/', exerciseLink: null,
    sections: [
      { title: 'What is Grafana k6', image: '/images/k6/k6-overview.svg', content: `**Grafana k6** is an open-source, developer-centric load testing tool. Tests are written in **JavaScript (ES6)**, making them easy to version control, review, and integrate into CI/CD pipelines.

### Why k6?

| Factor | Benefit |
|---|---|
| **Developer-Friendly** | Write tests in JavaScript — no GUI required |
| **Protocol Support** | HTTP, WebSocket, gRPC, and browser-level testing |
| **CI/CD Native** | Integrates with GitHub Actions, GitLab CI, Jenkins |
| **Threshold-Based** | Set pass/fail criteria (latency, error rates) |
| **Lightweight** | Written in Go — single binary, no runtime dependencies |
| **Grafana Ecosystem** | Native integration with Grafana dashboards |

### k6 vs Other Tools

| Feature | k6 | JMeter | Locust |
|---|---|---|---|
| **Language** | JavaScript | XML/GUI | Python |
| **Performance** | Go-based, very fast | Java, heavy | Python, moderate |
| **CI/CD** | Native CLI | Plugin needed | Script-based |
| **Browser Testing** | ✅ Built-in | ❌ | ❌ |
| **Cloud Option** | Grafana Cloud k6 | BlazeMeter | Locust.io |`, keyPoints: ['k6 is open-source, developer-centric load testing.', 'Tests are written in JavaScript (ES6) — easy to version control.', 'Supports HTTP, WebSocket, gRPC, and browser protocols.', 'Go-based engine — lightweight and extremely fast.', 'Native CI/CD integration with pass/fail thresholds.'] },

      { title: 'Installation & Setup', content: `### Download & Install

| Platform | Method |
|---|---|
| **Windows** | \`winget install k6 --source winget\` or \`choco install k6\` |
| **macOS** | \`brew install k6\` |
| **Linux** | \`sudo snap install k6\` or download from [k6.io/docs/get-started](https://grafana.com/docs/k6/latest/set-up/install-k6/) |
| **Docker** | \`docker run -i grafana/k6 run - <script.js\` |

### Verify Installation

\`\`\`powershell
k6 version
# k6 v0.54.x (go1.22.x)
\`\`\`

### VS Code Setup

Install the **k6** extension for:
- Syntax highlighting for k6 test scripts
- Auto-completion for k6 APIs (\`http\`, \`check\`, \`sleep\`)
- Quick run commands

### Project Structure

\`\`\`text
load-tests/
├── scripts/
│   ├── smoke.js          # Quick health check (1 VU)
│   ├── load.js           # Normal traffic pattern
│   ├── stress.js         # Beyond capacity testing
│   └── soak.js           # Long-duration stability
├── helpers/
│   ├── auth.js           # JWT token generation
│   └── data.js           # Test data generators
├── thresholds.json       # Shared threshold config
└── README.md
\`\`\``, keyPoints: ['Install via winget, brew, snap, or Docker.', 'k6 is a single binary — no runtime dependencies needed.', 'Organize tests by type: smoke, load, stress, soak.', 'Use helper modules for shared authentication logic.', 'VS Code extension provides auto-completion for k6 APIs.'] },

      { title: 'Testing REST APIs', image: '/images/k6/k6-workflow.svg', content: `### Basic HTTP Test

\`\`\`javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 10 },   // Ramp up
        { duration: '1m',  target: 10 },   // Sustain
        { duration: '30s', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],   // 95% under 500ms
        http_req_failed:   ['rate<0.01'],   // <1% errors
    },
};

export default function () {
    // GET request
    const res = http.get('http://localhost:8080/api/categories');
    check(res, {
        'status is 200':     (r) => r.status === 200,
        'body has data':     (r) => r.json().length > 0,
        'response < 200ms':  (r) => r.timings.duration < 200,
    });
    sleep(1);
}
\`\`\`

### Testing with Authentication (JWT)

\`\`\`javascript
import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://localhost:8080';

// Setup — runs once before the test
export function setup() {
    const loginRes = http.post(BASE_URL + '/api/auth/login', JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!'
    }), { headers: { 'Content-Type': 'application/json' } });

    return { token: loginRes.json('token') };
}

export default function (data) {
    const headers = {
        Authorization: 'Bearer ' + data.token,
        'Content-Type': 'application/json',
    };

    // POST — Create resource
    const createRes = http.post(BASE_URL + '/api/categories',
        JSON.stringify({ code: 'TEST', name: 'Load Test Category' }),
        { headers }
    );
    check(createRes, { 'created 201': (r) => r.status === 201 });

    // GET — Fetch resource
    const getRes = http.get(BASE_URL + '/api/categories', { headers });
    check(getRes, { 'list 200': (r) => r.status === 200 });
}
\`\`\`

### Running Tests

\`\`\`powershell
# Basic run
k6 run scripts/load.js

# With virtual users and duration
k6 run --vus 50 --duration 2m scripts/load.js

# Output to JSON for CI processing
k6 run --out json=results.json scripts/load.js
\`\`\``, keyPoints: ['Use stages to define ramp-up, sustain, and ramp-down patterns.', 'Thresholds set pass/fail criteria for CI/CD integration.', 'check() validates response status, body, and timing.', 'setup() runs once for tasks like authentication.', 'Support for GET, POST, PUT, DELETE with headers and bodies.'] },

      { title: 'Testing Web Applications', content: `k6 includes a **browser module** for testing web applications with a real Chromium browser — measuring Core Web Vitals and user experience metrics.

### Browser Test Example

\`\`\`javascript
import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
    scenarios: {
        ui: {
            executor: 'shared-iterations',
            options: { browser: { type: 'chromium' } },
        },
    },
    thresholds: {
        'browser_web_vital_lcp': ['p(95)<2500'],   // Largest Contentful Paint
        'browser_web_vital_fid': ['p(95)<100'],    // First Input Delay
        'browser_web_vital_cls': ['p(95)<0.1'],    // Cumulative Layout Shift
    },
};

export default async function () {
    const page = await browser.newPage();
    try {
        // Navigate to the page
        await page.goto('https://your-app.com');
        await page.waitForSelector('h1');

        // Interact with the page
        await page.locator('input[name="search"]').type('test query');
        await page.locator('button[type="submit"]').click();

        // Validate content
        await page.waitForSelector('.results');
        check(page, {
            'header visible':  (p) => p.locator('h1').isVisible(),
            'results loaded':  (p) => p.locator('.results').isVisible(),
        });

        // Take screenshot on failure
        await page.screenshot({ path: 'screenshots/test.png' });
    } finally {
        await page.close();
    }
}
\`\`\`

### Hybrid Tests (API + Browser)

\`\`\`javascript
export const options = {
    scenarios: {
        api_test: {
            executor: 'constant-vus',
            exec: 'apiTest',
            vus: 50,
            duration: '5m',
        },
        browser_test: {
            executor: 'constant-vus',
            exec: 'browserTest',
            vus: 2,
            duration: '5m',
            options: { browser: { type: 'chromium' } },
        },
    },
};
\`\`\``, keyPoints: ['Browser module tests real Chromium for Web Vitals.', 'Measure LCP, FID, and CLS — Core Web Vitals metrics.', 'Use page.locator() for DOM interaction — click, type, navigate.', 'Hybrid tests combine API load + browser experience testing.', 'Screenshots capture visual state on test failures.'] },

      { title: 'Configuration & Thresholds', content: `### Test Types Configuration

| Type | VUs | Duration | Purpose |
|---|---|---|---|
| **Smoke** | 1 | 30s | Verify basic functionality |
| **Load** | 50-100 | 5-10m | Normal traffic simulation |
| **Stress** | 200+ | 10m+ | Find the breaking point |
| **Soak** | 50 | 1-4h | Detect memory leaks |
| **Spike** | 0→500→0 | 5m | Sudden traffic surge |

### Advanced Options

\`\`\`javascript
export const options = {
    // Executors — fine-grained control
    scenarios: {
        steady_load: {
            executor: 'constant-arrival-rate',
            rate: 100,                // 100 requests per second
            timeUnit: '1s',
            duration: '5m',
            preAllocatedVUs: 50,
        },
    },

    // Thresholds — pass/fail criteria
    thresholds: {
        http_req_duration:    ['p(95)<500', 'p(99)<1000'],
        http_req_failed:      ['rate<0.01'],
        http_reqs:            ['rate>100'],
        checks:               ['rate>0.99'],
        'http_req_duration{name:login}': ['p(95)<300'],
    },

    // Tags for grouping
    tags: {
        environment: 'staging',
        team: 'backend',
    },
};
\`\`\`

### CI/CD Integration (GitHub Actions)

\`\`\`yaml
# .github/workflows/load-test.yml
name: Load Test
on:
  push:
    branches: [main]

jobs:
  k6:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run k6 load test
        uses: grafana/k6-action@v0.3.1
        with:
          filename: scripts/load.js
          flags: --out json=results.json
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: k6-results
          path: results.json
\`\`\``, keyPoints: ['Smoke tests verify basic functionality with 1 VU.', 'Executors provide fine-grained load control (constant rate, ramping).', 'Thresholds auto-fail tests when SLAs are breached.', 'Tag-specific thresholds target individual endpoints.', 'GitHub Actions integration with grafana/k6-action.'] },

      { title: 'Best Practices', content: `### ✅ Do's

| # | Practice | Reason |
|---|---|---|
| 1 | **Start with smoke tests** | Verify scripts work before heavy load |
| 2 | **Use thresholds** | Automated pass/fail for CI/CD |
| 3 | **Test staging, not prod** | Avoid disrupting real users |
| 4 | **Monitor backend metrics** | CPU, memory, DB connections during tests |
| 5 | **Use realistic data** | Random names, varied payloads |
| 6 | **Version control tests** | Track changes alongside application code |

### ❌ Don'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Load test production** | Use staging or dedicated environment |
| 2 | **Hardcode tokens** | Use setup() for dynamic auth |
| 3 | **Skip sleep()** | Add realistic think time between requests |
| 4 | **Ignore errors** | Use check() to validate every response |
| 5 | **Single endpoint only** | Test complete user flows |

### Output Integrations

| Output | Command Flag |
|---|---|
| **JSON** | \`--out json=results.json\` |
| **CSV** | \`--out csv=results.csv\` |
| **InfluxDB** | \`--out influxdb=http://localhost:8086/k6\` |
| **Grafana Cloud** | \`K6_CLOUD_TOKEN=xxx k6 cloud run script.js\` |
| **Datadog** | \`--out datadog\` (with agent) |`, keyPoints: ['Always start with smoke tests before heavy load.', 'Use thresholds for automated CI/CD pass/fail decisions.', 'Never run destructive load tests against production.', 'Add realistic sleep() between requests to simulate users.', 'Output results to Grafana Cloud or InfluxDB for dashboards.'] }
    ]
  };

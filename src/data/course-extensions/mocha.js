/*
 * Mocha course extension — extra sections and worked examples merged into
 * courses-data/mocha.js at load time. Every example is a self-contained ES
 * module test file: save it as `something.test.mjs` and run
 * `npx mocha something.test.mjs` (needs `npm i -D mocha chai sinon`).
 */

export default {
  examples: {
    'Writing Your First Test': [
      {
        title: 'describe / it with Node\'s built-in assert',
        language: 'javascript',
        explanation: 'Mocha does not include an assertion library — `node:assert/strict` works out of the box. A test passes when it finishes without throwing.',
        code: `import assert from "node:assert/strict";

function slugify(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

describe("slugify()", () => {
  it("lower-cases and joins words with dashes", () => {
    assert.equal(slugify("Hello World"), "hello-world");
  });

  it("removes punctuation and surrounding dashes", () => {
    assert.equal(slugify("  ¡Mocha & Chai!  "), "mocha-chai");
  });

  it("returns an empty string for symbols only", () => {
    assert.equal(slugify("!!!"), "");
  });
});`,
        output: `  slugify()
    ✔ lower-cases and joins words with dashes
    ✔ removes punctuation and surrounding dashes
    ✔ returns an empty string for symbols only

  3 passing`,
      },
    ],
    'Asynchronous Testing': [
      {
        title: 'Promises, async/await and done()',
        language: 'javascript',
        explanation: 'Return the promise or use `async` — Mocha waits for it. Only use the `done` callback for callback-style APIs, and never combine it with `async`.',
        code: `import { expect } from "chai";
import { readFile } from "node:fs";

const fetchUser = (id) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (id > 0 ? resolve({ id, name: "Ada" }) : reject(new Error("invalid id"))), 20));

describe("async styles", () => {
  it("returns a promise", () => {
    return fetchUser(1).then((u) => expect(u.name).to.equal("Ada"));
  });

  it("uses async/await", async () => {
    const user = await fetchUser(2);
    expect(user).to.deep.equal({ id: 2, name: "Ada" });
  });

  it("asserts a rejection", async () => {
    try {
      await fetchUser(0);
      expect.fail("should have rejected");
    } catch (err) {
      expect(err.message).to.equal("invalid id");
    }
  });

  it("uses done() for callback APIs", (done) => {
    readFile("does-not-exist.txt", (err) => {
      try {
        expect(err.code).to.equal("ENOENT");
        done();
      } catch (e) {
        done(e);                // report assertion failures to Mocha
      }
    });
  });
});`,
      },
    ],
  },

  sections: [
    {
      title: 'Assertions with Chai',
      after: 'Writing Your First Test',
      content: `**Chai** is the assertion library most often paired with Mocha. It offers three styles: \`expect\` (most common), \`should\` and \`assert\`.

| Expectation | Chai |
|---|---|
| strict equality | \`expect(x).to.equal(3)\` |
| deep equality (objects/arrays) | \`expect(obj).to.deep.equal({ a: 1 })\` (or \`.eql\`) |
| type | \`expect(v).to.be.a("string")\`, \`.an("array")\` |
| truthiness | \`.to.be.true\`, \`.to.be.null\`, \`.to.be.undefined\`, \`.to.exist\` |
| numbers | \`.above(2)\`, \`.within(1, 5)\`, \`.closeTo(0.3, 1e-9)\` |
| strings | \`.include("abc")\`, \`.match(/regex/)\` |
| collections | \`.have.lengthOf(2)\`, \`.include.members([1, 2])\`, \`.have.property("id", 7)\`, \`.have.all.keys("a", "b")\` |
| errors | \`expect(() => fn()).to.throw(TypeError, /bad/)\` |
| negation | \`.not\` anywhere in the chain |

Install with \`npm i -D chai\` (Chai 5 is ESM-only: use \`import\`).`,
      code: `import { expect } from "chai";

class Cart {
  constructor() { this.items = []; }
  add(sku, qty = 1, price = 0) {
    if (!Number.isInteger(qty) || qty <= 0) throw new RangeError("qty must be a positive integer");
    this.items.push({ sku, qty, price });
    return this;
  }
  get total() { return this.items.reduce((s, i) => s + i.qty * i.price, 0); }
}

describe("Cart", () => {
  it("adds items and computes the total", () => {
    const cart = new Cart().add("A", 2, 0.1).add("B", 1, 0.2);
    expect(cart.items).to.have.lengthOf(2);
    expect(cart.items[0]).to.deep.equal({ sku: "A", qty: 2, price: 0.1 });
    expect(cart.total).to.be.closeTo(0.4, 1e-9);         // floating point safe
  });

  it("exposes items with the expected shape", () => {
    const [item] = new Cart().add("C", 3).items;
    expect(item).to.have.all.keys("sku", "qty", "price");
    expect(item).to.have.property("qty").that.is.a("number").and.above(2);
  });

  it("rejects invalid quantities", () => {
    expect(() => new Cart().add("A", 0)).to.throw(RangeError, /positive integer/);
    expect(() => new Cart().add("A", 1.5)).to.throw();
    expect(() => new Cart().add("A", 1)).not.to.throw();
  });
});`,
      codeLabel: 'cart.test.mjs — expect-style assertions',
      keyPoints: [
        'Use `equal` for primitives and `deep.equal` / `eql` for objects and arrays.',
        'Use `closeTo` for floating-point comparisons.',
        'Pass a function to `expect(...).to.throw()` — not the result of calling it.',
        'Chains read like sentences; `.not` negates any assertion.',
      ],
    },
    {
      title: 'Hooks: before, after, beforeEach, afterEach',
      after: 'Assertions with Chai',
      content: `Hooks set up and tear down state around tests.

| Hook | Runs |
|---|---|
| \`before\` | once, before the first test in the \`describe\` |
| \`beforeEach\` | before every test in the block (and nested blocks) |
| \`afterEach\` | after every test — even failed ones |
| \`after\` | once, after the last test in the block |

### Order with nesting

Outer \`beforeEach\` runs before inner \`beforeEach\`; \`afterEach\` runs inner first. Hooks at the top level of a file (outside any \`describe\`) apply to **all** files — prefer **root hook plugins** (\`--require hooks.mjs\` exporting \`mochaHooks\`) for global setup.

### Rules of thumb

- Create fresh state in \`beforeEach\` so tests are independent and order-agnostic.
- Use \`before\`/\`after\` for expensive shared resources (a server, a DB connection).
- Don't use arrow functions if you need \`this\` (e.g. \`this.timeout()\`, \`this.currentTest\`).`,
      code: `import { expect } from "chai";

const log = [];

class InMemoryRepo {
  constructor() { this.rows = new Map(); this.nextId = 1; }
  insert(row) { const id = this.nextId++; this.rows.set(id, { id, ...row }); return id; }
  find(id) { return this.rows.get(id) ?? null; }
}

describe("InMemoryRepo", function () {
  let repo;

  before(() => log.push("before: connect"));
  after(() => {
    log.push("after: disconnect");
    console.log("      hook order:", log.join(" | "));
  });

  beforeEach(function () {
    repo = new InMemoryRepo();                       // fresh state for every test
    repo.insert({ name: "seed" });
    log.push("beforeEach");
  });

  afterEach(function () {
    log.push(\`afterEach(\${this.currentTest.state})\`);
  });

  it("finds the seeded row", () => {
    expect(repo.find(1)).to.include({ name: "seed" });
  });

  it("starts each test with exactly one row", () => {
    repo.insert({ name: "extra" });
    expect(repo.rows.size).to.equal(2);
  });

  describe("missing rows", () => {
    beforeEach(() => log.push("inner beforeEach"));
    it("returns null", () => expect(repo.find(99)).to.be.null);
  });
});`,
      codeLabel: 'repo.test.mjs — fresh state per test',
      keyPoints: [
        '`beforeEach` gives every test a clean fixture, keeping tests independent.',
        '`afterEach` and `after` run even when tests fail — use them to clean up.',
        'Nested `describe` blocks inherit outer hooks.',
        'Use `function () {}` instead of arrows when you need Mocha\'s `this`.',
      ],
    },
    {
      title: 'Timeouts, Retries & Slow Tests',
      after: 'Asynchronous Testing',
      content: `Mocha fails a test that takes longer than **2000 ms** by default and highlights tests slower than **75 ms**.

| Setting | Scope | How |
|---|---|---|
| Timeout | global | \`--timeout 5000\` or \`timeout: 5000\` in \`.mocharc\` |
| Timeout | suite / test | \`this.timeout(5000)\` (needs \`function\`, not arrow) |
| Disable timeout | debugging | \`this.timeout(0)\` |
| Slow threshold | any | \`this.slow(300)\` / \`--slow 300\` |
| Retries | suite / test | \`this.retries(2)\` / \`--retries 2\` |

Retries help with genuinely flaky **external** dependencies (end-to-end tests), but they hide real bugs in unit tests — fix flakiness instead. For timers, use **fake timers** (Sinon) rather than real waits.`,
      code: `import { expect } from "chai";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let attempts = 0;
async function flakyService() {
  attempts += 1;
  if (attempts < 3) throw new Error(\`temporary failure #\${attempts}\`);
  return "ok";
}

describe("timing controls", function () {
  this.slow(200);                       // mark tests > 200ms as slow (yellow/red)

  it("allows a longer timeout for a slow operation", async function () {
    this.timeout(3000);
    await sleep(250);
    expect(true).to.be.true;
  });

  it("retries a flaky external call", async function () {
    this.retries(2);                    // up to 3 attempts in total
    expect(await flakyService()).to.equal("ok");
  });

  it("reports the attempts it took", () => {
    expect(attempts).to.equal(3);
  });
});`,
      codeLabel: 'timing.test.mjs — timeout, slow and retries',
      keyPoints: [
        'Default timeout is 2 s; raise it per test with `this.timeout(ms)`.',
        '`this.retries(n)` re-runs failing tests — use only for external flakiness.',
        '`this.slow(ms)` tunes when a test is reported as slow.',
        'Prefer fake timers over real sleeps to keep the suite fast.',
      ],
    },
    {
      title: 'Spies, Stubs & Fake Timers with Sinon',
      after: 'Timeouts, Retries & Slow Tests',
      content: `**Sinon** (\`npm i -D sinon\`) isolates the unit under test from its collaborators.

| Tool | Purpose | Example |
|---|---|---|
| **spy** | records calls, keeps behaviour | \`sinon.spy(obj, "method")\` |
| **stub** | replaces behaviour | \`.returns(42)\`, \`.resolves(data)\`, \`.rejects(err)\`, \`.throws()\` |
| **fake** | standalone spy/stub function | \`sinon.fake.resolves({})\` |
| **fake timers** | control \`setTimeout\`, \`Date\` | \`sinon.useFakeTimers()\` + \`clock.tick(ms)\` |
| **sandbox** | restore everything at once | \`sinon.restore()\` in \`afterEach\` |

### Assertions on calls

\`stub.calledOnce\`, \`stub.calledWith("a")\`, \`stub.firstCall.args\`, \`stub.callCount\`, or \`sinon.assert.calledWithExactly(stub, ...)\` for helpful failure messages.

Always **restore** stubs after each test so they don't leak into others.`,
      code: `import { expect } from "chai";
import sinon from "sinon";

// Code under test
const emailClient = { async send(to, subject) { throw new Error("real network call!"); } };
const userRepo = { async findById(id) { throw new Error("real DB call!"); } };

async function sendWelcome(userId) {
  const user = await userRepo.findById(userId);
  if (!user) return false;
  await emailClient.send(user.email, \`Welcome, \${user.name}!\`);
  return true;
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

describe("sendWelcome()", () => {
  afterEach(() => sinon.restore());

  it("emails an existing user", async () => {
    sinon.stub(userRepo, "findById").resolves({ name: "Ada", email: "ada@example.com" });
    const send = sinon.stub(emailClient, "send").resolves();

    expect(await sendWelcome(7)).to.be.true;
    sinon.assert.calledOnceWithExactly(send, "ada@example.com", "Welcome, Ada!");
    expect(userRepo.findById.firstCall.args).to.deep.equal([7]);
  });

  it("skips unknown users", async () => {
    sinon.stub(userRepo, "findById").resolves(null);
    const send = sinon.stub(emailClient, "send");
    expect(await sendWelcome(99)).to.be.false;
    expect(send.called).to.be.false;
  });
});

describe("debounce()", () => {
  let clock;
  beforeEach(() => { clock = sinon.useFakeTimers(); });
  afterEach(() => clock.restore());

  it("calls once after the quiet period", () => {
    const spy = sinon.spy();
    const run = debounce(spy, 300);
    run("a"); clock.tick(100); run("b"); clock.tick(299);
    expect(spy.called).to.be.false;
    clock.tick(1);
    sinon.assert.calledOnceWithExactly(spy, "b");
  });
});`,
      codeLabel: 'notify.test.mjs — stubs and fake timers',
      keyPoints: [
        'Spies observe calls; stubs replace behaviour; fakes are standalone test doubles.',
        'Stub network, DB and email boundaries so unit tests stay fast and deterministic.',
        'Fake timers let you test debounce, retries and timeouts instantly.',
        'Call `sinon.restore()` in `afterEach` so stubs never leak.',
      ],
    },
    {
      title: 'Testing HTTP APIs',
      after: 'Spies, Stubs & Fake Timers with Sinon',
      content: `For API tests, start the server on a **random free port** in \`before\`, call it over HTTP, and close it in \`after\`.

| Approach | Notes |
|---|---|
| Built-in \`fetch\` (Node 18+) | zero dependencies, as below |
| **supertest** | \`request(app).get("/users").expect(200)\` — no port needed for Express apps |
| **chai-http** | \`chai.request(app)\` with Chai assertions |

### Test what a client sees

- Status codes, headers (\`content-type\`, \`location\`), JSON body shape.
- Error paths: 400/404/422 with useful messages.
- Isolate data per test (reset the in-memory store, or wrap DB work in transactions).`,
      code: `import { expect } from "chai";
import http from "node:http";

// App under test: tiny JSON API on node:http
function createApp() {
  const todos = [];
  return http.createServer(async (req, res) => {
    const send = (status, body, headers = {}) => {
      res.writeHead(status, { "content-type": "application/json", ...headers });
      res.end(JSON.stringify(body));
    };
    if (req.method === "GET" && req.url === "/todos") return send(200, todos);
    if (req.method === "POST" && req.url === "/todos") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      const { title } = JSON.parse(raw || "{}");
      if (!title) return send(422, { error: "title is required" });
      const todo = { id: todos.length + 1, title, done: false };
      todos.push(todo);
      return send(201, todo, { location: \`/todos/\${todo.id}\` });
    }
    send(404, { error: "not found" });
  });
}

describe("Todos API", () => {
  let server, baseUrl;

  before((done) => {
    server = createApp().listen(0, () => {          // port 0 = random free port
      baseUrl = \`http://127.0.0.1:\${server.address().port}\`;
      done();
    });
  });
  after((done) => server.close(done));

  it("creates a todo", async () => {
    const res = await fetch(\`\${baseUrl}/todos\`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Write tests" }),
    });
    expect(res.status).to.equal(201);
    expect(res.headers.get("location")).to.equal("/todos/1");
    expect(await res.json()).to.deep.equal({ id: 1, title: "Write tests", done: false });
  });

  it("validates input", async () => {
    const res = await fetch(\`\${baseUrl}/todos\`, { method: "POST", body: "{}" });
    expect(res.status).to.equal(422);
    expect(await res.json()).to.have.property("error").that.includes("title");
  });

  it("lists todos and 404s unknown routes", async () => {
    expect(await (await fetch(\`\${baseUrl}/todos\`)).json()).to.have.lengthOf(1);
    expect((await fetch(\`\${baseUrl}/nope\`)).status).to.equal(404);
  });
});`,
      codeLabel: 'api.test.mjs — real HTTP calls against a random port',
      keyPoints: [
        'Listen on port 0 to get a free port and avoid clashes in CI.',
        'Start servers in `before` and close them in `after`.',
        'Assert on status, headers and body — the contract clients depend on.',
        'supertest can test Express apps without opening a port at all.',
      ],
    },
    {
      title: 'Exclusive, Pending & Dynamic Tests',
      after: 'Testing HTTP APIs',
      content: `| Feature | Syntax | Use |
|---|---|---|
| Exclusive | \`it.only\`, \`describe.only\` | run just this while debugging |
| Skip | \`it.skip\`, \`describe.skip\`, \`this.skip()\` | temporarily disable / skip at runtime |
| Pending | \`it("todo")\` with no callback | placeholder shown as pending |
| Dynamic | \`for\` loop / \`forEach\` generating \`it\` calls | table-driven tests |
| Grep | \`mocha --grep "Cart"\` / \`--fgrep\` | run matching tests only |

Use \`--forbid-only\` in CI so a forgotten \`.only\` fails the build instead of silently skipping the rest of the suite.

**Table-driven tests** keep many input/output cases readable and make adding a case a one-line change.`,
      code: `import { expect } from "chai";

function isValidIban(iban) {
  const s = iban.replace(/\\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\\d{2}[A-Z0-9]{11,30}$/.test(s)) return false;
  const rearranged = s.slice(4) + s.slice(0, 4);
  const digits = rearranged.replace(/[A-Z]/g, (c) => (c.charCodeAt(0) - 55).toString());
  return BigInt(digits) % 97n === 1n;
}

const cases = [
  { input: "DE89 3704 0044 0532 0130 00", expected: true },
  { input: "GB82 WEST 1234 5698 7654 32", expected: true },
  { input: "GB82 WEST 1234 5698 7654 33", expected: false },   // bad checksum
  { input: "XX00", expected: false },                          // too short
];

describe("isValidIban()", () => {
  for (const { input, expected } of cases) {
    it(\`returns \${expected} for "\${input}"\`, () => {
      expect(isValidIban(input)).to.equal(expected);
    });
  }

  it("supports country-specific lengths");                     // pending: no callback

  it("skips when an env flag is missing", function () {
    if (!process.env.RUN_SLOW_TESTS) this.skip();              // runtime skip
    expect(isValidIban("NO93 8601 1117 947")).to.be.true;
  });
});`,
      codeLabel: 'iban.test.mjs — table-driven, pending and runtime-skipped tests',
      keyPoints: [
        'Generate tests in a loop for table-driven cases.',
        '`.only` focuses while debugging — guard CI with `--forbid-only`.',
        'A test without a callback is reported as pending.',
        '`this.skip()` skips at runtime based on environment or capability.',
      ],
    },
    {
      title: 'Configuration, Reporters & Coverage',
      after: 'Exclusive, Pending & Dynamic Tests',
      content: `Mocha reads options from \`.mocharc.json\` / \`.mocharc.yml\` / \`.mocharc.cjs\` or the \`"mocha"\` key in \`package.json\`.

| Option | Example | Meaning |
|---|---|---|
| \`spec\` | \`"test/**/*.test.mjs"\` | which files to run |
| \`require\` | \`["test/hooks.mjs"]\` | root hooks / setup |
| \`timeout\`, \`slow\` | \`5000\`, \`100\` | timing defaults |
| \`reporter\` | \`spec\`, \`dot\`, \`min\`, \`json\`, \`mocha-junit-reporter\` | output format |
| \`parallel\`, \`jobs\` | \`true\`, \`4\` | run files in worker processes |
| \`forbid-only\`, \`bail\` | \`true\` | CI safety, stop after first failure |
| \`watch\`, \`watch-files\` | | rerun on change |

**Coverage**: \`npx c8 mocha\` (native V8 coverage, works with ESM) or \`nyc\`. **TypeScript**: \`--import=tsx\` (or \`ts-node/esm\`).

Parallel mode requires tests to be isolated — no shared global state across files, and \`.only\` is not supported.`,
      code: `// .mocharc.json
{
  "spec": ["test/**/*.test.mjs"],
  "require": ["test/hooks.mjs"],
  "timeout": 5000,
  "slow": 100,
  "reporter": "spec",
  "forbid-only": true,
  "parallel": true,
  "jobs": 4
}

// test/hooks.mjs — root hook plugin, runs around every test in every file
export const mochaHooks = {
  beforeAll() { process.env.NODE_ENV = "test"; },
  afterEach() { /* e.g. sinon.restore() */ },
};

// package.json scripts
{
  "scripts": {
    "test": "mocha",
    "test:watch": "mocha --watch --parallel=false",
    "test:ci": "c8 --reporter=lcov --reporter=text --check-coverage --lines 80 mocha --reporter mocha-junit-reporter"
  }
}`,
      codeLabel: '.mocharc.json, root hooks and npm scripts',
      codeLanguage: 'json',
      keyPoints: [
        'Keep options in `.mocharc.*` so `npx mocha` needs no flags.',
        'Root hook plugins (`mochaHooks`) provide global setup that works in parallel mode.',
        'Use `c8` for coverage with ES modules and enforce thresholds in CI.',
        'JUnit reporters integrate results with CI dashboards.',
      ],
    },
  ],
};

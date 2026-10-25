/*
 * JavaScript course extension — extra sections and worked examples merged into
 * courses-data/javascript.js at load time (see src/data/mergeCourse.js).
 * Every `javascript` example runs as-is in the Playground (Web Worker, no DOM).
 */
export default {
  examples: {
    'Variables, Data Types & Type Conversion': [
      {
        title: 'var vs let vs const',
        language: 'javascript',
        code: `// const: binding can't be reassigned (but objects stay mutable)
const config = { debug: false };
config.debug = true;        // ✅ allowed — mutating the object
// config = {};             // ❌ TypeError: Assignment to constant variable

// let: block-scoped, reassignable
let count = 0;
if (true) {
  let count = 10;           // a different variable in this block
  console.log("inner", count);
}
console.log("outer", count);

// var: function-scoped and hoisted (avoid in modern code)
console.log(typeof hoisted); // "undefined" — declaration hoisted, value not
var hoisted = "now defined";

// typeof cheat sheet
console.log(typeof 42, typeof "hi", typeof true, typeof undefined,
            typeof null, typeof {}, typeof [], typeof (() => {}), typeof 10n, typeof Symbol());
console.log(Array.isArray([]));  // the reliable array check`,
        output: `inner 10
outer 0
undefined
number string boolean undefined object object object function bigint symbol
true`,
      },
    ],
    'Type Conversion & Coercion': [
      {
        title: 'Truthy, falsy and equality traps',
        language: 'javascript',
        code: `const falsy = [false, 0, -0, 0n, "", null, undefined, NaN];
console.log(falsy.map(Boolean)); // all false — everything else is truthy

console.log([] == false, "" == 0, null == undefined); // true true true (coercion!)
console.log([] === false, null === undefined);        // false false

console.log("5" + 3, "5" - 3, "5" * "2", +"3.14", +"abc"); // "53" 2 10 3.14 NaN
console.log(Number("42px"), parseInt("42px"), parseFloat("3.5em")); // NaN 42 3.5

// ?? only falls back on null/undefined, || on any falsy value
const qty = 0;
console.log(qty || 10, qty ?? 10); // 10 0

console.log(Number.isNaN(NaN), Object.is(-0, 0)); // true false`,
      },
    ],
    'Functions, Scope & Closures': [
      {
        title: 'Function forms & default/rest parameters',
        language: 'javascript',
        code: `// Declaration (hoisted)
function add(a, b = 0) { return a + b; }

// Expression and arrow
const multiply = function (a, b) { return a * b; };
const square = x => x * x;
const toPoint = (x, y) => ({ x, y });   // wrap object literal in ()

// Rest parameters + spread arguments
const sum = (...nums) => nums.reduce((t, n) => t + n, 0);
const values = [1, 2, 3];

console.log(add(2), multiply(3, 4), square(5), toPoint(1, 2), sum(...values));

// Higher-order function returning a function
const multiplier = factor => n => n * factor;
const triple = multiplier(3);
console.log([1, 2, 3].map(triple));

// IIFE — runs immediately with its own scope
const counter = (() => { let c = 0; return () => ++c; })();
counter(); counter();
console.log("counter:", counter());`,
      },
      {
        title: 'Memoization with a closure',
        language: 'javascript',
        code: `function memoize(fn) {
  const cache = new Map();             // private to the returned function
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowFib = n => (n < 2 ? n : slowFib(n - 1) + slowFib(n - 2));
const fib = memoize(n => (n < 2 ? n : fib(n - 1) + fib(n - 2)));

console.time("memoized");
console.log(fib(90));
console.timeEnd("memoized");

console.time("naive fib(30)");
console.log(slowFib(30));
console.timeEnd("naive fib(30)");`,
      },
    ],
    'Objects & Prototypes': [
      {
        title: 'Object essentials',
        language: 'javascript',
        code: `const user = {
  name: "Ada",
  age: 36,
  address: { city: "London" },
  greet() { return \`Hi, I'm \${this.name}\`; },  // method shorthand
  ["is" + "Admin"]: true,                     // computed key
};

console.log(user.greet(), user.isAdmin);
console.log(Object.keys(user), Object.entries({ a: 1, b: 2 }));

// Optional chaining & nullish coalescing
console.log(user.address?.city, user.company?.name ?? "n/a");

// Shallow vs deep copy
const shallow = { ...user };
const deep = structuredClone({ name: user.name, address: user.address });
shallow.address.city = "Paris";         // also changes user.address!
console.log(user.address.city, deep.address.city); // Paris London

// Freeze for immutability (shallow)
const settings = Object.freeze({ theme: "dark" });
settings.theme = "light";               // silently ignored (throws in strict mode)
console.log(settings.theme);

// Build objects from entries
const prices = { apple: 1, pear: 2 };
console.log(Object.fromEntries(Object.entries(prices).map(([k, v]) => [k, v * 2])));`,
      },
      {
        title: 'Prototype chain under the hood',
        language: 'javascript',
        code: `const animal = {
  speak() { return \`\${this.name} makes a sound\`; },
};

const dog = Object.create(animal);   // dog's prototype is animal
dog.name = "Rex";
dog.bark = function () { return "Woof"; };

console.log(dog.speak());                         // found on the prototype
console.log(Object.getPrototypeOf(dog) === animal); // true
console.log(dog.hasOwnProperty("speak"));         // false — inherited
console.log("speak" in dog);                      // true — checks the chain

// Classes are syntax over the same mechanism
class Cat { meow() { return "Meow"; } }
const c = new Cat();
console.log(Object.getPrototypeOf(c) === Cat.prototype); // true`,
      },
    ],
    'Arrays & Array Methods': [
      {
        title: 'Array methods cheat sheet',
        language: 'javascript',
        code: `const products = [
  { name: "Laptop", price: 1200, category: "tech", stock: 3 },
  { name: "Mouse",  price: 25,   category: "tech", stock: 0 },
  { name: "Desk",   price: 300,  category: "home", stock: 5 },
  { name: "Lamp",   price: 45,   category: "home", stock: 12 },
];

console.log(products.map(p => p.name));                       // transform
console.log(products.filter(p => p.stock > 0).length);        // keep matches
console.log(products.find(p => p.price < 50)?.name);          // first match
console.log(products.findIndex(p => p.name === "Desk"));      // its index
console.log(products.some(p => p.stock === 0));               // any?
console.log(products.every(p => p.price > 10));               // all?
console.log(products.reduce((sum, p) => sum + p.price * p.stock, 0)); // total value

// Group by category with reduce
const byCategory = products.reduce((acc, p) => {
  (acc[p.category] ??= []).push(p.name);
  return acc;
}, {});
console.log(byCategory);

// Non-mutating ES2023 helpers
const sorted = products.toSorted((a, b) => a.price - b.price).map(p => p.name);
console.log(sorted, products[0].name);   // original order untouched

console.log([1, [2, [3, [4]]]].flat(Infinity), [1, 2, 3].at(-1), [..."abc"].includes("b"));`,
      },
    ],
    'Promises': [
      {
        title: 'Retry with exponential backoff',
        language: 'javascript',
        code: `let attempts = 0;
function unreliableRequest() {
  return new Promise((resolve, reject) => {
    attempts++;
    setTimeout(() => (attempts < 3 ? reject(new Error("503")) : resolve("data!")), 20);
  });
}

function retry(fn, { retries = 4, delay = 50 } = {}) {
  return fn().catch(err => {
    if (retries === 0) throw err;
    console.warn(\`failed (\${err.message}), retrying in \${delay}ms\`);
    return new Promise(r => setTimeout(r, delay))
      .then(() => retry(fn, { retries: retries - 1, delay: delay * 2 }));
  });
}

retry(unreliableRequest)
  .then(result => console.log("✅", result, "after", attempts, "attempts"))
  .catch(err => console.error("gave up:", err.message));`,
      },
      {
        title: 'Timeout a promise with Promise.race',
        language: 'javascript',
        code: `const sleep = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));

function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(\`Timed out after \${ms}ms\`)), ms));
  return Promise.race([promise, timeout]);
}

withTimeout(sleep(50, "fast"), 200).then(console.log);
withTimeout(sleep(500, "slow"), 100).catch(e => console.error(e.message));

// Promise.any: first SUCCESS wins (ignores rejections)
Promise.any([Promise.reject(new Error("a")), sleep(30, "mirror-2"), sleep(60, "mirror-3")])
  .then(v => console.log("any:", v));`,
      },
    ],
    'Async / Await': [
      {
        title: 'Sequential vs parallel vs limited concurrency',
        language: 'javascript',
        code: `const fetchUser = id => new Promise(r => setTimeout(() => r({ id, name: "user" + id }), 100));
const ids = [1, 2, 3, 4, 5, 6];

async function sequential() {
  const out = [];
  for (const id of ids) out.push(await fetchUser(id)); // one at a time
  return out;
}

async function parallel() {
  return Promise.all(ids.map(fetchUser));              // all at once
}

async function limited(limit = 2) {                    // at most N in flight
  const results = [];
  let i = 0;
  const worker = async () => {
    while (i < ids.length) {
      const id = ids[i++];
      results.push(await fetchUser(id));
    }
  };
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

for (const [label, fn] of [["sequential", sequential], ["parallel", parallel], ["limit 2", limited]]) {
  const t = performance.now();
  const users = await fn();
  console.log(label.padEnd(10), users.length, "users in", Math.round(performance.now() - t), "ms");
}`,
      },
    ],
    'The Event Loop': [
      {
        title: 'Predict the output',
        language: 'javascript',
        explanation: 'Synchronous code runs first, then **all microtasks** (promise callbacks, `queueMicrotask`), then **one macrotask** (timers), then microtasks again, and so on.',
        code: `console.log("1: sync start");

setTimeout(() => console.log("6: timeout (macrotask)"), 0);

Promise.resolve()
  .then(() => console.log("3: promise 1 (microtask)"))
  .then(() => console.log("5: promise 2 (microtask)"));

queueMicrotask(() => console.log("4: queueMicrotask"));

(async () => {
  console.log("2: async fn body runs synchronously");
})();

console.log("2b: sync end");`,
        output: `1: sync start
2: async fn body runs synchronously
2b: sync end
3: promise 1 (microtask)
4: queueMicrotask
5: promise 2 (microtask)
6: timeout (macrotask)`,
      },
    ],
    'The Fetch API': [
      {
        title: 'Reusable fetch wrapper with timeout & errors',
        language: 'javascript',
        explanation: '`fetch` only rejects on **network** failures — an HTTP 404 or 500 still resolves, so always check `response.ok`. `AbortSignal.timeout()` cancels slow requests.',
        code: `async function api(url, { method = "GET", body, timeout = 8000, headers = {} } = {}) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeout),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(\`HTTP \${response.status} \${response.statusText} \${detail}\`.trim());
  }
  return response.status === 204 ? null : response.json();
}

try {
  const todo = await api("https://jsonplaceholder.typicode.com/todos/1");
  console.log("GET:", todo);

  const created = await api("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: { title: "Hello", userId: 1 },
  });
  console.log("POST:", created);

  await api("https://jsonplaceholder.typicode.com/does-not-exist");
} catch (err) {
  console.error(err.name === "TimeoutError" ? "Request timed out" : err.message);
}`,
      },
    ],
    'JSON & API Responses': [
      {
        title: 'JSON.stringify / parse options',
        language: 'javascript',
        code: `const order = {
  id: 7,
  createdAt: new Date("2026-01-15T10:00:00Z"),
  items: [{ sku: "A1", qty: 2 }],
  secret: "do-not-send",
  total: 49.5,
};

// Replacer array: whitelist keys; third arg pretty-prints
console.log(JSON.stringify(order, ["id", "items", "sku", "qty", "total"], 2));

// Replacer function: drop or transform values
console.log(JSON.stringify(order, (key, value) => (key === "secret" ? undefined : value)));

// Reviver: turn ISO strings back into Date objects
const parsed = JSON.parse(JSON.stringify(order), (key, value) =>
  key === "createdAt" ? new Date(value) : value);
console.log(parsed.createdAt instanceof Date, parsed.createdAt.getUTCFullYear());

// Safe parse
const safeParse = (text, fallback = null) => { try { return JSON.parse(text); } catch { return fallback; } };
console.log(safeParse("{bad json}", { error: true }));`,
      },
    ],
    'ES6+ Modern Features': [
      {
        title: 'Destructuring, spread & shorthand',
        language: 'javascript',
        code: `// Array destructuring with defaults, skipping and rest
const [first, , third = "default", ...others] = ["a", "b", undefined, "d", "e"];
console.log(first, third, others);

// Swap without a temp variable
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y);

// Object destructuring: rename, default, nested, rest
const response = { status: 200, data: { user: { id: 1, name: "Ada" } }, meta: { page: 1 } };
const { status: code, data: { user: { name } }, error = null, ...rest } = response;
console.log(code, name, error, rest);

// In function parameters
const describe = ({ name, role = "dev" }) => \`\${name} (\${role})\`;
console.log(describe({ name: "Linus" }));

// Spread to merge / copy
const defaults = { theme: "light", lang: "en" };
const prefs = { ...defaults, theme: "dark" };
console.log(prefs, [...[1, 2], ...[3, 4]]);

// Logical assignment operators
const opts = { retries: 0 };
opts.retries ||= 3;   // assigns if falsy
opts.timeout ??= 5000; // assigns if null/undefined
console.log(opts);`,
      },
    ],
    'Regular Expressions': [
      {
        title: 'Practical regex recipes',
        language: 'javascript',
        code: `const email = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;
console.log(["ada@dev.io", "bad@", "x@y.co"].map(e => email.test(e)));

// Named capture groups
const dateRe = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;
const { year, month, day } = "Released 2026-10-25".match(dateRe).groups;
console.log(day + "/" + month + "/" + year);

// matchAll for every match with groups
const text = "Contact: @ada, @linus and @grace";
console.log([...text.matchAll(/@(\\w+)/g)].map(m => m[1]));

// replace with a function
console.log("hello world".replace(/\\b\\w/g, c => c.toUpperCase()));

// Strip non-digits / slugify
console.log("+1 (555) 010-9999".replace(/\\D/g, ""));
console.log("  CSS Grid & Flexbox!  ".trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));`,
      },
    ],
    'Error Handling & Debugging': [
      {
        title: 'Error cause chains & finally',
        language: 'javascript',
        code: `class NotFoundError extends Error {
  constructor(resource, options) {
    super(\`\${resource} not found\`, options);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

function loadUser(id) {
  try {
    if (id !== 1) throw new Error("row missing in users table");
    return { id };
  } catch (err) {
    // Wrap low-level errors but keep the original as .cause
    throw new NotFoundError(\`User \${id}\`, { cause: err });
  }
}

for (const id of [1, 2]) {
  try {
    console.log("loaded", loadUser(id));
  } catch (err) {
    console.error(\`\${err.name} (\${err.status}): \${err.message}\`);
    console.error("  caused by:", err.cause.message);
  } finally {
    console.log("  cleanup for id", id);
  }
}`,
      },
    ],
  },

  sections: [
    {
      title: 'Strings & Template Literals',
      after: 'Type Conversion & Coercion',
      content: `Strings are **immutable** sequences of UTF-16 code units. Every string method returns a **new** string — the original never changes.

### Creating strings

Single quotes, double quotes and **template literals** (backticks) all create strings. Template literals add \`\${expression}\` interpolation and multi-line text.

### Most-used methods

| Task | Method |
|---|---|
| Search | \`includes()\`, \`startsWith()\`, \`endsWith()\`, \`indexOf()\` |
| Extract | \`slice(start, end)\`, \`at(-1)\`, \`substring()\` |
| Transform | \`toUpperCase()\`, \`toLowerCase()\`, \`trim()\`, \`padStart()\`, \`repeat()\` |
| Split / join | \`split(",")\` → array, \`array.join(", ")\` → string |
| Replace | \`replace()\` (first), \`replaceAll()\` (every match) |
| Compare | \`localeCompare()\` for correct alphabetical sorting |

### Tagged templates

A function placed before a template literal receives the raw string parts and values separately — used by libraries for safe SQL, GraphQL queries and CSS-in-JS.

### Unicode gotcha

Emoji and some characters take **two** code units, so \`"👍".length\` is 2. Use \`[...str]\` or \`Intl.Segmenter\` to count user-perceived characters.`,
      code: `const name = "Ada";
const items = 3;

// Interpolation + expressions + multi-line
const message = \`Hello \${name},
you have \${items} item\${items === 1 ? "" : "s"} in your cart.\`;
console.log(message);

const s = "  JavaScript is fun  ";
console.log(s.trim().toUpperCase());
console.log(s.includes("fun"), s.trim().startsWith("Java"));
console.log("2026-10-25".split("-"), ["a", "b"].join(" + "));
console.log("5".padStart(3, "0"), "ab".repeat(3), "file.test.js".slice(-3));
console.log("a-b-c".replaceAll("-", "/"), "price: 10".at(-1));

// Tagged template: escape interpolated values
const escapeHtml = (strings, ...values) =>
  strings.reduce((out, str, i) =>
    out + str + (i < values.length ? String(values[i]).replace(/[<>&"]/g, c => "&#" + c.charCodeAt(0) + ";") : ""), "");
console.log(escapeHtml\`<p>\${"<script>alert(1)</script>"}</p>\`);

// Locale-aware sorting & formatting
console.log(["été", "zebra", "apple"].sort((a, b) => a.localeCompare(b)));
console.log(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(1234.5));
console.log([..."👍🏽ok"].length, "👍".length);`,
      codeLabel: 'String toolkit',
      keyPoints: [
        'Strings are immutable — methods always return a new string.',
        'Template literals support interpolation, expressions and multi-line text.',
        'Use replaceAll, padStart, at(-1) and localeCompare for common tasks.',
        'Tagged templates let a function process template parts safely.',
        'Emoji may count as 2 in .length; spread the string to count characters.',
      ],
    },
    {
      title: 'Loops & Iteration',
      after: 'Functions, Scope & Closures',
      content: `JavaScript has several ways to repeat work. Choosing the right one makes intent obvious.

| Loop | Iterates over | Use when |
|---|---|---|
| \`for (let i = 0; …; i++)\` | indexes | you need the index or custom stepping |
| \`for…of\` | **values** of any iterable (array, string, Map, Set) | the default choice for arrays |
| \`for…in\` | **keys** of an object (incl. inherited) | rarely — prefer \`Object.keys/entries\` |
| \`while\` / \`do…while\` | until a condition fails | unknown number of iterations |
| \`array.forEach()\` | array items via callback | side effects only (cannot \`break\`) |
| \`map/filter/reduce\` | array → new value | transforming data |

### Control flow inside loops

\`break\` exits the loop, \`continue\` skips to the next iteration, and **labels** let you break out of nested loops.

### Async loops

\`await\` works inside \`for…of\` (runs sequentially) but **not** inside \`forEach\` — the callback's promise is ignored. Use \`for…of\` or \`Promise.all(array.map(...))\`.`,
      code: `const langs = ["JS", "Python", "Java"];

for (let i = 0; i < langs.length; i++) console.log(i, langs[i]);

for (const lang of langs) console.log("of:", lang);

for (const [index, lang] of langs.entries()) console.log("entries:", index, lang);

const scores = { ana: 90, ben: 72 };
for (const [name, score] of Object.entries(scores)) console.log(name, score);

let n = 0;
while (n < 3) n++;
console.log("while ended at", n);

// break out of nested loops with a label
outer: for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    if (row * col === 2) { console.log("found at", row, col); break outer; }
    if (col === row) continue;
  }
}

// Sequential async iteration
const wait = ms => new Promise(r => setTimeout(r, ms));
for (const ms of [30, 10]) {
  await wait(ms);
  console.log("waited", ms);
}`,
      codeLabel: 'Every loop form',
      keyPoints: [
        'for…of iterates values; for…in iterates keys — prefer for…of for arrays.',
        'forEach cannot break and ignores await; use for…of instead.',
        'Object.entries() + destructuring is the cleanest way to loop objects.',
        'Labels let break/continue target an outer loop.',
      ],
    },
    {
      title: 'this, call, apply & bind',
      after: 'Objects & Prototypes',
      content: `\`this\` is decided by **how a function is called**, not where it is written. This is one of the most common sources of JavaScript bugs.

| Call style | \`this\` is… |
|---|---|
| \`obj.method()\` | \`obj\` |
| \`fn()\` (plain call) | \`undefined\` in strict mode / modules (global object in sloppy mode) |
| \`new Fn()\` | the newly created object |
| \`fn.call(ctx, a, b)\` / \`fn.apply(ctx, [a, b])\` | \`ctx\` |
| \`fn.bind(ctx)\` | returns a new function permanently bound to \`ctx\` |
| Arrow function | **inherited** from the surrounding scope (never its own) |
| DOM event handler (\`function\`) | the element the listener is attached to |

### The classic bug

Passing a method as a callback (\`setTimeout(obj.method)\`) detaches it from \`obj\`, so \`this\` is lost. Fix it with an arrow wrapper, \`bind\`, or a class field arrow function.

### Arrow functions are not methods

Do not use arrows for object methods that need \`this\` — they capture the outer \`this\` instead.`,
      code: `"use strict";
const counter = {
  count: 0,
  increment() { this.count++; return this.count; },
  incrementLater() {
    setTimeout(() => {           // arrow keeps this = counter
      this.count++;
      console.log("later:", this.count);
    }, 10);
  },
};

console.log(counter.increment());          // 1

const detached = counter.increment;
try { detached(); } catch (e) { console.error("detached:", e.message); } // this is undefined

const bound = counter.increment.bind(counter);
console.log("bound:", bound());            // 2
counter.incrementLater();                  // later: 3

// call / apply borrow a method with an explicit this
function introduce(greeting, punct) { return \`\${greeting}, I'm \${this.name}\${punct}\`; }
const ada = { name: "Ada" };
console.log(introduce.call(ada, "Hi", "!"));
console.log(introduce.apply(ada, ["Hello", "."]));

// Class field arrow = auto-bound method
class Button {
  label = "Save";
  handleClick = () => \`clicked \${this.label}\`;
}
const { handleClick } = new Button();
console.log(handleClick());`,
      codeLabel: 'How this is resolved',
      keyPoints: [
        'this depends on the call site, not the definition.',
        'Arrow functions inherit this lexically — great for callbacks, bad for methods.',
        'bind returns a new permanently-bound function; call/apply invoke immediately.',
        'Passing obj.method as a callback loses this — wrap it or bind it.',
      ],
    },
    {
      title: 'Classes & Inheritance',
      after: 'this, call, apply & bind',
      content: `ES2015 **classes** are syntax over prototypes that make object-oriented code clearer. Modern JavaScript adds private fields, static blocks and more.

### Class features

| Feature | Syntax |
|---|---|
| Constructor | \`constructor(name) { this.name = name; }\` |
| Public field | \`count = 0;\` |
| Private field / method | \`#balance = 0;\`, \`#validate() {}\` — truly inaccessible from outside |
| Getter / setter | \`get fullName() {}\`, \`set fullName(v) {}\` |
| Static member | \`static create() {}\`, \`static #instances = 0;\` |
| Inheritance | \`class Admin extends User\` + \`super(...)\` |
| Brand check | \`#balance in obj\` |

### Rules of \`extends\`

A subclass constructor **must call \`super()\`** before touching \`this\`. Methods can call the parent implementation with \`super.method()\`.

### Composition over inheritance

Deep hierarchies become rigid. Often it is simpler to compose small objects or functions (mixins) — see the OOP course for the full discussion.`,
      code: `class BankAccount {
  static #count = 0;            // private static
  #balance = 0;                 // private instance field
  owner;

  constructor(owner, initial = 0) {
    this.owner = owner;
    this.deposit(initial);
    BankAccount.#count++;
  }

  deposit(amount) {
    this.#assertPositive(amount);
    this.#balance += amount;
    return this;                // enables chaining
  }

  withdraw(amount) {
    this.#assertPositive(amount);
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    return this;
  }

  get balance() { return this.#balance; }
  static get count() { return BankAccount.#count; }

  #assertPositive(n) { if (n <= 0) throw new RangeError("Amount must be positive"); }

  toString() { return \`\${this.owner}: $\${this.#balance}\`; }
}

class SavingsAccount extends BankAccount {
  constructor(owner, initial, rate) {
    super(owner, initial);      // must come first
    this.rate = rate;
  }
  addInterest() { return this.deposit(this.balance * this.rate); }
  toString() { return super.toString() + \` @ \${this.rate * 100}%\`; }
}

const acc = new BankAccount("Ada", 100).deposit(50).withdraw(30);
const sav = new SavingsAccount("Linus", 1000, 0.05).addInterest();
console.log(String(acc), "|", String(sav));
console.log("accounts:", BankAccount.count, sav instanceof BankAccount);
try { acc.withdraw(1e6); } catch (e) { console.error(e.message); }
console.log(acc.balance, acc["#balance"]); // private field is not a normal property`,
      codeLabel: 'Classes with private fields and inheritance',
      keyPoints: [
        'Classes are syntactic sugar over prototypes.',
        '#private fields and methods are enforced by the language.',
        'Subclasses must call super() before using this.',
        'Use getters for computed/read-only properties and static for factory helpers.',
      ],
    },
    {
      title: 'Map, Set & Weak Collections',
      after: 'Arrays & Array Methods',
      content: `Plain objects and arrays are not always the best collections.

| Collection | Keys | Ordered | Use for |
|---|---|---|---|
| \`Object\` | strings/symbols | insertion (mostly) | records, JSON |
| \`Map\` | **any value** (objects too) | insertion | dictionaries, caches, frequent add/remove |
| \`Set\` | unique values | insertion | de-duplication, membership tests |
| \`WeakMap\` | objects only, weakly held | no | private data / metadata without memory leaks |
| \`WeakSet\` | objects only, weakly held | no | "has this object been seen?" flags |

### Why Map over Object for dictionaries?

\`Map\` has a reliable \`size\`, accepts any key type, has no prototype keys to collide with (\`"constructor"\`), and is faster for frequent insertions and deletions.

### Set operations

Modern engines support \`union\`, \`intersection\`, \`difference\` and \`isSubsetOf\` directly on \`Set\`.

### Weak collections

Entries in a \`WeakMap\` do not prevent their key object from being garbage collected — ideal for caching data about DOM nodes or objects you do not own.`,
      code: `// Map
const visits = new Map();
const pages = ["/", "/docs", "/", "/blog", "/"];
for (const p of pages) visits.set(p, (visits.get(p) ?? 0) + 1);
console.log(visits, visits.size, visits.has("/docs"));
console.log([...visits].sort((a, b) => b[1] - a[1])[0]); // most visited

const objKey = { id: 1 };
const meta = new Map([[objKey, "object as key"]]);
console.log(meta.get(objKey));

// Set
const tags = new Set(["js", "css", "js", "html"]);
console.log([...tags], tags.size);
const a = new Set([1, 2, 3]), b = new Set([2, 3, 4]);
if (a.intersection) {
  console.log([...a.union(b)], [...a.intersection(b)], [...a.difference(b)]);
} else {
  console.log([...a].filter(x => b.has(x))); // fallback intersection
}

// WeakMap for private per-object data
const privateData = new WeakMap();
class User {
  constructor(name, password) { privateData.set(this, { password }); this.name = name; }
  check(pw) { return privateData.get(this).password === pw; }
}
const u = new User("ada", "s3cret");
console.log(u.check("s3cret"), Object.keys(u));`,
      codeLabel: 'Collections in practice',
      keyPoints: [
        'Use Map for dictionaries with dynamic or non-string keys.',
        'Set gives O(1) membership checks and easy de-duplication.',
        'Weak collections hold keys weakly — no memory leaks for metadata.',
        'Convert with [...map], new Map(Object.entries(obj)) and Object.fromEntries(map).',
      ],
    },
    {
      title: 'Modules (import / export)',
      after: 'ES6+ Modern Features',
      content: `**ES modules** split code into files with explicit dependencies. Each module has its own scope, runs in strict mode and is evaluated once (then cached).

### Export styles

- **Named exports** — many per file, imported by exact name: \`export const sum = …\` / \`import { sum } from "./math.js"\`.
- **Default export** — one per file, imported with any name: \`export default class Logger\` / \`import Logger from "./logger.js"\`.

Prefer named exports in libraries and shared code — they are easier to refactor and auto-import.

### Dynamic import

\`await import("./heavy.js")\` loads a module **on demand**, returning a promise. Bundlers (Vite, webpack) turn this into a separate chunk — exactly how this site lazy-loads each course.

### In the browser

Use \`<script type="module" src="main.js">\`. Module scripts are deferred, use CORS, and require full relative paths with extensions (\`./utils.js\`). Node.js uses ES modules when \`"type": "module"\` is set in package.json or the file ends in \`.mjs\`.

### CommonJS (legacy Node)

Older Node code uses \`require()\` / \`module.exports\`. You will still see it in configuration files and older packages.`,
      code: `// ── math.js ───────────────────────────────
export const PI = 3.14159;
export function area(r) { return PI * r * r; }
export default function sum(...n) { return n.reduce((a, b) => a + b, 0); }

// ── logger.js ─────────────────────────────
const levels = ["debug", "info", "warn", "error"];
export class Logger {
  constructor(level = "info") { this.min = levels.indexOf(level); }
  log(level, msg) { if (levels.indexOf(level) >= this.min) console[level](msg); }
}

// ── index.js (barrel file re-exporting) ───
export * from "./math.js";
export { Logger as default } from "./logger.js";

// ── app.js ────────────────────────────────
import sum, { area, PI as pi } from "./math.js";   // default + named + rename
import * as math from "./math.js";                  // namespace import
import Logger from "./index.js";

console.log(sum(1, 2, 3), area(2), pi, math.PI);

// Lazy-load only when needed (separate chunk)
button.addEventListener("click", async () => {
  const { renderChart } = await import("./chart.js");
  renderChart(data);
});

// ── CommonJS equivalent (Node legacy) ─────
// const { area } = require("./math.cjs");
// module.exports = { area };`,
      codeLabel: 'Module patterns',
      keyPoints: [
        'Named exports are explicit and refactor-friendly; one default export per file.',
        'Modules are strict, scoped, and evaluated once.',
        'import() loads code on demand and enables code splitting.',
        'Browsers need type="module" and full relative paths with extensions.',
      ],
    },
    {
      title: 'Iterators & Generators',
      after: 'Modules (import / export)',
      content: `An **iterable** is any object with a \`[Symbol.iterator]()\` method that returns an **iterator** — an object with \`next()\` returning \`{ value, done }\`. Arrays, strings, Maps, Sets and NodeLists are iterable, which is why they work with \`for…of\`, spread and destructuring.

### Generators

A \`function*\` returns a generator: it **pauses** at each \`yield\` and resumes on the next \`next()\` call. This makes it easy to write lazy sequences — values are computed only when requested, so even infinite sequences are fine.

### Async generators

\`async function*\` + \`for await…of\` iterate over values that arrive over time — paginated API results, streams, or events.

### Iterator helpers

Modern engines add lazy helpers directly on iterators: \`.map()\`, \`.filter()\`, \`.take()\`, \`.drop()\`, \`.toArray()\`.`,
      code: `// Custom iterable range
class Range {
  constructor(start, end, step = 1) { Object.assign(this, { start, end, step }); }
  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i += this.step) yield i;
  }
}
console.log([...new Range(0, 10, 2)]);

// Infinite, lazy ID generator
function* idGenerator(prefix = "id") {
  let n = 1;
  while (true) yield \`\${prefix}-\${n++}\`;
}
const ids = idGenerator("user");
console.log(ids.next().value, ids.next().value);

// Manual iteration protocol
const it = ["a", "b"][Symbol.iterator]();
console.log(it.next(), it.next(), it.next());

// Async generator: paginated API
async function* fetchPages(totalPages) {
  for (let page = 1; page <= totalPages; page++) {
    await new Promise(r => setTimeout(r, 20));      // simulate network
    yield { page, items: [page * 10, page * 10 + 1] };
  }
}
for await (const { page, items } of fetchPages(3)) {
  console.log("page", page, items);
}

// Iterator helpers (if supported)
if (typeof Iterator !== "undefined" && Iterator.prototype.take) {
  console.log(idGenerator("n").filter((_, i) => i % 2 === 0).take(3).toArray());
}`,
      codeLabel: 'Iterables, generators and async generators',
      keyPoints: [
        'Anything with [Symbol.iterator] works with for…of, spread and destructuring.',
        'Generators pause at yield — perfect for lazy and infinite sequences.',
        'Async generators + for await…of handle paginated or streaming data.',
      ],
    },
    {
      title: 'Events & Event Delegation',
      after: 'DOM Manipulation',
      content: `Browser interaction is event driven. \`addEventListener(type, handler, options)\` registers a handler; the handler receives an **Event** object.

### Propagation

Events travel in three phases: **capture** (window → target), **target**, then **bubble** (target → window). Most handlers run in the bubble phase.

| Method / option | Effect |
|---|---|
| \`event.preventDefault()\` | Stop the browser default (form submit, link navigation) |
| \`event.stopPropagation()\` | Stop the event travelling further |
| \`{ once: true }\` | Remove the listener after the first call |
| \`{ passive: true }\` | Promise not to call preventDefault — smoother scrolling |
| \`{ capture: true }\` | Run during the capture phase |
| \`{ signal }\` | Remove the listener when an AbortController aborts |

### Event delegation

Instead of a listener on every list item, attach **one** listener to the parent and use \`event.target.closest(selector)\` to find which child was clicked. It uses less memory and works automatically for items added later.

### Custom events

\`new CustomEvent("cart:add", { detail: {...}, bubbles: true })\` lets components communicate without tight coupling.`,
      code: `<ul id="todo-list">
  <li data-id="1">Learn events <button class="delete">✕</button></li>
  <li data-id="2">Use delegation <button class="delete">✕</button></li>
</ul>
<button id="add">Add item</button>
<p id="log"></p>

<script>
  const list = document.getElementById('todo-list');
  const log = (msg) => (document.getElementById('log').textContent = msg);

  // ONE listener handles clicks for current and future items
  list.addEventListener('click', (event) => {
    const item = event.target.closest('li');
    if (!item) return;
    if (event.target.matches('.delete')) {
      item.remove();
      log('Deleted #' + item.dataset.id);
    } else {
      item.classList.toggle('done');
      log('Toggled #' + item.dataset.id);
    }
  });

  let next = 3;
  document.getElementById('add').addEventListener('click', () => {
    list.insertAdjacentHTML('beforeend',
      '<li data-id="' + next + '">Item ' + next++ + ' <button class="delete">✕</button></li>');
  });

  // Listener cleanup with AbortController
  const controller = new AbortController();
  window.addEventListener('resize', () => log('resized'), { signal: controller.signal, passive: true });
  // controller.abort();  // removes the listener

  // Custom event
  list.addEventListener('todo:done', (e) => log('Custom event: ' + e.detail.id));
  list.dispatchEvent(new CustomEvent('todo:done', { detail: { id: 1 } }));
</script>`,
      codeLabel: 'Delegation, options and custom events (HTML)',
      codeLanguage: 'html',
      keyPoints: [
        'Events capture down, then bubble up through the DOM.',
        'Delegation: one parent listener + event.target.closest().',
        'Use { once, passive, signal } options for cleaner listeners.',
        'preventDefault stops browser behaviour; stopPropagation stops bubbling.',
      ],
    },
    {
      title: 'Common Patterns & Interview Snippets',
      after: 'Error Handling & Debugging',
      content: `Small utilities that appear constantly in real projects — and in interviews. Each is runnable in the Playground.

| Pattern | Solves |
|---|---|
| **Debounce** | Run only after the user *stops* typing/resizing |
| **Throttle** | Run at most once every N ms during continuous events (scroll) |
| **Memoize** | Cache results of expensive pure functions |
| **Deep clone** | \`structuredClone()\` copies nested objects, Maps, Dates |
| **once** | Ensure initialisation runs a single time |
| **pipe / compose** | Build data transformations from small functions |
| **Event emitter** | Pub/sub between decoupled parts of an app |
| **Sleep** | \`await sleep(ms)\` in async code |`,
      code: `const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const throttle = (fn, ms) => { let last = 0; return (...a) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...a); } }; };
const once = fn => { let done = false, result; return (...a) => (done ? result : ((done = true), (result = fn(...a)))); };
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
const range = (start, end) => Array.from({ length: end - start }, (_, i) => start + i);
const uniqueBy = (arr, key) => [...new Map(arr.map(x => [x[key], x])).values()];

class EventEmitter {
  #handlers = new Map();
  on(evt, fn) { (this.#handlers.get(evt) ?? this.#handlers.set(evt, new Set()).get(evt)).add(fn); return () => this.off(evt, fn); }
  off(evt, fn) { this.#handlers.get(evt)?.delete(fn); }
  emit(evt, ...args) { this.#handlers.get(evt)?.forEach(fn => fn(...args)); }
}

// Demo
const init = once(() => { console.log("initialised"); return 42; });
init(); init();

const slugify = pipe(s => s.trim(), s => s.toLowerCase(), s => s.replace(/[^a-z0-9]+/g, "-"));
console.log(slugify("  Hello World JS  "));

console.log(chunk(range(0, 7), 3));
console.log(uniqueBy([{ id: 1, v: "a" }, { id: 1, v: "b" }, { id: 2, v: "c" }], "id"));

const bus = new EventEmitter();
const unsubscribe = bus.on("login", user => console.log("welcome", user));
bus.emit("login", "ada");
unsubscribe();
bus.emit("login", "nobody");      // no output

const original = { date: new Date(0), nested: { list: [1, 2] }, map: new Map([["k", 1]]) };
const copy = structuredClone(original);
copy.nested.list.push(3);
console.log(original.nested.list, copy.nested.list, copy.date instanceof Date);

const log = debounce(v => console.log("debounced:", v), 50);
log(1); log(2); log(3);
await sleep(100);
const t = throttle(v => console.log("throttled:", v), 1000);
t("first"); t("ignored");`,
      codeLabel: 'Utility toolbox',
      keyPoints: [
        'Debounce waits for quiet; throttle limits frequency.',
        'structuredClone is the built-in deep copy.',
        'Closures power once, memoize, debounce and throttle.',
        'A tiny EventEmitter decouples producers from consumers.',
      ],
    },
  ],
};

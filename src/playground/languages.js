/*
 * Playground language registry. Each language has a list of examples; the
 * first one is the default code. `runnable: false` languages are editable with
 * highlighting and link out to an official online runner.
 */

export const LANGUAGES = [
  {
    id: 'html',
    label: 'HTML',
    icon: '🌐',
    highlight: 'html',
    runnable: true,
    examples: [
      {
        title: 'Hello card',
        code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: grid;
      place-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
    }
    .card {
      background: white;
      padding: 2rem 3rem;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    h1 { color: #333; margin: 0 0 0.5rem; }
    p { color: #666; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, World! 👋</h1>
    <p>Edit this HTML and press <strong>Run</strong> (Ctrl + Enter).</p>
  </div>
</body>
</html>`,
      },
      {
        title: 'Form with validation',
        code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 420px; margin: 2rem auto; padding: 0 1rem; }
    label { display: block; margin-top: 1rem; font-weight: 600; }
    input, select { width: 100%; padding: .55rem; margin-top: .3rem; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; }
    input:invalid:not(:placeholder-shown) { border-color: #ef4444; }
    button { margin-top: 1.25rem; padding: .6rem 1.2rem; background: #0047ab; color: #fff; border: 0; border-radius: 8px; cursor: pointer; }
    #result { margin-top: 1rem; color: #047857; }
  </style>
</head>
<body>
  <h2>Sign up</h2>
  <form id="signup">
    <label for="name">Name</label>
    <input id="name" name="name" required minlength="2" placeholder="Ada Lovelace">

    <label for="email">Email</label>
    <input id="email" name="email" type="email" required placeholder="ada@example.com">

    <label for="role">Role</label>
    <select id="role" name="role">
      <option>Frontend</option>
      <option>Backend</option>
      <option>Full-stack</option>
    </select>

    <button type="submit">Create account</button>
  </form>
  <p id="result"></p>

  <script>
    document.getElementById('signup').addEventListener('submit', (e) => {
      e.preventDefault(); // stay on the page
      const data = Object.fromEntries(new FormData(e.target));
      document.getElementById('result').textContent = 'Submitted: ' + JSON.stringify(data);
    });
  </script>
</body>
</html>`,
      },
      {
        title: 'Semantic page layout',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; display: grid; min-height: 100vh;
           grid-template: "header header" auto "nav main" 1fr "footer footer" auto / 180px 1fr; }
    header { grid-area: header; background: #0047ab; color: #fff; padding: 1rem; }
    nav    { grid-area: nav; background: #e0e7ff; padding: 1rem; }
    main   { grid-area: main; padding: 1rem; }
    footer { grid-area: footer; background: #1e293b; color: #cbd5e1; padding: .75rem 1rem; }
    @media (max-width: 600px) {
      body { grid-template: "header" "nav" "main" "footer" / 1fr; }
    }
  </style>
</head>
<body>
  <header><h1>My Blog</h1></header>
  <nav aria-label="Main">
    <ul><li><a href="#">Home</a></li><li><a href="#">Posts</a></li></ul>
  </nav>
  <main>
    <article>
      <h2>Why semantic HTML matters</h2>
      <p>Screen readers, search engines and other developers understand your page better.</p>
      <aside><strong>Tip:</strong> resize the preview to see the mobile layout.</aside>
    </article>
  </main>
  <footer>&copy; 2026 My Blog</footer>
</body>
</html>`,
      },
      {
        title: 'DOM events & to-do list',
        code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 420px; margin: 2rem auto; }
    li { display: flex; justify-content: space-between; padding: .4rem 0; border-bottom: 1px solid #e2e8f0; }
    li.done span { text-decoration: line-through; color: #94a3b8; }
    button { cursor: pointer; }
  </style>
</head>
<body>
  <h2>To-do</h2>
  <form id="form"><input id="task" placeholder="New task" required> <button>Add</button></form>
  <ul id="list"></ul>

  <script>
    const list = document.getElementById('list');

    document.getElementById('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('task');
      const li = document.createElement('li');
      li.innerHTML = '<span></span><button aria-label="Delete">✕</button>';
      li.querySelector('span').textContent = input.value; // textContent avoids XSS
      list.appendChild(li);
      input.value = '';
    });

    // Event delegation: one listener handles every item
    list.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      if (e.target.matches('button')) li.remove();
      else li.classList.toggle('done');
    });
  </script>
</body>
</html>`,
      },
      {
        title: 'Canvas drawing',
        code: `<!DOCTYPE html>
<html>
<body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#0f172a">
  <canvas id="c" width="360" height="240" style="background:#fff;border-radius:12px"></canvas>
  <script>
    const ctx = document.getElementById('c').getContext('2d');

    // Bars
    const data = [40, 90, 65, 120, 80];
    data.forEach((v, i) => {
      ctx.fillStyle = \`hsl(\${i * 60}, 70%, 55%)\`;
      ctx.fillRect(30 + i * 62, 200 - v, 44, v);
    });

    // Axis
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(20, 200);
    ctx.lineTo(340, 200);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px system-ui';
    ctx.fillText('Canvas bar chart', 20, 28);
  </script>
</body>
</html>`,
      },
    ],
  },
  {
    id: 'css',
    label: 'CSS',
    icon: '🎨',
    highlight: 'css',
    runnable: true,
    hint: 'The HTML being styled lives in the "HTML structure" comment at the bottom.',
    examples: [
      {
        title: 'Animated gradient box',
        code: `body {
  margin: 0;
  display: grid;
  place-items: center;
  min-height: 100vh;
  background: #0f172a;
  font-family: system-ui, sans-serif;
}

.box {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  border-radius: 24px;
  display: grid;
  place-items: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 25px 50px rgba(139, 92, 246, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

/* HTML structure:
   <div class="box">CSS is Fun!</div>
*/`,
      },
      {
        title: 'Flexbox navbar',
        code: `* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between; /* logo left, links right */
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #0047ab;
  color: white;
  flex-wrap: wrap;
}

.links {
  display: flex;
  gap: 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.links a { color: #e0e7ff; text-decoration: none; }
.links a:hover { color: white; text-decoration: underline; }

/* HTML structure:
   <nav class="nav">
     <strong>Logo</strong>
     <ul class="links">
       <li><a href="#">Home</a></li>
       <li><a href="#">Docs</a></li>
       <li><a href="#">Blog</a></li>
     </ul>
   </nav>
*/`,
      },
      {
        title: 'Responsive grid cards',
        code: `body { margin: 0; padding: 1.5rem; font-family: system-ui, sans-serif; background: #f8fafc; }

.grid {
  display: grid;
  /* As many 180px+ columns as fit; no media queries needed */
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  transition: transform .2s, box-shadow .2s;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -12px rgba(0,0,0,.3); }
.card h3 { margin: 0 0 .25rem; color: #0047ab; }

/* HTML structure:
   <div class="grid">
     <div class="card"><h3>HTML</h3>Structure</div>
     <div class="card"><h3>CSS</h3>Presentation</div>
     <div class="card"><h3>JS</h3>Behaviour</div>
     <div class="card"><h3>A11y</h3>For everyone</div>
   </div>
*/`,
      },
      {
        title: 'CSS variables & dark mode',
        code: `:root {
  --bg: #ffffff;
  --text: #1e293b;
  --accent: #0047ab;
}

@media (prefers-color-scheme: dark) {
  :root { --bg: #0f172a; --text: #e2e8f0; --accent: #60a5fa; }
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, sans-serif;
}

.btn {
  padding: .75rem 1.5rem;
  border: 2px solid var(--accent);
  color: var(--accent);
  background: transparent;
  border-radius: 999px;
  font-weight: 700;
}
.btn:hover { background: var(--accent); color: var(--bg); }

/* HTML structure:
   <div><h1>Theme tokens</h1><button class="btn">Hover me</button></div>
*/`,
      },
    ],
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    icon: '⚡',
    highlight: 'javascript',
    runnable: true,
    hint: 'Runs in an isolated Web Worker — console output appears below. No DOM here; use HTML mode for that.',
    examples: [
      {
        title: 'Basics tour',
        code: `// console.log() output appears in the panel
console.log("Hello, JavaScript! 🚀");

const name = "QuickDevGuide";
console.log(\`Welcome to \${name} — \${new Date().getFullYear()}\`);

// Array methods
const numbers = [1, 2, 3, 4, 5];
console.log("Doubled:", numbers.map(n => n * 2));
console.log("Even:", numbers.filter(n => n % 2 === 0));
console.log("Sum:", numbers.reduce((acc, n) => acc + n, 0));

// Destructuring + spread
const user = { name: "Alice", role: "Developer" };
const { name: userName, ...rest } = user;
console.log(userName, rest);

// Async
setTimeout(() => console.log("✅ Timer fired after 300ms"), 300);`,
      },
      {
        title: 'Closures',
        code: `function createCounter(start = 0) {
  let count = start; // private — only reachable through the closure
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

const a = createCounter();
const b = createCounter(10);
a.increment(); a.increment();
b.decrement();
console.log("a:", a.value(), "b:", b.value()); // a: 2 b: 9

// Classic loop pitfall: let creates a new binding per iteration
const fns = [];
for (let i = 0; i < 3; i++) fns.push(() => i);
console.log(fns.map(f => f())); // [0, 1, 2]`,
      },
      {
        title: 'Promises & async/await',
        code: `const wait = (ms, value) => new Promise(res => setTimeout(() => res(value), ms));
const fail = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error("boom")), ms));

async function main() {
  console.time("sequential");
  await wait(100); await wait(100);
  console.timeEnd("sequential");

  console.time("parallel");
  const results = await Promise.all([wait(100, "A"), wait(100, "B")]);
  console.timeEnd("parallel");
  console.log("all:", results);

  const settled = await Promise.allSettled([wait(50, "ok"), fail(50)]);
  console.log(settled.map(r => r.status));

  try {
    await fail(10);
  } catch (err) {
    console.error("Caught:", err.message);
  }
}

main();`,
      },
      {
        title: 'Classes & inheritance',
        code: `class Shape {
  #id = crypto.randomUUID().slice(0, 8); // private field
  constructor(name) { this.name = name; }
  area() { throw new Error("area() not implemented"); }
  toString() { return \`\${this.name}(\${this.#id}) area=\${this.area().toFixed(2)}\`; }
}

class Circle extends Shape {
  constructor(r) { super("Circle"); this.r = r; }
  area() { return Math.PI * this.r ** 2; }
}

class Rect extends Shape {
  constructor(w, h) { super("Rect"); this.w = w; this.h = h; }
  area() { return this.w * this.h; }
  static square(size) { return new Rect(size, size); }
}

const shapes = [new Circle(2), new Rect(3, 4), Rect.square(5)];
shapes.forEach(s => console.log(String(s))); // polymorphism
console.log(shapes[0] instanceof Shape); // true`,
      },
      {
        title: 'Map, Set & grouping',
        code: `const orders = [
  { id: 1, customer: "ana", total: 30 },
  { id: 2, customer: "ben", total: 12 },
  { id: 3, customer: "ana", total: 55 },
  { id: 4, customer: "cy",  total: 8  },
];

// Unique values with Set
console.log("Customers:", [...new Set(orders.map(o => o.customer))]);

// Totals per customer with Map
const totals = new Map();
for (const { customer, total } of orders) {
  totals.set(customer, (totals.get(customer) ?? 0) + total);
}
console.log(totals);

// Object.groupBy (ES2024)
if (Object.groupBy) {
  console.log(Object.groupBy(orders, o => (o.total >= 20 ? "big" : "small")));
}

// Sort a copy without mutating the original
console.log(orders.toSorted?.((a, b) => b.total - a.total).map(o => o.id));`,
      },
      {
        title: 'Error handling',
        code: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function parseAge(input) {
  const age = Number(input);
  if (Number.isNaN(age)) throw new ValidationError("age", \`"\${input}" is not a number\`);
  if (age < 0) throw new RangeError("Age cannot be negative");
  return age;
}

for (const value of ["42", "abc", "-1"]) {
  try {
    console.log("Parsed:", parseAge(value));
  } catch (err) {
    if (err instanceof ValidationError) console.warn(\`[\${err.field}] \${err.message}\`);
    else console.error(err.name + ": " + err.message);
  } finally {
    console.log("checked", value);
  }
}`,
      },
      {
        title: 'Generators & iterators',
        code: `function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

function* take(iterable, n) {
  for (const x of iterable) {
    if (n-- <= 0) return;
    yield x;
  }
}

console.log([...take(fibonacci(), 10)]);

// Custom iterable object
const range = {
  from: 1, to: 5,
  *[Symbol.iterator]() { for (let i = this.from; i <= this.to; i++) yield i; },
};
console.log([...range]);`,
      },
      {
        title: 'Debounce & throttle',
        code: `function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
}

const search = debounce(q => console.log("debounced search:", q), 150);
["r", "re", "rea", "reac", "react"].forEach((q, i) => setTimeout(() => search(q), i * 30));

const scroll = throttle(i => console.log("throttled scroll", i), 100);
for (let i = 0; i < 10; i++) setTimeout(() => scroll(i), i * 30);`,
      },
    ],
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    icon: '🔷',
    highlight: 'typescript',
    runnable: true,
    hint: 'Transpiled in the browser (types are checked syntactically only), then run in a Web Worker.',
    examples: [
      {
        title: 'Interfaces & generics',
        code: `interface User {
  id: number;
  name: string;
  role: "admin" | "user" | "guest";
  email?: string; // optional
}

function greet(user: User): string {
  return \`Hello \${user.name}! You are a \${user.role}.\`;
}

const alice: User = { id: 1, name: "Alice", role: "admin" };
console.log(greet(alice));

// Generic function with a constraint
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

const users: User[] = [alice, { id: 2, name: "Bob", role: "user" }];
console.log(pluck(users, "name"));`,
      },
      {
        title: 'Utility types',
        code: `interface Todo {
  id: number;
  title: string;
  done: boolean;
  createdAt: Date;
}

type TodoPreview = Pick<Todo, "id" | "title">;
type TodoUpdate = Partial<Omit<Todo, "id" | "createdAt">>;
type ReadonlyTodo = Readonly<Todo>;
type ById = Record<number, TodoPreview>;

function update(todo: Todo, changes: TodoUpdate): Todo {
  return { ...todo, ...changes };
}

const t: Todo = { id: 1, title: "Learn TS", done: false, createdAt: new Date() };
const updated = update(t, { done: true });
const index: ById = { [t.id]: { id: t.id, title: t.title } };

console.log(updated.done, index);`,
      },
      {
        title: 'Discriminated unions',
        code: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.size ** 2;
    case "rect":   return shape.width * shape.height;
    default: {
      const exhaustive: never = shape; // compile error if a case is missing
      return exhaustive;
    }
  }
}

const shapes: Shape[] = [
  { kind: "circle", radius: 1 },
  { kind: "square", size: 3 },
  { kind: "rect", width: 2, height: 5 },
];
shapes.forEach(s => console.log(s.kind, area(s).toFixed(2)));`,
      },
      {
        title: 'Classes & access modifiers',
        code: `abstract class Account {
  private static nextId = 1;
  readonly id = Account.nextId++;
  protected balance = 0;

  constructor(public owner: string) {}

  deposit(amount: number): this {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.balance += amount;
    return this; // fluent API
  }

  abstract monthlyFee(): number;

  get summary(): string {
    return \`#\${this.id} \${this.owner}: \${this.balance - this.monthlyFee()}\`;
  }
}

class Savings extends Account {
  monthlyFee() { return 0; }
}
class Checking extends Account {
  monthlyFee() { return 5; }
}

console.log(new Savings("Ana").deposit(100).summary);
console.log(new Checking("Ben").deposit(50).deposit(25).summary);`,
      },
    ],
  },
  {
    id: 'react',
    label: 'React JSX',
    icon: '⚛️',
    highlight: 'jsx',
    runnable: true,
    hint: 'Define a component named App — it is rendered automatically (React 18). Hooks and memo/lazy/Suspense are available as globals; no imports needed.',
    examples: [
      {
        title: 'Counter & input',
        code: `function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("World");

  return (
    <div style={{ fontFamily: "system-ui", padding: "2rem", textAlign: "center" }}>
      <h1>Hello, {name}! 👋</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ padding: ".5rem", borderRadius: 8, border: "1px solid #ccc" }}
      />
      <p>Clicked {count} times</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>{" "}
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`,
      },
      {
        title: 'To-do list',
        code: `function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }}>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
      <span style={{ flex: 1, textDecoration: todo.done ? "line-through" : "none" }}>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>✕</button>
    </li>
  );
}

function App() {
  const [todos, setTodos] = useState([{ id: 1, text: "Learn hooks", done: false }]);
  const [text, setText] = useState("");

  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos(t => [...t, { id: Date.now(), text, done: false }]);
    setText("");
  };
  const toggle = (id) => setTodos(t => t.map(x => (x.id === id ? { ...x, done: !x.done } : x)));
  const remove = (id) => setTodos(t => t.filter(x => x.id !== id));
  const remaining = todos.filter(t => !t.done).length;

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 400, margin: "2rem auto" }}>
      <h2>Todos ({remaining} left)</h2>
      <form onSubmit={add} style={{ display: "flex", gap: 8 }}>
        <input value={text} onChange={e => setText(e.target.value)} style={{ flex: 1 }} />
        <button>Add</button>
      </form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map(t => <TodoItem key={t.id} todo={t} onToggle={toggle} onDelete={remove} />)}
      </ul>
    </div>
  );
}`,
      },
      {
        title: 'useEffect & cleanup',
        code: `function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id); // cleanup when unmounted
  }, []);

  return <p style={{ fontSize: 32, fontWeight: 700 }}>{now.toLocaleTimeString()}</p>;
}

function App() {
  const [show, setShow] = useState(true);
  return (
    <div style={{ fontFamily: "system-ui", padding: "2rem" }}>
      <button onClick={() => setShow(s => !s)}>{show ? "Unmount" : "Mount"} clock</button>
      {show && <Clock />}
    </div>
  );
}`,
      },
      {
        title: 'Context & custom hook',
        code: `const ThemeContext = createContext("light");

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn(v => !v), []);
  return [on, toggle];
}

function ThemedCard({ children }) {
  const theme = useContext(ThemeContext);
  const dark = theme === "dark";
  return (
    <div style={{ padding: 16, borderRadius: 12, background: dark ? "#0f172a" : "#f1f5f9", color: dark ? "#e2e8f0" : "#0f172a" }}>
      {children}
    </div>
  );
}

function App() {
  const [dark, toggle] = useToggle();
  return (
    <ThemeContext.Provider value={dark ? "dark" : "light"}>
      <div style={{ fontFamily: "system-ui", padding: "2rem", display: "grid", gap: 12 }}>
        <button onClick={toggle}>Toggle theme</button>
        <ThemedCard>Context passes the theme without prop drilling.</ThemedCard>
      </div>
    </ThemeContext.Provider>
  );
}`,
      },
    ],
  },
  {
    id: 'python',
    label: 'Python',
    icon: '🐍',
    highlight: 'python',
    runnable: true,
    wasmNote: 'Python runs on Pyodide (WebAssembly). The first run downloads the runtime (~10 MB).',
    examples: [
      {
        title: 'Basics tour',
        code: `# Python basics
name = "QuickDevGuide"
print(f"Hello from {name}! 🐍")

numbers = [1, 2, 3, 4, 5]
squares = [n ** 2 for n in numbers]          # list comprehension
evens = [n for n in numbers if n % 2 == 0]
print("Squares:", squares)
print("Evens:", evens)

person = {"name": "Alice", "skills": ["Python", "SQL"]}
for key, value in person.items():
    print(f"{key:>7}: {value}")

def fizzbuzz(n):
    return "Fizz" * (n % 3 == 0) + "Buzz" * (n % 5 == 0) or str(n)

print(", ".join(fizzbuzz(i) for i in range(1, 16)))`,
      },
      {
        title: 'Classes & dataclasses',
        code: `from dataclasses import dataclass, field
from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

    def __str__(self):
        return f"{type(self).__name__} area={self.area():.2f}"

class Circle(Shape):
    def __init__(self, r: float):
        self.r = r
    def area(self):
        return math.pi * self.r ** 2

@dataclass(order=True)
class Product:
    price: float
    name: str = field(compare=False)
    tags: list[str] = field(default_factory=list, compare=False)

print(Circle(2))
items = [Product(9.5, "Pen"), Product(2.0, "Clip"), Product(30, "Bag")]
print(sorted(items))  # ordered by price
print(Product(1, "A") == Product(1, "B"))  # True: name not compared`,
      },
      {
        title: 'Dicts, Counter & grouping',
        code: `from collections import Counter, defaultdict

text = "the quick brown fox jumps over the lazy dog the end"
words = text.split()

counts = Counter(words)
print("Most common:", counts.most_common(3))

by_length = defaultdict(list)
for w in words:
    by_length[len(w)].append(w)
print(dict(sorted(by_length.items())))

# dict comprehension + merge operator (3.9+)
prices = {"apple": 1.2, "pear": 0.8}
discounted = {k: round(v * 0.9, 2) for k, v in prices.items()}
print(prices | {"kiwi": 0.5})
print(discounted)`,
      },
      {
        title: 'Exceptions & context managers',
        code: `from contextlib import contextmanager
import time

class InsufficientFunds(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFunds(f"Need {amount - balance} more")
    return balance - amount

for amount in (30, 500):
    try:
        print("New balance:", withdraw(100, amount))
    except InsufficientFunds as e:
        print("Error:", e)
    finally:
        print("-- attempted", amount)

@contextmanager
def timer(label):
    start = time.perf_counter()
    try:
        yield
    finally:
        print(f"{label}: {(time.perf_counter() - start) * 1000:.2f} ms")

with timer("sum of squares"):
    total = sum(i * i for i in range(100_000))
print(total)`,
      },
      {
        title: 'Generators & decorators',
        code: `import functools

def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
print(list(islice(fibonacci(), 10)))

def log_calls(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        result = fn(*args, **kwargs)
        print(f"{fn.__name__}{args} -> {result}")
        return result
    return wrapper

@functools.lru_cache(maxsize=None)
def slow_square(n):
    return n * n

@log_calls
def add(a, b):
    return a + b

add(2, 3)
print([slow_square(i) for i in range(5)], slow_square.cache_info())`,
      },
    ],
  },
  {
    id: 'sql',
    label: 'SQL',
    icon: '🗃️',
    highlight: 'sql',
    runnable: true,
    wasmNote: 'SQL runs on SQLite (sql.js, WebAssembly). Each run starts with an empty database.',
    examples: [
      {
        title: 'Create, insert, select',
        code: `CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  salary REAL
);

INSERT INTO employees (name, department, salary) VALUES
  ('Alice', 'Engineering', 95000),
  ('Bob', 'Marketing', 72000),
  ('Charlie', 'Engineering', 88000),
  ('Diana', 'Sales', 65000),
  ('Eve', 'Engineering', 102000);

SELECT name, department, salary
FROM employees
WHERE salary > 70000
ORDER BY salary DESC;`,
      },
      {
        title: 'JOINs',
        code: `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, total REAL);

INSERT INTO customers VALUES (1, 'Ana'), (2, 'Ben'), (3, 'Cy');
INSERT INTO orders VALUES (1, 1, 30), (2, 1, 55), (3, 2, 12);

-- INNER JOIN: only customers with orders
SELECT c.name, o.total
FROM customers c
JOIN orders o ON o.customer_id = c.id;

-- LEFT JOIN: every customer, NULL when no orders
SELECT c.name, COUNT(o.id) AS orders, COALESCE(SUM(o.total), 0) AS spent
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id
ORDER BY spent DESC;`,
      },
      {
        title: 'GROUP BY & HAVING',
        code: `CREATE TABLE sales (region TEXT, product TEXT, amount INTEGER);
INSERT INTO sales VALUES
  ('North', 'Laptop', 1200), ('North', 'Phone', 800), ('South', 'Laptop', 1500),
  ('South', 'Phone', 300), ('East', 'Laptop', 400), ('North', 'Laptop', 900);

SELECT region,
       COUNT(*)            AS sales,
       SUM(amount)         AS revenue,
       ROUND(AVG(amount))  AS avg_sale
FROM sales
GROUP BY region
HAVING SUM(amount) > 1000      -- filter groups (WHERE filters rows)
ORDER BY revenue DESC;`,
      },
      {
        title: 'Window functions & CTE',
        code: `CREATE TABLE scores (player TEXT, game INTEGER, points INTEGER);
INSERT INTO scores VALUES
  ('ana', 1, 10), ('ana', 2, 30), ('ana', 3, 20),
  ('ben', 1, 25), ('ben', 2, 5),  ('ben', 3, 40);

WITH ranked AS (
  SELECT player, game, points,
         RANK() OVER (PARTITION BY game ORDER BY points DESC) AS rank_in_game,
         SUM(points) OVER (PARTITION BY player ORDER BY game) AS running_total
  FROM scores
)
SELECT * FROM ranked ORDER BY player, game;`,
      },
    ],
  },
  {
    id: 'php',
    label: 'PHP',
    icon: '🐘',
    highlight: 'php',
    runnable: true,
    wasmNote: 'PHP 8.2 runs on php-wasm (WebAssembly). The first run downloads the runtime.',
    examples: [
      {
        title: 'Basics tour',
        code: `<?php
$name = "QuickDevGuide";
echo "Hello from $name! 🐘\\n";

$numbers = [1, 2, 3, 4, 5];
$squares = array_map(fn($n) => $n ** 2, $numbers);
echo "Squares: " . implode(", ", $squares) . "\\n";

$person = ["name" => "Alice", "role" => "Developer"];
foreach ($person as $key => $value) {
    echo str_pad($key, 6) . ": $value\\n";
}

function factorial(int $n): int {
    return $n <= 1 ? 1 : $n * factorial($n - 1);
}
echo "5! = " . factorial(5) . "\\n";`,
      },
      {
        title: 'Classes & interfaces',
        code: `<?php
interface Shape {
    public function area(): float;
}

abstract class Base implements Shape {
    public function __toString(): string {
        return static::class . " area=" . number_format($this->area(), 2);
    }
}

final class Circle extends Base {
    public function __construct(private float $r) {}   // constructor promotion
    public function area(): float { return M_PI * $this->r ** 2; }
}

final class Rect extends Base {
    public function __construct(private float $w, private float $h) {}
    public function area(): float { return $this->w * $this->h; }
}

foreach ([new Circle(2), new Rect(3, 4)] as $shape) {
    echo $shape, PHP_EOL;
}`,
      },
      {
        title: 'Arrays & match',
        code: `<?php
$orders = [
    ["id" => 1, "status" => "paid", "total" => 30],
    ["id" => 2, "status" => "pending", "total" => 12],
    ["id" => 3, "status" => "paid", "total" => 55],
];

$paid = array_filter($orders, fn($o) => $o["status"] === "paid");
$revenue = array_sum(array_column($paid, "total"));
echo "Revenue: $revenue\\n";

usort($orders, fn($a, $b) => $b["total"] <=> $a["total"]);
echo "Largest order: #" . $orders[0]["id"] . "\\n";

foreach ($orders as $o) {
    $label = match ($o["status"]) {
        "paid" => "✅",
        "pending" => "⏳",
        default => "?",
    };
    echo "$label order {$o['id']}\\n";
}`,
      },
    ],
  },
  {
    id: 'java',
    label: 'Java',
    icon: '☕',
    highlight: 'java',
    runnable: false,
    externalRunner: { label: 'Run on dev.java Playground', url: 'https://dev.java/playground/' },
    examples: [
      {
        title: 'Hello & streams',
        code: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Employee(String name, String dept, double salary) {}

    public static void main(String[] args) {
        System.out.println("Hello, Java! ☕");

        List<Employee> staff = List.of(
            new Employee("Alice", "Eng", 95_000),
            new Employee("Bob", "Sales", 60_000),
            new Employee("Cara", "Eng", 105_000));

        Map<String, Double> avgByDept = staff.stream()
            .collect(Collectors.groupingBy(Employee::dept,
                     Collectors.averagingDouble(Employee::salary)));
        System.out.println(avgByDept);

        String names = staff.stream()
            .filter(e -> e.salary() > 70_000)
            .map(Employee::name)
            .sorted()
            .collect(Collectors.joining(", "));
        System.out.println("High earners: " + names);
    }
}`,
      },
      {
        title: 'OOP: interfaces & polymorphism',
        code: `interface Shape {
    double area();
    default String describe() { return getClass().getSimpleName() + " area=" + String.format("%.2f", area()); }
}

record Circle(double r) implements Shape {
    public double area() { return Math.PI * r * r; }
}

record Rect(double w, double h) implements Shape {
    public double area() { return w * h; }
}

public class Main {
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(2), new Rect(3, 4) };
        for (Shape s : shapes) System.out.println(s.describe());

        // Pattern matching for switch (Java 21)
        for (Shape s : shapes) {
            String kind = switch (s) {
                case Circle c when c.r() > 1 -> "big circle";
                case Circle c -> "small circle";
                case Rect r -> "rectangle " + r.w() + "x" + r.h();
                default -> "unknown";
            };
            System.out.println(kind);
        }
    }
}`,
      },
    ],
  },
  {
    id: 'csharp',
    label: 'C#',
    icon: '🟣',
    highlight: 'csharp',
    runnable: false,
    externalRunner: { label: 'Run on .NET Fiddle', url: 'https://dotnetfiddle.net/' },
    examples: [
      {
        title: 'Records & LINQ',
        code: `using System;
using System.Linq;
using System.Collections.Generic;

public record Employee(string Name, string Dept, decimal Salary);

public class Program
{
    public static void Main()
    {
        Console.WriteLine("Hello, C#! 🟣");

        var staff = new List<Employee>
        {
            new("Alice", "Eng", 95_000),
            new("Bob", "Sales", 60_000),
            new("Cara", "Eng", 105_000),
        };

        var byDept = staff
            .GroupBy(e => e.Dept)
            .Select(g => new { Dept = g.Key, Avg = g.Average(e => e.Salary) });

        foreach (var d in byDept)
            Console.WriteLine($"{d.Dept}: {d.Avg:C0}");

        var raised = staff[1] with { Salary = 65_000 }; // non-destructive mutation
        Console.WriteLine(raised);
    }
}`,
      },
      {
        title: 'async/await',
        code: `using System;
using System.Threading.Tasks;

public class Program
{
    static async Task<string> FetchAsync(string name, int delayMs)
    {
        await Task.Delay(delayMs);
        return $"{name} done after {delayMs}ms";
    }

    public static async Task Main()
    {
        var tasks = new[] { FetchAsync("A", 300), FetchAsync("B", 100) };
        string[] results = await Task.WhenAll(tasks);   // run concurrently
        foreach (var r in results) Console.WriteLine(r);

        try
        {
            await Task.FromException(new InvalidOperationException("boom"));
        }
        catch (InvalidOperationException ex)
        {
            Console.WriteLine($"Caught: {ex.Message}");
        }
    }
}`,
      },
    ],
  },
  {
    id: 'dart',
    label: 'Dart',
    icon: '🎯',
    highlight: 'dart',
    runnable: false,
    externalRunner: { label: 'Run on DartPad', url: 'https://dartpad.dev/' },
    examples: [
      {
        title: 'Hello & null safety',
        code: `class User {
  final String name;
  final String? email; // nullable
  const User(this.name, {this.email});

  String get contact => email ?? 'no email';
}

Future<String> fetchGreeting() async {
  await Future.delayed(const Duration(milliseconds: 200));
  return 'Hello, Dart! 🎯';
}

void main() async {
  print(await fetchGreeting());

  final users = [const User('Ana', email: 'ana@dev.io'), const User('Ben')];
  for (final u in users) {
    print('\${u.name}: \${u.contact}');
  }

  final lengths = users.map((u) => u.name.length).toList();
  print('Name lengths: $lengths');
}`,
      },
    ],
  },
];

export const getLanguage = (id) => LANGUAGES.find(l => l.id === id) || LANGUAGES[0];

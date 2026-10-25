/*
 * React course extension — extra sections and worked examples merged into
 * courses-data/react.js at load time.
 *
 * `jsx` examples that define `function App()` open directly in the Playground,
 * where hooks (useState, useEffect, …) are available as globals — so these
 * snippets intentionally omit import statements.
 */
export default {
  examples: {
    'Props & State': [
      {
        title: 'Lifting state up',
        language: 'jsx',
        explanation: 'When two components need the same data, move the state to their **closest common parent** and pass it down as props, along with callbacks to change it.',
        code: `function TemperatureInput({ label, value, onChange }) {
  return (
    <label style={{ display: "block", margin: "8px 0" }}>
      {label}:{" "}
      <input type="number" value={value} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

function App() {
  const [celsius, setCelsius] = useState("20");       // single source of truth
  const fahrenheit = celsius === "" ? "" : String(Math.round(celsius * 9 / 5 + 32));

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <TemperatureInput label="Celsius" value={celsius} onChange={setCelsius} />
      <TemperatureInput
        label="Fahrenheit"
        value={fahrenheit}
        onChange={f => setCelsius(f === "" ? "" : String(Math.round((f - 32) * 5 / 9)))}
      />
      <p>{Number(celsius) >= 100 ? "💨 Water boils" : "💧 Water does not boil"}</p>
    </div>
  );
}`,
      },
      {
        title: 'Updating objects & arrays immutably',
        language: 'jsx',
        code: `function App() {
  const [user, setUser] = useState({ name: "Ada", address: { city: "London" }, skills: ["JS"] });

  const rename = () => setUser(u => ({ ...u, name: u.name === "Ada" ? "Grace" : "Ada" }));
  const move = () => setUser(u => ({ ...u, address: { ...u.address, city: "Paris" } }));  // nested copy
  const addSkill = () => setUser(u => ({ ...u, skills: [...u.skills, "React " + u.skills.length] }));
  const removeFirst = () => setUser(u => ({ ...u, skills: u.skills.slice(1) }));

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={rename}>Rename</button>{" "}
      <button onClick={move}>Move</button>{" "}
      <button onClick={addSkill}>Add skill</button>{" "}
      <button onClick={removeFirst}>Remove first skill</button>
    </div>
  );
}`,
      },
    ],
    'Lists': [
      {
        title: 'Filter, sort and keys',
        language: 'jsx',
        code: `const PRODUCTS = [
  { id: "p1", name: "Laptop", price: 1200, category: "tech" },
  { id: "p2", name: "Desk", price: 300, category: "home" },
  { id: "p3", name: "Mouse", price: 25, category: "tech" },
  { id: "p4", name: "Lamp", price: 45, category: "home" },
];

function App() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const visible = PRODUCTS
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .toSorted((a, b) => (sortBy === "price" ? a.price - b.price : a.name.localeCompare(b.name)));

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <input placeholder="Filter…" value={query} onChange={e => setQuery(e.target.value)} />{" "}
      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
      {visible.length === 0 ? (
        <p>No products match.</p>
      ) : (
        <ul>
          {/* key must be stable and unique — use ids, not array indexes */}
          {visible.map(p => (
            <li key={p.id}>{p.name} — \${p.price} <small>({p.category})</small></li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      },
    ],
    'Forms, Controls & Submit': [
      {
        title: 'Controlled form with validation',
        language: 'jsx',
        code: `function validate({ email, password, plan }) {
  const errors = {};
  if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) errors.email = "Enter a valid email";
  if (password.length < 8) errors.password = "At least 8 characters";
  if (!plan) errors.plan = "Choose a plan";
  return errors;
}

function App() {
  const [values, setValues] = useState({ email: "", password: "", plan: "", newsletter: true });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const errors = validate(values);

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setValues(v => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };
  const handleBlur = e => setTouched(t => ({ ...t, [e.target.name]: true }));
  const handleSubmit = e => {
    e.preventDefault();
    setTouched({ email: true, password: true, plan: true });
    if (Object.keys(errors).length === 0) setSubmitted(values);
  };

  const field = { display: "block", margin: "6px 0 2px" };
  const err = name => touched[name] && errors[name] && <small style={{ color: "crimson" }}>{errors[name]}</small>;

  return (
    <form onSubmit={handleSubmit} noValidate style={{ fontFamily: "system-ui", padding: 24, maxWidth: 320 }}>
      <label style={field}>Email</label>
      <input name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
      {err("email")}

      <label style={field}>Password</label>
      <input name="password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
      {err("password")}

      <label style={field}>Plan</label>
      <select name="plan" value={values.plan} onChange={handleChange} onBlur={handleBlur}>
        <option value="">— select —</option>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>
      {err("plan")}

      <label style={field}>
        <input type="checkbox" name="newsletter" checked={values.newsletter} onChange={handleChange} /> Newsletter
      </label>

      <button type="submit" style={{ marginTop: 12 }}>Sign up</button>
      {submitted && <pre>{JSON.stringify(submitted, null, 2)}</pre>}
    </form>
  );
}`,
      },
    ],
    'Hooks: State & Effects': [
      {
        title: 'useEffect: subscriptions & cleanup',
        language: 'jsx',
        explanation: 'Effects synchronise a component with something **outside** React (timers, subscriptions, the DOM, network). Return a cleanup function so nothing leaks when the component unmounts or the dependencies change.',
        code: `function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);   // cleanup
  }, []);                                                          // subscribe once
  return width;
}

function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;                     // effect does nothing while paused
    const id = setInterval(() => setMs(m => m + 100), 100);
    return () => clearInterval(id);           // runs when running changes or on unmount
  }, [running]);

  return (
    <div>
      <h2>{(ms / 1000).toFixed(1)}s</h2>
      <button onClick={() => setRunning(r => !r)}>{running ? "Pause" : "Start"}</button>{" "}
      <button onClick={() => { setRunning(false); setMs(0); }}>Reset</button>
    </div>
  );
}

function App() {
  const width = useWindowWidth();
  useEffect(() => { document.title = "Width: " + width; }, [width]);
  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <p>Window width: {width}px</p>
      <Stopwatch />
    </div>
  );
}`,
      },
    ],
    'Custom Hooks': [
      {
        title: 'useLocalStorage & useDebounce',
        language: 'jsx',
        code: `function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;                 // storage may be blocked in sandboxes
    }
  });
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const FRUITS = ["apple", "apricot", "banana", "blueberry", "cherry", "grape", "kiwi", "mango"];

function App() {
  const [query, setQuery] = useLocalStorage("fruit-query", "");
  const debounced = useDebounce(query, 400);
  const results = FRUITS.filter(f => f.includes(debounced.toLowerCase()));

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search fruit" />
      <p><small>Searching for: “{debounced}”</small></p>
      <ul>{results.map(f => <li key={f}>{f}</li>)}</ul>
    </div>
  );
}`,
      },
    ],
  },

  sections: [
    {
      title: 'Context API',
      after: 'Custom Hooks',
      content: `**Context** passes data through the component tree without threading props through every level ("prop drilling"). Typical uses: theme, current user, locale, feature flags.

### Three steps

1. **Create**: \`const ThemeContext = createContext(defaultValue)\`.
2. **Provide**: wrap a subtree in \`<ThemeContext.Provider value={…}>\` (React 19 also allows \`<ThemeContext value={…}>\`).
3. **Consume**: \`const theme = useContext(ThemeContext)\` anywhere below.

### Best practices

- Wrap context in a **custom hook** (\`useTheme()\`) that throws a helpful error when used outside its provider.
- Every consumer re-renders when the \`value\` changes — memoise the value object with \`useMemo\`, and split unrelated data into separate contexts.
- Combine with \`useReducer\` for small global stores. For large, frequently-changing state consider Zustand, Redux Toolkit or TanStack Query (server state).`,
      code: `const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({
    user,
    login: name => setUser({ name, role: name === "admin" ? "admin" : "member" }),
    logout: () => setUser(null),
  }), [user]);                                   // stable object unless user changes
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, background: "#0047ab", color: "white" }}>
      <strong>MyApp</strong>
      <span style={{ marginLeft: "auto" }}>{user ? \`Hi, \${user.name} (\${user.role})\` : "Guest"}</span>
      {user && <button onClick={logout}>Log out</button>}
    </nav>
  );
}

function LoginForm() {
  const { user, login } = useAuth();
  const [name, setName] = useState("");
  if (user) return <p>You are logged in.</p>;
  return (
    <form onSubmit={e => { e.preventDefault(); login(name || "guest"); }}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="username (try admin)" />
      <button>Log in</button>
    </form>
  );
}

function App() {
  return (
    <AuthProvider>
      <div style={{ fontFamily: "system-ui" }}>
        <Navbar />
        <main style={{ padding: 16 }}><LoginForm /></main>
      </div>
    </AuthProvider>
  );
}`,
      codeLabel: 'Auth context with a custom hook',
      keyPoints: [
        'Context removes prop drilling for app-wide data.',
        'Expose context through a custom hook with a helpful error.',
        'Memoise the provider value to avoid needless re-renders.',
        'Split contexts by concern; use a state library for complex global state.',
      ],
    },
    {
      title: 'useReducer for Complex State',
      after: 'Context API',
      content: `\`useReducer(reducer, initialState)\` centralises state transitions in a **pure function** \`(state, action) => newState\`. Prefer it over several \`useState\` calls when:

- the next state depends on the previous one in non-trivial ways,
- many event handlers update the same data,
- you want the logic testable without rendering anything.

### Anatomy

\`\`\`js
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: "added", text: "Learn reducers" });
\`\`\`

Reducers must be **pure**: no API calls, no mutations, no randomness — return a new object instead. Name actions after *what happened* (\`"added"\`, \`"toggled"\`) rather than *what to set*.`,
      code: `const initialState = { items: [], filter: "all", nextId: 1 };

function todoReducer(state, action) {
  switch (action.type) {
    case "added":
      if (!action.text.trim()) return state;
      return { ...state, nextId: state.nextId + 1,
               items: [...state.items, { id: state.nextId, text: action.text, done: false }] };
    case "toggled":
      return { ...state, items: state.items.map(t => (t.id === action.id ? { ...t, done: !t.done } : t)) };
    case "deleted":
      return { ...state, items: state.items.filter(t => t.id !== action.id) };
    case "cleared_completed":
      return { ...state, items: state.items.filter(t => !t.done) };
    case "filter_changed":
      return { ...state, filter: action.filter };
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [text, setText] = useState("");

  const visible = state.items.filter(t =>
    state.filter === "all" ? true : state.filter === "done" ? t.done : !t.done);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 380 }}>
      <form onSubmit={e => { e.preventDefault(); dispatch({ type: "added", text }); setText(""); }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="New task" />
        <button>Add</button>
      </form>
      <div style={{ margin: "8px 0" }}>
        {["all", "active", "done"].map(f => (
          <button key={f} disabled={state.filter === f}
                  onClick={() => dispatch({ type: "filter_changed", filter: f })}>{f}</button>
        ))}
        <button onClick={() => dispatch({ type: "cleared_completed" })}>Clear done</button>
      </div>
      <ul style={{ paddingLeft: 18 }}>
        {visible.map(t => (
          <li key={t.id}>
            <label style={{ textDecoration: t.done ? "line-through" : "none" }}>
              <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: "toggled", id: t.id })} />
              {t.text}
            </label>{" "}
            <button onClick={() => dispatch({ type: "deleted", id: t.id })}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      codeLabel: 'Todo app driven by a reducer',
      keyPoints: [
        'useReducer moves update logic into a pure, testable function.',
        'Dispatch actions that describe what happened.',
        'Never mutate state in a reducer — return new objects.',
        'Combine useReducer with Context for a lightweight global store.',
      ],
    },
    {
      title: 'Data Fetching Patterns',
      after: 'useReducer for Complex State',
      content: `Every network request has at least three UI states: **loading**, **error** and **success** (and often *empty*). Handle all of them explicitly.

### Fetching in an effect

- Track \`loading\`, \`error\` and \`data\`.
- Use an \`AbortController\` to cancel the request when the component unmounts or the input changes — this prevents race conditions where an old, slow response overwrites a newer one.
- Check \`response.ok\`; \`fetch\` does not reject on HTTP errors.

### In production apps

Hand-written effects get complex quickly (caching, retries, refetch on focus, pagination). Use a data library:

| Library | Highlights |
|---|---|
| **TanStack Query** | caching, background refetch, mutations, devtools |
| **SWR** | lightweight stale-while-revalidate |
| **RTK Query** | integrated with Redux Toolkit |
| Framework loaders | Next.js Server Components, React Router loaders |

React 19's \`use(promise)\` + \`<Suspense>\` lets components read promises directly when the framework provides them.`,
      code: `function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    const controller = new AbortController();
    setState(s => ({ ...s, loading: true, error: null }));

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(data => setState({ data, error: null, loading: false }))
      .catch(error => {
        if (error.name !== "AbortError") setState({ data: null, error, loading: false });
      });

    return () => controller.abort();         // cancel stale requests
  }, [url]);

  return state;
}

function App() {
  const [userId, setUserId] = useState(1);
  const { data: user, error, loading } = useFetch("https://jsonplaceholder.typicode.com/users/" + userId);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <button onClick={() => setUserId(id => Math.max(1, id - 1))}>‹ Prev</button>{" "}
      <strong>User #{userId}</strong>{" "}
      <button onClick={() => setUserId(id => id + 1)}>Next ›</button>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>Failed: {error.message}</p>}
      {user && !loading && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <h3 style={{ margin: 0 }}>{user.name}</h3>
          <p>{user.email} · {user.company?.name}</p>
        </div>
      )}
    </div>
  );
}`,
      codeLabel: 'useFetch with AbortController',
      keyPoints: [
        'Always render loading, error and success states.',
        'Abort in-flight requests in the effect cleanup to avoid race conditions.',
        'Check response.ok — fetch only rejects on network failures.',
        'Use TanStack Query/SWR for caching and refetching in real apps.',
      ],
    },
    {
      title: 'Performance: memo, useMemo & useCallback',
      after: 'Data Fetching Patterns',
      content: `React re-renders a component when its state, its parent or a consumed context changes. Usually that is cheap. Optimise only after **measuring** with the React DevTools Profiler.

| Tool | What it does | Use when |
|---|---|---|
| \`React.memo(Component)\` | Skips re-render if props are shallow-equal | a pure child re-renders often with the same props |
| \`useMemo(fn, deps)\` | Caches a **computed value** | expensive calculations, stable object/array props |
| \`useCallback(fn, deps)\` | Caches a **function** identity | passing callbacks to memoised children or effect deps |
| \`useTransition\` / \`useDeferredValue\` | Marks updates as non-urgent | keep typing responsive while a big list re-renders |
| \`React.lazy\` + \`Suspense\` | Code-splits components | large routes/widgets not needed at first paint |
| List virtualisation | Renders only visible rows | thousands of rows (react-window, TanStack Virtual) |

> The **React Compiler** (React 19 ecosystem) can apply much of this memoisation automatically.

### Other easy wins

Keep state as **local** as possible, avoid creating components inside components, and give list items stable \`key\`s.`,
      code: `function slowFilter(items, query) {
  const start = performance.now();
  while (performance.now() - start < 30) {}            // simulate expensive work (30ms)
  return items.filter(i => i.includes(query));
}

const Row = React.memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item)} style={{ cursor: "pointer" }}>{item}</li>;
});

const ITEMS = Array.from({ length: 200 }, (_, i) => "item " + i);

function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [count, setCount] = useState(0);
  const deferredQuery = useDeferredValue(query);       // typing stays responsive

  const filtered = useMemo(() => slowFilter(ITEMS, deferredQuery), [deferredQuery]);
  const handleSelect = useCallback(item => setSelected(item), []);   // stable identity for Row

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter (try 1)" />{" "}
      <button onClick={() => setCount(c => c + 1)}>Unrelated state: {count}</button>
      <p>Selected: {selected ?? "none"} · {filtered.length} rows {query !== deferredQuery && "(updating…)"}</p>
      <ul style={{ maxHeight: 200, overflow: "auto" }}>
        {filtered.slice(0, 50).map(item => <Row key={item} item={item} onSelect={handleSelect} />)}
      </ul>
    </div>
  );
}`,
      codeLabel: 'memo, useMemo, useCallback and useDeferredValue',
      keyPoints: [
        'Measure first with the Profiler; most renders are cheap.',
        'React.memo + useCallback prevent re-rendering pure children.',
        'useMemo caches expensive computations between renders.',
        'useDeferredValue/useTransition keep input responsive during heavy updates.',
      ],
    },
    {
      title: 'Error Boundaries, Suspense & lazy',
      after: 'Performance: memo, useMemo & useCallback',
      content: `### Error boundaries

A rendering error in one component unmounts the **whole** app unless something catches it. An error boundary is a component that implements \`getDerivedStateFromError\` / \`componentDidCatch\` and renders a fallback UI. They must currently be **class components** (or use the \`react-error-boundary\` package).

Error boundaries do **not** catch errors in event handlers, async code (setTimeout, fetch callbacks) or server rendering — use try/catch there.

### Code splitting with lazy + Suspense

\`const Settings = lazy(() => import("./Settings"))\` loads the component's code only when it first renders. Wrap it in \`<Suspense fallback={<Spinner />}>\` to show something while loading.

Place boundaries strategically: around each route, each independent widget (charts, comments), so one failure does not take down the page.`,
      code: `class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };                                   // render fallback next
  }

  componentDidCatch(error, info) {
    console.error("Logged to monitoring:", error.message, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert" style={{ padding: 12, background: "#fef2f2", color: "#991b1b", borderRadius: 8 }}>
          <strong>Something went wrong:</strong> {this.state.error.message}{" "}
          <button onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function BuggyCounter() {
  const [n, setN] = useState(0);
  if (n === 3) throw new Error("Counter crashed at 3!");
  return <button onClick={() => setN(n + 1)}>Clicked {n} times (crashes at 3)</button>;
}

// Simulated lazy-loaded component (in a real app: lazy(() => import("./Chart")))
const LazyChart = React.lazy(() =>
  new Promise(resolve => setTimeout(() => resolve({ default: () => <p>📊 Chart loaded lazily</p> }), 1000)));

function App() {
  const [showChart, setShowChart] = useState(false);
  return (
    <div style={{ fontFamily: "system-ui", padding: 24, display: "grid", gap: 16 }}>
      <ErrorBoundary><BuggyCounter /></ErrorBoundary>
      <p>The rest of the page keeps working ✅</p>
      <button onClick={() => setShowChart(true)}>Load chart</button>
      {showChart && (
        <React.Suspense fallback={<p>Loading chart…</p>}>
          <LazyChart />
        </React.Suspense>
      )}
    </div>
  );
}`,
      codeLabel: 'Error boundary + lazy loading',
      keyPoints: [
        'Error boundaries contain rendering errors to part of the tree.',
        'They do not catch event-handler or async errors — use try/catch there.',
        'lazy + Suspense split code and show a fallback while loading.',
        'Wrap routes and independent widgets in their own boundaries.',
      ],
    },
    {
      title: 'Testing React Components',
      after: 'React Router & Navigation',
      content: `**React Testing Library (RTL)** tests components the way users use them: find elements by role, label or text, interact, and assert on what is rendered — not on internal state.

### Toolchain

| Tool | Role |
|---|---|
| **Vitest** or Jest | test runner & assertions |
| **@testing-library/react** | render components, query the DOM |
| **@testing-library/user-event** | realistic typing/clicking |
| **@testing-library/jest-dom** | matchers like \`toBeInTheDocument\` |
| **MSW** (Mock Service Worker) | mock network requests |

### Query priority

1. \`getByRole("button", { name: /save/i })\` — accessible queries first
2. \`getByLabelText\`, \`getByPlaceholderText\`, \`getByText\`
3. \`getByTestId\` — last resort

Use \`findBy…\` (async) for elements that appear later, and \`queryBy…\` when asserting something is **absent**.`,
      code: `// Counter.jsx
import { useState } from "react";

export function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(initial)} disabled={count === initial}>Reset</button>
    </div>
  );
}

// Counter.test.jsx  (Vitest + React Testing Library)
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("starts at the initial value", () => {
    render(<Counter initial={5} />);
    expect(screen.getByText("Count: 5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeDisabled();
  });

  it("increments and resets", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole("button", { name: /increment/i }));
    await user.click(screen.getByRole("button", { name: /increment/i }));
    expect(screen.getByText("Count: 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reset/i }));
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
  });
});

// Async UI: wait for data to appear
// expect(await screen.findByText(/welcome, ada/i)).toBeInTheDocument();
// expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();`,
      codeLabel: 'Vitest + React Testing Library',
      keyPoints: [
        'Test behaviour users see, not implementation details.',
        'Prefer getByRole and getByLabelText queries.',
        'Use user-event for realistic interactions and findBy for async UI.',
        'Mock the network with MSW instead of mocking fetch everywhere.',
      ],
    },
    {
      title: 'React 19 Features',
      after: 'Testing React Components',
      content: `React 19 (stable since December 2024) focuses on **forms, async actions and less boilerplate**.

| Feature | What it gives you |
|---|---|
| **Actions** | Pass an async function to \`<form action={fn}>\`; React manages pending state and resets the form |
| \`useActionState\` | State + pending flag for an action (e.g. form result and error) |
| \`useFormStatus\` | Read the parent form's pending state from a child (submit buttons) |
| \`useOptimistic\` | Show the expected result instantly while the request is in flight |
| \`use(promise | context)\` | Read a promise (with Suspense) or context — callable conditionally |
| \`ref\` as a prop | No more \`forwardRef\` for function components |
| \`<Context>\` as provider | \`<ThemeContext value="dark">\` without \`.Provider\` |
| Document metadata | Render \`<title>\` and \`<meta>\` anywhere; React hoists them to \`<head>\` |
| Server Components & Server Actions | Stable for frameworks such as Next.js |

The example uses the new form hooks (requires React 19 — the Playground uses React 18, so run this in a React 19 project).`,
      code: `import { useActionState, useOptimistic, useRef } from "react";
import { useFormStatus } from "react-dom";

async function saveName(name) {
  await new Promise(r => setTimeout(r, 800));            // simulate network
  if (name.toLowerCase() === "error") throw new Error("Server rejected that name");
  return name;
}

function SubmitButton() {
  const { pending } = useFormStatus();                    // reads the parent <form>
  return <button disabled={pending}>{pending ? "Saving…" : "Save"}</button>;
}

export default function Profile() {
  const [state, formAction] = useActionState(async (prev, formData) => {
    try {
      const saved = await saveName(formData.get("name"));
      return { name: saved, error: null };
    } catch (e) {
      return { ...prev, error: e.message };
    }
  }, { name: "Ada", error: null });

  const [optimisticName, setOptimisticName] = useOptimistic(state.name);
  const inputRef = useRef(null);                          // ref works as a normal prop in 19

  return (
    <form
      action={async formData => {
        setOptimisticName(formData.get("name"));          // instant UI update
        await formAction(formData);
      }}
    >
      <title>{\`Profile — \${optimisticName}\`}</title>        {/* hoisted to <head> */}
      <p>Current name: <strong>{optimisticName}</strong></p>
      <input ref={inputRef} name="name" defaultValue={state.name} />
      <SubmitButton />
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}`,
      codeLabel: 'Actions, useActionState, useFormStatus, useOptimistic',
      keyPoints: [
        'Form actions handle async submission and pending state for you.',
        'useOptimistic shows the expected result before the server responds.',
        'use() reads promises and context, even conditionally.',
        'ref is a regular prop — forwardRef is no longer needed.',
      ],
    },
  ],
};

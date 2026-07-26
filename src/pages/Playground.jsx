import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSEO } from '../hooks/useSEO';
import {
  Play, RotateCcw, Copy, Check, Terminal, Code2, Loader2,
  AlertTriangle, ChevronDown, Maximize2, Minimize2, Trash2
} from 'lucide-react';

/* ───────────────────────────── language registry ───────────────────────────── */
const LANGUAGES = [
  {
    id: 'html',
    label: 'HTML',
    icon: '🌐',
    runnable: true,
    defaultCode: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .card {
      background: white;
      padding: 2rem 3rem;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
    }
    h1 { color: #333; margin-bottom: 0.5rem; }
    p { color: #666; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, World! 👋</h1>
    <p>Edit this HTML and click <strong>Run</strong> to see your changes.</p>
  </div>
</body>
</html>`,
  },
  {
    id: 'css',
    label: 'CSS',
    icon: '🎨',
    runnable: true,
    defaultCode: `/* Try editing the CSS below and click Run */

body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #0f172a;
  font-family: 'Segoe UI', sans-serif;
}

.box {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* HTML structure (auto-applied):
   <div class="box">CSS is Fun!</div>
*/`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    icon: '⚡',
    runnable: true,
    defaultCode: `// JavaScript Playground
// console.log() output appears in the panel below

console.log("Hello, JavaScript! 🚀");

// Variables and types
const name = "QuickDevGuide";
const year = new Date().getFullYear();
console.log(\`Welcome to \${name} — \${year}\`);

// Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Object destructuring
const user = { name: "Alice", role: "Developer", level: 42 };
const { name: userName, role } = user;
console.log(\`\${userName} is a \${role}\`);

// Async simulation
console.log("Fetching data...");
setTimeout(() => {
  console.log("✅ Data loaded successfully!");
}, 500);`,
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    icon: '🔷',
    runnable: true,
    defaultCode: `// TypeScript Playground
// Transpiled to JavaScript and executed in the browser

interface User {
  name: string;
  age: number;
  role: "admin" | "user" | "guest";
}

function greet(user: User): string {
  return \`Hello \${user.name}! You are a \${user.role}.\`;
}

const alice: User = { name: "Alice", age: 30, role: "admin" };
console.log(greet(alice));

// Generics
function identity<T>(value: T): T {
  return value;
}

console.log(identity<number>(42));
console.log(identity<string>("TypeScript is awesome!"));

// Enum
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

console.log("Direction:", Direction.Up);`,
  },
  {
    id: 'react',
    label: 'React JSX',
    icon: '⚛️',
    runnable: true,
    defaultCode: `// React JSX Playground
// Uses React 19 via CDN — write functional components!

function App() {
  const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState("World");

  return (
    <div style={{
      fontFamily: "'Segoe UI', sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3a5f, #0f172a)",
      color: "white"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        padding: "2rem 3rem",
        borderRadius: "16px",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.2)"
      }}>
        <h1>Hello, {name}! 👋</h1>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Type your name"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            marginBottom: "1rem",
            fontSize: "1rem",
            width: "100%",
            boxSizing: "border-box"
          }}
        />
        <p style={{ fontSize: "3rem", margin: "0.5rem 0" }}>{count}</p>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
          <button onClick={() => setCount(c => c - 1)} style={btnStyle}>−</button>
          <button onClick={() => setCount(0)} style={btnStyle}>Reset</button>
          <button onClick={() => setCount(c => c + 1)} style={btnStyle}>+</button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "0.5rem 1.25rem",
  borderRadius: "8px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer"
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);`,
  },
  {
    id: 'python',
    label: 'Python',
    icon: '🐍',
    runnable: true,
    wasmNote: 'Powered by Pyodide (loads ~11 MB on first use)',
    defaultCode: `# Python Playground (powered by Pyodide)
# Runs real CPython in your browser via WebAssembly

print("Hello, Python! 🐍")

# List comprehension
squares = [x ** 2 for x in range(1, 11)]
print(f"Squares: {squares}")

# Dictionary
user = {"name": "Alice", "role": "Developer", "level": 42}
for key, value in user.items():
    print(f"  {key}: {value}")

# Classes
class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        return f"{self.name} says {self.sound}!"

dog = Animal("Dog", "Woof")
cat = Animal("Cat", "Meow")
print(dog.speak())
print(cat.speak())

# Math
import math
print(f"Pi = {math.pi:.6f}")
print(f"sqrt(144) = {math.sqrt(144)}")`,
  },
  {
    id: 'sql',
    label: 'SQL',
    icon: '🗄️',
    runnable: true,
    wasmNote: 'Powered by sql.js (SQLite in the browser)',
    defaultCode: `-- SQL Playground (powered by sql.js / SQLite)
-- A sample database is created automatically

CREATE TABLE employees (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL,
  dept  TEXT NOT NULL,
  salary REAL
);

INSERT INTO employees VALUES (1, 'Alice',   'Engineering', 95000);
INSERT INTO employees VALUES (2, 'Bob',     'Marketing',   72000);
INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 88000);
INSERT INTO employees VALUES (4, 'Diana',   'Sales',       67000);
INSERT INTO employees VALUES (5, 'Eve',     'Engineering', 102000);
INSERT INTO employees VALUES (6, 'Frank',   'Marketing',   78000);

-- Query: Average salary by department
SELECT dept AS Department,
       COUNT(*) AS Employees,
       ROUND(AVG(salary), 2) AS Avg_Salary
FROM employees
GROUP BY dept
ORDER BY Avg_Salary DESC;`,
  },
  {
    id: 'php',
    label: 'PHP',
    icon: '🐘',
    runnable: true,
    wasmNote: 'Powered by php-wasm (loads on first use)',
    defaultCode: `<?php
// PHP Playground (powered by php-wasm)
// Runs real PHP in your browser via WebAssembly

echo "Hello, PHP! 🐘\\n\\n";

// Variables and string interpolation
$name = "QuickDevGuide";
$year = date("Y");
echo "Welcome to $name — $year\\n";

// Arrays
$fruits = ["Apple", "Banana", "Cherry", "Date"];
echo "\\nFruits:\\n";
foreach ($fruits as $index => $fruit) {
    echo "  " . ($index + 1) . ". $fruit\\n";
}

// Associative arrays
$user = [
    "name" => "Alice",
    "role" => "Developer",
    "level" => 42
];

echo "\\nUser Info:\\n";
foreach ($user as $key => $value) {
    echo "  $key: $value\\n";
}

// Functions
function factorial(int $n): int {
    return $n <= 1 ? 1 : $n * factorial($n - 1);
}

echo "\\n10! = " . factorial(10) . "\\n";
?>`,
  },
  {
    id: 'java',
    label: 'Java',
    icon: '☕',
    runnable: false,
    defaultCode: `// Java — preview only (use a local JDK to compile & run)

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java! ☕");

        // Array
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int n : numbers) {
            sum += n;
        }
        System.out.println("Sum: " + sum);

        // String formatting
        String name = "Alice";
        int age = 30;
        System.out.printf("%s is %d years old%n", name, age);

        // ArrayList
        var fruits = new java.util.ArrayList<String>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Cherry");
        fruits.forEach(f -> System.out.println("  → " + f));
    }
}`,
  },
  {
    id: 'csharp',
    label: 'C#',
    icon: '🟣',
    runnable: false,
    defaultCode: `// C# — preview only (use dotnet CLI to compile & run)

using System;
using System.Linq;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, C#! 🟣");

        // LINQ
        var numbers = new[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        var evens = numbers.Where(n => n % 2 == 0).ToList();
        Console.WriteLine($"Even numbers: {string.Join(", ", evens)}");

        // Records (C# 10+)
        var user = new User("Alice", "Developer");
        Console.WriteLine(user);

        // Pattern matching
        object obj = 42;
        string result = obj switch
        {
            int i when i > 0 => $"Positive integer: {i}",
            string s         => $"String: {s}",
            _                => "Unknown"
        };
        Console.WriteLine(result);
    }

    record User(string Name, string Role);
}`,
  },
  {
    id: 'dart',
    label: 'Dart',
    icon: '🎯',
    runnable: false,
    defaultCode: `// Dart — preview only (use dart CLI or DartPad to run)

void main() {
  print("Hello, Dart! 🎯");

  // Variables
  var name = 'Alice';
  final age = 30;
  const pi = 3.14159;
  print('$name is $age years old. Pi = $pi');

  // Collections
  var fruits = ['Apple', 'Banana', 'Cherry'];
  fruits.forEach((f) => print('  → $f'));

  // Null safety
  String? nullable;
  print('Nullable is: \${nullable ?? "null"}');

  // Classes
  var dog = Animal('Buddy', 'Woof');
  dog.speak();
}

class Animal {
  final String name;
  final String sound;

  Animal(this.name, this.sound);

  void speak() {
    print('$name says $sound!');
  }
}`,
  },
];

/* map language IDs to syntax-highlighter language names */
const LANG_HIGHLIGHT_MAP = {
  html: 'html', css: 'css', javascript: 'javascript', typescript: 'typescript',
  react: 'jsx', python: 'python', sql: 'sql', php: 'php',
  java: 'java', csharp: 'csharp', dart: 'dart',
};

/* ───────────────────────── execution engines ────────────────────────────── */

/** HTML — render directly inside an iframe */
function runHTML(code) {
  return { type: 'html', html: code };
}

/** CSS — wrap in a HTML document with a sample element */
function runCSS(code) {
  /* Extract the comment hint for HTML structure, otherwise use default */
  const htmlMatch = code.match(/\/\*[\s\S]*?HTML structure.*?:\s*([\s\S]*?)\*\//i);
  const innerHtml = htmlMatch
    ? htmlMatch[1].replace(/^\s*\*?\s*/gm, '').trim()
    : '<div class="box">CSS is Fun!</div>';
  return {
    type: 'html',
    html: `<!DOCTYPE html><html><head><style>${code}</style></head><body>${innerHtml}</body></html>`,
  };
}

/** JavaScript — execute with captured console */
function runJS(code) {
  return new Promise((resolve) => {
    const logs = [];
    const fakeConsole = {
      log: (...args) => logs.push({ level: 'log', text: args.map(formatArg).join(' ') }),
      warn: (...args) => logs.push({ level: 'warn', text: args.map(formatArg).join(' ') }),
      error: (...args) => logs.push({ level: 'error', text: args.map(formatArg).join(' ') }),
      info: (...args) => logs.push({ level: 'info', text: args.map(formatArg).join(' ') }),
      table: (data) => logs.push({ level: 'log', text: JSON.stringify(data, null, 2) }),
      clear: () => { logs.length = 0; },
    };

    try {
      // Wrap user code — forward console & capture return value
      const wrapped = `
        (function(console){
          ${code}
        })
      `;
      // eslint-disable-next-line no-eval
      const fn = eval(wrapped);
      const result = fn(fakeConsole);
      if (result !== undefined) {
        logs.push({ level: 'log', text: formatArg(result) });
      }
    } catch (err) {
      logs.push({ level: 'error', text: `❌ ${err.name}: ${err.message}` });
    }

    /* Flush setTimeout output after 600ms */
    setTimeout(() => {
      resolve({ type: 'console', logs });
    }, 650);
  });
}

/** TypeScript — transpile via TypeScript compiler on CDN, then run as JS */
async function runTS(code) {
  if (!window.ts) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/typescript@5/lib/typescript.min.js';
    document.head.appendChild(script);
    await new Promise((r, rej) => { script.onload = r; script.onerror = rej; });
  }
  const js = window.ts.transpile(code, { target: window.ts.ScriptTarget.ES2020 });
  return runJS(js);
}

/** React (JSX) — transpile with Babel standalone and render in iframe */
function runReact(code) {
  const html = `<!DOCTYPE html>
<html><head>
<script crossorigin src="https://cdn.jsdelivr.net/npm/react@19/umd/react.development.js"><\/script>
<script crossorigin src="https://cdn.jsdelivr.net/npm/react-dom@19/umd/react-dom.development.js"><\/script>
<script crossorigin src="https://cdn.jsdelivr.net/npm/@babel/standalone@7/babel.min.js"><\/script>
<style>*{margin:0;padding:0;box-sizing:border-box;}</style>
</head><body>
<div id="root"></div>
<script type="text/babel" data-type="module">
${code}
<\/script>
</body></html>`;
  return { type: 'html', html };
}

/** Python — Pyodide WASM */
let pyodideReady = null;
async function loadPyodide_() {
  if (pyodideReady) return pyodideReady;
  pyodideReady = (async () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js';
    document.head.appendChild(script);
    await new Promise((r, rej) => { script.onload = r; script.onerror = rej; });
    // eslint-disable-next-line no-undef
    const py = await loadPyodide();
    return py;
  })();
  return pyodideReady;
}

async function runPython(code) {
  const py = await loadPyodide_();
  const logs = [];
  py.setStdout({ batched: (text) => logs.push({ level: 'log', text }) });
  py.setStderr({ batched: (text) => logs.push({ level: 'error', text }) });
  try {
    await py.runPythonAsync(code);
  } catch (err) {
    logs.push({ level: 'error', text: `❌ ${err.message}` });
  }
  return { type: 'console', logs };
}

/** SQL — sql.js WASM */
let sqlReady = null;
async function loadSQL() {
  if (sqlReady) return sqlReady;
  sqlReady = (async () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sql.js@1/dist/sql-wasm.js';
    document.head.appendChild(script);
    await new Promise((r, rej) => { script.onload = r; script.onerror = rej; });
    // eslint-disable-next-line no-undef
    const SQL = await initSqlJs({ locateFile: f => `https://cdn.jsdelivr.net/npm/sql.js@1/dist/${f}` });
    return new SQL.Database();
  })();
  return sqlReady;
}

async function runSQL(code) {
  const db = await loadSQL();
  const logs = [];
  try {
    // Reset database for a clean run each time
    const freshSQL = await (async () => {
      const script = document.querySelector('script[src*="sql-wasm"]');
      // eslint-disable-next-line no-undef
      const SQL = await initSqlJs({ locateFile: f => `https://cdn.jsdelivr.net/npm/sql.js@1/dist/${f}` });
      return new SQL.Database();
    })();
    const results = freshSQL.exec(code);
    if (results.length === 0) {
      logs.push({ level: 'log', text: '✅ Query executed successfully (no rows returned).' });
    }
    results.forEach((result) => {
      // Format as table
      const cols = result.columns;
      const widths = cols.map((c, i) =>
        Math.max(c.length, ...result.values.map(r => String(r[i]).length))
      );
      const sep = widths.map(w => '─'.repeat(w + 2)).join('┼');
      const header = cols.map((c, i) => ` ${c.padEnd(widths[i])} `).join('│');
      logs.push({ level: 'info', text: header });
      logs.push({ level: 'info', text: sep });
      result.values.forEach((row) => {
        const line = row.map((v, i) => ` ${String(v).padEnd(widths[i])} `).join('│');
        logs.push({ level: 'log', text: line });
      });
    });
    freshSQL.close();
  } catch (err) {
    logs.push({ level: 'error', text: `❌ ${err.message}` });
  }
  return { type: 'console', logs };
}

/** PHP — php-wasm */
let phpReady = null;
async function loadPHP() {
  if (phpReady) return phpReady;
  phpReady = (async () => {
    const { PhpWeb } = await import('https://cdn.jsdelivr.net/npm/@aspect-build/aspect-php-wasm@0.0.8/PhpWeb.mjs');
    const php = new PhpWeb();
    await php.run('<?php echo ""; ?>');
    return php;
  })().catch(() => {
    phpReady = null;
    return null;
  });
  return phpReady;
}

async function runPHP(code) {
  try {
    const php = await loadPHP();
    if (!php) {
      // Fallback — show a simulation
      return {
        type: 'console',
        logs: [{ level: 'warn', text: '⚠️ php-wasm could not load in your browser. Try using Chrome or Edge.' },
               { level: 'info', text: 'PHP code is displayed for reference. Use a local PHP installation to run it.' }],
      };
    }
    const output = await php.run(code);
    const text = typeof output === 'string' ? output : (output?.text || '');
    return {
      type: 'console',
      logs: text.split('\n').filter(Boolean).map(line => ({ level: 'log', text: line })),
    };
  } catch (err) {
    return {
      type: 'console',
      logs: [{ level: 'error', text: `❌ ${err.message}` }],
    };
  }
}

function formatArg(arg) {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'object') {
    try { return JSON.stringify(arg, null, 2); } catch { return String(arg); }
  }
  return String(arg);
}

/* dispatcher */
async function executeCode(langId, code) {
  switch (langId) {
    case 'html':       return runHTML(code);
    case 'css':        return runCSS(code);
    case 'javascript': return runJS(code);
    case 'typescript': return runTS(code);
    case 'react':      return runReact(code);
    case 'python':     return runPython(code);
    case 'sql':        return runSQL(code);
    case 'php':        return runPHP(code);
    default:           return { type: 'console', logs: [{ level: 'warn', text: `⚠️ ${langId} cannot be executed in the browser. Use a local compiler / runtime.` }] };
  }
}

/* ─────────────────────────── Playground component ──────────────────────── */

const Playground = () => {
  useSEO({
    title: 'Code Playground',
    description: 'Write, edit, and run code in 11+ languages directly in your browser. Supports HTML, CSS, JavaScript, TypeScript, React, Python, SQL, PHP and more.',
    keywords: 'code playground, online code editor, run code online, JavaScript, Python, HTML, CSS, SQL, PHP, TypeScript, React, try it yourself',
  });

  const [selectedLang, setSelectedLang] = useState('html');
  const [codes, setCodes] = useState(() => {
    const map = {};
    LANGUAGES.forEach(l => { map[l.id] = l.defaultCode; });
    return map;
  });
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const iframeRef = useRef(null);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  const lang = LANGUAGES.find(l => l.id === selectedLang);
  const code = codes[selectedLang] || '';

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── handlers ──────────────────────────────────────────────────────────── */

  const handleCodeChange = useCallback((e) => {
    setCodes(prev => ({ ...prev, [selectedLang]: e.target.value }));
  }, [selectedLang]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    if (lang.wasmNote) setIsLoading(true);
    try {
      const result = await executeCode(selectedLang, code);
      setOutput(result);
      setIsLoading(false);
    } catch (err) {
      setOutput({ type: 'console', logs: [{ level: 'error', text: `❌ Execution error: ${err.message}` }] });
      setIsLoading(false);
    }
    setIsRunning(false);
  }, [selectedLang, code, lang]);

  const handleReset = useCallback(() => {
    setCodes(prev => ({ ...prev, [selectedLang]: lang.defaultCode }));
    setOutput(null);
  }, [selectedLang, lang]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleClear = useCallback(() => {
    setOutput(null);
  }, []);

  const handleKeyDown = useCallback((e) => {
    // Allow tab in textarea
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newValue = code.substring(0, selectionStart) + '  ' + code.substring(selectionEnd);
      setCodes(prev => ({ ...prev, [selectedLang]: newValue }));
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 2;
      });
    }
    // Ctrl+Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  }, [code, selectedLang, handleRun]);

  /* compute line count for the gutter */
  const lineCount = code.split('\n').length;

  return (
    <div className={`playground-page ${isExpanded ? 'playground-page--expanded' : ''}`}>
      {/* Header */}
      <div className="playground-header">
        <div className="playground-header-left">
          <Code2 className="icon-large text-primary" />
          <div>
            <h1 className="playground-title">Code Playground</h1>
            <p className="playground-subtitle">Write, edit & run code in your browser</p>
          </div>
        </div>
        <button
          className="playground-expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isExpanded ? <Minimize2 className="icon" /> : <Maximize2 className="icon" />}
        </button>
      </div>

      {/* Language selector + actions */}
      <div className="playground-toolbar">
        <div className="playground-lang-selector" ref={dropdownRef}>
          <button
            className="playground-lang-btn"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
          >
            <span className="playground-lang-icon">{lang.icon}</span>
            <span>{lang.label}</span>
            <ChevronDown className={`icon-small playground-chevron ${langDropdownOpen ? 'playground-chevron--open' : ''}`} />
          </button>
          {langDropdownOpen && (
            <div className="playground-lang-dropdown">
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  className={`playground-lang-option ${l.id === selectedLang ? 'playground-lang-option--active' : ''}`}
                  onClick={() => { setSelectedLang(l.id); setLangDropdownOpen(false); setOutput(null); }}
                >
                  <span className="playground-lang-icon">{l.icon}</span>
                  <span>{l.label}</span>
                  {!l.runnable && <span className="playground-lang-badge">Preview</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="playground-actions">
          <button className="playground-action-btn playground-action-btn--copy" onClick={handleCopy} title="Copy code">
            {copied ? <Check className="icon-small" /> : <Copy className="icon-small" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button className="playground-action-btn playground-action-btn--reset" onClick={handleReset} title="Reset to default">
            <RotateCcw className="icon-small" />
            <span>Reset</span>
          </button>
          <button
            className={`playground-action-btn playground-action-btn--run ${!lang.runnable ? 'playground-action-btn--disabled' : ''}`}
            onClick={handleRun}
            disabled={isRunning || !lang.runnable}
            title={lang.runnable ? 'Run code (Ctrl+Enter)' : `${lang.label} cannot run in the browser`}
          >
            {isRunning ? <Loader2 className="icon-small playground-spin" /> : <Play className="icon-small" />}
            <span>{isRunning ? 'Running…' : 'Run'}</span>
          </button>
        </div>
      </div>

      {/* WASM hint */}
      {lang.wasmNote && (
        <div className="playground-wasm-note">
          <AlertTriangle className="icon-small" />
          <span>{lang.wasmNote}</span>
        </div>
      )}

      {/* Editor + Output split */}
      <div className="playground-split">
        {/* Code editor pane */}
        <div className="playground-editor-pane">
          <div className="playground-editor-header">
            <Terminal className="icon-small" />
            <span>{lang.label} Editor</span>
          </div>
          <div className="playground-editor-body">
            <div className="playground-line-numbers" aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className="playground-line-number">{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              className="playground-textarea"
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Output pane */}
        <div className="playground-output-pane">
          <div className="playground-output-header">
            <div className="playground-output-header-left">
              <div className="playground-output-dot playground-output-dot--red" />
              <div className="playground-output-dot playground-output-dot--yellow" />
              <div className="playground-output-dot playground-output-dot--green" />
              <span>Output</span>
            </div>
            {output && (
              <button className="playground-clear-btn" onClick={handleClear} title="Clear output">
                <Trash2 className="icon-small" />
              </button>
            )}
          </div>
          <div className="playground-output-body">
            {isLoading && (
              <div className="playground-loading">
                <Loader2 className="icon-large playground-spin" />
                <span>Loading runtime…</span>
              </div>
            )}

            {!output && !isLoading && (
              <div className="playground-output-empty">
                <Play className="icon-huge" style={{ opacity: 0.15 }} />
                <p>Click <strong>Run</strong> to see the output here</p>
                {lang.runnable && <p className="playground-shortcut">or press <kbd>Ctrl</kbd> + <kbd>Enter</kbd></p>}
                {!lang.runnable && (
                  <p className="playground-not-runnable">
                    <AlertTriangle className="icon-small" />
                    {lang.label} cannot be executed in the browser — use a local compiler
                  </p>
                )}
              </div>
            )}

            {output && output.type === 'html' && (
              <iframe
                ref={iframeRef}
                className="playground-iframe"
                srcDoc={output.html}
                sandbox="allow-scripts allow-modals"
                title="Output"
              />
            )}

            {output && output.type === 'console' && (
              <div className="playground-console">
                {output.logs.map((entry, i) => (
                  <div key={i} className={`playground-console-line playground-console-line--${entry.level}`}>
                    <span className="playground-console-prefix">
                      {entry.level === 'error' ? '✗' : entry.level === 'warn' ? '⚠' : entry.level === 'info' ? 'ℹ' : '›'}
                    </span>
                    <pre className="playground-console-text">{entry.text}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;

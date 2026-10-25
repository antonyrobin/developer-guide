/*
 * Code execution engines for the Playground.
 *
 * Every runner receives the source and an `emit(entry)` callback for streaming
 * console output ({ level, text }) and resolves with either
 *   { type: 'html', html }   — rendered in a sandboxed iframe, or
 *   { type: 'console' }      — output already streamed through `emit`.
 *
 * JavaScript / TypeScript run inside a dedicated Web Worker so user code never
 * touches the app's origin and an infinite loop can be killed with `stop()`.
 */

const CDN = {
  typescript: 'https://cdn.jsdelivr.net/npm/typescript@5.6.3/lib/typescript.min.js',
  react: 'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.development.js',
  reactDom: 'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.development.js',
  babel: 'https://cdn.jsdelivr.net/npm/@babel/standalone@7.26.4/babel.min.js',
  pyodide: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js',
  sqlJs: 'https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/sql-wasm.js',
  sqlJsDir: 'https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/',
  php: 'https://cdn.jsdelivr.net/npm/php-wasm@0.0.8/PhpWeb.mjs',
};

const scriptPromises = new Map();
function loadScript(src) {
  if (!scriptPromises.has(src)) {
    scriptPromises.set(src, new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => {
        scriptPromises.delete(src);
        reject(new Error(`Failed to load ${src}`));
      };
      document.head.appendChild(script);
    }));
  }
  return scriptPromises.get(src);
}

/* ── HTML / CSS / React → iframe ─────────────────────────────────────────── */

export function runHTML(code) {
  return { type: 'html', html: code };
}

export function runCSS(code) {
  // The HTML to style is taken from a `/* HTML structure: ... */` comment, if present.
  const htmlMatch = code.match(/\/\*[\s\S]*?HTML structure.*?:\s*([\s\S]*?)\*\//i);
  const innerHtml = htmlMatch
    ? htmlMatch[1].replace(/^\s*\*?\s?/gm, '').trim()
    : '<div class="box">CSS is Fun!</div>';
  return {
    type: 'html',
    html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${code}</style></head><body>${innerHtml}</body></html>`,
  };
}

export function runReact(code) {
  const safeCode = code.replace(/<\/script/gi, '<\\/script');
  const html = `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<script crossorigin src="${CDN.react}"></script>
<script crossorigin src="${CDN.reactDom}"></script>
<script src="${CDN.babel}"></script>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:system-ui,sans-serif;}
#__error{color:#b91c1c;background:#fef2f2;padding:1rem;font:13px/1.5 monospace;white-space:pre-wrap;display:none;}</style>
</head><body>
<div id="root"></div><pre id="__error"></pre>
<script>
  window.addEventListener('error', function (e) {
    var el = document.getElementById('__error');
    el.style.display = 'block';
    el.textContent = (e.error && e.error.message) || e.message;
  });
</script>
<script type="text/babel" data-presets="react">
const { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback, useReducer, useContext, createContext, useDeferredValue, useTransition, useId, memo, lazy, Suspense, Fragment } = React;
${safeCode}
const __root = ReactDOM.createRoot(document.getElementById('root'));
__root.render(<App />);
</script>
</body></html>`;
  return { type: 'html', html };
}

/* ── JavaScript / TypeScript → Web Worker ────────────────────────────────── */

const WORKER_SOURCE = `
const format = (v) => {
  if (typeof v === 'string') return v;
  if (v instanceof Error) return v.name + ': ' + v.message;
  if (typeof v === 'function') return v.toString().split('\\n')[0] + (v.toString().includes('\\n') ? ' …' : '');
  if (typeof v === 'symbol' || typeof v === 'bigint') return v.toString() + (typeof v === 'bigint' ? 'n' : '');
  if (v instanceof Map) return 'Map(' + v.size + ') ' + JSON.stringify(Object.fromEntries(v), null, 2);
  if (v instanceof Set) return 'Set(' + v.size + ') ' + JSON.stringify([...v]);
  if (v === undefined) return 'undefined';
  try {
    const compact = JSON.stringify(v);
    if (compact === undefined) return String(v);
    return compact.length <= 72 ? compact : JSON.stringify(v, null, 2);
  } catch { return String(v); }
};
const send = (level, args) => postMessage({ level, text: args.map(format).join(' ') });
const timers = {};
const counts = {};
self.console = {
  log: (...a) => send('log', a), info: (...a) => send('info', a), debug: (...a) => send('log', a),
  warn: (...a) => send('warn', a), error: (...a) => send('error', a),
  table: (d) => send('log', [d]),
  assert: (c, ...a) => { if (!c) send('error', ['Assertion failed:', ...a]); },
  count: (l = 'default') => { counts[l] = (counts[l] || 0) + 1; send('log', [l + ': ' + counts[l]]); },
  time: (l = 'default') => { timers[l] = performance.now(); },
  timeEnd: (l = 'default') => { send('log', [l + ': ' + (performance.now() - timers[l]).toFixed(2) + ' ms']); },
  group: (...a) => send('info', ['▸', ...a]), groupEnd: () => {}, clear: () => postMessage({ clear: true }),
};
self.addEventListener('unhandledrejection', (e) => send('error', ['Uncaught (in promise)', e.reason]));
self.onmessage = async (e) => {
  try {
    const fn = new Function('return (async () => {\\n' + e.data + '\\n})()');
    await fn();
  } catch (err) {
    send('error', [err && err.stack ? String(err.stack).split('\\n')[0] : err]);
  }
  postMessage({ syncDone: true });
};
`;

let workerUrl = null;
let activeWorker = null;

/** Terminates any running JS/TS program. */
export function stopRunning() {
  if (activeWorker) {
    activeWorker.terminate();
    activeWorker = null;
    return true;
  }
  return false;
}

/**
 * Runs JS in a worker. Output streams live through `emit`. Resolves once the
 * top-level code finished and no output arrived for `idleMs` (so short timers
 * are captured), or after `maxMs` — the worker then keeps running until the
 * next run or Stop.
 */
function runInWorker(js, emit, { idleMs = 400, maxMs = 3000 } = {}) {
  stopRunning();
  if (!workerUrl) workerUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }));
  const worker = new Worker(workerUrl);
  activeWorker = worker;

  return new Promise((resolve) => {
    let syncDone = false;
    let idleTimer = null;
    const finish = (stillRunning) => {
      clearTimeout(idleTimer);
      clearTimeout(maxTimer);
      resolve({ type: 'console', stillRunning });
    };
    const armIdle = () => { clearTimeout(idleTimer); if (syncDone) idleTimer = setTimeout(() => finish(false), idleMs); };
    // Still busy (long loop, intervals…) after maxMs: report it so the UI keeps offering Stop.
    const maxTimer = setTimeout(() => finish(true), maxMs);

    worker.onmessage = (e) => {
      if (e.data.syncDone) { syncDone = true; armIdle(); return; }
      if (e.data.clear) { emit({ clear: true }); return; }
      emit(e.data);
      armIdle();
    };
    worker.onerror = (e) => {
      e.preventDefault();
      emit({ level: 'error', text: `${e.message}${e.lineno ? ` (line ${Math.max(1, e.lineno - 2)})` : ''}` });
      syncDone = true;
      armIdle();
    };
    worker.postMessage(js);
  });
}

export const runJS = (code, emit) => runInWorker(code, emit);

export async function runTS(code, emit) {
  await loadScript(CDN.typescript);
  const { outputText, diagnostics } = window.ts.transpileModule(code, {
    compilerOptions: { target: window.ts.ScriptTarget.ES2022, module: window.ts.ModuleKind.None },
    reportDiagnostics: true,
  });
  (diagnostics || []).forEach(d =>
    emit({ level: 'warn', text: `TS: ${window.ts.flattenDiagnosticMessageText(d.messageText, '\n')}` })
  );
  return runInWorker(outputText.replace(/^export \{\};?\s*$/m, ''), emit);
}

/* ── Python (Pyodide) ────────────────────────────────────────────────────── */

let pyodidePromise = null;
export async function runPython(code, emit) {
  if (!pyodidePromise) {
    pyodidePromise = loadScript(CDN.pyodide)
      .then(() => window.loadPyodide())
      .catch(err => { pyodidePromise = null; throw err; });
  }
  const py = await pyodidePromise;
  py.setStdout({ batched: (text) => emit({ level: 'log', text }) });
  py.setStderr({ batched: (text) => emit({ level: 'error', text }) });
  try {
    await py.runPythonAsync(code);
  } catch (err) {
    // Show only the final, relevant lines of the Python traceback.
    const lines = String(err.message).trim().split('\n');
    emit({ level: 'error', text: lines.slice(-3).join('\n') });
  }
  return { type: 'console' };
}

/* ── SQL (sql.js / SQLite) ───────────────────────────────────────────────── */

let sqlPromise = null;
export async function runSQL(code, emit) {
  if (!sqlPromise) {
    sqlPromise = loadScript(CDN.sqlJs)
      .then(() => window.initSqlJs({ locateFile: f => `${CDN.sqlJsDir}${f}` }))
      .catch(err => { sqlPromise = null; throw err; });
  }
  const SQL = await sqlPromise;
  const db = new SQL.Database(); // fresh database every run
  try {
    const results = db.exec(code);
    if (results.length === 0) {
      emit({ level: 'info', text: 'Query executed successfully (no rows returned).' });
    }
    results.forEach((result) => emit({ level: 'table', columns: result.columns, rows: result.values }));
  } catch (err) {
    emit({ level: 'error', text: err.message });
  } finally {
    db.close();
  }
  return { type: 'console' };
}

/* ── PHP (php-wasm) ──────────────────────────────────────────────────────── */

let phpPromise = null;
export async function runPHP(code, emit) {
  if (!phpPromise) {
    phpPromise = import(/* @vite-ignore */ CDN.php)
      .then(({ PhpWeb }) => new Promise((resolve) => {
        const php = new PhpWeb();
        php.addEventListener('ready', () => resolve(php), { once: true });
      }))
      .catch(err => { phpPromise = null; throw err; });
  }
  const php = await phpPromise;
  let buffer = '';
  const onOut = (e) => { buffer += e.detail.join(''); };
  const onErr = (e) => emit({ level: 'error', text: [].concat(e.detail).join('') });
  php.addEventListener('output', onOut);
  php.addEventListener('error', onErr);
  try {
    await php.run(code);
  } finally {
    php.removeEventListener('output', onOut);
    php.removeEventListener('error', onErr);
  }
  if (buffer) emit({ level: 'log', text: buffer.replace(/\n$/, '') });
  else emit({ level: 'info', text: 'Script finished with no output.' });
  return { type: 'console' };
}

/* ── Dispatcher ──────────────────────────────────────────────────────────── */

export async function executeCode(langId, code, emit) {
  switch (langId) {
    case 'html': return runHTML(code);
    case 'css': return runCSS(code);
    case 'react': return runReact(code);
    case 'javascript': return runJS(code, emit);
    case 'typescript': return runTS(code, emit);
    case 'python': return runPython(code, emit);
    case 'sql': return runSQL(code, emit);
    case 'php': return runPHP(code, emit);
    default:
      emit({ level: 'warn', text: `${langId} cannot be executed in the browser. Use a local compiler / runtime.` });
      return { type: 'console' };
  }
}

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import {
  Play, Square, RotateCcw, Copy, Check, Terminal, Code2, Loader2,
  AlertTriangle, Maximize2, Minimize2, Trash2, Share2, ExternalLink, BookOpen, Info,
} from 'lucide-react';
import CodeEditor from '../playground/CodeEditor';
import { LANGUAGES, getLanguage } from '../playground/languages';
import { executeCode, stopRunning } from '../playground/runners';
import '../playground/playground.css';

const STORAGE_KEY = 'qdg-playground-v2';

/* ── persistence & sharing helpers ───────────────────────────────────────── */

const readStorage = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
};
const writeStorage = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
};

const encodeCode = (text) => {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const decodeCode = (encoded) => {
  const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
};

/** Initial state: shared link (#lang=…&code=…) > "Try it" from a course > last session > defaults. */
function getInitialState(location) {
  const saved = readStorage();
  const codes = {};
  LANGUAGES.forEach(l => { codes[l.id] = saved.codes?.[l.id] ?? l.examples[0].code; });
  let lang = LANGUAGES.some(l => l.id === saved.lang) ? saved.lang : 'html';
  let source = null;

  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get('lang') && hash.get('code')) {
    try {
      const id = getLanguage(hash.get('lang')).id;
      codes[id] = decodeCode(hash.get('code'));
      lang = id;
      source = 'shared';
    } catch { /* malformed link — ignore */ }
  } else if (location.state && location.state.language && location.state.code) {
    const id = getLanguage(location.state.language).id;
    codes[id] = location.state.code;
    lang = id;
    source = 'course';
  }
  return { codes, lang, source };
}

/* ── output rendering ────────────────────────────────────────────────────── */

const ConsoleTable = ({ columns, rows }) => (
  <div className="pg-table-wrap">
    <table className="pg-table">
      <thead><tr>{columns.map(c => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>{row.map((v, j) => <td key={j}>{v === null ? <em>NULL</em> : String(v)}</td>)}</tr>
        ))}
      </tbody>
    </table>
    <div className="pg-table-meta">{rows.length} row{rows.length === 1 ? '' : 's'}</div>
  </div>
);

const PREFIX = { error: '✗', warn: '⚠', info: 'ℹ', log: '›' };

const Playground = () => {
  useSEO({
    title: 'Code Playground',
    description: 'Write, edit, and run code in your browser with ready-made examples. Supports HTML, CSS, JavaScript, TypeScript, React, Python, SQL and PHP, plus Java, C# and Dart snippets.',
    keywords: 'code playground, online code editor, run code online, JavaScript, Python, HTML, CSS, SQL, PHP, TypeScript, React, try it yourself',
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [initial] = useState(() => getInitialState(location));
  const [selectedLang, setSelectedLang] = useState(initial.lang);
  const [codes, setCodes] = useState(initial.codes);
  const [source, setSource] = useState(initial.source);
  const [htmlOutput, setHtmlOutput] = useState(null);
  const [logs, setLogs] = useState(null); // null = nothing run yet
  const [status, setStatus] = useState('idle'); // idle | loading | running
  const [copied, setCopied] = useState(null); // 'code' | 'link'
  const [isExpanded, setIsExpanded] = useState(false);
  const [exampleIndex, setExampleIndex] = useState('');
  const runIdRef = useRef(0);
  const consoleEndRef = useRef(null);

  const lang = getLanguage(selectedLang);
  const code = codes[selectedLang] ?? '';

  // Drop router state / hash once consumed so a refresh shows the saved session.
  useEffect(() => {
    if (location.state || location.hash) navigate('/playground', { replace: true, state: null });
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the editor contents (debounced)
  useEffect(() => {
    const t = setTimeout(() => writeStorage({ lang: selectedLang, codes }), 400);
    return () => clearTimeout(t);
  }, [codes, selectedLang]);

  // Stop any running worker when leaving the page
  useEffect(() => () => { stopRunning(); }, []);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [logs]);

  // Keep the active language tab visible in the horizontally scrolling strip
  useEffect(() => {
    const strip = document.querySelector('.pg-langs');
    const tab = strip?.querySelector('.pg-lang--active');
    if (strip && tab) strip.scrollLeft = tab.offsetLeft - strip.offsetLeft - 16;
  }, [selectedLang]);

  /* ── handlers ──────────────────────────────────────────────────────────── */

  const setCode = useCallback((value) => {
    setCodes(prev => ({ ...prev, [selectedLang]: value }));
  }, [selectedLang]);

  const resetOutput = () => { setHtmlOutput(null); setLogs(null); };

  const handleRun = useCallback(async () => {
    if (!lang.runnable) return;
    const runId = ++runIdRef.current;
    const emit = (entry) => {
      if (runId !== runIdRef.current) return; // output from a stale run
      setLogs(prev => (entry.clear ? [] : [...(prev || []), entry]));
    };

    setHtmlOutput(null);
    setLogs([]);
    setStatus(lang.wasmNote || lang.id === 'typescript' ? 'loading' : 'running');
    try {
      const result = await executeCode(lang.id, code, (entry) => {
        setStatus(s => (s === 'loading' ? 'running' : s));
        emit(entry);
      });
      if (runId !== runIdRef.current) return;
      if (result.type === 'html') {
        setLogs(null);
        setHtmlOutput({ html: result.html, key: runId });
      }
      if (result.stillRunning) return; // keep status 'running' so Stop stays available
    } catch (err) {
      emit({ level: 'error', text: `Execution error: ${err.message}` });
    }
    if (runId === runIdRef.current) setStatus('idle');
  }, [lang, code]);

  const handleStop = () => {
    runIdRef.current++;
    if (stopRunning()) setLogs(prev => [...(prev || []), { level: 'warn', text: 'Execution stopped.' }]);
    setStatus('idle');
  };

  const selectLanguage = (id) => {
    if (id === selectedLang) return;
    handleStop();
    setSelectedLang(id);
    setExampleIndex('');
    setSource(null);
    resetOutput();
  };

  const loadExample = (value) => {
    setExampleIndex(value);
    if (value === '') return;
    setCode(lang.examples[Number(value)].code);
    setSource(null);
    resetOutput();
  };

  const handleReset = () => {
    setCode(lang.examples[0].code);
    setExampleIndex('');
    setSource(null);
    resetOutput();
  };

  const flashCopied = (what) => {
    setCopied(what);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); flashCopied('code'); } catch { /* clipboard unavailable */ }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/playground#lang=${lang.id}&code=${encodeCode(code)}`;
    try { await navigator.clipboard.writeText(url); flashCopied('link'); } catch { window.prompt('Copy this link', url); }
  };

  // Ctrl/Cmd + Enter runs from anywhere on the page (the editor handles its own focus case)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !e.target.closest?.('.code-editor')) {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleRun]);

  // Escape exits fullscreen
  useEffect(() => {
    if (!isExpanded) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setIsExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isExpanded]);

  const busy = status !== 'idle';

  return (
    <div className={`playground-page pg ${isExpanded ? 'playground-page--expanded' : ''}`}>
      <div className="pg-header">
        <div className="pg-header-left">
          <Code2 className="icon-large text-primary" />
          <div>
            <h1 className="playground-title">Code Playground</h1>
            <p className="playground-subtitle">Write, run and share code in your browser — pick an example to start.</p>
          </div>
        </div>
        <button
          className="pg-icon-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
          aria-label={isExpanded ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isExpanded ? <Minimize2 className="icon" /> : <Maximize2 className="icon" />}
        </button>
      </div>

      {/* Language tabs */}
      <div className="pg-langs" role="tablist" aria-label="Language">
        {LANGUAGES.map(l => (
          <button
            key={l.id}
            role="tab"
            aria-selected={l.id === selectedLang}
            className={`pg-lang ${l.id === selectedLang ? 'pg-lang--active' : ''}`}
            onClick={() => selectLanguage(l.id)}
          >
            <span aria-hidden="true">{l.icon}</span>
            <span>{l.label}</span>
            {!l.runnable && <span className="pg-lang-badge">view</span>}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="pg-toolbar">
        <label className="pg-example-select">
          <BookOpen className="icon-small" />
          <select value={exampleIndex} onChange={e => loadExample(e.target.value)} aria-label="Load an example">
            <option value="">Examples ({lang.examples.length})…</option>
            {lang.examples.map((ex, i) => <option key={ex.title} value={i}>{ex.title}</option>)}
          </select>
        </label>

        <div className="pg-actions">
          <button className="pg-btn" onClick={handleCopy} title="Copy code">
            {copied === 'code' ? <Check className="icon-small" /> : <Copy className="icon-small" />}
            <span>{copied === 'code' ? 'Copied' : 'Copy'}</span>
          </button>
          <button className="pg-btn" onClick={handleShare} title="Copy a shareable link to this code">
            {copied === 'link' ? <Check className="icon-small" /> : <Share2 className="icon-small" />}
            <span>{copied === 'link' ? 'Link copied' : 'Share'}</span>
          </button>
          <button className="pg-btn" onClick={handleReset} title="Reset to the default example">
            <RotateCcw className="icon-small" />
            <span>Reset</span>
          </button>
          {lang.runnable ? (
            busy && lang.id !== 'html' && lang.id !== 'css' && lang.id !== 'react' ? (
              <button className="pg-btn pg-btn--stop" onClick={handleStop} title="Stop execution">
                <Square className="icon-small" />
                <span>Stop</span>
              </button>
            ) : (
              <button className="pg-btn pg-btn--run" onClick={handleRun} title="Run (Ctrl+Enter)">
                <Play className="icon-small" />
                <span>Run</span>
              </button>
            )
          ) : (
            <a className="pg-btn pg-btn--run" href={lang.externalRunner.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="icon-small" />
              <span>{lang.externalRunner.label}</span>
            </a>
          )}
        </div>
      </div>

      {(source || lang.wasmNote || lang.hint) && (
        <div className="pg-notes">
          {source === 'course' && <div className="pg-note pg-note--info"><Info className="icon-small" /> Loaded from a course example — edit it and press Run.</div>}
          {source === 'shared' && <div className="pg-note pg-note--info"><Info className="icon-small" /> Loaded from a shared link.</div>}
          {lang.hint && <div className="pg-note"><Info className="icon-small" /> {lang.hint}</div>}
          {lang.wasmNote && <div className="pg-note pg-note--warn"><AlertTriangle className="icon-small" /> {lang.wasmNote}</div>}
        </div>
      )}

      <div className="pg-split">
        <section className="pg-pane" aria-label="Editor">
          <div className="pg-pane-header">
            <Terminal className="icon-small" />
            <span>{lang.label}</span>
            <span className="pg-pane-hint">{lang.runnable ? 'Ctrl + Enter to run · Tab to indent' : 'Read & edit — run it with the link above'}</span>
          </div>
          <CodeEditor
            value={code}
            onChange={setCode}
            language={lang.highlight}
            onRun={handleRun}
            label={`${lang.label} code editor`}
          />
        </section>

        <section className="pg-pane pg-pane--output" aria-label="Output" aria-live="polite">
          <div className="pg-pane-header">
            <span className="playground-output-dot playground-output-dot--red" />
            <span className="playground-output-dot playground-output-dot--yellow" />
            <span className="playground-output-dot playground-output-dot--green" />
            <span>Output</span>
            {status === 'running' && <span className="pg-status"><Loader2 className="icon-xs playground-spin" /> running</span>}
            {(logs || htmlOutput) && (
              <button className="pg-icon-btn pg-icon-btn--sm" onClick={resetOutput} title="Clear output" aria-label="Clear output">
                <Trash2 className="icon-small" />
              </button>
            )}
          </div>
          <div className="pg-output">
            {status === 'loading' && (
              <div className="playground-loading">
                <Loader2 className="icon-large playground-spin" />
                <span>Loading runtime…</span>
              </div>
            )}

            {!logs && !htmlOutput && status === 'idle' && (
              <div className="playground-output-empty">
                <Play className="icon-huge" style={{ opacity: 0.15 }} />
                {lang.runnable ? (
                  <>
                    <p>Click <strong>Run</strong> to see the output here</p>
                    <p className="playground-shortcut">or press <kbd>Ctrl</kbd> + <kbd>Enter</kbd></p>
                  </>
                ) : (
                  <p className="playground-not-runnable">
                    <AlertTriangle className="icon-small" />
                    {lang.label} needs a compiler — use <a href={lang.externalRunner.url} target="_blank" rel="noopener noreferrer">{lang.externalRunner.label}</a>.
                  </p>
                )}
              </div>
            )}

            {htmlOutput && (
              <iframe
                key={htmlOutput.key}
                className="playground-iframe"
                srcDoc={htmlOutput.html}
                sandbox="allow-scripts allow-modals allow-forms"
                title="Output preview"
              />
            )}

            {logs && status !== 'loading' && (
              <div className="playground-console">
                {logs.length === 0 && status === 'idle' && <div className="pg-console-empty">No output.</div>}
                {logs.map((entry, i) =>
                  entry.level === 'table' ? (
                    <ConsoleTable key={i} columns={entry.columns} rows={entry.rows} />
                  ) : (
                    <div key={i} className={`playground-console-line playground-console-line--${entry.level}`}>
                      <span className="playground-console-prefix">{PREFIX[entry.level] || '›'}</span>
                      <pre className="playground-console-text">{entry.text}</pre>
                    </div>
                  )
                )}
                <div ref={consoleEndRef} />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Playground;

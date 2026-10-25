import React, { useDeferredValue, useRef } from 'react';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SyntaxHighlighter from '../components/course/highlighter';

const INDENT = '  ';

/** Inserts text at the caret, keeping the browser's native undo history where supported. */
function insertText(textarea, text, onChange) {
  textarea.focus();
  // execCommand is deprecated but is still the only way to keep Ctrl+Z working in a textarea.
  if (!document.execCommand || !document.execCommand('insertText', false, text)) {
    const { selectionStart: s, selectionEnd: e, value } = textarea;
    onChange(value.slice(0, s) + text + value.slice(e));
    requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = s + text.length; });
  }
}

/**
 * Lightweight code editor: a transparent <textarea> layered over a
 * syntax-highlighted <pre>, with a synced line-number gutter.
 */
const CodeEditor = ({ value, onChange, language, onRun, label }) => {
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);
  const gutterRef = useRef(null);
  // Highlighting can lag a frame behind typing on large inputs without blocking the caret.
  const deferredValue = useDeferredValue(value);
  const lineCount = value.split('\n').length;

  const syncScroll = (e) => {
    const { scrollTop, scrollLeft } = e.target;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = scrollTop;
  };

  const handleKeyDown = (e) => {
    const ta = e.target;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun?.();
      return;
    }
    if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: end } = ta;
      if (e.shiftKey) {
        // Outdent the current line
        const lineStart = ta.value.lastIndexOf('\n', s - 1) + 1;
        if (ta.value.startsWith(INDENT, lineStart)) {
          ta.setSelectionRange(lineStart, lineStart + INDENT.length);
          insertText(ta, '', onChange);
          ta.setSelectionRange(Math.max(lineStart, s - INDENT.length), Math.max(lineStart, end - INDENT.length));
        }
      } else {
        insertText(ta, INDENT, onChange);
      }
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      // Keep the current line's indentation; add a level after an opening bracket or colon.
      const s = ta.selectionStart;
      const lineStart = ta.value.lastIndexOf('\n', s - 1) + 1;
      const line = ta.value.slice(lineStart, s);
      const indent = (line.match(/^\s*/) || [''])[0];
      const extra = /[{[(:]\s*$/.test(line) ? INDENT : '';
      e.preventDefault();
      insertText(ta, `\n${indent}${extra}`, onChange);
    }
  };

  return (
    <div className="code-editor">
      <div className="code-editor-gutter" ref={gutterRef} aria-hidden="true">
        {Array.from({ length: lineCount }, (_, i) => <div key={i}>{i + 1}</div>)}
      </div>
      <div className="code-editor-area">
        <div className="code-editor-highlight" ref={highlightRef} aria-hidden="true">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: 0, background: 'transparent', overflow: 'visible', fontSize: 'inherit', lineHeight: 'inherit' }}
            codeTagProps={{ style: { fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' } }}
          >
            {/* Trailing newline keeps the last empty line's height in sync with the textarea */}
            {deferredValue + '\n'}
          </SyntaxHighlighter>
        </div>
        <textarea
          ref={textareaRef}
          className="code-editor-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          wrap="off"
          aria-label={label}
        />
      </div>
    </div>
  );
};

export default CodeEditor;

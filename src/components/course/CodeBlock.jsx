import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Play } from 'lucide-react';
import SyntaxHighlighter, { isKnownLanguage } from './highlighter';
import { toPlaygroundLanguage } from './courseContent';

const LANGUAGE_LABELS = {
  javascript: 'JavaScript', js: 'JavaScript', jsx: 'JSX', typescript: 'TypeScript', ts: 'TypeScript', tsx: 'TSX',
  html: 'HTML', markup: 'HTML', xml: 'XML', css: 'CSS', scss: 'SCSS', python: 'Python', java: 'Java',
  csharp: 'C#', php: 'PHP', sql: 'SQL', bash: 'Bash', powershell: 'PowerShell', yaml: 'YAML', json: 'JSON',
  dart: 'Dart', hcl: 'HCL', docker: 'Dockerfile', dockerfile: 'Dockerfile', graphql: 'GraphQL', text: 'Text',
};

const CodeBlock = ({ code, language = 'text', title, playground, showLineNumbers }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const text = String(code).replace(/\n$/, '');
  const lang = isKnownLanguage(language) ? language : 'text';
  const lines = text.split('\n').length;

  // `playground` may be an explicit { language, code } override (e.g. CSS that needs its own HTML).
  const playgroundTarget = playground
    ? playground
    : (() => {
        const id = toPlaygroundLanguage(language, text);
        return id ? { language: id, code: text } : null;
      })();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className="code-block-container">
      <div className="code-block-toolbar">
        <span className="code-block-lang">{title || LANGUAGE_LABELS[language] || language}</span>
        <div className="code-block-actions">
          {playgroundTarget && (
            <button
              type="button"
              className="code-action-btn"
              onClick={() => navigate('/playground', { state: playgroundTarget })}
              title="Open this code in the Playground"
            >
              <Play className="icon-xs" /> <span>Try it</span>
            </button>
          )}
          <button type="button" className="code-action-btn" onClick={handleCopy} title="Copy code" aria-label="Copy code">
            {copied ? <Check className="icon-xs" /> : <Copy className="icon-xs" />} <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <div className="code-block-scroll">
        <SyntaxHighlighter
          language={lang}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers ?? lines > 4}
          lineNumberStyle={{ minWidth: '2.25em', paddingRight: '1em', color: '#64748b', userSelect: 'none' }}
          customStyle={{ margin: 0, padding: '1rem 1.25rem', background: 'transparent', fontSize: '0.875rem', lineHeight: 1.65 }}
          codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
        >
          {text}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;

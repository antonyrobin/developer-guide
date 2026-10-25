import React, { useState } from 'react';
import { FlaskConical, Terminal } from 'lucide-react';
import CodeBlock from './CodeBlock';
import Markdown from './Markdown';

/**
 * Worked examples for a section, shown as tabs (stacked on narrow screens the
 * tab strip scrolls horizontally). Example shape:
 *   { title, language, code, explanation?, output?, playground? }
 */
const Examples = ({ examples, defaultLanguage }) => {
  const [active, setActive] = useState(0);
  if (!examples || examples.length === 0) return null;
  const example = examples[Math.min(active, examples.length - 1)];

  return (
    <section className="examples-section" id="examples" aria-label="Examples">
      <h2 className="section-subtitle">
        <FlaskConical className="icon text-primary" />
        <span>Examples</span>
        <span className="section-subtitle-count">{examples.length}</span>
      </h2>

      {examples.length > 1 && (
        <div className="examples-tabs" role="tablist">
          {examples.map((ex, i) => (
            <button
              key={ex.title}
              role="tab"
              aria-selected={i === active}
              className={`examples-tab ${i === active ? 'examples-tab--active' : ''}`}
              onClick={() => setActive(i)}
            >
              <span className="examples-tab-index">{i + 1}</span>
              {ex.title}
            </button>
          ))}
        </div>
      )}

      <div className="example-card" role="tabpanel">
        {examples.length === 1 && <h3 className="example-title">{example.title}</h3>}
        {example.explanation && (
          <div className="example-explanation course-body-text">
            <Markdown>{example.explanation}</Markdown>
          </div>
        )}
        <CodeBlock
          code={example.code}
          language={example.language || defaultLanguage}
          playground={example.playground}
        />
        {example.output && (
          <div className="example-output">
            <div className="example-output-label"><Terminal className="icon-xs" /> Output</div>
            <pre className="example-output-text">{example.output}</pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default Examples;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Hash, FileText, Loader2, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { courses } from '../data/courses';
import { searchCourses, searchDeep, tokenize } from '../search/searchEngine';

const POPULAR = ['React', 'Flexbox', 'Promise', 'Inheritance', 'Stream API', 'Docker', 'JOIN'];
const DEEP_SEARCH_DELAY = 180;

/** Wraps every occurrence of the search tokens in <mark>. */
const Highlight = ({ text, tokens }) => {
  if (!tokens.length || !text) return text || null;
  const escaped = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'));
  return parts.map((part, i) =>
    i % 2 === 1 ? <mark key={i} className="search-mark">{part}</mark> : <React.Fragment key={i}>{part}</React.Fragment>
  );
};

const SearchModal = ({ onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const controllerRef = useRef(null);

  const [term, setTerm] = useState('');
  const [topics, setTopics] = useState([]);
  const [content, setContent] = useState([]);
  const [phase, setPhase] = useState('idle'); // idle | topics | content | done
  const [activeIndex, setActiveIndex] = useState(0);

  const tokens = useMemo(() => tokenize(term), [term]);
  // Tier 1 is synchronous so matching courses render on the very first keystroke.
  const courseResults = useMemo(() => searchCourses(term), [term]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  /* Tiers 2 & 3 — debounced, cancellable, lazily loaded. */
  useEffect(() => {
    controllerRef.current?.abort();
    setTopics([]);
    setContent([]);
    setActiveIndex(0);

    if (!tokens.length) { setPhase('idle'); return undefined; }

    const controller = new AbortController();
    controllerRef.current = controller;
    setPhase('topics');

    const timer = setTimeout(() => {
      searchDeep(term, {
        signal: controller.signal,
        priorityIds: courseResults.map(r => r.course.id),
        onTopics: (r) => { if (!controller.signal.aborted) setTopics(r); },
        onContent: (r) => { if (!controller.signal.aborted) setContent(r); },
        onPhase: (p) => { if (!controller.signal.aborted) setPhase(p); },
      });
    }, DEEP_SEARCH_DELAY);

    return () => { clearTimeout(timer); controller.abort(); };
    // courseResults is derived from term
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  /* Abort any in-flight search when the modal unmounts. */
  useEffect(() => () => controllerRef.current?.abort(), []);

  const flatResults = useMemo(
    () => [...courseResults, ...topics, ...content],
    [courseResults, topics, content]
  );

  const open = (result) => {
    // Stop the background search immediately and go to the clicked page.
    controllerRef.current?.abort();
    onClose();
    if (result.type === 'course') {
      navigate(`/${result.course.id}`);
    } else if (result.type === 'topic') {
      navigate(`/${result.course.id}/${result.slug}`);
    } else {
      navigate(`/${result.course.id}/${result.slug}?q=${encodeURIComponent(term.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatResults[activeIndex]) {
      e.preventDefault();
      open(flatResults[activeIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  /* Keep the keyboard-selected result in view. */
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const searching = phase === 'topics' || phase === 'content';
  let index = -1;
  const itemProps = (result) => {
    index += 1;
    const i = index;
    return {
      'data-index': i,
      className: `search-result-item ${i === activeIndex ? 'search-result-item--active' : ''}`,
      onMouseMove: () => { if (activeIndex !== i) setActiveIndex(i); },
      onClick: () => open(result),
      role: 'option',
      'aria-selected': i === activeIndex,
    };
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" role="dialog" aria-modal="true" aria-label="Search" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrapper">
          {searching ? <Loader2 className="icon text-primary search-spin" /> : <Search className="icon text-primary" />}
          <input
            ref={inputRef}
            type="search"
            className="search-input"
            placeholder="Search courses, topics and content…"
            value={term}
            onChange={e => setTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          <button className="search-close-btn" onClick={onClose}>ESC</button>
        </div>

        <div className="search-results" id="search-results" role="listbox" ref={listRef}>
          {!tokens.length && (
            <>
              <div className="search-hint">
                Search across all {courses.length} courses — titles, topics, explanations and code.
              </div>
              <div className="search-popular">
                <span className="search-popular-label">Try:</span>
                {POPULAR.map(t => (
                  <button key={t} className="search-tag" onClick={() => setTerm(t)}>{t}</button>
                ))}
              </div>
            </>
          )}

          {tokens.length > 0 && courseResults.length > 0 && (
            <div className="search-group">
              <div className="search-group-label"><BookOpen className="icon-small" /> Courses <span className="search-group-count">{courseResults.length}</span></div>
              {courseResults.map(r => (
                <button key={`c-${r.course.id}`} {...itemProps(r)}>
                  <div className="search-result-title"><Highlight text={r.course.title} tokens={tokens} /></div>
                  <div className="search-result-desc"><Highlight text={r.course.description} tokens={tokens} /></div>
                </button>
              ))}
            </div>
          )}

          {tokens.length > 0 && (topics.length > 0 || phase === 'topics') && (
            <div className="search-group">
              <div className="search-group-label">
                <Hash className="icon-small" /> Topics
                {topics.length > 0 && <span className="search-group-count">{topics.length}</span>}
                {phase === 'topics' && <span className="search-group-status">searching…</span>}
              </div>
              {topics.map(r => (
                <button key={`t-${r.course.id}-${r.sectionIndex}`} {...itemProps(r)}>
                  <div className="search-result-title"><Highlight text={r.title} tokens={tokens} /></div>
                  <div className="search-result-meta">{r.course.title}</div>
                </button>
              ))}
              {phase === 'topics' && topics.length === 0 && <div className="search-skeleton" />}
            </div>
          )}

          {tokens.length > 0 && (content.length > 0 || phase === 'content') && (
            <div className="search-group">
              <div className="search-group-label">
                <FileText className="icon-small" /> Content
                {content.length > 0 && <span className="search-group-count">{content.length}</span>}
                {phase === 'content' && <span className="search-group-status">searching…</span>}
              </div>
              {content.map(r => (
                <button key={`x-${r.course.id}-${r.sectionIndex}`} {...itemProps(r)}>
                  <div className="search-result-title">
                    {r.title} <span className="search-result-meta-inline">· {r.course.title}</span>
                  </div>
                  <div className="search-result-desc search-result-snippet"><Highlight text={r.snippet} tokens={tokens} /></div>
                </button>
              ))}
              {phase === 'content' && content.length === 0 && <div className="search-skeleton" />}
            </div>
          )}

          {tokens.length > 0 && phase === 'done' && flatResults.length === 0 && (
            <div className="search-no-results">No results for “{term}”. Try a shorter or different keyword.</div>
          )}
        </div>

        <div className="search-footer">
          <span><kbd><ArrowUp className="kbd-icon" /></kbd><kbd><ArrowDown className="kbd-icon" /></kbd> navigate</span>
          <span><kbd><CornerDownLeft className="kbd-icon" /></kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

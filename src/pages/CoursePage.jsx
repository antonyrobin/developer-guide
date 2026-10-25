import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { useParams, Navigate, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ExternalLink, CheckCircle, Code, Layers, Info, BookOpen, Globe, PenTool,
  ChevronDown, ChevronUp, ChevronRight, Search, ListTree, Clock, X,
} from 'lucide-react';
import { getCourseMeta, getLoadedCourse, loadCourse, slugify } from '../data/courses';
import { courseKeywords, getLanguage } from '../data/courseMeta';
import { useSEO } from '../hooks/useSEO';
import Markdown from '../components/course/Markdown';
import { extractHeadings } from '../components/course/courseContent';
import CodeBlock from '../components/course/CodeBlock';
import Examples from '../components/course/Examples';

/** Loads full course content lazily; returns the cached course synchronously when available. */
function useCourse(id) {
  const [state, setState] = useState(() => ({ id, course: getLoadedCourse(id), error: null }));

  useEffect(() => {
    if (getLoadedCourse(id)) return undefined;
    let cancelled = false;
    loadCourse(id)
      .then(course => { if (!cancelled) setState({ id, course, error: null }); })
      .catch(error => { if (!cancelled) setState({ id, course: null, error }); });
    return () => { cancelled = true; };
  }, [id]);

  // The cache is the source of truth; state only triggers the re-render once loading finishes.
  const cached = getLoadedCourse(id);
  if (cached) return { course: cached, error: null };
  return state.id === id ? { course: state.course, error: state.error } : { course: null, error: null };
}

/**
 * Highlights matches of `query` inside `root` using the CSS Custom Highlight API
 * (no DOM mutation, so React stays in control of the tree) and scrolls to the
 * first match. Returns a cleanup function.
 */
function highlightQuery(root, query) {
  if (!root || !query) return undefined;
  const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  if (!tokens.length) return undefined;

  const ranges = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.nodeValue.trim() && !node.parentElement.closest('button, nav')
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  });
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue.toLowerCase();
    for (const token of tokens) {
      let pos = text.indexOf(token);
      while (pos !== -1) {
        const range = document.createRange();
        range.setStart(node, pos);
        range.setEnd(node, pos + token.length);
        ranges.push(range);
        pos = text.indexOf(token, pos + token.length);
      }
    }
  }
  if (!ranges.length) return undefined;

  const first = ranges[0].getBoundingClientRect();
  window.scrollTo({ top: Math.max(0, window.scrollY + first.top - window.innerHeight / 3) });

  if (typeof CSS === 'undefined' || !CSS.highlights || typeof Highlight === 'undefined') return undefined;
  CSS.highlights.set('search-hit', new Highlight(...ranges));
  return () => CSS.highlights.delete('search-hit');
}

const readingMinutes = (section) => {
  const words = [section.content, section.code, ...(section.keyPoints || []), ...(section.examples || []).map(e => `${e.explanation || ''} ${e.code}`)]
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

const CourseSkeleton = () => (
  <div className="course-page-layout" aria-busy="true">
    <aside className="sidebar sidebar--skeleton">
      <div className="skeleton skeleton-line" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line" />
    </aside>
    <div className="course-main">
      <div className="skeleton skeleton-badge" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line short" />
    </div>
  </div>
);

const CoursePage = () => {
  const { id, section: sectionSlug } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const meta = getCourseMeta(id);
  const { course, error } = useCourse(id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [topicFilter, setTopicFilter] = useState('');
  const [activeHeading, setActiveHeading] = useState('');
  const articleRef = useRef(null);

  const activeTab = useMemo(() => {
    if (!course || !sectionSlug) return 0;
    const idx = course.sections.findIndex(s => slugify(s.title) === sectionSlug);
    return idx === -1 ? 0 : idx;
  }, [course, sectionSlug]);

  const section = course ? course.sections[activeTab] : null;

  useSEO({
    title: meta ? (section && activeTab > 0 ? `${section.title} — ${meta.title}` : meta.title) : null,
    description: meta ? `Learn ${meta.title}${section ? ` — ${section.title}` : ''}. ${meta.description} Concise explanations, code examples, and visual diagrams on QuickDevGuide.` : null,
    keywords: meta ? (courseKeywords[meta.id] || `${meta.title}, programming, developer guide, tutorial`) : null,
  });

  // Reset per-course UI state when switching courses
  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    setTopicFilter('');
    setIsSidebarOpen(false);
  }

  // Scroll to top when the course or section changes (unless we are jumping to a search hit)
  useEffect(() => {
    if (!query) window.scrollTo({ top: 0 });
  }, [id, activeTab, query]);

  // Highlight the search term that brought the user here
  useLayoutEffect(() => {
    if (!section || !query) return undefined;
    return highlightQuery(articleRef.current, query);
  }, [section, query]);

  const headings = useMemo(() => {
    if (!section) return [];
    const list = extractHeadings(section.content);
    if (section.code) list.push({ level: 2, text: section.codeLabel || 'Code Example', id: 'code-example' });
    if (section.examples && section.examples.length) list.push({ level: 2, text: 'Examples', id: 'examples' });
    if (section.keyPoints && section.keyPoints.length) list.push({ level: 2, text: 'Key Takeaways', id: 'key-takeaways' });
    return list;
  }, [section]);

  // Scroll-spy for the "On this page" panel
  useEffect(() => {
    if (!headings.length || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveHeading(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -65% 0px' }
    );
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!meta) return <Navigate to="/" replace />;
  if (error) {
    return (
      <div className="course-error">
        <h1>Couldn’t load {meta.title}</h1>
        <p>Please check your connection and try again.</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
  if (!course) return <CourseSkeleton />;

  const goTo = (idx) => {
    setIsSidebarOpen(false);
    navigate(idx === 0 ? `/${id}` : `/${id}/${slugify(course.sections[idx].title)}`);
  };

  const filterTokens = topicFilter.toLowerCase().split(/\s+/).filter(Boolean);
  const visibleSections = course.sections
    .map((sec, idx) => ({ sec, idx }))
    .filter(({ sec }) => filterTokens.every(t => sec.title.toLowerCase().includes(t)));

  const sectionLanguage = section.codeLanguage || getLanguage(id);
  const progress = Math.round(((activeTab + 1) / course.sections.length) * 100);

  return (
    <div className={`course-page-layout ${headings.length > 1 ? 'course-page-layout--toc' : ''}`}>
      {/* Left Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`} aria-label={`${course.title} topics`}>
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-expanded={isSidebarOpen}>
          <span className="sidebar-title">
            <Layers className="icon" />
            <span>{course.title}</span>
          </span>
          <span className="sidebar-toggle-meta">
            <span className="sidebar-toggle-progress">{activeTab + 1}/{course.sections.length}</span>
            {isSidebarOpen ? <ChevronUp className="icon sidebar-toggle-icon" /> : <ChevronDown className="icon sidebar-toggle-icon" />}
          </span>
        </button>
        <div className="sidebar-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
        <div className="sidebar-collapsible">
          {course.sections.length > 8 && (
            <label className="sidebar-filter">
              <Search className="icon-xs" />
              <input
                type="text"
                placeholder="Filter topics…"
                value={topicFilter}
                onChange={e => setTopicFilter(e.target.value)}
                aria-label="Filter topics"
              />
              {topicFilter && (
                <button type="button" onClick={() => setTopicFilter('')} aria-label="Clear filter"><X className="icon-xs" /></button>
              )}
            </label>
          )}
          <nav className="sidebar-nav">
            {visibleSections.map(({ sec, idx }) => (
              <button
                key={sec.title}
                onClick={() => goTo(idx)}
                className={`sidebar-nav-btn ${activeTab === idx ? 'active' : ''}`}
                aria-current={activeTab === idx ? 'page' : undefined}
              >
                <span className="sidebar-nav-index">{idx + 1}</span>
                <span className="sidebar-nav-label">{sec.title}</span>
              </button>
            ))}
            {visibleSections.length === 0 && <p className="sidebar-empty">No topics match “{topicFilter}”.</p>}
          </nav>

          {(course.officialDocs || course.tutorialLink || course.exerciseLink) && (
            <div className="sidebar-info">
              <h4 className="sidebar-links-heading">Resources</h4>
              <div className="sidebar-links">
                {course.officialDocs && (
                  <a href={course.officialDocs} target="_blank" rel="noopener noreferrer" className="sidebar-resource-link">
                    <Globe className="icon-small" />
                    <span>Official Docs</span>
                    <ExternalLink className="icon-small" />
                  </a>
                )}
                {course.tutorialLink && (
                  <a href={course.tutorialLink} target="_blank" rel="noopener noreferrer" className="sidebar-resource-link">
                    <BookOpen className="icon-small" />
                    <span>Tutorial Guide</span>
                    <ExternalLink className="icon-small" />
                  </a>
                )}
                {course.exerciseLink && (
                  <a href={course.exerciseLink} target="_blank" rel="noopener noreferrer" className="sidebar-resource-link">
                    <PenTool className="icon-small" />
                    <span>Exercises</span>
                    <ExternalLink className="icon-small" />
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="sidebar-info">
            <div className="info-box">
              <Info className="icon text-primary" style={{ flexShrink: 0 }} />
              <p>Quick-reference guide for fast recall. Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search every course.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <article className="course-main" ref={articleRef}>
        <div key={id + activeTab} className="course-content-wrapper animate-content-in">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <NavLink to="/">Home</NavLink>
            <ChevronRight className="icon-xs" />
            <span>{course.group}</span>
            <ChevronRight className="icon-xs" />
            <NavLink to={`/${id}`}>{course.title}</NavLink>
          </nav>

          <header className="course-header-info">
            <div className="course-header-meta">
              <span className="badge">{course.title}</span>
              <span className="course-meta-item">Topic {activeTab + 1} of {course.sections.length}</span>
              <span className="course-meta-item"><Clock className="icon-xs" /> {readingMinutes(section)} min read</span>
            </div>
            <h1 className="course-heading">{section.title}</h1>
          </header>

          {query && (
            <div className="search-context-banner">
              <Search className="icon-xs" />
              <span>Showing matches for <strong>“{query}”</strong></span>
              <button type="button" onClick={() => navigate({ search: '' }, { replace: true })}>Clear</button>
            </div>
          )}

          <div className="course-body-text">
            <Markdown>{section.content}</Markdown>
          </div>

          {section.image && (
            <figure className="course-image-container">
              <img src={section.image} alt={section.title} className="course-image" loading="lazy" decoding="async" />
            </figure>
          )}

          {section.code && (
            <section className="code-section" id="code-example">
              <h2 className="section-subtitle">
                <Code className="icon text-primary" />
                <span>{section.codeLabel || 'Code Example'}</span>
              </h2>
              <CodeBlock code={section.code} language={sectionLanguage} />
            </section>
          )}

          <Examples examples={section.examples} defaultLanguage={sectionLanguage} />

          {section.keyPoints && section.keyPoints.length > 0 && (
            <section className="key-points-full" id="key-takeaways">
              <h2 className="section-subtitle">
                <CheckCircle className="icon text-success" />
                <span>Key Takeaways</span>
              </h2>
              <ul className="key-points-list">
                {section.keyPoints.map((point, i) => (
                  <li key={i} className="key-point-item">
                    <CheckCircle className="icon-small text-success" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav className="course-nav-buttons" aria-label="Topic navigation">
            {activeTab > 0 ? (
              <button className="course-nav-card" onClick={() => goTo(activeTab - 1)}>
                <span className="course-nav-dir">← Previous</span>
                <span className="course-nav-title">{course.sections[activeTab - 1].title}</span>
              </button>
            ) : <span />}
            {activeTab < course.sections.length - 1 && (
              <button className="course-nav-card course-nav-card--next" onClick={() => goTo(activeTab + 1)}>
                <span className="course-nav-dir">Next →</span>
                <span className="course-nav-title">{course.sections[activeTab + 1].title}</span>
              </button>
            )}
          </nav>
        </div>
      </article>

      {/* On this page */}
      {headings.length > 1 && (
        <aside className="toc" aria-label="On this page">
          <h4 className="toc-title"><ListTree className="icon-xs" /> On this page</h4>
          <ul>
            {headings.map(h => (
              <li key={h.id} className={`toc-item toc-item--l${h.level}`}>
                <a
                  href={`#${h.id}`}
                  className={activeHeading === h.id ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveHeading(h.id);
                  }}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
};

export default CoursePage;

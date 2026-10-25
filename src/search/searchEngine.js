import { courses, loadCourse, getLoadedCourse, slugify } from '../data/courses';

/*
 * Three-tier site search:
 *   1. Courses  — title / description / id, from the bundled catalog (synchronous, instant)
 *   2. Topics   — section titles, after course content has been lazily loaded
 *   3. Content  — section body, code samples, examples and key points
 *
 * Tiers 2 and 3 are asynchronous, yield to the main thread between courses and
 * stop as soon as the provided AbortSignal is aborted (new keystroke, result
 * clicked, modal closed).
 */

export const MAX_TOPIC_RESULTS = 25;
export const MAX_CONTENT_RESULTS = 40;
// Content is ranked by relevance, so collect more candidates than we display.
const CONTENT_CANDIDATES = 300;
const LOAD_CONCURRENCY = 6;

export const tokenize = (term) =>
  term.toLowerCase().trim().split(/\s+/).filter(Boolean);

const matchesAll = (haystack, tokens) => tokens.every(t => haystack.includes(t));

/* ── Tier 1: courses ─────────────────────────────────────────────────────── */

export function searchCourses(term) {
  const tokens = tokenize(term);
  if (!tokens.length) return [];
  const phrase = tokens.join(' ');

  return courses
    .map((course, order) => {
      const title = course.title.toLowerCase();
      const desc = course.description.toLowerCase();
      const id = course.id.toLowerCase();
      if (!matchesAll(`${title} ${id} ${desc}`, tokens)) return null;

      let score = 0;
      if (title === phrase || id === phrase) score = 100;
      else if (title.startsWith(phrase)) score = 80;
      else if (matchesAll(`${title} ${id}`, tokens)) score = 60;
      else score = 20; // description-only match
      return { type: 'course', course, score, order };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.order - b.order);
}

/* ── Plain-text index per course (built lazily, cached) ──────────────────── */

const indexCache = new Map();

const stripMarkdown = (md = '') =>
  md
    .replace(/```[\s\S]*?```/g, m => m.replace(/```\w*/g, ' '))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#|]/g, ' ')
    .replace(/-{3,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function getIndex(course) {
  let index = indexCache.get(course.id);
  if (index) return index;

  index = course.sections.map((section, sectionIndex) => {
    const parts = [
      stripMarkdown(section.content),
      ...(section.keyPoints || []),
      section.code || '',
      ...(section.examples || []).flatMap(ex => [ex.title, ex.explanation || '', ex.code]),
    ];
    const text = parts.join(' \n ').replace(/\s+/g, ' ');
    return {
      sectionIndex,
      title: section.title,
      titleLower: section.title.toLowerCase(),
      slug: slugify(section.title),
      text,
      textLower: text.toLowerCase(),
    };
  });

  indexCache.set(course.id, index);
  return index;
}

function makeSnippet(text, textLower, tokens, radius = 70) {
  const pos = Math.max(0, textLower.indexOf(tokens[0]));
  const start = Math.max(0, pos - radius);
  const end = Math.min(text.length, pos + tokens[0].length + radius * 1.6);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

const countHits = (textLower, tokens) =>
  tokens.reduce((sum, t) => {
    let n = 0;
    for (let i = textLower.indexOf(t); i !== -1; i = textLower.indexOf(t, i + t.length)) n++;
    return sum + n;
  }, 0);

/* ── Helpers ──────────────────────────────────────────────────────────────── */

const yieldToMain = () =>
  new Promise(resolve => {
    if (typeof window !== 'undefined' && window.scheduler && window.scheduler.yield) {
      window.scheduler.yield().then(resolve);
    } else {
      setTimeout(resolve, 0);
    }
  });

class AbortedError extends Error {}
const checkAborted = (signal) => { if (signal && signal.aborted) throw new AbortedError(); };

/**
 * Loads courses with bounded concurrency and yields them in the requested
 * order as soon as each one (and everything before it) is ready.
 */
async function* loadInOrder(ids, signal) {
  const pending = ids.map(() => null);
  let next = 0;
  let consumed = 0;
  const kick = () => {
    while (next < ids.length && next - consumed < LOAD_CONCURRENCY) {
      const i = next++;
      const ready = getLoadedCourse(ids[i]);
      pending[i] = ready ? Promise.resolve(ready) : loadCourse(ids[i]).catch(() => null);
    }
  };
  kick();
  for (let i = 0; i < ids.length; i++) {
    const course = await pending[i];
    consumed++;
    checkAborted(signal);
    kick();
    if (course) yield course;
  }
}

/* ── Tiers 2 & 3 ─────────────────────────────────────────────────────────── */

/**
 * @param {string} term
 * @param {{ signal: AbortSignal, priorityIds?: string[],
 *           onTopics: Function, onContent: Function, onPhase: Function }} options
 */
export async function searchDeep(term, { signal, priorityIds = [], onTopics, onContent, onPhase }) {
  const tokens = tokenize(term);
  if (!tokens.length) return;

  const prioritySet = new Set(priorityIds);
  const orderedIds = [...priorityIds, ...courses.map(c => c.id).filter(id => !prioritySet.has(id))];

  try {
    /* Tier 2 — topics (section titles) */
    onPhase('topics');
    const topics = [];
    const loaded = [];
    for await (const course of loadInOrder(orderedIds, signal)) {
      loaded.push(course);
      const found = [];
      for (const entry of getIndex(course)) {
        if (topics.length + found.length >= MAX_TOPIC_RESULTS) break;
        if (matchesAll(entry.titleLower, tokens)) {
          found.push({ type: 'topic', course, ...entry });
        }
      }
      if (found.length) {
        topics.push(...found);
        onTopics([...topics]);
      }
      await yieldToMain();
      checkAborted(signal);
    }

    /* Tier 3 — content (body text, code, examples, key points) */
    onPhase('content');
    const content = [];
    const topicKeys = new Set(topics.map(t => `${t.course.id}#${t.sectionIndex}`));
    for (const course of loaded) {
      if (content.length >= CONTENT_CANDIDATES) break;
      const found = [];
      for (const entry of getIndex(course)) {
        if (content.length + found.length >= CONTENT_CANDIDATES) break;
        if (topicKeys.has(`${course.id}#${entry.sectionIndex}`)) continue;
        if (matchesAll(entry.textLower, tokens)) {
          found.push({
            type: 'content',
            course,
            ...entry,
            snippet: makeSnippet(entry.text, entry.textLower, tokens),
            hits: countHits(entry.textLower, tokens),
          });
        }
      }
      if (found.length) {
        content.push(...found);
        // Most relevant first: sections that mention the term most often.
        onContent([...content].sort((a, b) => b.hits - a.hits).slice(0, MAX_CONTENT_RESULTS));
      }
      await yieldToMain();
      checkAborted(signal);
    }

    onPhase('done');
  } catch (err) {
    if (!(err instanceof AbortedError)) throw err;
  }
}

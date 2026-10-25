import { slugify } from '../../data/courses';

/** Maps a code-block language to a Code Playground language id (or null if not runnable there). */
export function toPlaygroundLanguage(language, code = '') {
  switch (language) {
    case 'html': case 'markup': return 'html';
    case 'css': return /HTML structure/i.test(code) ? 'css' : null; // pure CSS needs markup to preview
    case 'javascript': case 'js': return 'javascript';
    case 'typescript': case 'ts': return 'typescript';
    case 'python': case 'py': return 'python';
    case 'sql': return 'sql';
    case 'jsx': return /function\s+App\s*\(/.test(code) ? 'react' : null;
    default: return null;
  }
}

/** Extracts `### headings` from markdown (outside code fences) for the on-page table of contents. */
export function extractHeadings(markdown = '') {
  const headings = [];
  let inFence = false;
  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (m) {
      const text = m[2].replace(/[*_`]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
      headings.push({ level: m[1].length, text, id: slugify(text) });
    }
  }
  return headings;
}


/**
 * Merges a course extension module into a base course definition.
 *
 * Extension shape (all keys optional):
 *   {
 *     examples: { '<existing section title>': [example, ...] },   // appended to that section
 *     sections: [{ ...section, after: '<existing section title>' }] // inserted after `after`
 *   }                                                              // (or before "Best Practices" when omitted)
 *
 * Example shape: { title, language, code, explanation?, output? }
 */
export function mergeCourse(base, extension) {
  if (!extension) return base;

  const sections = base.sections.map(s => ({ ...s }));
  const byTitle = new Map(sections.map(s => [s.title, s]));

  for (const [title, examples] of Object.entries(extension.examples || {})) {
    const target = byTitle.get(title);
    if (!target) {
      console.warn(`[mergeCourse] ${base.id}: no section titled "${title}"`);
      continue;
    }
    target.examples = [...(target.examples || []), ...examples];
  }

  for (const { after, ...section } of extension.sections || []) {
    let index;
    if (after) {
      index = sections.findIndex(s => s.title === after);
      if (index === -1) console.warn(`[mergeCourse] ${base.id}: no section titled "${after}"`);
      else index += 1;
    }
    if (index === undefined || index === -1) {
      // Default: keep "Best Practices" style wrap-up sections at the end.
      const wrapUp = sections.findIndex(s => /best practices/i.test(s.title));
      index = wrapUp === -1 ? sections.length : wrapUp;
    }
    sections.splice(index, 0, section);
  }

  return { ...base, sections };
}

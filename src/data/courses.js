import { catalog } from './catalog.generated';
import { mergeCourse } from './mergeCourse';

/*
 * Navigation groups reference courses by id. Only lightweight metadata
 * (id, title, description, sectionCount) is bundled up-front via the generated
 * catalog; the full course content is code-split and loaded on demand with
 * `loadCourse(id)`.
 */
const groupDefs = [
  { label: 'Fundamentals', ids: ['sdlc', 'development-strategies', 'oops', 'data-structure', 'design-patterns', 'sys-arch'] },
  { label: 'Web Essentials', ids: ['html', 'css', 'tailwind-css', 'javascript'] },
  { label: 'Frontend Frameworks', ids: ['react', 'angular', 'nextjs', 'ionic', 'flutter'] },
  { label: 'Backend Languages', ids: ['java', 'csharp', 'python', 'php', 'java-reports'] },
  { label: 'Backend Frameworks', ids: ['spring-boot', 'dotnet-api', 'blazor', 'django', 'flask', 'fastapi', 'play-framework', 'dotnet-framework', 'graphql-grpc'] },
  { label: 'Databases', ids: ['sql', 'postgresql', 'nosql', 'redis', 'mongodb', 'elasticsearch', 'ssrs', 'etl'] },
  { label: 'Testing', ids: ['playwright', 'selenium', 'k6', 'jmeter', 'mocha'] },
  {
    label: 'Others',
    children: [
      { label: 'DevOps & Cloud', ids: ['linux', 'docker', 'kubernetes', 'terraform', 'github', 'github-actions', 'azure-devops', 'aws', 'gcp', 'opentelemetry'] },
      { label: 'Messaging & Caching', ids: ['rabbitmq', 'kafka'] },
      { label: 'Security & Performance', ids: ['cloudflare', 'owasp'] },
    ],
  },
];

const toMeta = (id, group) => {
  const meta = catalog[id];
  if (!meta) throw new Error(`Unknown course id "${id}" in courseGroups`);
  return { ...meta, group };
};

export const courseGroups = groupDefs.map(g =>
  g.children
    ? { label: g.label, children: g.children.map(c => ({ label: c.label, courses: c.ids.map(id => toMeta(id, c.label)) })) }
    : { label: g.label, courses: g.ids.map(id => toMeta(id, g.label)) }
);

/** Flat list of course metadata in navigation order. */
export const courses = courseGroups.flatMap(g =>
  g.courses ? g.courses : g.children.flatMap(c => c.courses)
);

const courseById = new Map(courses.map(c => [c.id, c]));

export const getCourseMeta = (id) => courseById.get(id) || null;

const dataModules = import.meta.glob('./courses-data/*.js');
const extensionModules = import.meta.glob('./course-extensions/*.js');

const cache = new Map();

/** Synchronously returns a course that has already been loaded, or null. */
export const getLoadedCourse = (id) => {
  const entry = cache.get(id);
  return entry && entry.value ? entry.value : null;
};

/** Loads (and caches) the full course content, merged with its extension module. */
export function loadCourse(id) {
  const meta = courseById.get(id);
  if (!meta) return Promise.resolve(null);
  if (cache.has(id)) return cache.get(id).promise;

  const entry = {};
  const loadData = dataModules[`./courses-data/${meta.file}.js`];
  const loadExt = extensionModules[`./course-extensions/${id}.js`];

  entry.promise = Promise.all([loadData(), loadExt ? loadExt() : null])
    .then(([dataMod, extMod]) => {
      const base = Object.values(dataMod).find(v => v && v.id && v.sections);
      entry.value = { ...mergeCourse(base, extMod && extMod.default), group: meta.group };
      return entry.value;
    })
    .catch(err => {
      cache.delete(id);
      throw err;
    });

  cache.set(id, entry);
  return entry.promise;
}

/** Converts a section title into a URL-friendly slug. */
export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

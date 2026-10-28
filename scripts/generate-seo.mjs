/**
 * Post-build SEO prerender. For every route it writes a static HTML file into
 * dist/ whose <head> already carries the page's title, description, keywords,
 * canonical URL, Open Graph tags and JSON-LD, plus crawlable content (headings,
 * summary, internal links) inside #root that React replaces on mount. Also
 * writes sitemap.xml and robots.txt.
 *
 * Files are named `<route>.html` (e.g. dist/react.html, dist/react/hooks.html)
 * so Cloudflare Pages serves them at /react and /react/hooks without a
 * trailing-slash redirect. No 404.html is emitted, which keeps SPA fallback on.
 *
 * Runs automatically after `npm run build`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mergeCourse } from '../src/data/mergeCourse.js';
import { catalog } from '../src/data/catalog.generated.js';
import {
  SITE_URL, SITE_NAME, HOME_SEO, getCourseSEO, getSectionSEO, courseJsonLd, websiteJsonLd, excerpt,
} from '../src/data/seo.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const dataDir = path.join(root, 'src/data/courses-data');
const extDir = path.join(root, 'src/data/course-extensions');

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<!-- seo:start -->') || !template.includes('<!-- seo:end -->')) {
  throw new Error('dist/index.html is missing the <!-- seo:start --> / <!-- seo:end --> markers');
}

const slugify = (text) =>
  String(text).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const jsonLdTag = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

function render({ urlPath, title, description, keywords, type = 'website', jsonLd, body }) {
  const url = `${SITE_URL}${urlPath}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : HOME_SEO.title;
  const head = [
    `<title>${esc(fullTitle)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="keywords" content="${esc(keywords)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(fullTitle)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta name="twitter:title" content="${esc(fullTitle)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    jsonLd ? jsonLdTag(jsonLd).replace('<script', '<script id="page-jsonld"') : '',
  ].filter(Boolean).join('\n    ');

  return template
    .replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, `<!-- seo:start -->\n    ${head}\n    <!-- seo:end -->`)
    .replace(/(<div id="initial-loader">[\s\S]*?<\/div>\s*<\/div>)/, `$1\n      <div id="prerender">${body}</div>`);
}

const writePage = (file, html) => {
  const out = path.join(dist, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
};

/* ---- Load courses (same merge as the app) ---- */
const courses = [];
for (const file of fs.readdirSync(dataDir).filter(f => f.endsWith('.js')).sort()) {
  const mod = await import(pathToFileURL(path.join(dataDir, file)).href);
  const base = Object.values(mod).find(v => v && typeof v === 'object' && v.id && v.sections);
  const extFile = path.join(extDir, `${base.id}.js`);
  const ext = fs.existsSync(extFile) ? (await import(pathToFileURL(extFile).href)).default : null;
  courses.push(mergeCourse(base, ext));
}
courses.sort((a, b) => a.title.localeCompare(b.title));

const today = new Date().toISOString().slice(0, 10);
const sitemap = [{ loc: '/', priority: '1.0', changefreq: 'weekly' }];
const homeLinks = courses.map(c => {
  const seo = getCourseSEO(catalog[c.id]);
  return `<li><a href="/${c.id}">${esc(c.title)} Tutorial</a> — ${esc(seo.description)}</li>`;
}).join('');

/* ---- Home ---- */
writePage('index.html', render({
  urlPath: '/',
  title: null,
  description: HOME_SEO.description,
  keywords: HOME_SEO.keywords,
  jsonLd: {
    ...websiteJsonLd(),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: courses.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.title} Tutorial`, url: `${SITE_URL}/${c.id}` })),
    },
  },
  body: `<h1>${SITE_NAME} — Free Developer Quick Reference &amp; Programming Tutorials</h1>
<p>${esc(HOME_SEO.description)}</p>
<h2>Courses</h2><ul>${homeLinks}</ul>
<p><a href="/playground">Online Code Playground</a></p>`,
}));

/* ---- Courses and sections ---- */
let pageCount = 1;
for (const course of courses) {
  const meta = catalog[course.id];
  if (!meta) throw new Error(`Course "${course.id}" missing from catalog — run npm run catalog`);
  const seo = getCourseSEO(meta);
  const sectionLinks = course.sections.map((s, i) => {
    const href = i === 0 ? `/${course.id}` : `/${course.id}/${slugify(s.title)}`;
    return `<li><a href="${href}">${esc(s.title)}</a></li>`;
  }).join('');
  const nav = `<nav aria-label="${esc(course.title)} topics"><h2>${esc(course.title)} Topics</h2><ol>${sectionLinks}</ol></nav>`;
  const crumbs = `<p><a href="/">Home</a> › <a href="/${course.id}">${esc(course.title)}</a></p>`;

  writePage(`${course.id}.html`, render({
    urlPath: `/${course.id}`,
    ...seo,
    jsonLd: courseJsonLd(meta, { sections: course.sections }),
    body: `${crumbs}<h1>${esc(course.title)} Tutorial</h1><p>${esc(seo.description)}</p>
<h2>${esc(course.sections[0].title)}</h2><p>${esc(excerpt(course.sections[0].content, 600))}</p>${nav}`,
  }));
  sitemap.push({ loc: `/${course.id}`, priority: '0.9', changefreq: 'weekly' });
  pageCount++;

  course.sections.forEach((section, i) => {
    if (i === 0) return; // the first section lives at /<course>
    const sectionPath = `/${course.id}/${slugify(section.title)}`;
    const sectionSeo = getSectionSEO(meta, section);
    const points = (section.keyPoints || []).map(p => `<li>${esc(excerpt(p, 300))}</li>`).join('');
    writePage(`${course.id}/${slugify(section.title)}.html`, render({
      urlPath: sectionPath,
      ...sectionSeo,
      type: 'article',
      jsonLd: courseJsonLd(meta, { section, sectionPath }),
      body: `${crumbs}<h1>${esc(section.title)} — ${esc(course.title)}</h1>
<p>${esc(excerpt(section.content, 800))}</p>${points ? `<h2>Key Takeaways</h2><ul>${points}</ul>` : ''}${nav}`,
    }));
    sitemap.push({ loc: sectionPath, priority: '0.7', changefreq: 'monthly' });
    pageCount++;
  });
}

/* ---- Static pages ---- */
const staticPages = [
  {
    urlPath: '/playground', priority: '0.6',
    title: 'Online Code Playground — Run JavaScript, Python, SQL, HTML & CSS',
    description: 'Write, edit, and run code in your browser with ready-made examples. Supports HTML, CSS, JavaScript, TypeScript, React, Python, SQL and PHP, plus Java, C# and Dart snippets.',
    keywords: 'code playground, online code editor, online compiler, run code online, JavaScript playground, Python online, SQL online, HTML CSS editor, live code editor, TypeScript playground, React playground, PHP online, try it yourself, browser IDE',
  },
  {
    urlPath: '/privacy-policy', priority: '0.2', title: 'Privacy Policy',
    description: 'QuickDevGuide Privacy Policy — Learn how we collect, use, and protect your personal information when you use our developer reference guide.',
    keywords: 'privacy policy, data protection, cookies, QuickDevGuide',
  },
  {
    urlPath: '/terms-of-service', priority: '0.2', title: 'Terms of Service',
    description: 'QuickDevGuide Terms of Service — Read our terms and conditions for using the developer quick-reference guide and educational resources.',
    keywords: 'terms of service, terms and conditions, usage policy, QuickDevGuide',
  },
];
for (const { priority, ...page } of staticPages) {
  writePage(`${page.urlPath.slice(1)}.html`, render({
    ...page,
    body: `<p><a href="/">Home</a></p><h1>${esc(page.title)}</h1><p>${esc(page.description)}</p>`,
  }));
  sitemap.push({ loc: page.urlPath, priority, changefreq: 'yearly' });
  pageCount++;
}

/* ---- sitemap.xml + robots.txt ---- */
const urls = sitemap.map(u =>
  `  <url><loc>${SITE_URL}${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
).join('\n');
fs.writeFileSync(path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`seo: prerendered ${pageCount} pages, sitemap.xml (${sitemap.length} URLs), robots.txt`);

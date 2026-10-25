# QuickDevGuide

QuickDevGuide is a frontend-only developer reference application built with React and Vite. It presents curated learning content across frontend, backend, cloud, DevOps, architecture, and software engineering topics in a fast, searchable single-page experience.

The project is designed for learners and working developers who want short explanations, code examples, diagrams, and quick takeaways without navigating long-form documentation for every concept.

## Project Stack

### Core technologies

- React 19 for the UI layer.
- Vite 6 for local development, fast bundling, and production builds.
- React Router 7 for client-side routing between the home page, course pages, and legal pages.
- Lucide React for iconography used across the interface.
- Framer Motion as an animation dependency for interactive and polished UI behavior.
- ESLint 9 for code quality and linting.

### Content and architecture

- Course content is stored as JavaScript modules in `src/data/courses-data`.
- `src/data/courses.js` defines the navigation groups and lazily loads each course on demand; optional modules in `src/data/course-extensions` add sections and examples.
- Static visual assets are served from `public/images`.
- The app is a static SPA with no backend or database dependency.
- SEO metadata is managed on the client through the custom `useSEO` hook.

## Functionalities

QuickDevGuide currently includes 56 curated course guides covering topics such as SDLC, HTML, CSS, JavaScript, OOP, Java, C#, Python, React, PHP, SQL, NoSQL, Docker, Spring Boot, Blazor, .NET API, Django, AWS, GCP, Azure DevOps, data structures, system architecture, design patterns, GitHub, and GitHub Actions.

### User-facing features

- Home page with a course catalog, category quick-jump chips and topic counts.
- Deep-linkable topics: every section has its own URL (`/java/generics`), so the back button and bookmarks work.
- Three-tier search (`Ctrl+K` / `Cmd+K`): matching **courses** appear instantly, then matching **topics** (section titles), then matching **content** (explanations, code, examples, key points). Topics and content are searched lazily and the search is cancelled as soon as a result is clicked. Content hits open the topic with the search term highlighted.
- Course pages with breadcrumb, progress, topic filter, "On this page" table of contents, styled tables and callouts.
- Code blocks with syntax highlighting, line numbers, **Copy** and **Try it** (opens the snippet in the Playground).
- Worked **Examples** per topic, shown as tabs, with explanations and expected output.
- Code Playground: HTML, CSS, JavaScript, TypeScript, React, Python (Pyodide), SQL (SQLite) and PHP (php-wasm) run in the browser; Java, C# and Dart are editable with links to official online runners. Ready-made examples per language, shareable links, saved sessions, and a Stop button for runaway JavaScript (runs in a Web Worker).
- Responsive layout from phones to wide screens; keyboard and screen-reader friendly.
- SEO-friendly page titles and meta descriptions per course and topic.
- Privacy Policy and Terms of Service pages.

### How the content works

Each course object defines its own:

- `id` for routing.
- `title` and `description` for listing and metadata.
- `sections` for the actual learning content.
- Optional resource links such as official docs, tutorials, and exercises.

Each section supports:

| Field | Purpose |
|---|---|
| `title` | Topic name (also its URL slug) |
| `content` | Markdown (GitHub-flavoured: tables, fenced code, callouts with `>`) |
| `image` | Optional diagram under `public/images` |
| `code`, `codeLabel`, `codeLanguage` | Main code sample; language defaults per course |
| `examples` | `[{ title, language, code, explanation?, output?, playground? }]` shown as tabs |
| `keyPoints` | Key takeaways list |

### Performance

Only lightweight course metadata (`src/data/catalog.generated.js`) ships in the initial bundle. Each course's content is a separate chunk loaded on demand, and the Playground, legal pages and Markdown renderer are lazy-loaded too.

## Project Structure

```text
developer-guide/
|- public/
|  |- images/
|- scripts/
|  |- generate-catalog.mjs      # builds catalog.generated.js (runs before dev/build)
|- src/
|  |- components/
|  |  |- course/                # Markdown, CodeBlock, Examples, syntax highlighter
|  |  |- Header.jsx, SearchModal.jsx, Footer.jsx, ...
|  |- data/
|  |  |- courses-data/          # one module per course
|  |  |- course-extensions/     # extra sections & examples merged into a course
|  |  |- courses.js             # navigation groups + lazy loadCourse()
|  |  |- catalog.generated.js   # generated metadata (do not edit)
|  |  |- mergeCourse.js
|  |- playground/               # Playground languages, runners, editor
|  |- search/                   # tiered, cancellable search engine
|  |- pages/
|  |- styles/guide.css
|  |- App.jsx
|  |- index.css
|  |- main.jsx
|- index.html
|- package.json
|- vite.config.js
|- eslint.config.js
```

## Setup Guidelines

### Prerequisites

- Node.js 18 or newer.
- npm 9 or newer.

### Installation

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

By default, Vite will print the local development URL in the terminal.

### Create a production build

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

### Run lint checks

```bash
npm run lint
```

## Development Notes

### Adding a new course

1. Create a course module in `src/data/courses-data` exporting the course object.
2. Add its `id` to the right group in `groupDefs` in `src/data/courses.js`.
3. Run `npm run catalog` (also runs automatically before `npm run dev` / `npm run build`).
4. Add any related image assets under `public/images` if needed.

### Adding sections or examples to an existing course

Create or edit `src/data/course-extensions/<course-id>.js`:

```js
export default {
  // Extra worked examples appended to existing sections (matched by title)
  examples: {
    'Promises': [{ title: 'Retry with backoff', language: 'javascript', code: '...' }],
  },
  // New sections, inserted after the named section (default: before "Best Practices")
  sections: [{ title: 'Generics', after: 'Classes, Interfaces & Inheritance', content: '...', code: '...' }],
};
```

The merge prints a warning if a referenced section title does not exist. Extensions currently enrich HTML, CSS, JavaScript, OOP, Java, Python, SQL, React and C#.

### Updating existing content

- Edit the relevant module in `src/data/courses-data` or its extension.
- Keep course ids and section titles stable — they form the URLs.
- Prefer structured sections with concise explanations, sample code, examples and key takeaways.
- Examples that define `function App()` (React) or use HTML/JS/TS/Python/SQL get a **Try it** button automatically. Pure CSS examples need a `playground` override with the HTML to style.

## License

This project is licensed under the MIT License. See the `LICENSE` file for the full text.

In practical terms, the MIT License allows you to use, modify, publish, distribute, and reuse the code in personal or commercial projects as long as the copyright notice and license text are preserved.

## Open Source Details

QuickDevGuide is distributed as an open source project under the MIT License.

This means you may:

- Use the project for personal, educational, or commercial work.
- Modify the source code to fit your own needs.
- Redistribute the original or modified version.
- Include the code in larger private or public projects.

This also means you must:

- Keep the existing copyright notice.
- Keep the MIT license text when redistributing substantial portions of the project.
- Respect third-party licenses for dependencies and external assets.

## Copyright

Copyright (c) 2026 Antony Robin.

Unless otherwise stated, the source code and repository-authored documentation in this project are covered by the MIT License. A separate copyright notice is also provided in the `COPYRIGHT` file for reference.

### Important note on third-party content

- External documentation links referenced in the course content remain the property of their respective owners.
- Third-party libraries used by this project are distributed under their own licenses.
- If any images or brand assets are subject to separate usage terms, those terms still apply independently of the project license.

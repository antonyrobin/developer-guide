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
- A central course registry in `src/data/courses.js` assembles all course definitions.
- Static visual assets are served from `public/images`.
- The app is a static SPA with no backend or database dependency.
- SEO metadata is managed on the client through the custom `useSEO` hook.

## Functionalities

QuickDevGuide currently includes 25 curated course guides covering topics such as SDLC, HTML, CSS, JavaScript, OOP, Java, C#, Python, React, PHP, SQL, NoSQL, Docker, Spring Boot, Blazor, .NET API, Django, AWS, GCP, Azure DevOps, data structures, system architecture, design patterns, GitHub, and GitHub Actions.

### User-facing features

- Home page with a course catalog and quick entry points into learning tracks.
- Dedicated route for each course using dynamic routing by course id.
- Section-based course navigation so readers can move topic by topic.
- Search overlay with keyboard shortcut support using `Ctrl+K` or `Cmd+K`.
- Quick access links to official documentation, tutorials, and exercises where available.
- Inline code examples with copy-to-clipboard support.
- Key takeaway blocks for rapid revision.
- SEO-friendly page titles and meta descriptions per route.
- Privacy Policy and Terms of Service pages.
- Responsive navigation for desktop and mobile layouts.

### How the content works

Each course object defines its own:

- `id` for routing.
- `title` and `description` for listing and metadata.
- `sections` for the actual learning content.
- Optional resource links such as official docs, tutorials, and exercises.
- Optional images, code samples, and key points for each section.

This keeps the application logic simple while making it easy to expand the knowledge base by adding or updating course data modules.

## Project Structure

```text
developer-guide/
|- public/
|  |- images/
|- src/
|  |- components/
|  |- data/
|  |  |- courses-data/
|  |  |- courses.js
|  |- hooks/
|  |- pages/
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

1. Create a new course module in `src/data/courses-data`.
2. Export the course object from that module.
3. Import it into `src/data/courses.js`.
4. Add it to the exported `courses` array.
5. Add any related image assets under `public/images` if needed.

### Updating existing content

- Edit the relevant module in `src/data/courses-data`.
- Keep route ids stable if existing links should continue to work.
- Prefer structured sections with concise explanations, sample code, and key takeaways.

## License

This project is licensed under the MIT License. See the `LICENSE` file for the full text.

In practical terms, the MIT License allows you to use, modify, publish, distribute, and reuse the code in personal or commercial projects as long as the copyright notice and license text are preserved.

### Important note on third-party content

- External documentation links referenced in the course content remain the property of their respective owners.
- Third-party libraries used by this project are distributed under their own licenses.
- If any images or brand assets are subject to separate usage terms, those terms still apply independently of the project license.

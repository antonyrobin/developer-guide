export const tailwindCourse = {
  id: 'tailwind-css',
  title: 'Tailwind CSS',
  description: 'A utility-first CSS framework for rapidly building custom user interfaces.',
  officialDocs: 'https://tailwindcss.com/docs',
  tutorialLink: 'https://tailwindcss.com/docs/utility-first',
  exerciseLink: 'https://www.w3schools.com/css/css_exercises.asp',
  sections: [
    {
      title: 'What is Tailwind CSS',
      image: '/images/tailwind-css/tailwind-utility-first.svg',
      content: `**Tailwind CSS** is a **utility-first CSS framework** that provides low-level utility classes to build custom designs directly in your HTML. Instead of writing custom CSS or using pre-built components like Bootstrap, you compose designs using small, single-purpose classes.

### Traditional CSS vs Tailwind

**Traditional CSS:**
\`\`\`html
<div class="card">
  <h2 class="card-title">Hello</h2>
</div>

<style>
.card { padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.card-title { font-size: 1.25rem; font-weight: 700; color: #1f2937; }
</style>
\`\`\`

**Tailwind CSS:**
\`\`\`html
<div class="p-6 rounded-lg shadow-md">
  <h2 class="text-xl font-bold text-gray-800">Hello</h2>
</div>
\`\`\`

### How It Works

Tailwind scans your HTML/JSX files, finds utility classes you've used, and generates **only the CSS you need**. Unused utilities are never included in the final bundle. A typical Tailwind production build is **5-10 KB** gzipped.

### Key Philosophy

- **No context switching** — style directly in markup, no jumping between HTML and CSS files
- **No naming fatigue** — no more inventing class names like \`.card-wrapper-inner\`
- **Consistent design** — spacing, colors, and typography follow a design system
- **Easy to change** — modify classes in markup instead of hunting through CSS files`,
      keyPoints: [
        'Utility-first: style with small, composable classes in HTML.',
        'No custom CSS needed for most designs.',
        'Only generates CSS for classes you actually use.',
        'Eliminates naming fatigue — no .card-wrapper-inner.',
        'Production builds are typically 5-10 KB gzipped.'
      ]
    },
    {
      title: 'Advantages & Disadvantages',
      content: `### Advantages

| Advantage | Why It Matters |
|---|---|
| **Rapid development** | Style directly in markup — no CSS file switching |
| **Tiny production CSS** | Tree-shaking removes unused styles (5-10 KB gzipped) |
| **Consistent design system** | Built-in spacing, color, and typography scales |
| **No CSS specificity wars** | Utilities have flat specificity — no cascade conflicts |
| **Responsive by default** | \`sm:\`, \`md:\`, \`lg:\` prefixes for breakpoints |
| **Dark mode built in** | \`dark:\` variant for dark theme support |
| **Highly customizable** | \`tailwind.config.js\` controls every design token |
| **Framework agnostic** | Works with React, Angular, Vue, plain HTML, etc. |

### Disadvantages

| Disadvantage | Impact |
|---|---|
| **Verbose HTML** | Long class strings can look cluttered |
| **Learning curve** | Must learn utility class names (not intuitive at first) |
| **Hard to read initially** | \`p-4 mt-2 flex items-center\` vs \`.card-header\` |
| **Refactoring effort** | Changing design means editing many HTML files |
| **Not semantic** | HTML doesn't describe *what* — only *how it looks* |
| **Team adoption** | Developers used to traditional CSS may resist |

### When to Use Tailwind

- Custom designs that don't follow a component library
- Projects where rapid prototyping matters
- Teams wanting consistent, design-system-driven styling
- Any framework: React, Vue, Angular, Next.js, plain HTML`,
      keyPoints: [
        'Pro: Rapid development with no CSS file context-switching.',
        'Pro: Tiny production bundle with automatic tree-shaking.',
        'Con: Verbose HTML with long class strings.',
        'Con: Utility class names have a learning curve.',
        'Best for: Custom designs with consistent design systems.'
      ]
    },
    {
      title: 'Installation & Setup',
      content: `### Install with Vite (React, Vue, etc.)

\`\`\`bash
# Create a Vite project
npm create vite@latest my-app -- --template react
cd my-app

# Install Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite
\`\`\`

Configure the Vite plugin:

\`\`\`javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()]
});
\`\`\`

Import Tailwind in your CSS:

\`\`\`css
/* src/index.css */
@import "tailwindcss";
\`\`\`

### Install with Next.js

\`\`\`bash
npx create-next-app@latest my-app
# Select "Yes" when prompted for Tailwind CSS
\`\`\`

### Install with Angular

\`\`\`bash
ng new my-app
cd my-app
npm install tailwindcss @tailwindcss/postcss postcss
\`\`\`

\`\`\`javascript
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
};
\`\`\`

### Tailwind CSS v4 vs v3

| Feature | v3 | v4 |
|---|---|---|
| Config | \`tailwind.config.js\` | CSS-based (\`@theme\`) |
| Directives | \`@tailwind base/components/utilities\` | \`@import "tailwindcss"\` |
| Plugin | PostCSS plugin | Framework-specific plugins |
| Content detection | \`content: []\` in config | Automatic |

### VS Code Extension

Install **Tailwind CSS IntelliSense** for autocomplete, class previews, and linting — essential for productive development.`,
      keyPoints: [
        'Tailwind v4 uses @import "tailwindcss" — no directives needed.',
        'Use @tailwindcss/vite plugin for Vite projects.',
        'Tailwind v4 auto-detects content files — no content config needed.',
        'Install Tailwind CSS IntelliSense VS Code extension.',
        'Works with React, Vue, Angular, Next.js, and plain HTML.'
      ]
    },
    {
      title: 'Spacing, Sizing & Layout',
      content: `Tailwind uses a consistent **spacing scale** based on multiples of 0.25rem (4px). This scale applies to padding, margin, width, height, and gap.

### Spacing Scale

| Class | Value | Pixels |
|---|---|---|
| \`p-0\` | 0 | 0px |
| \`p-1\` | 0.25rem | 4px |
| \`p-2\` | 0.5rem | 8px |
| \`p-4\` | 1rem | 16px |
| \`p-6\` | 1.5rem | 24px |
| \`p-8\` | 2rem | 32px |
| \`p-12\` | 3rem | 48px |
| \`p-16\` | 4rem | 64px |

### Padding & Margin

\`\`\`html
<!-- Padding: all sides, horizontal, vertical, individual -->
<div class="p-4">All sides</div>
<div class="px-6 py-3">Horizontal 24px, Vertical 12px</div>
<div class="pt-4 pb-2 pl-6 pr-8">Individual sides</div>

<!-- Margin: same pattern + auto for centering -->
<div class="mx-auto max-w-lg">Centered container</div>
<div class="mt-8 mb-4">Top 32px, Bottom 16px</div>

<!-- Negative margin -->
<div class="-mt-4">Pull up by 16px</div>

<!-- Space between children -->
<div class="space-y-4">
  <div>Child 1</div>  <!-- 16px gap between children -->
  <div>Child 2</div>
  <div>Child 3</div>
</div>
\`\`\`

### Width & Height

\`\`\`html
<!-- Fixed sizes -->
<div class="w-64 h-32">256px × 128px</div>
<div class="w-full h-screen">Full width, full viewport height</div>

<!-- Percentage -->
<div class="w-1/2">50% width</div>
<div class="w-1/3">33.33% width</div>

<!-- Min/Max constraints -->
<div class="min-h-screen">At least full viewport height</div>
<div class="max-w-xl mx-auto">Max 576px, centered</div>

<!-- Arbitrary values -->
<div class="w-[350px] h-[200px]">Custom size</div>
\`\`\`

### Display & Container

\`\`\`html
<div class="container mx-auto px-4">Responsive container</div>
<div class="hidden md:block">Hidden on mobile, visible on md+</div>
<span class="inline-block">Inline block element</span>
\`\`\``,
      keyPoints: [
        'Spacing scale: 1 unit = 0.25rem (4px); p-4 = 16px.',
        'p/m for padding/margin; x/y for horizontal/vertical; t/b/l/r for sides.',
        'w-full, h-screen for full width/viewport height.',
        'Arbitrary values with bracket syntax: w-[350px].',
        'space-y-4 adds gap between children without flex/grid.'
      ]
    },
    {
      title: 'Typography & Colors',
      content: `### Font Size

| Class | Size | Line Height |
|---|---|---|
| \`text-xs\` | 0.75rem (12px) | 1rem |
| \`text-sm\` | 0.875rem (14px) | 1.25rem |
| \`text-base\` | 1rem (16px) | 1.5rem |
| \`text-lg\` | 1.125rem (18px) | 1.75rem |
| \`text-xl\` | 1.25rem (20px) | 1.75rem |
| \`text-2xl\` | 1.5rem (24px) | 2rem |
| \`text-4xl\` | 2.25rem (36px) | 2.5rem |

### Font Weight, Style & Alignment

\`\`\`html
<!-- Weight -->
<p class="font-light">Light (300)</p>
<p class="font-normal">Normal (400)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>

<!-- Alignment -->
<p class="text-left">Left</p>
<p class="text-center">Center</p>
<p class="text-right">Right</p>

<!-- Decoration & Transform -->
<a class="underline hover:no-underline">Link</a>
<p class="uppercase tracking-wide">Uppercase with letter spacing</p>
<p class="truncate">This text will be truncated with ellipsis...</p>
<p class="line-clamp-3">Clamp to 3 lines of text...</p>
\`\`\`

### Color System

Tailwind provides a comprehensive color palette with shades from 50 (lightest) to 950 (darkest):

\`\`\`html
<!-- Text colors -->
<p class="text-gray-900">Dark text</p>
<p class="text-blue-600">Blue text</p>
<p class="text-red-500">Red text</p>

<!-- Background colors -->
<div class="bg-white">White background</div>
<div class="bg-slate-100">Light gray background</div>
<div class="bg-indigo-600">Indigo background</div>

<!-- Border colors -->
<div class="border border-gray-300">Gray border</div>
<input class="border-2 border-blue-500 focus:border-blue-700">

<!-- Opacity -->
<div class="bg-black/50">50% opacity black background</div>
<p class="text-gray-900/75">75% opacity text</p>

<!-- Ring (focus outline alternative) -->
<button class="ring-2 ring-blue-500 ring-offset-2">Focused button</button>
\`\`\`

### Color Palette Shades

Available colors: \`slate\`, \`gray\`, \`zinc\`, \`neutral\`, \`stone\`, \`red\`, \`orange\`, \`amber\`, \`yellow\`, \`lime\`, \`green\`, \`emerald\`, \`teal\`, \`cyan\`, \`sky\`, \`blue\`, \`indigo\`, \`violet\`, \`purple\`, \`fuchsia\`, \`pink\`, \`rose\`. Each with shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.`,
      keyPoints: [
        'text-{size}: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, etc.',
        'Color classes: text-{color}-{shade}, bg-{color}-{shade}.',
        'Shades range from 50 (lightest) to 950 (darkest).',
        'Use /opacity syntax: bg-black/50 for 50% opacity.',
        'truncate and line-clamp-{n} for text overflow control.'
      ]
    },
    {
      title: 'Flexbox & Grid',
      content: `### Flexbox

\`\`\`html
<!-- Basic flex row -->
<div class="flex items-center gap-4">
  <img class="w-12 h-12 rounded-full" src="avatar.jpg">
  <div>
    <p class="font-semibold">Alice Johnson</p>
    <p class="text-sm text-gray-500">Developer</p>
  </div>
</div>

<!-- Space between -->
<nav class="flex justify-between items-center p-4">
  <span class="text-xl font-bold">Logo</span>
  <div class="flex gap-6">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
</nav>

<!-- Flex column -->
<div class="flex flex-col gap-2">
  <input class="border p-2 rounded" placeholder="Email">
  <input class="border p-2 rounded" placeholder="Password">
  <button class="bg-blue-600 text-white p-2 rounded">Login</button>
</div>

<!-- Flex grow / shrink -->
<div class="flex gap-4">
  <aside class="w-64 shrink-0">Sidebar</aside>
  <main class="grow">Main content fills remaining space</main>
</div>

<!-- Center everything -->
<div class="flex items-center justify-center min-h-screen">
  <p>Perfectly centered</p>
</div>
\`\`\`

### Flex Utilities

| Class | CSS | Purpose |
|---|---|---|
| \`flex\` | \`display: flex\` | Enable flexbox |
| \`flex-col\` | \`flex-direction: column\` | Stack vertically |
| \`flex-wrap\` | \`flex-wrap: wrap\` | Allow wrapping |
| \`items-center\` | \`align-items: center\` | Vertical center |
| \`justify-between\` | \`justify-content: space-between\` | Space out items |
| \`gap-4\` | \`gap: 1rem\` | Space between items |
| \`grow\` | \`flex-grow: 1\` | Fill available space |
| \`shrink-0\` | \`flex-shrink: 0\` | Prevent shrinking |

### CSS Grid

\`\`\`html
<!-- Basic grid -->
<div class="grid grid-cols-3 gap-6">
  <div class="bg-white p-4 rounded shadow">Card 1</div>
  <div class="bg-white p-4 rounded shadow">Card 2</div>
  <div class="bg-white p-4 rounded shadow">Card 3</div>
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- 1 col on mobile, 2 on tablet, 4 on desktop -->
</div>

<!-- Spanning columns/rows -->
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-2">Spans 2 columns</div>
  <div class="col-span-1">Single column</div>
  <div class="col-span-1">Single column</div>
</div>

<!-- Auto-fit responsive (no breakpoints needed) -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
  <!-- Cards auto-fit into rows -->
</div>
\`\`\``,
      keyPoints: [
        'flex + items-center + justify-between covers most layouts.',
        'gap-{n} replaces margin-based spacing between flex/grid items.',
        'grid-cols-{n} sets column count; gap-{n} spaces them.',
        'Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4.',
        'grow fills remaining space; shrink-0 prevents shrinking.'
      ]
    },
    {
      title: 'Responsive Design',
      image: '/images/tailwind-css/tailwind-responsive.svg',
      content: `Tailwind uses a **mobile-first** breakpoint system. Base classes apply to all screens, and breakpoint prefixes add styles at larger widths.

### Breakpoints

| Prefix | Min Width | Target |
|---|---|---|
| (none) | 0px | Mobile (default) |
| \`sm:\` | 640px | Small tablets |
| \`md:\` | 768px | Tablets |
| \`lg:\` | 1024px | Laptops |
| \`xl:\` | 1280px | Desktops |
| \`2xl:\` | 1536px | Large screens |

### Mobile-First Pattern

\`\`\`html
<!-- Text: small on mobile, larger on bigger screens -->
<h1 class="text-2xl md:text-4xl lg:text-6xl font-bold">
  Responsive Heading
</h1>

<!-- Layout: stack on mobile, side-by-side on desktop -->
<div class="flex flex-col md:flex-row gap-6">
  <aside class="w-full md:w-64">Sidebar</aside>
  <main class="grow">Content</main>
</div>

<!-- Grid: 1 col mobile → 2 cols tablet → 4 cols desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div class="bg-white p-4 rounded-lg shadow">Card</div>
  <!-- more cards -->
</div>

<!-- Padding: tighter on mobile, spacious on desktop -->
<section class="px-4 py-8 md:px-8 md:py-16 lg:px-16 lg:py-24">
  Content with responsive padding
</section>

<!-- Show/hide based on screen -->
<nav class="md:hidden">Mobile nav (hamburger)</nav>
<nav class="hidden md:flex">Desktop nav (full links)</nav>

<!-- Image sizing -->
<img class="w-full md:w-1/2 lg:w-1/3" src="photo.jpg">
\`\`\`

### Container with Responsive Padding

\`\`\`html
<div class="container mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Centered content with responsive side padding -->
</div>
\`\`\`

### Key Principles

1. **Start with mobile styles** (no prefix) — then add larger breakpoints
2. **Don't hide content** — show/hide sparingly; reorganize instead
3. **Test all breakpoints** — resizing the browser is the quickest check
4. **Use responsive grid** — \`grid-cols-1 md:grid-cols-2 lg:grid-cols-3\` handles most card layouts`,
      keyPoints: [
        'Mobile-first: base classes for mobile, prefixes for larger screens.',
        'Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px).',
        'hidden md:flex — hide on mobile, show on medium+.',
        'Always start with mobile layout, then add tablet/desktop.',
        'Responsive grid pattern: grid-cols-1 md:grid-cols-2 lg:grid-cols-4.'
      ]
    },
    {
      title: 'Hover, Focus & State Variants',
      content: `Tailwind provides **state variants** (modifiers) for styling interactive states like hover, focus, active, disabled, and more — all directly in the class list.

### Interactive States

\`\`\`html
<!-- Hover -->
<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded
               transition-colors duration-200">
  Hover me
</button>

<!-- Focus -->
<input class="border border-gray-300 rounded px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
       placeholder="Focus me">

<!-- Active (pressed) -->
<button class="bg-green-600 hover:bg-green-700 active:bg-green-800
               active:scale-95 transition-all">
  Press me
</button>

<!-- Disabled -->
<button class="bg-blue-600 text-white px-4 py-2 rounded
               disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled>
  Disabled
</button>
\`\`\`

### Group & Peer Variants

\`\`\`html
<!-- Group: parent hover affects children -->
<div class="group p-4 rounded-lg border hover:border-blue-500 cursor-pointer">
  <h3 class="font-semibold group-hover:text-blue-600">Card Title</h3>
  <p class="text-gray-500 group-hover:text-gray-700">Description</p>
  <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
</div>

<!-- Peer: sibling state affects another sibling -->
<div>
  <input type="checkbox" class="peer" id="toggle">
  <label for="toggle">Toggle content</label>
  <div class="hidden peer-checked:block mt-2">
    This content shows when checkbox is checked
  </div>
</div>
\`\`\`

### Form States

\`\`\`html
<!-- Placeholder, required, valid, invalid -->
<input class="border rounded px-3 py-2
              placeholder:text-gray-400 placeholder:italic
              required:border-red-500
              valid:border-green-500
              invalid:border-red-500"
       required type="email" placeholder="Enter email">

<!-- First child, last child, odd/even -->
<ul>
  <li class="first:pt-0 last:pb-0 odd:bg-gray-50 even:bg-white py-2 px-4">
    List items with alternating backgrounds
  </li>
</ul>
\`\`\`

### Common State Modifiers

| Modifier | Triggers on |
|---|---|
| \`hover:\` | Mouse hover |
| \`focus:\` | Element focused |
| \`active:\` | Element pressed |
| \`disabled:\` | Disabled attribute |
| \`group-hover:\` | Parent with \`group\` class hovered |
| \`peer-checked:\` | Sibling with \`peer\` class checked |
| \`first:\` / \`last:\` | First/last child |
| \`odd:\` / \`even:\` | Odd/even children |
| \`placeholder:\` | Placeholder text |`,
      keyPoints: [
        'hover:, focus:, active:, disabled: for interactive states.',
        'group/group-hover: — parent hover affects child styling.',
        'peer/peer-checked: — sibling state affects another element.',
        'Add transition-colors for smooth state changes.',
        'first:, last:, odd:, even: for list/table styling.'
      ]
    },
    {
      title: 'Dark Mode',
      content: `Tailwind supports **dark mode** with the \`dark:\` variant. By default it uses the operating system preference (\`prefers-color-scheme\`), but you can switch to class-based manual control.

### Using Dark Mode

\`\`\`html
<!-- Automatic: responds to OS preference -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
  <h1 class="text-2xl font-bold">Welcome</h1>
  <p class="text-gray-600 dark:text-gray-400">
    This adapts to your system theme.
  </p>
  <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
    <p>Card with dark mode support</p>
  </div>
</div>
\`\`\`

### Manual Dark Mode Toggle (Class Strategy)

\`\`\`css
/* In Tailwind v4 CSS config */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
\`\`\`

\`\`\`html
<!-- Toggle dark mode by adding/removing .dark on <html> -->
<html class="dark">
  <body class="bg-white dark:bg-gray-900">
    <!-- dark mode active -->
  </body>
</html>
\`\`\`

\`\`\`javascript
// Toggle script
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// On page load — respect saved preference
if (localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
}
\`\`\`

### Dark Mode Component Pattern

\`\`\`html
<button class="px-4 py-2 rounded-lg
               bg-gray-200 dark:bg-gray-700
               text-gray-800 dark:text-gray-200
               hover:bg-gray-300 dark:hover:bg-gray-600
               border border-gray-300 dark:border-gray-600
               transition-colors">
  Dark mode button
</button>
\`\`\`

> **Tip:** Always define both light and dark variants together to avoid visual inconsistencies.`,
      keyPoints: [
        'dark: variant applies styles in dark mode.',
        'Default: uses OS preference (prefers-color-scheme).',
        'Class strategy: toggle .dark on <html> for manual control.',
        'Always pair light and dark variants together.',
        'Store user preference in localStorage for persistence.'
      ]
    },
    {
      title: 'Customization & Theming',
      content: `Tailwind is highly customizable. In **v4**, theming is done directly in CSS using \`@theme\`. In **v3**, use \`tailwind.config.js\`.

### Tailwind v4: CSS-Based Theming

\`\`\`css
@import "tailwindcss";

@theme {
  /* Custom colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-secondary: #8b5cf6;
  --color-accent: #f59e0b;

  /* Custom fonts */
  --font-heading: "Inter", sans-serif;
  --font-body: "Source Sans 3", sans-serif;

  /* Custom spacing */
  --spacing-18: 4.5rem;

  /* Custom breakpoints */
  --breakpoint-3xl: 1920px;
}
\`\`\`

\`\`\`html
<!-- Use custom theme values -->
<h1 class="font-heading text-primary text-4xl">Custom Heading</h1>
<p class="font-body text-secondary">Custom body text</p>
<button class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded">
  Themed Button
</button>
\`\`\`

### Tailwind v3: Config-Based Theming

\`\`\`javascript
// tailwind.config.js (v3)
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        accent: '#f59e0b',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
};
\`\`\`

### Arbitrary Values

When the design system doesn't cover a specific value, use bracket syntax:

\`\`\`html
<!-- Arbitrary colors, sizes, positions -->
<div class="bg-[#1a1a2e] text-[#e94560]">Custom colors</div>
<div class="w-[calc(100%-250px)]">Calculated width</div>
<div class="grid grid-cols-[200px_1fr_100px]">Custom grid template</div>
<p class="text-[clamp(1rem,2.5vw,2rem)]">Fluid typography</p>
\`\`\`

### @apply Directive (Use Sparingly)

Extract repeated utility patterns into reusable classes:

\`\`\`css
@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold
           px-6 py-3 rounded-lg transition-colors;
  }
  .input-field {
    @apply border border-gray-300 rounded-lg px-4 py-2
           focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
\`\`\`

> **Tip:** Prefer component extraction in your framework (React components, Vue components) over \`@apply\`. Use \`@apply\` only for base/global styles.`,
      keyPoints: [
        'v4: Use @theme block in CSS for custom colors, fonts, spacing.',
        'v3: Use tailwind.config.js extend object for customization.',
        'Arbitrary values: bg-[#1a1a2e], w-[calc(100%-250px)].',
        '@apply extracts utility patterns — use sparingly.',
        'Prefer framework components over @apply for reuse.'
      ]
    },
    {
      title: 'Animations & Transitions',
      content: `### CSS Transitions

\`\`\`html
<!-- Smooth color/background transitions -->
<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded
               transition-colors duration-200 ease-in-out">
  Smooth hover
</button>

<!-- Transform transitions -->
<div class="hover:scale-105 hover:-translate-y-1 hover:shadow-xl
            transition-all duration-300 ease-out">
  Lift on hover
</div>

<!-- Opacity transition -->
<div class="opacity-0 hover:opacity-100 transition-opacity duration-500">
  Fade in on hover
</div>
\`\`\`

### Transition Utilities

| Class | CSS Property |
|---|---|
| \`transition-none\` | No transition |
| \`transition-all\` | All properties |
| \`transition-colors\` | Color properties |
| \`transition-opacity\` | Opacity |
| \`transition-shadow\` | Box shadow |
| \`transition-transform\` | Transform |
| \`duration-150\` / \`duration-300\` | Duration in ms |
| \`ease-in\` / \`ease-out\` / \`ease-in-out\` | Timing function |
| \`delay-100\` / \`delay-300\` | Delay in ms |

### Built-in Animations

\`\`\`html
<!-- Spin (loading indicator) -->
<svg class="animate-spin h-5 w-5 text-white">...</svg>

<!-- Ping (notification dot) -->
<span class="relative flex h-3 w-3">
  <span class="animate-ping absolute inline-flex h-full w-full
               rounded-full bg-red-400 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
</span>

<!-- Pulse (skeleton loading) -->
<div class="animate-pulse space-y-4">
  <div class="h-4 bg-gray-300 rounded w-3/4"></div>
  <div class="h-4 bg-gray-300 rounded w-1/2"></div>
  <div class="h-4 bg-gray-300 rounded w-5/6"></div>
</div>

<!-- Bounce -->
<div class="animate-bounce">↓ Scroll down</div>
\`\`\`

### Custom Animations (v4)

\`\`\`css
@import "tailwindcss";

@theme {
  --animate-fade-in: fade-in 0.5s ease-out;
  --animate-slide-up: slide-up 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
\`\`\`

\`\`\`html
<div class="animate-fade-in">Fades in</div>
<div class="animate-slide-up">Slides up</div>
\`\`\``,
      keyPoints: [
        'transition-{property} + duration-{ms} for smooth state changes.',
        'Built-in: animate-spin, animate-ping, animate-pulse, animate-bounce.',
        'animate-pulse creates skeleton loading placeholders.',
        'Custom animations via @theme + @keyframes in v4.',
        'Always pair hover/focus transforms with transition classes.'
      ]
    },
    {
      title: 'Component Patterns',
      content: `Real-world UI patterns built entirely with Tailwind utilities:

### Card Component

\`\`\`html
<div class="max-w-sm rounded-xl overflow-hidden shadow-lg
            bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
  <img class="w-full h-48 object-cover" src="image.jpg" alt="Card image">
  <div class="p-6">
    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
      Card Title
    </h3>
    <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
      Card description goes here with some details.
    </p>
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-500">3 min read</span>
      <button class="text-blue-600 hover:text-blue-800 font-semibold text-sm">
        Read More →
      </button>
    </div>
  </div>
</div>
\`\`\`

### Navigation Bar

\`\`\`html
<nav class="bg-white dark:bg-gray-900 border-b border-gray-200
            dark:border-gray-700 sticky top-0 z-50">
  <div class="container mx-auto px-4 flex items-center justify-between h-16">
    <a href="/" class="text-xl font-bold text-gray-900 dark:text-white">
      Logo
    </a>
    <div class="hidden md:flex items-center gap-8">
      <a href="#" class="text-gray-600 hover:text-gray-900
                         dark:text-gray-300 dark:hover:text-white
                         transition-colors">Home</a>
      <a href="#" class="text-gray-600 hover:text-gray-900
                         dark:text-gray-300 dark:hover:text-white
                         transition-colors">About</a>
      <button class="bg-blue-600 hover:bg-blue-700 text-white
                     px-4 py-2 rounded-lg transition-colors">
        Get Started
      </button>
    </div>
  </div>
</nav>
\`\`\`

### Alert / Badge

\`\`\`html
<!-- Alert -->
<div class="flex items-center gap-3 p-4 rounded-lg
            bg-yellow-50 border border-yellow-200 text-yellow-800">
  <span class="text-xl">⚠️</span>
  <p class="text-sm font-medium">This action cannot be undone.</p>
</div>

<!-- Badge -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full
             text-xs font-medium bg-green-100 text-green-800">
  Active
</span>
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full
             text-xs font-medium bg-red-100 text-red-800">
  Expired
</span>
\`\`\`

### Form

\`\`\`html
<form class="space-y-6 max-w-md mx-auto">
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Email
    </label>
    <input type="email" class="w-full border border-gray-300 rounded-lg px-4 py-2
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:border-blue-500 dark:bg-gray-800
                               dark:border-gray-600 dark:text-white"
           placeholder="you@example.com">
  </div>
  <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700
                               text-white font-semibold py-2.5 rounded-lg
                               transition-colors">
    Submit
  </button>
</form>
\`\`\``,
      keyPoints: [
        'Build cards, navbars, alerts, forms from utility classes.',
        'rounded-xl + shadow-lg + overflow-hidden for card containers.',
        'sticky top-0 z-50 for fixed navigation bars.',
        'space-y-{n} for consistent form field spacing.',
        'Extract to framework components (React/Vue) for reuse.'
      ]
    },
    {
      title: 'Plugins & Ecosystem',
      content: `Tailwind has a rich plugin ecosystem for extending functionality beyond core utilities.

### Official Plugins

| Plugin | Purpose | Install |
|---|---|---|
| \`@tailwindcss/typography\` | Prose styling for rich content (blogs, docs) | \`npm i @tailwindcss/typography\` |
| \`@tailwindcss/forms\` | Reset & style form elements | \`npm i @tailwindcss/forms\` |
| \`@tailwindcss/container-queries\` | Container query utilities | \`npm i @tailwindcss/container-queries\` |

### Typography Plugin

Adds a \`prose\` class for beautifully styled rich text content:

\`\`\`html
<article class="prose prose-lg dark:prose-invert max-w-none">
  <h1>Article Title</h1>
  <p>This paragraph is automatically styled with proper line height,
     margin, and font sizing. Links, lists, code blocks, and blockquotes
     are all handled.</p>
  <ul>
    <li>Styled lists</li>
    <li>With proper spacing</li>
  </ul>
  <pre><code>// Even code blocks are styled</code></pre>
</article>
\`\`\`

### Forms Plugin

\`\`\`html
<!-- Form elements are reset and styled consistently -->
<select class="rounded-md border-gray-300">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
<input type="checkbox" class="rounded text-blue-600">
<input type="range" class="w-full">
\`\`\`

### Adding Plugins (v4)

\`\`\`css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";
\`\`\`

### Community Tools

| Tool | Purpose |
|---|---|
| **Tailwind UI** | Premium component library by Tailwind Labs |
| **Headless UI** | Unstyled, accessible components (React/Vue) |
| **daisyUI** | Component classes on top of Tailwind |
| **shadcn/ui** | Copy-paste React components using Tailwind |
| **Flowbite** | Open-source Tailwind component library |
| **Tailwind Play** | Online playground at play.tailwindcss.com |`,
      keyPoints: [
        '@tailwindcss/typography: prose class for rich text/blog content.',
        '@tailwindcss/forms: consistent form element styling.',
        'v4 uses @plugin directive; v3 uses plugins array in config.',
        'shadcn/ui and Headless UI pair well with Tailwind.',
        'Tailwind Play (play.tailwindcss.com) for quick experiments.'
      ]
    },
    {
      title: 'Best Practices',
      content: `### Do

| Practice | Why |
|---|---|
| **Mobile-first** | Start with base classes, add \`sm:\`/\`md:\`/\`lg:\` |
| **Extract components** | Use React/Vue/Angular components for repeated patterns |
| **Use design tokens** | Stick to Tailwind's scale (p-4, text-lg, gap-6) |
| **Keep classes ordered** | Layout → sizing → spacing → typography → colors → effects |
| **Use gap over margin** | gap-4 on flex/grid is cleaner than margin on children |
| **Use dark: variants** | Pair light and dark styles together |
| **Install IntelliSense** | VS Code extension for autocomplete + error detection |

### Don't

| Anti-Pattern | Why It's Bad |
|---|---|
| **Overuse @apply** | Defeats the purpose of utility-first — use components |
| **Add !important** | Sign of specificity issues — restructure instead |
| **Use inline styles** | Use arbitrary values \`bg-[#abc]\` instead of \`style=""\` |
| **Ignore accessibility** | Style focus states, use semantic HTML, proper contrast |
| **Mix Tailwind + custom CSS** | Pick one approach per component to avoid conflicts |
| **Chain too many modifiers** | \`dark:hover:focus:lg:text-red-500\` is hard to read |

### Class Ordering Convention

Follow a consistent order for readability:

\`\`\`html
<!-- Recommended order -->
<div class="
  flex items-center justify-between      /* Layout */
  w-full max-w-lg                         /* Sizing */
  p-4 mt-6 gap-4                          /* Spacing */
  text-sm font-semibold                   /* Typography */
  text-gray-900 bg-white                  /* Colors */
  border border-gray-200 rounded-lg       /* Borders */
  shadow-md                                /* Effects */
  hover:shadow-lg hover:bg-gray-50        /* States */
  transition-all duration-200             /* Transitions */
  dark:bg-gray-800 dark:text-white        /* Dark mode */
">
\`\`\`

### Performance Tips

- Tailwind purges unused CSS automatically — no manual configuration needed
- Keep \`@apply\` usage minimal — it increases CSS bundle size
- Use component libraries (shadcn/ui, Headless UI) to avoid reinventing
- Test with Lighthouse to verify CSS isn't blocking rendering`,
      keyPoints: [
        'Mobile-first: base classes first, then breakpoint prefixes.',
        'Extract to framework components, not @apply classes.',
        'Keep a consistent class ordering: layout → sizing → spacing → colors.',
        'Use gap-{n} on flex/grid instead of margin on children.',
        'Tailwind auto-purges unused CSS — no manual optimization needed.'
      ]
    }
  ]
};

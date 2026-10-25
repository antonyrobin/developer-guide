/*
 * CSS course extension — extra sections and worked examples merged into
 * courses-data/css.js at load time (see src/data/mergeCourse.js).
 *
 * Examples that need markup to be meaningful provide a `playground` override
 * with the HTML structure, so "Try it" opens a runnable page.
 */

const page = (css, html) => ({
  language: 'html',
  code: `<!DOCTYPE html>
<html>
<head>
<style>
${css.trim()}
</style>
</head>
<body>
${html.trim()}
</body>
</html>`,
});

export default {
  examples: {
    'CSS Selectors': [
      {
        title: 'Selector cheat sheet',
        language: 'css',
        code: `/* Basic */
*            { box-sizing: border-box; }   /* universal */
p            { line-height: 1.6; }          /* type */
.card        { padding: 1rem; }             /* class */
#app         { min-height: 100vh; }         /* id (avoid for styling) */

/* Combinators */
nav a        { color: navy; }   /* descendant: any <a> inside nav */
ul > li      { margin: 0; }     /* direct child only */
h2 + p       { margin-top: 0; } /* the <p> immediately after an <h2> */
h2 ~ p       { color: #555; }   /* every <p> sibling after an <h2> */

/* Attributes */
a[href^="https"]   { padding-right: 1em; }  /* starts with */
a[href$=".pdf"]    { color: crimson; }      /* ends with */
input[type="email"]{ border-color: teal; }
[data-state="open"]{ display: block; }

/* Grouping */
h1, h2, h3   { font-family: Georgia, serif; }`,
      },
      {
        title: 'Modern relational selectors: :is, :where, :has',
        language: 'css',
        explanation: '`:is()` shortens long selector lists, `:where()` does the same with **zero specificity** (great for resets), and `:has()` is the long-awaited *parent* selector.',
        code: `/* :is — matches any selector in the list */
:is(article, section, aside) h2 { font-size: 1.25rem; }

/* :where — same, but specificity 0 so it is easy to override */
:where(ul, ol)[role="list"] { list-style: none; padding: 0; }

/* :has — style a parent based on its children */
.card:has(img)            { padding-top: 0; }      /* cards that contain an image */
form:has(:invalid) button { opacity: .5; }         /* dim submit while form is invalid */
label:has(+ input:focus)  { color: #0047ab; }      /* label before a focused input */

/* :not — exclude */
li:not(:last-child) { border-bottom: 1px solid #e2e8f0; }`,
      },
    ],
    'The Box Model': [
      {
        title: 'content-box vs border-box',
        language: 'css',
        playground: page(`
* { font-family: system-ui; }
.box { width: 200px; padding: 20px; border: 10px solid #0047ab; margin: 1rem 0; background: #e0e7ff; }
.content { box-sizing: content-box; } /* rendered width = 200 + 40 + 20 = 260px */
.border  { box-sizing: border-box; }  /* rendered width = 200px */
`, `<div class="box content">content-box: 260px wide</div>
<div class="box border">border-box: 200px wide</div>`),
        explanation: 'With the default `content-box`, padding and border are **added** to the width. With `border-box` they are included in it — which is why most projects start with `*, *::before, *::after { box-sizing: border-box; }`.',
        code: `.box {
  width: 200px;
  padding: 20px;
  border: 10px solid #0047ab;
}

.content { box-sizing: content-box; } /* total width = 200 + 2*20 + 2*10 = 260px */
.border  { box-sizing: border-box; }  /* total width = 200px, content shrinks to 140px */

/* Recommended global reset */
*, *::before, *::after { box-sizing: border-box; }`,
      },
      {
        title: 'Margin collapsing',
        language: 'css',
        code: `/* Vertical margins of adjacent blocks collapse to the LARGER value */
h2 { margin-bottom: 24px; }
p  { margin-top: 16px; }      /* gap between them is 24px, not 40px */

/* Ways to prevent collapsing between parent and child: */
.parent { padding-top: 1px; }         /* padding or border separates them */
.parent { display: flow-root; }       /* new block formatting context */
.parent { display: flex; flex-direction: column; } /* flex/grid items never collapse */`,
      },
    ],
    'Display & Position Properties': [
      {
        title: 'Position values side by side',
        language: 'css',
        playground: page(`
body { font-family: system-ui; height: 1200px; margin: 0; padding: 1rem; }
.parent { position: relative; height: 160px; background: #e0e7ff; margin-bottom: 1rem; }
.abs { position: absolute; right: 10px; bottom: 10px; background: #0047ab; color: #fff; padding: .5rem; }
.sticky { position: sticky; top: 0; background: #fde68a; padding: .5rem; }
.fixed { position: fixed; bottom: 1rem; right: 1rem; background: #16a34a; color: #fff; padding: .5rem 1rem; border-radius: 999px; }
`, `<div class="sticky">I stick to the top while scrolling</div>
<div class="parent">relative parent<div class="abs">absolute (bottom-right of parent)</div></div>
<div class="fixed">fixed button</div>
<p>Scroll down…</p>`),
        code: `.parent { position: relative; }   /* becomes the containing block */
.badge {
  position: absolute;                /* removed from flow */
  top: 8px; right: 8px;              /* relative to .parent */
}
.toolbar { position: sticky; top: 0; }   /* normal until it hits top: 0 */
.fab     { position: fixed; bottom: 1rem; right: 1rem; } /* relative to viewport */

/* Centre an absolutely positioned element */
.modal {
  position: fixed;
  inset: 0;          /* top/right/bottom/left: 0 */
  margin: auto;
  width: min(90vw, 480px);
  height: fit-content;
}`,
      },
    ],
    'Flexbox Layout': [
      {
        title: 'Navbar with pushed-right item',
        language: 'css',
        playground: page(`
body { margin: 0; font-family: system-ui; }
.nav { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #0047ab; color: #fff; }
.nav a { color: #e0e7ff; text-decoration: none; }
.nav .push { margin-left: auto; }
`, `<nav class="nav"><strong>Logo</strong><a href="#">Docs</a><a href="#">Blog</a><a class="push" href="#">Sign in</a></nav>`),
        code: `.nav {
  display: flex;
  align-items: center;   /* vertical centring on the cross axis */
  gap: 1rem;
}
.nav .push {
  margin-left: auto;     /* eats all free space → pushes itself (and anything after) right */
}`,
      },
      {
        title: 'flex: 1 — equal columns & sidebar layouts',
        language: 'css',
        code: `/* flex: <grow> <shrink> <basis> */
.col     { flex: 1; }           /* = 1 1 0%  → equal widths */
.sidebar { flex: 0 0 240px; }   /* fixed 240px, never grows or shrinks */
.main    { flex: 1 1 auto; min-width: 0; } /* min-width: 0 lets long content shrink */

/* Wrap cards and keep each at least 220px */
.cards { display: flex; flex-wrap: wrap; gap: 1rem; }
.cards > * { flex: 1 1 220px; }

/* Sticky footer */
body { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }`,
      },
    ],
    'CSS Grid Layout': [
      {
        title: 'Named areas page layout',
        language: 'css',
        playground: page(`
body { margin: 0; font-family: system-ui; min-height: 100vh; display: grid; gap: 8px;
  grid-template: "header header" 60px "sidebar main" 1fr "footer footer" 50px / 200px 1fr; }
header { grid-area: header; } aside { grid-area: sidebar; } main { grid-area: main; } footer { grid-area: footer; }
body > * { background: #e0e7ff; padding: 1rem; }
@media (max-width: 600px) { body { grid-template: "header" "main" "sidebar" "footer" / 1fr; } }
`, `<header>Header</header><aside>Sidebar</aside><main>Main content</main><footer>Footer</footer>`),
        code: `.layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}
header { grid-area: header; }
aside  { grid-area: sidebar; }
main   { grid-area: main; }
footer { grid-area: footer; }

@media (max-width: 600px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas: "header" "main" "sidebar" "footer";
  }
}`,
      },
      {
        title: 'Responsive card grid without media queries',
        language: 'css',
        code: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: 1.5rem;
}

/* auto-fill keeps empty tracks; auto-fit collapses them so items stretch */
.gallery { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }

/* Make one item span two columns and two rows */
.featured { grid-column: span 2; grid-row: span 2; }`,
      },
    ],
    'Transitions & Animations': [
      {
        title: 'Loading spinner & skeleton',
        language: 'css',
        playground: page(`
body { font-family: system-ui; display: grid; gap: 2rem; padding: 2rem; }
.spinner { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #0047ab; border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.skeleton { height: 16px; border-radius: 8px; background: linear-gradient(90deg, #eee 25%, #f5f5f5 37%, #eee 63%); background-size: 400% 100%; animation: shimmer 1.4s ease infinite; }
@keyframes shimmer { from { background-position: 100% 50%; } to { background-position: 0 50%; } }
`, `<div class="spinner"></div><div class="skeleton"></div><div class="skeleton" style="width:60%"></div>`),
        code: `.spinner {
  width: 40px; height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #0047ab;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Respect users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
  .spinner { animation-duration: 2s; }
}`,
      },
      {
        title: 'Hover card lift (GPU-friendly)',
        language: 'css',
        code: `.card {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.card:hover {
  transform: translateY(-4px);          /* animate transform/opacity, not top/height */
  box-shadow: 0 12px 24px rgb(0 0 0 / 0.15);
}`,
      },
    ],
    'Responsive Design & Media Queries': [
      {
        title: 'Mobile-first breakpoints & feature queries',
        language: 'css',
        code: `/* Base = mobile */
.container { padding: 1rem; }
.grid { display: grid; gap: 1rem; }

/* Larger screens add complexity */
@media (min-width: 640px)  { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } .container { padding: 2rem; } }

/* Range syntax (modern browsers) */
@media (600px <= width < 900px) { .sidebar { display: none; } }

/* User preferences */
@media (prefers-color-scheme: dark) { :root { --bg: #0f172a; --text: #e2e8f0; } }
@media (hover: none) { .tooltip { display: none; } }   /* touch devices */

/* Fluid typography — no breakpoints needed */
h1 { font-size: clamp(1.75rem, 1rem + 3vw, 3rem); }`,
      },
    ],
    'CSS Variables (Custom Properties)': [
      {
        title: 'Theme switcher with variables',
        language: 'css',
        playground: {
          language: 'html',
          code: `<!DOCTYPE html>
<html>
<head>
<style>
:root { --bg: #fff; --text: #1e293b; --accent: #0047ab; }
[data-theme="dark"] { --bg: #0f172a; --text: #e2e8f0; --accent: #60a5fa; }
body { background: var(--bg); color: var(--text); font-family: system-ui; padding: 2rem; transition: background .3s, color .3s; }
button { border: 2px solid var(--accent); color: var(--accent); background: none; padding: .5rem 1rem; border-radius: 8px; }
</style>
</head>
<body>
  <h1>Theme tokens</h1>
  <button onclick="document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? '' : 'dark'">Toggle theme</button>
</body>
</html>`,
        },
        code: `:root {
  --bg: #ffffff;
  --text: #1e293b;
  --accent: #0047ab;
  --radius: 8px;
  --space: 1rem;
}

[data-theme="dark"] {        /* override tokens for a theme */
  --bg: #0f172a;
  --text: #e2e8f0;
  --accent: #60a5fa;
}

body   { background: var(--bg); color: var(--text); }
.btn   { border-radius: var(--radius); padding: calc(var(--space) / 2) var(--space); }
.alert { color: var(--alert-color, crimson); }   /* fallback value */

/* Read/write from JavaScript:
   getComputedStyle(document.documentElement).getPropertyValue('--accent')
   document.documentElement.style.setProperty('--accent', 'hotpink') */`,
      },
    ],
    'Specificity & Inheritance': [
      {
        title: 'Calculating specificity',
        language: 'css',
        explanation: 'Specificity is compared as **(IDs, classes/attributes/pseudo-classes, elements/pseudo-elements)** from left to right. Inline styles beat all of them; `!important` beats inline styles.',
        code: `p                      /* (0,0,1) */
.intro                 /* (0,1,0) */
p.intro                /* (0,1,1) */
nav ul li a            /* (0,0,4) */
.menu a:hover          /* (0,2,1) */
#header .logo          /* (1,1,0) */
:where(#header) .logo  /* (0,1,0) — :where() adds nothing */
:is(#header, .x) .logo /* (1,1,0) — :is() takes its most specific argument */

/* Inheritance: text properties inherit, box properties do not */
body   { color: #333; font-family: system-ui; } /* inherited by children */
.card  { border: 1px solid; }                   /* NOT inherited */
button { font: inherit; }                       /* force inheritance */`,
      },
    ],
  },

  sections: [
    {
      title: 'Transforms & 3D',
      after: 'Text, Fonts & Shadows',
      content: `The \`transform\` property moves, rotates, scales and skews elements **without affecting layout** — surrounding elements do not move. Because the browser can run transforms on the GPU, they are the preferred way to animate.

### 2D transform functions

| Function | Example | Effect |
|---|---|---|
| \`translate(x, y)\` | \`translate(20px, -50%)\` | Move |
| \`scale(x, y)\` | \`scale(1.1)\` | Resize |
| \`rotate(angle)\` | \`rotate(45deg)\` | Rotate |
| \`skew(x, y)\` | \`skew(10deg)\` | Slant |

Transforms are applied **right to left**, so \`translate(100px) rotate(45deg)\` rotates first, then moves. \`transform-origin\` sets the pivot point (default: centre).

### Individual transform properties

Modern CSS also supports standalone \`translate\`, \`rotate\` and \`scale\` properties, which can be animated independently.

### 3D

Add \`perspective\` on the parent to give depth, then use \`rotateX\`, \`rotateY\` and \`translateZ\`. \`backface-visibility: hidden\` hides the reverse side — the basis of card-flip effects.`,
      code: `.icon:hover   { transform: scale(1.1) rotate(-5deg); }
.center       { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.door         { transform-origin: left center; transform: rotateY(-30deg); }

/* Standalone properties */
.badge { translate: 0 -4px; scale: 1.05; rotate: 3deg; }

/* 3D card flip */
.scene { perspective: 800px; }
.card {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.scene:hover .card { transform: rotateY(180deg); }
.face { position: absolute; inset: 0; backface-visibility: hidden; }
.back { transform: rotateY(180deg); }`,
      codeLabel: 'Transform patterns',
      examples: [
        {
          title: 'Flip card demo',
          language: 'css',
          playground: page(`
body { font-family: system-ui; display: grid; place-items: center; min-height: 100vh; margin: 0; background: #f1f5f9; }
.scene { width: 220px; height: 140px; perspective: 800px; }
.card { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .6s; }
.scene:hover .card { transform: rotateY(180deg); }
.face { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 12px; backface-visibility: hidden; color: #fff; font-weight: 700; }
.front { background: #0047ab; } .back { background: #16a34a; transform: rotateY(180deg); }
`, `<div class="scene"><div class="card"><div class="face front">Hover me</div><div class="face back">Back side!</div></div></div>`),
          code: `.scene { perspective: 800px; }
.card  { transform-style: preserve-3d; transition: transform .6s; }
.scene:hover .card { transform: rotateY(180deg); }
.face  { position: absolute; inset: 0; backface-visibility: hidden; }
.back  { transform: rotateY(180deg); }`,
        },
      ],
      keyPoints: [
        'Transforms do not affect document flow.',
        'Prefer animating transform and opacity for smooth 60fps motion.',
        'Functions apply right-to-left; transform-origin sets the pivot.',
        'perspective + rotateY + backface-visibility create 3D flips.',
      ],
    },
    {
      title: 'Container Queries & Modern Layout',
      after: 'Responsive Design & Media Queries',
      content: `Media queries respond to the **viewport**. **Container queries** respond to the size of a component's **parent**, so the same card can be compact in a sidebar and spacious in the main column — true component-level responsiveness.

### How to use them

1. Mark an ancestor as a container: \`container-type: inline-size\` (optionally \`container-name\`).
2. Write \`@container (min-width: 400px) { … }\` rules for its descendants.
3. Use container units like \`cqi\` (1% of the container's inline size) for fluid sizing.

### Other modern layout tools

- **\`aspect-ratio\`** — keep media boxes at 16 / 9 without padding hacks.
- **\`gap\`** — works in flexbox as well as grid.
- **\`subgrid\`** — child grids align to the parent grid's tracks.
- **Logical properties** — \`margin-inline\`, \`padding-block\`, \`inset-inline-start\` adapt to right-to-left languages automatically.
- **\`min()\`, \`max()\`, \`clamp()\`** — responsive values without breakpoints.`,
      code: `.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

.card { display: grid; gap: 1rem; }

@container card (min-width: 420px) {
  .card { grid-template-columns: 160px 1fr; }  /* image beside text when there is room */
}

.card h3 { font-size: clamp(1rem, 4cqi, 1.5rem); }   /* container-relative units */

.thumb { aspect-ratio: 16 / 9; object-fit: cover; width: 100%; }

/* Logical properties: correct in LTR and RTL */
.callout { margin-block: 1rem; padding-inline: 1.25rem; border-inline-start: 4px solid; }

/* Subgrid: rows of cards share aligned titles/footers */
.cards { display: grid; grid-template-columns: repeat(3, 1fr); }
.cards .card { display: grid; grid-row: span 3; grid-template-rows: subgrid; }`,
      codeLabel: 'Container queries, aspect-ratio, logical props, subgrid',
      examples: [
        {
          title: 'Same card, two containers',
          language: 'css',
          playground: page(`
body { font-family: system-ui; display: grid; grid-template-columns: 220px 1fr; gap: 1rem; padding: 1rem; }
.slot { container-type: inline-size; background: #f1f5f9; padding: .5rem; border-radius: 8px; }
.card { display: grid; gap: .5rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: .75rem; }
.card .img { background: #0047ab; aspect-ratio: 16/9; border-radius: 6px; }
@container (min-width: 380px) { .card { grid-template-columns: 140px 1fr; align-items: center; } }
`, `<div class="slot"><div class="card"><div class="img"></div><div>Narrow container → stacked</div></div></div>
<div class="slot"><div class="card"><div class="img"></div><div>Wide container → side by side</div></div></div>`),
          code: `.slot { container-type: inline-size; }
@container (min-width: 380px) {
  .card { grid-template-columns: 140px 1fr; }
}`,
        },
      ],
      keyPoints: [
        'Container queries size components by their parent, not the viewport.',
        'Declare container-type: inline-size on the ancestor first.',
        'aspect-ratio, gap, subgrid and clamp() remove many old layout hacks.',
        'Logical properties make layouts work in RTL languages for free.',
      ],
    },
    {
      title: 'Common Layout Recipes',
      after: 'Website Layout Structure',
      content: `Copy-ready solutions to the layout problems developers search for most often.

| Problem | Best tool |
|---|---|
| Centre anything | Grid: \`place-items: center\` |
| Equal-height columns | Flexbox or Grid (default stretch) |
| Sticky footer | Flex column + \`flex: 1\` on main |
| Sidebar + content | Grid \`minmax()\` or flex with fixed basis |
| Responsive card grid | \`repeat(auto-fill, minmax(…, 1fr))\` |
| Full-bleed section in a centred column | Grid with named lines |
| Truncate text with "…" | \`text-overflow: ellipsis\` (+ \`-webkit-line-clamp\` for multi-line) |

The code below collects each recipe; the examples tab has runnable versions.`,
      code: `/* 1. Centre horizontally + vertically */
.center { display: grid; place-items: center; min-height: 100vh; }

/* 2. Sticky footer */
body { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }

/* 3. Sidebar that collapses under 600px without media queries */
.with-sidebar { display: flex; flex-wrap: wrap; gap: 1rem; }
.with-sidebar > aside { flex: 1 1 240px; }
.with-sidebar > main  { flex: 999 1 400px; min-width: 0; }

/* 4. Centred readable column with full-bleed children */
.content {
  display: grid;
  grid-template-columns: [full-start] 1fr [content-start] min(65ch, 100% - 2rem) [content-end] 1fr [full-end];
}
.content > *     { grid-column: content; }
.content > .full { grid-column: full; }

/* 5. Single- and multi-line truncation */
.one-line { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.three-lines { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

/* 6. Visually hidden but available to screen readers */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}`,
      codeLabel: 'Layout recipes',
      examples: [
        {
          title: 'Holy grail layout',
          language: 'css',
          playground: page(`
body { margin: 0; font-family: system-ui; min-height: 100vh; display: flex; flex-direction: column; }
header, footer { background: #0047ab; color: #fff; padding: 1rem; }
.middle { flex: 1; display: flex; flex-wrap: wrap; gap: 1rem; padding: 1rem; }
nav, aside { flex: 1 1 160px; background: #e0e7ff; padding: 1rem; }
main { flex: 999 1 320px; background: #f8fafc; padding: 1rem; }
`, `<header>Header</header><div class="middle"><nav>Nav</nav><main>Main content grows; side columns wrap under it on small screens.</main><aside>Aside</aside></div><footer>Sticky footer</footer>`),
          code: `body    { min-height: 100vh; display: flex; flex-direction: column; }
.middle { flex: 1; display: flex; flex-wrap: wrap; gap: 1rem; }
nav, aside { flex: 1 1 160px; }
main    { flex: 999 1 320px; }`,
        },
        {
          title: 'Perfect centring — 4 ways',
          language: 'css',
          code: `/* Grid (shortest) */
.a { display: grid; place-items: center; }

/* Flexbox */
.b { display: flex; justify-content: center; align-items: center; }

/* Absolute + transform (unknown size) */
.c { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

/* Margin auto inside a flex/grid parent */
.parent { display: flex; } .d { margin: auto; }`,
        },
      ],
      keyPoints: [
        'display: grid; place-items: center is the simplest centring technique.',
        'Flex column + flex: 1 on main gives a sticky footer.',
        'flex-wrap with large flex-grow ratios creates breakpoint-free sidebars.',
        'Named grid lines enable full-bleed sections inside a readable column.',
      ],
    },
    {
      title: 'Cascade Layers & Architecture',
      after: 'Specificity & Inheritance',
      content: `As stylesheets grow, specificity wars ("just add another class…" or \`!important\`) become the main source of CSS bugs. Modern CSS gives you tools to organise the cascade on purpose.

### Cascade layers (\`@layer\`)

Declare layer order once — later layers always win, **regardless of selector specificity**. Unlayered styles beat all layers.

### Native nesting

CSS now supports nesting with \`&\`, similar to Sass — supported in all modern browsers.

### Naming conventions

**BEM** (\`block__element--modifier\`) keeps specificity flat (one class) and makes relationships obvious: \`.card\`, \`.card__title\`, \`.card--featured\`.

### Utility-first

Frameworks such as **Tailwind CSS** compose many single-purpose classes (\`flex gap-4 p-6\`) instead of writing component CSS — see the Tailwind course.

| Approach | Strength | Trade-off |
|---|---|---|
| BEM | Predictable, framework-free | Verbose class names |
| CSS Modules | Scoped automatically per component | Needs a build step |
| Utility-first | Very fast to build, tiny CSS | Long class attributes |
| \`@layer\` | Controls precedence across files | Requires planning layer order |`,
      code: `/* 1. Declare the order once — later layers win */
@layer reset, base, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; margin: 0; }
}

@layer base {
  a { color: var(--accent); }
}

@layer components {
  /* BEM naming + native nesting */
  .card {
    padding: 1rem;
    border-radius: 8px;

    & .card__title { font-weight: 700; }
    &.card--featured { border: 2px solid gold; }
    &:hover { box-shadow: 0 8px 20px rgb(0 0 0 / .1); }

    @media (min-width: 768px) { padding: 2rem; }
  }
}

@layer utilities {
  .hidden { display: none; }   /* wins over .card even though specificity is equal/lower */
}`,
      codeLabel: '@layer, nesting and BEM',
      keyPoints: [
        '@layer order beats specificity — later layers win.',
        'Native CSS nesting with & works in all modern browsers.',
        'BEM keeps specificity flat and class relationships readable.',
        'Avoid !important; fix precedence with layers or simpler selectors.',
      ],
    },
  ],
};

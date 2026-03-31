export const cssCourse = {
  id: 'css',
  title: 'CSS',
  description: 'Cascading Style Sheets — styling and layout for the web.',
  officialDocs: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  tutorialLink: 'https://www.w3schools.com/css/',
  exerciseLink: 'https://www.w3schools.com/css/css_exercises.asp',
  sections: [
    {
      title: 'Introduction to CSS',
      content: `**CSS (Cascading Style Sheets)** is a stylesheet language used to describe the presentation of a document written in **HTML** or **XML**. It separates content from design, allowing developers to style web pages consistently and efficiently.\n\n### What CSS Controls\n\nCSS controls: **Colors** (text, background, and border colors), **Fonts** (families, sizes, weights, and styles), **Spacing** (\`margin\`, \`padding\`, and \`line-height\`), **Layout** (arranging elements using **Flexbox** or **Grid**), and **Responsiveness** (adapting designs for different screen sizes using *media queries*).\n\n**HTML** provides the structure (headings, paragraphs, lists), while **CSS** enhances the visual appeal, making websites engaging and user-friendly. Without CSS, web pages would look plain and unformatted.\n\nThe word **"Cascading"** refers to the priority system CSS uses when multiple rules target the same element. Rules cascade based on *specificity*, *source order*, and *importance*. Understanding this cascade is fundamental to writing predictable, maintainable styles.\n\n### Modern CSS\n\nModern CSS is remarkably powerful. Features like **Flexbox**, **Grid**, **custom properties** (variables), **container queries**, and advanced selectors have eliminated the need for many JavaScript-based layout solutions. Learning CSS deeply will make you a significantly faster and more effective frontend developer.`,
      keyPoints: [
        'CSS controls presentation; HTML controls structure.',
        '"Cascading" refers to the priority/specificity system.',
        'CSS manages colors, fonts, spacing, layout, and responsiveness.',
        'Modern CSS (Flexbox, Grid, variables) is extremely powerful.',
        'Without CSS, web pages are plain and unformatted.'
      ]
    },
    {
      title: 'CSS Syntax & Types',
      content: `**CSS rules** consist of three main parts: a **Selector** that targets the HTML element(s) to style (e.g., \`p\` for paragraphs), a **Property** that specifies the style attribute to change (e.g., \`color\`), and a **Value** that provides the setting (e.g., \`red\`). The format is: \`selector { property: value; }\`. Remember to end each declaration with a semicolon (\`;\`) and enclose declarations in curly braces \`{}\`.\n\n**Common Pitfall:** Missing semicolons can cause subsequent rules to fail. Always validate your CSS using tools like the [W3C CSS Validator](https://jigsaw.w3.org/css-validator/).\n\n### Three Ways to Apply CSS\n\nCSS can be applied in three ways:\n\n**Inline CSS** — Applied directly in the HTML tag using the \`style\` attribute. Quick but not reusable. *Use case:* one-off styles or email templates where external files may not load. *Drawback:* Hard to maintain as styles are scattered throughout HTML.\n\n**Internal CSS** — Placed inside a \`<style>\` tag in the \`<head>\` section. Keeps styles in one place, good for prototyping or single-page styling. *Drawback:* Not reusable across multiple pages.\n\n**External CSS** (Recommended) — Styles are in a separate \`.css\` file linked via \`<link rel="stylesheet" href="style.css">\`. *Use case:* Large projects, themes, or sites with consistent styling. *Advantages:* Reusability, easier maintenance, and browser caching for faster loads.`,
      code: `/* CSS Syntax: selector { property: value; } */
p {
  color: red;
  font-style: italic;
}

/* Inline CSS (in HTML) */
/* <h1 style="color: green; text-decoration: underline;">Inline</h1> */

/* Internal CSS (in HTML <head>) */
/* <style> p { color: blue; } </style> */

/* External CSS (separate file linked in HTML) */
/* <link rel="stylesheet" href="style.css"> */
p {
  color: purple;
  line-height: 1.5;
}`,
      codeLabel: 'CSS Syntax & Types',
      keyPoints: [
        'CSS rule = selector + property + value.',
        'Inline CSS: quick but not reusable (style attribute).',
        'Internal CSS: in <style> tag, good for single pages.',
        'External CSS: recommended — reusable, cached, maintainable.',
        'Always end declarations with semicolons to avoid errors.'
      ]
    },
    {
      title: 'CSS Selectors',
      content: `**Selectors** are patterns used to select elements for styling. They are crucial for precise targeting, reducing code duplication, and improving performance by avoiding overly broad rules.\n\n### Basic Selectors\n\n**Element Selector** (\`p { color: red; }\`) targets all instances of an element. **Class Selector** (\`.box { border: 1px solid black; }\`) targets elements with a specific class — prefix with dot. **ID Selector** (\`#title { font-size: 24px; }\`) targets a unique element — prefix with hash. Use classes for most styling; IDs should be unique per page.\n\n### More Selectors for Real Projects\n\n**Universal Selector** (\`* { box-sizing: border-box; }\`) applies to all elements — use sparingly. **Group Selector** (\`h1, h2, h3 { color: navy; }\`) styles multiple selectors at once. **Attribute Selector** (\`input[type="text"] { border: 1px solid gray; }\`) targets based on attributes.\n\n### Combinator Selectors\n\n**Descendant** (\`div p\`) selects all \`<p>\` inside any \`<div>\`. **Child** (\`ul > li\`) selects only direct children. **Adjacent Sibling** (\`h1 + p\`) selects the next sibling. **General Sibling** (\`h1 ~ p\`) selects all following siblings.\n\n**Advanced Tip:** Combine selectors for precision, e.g., \`.container > .item:first-child { background: lightblue; }\`. Prefer class selectors for almost everything — they are specific enough and resilient to HTML changes.`,
      code: `/* Basic Selectors */
p { color: red; }
.box { border: 1px solid black; padding: 10px; }
#title { font-size: 24px; font-weight: bold; }

/* Universal & Group */
* { box-sizing: border-box; margin: 0; padding: 0; }
h1, h2, h3 { color: navy; font-family: Arial, sans-serif; }

/* Attribute Selector */
input[type="text"] { border: 1px solid gray; width: 100%; }

/* Combinators */
div p { color: green; }             /* Descendant */
ul > li { list-style: square; }     /* Child (direct) */
h1 + p { font-weight: bold; }      /* Adjacent sibling */
h1 ~ p { color: gray; }            /* General sibling */

/* Combine for precision */
.container > .item:first-child { background: lightblue; }`,
      codeLabel: 'CSS Selectors',
      keyPoints: [
        'Element, class (.name), and ID (#name) are the basic selectors.',
        'Use class selectors for almost everything — flexible and reusable.',
        'Combinators: descendant (space), child (>), adjacent (+), general (~).',
        'Attribute selectors target elements by their attribute values.',
        'Universal selector (*) applies to all — use sparingly.'
      ]
    },
    {
      title: 'The Box Model',
      content: `The **CSS Box Model** describes how every HTML element is rendered as a rectangular box, including its dimensions and spacing. Understanding it is essential for layout control and debugging issues like overlapping or unexpected element sizes.\n\n### Box Model Parts (Inside Out)\n\n**Content** — the actual content (text, images); \`width\`/\`height\` properties apply here. **Padding** — transparent space around content; increases element size. **Border** — visible line around padding; can be styled (\`solid\`, \`dashed\`, etc.). **Margin** — transparent space outside border; collapses vertically between elements.\n\nBy default (\`content-box\` sizing), \`width\` and \`height\` apply only to the content area. Padding and border are added on top, making the total size larger than expected. For example, a \`200px\` wide box with \`20px\` padding and \`2px\` border becomes **244px** total. The fix: \`box-sizing: border-box\` makes \`width\` and \`height\` include padding and border. Most modern CSS resets apply this globally with \`*, *::before, *::after { box-sizing: border-box; }\`.\n\n### Margin Collapsing\n\n**Margin Collapsing:** When two vertical margins touch, they collapse into one (the larger one wins). This only happens vertically and is a common source of spacing bugs. \`padding\` cannot be negative, but \`margin\` can — negative margins pull elements closer or even overlap them.`,
      image: '/images/css/css-box-model.svg',
      code: `/* Apply border-box globally */
*, *::before, *::after {
  box-sizing: border-box;
}

.box {
  width: 200px;        /* Total width = 200px (with border-box) */
  padding: 20px;       /* Inside space */
  border: 2px solid black;
  margin: 10px;        /* Outside space */
}

/* Without border-box: total = 200 + 40 + 4 = 244px */
/* With border-box: total = 200px (padding & border inside) */

/* Margin collapse: these <p> gaps don't add up */
p { margin: 20px 0; }  /* Gap between paragraphs = 20px, not 40px */`,
      codeLabel: 'Box Model Example',
      keyPoints: [
        'Content → Padding → Border → Margin (inside out).',
        'Always use box-sizing: border-box globally.',
        'Without border-box, padding and border add to the total width.',
        'Vertical margins collapse; horizontal margins do not.',
        'Padding cannot be negative; margin can.'
      ]
    },
    {
      title: 'Display & Position Properties',
      content: `The \`display\` property controls an element's layout behavior, influencing flow, sizing, and interaction with siblings. Common values: \`block\` (starts on new line, takes full width — \`div\`, \`p\`, \`h1\`), \`inline\` (flows with text, no width/height — \`span\`, \`a\`, \`strong\`), \`inline-block\` (inline flow with block sizing — can set width/height), \`none\` (hides element completely, removed from layout), and \`flex\`/\`grid\` for advanced layout systems.\n\n### Position Property\n\nThe \`position\` property controls where elements appear relative to the document flow or viewport. It is essential for overlays, sticky navs, modals, and layered UI.\n\n**Position Types:** \`static\` (default) — normal document flow. \`relative\` — offset from its original position using \`top\`/\`left\`/\`right\`/\`bottom\`, but still occupies original space. \`absolute\` — positioned relative to its nearest positioned ancestor (non-static parent); removed from flow. \`fixed\` — fixed to the viewport; stays visible during scrolling (used for *sticky headers*, *back-to-top buttons*). \`sticky\` — toggles between relative and fixed based on scroll position.\n\n### Z-Index\n\n\`z-index\` controls the stacking order for overlapping elements. Rules: higher \`z-index\` wins, and it only works on positioned elements (not \`static\`). *Use cases:* layering images, modals, dropdowns, and dialog overlays. Avoid z-index wars — use a z-index scale system (e.g., \`--z-dropdown: 100\`, \`--z-modal: 200\`).`,
      image: '/images/css/css-position-types.jpg',
      code: `/* Display values */
div { display: block; }         /* Full width, new line */
span { display: inline; }       /* Flows with text */
.box { display: inline-block;   /* Inline + block sizing */
       width: 150px; height: 50px; }
.hide { display: none; }        /* Hidden completely */

/* Position types */
.relative { position: relative; top: 10px; left: 20px; }
.absolute { position: absolute; top: 0; right: 0; }
.fixed { position: fixed; bottom: 10px; right: 10px; }
.sticky { position: sticky; top: 0; background: white; }

/* Z-Index stacking */
.box1 { position: absolute; z-index: 1; background: red; }
.box2 { position: absolute; z-index: 10; background: blue; }`,
      codeLabel: 'Display, Position & Z-Index',
      keyPoints: [
        'block = full width; inline = content width; inline-block = both.',
        'display: none hides element and removes it from layout.',
        'static is default; relative offsets from original position.',
        'absolute positions relative to nearest non-static ancestor.',
        'z-index only works on positioned (non-static) elements.'
      ]
    },
    {
      title: 'Flexbox Layout',
      content: `**Flexbox** is a modern CSS layout model designed to arrange elements in one direction at a time (row OR column). It is widely used in real-time company projects because it is simple, flexible, and responsive.\n\n### Why Flexbox Matters\n\nEasy alignment (center, left, right), dynamic spacing between items, automatically adjusts for screen size, and reduces complex CSS code.\n\n### Flexbox Concepts\n\n**Flex Container** is the parent element with \`display: flex\`. **Flex Items** are the direct children of the container. **Main Axis** is the direction of layout (row or column). **Cross Axis** is the opposite direction of the main axis.\n\n### Common Flexbox Properties\n\n\`flex-direction\` controls direction of items (\`row\` | \`row-reverse\` | \`column\` | \`column-reverse\`). \`justify-content\` handles **Main Axis** alignment (\`flex-start\` | \`center\` | \`space-between\` | \`space-around\` | \`space-evenly\`) — used for spacing menus, buttons, and cards. \`align-items\` handles **Cross Axis** alignment (\`stretch\` | \`center\` | \`flex-start\` | \`flex-end\`) — used for vertical alignment. \`gap\` adds space between items without margins.\n\nOn individual items: \`flex-grow\` controls how much extra space an item absorbs. \`flex-shrink\` controls how much it shrinks. \`flex-basis\` sets the initial size. The shorthand \`flex: 1\` means "grow equally, shrink equally, basis auto." *Real project use cases:* navigation bars, button groups, card layouts, and centering elements.`,
      image: '/images/css/css-flexbox-layout.svg',
      code: `/* Basic Flexbox */
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

/* Center anything vertically and horizontally */
.center-everything {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Navigation bar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

/* Card grid that wraps */
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.card-container .card {
  flex: 1 1 300px; /* Grow, shrink, min 300px */
}`,
      codeLabel: 'Flexbox Layout Patterns',
      keyPoints: [
        'display: flex on parent makes children flex items.',
        'justify-content: main axis; align-items: cross axis.',
        'flex: 1 makes items share space equally.',
        'Use gap for consistent spacing between items.',
        'Real uses: nav bars, button groups, card layouts, centering.'
      ]
    },
    {
      title: 'CSS Grid Layout',
      content: `**CSS Grid** is a powerful two-dimensional layout system that works with rows and columns together. It is best suited for full website layouts and complex designs.\n\n### Why CSS Grid\n\nPerfect control over rows and columns. Clean structure for layouts. Less HTML dependency. Better than tables for layouts.\n\n### Grid Core Concepts\n\n**Grid Container** is the element with \`display: grid\`. **Grid Items** are the children of the grid container. **Grid Lines** are the dividing lines between tracks. **Grid Tracks** are the rows and columns.\n\nSet \`display: grid\` on the parent. Define columns with \`grid-template-columns\` and rows with \`grid-template-rows\`. The \`fr\` (fraction) unit distributes available space proportionally: \`1fr 2fr\` means the second column is twice as wide. The \`repeat()\` function creates multiple tracks: \`repeat(3, 1fr)\` creates three equal columns.\n\n### Responsive Grids\n\nFor responsive grids, use \`repeat(auto-fit, minmax(280px, 1fr))\` — creates as many columns as fit, each at least 280px wide, growing to fill remaining space. No media queries needed.\n\nGrid items can span multiple cells using \`grid-column: span 2\` or be placed explicitly using \`grid-column: 1 / 3\` (start at line 1, end at line 3). \`grid-template-areas\` lets you name regions and arrange them visually in your CSS. *Real project use cases:* website layouts, dashboards, admin panels, and image galleries.`,
      image: '/images/css/css-grid-layout.svg',
      code: `/* Basic Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 15px;
}
.item { grid-column: span 2; } /* Spans two columns */

/* Responsive auto-fit grid (no media queries!) */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Named areas layout */
.page-layout {
  display: grid;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
.page-header  { grid-area: header; }
.page-sidebar { grid-area: sidebar; }
.page-main    { grid-area: main; }
.page-footer  { grid-area: footer; }`,
      codeLabel: 'CSS Grid Patterns',
      keyPoints: [
        'Grid handles 2D layouts (rows AND columns simultaneously).',
        'fr unit distributes space proportionally.',
        'auto-fit + minmax() creates responsive grids without media queries.',
        'grid-template-areas creates visual, readable layouts.',
        'Real uses: website layouts, dashboards, admin panels, galleries.'
      ]
    },
    {
      title: 'Pseudo Classes & Elements',
      content: `**Pseudo classes** style elements based on user interaction or state — they add interactivity without JavaScript. **Pseudo elements** style specific parts of elements.\n\n### Common Pseudo Classes\n\n\`:hover\` — mouse is over the element (\`a:hover { color: red; }\`). \`:active\` — element is being clicked (\`button:active { background: green; }\`). \`:focus\` — element has keyboard focus (\`input:focus { border-color: blue; }\`). \`:first-child\`, \`:last-child\` — targets first/last child of a parent. \`:nth-child(2n)\` — targets every even element (useful for *table striping*). \`:not(.hidden)\` — targets elements that do NOT match a selector.\n\n### Common Pseudo Elements\n\n\`::before\` and \`::after\` — insert generated content before/after an element's content. \`::first-line\` — styles the first line of text. \`::first-letter\` — styles the first letter (used for *drop-cap effects*). \`::placeholder\` — styles input placeholder text.\n\nPseudo-elements use double colons (\`::\`) while pseudo-classes use single colons (\`:\`). The \`content\` property is required for \`::before\` and \`::after\` to appear.`,
      code: `/* Pseudo Classes — interaction states */
a:hover { color: red; text-decoration: underline; }
button:active { background: green; transform: scale(0.98); }
input:focus { border-color: blue; outline: none; }
tr:nth-child(even) { background-color: #f2f2f2; }
.item:not(.hidden) { display: block; }

/* Pseudo Elements — style parts of elements */
.quote::before { content: "\\201C"; font-size: 2rem; }
.quote::after { content: "\\201D"; font-size: 2rem; }
p::first-line { font-weight: bold; }
p::first-letter { font-size: 2em; float: left; }
input::placeholder { color: #999; font-style: italic; }`,
      codeLabel: 'Pseudo Classes & Elements',
      keyPoints: [
        ':hover, :active, :focus add interactivity without JavaScript.',
        '::before and ::after require the content property.',
        ':nth-child(2n) targets every even element (great for tables).',
        'Single colon (:) for pseudo-classes, double (::) for pseudo-elements.',
        ':not() selector excludes elements matching a pattern.'
      ]
    },
    {
      title: 'CSS Units & Math Functions',
      content: `CSS units control size, spacing, and layout behavior. They fall into two categories.\n\n### Absolute Units\n\n\`px\` (pixels) — fixed size, does not scale with user preferences. Best for borders, shadows, and fine-detail sizing. Avoid for font sizes and layout widths.\n\n### Relative Units (Recommended for Responsive Design)\n\n\`em\` — relative to the parent's font size (\`1.5em\` = 1.5x parent). \`rem\` — relative to the root (\`html\`) font size (consistent, predictable — preferred for font sizes). \`%\` — relative to the parent element's size (great for widths). \`vw\`/\`vh\` — relative to the viewport width/height (\`100vw\` = full viewport width). \`fr\` — fractional unit used exclusively in **CSS Grid** to distribute available space.\n\n### CSS Math Functions\n\nCSS Math Functions allow dynamic calculations directly in stylesheets: \`calc()\` performs arithmetic (\`width: calc(100% - 40px)\`). \`min()\` picks the smallest value (\`width: min(100%, 600px)\`). \`max()\` picks the largest value. \`clamp(min, preferred, max)\` constrains a value between bounds — extremely useful for *fluid typography* (\`font-size: clamp(1rem, 2.5vw, 2rem)\`).\n\n**Best Practice:** Use \`rem\` for font sizes, \`%\` for widths, and \`clamp()\` for fluid responsive values. Avoid mixing too many unit types in a single component.`,
      code: `/* Absolute vs Relative units */
.border { border: 1px solid black; }         /* px for borders */
body { font-size: 16px; }                    /* Root base */
h1 { font-size: 2rem; }                     /* = 32px (2 × root) */
.child { font-size: 1.5em; }                /* 1.5 × parent size */
.container { width: 80vw; padding: 2rem; }  /* Viewport-relative */

/* CSS Math Functions */
.sidebar { width: calc(100% - 40px); }
.card { width: min(100%, 600px); }
.responsive { width: clamp(300px, 50%, 600px); }

/* Fluid typography with clamp() */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
p  { font-size: clamp(0.875rem, 1.5vw, 1.125rem); }`,
      codeLabel: 'CSS Units & Math Functions',
      keyPoints: [
        'px for borders/details; rem for font sizes; % for widths.',
        'rem is relative to root font size — predictable and consistent.',
        'vw/vh are relative to viewport; fr is for Grid tracks.',
        'calc() does arithmetic: calc(100% - 40px).',
        'clamp(min, preferred, max) is ideal for fluid responsive values.'
      ]
    },
    {
      title: 'Colors, Gradients & Backgrounds',
      content: `CSS offers multiple color formats: **Hex** (\`#ff0000\`), **RGB** (\`rgb(255, 0, 0)\`), and **HSL** (\`hsl(0, 100%, 50%)\`). **HSL** is the most human-readable because you can intuitively adjust *hue* (color), *saturation* (vibrancy), and *lightness* (brightness) independently.\n\nAll formats support an **alpha** (transparency) channel: \`rgba(0, 0, 0, 0.8)\` for 80% opaque black. Modern CSS also accepts hex with alpha (\`#ff000080\`).\n\n### Gradients\n\nGradients create smooth color transitions: \`linear-gradient(to right, red, yellow)\` transitions along a line. \`radial-gradient(circle, white, blue)\` radiates from a center point. **Conic gradients** rotate around a center (useful for *pie charts*). Gradients can be used anywhere a color is accepted.\n\n### Backgrounds\n\nThe \`background\` property is a powerful shorthand combining color, image, repeat, position, and size. \`background-size: cover\` scales to cover the entire element (may crop), while \`contain\` ensures the full image is visible (may leave empty space). Layers can be combined: overlay a gradient on an image for rich visual effects.\n\nThe \`backdrop-filter\` property applies effects (\`blur\`, \`brightness\`) to the area behind an element, enabling popular *glassmorphism* effects.`,
      image: '/images/css/css-gradients.png',
      code: `/* Color formats */
.text { color: #ff0000; }              /* Hex */
.bg { background-color: rgb(255, 0, 0); } /* RGB */
.accent { color: hsl(0, 100%, 50%); }  /* HSL */
body {
  background: radial-gradient(circle, white, blue);
  color: rgba(0, 0, 0, 0.8);
}

/* Linear gradient */
.hero {
  background: linear-gradient(135deg, #0047AB 0%, #002D6E 100%);
}

/* Gradient overlay on image */
.card-bg {
  background:
    radial-gradient(circle at top right, rgba(0,71,171,0.3), transparent),
    url('photo.jpg') center/cover no-repeat;
}

/* Glassmorphism effect */
.glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}`,
      codeLabel: 'Colors, Gradients & Backgrounds',
      keyPoints: [
        'HSL is the most human-readable color format.',
        'All color formats support alpha transparency.',
        'linear-gradient, radial-gradient, and conic-gradient for transitions.',
        'backdrop-filter creates glassmorphism effects.',
        'Layer gradients over images for rich visual effects.'
      ]
    },
    {
      title: 'Text, Fonts & Shadows',
      content: `CSS provides extensive control over typography and visual depth through text properties, font properties, borders, and shadow effects.\n\n### Text & Font Properties\n\n\`font-family\` sets the typeface (always provide a fallback: \`'Arial', sans-serif\`). \`font-size\` controls text size. \`text-align\` aligns text (\`center\`, \`left\`, \`right\`, \`justify\`). \`line-height\` controls vertical spacing between lines (\`1.6\` is a readable default). \`text-transform\` changes case (\`uppercase\`, \`lowercase\`, \`capitalize\`). \`text-shadow\` adds shadow to text. The \`font\` shorthand combines style, weight, size/line-height, and family: \`font: italic bold 1.2em/1.5 Arial\`.\n\n### Borders & Outlines\n\n\`border\` is part of the box model (\`border: 1px solid black\`). \`border-radius\` rounds corners (\`50%\` makes a circle on square elements). \`outline\` is similar to border but does not affect layout — it sits outside the box model and is commonly used for *focus indicators*.\n\n### Shadows\n\nShadows add depth and dimension: \`box-shadow\` (syntax: \`offset-x offset-y blur spread color\`) adds shadows to elements. \`text-shadow\` adds shadows to text for emphasis or effects. Multiple shadows can be comma-separated for layered effects. Shadows are essential for creating *material design* cards, elevated buttons, and modern UI depth.`,
      image: '/images/css/css-shadow-effects.png',
      code: `/* Text & Font Properties */
p {
  font: italic bold 1.2em/1.5 Arial;
  text-decoration: underline wavy red;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px gray;
}
h1 { text-align: center; line-height: 1.6; }

/* Borders & Outlines */
img {
  border: 5px double green;
  border-radius: 50%; /* Circle */
}
button:focus { outline: 2px dashed blue; }

/* Box Shadow */
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Layered shadows for depth */
.elevated {
  box-shadow:
    0 2px 4px rgba(0,0,0,0.1),
    0 8px 16px rgba(0,0,0,0.1);
}`,
      codeLabel: 'Text, Fonts, Borders & Shadows',
      keyPoints: [
        'Always provide a fallback font-family (sans-serif, serif).',
        'line-height: 1.6 is a good default for readability.',
        'border-radius: 50% creates circular elements.',
        'box-shadow adds depth: offset-x offset-y blur spread color.',
        'outline does not affect layout — used for focus indicators.'
      ]
    },
    {
      title: 'CSS Tables Styling',
      content: `Tables are styled with **CSS** for better data presentation. While **HTML** creates the table structure, **CSS** controls its visual appearance — borders, spacing, colors, and hover effects.\n\n### Key Table Styling Properties\n\n\`border-collapse: collapse\` merges adjacent cell borders into one (essential — without it, you get double borders). \`width: 100%\` makes the table span its container. Use \`padding\` on \`th\` and \`td\` cells for readable spacing.\n\n### Alternating Rows & Hover Effects\n\nAlternating row colors improve readability: \`tr:nth-child(even) { background-color: #f2f2f2; }\` creates a striped pattern. Hover effects (\`tr:hover { background-color: #ddd; }\`) help users track rows in dense data.\n\nFor responsive tables on mobile, use *media queries* to stack columns vertically, or wrap the table in a container with \`overflow-x: auto\` to enable horizontal scrolling.`,
      code: `table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}

th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #333;
  color: white;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}

/* Responsive table wrapper */
.table-wrapper {
  overflow-x: auto;
}`,
      codeLabel: 'CSS Table Styling',
      keyPoints: [
        'border-collapse: collapse prevents double borders.',
        'Use tr:nth-child(even) for alternating row colors.',
        'tr:hover helps users track rows in dense data.',
        'Wrap tables in overflow-x: auto for mobile scrolling.',
        'Use tables for data only, not for page layout.'
      ]
    },
    {
      title: 'Transitions & Animations',
      content: `**CSS transitions** make UI changes smooth and professional. When a property like \`color\` or \`transform\` changes (on \`:hover\`, class toggle, etc.), the transition smoothly interpolates between values instead of snapping instantly.\n\n### Transition Properties\n\n\`transition-property\` (what to animate), \`transition-duration\` (how long), \`transition-timing-function\` (speed curve), and \`transition-delay\` (wait before starting). Shorthand: \`transition: transform 0.3s ease\`. Timing functions: \`ease\` (default, slow start/end), \`linear\` (constant speed), \`ease-in\` (slow start), \`ease-out\` (slow end), \`ease-in-out\` (slow both), or custom with \`cubic-bezier()\`.\n\n### @keyframes Animations\n\nCSS \`@keyframes\` animations provide full control over multi-step sequences. Define named keyframes with \`from\`/\`to\` or percentages (\`0%\`, \`50%\`, \`100%\`) and apply them using the \`animation\` property. Animations can loop infinitely, alternate direction, and pause/play. The animation shorthand: \`animation: fadeIn 2s ease-in forwards\`.\n\n### Transforms & Filters\n\n**Transforms** modify elements visually without affecting layout: \`rotate(45deg)\`, \`scale(1.5)\`, \`translate(10px, 20px)\`, \`skew(10deg)\`. **Filters** apply visual effects: \`blur(5px)\`, \`grayscale(50%)\`, \`brightness(120%)\`, \`sepia(100%)\`. These add dynamic effects without JavaScript.\n\n**Performance tip:** Only animate \`transform\` and \`opacity\` — they are GPU-accelerated. Animating \`width\`, \`height\`, \`top\`, or \`margin\` triggers expensive layout recalculations.`,
      image: '/images/css/css-keyframes-animation.png',
      code: `/* Smooth hover transition */
.card {
  transition: transform 0.3s ease;
}
.card:hover {
  transform: scale(1.05);
}

/* @keyframes animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.element {
  animation: fadeIn 2s ease-in forwards;
}

/* Infinite pulse */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
}
.live-dot { animation: pulse 2s ease-in-out infinite; }

/* Transforms & Filters */
.img {
  transform: skew(10deg);
  filter: sepia(100%);
}
.blur { filter: blur(5px) grayscale(50%); }`,
      codeLabel: 'Transitions, Animations, Transforms & Filters',
      keyPoints: [
        'Transitions animate between two states smoothly.',
        'Only animate transform and opacity for best performance.',
        '@keyframes allow multi-step, looping animations.',
        'Transforms: rotate, scale, translate, skew — no layout impact.',
        'Filters: blur, grayscale, brightness, sepia — visual effects.'
      ]
    },
    {
      title: 'Responsive Design & Media Queries',
      content: `**Responsive design** means creating websites that work well on all devices — mobile, tablet, laptop, and desktop. It is mandatory in modern web development because mobile users dominate, *Google* prefers responsive sites, and it delivers a better user experience.\n\n### Key Responsive Concepts\n\n**Flexible Layouts** — use **Flexbox** and **Grid** instead of fixed widths. **Responsive Units** — \`%\`, \`rem\`, \`vw\`/\`vh\` instead of \`px\`. **Media Queries** — apply styles conditionally based on screen characteristics.\n\n### Media Queries\n\nMedia queries use the \`@media\` rule: \`@media (max-width: 768px) { ... }\` applies styles when the screen is 768px or narrower. The **Mobile-First Approach** (recommended): design for mobile first, then use \`min-width\` queries to scale up. This works because mobile styles are simpler and serve as the baseline.\n\n**Flexbox** and **Grid** with \`auto-fit\`/\`minmax\` create responsive layouts without any media queries at all. The \`clamp()\` function provides *fluid typography*: \`font-size: clamp(1rem, 2.5vw, 2rem)\` — the font smoothly scales between bounds based on viewport width.\n\n*Real project use cases:* e-commerce sites, company portals, and dashboards all require responsive design to serve their diverse user bases effectively.`,
      image: '/images/css/css-media-queries.jpg',
      code: `/* Mobile-first approach */
.container {
  padding: 10px;
}

/* Tablet and up (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 30px;
    max-width: 768px;
    margin: 0 auto;
  }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container { padding: 3rem; max-width: 1200px; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Responsive column stacking */
@media (max-width: 768px) {
  .container { flex-direction: column; font-size: 14px; }
}

/* Fluid typography — no media queries needed */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }`,
      codeLabel: 'Responsive Design & Media Queries',
      keyPoints: [
        'Mobile-first (min-width) is the preferred approach.',
        'Use relative units (rem, %, vw) instead of fixed pixels.',
        'clamp() enables fluid sizing without media queries.',
        'Flexbox/Grid + auto-fit create responsive layouts automatically.',
        'Always use the viewport meta tag in HTML for mobile.'
      ]
    },
    {
      title: 'Website Layout Structure',
      content: `**Website layout** defines how content is visually arranged on a page. A clean layout improves readability, usability, and user experience.\n\n### Standard Website Layout Sections\n\n**Header** — contains the logo, company name, and profile icon. **Navigation Menu** — main links, dropdown menus, and responsive hamburger menu for mobile. **Main Content** — the core page data including forms, tables, cards, and articles. **Footer** — copyright info, contact links, and terms & policies.\n\nUse **semantic HTML** elements (\`<header>\`, \`<nav>\`, \`<main>\`, \`<footer>\`) for the layout structure, then style with CSS. **Flexbox** is ideal for navigation bars and single-axis alignment. **Grid** is ideal for the overall page structure.\n\nA typical approach: use **Grid** for the overall page layout (header + nav + main + footer), and **Flexbox** within each section for internal alignment. CSS Grid's \`grid-template-areas\` property makes layouts readable and easy to maintain.`,
      image: '/images/css/css-website-layout.png',
      code: `/* Semantic HTML Structure */
/* <header>Header</header>
   <nav>Navigation</nav>
   <main>Main Content</main>
   <footer>Footer</footer> */

/* Full page layout with Grid */
body {
  display: grid;
  grid-template-areas:
    "header"
    "nav"
    "main"
    "footer";
  grid-template-rows: auto auto 1fr auto;
  min-height: 100vh;
}
header { grid-area: header; }
nav { grid-area: nav; }
main { grid-area: main; }
footer { grid-area: footer; }

/* Navbar with Flexbox */
nav ul {
  display: flex;
  justify-content: center;
  gap: 2rem;
  list-style: none;
}`,
      codeLabel: 'Website Layout Structure',
      keyPoints: [
        'Standard sections: header, nav, main content, footer.',
        'Use semantic HTML elements for layout structure.',
        'Grid for overall page layout; Flexbox for internal alignment.',
        'grid-template-areas creates readable layout declarations.',
        'Clean layout improves readability, usability, and UX.'
      ]
    },
    {
      title: 'CSS Variables (Custom Properties)',
      content: `**CSS Custom Properties** (variables) allow you to define reusable values with the \`--\` prefix and access them using the \`var()\` function. They reduce repetition and make theme switching easy.\n\nDefine variables on \`:root\` (the \`<html>\` element) for global availability. Variables are inherited by descendants and can be overridden for specific components. Unlike *SASS* \`$variables\`, CSS variables are live in the browser — they can be modified at runtime using JavaScript (\`element.style.setProperty('--color', 'red')\`) without any build step.\n\nCSS variables accept **fallback values**: \`var(--primary, #0047AB)\` uses \`#0047AB\` if \`--primary\` is not defined. They can reference other variables and be used in \`calc()\` expressions.\n\n### Advantages\n\nEasy **theme switching** (dark/light mode with \`prefers-color-scheme\`), reduces repetition across large stylesheets, and enables component-level customization. This is the foundation of a **design token system** — define colors, spacing, fonts in one place, reference everywhere.`,
      code: `:root {
  /* Color tokens */
  --primary-color: blue;
  --primary-hover: #003580;
  --bg-main: #ffffff;
  --text-primary: #1e293b;
  --spacing: 10px;
  --font-main: 'Inter', sans-serif;
}

.button {
  color: var(--primary-color);
  margin: var(--spacing);
  font-family: var(--font-main);
}

/* Dark mode override */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-main: #0f172a;
    --text-primary: #f1f5f9;
  }
}

/* Component-level override */
.card {
  --spacing: 20px;
  background: var(--bg-main);
  color: var(--text-primary);
  padding: var(--spacing);
}`,
      codeLabel: 'CSS Variables & Theme System',
      keyPoints: [
        'Define on :root for global availability.',
        'Live in the browser — can be changed with JavaScript.',
        'Foundation for theme switching (dark/light mode).',
        'Use var(--name, fallback) for safe defaults.',
        'Reduces repetition and enables design token systems.'
      ]
    },
    {
      title: 'Specificity & Inheritance',
      content: `**Inheritance** means child elements inherit certain properties from their parents — primarily text-related properties like \`color\`, \`font-family\`, \`font-size\`, and \`line-height\`. Layout properties like \`margin\`, \`padding\`, and \`border\` are **NOT** inherited. You can force inheritance with the \`inherit\` keyword or reset with \`initial\`/\`unset\`.\n\n### Specificity Hierarchy\n\n**Specificity** determines which CSS rule wins when multiple rules target the same element. The specificity hierarchy (from highest to lowest): **Inline styles** (\`style="..."\`) = **1000** points. **ID selectors** (\`#id\`) = **100** points. **Class selectors** (\`.class\`), **attribute selectors** (\`[type="text"]\`), and **pseudo-classes** (\`:hover\`) = **10** points. **Element selectors** (\`p\`, \`div\`) and **pseudo-elements** (\`::before\`) = **1** point.\n\nExample: If \`p { color: red; }\` and \`.text { color: blue; }\` both target the same element, \`.text\` wins because class (10) beats element (1). A combined selector like \`#id .class\` has specificity **110**.\n\n### The !important Rule\n\n\`!important\` overrides all specificity calculations — but use it sparingly. It makes debugging extremely difficult because it breaks the natural cascade. If you find yourself using \`!important\` frequently, it is a sign that your selectors are too specific or poorly organized.`,
      image: '/images/css/css-specificity.svg',
      code: `/* Specificity examples */
p { color: red; }                  /* Specificity: 1 */
.text { color: blue; }            /* Specificity: 10 — WINS */
#title { color: green; }          /* Specificity: 100 */
p.text { color: purple; }         /* Specificity: 11 */
#title .text { color: orange; }   /* Specificity: 110 */

/* Inheritance */
body {
  color: #333;           /* Inherited by all children */
  font-family: Arial;    /* Inherited */
}
.card {
  margin: 20px;          /* NOT inherited */
  padding: 10px;         /* NOT inherited */
}

/* !important — use sparingly */
p { color: red !important; }  /* Overrides everything — avoid */`,
      codeLabel: 'Specificity & Inheritance',
      keyPoints: [
        'Specificity: inline (1000) > ID (100) > class (10) > element (1).',
        'Text properties are inherited; layout properties are not.',
        'Avoid !important — it breaks the natural cascade.',
        'More specific selectors override less specific ones.',
        'Use class selectors to keep specificity flat and manageable.'
      ]
    },
    {
      title: 'CSS Best Practices',
      content: `Consistent, well-organized CSS is essential for maintaining large projects. Without conventions, stylesheets quickly become unmaintainable *"spaghetti CSS"* where nobody knows what rules affect what elements.\n\n### Naming Methodology\n\nUse a naming methodology. **BEM** (Block__Element--Modifier) is popular: \`.card\`, \`.card__title\`, \`.card__button--disabled\`. This creates clear, predictable, collision-free class names. *Utility-first* frameworks like **Tailwind** take a different approach with many small, single-purpose classes.\n\n### CSS Organization\n\nOrganize your CSS logically: reset/normalize first, then **design tokens** (variables), global styles (\`body\`, typography), layout components, then specific UI components. Use comments to separate sections like \`/* Header Styles */\` for organization.\n\n### Selector Strategy\n\nAvoid deep nesting and overly specific selectors. A rule like \`div.container > ul.list > li.item > a.link\` is fragile — any HTML change breaks it. Prefer flat, class-based selectors: \`.nav-link\` is specific enough and resilient.\n\n### General Guidelines\n\nPrefer **mobile-first** responsive design. Use modern layout (**Flexbox**, **Grid**) instead of floats and absolute positioning hacks. Test in multiple browsers and screen sizes. Use browser **DevTools** to inspect and debug styles — they are your most powerful CSS tool. Always validate CSS using the [W3C CSS Validator](https://jigsaw.w3.org/css-validator/).`,
      keyPoints: [
        'Use a naming convention (BEM, utility-first, etc.).',
        'Organize styles: reset → tokens → globals → components.',
        'Keep selectors flat and class-based, avoid deep nesting.',
        'Mobile-first: base styles for small screens, enhance upward.',
        'Use browser DevTools to inspect and debug CSS.',
        'Avoid !important — it creates specificity nightmares.'
      ]
    }
  ]
};

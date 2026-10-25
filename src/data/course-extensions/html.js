/*
 * HTML course extension — extra sections and worked examples merged into
 * courses-data/html.js at load time (see src/data/mergeCourse.js).
 */
export default {
  examples: {
    'HTML Document Structure': [
      {
        title: 'Production-ready boilerplate',
        language: 'html',
        explanation: 'A minimal but complete starting point. Every line has a job: language for screen readers and translation, UTF-8 so all characters render, a viewport so mobile browsers do not zoom out, and `defer` so the script never blocks rendering.',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Page title — Site name</title>
  <meta name="description" content="One or two sentences shown in search results.">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/styles.css">
  <script src="/app.js" defer></script>
</head>
<body>
  <header>…</header>
  <main id="main">…</main>
  <footer>…</footer>
</body>
</html>`,
      },
    ],
    'Text Content & Headings': [
      {
        title: 'Inline text semantics',
        language: 'html',
        explanation: 'Pick elements for their **meaning**, not their default look — CSS controls appearance. `<strong>` means importance, `<em>` means stress emphasis, `<mark>` means relevance (e.g. a search hit).',
        code: `<p>
  <strong>Warning:</strong> deleting a project is <em>permanent</em>.
  Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.
  The <code>fetch()</code> API returns a <abbr title="JavaScript object representing a future value">Promise</abbr>.
  Results for <mark>flexbox</mark>.
  H<sub>2</sub>O and E = mc<sup>2</sup>.
  Price: <del>$49</del> <ins>$29</ins>
  Published <time datetime="2026-10-25">25 Oct 2026</time>.
</p>

<blockquote cite="https://www.w3.org/">
  <p>The power of the Web is in its universality.</p>
  <footer>— <cite>Tim Berners-Lee</cite></footer>
</blockquote>

<pre><code>const answer = 42;   // whitespace is preserved in &lt;pre&gt;</code></pre>`,
      },
    ],
    'Links & Navigation': [
      {
        title: 'Every kind of link',
        language: 'html',
        code: `<!-- Relative and absolute -->
<a href="/docs/getting-started">Docs</a>
<a href="https://developer.mozilla.org/">MDN</a>

<!-- Jump to a section on the same page (target needs id="faq") -->
<a href="#faq">FAQ</a>

<!-- New tab: always add rel="noopener noreferrer" -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">External ↗</a>

<!-- Email, phone, download -->
<a href="mailto:team@example.com?subject=Hello">Email us</a>
<a href="tel:+15551234567">Call</a>
<a href="/files/report.pdf" download="report-2026.pdf">Download PDF</a>

<!-- Navigation landmark with current page marked -->
<nav aria-label="Main">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/blog">Blog</a></li>
  </ul>
</nav>`,
      },
    ],
    'Images & Lists': [
      {
        title: 'Lists: ordered, nested, description',
        language: 'html',
        code: `<!-- Ordered list starting at 3, counting down -->
<ol start="3" reversed>
  <li>Bronze</li>
  <li>Silver</li>
  <li>Gold</li>
</ol>

<!-- Nested list: the inner <ul> goes INSIDE the <li> -->
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
  <li>Backend</li>
</ul>

<!-- Description list for term/definition pairs -->
<dl>
  <dt>HTML</dt>
  <dd>Structure of the page.</dd>
  <dt>CSS</dt>
  <dd>Presentation of the page.</dd>
</dl>`,
      },
      {
        title: 'Accessible images with captions',
        language: 'html',
        code: `<!-- Informative image: describe what it conveys -->
<img src="chart.png" alt="Sales grew 40% from Q1 to Q4" width="640" height="360">

<!-- Decorative image: empty alt so screen readers skip it -->
<img src="divider.svg" alt="">

<!-- Image with a visible caption -->
<figure>
  <img src="team.jpg" alt="Five developers around a whiteboard" loading="lazy">
  <figcaption>Sprint planning, March 2026</figcaption>
</figure>`,
      },
    ],
    'Tables': [
      {
        title: 'Accessible data table',
        language: 'html',
        explanation: 'Use `<caption>` for the title, `<thead>/<tbody>/<tfoot>` for groups, and `scope` on header cells so assistive technology can announce “Revenue, Q2: 1,400”.',
        code: `<table>
  <caption>Quarterly revenue (USD)</caption>
  <thead>
    <tr>
      <th scope="col">Region</th>
      <th scope="col">Q1</th>
      <th scope="col">Q2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">North</th>
      <td>1,200</td>
      <td>1,400</td>
    </tr>
    <tr>
      <th scope="row">South</th>
      <td>900</td>
      <td>1,100</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td>2,100</td>
      <td>2,500</td>
    </tr>
  </tfoot>
</table>`,
      },
      {
        title: 'Merging cells with colspan / rowspan',
        language: 'html',
        code: `<table border="1">
  <tr>
    <th rowspan="2">Name</th>
    <th colspan="2">Contact</th>   <!-- spans two columns -->
  </tr>
  <tr>
    <th>Email</th>
    <th>Phone</th>
  </tr>
  <tr>
    <td>Ada</td>
    <td>ada@example.com</td>
    <td>555-0100</td>
  </tr>
</table>`,
      },
    ],
    'Forms & Input Elements': [
      {
        title: 'Grouped form with built-in validation',
        language: 'html',
        explanation: 'Native attributes (`required`, `type="email"`, `pattern`, `min`/`max`) give you validation and the right mobile keyboard for free. Always connect labels with `for`/`id`.',
        code: `<form action="/register" method="post">
  <fieldset>
    <legend>Account</legend>

    <label for="email">Email</label>
    <input id="email" name="email" type="email" required autocomplete="email">

    <label for="pwd">Password (min 8 chars)</label>
    <input id="pwd" name="password" type="password" minlength="8" required autocomplete="new-password">

    <label for="zip">ZIP code</label>
    <input id="zip" name="zip" inputmode="numeric" pattern="[0-9]{5}" title="5 digits">
  </fieldset>

  <fieldset>
    <legend>Plan</legend>
    <label><input type="radio" name="plan" value="free" checked> Free</label>
    <label><input type="radio" name="plan" value="pro"> Pro</label>
  </fieldset>

  <label><input type="checkbox" name="terms" required> I accept the terms</label>

  <button type="submit">Create account</button>
</form>`,
      },
      {
        title: 'Input types cheat sheet',
        language: 'html',
        code: `<input type="text" placeholder="Free text">
<input type="search" placeholder="Search…">
<input type="number" min="1" max="10" step="1">
<input type="range" min="0" max="100" value="50">
<input type="date">
<input type="time">
<input type="datetime-local">
<input type="color" value="#0047ab">
<input type="file" accept="image/*" multiple>
<input type="url" placeholder="https://">
<input type="tel" placeholder="Phone">

<label for="lang">Language</label>
<input id="lang" list="langs">
<datalist id="langs">
  <option value="JavaScript"><option value="Python"><option value="Java">
</datalist>

<textarea rows="4" maxlength="500"></textarea>

<select name="country">
  <optgroup label="Europe">
    <option>France</option><option>Germany</option>
  </optgroup>
</select>`,
      },
    ],
    'Semantic HTML5 Elements': [
      {
        title: 'Blog post page skeleton',
        language: 'html',
        code: `<body>
  <header>
    <a href="/" class="logo">DevBlog</a>
    <nav aria-label="Main">…</nav>
  </header>

  <main>
    <article>
      <header>
        <h1>Understanding the Event Loop</h1>
        <p>By <a href="/authors/ada">Ada</a> · <time datetime="2026-10-01">1 Oct 2026</time></p>
      </header>

      <section>
        <h2>The call stack</h2>
        <p>…</p>
      </section>

      <aside>
        <h2>Related</h2>
        <ul><li><a href="/promises">Promises</a></li></ul>
      </aside>
    </article>
  </main>

  <footer>
    <p>&copy; 2026 DevBlog</p>
  </footer>
</body>`,
      },
    ],
    'Multimedia Elements': [
      {
        title: 'Video with captions and fallbacks',
        language: 'html',
        code: `<video controls width="640" poster="poster.jpg" preload="metadata">
  <source src="intro.webm" type="video/webm">
  <source src="intro.mp4" type="video/mp4">
  <track kind="captions" src="intro.en.vtt" srclang="en" label="English" default>
  Your browser does not support video. <a href="intro.mp4">Download it</a>.
</video>

<!-- Background-style video: must be muted to autoplay -->
<video autoplay muted loop playsinline src="hero.mp4"></video>

<audio controls>
  <source src="podcast.ogg" type="audio/ogg">
  <source src="podcast.mp3" type="audio/mpeg">
</audio>`,
      },
    ],
    'ARIA & Accessibility': [
      {
        title: 'Accessible disclosure button',
        language: 'html',
        explanation: 'Prefer native elements first. When you must build a custom widget, expose its **state** (`aria-expanded`) and **relationship** (`aria-controls`) and keep it keyboard operable — a real `<button>` gives you Enter/Space and focus for free.',
        code: `<button type="button" aria-expanded="false" aria-controls="menu" id="menu-btn">
  Menu
</button>
<ul id="menu" hidden>
  <li><a href="/profile">Profile</a></li>
  <li><a href="/logout">Log out</a></li>
</ul>

<script>
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
  });
</script>

<!-- Live region: announced by screen readers when its text changes -->
<p role="status" aria-live="polite" id="save-status"></p>`,
      },
    ],
  },

  sections: [
    {
      title: 'Head, Meta Tags & SEO',
      after: 'HTML Document Structure',
      content: `Everything inside \`<head>\` is **metadata** — information *about* the page rather than visible content. It controls how the page is encoded, scaled on mobile, indexed by search engines and previewed when shared on social media.

### Essential meta tags

| Tag | Purpose |
|---|---|
| \`<meta charset="UTF-8">\` | Character encoding — must be in the first 1024 bytes |
| \`<meta name="viewport" content="width=device-width, initial-scale=1">\` | Responsive layout on mobile |
| \`<title>\` | Browser tab text and the headline in search results (≈ 50–60 chars) |
| \`<meta name="description">\` | Search result snippet (≈ 150–160 chars) |
| \`<link rel="canonical">\` | The preferred URL when the same content exists at several URLs |
| \`<meta name="robots" content="noindex">\` | Keep a page out of search results |

### Social previews (Open Graph)

Platforms such as LinkedIn, Slack and Facebook read **Open Graph** tags (\`og:title\`, \`og:description\`, \`og:image\`) to build link previews; X/Twitter also reads \`twitter:card\`.

### Structured data

**JSON-LD** in a \`<script type="application/ld+json">\` tag describes the page (article, product, FAQ…) in a machine-readable way so search engines can show rich results.

> Tip: a unique, descriptive \`<title>\` per page is the single most valuable on-page SEO element.`,
      code: `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CSS Grid Guide — QuickDevGuide</title>
  <meta name="description" content="Learn CSS Grid with short explanations and copy-ready examples.">
  <link rel="canonical" href="https://example.com/css/grid">

  <!-- Open Graph / social preview -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="CSS Grid Guide">
  <meta property="og:description" content="Copy-ready CSS Grid examples.">
  <meta property="og:image" content="https://example.com/og/grid.png">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Theme colour for mobile browser UI -->
  <meta name="theme-color" content="#0047ab">

  <!-- Structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "CSS Grid Guide",
    "author": { "@type": "Person", "name": "Ada" }
  }
  </script>
</head>`,
      codeLabel: 'Complete <head> for a content page',
      keyPoints: [
        'charset and viewport are mandatory for every modern page.',
        'Each page needs a unique <title> and meta description.',
        'Open Graph tags control link previews on social platforms.',
        'Use rel="canonical" to avoid duplicate-content issues.',
        'JSON-LD structured data enables rich search results.',
      ],
    },
    {
      title: 'Responsive Images',
      after: 'Images & Lists',
      content: `A single large image wastes bandwidth on phones; a small one looks blurry on high-density screens. HTML has two tools to let the **browser pick the best file**.

### \`srcset\` + \`sizes\` — same image, different resolutions

\`srcset\` lists candidate files with their widths (\`800w\`). \`sizes\` tells the browser how wide the image will be displayed at each breakpoint. The browser then downloads the smallest file that still looks sharp on that device.

### \`<picture>\` — different images or formats

Use \`<picture>\` for **art direction** (a tighter crop on mobile) or for **modern formats** (AVIF/WebP) with a JPEG fallback. The browser uses the first \`<source>\` it supports; the inner \`<img>\` is required and provides \`alt\` and the fallback.

### Performance attributes

| Attribute | Effect |
|---|---|
| \`width\` / \`height\` | Reserves space → prevents layout shift (CLS) |
| \`loading="lazy"\` | Defers off-screen images |
| \`decoding="async"\` | Decodes without blocking the main thread |
| \`fetchpriority="high"\` | Prioritises the hero/LCP image |

> Never lazy-load the main above-the-fold image — it delays Largest Contentful Paint.`,
      code: `<!-- Resolution switching -->
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1600.jpg 1600w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Mountain lake at sunrise"
  width="800" height="533"
  loading="lazy" decoding="async">

<!-- Modern formats with fallback -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Product dashboard" width="1200" height="600" fetchpriority="high">
</picture>

<!-- Art direction: different crop on small screens -->
<picture>
  <source media="(max-width: 600px)" srcset="banner-square.jpg">
  <img src="banner-wide.jpg" alt="Team photo">
</picture>`,
      codeLabel: 'srcset, sizes and <picture>',
      keyPoints: [
        'srcset + sizes let the browser choose the right resolution.',
        '<picture> handles art direction and AVIF/WebP fallbacks.',
        'Always set width and height to avoid layout shift.',
        'Lazy-load below-the-fold images, never the hero image.',
      ],
    },
    {
      title: 'Native Interactive Elements',
      after: 'Forms & Input Elements',
      content: `Modern HTML ships interactive components that used to require JavaScript libraries. They are **accessible and keyboard-friendly by default**.

### \`<details>\` and \`<summary>\`

A collapsible disclosure widget — perfect for FAQs. Add the \`open\` attribute to start expanded. Giving several \`<details>\` the same \`name\` makes them an **exclusive accordion** (only one open at a time).

### \`<dialog>\`

A modal or non-modal dialog. \`showModal()\` traps focus, adds a backdrop (style it with \`::backdrop\`) and closes on **Esc**. A \`<form method="dialog">\` inside closes the dialog and sets \`returnValue\` to the clicked button's value.

### Popover API

Any element with the \`popover\` attribute becomes a light-dismiss popup (closes on outside click / Esc) controlled declaratively by \`popovertarget\` — no JavaScript needed.

### Progress and meter

\`<progress>\` shows task completion; \`<meter>\` shows a measurement within a known range (disk usage, password strength).`,
      code: `<!-- Accordion (only one open at a time) -->
<details name="faq" open>
  <summary>What is HTML?</summary>
  <p>The markup language that structures web content.</p>
</details>
<details name="faq">
  <summary>Is HTML a programming language?</summary>
  <p>No — it has no logic, loops or variables.</p>
</details>

<!-- Modal dialog -->
<button onclick="document.getElementById('confirm').showModal()">Delete…</button>
<dialog id="confirm">
  <form method="dialog">
    <p>Delete this file permanently?</p>
    <button value="cancel">Cancel</button>
    <button value="delete">Delete</button>
  </form>
</dialog>

<!-- Popover without JavaScript -->
<button popovertarget="help">Help</button>
<div id="help" popover>Press Ctrl + K to search.</div>

<progress value="70" max="100">70%</progress>
<meter value="0.8" low="0.3" high="0.7" optimum="0.2">80% disk used</meter>`,
      codeLabel: 'details, dialog, popover, progress & meter',
      examples: [
        {
          title: 'Dialog: read the result',
          language: 'html',
          code: `<button id="open">Rename file</button>
<p id="out"></p>

<dialog id="dlg">
  <form method="dialog">
    <label>New name <input name="name" value="report.pdf"></label>
    <menu>
      <button value="cancel" formnovalidate>Cancel</button>
      <button value="ok">Save</button>
    </menu>
  </form>
</dialog>

<script>
  const dlg = document.getElementById('dlg');
  document.getElementById('open').onclick = () => dlg.showModal();
  dlg.addEventListener('close', () => {
    const name = dlg.querySelector('input').value;
    document.getElementById('out').textContent =
      dlg.returnValue === 'ok' ? 'Renamed to ' + name : 'Cancelled';
  });
</script>`,
        },
      ],
      keyPoints: [
        '<details>/<summary> give you collapsible sections with zero JavaScript.',
        'dialog.showModal() provides focus trapping, a backdrop and Esc-to-close.',
        'The popover attribute creates light-dismiss popups declaratively.',
        'Native elements are accessible by default — prefer them over custom widgets.',
      ],
    },
    {
      title: 'Scripts, Resource Hints & Performance',
      after: 'HTML5 APIs & Data Attributes',
      content: `How you load scripts, styles and fonts in HTML has a huge impact on how fast a page appears.

### Script loading

| Attribute | Download | Executes | Order kept? | Use for |
|---|---|---|---|---|
| *(none)* | blocks parsing | immediately | yes | almost never |
| \`async\` | in parallel | as soon as downloaded | **no** | independent scripts (analytics) |
| \`defer\` | in parallel | after HTML is parsed | **yes** | your app code |
| \`type="module"\` | in parallel | deferred by default | yes | ES modules |

### Resource hints

- \`preconnect\` — open the connection to another origin early (fonts, CDN, API).
- \`preload\` — fetch a critical resource needed soon (a font, the hero image).
- \`prefetch\` — low-priority fetch of something the **next** page will need.
- \`dns-prefetch\` — resolve a domain name ahead of time (cheap fallback for preconnect).

### Other quick wins

Put CSS in the \`<head>\`, keep critical CSS small, add \`width\`/\`height\` to media, and use \`font-display: swap\` so text stays visible while web fonts load.`,
      code: `<head>
  <!-- Connect early to third-party origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Critical resources for this page -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/img/hero.avif" as="image" fetchpriority="high">

  <link rel="stylesheet" href="/css/main.css">

  <!-- App code: parallel download, runs in order after parsing -->
  <script src="/js/vendor.js" defer></script>
  <script src="/js/app.js" defer></script>

  <!-- Independent third-party script -->
  <script src="https://analytics.example.com/a.js" async></script>

  <!-- Likely next navigation -->
  <link rel="prefetch" href="/checkout">
</head>`,
      codeLabel: 'Optimised <head> loading strategy',
      keyPoints: [
        'Use defer for application scripts; async only for independent ones.',
        'Module scripts are deferred automatically.',
        'preconnect and preload shorten the critical path for key resources.',
        'prefetch warms the cache for the next likely page.',
      ],
    },
  ],
};

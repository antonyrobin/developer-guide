export const htmlCourse = {
  id: 'html',
  title: 'HTML',
  description: 'HyperText Markup Language — the foundation of every web page.',
  officialDocs: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  tutorialLink: 'https://www.w3schools.com/html/',
  exerciseLink: 'https://www.w3schools.com/html/html_exercises.asp',
  sections: [
    {
      title: 'What is HTML',
      content: `HTML stands for HyperText Markup Language. It is the standard markup language used to create and structure content on web pages. HTML uses tags to define elements like headings, paragraphs, links, images, and more. It is not a programming language — it does not have logic, loops, or variables. Instead, it tells the browser what content to display and how to structure it.\n\nHTML forms the backbone of every website on the internet. Without it, web content would be plain text without structure or interactivity. Browsers like Chrome or Firefox parse HTML to display pages using the Document Object Model (DOM) — a tree-like representation that JavaScript can manipulate dynamically. CSS handles how it looks, JavaScript handles how it behaves, but HTML handles what is there.\n\nHTML was created by Tim Berners-Lee in 1991. The current version, HTML5, was standardized in 2014 and introduced powerful features like semantic elements, multimedia support (<video>, <audio>), form validation, and APIs for local storage and geolocation.\n\nReal-World Example: E-commerce sites like Amazon use HTML to structure product listings, images, and buy buttons, making the site navigable and user-friendly.`,
      image: '/images/html/html-structure-diagram.jpeg',
      keyPoints: [
        'HTML defines the structure and content of web pages.',
        'It is a markup language, not a programming language.',
        'HTML5 is the current standard (since 2014).',
        'The browser converts HTML into a DOM tree for rendering.',
        'Every website — from Google to Netflix — is built on HTML.'
      ]
    },
    {
      title: 'HTML Document Structure',
      content: `Every HTML page follows a standard structure to ensure proper rendering. Understanding this structure is essential before writing any content.\n\nThe <!DOCTYPE html> declaration must be the very first line. It declares the document type as HTML5 and tells the browser to use modern standards mode, avoiding quirks from older versions. Omitting it can lead to rendering issues.\n\nThe <html> element is the root element that encapsulates the entire document. The lang="en" attribute specifies the language, aiding accessibility and search engines.\n\nInside <html>, there are exactly two children: <head> and <body>. The <head> contains metadata not visible on the page — this includes the <title> (displays in the browser tab, crucial for bookmarks and search results — keep under 60 characters for SEO), <meta> tags (character encoding, viewport, description), <link> tags (CSS stylesheets), and <script> tags.\n\nThe <body> holds all visible content. Everything users see — text, images, forms — goes here.\n\nCommon Pitfall: Forgetting to close tags can cause parsing errors. Always validate your HTML.`,
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="A quick guide to HTML">
  <title>My Web Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Welcome to My Site</h1>
  </header>
  <main>
    <p>This is the main content area.</p>
  </main>
  <footer>
    <p>&copy; 2026 My Site</p>
  </footer>
</body>
</html>`,
      codeLabel: 'Complete HTML5 Boilerplate',
      keyPoints: [
        '<!DOCTYPE html> triggers standards mode rendering.',
        '<head> contains metadata, <body> contains visible content.',
        'The lang attribute improves accessibility and SEO.',
        'Every page needs a <title> for the browser tab (under 60 chars for SEO).',
        'Always close tags properly to avoid parsing errors.'
      ]
    },
    {
      title: 'Tags, Elements & Attributes',
      content: `Tags are the building blocks of HTML, enclosed in angle brackets (e.g., <p>). An HTML Tag is the syntax used to mark the start or end of an element (e.g., <h1> and </h1>). An HTML Element is the complete unit: the start tag, the content inside, and the end tag (e.g., <h1>Welcome</h1>). Some tags are self-closing, like <img />. Tags can be nested, but they must be properly closed in the reverse order — no crossing.\n\nAttributes provide additional information to elements, placed in the opening tag as name="value" pairs. The Attribute Name is the property you want to set (e.g., href, src, style). The Attribute Value is the specific setting (always wrapped in quotes).\n\nCommon attributes: id (unique identifier), class (for CSS/JS grouping), style (inline CSS — use sparingly), title (tooltip on hover), lang, and data-* (custom data attributes). Element-specific attributes include href for <a>, src and alt for <img>, and width/height for media elements.\n\nHTML is case-insensitive for tags, but lowercase is conventional for readability.`,
      code: `<!-- HTML Tags vs Elements -->
<h1>This is a heading element.</h1>
<!--  ^tag        content       ^tag -->

<p>A paragraph with <strong>bold text</strong>.</p>

<!-- Attributes provide additional info -->
<a href="https://www.google.com" target="_blank">Click Here</a>
<!--  ^tag  ^attribute name       ^attribute      ^content  -->

<!-- Common attributes -->
<div id="unique" class="container">
  <p class="highlight" style="color: blue;">Styled text</p>
  <img src="photo.jpg" alt="Description" width="300" height="200">
  <abbr title="HyperText Markup Language">HTML</abbr>
</div>`,
      codeLabel: 'Tags, Elements & Attributes',
      keyPoints: [
        'Tag = syntax in angle brackets. Element = tag + content + closing tag.',
        'Attributes are name="value" pairs in the opening tag.',
        'id must be unique; class can be shared across elements.',
        'Always use lowercase tags and quote attribute values.',
        'Self-closing tags like <img /> do not need a closing tag.'
      ]
    },
    {
      title: 'Text Content & Headings',
      content: `Text Content refers to the actual words and characters displayed on the screen, tucked between opening and closing tags. HTML offers six heading levels for hierarchy: <h1> through <h6>. Use headings semantically — <h1> for the page's main topic, not just for size (use CSS for styling). This improves SEO and accessibility.\n\nA blog might use <h1> for the article title, <h2> for sections, and <h3> for subsections. Never skip heading levels (e.g., going from <h1> directly to <h4>). Screen readers use headings to navigate, and search engines use them to understand page structure.\n\nThe <p> tag creates a paragraph block — a block-level element that takes up full width and automatically adds space before and after. Use <br> for manual line breaks without creating a new paragraph, but overusing <br> for spacing is bad practice — use CSS margins instead.\n\nFor emphasis: <strong> for important text (bold, carries semantic meaning) and <em> for emphasized text (italic, semantic). The older <b> and <i> tags are purely visual. Other useful elements: <blockquote> for quoted passages, <code> for inline code, <pre> for preformatted text, <mark> for highlighted text, and <small> for fine print.`,
      image: '/images/html/html-headings-example.png',
      code: `<h1>Main Title (only one per page)</h1>
<h2>Section Heading</h2>
<h3>Sub-section Heading</h3>
<h4>Sub-subsection</h4>

<p>This is a paragraph with <strong>important</strong>
and <em>emphasized</em> text.</p>

<p>Line one<br>Line two (manual break).</p>

<blockquote cite="https://example.com">
  "The web is for everyone." — Tim Berners-Lee
</blockquote>

<p>Use <code>console.log()</code> to debug.</p>
<p><mark>Highlighted</mark> and <small>fine print</small>.</p>`,
      codeLabel: 'Text & Heading Examples',
      keyPoints: [
        'Use only one <h1> per page for SEO.',
        'Never skip heading levels (h1 → h2 → h3).',
        '<strong> and <em> carry semantic meaning; <b> and <i> are visual only.',
        'Avoid <br> for spacing — use CSS margins instead.',
        'Paragraphs are block-level and take full width.'
      ]
    },
    {
      title: 'Div, Span & Block vs Inline',
      content: `In HTML, <div> and <span> are generic containers. They don't have inherent meaning (like <p> or <h1>), but they are essential for grouping content to apply styles or layout structures using CSS.\n\n<div> is a Block-level element — think of it as a "box" that takes up the full width of the page. It always starts on a new line and pushes following elements below. Use Case: Creating layouts, sections, or wrapping large groups of elements (header, sidebar, gallery).\n\n<span> is an Inline element — think of it as a "marker" that only wraps as much width as the text inside. It does not start on a new line and sits right next to other elements. Use Case: Styling a specific word or phrase inside a paragraph.\n\nBlock elements are the "bricks" of your webpage — they always start on a new line, stretch to fill 100% width, and you can freely set width, height, padding, and margin. They can contain other block or inline elements (e.g., <div>, <p>, <h1>).\n\nInline elements are like "words" in a sentence — they stay on the same line, take up only as much width as their content, and you cannot set width or height on them. Vertical margin and padding behave unexpectedly. They should only contain other inline elements (e.g., <span>, <a>, <strong>).`,
      code: `<!-- Block element: <div> -->
<div class="container">
  <h2>This starts a new line</h2>
  <p>Block elements take full width.</p>
</div>

<!-- Inline element: <span> -->
<p>This has an <span class="highlight">important</span> word.</p>

<!-- Block vs Inline behavior -->
<div style="background: lightblue;">
  I am a BLOCK — I take full width.
</div>
<span style="background: lightyellow;">
  I am INLINE — only as wide as my content.
</span>
<span style="background: lightgreen;">
  I sit next to the span above.
</span>`,
      codeLabel: 'Block vs Inline Elements',
      keyPoints: [
        '<div> is block-level (full width, new line). <span> is inline (content width).',
        'Block elements can contain block and inline elements.',
        'Inline elements should only contain other inline elements.',
        'You cannot set width/height on inline elements — use display: inline-block.',
        'Use <div> for layout structure, <span> for inline styling.'
      ]
    },
    {
      title: 'Links & Navigation',
      content: `In web design, links and navigation are the "connective tissue" that turns a collection of isolated pages into a functional website. The fundamental building block is the anchor tag <a> — by default an inline element.\n\nSyntax: <a href="URL">Click Me</a>. Key attributes: href (destination URL), target="_blank" (opens in new tab), title (tooltip on hover). When using target="_blank", always add rel="noopener noreferrer" for security to prevent "tabnapping."\n\nLinks can be absolute (full URL: https://google.com) or relative (path within your site: /about.html). Relative links are preferred for internal navigation. Fragment links (href="#section-id") scroll to matching elements on the same page. Tel links (href="tel:+1234567890") and email links (href="mailto:name@example.com") trigger phone calls and email clients.\n\nFor professional navigation bars, wrap links in a <ul>/<li> list inside a <nav> container. Then use CSS: list-style: none to remove bullets, display: flex on <ul> for horizontal alignment, and display: block on <a> tags to make the entire button area clickable.\n\nNavigation Best Practices: Keep the menu in the same place on every page (Consistency). Use simple labels like "Contact" not "Reach Out" (Clarity). Use :hover and :active CSS states for feedback. Use dropdowns for complex sites (Hierarchy).`,
      image: '/images/html/html-hyperlink-example.jpeg',
      code: `<!-- External link (new tab, secure) -->
<a href="https://developer.mozilla.org"
   target="_blank"
   rel="noopener noreferrer">
  MDN Web Docs
</a>

<!-- Navigation bar structure -->
<nav>
  <ul style="list-style: none; display: flex;">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>

<!-- Fragment link (same page) -->
<a href="#features">Jump to Features</a>
<section id="features">...</section>

<!-- Special links -->
<a href="tel:+1234567890">Call Us</a>
<a href="mailto:info@example.com">Email Us</a>`,
      codeLabel: 'Links & Navigation Examples',
      keyPoints: [
        'Always use rel="noopener noreferrer" with target="_blank".',
        'Prefer relative links for internal navigation.',
        'Wrap nav links in <nav> > <ul> > <li> > <a> for accessibility.',
        'Fragment links (#id) enable same-page scrolling.',
        'Keep navigation consistent, clear, and simple across pages.'
      ]
    },
    {
      title: 'Images & Lists',
      content: `The <img> tag embeds an image — it is self-closing (no </img> needed). Key attributes: src (image path), alt (alternative text for accessibility and SEO), width/height (dimensions). Best Practice: Always include alt to avoid accessibility issues. For decorative images, use alt="".\n\nFor professional semantic structure, use the <figure> element to group images with captions: <figure> wraps the <img>, and <figcaption> provides the caption.\n\nLists organize items in HTML. Unordered Lists (<ul>) are for items where sequence doesn't matter — they default to bullet points. Common uses: navigation menus, feature lists, shopping lists. Ordered Lists (<ol>) are for sequential items — they default to numbers. You can use type="a" for letters, type="i" for Roman numerals, or reversed to count down.\n\nNesting Lists: You can put a list inside another list item (<li>). This is how dropdown menus and complex outlines are built. Crucial Rule: When nesting, the new list must go inside the <li> tag of the parent, not between them. Correct: <li>Fruit <ul>...</ul></li>. Incorrect: <li>Fruit</li> <ul>...</ul>.`,
      image: '/images/html/html-lists-example.jpeg',
      code: `<!-- Basic image with alt text -->
<img src="photo.jpg" alt="A sunset over the mountains" width="800">

<!-- Figure with caption -->
<figure>
  <img src="mountains.jpg" alt="Snowy peaks at sunrise">
  <figcaption>The Alps at 6:00 AM.</figcaption>
</figure>

<!-- Unordered list -->
<ul>
  <li>Apples</li>
  <li>Oranges</li>
  <li>Bananas
    <ul><li>Yellow</li><li>Green</li></ul>
  </li>
</ul>

<!-- Ordered list with type -->
<ol type="A">
  <li>Step One</li>
  <li>Step Two</li>
</ol>

<!-- HTML Comments -->
<!-- This comment is invisible in the browser -->`,
      codeLabel: 'Images, Lists & Comments',
      keyPoints: [
        'Always provide meaningful alt text for images.',
        'Use <figure> and <figcaption> for captioned media.',
        '<ul> for unordered, <ol> for ordered lists.',
        'When nesting, new list must go inside <li>, not between them.',
        'HTML comments use <!-- ... --> syntax and are invisible in browser.'
      ]
    },
    {
      title: 'Tables',
      content: `Tables in HTML are used to organize complex data into a grid of rows and columns. While they were used for page layouts in the 1990s, today they should only be used for tabular data (like spreadsheets, schedules, or pricing grids).\n\nThe core table structure is built "row by row": <table> is the wrapper for the entire table, <tr> (Table Row) defines a horizontal row, <th> (Table Header) defines a header cell (bold and centered by default), and <td> (Table Data) defines a standard content cell.\n\nFor proper structure, use <thead> for header rows, <tbody> for data rows, and <tfoot> for footer rows. The <caption> element provides a title for the table.\n\nFor accessibility, use the scope attribute on <th> to specify whether it heads a column (scope="col") or a row (scope="row"). Screen readers rely on this to navigate table data properly.\n\nThe colspan and rowspan attributes allow cells to span multiple columns or rows, creating merged cells for complex layouts.`,
      image: '/images/html/html-table-example.png',
      code: `<table>
  <caption>Monthly Sales Report</caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Sales</th>
      <th scope="col">Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">January</th>
      <td>$1,000</td>
      <td>+12%</td>
    </tr>
    <tr>
      <th scope="row">February</th>
      <td>$1,500</td>
      <td>+50%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td colspan="2">$2,500</td>
    </tr>
  </tfoot>
</table>`,
      codeLabel: 'Accessible Table Example',
      keyPoints: [
        'Use tables only for tabular data, never for page layout.',
        '<table> > <thead>/<tbody>/<tfoot> > <tr> > <th>/<td>.',
        'Add scope attribute to <th> for screen reader accessibility.',
        'Use <caption> to provide a table title.',
        'colspan and rowspan merge cells across columns or rows.'
      ]
    },
    {
      title: 'Forms & Input Elements',
      content: `Forms are the primary way users interact with a website, allowing them to send data — searches, logins, contact info — to a server. The <form> tag acts as a container with two critical attributes: action (the URL where data is sent) and method (how data is sent — GET appends to URL for searches, POST hides in request body for passwords/private info).\n\nCommon form elements: <input type="text"> for single-line text, <input type="password"> to mask characters, <input type="checkbox"> for multiple selections, <input type="radio"> for single selection from a group (must share the same name), <textarea> for multi-line text, and <select> with <option> tags for dropdown menus.\n\nEach input needs a <label> linked via the for/id pair — this improves usability (clicking label focuses input) and is essential for screen readers. HTML5 provides declarative validation: required (prevents empty submission), placeholder (hint text), minlength/maxlength (character limits), and pattern (regex validation — e.g., pattern="[0-9]{3}" for 3 digits).\n\nAdvanced input types: email (checks for @), date (calendar picker), range (slider with min/max), color (color picker), tel (numeric keypad on mobile). The <datalist> element creates a "combo box" — users can type to filter suggestions. Use <fieldset> and <legend> to group related fields, and <output> for real-time calculation results.`,
      image: '/images/html/html-form-example.webp',
      code: `<form action="/api/register" method="POST">
  <fieldset>
    <legend>Account Details</legend>

    <label for="name">Full Name</label>
    <input type="text" id="name" name="name" required minlength="2">

    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>

    <label for="password">Password</label>
    <input type="password" id="password" name="password"
           required minlength="8">

    <label for="phone">Phone</label>
    <input type="tel" id="phone" pattern="[0-9]{10}"
           placeholder="10-digit number">

    <label for="role">Role</label>
    <select id="role" name="role">
      <option value="dev">Developer</option>
      <option value="design">Designer</option>
    </select>

    <!-- Datalist for suggestions -->
    <label for="browser">Browser</label>
    <input list="browsers" id="browser" name="browser">
    <datalist id="browsers">
      <option value="Chrome">
      <option value="Firefox">
      <option value="Safari">
    </datalist>

    <button type="submit">Register</button>
  </fieldset>
</form>`,
      codeLabel: 'Complete Form with Validation',
      keyPoints: [
        'Every <input> needs a <label> for accessibility.',
        'GET for searches (data in URL), POST for sensitive data (in body).',
        'HTML5 validation: required, pattern, minlength — no JS needed.',
        '<datalist> creates a combo box with filterable suggestions.',
        'Use <fieldset> and <legend> to group related fields.'
      ]
    },
    {
      title: 'Semantic HTML5 Elements',
      content: `Semantic elements solve the problem of meaningless <div> soup by using tags that clearly describe their meaning. They behave exactly like a <div> (block-level), but carry extra information for search engines and screen readers.\n\n<header> — Contains introductory content, the logo, and navigation.\n<nav> — Reserved specifically for the main navigation links.\n<main> — Holds the unique, central content of the page. Only one <main> per page.\n<article> — A self-contained piece of content that could make sense on its own (blog post, forum post, news story).\n<section> — Groups related content together (e.g., "Features" or "About Us").\n<aside> — Content indirectly related to the main piece (sidebar, pull-quotes, advertising).\n<footer> — The bottom of the page containing copyright info, contact links, or site maps.\n\nSemantic vs. Non-Semantic: Instead of <div id="header">, use <header>. Instead of <div class="nav">, use <nav>. Instead of <div class="post">, use <article>. Benefits: Better SEO (search engines understand structure), accessibility (screen readers navigate by landmarks), and maintainability (self-documenting code).\n\nOther semantic elements include <time> (specific dates/times), <address> (contact information), <details> and <summary> (collapsible content), and <dialog> (modal windows).`,
      image: '/images/html/html-semantic-elements.jpeg',
      code: `<body>
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/blog">Blog</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h1>Understanding Semantic HTML</h1>
        <time datetime="2026-03-15">March 15, 2026</time>
      </header>
      <section>
        <h2>Benefits of Semantic Markup</h2>
        <p>Semantic HTML improves accessibility...</p>
      </section>
      <aside>
        <h3>Related Articles</h3>
        <ul><li><a href="/css-guide">CSS Guide</a></li></ul>
      </aside>
    </article>
  </main>

  <footer>
    <address>
      Contact: <a href="mailto:info@example.com">info@example.com</a>
    </address>
  </footer>
</body>`,
      codeLabel: 'Semantic Page Layout',
      keyPoints: [
        'Use semantic elements instead of generic <div> tags.',
        '<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>.',
        'Improves accessibility — screen readers navigate by landmarks.',
        'Helps search engines understand page structure (SEO).',
        'Only one <main> element per page.'
      ]
    },
    {
      title: 'Multimedia Elements',
      content: `Multimedia combines different content forms to deliver a dynamic, engaging experience. HTML5 introduced native multimedia support — no plugins needed.\n\nAudio adds depth and emotion. It can be broken into: Speech/Voiceover (narration and communication), Music (mood and pace), and Sound Effects (feedback like a "click" on button press). The <audio> element supports attributes: controls (player UI), autoplay (auto-play), and loop. Provide multiple <source> tags for cross-browser compatibility.\n\nVideo is the most powerful multimedia element — it combines text, audio, images, and movement. The <video> element uses: controls for play/pause/volume, poster for a preview image before playback, and width/height for dimensions. The <track> element adds subtitles via .vtt files for accessibility.\n\nThe <figure> and <figcaption> elements semantically group any media with captions. For responsive multimedia, use srcset on images to provide multiple sizes — the browser automatically selects the best version. The <picture> element provides Art Direction — showing different images for different screen sizes (e.g., vertical crop for mobile, wide shot for desktop).`,
      image: '/images/html/html-audio-player.png',
      code: `<!-- Audio with multiple sources -->
<audio controls>
  <source src="song.mp3" type="audio/mpeg">
  <source src="song.ogg" type="audio/ogg">
  Your browser does not support audio.
</audio>

<!-- Video with subtitles and poster -->
<video width="640" height="360" controls poster="thumbnail.jpg">
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.webm" type="video/webm">
  <track src="subtitles.vtt" kind="subtitles"
         srclang="en" label="English">
  Your browser does not support video.
</video>

<!-- Responsive images with srcset -->
<img src="small.jpg"
     srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 600px) 480px, (max-width: 900px) 768px, 1200px"
     alt="Responsive photo">

<!-- Art direction with <picture> -->
<picture>
  <source media="(min-width: 800px)" srcset="desktop-hero.jpg">
  <source media="(min-width: 450px)" srcset="tablet-hero.jpg">
  <img src="mobile-hero.jpg" alt="Hero banner">
</picture>`,
      codeLabel: 'Multimedia & Responsive Media',
      keyPoints: [
        '<audio> and <video> replaced Flash for native multimedia.',
        'Use multiple <source> tags for cross-browser compatibility.',
        'poster attribute provides preview image before video playback.',
        '<track> adds subtitles/captions for video accessibility.',
        'Use srcset for responsive images, <picture> for art direction.'
      ]
    },
    {
      title: 'Iframes & Embedding',
      content: `An <iframe> (Inline Frame) is like a window cut into your webpage that looks at another website. It allows you to embed external content — YouTube videos, Google Maps, third-party widgets — without the user leaving your domain.\n\nSecurity is the biggest concern since you're running someone else's code inside your site. The sandbox attribute is your primary defense — it applies restrictions to embedded content. Options include: allow-scripts (re-enables JavaScript), allow-forms (allows form submission), allow-same-origin (retains origin claims for cookies/storage), and allow-popups (permits new windows).\n\nPro Tip: Always use the most restrictive sandbox possible. For a static map, leave sandbox empty: <iframe sandbox src="...">.\n\nModern attributes for performance and security: loading="lazy" tells the browser not to load the iframe until the user scrolls near it (significantly boosts page speed). referrerpolicy controls how much referral info is sent to the external site. The allow attribute is used for Feature Policy — granting access to camera, microphone, or fullscreen.`,
      code: `<!-- Basic iframe -->
<iframe src="https://example.com"
        width="600" height="400"
        title="Embedded Page"
        frameborder="0"
        allowfullscreen>
</iframe>

<!-- Secure iframe with sandbox -->
<iframe src="https://maps.google.com/..."
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="Map location">
</iframe>

<!-- YouTube embed -->
<iframe width="560" height="315"
        src="https://www.youtube.com/embed/VIDEO_ID"
        allow="accelerometer; autoplay; encrypted-media"
        allowfullscreen
        loading="lazy">
</iframe>`,
      codeLabel: 'Iframe & Embedding Examples',
      keyPoints: [
        'Iframes embed external content like videos and maps.',
        'Always use sandbox attribute for security restrictions.',
        'loading="lazy" boosts performance by deferring off-screen iframes.',
        'Use the most restrictive sandbox possible — add permissions as needed.',
        'title attribute is required for iframe accessibility.'
      ]
    },
    {
      title: 'Canvas & SVG Graphics',
      content: `The <canvas> element is a powerful blank slate for drawing graphics via JavaScript. Unlike retained-mode HTML elements, Canvas is an immediate-mode system — you tell the browser what to paint, pixel by pixel, and it forgets immediately.\n\nTo use Canvas, define the element in HTML and access its "context" in JavaScript. The coordinate system starts at the top-left corner (0,0): X increases rightward, Y increases downward.\n\nCore drawing techniques — Basic Shapes: fillRect() draws solid rectangles, strokeRect() draws outlines, clearRect() acts as an eraser. Complex Paths: beginPath() starts a path, moveTo() lifts the "pen," lineTo() draws lines, arc() draws curves/circles, then fill() or stroke() renders it.\n\nState management: ctx.save() pushes current state (color, rotation) onto a stack, ctx.restore() pops it back. For animation, use the game loop pattern: clear canvas → update positions → redraw → repeat with requestAnimationFrame() for smooth 60fps motion.\n\nSVG (Scalable Vector Graphics) is XML-based and perfect for icons/logos — vector-based, resizes without quality loss. Canvas is best for complex dynamic graphics (games, data visualization). SVG is best for scalable UI elements (icons, charts, logos).`,
      image: '/images/html/html-canvas-example.gif',
      code: `<!-- Canvas setup -->
<canvas id="myCanvas" width="500" height="300"
        style="border:1px solid #000;"></canvas>

<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  // Draw a filled rectangle
  ctx.fillStyle = 'steelblue';
  ctx.fillRect(10, 10, 150, 100);

  // Draw a circle using paths
  ctx.beginPath();
  ctx.arc(300, 75, 50, 0, Math.PI * 2);
  ctx.fillStyle = 'tomato';
  ctx.fill();

  // Animation loop
  let x = 0;
  function animate() {
    ctx.clearRect(0, 0, 500, 300);
    ctx.fillRect(x, 120, 40, 40);
    x += 2;
    if (x < 500) requestAnimationFrame(animate);
  }
  animate();
</script>

<!-- SVG inline -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="black" fill="red" />
</svg>`,
      codeLabel: 'Canvas & SVG Graphics',
      keyPoints: [
        'Canvas uses JavaScript to draw pixel-by-pixel graphics.',
        'Coordinate system: origin (0,0) at top-left, Y increases downward.',
        'Use ctx.save()/ctx.restore() to manage drawing state.',
        'requestAnimationFrame() for smooth 60fps animations.',
        'Canvas for dynamic graphics, SVG for scalable icons/logos.'
      ]
    },
    {
      title: 'HTML5 APIs & Data Attributes',
      content: `HTML5 introduced powerful JavaScript APIs accessible from HTML.\n\nGeolocation API: Allows users to share their physical location. The browser always asks for explicit permission. getCurrentPosition() is a one-time location request; watchPosition() tracks movement (for navigation apps).\n\nWeb Storage API: Before HTML5, only cookies existed (tiny, sent with every request). Web Storage stores much larger amounts locally. localStorage persists even after browser close. sessionStorage clears when the tab closes.\n\nDrag and Drop API: Makes any element draggable with draggable="true". Involves events: dragstart, dragover, and drop.\n\nCustom Data Attributes (data-*) store extra information directly in HTML elements — a bridge between HTML and JavaScript without clashing with standard attributes. Access via element.dataset in JS (e.g., data-product-id becomes dataset.productId).\n\nThe <template> element creates "blueprints" of HTML that the browser parses but does not render until activated via JavaScript. Perfect for reusable components. HTML Entities are special codes for reserved characters (&lt; for <, &gt; for >, &amp; for &, &nbsp; for non-breaking space) — they prevent code injection and display special symbols.`,
      code: `<!-- Geolocation API -->
<button onclick="getLocation()">Get Location</button>
<script>
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        console.log(pos.coords.latitude, pos.coords.longitude);
      });
    }
  }
</script>

<!-- Web Storage -->
<script>
  localStorage.setItem('theme', 'dark');
  const theme = localStorage.getItem('theme'); // 'dark'
  sessionStorage.setItem('tab', 'home');
</script>

<!-- Custom Data Attributes -->
<div data-product-id="456" data-price="29.99">Item</div>
<script>
  let item = document.querySelector('div');
  console.log(item.dataset.productId); // "456"
  console.log(item.dataset.price);     // "29.99"
</script>

<!-- Template (non-rendered until cloned) -->
<template id="userTemplate">
  <div class="user"><h2>Name</h2><p>Email</p></div>
</template>
<script>
  let tmpl = document.getElementById('userTemplate');
  let clone = tmpl.content.cloneNode(true);
  document.body.appendChild(clone);
</script>

<!-- HTML Entities -->
<p>5 &gt; 3 &amp; 2 &lt; 4</p>
<p>&copy; 2026 &nbsp; &mdash; All Rights Reserved</p>`,
      codeLabel: 'HTML5 APIs, Data Attributes & Entities',
      keyPoints: [
        'Geolocation: getCurrentPosition() for one-time, watchPosition() for tracking.',
        'localStorage persists; sessionStorage clears on tab close.',
        'data-* attributes bridge HTML and JavaScript cleanly.',
        '<template> creates non-rendered reusable HTML blueprints.',
        'HTML entities display reserved characters safely (&lt; &gt; &amp;).'
      ]
    },
    {
      title: 'ARIA & Accessibility',
      content: `Accessibility isn't just a "nice-to-have" — it's a fundamental part of the modern web. ARIA (Accessible Rich Internet Applications) is a set of attributes that help assistive technologies like screen readers understand what the page is doing.\n\nKey ARIA attributes: role="button" defines the purpose of an element (for non-semantic elements acting as buttons). aria-label="Close" provides screen reader text when there is no visible label. aria-hidden="true" hides decorative elements from assistive tech. aria-live="assertive" announces dynamic content changes immediately.\n\nThe Responsive Design viewport meta tag is critical: <meta name="viewport" content="width=device-width, initial-scale=1.0"> — without it, mobile browsers assume a desktop-only site and zoom out, making text unreadably small.\n\nFor responsive images, avoid fixed widths (width="800") in HTML attributes — use CSS max-width: 100% instead. Structure HTML with semantic containers (<header>, <main>, <section>, <footer>) so CSS can easily stack elements on mobile and spread them on desktop.`,
      code: `<!-- ARIA roles and attributes -->
<div role="alert" aria-live="assertive">
  Error: Invalid email address
</div>

<button aria-label="Close dialog" onclick="closeModal()">
  <span aria-hidden="true">&times;</span>
</button>

<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<!-- Responsive viewport (REQUIRED) -->
<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<!-- Responsive structure -->
<main>
  <section>
    <!-- Use max-width in CSS, not fixed HTML attributes -->
    <img src="hero.jpg" alt="Hero banner"
         style="max-width: 100%; height: auto;">
  </section>
</main>`,
      codeLabel: 'ARIA & Responsive Patterns',
      keyPoints: [
        'ARIA attributes help screen readers interpret dynamic content.',
        'role, aria-label, aria-hidden, aria-live are most common.',
        'Viewport meta tag is required for mobile responsiveness.',
        'Avoid fixed width attributes — use CSS max-width: 100%.',
        'Test accessibility with tools like WAVE and screen readers.'
      ]
    },
    {
      title: 'HTML Validation & Best Practices',
      content: `HTML Validation is the process of checking your code against official W3C standards. Just because a website looks right doesn't mean the code is correct — browsers are incredibly forgiving and will try to "fix" broken HTML, often with unpredictable results.\n\nWhy Validate? Browser Consistency — your site looks the same across Chrome, Safari, Firefox, and Edge. SEO — search engine crawlers index content more accurately with clean structure. Future-Proofing — valid code remains compatible with future browser updates. Accessibility — screen readers rely on proper nesting and attributes.\n\nCommon Validation Errors: Unclosed Tags (forgetting </div> breaks layout from that point forward), Improper Nesting (block element inside inline, e.g., <div> inside <p>), Missing alt Attributes (all images need alt, even if empty), Duplicate IDs (id must be unique per document), Obsolete Tags (like <center> or <font> — replaced by CSS).\n\nUse the W3C Markup Validation Service (validator.w3.org) — check by URL, file upload, or direct paste. Additional best practices: Use semantic tags over generic <div>. Optimize for mobile with viewport meta. Indent code for readability. Place CSS in <head>, scripts at bottom of <body> with defer. Use <link rel="preload"> for critical resources. Avoid inline JS — use Content Security Policy (CSP) for security. Minify HTML for production.`,
      keyPoints: [
        'Validate HTML at validator.w3.org — by URL, upload, or paste.',
        'Common errors: unclosed tags, improper nesting, missing alt, duplicate IDs.',
        'Use semantic elements; avoid deprecated tags like <center> and <font>.',
        'Prioritize accessibility: alt text, ARIA attributes, color contrast.',
        'CSS in <head>, scripts at bottom with defer for performance.',
        'Minify HTML and use preload for critical resources in production.'
      ]
    }
  ]
};

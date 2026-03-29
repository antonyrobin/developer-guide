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
      content: `HTML (HyperText Markup Language) is the standard markup language for creating web pages. It defines the structure and content of a web page using a system of elements represented by tags. HTML is not a programming language—it does not have logic, loops, or variables. Instead, it tells the browser what content to display and how to structure it.

Every website you visit—from Google to Netflix—is built on an HTML foundation. CSS handles how it looks, JavaScript handles how it behaves, but HTML handles what is there. Without HTML, there is no web page.

HTML was created by Tim Berners-Lee in 1991. The current version, HTML5, was standardized in 2014 and introduced powerful features like semantic elements, multimedia support (<video>, <audio>), form validation, and APIs for local storage and geolocation.

A browser reads the HTML file, parses its structure into a Document Object Model (DOM), and renders the visual result. The DOM is a tree-like representation of the page that JavaScript can manipulate dynamically.`,
      image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60',
      keyPoints: [
        'HTML defines the structure and content of web pages.',
        'It is a markup language, not a programming language.',
        'HTML5 is the current standard (since 2014).',
        'The browser converts HTML into a DOM tree for rendering.'
      ]
    },
    {
      title: 'HTML Document Structure',
      content: `Every HTML document follows a specific structure. Understanding this structure is essential before writing any content.

The <!DOCTYPE html> declaration must be the very first line. It tells the browser to render the page in standards mode (modern HTML5). Without it, the browser may fall back to "quirks mode," which emulates old, inconsistent behavior.

The <html> element wraps the entire document. The lang attribute (e.g., lang="en") specifies the page's language, which is important for accessibility and SEO.

Inside <html>, there are exactly two children: <head> and <body>. The <head> contains metadata—information about the page that is not displayed visually. This includes the <title> (shown in the browser tab), <meta> tags (character encoding, viewport, description), <link> tags (CSS stylesheets), and <script> tags.

The <body> contains everything the user actually sees: text, images, forms, navigation, and all other visible content. A well-structured HTML document is easy to read, maintain, and optimize for search engines.`,
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
        'Every page needs a <title> for the browser tab.'
      ]
    },
    {
      title: 'Text Elements & Headings',
      content: `HTML provides six levels of headings: <h1> through <h6>. The <h1> is the most important heading on the page—there should typically be only one per page. <h2> through <h6> create a hierarchy of sub-headings.

Heading hierarchy matters for two reasons: accessibility (screen readers use headings to navigate) and SEO (search engines use headings to understand page structure). Never skip heading levels (e.g., going from <h1> directly to <h4>).

For regular text, the <p> tag creates a paragraph block. For emphasis within text, use <strong> for important text (displayed as bold) and <em> for emphasized text (displayed as italic). Note: <strong> and <em> carry semantic meaning, while the older <b> and <i> tags are purely visual.

Other useful text elements include <blockquote> for quoted passages, <code> for inline code, <pre> for preformatted text (preserves whitespace), <abbr> for abbreviations with a title tooltip, <mark> for highlighted text, and <small> for fine print.`,
      code: `<h1>Main Title (only one per page)</h1>
<h2>Section Heading</h2>
<h3>Sub-section Heading</h3>

<p>This is a paragraph with <strong>important</strong>
and <em>emphasized</em> text.</p>

<blockquote cite="https://example.com">
  "The web is for everyone." — Tim Berners-Lee
</blockquote>

<p>Use <code>console.log()</code> to debug.</p>
<p><abbr title="HyperText Markup Language">HTML</abbr> is fundamental.</p>`,
      codeLabel: 'Text Element Examples',
      keyPoints: [
        'Use only one <h1> per page for SEO.',
        'Never skip heading levels (h1 → h2 → h3).',
        '<strong> and <em> carry semantic meaning.',
        'Use <code> and <pre> for displaying code snippets.'
      ]
    },
    {
      title: 'Links & Navigation',
      content: `The <a> (anchor) element is one of the most important HTML elements—it creates hyperlinks that connect pages together. The href attribute specifies the destination URL.

Links can be absolute (full URL: https://google.com) or relative (path within your site: /about.html). Relative links are preferred for internal navigation because they work regardless of the domain.

The target attribute controls where the link opens. target="_blank" opens in a new tab. When using _blank, always add rel="noopener noreferrer" for security—this prevents the linked page from accessing your page's window object (a vulnerability called "tabnapping").

For navigation menus, wrap your links inside a <nav> element. This semantic element tells browsers and screen readers that the enclosed links represent a navigation section. A typical site has a primary <nav> in the header and secondary navigation in the footer.

Fragment links (href="#section-id") scroll to an element with a matching id attribute on the same page. This is commonly used for "Table of Contents" navigation on long articles. Tel links (href="tel:+1234567890") and email links (href="mailto:name@example.com") trigger phone calls and email clients respectively.`,
      code: `<!-- External link (new tab) -->
<a href="https://developer.mozilla.org"
   target="_blank"
   rel="noopener noreferrer">
  MDN Web Docs
</a>

<!-- Internal navigation -->
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>

<!-- Fragment link (same page) -->
<a href="#features">Jump to Features</a>
<section id="features">...</section>

<!-- Special links -->
<a href="tel:+1234567890">Call Us</a>
<a href="mailto:info@example.com">Email Us</a>`,
      codeLabel: 'Link Examples',
      keyPoints: [
        'Always use rel="noopener noreferrer" with target="_blank".',
        'Prefer relative links for internal navigation.',
        'Wrap navigation links in the semantic <nav> element.',
        'Fragment links (#id) enable same-page scrolling.'
      ]
    },
    {
      title: 'Images & Multimedia',
      content: `The <img> element embeds images. It is a self-closing tag (no end tag needed). The src attribute specifies the image source, and the alt attribute provides alternative text for accessibility and when images fail to load. Always provide meaningful alt text—screen readers read it aloud, and it improves SEO.

For responsive images, use the srcset attribute to provide multiple image sizes. The browser automatically selects the most appropriate version based on the device's screen size and resolution. The <picture> element provides even more control, allowing different images for different screen sizes using <source> elements.

HTML5 introduced native multimedia support. The <video> element embeds video without plugins (no more Flash!). Use the controls attribute for play/pause/volume controls. The <audio> element works similarly for sound files. Both support multiple source formats via <source> tags for cross-browser compatibility.

The <figure> and <figcaption> elements semantically group media with their captions. This is preferred over a plain <img> followed by a <p> because it explicitly associates the caption with the media.`,
      code: `<!-- Basic image with alt text -->
<img src="photo.jpg" alt="A sunset over the mountains" width="800">

<!-- Responsive image -->
<img src="small.jpg"
     srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
     sizes="(max-width: 600px) 480px, (max-width: 900px) 768px, 1200px"
     alt="Responsive photo">

<!-- Figure with caption -->
<figure>
  <img src="chart.png" alt="Sales growth chart">
  <figcaption>Fig 1: Q4 sales increased by 35%</figcaption>
</figure>

<!-- Video with controls -->
<video controls width="640" poster="thumbnail.jpg">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser does not support video.
</video>`,
      codeLabel: 'Media Element Examples',
      keyPoints: [
        'Always provide meaningful alt text for images.',
        'Use srcset for responsive, device-appropriate images.',
        'Use <figure> and <figcaption> for captioned media.',
        '<video> and <audio> replaced Flash for multimedia.'
      ]
    },
    {
      title: 'Forms & Input Elements',
      content: `HTML forms are the primary mechanism for collecting user input. The <form> element wraps all the input fields and defines where the data is sent (action attribute) and how (method attribute: GET or POST).

The <input> element is incredibly versatile—changing the type attribute transforms it entirely. Common types include: text (single-line text), password (masked input), email (with validation), number (numeric only), date (date picker), checkbox, radio (select one from a group), file (file upload), and range (slider).

Each input should have a corresponding <label> element linked via the for/id attribute pair. Labels improve usability (clicking the label focuses the input) and are essential for screen reader accessibility.

The <textarea> element handles multi-line text. The <select> element creates dropdowns. HTML5 introduced built-in validation attributes: required, minlength, maxlength, pattern (regex), min, max. These validate on the client side before the form is submitted, reducing unnecessary server requests.

The <button type="submit"> submits the form. The <fieldset> and <legend> elements group related inputs visually and semantically, which is particularly important for complex forms and accessibility compliance.`,
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

    <label for="role">Role</label>
    <select id="role" name="role">
      <option value="dev">Developer</option>
      <option value="design">Designer</option>
      <option value="pm">Product Manager</option>
    </select>

    <label for="bio">Bio</label>
    <textarea id="bio" name="bio" rows="4"
              maxlength="500" placeholder="Tell us about yourself">
    </textarea>

    <label>
      <input type="checkbox" name="terms" required>
      I agree to the Terms of Service
    </label>

    <button type="submit">Register</button>
  </fieldset>
</form>`,
      codeLabel: 'Complete Form Example',
      keyPoints: [
        'Every <input> needs a <label> for accessibility.',
        'HTML5 validation: required, pattern, minlength, etc.',
        'Use <fieldset> and <legend> to group related fields.',
        'Common types: text, email, password, number, date, file.'
      ]
    },
    {
      title: 'Semantic HTML5 Elements',
      content: `Semantic elements clearly describe their meaning to both the browser and the developer. Instead of using <div> for everything, HTML5 introduced elements like <header>, <nav>, <main>, <article>, <section>, <aside>, and <footer>.

Why does this matter? First, accessibility: screen readers use semantic elements to help visually impaired users navigate the page. A screen reader can announce "navigation" for <nav> or "main content" for <main>, allowing users to jump directly to the section they need. Second, SEO: search engines prioritize well-structured, semantic content. Third, maintainability: semantic HTML is self-documenting—another developer can immediately understand the page structure.

<header> represents introductory content or navigation (can appear at the page level or within an <article>). <nav> contains navigation links. <main> wraps the dominant content of the page (only one <main> per page). <article> represents self-contained content that could be independently distributed (a blog post, a product card). <section> groups related content with a heading. <aside> holds content tangentially related to the surrounding content (sidebars, related links). <footer> contains footer information for its nearest ancestor.

Other semantic elements include <time> (specific dates/times), <address> (contact information), <details> and <summary> (collapsible content), and <dialog> (modal windows).`,
      code: `<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/blog">Blog</a>
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
        'Improves accessibility for screen readers.',
        'Helps search engines understand page structure.',
        'Only one <main> element per page.'
      ]
    },
    {
      title: 'Tables',
      content: `HTML tables are designed for displaying tabular data—information that naturally fits into rows and columns (schedules, statistics, comparison charts). Tables should NOT be used for page layout (that is CSS's job).

A table starts with <table>. Inside, <thead> wraps header rows, <tbody> wraps data rows, and <tfoot> (optional) wraps footer rows. Each row is a <tr>. Header cells use <th>, and data cells use <td>.

For accessibility, use the scope attribute on <th> to specify whether it heads a column (scope="col") or a row (scope="row"). The <caption> element provides a title for the table, which screen readers announce before reading the data.

The colspan and rowspan attributes allow cells to span multiple columns or rows, creating merged cells for complex layouts. The <colgroup> and <col> elements can apply styles to entire columns.`,
      code: `<table>
  <caption>Q4 2026 Sales Report</caption>
  <thead>
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Q3 Sales</th>
      <th scope="col">Q4 Sales</th>
      <th scope="col">Growth</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Widget A</th>
      <td>$12,000</td>
      <td>$18,500</td>
      <td>+54%</td>
    </tr>
    <tr>
      <th scope="row">Widget B</th>
      <td>$8,000</td>
      <td>$9,200</td>
      <td>+15%</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Total</th>
      <td colspan="2">$47,700</td>
      <td>+35%</td>
    </tr>
  </tfoot>
</table>`,
      codeLabel: 'Accessible Table Example',
      keyPoints: [
        'Use tables only for tabular data, never for layout.',
        'Use <thead>, <tbody>, and <tfoot> for structure.',
        'Add scope attribute to <th> for accessibility.',
        'Use <caption> to provide a table title.'
      ]
    },
    {
      title: 'Meta Tags & SEO',
      content: `Meta tags live inside the <head> and provide metadata about the page to browsers, search engines, and social media platforms. They are invisible to users but profoundly impact discoverability, sharing, and rendering.

The charset meta tag (<meta charset="UTF-8">) specifies character encoding. UTF-8 supports virtually all characters from all languages and should always be used. The viewport meta tag is essential for mobile responsiveness—without it, mobile browsers render the page at desktop width and shrink it.

The description meta tag provides a summary that search engines display in search results below the page title. Keep it between 150-160 characters, make it compelling, and include relevant keywords naturally. This is one of the most impactful SEO elements you can control.

Open Graph (OG) meta tags control how your page appears when shared on Facebook, LinkedIn, and other platforms. Twitter has its own twitter:card meta tags. These determine the preview image, title, and description shown in social shares—making them critical for content marketing.

Robots meta tags tell search engine crawlers whether to index the page and follow its links. The canonical link tag prevents duplicate content issues by specifying the preferred URL when the same content is accessible via multiple URLs.`,
      code: `<head>
  <!-- Essential meta tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description"
        content="Learn HTML fundamentals with our comprehensive guide.
        Covers tags, forms, semantic elements, and SEO.">

  <!-- SEO -->
  <title>HTML Guide — QuickDevGuide</title>
  <link rel="canonical" href="https://quickdevguide.com/html">
  <meta name="robots" content="index, follow">

  <!-- Open Graph (Facebook, LinkedIn) -->
  <meta property="og:title" content="HTML Guide">
  <meta property="og:description" content="Master HTML in minutes.">
  <meta property="og:image" content="https://example.com/og-html.jpg">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="HTML Guide">
  <meta name="twitter:image" content="https://example.com/og-html.jpg">
</head>`,
      codeLabel: 'Complete Meta Tag Setup',
      keyPoints: [
        'Always set charset="UTF-8" and viewport for mobile.',
        'Description meta tag appears in Google search results.',
        'Open Graph tags control social media previews.',
        'Use canonical links to prevent duplicate content issues.'
      ]
    },
    {
      title: 'HTML Best Practices',
      content: `Writing clean HTML is a skill that separates amateur developers from professionals. These practices improve accessibility, performance, SEO, and maintainability.

Always validate your HTML using the W3C Validator (validator.w3.org). Invalid HTML can cause unpredictable rendering across browsers. Use lowercase for all tag names and attribute names—while HTML is case-insensitive, consistency is important.

Use semantic elements appropriately. If content is a navigation menu, use <nav>. If it is an independent article, use <article>. Reserve <div> and <span> only when no semantic element fits. Never use <br> for spacing—that is CSS's responsibility.

Optimize images with appropriate formats: JPEG for photographs, PNG for graphics with transparency, SVG for icons and logos (scalable without quality loss), and WebP for modern browsers (best compression). Always include width and height attributes to prevent layout shifts during loading.

Keep accessibility (a11y) as a first-class priority. Use proper heading hierarchy, provide alt text for images, ensure color contrast meets WCAG AA standards (4.5:1 ratio for normal text), make interactive elements keyboard-navigable, and test with a screen reader regularly.

For performance, place CSS <link> tags in the <head> (so styles load before content) and <script> tags at the bottom of <body> or use the defer attribute (so JavaScript does not block page rendering). Minimize inline styles and scripts—keep them in external files for caching.`,
      keyPoints: [
        'Validate HTML using the W3C Validator.',
        'Use semantic elements; reserve <div> for non-semantic wrappers.',
        'Optimize images: JPEG, PNG, SVG, or WebP as appropriate.',
        'Prioritize accessibility: alt text, color contrast, keyboard nav.',
        'Place CSS in <head>, scripts at bottom of <body> with defer.',
        'Always test in multiple browsers.'
      ]
    }
  ]
};

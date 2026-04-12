export const cloudflareCourse = {
    id: 'cloudflare', title: 'Cloudflare', description: 'Global edge platform for website security, CDN caching, DDoS protection, bot management, and performance optimization with a generous free tier.',
    officialDocs: 'https://developers.cloudflare.com/', tutorialLink: 'https://developers.cloudflare.com/learning-paths/', exerciseLink: null,
    sections: [
      { title: 'What is Cloudflare', image: '/images/cloudflare/cloudflare-overview.svg', content: `**Cloudflare** is a global edge network that sits between your users and your origin server. It provides security, performance, and reliability by routing traffic through its 330+ data centers worldwide.

### Core Services

| Service | Purpose |
|---|---|
| **CDN** | Cache static assets at edge locations globally |
| **WAF** | Web Application Firewall — block attacks at the edge |
| **DDoS Protection** | Absorb volumetric attacks (unlimited, unmetered) |
| **Bot Management** | Identify and block malicious bots |
| **SSL/TLS** | Free automatic HTTPS certificates |
| **DNS** | Fastest authoritative DNS (< 11ms global) |
| **Turnstile** | Privacy-first CAPTCHA alternative |
| **R2 Storage** | S3-compatible object storage (no egress fees) |
| **Workers** | Serverless functions at the edge |
| **Pages** | Static site and JAMstack hosting |

### Free Tier Includes

- Unlimited DDoS protection
- Free SSL/TLS certificates
- CDN caching (global)
- 5 WAF rules
- 100K Turnstile verifications/month
- 10GB R2 storage
- 100K Workers requests/day`, keyPoints: ['Cloudflare sits between users and your server — reverse proxy model.', '330+ edge locations provide < 50ms latency globally.', 'Unlimited DDoS protection on all plans including free.', 'Free SSL certificates and automatic HTTPS.', 'Generous free tier for small to medium websites.'] },

      { title: 'Website Configuration', content: `### Adding a Website to Cloudflare

1. **Create Account**: Sign up at [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Add Site**: Enter your domain → Cloudflare scans existing DNS records
3. **Update Nameservers**: Point your domain registrar's nameservers to Cloudflare
4. **Wait for Propagation**: DNS changes take 5 min to 24 hours

### DNS Configuration

| Record | Name | Value | Proxy |
|---|---|---|---|
| **A** | @ | 192.168.1.100 | ☁️ Proxied |
| **A** | www | 192.168.1.100 | ☁️ Proxied |
| **CNAME** | api | api.yourserver.com | ☁️ Proxied |
| **MX** | @ | mail.provider.com | DNS only |
| **TXT** | @ | v=spf1 include:... | DNS only |

**Proxied (☁️)** = Traffic routes through Cloudflare (CDN, WAF, DDoS)
**DNS Only (☁️ off)** = Direct to origin (no Cloudflare protection)

### SSL/TLS Modes

| Mode | Description | Security |
|---|---|---|
| **Off** | No encryption | ❌ Insecure |
| **Flexible** | HTTPS to Cloudflare, HTTP to origin | ⚠️ Partial |
| **Full** | HTTPS everywhere, self-signed cert accepted | ✅ Good |
| **Full (Strict)** | HTTPS everywhere, valid cert required | ✅ Best |

### Recommended Settings

\`\`\`text
SSL/TLS → Full (Strict)
Edge Certificates → Always Use HTTPS: ON
Edge Certificates → Minimum TLS Version: 1.2
Edge Certificates → Automatic HTTPS Rewrites: ON
Edge Certificates → HSTS: Enable with max-age 12 months
\`\`\``, keyPoints: ['Add your domain and update nameservers at your registrar.', 'Proxy DNS records (☁️) to route traffic through Cloudflare.', 'Always use Full (Strict) SSL mode for end-to-end encryption.', 'Enable HSTS and minimum TLS 1.2 for maximum security.', 'MX and TXT records should be DNS-only (not proxied).'] },

      { title: 'Bot Protection', image: '/images/cloudflare/cloudflare-turnstile.svg', content: `### Web Page Bot Protection (WAF Rules)

Cloudflare WAF (Web Application Firewall) blocks malicious bots, scrapers, and attacks.

**Dashboard Setup**: Security → WAF → Create Rule

| Rule | Action | Purpose |
|---|---|---|
| Block known bots | Block | Prevents automated scraping |
| Challenge suspicious IPs | Managed Challenge | Verify human users |
| Rate limit login page | Rate Limit (10/min) | Prevent brute-force attacks |
| Block specific countries | Block | Geo-restrict access |

### Bot Fight Mode

**Dashboard**: Security → Bots → Bot Fight Mode: **ON**

This automatically challenges requests from known bot networks (free on all plans).

### Turnstile — Form Protection

**Turnstile** is Cloudflare's privacy-first CAPTCHA alternative for protecting web forms.

#### 1. Get Turnstile Keys

Create a widget at [dash.cloudflare.com/turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) → Get **Site Key** and **Secret Key**.

#### 2. Frontend Integration

\`\`\`html
<!-- Add Turnstile widget to your form -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<form action="/api/contact" method="POST">
    <input type="text" name="name" required />
    <input type="email" name="email" required />
    <textarea name="message" required></textarea>

    <!-- Turnstile widget -->
    <div class="cf-turnstile" data-sitekey="0x4AAAAAAA..."></div>

    <button type="submit">Send</button>
</form>
\`\`\`

#### 3. Server-Side Validation

\`\`\`javascript
// Node.js / Express
app.post('/api/contact', async (req, res) => {
    const token = req.body['cf-turnstile-response'];

    const verify = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: process.env.TURNSTILE_SECRET_KEY,
                response: token,
                remoteip: req.ip,
            }),
        }
    );

    const result = await verify.json();
    if (!result.success) {
        return res.status(403).json({ error: 'Bot detected' });
    }

    // Process the form submission
    // ...
});
\`\`\``, keyPoints: ['WAF rules block bots, scrapers, and brute-force attacks.', 'Bot Fight Mode auto-challenges known bot networks (free tier).', 'Turnstile is a privacy-first, CAPTCHA-free bot verification.', 'Server-side validation of Turnstile tokens is mandatory.', 'Rate limiting protects login pages and API endpoints.'] },

      { title: 'CDN & Caching', content: `### How Cloudflare CDN Works

When \`Proxied (☁️)\` is enabled, Cloudflare caches static assets at edge locations closest to your users.

### Cache Rules (Dashboard)

**Dashboard**: Caching → Cache Rules → Create Rule

| Rule | TTL | Description |
|---|---|---|
| Cache static assets | 1 month | \`.js\`, \`.css\`, \`.png\`, \`.woff2\` files |
| Cache API responses | 5 minutes | Frequently-read, rarely-changing data |
| Bypass cache for API | Bypass | Dynamic POST/PUT/DELETE requests |
| Cache HTML pages | 2 hours | Static pages with \`Cache-Control\` |

### Default Cache Behavior

Cloudflare caches these by default:
\`\`\`text
.js .css .png .jpg .jpeg .gif .ico .svg .woff .woff2 .ttf
.mp4 .webm .webp .avif .pdf .zip
\`\`\`

HTML pages are **NOT cached** by default — create a Cache Rule to enable.

### Page Rules (Legacy) / Cache Rules (New)

\`\`\`text
# Cache everything on a static site
URL: example.com/*
Cache Level: Cache Everything
Edge Cache TTL: 1 month
Browser Cache TTL: 1 day

# Bypass cache for admin
URL: example.com/admin/*
Cache Level: Bypass
\`\`\`

### Performance Settings

\`\`\`text
Speed → Optimization:
  Auto Minify: JavaScript, CSS, HTML ✅
  Brotli: ON ✅
  Early Hints: ON ✅
  Rocket Loader: ON ✅ (defers JS loading)
  HTTP/2: ON ✅
  HTTP/3: ON ✅
\`\`\`

### Purge Cache

\`\`\`powershell
# Purge everything (use sparingly)
# Dashboard: Caching → Configuration → Purge Everything

# Purge specific URLs (API)
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \\
  -H "Authorization: Bearer API_TOKEN" \\
  -H "Content-Type: application/json" \\
  --data '{"files":["https://example.com/styles.css"]}'
\`\`\``, keyPoints: ['Proxied records route traffic through Cloudflare CDN.', 'Static assets (.js, .css, images) are cached by default.', 'HTML pages need explicit Cache Rules to be cached.', 'Enable Brotli, HTTP/2, HTTP/3 for maximum performance.', 'Purge cache selectively — avoid purging everything.'] },

      { title: 'Security Features', content: `### Security Headers (Transform Rules)

**Dashboard**: Rules → Transform Rules → Modify Response Headers

| Header | Value | Purpose |
|---|---|---|
| **X-Content-Type-Options** | \`nosniff\` | Prevent MIME sniffing |
| **X-Frame-Options** | \`DENY\` | Block clickjacking |
| **X-XSS-Protection** | \`1; mode=block\` | XSS filter |
| **Referrer-Policy** | \`strict-origin-when-cross-origin\` | Control referrer leakage |
| **Content-Security-Policy** | \`default-src 'self'\` | Control resource loading |
| **Permissions-Policy** | \`camera=(), microphone=()\` | Restrict browser APIs |

### Rate Limiting

**Dashboard**: Security → WAF → Rate Limiting Rules

\`\`\`text
Rule: Protect login endpoint
If: URI Path equals "/api/auth/login"
Rate: 10 requests per minute per IP
Action: Block for 1 hour
\`\`\`

### IP Access Rules

\`\`\`text
# Block specific IPs
Security → WAF → Tools → IP Access Rules
IP: 1.2.3.4 → Action: Block

# Allow office IPs
IP: 203.0.113.0/24 → Action: Allow

# Challenge entire countries
Country: [select] → Action: Managed Challenge
\`\`\`

### Firewall Rules (WAF Custom Rules)

\`\`\`text
# Block SQL injection patterns
(http.request.uri.query contains "SELECT" or
 http.request.uri.query contains "UNION" or
 http.request.body.raw contains "DROP TABLE")
→ Action: Block

# Require specific User-Agent
(not http.user_agent contains "Mozilla" and
 not http.user_agent contains "Chrome" and
 http.request.uri.path ne "/api/webhook")
→ Action: Managed Challenge
\`\`\``, keyPoints: ['Add security headers via Transform Rules — no code changes needed.', 'Rate limit login and API endpoints to prevent abuse.', 'Block suspicious IPs and challenge specific countries.', 'WAF Custom Rules block SQL injection, XSS, and other attacks.', 'All security features work at the edge before reaching your server.'] },

      { title: 'R2 Storage & Workers', content: `### R2 — Object Storage

Cloudflare R2 is S3-compatible storage with **zero egress fees**.

**Dashboard**: R2 → Create Bucket

\`\`\`javascript
// Upload via S3-compatible API (Node.js)
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
    region: 'auto',
    endpoint: 'https://ACCOUNT_ID.r2.cloudflarestorage.com',
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

await r2.send(new PutObjectCommand({
    Bucket: 'my-assets',
    Key: 'images/photo.jpg',
    Body: fileBuffer,
    ContentType: 'image/jpeg',
}));
\`\`\`

### Workers — Edge Functions

Cloudflare Workers run JavaScript at the edge (< 50ms cold start).

\`\`\`javascript
// worker.js — API proxy with caching
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Cache API responses at the edge
        const cache = caches.default;
        let response = await cache.match(request);

        if (!response) {
            response = await fetch(env.ORIGIN_URL + url.pathname);
            response = new Response(response.body, response);
            response.headers.set('Cache-Control', 'max-age=300');
            await cache.put(request, response.clone());
        }

        return response;
    },
};
\`\`\`

### Pages — Static Hosting

Cloudflare Pages hosts static sites and JAMstack apps with:
- Git integration (auto-deploy on push)
- Preview deployments for PRs
- Custom domains and SSL
- 500 builds/month (free tier)

\`\`\`powershell
# Deploy React/Next.js app
npx wrangler pages deploy ./dist --project-name=my-app
\`\`\``, keyPoints: ['R2 is S3-compatible storage with zero egress fees.', 'Workers run JavaScript at the edge with < 50ms cold start.', 'Pages hosts static sites with Git-based auto-deploy.', 'R2 uses standard S3 APIs — easy migration from AWS.', 'Workers can act as API proxies, redirects, or A/B test routers.'] },

      { title: 'Best Practices', content: `### ✅ Do's

| # | Practice | Reason |
|---|---|---|
| 1 | **Use Full (Strict) SSL** | End-to-end encryption |
| 2 | **Enable Bot Fight Mode** | Free bot protection |
| 3 | **Cache static assets** | Reduce origin load and latency |
| 4 | **Add security headers** | Defense-in-depth via Transform Rules |
| 5 | **Rate limit sensitive endpoints** | Prevent brute-force attacks |
| 6 | **Enable HSTS** | Force HTTPS for all visitors |
| 7 | **Use Turnstile for forms** | Privacy-first bot protection |

### ❌ Don'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Use Flexible SSL** | Use Full (Strict) mode |
| 2 | **Proxy MX/TXT records** | Set to DNS-only for email |
| 3 | **Cache user-specific data** | Bypass cache for authenticated routes |
| 4 | **Purge all cache often** | Purge specific URLs instead |
| 5 | **Expose origin IP** | Use Cloudflare origin certificates |

### Advantages & Disadvantages

| Advantages | Disadvantages |
|---|---|
| Industry-leading DDoS protection | Complex dashboard for beginners |
| Generous free tier | Some features are Pro/Enterprise only |
| Global edge network (330+ PoPs) | Must use Cloudflare nameservers |
| Zero egress fees on R2 | Worker execution limits on free tier |
| Automatic SSL/TLS | DNS propagation can take time |`, keyPoints: ['Always use Full (Strict) SSL for end-to-end encryption.', 'Enable Bot Fight Mode and Turnstile for comprehensive bot protection.', 'Cache static assets but bypass cache for authenticated content.', 'Add security headers via Transform Rules — no code changes needed.', 'Monitor analytics dashboard for attack patterns and cache efficiency.'] }
    ]
  };

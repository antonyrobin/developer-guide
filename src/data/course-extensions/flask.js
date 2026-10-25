/*
 * Flask course extension — extra sections and worked examples merged into
 * courses-data/flask.js at load time. Each script runs with `python app.py`
 * (Flask 3.x) and exercises itself through Flask's built-in test client, so you
 * can see the responses without starting a server.
 */

export default {
  examples: {
    'Example Code': [
      {
        title: 'Hello API with JSON and a path parameter',
        language: 'python',
        explanation: '`test_client()` sends requests straight to the app — handy for trying routes without a browser. Serve it for real with `flask --app app run --debug`.',
        code: `from flask import Flask, jsonify

app = Flask(__name__)

@app.get("/")
def index():
    return "Hello, World!"

@app.get("/greet/<name>")
def greet(name):
    return jsonify(message=f"Hello, {name.title()}!", length=len(name))

if __name__ == "__main__":
    client = app.test_client()
    print(client.get("/").text)
    print(client.get("/greet/ada").get_json())`,
        output: `Hello, World!
{'length': 3, 'message': 'Hello, Ada!'}`,
      },
    ],
    'Run, Build & Configuration': [
      {
        title: 'Config from a class plus environment variables',
        language: 'python',
        code: `import os
from flask import Flask

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-change-me")
    DATABASE = os.environ.get("DATABASE", "app.db")
    JSON_SORT_KEYS = False

class TestConfig(Config):
    TESTING = True
    DATABASE = ":memory:"

def create_app(config=Config):
    app = Flask(__name__)
    app.config.from_object(config)
    app.config.from_prefixed_env()   # FLASK_DEBUG=1, FLASK_SECRET_KEY=... override
    return app

if __name__ == "__main__":
    app = create_app(TestConfig)
    print(app.config["TESTING"], app.config["DATABASE"])`,
        output: 'True :memory:',
      },
    ],
  },

  sections: [
    {
      title: 'Routing & URL Building',
      after: 'Example Code',
      content: `Routes map a URL pattern and HTTP method to a **view function**. Flask 2+ adds method shortcuts: \`@app.get\`, \`@app.post\`, \`@app.put\`, \`@app.delete\`, \`@app.patch\`.

### Variable rules (converters)

| Rule | Matches | Python type |
|---|---|---|
| \`<name>\` | any text without \`/\` | \`str\` |
| \`<int:id>\` | positive integers | \`int\` |
| \`<float:price>\` | floats | \`float\` |
| \`<path:subpath>\` | text including \`/\` | \`str\` |
| \`<uuid:token>\` | UUID strings | \`uuid.UUID\` |

### URL building

Never hard-code links — use \`url_for("view_name", **params)\`. It respects the app's root path, escapes values and adds unknown params as a query string. Inside a request it is also how templates build links: \`{{ url_for('static', filename='app.css') }}\`.

### Trailing slashes

\`/projects/\` redirects \`/projects\` to the slash form; \`/about\` (no slash) returns 404 for \`/about/\`. Pick one style and stay consistent.`,
      code: `from flask import Flask, url_for, redirect

app = Flask(__name__)

@app.get("/users/<int:user_id>")
def get_user(user_id):
    return {"id": user_id, "type": type(user_id).__name__}

@app.get("/files/<path:subpath>")
def get_file(subpath):
    return {"path": subpath}

@app.route("/login", methods=["GET", "POST"])
def login():
    return redirect(url_for("get_user", user_id=7, tab="profile"))

if __name__ == "__main__":
    c = app.test_client()
    print(c.get("/users/42").get_json())
    print(c.get("/users/abc").status_code)        # 404: converter rejects it
    print(c.get("/files/docs/2026/report.pdf").get_json())
    print(c.post("/login").headers["Location"])
    with app.test_request_context():
        print(url_for("get_file", subpath="a b/c.txt"))`,
      codeLabel: 'Converters, methods and url_for',
      keyPoints: [
        'Converters like `<int:id>` validate and convert path segments before your view runs.',
        'Use the `@app.get` / `@app.post` shortcuts or `methods=[...]` on `@app.route`.',
        'Build links with `url_for` — it escapes values and adds extra kwargs as a query string.',
        'A route with a trailing slash redirects the slash-less URL; the reverse is a 404.',
      ],
    },
    {
      title: 'Request & Response Handling',
      after: 'Routing & URL Building',
      content: `The global \`request\` object is a proxy to the current request (thread/context local).

### Reading input

| Source | Accessor |
|---|---|
| Query string \`?page=2\` | \`request.args.get("page", 1, type=int)\` |
| Form fields | \`request.form["email"]\` |
| JSON body | \`request.get_json()\` (or \`silent=True\` to return \`None\` on bad JSON) |
| Files | \`request.files["avatar"]\` |
| Headers / cookies | \`request.headers.get("X-Request-Id")\`, \`request.cookies\` |

### Returning output

A view can return a \`str\`, \`dict\`/\`list\` (auto-JSON), a \`Response\`, or a tuple \`(body, status, headers)\`. Use \`abort(404)\` to stop early with an HTTP error and \`make_response()\` when you need to set cookies or headers.`,
      code: `from flask import Flask, request, abort, make_response

app = Flask(__name__)
TODOS = {1: {"id": 1, "title": "Write docs", "done": False}}

@app.get("/todos")
def list_todos():
    done = request.args.get("done", type=lambda v: v.lower() == "true")
    items = [t for t in TODOS.values() if done is None or t["done"] == done]
    return {"count": len(items), "items": items}

@app.post("/todos")
def create_todo():
    data = request.get_json(silent=True) or {}
    if not data.get("title"):
        abort(400, description="title is required")
    todo = {"id": max(TODOS) + 1, "title": data["title"], "done": False}
    TODOS[todo["id"]] = todo
    resp = make_response(todo, 201)
    resp.headers["Location"] = f"/todos/{todo['id']}"
    return resp

if __name__ == "__main__":
    c = app.test_client()
    r = c.post("/todos", json={"title": "Ship v1"})
    print(r.status_code, r.headers["Location"], r.get_json())
    print(c.post("/todos", json={}).status_code)
    print(c.get("/todos?done=false").get_json()["count"])`,
      codeLabel: 'Query params, JSON body, status codes and headers',
      keyPoints: [
        'Use `request.args`, `request.form`, `request.get_json()` and `request.files` for input.',
        'Returning a dict gives a JSON response; a tuple sets status and headers.',
        '`abort(code)` raises an HTTP error immediately — pair it with error handlers.',
        'Pass `type=` to `args.get` to convert and validate query parameters.',
      ],
    },
    {
      title: 'Templates with Jinja2',
      after: 'Request & Response Handling',
      content: `\`render_template("page.html", **context)\` renders files from the \`templates/\` folder with **Jinja2**. Output is **auto-escaped** in \`.html\` templates, which protects against XSS.

### Jinja2 cheat sheet

| Syntax | Purpose |
|---|---|
| \`{{ user.name }}\` | print an expression |
| \`{% if %} … {% endif %}\` | conditionals |
| \`{% for x in items %} … {% else %} … {% endfor %}\` | loops (with empty fallback) |
| \`{{ price \\| round(2) }}\`, \`\\| upper\`, \`\\| default("—")\` | filters |
| \`{% extends "base.html" %}\` + \`{% block content %}\` | layout inheritance |
| \`{% include "_nav.html" %}\` | partials |
| \`{{ url_for('static', filename='app.css') }}\` | static asset links |

Keep logic in Python and pass ready-to-display data to the template.`,
      code: `from flask import Flask, render_template_string

app = Flask(__name__)

# In a real app this lives in templates/products.html and you call render_template().
PAGE = """
<h1>{{ title }}</h1>
<ul>
{% for p in products %}
  <li class="{{ 'sale' if p.sale else '' }}">{{ p.name }} — \${{ '%.2f' | format(p.price) }}</li>
{% else %}
  <li>No products yet.</li>
{% endfor %}
</ul>
<p>{{ note }}</p>
"""

@app.get("/products")
def products():
    items = [{"name": "Keyboard", "price": 49.9, "sale": True},
             {"name": "Mouse", "price": 19, "sale": False}]
    return render_template_string(PAGE, title="Shop", products=items,
                                  note="<script>alert('xss')</script>")

if __name__ == "__main__":
    print(app.test_client().get("/products").text)`,
      codeLabel: 'Loops, filters and auto-escaping',
      keyPoints: [
        'Templates live in `templates/` and are rendered with `render_template`.',
        'Auto-escaping turns user input like `<script>` into harmless text.',
        'Use `{% extends %}` and `{% block %}` for a shared layout.',
        'Keep business logic in views; templates should only format data.',
      ],
    },
    {
      title: 'Blueprints & the Application Factory',
      after: 'Templates with Jinja2',
      content: `As an app grows, split it into **blueprints** (groups of routes, templates and static files) and create the app in a **factory function**. The factory makes it easy to create differently-configured apps for tests, and avoids circular imports.

### Typical layout

\`\`\`
myapp/
├── __init__.py      # create_app()
├── auth/routes.py   # auth blueprint
├── api/routes.py    # api blueprint
├── templates/
└── static/
\`\`\`

Run it with \`flask --app myapp run --debug\` — the CLI finds \`create_app\` automatically.

| Hook | Runs |
|---|---|
| \`@bp.before_request\` | before each request in the blueprint |
| \`@app.after_request\` | after each response (add headers) |
| \`@app.teardown_appcontext\` | at the end of the app context (close DB) |`,
      code: `from flask import Flask, Blueprint, url_for, g

api = Blueprint("api", __name__, url_prefix="/api/v1")

@api.before_request
def load_client():
    g.client = "demo-client"

@api.get("/health")
def health():
    return {"status": "ok", "client": g.client}

auth = Blueprint("auth", __name__, url_prefix="/auth")

@auth.post("/login")
def login():
    return {"next": url_for("api.health")}   # "blueprint.view" endpoint names

def create_app(testing=False):
    app = Flask(__name__)
    app.config["TESTING"] = testing
    app.register_blueprint(api)
    app.register_blueprint(auth)

    @app.after_request
    def security_headers(resp):
        resp.headers["X-Content-Type-Options"] = "nosniff"
        return resp

    return app

if __name__ == "__main__":
    app = create_app(testing=True)
    c = app.test_client()
    r = c.get("/api/v1/health")
    print(r.get_json(), r.headers["X-Content-Type-Options"])
    print(c.post("/auth/login").get_json())
    print(sorted(rule.rule for rule in app.url_map.iter_rules()))`,
      codeLabel: 'Two blueprints registered by a factory',
      keyPoints: [
        'A blueprint groups related routes and is registered with a `url_prefix`.',
        'Endpoint names become `"blueprint.view"` — use them in `url_for`.',
        '`create_app()` lets tests build an isolated app with test config.',
        'Use `g` for per-request data such as the current user or DB connection.',
      ],
    },
    {
      title: 'Working with a Database',
      after: 'Blueprints & the Application Factory',
      content: `Flask does not ship an ORM. Options:

| Approach | When |
|---|---|
| \`sqlite3\` / DB-API driver | small apps, learning, full SQL control |
| **Flask-SQLAlchemy** | most apps — models, sessions, relationships |
| **Flask-Migrate** (Alembic) | schema migrations for SQLAlchemy models |

### The connection-per-request pattern

Open a connection lazily, store it on \`g\`, and close it in \`teardown_appcontext\`. Always use **parameterised queries** (\`?\` placeholders) — never format user input into SQL.

### Flask-SQLAlchemy in brief

\`\`\`python
db = SQLAlchemy()
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
db.init_app(app)
users = db.session.execute(db.select(User).order_by(User.email)).scalars()
\`\`\``,
      code: `import sqlite3
from flask import Flask, g, request, abort

app = Flask(__name__)
app.config["DATABASE"] = ":memory:"

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row
        g.db.execute("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, body TEXT NOT NULL)")
    return g.db

@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db is not None:
        db.close()

@app.post("/notes")
def add_note():
    body = (request.get_json() or {}).get("body")
    if not body:
        abort(400)
    db = get_db()
    cur = db.execute("INSERT INTO notes (body) VALUES (?)", (body,))   # parameterised
    db.commit()
    rows = db.execute("SELECT id, body FROM notes").fetchall()
    return {"created": cur.lastrowid, "all": [dict(r) for r in rows]}, 201

if __name__ == "__main__":
    c = app.test_client()
    print(c.post("/notes", json={"body": "Robert'); DROP TABLE notes;--"}).get_json())`,
      codeLabel: 'sqlite3 connection stored on g',
      keyPoints: [
        'Store the connection on `g` and close it in `teardown_appcontext`.',
        'Always use placeholders (`?`, `:name`) — string-formatted SQL is an injection risk.',
        'Flask-SQLAlchemy + Flask-Migrate is the standard stack for larger apps.',
        'Each `:memory:` SQLite connection is a fresh database — use a file for persistence.',
      ],
    },
    {
      title: 'Error Handling & Logging',
      after: 'Working with a Database',
      content: `Register handlers with \`@app.errorhandler(code_or_exception)\` so every error returns a consistent body. For JSON APIs, convert \`HTTPException\` into JSON and log unexpected exceptions.

### Built-in logger

\`app.logger\` is a standard \`logging.Logger\`. In production, configure \`logging\` once at startup (level, format, handler) — Gunicorn and container platforms collect stdout.

| Status | Raise with |
|---|---|
| 400 Bad Request | \`abort(400)\` |
| 401 / 403 | \`abort(401)\` / \`abort(403)\` |
| 404 | \`abort(404)\` or \`db.get_or_404()\` |
| 409 Conflict | \`abort(409)\` |
| 500 | any unhandled exception |`,
      code: `import logging
from flask import Flask, abort
from werkzeug.exceptions import HTTPException

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
app = Flask(__name__)

class OutOfStock(Exception):
    pass

@app.errorhandler(HTTPException)
def http_error(e):
    return {"error": e.name, "detail": e.description}, e.code

@app.errorhandler(OutOfStock)
def out_of_stock(e):
    return {"error": "Conflict", "detail": str(e)}, 409

@app.errorhandler(Exception)
def unexpected(e):
    app.logger.exception("Unhandled error")
    return {"error": "Internal Server Error"}, 500

@app.get("/items/<int:item_id>")
def item(item_id):
    if item_id == 0:
        abort(404, description="Item 0 does not exist")
    if item_id == 1:
        raise OutOfStock("Item 1 is sold out")
    if item_id == 2:
        1 / 0
    return {"id": item_id}

if __name__ == "__main__":
    c = app.test_client()
    for i in range(4):
        r = c.get(f"/items/{i}")
        print(r.status_code, r.get_json())`,
      codeLabel: 'Consistent JSON errors',
      keyPoints: [
        'Handle `HTTPException` once to give every HTTP error the same JSON shape.',
        'Map domain exceptions to status codes with their own handlers.',
        'Log unexpected errors with `app.logger.exception` — never leak tracebacks to clients.',
        'Turn off debug mode in production; the debugger allows code execution.',
      ],
    },
    {
      title: 'Testing Flask Apps',
      after: 'Run, Build & Configuration',
      content: `Use **pytest** with the app factory. Fixtures create an app with test config and expose a \`client\`.

| Tool | Use |
|---|---|
| \`app.test_client()\` | send requests: \`client.get\`, \`client.post(json=...)\` |
| \`app.test_cli_runner()\` | invoke \`flask\` CLI commands |
| \`app.test_request_context()\` | call code that needs \`request\` / \`url_for\` |
| \`client.session_transaction()\` | read or modify the session in tests |

Run with \`pytest -q\`; add \`pytest-cov\` for coverage: \`pytest --cov=myapp\`.`,
      code: `# test_app.py — run with: pytest -q test_app.py
import pytest
from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config["TESTING"] = True

    @app.post("/sum")
    def sum_numbers():
        from flask import request
        nums = request.get_json().get("numbers", [])
        if not all(isinstance(n, (int, float)) for n in nums):
            return {"error": "numbers must be numeric"}, 422
        return {"total": sum(nums)}

    return app

@pytest.fixture
def client():
    return create_app().test_client()

def test_sum(client):
    r = client.post("/sum", json={"numbers": [1, 2, 3.5]})
    assert r.status_code == 200
    assert r.get_json() == {"total": 6.5}

@pytest.mark.parametrize("payload", [{"numbers": ["a"]}, {"numbers": [1, None]}])
def test_rejects_bad_input(client, payload):
    assert client.post("/sum", json=payload).status_code == 422`,
      codeLabel: 'pytest fixtures with the test client',
      keyPoints: [
        'Build the app in a fixture so every test gets a clean instance.',
        'Set `TESTING = True` so exceptions propagate to the test.',
        'Use `parametrize` to cover many inputs with one test.',
        'Test status codes and JSON bodies, not internal implementation details.',
      ],
    },
    {
      title: 'Building a JSON REST API',
      after: 'Testing Flask Apps',
      content: `A REST resource exposes CRUD over predictable URLs:

| Method | URL | Action | Success |
|---|---|---|---|
| GET | \`/books\` | list (with filters/pagination) | 200 |
| POST | \`/books\` | create | 201 + \`Location\` |
| GET | \`/books/<id>\` | read one | 200 / 404 |
| PUT/PATCH | \`/books/<id>\` | replace / partial update | 200 |
| DELETE | \`/books/<id>\` | delete | 204 |

### Useful extensions

- **Flask-CORS** — CORS headers for browser clients
- **marshmallow** / **pydantic** — validation and serialisation
- **Flask-JWT-Extended** — token auth
- **flask-smorest** / **APIFlask** — OpenAPI docs generated from your schemas`,
      code: `from flask import Flask, request, abort, url_for

app = Flask(__name__)
BOOKS = {}
NEXT_ID = 1

def validate(data, partial=False):
    errors = {}
    if not partial or "title" in data:
        if not isinstance(data.get("title"), str) or not data["title"].strip():
            errors["title"] = "required non-empty string"
    if "year" in data and not isinstance(data["year"], int):
        errors["year"] = "must be an integer"
    if errors:
        abort(422, description=errors)

@app.errorhandler(422)
def unprocessable(e):
    return {"errors": e.description}, 422

@app.get("/books")
def list_books():
    page = request.args.get("page", 1, type=int)
    size = min(request.args.get("size", 10, type=int), 100)
    items = list(BOOKS.values())[(page - 1) * size: page * size]
    return {"page": page, "total": len(BOOKS), "items": items}

@app.post("/books")
def create_book():
    global NEXT_ID
    data = request.get_json(silent=True) or {}
    validate(data)
    book = {"id": NEXT_ID, "title": data["title"], "year": data.get("year")}
    BOOKS[NEXT_ID] = book
    NEXT_ID += 1
    return book, 201, {"Location": url_for("get_book", book_id=book["id"])}

@app.get("/books/<int:book_id>")
def get_book(book_id):
    return BOOKS.get(book_id) or abort(404)

@app.patch("/books/<int:book_id>")
def update_book(book_id):
    book = BOOKS.get(book_id) or abort(404)
    data = request.get_json(silent=True) or {}
    validate(data, partial=True)
    book.update({k: v for k, v in data.items() if k in ("title", "year")})
    return book

@app.delete("/books/<int:book_id>")
def delete_book(book_id):
    BOOKS.pop(book_id, None) or abort(404)
    return "", 204

if __name__ == "__main__":
    c = app.test_client()
    print(c.post("/books", json={"title": "Dune", "year": 1965}).get_json())
    print(c.post("/books", json={"year": "x"}).get_json())
    print(c.patch("/books/1", json={"year": 1966}).get_json())
    print(c.get("/books?page=1&size=5").get_json())
    print(c.delete("/books/1").status_code, c.get("/books/1").status_code)`,
      codeLabel: 'Full CRUD resource with validation',
      keyPoints: [
        'Use nouns for URLs and HTTP methods for actions.',
        'Return 201 with a `Location` header on create and 204 on delete.',
        'Validate input and return 422 with field-level errors.',
        'Cap page sizes so clients cannot request unbounded result sets.',
      ],
    },
  ],
};

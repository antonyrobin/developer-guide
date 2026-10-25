/*
 * FastAPI course extension — extra sections and worked examples merged into
 * courses-data/fastapi.js at load time. Every script runs with `python main.py`
 * (FastAPI 0.110+, Pydantic v2) and calls itself through TestClient, so no
 * server is needed; serve for real with `fastapi dev main.py` or uvicorn.
 */

export default {
  examples: {
    'Example Code (main.py)': [
      {
        title: 'Typed endpoints exercised with TestClient',
        language: 'python',
        explanation: 'Type hints drive parsing, validation and the generated docs. A bad `item_id` returns **422** with a precise error before your code runs.',
        code: `from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI(title="Demo API", version="1.0.0")

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

if __name__ == "__main__":
    client = TestClient(app)
    print(client.get("/items/5", params={"q": "shoes"}).json())
    bad = client.get("/items/five")
    print(bad.status_code, bad.json()["detail"][0]["type"])
    print(sorted(client.get("/openapi.json").json()["paths"]))`,
        output: `{'item_id': 5, 'q': 'shoes'}
422 int_parsing
['/', '/items/{item_id}']`,
      },
    ],
    'Run & Configuration': [
      {
        title: 'Settings from environment variables',
        language: 'python',
        explanation: 'For larger apps use the `pydantic-settings` package (`BaseSettings`), which reads `.env` files and env vars with type conversion. This version uses only the standard library.',
        code: `import os
from dataclasses import dataclass
from functools import lru_cache
from fastapi import FastAPI, Depends
from fastapi.testclient import TestClient

@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "Inventory API")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    db_url: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")

@lru_cache            # read env once, reuse everywhere
def get_settings() -> Settings:
    return Settings()

app = FastAPI()

@app.get("/info")
def info(settings: Settings = Depends(get_settings)):
    return {"app": settings.app_name, "debug": settings.debug}

if __name__ == "__main__":
    print(TestClient(app).get("/info").json())`,
        output: `{'app': 'Inventory API', 'debug': False}`,
      },
    ],
  },

  sections: [
    {
      title: 'Path & Query Parameters',
      after: 'Example Code (main.py)',
      content: `Parameters declared in the path (\`{item_id}\`) are **path parameters**; any other simple function argument is a **query parameter**. A default value makes it optional.

### Adding validation

\`Path()\` and \`Query()\` with \`Annotated\` add constraints and documentation:

| Constraint | Meaning |
|---|---|
| \`gt\`, \`ge\`, \`lt\`, \`le\` | numeric bounds |
| \`min_length\`, \`max_length\` | string length |
| \`pattern\` | regular expression |
| \`alias\` | different name in the URL (\`item-query\`) |
| \`list[str] = Query([])\` | repeated values \`?tag=a&tag=b\` |

### Enums

Use an \`Enum\` subclass to restrict a parameter to known values — the docs show a dropdown.`,
      code: `from enum import Enum
from typing import Annotated
from fastapi import FastAPI, Path, Query
from fastapi.testclient import TestClient

app = FastAPI()

class SortBy(str, Enum):
    price = "price"
    name = "name"

@app.get("/products/{product_id}")
def get_product(product_id: Annotated[int, Path(ge=1, description="Product ID")]):
    return {"product_id": product_id}

@app.get("/products")
def search(
    q: Annotated[str | None, Query(min_length=2, max_length=50)] = None,
    tag: Annotated[list[str], Query()] = [],
    sort: SortBy = SortBy.name,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return {"q": q, "tags": tag, "sort": sort, "limit": limit}

if __name__ == "__main__":
    c = TestClient(app)
    print(c.get("/products?q=lamp&tag=home&tag=sale&sort=price").json())
    print(c.get("/products/0").status_code)            # 422: ge=1
    print(c.get("/products?limit=500").json()["detail"][0]["msg"])`,
      codeLabel: 'Validated path and query parameters',
      keyPoints: [
        'Path parameters come from `{name}` in the route; other simple args are query parameters.',
        'Use `Annotated[type, Query(...)]` / `Path(...)` for constraints and docs.',
        'A `list[str]` query parameter accepts repeated keys.',
        'Invalid input returns 422 automatically with a detailed error list.',
      ],
    },
    {
      title: 'Request Bodies with Pydantic',
      after: 'Path & Query Parameters',
      content: `Declare a **Pydantic model** as a parameter and FastAPI reads it from the JSON body, validates it and gives you a typed object.

### Pydantic v2 field toolkit

| Tool | Example |
|---|---|
| Defaults / optional | \`description: str \\| None = None\` |
| Constraints | \`price: float = Field(gt=0)\` |
| Special types | \`EmailStr\` (needs \`email-validator\`), \`HttpUrl\`, \`UUID\`, \`datetime\` |
| Nested models | \`items: list[LineItem]\` |
| Custom checks | \`@field_validator("sku")\`, \`@model_validator(mode="after")\` |
| Serialise | \`model.model_dump()\`, \`model.model_dump_json()\` |

Mix body, path and query parameters freely — FastAPI knows a Pydantic model means "body".`,
      code: `from datetime import date
from pydantic import BaseModel, Field, field_validator, model_validator
from fastapi import FastAPI
from fastapi.testclient import TestClient

class LineItem(BaseModel):
    sku: str = Field(min_length=3, examples=["ABC-1"])
    qty: int = Field(gt=0, le=1000)
    unit_price: float = Field(gt=0)

    @field_validator("sku")
    @classmethod
    def upper_sku(cls, v: str) -> str:
        return v.upper()

class Order(BaseModel):
    customer: str
    items: list[LineItem] = Field(min_length=1)
    deliver_on: date | None = None
    coupon: str | None = None

    @model_validator(mode="after")
    def check_coupon(self):
        if self.coupon and len(self.items) < 2:
            raise ValueError("coupons need at least 2 items")
        return self

app = FastAPI()

@app.post("/orders/{store_id}")
def create_order(store_id: int, order: Order, dry_run: bool = False):
    total = sum(i.qty * i.unit_price for i in order.items)
    return {"store": store_id, "dry_run": dry_run, "total": round(total, 2),
            "skus": [i.sku for i in order.items]}

if __name__ == "__main__":
    c = TestClient(app)
    body = {"customer": "Ana", "items": [{"sku": "abc-1", "qty": 2, "unit_price": 9.99}]}
    print(c.post("/orders/3?dry_run=true", json=body).json())
    body["coupon"] = "SAVE10"
    print(c.post("/orders/3", json=body).json()["detail"][0]["msg"])`,
      codeLabel: 'Nested models with validators',
      keyPoints: [
        'A Pydantic model parameter is read from the JSON body and validated.',
        '`Field(...)` adds constraints, examples and descriptions.',
        'Use `field_validator` for one field and `model_validator` for cross-field rules.',
        'Validation errors become 422 responses listing every failing field.',
      ],
    },
    {
      title: 'Response Models & Status Codes',
      after: 'Request Bodies with Pydantic',
      content: `\`response_model\` (or the return type annotation) **filters and documents** what is sent back — a classic use is hiding \`password_hash\` from an internal model.

### Common patterns

| Need | How |
|---|---|
| Separate input/output schemas | \`UserCreate\`, \`UserOut\`, \`UserInDB\` |
| Read ORM objects | \`model_config = ConfigDict(from_attributes=True)\` |
| Drop \`None\` fields | \`response_model_exclude_none=True\` |
| Status code | \`status_code=status.HTTP_201_CREATED\` |
| Custom headers / cookies | inject \`response: Response\` |
| No body | \`status_code=204\` and return \`None\` |`,
      code: `from fastapi import FastAPI, Response, status
from fastapi.testclient import TestClient
from pydantic import BaseModel

class UserIn(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    nickname: str | None = None

class UserInDB(UserOut):
    password_hash: str

DB: dict[int, UserInDB] = {}
app = FastAPI()

@app.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED,
          response_model_exclude_none=True)
def create_user(user: UserIn, response: Response):
    uid = len(DB) + 1
    DB[uid] = UserInDB(id=uid, email=user.email, password_hash="hashed:" + user.password[::-1])
    response.headers["Location"] = f"/users/{uid}"
    return DB[uid]                      # password_hash is filtered out

@app.delete("/users/{uid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(uid: int):
    DB.pop(uid, None)

if __name__ == "__main__":
    c = TestClient(app)
    r = c.post("/users", json={"email": "a@example.com", "password": "s3cret"})
    print(r.status_code, r.headers["location"], r.json())
    print(c.delete("/users/1").status_code)`,
      codeLabel: 'Hiding internal fields with response_model',
      keyPoints: [
        'Use separate models for input, output and storage.',
        '`response_model` filters fields — sensitive data never leaks by accident.',
        'Set `status_code` on the decorator; 201 for create, 204 for delete.',
        'Inject `Response` to add headers or cookies while still returning a model.',
      ],
    },
    {
      title: 'Dependency Injection',
      after: 'Response Models & Status Codes',
      content: `\`Depends()\` declares something an endpoint needs — a DB session, the current user, pagination params, settings. FastAPI resolves dependencies (and their dependencies), caches them per request, and shows their parameters in the docs.

### Kinds of dependencies

| Form | Use |
|---|---|
| function returning a value | shared query params, settings |
| \`yield\` dependency | open a resource, \`yield\` it, clean up after the response |
| class | \`Depends(Paginator)\` — params become constructor args |
| router-level | \`APIRouter(dependencies=[Depends(verify_key)])\` |

### Overriding in tests

\`app.dependency_overrides[get_db] = fake_db\` swaps a real dependency for a fake one.`,
      code: `import sqlite3
from typing import Annotated, Iterator
from fastapi import FastAPI, Depends, Query
from fastapi.testclient import TestClient

def get_db() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    conn.execute("CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT)")
    conn.executemany("INSERT INTO tasks (title) VALUES (?)", [(f"task {i}",) for i in range(1, 8)])
    try:
        yield conn            # runs the endpoint
    finally:
        conn.close()          # cleanup after the response

class Pagination:
    def __init__(self, page: int = Query(1, ge=1), size: int = Query(3, ge=1, le=50)):
        self.limit, self.offset = size, (page - 1) * size

DB = Annotated[sqlite3.Connection, Depends(get_db)]
Page = Annotated[Pagination, Depends()]

app = FastAPI()

@app.get("/tasks")
def list_tasks(db: DB, page: Page):
    rows = db.execute("SELECT id, title FROM tasks LIMIT ? OFFSET ?", (page.limit, page.offset))
    return [{"id": i, "title": t} for i, t in rows]

if __name__ == "__main__":
    c = TestClient(app)
    print(c.get("/tasks?page=2").json())

    def fake_db():
        conn = sqlite3.connect(":memory:", check_same_thread=False)
        conn.execute("CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT)")
        conn.execute("INSERT INTO tasks (title) VALUES ('fake')")
        yield conn
    app.dependency_overrides[get_db] = fake_db
    print(c.get("/tasks").json())`,
      codeLabel: 'yield dependency, class dependency and overrides',
      keyPoints: [
        '`Depends()` composes reusable pieces; FastAPI wires them per request.',
        'A `yield` dependency is ideal for DB sessions — cleanup always runs.',
        'Alias common dependencies with `Annotated` to keep signatures short.',
        '`app.dependency_overrides` makes testing with fakes trivial.',
      ],
    },
    {
      title: 'Error Handling',
      after: 'Dependency Injection',
      content: `Raise \`HTTPException(status_code, detail)\` to return an error. Add \`@app.exception_handler(...)\` to map your own exceptions, or to change the shape of validation errors.

| Situation | Response |
|---|---|
| Not found | \`raise HTTPException(404, "Item not found")\` |
| Auth missing | \`HTTPException(401, headers={"WWW-Authenticate": "Bearer"})\` |
| Domain rule broken | custom exception → 409 / 422 via a handler |
| Invalid request | \`RequestValidationError\` → 422 (customisable) |

Keep error bodies consistent (\`{"error": ..., "detail": ...}\`) so clients can handle them generically.`,
      code: `from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.testclient import TestClient

app = FastAPI()
STOCK = {"apple": 3}

class InsufficientStock(Exception):
    def __init__(self, item: str, available: int):
        self.item, self.available = item, available

@app.exception_handler(InsufficientStock)
async def stock_handler(request: Request, exc: InsufficientStock):
    return JSONResponse(status_code=409, content={
        "error": "insufficient_stock", "item": exc.item, "available": exc.available})

@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    fields = {".".join(map(str, e["loc"][1:])): e["msg"] for e in exc.errors()}
    return JSONResponse(status_code=422, content={"error": "validation", "fields": fields})

@app.post("/buy/{item}")
def buy(item: str, qty: int):
    if item not in STOCK:
        raise HTTPException(status_code=404, detail=f"{item} not found")
    if qty > STOCK[item]:
        raise InsufficientStock(item, STOCK[item])
    STOCK[item] -= qty
    return {"item": item, "left": STOCK[item]}

if __name__ == "__main__":
    c = TestClient(app)
    for url in ["/buy/apple?qty=2", "/buy/pear?qty=1", "/buy/apple?qty=9", "/buy/apple?qty=x"]:
        r = c.post(url)
        print(r.status_code, r.json())`,
      codeLabel: 'HTTPException and custom handlers',
      keyPoints: [
        '`HTTPException` is the quickest way to return an HTTP error with a detail.',
        'Register handlers for domain exceptions to keep endpoints clean.',
        'You can reshape `RequestValidationError` into your own error format.',
        'Never return stack traces; log them server-side instead.',
      ],
    },
    {
      title: 'Async Endpoints & Background Tasks',
      after: 'Error Handling',
      content: `FastAPI runs on **ASGI**. Choose the function type by what it waits on:

| Write | When | Why |
|---|---|---|
| \`async def\` | you \`await\` async libraries (httpx, asyncpg, aiofiles) | runs on the event loop |
| \`def\` | blocking libraries (requests, most DB drivers) | runs in a thread pool automatically |

**Never** call blocking code (\`time.sleep\`, \`requests.get\`) inside \`async def\` — it freezes every request.

### Concurrency inside a request

\`await asyncio.gather(a(), b())\` runs independent I/O at the same time.

### Background tasks

\`BackgroundTasks\` runs a function **after** the response is sent — fine for emails or audit logs. For heavy or retry-able work use a queue (Celery, RQ, Arq).`,
      code: `import asyncio, time
from fastapi import FastAPI, BackgroundTasks
from fastapi.testclient import TestClient

app = FastAPI()
AUDIT: list[str] = []

async def fetch_price(sku: str) -> float:
    await asyncio.sleep(0.3)          # simulates an async HTTP call
    return {"A1": 9.5, "B2": 4.25}.get(sku, 0.0)

async def fetch_stock(sku: str) -> int:
    await asyncio.sleep(0.3)
    return 12

def write_audit(message: str):
    AUDIT.append(message)             # e.g. send email, write to a log store

@app.get("/products/{sku}")
async def product(sku: str, tasks: BackgroundTasks):
    start = time.perf_counter()
    price, stock = await asyncio.gather(fetch_price(sku), fetch_stock(sku))
    tasks.add_task(write_audit, f"viewed {sku}")
    return {"sku": sku, "price": price, "stock": stock,
            "elapsed": round(time.perf_counter() - start, 1)}

if __name__ == "__main__":
    c = TestClient(app)
    print(c.get("/products/A1").json())   # ~0.3s, not 0.6s
    print(AUDIT)`,
      codeLabel: 'Concurrent awaits and a background task',
      keyPoints: [
        'Use `async def` only with async libraries; plain `def` runs in a thread pool.',
        'Blocking calls inside `async def` stall the whole server.',
        '`asyncio.gather` overlaps independent I/O within one request.',
        '`BackgroundTasks` runs after the response; use a real queue for heavy jobs.',
      ],
    },
    {
      title: 'Security: API Keys & Bearer Tokens',
      after: 'Async Endpoints & Background Tasks',
      content: `\`fastapi.security\` provides dependencies that read credentials **and** document them in OpenAPI (the docs page gets an *Authorize* button).

| Scheme | Class |
|---|---|
| API key in header | \`APIKeyHeader(name="X-API-Key")\` |
| Bearer token | \`HTTPBearer()\` |
| OAuth2 password flow | \`OAuth2PasswordBearer(tokenUrl="token")\` |
| Basic auth | \`HTTPBasic()\` |

### Typical JWT flow

1. \`POST /token\` with username/password → verify the hash → return a signed JWT (\`pyjwt\` / \`python-jose\`).
2. Protected endpoints depend on \`get_current_user\`, which decodes the token and loads the user.
3. Use \`Security(..., scopes=[...])\` for fine-grained permissions.

Compare secrets with \`secrets.compare_digest\` to avoid timing attacks, and hash passwords with **bcrypt/argon2**, never plain SHA.`,
      code: `import hmac, hashlib, base64, json, secrets, time
from typing import Annotated
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.testclient import TestClient

SECRET = b"change-me"   # load from env in real apps

def sign(payload: dict) -> str:
    body = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()
    sig = hmac.new(SECRET, body.encode(), hashlib.sha256).hexdigest()
    return f"{body}.{sig}"   # toy token; use a JWT library in production

def verify(token: str) -> dict:
    body, _, sig = token.partition(".")
    expected = hmac.new(SECRET, body.encode(), hashlib.sha256).hexdigest()
    if not secrets.compare_digest(sig, expected):
        raise ValueError("bad signature")
    payload = json.loads(base64.urlsafe_b64decode(body))
    if payload["exp"] < time.time():
        raise ValueError("expired")
    return payload

bearer = HTTPBearer(auto_error=False)   # we raise our own 401 below

def current_user(creds: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]) -> dict:
    try:
        return verify(creds.credentials)   # AttributeError when header is missing
    except Exception:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token",
                            headers={"WWW-Authenticate": "Bearer"})

def require_role(role: str):
    def checker(user: Annotated[dict, Depends(current_user)]):
        if role not in user["roles"]:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Missing role " + role)
        return user
    return checker

app = FastAPI()

@app.post("/token")
def login(username: str, password: str):
    if (username, password) != ("ada", "pw"):
        raise HTTPException(401, "Bad credentials")
    return {"access_token": sign({"sub": username, "roles": ["reader"], "exp": time.time() + 900}),
            "token_type": "bearer"}

@app.get("/me")
def me(user: Annotated[dict, Depends(current_user)]):
    return {"user": user["sub"]}

@app.delete("/admin/cache")
def clear_cache(user: Annotated[dict, Depends(require_role("admin"))]):
    return {"cleared": True}

if __name__ == "__main__":
    c = TestClient(app)
    token = c.post("/token", params={"username": "ada", "password": "pw"}).json()["access_token"]
    auth = {"Authorization": f"Bearer {token}"}
    print(c.get("/me", headers=auth).json())
    print(c.get("/me").status_code, c.delete("/admin/cache", headers=auth).status_code)   # 401 403`,
      codeLabel: 'Bearer auth with role checks (toy signed token)',
      keyPoints: [
        'Security classes both read credentials and document them in OpenAPI.',
        'Build `get_current_user` once and depend on it everywhere.',
        'Return 401 for missing/invalid credentials and 403 for insufficient rights.',
        'Use a vetted JWT library and password hashing in real systems.',
      ],
    },
    {
      title: 'Testing with TestClient',
      after: 'Run & Configuration',
      content: `\`fastapi.testclient.TestClient\` (built on **httpx**) calls the app in-process — no server, no network. Combine it with **pytest** fixtures and dependency overrides.

| Task | How |
|---|---|
| Sync tests | \`TestClient(app)\` |
| Startup/shutdown (lifespan) | \`with TestClient(app) as client:\` |
| Async tests | \`httpx.AsyncClient(transport=ASGITransport(app))\` + \`pytest-asyncio\` / \`anyio\` |
| Replace DB/auth | \`app.dependency_overrides[dep] = fake\` |
| WebSockets | \`client.websocket_connect("/ws")\` |

Run: \`pytest -q\`.`,
      code: `# test_main.py — run with: pytest -q test_main.py
import pytest
from fastapi import FastAPI, Depends, HTTPException
from fastapi.testclient import TestClient

def get_current_user():
    raise HTTPException(401)          # real auth would live here

app = FastAPI()

@app.get("/greeting")
def greeting(user: str = Depends(get_current_user)):
    return {"msg": f"Hi {user}"}

@pytest.fixture
def client():
    app.dependency_overrides[get_current_user] = lambda: "tester"
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_greeting(client):
    r = client.get("/greeting")
    assert r.status_code == 200
    assert r.json() == {"msg": "Hi tester"}

def test_requires_auth():
    assert TestClient(app).get("/greeting").status_code == 401`,
      codeLabel: 'pytest + dependency overrides',
      keyPoints: [
        '`TestClient` runs requests in-process — fast and deterministic.',
        'Use `with TestClient(app)` so lifespan startup/shutdown events run.',
        'Override auth and DB dependencies instead of mocking internals.',
        'Clear `dependency_overrides` after each test to avoid leaks.',
      ],
    },
  ],
};

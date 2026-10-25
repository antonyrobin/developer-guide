/*
 * Python course extension — extra sections and worked examples merged into
 * courses-data/python.js at load time. All `python` snippets run in the
 * Playground (Pyodide) unless they need third-party packages.
 */
export default {
  examples: {
    'Core Syntax & Data Types': [
      {
        title: 'Built-in types at a glance',
        language: 'python',
        code: `values = [42, 3.14, 2 + 3j, "text", b"bytes", True, None,
          [1, 2], (1, 2), {1, 2}, {"k": "v"}, range(3)]
for v in values:
    print(f"{type(v).__name__:<9} {v!r}")

# Mutable vs immutable
t = (1, 2)
lst = [1, 2]
lst.append(3)          # lists change in place
# t.append(3)          # AttributeError: tuples are immutable
print(lst, t)

# Truthiness
print([bool(x) for x in (0, "", [], {}, None, "0", [0])])

# Integer division, power, big ints
print(7 // 2, 7 % 2, -7 // 2, 2 ** 100)

# Identity vs equality
a = [1, 2]; b = [1, 2]
print(a == b, a is b)`,
      },
    ],
    'Functions & Classes': [
      {
        title: 'Parameters: positional, keyword, *args, **kwargs',
        language: 'python',
        code: `def create_user(name, /, role="user", *tags, active=True, **extra):
    """name is positional-only (/); active is keyword-only (after *tags)."""
    return {"name": name, "role": role, "tags": tags, "active": active, **extra}


print(create_user("ada"))
print(create_user("linus", "admin", "kernel", "git", active=False, country="FI"))

# Unpacking into calls
args = ["grace", "admiral"]
opts = {"active": True, "navy": True}
print(create_user(*args, **opts))

# Mutable default argument pitfall
def append_bad(item, bucket=[]):
    bucket.append(item)
    return bucket

def append_good(item, bucket=None):
    bucket = [] if bucket is None else bucket
    bucket.append(item)
    return bucket

print(append_bad(1), append_bad(2))     # [1, 2] [1, 2]  — shared list!
print(append_good(1), append_good(2))   # [1] [2]

# Lambdas and higher-order functions
words = ["banana", "Apple", "cherry"]
print(sorted(words, key=str.lower), list(map(len, words)), max(words, key=len))`,
      },
    ],
  },

  sections: [
    {
      title: 'Strings & f-strings',
      after: 'Core Syntax & Data Types',
      content: `Python strings are **immutable Unicode** sequences. Single, double and triple quotes are all valid; triple quotes span multiple lines.

### Formatting with f-strings (3.6+)

f-strings evaluate expressions inline and support a **format spec** after a colon:

| Spec | Result |
|---|---|
| \`f"{pi:.2f}"\` | \`3.14\` |
| \`f"{n:,}"\` | \`1,234,567\` |
| \`f"{0.256:.1%}"\` | \`25.6%\` |
| \`f"{name:>10}"\` / \`:<10\` / \`:^10\` | right / left / centre align |
| \`f"{n:08.3f}"\` | zero-padded |
| \`f"{value!r}"\` | \`repr()\` form |
| \`f"{x=}"\` | \`x=42\` — great for debugging (3.8+) |

### Slicing

\`s[start:stop:step]\` works on any sequence: \`s[::-1]\` reverses, \`s[-3:]\` takes the last three characters.

### Common methods

\`split\`, \`join\`, \`strip\`, \`replace\`, \`startswith\`, \`find\`, \`upper\`/\`lower\`/\`title\`, \`isdigit\`, \`zfill\`, \`removeprefix\`/\`removesuffix\` (3.9+).`,
      code: `name, score, ratio = "Ada", 1234567.891, 0.4567

print(f"{name} scored {score:,.2f} ({ratio:.1%})")
print(f"|{name:<8}|{name:^8}|{name:>8}|")
print(f"{42:08.3f} {255:#x} {255:b} {score=:.0f}")

s = "Hello, World"
print(s[0], s[-1], s[0:5], s[::-1], s[::2])
print(s.lower(), s.upper(), s.title(), s.swapcase())
print(s.split(", "), "-".join(["2026", "10", "25"]))
print("  padded  ".strip(), "x".center(7, "*"), "42".zfill(5))
print(s.replace("World", "Python"), s.find("World"), "World" in s)
print("report.final.pdf".removesuffix(".pdf"), "v1.2".removeprefix("v"))

# Multi-line and raw strings
sql = """
SELECT id, name
FROM users
WHERE active = 1
""".strip()
print(sql.splitlines())
print(r"C:\\new\\table")            # raw string: backslashes kept

# Counting characters / words
from collections import Counter
print(Counter("mississippi").most_common(2))
print(len("naïve café".split()))`,
      codeLabel: 'Strings and f-string formatting',
      keyPoints: [
        'Strings are immutable; methods return new strings.',
        'f-strings support expressions and format specs like :.2f, :, and :>10.',
        'f"{x=}" prints both the expression and its value.',
        'Slicing s[start:stop:step] works on every sequence.',
      ],
    },
    {
      title: 'Control Flow & Loops',
      after: 'Strings & f-strings',
      content: `### Conditionals

\`if / elif / else\` with no braces — indentation defines blocks. The conditional expression is \`a if cond else b\`.

### Structural pattern matching (3.10+)

\`match\` / \`case\` matches **shapes** of data: literals, sequences, dicts, classes, with \`|\` alternatives and \`if\` guards. It is far more than a switch statement.

### Loops

- \`for item in iterable:\` — iterates any iterable.
- \`enumerate(seq, start=1)\` — index + value.
- \`zip(a, b)\` — iterate in parallel (\`strict=True\` in 3.10+ to catch length mismatches).
- \`range(start, stop, step)\` — lazy integer sequence.
- \`while cond:\` with \`break\` / \`continue\`.
- **\`for…else\` / \`while…else\`** — the \`else\` runs only if the loop did **not** \`break\` (handy for searches).

### Walrus operator (3.8+)

\`if (n := len(data)) > 10:\` assigns and tests in one expression.`,
      code: `def http_status(code: int) -> str:
    if 200 <= code < 300:
        return "success"
    elif code in (301, 302):
        return "redirect"
    elif code >= 500:
        return "server error"
    else:
        return "client error"

print([http_status(c) for c in (200, 302, 404, 503)])


def handle(command):
    match command:
        case {"action": "move", "x": int(x), "y": int(y)}:
            return f"moving to {x},{y}"
        case ["say", *words]:
            return " ".join(words)
        case "quit" | "exit":
            return "bye"
        case int(n) if n < 0:
            return "negative number"
        case _:
            return f"unknown: {command!r}"

for c in ({"action": "move", "x": 1, "y": 2}, ["say", "hello", "there"], "exit", -5, 3.3):
    print(handle(c))


fruits = ["apple", "banana", "cherry"]
prices = [1.2, 0.5, 3.0]
for i, (fruit, price) in enumerate(zip(fruits, prices, strict=True), start=1):
    print(f"{i}. {fruit:<7} \${price:.2f}")

# for-else: else runs when no break happened
for n in [3, 5, 7]:
    if n % 2 == 0:
        print("found even", n)
        break
else:
    print("no even numbers")

# while + walrus
data = [5, 3, 8, 1]
while (item := data.pop()) != 8:
    print("popped", item)

print(list(range(10, 0, -3)))`,
      codeLabel: 'if/elif, match/case and loops',
      keyPoints: [
        'Indentation defines blocks; there are no braces.',
        'match/case destructures sequences, dicts and objects with guards.',
        'enumerate and zip replace manual index bookkeeping.',
        'for…else runs the else block only when the loop did not break.',
      ],
    },
    {
      title: 'Lists, Tuples & Sets',
      after: 'Control Flow & Loops',
      content: `| Type | Ordered | Mutable | Duplicates | Literal | Typical use |
|---|---|---|---|---|---|
| \`list\` | ✅ | ✅ | ✅ | \`[1, 2]\` | general sequence |
| \`tuple\` | ✅ | ❌ | ✅ | \`(1, 2)\` | fixed records, dict keys, returning multiple values |
| \`set\` | ❌ | ✅ | ❌ | \`{1, 2}\` | membership, de-duplication, set algebra |
| \`frozenset\` | ❌ | ❌ | ❌ | \`frozenset({1})\` | hashable set |

### Performance

\`x in list\` is O(n); \`x in set\` is **O(1)** on average — convert to a set when checking membership repeatedly. Appending to a list is O(1); inserting at the front is O(n) — use \`collections.deque\` for queues.

### Copying

\`b = a\` copies the **reference**. Use \`a.copy()\` / \`a[:]\` for a shallow copy and \`copy.deepcopy(a)\` for nested structures.

### Useful helpers

\`sorted(key=…, reverse=True)\`, \`min/max(key=…)\`, \`sum\`, \`any/all\`, \`reversed\`, \`itertools\` (\`chain\`, \`groupby\`, \`combinations\`), \`bisect\` for sorted inserts, \`heapq\` for priority queues.`,
      code: `import copy, heapq
from collections import deque

nums = [5, 2, 9, 2, 7]
nums.append(1); nums.extend([8, 3]); nums.insert(0, 10)
nums.remove(2)                       # first occurrence
last = nums.pop()                    # removes and returns the last item
print(nums, last, nums.index(9), nums.count(2))

print(sorted(nums), sorted(nums, reverse=True), nums[::-1])
nums.sort(key=lambda n: (n % 2, n))  # evens first, then by value
print(nums)

# Unpacking
first, *middle, last = [1, 2, 3, 4, 5]
print(first, middle, last)

# Tuples: immutable, hashable, great for multiple return values
def min_max(values):
    return min(values), max(values)

lo, hi = min_max(nums)
point = (3, 4)
distances = {point: 5.0}              # tuples can be dict keys
print(lo, hi, distances)

# Sets
a, b = {1, 2, 3, 4}, {3, 4, 5}
print(a | b, a & b, a - b, a ^ b, {1, 2} <= a)
print(list(dict.fromkeys([3, 1, 3, 2, 1])))     # de-dupe preserving order

# Shallow vs deep copy
grid = [[0, 0], [0, 0]]
shallow, deep = grid.copy(), copy.deepcopy(grid)
grid[0][0] = 99
print(shallow[0][0], deep[0][0])                # 99 0

# deque & heapq
q = deque([1, 2, 3]); q.appendleft(0); q.rotate(1)
tasks = [(3, "low"), (1, "urgent"), (2, "normal")]
heapq.heapify(tasks)
print(q, heapq.heappop(tasks))`,
      codeLabel: 'Sequence and set operations',
      keyPoints: [
        'Lists are mutable, tuples immutable and hashable, sets unique and unordered.',
        'Use sets for fast membership tests.',
        'b = a shares the object; use copy() or deepcopy() to duplicate.',
        'deque for queues, heapq for priority queues.',
      ],
    },
    {
      title: 'Dictionaries',
      after: 'Lists, Tuples & Sets',
      content: `A \`dict\` maps hashable keys to values with **O(1)** average lookup and preserves **insertion order** (3.7+).

### Access patterns

| Need | Code |
|---|---|
| Value or error | \`d["key"]\` → \`KeyError\` if missing |
| Value or default | \`d.get("key", default)\` |
| Insert if missing | \`d.setdefault("key", [])\` |
| Remove | \`d.pop("key", None)\`, \`del d["key"]\` |
| Merge | \`d1 | d2\` (3.9+), \`d1.update(d2)\`, \`{**d1, **d2}\` |
| Iterate | \`for k, v in d.items():\` |

### collections helpers

- \`defaultdict(list)\` — auto-creates missing values.
- \`Counter\` — counting and \`most_common()\`.
- \`OrderedDict\` — \`move_to_end\`, useful for LRU caches.
- \`ChainMap\` — layered lookups (CLI args → env → defaults).

### Nested data

JSON maps naturally to dicts and lists: \`json.loads\` / \`json.dumps(indent=2)\`.`,
      code: `import json
from collections import defaultdict, Counter, ChainMap

user = {"name": "Ada", "langs": ["Python"], "address": {"city": "London"}}
user["age"] = 36
user.setdefault("langs", []).append("SQL")
print(user.get("email", "n/a"), user["address"]["city"], len(user))

for key, value in user.items():
    print(f"{key:>8}: {value}")

# Merge (later wins)
defaults = {"theme": "light", "lang": "en"}
prefs = {"theme": "dark"}
print(defaults | prefs, {**defaults, **prefs})

# Invert and filter
inventory = {"apple": 3, "pear": 0, "kiwi": 12}
in_stock = {k: v for k, v in inventory.items() if v > 0}
by_qty = {v: k for k, v in inventory.items()}
print(in_stock, by_qty, max(inventory, key=inventory.get))

# Group with defaultdict
orders = [("ada", 30), ("bob", 12), ("ada", 55)]
totals = defaultdict(int)
grouped = defaultdict(list)
for customer, amount in orders:
    totals[customer] += amount
    grouped[customer].append(amount)
print(dict(totals), dict(grouped))

print(Counter("the cat and the hat".split()).most_common(1))

# Layered config lookup
cli, env, base = {"debug": True}, {"port": 8080}, {"debug": False, "port": 80, "host": "0.0.0.0"}
config = ChainMap(cli, env, base)
print(config["debug"], config["port"], config["host"])

# JSON round-trip
text = json.dumps(user, indent=2)
print(json.loads(text)["address"])`,
      codeLabel: 'Dictionary toolkit',
      keyPoints: [
        'Dicts keep insertion order and give O(1) lookups.',
        'Use get() for defaults and setdefault()/defaultdict for grouping.',
        'Merge with | (3.9+) or {**a, **b}.',
        'Counter, defaultdict and ChainMap cover most aggregation needs.',
      ],
    },
    {
      title: 'Comprehensions & Generators',
      after: 'Dictionaries',
      content: `**Comprehensions** build collections declaratively in one readable expression:

| Kind | Syntax |
|---|---|
| list | \`[expr for x in it if cond]\` |
| set | \`{expr for x in it}\` |
| dict | \`{k: v for k, v in pairs}\` |
| generator | \`(expr for x in it)\` — **lazy**, no list in memory |

Conditional *value* goes before \`for\` (\`[a if c else b for …]\`); a *filter* goes after (\`[x for x in xs if c]\`).

### Generators

A function containing \`yield\` returns a **generator** that produces values on demand. They are perfect for large files, infinite sequences and pipelines because only one item exists at a time.

\`yield from other\` delegates to another iterable.

### itertools

\`islice\`, \`chain\`, \`groupby\`, \`accumulate\`, \`product\`, \`permutations\`, \`combinations\`, \`batched\` (3.12) — lazy building blocks for iteration.

> Keep comprehensions short. If you need nested loops **and** conditions, a regular loop is often clearer.`,
      code: `from itertools import islice, groupby, accumulate, combinations, chain

nums = range(1, 11)
squares = [n * n for n in nums]
evens = [n for n in nums if n % 2 == 0]
labels = ["even" if n % 2 == 0 else "odd" for n in range(4)]
matrix = [[r * 3 + c for c in range(3)] for r in range(3)]
flat = [x for row in matrix for x in row]
transposed = [list(col) for col in zip(*matrix)]
word_len = {w: len(w) for w in ["python", "is", "fun"]}
initials = {name[0] for name in ["ada", "alan", "bob"]}
print(squares, evens, labels, flat, transposed, word_len, initials, sep="\\n")

# Generator expression: lazy and memory-friendly
total = sum(n * n for n in range(1_000_000))
print(total)

# Generator functions
def read_records(lines):
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#"):
            yield line.split(",")

def countdown(n):
    while n > 0:
        yield n
        n -= 1

raw = ["# header", "ada,36", "", "bob,41"]
print(list(read_records(raw)), list(countdown(3)))

def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

print(list(islice(fibonacci(), 10)))

def flatten(items):
    for item in items:
        if isinstance(item, list):
            yield from flatten(item)
        else:
            yield item

print(list(flatten([1, [2, [3, [4]]], 5])))

# itertools
data = sorted(["apple", "avocado", "banana", "blueberry", "cherry"])
print({k: list(g) for k, g in groupby(data, key=lambda s: s[0])})
print(list(accumulate([1, 2, 3, 4])), list(combinations("ABC", 2)), list(chain("ab", [1, 2])))`,
      codeLabel: 'Comprehensions, generators and itertools',
      keyPoints: [
        'Comprehensions build lists, sets and dicts in one expression.',
        'Generator expressions and yield are lazy — ideal for big or infinite data.',
        'yield from delegates to another iterable.',
        'itertools provides fast, lazy iteration building blocks.',
      ],
    },
    {
      title: 'Exceptions',
      after: 'Functions & Classes',
      content: `Python follows **EAFP** — "easier to ask forgiveness than permission": try the operation and handle the exception, rather than checking every condition first.

### Full syntax

\`\`\`python
try:
    risky()
except (ValueError, TypeError) as e:   # specific exceptions first
    handle(e)
else:
    runs_if_no_exception()
finally:
    always_runs()                       # clean-up
\`\`\`

### Raising

- \`raise ValueError("message")\`
- \`raise AppError("context") from err\` — keeps the original as \`__cause__\`
- Re-raise the current exception with a bare \`raise\`.

### Custom exceptions

Create a base class for your package (\`class AppError(Exception)\`) and specific subclasses. Callers can catch the whole family or just one.

### Common built-ins

\`ValueError\`, \`TypeError\`, \`KeyError\`, \`IndexError\`, \`FileNotFoundError\`, \`ZeroDivisionError\`, \`AttributeError\`, \`TimeoutError\`.

> Never use a bare \`except:\` — it also catches \`KeyboardInterrupt\` and \`SystemExit\`. Catch \`Exception\` at most, and only at top-level boundaries.`,
      code: `class AppError(Exception):
    """Base class for this application's errors."""

class ValidationError(AppError):
    def __init__(self, field, message):
        super().__init__(f"{field}: {message}")
        self.field = field

class PaymentError(AppError):
    pass


def parse_amount(text: str) -> float:
    try:
        amount = float(text)
    except ValueError as err:
        raise ValidationError("amount", f"{text!r} is not a number") from err
    if amount <= 0:
        raise ValidationError("amount", "must be positive")
    return amount


def charge(text: str) -> str:
    amount = parse_amount(text)
    if amount > 1000:
        raise PaymentError("limit exceeded")
    return f"charged {amount:.2f}"


for value in ("49.90", "abc", "-5", "5000"):
    try:
        result = charge(value)
    except ValidationError as e:
        print(f"invalid [{e.field}] {e} (cause: {type(e.__cause__).__name__})")
    except AppError as e:
        print(f"{type(e).__name__}: {e}")
    else:
        print("ok:", result)
    finally:
        print("  audited", value)

# Exception groups (3.11+) for concurrent failures
try:
    raise ExceptionGroup("batch failed", [ValueError("row 1"), KeyError("row 7")])
except* ValueError as group:
    print("value errors:", [str(e) for e in group.exceptions])
except* KeyError as group:
    print("key errors:", [str(e) for e in group.exceptions])`,
      codeLabel: 'Custom exception hierarchy',
      keyPoints: [
        'Catch specific exceptions; never use a bare except.',
        'try/except/else/finally: else runs on success, finally always.',
        'raise … from err preserves the original cause.',
        'Give your package one base exception class.',
        'except* handles ExceptionGroups from concurrent code (3.11+).',
      ],
    },
    {
      title: 'OOP: Dataclasses & Magic Methods',
      after: 'Exceptions',
      content: `### Dataclasses

\`@dataclass\` generates \`__init__\`, \`__repr__\` and \`__eq__\` from type-annotated fields — the Pythonic way to write data-holding classes.

| Option | Effect |
|---|---|
| \`frozen=True\` | immutable + hashable |
| \`order=True\` | generates \`<\`, \`>\` … for sorting |
| \`slots=True\` (3.10) | less memory, faster attribute access |
| \`field(default_factory=list)\` | safe mutable defaults |
| \`__post_init__\` | validation / derived fields |

### Magic (dunder) methods

Implementing special methods lets your objects work with built-in syntax:

| Method | Enables |
|---|---|
| \`__repr__\` / \`__str__\` | debugging / user-facing text |
| \`__eq__\`, \`__lt__\`, \`__hash__\` | comparisons, sorting, set/dict keys |
| \`__len__\`, \`__getitem__\`, \`__iter__\`, \`__contains__\` | sequence behaviour, \`for\`, \`in\` |
| \`__add__\`, \`__mul__\` … | operators |
| \`__call__\` | call the object like a function |
| \`__enter__\` / \`__exit__\` | \`with\` statement |

### Class tools

\`@property\` for computed attributes, \`@classmethod\` for alternative constructors, \`@staticmethod\` for helpers, and \`abc.ABC\` for abstract base classes.`,
      code: `from dataclasses import dataclass, field
from functools import total_ordering


@dataclass(frozen=True, order=True)
class Version:
    major: int
    minor: int = 0
    patch: int = 0

    @classmethod
    def parse(cls, text: str) -> "Version":
        return cls(*map(int, text.lstrip("v").split(".")))

    def __str__(self):
        return f"v{self.major}.{self.minor}.{self.patch}"


@dataclass
class Cart:
    owner: str
    items: list[tuple[str, float]] = field(default_factory=list)
    discount: float = 0.0

    def __post_init__(self):
        if not 0 <= self.discount < 1:
            raise ValueError("discount must be in [0, 1)")

    def add(self, name: str, price: float) -> "Cart":
        self.items.append((name, price))
        return self

    @property
    def total(self) -> float:
        return round(sum(p for _, p in self.items) * (1 - self.discount), 2)

    def __len__(self):
        return len(self.items)

    def __iter__(self):
        return iter(self.items)

    def __contains__(self, name):
        return any(n == name for n, _ in self.items)


versions = [Version.parse(v) for v in ("v2.1.0", "1.10.3", "v1.9")]
print(sorted(versions), max(versions), str(versions[0]), Version(1, 9) in set(versions))

cart = Cart("ada", discount=0.1).add("book", 20).add("pen", 5)
print(cart, len(cart), cart.total, "pen" in cart, [n for n, _ in cart])


@total_ordering
class Money:
    def __init__(self, cents): self.cents = cents
    def __add__(self, other): return Money(self.cents + other.cents)
    def __eq__(self, other): return self.cents == other.cents
    def __lt__(self, other): return self.cents < other.cents
    def __repr__(self): return f"Money({self.cents / 100:.2f})"

print(Money(150) + Money(275), Money(1) <= Money(2), sorted([Money(5), Money(1)]))`,
      codeLabel: 'Dataclasses and dunder methods',
      keyPoints: [
        '@dataclass removes boilerplate for data classes.',
        'frozen=True makes instances immutable and hashable.',
        'Use field(default_factory=…) for mutable defaults.',
        'Dunder methods integrate objects with len(), in, for, + and sorting.',
      ],
    },
    {
      title: 'Decorators & Context Managers',
      after: 'OOP: Dataclasses & Magic Methods',
      content: `### Decorators

A decorator is a function that takes a function and returns a new one, adding behaviour **around** it — logging, timing, caching, retries, access control. \`@decorator\` above a definition is shorthand for \`func = decorator(func)\`.

Always use \`functools.wraps\` so the wrapped function keeps its name and docstring. A decorator **with arguments** needs one extra level of nesting.

### Built-in decorators

\`@property\`, \`@classmethod\`, \`@staticmethod\`, \`@functools.cache\` / \`lru_cache\`, \`@dataclass\`, \`@contextmanager\`.

### Context managers

The \`with\` statement guarantees set-up and tear-down, even when an exception occurs — files, locks, database transactions, temporary settings. Write one as a class (\`__enter__\`/\`__exit__\`) or, more simply, as a generator with \`@contextlib.contextmanager\`.`,
      code: `import functools
import time
from contextlib import contextmanager, suppress


def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            print(f"{func.__name__} took {(time.perf_counter() - start) * 1000:.1f} ms")
    return wrapper


def retry(times=3, exceptions=(Exception,)):
    """Decorator factory: takes arguments, returns a decorator."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    print(f"  attempt {attempt} failed: {e}")
            raise RuntimeError(f"{func.__name__} failed after {times} attempts")
        return wrapper
    return decorator


calls = {"n": 0}

@retry(times=3, exceptions=(ConnectionError,))
def flaky():
    calls["n"] += 1
    if calls["n"] < 3:
        raise ConnectionError("timeout")
    return "connected"


@timed
@functools.lru_cache(maxsize=None)
def slow_square(n):
    time.sleep(0.01)
    return n * n


print(flaky(), flaky.__name__)
print(slow_square(4), slow_square(4))         # second call is cached


@contextmanager
def temporary_setting(settings, key, value):
    old = settings.get(key)
    settings[key] = value
    try:
        yield settings
    finally:
        settings[key] = old                   # restored even on error


config = {"debug": False}
with temporary_setting(config, "debug", True):
    print("inside:", config)
print("after:", config)

with suppress(FileNotFoundError):             # ignore one specific error
    open("missing.txt")
print("continued")`,
      codeLabel: 'Writing decorators and context managers',
      keyPoints: [
        '@decorator is shorthand for func = decorator(func).',
        'Always apply functools.wraps inside decorators.',
        'Decorators with arguments need an extra wrapping function.',
        'with guarantees clean-up; @contextmanager is the easiest way to write one.',
      ],
    },
    {
      title: 'Files, pathlib & JSON/CSV',
      after: 'Decorators & Context Managers',
      content: `### pathlib

\`pathlib.Path\` is the modern, object-oriented way to handle file paths. It works on every OS and replaces most of \`os.path\`.

| Task | pathlib |
|---|---|
| Join paths | \`Path("data") / "users.csv"\` |
| Read / write text | \`p.read_text(encoding="utf-8")\`, \`p.write_text(...)\` |
| Parts | \`p.name\`, \`p.stem\`, \`p.suffix\`, \`p.parent\` |
| Exists / type | \`p.exists()\`, \`p.is_file()\`, \`p.is_dir()\` |
| Create dirs | \`p.mkdir(parents=True, exist_ok=True)\` |
| Find files | \`p.glob("*.py")\`, \`p.rglob("**/*.md")\` |

### open()

Use \`with open(path, mode, encoding="utf-8") as f:\` — modes: \`r\`, \`w\` (truncate), \`a\` (append), \`x\` (create only), plus \`b\` for binary. Iterate the file object to read large files line by line.

### Formats in the standard library

\`json\` (dump/load), \`csv\` (\`DictReader\`/\`DictWriter\`), \`tomllib\` (read TOML, 3.11), \`sqlite3\`, \`pickle\` (never unpickle untrusted data).`,
      code: `import csv
import json
import tempfile
from pathlib import Path

base = Path(tempfile.mkdtemp())
data_dir = base / "data"
data_dir.mkdir(parents=True, exist_ok=True)

# Write and read text
notes = data_dir / "notes.txt"
notes.write_text("first line\\nsecond line\\n", encoding="utf-8")
with notes.open("a", encoding="utf-8") as f:
    f.write("appended line\\n")
for i, line in enumerate(notes.open(encoding="utf-8"), start=1):
    print(i, line.rstrip())

# CSV with DictWriter / DictReader
users_csv = data_dir / "users.csv"
rows = [{"name": "Ada", "age": 36}, {"name": "Linus", "age": 54}]
with users_csv.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
    writer.writeheader()
    writer.writerows(rows)

with users_csv.open(newline="", encoding="utf-8") as f:
    users = [{**r, "age": int(r["age"])} for r in csv.DictReader(f)]
print(users, sum(u["age"] for u in users) / len(users))

# JSON
config_path = data_dir / "config.json"
config_path.write_text(json.dumps({"debug": True, "retries": 3}, indent=2))
config = json.loads(config_path.read_text())
print(config["retries"], config_path.suffix, config_path.stem, config_path.parent.name)

# Find files
print(sorted(p.name for p in data_dir.glob("*.*")))
print({p.suffix: p.stat().st_size for p in data_dir.iterdir()})`,
      codeLabel: 'pathlib, open(), csv and json',
      keyPoints: [
        'Use pathlib.Path and the / operator to build paths.',
        'Always pass encoding="utf-8" and use with for file handles.',
        'csv.DictReader/DictWriter map rows to dicts.',
        'Iterate a file object to stream large files line by line.',
      ],
    },
    {
      title: 'Modules, Packages & Virtual Environments',
      after: 'Files, pathlib & JSON/CSV',
      content: `### Modules and packages

A **module** is any \`.py\` file; a **package** is a directory of modules (with an optional \`__init__.py\`). Import with \`import pkg.module\`, \`from pkg import name\`, or relative imports (\`from .utils import helper\`) inside a package.

The \`if __name__ == "__main__":\` guard runs code only when a file is executed directly, not when imported.

### Typical project layout

\`\`\`text
my-app/
├── pyproject.toml      # metadata, dependencies, tool config
├── src/my_app/
│   ├── __init__.py
│   ├── __main__.py     # python -m my_app
│   └── services.py
└── tests/
    └── test_services.py
\`\`\`

### Virtual environments and dependencies

| Tool | Command |
|---|---|
| Create venv | \`python -m venv .venv\` |
| Activate | \`source .venv/bin/activate\` (macOS/Linux) · \`.venv\\Scripts\\activate\` (Windows) |
| Install | \`pip install requests\` |
| Freeze | \`pip freeze > requirements.txt\` |
| Reproduce | \`pip install -r requirements.txt\` |
| Modern all-in-one | \`uv init\`, \`uv add requests\`, \`uv run app.py\` (or Poetry) |

Never install project dependencies into the global interpreter — one venv per project.`,
      code: `# src/my_app/services.py
"""Business logic for my_app."""

__all__ = ["slugify"]          # what "from services import *" exports

import re

_NON_ALNUM = re.compile(r"[^a-z0-9]+")


def slugify(text: str) -> str:
    return _NON_ALNUM.sub("-", text.lower()).strip("-")


# src/my_app/__main__.py
from my_app.services import slugify   # absolute import
# from .services import slugify       # relative import inside the package
import sys


def main(argv: list[str]) -> int:
    for arg in argv:
        print(slugify(arg))
    return 0


if __name__ == "__main__":          # runs on "python -m my_app", not on import
    raise SystemExit(main(sys.argv[1:]))


# pyproject.toml
# [project]
# name = "my-app"
# version = "0.1.0"
# requires-python = ">=3.11"
# dependencies = ["requests>=2.32"]
#
# [project.scripts]
# my-app = "my_app.__main__:main"`,
      codeLabel: 'Package structure and entry point',
      keyPoints: [
        'Every .py file is a module; directories of modules are packages.',
        'Guard script code with if __name__ == "__main__".',
        'Use one virtual environment per project.',
        'pyproject.toml is the modern home for metadata and dependencies.',
      ],
    },
    {
      title: 'Type Hints',
      after: 'Modules, Packages & Virtual Environments',
      content: `Type hints document intent and let tools like **mypy**, **pyright** and your IDE catch bugs before runtime. Python itself does **not** enforce them.

### Syntax (3.10+)

| Hint | Meaning |
|---|---|
| \`int\`, \`str\`, \`list[int]\`, \`dict[str, float]\` | built-in generics (3.9+) |
| \`int | None\` | optional value (3.10+, replaces \`Optional[int]\`) |
| \`tuple[int, str]\` / \`tuple[int, ...]\` | fixed / variable length |
| \`Callable[[int, int], int]\` | function signature |
| \`Literal["r", "w"]\` | specific values only |
| \`TypedDict\` | dict with known keys |
| \`Protocol\` | structural interface (duck typing) |
| \`TypeVar\` / \`def f[T](x: T) -> T\` (3.12) | generics |
| \`Self\` (3.11) | method returning its own class |

### Runtime validation

For untrusted input (APIs, config), use a validation library such as **Pydantic**, which turns type hints into runtime checks — FastAPI is built on it.`,
      code: `from typing import Callable, Literal, Protocol, TypedDict, TypeVar
from dataclasses import dataclass

T = TypeVar("T")

def first(items: list[T], default: T | None = None) -> T | None:
    return items[0] if items else default


class UserDict(TypedDict):
    id: int
    name: str
    email: str | None


def apply(fn: Callable[[int, int], int], a: int, b: int) -> int:
    return fn(a, b)


Mode = Literal["read", "write"]

def open_db(path: str, mode: Mode = "read") -> str:
    return f"{path} opened for {mode}"


class Shape(Protocol):
    def area(self) -> float: ...


@dataclass
class Square:
    side: float
    def area(self) -> float:
        return self.side ** 2


def total_area(shapes: list[Shape]) -> float:     # any object with area() fits
    return sum(s.area() for s in shapes)


user: UserDict = {"id": 1, "name": "Ada", "email": None}
print(first([3, 2, 1]), first([], default=0), user["name"])
print(apply(lambda x, y: x * y, 6, 7), open_db("app.db", "write"))
print(total_area([Square(2), Square(3)]))

# Hints are not enforced at runtime:
print(first(["no", "error"]))         # fine for Python; mypy checks consistency`,
      codeLabel: 'Typing a small codebase',
      keyPoints: [
        'Type hints are checked by tools (mypy/pyright), not by Python at runtime.',
        'Use built-in generics (list[int]) and X | None (3.10+).',
        'Protocol gives typed duck typing; TypedDict types dict shapes.',
        'Use Pydantic when you need runtime validation of external data.',
      ],
    },
    {
      title: 'Async Programming (asyncio)',
      after: 'Type Hints',
      content: `\`asyncio\` runs many **I/O-bound** tasks concurrently on a single thread. While one task waits for the network or disk, others run.

### Building blocks

| Concept | Code |
|---|---|
| Coroutine | \`async def fetch(): …\` |
| Wait for it | \`await fetch()\` |
| Run concurrently | \`await asyncio.gather(a(), b())\` |
| Structured concurrency (3.11) | \`async with asyncio.TaskGroup() as tg: tg.create_task(…)\` |
| Timeout | \`async with asyncio.timeout(2):\` (3.11) |
| Limit concurrency | \`asyncio.Semaphore(5)\` |
| Entry point | \`asyncio.run(main())\` |

### When to use what

| Workload | Tool |
|---|---|
| Many network/disk waits | \`asyncio\` (with async libraries like httpx, asyncpg) |
| Blocking I/O libraries | \`concurrent.futures.ThreadPoolExecutor\` / \`asyncio.to_thread\` |
| CPU-heavy computation | \`multiprocessing\` / \`ProcessPoolExecutor\` |

> Never call blocking functions such as \`time.sleep\` or \`requests.get\` inside a coroutine — they freeze the event loop. Use \`await asyncio.sleep\` and async clients.`,
      code: `import asyncio
import time


async def fetch(service: str, delay: float) -> str:
    await asyncio.sleep(delay)              # non-blocking wait
    return f"{service} ({delay:.1f}s)"


async def main():
    start = time.perf_counter()

    # Run concurrently: total time ≈ slowest task, not the sum
    results = await asyncio.gather(fetch("users", 0.3), fetch("orders", 0.2), fetch("stock", 0.1))
    print(results, f"{time.perf_counter() - start:.2f}s")

    # Structured concurrency
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch("profile", 0.1))
        t2 = tg.create_task(fetch("settings", 0.2))
    print(t1.result(), t2.result())

    # Timeouts
    try:
        async with asyncio.timeout(0.1):
            await fetch("slow-report", 1)
    except TimeoutError:
        print("report timed out")

    # Bounded concurrency with a semaphore
    sem = asyncio.Semaphore(2)
    async def limited(i):
        async with sem:
            return await fetch(f"job{i}", 0.05)
    print(await asyncio.gather(*(limited(i) for i in range(5))))

    # Offload blocking code to a thread
    def blocking_io():
        time.sleep(0.05)
        return "blocking done"
    print(await asyncio.to_thread(blocking_io))


asyncio.run(main())`,
      codeLabel: 'asyncio patterns',
      keyPoints: [
        'asyncio is for I/O-bound concurrency on a single thread.',
        'gather and TaskGroup run coroutines concurrently.',
        'Use asyncio.timeout and Semaphore for robust services.',
        'Never block the event loop — use async libraries or asyncio.to_thread.',
      ],
    },
    {
      title: 'Testing with pytest',
      after: 'Build & Deploy',
      content: `**pytest** is the de facto Python test runner: plain \`assert\` statements, automatic test discovery (\`test_*.py\`, \`test_*\` functions) and powerful fixtures.

### Essentials

| Feature | Usage |
|---|---|
| Assertions | \`assert result == 42\` — pytest shows a detailed diff |
| Expected errors | \`with pytest.raises(ValueError, match="positive"):\` |
| Parametrize | \`@pytest.mark.parametrize("a,b,expected", [...])\` |
| Fixtures | \`@pytest.fixture\` — reusable set-up injected by argument name |
| Built-in fixtures | \`tmp_path\`, \`monkeypatch\`, \`capsys\` |
| Mocking | \`unittest.mock.patch\` / \`pytest-mock\` |
| Coverage | \`pytest --cov=my_app\` (pytest-cov) |

### Commands

\`pytest\` · \`pytest -k "discount"\` (filter) · \`pytest -x\` (stop at first failure) · \`pytest -vv\` (verbose) · \`pytest --lf\` (re-run last failures).`,
      code: `# src/shop/pricing.py
def apply_discount(price: float, percent: float) -> float:
    if not 0 <= percent <= 100:
        raise ValueError("percent must be between 0 and 100")
    return round(price * (1 - percent / 100), 2)


class PriceService:
    def __init__(self, repo):
        self.repo = repo

    def price_for(self, sku: str, qty: int) -> float:
        unit = self.repo.get_price(sku)
        return apply_discount(unit * qty, 10 if qty >= 10 else 0)


# tests/test_pricing.py
import pytest
from unittest.mock import Mock
from shop.pricing import apply_discount, PriceService


@pytest.mark.parametrize(
    "price, percent, expected",
    [(100, 0, 100), (100, 25, 75), (19.99, 10, 17.99)],
)
def test_apply_discount(price, percent, expected):
    assert apply_discount(price, percent) == expected


def test_rejects_invalid_percent():
    with pytest.raises(ValueError, match="between 0 and 100"):
        apply_discount(10, 150)


@pytest.fixture
def repo():
    fake = Mock()
    fake.get_price.return_value = 2.0
    return fake


def test_bulk_discount(repo):
    service = PriceService(repo)
    assert service.price_for("A1", 10) == 18.0
    repo.get_price.assert_called_once_with("A1")


def test_writes_report(tmp_path):
    report = tmp_path / "report.txt"
    report.write_text("total=18.0")
    assert report.read_text().endswith("18.0")`,
      codeLabel: 'pytest with parametrize, fixtures and mocks',
      keyPoints: [
        'pytest uses plain assert and discovers test_*.py automatically.',
        'parametrize covers many inputs with one test function.',
        'Fixtures provide reusable set-up; tmp_path and monkeypatch are built in.',
        'Mock external dependencies to keep unit tests fast and isolated.',
      ],
    },
  ],
};

/*
 * OOP course extension — multi-language examples for each pillar plus extra
 * sections, merged into courses-data/oops.js at load time.
 */
export default {
  examples: {
    'Class': [
      {
        title: 'Java',
        language: 'java',
        code: `public class Car {
    // fields (state)
    private final String brand;
    private int speed;

    // constructor
    public Car(String brand) {
        this.brand = brand;
    }

    // methods (behaviour)
    public void accelerate(int delta) { speed += delta; }
    public int getSpeed() { return speed; }

    @Override
    public String toString() { return brand + " @ " + speed + " km/h"; }
}`,
      },
      {
        title: 'Python',
        language: 'python',
        code: `class Car:
    wheels = 4                      # class attribute (shared)

    def __init__(self, brand: str):
        self.brand = brand          # instance attributes
        self._speed = 0

    def accelerate(self, delta: int) -> None:
        self._speed += delta

    @property
    def speed(self) -> int:
        return self._speed

    def __repr__(self) -> str:
        return f"Car({self.brand!r}, speed={self._speed})"


car = Car("Toyota")
car.accelerate(30)
print(car, car.speed, Car.wheels)`,
      },
      {
        title: 'TypeScript',
        language: 'typescript',
        code: `class Car {
  static readonly wheels = 4;
  private speed = 0;

  constructor(public readonly brand: string) {}   // parameter property

  accelerate(delta: number): this {
    this.speed += delta;
    return this;
  }

  get currentSpeed(): number { return this.speed; }

  toString(): string { return \`\${this.brand} @ \${this.speed} km/h\`; }
}

const car = new Car("Toyota").accelerate(30).accelerate(20);
console.log(String(car), Car.wheels);`,
      },
      {
        title: 'C#',
        language: 'csharp',
        code: `public class Car
{
    public string Brand { get; }          // read-only auto-property
    public int Speed { get; private set; } // public read, private write

    public Car(string brand) => Brand = brand;

    public void Accelerate(int delta) => Speed += delta;

    public override string ToString() => $"{Brand} @ {Speed} km/h";
}`,
      },
    ],
    'Encapsulation': [
      {
        title: 'Java — invariants behind methods',
        language: 'java',
        explanation: 'State is private; the only way to change it is through methods that **enforce the rules** (no negative deposits, no overdraft). Callers cannot put the object into an invalid state.',
        code: `public class BankAccount {
    private final String id;
    private BigDecimal balance = BigDecimal.ZERO;
    private final List<String> history = new ArrayList<>();

    public BankAccount(String id) { this.id = Objects.requireNonNull(id); }

    public void deposit(BigDecimal amount) {
        if (amount.signum() <= 0) throw new IllegalArgumentException("Deposit must be positive");
        balance = balance.add(amount);
        history.add("deposit " + amount);
    }

    public void withdraw(BigDecimal amount) {
        if (amount.compareTo(balance) > 0) throw new IllegalStateException("Insufficient funds");
        balance = balance.subtract(amount);
        history.add("withdraw " + amount);
    }

    public BigDecimal getBalance() { return balance; }

    // Return an unmodifiable view — callers cannot tamper with history
    public List<String> getHistory() { return Collections.unmodifiableList(history); }
}`,
      },
      {
        title: 'Python — properties and name mangling',
        language: 'python',
        code: `class Temperature:
    def __init__(self, celsius: float = 0):
        self.celsius = celsius            # goes through the setter

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float) -> None:
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self) -> float:        # computed, read-only
        return self._celsius * 9 / 5 + 32


t = Temperature(25)
print(t.fahrenheit)       # 77.0
try:
    t.celsius = -300
except ValueError as e:
    print("Rejected:", e)`,
      },
    ],
    'Abstraction': [
      {
        title: 'Python — abstract base class',
        language: 'python',
        code: `from abc import ABC, abstractmethod


class PaymentGateway(ABC):
    """Callers depend on this abstraction, not on Stripe or PayPal."""

    @abstractmethod
    def charge(self, amount: float, currency: str) -> str: ...

    def pay(self, amount: float, currency: str = "USD") -> str:
        if amount <= 0:
            raise ValueError("Amount must be positive")
        return self.charge(amount, currency)      # template method


class StripeGateway(PaymentGateway):
    def charge(self, amount, currency):
        return f"stripe:charged {amount} {currency}"


class FakeGateway(PaymentGateway):               # handy in tests
    def charge(self, amount, currency):
        return "fake:ok"


for gateway in (StripeGateway(), FakeGateway()):
    print(gateway.pay(9.99))
# PaymentGateway()  -> TypeError: Can't instantiate abstract class`,
      },
      {
        title: 'C# — abstract class',
        language: 'csharp',
        code: `Console.WriteLine(new SalesReport().Generate());   // top-level statements come first

public abstract class Report
{
    // Template method: fixed algorithm, variable steps
    public string Generate() => $"{Header()}\\n{Body()}\\n-- generated {DateTime.UtcNow:yyyy-MM-dd}";

    protected virtual string Header() => "REPORT";
    protected abstract string Body();
}

public class SalesReport : Report
{
    protected override string Header() => "SALES REPORT";
    protected override string Body() => "Total: $12,400";
}`,
      },
    ],
    'Inheritance': [
      {
        title: 'Java — extends, super and overriding',
        language: 'java',
        code: `public class Employee {
    protected final String name;
    protected final double baseSalary;

    public Employee(String name, double baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }

    public double pay() { return baseSalary; }

    @Override public String toString() { return name + " earns " + pay(); }
}

public class Manager extends Employee {
    private final double bonus;

    public Manager(String name, double baseSalary, double bonus) {
        super(name, baseSalary);        // call parent constructor first
        this.bonus = bonus;
    }

    @Override
    public double pay() { return super.pay() + bonus; }   // extend parent behaviour
}

// Employee e = new Manager("Ana", 5000, 1500);
// System.out.println(e);   // Ana earns 6500.0  (dynamic dispatch)`,
      },
      {
        title: 'Python — super() and multiple inheritance (MRO)',
        language: 'python',
        code: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."


class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed

    def speak(self):
        return "Woof"


class LoggerMixin:
    def log(self, msg):
        print(f"[{type(self).__name__}] {msg}")


class ServiceDog(LoggerMixin, Dog):      # mixin + base class
    def speak(self):
        self.log("speaking politely")
        return super().speak().lower()


rex = ServiceDog("Rex", "Labrador")
print(rex.speak(), isinstance(rex, Animal))
print([c.__name__ for c in ServiceDog.__mro__])   # method resolution order`,
      },
    ],
    'Polymorphism': [
      {
        title: 'TypeScript — one interface, many forms',
        language: 'typescript',
        code: `interface Notifier {
  send(to: string, message: string): string;
}

class EmailNotifier implements Notifier {
  send(to: string, message: string) { return \`📧 \${to}: \${message}\`; }
}
class SmsNotifier implements Notifier {
  send(to: string, message: string) { return \`📱 \${to}: \${message.slice(0, 20)}\`; }
}
class SlackNotifier implements Notifier {
  send(to: string, message: string) { return \`💬 #\${to}: \${message}\`; }
}

// The caller doesn't know or care which concrete class it has
function broadcast(notifiers: Notifier[], msg: string) {
  notifiers.forEach(n => console.log(n.send("team", msg)));
}

broadcast([new EmailNotifier(), new SmsNotifier(), new SlackNotifier()], "Deploy finished successfully");`,
      },
      {
        title: 'Python — duck typing & operator overloading',
        language: 'python',
        code: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):          # v1 + v2
        return Vector(self.x + other.x, self.y + other.y)

    def __mul__(self, k):              # v * 3
        return Vector(self.x * k, self.y * k)

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"


print(Vector(1, 2) + Vector(3, 4), Vector(1, 1) * 3, Vector(1, 2) == Vector(1, 2))


# Duck typing: anything with .read() works — no shared base class needed
class FileSource:
    def read(self): return "from file"

class ApiSource:
    def read(self): return "from api"

for source in (FileSource(), ApiSource()):
    print(source.read())`,
      },
    ],
    'Interface': [
      {
        title: 'Java — interfaces with default methods',
        language: 'java',
        code: `public interface Shape {
    double area();                       // abstract

    default String describe() {          // shared implementation (Java 8+)
        return getClass().getSimpleName() + " with area " + String.format("%.2f", area());
    }

    static Shape unitSquare() { return new Square(1); }   // static factory
}

public interface Drawable { void draw(); }

// A class can implement MANY interfaces (but extend only one class)
public record Square(double side) implements Shape, Drawable {
    public double area() { return side * side; }
    public void draw() { System.out.println("□".repeat((int) side)); }
}`,
      },
      {
        title: 'Python — Protocol (structural typing)',
        language: 'python',
        code: `from typing import Protocol, runtime_checkable


@runtime_checkable
class Closeable(Protocol):
    def close(self) -> None: ...


class DbConnection:            # no inheritance needed — it just has close()
    def close(self) -> None:
        print("db closed")


class TempFile:
    def close(self) -> None:
        print("file deleted")


def shutdown(resources: list[Closeable]) -> None:
    for r in resources:
        r.close()


shutdown([DbConnection(), TempFile()])
print(isinstance(DbConnection(), Closeable))   # True`,
      },
    ],
    'SOLID Principles': [
      {
        title: 'S — Single Responsibility',
        language: 'typescript',
        explanation: 'A class should have **one reason to change**. Here formatting, persistence and email are separated, so changing the email provider does not touch invoice logic.',
        code: `// ❌ One class doing everything
class InvoiceGod {
  calculateTotal() { /* … */ }
  saveToDatabase() { /* … */ }
  sendEmail() { /* … */ }
  renderPdf() { /* … */ }
}

// ✅ Each class has one job
class Invoice {
  constructor(readonly lines: { price: number; qty: number }[]) {}
  total() { return this.lines.reduce((s, l) => s + l.price * l.qty, 0); }
}
class InvoiceRepository { save(inv: Invoice) { console.log("saved", inv.total()); } }
class InvoiceMailer { send(inv: Invoice, to: string) { console.log(\`mailed \${inv.total()} to \${to}\`); } }

const inv = new Invoice([{ price: 10, qty: 3 }]);
new InvoiceRepository().save(inv);
new InvoiceMailer().send(inv, "ada@example.com");`,
      },
      {
        title: 'O — Open/Closed',
        language: 'typescript',
        explanation: 'Open for **extension**, closed for **modification**: add a new discount type by adding a class, without editing a growing `switch` statement.',
        code: `interface DiscountRule { applies(total: number): boolean; apply(total: number): number; }

class BlackFriday implements DiscountRule {
  applies() { return true; }
  apply(t: number) { return t * 0.7; }
}
class BulkOrder implements DiscountRule {
  applies(t: number) { return t > 500; }
  apply(t: number) { return t - 50; }
}

class Checkout {
  constructor(private rules: DiscountRule[]) {}       // new rules plug in here
  price(total: number) {
    return this.rules.filter(r => r.applies(total)).reduce((t, r) => r.apply(t), total);
  }
}

console.log(new Checkout([new BulkOrder(), new BlackFriday()]).price(1000)); // 665`,
      },
      {
        title: 'L — Liskov Substitution',
        language: 'typescript',
        explanation: 'A subtype must be usable anywhere its parent is expected **without surprises**. The classic violation: a `Square` that extends `Rectangle` and breaks `setWidth`.',
        code: `// ❌ Violation: Penguin "is a" Bird but cannot fly → callers break
class Bird { fly() { return "flying"; } }
class Penguin extends Bird { fly(): string { throw new Error("Penguins can't fly"); } }

// ✅ Model capabilities explicitly
interface Animal { move(): string; }
interface Flyer { fly(): string; }

class Sparrow implements Animal, Flyer {
  move() { return this.fly(); }
  fly() { return "sparrow flying"; }
}
class Emperor implements Animal {
  move() { return "penguin swimming"; }
}

const zoo: Animal[] = [new Sparrow(), new Emperor()];
zoo.forEach(a => console.log(a.move()));   // every Animal behaves as promised`,
      },
      {
        title: 'I — Interface Segregation',
        language: 'typescript',
        explanation: 'Clients should not depend on methods they do not use. Split fat interfaces into small, role-based ones.',
        code: `// ❌ Fat interface: a simple printer must implement scan() and fax()
interface MultiFunctionDevice { print(doc: string): void; scan(): string; fax(n: string): void; }

// ✅ Small role interfaces
interface Printer { print(doc: string): void; }
interface Scanner { scan(): string; }

class BasicPrinter implements Printer {
  print(doc: string) { console.log("printing", doc); }
}
class OfficeMachine implements Printer, Scanner {
  print(doc: string) { console.log("office print", doc); }
  scan() { return "scanned.pdf"; }
}

const printers: Printer[] = [new BasicPrinter(), new OfficeMachine()];
printers.forEach(p => p.print("report.docx"));`,
      },
      {
        title: 'D — Dependency Inversion',
        language: 'typescript',
        explanation: 'High-level code depends on **abstractions**, and concrete implementations are **injected**. This is what makes code testable — swap the real database for an in-memory fake.',
        code: `interface UserRepository { findName(id: number): string | undefined; }

class SqlUserRepository implements UserRepository {
  findName(id: number) { return id === 1 ? "Ada (from SQL)" : undefined; }
}
class InMemoryUserRepository implements UserRepository {
  constructor(private data: Record<number, string>) {}
  findName(id: number) { return this.data[id]; }
}

class GreetingService {
  constructor(private readonly users: UserRepository) {}   // injected abstraction
  greet(id: number) { return \`Hello, \${this.users.findName(id) ?? "stranger"}!\`; }
}

console.log(new GreetingService(new SqlUserRepository()).greet(1));
console.log(new GreetingService(new InMemoryUserRepository({ 7: "Test User" })).greet(7)); // test double`,
      },
    ],
    'Composition vs Inheritance': [
      {
        title: 'Python — strategy objects instead of subclasses',
        language: 'python',
        code: `class FlyWithWings:
    def fly(self): return "flapping wings"

class CannotFly:
    def fly(self): return "can't fly"

class Quack:
    def sound(self): return "Quack!"

class Squeak:
    def sound(self): return "Squeak!"


class Duck:
    # HAS-A behaviours, swappable at runtime
    def __init__(self, name, fly_behaviour, sound_behaviour):
        self.name = name
        self.flyer = fly_behaviour
        self.voice = sound_behaviour

    def describe(self):
        return f"{self.name}: {self.flyer.fly()}, {self.voice.sound()}"


mallard = Duck("Mallard", FlyWithWings(), Quack())
rubber = Duck("Rubber duck", CannotFly(), Squeak())
print(mallard.describe())
print(rubber.describe())

rubber.flyer = FlyWithWings()          # behaviour changed without a new subclass
print(rubber.describe())`,
      },
    ],
  },

  sections: [
    {
      title: 'Constructors & Object Lifecycle',
      after: 'Object',
      content: `A **constructor** initialises a new object so it starts in a **valid state**. Every OOP language has the same lifecycle: *allocate → construct → use → become unreachable → clean up*.

### Constructor kinds

| Kind | Purpose |
|---|---|
| Default (no-arg) | Sensible defaults; required by some frameworks (JPA, serializers) |
| Parameterised | Require the data the object cannot live without |
| Copy constructor | Create a new object from an existing one |
| Constructor chaining | \`this(...)\` / \`super(...)\` reuse another constructor |
| Static factory | \`User.fromJson(...)\` — named, can cache or return subtypes |
| Builder | Many optional parameters without "telescoping" constructors |

### Language comparison

| | Java | C# | Python | TypeScript |
|---|---|---|---|---|
| Constructor | \`ClassName(...)\` | \`ClassName(...)\` | \`__init__\` | \`constructor\` |
| Call parent | \`super(...)\` | \`: base(...)\` | \`super().__init__()\` | \`super(...)\` |
| Clean-up | try-with-resources / \`AutoCloseable\` | \`using\` / \`IDisposable\` | \`with\` / context manager | \`try/finally\`, \`using\` (TS 5.2) |

### Tips

Validate arguments in the constructor, keep it free of heavy work (I/O, network), and prefer **immutable** objects (\`final\`/\`readonly\` fields) when possible. Do not rely on finalizers/destructors for releasing resources — use explicit clean-up.`,
      code: `import java.util.Objects;

public final class User {
    private final String email;   // immutable fields
    private final String name;
    private final String role;

    // Private constructor — creation goes through the builder or factories
    private User(Builder b) {
        this.email = Objects.requireNonNull(b.email, "email is required");
        this.name = b.name != null ? b.name : b.email.split("@")[0];
        this.role = b.role;
    }

    // Static factory with a meaningful name
    public static User guest() { return new Builder().email("guest@local").role("GUEST").build(); }

    public static Builder builder() { return new Builder(); }

    public static final class Builder {
        private String email, name, role = "USER";
        public Builder email(String v) { this.email = v; return this; }
        public Builder name(String v)  { this.name = v;  return this; }
        public Builder role(String v)  { this.role = v;  return this; }
        public User build() { return new User(this); }
    }

    @Override public String toString() { return name + " <" + email + "> " + role; }
}

// Usage
// User admin = User.builder().email("ada@dev.io").name("Ada").role("ADMIN").build();
// User guest = User.guest();

// Deterministic clean-up with try-with-resources
// try (var conn = dataSource.getConnection()) { ... }   // conn.close() always runs`,
      codeLabel: 'Builder, static factory and immutability (Java)',
      codeLanguage: 'java',
      examples: [
        {
          title: 'Python — classmethod factories & context manager',
          language: 'python',
          code: `import json


class Config:
    def __init__(self, host: str, port: int = 5432):
        if not 0 < port < 65536:
            raise ValueError("invalid port")
        self.host, self.port = host, port

    @classmethod
    def from_json(cls, text: str) -> "Config":      # alternative constructor
        return cls(**json.loads(text))

    @classmethod
    def local(cls) -> "Config":
        return cls("localhost")

    def __repr__(self):
        return f"Config({self.host}:{self.port})"


class Connection:
    def __init__(self, cfg: Config):
        self.cfg = cfg

    def __enter__(self):
        print("open", self.cfg)
        return self

    def __exit__(self, exc_type, exc, tb):
        print("closed")                       # runs even if an error occurred
        return False


print(Config.from_json('{"host": "db.prod", "port": 6543}'), Config.local())
with Connection(Config.local()) as conn:
    print("querying…")`,
        },
      ],
      keyPoints: [
        'Constructors must leave the object in a valid state — validate inputs.',
        'Use static factories or builders when constructors get long or ambiguous.',
        'Prefer immutable fields; they make objects thread-safe and predictable.',
        'Release resources explicitly (try-with-resources, using, with) — not in finalizers.',
      ],
    },
    {
      title: 'Static vs Instance Members',
      after: 'Constructors & Object Lifecycle',
      content: `**Instance members** belong to each object — every \`Car\` has its own \`speed\`. **Static (class) members** belong to the class itself and are shared by all instances.

| | Instance | Static |
|---|---|---|
| Accessed via | object (\`car.speed\`) | class (\`Car.count\`) |
| Can use \`this\` | ✅ | ❌ |
| Memory | one copy per object | one copy total |
| Typical use | object state & behaviour | counters, constants, factory methods, pure utilities |

### When to use static

- **Constants**: \`Math.PI\`, \`Integer.MAX_VALUE\`.
- **Factory methods**: \`List.of()\`, \`User.fromJson()\`.
- **Stateless helpers**: \`Collections.sort()\`, \`String.join()\`.

### Pitfalls

Mutable static state is effectively a **global variable**: it is shared across requests/threads, hard to test and a common source of concurrency bugs. Prefer dependency injection for shared services.`,
      code: `public class Order {
    // static: shared by every Order
    private static final AtomicInteger NEXT_ID = new AtomicInteger(1);
    public static final double TAX_RATE = 0.2;

    // instance: per Order
    private final int id;
    private final double net;

    public Order(double net) {
        this.id = NEXT_ID.getAndIncrement();
        this.net = net;
    }

    public double gross() { return net * (1 + TAX_RATE); }   // instance method uses static constant

    public static double sum(List<Order> orders) {           // static utility — no 'this'
        return orders.stream().mapToDouble(Order::gross).sum();
    }

    public int getId() { return id; }
}

// Order a = new Order(100), b = new Order(50);
// a.getId() == 1, b.getId() == 2
// Order.sum(List.of(a, b)) == 180.0`,
      codeLabel: 'Static counter, constant and utility (Java)',
      codeLanguage: 'java',
      examples: [
        {
          title: 'Python — class vs instance attributes',
          language: 'python',
          code: `class Counter:
    instances = 0                  # class attribute

    def __init__(self):
        Counter.instances += 1
        self.count = 0             # instance attribute

    def increment(self):
        self.count += 1

    @staticmethod
    def describe():                # no self / cls
        return "Counts things"

    @classmethod
    def total(cls):                # receives the class
        return f"{cls.__name__} created {cls.instances} times"


a, b = Counter(), Counter()
a.increment(); a.increment(); b.increment()
print(a.count, b.count, Counter.total(), Counter.describe())


# Pitfall: mutable class attribute shared by all instances
class Bad:
    items = []                     # shared list!

x, y = Bad(), Bad()
x.items.append(1)
print(y.items)                     # [1] — surprise`,
        },
      ],
      keyPoints: [
        'Static members belong to the class; instance members to each object.',
        'Static methods cannot access this/self.',
        'Good static uses: constants, factories, pure helpers.',
        'Avoid mutable static state — it behaves like a global variable.',
      ],
    },
    {
      title: 'Overloading vs Overriding',
      after: 'Polymorphism',
      content: `Both are forms of polymorphism, but they work at different times.

| | Overloading | Overriding |
|---|---|---|
| Kind | **Compile-time** (static) polymorphism | **Runtime** (dynamic) polymorphism |
| Where | Same class | Subclass redefines parent method |
| Signature | Same name, **different parameters** | Same name **and** parameters |
| Return type | Can differ | Same or covariant (subtype) |
| Decided by | Declared argument types | Actual object type at runtime |
| Keywords | — | Java \`@Override\`, C# \`virtual\`/\`override\`, TS \`override\` |

### Rules for overriding

- The method cannot be **more restrictive** (a \`public\` method cannot become \`private\`).
- It cannot throw broader checked exceptions (Java).
- \`static\`, \`private\` and \`final\` methods cannot be overridden (static methods are *hidden*).

### Language notes

Python and JavaScript do not support overloading by signature — the last definition wins. Use default parameters, \`*args\`, or \`functools.singledispatch\` instead. TypeScript supports **overload signatures** for typing, with a single implementation.`,
      code: `class Calculator {
    // Overloading: same name, different parameter lists
    int add(int a, int b)          { return a + b; }
    double add(double a, double b) { return a + b; }
    int add(int a, int b, int c)   { return a + b + c; }
}

class Animal {
    String sound() { return "..."; }
    Animal reproduce() { return new Animal(); }
}

class Dog extends Animal {
    @Override                      // compiler verifies a parent method exists
    String sound() { return "Woof"; }

    @Override
    Dog reproduce() { return new Dog(); }   // covariant return type
}

public class Demo {
    public static void main(String[] args) {
        Calculator c = new Calculator();
        System.out.println(c.add(1, 2));        // 3   -> add(int,int)
        System.out.println(c.add(1.5, 2.5));    // 4.0 -> add(double,double)

        Animal a = new Dog();                   // declared Animal, actual Dog
        System.out.println(a.sound());          // Woof — chosen at RUNTIME
    }
}`,
      codeLabel: 'Overloading and overriding (Java)',
      codeLanguage: 'java',
      examples: [
        {
          title: 'TypeScript — overload signatures',
          language: 'typescript',
          code: `function format(value: number): string;
function format(value: Date): string;
function format(value: string[]): string;
function format(value: number | Date | string[]): string {   // single implementation
  if (typeof value === "number") return value.toFixed(2);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value.join(", ");
}

console.log(format(3.14159), format(new Date(0)), format(["a", "b"]));

class Base { greet() { return "base"; } }
class Child extends Base {
  override greet() { return "child + " + super.greet(); }   // 'override' keyword (TS 4.3+)
}
console.log(new Child().greet());`,
        },
        {
          title: 'Python — singledispatch instead of overloading',
          language: 'python',
          code: `from functools import singledispatch
from datetime import date


@singledispatch
def describe(value):
    return f"object: {value!r}"

@describe.register
def _(value: int):
    return f"int with {len(str(abs(value)))} digits"

@describe.register
def _(value: list):
    return f"list of {len(value)} items"

@describe.register
def _(value: date):
    return f"date in {value.year}"


for v in (12345, [1, 2, 3], date(2026, 1, 1), 3.5):
    print(describe(v))`,
        },
      ],
      keyPoints: [
        'Overloading = same name, different parameters, resolved at compile time.',
        'Overriding = subclass replaces a parent method, resolved at runtime.',
        'Always mark overrides (@Override / override) so the compiler catches typos.',
        'Python/JS have no signature overloading — use defaults or singledispatch.',
      ],
    },
    {
      title: 'Abstract Class vs Interface',
      after: 'Interface',
      content: `Both define contracts that concrete classes must fulfil, but they model different relationships.

| | Abstract class | Interface |
|---|---|---|
| Relationship | **is-a** (shared identity) | **can-do** (capability) |
| Multiple inheritance | ❌ one parent class | ✅ implement many |
| State (fields) | ✅ instance fields | ❌ constants only (Java/C#) |
| Constructors | ✅ | ❌ |
| Method bodies | ✅ concrete + abstract | default methods (Java 8+, C# 8+) |
| Access modifiers | any | public (mostly) |
| Example | \`abstract class Vehicle\` | \`Comparable\`, \`Serializable\`, \`Closeable\` |

### Rule of thumb

- Start with an **interface** to define *what* something can do — it keeps coupling low and allows multiple capabilities.
- Add an **abstract class** when several implementations share **state and code** (template method pattern), often *implementing* the interface.

### In Python and TypeScript

Python uses \`abc.ABC\` for both (or \`typing.Protocol\` for structural interfaces). TypeScript interfaces exist only at compile time and are structural — any object with the right shape satisfies them.`,
      code: `// Capability contracts
interface Payable { BigDecimal amountDue(); }
interface Auditable { String auditTrail(); }

// Shared state + template method for all employees
abstract class Employee implements Payable, Auditable {
    protected final String name;
    private final List<String> log = new ArrayList<>();

    protected Employee(String name) { this.name = name; }

    // template method — fixed algorithm
    public final BigDecimal runPayroll() {
        BigDecimal due = amountDue();
        log.add("paid " + due + " to " + name);
        return due;
    }

    public String auditTrail() { return String.join("; ", log); }

    public abstract BigDecimal amountDue();   // varies per subclass
}

class SalariedEmployee extends Employee {
    private final BigDecimal monthly;
    SalariedEmployee(String n, BigDecimal monthly) { super(n); this.monthly = monthly; }
    public BigDecimal amountDue() { return monthly; }
}

class Contractor extends Employee {
    private final BigDecimal rate; private final int hours;
    Contractor(String n, BigDecimal rate, int hours) { super(n); this.rate = rate; this.hours = hours; }
    public BigDecimal amountDue() { return rate.multiply(BigDecimal.valueOf(hours)); }
}

// An Invoice is Payable but is NOT an Employee — interfaces allow that
record Invoice(BigDecimal total) implements Payable {
    public BigDecimal amountDue() { return total; }
}`,
      codeLabel: 'Interface for capability, abstract class for shared code (Java)',
      codeLanguage: 'java',
      keyPoints: [
        'Interface = capability contract; abstract class = shared identity + code.',
        'A class can implement many interfaces but extend one class.',
        'Abstract classes can hold state and constructors; interfaces cannot.',
        'Combine them: an abstract base class implementing one or more interfaces.',
      ],
    },
    {
      title: 'Object Relationships',
      after: 'Composition vs Inheritance',
      content: `Objects collaborate through relationships. Choosing the right one clarifies ownership and lifetime.

| Relationship | Meaning | Lifetime | UML | Example |
|---|---|---|---|---|
| **Dependency** | *uses* temporarily | none | dashed arrow | \`OrderService.place(order, mailer)\` |
| **Association** | *knows about* | independent | line | Teacher ↔ Student |
| **Aggregation** | *has-a* (weak) | parts can exist alone | hollow diamond ◇ | Team ◇— Player |
| **Composition** | *owns* (strong) | parts die with the whole | filled diamond ◆ | Order ◆— OrderLine |
| **Inheritance** | *is-a* | — | hollow triangle △ | Manager △— Employee |
| **Realisation** | *implements* | — | dashed triangle | ArrayList ⇢ List |

### Multiplicity

Relationships also have cardinality: one-to-one (User–Profile), one-to-many (Customer–Orders), many-to-many (Student–Course, usually via a join entity like Enrollment).

### Why it matters

These map directly onto code design (who creates and deletes what), database schemas (foreign keys, cascade delete) and ORMs (\`@OneToMany(cascade = ALL, orphanRemoval = true)\` expresses composition).`,
      code: `// Composition: OrderLines are created and owned by the Order
class Order {
    private final List<OrderLine> lines = new ArrayList<>();   // parts live inside

    void addItem(String sku, int qty, BigDecimal price) {
        lines.add(new OrderLine(sku, qty, price));             // whole creates the part
    }
    BigDecimal total() {
        return lines.stream().map(OrderLine::subtotal).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
record OrderLine(String sku, int qty, BigDecimal price) {
    BigDecimal subtotal() { return price.multiply(BigDecimal.valueOf(qty)); }
}

// Aggregation: Players exist independently and can move between teams
class Team {
    private final Set<Player> players = new HashSet<>();
    void sign(Player p)    { players.add(p); }        // received from outside
    void release(Player p) { players.remove(p); }     // player still exists
}
record Player(String name) {}

// Association: both sides know each other, neither owns the other
class Teacher { final List<Student> students = new ArrayList<>(); }
class Student { final List<Teacher> teachers = new ArrayList<>(); }

// Dependency: used only for the duration of a call
class OrderService {
    void place(Order order, EmailSender mailer) {   // not stored as a field
        mailer.send("Order total: " + order.total());
    }
}
interface EmailSender { void send(String body); }`,
      codeLabel: 'Composition, aggregation, association, dependency (Java)',
      codeLanguage: 'java',
      keyPoints: [
        'Composition: the whole owns and controls the lifetime of its parts.',
        'Aggregation: parts are shared and outlive the container.',
        'Association: objects know each other without ownership.',
        'Dependency: a temporary "uses" relationship, e.g. a method parameter.',
      ],
    },
    {
      title: 'OOP Design Patterns in Practice',
      after: 'SOLID Principles',
      content: `Design patterns are proven OOP solutions to recurring problems. These five appear in almost every codebase — see the **Design Patterns** course for the full catalogue.

| Pattern | Problem it solves | You have seen it in… |
|---|---|---|
| **Factory** | Create objects without hard-coding concrete classes | \`Calendar.getInstance()\`, \`React.createElement\` |
| **Singleton** | Exactly one shared instance | Loggers, configuration (prefer DI scopes) |
| **Strategy** | Swap algorithms at runtime | Sorting comparators, payment providers |
| **Observer** | Notify many listeners of changes | DOM events, RxJS, Kafka consumers |
| **Decorator** | Add behaviour without subclassing | Java I/O streams, Python \`@decorators\`, middleware |

The example below implements all five in TypeScript and can be run in the Playground.`,
      code: `// Factory
interface Shape { area(): number; }
class Circle implements Shape { constructor(private r: number) {} area() { return Math.PI * this.r ** 2; } }
class Square implements Shape { constructor(private s: number) {} area() { return this.s ** 2; } }
const ShapeFactory = {
  create(kind: "circle" | "square", size: number): Shape {
    return kind === "circle" ? new Circle(size) : new Square(size);
  },
};

// Singleton
class Config {
  private static instance?: Config;
  private constructor(readonly env = "production") {}
  static get(): Config { return (Config.instance ??= new Config()); }
}

// Strategy
type SortStrategy = (a: number, b: number) => number;
const ascending: SortStrategy = (a, b) => a - b;
const descending: SortStrategy = (a, b) => b - a;
const sortWith = (data: number[], strategy: SortStrategy) => [...data].sort(strategy);

// Observer
class Subject<T> {
  private observers = new Set<(value: T) => void>();
  subscribe(fn: (value: T) => void) { this.observers.add(fn); return () => this.observers.delete(fn); }
  notify(value: T) { this.observers.forEach(fn => fn(value)); }
}

// Decorator
interface DataSource { read(): string; }
class FileSource implements DataSource { read() { return "data"; } }
class Encrypted implements DataSource {
  constructor(private inner: DataSource) {}
  read() { return \`encrypted(\${this.inner.read()})\`; }
}
class Compressed implements DataSource {
  constructor(private inner: DataSource) {}
  read() { return \`compressed(\${this.inner.read()})\`; }
}

console.log(ShapeFactory.create("circle", 1).area().toFixed(2));
console.log(Config.get() === Config.get(), Config.get().env);
console.log(sortWith([3, 1, 2], ascending), sortWith([3, 1, 2], descending));
const prices = new Subject<number>();
const stop = prices.subscribe(p => console.log("price changed:", p));
prices.notify(101); stop(); prices.notify(102);
console.log(new Compressed(new Encrypted(new FileSource())).read());`,
      codeLabel: 'Five essential patterns (TypeScript)',
      codeLanguage: 'typescript',
      keyPoints: [
        'Factory hides which concrete class is created.',
        'Strategy and Decorator favour composition over inheritance.',
        'Observer decouples event producers from consumers.',
        'Singletons are global state — prefer dependency-injection scopes.',
      ],
    },
    {
      title: 'OOP Interview Questions',
      after: 'Advantages & Disadvantages',
      content: `Quick answers to the questions asked most often in OOP interviews.

**1. What are the four pillars of OOP?**
Encapsulation (hide state behind methods), Abstraction (expose *what*, hide *how*), Inheritance (reuse via is-a), Polymorphism (one interface, many implementations).

**2. Encapsulation vs abstraction?**
Encapsulation is about **protecting data** (private fields + controlled access). Abstraction is about **hiding complexity** (interfaces, abstract classes). Encapsulation is *how* you implement abstraction.

**3. Can you instantiate an abstract class?**
No. You can only instantiate a concrete subclass (or an anonymous subclass in Java).

**4. Why is multiple class inheritance not allowed in Java/C#?**
To avoid the **diamond problem** — ambiguity when two parents define the same method. Interfaces allow multiple inheritance of *type*; default-method conflicts must be resolved explicitly.

**5. What is the difference between \`==\` and \`equals()\`?**
\`==\` compares references (same object); \`equals()\` compares logical value. Overriding \`equals\` requires overriding \`hashCode\` consistently.

**6. Composition vs inheritance?**
Prefer composition (has-a) for flexibility; use inheritance only for true is-a relationships that satisfy Liskov substitution.

**7. What is dynamic dispatch?**
The runtime chooses which overridden method to execute based on the **actual** object type, not the declared variable type.

**8. What is a "tight coupling" smell?**
A class creates its own dependencies with \`new\`, making it hard to test. Fix it with dependency injection and interfaces.

**9. What is an immutable object and why use it?**
An object whose state cannot change after construction (\`final\` fields, no setters). It is thread-safe, cacheable and easy to reason about — e.g. \`String\`, Java records.

**10. What is the difference between a class and an object?**
A class is a **blueprint** (type definition); an object is an **instance** of that blueprint living in memory with its own state.`,
      code: `// equals/hashCode contract (Q5) — records generate both automatically
record Point(int x, int y) {}

public class InterviewDemo {
    public static void main(String[] args) {
        Point a = new Point(1, 2);
        Point b = new Point(1, 2);
        System.out.println(a == b);          // false — different objects
        System.out.println(a.equals(b));     // true  — same value
        System.out.println(new java.util.HashSet<>(java.util.List.of(a, b)).size()); // 1

        // Dynamic dispatch (Q7)
        Object o = "hello";
        System.out.println(o.toString());   // String.toString() runs, not Object's
    }
}

// Diamond problem with default methods (Q4) — must be resolved explicitly
interface A { default String hi() { return "A"; } }
interface B { default String hi() { return "B"; } }
class C implements A, B {
    public String hi() { return A.super.hi() + B.super.hi(); }   // "AB"
}`,
      codeLabel: 'Interview concepts in code (Java)',
      codeLanguage: 'java',
      keyPoints: [
        'Be able to explain the four pillars with a concrete example each.',
        'Know equals/hashCode, dynamic dispatch and the diamond problem.',
        'Prefer composition and dependency injection; justify inheritance with LSP.',
      ],
    },
  ],
};

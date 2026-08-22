export const javaCourse = {
  id: 'java', title: 'Java', description: 'Enterprise-grade, platform-independent programming language.',
  officialDocs: 'https://docs.oracle.com/en/java/', tutorialLink: 'https://www.w3schools.com/java/', exerciseLink: 'https://www.w3schools.com/java/java_exercises.asp',
  sections: [
    { title: 'What is Java', content: `**Java** is a popular *high-level*, *object-oriented* programming language originally developed by **Sun Microsystems** and released in **1995**. Currently owned by **Oracle**, more than **3 billion devices** run Java. It runs on a variety of platforms, such as *Windows*, *Mac OS*, and various versions of *UNIX/Linux*.

Java was initially designed to work on embedded systems, set-top boxes, and television. By requirement, it was designed to work on varied platforms. Over multiple years, Java evolved to become one of the most popular languages for **internet-based applications** and **enterprise software**.

### Write Once, Run Anywhere

Java follows the "**Write Once, Run Anywhere**" (**WORA**) principle. Source code compiles into **bytecode** that runs on the **Java Virtual Machine** (\`JVM\`), making it *platform-independent*. Java is **statically typed** (types checked at compile time), **strongly typed** (no implicit dangerous conversions), **garbage collected** (memory managed automatically), and **multi-threaded** (built-in concurrent programming support). Modern Java (17+) has introduced \`records\`, *pattern matching*, \`sealed classes\`, and *virtual threads*. See the [official Java documentation](https://docs.oracle.com/en/java/) for the latest features.`, keyPoints: ['Write Once, Run Anywhere — platform-independent via JVM.', 'Originally developed by Sun Microsystems (1995), now owned by Oracle.', 'Over 3 billion devices run Java worldwide.', 'Statically typed, garbage collected, multi-threaded.', 'Dominant in enterprise, Android, and big data.'] },
    
    { title: 'JVM Architecture', content: `The **Java Virtual Machine** (\`JVM\`) is the heart of Java's *platform independence*. When you write Java code, you create a \`.java\` file. You compile it into **bytecode** (a \`.class\` file). This bytecode isn't machine code — it's a middle-ground language. The \`JVM\` takes that bytecode and executes it on whatever device you're using.

### JVM Subsystems

The JVM is divided into three main subsystems:

### A. Class Loader Subsystem

The "delivery service." It **loads**, **links**, and **initializes** \`.class\` files when they are first referenced during runtime.

### B. Runtime Data Areas (Memory)

How the JVM organizes memory: **Method Area** (stores class structures, metadata, constant pools), **Heap Area** (where all Objects live — *most important for performance tuning*), **Stack Area** (stores local variables — each thread has its own stack), **PC Registers** (tracks current instruction being executed).

### C. Execution Engine

Where actual work happens: **Interpreter** (reads bytecode one-by-one), **JIT Compiler** (compiles "hot" code directly to *native machine code* for speed), **Garbage Collector** (the automated janitor — identifies unused objects and frees memory).`, image: '/images/java/java-jvm-architecture.svg', keyPoints: ['JVM enables platform independence — bytecode runs identically everywhere.', 'Class Loader loads, links, and initializes .class files.', 'Heap Area is where all objects live — key for performance tuning.', 'JIT Compiler optimizes frequently-used code to native machine code.', 'Garbage Collector automatically manages memory allocation/deallocation.'] },
    
    { title: 'Installation & Setup', content: `To develop Java, you need the **Java Development Kit** (\`JDK\`), which includes the compiler (\`javac\`), the runtime (\`JRE\`/\`JVM\`), and development tools. **Eclipse Temurin** (OpenJDK) is the community favorite for being *free and open-source*.

Step 1: Download the JDK from Adoptium (Temurin) or Oracle. Choose your OS — Windows (.msi/.exe), macOS (.pkg — x64 for Intel, aarch64 for Apple Silicon), Linux (package manager e.g., sudo apt install openjdk-25-jdk). Run the installer and enable "Add to PATH" / "Set JAVA_HOME".

Step 2: Configure Environment Variables. On Windows: search "Edit system environment variables" → Environment Variables → create JAVA_HOME pointing to your JDK path → add %JAVA_HOME%\\bin to Path. On macOS/Linux: add export JAVA_HOME and export PATH=$JAVA_HOME/bin:$PATH to ~/.zshrc or ~/.bashrc.

Step 3: Verify by running java -version in a new terminal. Step 4: Pick an IDE — IntelliJ IDEA (industry standard, free Community Edition), Eclipse, or VS Code.`, image: '/images/java/java-setup.svg', code: `# macOS/Linux — Set environment variables
export JAVA_HOME=$(/usr/libexec/java_home)  # macOS
# OR: export JAVA_HOME=/usr/lib/jvm/java-25-openjdk  # Linux
export PATH=$JAVA_HOME/bin:$PATH

# Verify installation
java -version
javac -version

# Windows — Environment Variables
# JAVA_HOME = C:\\Program Files\\Eclipse Adoptium\\jdk-25.x.x
# Path += %JAVA_HOME%\\bin`, codeLabel: 'Environment Setup Commands', keyPoints: ['Download JDK from Adoptium (Temurin) or Oracle.', 'Set JAVA_HOME environment variable pointing to JDK path.', 'Add %JAVA_HOME%/bin to system PATH.', 'Verify with java -version in a new terminal.', 'IntelliJ IDEA is the recommended IDE.'] },
    
    { title: 'Program Structure', content: `Every Java program starts with a **class**. The filename must *exactly match* the public class name (*case-sensitive*). The main method is the entry point: \`public static void main(String[] args)\`.

### Breaking Down the Structure

\`public class Main\` — **public** is an Access Modifier (visible to entire project), **class** tells Java we're defining a blueprint, **Main** is the class name (must start with capital letter). \`public static void main(String[] args)\` — this is the **Entry Point** the \`JVM\` looks for. \`static\` allows calling without creating an instance, \`void\` means no return value, \`String[] args\` accepts command-line arguments.

\`System.out.println()\` — System is a built-in class, out is the output stream, println prints text and moves to next line.

Basic rules: Java is case-sensitive (Main ≠ main). Every statement ends with a semicolon (;). Curly braces {} define scope of classes and methods. To run: first compile with "javac Main.java" (creates bytecode), then execute with "java Main".`, image: '/images/java/java-program-execution.svg', code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Compile and Run:
// javac Main.java   → Creates Main.class (bytecode)
// java Main         → JVM executes the bytecode

// With packages:
package com.quickdevguide;

import java.util.ArrayList;

public class App {
    public static void main(String[] args) {
        var items = new ArrayList<String>();
        items.add("Java");
        items.add("Spring");

        for (String item : items) {
            System.out.println("Course: " + item);
        }
    }
}`, codeLabel: 'Java Program Structure', keyPoints: ['Filename must match public class name exactly.', 'main(String[] args) is the JVM entry point.', 'Compile: javac Main.java → Execute: java Main.', 'Java is case-sensitive; every statement ends with semicolon.', 'Curly braces {} define scope of classes and methods.'] },
    
    { title: 'Packages & Comments', content: `A **package** is a namespace that groups related classes and interfaces together — like a *folder* for Java classes. Packages help organize large projects, avoid class name conflicts, control access using access modifiers, and enable code reuse.

### Built-in Packages

\`java.lang\` (imported automatically), \`java.util\` (collections, date), \`java.io\` (input/output). Creating your own: use the "package" keyword as the first line (e.g., package com.mycompany.app;). Importing: import a single class (import java.util.Scanner;), import entire package (import java.util.*;), or use fully qualified name. Sub-packages can be nested (e.g., com.company.project.module) but don't automatically inherit from parent packages.

Comments are non-executable statements the compiler ignores. Three types: Single-line (// comment), Multi-line (/* ... */), and Javadoc (/** ... */ for generating documentation). Use comments to explain complex logic, not to state the obvious.`, code: `// Package declaration (must be first line)
package com.mycompany.app;

// Importing classes
import java.util.Scanner;    // Single class
import java.util.*;          // Entire package

public class MyClass {
    public void show() {
        System.out.println("Hello from package!");
    }
}

// Using from another file:
import com.mycompany.app.MyClass;

public class Test {
    public static void main(String[] args) {
        MyClass obj = new MyClass();
        obj.show();
    }
}

// Comments:
int speed = 100; // Single-line comment

/* Multi-line comment:
   calculates compound interest
   based on monthly deposit */
double interest = principal * Math.pow(1 + rate, time);`, codeLabel: 'Packages & Comments', keyPoints: ['Packages organize classes and prevent naming conflicts.', 'java.lang is imported automatically in every Java program.', 'Package statement must be the first line of the source file.', 'Sub-packages do NOT automatically inherit parent package classes.', 'Three comment types: single-line (//), multi-line (/* */), Javadoc (/** */).'] },
    
    { title: 'Data Types & Wrapper Classes', content: `In Java, **data types** specify the size and type of values stored in a variable. Since Java is *statically typed*, you must declare the type before use. Types are divided into **Primitive** and **Non-Primitive**.

### 8 Primitive Types

\`byte\` (8-bit), \`short\` (16-bit), \`int\` (32-bit), \`long\` (64-bit), \`float\` (32-bit decimal), \`double\` (64-bit decimal), \`boolean\`, and \`char\`. Primitives are stored on the **stack** and are very fast.

### Non-Primitive (Reference) Types

\`String\` (character sequences), **Arrays** (multiple values of same type), **Classes & Interfaces** (user-defined types). These refer to objects in **heap memory**.

### Wrapper Classes

**Wrapper classes** wrap primitives into objects (\`int\` → \`Integer\`, \`double\` → \`Double\`, etc.). Why? Collections cannot store primitives — you need \`ArrayList<Integer>\`, not \`ArrayList<int>\`. **Autoboxing** automatically converts primitive to wrapper; **Unboxing** converts wrapper back to primitive. Important: Wrapper objects can be \`null\` (\`Integer x = null\`), but unboxing null throws \`NullPointerException\` — a *very common bug* to watch for.`, code: `// Primitive types
int age = 25;
double price = 19.99;
char grade = 'A';
boolean isJavaFun = true;

// Wrapper Classes (Autoboxing & Unboxing)
Integer boxed = 42;          // Autoboxing: int → Integer
int unboxed = boxed;         // Unboxing: Integer → int

// Collections require wrapper classes
ArrayList<Integer> list = new ArrayList<>(); // Correct
// ArrayList<int> list;  // WRONG — primitives not allowed

// Useful wrapper methods
int parsed = Integer.parseInt("123");     // String → int
String str = Integer.toString(123);       // int → String
int max = Integer.MAX_VALUE;              // 2147483647

// WARNING: Null problem
Integer x = null;
// int y = x;  // NullPointerException at runtime!

// Type Casting
int myInt = 9;
double myDouble = myInt;           // Widening (auto): int → double
double val = 9.78;
int truncated = (int) val;         // Narrowing (manual): 9.78 → 9`, codeLabel: 'Data Types, Wrappers & Casting', keyPoints: ['8 primitive types; each has a corresponding wrapper class.', 'Collections require wrapper classes, not primitives.', 'Autoboxing: primitive → wrapper. Unboxing: wrapper → primitive.', 'Unboxing null throws NullPointerException — common bug!', 'Widening casting is automatic; narrowing requires explicit cast.'] },
    
    { title: 'Enums & Control Flow', content: `An **enum** (*enumeration*) is a special data type representing a **fixed set of constants**. Enums are *type-safe*, *readable*, and reduce bugs compared to integer constants. Enum constructors are always \`private\`. Enums can have variables, constructors, and methods, and work perfectly with \`switch\` statements.

### Decision Making (Control Flow)

**Control flow** allows programs to execute different code blocks based on conditions. Java provides: \`if\` (run code if condition is true), \`if-else\` (two branches), \`if-else if-else\` (multiple conditions — checks top to bottom, stops at first true), and \`switch\` (compare one variable against multiple values — cleaner than long if-else chains).

### Loop Statements

**Loops** repeat code blocks: \`for\` (known iteration count), \`while\` (unknown iterations), \`do-while\` (runs at least once), enhanced \`for-each\` (iterate arrays/collections). Loop control: \`break\` (stops loop completely), \`continue\` (skips current iteration). Nested loops place one loop inside another.`, image: '/images/java/java-control-flow.svg', code: `// Enum with fields and constructor
enum Level {
    LOW(1), MEDIUM(2), HIGH(3);
    private int value;
    Level(int value) { this.value = value; }
    public int getValue() { return value; }
}

// Enum with switch
enum TrafficLight { RED, YELLOW, GREEN }
TrafficLight light = TrafficLight.RED;
switch (light) {
    case RED:    System.out.println("Stop"); break;
    case YELLOW: System.out.println("Get Ready"); break;
    case GREEN:  System.out.println("Go"); break;
}

// Loop types
for (int i = 1; i <= 5; i++) { System.out.println(i); }

int i = 1;
while (i <= 5) { System.out.println(i); i++; }

// Enhanced for-each
int[] numbers = {10, 20, 30, 40};
for (int num : numbers) { System.out.println(num); }

// Grading with if-else if
int marks = 72;
if (marks >= 90) System.out.println("Grade A");
else if (marks >= 75) System.out.println("Grade B");
else if (marks >= 50) System.out.println("Grade C");
else System.out.println("Fail");`, codeLabel: 'Enums, Decision Making & Loops', keyPoints: ['Enums are type-safe constants with optional fields and methods.', 'if-else if checks conditions top to bottom, stops at first true.', 'switch is cleaner than long if-else chains for value comparison.', 'Four loop types: for, while, do-while, enhanced for-each.', 'break stops loop; continue skips current iteration.'] },
    
    { title: 'Access Modifiers & OOP', content: `**Access modifiers** control where a class, variable, method, or constructor can be accessed from. Java has **4 access specifiers**:

### The Four Modifiers

**public** — Accessible from *anywhere*. Best for APIs and main classes.
**private** — Accessible only inside the *same class*. Used for **data hiding**, accessed via getters/setters.
**default** (*package-private*) — No keyword used. Accessible only within the *same package*. Useful for internal package logic.
**protected** — Accessible within the same package AND in *subclasses* (even in different packages).

### OOP Foundations

Java is fundamentally *object-oriented*. Everything exists inside a class. Java supports **single inheritance** (\`extends\` one class) and **multiple interface implementation** (\`implements\` multiple interfaces). **Interfaces** define contracts — *what* a class must do, but not *how*. Since Java 8, interfaces can have \`default\` methods. **Abstract classes** provide *partial implementation* — some concrete methods, some abstract.`, code: `// Access Modifiers
public class Test {
    public int x = 10;       // Anywhere
    private int y = 20;      // Same class only
    int z = 30;              // Same package (default)
    protected int w = 40;    // Same package + subclasses
}

class Parent {
    protected int value = 10;
}
class Child extends Parent {
    void display() { System.out.println(value); } // OK
}

// Interface + Abstract class
public interface Printable {
    void print();
    default String format() { return toString(); }
}

public abstract class Shape {
    protected String color;
    public Shape(String color) { this.color = color; }
    public abstract double area(); // Must be implemented
    public String describe() { return color + " shape"; }
}

public class Circle extends Shape implements Printable {
    private final double radius;
    public Circle(String color, double radius) {
        super(color); this.radius = radius;
    }
    @Override public double area() { return Math.PI * radius * radius; }
    @Override public void print() { System.out.println(describe()); }
}`, codeLabel: 'Access Modifiers & OOP Patterns', keyPoints: ['public: anywhere. private: same class. default: same package. protected: package + subclasses.', 'Use the most restrictive access modifier possible.', 'Single inheritance + multiple interface implementation.', 'Interfaces = contracts. Abstract classes = partial implementation.', 'Sealed classes (Java 17+) restrict inheritance hierarchies.'] },
    
    { title: 'Exception Handling', content: `**Exception handling** is a robust mechanism for managing *runtime errors*. It allows a program's normal flow to continue smoothly rather than crashing abruptly. In Java, exceptions are *first-class objects* containing vital debugging information — error type, program state, and call stack.

### The Throwable Hierarchy

\`Throwable\` splits into **Error** (*fatal* — \`OutOfMemoryError\`, \`StackOverflowError\` — don't catch these) and **Exception** (*recoverable*). Exceptions divide into **Checked** (enforced at compile-time — \`FileNotFoundException\`, must use \`try-catch\` or \`throws\`) and **Unchecked** (\`RuntimeException\` — \`NullPointerException\`, \`ArithmeticException\` — represent bugs, fix the code).

### Exception Flow

**Throwing** — when an error occurs, an exception object is handed to the runtime. **Catching** — the runtime searches the call stack for a handler. If unhandled, the \`JVM\` prints the exception and terminates.

### Advanced Features

**Exception Chaining** preserves the original stack trace when wrapping exceptions. **Try-with-Resources** (Java 7+) automatically closes \`AutoCloseable\` resources. **Custom Exceptions** bridge technical errors and business logic.`, image: '/images/java/java-throwable-hierarchy.svg', code: `// Basic try-catch
public void performDivision(int numerator, int denominator) {
    try {
        int result = numerator / denominator;
        System.out.println("Result: " + result);
    } catch (ArithmeticException e) {
        System.err.println("Error: Cannot divide by zero.");
        System.err.println("Details: " + e.getMessage());
    }
    System.out.println("Calculation complete.");
}

// Try-with-resources (auto-closes resources)
try (BufferedReader br = new BufferedReader(new FileReader("path"))) {
    // use br — automatically closed when done
} catch (IOException e) {
    // handle error
}

// Custom Exception
class InsufficientFundsException extends Exception {
    private double shortfall;
    public InsufficientFundsException(double shortfall, String msg) {
        super(msg);
        this.shortfall = shortfall;
    }
    public double getShortfall() { return shortfall; }
}

// Exception Chaining
try {
    throw new IOException("Socket timeout");
} catch (IOException e) {
    throw new DatabaseException("DB connection failed", e);
}`, codeLabel: 'Exception Handling Patterns', keyPoints: ['Throwable → Error (fatal, don\'t catch) + Exception (recoverable).', 'Checked exceptions: compile-time enforced. Unchecked: runtime bugs.', 'Try-with-resources auto-closes AutoCloseable resources (Java 7+).', 'Exception chaining preserves original stack trace for debugging.', 'Custom exceptions bridge technical errors and business logic.'] },
    
    { title: 'Collections Framework', content: `The **Java Collections Framework** (\`JCF\`) is a unified architecture for efficient *representation*, *organization*, and *manipulation* of collections. It replaced older ad-hoc classes like \`Vector\` and \`Hashtable\` with a standard suite of optimized interfaces and implementations (JDK 1.2).

### List Interface

**List** — Ordered collections allowing duplicates: \`ArrayList\` (backed by dynamic array — fast random access \`O(1)\`, slow deletion \`O(n)\`), \`LinkedList\` (doubly-linked nodes — fast insertion/deletion \`O(1)\`, slow access \`O(n)\`), \`Vector\` (synchronized but slow — prefer \`ArrayList\`).

### Set Interface

**Set** — Guarantees uniqueness: \`HashSet\` (\`HashMap\` internally — no ordering, \`O(1)\` speed), \`TreeSet\` (Red-Black Tree — sorted order, \`O(log n)\`), \`LinkedHashSet\` (preserves insertion order — great for caches).

### Queue Interface

**Queue** — Holds elements prior to processing: \`PriorityQueue\` (priority heap — head is always the "least" element), \`ArrayDeque\` (double-ended queue — faster than \`Stack\` and \`LinkedList\`).

### Map Interface

**Map** — Key-value relationships: \`HashMap\` (modern standard — \`O(1)\`, no ordering, Java 8+ uses tree optimization for collisions), \`TreeMap\` (Red-Black Tree — sorted keys, \`O(log n)\`), \`Hashtable\` (legacy, synchronized — slower).`, image: '/images/java/java-collections-framework.svg', code: `// List — ArrayList vs LinkedList
List<String> arrayList = new ArrayList<>();
arrayList.add("Data 1");
arrayList.add("Data 2");
arrayList.get(1);  // Fast random access O(1)

List<String> linkedList = new LinkedList<>();
linkedList.add(0, "New Start"); // Fast insertion O(1)

// Set — Unique elements
Set<String> hashSet = new HashSet<>();   // Random order
Set<String> treeSet = new TreeSet<>();   // Sorted order
hashSet.add("Banana"); hashSet.add("Apple");

// Queue & Stack
Queue<Integer> pq = new PriorityQueue<>();
pq.add(30); pq.add(10); pq.add(20);
pq.peek();  // 10 (lowest priority head)

Deque<String> stack = new ArrayDeque<>();
stack.push("First"); stack.push("Second");
stack.pop();  // "Second" (LIFO)

// Map — Key-Value pairs
Map<Integer, String> map = new HashMap<>();
map.put(100, "Amit"); map.put(102, "Ravi");

Map<Integer, String> sorted = new TreeMap<>(map);
// {100=Amit, 102=Ravi} — auto sorted by key

// Immutable collections (Java 9+)
var colors = List.of("Red", "Blue", "Green");
var config = Map.of("host", "localhost", "port", "8080");`, codeLabel: 'Collections Framework', keyPoints: ['ArrayList: fast read O(1). LinkedList: fast insert/delete O(1).', 'HashSet: no order, fast. TreeSet: sorted. LinkedHashSet: insertion order.', 'PriorityQueue: priority-based ordering. ArrayDeque: fast stack/queue.', 'HashMap: O(1) unordered. TreeMap: O(log n) sorted keys.', 'Use List.of(), Set.of(), Map.of() for immutable collections (Java 9+).'] },

    { title: 'Functional Interfaces & Lambdas', content: `**Functional programming** in Java was introduced in **Java 8**, allowing functions to be treated as first-class citizens. A **Functional Interface** is an interface that contains **exactly one abstract method** (SAM - Single Abstract Method). It can have any number of \`default\` or \`static\` methods.

### The @FunctionalInterface Annotation

The \`@FunctionalInterface\` annotation is optional but recommended; it instructs the Java compiler to verify that the interface has only one abstract method.

### Core Built-in Functional Interfaces (\`java.util.function\`)

| Interface | Method Signature | Purpose | Example Use Case |
|---|---|---|---|
| **\`Predicate<T>\`** | \`boolean test(T t)\` | Evaluates a condition | Filtering: \`p -> p.getPrice() > 100\` |
| **\`Function<T, R>\`** | \`R apply(T t)\` | Transforms input type \`T\` to \`R\` | Mapping: \`User::getEmail\` |
| **\`Consumer<T>\`** | \`void accept(T t)\` | Performs action, returns nothing | Printing / Saving: \`System.out::println\` |
| **\`Supplier<T>\`** | \`T get()\` | Produces a value, takes no input | Factory / Lazy eval: \`() -> UUID.randomUUID()\` |
| **\`UnaryOperator<T>\`** | \`T apply(T t)\` | Function where input & output are same | String transform: \`String::toUpperCase\` |
| **\`BinaryOperator<T>\`** | \`T apply(T t1, T t2)\` | Combines 2 values of same type | Math reduce: \`Integer::sum\` |
| **\`BiPredicate<T, U>\`** | \`boolean test(T t, U u)\` | 2-argument condition | Equality check: \`(a, b) -> a.equals(b)\` |
| **\`BiFunction<T, U, R>\`**| \`R apply(T t, U u)\` | Maps 2 arguments to result | Calculator: \`(x, y) -> x * y\` |
| **\`BiConsumer<T, U>\`** | \`void accept(T t, U u)\`| Consumes 2 arguments | Map iteration: \`(k, v) -> print(k, v)\` |

### Method References (\`::\`)

Method references provide compact, readable syntax for lambdas that simply forward parameters to an existing method:

1. **Static Method**: \`ClassName::staticMethod\` (e.g., \`Math::max\`)
2. **Instance Method of Object**: \`instance::instanceMethod\` (e.g., \`System.out::println\`)
3. **Instance Method of Arbitrary Object**: \`ClassName::method\` (e.g., \`String::toLowerCase\`)
4. **Constructor Reference**: \`ClassName::new\` (e.g., \`ArrayList::new\` or \`User::new\`)

### Variable Capture (Effectively Final)

Lambdas can access local variables from enclosing scopes only if those variables are **final** or **effectively final** (never reassigned after initialization).`, code: `// 1. Custom Functional Interface
@FunctionalInterface
public interface PaymentValidator {
    boolean validate(double amount, String currency);
}

// Usage with Lambda:
PaymentValidator validator = (amt, curr) -> amt > 0 && "USD".equalsIgnoreCase(curr);
System.out.println("Valid: " + validator.validate(150.0, "USD"));

// 2. Built-in Functional Interfaces in Action
import java.util.function.*;

// Predicate: check condition
Predicate<String> isEmail = s -> s != null && s.contains("@");
Predicate<String> isLongEnough = s -> s.length() >= 5;
Predicate<String> isValidUser = isEmail.and(isLongEnough);

// Function: Transform Object -> DTO
Function<User, UserDto> userMapper = u -> new UserDto(u.getId(), u.getName());

// Consumer: Perform side effect
Consumer<String> logger = msg -> System.out.println("[LOG] " + msg);

// Supplier: Lazy initialization
Supplier<Double> randomScore = () -> Math.random() * 100;

// BinaryOperator: Accumulation
BinaryOperator<Integer> multiplier = (a, b) -> a * b;

// 3. Method References
List<String> rawNames = List.of("alice", "bob", "charlie");

// Class::instanceMethod
List<String> upperNames = rawNames.stream()
    .map(String::toUpperCase)
    .toList();

// Class::new (Constructor reference)
Function<String, StringBuilder> sbFactory = StringBuilder::new;`, codeLabel: 'Functional Interfaces & Method References', keyPoints: ['Functional Interface has exactly 1 abstract method (SAM).', '@FunctionalInterface annotation enforces SAM contract at compile time.', 'Core interfaces: Predicate (boolean), Function (map), Consumer (void), Supplier (get).', 'Method references (::) simplify lambdas that delegate to existing methods.', 'Captured local variables must be final or effectively final.'] },

    { title: 'Stream API Deep-Dive', image: '/images/java/java-streams-pipeline.svg', content: `The **Stream API** (\`java.util.stream\`) provides a functional, declarative approach to processing sequences of elements. Streams do not store data; they operate on a data source (collection, array, I/O channel) and produce a result without mutating the original source.

### Stream Pipeline Architecture

A Stream pipeline consists of three core phases:

\`\`\`text
[ Data Source ] ──▶ [ Intermediate Operations (Lazy) ] ──▶ [ Terminal Operation (Eager) ]
Collection / Array       filter(), map(), sorted(), flatMap()        collect(), reduce(), count()
\`\`\`

1. **Source**: Supplies elements (e.g., \`list.stream()\`, \`Stream.of()\`, \`IntStream.range()\`).
2. **Intermediate Operations**: Return a new stream and are **lazy** — no execution occurs until a terminal operation is called.
3. **Terminal Operations**: Trigger pipeline execution and produce a non-stream result (List, Map, Integer, void). Once a terminal operation is called, the stream is **consumed** and cannot be reused.

### Key Intermediate Operations

| Operation | Type | Purpose | Example |
|---|---|---|---|
| **\`filter(Predicate)\`** | Stateless | Keeps elements matching predicate | \`.filter(x -> x.getAge() >= 18)\` |
| **\`map(Function)\`** | Stateless | Transforms each element | \`.map(User::getEmail)\` |
| **\`flatMap(Function)\`** | Stateless | Flattens nested streams into one | \`.flatMap(order -> order.getItems().stream())\` |
| **\`distinct()\`** | Stateful | Removes duplicates via \`equals()\` | \`.distinct()\` |
| **\`sorted()\`** | Stateful | Sorts elements (natural / comparator) | \`.sorted(Comparator.comparing(User::getName))\` |
| **\`peek(Consumer)\`** | Stateless | Inspects elements (debugging only) | \`.peek(e -> log.debug(e))\` |
| **\`limit(long n)\`** | Short-circuiting | Truncates to first \`n\` elements | \`.limit(10)\` |
| **\`skip(long n)\`** | Stateful | Discards first \`n\` elements | \`.skip(20)\` |
| **\`takeWhile(Predicate)\`** | Short-circuiting | Takes while condition is true (Java 9+) | \`.takeWhile(n -> n < 100)\` |
| **\`dropWhile(Predicate)\`** | Stateful | Drops while condition is true (Java 9+) | \`.dropWhile(n -> n < 100)\` |

### Key Terminal Operations

- **\`collect(Collector)\`**: Accumulates elements into collections, maps, strings.
- **\`reduce(BinaryOperator)\`**: Combines elements into a single value (\`sum\`, \`product\`, \`max\`).
- **\`forEach(Consumer)\`**: Iterates over elements (use for side-effects).
- **\`count()\` / \`min()\` / \`max()\`**: Aggregates element counts and extremes.
- **\`anyMatch()\` / \`allMatch()\` / \`noneMatch()\`**: Short-circuiting boolean checks.
- **\`findFirst()\` / \`findAny()\`**: Returns \`Optional<T>\` matching element.`, code: `// 1. Filtering, Mapping & Sorting
List<Employee> staff = getEmployees();

List<String> topSeniorDevs = staff.stream()
    .filter(e -> "Engineering".equalsIgnoreCase(e.getDepartment()))
    .filter(e -> e.getSalary() > 90_000)
    .sorted(Comparator.comparingDouble(Employee::getSalary).reversed())
    .map(Employee::getName)
    .limit(5)
    .toList(); // Java 16+ shortcut for .collect(Collectors.toList())

// 2. flatMap: Flattening Nested Collections
List<Order> orders = getCustomerOrders();
List<String> allProductSkus = orders.stream()
    .flatMap(order -> order.getItems().stream()) // Stream<OrderItem>
    .map(OrderItem::getSku)
    .distinct()
    .toList();

// 3. reduce: Calculating Totals and Aggregates
double totalPayroll = staff.stream()
    .map(Employee::getSalary)
    .reduce(0.0, Double::sum);

// 4. Primitive Streams for High Performance (Avoid Autoboxing)
int sum = IntStream.rangeClosed(1, 100)
    .filter(n -> n % 2 == 0)
    .sum();

double avgSalary = staff.stream()
    .mapToDouble(Employee::getSalary)
    .average()
    .orElse(0.0);

// 5. Parallel Streams (Multi-core data processing)
long heavyCount = largeDataset.parallelStream()
    .filter(DataRecord::isValid)
    .count();`, codeLabel: 'Stream API Enterprise Pipeline', keyPoints: ['Streams are declarative, immutable pipelines over data sources.', 'Intermediate operations are lazy and chained; terminal operations execute.', 'A stream cannot be reused once consumed by a terminal operation.', 'Use flatMap to flatten one-to-many nested relationships.', 'Use primitive streams (IntStream, LongStream, DoubleStream) to avoid autoboxing overhead.'] },

    { title: 'Stream Collectors', content: `The **\`java.util.stream.Collectors\`** utility class provides a powerful suite of reduction operations that transform stream results into collections, maps, groups, partitions, and statistical summaries.

### Essential Collector Functions

| Collector | Return Type | Description |
|---|---|---|
| **\`toList()\` / \`toSet()\`** | \`List<T>\` / \`Set<T>\` | Accumulates into a List or Set |
| **\`toCollection(Supplier)\`** | Specific Collection | E.g. \`toCollection(TreeSet::new)\` |
| **\`toMap(keyMapper, valMapper)\`** | \`Map<K, V>\` | Collects into key-value map |
| **\`joining(delimiter, prefix, suffix)\`** | \`String\` | Concatenates CharSequences |
| **\`groupingBy(classifier)\`** | \`Map<K, List<T>>\` | Groups elements by key category |
| **\`groupingBy(classifier, downstream)\`** | \`Map<K, D>\` | Groups by key and applies downstream reduction |
| **\`partitioningBy(predicate)\`** | \`Map<Boolean, List<T>>\` | Splits into \`true\` and \`false\` buckets |
| **\`summarizingInt/Double/Long()\`** | \`IntSummaryStatistics\` | Computes count, sum, min, max, average |
| **\`collectingAndThen(downstream, finisher)\`**| Final Type | Applies an adapter after collection |

### Advanced Grouping & Downstream Collectors

\`Collectors.groupingBy()\` is one of Java's most versatile tools for data aggregation. By combining it with downstream collectors (like \`counting()\`, \`averagingDouble()\`, \`mapping()\`, \`maxBy()\`), you can perform SQL-like \`GROUP BY\` operations in memory with full type-safety.`, code: `import java.util.*;
import java.util.stream.Collectors;

record Product(String id, String category, double price, int stock) {}

List<Product> catalog = List.of(
    new Product("P1", "Electronics", 1200.0, 15),
    new Product("P2", "Electronics", 800.0, 20),
    new Product("P3", "Books", 25.0, 100),
    new Product("P4", "Books", 45.0, 50),
    new Product("P5", "Clothing", 75.0, 80)
);

// 1. Collect to Map with duplicate handling & custom map type
Map<String, Double> priceMap = catalog.stream()
    .collect(Collectors.toMap(
        Product::id,
        Product::price,
        (existing, replacement) -> replacement, // Merge function on duplicate
        LinkedHashMap::new                     // Map supplier
    ));

// 2. Joining strings with formatting
String formattedIds = catalog.stream()
    .map(Product::id)
    .collect(Collectors.joining(", ", "SKUs: [", "]"));
// Result: "SKUs: [P1, P2, P3, P4, P5]"

// 3. Simple Grouping: Group products by Category
Map<String, List<Product>> byCategory = catalog.stream()
    .collect(Collectors.groupingBy(Product::category));

// 4. Advanced Grouping with Downstream Reductions:
// A. Count of products per category
Map<String, Long> countByCategory = catalog.stream()
    .collect(Collectors.groupingBy(Product::category, Collectors.counting()));

// B. Average price per category
Map<String, Double> avgPriceByCategory = catalog.stream()
    .collect(Collectors.groupingBy(
        Product::category,
        Collectors.averagingDouble(Product::price)
    ));

// C. Most expensive product per category
Map<String, Optional<Product>> topPerCategory = catalog.stream()
    .collect(Collectors.groupingBy(
        Product::category,
        Collectors.maxBy(Comparator.comparingDouble(Product::price))
    ));

// 5. Partitioning: High-price (> $100) vs Regular items
Map<Boolean, List<Product>> premiumSplit = catalog.stream()
    .collect(Collectors.partitioningBy(p -> p.price() > 100.0));

// 6. Summary Statistics (min, max, count, sum, average in 1 pass)
DoubleSummaryStatistics stats = catalog.stream()
    .collect(Collectors.summarizingDouble(Product::price));
System.out.printf("Avg: %.2f, Max: %.2f, Min: %.2f%n", stats.getAverage(), stats.getMax(), stats.getMin());`, codeLabel: 'Collectors & Multi-Level Aggregations', keyPoints: ['Collectors transforms stream results into lists, sets, maps, or aggregated metrics.', 'groupingBy acts like SQL GROUP BY, supporting nested downstream collectors.', 'partitioningBy splits elements into a Map<Boolean, List<T>> based on a predicate.', 'summarizingDouble provides min, max, sum, average, and count in a single pass.', 'toMap handles key collisions using an explicit merge binary operator.'] },

    { title: 'Streams & Concurrency', content: `The **Stream API** (Java 8+) provides a *declarative pipeline* for modern data processing. Operations like \`filter\` and \`map\` are **lazy** and optimized. Sorting can be handled via \`Comparable\` (natural ordering) or \`Comparator\` (custom ordering).

### Fail-Fast vs Fail-Safe

Standard collections (\`ArrayList\`, \`HashMap\`) are **Fail-Fast** — they throw \`ConcurrentModificationException\` if modified during iteration. Concurrent collections (\`ConcurrentHashMap\`) are **Fail-Safe** — they use *snapshots* or *segment locking* for safe concurrent access.

### Producer-Consumer Pattern

The **Producer-Consumer Pattern** using \`BlockingQueue\` eliminates manual \`wait()\`/\`notify()\`: \`put()\` blocks if queue is full, \`take()\` blocks if queue is empty. This is the foundation of many concurrent Java applications.

### Modern Java

Since Java 9, **immutable collections** (\`List.of()\`, \`Set.of()\`, \`Map.of()\`) are *thread-safe* and *memory-efficient*. Java 21 introduced **Virtual Threads** for massive concurrency with minimal overhead.`, code: `// Stream API — Declarative data processing
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

List<String> result = names.stream()
    .filter(name -> name.startsWith("C"))  // Intermediate (lazy)
    .map(String::toUpperCase)              // Intermediate (lazy)
    .collect(Collectors.toList());         // Terminal (triggers)
// Output: [CHARLIE]

// Sorting with Comparator
names.sort(Comparator.comparingInt(String::length));

// Producer-Consumer with BlockingQueue
BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(5);

// Producer
Runnable producer = () -> {
    try {
        for (int i = 0; i < 10; i++) queue.put(i); // Blocks if full
    } catch (InterruptedException e) { }
};

// Consumer
Runnable consumer = () -> {
    try {
        while (true) {
            Integer val = queue.take(); // Blocks if empty
            if (val == 9) break;
        }
    } catch (InterruptedException e) { }
};`, codeLabel: 'Streams & Concurrency Patterns', keyPoints: ['Stream API: declarative, lazy processing pipeline (Java 8+).', 'filter/map are lazy; collect/forEach are terminal operations.', 'Fail-Fast: ConcurrentModificationException. Fail-Safe: snapshot-based.', 'BlockingQueue: put() blocks if full, take() blocks if empty.', 'ConcurrentHashMap uses segment locking for thread-safe access.'] },

    { title: 'Multithreading & Virtual Threads', image: '/images/java/java-virtual-threads.svg', content: `**Multithreading** enables concurrent execution of two or more parts of a program for maximum CPU utilization. In Java, thread management has evolved dramatically from low-level OS threads to **Virtual Threads** introduced in **Java 21 (Project Loom)**.

### Thread Lifecycle

A Java thread moves through distinct states defined in \`Thread.State\`:

1. **NEW**: Instantiated but not yet started (\`new Thread()\`).
2. **RUNNABLE**: Executing in JVM or waiting for OS scheduler.
3. **BLOCKED**: Waiting to acquire a monitor lock (\`synchronized\`).
4. **WAITING**: Waiting indefinitely for another thread (\`wait()\`, \`join()\`, \`LockSupport.park()\`).
5. **TIMED_WAITING**: Waiting with timeout (\`Thread.sleep(ms)\`, \`wait(ms)\`).
6. **TERMINATED**: Execution completed or terminated by uncaught exception.

### Thread Creation Mechanisms

- **Extending \`Thread\`**: Subclass overrides \`run()\`. Limited due to single inheritance.
- **Implementing \`Runnable\`**: Functional interface (\`void run()\`), decouples task from execution.
- **Implementing \`Callable<V>\` & \`Future<V>\`**: Returns result, throws checked exceptions.
- **\`ExecutorService\` Thread Pools**: Manages thread reuse without manually creating threads.

### Platform Threads vs Virtual Threads (Java 21+)

| Feature | Platform Threads (OS Threads) | Virtual Threads (Project Loom) |
|---|---|---|
| **Architecture** | 1:1 mapped to OS Kernel thread | M:N multiplexed onto Carrier Threads |
| **Memory Footprint** | ~1 MB stack per thread | ~1 KB dynamically resized on Heap |
| **Creation Cost** | Expensive (OS syscall, ~1-2ms) | Virtually free (microseconds) |
| **Max Concurrency** | ~2,000 to 5,000 threads per JVM | **1,000,000+** concurrent threads |
| **Blocking I/O** | Blocks entire OS thread (wasteful) | Unmounts virtual thread, frees carrier thread |
| **Programming Style** | Reactive / Async (Mono, Flux, Callbacks) | **Clean synchronous imperative code** |
| **Best Used For** | CPU-bound intensive math/crypto | **I/O-bound microservices, DB queries, REST APIs** |

### How Virtual Threads Work Under the Hood

When a Virtual Thread reaches a blocking I/O operation (e.g. \`Socket.read()\`, \`Thread.sleep()\`, \`JDBC query\`), the JVM **unmounts** the virtual thread from its underlying **carrier platform thread** (managed by a \`ForkJoinPool\`). The carrier thread is immediately free to run other virtual threads. When the I/O completes, the OS notifies the JVM, which **mounts** the virtual thread back onto any available carrier thread.`, code: `// 1. Traditional Thread Pool with ExecutorService
ExecutorService platformPool = Executors.newFixedThreadPool(10);
Future<String> future = platformPool.submit(() -> {
    Thread.sleep(1000);
    return "Platform thread result";
});
System.out.println("Result: " + future.get());
platformPool.shutdown();

// 2. Java 21+ Virtual Threads Creation
// Approach A: Thread.ofVirtual()
Thread vThread = Thread.ofVirtual().name("v-worker-1").start(() -> {
    System.out.println("Running on virtual thread: " + Thread.currentThread());
});
vThread.join();

// Approach B: Virtual Thread per Task Executor (Production Standard)
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.rangeClosed(1, 10_000).forEach(i -> {
        executor.submit(() -> {
            // Simulated I/O call (e.g. database query / external API)
            Thread.sleep(Duration.ofMillis(200));
            return "Task " + i + " completed";
        });
    });
} // Auto-closes and awaits all 10,000 virtual tasks without memory pressure!

// 3. Thread Synchronization: Lock & Atomic Variables
public class ThreadSafeCounter {
    private final ReentrantLock lock = new ReentrantLock();
    private final AtomicInteger atomicCount = new AtomicInteger(0);
    private int regularCount = 0;

    public void incrementWithLock() {
        lock.lock();
        try {
            regularCount++;
        } finally {
            lock.unlock(); // Always unlock in finally block!
        }
    }

    public void incrementAtomic() {
        atomicCount.incrementAndGet(); // Lock-free CAS instruction
    }
}`, codeLabel: 'Multithreading & Virtual Threads', keyPoints: ['Thread states: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED.', 'Platform threads are heavy (1MB stack); limit to CPU-bound tasks.', 'Virtual Threads (Java 21+) are lightweight (~1KB) managed by the JVM.', 'Use Executors.newVirtualThreadPerTaskExecutor() for high-scale I/O workloads.', 'Virtual threads unmount during blocking I/O, yielding immense throughput.'] },

    { title: 'Java Versions & LTS Feature Evolution', content: `Java follows a predictable **6-month release cadence** (every March and September), with designated **Long-Term Support (LTS)** releases supported for years in enterprise environments.

### Java LTS Release Timeline

| Version | Release Date | Support Classification | Major Milestone |
|---|---|---|---|
| **Java 8 (LTS)** | March 2014 | Milestone LTS | Functional Programming, Lambdas, Streams, Date/Time API |
| **Java 11 (LTS)** | Sept 2018 | Modern Modular LTS | Var in lambdas, HttpClient, removal of Java EE modules |
| **Java 17 (LTS)** | Sept 2021 | Modern Cloud LTS | Records, Sealed Classes, Pattern Matching, Strong Encapsulation |
| **Java 21 (LTS)** | Sept 2023 | High-Scale LTS | Virtual Threads, Sequenced Collections, Record Patterns |
| **Java 25 (LTS)** | Sept 2025 (Expected) | Next LTS | Compact Object Headers, Flexible Constructors, Module Imports |

---

### In-Depth Breakdown of LTS Versions

#### 1. Java 8 (LTS)
- **New Features**: Lambda expressions, Stream API, Functional Interfaces (\`java.util.function\`), Default & static methods in interfaces, \`java.time\` (JSR-310), \`Optional<T>\`, CompletableFuture.
- **JVM Internal**: PermGen removed and replaced with native memory **Metaspace**.
- **Deprecated / Removed**: Applet APIs deprecated.

#### 2. Java 11 (LTS)
- **New Features**: \`var\` keyword allowed in lambda parameters (\`(var x, var y) -> x + y\`), native **HTTP Client** supporting HTTP/1.1 and HTTP/2 with WebSockets (\`java.net.http.HttpClient\`), String utility methods (\`isBlank()\`, \`lines()\`, \`strip()\`, \`repeat()\`), single-file source execution (\`java Main.java\` without explicit javac).
- **Removed / Deprecated**: Java EE & CORBA modules completely removed from JDK (\`javax.xml.bind\` / JAXB, JAX-WS), Nashorn JavaScript engine deprecated, Pack200 deprecated.

#### 3. Java 17 (LTS)
- **New Features**:
  - **Records**: Concise immutable data carriers (\`record User(String name, int age) {}\`).
  - **Sealed Classes**: Restricts which classes/interfaces can extend or implement them (\`sealed interface Shape permits Circle, Square\`).
  - **Text Blocks**: Multi-line strings preserving formatting (\`""" ... """\`).
  - **Pattern Matching for \`instanceof\`**: Automatic casting (\`if (obj instanceof String s) { s.length(); }\`).
  - **Switch Expressions**: Yielding values without fallthrough (\`int days = switch(month) { case FEB -> 28; default -> 31; };\`).
- **Removed / Deprecated**: RMI Activation mechanism removed, experimental AOT/JIT compiler removed, Security Manager marked for removal.

#### 4. Java 21 (LTS)
- **New Features**:
  - **Virtual Threads (JEP 444)**: Massive concurrency for I/O tasks.
  - **Sequenced Collections (JEP 431)**: Unified interface for collections with defined encounter order (\`getFirst()\`, \`getLast()\`, \`addFirst()\`, \`reversed()\`).
  - **Pattern Matching for switch (JEP 441)**: Exhaustive, type-safe switch statements with \`when\` guards.
  - **Record Patterns (JEP 440)**: Deconstruct record values directly in patterns.
  - **Generational ZGC (JEP 439)**: Sub-millisecond garbage collection pauses.
- **Removed / Deprecated**: \`Thread.stop()\` permanently disabled, Windows 32-bit x86 port removed.

#### 5. Java 25 (LTS Roadmap & Beyond)
- **Upcoming Highlights**: Compact Object Headers (reduces memory overhead per object), Flexible Constructor Bodies (statements before \`super(...)\`), Primitive Types in Patterns and \`instanceof\`, Module Import Declarations (\`import module java.base\`), Markdown documentation comments in Javadoc (\`///\`).`, code: `// Modern Java Features from LTS Releases

// 1. Java 14/16/17: Records & Pattern Matching
public record Customer(String id, String email, int loyaltyPoints) {}

public static void processEntity(Object obj) {
    // Java 16: Pattern matching for instanceof
    if (obj instanceof Customer c && c.loyaltyPoints() > 100) {
        System.out.println("VIP Customer: " + c.email());
    }
}

// 2. Java 17: Sealed Classes
public sealed interface PaymentMethod permits CreditCard, BankTransfer, Crypto {}
public final class CreditCard implements PaymentMethod {}
public final class BankTransfer implements PaymentMethod {}
public final class Crypto implements PaymentMethod {}

// 3. Java 21: Pattern Matching for switch with guards
public static String formatPayment(PaymentMethod method) {
    return switch (method) {
        case CreditCard cc   -> "Processing Visa/Mastercard";
        case BankTransfer bt -> "Executing ACH/Wire Transfer";
        case Crypto c        -> "Submitting Blockchain Tx";
    }; // Exhaustive check enforced by compiler!
}

// 4. Java 21: Sequenced Collections
SequencedCollection<String> items = new ArrayList<>(List.of("First", "Middle", "Last"));
String head = items.getFirst();       // "First"
String tail = items.getLast();        // "Last"
List<String> rev = items.reversed().stream().toList(); // ["Last", "Middle", "First"]

// 5. Java 17: Text Blocks
String jsonQuery = """
    {
      "user": "developer",
      "status": "active",
      "version": 21
    }
    """;`, codeLabel: 'LTS Evolution & Modern Syntax Features', keyPoints: ['Java releases every 6 months; LTS releases provide long-term enterprise stability.', 'Java 8: Lambdas & Streams. Java 11: HttpClient & Var. Java 17: Records & Sealed Classes.', 'Java 21: Virtual Threads, Sequenced Collections, and Record Patterns.', 'Metaspace replaced PermGen in Java 8; Java EE modules were removed in Java 11.', 'Always target the latest LTS release (Java 17 or Java 21) for new production systems.'] },

    { title: 'Build & Deploy', content: `Java projects are built using **Maven** or **Gradle**, which compile source code, run tests, and package everything into deployable artifacts.

### Maven

**Maven** uses a \`pom.xml\` file to declare dependencies, plugins, and build configurations. Running \`mvn clean package\` compiles the code, runs tests, and produces a **JAR** or **WAR** file in the \`target/\` directory.

### JAR Files

A **JAR** (*Java Archive*) is a ZIP file containing compiled \`.class\` files and resources. A "**fat JAR**" (uber-JAR) includes all dependencies, making it self-contained. **Spring Boot** applications typically produce executable fat JARs.

### Deployment Options

For deployment: 1) Run the JAR directly on a server (\`java -jar app.jar\`), 2) Deploy to application servers like **Tomcat** or **WildFly** (for WAR files), 3) **Containerize with Docker** (most modern approach), or 4) Deploy to cloud PaaS services (*AWS Elastic Beanstalk*, *Azure App Service*).`, code: `<!-- pom.xml (Maven) -->
<project>
  <groupId>com.myapp</groupId>
  <artifactId>my-service</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <version>3.2.0</version>
    </dependency>
  </dependencies>
</project>

# Build commands
mvn clean package          # Compile + test + package
mvn clean package -DskipTests  # Skip tests
java -jar target/my-service-1.0.0.jar  # Run

# Dockerfile
FROM eclipse-temurin:21-jre-alpine
COPY target/my-service-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]`, codeLabel: 'Build & Deploy Configuration', keyPoints: ['Maven: mvn clean package produces a JAR/WAR.', 'Fat JARs include all dependencies for self-contained deployment.', 'Docker is the modern standard for Java deployment.', 'Always run tests as part of the build process.'] },
    
    { title: 'Best Practices & Code Standards', content: `Follow **Java naming conventions** strictly: \`PascalCase\` for classes, \`camelCase\` for methods and variables, \`UPPER_SNAKE_CASE\` for constants. These conventions are universally expected in Java projects and enforced by tools like **Checkstyle** and **SonarQube**.

### Immutability & Error Handling

Prefer **immutability** — use \`final\` fields, Java **Records** (Java 16+) for data carriers, and immutable collections (\`List.of()\`, \`Map.of()\`). Catch **specific exceptions** instead of \`Exception\` and always preserve the original cause. Use \`Optional\` instead of returning \`null\` to make absence explicit.

### Modern Java

Leverage modern Java features: **Records** for DTOs, **sealed classes** for restricted hierarchies, **pattern matching** in \`switch\` (Java 21+), and the **Stream API** for declarative data processing. Always run the latest LTS version in production.`, code: `// DO: Java naming conventions
public class UserService {
    private static final int MAX_RETRIES = 3;
    private final UserRepository userRepo;

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }
}

// DON'T: Inconsistent naming
public class user_service {
    private int maxretries = 3;
    public User FindByEmail(String email) { return null; }
}

// DO: Specific exceptions with context
try {
    return userRepo.findById(id)
        .orElseThrow(() -> new NotFoundException("User " + id));
} catch (DataAccessException e) {
    throw new ServiceException("DB error for user " + id, e);
}

// DON'T: Catch-all or swallow exceptions
try {
    return userRepo.findById(id).get();
} catch (Exception e) {
    e.printStackTrace();
    return null;
}

// DO: Records for data carriers (Java 16+)
public record UserDto(String name, String email, int age) {}

// DO: Stream API for data processing
List<String> activeEmails = users.stream()
    .filter(User::isActive)
    .map(User::getEmail)
    .sorted()
    .toList();`, codeLabel: 'Dos & Don\'ts', keyPoints: ['PascalCase for classes, camelCase for methods, UPPER_SNAKE for constants.', 'Prefer immutability — use final fields and Java Records for DTOs.', 'Catch specific exceptions and always preserve the original cause.', 'Use Optional instead of returning null from methods.'] }
  ]
};

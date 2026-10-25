/*
 * Java course extension — extra sections and worked examples merged into
 * courses-data/java.js at load time (see src/data/mergeCourse.js).
 * Snippets target Java 21 (LTS).
 */
export default {
  examples: {
    'Program Structure': [
      {
        title: 'Reading input & formatted output',
        language: 'java',
        code: `import java.util.Scanner;

public class Greeter {
    public static void main(String[] args) {
        // Command-line arguments: java Greeter Ada
        String name = args.length > 0 ? args[0] : "World";

        try (Scanner in = new Scanner(System.in)) {          // closes automatically
            System.out.print("How old are you? ");
            int age = in.hasNextInt() ? in.nextInt() : 0;

            System.out.printf("Hello, %s! Next year you'll be %d.%n", name, age + 1);
            System.out.println(String.format("Pi to 3 places: %.3f", Math.PI));
            System.out.println("Formatted: %-8s|%5d|".formatted("left", 42));   // Java 15+
        }
    }
}`,
        output: `How old are you? 30
Hello, World! Next year you'll be 31.
Pi to 3 places: 3.142
Formatted: left    |   42|`,
      },
    ],
    'Data Types & Wrapper Classes': [
      {
        title: 'Autoboxing traps',
        language: 'java',
        explanation: '`Integer` objects between -128 and 127 are **cached**, so `==` appears to work for small numbers and silently fails for larger ones. Always compare wrappers with `equals()` — and beware of unboxing `null`.',
        code: `public class BoxingTraps {
    public static void main(String[] args) {
        Integer a = 127, b = 127;
        Integer c = 128, d = 128;
        System.out.println(a == b);        // true  (cached)
        System.out.println(c == d);        // false (different objects!)
        System.out.println(c.equals(d));   // true  ✔

        Integer missing = null;
        try {
            int value = missing;           // auto-unboxing null
        } catch (NullPointerException e) {
            System.out.println("NPE from unboxing null");
        }

        // Integer overflow wraps silently; use Math.addExact to detect it
        int max = Integer.MAX_VALUE;
        System.out.println(max + 1);                   // -2147483648
        try { Math.addExact(max, 1); }
        catch (ArithmeticException e) { System.out.println("overflow detected"); }

        // Floating point is not exact — use BigDecimal for money
        System.out.println(0.1 + 0.2);                                   // 0.30000000000000004
        System.out.println(new java.math.BigDecimal("0.1").add(new java.math.BigDecimal("0.2"))); // 0.3
    }
}`,
      },
    ],
    'Enums & Control Flow': [
      {
        title: 'Enum with fields, methods and switch expressions',
        language: 'java',
        code: `public class Shipping {
    enum Plan {
        FREE(0, 7), STANDARD(4.99, 3), EXPRESS(14.99, 1);

        private final double price;
        private final int days;

        Plan(double price, int days) { this.price = price; this.days = days; }

        double price() { return price; }
        int days() { return days; }

        boolean isPaid() { return this != FREE; }
    }

    static String label(Plan plan) {
        // Switch expression: exhaustive, no fall-through, returns a value
        return switch (plan) {
            case FREE -> "Free shipping";
            case STANDARD, EXPRESS -> "Paid: $" + plan.price();
        };
    }

    public static void main(String[] args) {
        for (Plan p : Plan.values()) {
            System.out.printf("%-9s %d days  %s%n", p, p.days(), label(p));
        }
        Plan parsed = Plan.valueOf("EXPRESS");
        System.out.println(parsed.ordinal() + " " + parsed.isPaid());

        // Labeled break, enhanced for and ternary
        int[][] grid = {{1, 2}, {3, 4}};
        search:
        for (int[] row : grid) {
            for (int v : row) {
                if (v == 3) { System.out.println("found 3"); break search; }
            }
        }
    }
}`,
      },
    ],
    'Exception Handling': [
      {
        title: 'Custom exceptions, multi-catch and try-with-resources',
        language: 'java',
        code: `import java.io.*;
import java.nio.file.*;

public class OrderImporter {

    // Checked: caller must handle; unchecked (RuntimeException): programming errors
    static class InvalidOrderException extends Exception {
        private final int line;
        InvalidOrderException(String message, int line, Throwable cause) {
            super(message + " (line " + line + ")", cause);
            this.line = line;
        }
        int line() { return line; }
    }

    static int importOrders(Path file) throws InvalidOrderException, IOException {
        int count = 0, lineNo = 0;
        try (BufferedReader reader = Files.newBufferedReader(file)) {    // auto-closed
            String line;
            while ((line = reader.readLine()) != null) {
                lineNo++;
                try {
                    int qty = Integer.parseInt(line.split(",")[1].trim());
                    if (qty <= 0) throw new IllegalArgumentException("qty must be > 0");
                    count++;
                } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {   // multi-catch
                    throw new InvalidOrderException("Malformed order", lineNo, e);       // wrap + keep cause
                }
            }
        }
        return count;
    }

    public static void main(String[] args) throws IOException {
        Path tmp = Files.createTempFile("orders", ".csv");
        Files.writeString(tmp, "A1, 2\\nB2, 5\\nC3, oops\\n");
        try {
            System.out.println("Imported " + importOrders(tmp));
        } catch (InvalidOrderException e) {
            System.out.println(e.getMessage() + " caused by " + e.getCause().getClass().getSimpleName());
        } finally {
            Files.deleteIfExists(tmp);
        }
    }
}`,
        output: `Malformed order (line 3) caused by NumberFormatException`,
      },
    ],
    'Collections Framework': [
      {
        title: 'List, Set, Map — everyday operations',
        language: 'java',
        code: `import java.util.*;

public class CollectionsTour {
    public static void main(String[] args) {
        // Immutable factories (Java 9+)
        List<String> fixed = List.of("a", "b");
        Map<String, Integer> ages = Map.of("Ada", 36, "Linus", 54);

        // Mutable List
        List<String> langs = new ArrayList<>(List.of("Java", "Python", "Go"));
        langs.add("Rust");
        langs.removeIf(l -> l.length() <= 2);           // removes "Go"
        langs.sort(Comparator.naturalOrder());
        System.out.println(langs + " first=" + langs.get(0));

        // Set: uniqueness; LinkedHashSet keeps insertion order, TreeSet sorts
        Set<String> tags = new LinkedHashSet<>(List.of("java", "spring", "java"));
        System.out.println(tags + " contains spring? " + tags.contains("spring"));

        // Map: counting with merge, defaults, iteration
        Map<String, Integer> wordCount = new TreeMap<>();
        for (String w : "to be or not to be".split(" ")) wordCount.merge(w, 1, Integer::sum);
        System.out.println(wordCount);
        System.out.println(wordCount.getOrDefault("maybe", 0));
        wordCount.computeIfAbsent("new", k -> 0);
        wordCount.forEach((k, v) -> System.out.print(k + "=" + v + " "));
        System.out.println();

        // Grouping into a Map<String, List<...>>
        Map<Integer, List<String>> byLength = new HashMap<>();
        for (String l : langs) byLength.computeIfAbsent(l.length(), k -> new ArrayList<>()).add(l);
        System.out.println(byLength);

        // Queue / Deque / PriorityQueue
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(1); stack.push(2);
        PriorityQueue<Integer> minHeap = new PriorityQueue<>(List.of(5, 1, 3));
        System.out.println("pop=" + stack.pop() + " min=" + minHeap.poll());

        try { fixed.add("c"); } catch (UnsupportedOperationException e) { System.out.println("List.of is immutable"); }
        System.out.println(ages.size());
    }
}`,
      },
      {
        title: 'Sorting with Comparator chains',
        language: 'java',
        code: `import java.util.*;

public class SortingDemo {
    record Employee(String name, String dept, double salary, int age) {}

    public static void main(String[] args) {
        List<Employee> staff = new ArrayList<>(List.of(
            new Employee("Cara", "Eng", 120_000, 31),
            new Employee("Ana", "Eng", 120_000, 28),
            new Employee("Ben", "Sales", 80_000, 45),
            new Employee("Dev", "Eng", 95_000, 39)));

        staff.sort(Comparator.comparing(Employee::dept)
                .thenComparing(Employee::salary, Comparator.reverseOrder())
                .thenComparing(Employee::name));

        staff.forEach(e -> System.out.printf("%-5s %-6s %,10.0f%n", e.dept(), e.name(), e.salary()));

        Employee oldest = Collections.max(staff, Comparator.comparingInt(Employee::age));
        System.out.println("Oldest: " + oldest.name());
    }
}`,
      },
    ],
    'Multithreading & Virtual Threads': [
      {
        title: 'ExecutorService & CompletableFuture',
        language: 'java',
        code: `import java.util.*;
import java.util.concurrent.*;

public class AsyncDemo {
    static String fetch(String service, int ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        return service + " ✓";
    }

    public static void main(String[] args) throws Exception {
        // Virtual threads: one cheap thread per task (Java 21)
        try (ExecutorService pool = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<String>> futures = new ArrayList<>();
            for (String s : List.of("users", "orders", "stock")) {
                futures.add(pool.submit(() -> fetch(s, 200)));
            }
            for (Future<String> f : futures) System.out.println(f.get());
        }   // close() waits for all tasks

        // CompletableFuture: compose async steps without blocking
        CompletableFuture<String> user = CompletableFuture.supplyAsync(() -> fetch("user", 100));
        CompletableFuture<String> cart = CompletableFuture.supplyAsync(() -> fetch("cart", 150));

        String page = user.thenCombine(cart, (u, c) -> u + " + " + c)
                .orTimeout(2, TimeUnit.SECONDS)
                .exceptionally(ex -> "fallback page")
                .join();
        System.out.println(page);

        // Thread-safe counter
        var counter = new java.util.concurrent.atomic.AtomicInteger();
        try (var pool = Executors.newFixedThreadPool(4)) {
            for (int i = 0; i < 1000; i++) pool.execute(counter::incrementAndGet);
        }
        System.out.println("count = " + counter.get());   // always 1000
    }
}`,
      },
    ],
  },

  sections: [
    {
      title: 'Operators & Type Casting',
      after: 'Data Types & Wrapper Classes',
      content: `### Operator groups

| Group | Operators | Notes |
|---|---|---|
| Arithmetic | \`+ - * / %\` | Integer division truncates: \`7 / 2 == 3\` |
| Unary | \`++ -- + - !\` | \`i++\` returns old value, \`++i\` new value |
| Assignment | \`= += -= *= /= %=\` | Compound ops include an implicit cast |
| Relational | \`== != > < >= <=\` | \`==\` on objects compares **references** |
| Logical | \`&& || !\` | Short-circuit evaluation |
| Bitwise | \`& | ^ ~ << >> >>>\` | \`>>>\` fills with zeros (unsigned shift) |
| Ternary | \`cond ? a : b\` | Expression form of if/else |
| Type check | \`instanceof\` | With pattern: \`if (o instanceof String s)\` |

### Type casting

- **Widening** (implicit, safe): \`byte → short → int → long → float → double\`.
- **Narrowing** (explicit, may lose data): \`(int) 3.99\` → \`3\`, \`(byte) 300\` → \`44\`.
- **Promotion**: in expressions, \`byte\`, \`short\` and \`char\` become \`int\` — so \`byte b = b1 + b2;\` does not compile.

### Strings ↔ numbers

\`Integer.parseInt("42")\`, \`Double.parseDouble("3.5")\`, \`String.valueOf(42)\`, \`Integer.toBinaryString(10)\`.`,
      code: `public class Operators {
    public static void main(String[] args) {
        System.out.println(7 / 2 + " " + 7 % 2 + " " + 7 / 2.0);   // 3 1 3.5
        System.out.println(-7 / 2 + " " + Math.floorDiv(-7, 2));   // -3 -4

        int i = 5;
        int a = i++;   // a = 5, i = 6
        int b = ++i;   // b = 7, i = 7
        System.out.println(a + " " + b + " " + i);

        // Short-circuit avoids NullPointerException
        String s = null;
        if (s != null && s.length() > 3) System.out.println("long");

        // Narrowing casts
        double price = 9.99;
        int whole = (int) price;            // 9 (truncates, does not round)
        long rounded = Math.round(price);   // 10
        byte overflow = (byte) 300;         // 44
        System.out.println(whole + " " + rounded + " " + overflow);

        // char arithmetic
        char c = 'A';
        c += 2;                              // compound assignment casts back to char
        System.out.println(c + " " + (int) c + " " + (char) (c + 1));   // C 67 D

        // Bitwise flags
        final int READ = 1, WRITE = 2, EXEC = 4;
        int perms = READ | WRITE;
        System.out.println(((perms & WRITE) != 0) + " " + Integer.toBinaryString(perms));

        // Pattern matching instanceof (Java 16+)
        Object o = "hello";
        if (o instanceof String str && !str.isEmpty()) System.out.println(str.toUpperCase());

        // Parsing
        int n = Integer.parseInt("42");
        double d = Double.parseDouble("2.5");
        System.out.println(n * d + " " + String.valueOf(n).length());
    }
}`,
      codeLabel: 'Operators, casting and parsing',
      keyPoints: [
        'Integer division truncates; use a double operand or Math.floorDiv as needed.',
        'Narrowing casts truncate and can overflow silently.',
        'byte/short/char are promoted to int in expressions.',
        'Use && and || for short-circuit null-safe checks.',
        'instanceof with a pattern variable removes the explicit cast.',
      ],
    },
    {
      title: 'Strings & StringBuilder',
      after: 'Operators & Type Casting',
      content: `\`String\` is **immutable** — every "modification" creates a new object. Literals are stored in the **string pool**, so identical literals share one instance.

### Comparing strings

Always use \`equals()\` (or \`equalsIgnoreCase()\`) — \`==\` compares references and only *sometimes* works because of pooling. Put the literal first (\`"yes".equals(input)\`) to avoid NullPointerException.

### Most-used methods

| Task | Method |
|---|---|
| Length / char | \`length()\`, \`charAt(i)\`, \`chars()\` |
| Search | \`contains\`, \`indexOf\`, \`startsWith\`, \`endsWith\`, \`matches(regex)\` |
| Extract | \`substring(begin, end)\`, \`split(regex)\` |
| Transform | \`toUpperCase\`, \`trim\` / \`strip\` (Unicode-aware), \`replace\`, \`repeat(n)\` |
| Check | \`isEmpty()\`, \`isBlank()\` (Java 11+) |
| Join | \`String.join(", ", list)\`, \`Collectors.joining\` |

### StringBuilder

Concatenating in a loop with \`+\` creates a new String each iteration (O(n²)). Use \`StringBuilder\` (not thread-safe, fast) — or \`StringBuffer\` only if multiple threads share it.

### Text blocks (Java 15+)

Triple-quoted \`"""\` text blocks make multi-line JSON, SQL and HTML readable, with indentation stripped automatically.`,
      code: `import java.util.*;

public class StringsDemo {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hello";
        String c = new String("hello");
        System.out.println((a == b) + " " + (a == c) + " " + a.equals(c));   // true false true

        String input = null;
        System.out.println("yes".equals(input));   // false, no NPE

        String s = "  Java, Spring, Hibernate  ";
        System.out.println(s.strip().toLowerCase());
        System.out.println(Arrays.toString(s.strip().split("\\\\s*,\\\\s*")));
        System.out.println(s.contains("Spring") + " " + s.indexOf("Spring") + " " + "   ".isBlank());
        System.out.println("abc".repeat(2) + " " + "Hello".charAt(1) + " " + "Hello".substring(1, 3));
        System.out.println(String.join(" | ", List.of("a", "b", "c")));

        // Efficient building
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 5; i++) sb.append(i).append(i < 5 ? "," : "");
        sb.insert(0, "[").append("]");
        System.out.println(sb + " reversed: " + new StringBuilder("abc").reverse());

        // Text block + formatted
        String json = """
            {
              "name": "%s",
              "skills": ["Java", "SQL"]
            }
            """.formatted("Ada");
        System.out.println(json);

        // Count character frequency
        Map<Character, Integer> freq = new TreeMap<>();
        for (char ch : "banana".toCharArray()) freq.merge(ch, 1, Integer::sum);
        System.out.println(freq);   // {a=3, b=1, n=2}
    }
}`,
      codeLabel: 'String toolkit',
      keyPoints: [
        'Strings are immutable and literals are pooled.',
        'Compare with equals(), never ==; put the literal first for null safety.',
        'Use StringBuilder for concatenation inside loops.',
        'strip() and isBlank() are the Unicode-aware modern versions of trim()/isEmpty().',
        'Text blocks (""") simplify multi-line strings.',
      ],
    },
    {
      title: 'Arrays',
      after: 'Enums & Control Flow',
      content: `An array is a **fixed-size**, zero-indexed container of one type. Arrays are objects: they live on the heap and have a \`length\` field (not a method).

### Declaring and creating

\`int[] nums = new int[5];\` (filled with defaults: 0, false, null) or \`int[] nums = {3, 1, 2};\`.

### java.util.Arrays helpers

| Method | Purpose |
|---|---|
| \`Arrays.toString(arr)\` / \`deepToString\` | Printable form |
| \`Arrays.sort(arr)\` | In-place sort (dual-pivot quicksort for primitives) |
| \`Arrays.binarySearch(arr, key)\` | O(log n) search on a **sorted** array |
| \`Arrays.fill(arr, v)\` | Fill every slot |
| \`Arrays.copyOf(arr, n)\` / \`copyOfRange\` | Copy / resize |
| \`Arrays.equals(a, b)\` | Compare contents (\`==\` compares references) |
| \`Arrays.asList(...)\` / \`Arrays.stream(arr)\` | Bridge to collections and streams |

### Array vs ArrayList

Use arrays for fixed-size, performance-critical or primitive data; use \`ArrayList\` when the size changes or you need collection APIs.`,
      code: `import java.util.*;
import java.util.stream.*;

public class ArraysDemo {
    public static void main(String[] args) {
        int[] scores = {72, 95, 58, 88, 95};
        System.out.println(scores.length + " " + Arrays.toString(scores));

        int[] sorted = Arrays.copyOf(scores, scores.length);
        Arrays.sort(sorted);
        System.out.println(Arrays.toString(sorted) + " index of 88: " + Arrays.binarySearch(sorted, 88));

        // Sum / max / average with streams
        System.out.println(Arrays.stream(scores).sum() + " " + Arrays.stream(scores).max().getAsInt()
                + " " + Arrays.stream(scores).average().orElse(0));

        // 2D array (matrix) and nested loops
        int[][] matrix = {{1, 2, 3}, {4, 5, 6}};
        int[][] transposed = new int[3][2];
        for (int r = 0; r < matrix.length; r++)
            for (int c = 0; c < matrix[r].length; c++)
                transposed[c][r] = matrix[r][c];
        System.out.println(Arrays.deepToString(transposed));

        // Sort objects with a comparator
        String[] names = {"bob", "Alice", "carol"};
        Arrays.sort(names, String.CASE_INSENSITIVE_ORDER);
        System.out.println(Arrays.toString(names));

        // Array <-> List
        List<String> list = new ArrayList<>(Arrays.asList(names));   // copy so it can grow
        list.add("dave");
        String[] back = list.toArray(String[]::new);
        System.out.println(back.length + " " + Arrays.equals(names, Arrays.copyOf(back, 3)));

        // Reverse in place (two pointers)
        for (int i = 0, j = scores.length - 1; i < j; i++, j--) {
            int tmp = scores[i]; scores[i] = scores[j]; scores[j] = tmp;
        }
        System.out.println(Arrays.toString(scores));
        System.out.println(IntStream.of(scores).boxed().collect(Collectors.toSet()));
    }
}`,
      codeLabel: 'Working with arrays',
      keyPoints: [
        'Arrays have a fixed size and a length field.',
        'Use Arrays.toString / sort / binarySearch / copyOf / equals.',
        'Arrays.asList returns a fixed-size view — wrap it in new ArrayList<>() to grow.',
        'Prefer ArrayList when the number of elements changes.',
      ],
    },
    {
      title: 'Methods, Varargs & Recursion',
      after: 'Arrays',
      content: `A method has a **signature** (name + parameter types) and a return type. Java is always **pass-by-value**: primitives copy their value; object variables copy the **reference** — so a method can mutate the object but cannot make the caller's variable point to a different object.

### Overloading

Several methods may share a name if their parameter lists differ. The compiler picks the most specific match at compile time.

### Varargs

\`int sum(int... nums)\` accepts zero or more arguments as an array. It must be the last parameter.

### Recursion

A method that calls itself needs a **base case**. Deep recursion can throw \`StackOverflowError\`; convert to a loop or use memoization for overlapping subproblems.

### Static vs instance methods

\`static\` methods belong to the class (\`Math.max\`) and cannot use \`this\`; instance methods operate on an object's state.`,
      code: `import java.util.*;

public class MethodsDemo {

    // Overloads
    static int area(int side) { return side * side; }
    static int area(int w, int h) { return w * h; }
    static double area(double radius) { return Math.PI * radius * radius; }

    // Varargs
    static int sum(int... nums) {
        int total = 0;
        for (int n : nums) total += n;
        return total;
    }

    // Pass-by-value demonstration
    static void reassign(StringBuilder sb) { sb = new StringBuilder("new"); }   // caller unaffected
    static void mutate(StringBuilder sb)   { sb.append(" mutated"); }           // caller sees change

    // Recursion with memoization
    static final Map<Integer, Long> memo = new HashMap<>();
    static long fib(int n) {
        if (n < 2) return n;                       // base case
        Long cached = memo.get(n);
        if (cached != null) return cached;
        long result = fib(n - 1) + fib(n - 2);
        memo.put(n, result);
        return result;
    }

    // Classic recursion: permutations
    static void permute(String prefix, String rest, List<String> out) {
        if (rest.isEmpty()) { out.add(prefix); return; }
        for (int i = 0; i < rest.length(); i++)
            permute(prefix + rest.charAt(i), rest.substring(0, i) + rest.substring(i + 1), out);
    }

    public static void main(String[] args) {
        System.out.println(area(3) + " " + area(2, 5) + " " + String.format("%.2f", area(1.0)));
        System.out.println(sum() + " " + sum(1, 2, 3) + " " + sum(new int[]{4, 5}));

        StringBuilder sb = new StringBuilder("original");
        reassign(sb);
        mutate(sb);
        System.out.println(sb);                    // original mutated

        System.out.println(fib(80));
        List<String> perms = new ArrayList<>();
        permute("", "abc", perms);
        System.out.println(perms);
    }
}`,
      codeLabel: 'Overloading, varargs, pass-by-value, recursion',
      keyPoints: [
        'Java is always pass-by-value — object references are copied.',
        'Overloads differ by parameter list, not return type.',
        'Varargs (Type... name) must be the last parameter.',
        'Every recursive method needs a base case; memoize overlapping calls.',
      ],
    },
    {
      title: 'Classes, Interfaces & Inheritance',
      after: 'Access Modifiers & OOP',
      content: `### Building blocks

| Concept | Java syntax |
|---|---|
| Class with constructor | \`class Car { Car(String m) { this.model = m; } }\` |
| Constructor chaining | \`this(...)\` (same class), \`super(...)\` (parent) — must be first statement |
| Inheritance | \`class Truck extends Vehicle\` — single class inheritance |
| Interface | \`interface Drivable { void drive(); }\` — a class can implement many |
| Abstract class | \`abstract class Vehicle\` — cannot be instantiated; may hold state |
| Prevent extension | \`final class\`, \`final\` methods |
| Restrict subclasses | \`sealed interface Shape permits Circle, Square\` (Java 17+) |
| Nested types | static nested, inner, local and anonymous classes |

### Object methods to override

\`toString()\` for readable output, and \`equals()\` + \`hashCode()\` **together** whenever objects are compared or used as map keys. Records generate all three for you.

### Polymorphism

A variable of a supertype can hold any subtype; the overridden method that runs is chosen at **runtime** (dynamic dispatch). See the **OOPs** course for the full theory.`,
      code: `import java.util.*;

interface Drivable {
    void drive(int km);
    default String describe() { return getClass().getSimpleName(); }
}

abstract class Vehicle implements Drivable {
    private static int created = 0;
    protected final String plate;
    protected int odometer;

    protected Vehicle(String plate) {
        this.plate = Objects.requireNonNull(plate);
        created++;
    }

    @Override public void drive(int km) {
        if (km <= 0) throw new IllegalArgumentException("km must be positive");
        odometer += km;
    }

    public abstract double costPerKm();

    public static int created() { return created; }

    @Override public String toString() { return describe() + "[" + plate + ", " + odometer + " km]"; }

    @Override public boolean equals(Object o) {
        return o instanceof Vehicle v && v.plate.equals(plate);
    }
    @Override public int hashCode() { return plate.hashCode(); }
}

class Car extends Vehicle {
    Car(String plate) { super(plate); }
    @Override public double costPerKm() { return 0.15; }
}

class Truck extends Vehicle {
    private final int axles;
    Truck(String plate) { this(plate, 2); }             // constructor chaining
    Truck(String plate, int axles) { super(plate); this.axles = axles; }
    @Override public double costPerKm() { return 0.4 * axles; }
    @Override public void drive(int km) { super.drive(km); System.out.println("Truck logged " + km + " km"); }
}

public class Fleet {
    public static void main(String[] args) {
        List<Vehicle> fleet = List.of(new Car("AB-123"), new Truck("TR-9", 3));
        fleet.forEach(v -> v.drive(100));                 // dynamic dispatch
        fleet.forEach(v -> System.out.printf("%s costs %.2f%n", v, v.costPerKm() * v.odometer));

        Set<Vehicle> unique = new HashSet<>(List.of(new Car("X-1"), new Car("X-1")));
        System.out.println("unique=" + unique.size() + " created=" + Vehicle.created());

        // Anonymous class implementing an interface
        Drivable bike = new Drivable() { public void drive(int km) { System.out.println("pedal " + km); } };
        bike.drive(5);
    }
}`,
      codeLabel: 'Abstract class + interface + inheritance',
      keyPoints: [
        'A class extends one class but can implement many interfaces.',
        'this(...) / super(...) must be the first statement in a constructor.',
        'Override equals() and hashCode() together.',
        'final prevents overriding; sealed restricts which classes may extend.',
      ],
    },
    {
      title: 'Generics',
      after: 'Classes, Interfaces & Inheritance',
      content: `Generics add **compile-time type safety** to classes and methods that work with many types, eliminating casts and \`ClassCastException\`s.

### Syntax

- Generic class: \`class Box<T> { T value; }\`
- Generic method: \`static <T> T first(List<T> list)\`
- Bounded type: \`<T extends Comparable<T>>\` — T must be comparable
- Multiple bounds: \`<T extends Number & Comparable<T>>\`

### Wildcards — PECS

**P**roducer **E**xtends, **C**onsumer **S**uper:

| Wildcard | You can | Example |
|---|---|---|
| \`List<? extends Number>\` | **read** Numbers (producer) | \`double sum(List<? extends Number> nums)\` |
| \`List<? super Integer>\` | **add** Integers (consumer) | \`void fill(List<? super Integer> out)\` |
| \`List<?>\` | read as Object only | \`void printAll(List<?> items)\` |

### Type erasure

Generic types are removed at runtime: \`List<String>\` and \`List<Integer>\` are both just \`List\`. Consequences: no \`new T()\`, no \`instanceof List<String>\`, no primitive type arguments (\`List<int>\` → use \`List<Integer>\`).`,
      code: `import java.util.*;
import java.util.function.*;

public class GenericsDemo {

    // Generic class
    static final class Result<T> {
        private final T value;
        private final String error;
        private Result(T value, String error) { this.value = value; this.error = error; }

        static <T> Result<T> ok(T value) { return new Result<>(value, null); }
        static <T> Result<T> fail(String error) { return new Result<>(null, error); }

        <R> Result<R> map(Function<? super T, ? extends R> fn) {
            return error == null ? ok(fn.apply(value)) : fail(error);
        }
        T orElse(T fallback) { return error == null ? value : fallback; }
    }

    // Bounded generic method
    static <T extends Comparable<T>> T max(List<T> items) {
        T best = items.get(0);
        for (T item : items) if (item.compareTo(best) > 0) best = item;
        return best;
    }

    // PECS
    static double sum(Collection<? extends Number> nums) {      // producer → extends
        double total = 0;
        for (Number n : nums) total += n.doubleValue();
        return total;
    }
    static void addDefaults(List<? super Integer> sink) {        // consumer → super
        sink.add(1); sink.add(2);
    }

    // Generic pair record
    record Pair<A, B>(A first, B second) {
        <C> Pair<A, C> withSecond(C c) { return new Pair<>(first, c); }
    }

    public static void main(String[] args) {
        Result<Integer> parsed = Result.ok("42").map(Integer::parseInt).map(n -> n * 2);
        Result<Integer> failed = Result.<String>fail("bad input").map(Integer::parseInt);
        System.out.println(parsed.orElse(-1) + " " + failed.orElse(-1));

        System.out.println(max(List.of(3, 9, 4)) + " " + max(List.of("pear", "apple", "zebra")));
        System.out.println(sum(List.of(1, 2.5, 3L)));

        List<Number> numbers = new ArrayList<>();
        addDefaults(numbers);
        System.out.println(numbers);

        Pair<String, Integer> p = new Pair<>("age", 36);
        System.out.println(p.withSecond(true));
    }
}`,
      codeLabel: 'Generic classes, methods, bounds and wildcards',
      keyPoints: [
        'Generics give compile-time type safety and remove casts.',
        'Bound type parameters with extends to call methods like compareTo.',
        'PECS: ? extends for reading (producer), ? super for writing (consumer).',
        'Type erasure: no primitives, no new T(), no instanceof with type arguments.',
      ],
    },
    {
      title: 'Records, Sealed Classes & Pattern Matching',
      after: 'Generics',
      content: `Modern Java (16–21) adds features for modelling **data** concisely and safely.

### Records (Java 16)

\`record Point(int x, int y) {}\` generates a constructor, accessors (\`x()\`), \`equals\`, \`hashCode\` and \`toString\`. Records are **immutable** and final. Add validation in a *compact constructor*.

### Sealed classes (Java 17)

\`sealed interface Shape permits Circle, Square\` lists every allowed subtype. The compiler then knows the hierarchy is closed — enabling exhaustive \`switch\` without a \`default\`.

### Pattern matching (Java 21)

- \`instanceof\` patterns: \`if (obj instanceof String s)\`
- **Switch patterns** with guards: \`case Circle c when c.radius() > 10 ->\`
- **Record patterns** destructure: \`case Point(int x, int y) ->\`

Together these give Java algebraic data types similar to Kotlin's sealed classes or TypeScript discriminated unions.`,
      code: `import java.util.*;

public class ModernJava {

    // Record with compact constructor validation
    record Money(long cents, String currency) {
        Money {
            if (cents < 0) throw new IllegalArgumentException("negative amount");
            currency = currency.toUpperCase();
        }
        Money plus(Money other) { return new Money(cents + other.cents, currency); }
        @Override public String toString() { return "%s %.2f".formatted(currency, cents / 100.0); }
    }

    // Sealed hierarchy of records
    sealed interface Shape permits Circle, Rect, Triangle {}
    record Circle(double radius) implements Shape {}
    record Rect(double width, double height) implements Shape {}
    record Triangle(double base, double height) implements Shape {}

    // Exhaustive switch — no default needed; adding a new Shape breaks compilation here
    static double area(Shape shape) {
        return switch (shape) {
            case Circle c -> Math.PI * c.radius() * c.radius();
            case Rect(double w, double h) -> w * h;                      // record pattern
            case Triangle(var b, var h) -> 0.5 * b * h;
        };
    }

    static String classify(Object o) {
        return switch (o) {
            case null -> "null!";
            case Integer i when i > 100 -> "big int " + i;               // guard
            case Integer i -> "int " + i;
            case String s when s.isBlank() -> "blank string";
            case String s -> "string of " + s.length();
            case Rect(var w, var h) when w == h -> "square " + w;
            case Shape s -> "shape with area %.1f".formatted(area(s));
            default -> "other " + o.getClass().getSimpleName();
        };
    }

    public static void main(String[] args) {
        Money total = new Money(1999, "usd").plus(new Money(1, "usd"));
        System.out.println(total + " " + total.equals(new Money(2000, "USD")));

        List<Object> things = Arrays.asList(7, 500, "", "hello", new Rect(2, 2), new Circle(1), 3.5, null);
        things.forEach(t -> System.out.println(classify(t)));
    }
}`,
      codeLabel: 'Records, sealed types and switch patterns (Java 21)',
      keyPoints: [
        'Records are concise immutable data carriers with generated equals/hashCode/toString.',
        'Validate record fields in a compact constructor.',
        'Sealed hierarchies make switch exhaustive without default.',
        'Record patterns and guards (when) destructure and filter in one step.',
      ],
    },
    {
      title: 'Optional',
      after: 'Stream Collectors',
      content: `\`Optional<T>\` is a container that **may or may not** hold a value. It makes "no result" explicit in a method's return type instead of returning \`null\`.

### Creating

\`Optional.of(value)\` (non-null), \`Optional.ofNullable(maybeNull)\`, \`Optional.empty()\`.

### Consuming — prefer functional style

| Method | Use |
|---|---|
| \`map\` / \`flatMap\` / \`filter\` | Transform without null checks |
| \`orElse(default)\` | Fallback value (always evaluated) |
| \`orElseGet(() -> …)\` | Lazy fallback (evaluated only if empty) |
| \`orElseThrow()\` | Throw \`NoSuchElementException\` or a custom exception |
| \`ifPresent\` / \`ifPresentOrElse\` | Side effects |
| \`stream()\` | 0 or 1 element stream (Java 9+) |

### Guidelines

- ✅ Use as a **return type** for "might not find it" methods (\`findById\`).
- ❌ Do not use for fields, method parameters or collections (return an empty list instead).
- ❌ Avoid \`isPresent()\` + \`get()\` pairs — that is just a null check with extra steps.`,
      code: `import java.util.*;

public class OptionalDemo {
    record Address(String city, String zip) {}
    record User(String name, Address address, String email) {}

    static final Map<Integer, User> DB = Map.of(
        1, new User("Ada", new Address("London", "N1"), "ada@dev.io"),
        2, new User("Bob", null, null));

    static Optional<User> findById(int id) { return Optional.ofNullable(DB.get(id)); }

    public static void main(String[] args) {
        // Chain without a single null check
        String city = findById(1).map(User::address).map(Address::city).orElse("unknown");
        String city2 = findById(2).map(User::address).map(Address::city).orElse("unknown");
        System.out.println(city + " / " + city2);

        // filter + orElseGet (lazy)
        String domain = findById(1)
                .map(User::email)
                .filter(e -> e.contains("@"))
                .map(e -> e.substring(e.indexOf('@') + 1))
                .orElseGet(() -> "no-domain");
        System.out.println(domain);

        // Side effects
        findById(3).ifPresentOrElse(
                u -> System.out.println("found " + u.name()),
                () -> System.out.println("user 3 not found"));

        // Custom exception
        try {
            findById(42).orElseThrow(() -> new IllegalArgumentException("No user 42"));
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }

        // Optional in streams: flatten present values
        List<String> emails = List.of(1, 2, 3).stream()
                .map(OptionalDemo::findById)
                .flatMap(Optional::stream)
                .map(User::email)
                .filter(Objects::nonNull)
                .toList();
        System.out.println(emails);
    }
}`,
      codeLabel: 'Null-safe chains with Optional',
      keyPoints: [
        'Return Optional from methods that may not find a value.',
        'Chain map/filter/orElse instead of null checks.',
        'orElseGet is lazy; orElse always evaluates its argument.',
        'Never use Optional for fields, parameters or collections.',
      ],
    },
    {
      title: 'Date & Time API',
      after: 'Optional',
      content: `The \`java.time\` package (Java 8+) replaced the error-prone \`Date\` and \`Calendar\`. All classes are **immutable** and thread-safe.

| Class | Represents | Example |
|---|---|---|
| \`LocalDate\` | date without time zone | birthday \`2026-10-25\` |
| \`LocalTime\` | time of day | opening hours \`09:00\` |
| \`LocalDateTime\` | date + time, no zone | a meeting in "local" terms |
| \`ZonedDateTime\` | date + time + zone (DST-aware) | flight departure in Europe/Paris |
| \`Instant\` | a point on the UTC timeline | timestamps, logs, DB columns |
| \`Duration\` | time-based amount (h/m/s) | timeout of 30 seconds |
| \`Period\` | date-based amount (y/m/d) | subscription of 1 month |
| \`DateTimeFormatter\` | parsing & formatting | \`"dd MMM yyyy"\` |

### Best practices

Store and transmit **\`Instant\`/UTC**; convert to a \`ZonedDateTime\` only for display. Inject a \`Clock\` into services so tests can control "now".`,
      code: `import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.*;

public class DatesDemo {
    public static void main(String[] args) {
        LocalDate release = LocalDate.of(2026, Month.OCTOBER, 25);
        LocalDate nextWeek = release.plusWeeks(1);                 // immutable: returns new object
        System.out.println(release + " -> " + nextWeek + " " + nextWeek.getDayOfWeek());

        // Differences
        LocalDate birthday = LocalDate.of(1990, 3, 15);
        Period age = Period.between(birthday, release);
        long days = ChronoUnit.DAYS.between(birthday, release);
        System.out.println("Age: " + age.getYears() + "y " + age.getMonths() + "m, " + days + " days");

        // Adjusters
        System.out.println("Last day of month: " + release.with(TemporalAdjusters.lastDayOfMonth()));
        System.out.println("Next Monday: " + release.with(TemporalAdjusters.next(DayOfWeek.MONDAY)));

        // Formatting & parsing
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");
        LocalDateTime meeting = LocalDateTime.of(release, LocalTime.of(14, 30));
        System.out.println(meeting.format(fmt));
        LocalDate parsed = LocalDate.parse("2026-12-31");
        System.out.println(parsed.isAfter(release) + " leap? " + parsed.isLeapYear());

        // Time zones
        ZonedDateTime paris = meeting.atZone(ZoneId.of("Europe/Paris"));
        ZonedDateTime tokyo = paris.withZoneSameInstant(ZoneId.of("Asia/Tokyo"));
        System.out.println(paris + "\\n" + tokyo);

        // Instant & Duration
        Instant start = Instant.parse("2026-10-25T10:00:00Z");
        Instant end = start.plus(Duration.ofMinutes(95));
        System.out.println(Duration.between(start, end).toHoursPart() + "h "
                + Duration.between(start, end).toMinutesPart() + "m");

        // Testable "now"
        Clock fixed = Clock.fixed(start, ZoneOffset.UTC);
        System.out.println(LocalDate.now(fixed));
    }
}`,
      codeLabel: 'java.time essentials',
      keyPoints: [
        'All java.time types are immutable and thread-safe.',
        'Use LocalDate/LocalDateTime for local values, ZonedDateTime for zones, Instant for timestamps.',
        'Period = years/months/days; Duration = hours/minutes/seconds.',
        'Store UTC Instants; inject a Clock for testable code.',
      ],
    },
    {
      title: 'File I/O & NIO.2',
      after: 'Date & Time API',
      content: `Modern file handling uses \`java.nio.file\` — \`Path\` for locations and the static \`Files\` utility class for operations.

| Task | API |
|---|---|
| Build a path | \`Path.of("data", "users.csv")\` |
| Read small file | \`Files.readString(path)\`, \`Files.readAllLines(path)\` |
| Read large file lazily | \`Files.lines(path)\` (Stream — close it!) or \`Files.newBufferedReader\` |
| Write | \`Files.writeString(path, text, StandardOpenOption.APPEND)\` |
| Copy / move / delete | \`Files.copy\`, \`Files.move\`, \`Files.deleteIfExists\` |
| Directories | \`Files.createDirectories\`, \`Files.list\`, \`Files.walk\` |
| Metadata | \`Files.size\`, \`Files.exists\`, \`Files.getLastModifiedTime\` |

### Rules

- Always specify or rely on **UTF-8** (the default since Java 18).
- Close streams with **try-with-resources** — \`Files.lines\` and \`Files.walk\` hold file handles.
- For very large files, stream line by line instead of loading everything into memory.`,
      code: `import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

public class FilesDemo {
    public static void main(String[] args) throws IOException {
        Path dir = Files.createTempDirectory("demo");
        Path csv = dir.resolve("users.csv");

        // Write
        Files.writeString(csv, "name,age\\nAda,36\\nLinus,54\\nGrace,85\\n");
        Files.writeString(csv, "Alan,41\\n", StandardOpenOption.APPEND);

        // Read all (small files)
        List<String> lines = Files.readAllLines(csv);
        System.out.println(lines.size() + " lines, " + Files.size(csv) + " bytes");

        // Stream lazily (large files) — try-with-resources closes the file
        try (Stream<String> rows = Files.lines(csv)) {
            double avgAge = rows.skip(1)
                    .map(l -> l.split(","))
                    .mapToInt(p -> Integer.parseInt(p[1]))
                    .average().orElse(0);
            System.out.printf("Average age %.1f%n", avgAge);
        }

        // Buffered writer for many small writes
        Path report = dir.resolve("report.txt");
        try (BufferedWriter w = Files.newBufferedWriter(report)) {
            for (String line : lines.subList(1, lines.size())) {
                w.write(line.toUpperCase());
                w.newLine();
            }
        }

        // Copy, list and walk
        Files.copy(report, dir.resolve("report-backup.txt"), StandardCopyOption.REPLACE_EXISTING);
        try (Stream<Path> files = Files.list(dir)) {
            files.map(p -> p.getFileName().toString()).sorted().forEach(System.out::println);
        }

        // Clean up recursively (deepest paths first)
        try (Stream<Path> walk = Files.walk(dir)) {
            walk.sorted(Comparator.reverseOrder()).forEach(p -> p.toFile().delete());
        }
        System.out.println("exists after cleanup? " + Files.exists(dir));
    }
}`,
      codeLabel: 'Reading, writing and walking files',
      keyPoints: [
        'Use Path + Files (NIO.2) instead of legacy java.io.File.',
        'readString/readAllLines for small files; lines()/BufferedReader for big ones.',
        'Close Files.lines/list/walk streams with try-with-resources.',
        'UTF-8 is the default charset since Java 18.',
      ],
    },
    {
      title: 'Unit Testing with JUnit 5',
      after: 'Build & Deploy',
      content: `**JUnit 5 (Jupiter)** is the standard Java testing framework, usually combined with **AssertJ** for fluent assertions and **Mockito** for mocking dependencies.

### Core annotations

| Annotation | Purpose |
|---|---|
| \`@Test\` | Marks a test method |
| \`@BeforeEach\` / \`@AfterEach\` | Run around every test |
| \`@BeforeAll\` / \`@AfterAll\` | Run once per class (static) |
| \`@DisplayName\` | Readable test name |
| \`@ParameterizedTest\` + \`@CsvSource\`/\`@ValueSource\` | Same test, many inputs |
| \`@Nested\` | Group related tests |
| \`@Disabled\` | Skip a test |

### Structure: Arrange – Act – Assert

Each test should check **one behaviour**, have a descriptive name, and be independent of other tests (no shared mutable state).

### Running

\`mvn test\` or \`./gradlew test\`. Add the JaCoCo plugin for coverage reports.`,
      code: `// pom.xml (test scope): org.junit.jupiter:junit-jupiter, org.assertj:assertj-core, org.mockito:mockito-junit-jupiter
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

// ---- Code under test ----
interface PriceRepository { double basePrice(String sku); }

class PriceService {
    private final PriceRepository repo;
    PriceService(PriceRepository repo) { this.repo = repo; }

    double priceFor(String sku, int qty) {
        if (qty <= 0) throw new IllegalArgumentException("qty must be positive");
        double total = repo.basePrice(sku) * qty;
        return qty >= 10 ? total * 0.9 : total;        // 10% bulk discount
    }
}

// ---- Tests ----
@ExtendWith(MockitoExtension.class)
class PriceServiceTest {

    @Mock PriceRepository repo;
    @InjectMocks PriceService service;

    @Test
    @DisplayName("applies no discount below 10 items")
    void noDiscount() {
        when(repo.basePrice("A1")).thenReturn(5.0);          // Arrange
        double price = service.priceFor("A1", 2);            // Act
        assertThat(price).isEqualTo(10.0);                   // Assert
        verify(repo).basePrice("A1");
    }

    @ParameterizedTest(name = "{1} items -> {2}")
    @CsvSource({ "2.0, 10, 18.0", "2.0, 9, 18.0", "1.5, 20, 27.0" })
    void bulkDiscount(double unit, int qty, double expected) {
        when(repo.basePrice(anyString())).thenReturn(unit);
        assertThat(service.priceFor("X", qty)).isCloseTo(expected, within(0.001));
    }

    @Test
    void rejectsInvalidQuantity() {
        assertThatThrownBy(() -> service.priceFor("A1", 0))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("positive");
        verifyNoInteractions(repo);
    }
}`,
      codeLabel: 'JUnit 5 + AssertJ + Mockito',
      keyPoints: [
        'Structure tests as Arrange–Act–Assert, one behaviour per test.',
        'Use @ParameterizedTest to cover many inputs without duplication.',
        'Mock dependencies (Mockito) to test a class in isolation.',
        'AssertJ assertions read like sentences and give clear failure messages.',
      ],
    },
  ],
};

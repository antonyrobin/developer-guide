export const jsCourse = {
  id: 'javascript',
  title: 'JavaScript',
  description: 'The programming language of the web — interactive, dynamic, everywhere.',
  officialDocs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  tutorialLink: 'https://www.w3schools.com/js/',
  exerciseLink: 'https://www.w3schools.com/js/js_exercises.asp',
  sections: [
    {
      title: 'What is JavaScript',
      content: `JavaScript is a high-level, interpreted programming language that makes web pages dynamic and interactive. It is the only programming language that runs natively in web browsers, making it the de facto language of the web.\n\nOriginally created by Brendan Eich in just 10 days in 1995, JavaScript has evolved from a simple scripting language into a full-featured platform. With Node.js (2009), JavaScript broke free from the browser and can now run servers, command-line tools, desktop apps (Electron), mobile apps (React Native), and even IoT devices.\n\nThe Three Pillars of the Web: HTML provides the structure (the bones), CSS provides the presentation (the appearance), and JavaScript provides the behavior (the intelligence). Together they form every web page you visit. Without JavaScript, a web page is a static document — you cannot click a button and see a result without reloading, filter a list in real time, or show interactive charts.\n\nJavaScript is dynamically typed (variables can hold any type), prototype-based, event-driven (responds to user actions), and single-threaded (uses an event loop for concurrency). The ECMAScript specification (maintained by TC39) standardizes JavaScript. ES6/ES2015 introduced revolutionary features — let/const, arrow functions, classes, promises, modules — and annual releases continue adding features.`,
      image: '/images/javascript/js-html-css-relationship.jpeg',
      keyPoints: [
        'Only language that runs natively in browsers.',
        'HTML = structure, CSS = presentation, JS = behavior.',
        'Node.js enables server-side JavaScript.',
        'Dynamically typed, event-driven, single-threaded.',
        'ES6 (2015) was a transformative, revolutionary update.'
      ]
    },
    {
      title: 'Variables, Data Types & Type Conversion',
      content: `JavaScript has three ways to declare variables. let declares a block-scoped variable that can be reassigned. const declares a block-scoped variable that cannot be reassigned (but objects/arrays it holds CAN be mutated). var is the legacy keyword — it is function-scoped and hoisted, leading to subtle bugs. Rule: always use const by default, use let when you need to reassign, never use var.\n\nJavaScript has 8 data types. Primitive types are immutable values passed by copy: String ("hello"), Number (42, 3.14 — no separate integer type), BigInt (very large integers), Boolean (true/false), undefined (declared but not yet assigned), null (intentionally empty), and Symbol (unique identifiers). Reference types are mutable and passed by reference: Object ({key: value}), Array ([1, 2, 3]), and Function.\n\nType coercion is JavaScript's automatic type conversion. It causes notorious quirks: "5" + 3 = "53" (string concatenation) but "5" - 3 = 2 (numeric subtraction). Explicit conversion: Number("5") → 5, String(42) → "42", Boolean(0) → false. Always use === (strict equality) instead of == (loose equality with coercion) to avoid surprises.\n\nScope & Hoisting: var declarations are hoisted to the top of their function and initialized as undefined. let and const are hoisted but remain in a "temporal dead zone" until their declaration line — accessing them before causes a ReferenceError. Function declarations are fully hoisted including their body.`,
      image: '/images/javascript/js-data-types.jpg',
      code: `// Variable declarations
const API_URL = "https://api.example.com"; // Cannot reassign
let count = 0;                              // Can reassign

// Primitives (passed by VALUE)
const name = "Alice";       // String
const age = 28;             // Number
const isActive = true;      // Boolean
let score;                  // undefined

// References (passed by REFERENCE)
const user = { name: "Bob", age: 30 };
const colors = ["red", "blue"];

// Type checking
typeof "hello"    // "string"
typeof 42         // "number"
typeof null       // "object" (famous JS quirk)
Array.isArray([]) // true

// Explicit conversion
Number("42")     // 42
String(100)      // "100"
Boolean(0)       // false — 0, "", null, undefined all falsy

// Always use ===
"5" == 5   // true  (loose — coerces)
"5" === 5  // false (strict — no coercion)`,
      codeLabel: 'Variables, Types & Conversion',
      keyPoints: [
        'Use const by default, let when reassignment needed, never var.',
        '7 primitive types + Object/Array/Function reference types.',
        'Always use === (strict equality) to avoid coercion surprises.',
        'var is function-scoped and hoisted; let/const are block-scoped.',
        'Primitives are copied by value; objects are copied by reference.'
      ]
    },
    {
      title: 'Type Conversion & Coercion',
      content: `JavaScript performs type conversion in two ways: implicit coercion (automatic, done by the engine) and explicit conversion (manual, done by the developer). Understanding the difference is essential to avoid bugs.\n\nImplicit Coercion happens when you use operators on values of different types. The + operator with a string triggers string concatenation: "5" + 3 becomes "53". The -, *, / operators convert strings to numbers: "5" - 3 becomes 2. Comparison with == converts types before comparing — known as "the equality trap." With booleans, true becomes 1 and false becomes 0.\n\nExplicit Conversion (preferred): Number() converts to a number — Number("42") → 42, Number("") → 0, Number("abc") → NaN. parseInt() and parseFloat() parse strings for numbers. String() and .toString() convert to strings. Boolean() converts to boolean — falsy values (0, "", null, undefined, NaN, false) become false; everything else becomes true.\n\nNaN (Not a Number) is a special numeric value representing invalid math results like parseInt("abc"). Check with Number.isNaN() (not the global isNaN() which coerces first). null == undefined is true (one of the few useful == cases), but null === undefined is false.`,
      image: '/images/javascript/js-type-conversion.webp',
      code: `// Implicit coercion (automatic — avoid relying on it)
"5" + 3       // "53"  (+ prefers concatenation)
"5" - 3       // 2     (- forces numeric)
true + 1      // 2     (true → 1)
false + "x"   // "falsex"

// Explicit conversion (intentional — preferred)
Number("42")     // 42
Number("")       // 0
Number("abc")    // NaN
parseInt("42px") // 42 (stops at non-numeric)
parseFloat("3.14px") // 3.14

String(42)       // "42"
(42).toString()  // "42"

Boolean(0)       // false (falsy)
Boolean("")      // false (falsy)
Boolean(null)    // false (falsy)
Boolean([])      // true  (truthy — empty array!)
Boolean({})      // true  (truthy — empty object!)

// NaN checks
Number.isNaN(NaN)       // true (strict)
Number.isNaN("abc")     // false (no coercion)
isNaN("abc")            // true  (coerces first, avoid)

// Equality traps
null == undefined   // true  (special case)
null === undefined  // false`,
      codeLabel: 'Type Conversion & Coercion',
      keyPoints: [
        'Implicit coercion is automatic and can cause subtle bugs.',
        'Explicit conversion (Number(), String(), Boolean()) is predictable.',
        'Falsy values: 0, "", null, undefined, NaN, false.',
        'Empty arrays [] and objects {} are truthy — common surprise.',
        'Use Number.isNaN() not global isNaN() for NaN checks.'
      ]
    },
    {
      title: 'Functions, Scope & Closures',
      content: `Functions are first-class citizens in JavaScript — they can be assigned to variables, passed as arguments, and returned from other functions. There are three ways to define them: function declarations (hoisted), function expressions (not hoisted), and arrow functions (=> concise, no own "this").\n\nScope determines where variables are accessible. Global scope: accessible everywhere (minimize pollution). Function scope: variables inside a function stay inside. Block scope (let/const): variables inside {} stay in that block. Hoisting: var declarations and function declarations are moved to the top of their scope by the engine at compile time.\n\nClosures are one of JavaScript's most powerful features. A closure is when an inner function retains access to variables from its outer (enclosing) function even after the outer function has finished executing. This enables data privacy (simulating private variables), factory functions (functions that create other functions), and memoization.\n\nThe this keyword is context-dependent. In a regular function, this refers to the calling object. Arrow functions inherit this from the enclosing lexical scope (no own this). Explicit binding: .call(), .apply(), and .bind() let you manually set this.`,
      image: '/images/javascript/js-variable-scope-hoisting.jpg',
      code: `// Function declaration (hoisted)
function greet(name = "World") {
  return \`Hello, \${name}!\`;
}

// Arrow function (concise, no own 'this')
const add = (a, b) => a + b;
const double = n => n * 2; // Single param — no parens needed

// Closure — private state
function createCounter() {
  let count = 0;                // Private — not accessible outside
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}
const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2 — count is private!

// Factory function using closure
function createMultiplier(factor) {
  return (num) => num * factor; // Remembers 'factor'
}
const triple = createMultiplier(3);
triple(5); // 15

// 'this' with arrow vs regular
const obj = {
  value: 42,
  getRegular: function() { return this.value; }, // 42 ✓
  getArrow: () => this.value, // undefined (inherits outer 'this')
};`,
      codeLabel: 'Functions, Scope & Closures',
      keyPoints: [
        'Arrow functions have no own "this" — they inherit from outer scope.',
        'Closures let inner functions access outer variables after execution.',
        'var is hoisted and initialized; let/const are hoisted but not initialized.',
        'Closures enable data privacy and factory functions.',
        'Use .bind() to explicitly set "this" for regular functions.'
      ]
    },
    {
      title: 'Objects & Prototypes',
      content: `Objects are the core data structure in JavaScript — almost everything is an object. An object is a collection of key-value pairs called properties. Values can be primitives, other objects, or functions (called "methods" when inside an object).\n\nObject creation: Object literal {} is most common. Object.create() creates with a specific prototype. Constructor functions and class syntax create objects with shared methods via prototypes.\n\nPrototype chain: Every object has a hidden __proto__ link to its prototype object. When you access a property, JS first checks the object itself, then its prototype, then the prototype's prototype — up the chain until null. This enables inheritance without duplication: all arrays share Array.prototype methods like .push(), .map().\n\nES6 Classes are syntactic sugar over prototypes. They provide a cleaner syntax for constructor functions and inheritance, but the underlying mechanism is still prototype-based. Use extends for inheritance and super() to call the parent constructor.\n\nDestructuring and the spread operator work seamlessly with objects. Object.keys(), Object.values(), and Object.entries() iterate over properties. Object.assign() and spread ({...obj}) create shallow copies.\n\nJSON (JavaScript Object Notation) is a text format based on JS object syntax. JSON.stringify() converts JS to JSON string; JSON.parse() parses JSON back to JS. JSON only supports strings, numbers, booleans, null, arrays, and plain objects — no functions or undefined.`,
      image: '/images/javascript/js-objects.jpg',
      code: `// Object literal
const user = {
  name: "Alice",
  age: 28,
  greet() {           // Method shorthand
    return \`Hi, I'm \${this.name}\`;
  }
};

// Destructuring
const { name, age } = user;
const { name: displayName } = user; // Rename

// Computed property name
const key = "status";
const config = { [key]: "active" }; // { status: "active" }

// ES6 Classes
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() { return \`\${this.name} makes a sound.\`; }
}

class Dog extends Animal {
  speak() { return \`\${this.name} barks.\`; }
}
const dog = new Dog("Rex");
dog.speak(); // "Rex barks."

// Object iteration
Object.keys(user)    // ["name", "age"]
Object.values(user)  // ["Alice", 28, greet fn]
Object.entries(user) // [["name","Alice"], ["age",28], ...]

// Shallow copy
const copy = { ...user, age: 30 }; // Clone + override`,
      codeLabel: 'Objects, Classes & Prototypes',
      keyPoints: [
        'Everything in JS is an object (except primitives).',
        'Prototype chain enables property sharing without duplication.',
        'ES6 classes are syntactic sugar — prototypes underneath.',
        'Use extends and super() for class inheritance.',
        'Object spread { ...obj } creates a shallow copy.'
      ]
    },
    {
      title: 'Arrays & Array Methods',
      content: `Arrays are ordered collections of values. Modern JavaScript provides powerful built-in methods that make array manipulation concise and expressive using a functional, immutable style.\n\nTransformation methods (return a NEW array — immutable): map() transforms each element into a new value. filter() keeps only elements passing a test. slice(start, end) extracts a portion without mutating. flat() / flatMap() flattens nested arrays.\n\nSearch & test methods: find() returns the first matching element (or undefined). findIndex() returns its index. includes() checks if a value exists. some() returns true if ANY element passes. every() returns true if ALL elements pass.\n\nReduction: reduce(callback, initialValue) accumulates all elements into a single value — the Swiss Army knife of array methods. It can replicate map, filter, and more.\n\nMutation methods (modify original — use carefully): push()/pop() add/remove from end. unshift()/shift() add/remove from start. splice(index, count, ...items) inserts/removes at any position. sort() sorts in place — WARNING: sorts as strings by default, use a comparator for numbers: .sort((a, b) => a - b). reverse() reverses in place.\n\nDestructuring and spread: const [first, ...rest] = array. [...arr1, ...arr2] merges. [...new Set(arr)] removes duplicates.`,
      image: '/images/javascript/js-array-methods.jpg',
      code: `const users = [
  { name: "Alice", age: 28, role: "dev" },
  { name: "Bob",   age: 35, role: "pm"  },
  { name: "Carol", age: 24, role: "dev" },
];

// map — transform
const names = users.map(u => u.name); // ["Alice","Bob","Carol"]

// filter — keep matching
const devs = users.filter(u => u.role === "dev");

// find — first match
const bob = users.find(u => u.name === "Bob");

// reduce — accumulate
const totalAge = users.reduce((sum, u) => sum + u.age, 0); // 87

// some / every
users.some(u => u.age > 30)  // true  (Bob is 35)
users.every(u => u.age > 20) // true

// sort (use comparator for numbers)
const sorted = [...users].sort((a, b) => a.age - b.age);

// Chaining
const devNames = users
  .filter(u => u.role === "dev")
  .map(u => u.name.toUpperCase())
  .sort(); // ["ALICE", "CAROL"]

// Remove duplicates
const unique = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]`,
      codeLabel: 'Array Methods',
      keyPoints: [
        'map/filter/reduce are the three most important array methods.',
        'These methods return new arrays — original untouched (immutable).',
        'sort() converts to strings by default — always use a comparator.',
        'Method chaining creates clean, readable data pipelines.',
        'Use [...new Set(arr)] to remove duplicates instantly.'
      ]
    },
    {
      title: 'DOM Manipulation',
      content: `The Document Object Model (DOM) is the browser's live, in-memory representation of an HTML page as a tree of objects. Every tag becomes a node in the tree. JavaScript can read, modify, add, or remove any node — making the page dynamic and interactive.\n\nSelecting elements: getElementById("id") is fastest for single elements. querySelector(cssSelector) selects the first match for any CSS selector. querySelectorAll(cssSelector) returns a static NodeList of all matches.\n\nReading & modifying: element.textContent reads/sets text (safe from XSS). element.innerHTML reads/sets raw HTML — never set with user input. element.getAttribute("href") reads an attribute. element.setAttribute("src", "new.jpg") sets one. element.style.color = "red" sets inline styles. classList.add(), .remove(), .toggle(), .contains() manage CSS classes cleanly.\n\nCreating & inserting: document.createElement("div") creates a new element. Set its properties, then insert with appendChild(), insertBefore(), or the modern prepend()/append()/after()/before(). element.remove() deletes an element.\n\nEvents: addEventListener("event", handler) attaches events. Common events: click, input, submit, keydown, mouseover, scroll, DOMContentLoaded. Event delegation — attaching one listener to a parent for all children — is a key performance technique for dynamic lists.`,
      image: '/images/javascript/js-dom-tree.png',
      code: `// Selecting
const title = document.getElementById("page-title");
const buttons = document.querySelectorAll(".btn");
const nav = document.querySelector("nav");

// Modifying
title.textContent = "Updated Title";       // Safe
title.classList.toggle("dark");
title.setAttribute("data-page", "home");

// Creating & inserting
const card = document.createElement("div");
card.className = "card";
card.innerHTML = \`<h3>New Card</h3>\`;       // OK — no user data
document.querySelector(".grid").append(card);

// Events
document.querySelector("#submit").addEventListener("click", (e) => {
  e.preventDefault();
  const val = document.querySelector("#input").value;
  console.log("Submitted:", val);
});

// Event delegation — one listener for a dynamic list
document.querySelector(".list").addEventListener("click", (e) => {
  if (e.target.matches(".delete-btn")) {
    e.target.closest("li").remove();
  }
  if (e.target.matches(".edit-btn")) {
    const item = e.target.closest("li");
    item.contentEditable = true;
    item.focus();
  }
});`,
      codeLabel: 'DOM Manipulation',
      keyPoints: [
        'querySelector/querySelectorAll accept any CSS selector.',
        'Use textContent (safe) not innerHTML to set user-generated text.',
        'classList.toggle() is perfect for adding/removing active states.',
        'Event delegation = one listener on parent for all child elements.',
        'Always call e.preventDefault() to stop default form/link behavior.'
      ]
    },
    {
      title: 'Synchronous vs Asynchronous',
      content: `Understanding the difference between synchronous and asynchronous code is fundamental to JavaScript. It explains why the language behaves very differently from Python or Java.\n\nSynchronous execution is sequential and blocking. Each line must finish before the next runs. If a task takes 3 seconds (e.g., reading a file), the entire program freezes for 3 seconds. This makes synchronous code simple to reason about but terrible for long-running tasks.\n\nAsynchronous execution is non-blocking. When an async task starts (fetch, setTimeout, file read), it is handed off to a background API, and JavaScript continues running the next lines immediately. A callback or Promise resolves later when the task completes.\n\nWhy JavaScript needed async: It is single-threaded (one call stack), designed for browsers where the UI thread must always be responsive. If synchronous network calls were allowed, clicking a button that fetches data would freeze the entire tab — no scrolling, no animations, nothing.\n\nReal-world async operations: Network requests (fetch), timers (setTimeout, setInterval), file I/O in Node.js, geolocation (navigator.geolocation), IndexedDB reads. All of these return Promises in modern JavaScript.\n\nThink of it like a restaurant: synchronous = one waiter who stands until your food is ready (no other tables served). Asynchronous = the waiter takes your order, starts it, then serves other tables while yours cooks.`,
      image: '/images/javascript/js-sync-vs-async.jpeg',
      code: `// SYNCHRONOUS — blocks execution
console.log("1. Order taken");
const result = heavyComputation(); // Blocks everything
console.log("2. Done:", result);
// Output: 1, then PAUSE, then 2

// ASYNCHRONOUS — non-blocking
console.log("1. Order taken");
setTimeout(() => {
  console.log("3. Food ready!"); // Executes later
}, 2000);
console.log("2. Serving other tables");
// Output: 1, 2, (2 seconds later) 3

// Real-world async: network request
console.log("Before fetch");
fetch("https://api.example.com/users")
  .then(res => res.json())
  .then(data => console.log("Data received:", data));
console.log("After fetch (runs BEFORE data arrives)");
// Output: "Before fetch", "After fetch", ...later... "Data received"`,
      codeLabel: 'Sync vs Async Execution',
      keyPoints: [
        'Synchronous = sequential and blocking — one task at a time.',
        'Asynchronous = non-blocking — other code runs while waiting.',
        'JavaScript is single-threaded — async prevents freezing the UI.',
        'Async operations: fetch, setTimeout, file I/O, geolocation.',
        'Code after an async call runs immediately — before the result arrives.'
      ]
    },
    {
      title: 'Callbacks & Callback Hell',
      content: `Before Promises, asynchronous JavaScript was handled with callbacks — functions passed as arguments to be called when an async operation completed. Callbacks work but have a critical weakness: nesting.\n\nA callback is simply a function passed to another function: setTimeout(function() { ... }, 1000). The passed function is "called back" when the timer fires. This pattern is used for events, HTTP requests, file reads, and timers.\n\nCallback Hell (also called "Pyramid of Doom") occurs when callbacks are nested inside each other to handle sequential async operations. Imagine: get user → get their posts → get comments on each post → get each commenter's profile. Each step nests deeper, creating code that is impossible to read, maintain, or debug.\n\nProblems with deeply nested callbacks: Horizontal code drift (code keeps indenting right). Difficult error handling (need to check errors at every level). Hard to refactor or reuse individual steps. Try/catch does not work across async boundaries.\n\nModern JavaScript solves this with Promises (ES2015) and async/await (ES2017), which enable writing sequential-looking async code without nesting. Callbacks are still used for event listeners and simple one-off async operations.`,
      image: '/images/javascript/js-callback-hell.jpeg',
      code: `// Basic callback pattern
setTimeout(function() {
  console.log("Done after 1 second");
}, 1000);

// CALLBACK HELL — sequential async operations
getUser(userId, function(err, user) {
  if (err) return handleError(err);
  getPosts(user.id, function(err, posts) {
    if (err) return handleError(err);
    getComments(posts[0].id, function(err, comments) {
      if (err) return handleError(err);
      getProfile(comments[0].userId, function(err, profile) {
        if (err) return handleError(err);
        // Doing something useful WAYYY over here →
        console.log("Finally got:", profile);
      });
    });
  });
});

// Solution: Promises (flat, readable)
getUser(userId)
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => getProfile(comments[0].userId))
  .then(profile => console.log("Got:", profile))
  .catch(err => handleError(err));`,
      codeLabel: 'Callbacks & Callback Hell',
      keyPoints: [
        'Callbacks = functions passed to run after async operations.',
        'Callback hell = deeply nested callbacks for sequential async steps.',
        'Problems: unreadable, error-prone, hard to maintain.',
        'Promises and async/await solve callback hell.',
        'Callbacks are still valid for events and simple async tasks.'
      ]
    },
    {
      title: 'Promises',
      content: `A Promise is a JavaScript object representing the eventual completion or failure of an asynchronous operation. It allows you to attach callbacks after the fact — removing the need for nesting.\n\nA Promise is always in one of three states: Pending (initial state — the operation is in progress), Fulfilled (the operation completed successfully — .then() is called), or Rejected (the operation failed — .catch() is called). Once settled (fulfilled or rejected), a Promise's state never changes.\n\nCreating a Promise: new Promise((resolve, reject) => { ... }). Call resolve(value) on success and reject(error) on failure. The .then(onFulfilled, onRejected) method handles both. Chain .then() calls for sequential steps — each .then() returns a new Promise. Always add .catch() at the end to handle any error in the chain. .finally() runs regardless of success or failure — good for cleanup.\n\nPromise combinators for parallel operations: Promise.all([p1, p2, p3]) — waits for ALL to fulfill; rejects if ANY rejects. Promise.allSettled([...]) — waits for ALL regardless of outcome (never rejects). Promise.race([...]) — resolves/rejects as soon as the FIRST one settles. Promise.any([...]) — resolves with the first fulfilled; rejects only if ALL reject.`,
      image: '/images/javascript/js-promise-states.png',
      code: `// Creating a Promise
const fetchUser = (id) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (id > 0) {
      resolve({ id, name: "Alice" }); // Success
    } else {
      reject(new Error("Invalid ID")); // Failure
    }
  }, 1000);
});

// Consuming with .then/.catch
fetchUser(1)
  .then(user => {
    console.log("Got:", user);
    return fetchPosts(user.id); // Returns another Promise
  })
  .then(posts => console.log("Posts:", posts))
  .catch(err => console.error("Error:", err.message))
  .finally(() => hideSpinner());

// Promise combinators
const [user, posts, settings] = await Promise.all([
  fetchUser(1),       // Parallel — all run simultaneously
  fetchPosts(1),
  fetchSettings(1),
]);                   // Completes when ALL resolve

// Promise.allSettled — get all results regardless
const results = await Promise.allSettled([fetchA(), fetchB()]);
results.forEach(r => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.error(r.reason);
});`,
      codeLabel: 'Promises',
      keyPoints: [
        'Three states: Pending → Fulfilled or Rejected (never reverses).',
        'Chain .then() for success, .catch() for errors, .finally() for cleanup.',
        'Each .then() returns a new Promise — enabling chaining.',
        'Promise.all() runs parallel requests; fails fast if one rejects.',
        'Promise.allSettled() gets ALL results even if some fail.'
      ]
    },
    {
      title: 'Async / Await',
      content: `Async/Await (introduced in ES2017) is syntactic sugar over Promises that makes asynchronous code look and behave like synchronous code. It is the modern standard for writing async JavaScript.\n\nThe async keyword marks a function as async — it automatically returns a Promise. Inside an async function, you can use the await keyword before any Promise. The execution pauses at that point until the Promise settles, then continues with the resolved value. Critically, the browser is NOT blocked — other JavaScript can run while awaiting.\n\nError handling: wrap await calls in try/catch blocks to handle rejections cleanly. The catch block catches both network errors and manually thrown errors. The finally block always runs — use it to clean up (hide loading spinners, close connections).\n\nTop-level await: In ES2022 modules, you can use await directly at the module's top level without an async wrapper. This is useful for module initialization.\n\nParallel execution: awaiting in sequence (const a = await fetchA(); const b = await fetchB()) is slow — B only starts after A finishes. Use Promise.all for parallel: const [a, b] = await Promise.all([fetchA(), fetchB()]). If one can fail independently, use Promise.allSettled.\n\nDebugging: async/await integrates with browser DevTools far better than Promises — stack traces are clearer and stepping through code works naturally.`,
      image: '/images/javascript/js-async-await.png',
      code: `// Async/await — reads like synchronous code
async function loadUserProfile(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    const user = await response.json();
    return user;

  } catch (error) {
    console.error("Failed to load profile:", error.message);
    return null;            // Return fallback

  } finally {
    hideLoadingSpinner();   // Always runs
  }
}

// Sequential (SLOW — 4 seconds total if each takes 2s)
const user = await fetchUser();
const posts = await fetchPosts(user.id);

// Parallel (FAST — 2 seconds total)
const [user, posts] = await Promise.all([
  fetchUser(),
  fetchPosts()
]);

// Top-level await (ES modules)
const config = await loadConfig();   // No async wrapper needed`,
      codeLabel: 'Async/Await',
      keyPoints: [
        'async functions always return a Promise automatically.',
        'await pauses the async function — not the browser/main thread.',
        'Use try/catch for error handling with async/await.',
        'Sequential awaits are slow — use Promise.all() for parallel.',
        'async/await produces cleaner stack traces than .then() chains.'
      ]
    },
    {
      title: 'The Event Loop',
      content: `The Event Loop is the mechanism that enables JavaScript's non-blocking, asynchronous behavior despite being single-threaded. Understanding it explains many confusing JavaScript behaviors.\n\nThe JavaScript runtime has several components: Call Stack — a LIFO stack where all synchronous code runs. Web APIs — browser-provided async capabilities (setTimeout, fetch, DOM events). Callback Queue (Task Queue) — where Web API callbacks wait after completion. Microtask Queue — higher-priority queue for Promise callbacks (.then, .catch) and mutation observers. Event Loop — the process that constantly checks if the Call Stack is empty; if so, it moves tasks from queues onto the stack.\n\nExecution order: (1) All synchronous code on the Call Stack runs first. (2) All microtasks (Promise .then callbacks) are processed until the Microtask Queue is empty. (3) One macrotask (setTimeout, setInterval callback) is moved from the Callback Queue. (4) Repeat from step 2.\n\nThis explains why console.log after a resolved Promise runs before setTimeout(0): Promise callbacks are microtasks (higher priority). Blocking the Call Stack with a while(true) loop prevents the Event Loop from processing ANY callbacks — the UI freezes completely. This is why heavy computation should be moved to Web Workers.`,
      image: '/images/javascript/js-event-loop-overview.jpg',
      code: `console.log("1 — Sync: Script start");

setTimeout(() => {
  console.log("5 — Macro: setTimeout 0ms");
}, 0);

Promise.resolve()
  .then(() => console.log("3 — Micro: Promise 1"))
  .then(() => console.log("4 — Micro: Promise 2"));

console.log("2 — Sync: Script end");

// Output order:
// 1 — Sync: Script start
// 2 — Sync: Script end
// 3 — Micro: Promise 1       ← microtask queue first
// 4 — Micro: Promise 2       ← all microtasks drain
// 5 — Macro: setTimeout 0ms  ← then macrotask

// Why fetch doesn't block UI
async function loadData() {
  console.log("Fetching...");       // Sync
  const data = await fetch("/api"); // Hands off to Web API
  console.log("Got data");         // Runs after Call Stack free
}
loadData();
console.log("App still responsive!"); // Runs before "Got data"`,
      codeLabel: 'Event Loop Execution Order',
      keyPoints: [
        'Call Stack → Microtask Queue → Macrotask Queue.',
        'Promise .then() callbacks are microtasks (higher priority than setTimeout).',
        'Event Loop only runs when the Call Stack is empty.',
        'Blocking the call stack (heavy loops) freezes the entire UI.',
        'Use Web Workers for heavy computation to keep UI responsive.'
      ]
    },
    {
      title: 'The Fetch API',
      content: `The Fetch API is the modern, built-in way to make HTTP requests in JavaScript. It replaced XMLHttpRequest (XHR) with a cleaner Promise-based API.\n\nfetch(url, options) returns a Promise that resolves to a Response object when the server responds. Critically: fetch only rejects on network errors (no connection, DNS failure). An HTTP 404 or 500 response still resolves — you must manually check response.ok or response.status.\n\nReading the response body: response.json() parses JSON and returns a Promise. response.text() returns the body as a string. response.blob() returns binary data (images, files). These are all async and must be awaited.\n\nThe options object configures the request: method (GET, POST, PUT, DELETE, PATCH), headers (request headers like Content-Type, Authorization), body (request body — for POST/PUT with data), mode (cors, same-origin, no-cors), credentials (whether to include cookies), signal (AbortController to cancel requests).\n\nFor security: always validate server responses, never expose API keys in client-side code, use HTTPS, set Content-Type header correctly for POST requests, and handle CORS configuration on the server.`,
      image: '/images/javascript/js-fetch-api.png',
      code: `// Basic GET request
async function getUsers() {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    const users = await response.json();
    return users;
  } catch (err) {
    console.error(err);
  }
}

// POST request with JSON body
async function createUser(userData) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
}

// PUT (update) request
async function updateUser(id, data) {
  const response = await fetch(\`/api/users/\${id}\`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Cancel a request with AbortController
const controller = new AbortController();
const response = await fetch("/api/data", {
  signal: controller.signal
});
controller.abort(); // Cancel if needed`,
      codeLabel: 'Fetch API',
      keyPoints: [
        'fetch() only rejects on network errors, not HTTP 4xx/5xx.',
        'Always check response.ok before calling response.json().',
        'Set Content-Type: application/json for POST/PUT with JSON body.',
        'Use AbortController to cancel in-progress requests.',
        'NEVER put API keys in client-side JavaScript.'
      ]
    },
    {
      title: 'HTTP Methods & Status Codes',
      content: `HTTP (Hypertext Transfer Protocol) is the communication protocol for the web. Every fetch() call sends an HTTP request — understanding methods and status codes is essential for working with APIs.\n\nHTTP Methods (verbs) describe the action to perform: GET — retrieve data (read-only, no body, cacheable, safe). POST — create a new resource (sends body, not idempotent). PUT — replace an entire resource (idempotent — calling twice has same effect as once). PATCH — partially update a resource (send only changed fields). DELETE — remove a resource. HEAD — same as GET but only returns headers (used for checking existence). OPTIONS — returns what methods are supported (used in CORS preflight).\n\nHTTP Status Codes communicate the outcome: 1xx Informational (100 Continue). 2xx Success — 200 OK (success), 201 Created (POST success), 204 No Content (DELETE success). 3xx Redirection — 301 Moved Permanently, 302 Found (temporary redirect). 4xx Client Errors — 400 Bad Request, 401 Unauthorized (not logged in), 403 Forbidden (logged in but no permission), 404 Not Found, 422 Unprocessable Entity (validation failure), 429 Too Many Requests (rate limited). 5xx Server Errors — 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable.\n\nRESTful APIs follow conventions using HTTP methods + /resource/id patterns to create predictable, consistent endpoints.`,
      image: '/images/javascript/js-http-methods.png',
      code: `// HTTP Methods in practice with fetch()

// GET — retrieve users
const users = await fetch("/api/users");

// POST — create a user
await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", email: "alice@example.com" }),
});

// PUT — replace user (full update)
await fetch("/api/users/123", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", email: "new@example.com", role: "admin" }),
});

// PATCH — partial update
await fetch("/api/users/123", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "new@example.com" }),
});

// DELETE — remove user
await fetch("/api/users/123", { method: "DELETE" });

// Handle status codes
const res = await fetch("/api/users/999");
if (res.status === 404) console.log("User not found");
if (res.status === 401) redirectToLogin();
if (res.status === 429) console.log("Rate limited — retry later");`,
      codeLabel: 'HTTP Methods & Status Codes',
      keyPoints: [
        'GET=read, POST=create, PUT=replace, PATCH=update, DELETE=remove.',
        '2xx = success, 4xx = client error, 5xx = server error.',
        '401 = not authenticated, 403 = authenticated but no permission.',
        'PUT replaces the entire resource; PATCH updates specific fields.',
        'Always check status codes — 404 and 500 do NOT reject the Promise.'
      ]
    },
    {
      title: 'JSON & API Responses',
      content: `JSON (JavaScript Object Notation) is the universal data format for REST APIs. It is a lightweight text format based on JavaScript object syntax, readable by humans and easily parsed by machines.\n\nJSON supports exactly six types: strings (always double-quoted), numbers, booleans (true/false), null, arrays, and objects. It does NOT support: functions, undefined, comments, trailing commas, or single-quoted strings.\n\nJSON.stringify(value, replacer, spaces) converts a JavaScript value to a JSON string. JSON.parse(text, reviver) parses a JSON string back to a JavaScript value. Both can throw errors — always wrap in try/catch.\n\nAPI Response anatomy: A typical REST API returns a response body structured as JSON. Common patterns include the data envelope { "data": [...], "meta": {...}, "status": "success" }, error envelope { "error": "Not found", "code": 404 }, and pagination { "data": [...], "pagination": { "page": 1, "totalPages": 10 } }.\n\nURL anatomy for APIs: A URL consists of Protocol (https://), Host (api.example.com), Port (:443), Path (/users/123), Query String (?page=1&limit=20), and Fragment (#section). In fetch(), build query strings with URLSearchParams for proper encoding.`,
      image: '/images/javascript/js-json-structure.jpeg',
      code: `// JSON.stringify and parse
const user = { name: "Alice", age: 28, active: true };
const jsonStr = JSON.stringify(user);
// '{"name":"Alice","age":28,"active":true}'

const parsed = JSON.parse(jsonStr);
// { name: "Alice", age: 28, active: true }

// Pretty print
JSON.stringify(user, null, 2);

// Safe parsing
function safeParse(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// URL with query parameters using URLSearchParams
const params = new URLSearchParams({
  page: 1,
  limit: 20,
  sort: "created_at",
  order: "desc",
});
const url = \`/api/posts?\${params}\`;
// /api/posts?page=1&limit=20&sort=created_at&order=desc

// Handling paginated API responses
async function getAllPosts() {
  const response = await fetch(\`/api/posts?\${params}\`);
  const { data, pagination } = await response.json();
  console.log(\`Page \${pagination.page} of \${pagination.totalPages}\`);
  return data;
}`,
      codeLabel: 'JSON & API Responses',
      keyPoints: [
        'JSON supports: string, number, boolean, null, array, object.',
        'JSON does NOT support functions, undefined, or comments.',
        'Always wrap JSON.parse() in try/catch — invalid JSON throws.',
        'Use URLSearchParams to build query strings safely.',
        'Understand the API response envelope (data, meta, pagination).'
      ]
    },
    {
      title: 'Web Storage & State',
      content: `Web Storage provides two APIs for storing data in the browser without sending it to the server on every request — a massive improvement over the original cookies.\n\nlocalStorage is persistent: data stays even after the browser closes. It is scoped to the origin (protocol + domain + port). Max storage is typically 5–10 MB depending on the browser. Great for user preferences, theme settings, or cached data.\n\nsessionStorage is session-scoped: data is cleared when the browser tab is closed. Each tab gets its own sessionStorage. Great for one-time form data, temporary authentication state, or wizard step data.\n\nBoth APIs have the same interface: setItem(key, value), getItem(key) → string | null, removeItem(key), clear(), and a length property. Important: both only store strings. Use JSON.stringify when storing objects and JSON.parse when reading them back.\n\nLimitations: Synchronous (blocking for large data), not available in Web Workers, shared across all scripts on the same origin (security risk if running third-party scripts), not suitable for sensitive data (visible in DevTools and accessible by any script on the page).\n\nFor more advanced storage: IndexedDB is asynchronous and can handle large structured datasets; cookies can be sent with server requests and support expiry and HttpOnly flag; Cache API is designed for service workers and offline-first apps.`,
      image: '/images/javascript/js-web-storage.png',
      code: `// localStorage — persists after browser close
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme"); // "dark"
localStorage.removeItem("theme");
localStorage.clear(); // Remove ALL items

// Storing objects (must serialize)
const user = { id: 1, name: "Alice", prefs: { lang: "en" } };
localStorage.setItem("user", JSON.stringify(user));

const stored = localStorage.getItem("user");
const parsed = stored ? JSON.parse(stored) : null;

// sessionStorage — clears when tab closes
sessionStorage.setItem("currentStep", "3");
const step = sessionStorage.getItem("currentStep"); // "3"

// Utility helpers
const storage = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key) => localStorage.removeItem(key),
};

storage.set("cart", [{ id: 1, qty: 2 }]);
const cart = storage.get("cart", []);`,
      codeLabel: 'Web Storage',
      keyPoints: [
        'localStorage persists; sessionStorage clears on tab close.',
        'Both store STRINGS only — use JSON.stringify/parse for objects.',
        'Max ~5–10 MB; synchronous; accessible by all scripts on origin.',
        'Never store sensitive data (passwords, tokens) in Web Storage.',
        'Use IndexedDB for large structured data; Cache API for offline.'
      ]
    },
    {
      title: 'ES6+ Modern Features',
      content: `ES6 (ES2015) was a revolutionary update to JavaScript. Here are the most important modern features you should use daily.\n\nTemplate Literals use backticks for string interpolation, multi-line strings, and embedded expressions: \`Hello \${user.name}!\`. Destructuring extracts values from objects and arrays cleanly: const { name, age } = user; and const [first, ...rest] = array. Works in function parameters too: function render({ title, body }).\n\nSpread (...) expands iterables: [...arr1, ...arr2] merges arrays, { ...obj, key: value } clones/extends objects. Rest (...) collects remaining values into an array. Default parameters: function greet(name = "World") set fallback values.\n\nOptional Chaining (?.) safely navigates nested properties: user?.address?.city returns undefined instead of crashing. Nullish Coalescing (??) provides a default only for null/undefined: value ?? "default" (unlike ||, which also replaces 0 and "").\n\nModules: import/export organize code into reusable files. Named exports allow multiple per file; default export is one per file. Dynamic imports import() enable code splitting — load modules lazily at runtime.\n\nOther essentials: Map/Set collections with unique keys, for...of loops for iterables, Symbol for unique property keys, generator functions (function*), WeakMap/WeakRef for memory-efficient references.`,
      code: `// Template literals
const msg = \`Hello \${user.name}! You have \${count} messages.\`;

// Destructuring
const { name, age, address: { city = "Unknown" } } = user;
const [first, , third, ...rest] = [10, 20, 30, 40, 50];

// Spread & Rest
const merged = { ...defaults, ...overrides };
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
const copy = [...original, newItem];

// Optional chaining & nullish coalescing
const city = user?.profile?.address?.city ?? "Unknown";
const port = process?.env?.PORT ?? 3000;

// Map & Set
const map = new Map([["key1", "val1"], ["key2", "val2"]]);
map.set("key3", "val3");
map.get("key1"); // "val1"

const set = new Set([1, 2, 2, 3, 3]); // {1, 2, 3}
set.has(2); // true

// Dynamic import (lazy loading)
const { buildChart } = await import("./chart.js");
buildChart(data);`,
      codeLabel: 'ES6+ Modern Features',
      keyPoints: [
        'Template literals replace string concatenation and support multi-line.',
        'Destructuring simplifies pulling values from objects and arrays.',
        'Optional chaining (?.) prevents "Cannot read property of null" errors.',
        'Use ?? instead of || to preserve intentional 0 and "" values.',
        'Dynamic import() enables code splitting for better performance.'
      ]
    },
    {
      title: 'Regular Expressions',
      content: `A Regular Expression (RegEx) is a pattern used to match, search, and manipulate strings. They are powerful but cryptic — once you learn the syntax, they are invaluable for validation, parsing, and text processing.\n\nRegEx literal syntax: /pattern/flags. Common flags: g (global — find all matches), i (case-insensitive), m (multiline — ^ and $ match line start/end). Character classes: [abc] matches a, b, or c. [^abc] matches anything NOT a, b, or c. [a-z] matches any lowercase letter. \\d = digit [0-9], \\w = word character [a-zA-Z0-9_], \\s = whitespace, . = any character (except newline).\n\nQuantifiers: * (0 or more), + (1 or more), ? (0 or 1), {n} (exactly n), {n,m} (between n and m). ^ anchors to start of string, $ anchors to end. () creates a capturing group.\n\nJS RegEx methods: regex.test(str) → boolean (does string match?). str.match(regex) → array of matches. str.replace(regex, replacement) → new string. str.split(regex) → array.\n\nCommon validation patterns: email (/^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/i), phone (/^\\+?[\\d\\s-]{10,}$/), URL (/^https?:\\/\\/.+/), only letters (/^[a-zA-Z]+$/), only numbers (/^\\d+$/).`,
      image: '/images/javascript/js-regex-cheatsheet.png',
      code: `// Test if a string matches a pattern
const emailRegex = /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/i;
emailRegex.test("alice@example.com"); // true
emailRegex.test("not-an-email");      // false

// Extract matches
const str = "Prices: $10, $25, $100";
const matches = str.match(/\\$\\d+/g); // ["$10", "$25", "$100"]

// Replace
const cleaned = "  hello world  ".replace(/^\\s+|\\s+$/g, "");
// "hello world" (trim whitespace)

"2026-03-30".replace(
  /(\\d{4})-(\\d{2})-(\\d{2})/,
  "$2/$3/$1"
); // "03/30/2026" — rearrange date

// Split
"one,two,,three".split(/,+/); // ["one", "two", "three"]

// Named capture groups
const dateRegex = /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/;
const { groups: { year, month, day } } = "2026-03-30".match(dateRegex);
// year="2026", month="03", day="30"

// Common validation
const isPhone = /^\\+?[\\d\\s\\-()]{10,}$/.test(input);
const isURL = /^https?:\\/\\/.+/.test(input);`,
      codeLabel: 'Regular Expressions',
      keyPoints: [
        '/pattern/flags is the regex literal syntax.',
        '\\d = digit, \\w = word char, \\s = whitespace, . = any char.',
        '* = 0+, + = 1+, ? = 0-1, {n,m} = between n and m.',
        'test() returns boolean; match() returns array of matches.',
        'Named groups (?<name>...) make captures readable.'
      ]
    },
    {
      title: 'Error Handling & Debugging',
      content: `Robust error handling separates production-quality code from prototypes. JavaScript errors come in two flavors: synchronous (thrown in regular code) and asynchronous (rejected Promises or failed fetch calls).\n\ntry/catch/finally: The try block runs code that might throw. The catch block receives the Error object (with message, name, stack properties). The finally block ALWAYS runs — use it for cleanup (hide spinners, release resources). Re-throw unexpected errors to not silently swallow them.\n\nCustom Error classes extend the built-in Error: class ValidationError extends Error makes error handling meaningful. Use instanceof in catch to respond differently to different error types.\n\nAsync error handling: Always wrap await calls in try/catch. Handle rejected Promises from Promise.all — if one rejects, all reject. Use Promise.allSettled to handle individual failures. Unhandled Promise rejections cause warnings (and crashes in Node.js) — always attach .catch() or use try/catch.\n\nDebugging tools: console.log is basic. console.table() renders arrays as formatted tables. console.group()/groupEnd() nests related logs. console.time()/timeEnd() measures performance. The debugger statement pauses execution and opens DevTools. Breakpoints in DevTools let you step through code, inspect the call stack, and watch variable values. The Network panel in DevTools shows all fetch requests, responses, and timing.`,
      code: `// Try / Catch / Finally
try {
  const data = JSON.parse(rawInput);
  processData(data);
} catch (error) {
  if (error instanceof SyntaxError) {
    showError("Invalid data format");
  } else {
    throw error; // Re-throw — don't silently swallow unknown errors
  }
} finally {
  hideSpinner(); // Always runs
}

// Custom Error class
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

// Async error handling
async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new ApiError(res.statusText, res.status);
    return await res.json();
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) {
      return null; // Handle 404 gracefully
    }
    throw err; // Surface other errors
  }
}

// Debugging
console.table(users);             // Pretty table
console.time("fetch");
await fetchData("/api/users");
console.timeEnd("fetch");         // "fetch: 120ms"`,
      codeLabel: 'Error Handling & Debugging',
      keyPoints: [
        'try/catch handles sync errors; use try/catch with await for async.',
        'Custom Error classes enable targeted error handling with instanceof.',
        'finally always runs — use it for cleanup, not primary logic.',
        'Re-throw unexpected errors — never swallow them silently.',
        'Use DevTools Network panel to debug fetch requests and responses.'
      ]
    },
    {
      title: 'JavaScript Best Practices',
      content: `Writing clean, maintainable JavaScript takes discipline. These practices are observed in professional codebases worldwide.\n\nUse strict mode by adding "use strict" at the top of files. It prevents silent errors (assigning undeclared variables) and disables confusing legacy features. ES modules use strict mode automatically.\n\nPrefer immutability. Use const by default. When working with arrays and objects, use methods that return new values (map, filter, spread) rather than mutating in place. Immutable data is easier to reason about, debug, and test.\n\nWrite small, pure functions. Each function should do ONE thing, have a descriptive name, take explicit inputs, and return predictable outputs with no side effects. Pure functions are trivially testable. Prefer getActiveUsers() over process().\n\nHandle edge cases defensively. What happens with null, undefined, empty arrays, or zero? Use optional chaining (?.), nullish coalescing (??), and input validation at system boundaries.\n\nOrganize with modules. One file per concern: api.js for HTTP, utils.js for helpers, constants.js for fixed values. Avoid global variables — they create hidden coupling.\n\nWrite asynchronous code correctly. Always await or return Promises. Avoid mixing .then() chains and async/await in the same flow. Handle all rejections — unhandled rejections crash Node apps and produce console warnings in browsers.`,
      keyPoints: [
        'Use "use strict" or ES modules — catches silent errors.',
        'const by default, let when needed, never var.',
        'Small, pure, well-named functions are easy to test and reuse.',
        'Handle null, undefined, and empty inputs defensively.',
        'Organize code into modules — one concern per file.',
        'Every Promise must be awaited or have .catch() — no unhandled rejections.'
      ]
    }
  ]
};

#!/usr/bin/env python3
"""Generate the updated javascript.js file."""
import os

sections = []

# Section 1: What is JavaScript
sections.append("""{
      title: 'What is JavaScript',
      content: `JavaScript is a high-level, interpreted programming language that makes web pages dynamic and interactive. It is the only programming language that runs natively in web browsers, making it the de facto language of the web. Originally created by Brendan Eich in just 10 days in 1995, JavaScript has evolved from a simple scripting language into a full-featured platform.\\n\\nJavaScript works in the browser through the JavaScript Engine (V8 in Chrome, SpiderMonkey in Firefox), which parses and executes code. It interacts with the DOM (Document Object Model) to manipulate the webpage structure, and uses an Event-Driven model to respond to user actions like clicks, keypresses, and scrolls.\\n\\nKey characteristics of JavaScript include: Single-Threaded \\u2014 it uses one call stack and handles concurrency through the Event Loop; Dynamically Typed \\u2014 variables can hold any type without explicit declaration; Event-Driven \\u2014 code runs in response to events, not sequentially; Prototype-Based \\u2014 objects inherit directly from other objects, not classes; and Interpreted/Just-in-Time Compiled \\u2014 code is executed without prior compilation, boosted by JIT optimizations.\\n\\nWith Node.js (2009), JavaScript broke free from the browser and can now run servers, command-line tools, desktop apps (Electron), mobile apps (React Native), and even IoT devices. The ECMAScript specification (maintained by TC39) standardizes JavaScript. Major versions: ES5 (2009) standardized the language, ES6/ES2015 introduced revolutionary features (let/const, arrow functions, classes, promises, modules), and annual releases since then continue adding features.`,
      image: '/images/javascript/js-html-css-relationship.jpeg',
      keyPoints: [
        'Only language that runs natively in browsers',
        'Single-threaded with Event Loop for concurrency',
        'Dynamically typed, event-driven, and prototype-based',
        'Node.js enables server-side JavaScript',
        'ES6 (2015) was a transformative update'
      ]
    }""")

# Section 2: Variables & Data Types
sections.append("""{
      title: 'Variables & Data Types',
      content: `JavaScript has three ways to declare variables. var is the legacy keyword \\u2014 it is function-scoped, gets hoisted to the top of its scope (initialized as undefined), can be redeclared, and has no block scoping which leads to subtle bugs. let is block-scoped (limited to the {} block), cannot be redeclared in the same scope, can be reassigned, and enters a Temporal Dead Zone (TDZ) \\u2014 accessing it before declaration throws a ReferenceError. const is also block-scoped and enters TDZ, but cannot be reassigned after initialization (though objects and arrays it holds CAN be mutated). Best Practice: Use const by default, let when reassignment is needed, and avoid var entirely.\\n\\nJavaScript has 7 primitive types (immutable, stored by value): Number (integers and decimals \\u2014 no separate integer type; includes special values Infinity, -Infinity, NaN), String (text in single, double, or backtick quotes), Boolean (true or false), Undefined (variable declared but not assigned), Null (intentionally empty \\u2014 typeof null returns "object" which is a famous JS bug), BigInt (for very large integers beyond Number.MAX_SAFE_INTEGER), and Symbol (unique identifiers, often used as object keys).\\n\\nNon-primitive (reference) types are mutable and stored by reference: Object ({key: value} \\u2014 the foundation of JavaScript), Array (ordered list, technically an object), Function (first-class citizens), Date, RegExp, Map (key-value pairs with any type as key), and Set (collection of unique values). Understanding the difference between primitives (compared by value) and reference types (compared by reference) is crucial \\u2014 two objects with identical content are NOT equal unless they reference the same memory location.`,
      image: '/images/javascript/js-data-types.jpg',
      code: `// var vs let vs const\\nvar x = 1;     // Function-scoped, hoisted, redeclarable\\nlet y = 2;     // Block-scoped, TDZ, reassignable\\nconst z = 3;   // Block-scoped, TDZ, NOT reassignable\\n\\n// Hoisting behavior\\nconsole.log(a); // undefined (var is hoisted)\\nvar a = 10;\\n// console.log(b); // ReferenceError (TDZ)\\nlet b = 20;\\n\\n// Primitive types\\nconst name = "Alice";           // String\\nconst age = 28;                 // Number\\nconst isActive = true;          // Boolean\\nconst nothing = null;           // Null\\nlet notYet;                     // undefined\\nconst bigNum = 9007199254740993n; // BigInt\\nconst id = Symbol("userId");    // Symbol\\n\\n// Reference types\\nconst user = { name: "Bob", age: 30 };  // Object\\nconst colors = ["red", "blue"];          // Array\\nconst greet = (n) => \\`Hello \\${n}\\`;      // Function\\n\\n// Value vs Reference\\nlet a1 = [1, 2];\\nlet b1 = a1;       // Same reference\\nb1.push(3);\\nconsole.log(a1);   // [1, 2, 3] \\u2014 both changed!`,
      codeLabel: 'Variables & Types',
      keyPoints: [
        'Use const by default, let when reassignment needed, never var',
        'var is function-scoped and hoisted; let/const are block-scoped with TDZ',
        '7 primitive types (by value) + reference types (by reference)',
        'typeof null === "object" is a known JavaScript bug',
        'Two objects with same content are NOT equal (different references)'
      ]
    }""")

# Section 3: Operators & Type Conversion
sections.append("""{
      title: 'Operators & Type Conversion',
      content: `JavaScript provides several categories of operators. Arithmetic operators include + (addition/string concatenation), - (subtraction), * (multiplication), / (division), % (modulus/remainder), and ** (exponentiation). Assignment operators provide shorthand: +=, -=, *=, /=, %=, and **=.\\n\\nComparison operators come in two flavors: loose equality (==) performs type coercion before comparing ("5" == 5 is true), while strict equality (===) checks both value AND type without coercion ("5" === 5 is false). Always use === and !== to avoid unexpected type coercion bugs. Relational operators (<, >, <=, >=) compare values.\\n\\nLogical operators include && (AND \\u2014 returns first falsy value or last value), || (OR \\u2014 returns first truthy value or last value), and ! (NOT \\u2014 inverts truthiness). The ternary operator provides inline conditionals: condition ? valueIfTrue : valueIfFalse.\\n\\nType Conversion can be implicit (coercion) or explicit. Implicit coercion causes infamous quirks: "5" + 3 = "53" (+ concatenates with strings) but "5" - 3 = 2 (- converts to numbers). Explicit conversion uses String(), Number(), Boolean(), parseInt(), and parseFloat(). Falsy values that convert to false: 0, "" (empty string), null, undefined, NaN, and false. Everything else is truthy, including empty objects {} and arrays [].`,
      image: '/images/javascript/js-type-conversion.webp',
      code: `// Comparison operators\\nconsole.log("5" == 5);    // true (loose \\u2014 coerces type)\\nconsole.log("5" === 5);   // false (strict \\u2014 different types)\\nconsole.log(null == undefined);  // true\\nconsole.log(null === undefined); // false\\n\\n// Logical operators (short-circuit)\\nconst user = null;\\nconst name = user && user.name;   // null (short-circuits)\\nconst fallback = name || "Guest"; // "Guest"\\n\\n// Ternary operator\\nconst status = age >= 18 ? "Adult" : "Minor";\\n\\n// Implicit coercion quirks\\nconsole.log("5" + 3);     // "53" (string concatenation)\\nconsole.log("5" - 3);     // 2 (numeric subtraction)\\nconsole.log(true + true);  // 2\\nconsole.log("" == false);  // true\\n\\n// Explicit conversion\\nString(123);          // "123"\\nNumber("42");         // 42\\nNumber("");           // 0\\nNumber("hello");      // NaN\\nBoolean(0);           // false\\nBoolean("hello");     // true\\nparseInt("42px");     // 42\\nparseFloat("3.14em"); // 3.14`,
      codeLabel: 'Operators & Conversion',
      keyPoints: [
        'Always use === (strict equality) instead of == (loose equality)',
        'Logical operators short-circuit: && returns first falsy, || returns first truthy',
        '"5" + 3 = "53" but "5" - 3 = 2 \\u2014 know your coercion rules',
        'Falsy values: 0, "", null, undefined, NaN, false',
        'Use explicit conversion (Number(), String(), Boolean()) for clarity'
      ]
    }""")

# Section 4: Control Flow & Loops
sections.append("""{
      title: 'Control Flow & Loops',
      content: `Conditional statements control which code blocks execute. The if/else if/else chain checks conditions sequentially \\u2014 the first true condition's block runs, and the rest are skipped. The switch statement compares a value against multiple cases using strict equality (===) and is cleaner than long if/else chains for matching specific values. Always include a default case and remember to use break to prevent fall-through.\\n\\nJavaScript provides several loop constructs. The while loop checks the condition before each iteration \\u2014 if the condition is false initially, the body never runs. The do...while loop checks the condition after each iteration, guaranteeing at least one execution. The classic for loop (initialization; condition; increment) is the most flexible for counted iterations.\\n\\nModern iteration methods include: for...in iterates over an object's enumerable property keys (not recommended for arrays as it iterates over indices as strings); for...of (ES6) iterates over iterable values (arrays, strings, Maps, Sets) and is the preferred way to loop over collections; forEach() is an array method that executes a callback for each element \\u2014 clean and functional, but you cannot use break or return to exit early (use for...of or a regular for loop if you need early exit).\\n\\nLoop control: break exits the loop entirely, and continue skips the current iteration and moves to the next one.`,
      code: `// if / else if / else\\nif (score >= 90) {\\n  grade = "A";\\n} else if (score >= 80) {\\n  grade = "B";\\n} else {\\n  grade = "C";\\n}\\n\\n// switch statement\\nswitch (day) {\\n  case "Monday":\\n  case "Tuesday":\\n    console.log("Weekday");\\n    break;\\n  case "Saturday":\\n  case "Sunday":\\n    console.log("Weekend");\\n    break;\\n  default:\\n    console.log("Unknown day");\\n}\\n\\n// for loop\\nfor (let i = 0; i < 5; i++) {\\n  console.log(i); // 0, 1, 2, 3, 4\\n}\\n\\n// for...of (iterate values)\\nconst fruits = ["apple", "banana", "cherry"];\\nfor (const fruit of fruits) {\\n  console.log(fruit);\\n}\\n\\n// for...in (iterate object keys)\\nconst user = { name: "Alice", age: 28 };\\nfor (const key in user) {\\n  console.log(\\`\\${key}: \\${user[key]}\\`);\\n}\\n\\n// forEach (array method \\u2014 cannot break)\\nfruits.forEach((fruit, index) => {\\n  console.log(\\`\\${index}: \\${fruit}\\`);\\n});`,
      codeLabel: 'Control Flow Patterns',
      keyPoints: [
        'Use switch for matching specific values with strict equality',
        'for...of iterates values (arrays, strings, Maps, Sets)',
        'for...in iterates object keys (avoid for arrays)',
        'forEach cannot break or return early \\u2014 use for...of instead',
        'break exits a loop; continue skips to the next iteration'
      ]
    }""")

# Section 5: Functions & Scope
sections.append("""{
      title: 'Functions & Scope',
      content: `Functions are the fundamental building blocks of JavaScript and are "first-class citizens" \\u2014 they can be assigned to variables, passed as arguments, and returned from other functions.\\n\\nThere are three main ways to define functions. Function Declarations are hoisted (available before their declaration line) and have their own "this" binding. Function Expressions assign a function to a variable \\u2014 they are NOT hoisted. Arrow Functions (=>) are concise, do not have their own "this" binding (they inherit "this" from the surrounding scope), cannot be used as constructors, and don't have an arguments object.\\n\\nScope determines where variables are accessible. Global scope: accessible everywhere (avoid polluting it). Function scope: variables declared with var inside a function stay inside that function. Block scope (let/const): variables inside {} stay inside that block. JavaScript uses lexical scoping \\u2014 a variable's scope is determined by where it is written in the code, not where it is called.\\n\\nClosures occur when an inner function "remembers" and accesses variables from its outer function's scope even after the outer function has returned. This is one of JavaScript's most powerful features \\u2014 it enables data privacy, factory functions, and maintaining state without global variables.\\n\\nDefault parameters set fallback values: function greet(name = "World"). Rest parameters (...args) collect remaining arguments into an array. Higher-order functions are functions that take other functions as arguments or return functions \\u2014 map(), filter(), and reduce() are the most common examples.`,
      image: '/images/javascript/js-variable-scope-hoisting.jpg',
      code: `// Function Declaration (hoisted)\\nfunction add(a, b) {\\n  return a + b;\\n}\\n\\n// Function Expression (NOT hoisted)\\nconst subtract = function(a, b) {\\n  return a - b;\\n};\\n\\n// Arrow Function (no own "this")\\nconst multiply = (a, b) => a * b;\\n\\n// Default & Rest parameters\\nconst greet = (name = "World") => \\`Hello, \\${name}!\\`;\\nconst sum = (...nums) => nums.reduce((a, b) => a + b, 0);\\n\\n// Closure \\u2014 inner function remembers outer scope\\nfunction createCounter() {\\n  let count = 0; // Private via closure\\n  return {\\n    increment: () => ++count,\\n    decrement: () => --count,\\n    getCount: () => count,\\n  };\\n}\\nconst counter = createCounter();\\ncounter.increment(); // 1\\ncounter.increment(); // 2\\ncounter.getCount();  // 2\\n\\n// Higher-order function\\nconst numbers = [1, 2, 3, 4, 5];\\nconst doubled = numbers.map(n => n * 2);      // [2,4,6,8,10]\\nconst evens = numbers.filter(n => n % 2 === 0); // [2, 4]`,
      codeLabel: 'Function Patterns',
      keyPoints: [
        'Function declarations are hoisted; expressions and arrows are not',
        'Arrow functions inherit "this" from the surrounding scope',
        'Closures let inner functions remember outer scope variables',
        'Use closures for data privacy and encapsulation',
        'Higher-order functions (map, filter, reduce) are essential patterns'
      ]
    }""")

# Section 6: Data Structures
sections.append("""{
      title: 'Data Structures',
      content: `JavaScript provides several built-in data structures for organizing and manipulating data.\\n\\nArrays are ordered, indexed collections. Key mutating methods: push()/pop() add/remove from end, unshift()/shift() add/remove from start, splice() inserts/removes at any position, sort() sorts in place (WARNING: sorts as strings by default \\u2014 use a comparator for numbers). Key non-mutating methods: map() transforms each element, filter() keeps elements passing a test, reduce() accumulates a single value, find() returns first match, findIndex() returns its index, some() checks if any pass, every() checks if all pass, slice() extracts a portion, concat() merges arrays.\\n\\nObjects are collections of key-value pairs and the foundation of JavaScript. Keys are strings (or Symbols), values can be anything. Access properties with dot notation (obj.key) or bracket notation (obj["key"]). Useful methods: Object.keys() returns an array of keys, Object.values() returns values, Object.entries() returns [key, value] pairs, and Object.assign() or the spread operator clones/merges objects.\\n\\nMaps are key-value collections where keys can be any type (not just strings like objects). Use map.set(key, value) to add, map.get(key) to retrieve, map.delete(key) to remove, and map.has(key) to check existence. Maps maintain insertion order and have a .size property.\\n\\nSets are collections of unique values \\u2014 duplicates are automatically ignored. Use set.add(value), set.delete(value), set.has(value). Sets are perfect for removing duplicates: [...new Set(array)]. Both Maps and Sets are iterable with for...of.`,
      image: '/images/javascript/js-array-methods.jpg',
      code: `// Arrays\\nconst nums = [1, 2, 3, 4, 5];\\nconst doubled = nums.map(n => n * 2);       // [2,4,6,8,10]\\nconst evens = nums.filter(n => n % 2 === 0); // [2, 4]\\nconst total = nums.reduce((sum, n) => sum + n, 0); // 15\\nconst found = nums.find(n => n > 3);         // 4\\n\\n// Sort (always use comparator for numbers!)\\nconst sorted = [...nums].sort((a, b) => a - b);\\n\\n// Objects\\nconst user = { name: "Alice", age: 28, role: "dev" };\\nObject.keys(user);    // ["name", "age", "role"]\\nObject.values(user);  // ["Alice", 28, "dev"]\\nObject.entries(user); // [["name","Alice"],["age",28],...]\\n\\n// Maps (any type as key)\\nconst map = new Map();\\nmap.set("name", "Alice");\\nmap.set(1, "one");\\nmap.set(true, "yes");\\nmap.get("name"); // "Alice"\\nmap.size;        // 3\\n\\n// Sets (unique values only)\\nconst set = new Set([1, 2, 2, 3, 3]);\\nset.add(4);\\nset.has(2);      // true\\nset.size;        // 4\\n\\n// Remove duplicates with Set\\nconst unique = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]`,
      codeLabel: 'Data Structures',
      keyPoints: [
        'map/filter/reduce are the three most important array methods',
        'sort() converts to strings by default \\u2014 always use a comparator',
        'Object.keys(), .values(), .entries() for iterating objects',
        'Maps allow any type as key and maintain insertion order',
        'Sets store unique values \\u2014 perfect for deduplication'
      ]
    }""")

# Section 7: Strings, Numbers & Math
sections.append("""{
      title: 'Strings, Numbers & Math',
      content: `JavaScript provides rich built-in methods for working with strings, numbers, and mathematical operations.\\n\\nString methods include: length property returns character count, toUpperCase()/toLowerCase() for case conversion, substring(start, end) or slice(start, end) to extract portions (slice supports negative indices), split(separator) converts a string to an array, replace(search, replacement) replaces first occurrence (use replaceAll() or regex with /g flag for all), includes(search) checks if a substring exists, indexOf(search) returns position (-1 if not found), trim() removes whitespace from both ends, and padStart()/padEnd() for padding. Template literals (backtick strings) support interpolation with \\${expression} and multi-line strings.\\n\\nNumber methods include: toFixed(decimals) formats decimal places and returns a string, parseInt(string) and parseFloat(string) parse strings to numbers, isNaN(value) checks for Not-a-Number, Number.isInteger() checks for integers, and Number.MAX_SAFE_INTEGER (2^53 - 1) is the largest safe integer.\\n\\nThe Math object provides mathematical constants and functions: Math.PI (3.14159...), Math.round() for standard rounding, Math.floor() rounds down, Math.ceil() rounds up, Math.random() generates a random number between 0 (inclusive) and 1 (exclusive), Math.sqrt() for square root, Math.abs() for absolute value, Math.max()/Math.min() for finding extremes, and Math.pow(base, exponent) or the ** operator for exponentiation.`,
      code: `// String methods\\nconst str = "  Hello, JavaScript!  ";\\nstr.trim();                    // "Hello, JavaScript!"\\nstr.trim().toUpperCase();      // "HELLO, JAVASCRIPT!"\\nstr.trim().split(", ");        // ["Hello", "JavaScript!"]\\nstr.includes("Java");          // true\\nstr.trim().substring(0, 5);    // "Hello"\\nstr.trim().replace("Hello", "Hi"); // "Hi, JavaScript!"\\n\\n// Template literals\\nconst name = "Alice";\\nconst greeting = \\`Welcome, \\${name}!\\nYou have \\${3 + 2} messages.\\`;\\n\\n// Number methods\\nconst price = 19.567;\\nprice.toFixed(2);              // "19.57"\\nparseInt("42px");              // 42\\nparseFloat("3.14em");          // 3.14\\nNumber.isInteger(42);          // true\\nisNaN("hello" * 2);            // true\\n\\n// Math object\\nMath.round(4.5);               // 5\\nMath.floor(4.9);               // 4\\nMath.ceil(4.1);                // 5\\nMath.abs(-7);                  // 7\\nMath.max(10, 20, 5);           // 20\\nMath.sqrt(16);                 // 4\\n\\n// Random number between min and max (inclusive)\\nconst random = (min, max) =>\\n  Math.floor(Math.random() * (max - min + 1)) + min;\\nrandom(1, 100); // e.g., 47`,
      codeLabel: 'Strings, Numbers & Math',
      keyPoints: [
        'Template literals support interpolation and multi-line strings',
        'split() converts string to array; join() converts array to string',
        'toFixed() returns a string \\u2014 parse it if you need a number',
        'Math.random() returns 0 to 1 \\u2014 multiply and floor for ranges',
        'Use Number.isInteger() and Number.isNaN() for safe type checks'
      ]
    }""")

# Section 8: Regular Expressions
sections.append("""{
      title: 'Regular Expressions',
      content: `Regular expressions (regex) define search patterns for matching, extracting, and replacing text. They are created using literal notation /pattern/flags or the RegExp constructor new RegExp("pattern", "flags").\\n\\nCommon flags include: g (global \\u2014 find all matches, not just the first), i (case-insensitive matching), and m (multiline \\u2014 ^ and $ match line boundaries). Key methods: test(string) returns true/false, string.match(regex) returns matches as an array, and string.replace(regex, replacement) replaces matched text.\\n\\nMetacharacters are special characters with meaning: . (any character except newline), ^ (start of string), $ (end of string), * (0 or more), + (1 or more), ? (0 or 1), | (alternation/OR), () (grouping and capturing), [] (character class \\u2014 match any character inside), {} (quantifier \\u2014 exact count), and \\\\ (escape special characters).\\n\\nCharacter classes provide shortcuts: \\\\d matches any digit (0-9), \\\\D matches non-digits, \\\\w matches word characters (letters, digits, underscore), \\\\W matches non-word characters, \\\\s matches whitespace (spaces, tabs, newlines), \\\\S matches non-whitespace. Ranges inside brackets: [a-z] matches lowercase letters, [A-Z] uppercase, [0-9] digits, [a-zA-Z0-9] alphanumeric.\\n\\nQuantifiers can be greedy (match as much as possible \\u2014 default) or lazy (match as little as possible \\u2014 add ?). Assertions include anchors (^ start, $ end), word boundaries (\\\\b), and lookaheads (?= positive, ?! negative) and lookbehinds (?<= positive, ?<! negative) for matching without consuming characters.`,
      image: '/images/javascript/js-regex-cheatsheet.png',
      code: `// Creating regex\\nconst pattern1 = /hello/i;              // Literal (case-insensitive)\\nconst pattern2 = new RegExp("hello", "gi"); // Constructor\\n\\n// Testing and matching\\n/\\\\d+/.test("abc123");                    // true\\n"hello world".match(/\\\\w+/g);             // ["hello", "world"]\\n"2024-01-15".match(/(\\\\d{4})-(\\\\d{2})-(\\\\d{2})/);\\n// ["2024-01-15", "2024", "01", "15"]\\n\\n// Replace with regex\\n"Hello World".replace(/world/i, "JS");   // "Hello JS"\\n"a-b-c".replace(/-/g, "_");              // "a_b_c"\\n\\n// Character classes\\n/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$/\\n  .test("user@example.com");             // true (email pattern)\\n\\n// Quantifiers\\n/\\\\d{3}-\\\\d{3}-\\\\d{4}/.test("123-456-7890"); // true (phone)\\n/a+/.exec("aaa");   // ["aaa"] (greedy \\u2014 matches all)\\n/a+?/.exec("aaa");  // ["a"]   (lazy \\u2014 matches minimum)\\n\\n// Lookahead / Lookbehind\\n"100px 200em".match(/\\\\d+(?=px)/g);       // ["100"] (followed by px)\\n\\n// Word boundary\\n/\\\\bcat\\\\b/.test("the cat sat");           // true\\n/\\\\bcat\\\\b/.test("concatenate");           // false`,
      codeLabel: 'Regular Expressions',
      keyPoints: [
        'Use /pattern/flags literal or new RegExp() constructor',
        'g flag for global match, i for case-insensitive, m for multiline',
        '\\\\d = digit, \\\\w = word char, \\\\s = whitespace (uppercase = opposite)',
        'Greedy (default) matches max; lazy (?) matches minimum',
        'Lookaheads/lookbehinds match without consuming characters'
      ]
    }""")

# Section 9: DOM Manipulation
sections.append("""{
      title: 'DOM Manipulation',
      content: `The Document Object Model (DOM) is the browser's representation of an HTML page as a tree of nodes. The document is the root, which contains the html element, branching into head and body, and then into all child elements like div, p, h1, etc. JavaScript can read, modify, add, or remove any node in this tree \\u2014 making the page dynamic.\\n\\nSelecting elements: document.getElementById("id") selects by ID (fastest, returns single element). document.querySelector(".class") selects the first element matching any CSS selector. document.querySelectorAll("p") returns a NodeList of all matches. document.getElementsByTagName("div") and document.getElementsByClassName("card") return live HTMLCollections.\\n\\nChanging content: element.innerHTML sets or gets the HTML content inside an element (WARNING: can introduce XSS vulnerabilities with user input). element.textContent safely changes text content without parsing HTML. Changing styles: element.style.color = "red" sets inline styles directly. element.classList provides add(), remove(), toggle(), and contains() for managing CSS classes \\u2014 much cleaner than directly manipulating className.\\n\\nAttributes: getAttribute("href"), setAttribute("src", "image.jpg"), and removeAttribute("disabled") manipulate element attributes. DOM traversal: parentElement, children, firstElementChild, lastElementChild, nextElementSibling, and previousElementSibling navigate the tree. Creating elements: document.createElement("div") creates a new element, then append it with parent.appendChild(element) or the modern parent.append(element). Remove elements with element.remove().`,
      image: '/images/javascript/js-dom-tree.png',
      code: `// Selecting elements\\nconst title = document.getElementById("page-title");\\nconst cards = document.querySelectorAll(".card");\\nconst firstBtn = document.querySelector("button.primary");\\nconst divs = document.getElementsByTagName("div");\\n\\n// Changing content\\ntitle.textContent = "Updated Title";     // Safe from XSS\\ntitle.innerHTML = "<em>Updated</em>";    // Parses HTML\\n\\n// Managing classes and styles\\ntitle.classList.add("highlight");\\ntitle.classList.toggle("active");\\ntitle.style.color = "var(--primary)";\\n\\n// Attributes\\nconst link = document.querySelector("a");\\nlink.getAttribute("href");               // Get\\nlink.setAttribute("target", "_blank");   // Set\\nlink.removeAttribute("disabled");        // Remove\\n\\n// DOM traversal\\nconst parent = title.parentElement;\\nconst children = parent.children;\\nconst next = title.nextElementSibling;\\n\\n// Creating and removing elements\\nconst newCard = document.createElement("div");\\nnewCard.className = "card";\\nnewCard.textContent = "New Card";\\ndocument.querySelector(".grid").appendChild(newCard);\\nnewCard.remove(); // Remove from DOM`,
      codeLabel: 'DOM Interaction Patterns',
      keyPoints: [
        'The DOM is a tree: Document \\u2192 HTML \\u2192 Head/Body \\u2192 Elements',
        'querySelector/querySelectorAll work with any CSS selector',
        'Use textContent (safe) over innerHTML (XSS risk with user input)',
        'classList.add/remove/toggle is cleaner than direct className manipulation',
        'Use parentElement, children, nextElementSibling for tree traversal'
      ]
    }""")

# Section 10: Events & Event Handling
sections.append("""{
      title: 'Events & Event Handling',
      content: `Events are actions or occurrences that happen in the browser \\u2014 user clicks, key presses, page loads, form submissions, and more. JavaScript responds to events through event listeners.\\n\\nCommon event types include: Mouse events (click, dblclick, mouseenter, mouseleave, mousemove, mousedown, mouseup, contextmenu, wheel), Keyboard events (keydown, keyup, keypress), Form events (submit, change, input, focus, blur), Window events (load, resize, scroll, beforeunload), Media events (play, pause, ended), Drag events (dragstart, drag, dragend, drop), Touch events (touchstart, touchmove, touchend), and Clipboard events (copy, cut, paste).\\n\\nThe modern way to handle events is element.addEventListener("event", handler, options). The options parameter can include: once (auto-removes after first trigger), capture (listens during capture phase instead of bubbling), and passive (indicates handler won't call preventDefault, improving scroll performance).\\n\\nEvent propagation has two phases: Capturing phase (event travels from the document root down to the target element) and Bubbling phase (event travels from the target back up to the root \\u2014 this is the default). Use event.stopPropagation() to prevent further propagation. Event delegation is a powerful pattern: instead of adding listeners to many child elements, add ONE listener to the parent and use event.target to identify which child was clicked \\u2014 this is more memory-efficient and handles dynamically added elements.\\n\\nFor form handling, always use event.preventDefault() on submit events to prevent page reload, then handle the data in JavaScript.`,
      code: `// addEventListener with options\\nconst btn = document.querySelector("#myBtn");\\nbtn.addEventListener("click", (e) => {\\n  console.log("Clicked!", e.target);\\n}, { once: true }); // Auto-removes after first click\\n\\n// Keyboard events\\ndocument.addEventListener("keydown", (e) => {\\n  if (e.key === "Escape") closeModal();\\n  if (e.ctrlKey && e.key === "s") {\\n    e.preventDefault(); // Prevent browser save\\n    saveDocument();\\n  }\\n});\\n\\n// Event delegation (one listener for many children)\\ndocument.querySelector(".card-list")\\n  .addEventListener("click", (e) => {\\n    if (e.target.matches(".delete-btn")) {\\n      e.target.closest(".card").remove();\\n    }\\n    if (e.target.matches(".edit-btn")) {\\n      editCard(e.target.closest(".card").dataset.id);\\n    }\\n  });\\n\\n// Form handling\\nconst form = document.querySelector("#loginForm");\\nform.addEventListener("submit", (e) => {\\n  e.preventDefault(); // Prevent page reload\\n  const formData = new FormData(form);\\n  const email = formData.get("email");\\n  const password = formData.get("password");\\n  login(email, password);\\n});\\n\\n// Stop propagation\\nchild.addEventListener("click", (e) => {\\n  e.stopPropagation(); // Parent won't receive this click\\n});`,
      codeLabel: 'Event Handling',
      keyPoints: [
        'addEventListener is the modern way \\u2014 supports options like once and capture',
        'Events bubble up by default (child \\u2192 parent \\u2192 document)',
        'Event delegation: one parent listener handles all child events efficiently',
        'Use event.preventDefault() to stop default actions (form submit, link navigation)',
        'event.stopPropagation() prevents the event from reaching parent elements'
      ]
    }""")

# Section 11: Web Storage API
sections.append("""{
      title: 'Web Storage API',
      content: `The Web Storage API provides two mechanisms for storing data in the browser as key-value string pairs: localStorage and sessionStorage. Both share the same API methods but differ in persistence.\\n\\nlocalStorage persists data indefinitely \\u2014 it survives browser restarts, page reloads, and new tabs. Data remains until explicitly removed by code or the user clears browser data. sessionStorage stores data only for the duration of the page session \\u2014 it is cleared when the tab or browser window is closed. Opening a new tab creates a new, separate session.\\n\\nBoth storage types share the same methods: setItem(key, value) stores a value, getItem(key) retrieves it (returns null if key doesn't exist), removeItem(key) deletes a specific item, clear() removes all stored data, and key(index) returns the key name at the given index. The length property returns the number of stored items.\\n\\nImportant limitations: Both can only store strings \\u2014 use JSON.stringify() to store objects/arrays and JSON.parse() to retrieve them. The storage limit is approximately 5MB per origin. Storage is synchronous and blocks the main thread, so avoid storing large amounts of data. Data is scoped to the same origin (protocol + domain + port).\\n\\nCommon use cases for localStorage: user preferences (theme, language), shopping cart data, cached API responses, and authentication tokens. sessionStorage is useful for: form data preservation during page navigation, temporary wizard/multi-step form state, and one-time session data.`,
      image: '/images/javascript/js-web-storage.png',
      code: `// localStorage \\u2014 persists indefinitely\\nlocalStorage.setItem("theme", "dark");\\nlocalStorage.getItem("theme");       // "dark"\\nlocalStorage.removeItem("theme");\\nlocalStorage.clear();                // Remove all\\n\\n// Storing objects (must stringify)\\nconst user = { name: "Alice", role: "admin" };\\nlocalStorage.setItem("user", JSON.stringify(user));\\nconst stored = JSON.parse(localStorage.getItem("user"));\\nconsole.log(stored.name); // "Alice"\\n\\n// sessionStorage \\u2014 cleared when tab closes\\nsessionStorage.setItem("formStep", "2");\\nsessionStorage.getItem("formStep");  // "2"\\n\\n// Check if key exists\\nif (localStorage.getItem("token") !== null) {\\n  console.log("User is logged in");\\n}\\n\\n// Iterate over all stored items\\nfor (let i = 0; i < localStorage.length; i++) {\\n  const key = localStorage.key(i);\\n  console.log(key, localStorage.getItem(key));\\n}\\n\\n// Practical example: persist theme preference\\nconst savedTheme = localStorage.getItem("theme") || "light";\\ndocument.body.classList.add(savedTheme);\\n\\nfunction toggleTheme() {\\n  const current = document.body.classList.contains("dark")\\n    ? "dark" : "light";\\n  const next = current === "dark" ? "light" : "dark";\\n  document.body.classList.replace(current, next);\\n  localStorage.setItem("theme", next);\\n}`,
      codeLabel: 'Web Storage',
      keyPoints: [
        'localStorage persists indefinitely; sessionStorage clears when the tab closes',
        'Both store only strings \\u2014 use JSON.stringify/parse for objects',
        'Storage limit is ~5MB per origin',
        'Use getItem() \\u2014 returns null if key does not exist',
        'Data is scoped to the same origin (protocol + domain + port)'
      ]
    }""")

# Section 12: ES6+ Modern Features
sections.append("""{
      title: 'ES6+ Modern Features',
      content: `ES6 (ES2015) was a revolutionary update. Here are the most important modern JavaScript features you should use daily.\\n\\nTemplate Literals use backticks for string interpolation: \\`Hello \\${name}\\`. They support multi-line strings without concatenation and can contain any expression inside \\${}. Tagged templates allow custom processing of template literals.\\n\\nDestructuring extracts values from objects and arrays: const { name, age } = user; or const [first, second] = array. It works in function parameters, assignments, and supports nested structures, default values, and renaming: const { name: userName = "Guest" } = user.\\n\\nSpread (...) expands arrays/objects: [...arr1, ...arr2] merges arrays, { ...obj, newKey: value } clones and extends objects. Rest (...) collects remaining values: function sum(...numbers) collects all arguments into an array. The spread operator creates shallow copies \\u2014 nested objects still share references.\\n\\nOptional Chaining (?.) safely accesses nested properties: user?.address?.city returns undefined instead of crashing if any link is null/undefined. Works with methods too: obj.method?.() and arrays: arr?.[0]. Nullish Coalescing (??) provides a default only for null/undefined: value ?? "default" (unlike ||, which also replaces 0 and "").\\n\\nModules (import/export) organize code into reusable files. Named exports allow multiple exports per file. Default exports provide one main export per file. Dynamic imports import() load modules lazily at runtime, returning a Promise. ES modules use strict mode automatically.`,
      image: '/images/javascript/js-objects.jpg',
      code: `// Template literals\\nconst greeting = \\`Welcome, \\${user.name}!\\nYou have \\${count} messages.\\`;\\n\\n// Destructuring\\nconst { name, age, address: { city } } = user;\\nconst [first, , third] = [10, 20, 30]; // Skip second\\nconst { name: userName = "Guest" } = {}; // Default + rename\\n\\n// Spread & Rest\\nconst merged = { ...defaults, ...userConfig };\\nconst copy = [...originalArray];\\nconst sum = (...nums) => nums.reduce((a, b) => a + b, 0);\\n\\n// Optional chaining & nullish coalescing\\nconst city = user?.profile?.address?.city ?? "Unknown";\\nconst port = config.port ?? 3000; // 0 is preserved (not null)\\nuser?.greet?.(); // Call only if method exists\\n\\n// Modules\\n// math.js\\nexport const add = (a, b) => a + b;\\nexport default class Calculator { }\\n\\n// app.js\\nimport Calculator, { add } from "./math.js";\\n\\n// Dynamic import (lazy loading)\\nconst module = await import("./heavyModule.js");\\nmodule.doSomething();`,
      codeLabel: 'Modern JavaScript Features',
      keyPoints: [
        'Template literals replace string concatenation with interpolation',
        'Destructuring simplifies extracting data from objects and arrays',
        'Spread creates shallow copies \\u2014 nested objects still share references',
        'Optional chaining (?.) prevents "Cannot read property" errors',
        'Use ?? instead of || for defaults (it preserves 0 and "")'
      ]
    }""")

# Section 13: Error Handling & Debugging
sections.append("""{
      title: 'Error Handling & Debugging',
      content: `Robust error handling separates production-quality code from prototypes. JavaScript provides try/catch/finally for synchronous errors and .catch() or async try/catch for asynchronous errors.\\n\\nCommon error types include: SyntaxError (code that cannot be parsed \\u2014 like missing brackets), ReferenceError (using an undeclared variable), TypeError (calling a method on null/undefined or using a value as wrong type), RangeError (value outside allowed range \\u2014 like invalid array length), EvalError (related to eval() function), URIError (malformed URI \\u2014 like invalid encodeURI()), and custom errors you define by extending the Error class.\\n\\nThe try block contains code that might throw. The catch block receives the error object with name and message properties. The finally block runs regardless of success or failure \\u2014 ideal for cleanup (closing connections, hiding spinners). You can use throw to create custom errors: throw new Error("Something failed") or throw new CustomError("details").\\n\\nFor async code, use try/catch with async/await, or .catch() with Promises. The global window.onerror handler catches unhandled errors across the application.\\n\\nDebugging techniques: console.log() for quick checks, console.table() for arrays/objects in table format, console.group()/groupEnd() for organized output, console.time()/timeEnd() for performance measurement. The debugger statement pauses execution and opens DevTools. Breakpoints in DevTools let you step through code line by line, inspect variables, and watch expressions.`,
      code: `// Try / Catch / Finally\\ntry {\\n  const data = JSON.parse(rawInput);\\n  processData(data);\\n} catch (error) {\\n  if (error instanceof SyntaxError) {\\n    console.error("Invalid JSON:", error.message);\\n  } else if (error instanceof TypeError) {\\n    console.error("Type error:", error.message);\\n  } else {\\n    throw error; // Re-throw unexpected errors\\n  }\\n} finally {\\n  hideLoadingSpinner(); // Always runs\\n}\\n\\n// Custom Error class\\nclass NotFoundError extends Error {\\n  constructor(resource) {\\n    super(\\`\\${resource} not found\\`);\\n    this.name = "NotFoundError";\\n    this.statusCode = 404;\\n  }\\n}\\n\\n// Throw custom error\\nfunction getUser(id) {\\n  const user = users.find(u => u.id === id);\\n  if (!user) throw new NotFoundError(\\`User \\${id}\\`);\\n  return user;\\n}\\n\\n// Async error handling\\nasync function fetchData(url) {\\n  try {\\n    const res = await fetch(url);\\n    if (!res.ok) throw new NotFoundError(url);\\n    return await res.json();\\n  } catch (err) {\\n    console.error(err.name, err.message);\\n  }\\n}\\n\\n// Debugging tools\\nconsole.table(users);\\nconsole.time("fetch");\\nawait fetchData("/api");\\nconsole.timeEnd("fetch");`,
      codeLabel: 'Error Handling & Debugging',
      keyPoints: [
        'SyntaxError, ReferenceError, TypeError, RangeError are the most common',
        'finally is ideal for cleanup \\u2014 it runs whether try succeeds or fails',
        'Extend the Error class to create categorized custom errors',
        'Use try/catch with async/await for async error handling',
        'console.table() and DevTools breakpoints are your best debugging friends'
      ]
    }""")

# Section 14: Introduction to APIs & JSON
sections.append("""{
      title: 'Introduction to APIs & JSON',
      content: `An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other. Think of it like a restaurant menu \\u2014 you (the client) choose from available options, the kitchen (the server) prepares your order, and the waiter (the API) delivers the result.\\n\\nThe API communication cycle has four steps: the client sends a Request to a specific URL (endpoint), the server authenticates and validates the request, the server processes the request and interacts with databases or other services, and the server sends back a Response with the requested data.\\n\\nCore API terms include: Endpoint (the specific URL path for a resource, e.g., /api/users), Payload (the data sent or received), JSON (the standard data format), Rate Limiting (restrictions on how many requests you can make), and Versioning (APIs use versions like /v1/, /v2/ to introduce changes without breaking existing clients).\\n\\nA URL is composed of several parts: Protocol (http:// or https://), Domain (e.g., api.example.com), Port (default 80 for HTTP, 443 for HTTPS), Path (/api/users), and Query String (?page=1&limit=10 for filtering/pagination).\\n\\nJSON (JavaScript Object Notation) is the standard data interchange format for APIs. It supports strings, numbers, booleans, null, arrays, and objects. JSON.stringify(object) converts a JavaScript object to a JSON string (for sending data), and JSON.parse(string) converts a JSON string back to a JavaScript object (for receiving data). JSON keys must always be double-quoted strings.`,
      image: '/images/javascript/js-json-structure.jpeg',
      code: `// JSON format\\nconst jsonString = '{ "name": "Alice", "age": 28, "active": true }';\\n\\n// JSON.parse \\u2014 string to object\\nconst user = JSON.parse(jsonString);\\nconsole.log(user.name); // "Alice"\\n\\n// JSON.stringify \\u2014 object to string\\nconst data = { id: 1, items: ["a", "b"], nested: { x: 10 } };\\nconst json = JSON.stringify(data, null, 2); // Pretty print\\nconsole.log(json);\\n// {\\n//   "id": 1,\\n//   "items": ["a", "b"],\\n//   "nested": { "x": 10 }\\n// }\\n\\n// Stringify with replacer (filter fields)\\nJSON.stringify(user, ["name", "age"]); // Only name & age\\n\\n// Parse with reviver (transform values)\\nJSON.parse(jsonString, (key, value) => {\\n  if (key === "age") return value + 1; // Transform age\\n  return value;\\n});\\n\\n// URL anatomy\\n// https://api.example.com:443/v1/users?page=1&limit=10\\n// |protocol| |domain|      |port| |path|  |query string|\\n\\n// Building URLs safely\\nconst base = "https://api.example.com/v1";\\nconst url = new URL("/users", base);\\nurl.searchParams.set("page", 1);\\nurl.searchParams.set("limit", 10);\\nconsole.log(url.toString());`,
      codeLabel: 'APIs & JSON',
      keyPoints: [
        'APIs are interfaces for software-to-software communication',
        'JSON is the standard data format: keys must be double-quoted strings',
        'JSON.parse() converts string to object; JSON.stringify() converts object to string',
        'URLs have protocol, domain, port, path, and query string components',
        'Use the URL constructor for building URLs safely in JavaScript'
      ]
    }""")

# Section 15: HTTP Fundamentals
sections.append("""{
      title: 'HTTP Fundamentals',
      content: `HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web. It enables universal communication between clients (browsers) and servers, uses URLs for resource identification, and is stateless \\u2014 each request is independent with no memory of previous requests.\\n\\nHTTP Methods define the type of operation: GET requests data without modifying the server (safe and idempotent \\u2014 multiple identical requests have the same effect). POST sends data to create a new resource (not idempotent \\u2014 each call may create a new resource). PUT replaces an entire resource (idempotent). PATCH partially updates a resource. DELETE removes a resource (idempotent). OPTIONS checks which methods a server supports (used in CORS preflight). HEAD is like GET but returns only headers, no body.\\n\\nHTTP Headers provide metadata about the request or response. Common headers include Content-Type (specifies the data format, e.g., application/json), Authorization (carries authentication credentials like Bearer tokens), Accept (tells the server what format the client expects), and Cache-Control (defines caching behavior).\\n\\nHTTP Status Codes indicate the result of a request: 1xx (Informational \\u2014 100 Continue), 2xx (Success \\u2014 200 OK, 201 Created, 204 No Content), 3xx (Redirection \\u2014 301 Moved Permanently, 304 Not Modified), 4xx (Client Error \\u2014 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests), 5xx (Server Error \\u2014 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable).`,
      image: '/images/javascript/js-http-methods.png',
      code: `// HTTP Methods in practice with Fetch API\\n\\n// GET \\u2014 Retrieve data\\nconst response = await fetch("/api/users");\\nconst users = await response.json();\\n\\n// POST \\u2014 Create new resource\\nawait fetch("/api/users", {\\n  method: "POST",\\n  headers: {\\n    "Content-Type": "application/json",\\n    "Authorization": "Bearer token123"\\n  },\\n  body: JSON.stringify({ name: "Alice", email: "alice@example.com" })\\n});\\n\\n// PUT \\u2014 Replace entire resource\\nawait fetch("/api/users/1", {\\n  method: "PUT",\\n  headers: { "Content-Type": "application/json" },\\n  body: JSON.stringify({ name: "Alice Updated", email: "new@example.com" })\\n});\\n\\n// DELETE \\u2014 Remove resource\\nawait fetch("/api/users/1", { method: "DELETE" });\\n\\n// Check status codes\\nconst res = await fetch("/api/data");\\nif (res.ok) {                    // 200-299\\n  const data = await res.json();\\n} else if (res.status === 404) {\\n  console.error("Not found");\\n} else if (res.status === 401) {\\n  console.error("Unauthorized");\\n} else if (res.status >= 500) {\\n  console.error("Server error");\\n}`,
      codeLabel: 'HTTP Methods & Status Codes',
      keyPoints: [
        'GET = read, POST = create, PUT = replace, PATCH = update, DELETE = remove',
        'GET is safe and idempotent; POST is neither',
        '2xx = success, 3xx = redirect, 4xx = client error, 5xx = server error',
        'Content-Type and Authorization are the most common headers',
        'Always check response.ok or response.status before processing data'
      ]
    }""")

# Section 16: Synchronous vs Asynchronous JavaScript
sections.append("""{
      title: 'Synchronous vs Asynchronous JavaScript',
      content: `JavaScript is single-threaded \\u2014 it has one call stack and can only execute one thing at a time. Understanding how synchronous and asynchronous code works is fundamental to writing effective JavaScript.\\n\\nSynchronous execution means code runs line by line, in order. Each operation must complete before the next one starts. This is simple but problematic for long-running operations \\u2014 a network request taking 3 seconds would freeze the entire UI. Think of it like standing in a bank queue where you must wait for everyone ahead of you.\\n\\nAsynchronous execution allows long-running operations to run in the background without blocking the main thread. When an async operation completes, its callback is queued and executed when the call stack is free. Think of it like a cafe buzzer \\u2014 you place your order, take a buzzer, sit down, and the buzzer alerts you when your order is ready. Meanwhile, you're free to do other things.\\n\\nThe JavaScript runtime uses several components to handle async operations. The Call Stack (LIFO \\u2014 Last In, First Out) executes synchronous code. Web APIs (provided by the browser, not JavaScript itself) handle async operations like setTimeout, fetch, DOM events, and geolocation. The Callback Queue (FIFO \\u2014 First In, First Out, also called the Task Queue) holds callbacks from completed async operations. The Event Loop continuously monitors the call stack \\u2014 when it's empty, it moves the next callback from the queue to the stack for execution.\\n\\nTimers are a common async mechanism. setTimeout(callback, delay) executes a function once after a delay (returns a timer ID for cancellation with clearTimeout). setInterval(callback, interval) executes a function repeatedly at a fixed interval (use clearInterval to stop \\u2014 always clear intervals to avoid memory leaks). Note: timer delays are minimum wait times, not guarantees \\u2014 the callback executes only when the call stack is clear.`,
      image: '/images/javascript/js-sync-vs-async.jpeg',
      code: `// Synchronous \\u2014 blocks until complete\\nconsole.log("1");\\nconsole.log("2");\\nconsole.log("3");\\n// Output: 1, 2, 3 (in order)\\n\\n// Asynchronous \\u2014 non-blocking\\nconsole.log("1");\\nsetTimeout(() => console.log("2"), 0); // Async!\\nconsole.log("3");\\n// Output: 1, 3, 2 (setTimeout after stack clears)\\n\\n// setTimeout \\u2014 execute once after delay\\nconst timerId = setTimeout(() => {\\n  console.log("Executed after 2 seconds");\\n}, 2000);\\nclearTimeout(timerId); // Cancel if needed\\n\\n// setInterval \\u2014 execute repeatedly\\nlet count = 0;\\nconst intervalId = setInterval(() => {\\n  count++;\\n  console.log(\\`Tick \\${count}\\`);\\n  if (count >= 5) {\\n    clearInterval(intervalId); // ALWAYS clean up!\\n  }\\n}, 1000);\\n\\n// Event Loop demonstration\\nconsole.log("Start");           // 1. Call stack\\nsetTimeout(() => {\\n  console.log("Timeout");       // 4. From callback queue\\n}, 0);\\nPromise.resolve().then(() => {\\n  console.log("Promise");       // 3. From microtask queue\\n});\\nconsole.log("End");             // 2. Call stack\\n// Output: Start, End, Promise, Timeout`,
      codeLabel: 'Sync vs Async & Event Loop',
      keyPoints: [
        'JavaScript is single-threaded \\u2014 one call stack, one thing at a time',
        'Sync code blocks; async code runs in background via Web APIs',
        'Event Loop moves callbacks from queue to stack when stack is empty',
        'Microtasks (Promises) execute before macrotasks (setTimeout)',
        'Always clear intervals with clearInterval to prevent memory leaks'
      ]
    }""")

# Section 17: Callbacks & Promises
sections.append("""{
      title: 'Callbacks & Promises',
      content: `Before Promises, asynchronous operations relied on callbacks \\u2014 functions passed as arguments to be executed when an operation completes. The XMLHttpRequest (XHR) object was the original way to make HTTP requests using callbacks.\\n\\nThe problem with callbacks is "callback hell" (also called the Pyramid of Doom) \\u2014 when multiple async operations depend on each other, callbacks get nested deeper and deeper, making code hard to read, maintain, and debug. Error handling with callbacks is also manual and error-prone \\u2014 you must check for errors in every callback.\\n\\nPromises (ES6) solve callback hell by representing a value that will be available in the future. A Promise has three states: Pending (initial state \\u2014 operation in progress), Fulfilled (operation succeeded \\u2014 has a result value), and Rejected (operation failed \\u2014 has an error reason). Once a Promise settles (fulfilled or rejected), it stays in that state permanently.\\n\\nUse .then(onFulfilled) to handle success, .catch(onRejected) to handle errors, and .finally(onSettled) to run code regardless of outcome. Promises can be chained \\u2014 each .then() returns a new Promise, enabling flat, readable async pipelines instead of nested callbacks.\\n\\nPromise utility methods: Promise.all(promises) waits for ALL promises to fulfill (rejects if ANY fails \\u2014 use for parallel independent operations). Promise.race(promises) returns the result of whichever Promise settles first (useful for timeouts). Promise.allSettled(promises) waits for all to settle and returns results regardless of success/failure. Promise.any(promises) returns the first fulfilled promise (ignores rejections until all fail).`,
      image: '/images/javascript/js-promise-states.png',
      code: `// Callback hell (the problem)\\ngetUser(id, (user) => {\\n  getOrders(user.id, (orders) => {\\n    getDetails(orders[0].id, (details) => {\\n      // Deeply nested \\u2014 hard to read!\\n    });\\n  });\\n});\\n\\n// Promises (the solution)\\nconst promise = new Promise((resolve, reject) => {\\n  const success = true;\\n  if (success) resolve("Data loaded!");\\n  else reject(new Error("Failed to load"));\\n});\\n\\n// Consuming promises\\npromise\\n  .then(data => console.log(data))   // "Data loaded!"\\n  .catch(err => console.error(err))   // Handle error\\n  .finally(() => console.log("Done")); // Always runs\\n\\n// Promise chaining (flat and readable)\\nfetch("/api/user")\\n  .then(res => res.json())\\n  .then(user => fetch(\\`/api/orders/\\${user.id}\\`))\\n  .then(res => res.json())\\n  .then(orders => console.log(orders))\\n  .catch(err => console.error(err));\\n\\n// Promise.all \\u2014 parallel execution\\nconst [users, posts] = await Promise.all([\\n  fetch("/api/users").then(r => r.json()),\\n  fetch("/api/posts").then(r => r.json())\\n]);\\n\\n// Promise.race \\u2014 first to settle wins\\nconst result = await Promise.race([\\n  fetch("/api/data"),\\n  new Promise((_, reject) =>\\n    setTimeout(() => reject("Timeout!"), 5000)\\n  )\\n]);`,
      codeLabel: 'Callbacks & Promises',
      keyPoints: [
        'Callback hell = deeply nested callbacks that are hard to read and maintain',
        'Promises have three states: Pending \\u2192 Fulfilled or Rejected',
        'Chain .then() for flat async pipelines instead of nested callbacks',
        'Promise.all() runs parallel tasks; fails if ANY promise rejects',
        'Promise.race() returns whichever settles first (useful for timeouts)'
      ]
    }""")

# Section 18: Fetch API
sections.append("""{
      title: 'Fetch API',
      content: `The Fetch API is the modern, built-in way to make HTTP requests in JavaScript. It replaces the older XMLHttpRequest with a cleaner, Promise-based interface. Key features: Promise-based (no callbacks), available globally (no imports needed), stream-based response handling, clean and intuitive syntax, and built-in CORS and credentials support.\\n\\nA basic GET request is simple: fetch(url) returns a Promise that resolves to a Response object. IMPORTANT: fetch only rejects on network errors \\u2014 HTTP error responses (404, 500) still resolve normally. You must check response.ok (true for status 200-299) to detect HTTP errors.\\n\\nThe Response object provides methods to read the body: response.json() parses JSON (most common), response.text() returns plain text, response.blob() returns binary data (files/images), and response.formData() returns form data. These methods also return Promises.\\n\\nFor POST, PUT, and DELETE requests, pass an options object as the second argument with method, headers, and body properties. The body must be a string (use JSON.stringify for objects), FormData, Blob, or other supported type. Always set Content-Type: application/json when sending JSON.\\n\\nAdvanced options include: headers object for custom headers and Authorization tokens, credentials: "include" for sending cookies with cross-origin requests, signal for AbortController integration (cancel requests), and redirect/cache/mode for fine-grained control.`,
      image: '/images/javascript/js-fetch-api.png',
      code: `// Basic GET request\\nconst response = await fetch("https://api.example.com/users");\\nif (!response.ok) {\\n  throw new Error(\\`HTTP \\${response.status}: \\${response.statusText}\\`);\\n}\\nconst users = await response.json();\\n\\n// POST \\u2014 Create resource\\nconst newUser = await fetch("/api/users", {\\n  method: "POST",\\n  headers: {\\n    "Content-Type": "application/json",\\n    "Authorization": "Bearer myToken123"\\n  },\\n  body: JSON.stringify({\\n    name: "Alice",\\n    email: "alice@example.com"\\n  })\\n});\\n\\n// PUT \\u2014 Update entire resource\\nawait fetch("/api/users/1", {\\n  method: "PUT",\\n  headers: { "Content-Type": "application/json" },\\n  body: JSON.stringify({ name: "Alice Updated" })\\n});\\n\\n// DELETE \\u2014 Remove resource\\nawait fetch("/api/users/1", { method: "DELETE" });\\n\\n// Abort a request (cancel)\\nconst controller = new AbortController();\\nsetTimeout(() => controller.abort(), 5000); // 5s timeout\\ntry {\\n  const res = await fetch("/api/slow", {\\n    signal: controller.signal\\n  });\\n} catch (err) {\\n  if (err.name === "AbortError") {\\n    console.log("Request was cancelled");\\n  }\\n}`,
      codeLabel: 'Fetch API',
      keyPoints: [
        'Fetch is Promise-based \\u2014 use .then() or async/await',
        'fetch() does NOT reject on HTTP errors \\u2014 always check response.ok',
        'Use response.json() for JSON, .text() for plain text, .blob() for files',
        'Set Content-Type: application/json when sending JSON in body',
        'Use AbortController to cancel long-running requests'
      ]
    }""")

# Section 19: Async/Await
sections.append("""{
      title: 'Async/Await',
      content: `Async/Await (ES2017) is syntactic sugar built on top of Promises that makes asynchronous code look and behave like synchronous code. It is the preferred way to write async JavaScript in modern applications.\\n\\nThe async keyword before a function declaration makes it always return a Promise. If the function returns a value, it's automatically wrapped in Promise.resolve(). If it throws, it's wrapped in Promise.reject(). The await keyword can only be used inside async functions (or at the top level of ES modules since ES2022). It pauses the function execution until the Promise resolves, then returns the resolved value. Crucially, await does NOT block the main thread \\u2014 other events and code continue to run while the function is paused.\\n\\nError handling with async/await uses familiar try/catch blocks instead of .catch() chains. Wrap your await calls in try/catch to handle both network errors and HTTP errors gracefully. The catch block receives the error object just like synchronous error handling.\\n\\nFor parallel execution, do NOT await each request sequentially \\u2014 this runs them one after another. Instead, use Promise.all() to run independent async operations simultaneously. Sequential: total time = sum of all operations. Parallel: total time = longest operation.\\n\\nTop-level await (ES2022) allows using await at the top level of ES modules without wrapping in an async function. This is useful for module initialization that depends on async operations. Async/await combined with the Fetch API is the standard pattern for modern web applications.`,
      image: '/images/javascript/js-async-await.png',
      code: `// async function always returns a Promise\\nasync function getUser(id) {\\n  try {\\n    const response = await fetch(\\`/api/users/\\${id}\\`);\\n    if (!response.ok) {\\n      throw new Error(\\`HTTP \\${response.status}\\`);\\n    }\\n    const user = await response.json();\\n    return user; // Wrapped in Promise.resolve()\\n  } catch (error) {\\n    console.error("Failed:", error.message);\\n    return null; // Graceful fallback\\n  }\\n}\\n\\n// Sequential (SLOW \\u2014 one after another)\\nconst u1 = await getUser(1);     // 2s\\nconst p1 = await getPosts(1);    // 2s\\n// Total: ~4 seconds\\n\\n// Parallel (FAST \\u2014 all at once)\\nconst [user, posts, comments] = await Promise.all([\\n  getUser(1),\\n  getPosts(1),\\n  getComments(1)\\n]);\\n// Total: ~2 seconds (longest request)\\n\\n// POST with async/await\\nasync function createUser(userData) {\\n  const response = await fetch("/api/users", {\\n    method: "POST",\\n    headers: { "Content-Type": "application/json" },\\n    body: JSON.stringify(userData)\\n  });\\n  if (!response.ok) throw new Error("Creation failed");\\n  return await response.json();\\n}\\n\\n// Top-level await (ES2022 \\u2014 in ES modules)\\nconst config = await fetch("/config.json").then(r => r.json());\\nconsole.log("App configured:", config.appName);`,
      codeLabel: 'Async/Await Patterns',
      keyPoints: [
        'async functions always return a Promise',
        'await pauses the function but does NOT block the main thread',
        'Use try/catch with async/await for clean error handling',
        'Use Promise.all() for parallel execution \\u2014 avoid sequential await',
        'Top-level await (ES2022) works in ES modules without async wrapper'
      ]
    }""")

# Section 20: JavaScript Best Practices
sections.append("""{
      title: 'JavaScript Best Practices',
      content: `Writing clean, maintainable JavaScript is a skill developed over time. These practices are followed by professional developers worldwide.\\n\\nUse strict mode. Add "use strict" at the top of files or functions. It catches common mistakes (undeclared variables, duplicate parameters) and makes code more predictable. ES modules use strict mode automatically.\\n\\nPrefer immutability. Use const by default. When working with arrays and objects, prefer methods that return new values (map, filter, spread) rather than mutating in place (push, sort). Immutable data is easier to reason about and debug.\\n\\nWrite small, pure functions. A function should do one thing, take inputs, return an output, and have no side effects. This makes functions testable, composable, and reusable. Name them clearly \\u2014 getActiveUsers() is better than process().\\n\\nHandle edge cases. What if the array is empty? What if the API returns null? What if the user types unexpected input? Defensive programming prevents crashes. Use optional chaining, nullish coalescing, and input validation.\\n\\nUse modules to organize code. One file per concern: api.js for HTTP calls, utils.js for helpers, constants.js for magic strings/numbers. Avoid global variables \\u2014 they create coupling and naming conflicts.\\n\\nWrite tests. Even basic tests catch regressions that save hours of debugging. Tools: Jest for unit tests, Playwright/Cypress for end-to-end tests. The confidence from tests makes refactoring safe.`,
      keyPoints: [
        'Use "use strict" or ES modules for safety',
        'const by default, let when needed, never var',
        'Write small, pure, well-named functions',
        'Handle edge cases (null, empty, unexpected input)',
        'Organize code into modules \\u2014 one concern per file',
        'Write tests \\u2014 they save more time than they cost'
      ]
    }""")

# Build the output
header = """export const jsCourse = {
  id: 'javascript',
  title: 'JavaScript',
  description: 'The programming language of the web \\u2014 interactive, dynamic, everywhere.',
  officialDocs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  tutorialLink: 'https://www.w3schools.com/js/',
  exerciseLink: 'https://www.w3schools.com/js/js_exercises.asp',
  sections: [
    """

footer = """
  ]
};
"""

output = header + ",\n    ".join(sections) + footer

with open(os.path.join('src', 'data', 'courses-data', 'javascript.js'), 'w', encoding='utf-8') as f:
    f.write(output)

print(f"Written {len(output)} bytes, {len(sections)} sections")

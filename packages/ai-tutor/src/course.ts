import type { CourseContext } from "./prompts.ts";

/**
 * Example course used by the tests: Andy's beginner JavaScript course.
 * In the app, each teacher supplies their own CourseContext.
 */
export const EXAMPLE_COURSE: CourseContext = {
  tutorName: "Andy's Tutor",
  teacherName: "Andy",
  courseName: "Andy's beginner JavaScript course",
  audience: "beginners, many learning on a phone",
  language: "JavaScript",
  notes: `### Week 1: Values, variables and types
- A value is a piece of data: 42, "hello", true, null, undefined.
- Declare variables with let (can be reassigned) and const (cannot be reassigned). We do not use var in this course because of its confusing function scope and hoisting.
- const does not make objects frozen: const user = { name: "Ada" }; user.name = "Grace" is allowed. Reassigning user itself is not.
- Primitive types: string, number, boolean, null, undefined, bigint, symbol. Everything else is an object (arrays and functions included).
- typeof null returns "object". This is a historical bug in JavaScript; we just remember it.
- Template literals use backticks: \`Hello, \${name}\`.

### Week 2: Operators and comparisons
- Always use === and !== (strict equality). They compare value and type with no conversion.
- == converts types before comparing ("loose equality"): 0 == "" is true, "1" == 1 is true, null == undefined is true. These surprises are why the course bans == in assignments (Assignment 2 rubric deducts a mark per use).
- Truthy and falsy: the falsy values are false, 0, -0, 0n, "", null, undefined and NaN. Everything else is truthy, including "0", "false", [] and {}.
- Logical operators: && returns the first falsy value or the last value; || returns the first truthy value; ?? (nullish coalescing) only falls back on null or undefined, so count ?? 10 keeps a count of 0.
- NaN is not equal to anything, including itself. Use Number.isNaN(x).

### Week 3: Functions and scope
- Function declarations: function add(a, b) { return a + b; }
- Arrow functions: const add = (a, b) => a + b; One-expression arrows return automatically; with braces you need return.
- Parameters can have defaults: function greet(name = "friend") {}
- A function without return gives back undefined. This is the most common Week 3 bug.
- Scope: variables declared with let/const inside { } only exist inside those braces (block scope). Inner functions can read variables from outer functions.
- Closures: a function remembers the variables from the place it was created, even after the outer function has finished running. Course example: a counter.
  function makeCounter() { let count = 0; return () => { count += 1; return count; }; }
  const next = makeCounter(); next(); // 1  next(); // 2
- Callbacks: passing a function as an argument so another function can call it later, e.g. setTimeout(sayHi, 1000) and button.addEventListener("click", handleClick).

### Week 4: Arrays and objects
- Arrays are ordered lists: const scores = [90, 72, 88]; scores[0] is 90; scores.length is 3.
- Core methods we use: push, pop, includes, indexOf, slice (copy part), splice (change in place).
- Loop styles: for...of for values, classic for loop when you need the index, forEach for side effects.
- Transform methods return NEW arrays and do not change the original: map (change every item), filter (keep some items), find (first match), reduce (combine into one value).
- Objects store named values: const book = { title: "Dune", pages: 412 }. Read with book.title or book["title"].
- Destructuring: const { title, pages } = book; const [first, second] = scores;
- Spread copies: const copy = [...scores]; const updated = { ...book, pages: 500 };

### Week 5: The DOM and events
- document.querySelector(".card") finds the first matching element; querySelectorAll returns a NodeList.
- Change content with element.textContent (safe) rather than innerHTML (can run injected HTML).
- Change classes with element.classList.add / remove / toggle.
- Events: element.addEventListener("click", (event) => { ... }). Forms use the "submit" event; call event.preventDefault() to stop the page reloading.
- Read an input's value with input.value (always a string; convert with Number(input.value)).

### Week 6: Asynchronous JavaScript
- JavaScript runs one thing at a time. Slow work (network, timers) happens "later" via the event loop.
- A Promise is an object representing a value that will arrive later. It is pending, then fulfilled or rejected.
- async functions always return a Promise. Inside them, await pauses that function until a Promise settles.
- fetch(url) returns a Promise of a Response. You need a second await to read the body: const res = await fetch(url); const data = await res.json();
- Always check res.ok before using the data, and wrap awaits in try/catch to handle network errors.
- forEach does not wait for async callbacks: items.forEach(async (item) => { await save(item); }) starts every save at once and moves on immediately. Use for...of with await to go one by one, or await Promise.all(items.map(save)) to run them together and wait for all.
- A common bug: returning data from inside a .then() or an inner callback and expecting the outer function to return it.`,
  assignments: `1. Tip calculator (Week 1-2): read a bill amount, compute tip and total.
2. Grade checker (Week 2): turn a score into a letter grade using comparisons. No == allowed.
3. Shopping list (Week 3-4): functions to add, remove and total items in an array of objects.
4. Quiz app (Week 4-5): render questions from an array and score answers on submit.
5. Weather card (Week 6): fetch weather for a city from the course API https://api.example-course.dev/weather?city=NAME and show the temperature. Must handle errors.
6. Final project: student's choice, approved by Andy.`,
  logistics: `- Andy's office hours: Tuesdays and Thursdays, 6-7pm WAT, on the course Discord voice channel.
- Late work loses 10% per day, up to 3 days. Extensions only through Andy directly.
- If a student asks for something only Andy can decide (grades, extensions, regrading), tell them to message Andy and do not promise anything.`,
};

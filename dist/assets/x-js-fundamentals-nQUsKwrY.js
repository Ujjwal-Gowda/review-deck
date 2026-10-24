const e=`<p class="goal">Master the core runtime mechanics of JavaScript: understand primitive vs reference values in V8 memory, master coercion and truthiness rules, trace execution contexts and lexical environments, and demystify hoisting and closures.</p>

<h3>1. Learning Objectives</h3>
<ul>
  <li><b>V8 Memory Allocation:</b> Distinguish between primitive values (stored directly on the stack or in pointer tags) and reference objects (allocated on the heap).</li>
  <li><b>Type Coercion Rules:</b> Predict the exact result of implicit type conversions using the ECMAScript <code>ToPrimitive</code>, <code>ToNumber</code>, and <code>ToString</code> algorithms.</li>
  <li><b>Declaration Semantics:</b> Compare <code>const</code>, <code>let</code>, and legacy <code>var</code> in terms of scope, mutability, and Temporal Dead Zone (TDZ).</li>
  <li><b>Execution Contexts:</b> Trace the creation and execution phases of function calls, variable environments, and the lexical scope chain.</li>
  <li><b>Closures &amp; Memory:</b> Understand how functions capture variables by reference, how closures survive outer function termination, and how to avoid memory leaks.</li>
</ul>

<h3>2. Prerequisites &amp; Mental Model</h3>
<p>Before studying JavaScript internals, recall that an operating system gives every running process a <b>Call Stack</b> and a <b>Heap</b>. In the V8 engine (used by Chrome, Node.js, and Deno):</p>

<ul>
  <li><b>Call Stack:</b> Tracks the currently executing function frame. Local primitives and references (memory addresses) live here while the function is executing.</li>
  <li><b>Memory Heap:</b> An unorganized, dynamically sized pool of memory where objects, arrays, functions, and captured closure scopes reside.</li>
  <li><b>Single-Threaded Execution:</b> The main JavaScript engine executes one instruction at a time on a single call stack. There is no concurrent CPU-thread execution within the same V8 isolate.</li>
</ul>

<div class="callout callout-info">
  <b>Mental Model:</b> A JavaScript variable name is <i>not</i> a container that holds bytes directly. It is a <b>label bound to a value</b>. For primitives, the value is immutable and assigned directly. For objects, the label holds a <b>pointer (reference)</b> to a block on the heap.
</div>

<h3>3. Values &amp; Types: Primitives vs Objects</h3>
<p>JavaScript has <b>seven primitive types</b> and one compound type (<b>Object</b>). Every primitive is completely immutable at runtime:</p>

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Example Literal</th>
      <th>Memory Storage</th>
      <th>Key Behavioral Traps</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>number</code></td>
      <td><code>42</code>, <code>3.1415</code>, <code>NaN</code>, <code>Infinity</code></td>
      <td>64-bit IEEE 754 Float (double precision)</td>
      <td>No integer type. <code>0.1 + 0.2 !== 0.3</code>. Integers safe only up to <code>2^53 - 1</code>.</td>
    </tr>
    <tr>
      <td><code>string</code></td>
      <td><code>"hello"</code>, <code>\`template\`</code></td>
      <td>Immutable UTF-16 code unit sequence</td>
      <td>String methods never mutate the original string; they return a brand new string.</td>
    </tr>
    <tr>
      <td><code>boolean</code></td>
      <td><code>true</code>, <code>false</code></td>
      <td>1-bit boolean flag</td>
      <td>Subject to truthy/falsy evaluation rules in logical operations.</td>
    </tr>
    <tr>
      <td><code>bigint</code></td>
      <td><code>9007199254740993n</code></td>
      <td>Arbitrary-precision integer</td>
      <td>Cannot be mixed with <code>number</code> without explicit conversion (e.g. <code>10n + 5</code> throws).</td>
    </tr>
    <tr>
      <td><code>null</code></td>
      <td><code>null</code></td>
      <td>Intentional absence of object</td>
      <td><code>typeof null === "object"</code> (historical V8/JS type tag bug that cannot be fixed).</td>
    </tr>
    <tr>
      <td><code>undefined</code></td>
      <td><code>undefined</code></td>
      <td>Uninitialized variable or missing property</td>
      <td>Default return value of functions that omit a <code>return</code> statement.</td>
    </tr>
    <tr>
      <td><code>symbol</code></td>
      <td><code>Symbol("token")</code></td>
      <td>Guaranteed unique token</td>
      <td>Used for non-enumerable object keys and well-known engine protocols (e.g. <code>Symbol.iterator</code>).</td>
    </tr>
    <tr>
      <td><code>object</code></td>
      <td><code>{ a: 1 }</code>, <code>[1, 2]</code>, <code>function() {}</code></td>
      <td>Heap allocated memory block</td>
      <td>Passed and assigned by reference. Modifying properties mutates the shared underlying object.</td>
    </tr>
  </tbody>
</table>

<h3>4. Variable Bindings: <code>const</code> vs <code>let</code> vs <code>var</code></h3>
<p>Modern JavaScript deprecates <code>var</code>. Here is the rigorous comparison:</p>

<ul>
  <li><b><code>const</code> (The Default Choice):</b>
    <ul>
      <li><b>Scope:</b> Block-scoped (bounded by the enclosing <code>{ ... }</code> braces).</li>
      <li><b>Reassignment:</b> Forbidden. Must be initialized immediately upon declaration.</li>
      <li><b>Immutability:</b> Freezes the <i>binding</i>, NOT the value. An object declared with <code>const</code> can have its properties freely mutated.</li>
      <li><b>Hoisting:</b> Hoisted to the top of the block, but uninitialized in the <b>Temporal Dead Zone (TDZ)</b>. Accessing it before declaration throws <code>ReferenceError</code>.</li>
    </ul>
  </li>
  <li><b><code>let</code> (For Reassignment Only):</b>
    <ul>
      <li><b>Scope:</b> Block-scoped.</li>
      <li><b>Reassignment:</b> Allowed. Useful for counters, accumulators, and loop variables.</li>
      <li><b>Hoisting:</b> Hoisted in the TDZ; throws <code>ReferenceError</code> if read before declaration.</li>
    </ul>
  </li>
  <li><b><code>var</code> (Legacy Pitfall):</b>
    <ul>
      <li><b>Scope:</b> Function-scoped or global. Ignores <code>if</code> blocks, <code>for</code> loops, and naked curly braces!</li>
      <li><b>Hoisting:</b> Hoisted and initialized immediately to <code>undefined</code>.</li>
      <li><b>Redeclaration:</b> Allows duplicate declarations in the same scope without error.</li>
    </ul>
  </li>
</ul>

<pre data-lang="javascript"><code class="language-javascript">// const freezes the variable reference, not the heap object:
const config = { port: 8080, active: true };
config.port = 9000; // Allowed! Modifies the heap object.
// config = { port: 9000 }; // TypeError: Assignment to constant variable.

// If you need actual shallow runtime immutability:
Object.freeze(config);
// config.port = 3000; // TypeError in strict mode, silent failure in sloppy mode.
</code></pre>

<h3>5. Type Coercion &amp; Equality Mechanics</h3>
<p>JavaScript performs implicit type conversions in three primary situations: string concatenation, numeric arithmetic, and boolean conditionals.</p>

<h4>A. The <code>+</code> Operator vs Other Arithmetic Operators</h4>
<ul>
  <li><b>The <code>+</code> Operator is Overloaded:</b> If <i>either</i> operand evaluates to a string (after <code>ToPrimitive</code> conversion), <code>+</code> performs <b>string concatenation</b>.</li>
  <li><b>All Other Operators (<code>-</code>, <code>*</code>, <code>/</code>, <code>%</code>):</b> Convert both operands into <b>numbers</b> using <code>ToNumber</code>.</li>
</ul>

<pre data-lang="javascript"><code class="language-javascript">console.log("5" + 2);   // "52" (String concatenation because "5" is a string)
console.log("5" - 2);   // 3    (Numeric subtraction: "5" converts to 5)
console.log("5" * "2"); // 10   (Numeric multiplication)
console.log("foo" - 1); // NaN  (Failed numeric conversion yields Not-a-Number)
console.log(NaN === NaN); // false! Use Number.isNaN(x) to test for NaN
</code></pre>

<h4>B. Strict Equality (<code>===</code>) vs Loose Equality (<code>==</code>)</h4>
<ul>
  <li><b>Strict Equality (<code>===</code>):</b> Checks both type and value. If types differ, returns <code>false</code> immediately. No coercion is performed.</li>
  <li><b>Loose Equality (<code>==</code>):</b> Executes complex multi-step coercion rules from the Abstract Equality Comparison Algorithm. <b>Rule: Always use <code>===</code></b>.</li>
</ul>

<pre data-lang="javascript"><code class="language-javascript">console.log(0 == false);   // true  (false coerced to 0)
console.log("" == 0);      // true  ("" coerced to 0)
console.log(null == undefined); // true (special rule in the JS specification)
console.log(null === undefined); // false (different types)
console.log([] == false);  // true  ([] -> "" -> 0, false -> 0)
</code></pre>

<h4>C. Truthiness Rules</h4>
<p>In boolean contexts (e.g. <code>if (x)</code>, <code>x ? y : z</code>, <code>!x</code>), JavaScript coerces all values to <code>true</code> or <code>false</code>.</p>
<ul>
  <li><b>The Exact 8 Falsy Values:</b> <code>false</code>, <code>0</code>, <code>-0</code>, <code>0n</code>, <code>""</code> (empty string), <code>null</code>, <code>undefined</code>, and <code>NaN</code>.</li>
  <li><b>All Other Values are Truthy:</b> Including empty arrays <code>[]</code>, empty objects <code>{}</code>, whitespace strings <code>" "</code>, and the string <code>"false"</code>!</li>
</ul>

<h3>6. Execution Contexts, Hoisting &amp; The Scope Chain</h3>
<p>When the JavaScript engine executes code, it creates an <b>Execution Context</b> containing:</p>
<ol>
  <li><b>Variable Environment:</b> Stores <code>var</code> declarations and function declarations.</li>
  <li><b>Lexical Environment:</b> Stores <code>let</code> and <code>const</code> bindings, and holds an <b>Outer Reference</b> pointing to the parent scope.</li>
  <li><b><code>this</code> Binding:</b> Evaluated depending on how the function was called.</li>
</ol>

<h4>Execution Phases</h4>
<ul>
  <li><b>Phase 1: Creation Phase (Memory Allocation / "Hoisting"):</b>
    <ul>
      <li>Function declarations are allocated in memory and bound to their complete function bodies.</li>
      <li><code>var</code> variables are allocated and assigned the initial value <code>undefined</code>.</li>
      <li><code>let</code> and <code>const</code> variables are registered in the lexical environment but marked <b>uninitialized</b> (TDZ).</li>
    </ul>
  </li>
  <li><b>Phase 2: Execution Phase:</b>
    <ul>
      <li>Code executes line by line. Expressions are evaluated, and variables are assigned their actual values.</li>
    </ul>
  </li>
</ul>

<pre data-lang="javascript"><code class="language-javascript">console.log(greet()); // "Hello!" - Function declaration hoisted with implementation!
console.log(counter); // undefined - var hoisted and initialized to undefined
// console.log(limit); // ReferenceError: Cannot access 'limit' before initialization (TDZ)

function greet() {
  return "Hello!";
}

var counter = 10;
const limit = 50;
</code></pre>

<h3>7. Closures: Lexical Scoping in Practice</h3>
<p>A <b>closure</b> is the combination of a function bundled together with references to its surrounding state (the lexical environment). In JavaScript, every function forms a closure at creation time.</p>

<div class="callout callout-info">
  <b>Crucial Insight:</b> A closure does not save a snapshot copy of a value; it captures a <b>live reference</b> to the variable in the outer lexical environment. If the outer variable changes, the closure observes the updated value.
</div>

<pre data-lang="javascript"><code class="language-javascript">function createCounter(initialValue = 0) {
  let count = initialValue; // Encapsulated in the closure's Lexical Environment

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    getValue() {
      return count;
    }
  };
}

const counterA = createCounter(10);
console.log(counterA.increment()); // 11
console.log(counterA.getValue());  // 11
// count is completely inaccessible from the outside; true private state!
</code></pre>

<h3>8. The Classic Loop-Closure Trap &amp; Fix</h3>
<p>Consider the classic problem of creating callbacks inside a loop:</p>

<pre data-lang="javascript"><code class="language-javascript">// [BUGGY]: Using var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 100);
}
// Outputs: "var: 3", "var: 3", "var: 3"
// Explanation: var i is function-scoped. There is only ONE shared variable i.
// By the time the timeouts fire after 100ms, the loop has finished and i is 3.

// [CORRECT]: Using let
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 100);
}
// Outputs: "let: 0", "let: 1", "let: 2"
// Explanation: let is block-scoped! The engine creates a brand new binding of j
// for each iteration of the loop. Each arrow function captures its own separate j.
</code></pre>

<h3>9. Common Gotchas &amp; Anti-Patterns</h3>
<ul>
  <li><b>Relying on Loose Equality (<code>==</code>):</b> Leads to catastrophic edge cases like <code>"" == 0</code> (true) and <code>null == undefined</code> (true). Always use <code>===</code>.</li>
  <li><b>Mutating Default Parameters:</b> Default parameter expressions evaluate at call time, but mutating an object parameter affects subsequent reads if passed a shared reference.</li>
  <li><b>Accidental Global Variables:</b> Assigning to an undeclared identifier in sloppy mode automatically attaches it to <code>window</code> or <code>globalThis</code>. Always enforce <code>"use strict";</code> or ESM.</li>
  <li><b>Memory Retention via Stale Closures:</b> If an event listener or long-lived singleton retains a closure that references a large array or DOM tree, that memory cannot be garbage-collected by V8.</li>
</ul>

<h3>10. Active Recall &amp; Output Prediction Drills</h3>
<p>Before running the code in Node.js or DevTools, predict the exact output of each block:</p>

<pre data-lang="javascript"><code class="language-javascript">// Drill 1: Short-circuiting vs Nullish Coalescing
const a = 0 || 42;
const b = 0 ?? 42;
const c = "" || "fallback";
const d = "" ?? "fallback";
console.log(a, b, c, d);
// Prediction: ?

// Drill 2: Execution context and variable shadowing
let x = 100;
function testShadow() {
  // console.log(x); // What would happen if this line were uncommented?
  let x = 200;
  return x;
}
console.log(testShadow());
// Prediction: ?
</code></pre>

<details class="ex">
  <summary>Click to view answers and explanations</summary>
  <p><b>Drill 1:</b> <code>42 0 fallback ""</code>. <code>||</code> triggers on any falsy value (so <code>0</code> and <code>""</code> fall back). <code>??</code> triggers <i>only</i> on <code>null</code> or <code>undefined</code> (so <code>0</code> and <code>""</code> are preserved).</p>
  <p><b>Drill 2:</b> Returns <code>200</code>. If the commented line were enabled, it would throw a <code>ReferenceError</code> because the inner <code>let x</code> creates a Temporal Dead Zone in the function block, shadowing the outer <code>x</code> before initialization.</p>
</details>

<h3>11. Practical Verification Exercise</h3>
<p>Implement a clean, zero-dependency memoization utility in JavaScript:</p>
<ul>
  <li>Function signature: <code>function memoize(fn)</code></li>
  <li>Must return a wrapped function that caches results based on arguments.</li>
  <li>Must distinguish between <code>fn(1, "2")</code> and <code>fn("1", 2)</code> using appropriate key serialization.</li>
  <li>Must handle multiple arguments and retain proper <code>this</code> context.</li>
  <li>Verify that calling the memoized function twice with identical arguments invokes the underlying expensive calculation exactly once.</li>
</ul>
`;export{e as default};

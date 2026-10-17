const e=`<p class="goal">Master TypeScript flow controls, compiler-backed exhaustiveness checks, advanced function overloading, lexical 'this' scope capture, and functional closures.</p>

<p>Control flow and functions in JS/TS must balance runtime behavior and compiler guidance. This chapter details how to use TypeScript's type system to enforce total code coverage, write complex polymorphic functions, and handle the notorious JavaScript 'this' binding mechanics.</p>

<h3>1. Exhaustiveness Checks & Type Narrowing</h3>
<p>TypeScript's type system allows you to define strict union types (such as status codes or categorized events). To ensure that your code handles every possible branch of a union, you can use the <code>never</code> type to perform an <b>exhaustiveness check</b>. If you add a new value to the union in the future, the compiler will raise an error warning you that you have not handled it.</p>

<pre data-lang="typescript"><code class="language-typescript">type SupportZone = "central" | "outskirts" | "express-delivery";

function calculateDeliveryFee(totalCents: number, zone: SupportZone): number {
  if (totalCents >= 49_00) return 0; // Free shipping over $49.00
  
  switch (zone) {
    case "central": 
      return 2_00;
    case "outskirts": 
      // Narrowed to 'outskirts'
      return 3_50;
    case "express-delivery":
      return 7_00;
    default: {
      // If any branch is missing, 'zone' will not be of type 'never', causing a Compile Error!
      const exhaustiveCheck: never = zone;
      throw new Error(\`Unhandled zone: \${exhaustiveCheck}\`);
    }
  }
}
</code></pre>

<h3>2. Looping Mechanics: Iterables vs. Object Properties</h3>
<p>JavaScript has multiple loop constructs. Using the wrong one can lead to performance hits or prototype pollution bugs:</p>
<ul>
  <li><b><code>for...of</code>:</b> Iterates over <b>iterable values</b> (arrays, strings, Map, Set). This is the standard, safe choice for sequential loop operations.</li>
  <li><b><code>for...in</code>:</b> Iterates over the <b>keys of an object and its prototype chain</b>. It is generally avoided in favor of <code>Object.keys()</code> or <code>Object.entries()</code> because it can traverse unwanted inherited properties.</li>
</ul>

<pre data-lang="typescript"><code class="language-typescript">const cart = ["milk", "eggs", "bread"];
const stockCount: Record<string, number> = { milk: 12, eggs: 0 };

// 1. Safe array value traversal (for...of)
for (const item of cart) {
  console.log("Cart item:", item);
}

// 2. Traversing index and value via entries()
for (const [index, item] of cart.entries()) {
  console.log(\`Item #\${index}: \${item}\`);
}

// 3. Traversing Object keys and values safely
for (const [sku, quantity] of Object.entries(stockCount)) {
  console.log(\`\${sku} has \${quantity} items remaining\`);
}
</code></pre>

<h3>3. Function Signatures & Overloads</h3>
<p>To declare function arguments that mimic "named parameters", use JavaScript's **object destructuring syntax with default values** within the function parameters:</p>

<pre data-lang="typescript"><code class="language-typescript">// Named parameters via destructuring with defaults
interface OrderConfig {
  sku: string;
  qty?: number;
  express?: boolean;
}

function submitOrder({ sku, qty = 1, express = false }: OrderConfig): void {
  console.log(\`Ordering \${qty} of \${sku}. Express shipping: \${express}\`);
}

submitOrder({ sku: "egg_carton", express: true }); // Reads beautifully at the call site!
</code></pre>

<h4>Function Overloading</h4>
<p>Sometimes a single function needs to support multiple call signatures. TypeScript supports <b>function overloading</b> by declaring multiple "overload signatures" followed by a single "implementation signature" that matches the combined unions.</p>

<pre data-lang="typescript"><code class="language-typescript">// Overload signatures (Compile-time contract)
function parseData(input: string): number;
function parseData(input: string[]): number[];

// Implementation signature (Runtime logic - must support both signatures)
function parseData(input: string | string[]): number | number[] {
  if (Array.isArray(input)) {
    return input.map(Number);
  }
  return Number(input);
}

const singleVal = parseData("105"); // Typed as: number
const multiVal = parseData(["1", "2"]); // Typed as: number[]
</code></pre>

<h3>4. Demystifying the JavaScript <code>this</code> Trap</h3>
<p>In JavaScript, the value of <code>this</code> inside standard functions is determined by **how the function is called** (dynamic binding). In contrast, arrow functions <code>() => {}</code> capture the <code>this</code> value from their **surrounding lexical scope** when they are created (static binding).</p>

<div class="diagram">
  [ The Timer 'this' Execution Picture ]
  class Timer {
    seconds = 0;
    
    // 1. BROKEN (Regular function)
    startBroken() {
      setInterval(function() {
        this.seconds++;  // CRASH or NaN! 'this' inside a bare function callback
      }, 1000);          // defaults to the global window or undefined in strict mode.
    }
    
    // 2. FIXED (Arrow function)
    start() {
      setInterval(() => {
        this.seconds++;  // SUCCESS! 'this' is lexically bound to the Timer instance.
      }, 1000);
    }
  }
</div>

<pre data-lang="typescript"><code class="language-typescript">class SimpleTimer {
  seconds = 0;

  start() {
    // Arrow function captures SimpleTimer's 'this'
    setInterval(() => {
      this.seconds++;
      console.log("Elapsed:", this.seconds);
    }, 1000);
  }
}

const timer = new SimpleTimer();
// timer.start();

// Detached reference trap:
const startMethod = timer.start;
// startMethod(); // CRASH! Calling 'start' without its owning instance 'timer' loses 'this'.
// Fix: Bind it explicitly: \`const startMethod = timer.start.bind(timer)\` or use arrow wraps.
</code></pre>

<h3>5. Closures & Stateful Utilities</h3>
<p>A **closure** is created when an inner function retains references to variables from its outer enclosing scope, even after the outer function has completed execution. Closures are incredibly useful for encapsulated state and decorators.</p>

<pre data-lang="typescript"><code class="language-typescript">// Stateful Closure: Simple Rate Limiter
function createRateLimiter(maxHitsPerSecond: number) {
  let tokens = maxHitsPerSecond;

  // Reset tokens every 1 second
  setInterval(() => {
    tokens = maxHitsPerSecond;
  }, 1000);

  // Return a checker function that maintains state access
  return (): boolean => {
    if (tokens > 0) {
      tokens--;
      return true; // Allowed
    }
    return false; // Throttled
  };
}

const allowRequest = createRateLimiter(3);
console.log(allowRequest()); // true
console.log(allowRequest()); // true
console.log(allowRequest()); // true
console.log(allowRequest()); // false (Throttled! Over the 3-hit limit)
</code></pre>

<h3>6. Higher-Order Functional Compositions</h3>
<p>TypeScript pairs beautifully with functional programming utilities. Below is an industry-standard generic implementation of a debounce function:</p>

<pre data-lang="typescript"><code class="language-typescript">// Debounce: coalesces multiple rapidly fired events into a single execution
function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: A) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, ms);
  };
}
</code></pre>

<div class="exercises">
  <h3>Practice</h3>
  <details class="ex">
    <summary>0.1 <span class="levels">basic</span> Create a generic <code>memoize(fn)</code> utility function in TypeScript. The function should take a single-argument function <code>fn: (arg: A) => R</code> and return a memoized version of it. The memoized function must cash computed results in a <code>Map</code> and return cached results if queried with the same argument. Ensure the types are fully generic and preserve function signature parameters.</summary>
    <div>
      <p><b>Solution Strategy:</b> We use a generic type signature <code>&lt;A, R&gt;</code> to represent the input argument type <code>A</code> and the return type <code>R</code>. We store the cached computations in a <code>Map&lt;A, R&gt;</code>.</p>
<pre data-lang="typescript"><code class="language-typescript">// Type-safe generic memoization utility

function memoize<A, R>(fn: (arg: A) => R): (arg: A) => R {
  const cache = new Map<A, R>();

  return (arg: A): R => {
    if (cache.has(arg)) {
      console.log("[Cache Hit] Returning stored result for:", arg);
      return cache.get(arg)!; // Use ! as we verified cache.has is true
    }

    console.log("[Cache Miss] Computing fresh result for:", arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

// Proving it works:
let computationCount = 0;

const heavySquaring = (num: number): number => {
  computationCount++;
  return num * num;
};

const cachedSquare = memoize(heavySquaring);

console.log(cachedSquare(5));  // [Cache Miss] Computing fresh result for: 5 -> 25
console.log(cachedSquare(5));  // [Cache Hit] Returning stored result for: 5 -> 25
console.log(cachedSquare(10)); // [Cache Miss] Computing fresh result for: 10 -> 100
console.log(\`Total active invocations of core math logic: \${computationCount}\`); // Outputs: 2
</code></pre>
    </div>
  </details>
</div>
`;export{e as default};

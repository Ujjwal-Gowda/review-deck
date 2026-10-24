const e=`<p class="goal">Master the asynchronous runtime architecture of JavaScript: trace the V8 Call Stack, Macrotask and Microtask queues, Promise resolution mechanics, async/await desugaring, cancellation via AbortController, and concurrent state race conditions.</p>

<h3>1. Learning Objectives</h3>
<ul>
  <li><b>V8 Event Loop Architecture:</b> Explain how the Call Stack, Web APIs / Libuv threadpool, Microtask Queue, and Macrotask Queue coordinate execution.</li>
  <li><b>Execution Order Prediction:</b> Trace mixed scripts containing synchronous code, <code>process.nextTick</code>, <code>queueMicrotask</code>, Promises, and timers tick-by-tick.</li>
  <li><b>Promise Mechanics:</b> Implement and chain Promises, understand resolution states, handle errors across asynchronous boundaries, and prevent unhandled rejections.</li>
  <li><b>Async / Await Desugaring:</b> Understand how <code>async</code>/<code>await</code> translates to generator coroutines paused on Promise microtasks.</li>
  <li><b>Promise Combinators:</b> Select the optimal combinator between <code>Promise.all</code>, <code>Promise.allSettled</code>, <code>Promise.race</code>, and <code>Promise.any</code> based on fault-tolerance requirements.</li>
  <li><b>Cancellation &amp; Race Mitigation:</b> Use <code>AbortController</code> to cancel stale async requests and implement locking/versioning patterns to eliminate data race bugs.</li>
</ul>

<h3>2. Prerequisites &amp; Mental Model</h3>
<p>JavaScript engines run on a single execution thread with a single Call Stack. However, modern JavaScript runtimes (Node.js and browsers) achieve non-blocking asynchronous I/O by offloading slow operations (network requests, disk reads, timers) to the underlying platform (Libuv in Node.js, Web APIs in browsers).</p>

<div class="callout callout-info">
  <b>Mental Model:</b> Never say "JavaScript is multi-threaded," and never say "JavaScript waits for the network." The JavaScript engine <i>never blocks its thread waiting for an I/O response</i>. It delegates the I/O task to the runtime, registers a callback in an event queue, and immediately continues executing synchronous code on the call stack.
</div>

<h3>3. The Event Loop Architecture: Tasks vs Microtasks</h3>
<p>The event loop executes a continuous cycle (a "tick") with strict queue priority rules:</p>

<ol>
  <li><b>Execute Call Stack:</b> Run synchronous JavaScript bytecode on the Call Stack until the stack is completely empty.</li>
  <li><b>Drain Microtask Queue:</b> While the microtask queue is not empty, pop the oldest microtask and execute it on the Call Stack. If executing a microtask schedules <i>another</i> microtask, it is executed immediately in the <i>same tick</i>!</li>
  <li><b>Execute ONE Macrotask:</b> Dequeue and run exactly <b>one</b> macrotask from the Macrotask Queue (e.g., a timer callback, I/O event).</li>
  <li><b>Render UI (Browsers only):</b> Perform style calculation, layout, and repaint if required (typically 60Hz/120Hz).</li>
  <li><b>Repeat:</b> Return to Step 2 to drain any new microtasks produced by the macrotask.</li>
</ol>

<table>
  <thead>
    <tr>
      <th>Queue Category</th>
      <th>Operations / APIs</th>
      <th>Queue Priority &amp; Processing Semantics</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Synchronous Call Stack</b></td>
      <td>Normal function calls, loops, variable declarations</td>
      <td>Highest priority. Executes immediately until stack is zero. Blocks all queues while busy.</td>
    </tr>
    <tr>
      <td><b>Microtask Queue</b></td>
      <td><code>Promise.then/catch/finally</code>, <code>queueMicrotask()</code>, <code>MutationObserver</code> (Node: <code>process.nextTick</code>)</td>
      <td><b>Drain to exhaustion.</b> Every pending microtask must execute before the event loop can touch the next macrotask or render a frame.</td>
    </tr>
    <tr>
      <td><b>Macrotask Queue (Task Queue)</b></td>
      <td><code>setTimeout</code>, <code>setInterval</code>, <code>setImmediate</code> (Node), I/O callbacks, UI events</td>
      <td><b>One per tick.</b> The event loop runs exactly one macrotask, then immediately yields to drain the microtask queue.</td>
    </tr>
  </tbody>
</table>

<h3>4. Execution Order Trace: Tick by Tick</h3>
<p>Study this classic interview problem and follow the exact execution trace table:</p>

<pre data-lang="javascript"><code class="language-javascript">console.log("1: Sync Start");

setTimeout(() => {
  console.log("2: Timeout Macrotask");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("3: Promise Microtask 1");
  })
  .then(() => {
    console.log("4: Promise Microtask 2");
  });

queueMicrotask(() => {
  console.log("5: Explicit Microtask");
});

console.log("6: Sync End");
</code></pre>

<h4>Execution Trace Table:</h4>
<table>
  <thead>
    <tr>
      <th>Step</th>
      <th>Call Stack Action</th>
      <th>Microtask Queue State</th>
      <th>Macrotask Queue State</th>
      <th>Output Printed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Run <code>console.log("1: Sync Start")</code></td>
      <td>[]</td>
      <td>[]</td>
      <td><code>1: Sync Start</code></td>
    </tr>
    <tr>
      <td>2</td>
      <td><code>setTimeout(fn, 0)</code> offloaded to host</td>
      <td>[]</td>
      <td>[Timeout fn]</td>
      <td>-</td>
    </tr>
    <tr>
      <td>3</td>
      <td><code>Promise.resolve().then(fn1)</code></td>
      <td>[fn1]</td>
      <td>[Timeout fn]</td>
      <td>-</td>
    </tr>
    <tr>
      <td>4</td>
      <td><code>queueMicrotask(fn5)</code></td>
      <td>[fn1, fn5]</td>
      <td>[Timeout fn]</td>
      <td>-</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Run <code>console.log("6: Sync End")</code></td>
      <td>[fn1, fn5]</td>
      <td>[Timeout fn]</td>
      <td><code>6: Sync End</code></td>
    </tr>
    <tr>
      <td>6</td>
      <td><b>Stack Empty &rarr; Drain Microtasks!</b> Pop fn1</td>
      <td>[fn5] (fn1 schedules fn2 &rarr; [fn5, fn2])</td>
      <td>[Timeout fn]</td>
      <td><code>3: Promise Microtask 1</code></td>
    </tr>
    <tr>
      <td>7</td>
      <td>Pop fn5</td>
      <td>[fn2]</td>
      <td>[Timeout fn]</td>
      <td><code>5: Explicit Microtask</code></td>
    </tr>
    <tr>
      <td>8</td>
      <td>Pop fn2</td>
      <td>[]</td>
      <td>[Timeout fn]</td>
      <td><code>4: Promise Microtask 2</code></td>
    </tr>
    <tr>
      <td>9</td>
      <td><b>Microtasks Empty &rarr; Run 1 Macrotask!</b> Pop Timeout</td>
      <td>[]</td>
      <td>[]</td>
      <td><code>2: Timeout Macrotask</code></td>
    </tr>
  </tbody>
</table>

<div class="callout callout-info">
  <b>Final Output:</b> <code>1: Sync Start</code> &rarr; <code>6: Sync End</code> &rarr; <code>3: Promise Microtask 1</code> &rarr; <code>5: Explicit Microtask</code> &rarr; <code>4: Promise Microtask 2</code> &rarr; <code>2: Timeout Macrotask</code>.
</div>

<h3>5. Promises &amp; Error Propagation</h3>
<p>A <code>Promise</code> is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. It exists in one of three mutually exclusive states:</p>
<ul>
  <li><b><code>pending</code>:</b> Initial state; neither fulfilled nor rejected.</li>
  <li><b><code>fulfilled</code>:</b> Operation completed successfully with a value.</li>
  <li><b><code>rejected</code>:</b> Operation failed with an error reason.</li>
</ul>

<pre data-lang="javascript"><code class="language-javascript">// Constructing a Promise
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    if (!userId) {
      // Synchronous rejection inside executor
      reject(new Error("userId is required"));
      return;
    }
    // Asynchronous resolution
    setTimeout(() => {
      resolve({ id: userId, username: "dev_uj" });
    }, 100);
  });
}

// Chaining and Error Bubbling
fetchUserData(42)
  .then(user => {
    console.log("Fetched user:", user);
    return user.username.toUpperCase(); // Value returned is wrapped in fulfilled Promise
  })
  .then(upperName => {
    console.log("Upper:", upperName);
  })
  .catch(err => {
    // Catches ANY error or rejection occurring anywhere in the upstream chain
    console.error("Pipeline failure:", err.message);
  })
  .finally(() => {
    // Always runs regardless of success or failure (cleanup hooks)
    console.log("Operation finished.");
  });
</code></pre>

<h3>6. <code>async</code> / <code>await</code>: Syntactic Sugar Over Coroutines</h3>
<p>The <code>async</code> and <code>await</code> keywords provide a clean, sequential syntax for writing promise-based asynchronous code:</p>
<ul>
  <li>An <code>async</code> function <b>always returns a Promise</b>. If the function returns a non-promise value, the engine wraps it in <code>Promise.resolve(val)</code>. If it throws, it wraps it in <code>Promise.reject(err)</code>.</li>
  <li>The <code>await</code> expression pauses execution of the <i>current async function</i> and yields control back to the event loop. The remaining lines of the function are scheduled as a <b>microtask</b> when the awaited Promise resolves.</li>
</ul>

<pre data-lang="javascript"><code class="language-javascript">async function loadDashboard(userId) {
  try {
    // Sequential execution: Line 4 will not run until line 3 finishes
    const user = await fetchUserData(userId);
    const profile = await fetchProfile(user.id);
    return { user, profile };
  } catch (err) {
    // Catches both rejected Promises and synchronous JavaScript exceptions!
    console.error("Failed to load dashboard:", err);
    throw err; // Re-throw to caller
  }
}
</code></pre>

<h3>7. Promise Combinators: The Complete Decision Matrix</h3>
<p>When running multiple asynchronous tasks concurrently, select the combinator that matches your failure model:</p>

<table>
  <thead>
    <tr>
      <th>Combinator</th>
      <th>Resolves When...</th>
      <th>Rejects When...</th>
      <th>Primary Production Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b><code>Promise.all([p1, p2])</code></b></td>
      <td><b>All</b> promises fulfill. Returns array of results.</td>
      <td><b>First</b> promise rejects (<b>fail-fast</b>).</td>
      <td>All results are mandatory (e.g. assembling all parts of an order before checkout).</td>
    </tr>
    <tr>
      <td><b><code>Promise.allSettled([p1, p2])</code></b></td>
      <td><b>All</b> promises settle (either fulfill OR reject).</td>
      <td><b>Never rejects.</b> Returns array of <code>{status, value | reason}</code>.</td>
      <td>Resilient batch processing where partial failures are acceptable (e.g. sending 100 emails).</td>
    </tr>
    <tr>
      <td><b><code>Promise.race([p1, p2])</code></b></td>
      <td><b>First</b> promise settles (fulfills OR rejects).</td>
      <td><b>First</b> promise settles with rejection.</td>
      <td>Request timeouts: racing a network fetch against a rejection timer.</td>
    </tr>
    <tr>
      <td><b><code>Promise.any([p1, p2])</code></b></td>
      <td><b>First</b> promise fulfills. Returns first successful value.</td>
      <td><b>All</b> promises reject. Returns <code>AggregateError</code>.</td>
      <td>Redundant mirrors or fallbacks (e.g. pinging 3 CDN endpoints and taking the fastest healthy response).</td>
    </tr>
  </tbody>
</table>

<pre data-lang="javascript"><code class="language-javascript">// Implementing a strict timeout with Promise.race:
function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(\`Operation timed out after \${timeoutMs}ms\`)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]);
}
</code></pre>

<h3>8. Cancellation with <code>AbortController</code></h3>
<p>Promises are inherently un-cancellable once created. Modern JavaScript standardizes cancellation via the <code>AbortController</code> API:</p>

<pre data-lang="javascript"><code class="language-javascript">const controller = new AbortController();
const signal = controller.signal;

// Automatically abort if operation takes longer than 3 seconds:
const timeoutId = setTimeout(() => controller.abort("Timeout exceeded"), 3000);

try {
  const response = await fetch("https://api.example.com/data", { signal });
  const data = await response.json();
  clearTimeout(timeoutId);
  console.log("Data loaded:", data);
} catch (err) {
  if (err.name === "AbortError") {
    console.warn("Fetch was successfully aborted:", controller.signal.reason);
  } else {
    console.error("Network failure:", err);
  }
}
</code></pre>

<h3>9. Async Race Conditions &amp; Shared State Pitfalls</h3>
<p>Even though JavaScript is single-threaded, asynchronous operations can interleave unpredictably, resulting in severe data race conditions:</p>

<pre data-lang="javascript"><code class="language-javascript">// [DANGEROUS]: Race condition with shared mutable state
let latestSearchQuery = "";
let searchResults = [];

async function onSearchInput(query) {
  latestSearchQuery = query;
  // If query "cat" takes 300ms, but query "cats" takes 50ms:
  // "cats" completes first, then "cat" completes later and overwrites the UI with stale data!
  const results = await apiSearch(query);
  searchResults = results; // Stale overwrite bug!
}

// [FIX]: Discard responses that do not match the current query version
let currentQueryId = 0;

async function onSearchInputSafe(query) {
  const thisQueryId = ++currentQueryId;
  const results = await apiSearch(query);
  
  // Guard: If a newer query was issued while waiting, discard this stale response!
  if (thisQueryId !== currentQueryId) return;
  
  searchResults = results;
}
</code></pre>

<h3>10. Active Recall Output Prediction Drills</h3>
<pre data-lang="javascript"><code class="language-javascript">// Drill 1: Microtask starvation
console.log("Start");

setTimeout(() => console.log("Timeout"), 0);

function recursiveMicrotask() {
  queueMicrotask(() => {
    // What happens to the Timeout callback if this loops indefinitely?
  });
}
console.log("End");

// Drill 2: Error handling in Promise constructor vs .then()
new Promise((resolve, reject) => {
  throw new Error("Crash inside executor!");
})
  .then(() => console.log("Step 1"))
  .catch(err => console.log("Caught:", err.message));
// Prediction: ?
</code></pre>

<details class="ex">
  <summary>Click to view answers and explanations</summary>
  <p><b>Drill 1:</b> The <code>setTimeout</code> callback will <b>never</b> execute! Because the microtask queue is drained to exhaustion before any macrotask runs, an endless loop of microtasks starves the event loop, freezing UI rendering and macrotask execution completely.</p>
  <p><b>Drill 2:</b> Outputs <code>Caught: Crash inside executor!</code>. The <code>Promise</code> constructor automatically wraps the executor body in a <code>try/catch</code> block. Any uncaught synchronous exception is converted into a Promise rejection.</p>
</details>

<h3>11. Practical Verification Exercise</h3>
<p>Implement a promise concurrency limiter (equivalent to <code>p-limit</code>) from scratch:</p>
<ul>
  <li>Signature: <code>function pLimit(concurrency)</code></li>
  <li>Returns a wrapper function: <code>const limit = pLimit(2); const promise = limit(() => fetchTask());</code></li>
  <li>At most <code>concurrency</code> tasks must be actively executing at any single moment.</li>
  <li>When a task finishes (whether fulfilled or rejected), the next task in the queue must immediately start.</li>
  <li>Ensure all tasks resolve with their respective values or reject with their respective errors.</li>
</ul>
`;export{e as default};

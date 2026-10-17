const e=`<p class="goal">Where names are visible, how long they live, and how functions carry their surroundings with them.</p>
<h3>Lexical scope</h3>
<p>Almost every modern language uses <b>lexical (static) scope</b>: which variable a name refers to is decided by <i>where the code is written</i>, not by who calls it. You can work it out by reading nested blocks from the inside outwards.</p>
<table>
<tr><th>Language</th><th>New scope created by</th><th>Notes</th></tr>
<tr><td>Python</td><td>functions, classes, modules, comprehensions. <b>Not</b> <code>if</code>/<code>for</code> blocks.</td><td>Assigning to a name anywhere in a function makes it local <i>throughout</i> that function (LEGB lookup).</td></tr>
<tr><td>JS/TS</td><td><code>let</code>/<code>const</code>: every <code>{}</code> block. <code>var</code>: the whole function (hoisted).</td><td>Never use <code>var</code>.</td></tr>
<tr><td>Go, Rust, C</td><td>every <code>{}</code> block</td><td>Go's <code>:=</code> in an inner block can accidentally <b>shadow</b> an outer variable.</td></tr>
</table>
<pre data-lang="python"><code class="language-python">for i in range(3): pass
print(i)            # 2: loop variables leak out of the loop in Python

x = "global"
def outer():
    x = "enclosing"
    def inner():
        return x    # 'enclosing': lexical, resolved where inner was DEFINED
    return inner
print(outer()())</code></pre>
<pre data-lang="go"><code class="language-go">var err error
if true {
    v, err := compute()   // BUG: := declares a NEW err that shadows the outer one
    _ = v
}
// the outer err is still nil here.   go vet -vettool=shadow / staticcheck catch this</code></pre>

<h3>Lifetime vs scope</h3>
<p><b>Scope</b> is where a name is visible (a compile-time idea). <b>Lifetime</b> is how long the value exists (a runtime idea). They usually match, but closures break the link: a local variable can outlive its function if a closure still references it. The runtime then keeps it alive on the heap. Go's compiler calls this <b>escape analysis</b> (<code>go build -gcflags=-m</code> shows which variables escape to the heap).</p>

<h3>Closures</h3>
<p>A <b>closure</b> is a function plus the environment it captured. It's how you get private state without a class:</p>
<pre data-lang="typescript"><code class="language-typescript">function rateLimiter(maxPerSec: number) {
  let tokens = maxPerSec;                                         // private: only the closure can see it
  setInterval(() =&gt; { tokens = maxPerSec; }, 1000);
  return () =&gt; (tokens &gt; 0 ? (tokens--, true) : false);
}
const allow = rateLimiter(5);
if (allow()) handle(req);</code></pre>
<pre data-lang="go"><code class="language-go">func counter() func() int {
    n := 0
    return func() int { n++; return n }   // n escapes to the heap, shared by every call of the closure
}</code></pre>
<pre data-lang="rust"><code class="language-rust">let mut n = 0;
let mut inc = || { n += 1; n };      // captures n by mutable borrow → this closure is FnMut
inc(); inc();
let name = String::from("asha");
let greet = move || println!("hi {name}");   // 'move' takes ownership: needed for threads
std::thread::spawn(greet).join().unwrap();</code></pre>
<p>Rust makes capture explicit through three traits: <code>Fn</code> (borrows immutably), <code>FnMut</code> (borrows mutably), and <code>FnOnce</code> (consumes the captured values, so it can only be called once). Other languages capture by reference silently.</p>

<h3>The classic capture bug</h3>
<pre data-lang="javascript"><code class="language-javascript">for (var i = 0; i &lt; 3; i++) setTimeout(() =&gt; console.log(i));   // 3 3 3: one shared 'var i'
for (let i = 0; i &lt; 3; i++) setTimeout(() =&gt; console.log(i));   // 0 1 2: a fresh 'i' per iteration</code></pre>
<pre data-lang="python"><code class="language-python">fns = [lambda: i for i in range(3)]
[f() for f in fns]                     # [2, 2, 2]: closures capture the VARIABLE, read it later
fns = [lambda i=i: i for i in range(3)]  # default args are evaluated now → [0, 1, 2]</code></pre>
<p>Go had the same bug with goroutines in loops until Go 1.22 made loop variables per-iteration.</p>

<h3>Modifying outer variables</h3>
<pre data-lang="python"><code class="language-python">def make_acc():
    total = 0
    def add(x):
        nonlocal total      # without this, 'total += x' raises UnboundLocalError
        total += x
        return total
    return add</code></pre>
<div class="callout key"><b class="t">Trade-offs: closures vs objects</b><p>Closures are lightweight, truly private and great for callbacks, but they're harder to inspect and debug, and they can accidentally keep large objects alive (memory leaks in long-running JS apps). Use a class when the state has several operations or needs to be visible for debugging and testing.</p></div>
<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>11.1 <span class="levels">basic</span> Write <code>once(fn)</code> in TypeScript: it returns a function that calls <code>fn</code> the first time and returns the cached result on every later call.</summary><div><pre data-lang="typescript"><code class="language-typescript">function once&lt;T&gt;(fn: () =&gt; T): () =&gt; T {
  let done = false, value!: T;
  return () =&gt; { if (!done) { value = fn(); done = true; } return value; };
}</code></pre></div></details>
<details class="ex"><summary>11.2 <span class="levels">think</span> In Go, write <code>debounce(f func(), d time.Duration) func()</code>: calls within d of each other collapse into one call to f.</summary><div><pre data-lang="go"><code class="language-go">func debounce(f func(), d time.Duration) func() {
    var mu sync.Mutex
    var t *time.Timer
    return func() {
        mu.Lock(); defer mu.Unlock()
        if t != nil { t.Stop() }
        t = time.AfterFunc(d, f)
    }
}</code></pre></div></details>
</div>
`;export{e as default};

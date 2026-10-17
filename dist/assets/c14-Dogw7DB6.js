const e=`<p class="goal">Functions as values, transformations over mutation.</p>
<h3>Key ideas</h3>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td><b>First-class functions</b></td><td>Functions are values: store them, pass them, return them.</td></tr>
<tr><td><b>Higher-order function</b></td><td>Takes or returns a function: <code>map</code>, <code>filter</code>, <code>sorted(key=…)</code>, decorators.</td></tr>
<tr><td><b>Lambda</b></td><td>An anonymous inline function: <code>lambda x: x * 2</code>, <code>x =&gt; x * 2</code>, <code>|x| x * 2</code>.</td></tr>
<tr><td><b>Closure</b></td><td>A function that remembers variables from the scope where it was created.</td></tr>
<tr><td><b>Pure function / immutability</b></td><td>No side effects; data is never changed, only new data is made.</td></tr>
<tr><td><b>Referential transparency</b></td><td>A call can be replaced with its result without changing the program.</td></tr>
<tr><td><b>Currying / partial application</b></td><td>Fixing some arguments now to get a function of the rest: <code>functools.partial</code>.</td></tr>
<tr><td><b>Lazy evaluation</b></td><td>Compute values only when needed: generators, iterators, Haskell.</td></tr>
</table>
<pre data-lang="python"><code class="language-python">orders = [{"amt": 500, "paid": True}, {"amt": 250, "paid": False}, {"amt": 900, "paid": True}]
paid_total = sum(o["amt"] for o in orders if o["paid"])        # filter → map → reduce
from functools import reduce
reduce(lambda acc, o: acc + o["amt"], orders, 0)               # explicit fold

def make_counter():                 # closure: 'count' lives on after make_counter returns
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc
c = make_counter(); c(); c()        # 1, 2

def timed(fn):                      # decorator = higher-order function that wraps another
    import time, functools
    @functools.wraps(fn)
    def wrapper(*a, **kw):
        t = time.perf_counter(); r = fn(*a, **kw)
        print(f"{fn.__name__}: {time.perf_counter() - t:.4f}s"); return r
    return wrapper

@timed
def slow(): sum(range(10**7))</code></pre>
<pre data-lang="javascript"><code class="language-javascript">const paidTotal = orders.filter(o =&gt; o.paid).map(o =&gt; o.amt).reduce((a, b) =&gt; a + b, 0);</code></pre>
<p><b>Generators and iterators.</b> An iterator yields items one at a time, so a pipeline over a 10 GB file uses constant memory:</p>
<pre data-lang="python"><code class="language-python">def read_lines(path):
    with open(path) as f:
        for line in f: yield line.rstrip()
errors = (l for l in read_lines("app.log") if "ERROR" in l)   # nothing has run yet
for e in errors: print(e)                                      # lazily pulled, line by line</code></pre>
<div class="callout warn"><b class="t">Closure trap: late binding</b><p><code>fs = [lambda: i for i in range(3)]; [f() for f in fs]</code> gives <code>[2, 2, 2]</code>. Closures capture the <i>variable</i>, not its value at that moment. Fix: <code>lambda i=i: i</code>. The same bug exists with <code>var</code> in JS loops.</p></div>
<div class="callout key"><b class="t">Trade-offs: FP vs OOP</b><p><b>FP pros:</b> easy to test (pure functions), safe concurrency (no shared mutation), composable pipelines, and fewer "who changed this?" bugs. <b>FP cons:</b> copying data can cost memory and time (persistent data structures mitigate this); I/O and state need special handling; heavy abstraction (monads) can hurt readability. <b>In practice:</b> most modern code mixes both. Use a functional core with an imperative shell, and objects where identity and state are real.</p></div>
<details class="ex"><summary>14.1 <span class="levels">basic</span> Write <code>compose(f, g)</code> that returns x ↦ f(g(x)), then <code>pipeline(*fns)</code> for any number of functions.</summary><div><pre data-lang="python"><code class="language-python">def pipeline(*fns):
    return lambda x: reduce(lambda acc, f: f(acc), fns, x)</code></pre></div></details>
<details class="ex"><summary>14.2 <span class="levels">think</span> Write a <code>@memoize</code> decorator yourself (don't use <code>functools.cache</code>) and apply it to fib.</summary><div><pre data-lang="python"><code class="language-python">def memoize(fn):
    store = {}
    def w(*args):
        if args not in store: store[args] = fn(*args)
        return store[args]
    return w</code></pre></div></details>
`;export{e as default};

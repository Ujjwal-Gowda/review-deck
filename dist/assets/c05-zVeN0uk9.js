const e=`<p class="goal">The single most important abstraction: named, reusable, testable units of logic.</p>

<h3>1. Why Functions: The Four Core Advantages</h3>
<ul>
  <li><b>Naming Concepts:</b> Encapsulates logic behind a semantic identifier (e.g. <code>is_valid_email()</code> expresses clear intent rather than 12 lines of regex and validation).</li>
  <li><b>Code Reuse:</b> Eliminates duplication and guarantees that bug fixes apply universally across all call sites.</li>
  <li><b>Isolated Testability:</b> Functions can be verified with automated unit tests without booting the entire application runtime.</li>
  <li><b>Local Reasoning:</b> Callers only need to understand the function's contract (inputs and return value), not its internal implementation details.</li>
</ul>

<pre data-lang="python"><code class="language-python">def area(width: float, height: float) -&gt; float:   # parameters with type annotations
    """Return the area of a rectangle."""          # docstring contract
    return width * height

a = area(3, 4)          # arguments (3, 4) are bound to parameters (width, height)</code></pre>

<ul>
  <li><b>Parameters vs Arguments:</b> Parameters are the placeholder variable names in the function signature; arguments are the concrete values passed during invocation.</li>
  <li><b>Default Returns:</b> Functions without an explicit <code>return</code> statement implicitly return <code>None</code> in Python, <code>undefined</code> in JavaScript, and <code>void</code> in C.</li>
  <li><b>Variadic &amp; Keyword Arguments:</b> <code>*args</code> captures excess positional arguments into a tuple; <code>**kwargs</code> captures keyword arguments into a dictionary.</li>
</ul>

<div class="callout warn"><b class="t">Python's Classic Mutable Default Argument Trap</b>
<ul>
  <li><b>Root Cause:</b> Default parameter values are evaluated <b>only once</b> at module load time when the <code>def</code> statement is executed, not on each call!</li>
  <li><b>The Anti-Pattern:</b> <code>def add(item, bucket=[])</code> reuses the exact same list across every invocation.</li>
  <li><b>The Idiomatic Solution:</b> Set the default parameter to <code>None</code> and initialize a new list inside the function body.</li>
</ul>
<pre data-lang="python"><code class="language-python"># ANTI-PATTERN: bucket list is shared globally
def add_item(item, bucket=[]):
    bucket.append(item)
    return bucket

add_item(1)   # [1]
add_item(2)   # [1, 2] -> BUG: reuses the same list!

# IDIOMATIC SOLUTION: Sentinel None
def add_item(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket</code></pre>
</div>

<h3>2. Scope: The LEGB Rule</h3>
<p>Variables declared inside a function are <b>local</b>—they exist exclusively during that invocation's lifecycle and cannot collide with outer variables. Python resolves variable names using the <b>LEGB</b> hierarchy:</p>

<ol>
  <li><b>Local (L):</b> Names assigned within the current function body.</li>
  <li><b>Enclosing (E):</b> Names in the local scope of any enclosing/parent functions (closures).</li>
  <li><b>Global (G):</b> Names assigned at the top-level module file.</li>
  <li><b>Built-in (B):</b> Predefined names supplied by the language runtime (<code>len</code>, <code>range</code>, <code>print</code>).</li>
</ol>

<ul>
  <li><b>Function Scope vs Block Scope:</b> C, Go, Rust, Java, and modern JavaScript (<code>let</code>/<code>const</code>) use block scope (variables die at the closing <code>}</code>). Python uses function scope (variables declared inside an <code>if</code> block remain visible after the block).</li>
  <li><b>Avoid Global Mutation:</b> While <code>global count</code> exists in Python, mutating global state creates hidden dependencies and race conditions. Pass values in as arguments and return new values out.</li>
</ul>

<h3>3. Pure Functions vs Side Effects</h3>
<ul>
  <li><b>Pure Functions:</b>
    <ul>
      <li>Deterministic: always produce identical output for identical input arguments.</li>
      <li>Zero side effects: never alter external files, databases, network sockets, or caller variables.</li>
      <li>Trivially testable and cacheable (memoization).</li>
    </ul>
  </li>
  <li><b>Side Effects:</b> Any observable interaction with the outside world: printing to terminal, reading the clock, updating database rows, or sending an HTTP request.</li>
  <li><b>Architectural Rule ("Functional Core, Imperative Shell"):</b> Push side effects to the boundaries of your architecture. Keep your business logic pure and wrap it in a thin I/O layer.</li>
</ul>

<pre data-lang="python"><code class="language-python"># PURE CORE: 100% deterministic, zero I/O, trivially testable
def summarize(orders: list[dict]) -&gt; dict:
    total = sum(o["amount"] for o in orders)
    return {"count": len(orders), "total": total}

# IMPERATIVE SHELL: Handles network and disk I/O at the application edge
def main():
    orders = load_orders_from_file("orders.json")
    summary = summarize(orders)
    print(summary)</code></pre>

<h3>4. The Call Stack &amp; Stack Frames</h3>
<ul>
  <li><b>Stack Frame Lifecycle:</b> Each function call pushes an execution frame onto the call stack containing parameters, local variables, and the return address. When execution hits <code>return</code>, the frame is popped.</li>
  <li><b>Reading Tracebacks:</b> Crash tracebacks are literal dumps of the call stack at the moment of failure. Read bottom-up to locate the crash point, and top-down to trace the execution history that led there.</li>
</ul>

<div class="diagram">def c(): return 1           Call Stack state while c() executes (grows downward):
def b(): return c() + 1       ┌──────────────┐
def a(): return b() + 1       │ main          │  ← suspended, awaiting a()
a()                           ├──────────────┤
                              │ a             │  ← suspended, awaiting b()
                              ├──────────────┤
                              │ b             │  ← suspended, awaiting c()
                              ├──────────────┤
                              │ c   (active)  │  ← currently executing
                              └──────────────┘</div>

<h3>5. Recursion: The Two Non-Negotiable Requirements</h3>
<p>A recursive function is one that solves a problem by calling itself with smaller inputs. Every correct recursive function requires:</p>

<ol>
  <li><b>A Base Case:</b> A non-recursive branch that terminates execution and returns a direct answer.</li>
  <li><b>A Recursive Step:</b> A call to itself that is guaranteed to progress monotonically toward the base case.</li>
</ol>

<ul>
  <li><b>The Recursive Leap of Faith:</b> Assume the sub-call works correctly for smaller inputs. Only verify that the base case is accurate and the combination step is correct.</li>
  <li><b>Stack Overflow Risk:</b> Deep recursion exhausts stack memory (Python caps calls at ~1,000 frames with a <code>RecursionError</code>). Any recursion can be converted to an iterative loop with an explicit heap-allocated stack.</li>
</ul>

<pre data-lang="python"><code class="language-python"># Factorial calculation demonstrating base case + recursive step
def factorial(n: int) -&gt; int:
    if n &lt;= 1:                       # Base case: halts recursion
        return 1
    return n * factorial(n - 1)      # Recursive step: moves toward base case

# Nested data tree traversal
def sum_nested(tree: list | int) -&gt; int:
    if isinstance(tree, int):
        return tree
    return sum(sum_nested(child) for child in tree)

print(sum_nested([1, [2, [3, 4]], 5]))   # 15</code></pre>

<div class="exercises"><h3>Practice Exercises</h3>
<details class="ex"><summary>5.1 <span class="levels">basic</span> Write <code>clamp(x, lo, hi)</code> and <code>is_leap_year(y)</code> (divisible by 4, except centuries, unless divisible by 400). Add 5 assertion checks.</summary><div>
<pre data-lang="python"><code class="language-python">def clamp(x, lo, hi):
    return max(lo, min(x, hi))

def is_leap_year(y):
    return y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)

assert is_leap_year(2024) and not is_leap_year(1900) and is_leap_year(2000)</code></pre></div></details>
<details class="ex"><summary>5.2 <span class="levels">basic</span> Write recursive <code>power(base, exp)</code> optimized to $O(\\log \\text{exp})$ using the "square the half" identity ($x^{10} = (x^5)^2$).</summary><div>
<pre data-lang="python"><code class="language-python">def power(b: float, e: int) -&gt; float:
    if e == 0: return 1.0
    half = power(b, e // 2)
    return half * half if e % 2 == 0 else half * half * b</code></pre></div></details>
<details class="ex"><summary>5.3 <span class="levels">think</span> Towers of Hanoi: print the moves to transfer n discs from peg A to C via B using the recursive leap of faith.</summary><div>
<pre data-lang="python"><code class="language-python">def hanoi(n, src="A", dst="C", via="B"):
    if n == 0: return
    hanoi(n - 1, src, via, dst)      # Move top n-1 discs out of the way
    print(f"disc {n}: {src} -> {dst}")
    hanoi(n - 1, via, dst, src)      # Move n-1 discs back onto destination</code></pre><p>Total moves required: $2^n - 1$. Sketch the call stack for $n = 3$ to observe the symmetric tree unfolding.</p></div></details>
<details class="ex"><summary>5.4 <span class="levels">think</span> Trace the call stack for <code>factorial(4)</code> at its deepest point. How many frames exist, and what does each hold?</summary><div><p>Five frames simultaneously reside on the stack: <code>main</code>, <code>factorial(4)</code>, <code>factorial(3)</code>, <code>factorial(2)</code>, and <code>factorial(1)</code>. Each frame stores its own private parameter <code>n</code> and execution pointer. Once <code>factorial(1)</code> returns 1, frames pop in sequence: $2 \\times 1 = 2 \\rightarrow 3 \\times 2 = 6 \\rightarrow 4 \\times 6 = 24$.</p></div></details>
</div>
`;export{e as default};

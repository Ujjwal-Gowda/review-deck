const e=`<p class="goal">Making programs choose and repeat, and getting loop boundaries right every time.</p>

<h3>1. Conditionals: Ordering &amp; Guard Clauses</h3>
<ul>
  <li><b>Sequential Evaluation:</b> Branches are evaluated from top to bottom; execution halts immediately at the first condition that evaluates to truthy.</li>
  <li><b>Specificity Rule:</b> Always test the most specific conditions before broader ones. If <code>score &gt;= 50</code> is checked before <code>score &gt;= 90</code>, an A grade will mistakenly receive a C.</li>
  <li><b>Guard Clauses (Early Returns):</b> Invert nested if-statements to handle failure conditions early, keeping the primary logic unindented and readable.</li>
</ul>

<pre data-lang="python"><code class="language-python"># Nested pyramid (antipattern: hard to read)     # Guard clauses (idiomatic: flat &amp; clean)
def ship(order):                                  def ship(order):
    if order:                                         if not order:
        if order.paid:                                    return "no order"
            if order.items:                           if not order.paid:
                return send(order)                        return "unpaid"
            else: return "empty"                      if not order.items:
        else: return "unpaid"                             return "empty"
    else: return "no order"                           return send(order)</code></pre>

<h3>2. Pattern Matching &amp; Multi-Way Branching</h3>
<ul>
  <li><b>Structural Matching:</b> Modern languages (Python 3.10+, Rust, TypeScript, Swift) allow pattern matching on both values and data shapes.</li>
  <li><b>Exhaustiveness Invariant (Rust / TS):</b> The compiler verifies that every possible enum variant or state is explicitly handled. Omitting a case causes a compilation error.</li>
  <li><b>Fallthrough Trap (C / C++):</b> Classic C <code>switch</code> statements silently fall through into adjacent cases unless interrupted with an explicit <code>break</code>. Go, Python, and Rust eliminate fallthrough by default.</li>
</ul>

<pre data-lang="python"><code class="language-python">match command.split():
    case ["go", direction]:
        move(direction)
    case ["take", item, *rest]:
        take(item)
    case ["quit"] | ["exit"]:
        stop()
    case _:
        print("unknown command")</code></pre>

<h3>3. Loops: While vs For</h3>
<ul>
  <li><b><code>while</code> Loops:</b> Used when the exact number of iterations is not known in advance (e.g. reading from a network stream until EOF, waiting for a lock, convergence algorithms).</li>
  <li><b><code>for</code> Loops:</b> Used when iterating over a finite collection, stream, or arithmetic progression (e.g. arrays, slices, generators).</li>
  <li><b><code>enumerate</code>:</b> Idiomatic pattern in Python and Go when both index and item are required simultaneously. Avoid manual counter variables (<code>i += 1</code>).</li>
  <li><b>Loop Control Statements:</b>
    <ul>
      <li><code>continue</code>: Immediately bypasses remaining statements in the current iteration and advances the loop counter.</li>
      <li><code>break</code>: Abruptly terminates loop execution and transfers control to the enclosing statement.</li>
    </ul>
  </li>
</ul>

<pre data-lang="python"><code class="language-python"># while: terminates when monotonic condition fails
n, steps = 27, 0
while n != 1:
    n = n // 2 if n % 2 == 0 else 3 * n + 1
    steps += 1

# for: sequence traversal
for i in range(5):          # [0, 5): 0, 1, 2, 3, 4
    print(i)

# enumerate: clean index + item pair
for i, name in enumerate(["asha", "ravi"]):
    print(f"Index {i}: {name}")</code></pre>

<h3>4. Off-by-One Errors &amp; Half-Open Ranges</h3>
<p>The most pervasive bug class in computer science is solved via a single universal convention: <b>Half-Open Ranges <code>[start, end)</code></b>:</p>

<ul>
  <li><b>Start Inclusive, End Exclusive:</b> The element at <code>start</code> is included; the element at <code>end</code> is omitted.</li>
  <li><b>Direct Length Calculation:</b> The number of elements in <code>[start, end)</code> is simply <code>end - start</code> (no confusing <code>+ 1</code> or <code>- 1</code>).</li>
  <li><b>Clean Range Splitting:</b> Adjacent ranges fit together seamlessly without gaps or overlaps: <code>[0, 5)</code> and <code>[5, 10)</code> cleanly partition <code>[0, 10)</code>.</li>
  <li><b>Empty Range Definition:</b> An empty partition occurs cleanly when <code>start == end</code>.</li>
</ul>

<div class="callout note"><b class="t">The 3-Case Sanity Check</b>
<p>Whenever you implement any loop or array slice boundary, mentally verify these 3 edge cases:</p>
<ol>
  <li><b>Empty input:</b> Does the loop safely exit when length is 0?</li>
  <li><b>Single-element input:</b> Does it process index 0 correctly without crashing?</li>
  <li><b>Last element boundary:</b> Does the loop terminate on the final valid index without overflowing bounds?</li>
</ol>
</div>

<h3>5. Loop Invariants: Proving Algorithmic Correctness</h3>
<p>A <b>loop invariant</b> is a formal statement about program state that holds true at three specific milestones:</p>
<ul>
  <li><b>Initialization:</b> True prior to the first iteration of the loop.</li>
  <li><b>Maintenance:</b> If true before an iteration, it remains true before the subsequent iteration.</li>
  <li><b>Termination:</b> When the loop terminates, the invariant provides a guaranteed property proving algorithmic correctness.</li>
</ul>

<pre data-lang="python"><code class="language-python">def maximum(xs: list[int]) -&gt; int:
    best = xs[0]
    # INVARIANT: 'best' is guaranteed to equal max(xs[0 : i]) at the start of each iteration
    for i in range(1, len(xs)):
        if xs[i] &gt; best:
            best = xs[i]
    # At termination (i == len(xs)), best == max(xs[0 : len(xs)]) -> correctly returns maximum
    return best</code></pre>

<h3>6. Nested Loops &amp; Breaking Strategies</h3>
<ul>
  <li><b>Quadratic Complexity:</b> An inner loop iterating $N$ times inside an outer loop iterating $M$ times executes $N \\times M$ total iterations (the origin of $O(N^2)$ complexity).</li>
  <li><b>Single-Level Break:</b> A standard <code>break</code> statement terminates <i>only the innermost loop</i>.</li>
  <li><b>Exiting Nested Loops Cleanly:</b>
    <ul>
      <li><b>Function Refactoring:</b> Encapsulate nested loops inside a dedicated helper function and use <code>return</code>.</li>
      <li><b>Labeled Breaks:</b> Supported in Go, Rust, Java, and JavaScript (e.g. <code>break outer;</code>).</li>
      <li><b>Python <code>for/else</code>:</b> The <code>else</code> branch executes only if the loop ran to completion without encountering a <code>break</code>.</li>
    </ul>
  </li>
</ul>

<pre data-lang="python"><code class="language-python"># Exiting nested loops via function return
def find_target(matrix, target):
    for r, row in enumerate(matrix):
        for c, val in enumerate(row):
            if val == target:
                return (r, c)   # cleanly breaks both loops
    return None</code></pre>

<div class="exercises"><h3>Practice Exercises</h3>
<details class="ex"><summary>4.1 <span class="levels">basic</span> FizzBuzz 1–100: multiples of 3 print "Fizz", of 5 "Buzz", of both "FizzBuzz", otherwise the number. Avoid order-dependent if/elif chains.</summary><div>
<pre data-lang="python"><code class="language-python">for i in range(1, 101):
    out = ""
    if i % 3 == 0: out += "Fizz"
    if i % 5 == 0: out += "Buzz"
    print(out or i)</code></pre><p>Building the string incrementally bypasses the classic bug where <code>i % 3 == 0</code> precedes <code>i % 15 == 0</code>.</p></div></details>
<details class="ex"><summary>4.2 <span class="levels">basic</span> Print a right-aligned triangle of <code>*</code> with height n (n=4 produces "   *", "  **", " ***", "****").</summary><div>
<pre data-lang="python"><code class="language-python">n = 4
for i in range(1, n + 1):
    print(" " * (n - i) + "*" * i)</code></pre></div></details>
<details class="ex"><summary>4.3 <span class="levels">think</span> Find all primes below 100 using nested loops, then explicitly define the inner loop invariant.</summary><div>
<pre data-lang="python"><code class="language-python">primes = []
for n in range(2, 100):
    d = 2
    # INVARIANT: n has no factor in the half-open range [2, d)
    while d * d &lt;= n and n % d != 0:
        d += 1
    if d * d &gt; n:
        primes.append(n)</code></pre><p>Testing divisors only up to $\\sqrt{n}$ guarantees optimal $O(\\sqrt{n})$ verification per number.</p></div></details>
<details class="ex"><summary>4.4 <span class="levels">think</span> The Collatz loop above: how do you prove it always terminates? (Trick question.)</summary><div><p>Nobody has proven it! This is the famed unsolved Collatz conjecture. The engineering takeaway: <b>loop termination is a mathematical guarantee you must design for</b>. Standard loops terminate because a measurable distance metric strictly decreases towards a lower bound on every iteration.</p></div></details>
</div>
`;export{e as default};

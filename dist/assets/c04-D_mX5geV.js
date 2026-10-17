const e=`<p class="goal">Making programs choose and repeat, and getting loop boundaries right every time.</p>

<h3>Conditionals</h3>
<pre data-lang="python"><code class="language-python">def grade(score: int) -&gt; str:
    if score &gt;= 90:
        return "A"
    elif score &gt;= 75:
        return "B"
    elif score &gt;= 50:
        return "C"
    else:
        return "F"</code></pre>
<p>Order matters: conditions are checked top to bottom and the first match wins. If you put <code>score &gt;= 50</code> first, everyone passing gets a C.</p>
<p><b>Guard clauses</b> (early returns) keep code flat instead of deeply nested:</p>
<pre data-lang="python"><code class="language-python"># nested (hard to read)                    # guard clauses (easy to read)
def ship(order):                            def ship(order):
    if order:                                   if not order:
        if order.paid:                              return "no order"
            if order.items:                     if not order.paid:
                return send(order)                  return "unpaid"
            else: return "empty"                if not order.items:
        else: return "unpaid"                       return "empty"
    else: return "no order"                     return send(order)</code></pre>
<p><b>Pattern matching / switch</b>: many languages have multi-way branching on a value's shape:</p>
<pre data-lang="python"><code class="language-python">match command.split():
    case ["go", direction]:
        move(direction)
    case ["take", item, *rest]:
        take(item)
    case ["quit"] | ["exit"]:
        stop()
    case _:
        print("unknown")</code></pre>
<p>Rust's <code>match</code> is <b>exhaustive</b>: the compiler errors if you forget a case. That's hugely valuable, and you'll see why in <a class="xref" data-old="c19">chapter 19</a>. C's <code>switch</code> <b>falls through</b> to the next case unless you write <code>break</code>, a famous source of bugs; Go's doesn't.</p>

<h3>Loops</h3>
<pre data-lang="python"><code class="language-python"># while: repeat while a condition holds; use when you DON'T know how many iterations
n = 27
steps = 0
while n != 1:
    n = n // 2 if n % 2 == 0 else 3 * n + 1
    steps += 1

# for: repeat over each item of a collection or range
for i in range(5):          # 0,1,2,3,4: start inclusive, end EXCLUSIVE
    print(i)
for i in range(10, 0, -2):  # 10,8,6,4,2
    print(i)
for name in ["asha", "ravi"]:
    print(name)
for i, name in enumerate(["asha", "ravi"]):   # need index + value? enumerate
    print(i, name)</code></pre>
<pre data-lang="c"><code class="language-c">for (int i = 0; i &lt; n; i++) {   /* init; condition; step: the classic C-family loop */
    if (i == 3) continue;       /* skip to next iteration */
    if (i == 7) break;          /* leave the loop entirely */
    printf("%d\\n", i);
}</code></pre>

<h3>Off-by-one errors, and how to never make them</h3>
<p>The most common bug in all of programming. The fix is a convention: <b>half-open ranges <code>[start, end)</code></b>: start included, end excluded. Nearly every modern language uses it (<code>range(0, n)</code>, slices <code>a[2:5]</code>, C's <code>i &lt; n</code>). Its benefits:</p>
<ul>
<li>The length is <code>end − start</code>, with no +1.</li>
<li>Adjacent ranges join perfectly: <code>[0,5)</code> + <code>[5,10)</code> = <code>[0,10)</code>.</li>
<li>An empty range is <code>start == end</code>.</li>
</ul>
<p>When you write a loop, check three cases mentally: <b>empty input, one element, and the last element</b>.</p>

<h3>Loop invariants: how to reason about loops</h3>
<p>An <b>invariant</b> is a statement that's true before and after every iteration. It's the tool for writing loops you <i>know</i> are correct instead of loops you <i>hope</i> are correct:</p>
<pre data-lang="python"><code class="language-python">def maximum(xs):
    best = xs[0]
    # INVARIANT: best == max(xs[0 : i]) at the start of each iteration
    for i in range(1, len(xs)):
        if xs[i] &gt; best:
            best = xs[i]
    # loop ended with i == len(xs), so best == max(xs[0 : len(xs)]) == max of everything
    return best</code></pre>
<p>You'll use this idea heavily for binary search (<a class="xref" data-old="c11">chapter 11</a>), where it separates working code from almost-working code.</p>

<h3>Nested loops</h3>
<pre data-lang="python"><code class="language-python">for row in range(1, 4):
    for col in range(1, 4):
        print(row * col, end="\\t")
    print()          # newline after each row
# The inner loop runs completely for EACH outer iteration: 3 × 3 = 9 prints.
# n × n iterations is where "O(n²)" comes from (<a class="xref" data-old="c11">chapter 11</a>).</code></pre>
<p>Breaking out of <i>nested</i> loops: <code>break</code> only exits the innermost loop. Options are to put the loops in a function and <code>return</code>, to use labelled breaks (Go, Rust, Java, JS: <code>outer: for …  break outer</code>), or, in Python, to use <code>for … else</code> (the <code>else</code> runs only if the loop didn't <code>break</code>).</p>

<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>4.1 <span class="levels">basic</span> FizzBuzz 1–100: multiples of 3 print "Fizz", of 5 "Buzz", of both "FizzBuzz", otherwise the number. Get it right first time: think about the order of conditions.</summary><div>
<pre data-lang="python"><code class="language-python">for i in range(1, 101):
    out = ""
    if i % 3 == 0: out += "Fizz"
    if i % 5 == 0: out += "Buzz"
    print(out or i)</code></pre><p>The common bug is checking <code>% 3</code> in an <code>if/elif</code> before <code>% 15</code>, so 15 prints "Fizz". Building the string avoids the ordering problem entirely.</p></div></details>
<details class="ex"><summary>4.2 <span class="levels">basic</span> Print a right-aligned triangle of <code>*</code> with height n (n=4 gives "   *", "  **", " ***", "****").</summary><div>
<pre data-lang="python"><code class="language-python">n = 4
for i in range(1, n + 1):
    print(" " * (n - i) + "*" * i)</code></pre></div></details>
<details class="ex"><summary>4.3 <span class="levels">think</span> Find all primes below 100 using nested loops, then state the loop invariant of your inner loop.</summary><div>
<pre data-lang="python"><code class="language-python">primes = []
for n in range(2, 100):
    d = 2
    # INVARIANT: n has no divisor in [2, d)
    while d * d &lt;= n and n % d != 0:
        d += 1
    if d * d &gt; n:
        primes.append(n)</code></pre><p>You only need to test divisors up to √n: if n = a×b, one of a and b is ≤ √n.</p></div></details>
<details class="ex"><summary>4.4 <span class="levels">think</span> The Collatz loop above: how do you know it terminates? (Trick question.)</summary><div><p>Nobody knows! It's the unsolved Collatz conjecture. The lesson: <b>termination is a property you must argue for</b>. A normal loop terminates because something measurable strictly decreases each iteration (e.g. <code>high − low</code> in binary search) and can't go below zero.</p></div></details>
</div>
`;export{e as default};

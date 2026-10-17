const t=`<p class="goal">The maths of cost, deeper than the quick intro in <a class="xref" data-old="c11">chapter 19</a>: how to derive complexity, and where Big-O stops being enough.</p>
<h3>The formal idea</h3>
<p><b>f(n) is O(g(n))</b> if, beyond some input size, f is at most a constant times g. It's an <i>upper bound</i> on growth. Its relatives: <b>Ω</b> (a lower bound) and <b>Θ</b> (a tight bound: both at once). In everyday speech, "O" usually means Θ of the worst case.</p>
<table>
<tr><th>Code shape</th><th>Cost</th></tr>
<tr><td>fixed number of steps</td><td>O(1)</td></tr>
<tr><td>loop i = 1, 2, 4, 8 … n (or halving)</td><td>O(log n)</td></tr>
<tr><td>one pass</td><td>O(n)</td></tr>
<tr><td>sort, or "halve and do linear work at each level"</td><td>O(n log n)</td></tr>
<tr><td>for i: for j &gt; i</td><td>n(n−1)/2 → O(n²)</td></tr>
<tr><td>every subset / every permutation</td><td>O(2ⁿ) / O(n!)</td></tr>
</table>
<h3>Recurrences: the cost of recursive algorithms</h3>
<p>Write the cost as an equation, then solve it with the <b>Master theorem</b>: for T(n) = a·T(n/b) + f(n), compare f(n) with n^(log_b a).</p>
<table>
<tr><th>Algorithm</th><th>Recurrence</th><th>Result</th></tr>
<tr><td>binary search</td><td>T(n) = T(n/2) + O(1)</td><td>O(log n)</td></tr>
<tr><td>merge sort</td><td>T(n) = 2T(n/2) + O(n)</td><td>O(n log n): log n levels, O(n) work per level</td></tr>
<tr><td>naive Fibonacci</td><td>T(n) = T(n−1) + T(n−2) + O(1)</td><td>O(φⁿ) ≈ O(1.618ⁿ)</td></tr>
<tr><td>tree traversal</td><td>T(n) = 2T(n/2) + O(1)</td><td>O(n)</td></tr>
</table>
<h3>Amortised analysis</h3>
<p>Dynamic array append: most appends cost 1, but at sizes 1, 2, 4, 8 … a resize copies everything. Total cost for n appends ≤ n + (1 + 2 + 4 + … + n) &lt; 3n, so each append is <b>O(1) amortised</b>. If the array grew by a constant (+10) instead of doubling, n appends would cost O(n²). Growth <i>factor</i> matters, not growth amount.</p>
<h3>Space complexity</h3>
<p>Count the <i>extra</i> memory: the set in a dedupe (O(n)), the recursion stack (O(depth)), the DP table (O(n·m), often reducible to O(m) by keeping only the previous row). Memory is often the real limit. On your 7 GB machine, an O(n²) table of 8-byte numbers for n = 30,000 is 7.2 GB.</p>
<h3>Lower bounds: when you can't do better</h3>
<ul>
<li><b>Comparison sorting is Ω(n log n).</b> There are n! possible orderings, and each comparison halves the possibilities, so you need log₂(n!) ≈ n log n comparisons. Counting and radix sort beat it by not comparing (they need bounded integer keys).</li>
<li>Finding the max of unsorted data is Ω(n): you must look at every element.</li>
<li>Searching unsorted data is Ω(n). Sort it once (n log n) if you'll search many times.</li>
</ul>
<h3>Beyond Big-O: what the real cost depends on</h3>
<ul>
<li><b>Constants:</b> 100n is slower than n² for n &lt; 100.</li>
<li><b>Memory access patterns:</b> an O(n) linked-list walk can be 10–50× slower than an O(n) array scan (see <a class="xref" data-old="n03">chapter 3</a> and <a class="xref" data-old="c22">chapter 5</a>).</li>
<li><b>I/O dominates:</b> one database round trip (~1 ms) is worth about a million CPU operations. Reducing queries from n to 1 beats any algorithmic cleverness in the loop.</li>
<li><b>Input distribution:</b> quicksort's worst case, and hash-table collisions under attack.</li>
</ul>
<h3>Measure it</h3>
<pre data-lang="python"><code class="language-python">import timeit
for n in (1_000, 10_000, 100_000):
    xs = list(range(n))
    t = timeit.timeit(lambda: n - 1 in xs, number=100)
    print(n, f"{t:.4f}s")      # grows ~10× per row → linear. Try with a set: flat → O(1)</code></pre>
<pre data-lang="go"><code class="language-go">func BenchmarkContains(b *testing.B) {      // go test -bench=. -benchmem
    xs := make([]int, 100_000)
    for i := 0; i &lt; b.N; i++ { slices.Contains(xs, -1) }
}</code></pre>
<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>20.1 <span class="levels">basic</span> What's the complexity of: <code>for i in range(n): for j in range(i, n, i or 1): ...</code>?</summary><div><p>The inner loop runs about n/i times, so the sum is n(1 + 1/2 + 1/3 + … + 1/n) = n·H(n) ≈ <b>O(n log n)</b>. That's the harmonic series, and it's the same analysis as the Sieve of Eratosthenes.</p></div></details>
<details class="ex"><summary>20.2 <span class="levels">think</span> An API takes 20 ms per call and you loop over 500 orders calling it. Estimate the time, then propose two fixes.</summary><div><p>10 seconds. Fixes: a batch endpoint (1 call), or concurrency with a limit (e.g. 20 in flight at once, about 0.5 s). Algorithmic complexity didn't change; the constant factor (network latency) did.</p></div></details>
</div>
`;export{t as default};

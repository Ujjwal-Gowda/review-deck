const e=`<p class="goal">Predicting how code behaves as the data grows, and the classic algorithms every programmer should be able to write from memory.</p>

<h3>What an algorithm is</h3>
<p>A finite, precise sequence of steps that solves a problem for <i>every</i> valid input. Judge it by <b>correctness</b> first, then <b>time</b> (how the number of steps grows) and <b>space</b> (how much extra memory it needs).</p>

<h3>Big-O notation</h3>
<p>Big-O describes how the cost grows as the input size <i>n</i> grows, ignoring constant factors and smaller terms. <code>3n² + 10n + 7</code> is <b>O(n²)</b> because, for large n, the n² term dominates everything else.</p>
<table>
<tr><th>Big-O</th><th>Name</th><th>n = 1,000</th><th>n = 1,000,000</th><th>Typical example</th></tr>
<tr><td>O(1)</td><td>constant</td><td>1</td><td>1</td><td>array index, dict lookup</td></tr>
<tr><td>O(log n)</td><td>logarithmic</td><td>10</td><td>20</td><td>binary search, balanced tree</td></tr>
<tr><td>O(n)</td><td>linear</td><td>1,000</td><td>1,000,000</td><td>one loop over the data</td></tr>
<tr><td>O(n log n)</td><td>linearithmic</td><td>10,000</td><td>20,000,000</td><td>good sorting (merge sort, Timsort)</td></tr>
<tr><td>O(n²)</td><td>quadratic</td><td>1,000,000</td><td>10¹² (hours or days)</td><td>nested loops over the same data</td></tr>
<tr><td>O(2ⁿ)</td><td>exponential</td><td>≈10³⁰¹</td><td>never finishes</td><td>trying all subsets</td></tr>
<tr><td>O(n!)</td><td>factorial</td><td>…</td><td>…</td><td>trying all orderings</td></tr>
</table>
<p>A modern CPU does very roughly 10⁸–10⁹ simple steps per second. That makes the table practical: at n = 10⁶, O(n log n) is instant and O(n²) is unusable.</p>

<h3>How to work out the complexity of code</h3>
<ul>
<li>Sequential blocks <b>add</b>, so the biggest term wins: O(n) + O(n²) = O(n²).</li>
<li>Nested loops <b>multiply</b>: a loop of n inside a loop of n is O(n²); a loop of n inside a loop of m is O(n·m).</li>
<li>Halving the problem each step gives <b>O(log n)</b>.</li>
<li><b>Watch for hidden loops</b> inside built-ins: <code>x in list</code>, <code>list.index</code>, <code>list.insert(0, …)</code>, <code>s += string</code> in a loop, and slicing are all O(n).</li>
</ul>
<pre data-lang="python"><code class="language-python">def has_duplicate_slow(xs):            # O(n²): 'in' on a list slice is itself a loop
    for i, x in enumerate(xs):
        if x in xs[i + 1:]:
            return True
    return False

def has_duplicate_fast(xs):            # O(n) time, O(n) extra space
    seen = set()
    for x in xs:
        if x in seen: return True
        seen.add(x)
    return False
# the classic trade: spend memory to save time</code></pre>
<p><b>Best, average and worst case</b>: quicksort is O(n log n) on average but O(n²) in the worst case. <b>Amortised</b> cost averages over a sequence of operations: list <code>append</code> is occasionally O(n) (when it resizes) but O(1) amortised, because doubling the capacity makes resizes rare enough. <b>Space complexity</b> counts the extra memory used; recursion uses O(depth) stack space.</p>

<h3>Searching</h3>
<pre data-lang="python"><code class="language-python">def binary_search(xs, target):
    """xs must be SORTED. Returns an index of target, or -1. O(log n)."""
    lo, hi = 0, len(xs)          # search space is the half-open range [lo, hi)
    while lo &lt; hi:               # non-empty range
        mid = (lo + hi) // 2     # (in C/Java: lo + (hi - lo) / 2 to avoid overflow)
        if xs[mid] == target:
            return mid
        elif xs[mid] &lt; target:
            lo = mid + 1         # target is in [mid+1, hi)
        else:
            hi = mid             # target is in [lo, mid)
    return -1                    # range became empty</code></pre>
<p>Binary search is famously easy to get subtly wrong (infinite loops, off-by-one). The invariant "if the target is present, it's in <code>[lo, hi)</code>" plus "<code>hi − lo</code> shrinks every iteration" is what makes it provably correct. Its power goes beyond arrays: you can binary search <i>any</i> monotonic yes/no question ("what's the smallest capacity that ships everything in 5 days?").</p>

<h3>Sorting</h3>
<p>You'll almost always call the built-in sort (Python/Java use <b>Timsort</b>, which is O(n log n) and <b>stable</b>, meaning equal elements keep their order). But writing these yourself builds the core algorithmic muscles:</p>
<pre data-lang="python"><code class="language-python">def insertion_sort(xs):              # O(n²), but fast for small or nearly-sorted data
    xs = xs[:]
    for i in range(1, len(xs)):
        cur, j = xs[i], i - 1
        while j &gt;= 0 and xs[j] &gt; cur:  # shift bigger items right
            xs[j + 1] = xs[j]
            j -= 1
        xs[j + 1] = cur
    return xs

def merge_sort(xs):                  # O(n log n) always, stable, O(n) extra space
    if len(xs) &lt;= 1:
        return xs
    mid = len(xs) // 2
    left, right = merge_sort(xs[:mid]), merge_sort(xs[mid:])   # divide
    out, i, j = [], 0, 0
    while i &lt; len(left) and j &lt; len(right):                    # conquer: merge
        if left[i] &lt;= right[j]: out.append(left[i]); i += 1
        else:                   out.append(right[j]); j += 1
    return out + left[i:] + right[j:]

def quick_sort(xs):                  # average O(n log n), worst O(n²); in-place versions are cache-fast
    if len(xs) &lt;= 1: return xs
    pivot = xs[len(xs) // 2]
    return (quick_sort([x for x in xs if x &lt; pivot])
            + [x for x in xs if x == pivot]
            + quick_sort([x for x in xs if x &gt; pivot]))</code></pre>
<pre data-lang="python"><code class="language-python">orders.sort(key=lambda o: (o.date, -o.amount))   # sort by multiple keys: tuple comparison</code></pre>

<h3>Algorithm design techniques</h3>
<table>
<tr><th>Technique</th><th>Idea</th><th>Examples</th></tr>
<tr><td><b>Brute force</b></td><td>Try everything. Always write it first as a correctness reference.</td><td>all pairs, all subsets</td></tr>
<tr><td><b>Divide and conquer</b></td><td>Split into independent subproblems, solve them recursively, combine.</td><td>merge sort, binary search</td></tr>
<tr><td><b>Greedy</b></td><td>Take the locally best choice each step. Fast, but correct only for some problems, so prove it or test it.</td><td>coin change (some coin sets), interval scheduling, Dijkstra</td></tr>
<tr><td><b>Dynamic programming</b></td><td>Overlapping subproblems: solve each once, store it (memoise), reuse.</td><td>Fibonacci, shortest paths, edit distance, knapsack</td></tr>
<tr><td><b>Two pointers / sliding window</b></td><td>Move indices across a sequence instead of nesting loops.</td><td>palindromes, longest substring without repeats</td></tr>
<tr><td><b>Backtracking</b></td><td>Build a solution step by step, undo when stuck.</td><td>sudoku, permutations, N-queens</td></tr>
</table>
<pre data-lang="python"><code class="language-python">from functools import cache
@cache                                 # memoisation: O(2ⁿ) becomes O(n)
def fib(n):
    return n if n &lt; 2 else fib(n - 1) + fib(n - 2)

def fib_iter(n):                       # bottom-up DP: O(n) time, O(1) space
    a, b = 0, 1
    for _ in range(n): a, b = b, a + b
    return a</code></pre>

<div class="callout note"><b class="t">Big-O isn't everything</b><p>Constants matter at small n (insertion sort beats merge sort under about 20 elements, which is why Timsort uses it internally). Memory access patterns matter enormously (<a class="xref" data-old="c22">chapter 22</a>). <b>Measure</b> with a profiler before optimising: <code>python3 -m cProfile -s cumtime app.py</code>, <code>timeit</code>, <code>go test -bench</code>, <code>perf</code>.</p></div>

<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>11.1 <span class="levels">basic</span> Give the Big-O of: (a) summing a list; (b) checking every pair; (c) <code>while n &gt; 1: n //= 2</code>; (d) for each of n items, binary search in a sorted list of m.</summary><div><p>(a) O(n) (b) O(n²) (c) O(log n) (d) O(n log m)</p></div></details>
<details class="ex"><summary>11.2 <span class="levels">basic</span> Write binary search from memory <i>tomorrow</i> without looking. Then write <code>lower_bound(xs, t)</code>: the first index whose value is ≥ t.</summary><div>
<pre data-lang="python"><code class="language-python">def lower_bound(xs, t):
    lo, hi = 0, len(xs)
    while lo &lt; hi:
        mid = (lo + hi) // 2
        if xs[mid] &lt; t: lo = mid + 1
        else:           hi = mid
    return lo            # == bisect.bisect_left(xs, t)</code></pre></div></details>
<details class="ex"><summary>11.3 <span class="levels">think</span> Longest substring without repeating characters ("abcabcbb" → 3). Get it to O(n) with a sliding window.</summary><div>
<pre data-lang="python"><code class="language-python">def longest_unique(s):
    last, start, best = {}, 0, 0
    for i, ch in enumerate(s):
        if ch in last and last[ch] &gt;= start:
            start = last[ch] + 1       # slide the window past the repeat
        last[ch] = i
        best = max(best, i - start + 1)
    return best</code></pre></div></details>
<details class="ex"><summary>11.4 <span class="levels">think</span> Coin change: the minimum number of coins for an amount, with coins [1, 3, 4] and amount 6. Show that greedy fails, then solve it with DP.</summary><div><p>Greedy picks 4+1+1 (3 coins); the optimum is 3+3 (2 coins).</p>
<pre data-lang="python"><code class="language-python">def min_coins(coins, amount):
    INF = float("inf")
    best = [0] + [INF] * amount          # best[a] = min coins to make a
    for a in range(1, amount + 1):
        for c in coins:
            if c &lt;= a: best[a] = min(best[a], best[a - c] + 1)
    return best[amount] if best[amount] != INF else -1</code></pre></div></details>
</div>
`;export{e as default};

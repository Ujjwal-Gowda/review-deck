const e=`<p class="goal">When a problem breaks into smaller versions of itself that overlap, solve each small version once and reuse it. The recipe, with four classic problems worked through.</p>
<h3>Why: naive recursion repeats work</h3>
<div class="diagram">fib(5) calls fib(4) and fib(3); fib(4) calls fib(3) again …   fib(3) is computed twice, fib(2) three times …
Exponential work for a linear number of DISTINCT subproblems. Store each answer once, and it becomes O(n).</div>
<h3>The recipe</h3>
<ol>
<li><b>Define the state</b> in words: "<code>best[a]</code> = the fewest coins that make amount a".</li>
<li><b>Write the recurrence:</b> how a state is built from smaller states.</li>
<li><b>Set the base cases.</b></li>
<li><b>Choose the direction:</b> top-down (recursion + memo cache) or bottom-up (fill a table in order).</li>
<li><b>Recover the answer</b> itself (not just its value), if needed, by remembering the choices.</li>
</ol>
<h3>1. Climbing stairs (1 or 2 steps at a time): the simplest DP</h3>
<pre data-lang="python"><code class="language-python">def ways(n):                  # ways(n) = ways(n-1) + ways(n-2)
    a, b = 1, 1               # ways(0), ways(1)
    for _ in range(n - 1): a, b = b, a + b
    return b</code></pre>
<h3>2. Coin change: fewest coins</h3>
<pre data-lang="python"><code class="language-python">def min_coins(coins, amount):
    INF = float("inf")
    best = [0] + [INF] * amount                 # best[a] = fewest coins to make a
    for a in range(1, amount + 1):
        for c in coins:
            if c &lt;= a and best[a - c] + 1 &lt; best[a]:
                best[a] = best[a - c] + 1        # use coin c, plus the best way to make the rest
    return best[amount] if best[amount] &lt; INF else -1</code></pre>
<div class="diagram">coins [1,3,4], amount 6:
a:     0  1  2  3  4  5  6
best:  0  1  2  1  1  2  2      best[6] = best[3] + 1 = 2  (3+3)   ← greedy (4+1+1) would give 3</div>
<h3>3. 0/1 knapsack: best value within a weight limit</h3>
<pre data-lang="python"><code class="language-python">def knapsack(items, cap):                        # items: (weight, value); each used at most once
    dp = [0] * (cap + 1)                         # dp[w] = best value with capacity w
    for wt, val in items:
        for w in range(cap, wt - 1, -1):         # go BACKWARDS so each item is used once
            dp[w] = max(dp[w], dp[w - wt] + val)
    return dp[cap]</code></pre>
<h3>4. Edit distance: how different are two words (for typo-tolerant search)?</h3>
<pre data-lang="python"><code class="language-python">def edit_distance(a, b):
    m, n = len(a), len(b)
    d = [[0] * (n + 1) for _ in range(m + 1)]    # d[i][j] = edits to turn a[:i] into b[:j]
    for i in range(m + 1): d[i][0] = i
    for j in range(n + 1): d[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            same = a[i - 1] == b[j - 1]
            d[i][j] = min(d[i - 1][j] + 1,               # delete
                          d[i][j - 1] + 1,               # insert
                          d[i - 1][j - 1] + (0 if same else 1))   # replace (or keep)
    return d[m][n]
edit_distance("paner", "paneer")   # 1</code></pre>
<h3>Top-down in one line (Python)</h3>
<pre data-lang="python"><code class="language-python">from functools import cache
@cache
def ways(n): return 1 if n &lt;= 1 else ways(n - 1) + ways(n - 2)</code></pre>
<p><b>Spotting DP:</b> "count the ways", "min/max cost", "is it possible", with choices at each step, where the same sub-question recurs. DP is used in route planning, diff tools (<code>git diff</code> uses a longest-common-subsequence variant), spell-check, and resource allocation.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Longest common subsequence of two strings (e.g. "ABCBDAB" and "BDCABA" gives length 4). Then recover the actual subsequence from the table.</summary><div><p>Recurrence: <code>L[i][j] = L[i-1][j-1] + 1</code> if the characters match, else <code>max(L[i-1][j], L[i][j-1])</code>. To recover it, walk back from the bottom-right: on a match, take the character and move diagonally; otherwise move toward the larger neighbour.</p></div></details>
</div>
`;export{e as default};

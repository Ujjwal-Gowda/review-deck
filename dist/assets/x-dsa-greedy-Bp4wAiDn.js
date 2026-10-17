const e=`<p class="goal">Make the locally best choice at each step and never look back. It's fast and simple, but only correct for certain problems.</p>
<h3>When greedy works: interval scheduling</h3>
<p>Fit as many delivery slots as possible into one rider's day, with no overlaps. The greedy rule is: <b>always take the slot that ends earliest</b> among those still possible.</p>
<pre data-lang="python"><code class="language-python">def max_slots(slots):                      # slots: (start, end)
    chosen, free_at = [], float("-inf")
    for s, e in sorted(slots, key=lambda x: x[1]):     # sort by END time
        if s &gt;= free_at:
            chosen.append((s, e)); free_at = e
    return chosen</code></pre>
<p><b>Why it's safe:</b> finishing earliest leaves the most room for everything after. You can argue that swapping any optimal solution's first slot for the earliest-ending one never makes it worse (an "exchange argument").</p>
<h3>When greedy fails</h3>
<div class="diagram">coins [1, 3, 4], make 6:
greedy (take the biggest coin that fits):  4 + 1 + 1 = 3 coins
optimal:                                   3 + 3     = 2 coins      → needs DP (see the Dynamic Programming chapter)
(With Indian rupee denominations 1, 2, 5, 10, 20 … greedy DOES happen to work.)</div>
<h3>Classic greedy algorithms</h3>
<table>
<tr><th>Problem</th><th>Greedy rule</th></tr>
<tr><td>interval scheduling</td><td>take the earliest finishing time</td></tr>
<tr><td>fractional knapsack</td><td>take the best value per kg first (fine for items you can split, like loose rice)</td></tr>
<tr><td>Huffman coding (compression)</td><td>repeatedly merge the two least frequent symbols</td></tr>
<tr><td>Dijkstra, Prim, Kruskal</td><td>take the closest vertex / cheapest safe edge next</td></tr>
<tr><td>minimum platforms or rooms</td><td>sort the events and sweep</td></tr>
</table>
<p><b>How to decide:</b> try to break the greedy rule with a small counter-example (like the coins above). If you can't, and there's an exchange argument, greedy is probably right. Otherwise reach for DP.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">think</span> Rooms problem: given meeting intervals, what&#39;s the minimum number of rooms needed? Design a greedy or sweep solution.</summary><div><p>Sort all the start and end events (ends before starts when times are equal). Sweep: +1 on each start, −1 on each end, and track the maximum. Or: sort by start and keep a min-heap of end times, reusing a room when its earliest end is at or before the next start.</p></div></details>
</div>
`;export{e as default};

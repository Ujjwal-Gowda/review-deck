const e=`<p class="goal">Always get the smallest (or largest) item instantly. It's the engine behind priority queues, schedulers, top-K and Dijkstra.</p>
<h3>The shape and the rule</h3>
<div class="diagram">min-heap: every parent ≤ its children (siblings aren't ordered among themselves)

              1
           /     \\
          3       2
         / \\     / \\
        7   4   5   9

stored as an ARRAY, level by level:   [1, 3, 2, 7, 4, 5, 9]
                                       0  1  2  3  4  5  6
children of i: 2i+1 and 2i+2          parent of i: (i−1)//2       ← no pointers needed</div>
<h3>Push: add at the end, then "sift up"</h3>
<div class="diagram">push 0:  [1,3,2,7,4,5,9,0]   0 is at index 7; parent index 3 holds 7 → swap
         [1,3,2,0,4,5,9,7]   parent index 1 holds 3 → swap
         [1,0,2,3,4,5,9,7]   parent index 0 holds 1 → swap
         [0,1,2,3,4,5,9,7]   at the root: done.   At most log n swaps</div>
<h3>Pop: take the root, move the last item up, then "sift down"</h3>
<pre data-lang="python"><code class="language-python">class MinHeap:
    def __init__(self): self.a = []
    def push(self, x):
        a = self.a; a.append(x); i = len(a) - 1
        while i &gt; 0 and a[(i - 1) // 2] &gt; a[i]:              # sift up
            p = (i - 1) // 2; a[i], a[p] = a[p], a[i]; i = p
    def pop(self):
        a = self.a; top = a[0]; last = a.pop()
        if a:
            a[0] = last; i = 0
            while True:                                       # sift down: swap with the smaller child
                l, r, m = 2 * i + 1, 2 * i + 2, i
                if l &lt; len(a) and a[l] &lt; a[m]: m = l
                if r &lt; len(a) and a[r] &lt; a[m]: m = r
                if m == i: break
                a[i], a[m] = a[m], a[i]; i = m
        return top
    def peek(self): return self.a[0]</code></pre>
<table>
<tr><th>Operation</th><th>Cost</th></tr>
<tr><td>peek min</td><td>O(1)</td></tr>
<tr><td>push / pop</td><td>O(log n)</td></tr>
<tr><td>build a heap from n items (heapify)</td><td>O(n), surprisingly (sift down from the middle backwards)</td></tr>
<tr><td>search for an arbitrary item</td><td>O(n): a heap is <i>not</i> sorted</td></tr>
</table>
<h3>Patterns</h3>
<pre data-lang="python"><code class="language-python">import heapq
tasks = []
heapq.heappush(tasks, (deadline, order_id))          # priority queue: (priority, item) tuples
deadline, oid = heapq.heappop(tasks)                 # the earliest deadline first

def top_k(nums, k):                                  # K largest in O(n log k): keep a MIN-heap of size k
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) &gt; k: heapq.heappop(h)              # evict the smallest; the k largest survive
    return sorted(h, reverse=True)
# max-heap in Python: push -x.   Go: container/heap.   Rust: BinaryHeap (a max-heap; Reverse for min).   JS: none built in.</code></pre>
<p>Where they're used: OS and job schedulers, Dijkstra's shortest path, merging K sorted files (as in database sorts), "top 10 selling products", event simulations, timers.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Merge K sorted lists into one sorted list using a heap. What&#39;s the complexity for N total items?</summary><div><p>Push <code>(first value, list index, element index)</code> for each list. Pop the smallest, append it to the output, and push the next element from the same list. Each of the N items is pushed and popped once on a heap of size K, so O(N log K).</p></div></details>
</div>
`;export{e as default};

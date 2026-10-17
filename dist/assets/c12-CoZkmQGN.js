const e=`<p class="goal">How the containers you use every day are built, and the handful of structures that solve most problems.</p>

<h3>Arrays vs linked lists</h3>
<div class="diagram">  ARRAY: one contiguous block                 LINKED LIST: nodes scattered in memory
  ┌───┬───┬───┬───┬───┐                        ┌───┬──┐   ┌───┬──┐   ┌───┬──┐
  │ 3 │ 8 │ 1 │ 9 │ 4 │                        │ 3 │ ─┼──►│ 8 │ ─┼──►│ 1 │ ╳│
  └───┴───┴───┴───┴───┘                        └───┴──┘   └───┴──┘   └───┴──┘
  address of item i = base + i × size           to reach item i, follow i pointers</div>
<table>
<tr><th>Operation</th><th>Dynamic array</th><th>Linked list</th></tr>
<tr><td>Access by index</td><td>O(1)</td><td>O(n)</td></tr>
<tr><td>Append at end</td><td>O(1) amortised</td><td>O(1) with a tail pointer</td></tr>
<tr><td>Insert/delete at front</td><td>O(n)</td><td>O(1)</td></tr>
<tr><td>Insert in the middle (having found the spot)</td><td>O(n)</td><td>O(1)</td></tr>
<tr><td>Cache friendliness</td><td>excellent</td><td>poor (pointer chasing)</td></tr>
</table>
<p>In practice arrays win almost always, because CPUs are so much faster at contiguous memory (<a class="xref" data-old="c22">chapter 22</a>). Linked lists matter as a concept (and inside other structures like LRU caches), rarely as a direct choice.</p>
<pre data-lang="python"><code class="language-python">class Node:
    def __init__(self, val, next=None):
        self.val, self.next = val, next

def reverse(head):                    # the classic interview exercise: pointer manipulation
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev</code></pre>

<h3>Stacks and queues</h3>
<ul>
<li><b>Stack</b> (LIFO, last in first out): push and pop at the top. Used for undo, the call stack, matching brackets, depth-first search, and parsing expressions. In Python, a <code>list</code> with <code>append</code>/<code>pop</code>.</li>
<li><b>Queue</b> (FIFO, first in first out): add at the back, remove from the front. Used for task queues, breadth-first search, and buffering. In Python, <code>collections.deque</code> (<code>popleft</code> is O(1); <code>list.pop(0)</code> is O(n)).</li>
</ul>
<pre data-lang="python"><code class="language-python">def balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{": stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]: return False
    return not stack

balanced("{[()()]}")   # True
balanced("(]")         # False</code></pre>

<h3>Hash tables: how dicts and sets work</h3>
<ol>
<li>A <b>hash function</b> turns a key into an integer: <code>hash("milk")</code> → a big number. The same key always gives the same hash.</li>
<li>Take it modulo the table size to get a <b>bucket</b> index: an O(1) jump straight to the right spot.</li>
<li>Two keys landing in the same bucket is a <b>collision</b>. It's resolved by <b>chaining</b> (a small list per bucket) or <b>open addressing</b> (probe the next free slot).</li>
<li>When the table gets too full (the <b>load factor</b>, e.g. above 2/3), it resizes to about twice the size and re-inserts everything. That's amortised O(1), just like list append.</li>
</ol>
<div class="diagram">  key "milk" ─hash→ 83412…  % 8 = 3        buckets:  0 [ ]  1 [ ]  2 [("curd",5)]
  key "curd" ─hash→ 19226…  % 8 = 2                  3 [("milk",12)]  4 [ ]  …</div>
<p>This is why keys must be immutable: if a key changed after insertion, its hash would change and it would sit in the wrong bucket forever. It also explains why hash tables have a worst case of O(n): if everything collides, a lookup degrades to scanning a list. Attackers have exploited this ("hash flooding"), which is why languages randomise their hash seeds.</p>

<h3>Trees</h3>
<p>A <b>tree</b> is nodes with children and no cycles, starting from one <b>root</b>. File systems, the HTML DOM, JSON, org charts and compiler syntax trees are all trees.</p>
<p>A <b>binary search tree (BST)</b> keeps everything in the left subtree smaller than the node and everything in the right subtree larger. That gives O(log n) search, insert and delete <i>if balanced</i>, and O(n) if it degenerates into a line (e.g. inserting already-sorted data). Self-balancing variants (red-black trees, AVL trees, and the <b>B-trees</b> used in databases and filesystems) guarantee O(log n). Unlike hash tables, BSTs keep keys <b>sorted</b>, so range queries ("all orders between 10:00 and 11:00") are efficient.</p>
<pre data-lang="python"><code class="language-python">class Tree:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def inorder(t):                 # left, node, right: visits a BST in SORTED order
    if t:
        yield from inorder(t.left)
        yield t.val
        yield from inorder(t.right)

def height(t):
    return 0 if t is None else 1 + max(height(t.left), height(t.right))</code></pre>

<h3>Heaps (priority queues)</h3>
<p>A <b>heap</b> always gives you the smallest (or largest) item in O(1), with O(log n) push and pop. It's stored cleverly in a plain array (the children of index i sit at 2i+1 and 2i+2). Used for task schedulers, "top K" problems, merging sorted streams, and Dijkstra's shortest path.</p>
<pre data-lang="python"><code class="language-python">import heapq
tasks = []
heapq.heappush(tasks, (2, "restock"))
heapq.heappush(tasks, (1, "refund"))      # (priority, item)
heapq.heappop(tasks)                      # (1, 'refund'): smallest first
heapq.nlargest(3, sales, key=lambda s: s.amount)</code></pre>

<h3>Graphs</h3>
<p>A <b>graph</b> is nodes (vertices) joined by edges. Edges may be directed or undirected, weighted or unweighted. It's the most general structure: roads, social networks, dependencies between packages, delivery routes, web links.</p>
<pre data-lang="python"><code class="language-python">graph = {                      # adjacency list: the usual representation
    "store": ["hub", "cafe"],
    "hub":   ["zone1", "zone2"],
    "cafe":  ["zone2"],
    "zone1": [], "zone2": [],
}
from collections import deque
def bfs(graph, start):         # breadth-first: level by level; finds the SHORTEST path in unweighted graphs
    dist = {start: 0}
    q = deque([start])
    while q:
        node = q.popleft()
        for nxt in graph[node]:
            if nxt not in dist:
                dist[nxt] = dist[node] + 1
                q.append(nxt)
    return dist

def dfs(graph, node, seen=None):   # depth-first: go deep, then backtrack. Used for cycles, topological order
    seen = seen if seen is not None else set()
    seen.add(node)
    for nxt in graph[node]:
        if nxt not in seen:
            dfs(graph, nxt, seen)
    return seen</code></pre>
<p>Know these by name: <b>BFS</b> (shortest path, unweighted), <b>Dijkstra</b> (shortest path, non-negative weights, uses a heap), <b>topological sort</b> (ordering tasks with dependencies, like build systems and package managers), <b>union-find</b> (connected components).</p>

<div class="callout key"><b class="t">Cheat sheet: pick by the question you ask most</b>
<table>
<tr><th>Frequent operation</th><th>Structure</th></tr>
<tr><td>by position / iterate in order</td><td>array / list</td></tr>
<tr><td>by key, exact match</td><td>hash map</td></tr>
<tr><td>by key, sorted order or ranges</td><td>balanced tree / B-tree / sorted array + binary search</td></tr>
<tr><td>membership</td><td>hash set</td></tr>
<tr><td>always the min/max next</td><td>heap</td></tr>
<tr><td>undo, nesting, backtracking</td><td>stack</td></tr>
<tr><td>process in arrival order</td><td>queue / deque</td></tr>
<tr><td>relationships between things</td><td>graph</td></tr>
</table></div>

<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>12.1 <span class="levels">basic</span> Implement a <code>Stack</code> class with push, pop, peek and is_empty. Then implement a <code>Queue</code> using <b>two stacks</b>.</summary><div>
<pre data-lang="python"><code class="language-python">class Queue:
    def __init__(self): self.inbox, self.outbox = [], []
    def push(self, x): self.inbox.append(x)
    def pop(self):
        if not self.outbox:
            while self.inbox: self.outbox.append(self.inbox.pop())
        return self.outbox.pop()      # amortised O(1)</code></pre></div></details>
<details class="ex"><summary>12.2 <span class="levels">think</span> Build your own hash map with chaining: <code>put</code>, <code>get</code>, and resizing at load factor 0.75. Use <code>hash(key) % capacity</code>.</summary><div>
<pre data-lang="python"><code class="language-python">class HashMap:
    def __init__(self, cap=8):
        self.buckets = [[] for _ in range(cap)]; self.size = 0
    def _b(self, k): return self.buckets[hash(k) % len(self.buckets)]
    def put(self, k, v):
        b = self._b(k)
        for i, (kk, _) in enumerate(b):
            if kk == k: b[i] = (k, v); return
        b.append((k, v)); self.size += 1
        if self.size / len(self.buckets) &gt; 0.75: self._grow()
    def get(self, k):
        for kk, v in self._b(k):
            if kk == k: return v
        raise KeyError(k)
    def _grow(self):
        items = [kv for b in self.buckets for kv in b]
        self.buckets = [[] for _ in range(len(self.buckets) * 2)]; self.size = 0
        for k, v in items: self.put(k, v)</code></pre></div></details>
<details class="ex"><summary>12.3 <span class="levels">think</span> Given tasks and dependencies (e.g. "pack" depends on "pick", "deliver" depends on "pack"), output a valid order, or report a cycle. (Topological sort, Kahn's algorithm.)</summary><div>
<pre data-lang="python"><code class="language-python">from collections import deque
def topo(tasks, deps):                 # deps: list of (before, after)
    indeg = {t: 0 for t in tasks}; out = {t: [] for t in tasks}
    for a, b in deps: out[a].append(b); indeg[b] += 1
    q = deque(t for t in tasks if indeg[t] == 0); order = []
    while q:
        t = q.popleft(); order.append(t)
        for n in out[t]:
            indeg[n] -= 1
            if indeg[n] == 0: q.append(n)
    if len(order) != len(tasks): raise ValueError("cycle!")
    return order</code></pre></div></details>
</div>
`;export{e as default};

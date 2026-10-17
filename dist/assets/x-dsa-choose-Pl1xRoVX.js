const t=`<p class="goal">A one-page decision guide: what you need to do most often → which structure → what it's called in each of your languages.</p>
<table>
<tr><th>Mostly you need to…</th><th>Use</th><th>Python</th><th>TS</th><th>Go</th><th>Rust</th><th>C</th></tr>
<tr><td>keep items in order, index by position, append</td><td>dynamic array</td><td><code>list</code></td><td><code>Array</code></td><td>slice</td><td><code>Vec</code></td><td>array + realloc</td></tr>
<tr><td>look up by key, exact match</td><td>hash map</td><td><code>dict</code></td><td><code>Map</code></td><td><code>map</code></td><td><code>HashMap</code></td><td>write one</td></tr>
<tr><td>"have I seen this?", deduplicate</td><td>hash set</td><td><code>set</code></td><td><code>Set</code></td><td><code>map[T]struct{}</code></td><td><code>HashSet</code></td><td>write one</td></tr>
<tr><td>keys in sorted order, ranges, floor/ceiling</td><td>balanced BST / B-tree</td><td><code>sortedcontainers</code>, bisect</td><td>library</td><td>library / sorted slice</td><td><code>BTreeMap</code></td><td>write one</td></tr>
<tr><td>last in, first out</td><td>stack</td><td><code>list</code></td><td><code>Array</code></td><td>slice</td><td><code>Vec</code></td><td>array + top</td></tr>
<tr><td>first in, first out; both ends</td><td>queue / deque</td><td><code>deque</code></td><td>index-based queue</td><td>slice / channel</td><td><code>VecDeque</code></td><td>ring buffer</td></tr>
<tr><td>always the smallest / largest next</td><td>heap</td><td><code>heapq</code></td><td>library</td><td><code>container/heap</code></td><td><code>BinaryHeap</code></td><td>write one</td></tr>
<tr><td>prefix search / autocomplete</td><td>trie</td><td>dict of dicts</td><td>Map of Maps</td><td>map of maps</td><td>HashMap nodes</td><td>struct array</td></tr>
<tr><td>relationships, routes, dependencies</td><td>graph (adjacency list)</td><td>dict → list</td><td>Map → array</td><td>map → slice</td><td>HashMap → Vec / petgraph</td><td>arrays</td></tr>
<tr><td>groups that merge</td><td>union-find</td><td colspan="5">implement (about 15 lines in any language)</td></tr>
<tr><td>insert/remove in the middle while iterating, O(1)</td><td>linked list</td><td><code>deque</code> / own nodes</td><td>own nodes</td><td><code>container/list</code></td><td><code>LinkedList</code> (rarely the best)</td><td>own nodes</td></tr>
<tr><td>least-recently-used cache</td><td>hash map + doubly linked list</td><td><code>OrderedDict</code> / <code>functools.lru_cache</code></td><td><code>Map</code> (keeps insertion order)</td><td>map + <code>container/list</code></td><td><code>lru</code> crate</td><td>write one</td></tr>
</table>
<h3>A decision flow</h3>
<div class="diagram">Do you look things up by a KEY?
 ├─ yes → need sorted order or ranges?  ── yes → BTreeMap / sorted structure
 │                                      └─ no  → hash map (hash set if there's no value)
 └─ no  → only touch the ENDS?
          ├─ one end, last-in first-out   → stack
          ├─ in at one end, out the other → queue / deque
          ├─ always the min or max        → heap
          └─ by position / iterate        → dynamic array (the default for almost everything)
Connections between things? → graph.   Prefixes? → trie.   Merging groups? → union-find.</div>
<p>Default to the dynamic array and the hash map: together they cover most real code. Reach for the others when a specific operation dominates and measurements show the simple choice is too slow.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">think</span> FreshOn needs: (1) product lookup by barcode, (2) the rider queue in arrival order, (3) the next delivery with the earliest deadline, (4) product search as you type, (5) delivery zones connected by roads, (6) the last 50 actions for undo. Pick a structure for each.</summary><div><p>(1) Hash map. (2) Queue/deque. (3) Min-heap keyed by deadline. (4) Trie (or a sorted list + binary search on the prefix). (5) Weighted graph with Dijkstra. (6) Stack, or a bounded deque(maxlen=50).</p></div></details>
</div>
`;export{t as default};

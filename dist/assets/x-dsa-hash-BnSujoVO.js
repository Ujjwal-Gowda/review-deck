const e=`<p class="goal">How dictionaries and sets find any key in about one step, and what makes them slow when they're misused.</p>
<h3>The idea</h3>
<p>Picture a cabinet with 8 drawers. To store "paneer", compute a number from the word (its <b>hash</b>), take it modulo 8, and put it in that drawer. To find it later, compute the same number and open the same drawer. You don't scan anything.</p>
<div class="diagram">hash("paneer") = 9_214_573  →  9_214_573 % 8 = 5   →  drawer 5
hash("milk")   = 3_301_020  →  % 8 = 4                →  drawer 4
buckets:  0[ ] 1[ ] 2[ ] 3[ ] 4[milk:12] 5[paneer:3] 6[ ] 7[ ]</div>
<h3>Collisions: two keys, same drawer</h3>
<table>
<tr><th>Strategy</th><th>How</th><th>Used by</th></tr>
<tr><td><b>Separate chaining</b></td><td>each bucket holds a small list; append colliding entries to it</td><td>Java HashMap, Go maps (buckets of 8)</td></tr>
<tr><td><b>Open addressing</b></td><td>if the bucket is taken, probe the next one (linear, quadratic, or a second hash)</td><td>Python dict, Rust HashMap (SwissTable)</td></tr>
</table>
<div class="diagram">chaining:          bucket 5 → [paneer:3] → [ghee:7]      (a linked list, from the Linked Lists chapter)
open addressing:   paneer → 5 (taken by ghee) → try 6 → free → store at 6</div>
<h3>Load factor and resizing</h3>
<p><b>Load factor</b> = items ÷ buckets. As it rises, collisions multiply and lookups slow down. When it passes a threshold (about 0.75, or 2/3 in Python), the table allocates about twice as many buckets and <b>re-inserts every item</b>, because each key's drawer changes with the new modulus. Like dynamic arrays, that keeps inserts amortised O(1).</p>
<h3>Build one (chaining)</h3>
<pre data-lang="python"><code class="language-python">class HashMap:
    def __init__(self, cap=8):
        self.buckets = [[] for _ in range(cap)]; self.n = 0
    def _bucket(self, key): return self.buckets[hash(key) % len(self.buckets)]
    def put(self, key, value):
        b = self._bucket(key)
        for i, (k, _) in enumerate(b):
            if k == key: b[i] = (key, value); return          # update an existing key
        b.append((key, value)); self.n += 1
        if self.n / len(self.buckets) &gt; 0.75: self._resize(2 * len(self.buckets))
    def get(self, key, default=None):
        for k, v in self._bucket(key):
            if k == key: return v
        return default
    def _resize(self, cap):
        old = [kv for b in self.buckets for kv in b]
        self.buckets = [[] for _ in range(cap)]; self.n = 0
        for k, v in old: self.put(k, v)</code></pre>
<h3>What makes a good hash function</h3>
<ul>
<li><b>Deterministic:</b> the same key always gives the same hash (within a run).</li>
<li><b>Spreads keys evenly</b> over the buckets: similar keys should give very different hashes.</li>
<li><b>Fast.</b></li>
<li><b>Randomised seed</b> (Python, Go, Rust do this): stops attackers sending thousands of keys that all collide, which would degrade every lookup to O(n) ("hash flooding").</li>
</ul>
<h3>Rules that follow from how it works</h3>
<ul>
<li><b>Keys must not change</b> after insertion (their hash would change, and the item would be lost in the wrong drawer). That's why Python forbids lists as dict keys.</li>
<li><b>Equal keys must have equal hashes.</b> If you define equality for your own type, define the hash to match (<code>__eq__</code>/<code>__hash__</code>, Rust's derive of <code>PartialEq</code> + <code>Hash</code>).</li>
<li><b>No order:</b> for sorted keys or ranges, use a tree (<a class="xref" data-old="x-dsa-bst">BST</a>).</li>
</ul>
<p>Where they're used: every dictionary and set, caches, database hash indexes and hash joins, deduplication, counting, symbol tables in compilers, and routing tables.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">think</span> Your HashMap has 8 buckets and keys 0, 8, 16, 24… (multiples of 8) with <code>hash(k) = k</code>. What goes wrong, and how do real implementations avoid it?</summary><div><p>Every key lands in bucket 0 (k % 8 = 0), so every lookup scans one long chain: O(n). Real implementations scramble the bits of the hash (a mixing step), use prime or power-of-two capacities with good mixing, and randomise the seed.</p></div></details>
</div>
`;export{e as default};

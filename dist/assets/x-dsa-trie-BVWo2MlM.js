const e=`<p class="goal">A tree of characters, where every path spells a prefix. Autocomplete, spell-checkers and routers use it.</p>
<div class="diagram">insert "pan", "paneer", "pav", "milk":
            (root)
           /      \\
          p        m
          |        |
          a        i
        /   \\      |
       n*    v*    l
       |           |
       e           k*
       |                   * = a word ends here
       e
       |
       r*
"autocomplete 'pa'": walk p → a, then collect every word below: pan, paneer, pav</div>
<pre data-lang="python"><code class="language-python">class TrieNode:
    def __init__(self):
        self.children = {}            # char → TrieNode
        self.is_word = False

class Trie:
    def __init__(self): self.root = TrieNode()
    def insert(self, word):
        n = self.root
        for ch in word:
            n = n.children.setdefault(ch, TrieNode())
        n.is_word = True
    def _walk(self, prefix):
        n = self.root
        for ch in prefix:
            n = n.children.get(ch)
            if n is None: return None
        return n
    def contains(self, word):
        n = self._walk(word); return bool(n and n.is_word)
    def complete(self, prefix, limit=10):
        n, out = self._walk(prefix), []
        def dfs(node, path):
            if len(out) &gt;= limit: return
            if node.is_word: out.append(prefix + path)
            for ch in sorted(node.children): dfs(node.children[ch], path + ch)
        if n: dfs(n, "")
        return out</code></pre>
<table>
<tr><th>Operation</th><th>Trie</th><th>Hash set</th><th>Sorted list + binary search</th></tr>
<tr><td>exact lookup</td><td>O(length of the word)</td><td>O(length) average</td><td>O(length × log n)</td></tr>
<tr><td>all words with a prefix</td><td><b>O(prefix + results)</b></td><td>O(n): scan everything</td><td>O(log n + results)</td></tr>
<tr><td>memory</td><td>high (a node per character)</td><td>low</td><td>lowest</td></tr>
</table>
<p>Variants: <b>radix / compressed tries</b> merge single-child chains into one edge ("paneer" becomes one edge), which saves memory. They're used in HTTP routers (e.g. Go's httprouter), IP routing tables (longest-prefix match), and search suggestions.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Build a trie of 1,000 product names and an autocomplete function. Then compare its speed with <code>[w for w in words if w.startswith(p)]</code>.</summary><div><p>For small n, the list comprehension is often faster (simple and cache-friendly). The trie wins as n grows into the hundreds of thousands and prefixes are short. Measure it rather than assuming.</p></div></details>
</div>
`;export{e as default};

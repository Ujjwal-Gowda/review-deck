const e=`<p class="goal">Lists, maps and sets in each language: what they're called, how they behave, and the everyday operations you'll use.</p>
<table>
<tr><th></th><th>Growable list</th><th>Key → value</th><th>Set</th><th>Fixed array</th></tr>
<tr><td>Python</td><td><code>list</code></td><td><code>dict</code> (insertion-ordered)</td><td><code>set</code></td><td><code>tuple</code> (immutable)</td></tr>
<tr><td>TS</td><td><code>T[]</code></td><td><code>Map&lt;K,V&gt;</code> or a plain object</td><td><code>Set&lt;T&gt;</code></td><td>tuple type <code>[a, b]</code></td></tr>
<tr><td>Go</td><td>slice <code>[]T</code></td><td><code>map[K]V</code> (random iteration order!)</td><td><code>map[T]struct{}</code></td><td><code>[N]T</code> (a value type)</td></tr>
<tr><td>Rust</td><td><code>Vec&lt;T&gt;</code></td><td><code>HashMap&lt;K,V&gt;</code> / <code>BTreeMap</code> (sorted)</td><td><code>HashSet&lt;T&gt;</code> / <code>BTreeSet</code></td><td><code>[T; N]</code></td></tr>
<tr><td>C</td><td>write your own (<code>malloc</code> + <code>realloc</code>)</td><td>write your own / a library</td><td>write your own</td><td><code>T a[N]</code></td></tr>
</table>
<h3>Everyday operations</h3>
<div class="cheat">
<div><h4>Append, length, index</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  xs.append(4); len(xs); xs[0]; xs[-1]
TS  xs.push(4); xs.length; xs[0]; xs.at(-1)
Go  xs = append(xs, 4); len(xs); xs[0]; xs[len(xs)-1]
Rs  xs.push(4); xs.len(); xs[0]; xs.last()
C   /* manage len + cap yourself */ a[0]</code></pre></div>
<div><h4>Slice / sub-range</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  xs[1:3]          # a copy
TS  xs.slice(1, 3)   // a copy
Go  xs[1:3]          // a VIEW sharing memory!
Rs  &amp;xs[1..3]        // a borrowed view (&amp;[T])
C   a + 1            /* pointer + your own length */</code></pre></div>
<div><h4>Map insert / get / check</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  d[k] = v; d.get(k, 0); k in d
TS  m.set(k, v); m.get(k) ?? 0; m.has(k)
Go  m[k] = v; v, ok := m[k]      // ok=false if missing
Rs  m.insert(k, v); m.get(&amp;k).copied().unwrap_or(0)
    *m.entry(k).or_insert(0) += 1   // counting idiom</code></pre></div>
<div><h4>Transform + filter</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  [x*2 for x in xs if x &gt; 0]
TS  xs.filter(x =&gt; x &gt; 0).map(x =&gt; x*2)
Go  for _, x := range xs { if x &gt; 0 { out = append(out, x*2) } }
Rs  xs.iter().filter(|&amp;&amp;x| x &gt; 0).map(|x| x*2).collect::&lt;Vec&lt;_&gt;&gt;()</code></pre></div>
<div><h4>Sort</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  xs.sort(); sorted(xs, key=f)
TS  xs.sort((a,b) =&gt; a-b)   // default sorts as STRINGS!
Go  slices.Sort(xs); slices.SortFunc(xs, cmpFn)
Rs  xs.sort(); xs.sort_by_key(|o| o.total)
C   qsort(a, n, sizeof a[0], cmp)</code></pre></div>
<div><h4>Iterate a map</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  for k, v in d.items():
TS  for (const [k, v] of m)
Go  for k, v := range m {}   // order random each run
Rs  for (k, v) in &amp;m {}      // HashMap order unspecified</code></pre></div>
</div>
<h3>Traps when switching</h3>
<ul>
<li><b>Go slices share backing arrays:</b> <code>b := a[:2]; b = append(b, 9)</code> can overwrite <code>a[2]</code>. Copy with <code>slices.Clone</code>.</li>
<li><b>JS <code>sort()</code> without a comparator sorts numbers as strings</b> (<code>[10, 9, 1].sort()</code> gives <code>[1, 10, 9]</code>).</li>
<li><b>Python's <code>a = b</code></b> shares the list; use <code>b.copy()</code> or <code>list(b)</code>. Go and Rust arrays (not slices or Vecs) are copied on assignment.</li>
<li><b>Map ordering:</b> Python dicts and JS Maps keep insertion order; Go randomises it deliberately; Rust's HashMap is unspecified (use BTreeMap for sorted order).</li>
<li><b>Out-of-range indexing:</b> Python raises IndexError, JS returns <code>undefined</code>, Go and Rust panic, C reads garbage silently.</li>
</ul>
<p>How these structures work inside is in the <a class="xref" data-old="x-dsa-intro">Data Structures &amp; Algorithms</a> part.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Word frequency in all five languages: read a text, count words case-insensitively, print the top 5. Use each language&#39;s idiomatic map.</summary><div><p>Python: <code>Counter(text.lower().split()).most_common(5)</code>. TS: a Map, then sort its entries. Go: <code>map[string]int</code>, collected into a slice and sorted with <code>slices.SortFunc</code>. Rust: <code>HashMap</code> with the entry API, collected into a Vec and sorted with <code>sort_by</code>. C: this is where you feel the missing hash map, so use a sorted array plus binary search, or write a small hash table.</p></div></details>
</div>
`;export{e as default};

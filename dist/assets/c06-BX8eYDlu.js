const e=`<p class="goal">Holding many values, and picking the right container.</p>

<h3>The four shapes of data</h3>
<table>
<tr><th>Shape</th><th>Idea</th><th>Python</th><th>JS</th><th>Go</th><th>Rust</th><th>C</th></tr>
<tr><td><b>Sequence</b></td><td>ordered, indexed by position 0..n-1</td><td><code>list</code></td><td><code>Array</code></td><td>slice <code>[]T</code></td><td><code>Vec&lt;T&gt;</code></td><td>array <code>T[]</code></td></tr>
<tr><td><b>Record / tuple</b></td><td>fixed group of fields</td><td><code>tuple</code>, <code>dataclass</code></td><td>object, array</td><td><code>struct</code></td><td>tuple, <code>struct</code></td><td><code>struct</code></td></tr>
<tr><td><b>Map / dictionary</b></td><td>key → value lookup</td><td><code>dict</code></td><td><code>Map</code>, object</td><td><code>map[K]V</code></td><td><code>HashMap</code></td><td>(none built in)</td></tr>
<tr><td><b>Set</b></td><td>unique items, fast membership</td><td><code>set</code></td><td><code>Set</code></td><td><code>map[K]struct{}</code></td><td><code>HashSet</code></td><td>(none built in)</td></tr>
</table>

<h3>Sequences (lists / arrays)</h3>
<pre data-lang="python"><code class="language-python">xs = [10, 20, 30, 40, 50]
xs[0]        # 10   first
xs[-1]       # 50   last (negative index counts from the end: Python-specific)
xs[1:4]      # [20, 30, 40]   slice [start, end): a NEW list
xs[::-1]     # reversed copy
len(xs)      # 5
xs.append(60)          # add to end: fast
xs.insert(0, 5)        # add to front: SLOW for big lists (everything shifts)
xs.pop()               # remove last: fast
30 in xs               # membership: scans the whole list (slow for big lists)
xs[10]                 # IndexError: out of range</code></pre>
<p><b>Static arrays vs dynamic arrays.</b> In C, an array has a fixed size set when it's created, and C does <b>not</b> check bounds: <code>a[10]</code> on a 5-element array reads whatever memory happens to be there. That is the root of many security vulnerabilities (buffer overflows). A <b>dynamic array</b> (Python list, Go slice, Rust <code>Vec</code>, C++ <code>vector</code>) keeps a fixed block with spare <b>capacity</b>. When it fills up, it allocates a bigger block (usually 1.5–2×) and copies everything across. That's why <code>append</code> is fast "on average" (amortised O(1), <a class="xref" data-old="c11">chapter 11</a>).</p>
<pre data-lang="go"><code class="language-go">s := make([]int, 0, 4)   // length 0, capacity 4
s = append(s, 1, 2, 3, 4, 5)   // exceeds capacity → new backing array allocated
fmt.Println(len(s), cap(s))    // 5 8</code></pre>

<h3>Tuples and records</h3>
<p>A tuple is a fixed-size, usually <b>immutable</b> group: <code>point = (3, 4)</code>. Use a list for "many of the same kind of thing" and a tuple or record for "one thing with several parts". <b>Unpacking</b> pulls the parts out:</p>
<pre data-lang="python"><code class="language-python">x, y = point
first, *rest = [1, 2, 3, 4]        # first=1, rest=[2,3,4]
a, b = b, a                        # swap without a temp variable

from dataclasses import dataclass
@dataclass(frozen=True)
class Point:                       # a named record: self-documenting fields
    x: float
    y: float
p = Point(3, 4); p.x</code></pre>

<h3>Maps / dictionaries</h3>
<p>The workhorse of real programs. Lookup by key is (on average) <b>constant time</b>, no matter how big the map, because it's a <b>hash table</b> (<a class="xref" data-old="c12">chapter 12</a> explains how).</p>
<pre data-lang="python"><code class="language-python">stock = {"milk": 12, "paneer": 0}
stock["curd"] = 5            # insert / overwrite
stock["milk"]                # 12
stock["bread"]               # KeyError
stock.get("bread", 0)        # 0: default when missing
"milk" in stock              # True: fast
del stock["paneer"]
for item, qty in stock.items():
    print(item, qty)

# counting: the classic pattern
counts = {}
for word in "a b a c a".split():
    counts[word] = counts.get(word, 0) + 1
# or: from collections import Counter; Counter("a b a c a".split())</code></pre>
<p>Keys must be <b>hashable</b>, which in practice means immutable: strings, numbers and tuples work, lists don't (if a key could change, the map couldn't find it again). Python dicts and JS <code>Map</code> preserve insertion order. Go maps deliberately <b>randomise</b> iteration order, so never rely on map order unless the language guarantees it.</p>

<h3>Sets</h3>
<pre data-lang="python"><code class="language-python">seen = set()
seen.add("x"); "x" in seen        # fast membership
a, b = {1, 2, 3}, {2, 3, 4}
a | b   # union        {1, 2, 3, 4}
a &amp; b   # intersection {2, 3}
a - b   # difference   {1}
list(set(xs))   # deduplicate (loses order); dict.fromkeys(xs) keeps order</code></pre>

<h3>Iterating well</h3>
<pre data-lang="python"><code class="language-python">names = ["asha", "ravi"]; ages = [31, 28]
for name, age in zip(names, ages): ...          # walk two sequences together
squares = [n * n for n in range(10)]            # list comprehension
evens   = [n for n in range(10) if n % 2 == 0]  # with a filter
index   = {name: i for i, name in enumerate(names)}   # dict comprehension
total   = sum(len(n) for n in names)            # generator expression: no list built</code></pre>
<div class="callout warn"><b class="t">Never modify a collection while iterating over it</b>
<pre data-lang="python"><code class="language-python">for x in xs:
    if x &lt; 0: xs.remove(x)        # skips elements, or crashes with dicts
xs = [x for x in xs if x &gt;= 0]    # build a new one instead</code></pre></div>

<div class="callout key"><b class="t">Trade-offs: choosing a container</b>
<table>
<tr><th>Need</th><th>Use</th><th>Why / cost</th></tr>
<tr><td>Ordered items, access by position</td><td>list / array</td><td>+ fast index, fast append at end, cache-friendly. − slow search (O(n)), slow insert/delete at front or middle.</td></tr>
<tr><td>Look up by a key (id, name)</td><td>map</td><td>+ O(1) average lookup, insert and delete. − more memory; order may not be guaranteed; keys must be hashable.</td></tr>
<tr><td>"Have I seen this?" / deduplicate</td><td>set</td><td>+ O(1) membership. − no duplicates, no positions.</td></tr>
<tr><td>Fixed group of different fields</td><td>tuple / struct / dataclass</td><td>+ lightweight, immutable, self-documenting with names. − not for variable-length data.</td></tr>
</table></div>

<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>6.1 <span class="levels">basic</span> Given a sentence, print the 3 most frequent words and their counts. No <code>Counter</code>; build the dict yourself, then sort.</summary><div>
<pre data-lang="python"><code class="language-python">def top3(text):
    counts = {}
    for w in text.lower().split():
        counts[w] = counts.get(w, 0) + 1
    return sorted(counts.items(), key=lambda kv: kv[1], reverse=True)[:3]</code></pre></div></details>
<details class="ex"><summary>6.2 <span class="levels">basic</span> Two-sum: given a list and a target, return the indices of two numbers adding to the target. First do it with nested loops, then with one pass and a dict.</summary><div>
<pre data-lang="python"><code class="language-python">def two_sum(nums, target):
    seen = {}                      # value -&gt; index
    for i, n in enumerate(nums):
        if target - n in seen:
            return seen[target - n], i
        seen[n] = i
    return None</code></pre><p>Nested loops: n² comparisons. The dict version: n lookups. For a million items that's the difference between 10¹² and 10⁶ operations. This is why data-structure choice matters.</p></div></details>
<details class="ex"><summary>6.3 <span class="levels">think</span> Group words that are anagrams of each other: <code>["eat","tea","tan","ate","nat","bat"]</code> gives <code>[["eat","tea","ate"],["tan","nat"],["bat"]]</code>.</summary><div>
<pre data-lang="python"><code class="language-python">groups = {}
for w in words:
    key = "".join(sorted(w))        # canonical form: anagrams share it
    groups.setdefault(key, []).append(w)
list(groups.values())</code></pre><p>The pattern "compute a canonical key, group by it in a dict" solves a huge family of problems.</p></div></details>
</div>
`;export{e as default};

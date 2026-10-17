const e=`<p class="goal">Working with the individual bits of integers: compact flags, fast tricks, and bitsets.</p>
<div class="cheat">
<div><h4>Operators</h4><pre data-lang="plaintext"><code class="language-plaintext">a &amp; b    AND   1 only where both are 1
a | b    OR    1 where either is 1
a ^ b    XOR   1 where they differ
~a       NOT   flip every bit
a &lt;&lt; k   shift left  = a × 2ᵏ
a &gt;&gt; k   shift right = a ÷ 2ᵏ (floored)</code></pre></div>
<div><h4>Single-bit operations (bit k)</h4><pre data-lang="plaintext"><code class="language-plaintext">set     x |=  (1 &lt;&lt; k)
clear   x &amp;= ~(1 &lt;&lt; k)
toggle  x ^=  (1 &lt;&lt; k)
test    (x &gt;&gt; k) &amp; 1</code></pre></div>
<div><h4>Classic tricks</h4><pre data-lang="plaintext"><code class="language-plaintext">x &amp; (x-1)       clear the lowest set bit
x &amp; -x          isolate the lowest set bit
x &amp; (x-1) == 0  power of two (x &gt; 0)
popcount(x)     number of 1 bits
a ^ a = 0       XOR cancels: find the unpaired number</code></pre></div>
<div><h4>Flags (permissions)</h4><pre data-lang="python"><code class="language-python">READ, WRITE, DELETE = 1, 2, 4
role = READ | WRITE          # 0b011
can_delete = bool(role &amp; DELETE)
# Python: enum.IntFlag · Go: iota &lt;&lt; · Rust: bitflags crate
# C: #define FLAG (1u &lt;&lt; 3)</code></pre></div>
</div>
<h3>Where it's used</h3>
<ul>
<li><b>Permissions and feature flags</b> packed in one integer (Linux <code>rwx</code> = 4/2/1).</li>
<li><b>Bitsets:</b> a million booleans in 125 KB, with fast set operations (AND for intersection). <b>Bloom filters</b> are built on bitsets.</li>
<li><b>Subset enumeration:</b> the numbers 0 … 2ⁿ−1, where bit i means "item i is included".</li>
<li><b>Hashing, checksums, compression, graphics</b> (packing colour channels: <code>(r&lt;&lt;16)|(g&lt;&lt;8)|b</code>), and network masks (<a class="xref" data-old="x-subnet">Subnetting</a>).</li>
</ul>
<p>Language notes: Python ints are unbounded (<code>~x</code> is −x−1); use <code>&amp; 0xFFFFFFFF</code> to simulate 32 bits. JS bitwise operators work on 32-bit signed ints. In C, shifting signed negatives, or by at least the type's width, is undefined, so use unsigned types.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Enumerate all subsets of 4 items using the numbers 0–15 and bit tests. Then use XOR to find the one order ID that appears an odd number of times in a list.</summary><div><p>For mask in range(16): the subset is <code>[items[i] for i in range(4) if mask &gt;&gt; i &amp; 1]</code>. Odd one out: <code>functools.reduce(operator.xor, ids)</code>, because pairs cancel to 0.</p></div></details>
</div>
`;export{e as default};

const t=`<p class="goal">A data structure is a way of arranging data in memory so that the operations you need are fast. Learn to pick one by asking "which operations do I do most?"</p>
<h3>The idea in one picture</h3>
<p>Imagine storing 1,000 customer records. How you arrange them decides how fast you can find, add or remove one:</p>
<div class="diagram">A shelf in a row (ARRAY)            A treasure hunt (LINKED LIST)       A labelled cabinet (HASH TABLE)
[0][1][2][3][4][5] …                 [A]→[B]→[C]→[D]→ …                  drawer "asha" → Asha's record
 jump to slot 500 instantly          to reach D, follow A, B, C          open the right drawer instantly
 inserting in the middle =           inserting after B = change          but no order: "who comes after
 shift everything right              two arrows                          Asha?" has no answer</div>
<h3>Abstract data type vs data structure</h3>
<ul>
<li>An <b>abstract data type (ADT)</b> is <i>what</i> you can do: a <b>Stack</b> can push, pop and peek; a <b>Map</b> can put, get and delete.</li>
<li>A <b>data structure</b> is <i>how</i> it's done in memory: a stack can be built on an array or on a linked list; a map on a hash table or a balanced tree.</li>
</ul>
<p>The same ADT can have different implementations with different speeds, and choosing between them is the skill.</p>
<h3>The operations to think about</h3>
<table>
<tr><th>Operation</th><th>Question</th></tr>
<tr><td>Access by position</td><td>"give me the 500th item"</td></tr>
<tr><td>Search</td><td>"is paneer in here? where?"</td></tr>
<tr><td>Insert / delete at the ends</td><td>"add to the back", "take from the front"</td></tr>
<tr><td>Insert / delete in the middle</td><td>"put this between B and C"</td></tr>
<tr><td>Ordered traversal / min / max / range</td><td>"all orders between 10:00 and 11:00", "the cheapest item"</td></tr>
</table>
<h3>The master table (details in the following chapters)</h3>
<table>
<tr><th>Structure</th><th>Access i</th><th>Search</th><th>Insert/delete at front</th><th>…at back</th><th>…in middle</th><th>Ordered?</th></tr>
<tr><td>Array / dynamic array</td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(1)*</td><td>O(n)</td><td>by position</td></tr>
<tr><td>Linked list</td><td>O(n)</td><td>O(n)</td><td>O(1)</td><td>O(1) with tail</td><td>O(1) once found</td><td>by position</td></tr>
<tr><td>Stack / queue / deque</td><td>—</td><td>—</td><td colspan="2">O(1) at their ends</td><td>—</td><td>arrival order</td></tr>
<tr><td>Hash table</td><td>—</td><td>O(1) avg</td><td colspan="3">O(1) avg insert/delete by key</td><td>no</td></tr>
<tr><td>Balanced BST</td><td>—</td><td>O(log n)</td><td colspan="3">O(log n) insert/delete</td><td>yes (sorted)</td></tr>
<tr><td>Heap</td><td>min/max O(1)</td><td>O(n)</td><td colspan="3">push/pop O(log n)</td><td>partially</td></tr>
<tr><td>Trie</td><td>—</td><td>O(length of key)</td><td colspan="3">O(length of key)</td><td>by prefix</td></tr>
</table>
<p>* amortised, meaning on average over many operations (<a class="xref" data-old="n20">Big-O</a>).</p>
<h3>How to study this part</h3>
<ol>
<li>For each structure: draw it on paper first (boxes and arrows).</li>
<li>Implement it yourself in Python, then once in C or Rust, where the memory is explicit.</li>
<li>Test the edge cases: empty, one item, and operations at both ends.</li>
<li>Then learn the library version you'll actually use day to day.</li>
</ol>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">think</span> For each task, name the operation that dominates and pick a structure: (a) undo in a text editor, (b) looking up products by barcode, (c) serving orders in arrival order, (d) always picking the delivery with the earliest deadline, (e) autocompleting product names.</summary><div><p>(a) Stack. (b) Hash map from barcode to product. (c) Queue. (d) Heap (priority queue) keyed by deadline. (e) Trie, or a sorted array with binary search on the prefix.</p></div></details>
</div>
`;export{t as default};

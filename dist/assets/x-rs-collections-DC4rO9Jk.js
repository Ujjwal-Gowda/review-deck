const e=`<p class="goal">Rust Collections in Depth: Vec Heap Allocation, Fat Pointer Slices, Swiss Table HashMaps, and Zero-Cost Iterators. Understand how Rust achieves C-level performance with mathematical memory safety.</p>

<h3>The Memory Layout of \`Vec<T>\`</h3>
<p>In Rust, a <code>Vec&lt;T&gt;</code> is an owned, growable heap array. On the stack, a <code>Vec</code> occupies exactly <b>3 words</b> (24 bytes on 64-bit platforms):</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Rust Vec Stack &amp; Heap Layout                           │
│                                                                                        │
│   Stack (24 bytes):                                                                    │
│   ┌────────────────────────┬────────────────────────┬────────────────────────┐         │
│   │   ptr: *mut T          │   cap: usize           │   len: usize           │         │
│   │   (0x7fff_cafe_0000)   │   (8 elements)         │   (4 elements)         │         │
│   └───────────┬────────────┴────────────────────────┴────────────────────────┘         │
│               │                                                                        │
│               ▼ Heap (Contiguous Buffer):                                              │
│        [Slot 0]       [Slot 1]       [Slot 2]       [Slot 3]       [Slot 4..7]         │
│      ┌──────────────┬──────────────┬──────────────┬──────────────┬─────────────┐       │
│      │   item 0     │   item 1     │   item 2     │   item 3     │ (allocated, │       │
│      │              │              │              │              │ uninit)     │       │
│      └──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘       │
│      ◄──────────────────────── len = 4 ─────────────────────────►                      │
│      ◄───────────────────────────────────── cap = 8 ──────────────────────────►        │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h4>Key Mechanics of \`Vec<T>\`:</h4>
<ol>
  <li><b>Capacity Doubling:</b> When <code>push()</code> exceeds <code>cap</code>, Rust calls the global allocator (e.g. jemalloc or system malloc) to double capacity ($2\\times$). If allocation fails, Rust panics or aborts (no silent null pointers).</li>
  <li><b>Zero-Sized Types (ZST) Optimization:</b> If type <code>T</code> has size 0 (e.g. <code>struct Empty;</code> or <code>()</code>), a <code>Vec&lt;()&gt;</code> allocates <b>zero heap memory</b>! Its pointer is a dangling non-null sentinel, and <code>len</code> simply counts iterations. You can store 1 billion empty structs with 0 bytes of RAM!</li>
  <li><b>Deref Coercion:</b> <code>Vec&lt;T&gt;</code> implements <code>Deref&lt;Target = [T]&gt;</code>. Whenever a function takes a borrowed slice <code>&amp;[T]</code>, you can pass <code>&amp;v</code> directly without runtime overhead.</li>
</ol>

<h3>Slices &amp; Fat Pointers: \`&[T]\` and \`&str\`</h3>
<p>Unlike languages that use single pointers with null terminators or hidden length lookups, Rust represents slices as <b>Fat Pointers</b>:</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                Fat Pointer Memory Structure                            │
│                                                                                        │
│   Stack (16 bytes):                                                                    │
│   ┌────────────────────────────────────────┬────────────────────────────────────────┐  │
│   │             ptr: *const T              │               len: usize               │  │
│   │             (8 bytes)                  │               (8 bytes)                │  │
│   └────────────────────────────────────────┴────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<ul>
  <li><b><code>String</code> vs <code>&amp;str</code>:</b> A <code>String</code> is an owned <code>Vec&lt;u8&gt;</code> guaranteed by the compiler to be valid UTF-8. A <code>&amp;str</code> is an immutable fat pointer slice <code>&amp;[u8]</code> into existing UTF-8 memory (stored in the binary rodata, on the stack, or inside a heap <code>String</code>).</li>
  <li><b>Indexing Trap:</b> You cannot do <code>s[0]</code> on a Rust string! Because UTF-8 characters are variable-length (1 to 4 bytes), returning the first byte could slice a multi-byte character in half and produce invalid memory. To access characters, use <code>s.chars()</code> (Unicode scalar values) or <code>s.bytes()</code>.</li>
</ul>

<h3>HashMap Internals: The Swiss Table Architecture</h3>
<p>The Rust standard library does not use traditional separate chaining with linked lists (which suffers from pointer-hopping cache misses). It uses <b>Swiss Tables</b> (via the <code>hashbrown</code> crate):</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Swiss Table Hash Map Architecture                         │
│                                                                                        │
│   Control Byte Array (1 byte per bucket):                                              │
│   ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐     │
│   │ 0x80 │ 0xFE │ H2-a │ H2-b │ 0x80 │ H2-c │ H2-d │ 0x80 │ ...  │      │      │     │
│   └──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘     │
│      ▲            ▲                                                                    │
│   Empty        Deleted (Tombstone) / Full (stores 7-bit H2 hash fingerprint)           │
│                                                                                        │
│   • Evaluates 16 buckets simultaneously in ONE clock cycle using SIMD instructions!    │
│   • Flat contiguous memory: Keys and values stored inline, maximizing CPU L1 cache.    │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h4>When to use \`BTreeMap\` over \`HashMap\`:</h4>
<table>
  <tr><th>Feature</th><th><code>HashMap&lt;K, V&gt;</code></th><th><code>BTreeMap&lt;K, V&gt;</code></th></tr>
  <tr><td><b>Underlying Structure</b></td><td>Flat Swiss Table array</td><td>Multi-way balanced B-Tree (node size $\\approx$ cache line)</td></tr>
  <tr><td><b>Lookup Cost</b></td><td>$O(1)$ amortized</td><td>$O(\\log n)$</td></tr>
  <tr><td><b>Key Requirements</b></td><td><code>Eq + Hash</code></td><td><code>Ord</code> (Total ordering)</td></tr>
  <tr><td><b>Ordering</b></td><td>Random (SipHash randomized)</td><td><b>Sorted</b> by key</td></tr>
  <tr><td><b>Range Queries</b></td><td>No (must scan all keys)</td><td><b>Blazing fast</b> (<code>map.range("a"..="m")</code>)</td></tr>
</table>

<h3>Iterators: Zero-Cost Abstractions</h3>
<p>Rust iterators are not like Java or Python iterators that allocate heap generator frames. Rust iterators are state machines composed of stack-allocated structs that LLVM completely unrolls and vectorizes into raw SIMD instructions:</p>

<pre data-lang="rust"><code class="language-rust">// This functional pipeline compiles to the EXACT same assembly as a hand-tuned C for-loop!
let sum: u64 = numbers.iter()
    .filter(|&x| x % 2 == 0)
    .map(|&x| (x as u64) * 10)
    .sum();</code></pre>

<h4>The Three Iterator Modes:</h4>
<table>
  <tr><th>Method</th><th>Yields</th><th>Ownership Semantics</th></tr>
  <tr><td><code>v.iter()</code></td><td><code>&amp;T</code></td><td>Borrows elements immutably. <code>v</code> is preserved.</td></tr>
  <tr><td><code>v.iter_mut()</code></td><td><code>&amp;mut T</code></td><td>Borrows elements mutably. Allows in-place modifications.</td></tr>
  <tr><td><code>v.into_iter()</code></td><td><code>T</code></td><td><b>Consumes</b> <code>v</code> by value. <code>v</code> is moved and cannot be used again!</td></tr>
</table>

<details class="ex">
  <summary><b>Drill: What happens when you collect a vector of Results?</b> (Click to expand)</summary>
  <pre data-lang="rust"><code class="language-rust">let strings = vec!["10", "20", "invalid", "40"];
let numbers: Result&lt;Vec&lt;i32&gt;, _&gt; = strings.iter().map(|s| s.parse::&lt;i32&gt;()).collect();</code></pre>
  <p><b>Question:</b> Does <code>numbers</code> contain the parsed integers, or does it fail? When does it stop parsing?</p>
  <div class="callout key">
    <p><b>Answer: Short-circuiting with <code>collect()</code>!</b></p>
    <p>Rust's <code>FromIterator</code> trait has a magic implementation for <code>Result&lt;Collection&lt;T&gt;, E&gt;</code>. It iterates over the results, and the exact millisecond it hits the first <code>Err</code> ("invalid"), it immediately stops parsing, drops intermediate memory, and returns <code>Err(ParseIntError)</code>!</p>
    <p>If all elements are valid, it returns <code>Ok(vec![10, 20, ...])</code>.</p>
  </div>
</details>
`;export{e as default};

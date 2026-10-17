const e=`<p class="goal">Go Collections in Depth: Slices, Backing Arrays, Hash Map Buckets, and UTF-8 Runes. Understand how Go manages contiguous memory, pointer headers, and allocation growth under the hood.</p>

<h3>The Memory Reality: Arrays vs Slices</h3>
<p>In Go, a fixed-size array and a dynamic slice are fundamentally different animals at the machine level:</p>
<ul>
  <li><b>Array <code>[N]T</code>:</b> A contiguous block of memory whose size is baked into its static type. In Go, arrays are <b>values</b>, not pointers! Assigning an array or passing it to a function creates a full bitwise copy of all $N$ elements on the stack.</li>
  <li><b>Slice <code>[]T</code>:</b> A lightweight 24-byte header (on 64-bit architectures) pointing to an underlying backing array. Passing a slice copies only the 24-byte descriptor, never the underlying elements.</li>
</ul>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               The 24-Byte Slice Header                                 │
│                                                                                        │
│   type SliceHeader struct {                                                            │
│       Data uintptr  // 8 bytes: pointer to first element in backing array             │
│       Len  int      // 8 bytes: current number of accessible elements                  │
│       Cap  int      // 8 bytes: total capacity of backing array from Data pointer      │
│   }                                                                                    │
│                                                                                        │
│   s := make([]int, 3, 6)                                                               │
│   ┌──────────────┬──────────────┬──────────────┐                                       │
│   │ Data: 0x1000 │    Len: 3    │    Cap: 6    │                                       │
│   └──────┬───────┴──────────────┴──────────────┘                                       │
│          │                                                                             │
│          ▼ Backing Array in Heap Memory:                                               │
│     [0x1000]       [0x1008]       [0x1010]       [0x1018]       [0x1020]       [0x1028]│
│   ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬────────┐│
│   │   item 0     │   item 1     │   item 2     │   (empty)    │   (empty)    │ (empty)││
│   └──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴────────┘│
│   ◄──────────────── Len = 3 ──────────────────►                                        │
│   ◄──────────────────────────────── Cap = 6 ──────────────────────────────────────────►│
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>The Sub-Slice Capacity Hazard (The Silent Production Bug)</h3>
<p>When you slice an existing slice (<code>sub := s[1:3]</code>), Go does NOT copy data. It creates a new slice header pointing to the <i>same backing array</i>. But notice what happens to <code>cap</code>:</p>

<pre data-lang="go"><code class="language-go">s := []int{10, 20, 30, 40, 50}
sub := s[1:3] // elements [20, 30], len=2, cap=4 (from index 1 to end of backing array!)

// ❌ DANGEROUS MUTATION:
sub = append(sub, 999) 
// sub had spare capacity (cap 4 > len 2), so append DID NOT allocate a new array!
// It overwrote index 3 of the ORIGINAL backing array!
// Now s[3] is 999 instead of 40!</code></pre>

<div class="callout warn"><b class="t">The 3-Index Slice Defense: Full Slice Expressions</b>
<p>To prevent sub-slices from accidentally overwriting the parent slice's unconsumed capacity, use the 3-index slice syntax: <code>s[low:high:max]</code>.</p>
<pre data-lang="go"><code class="language-go">// sub's capacity is restricted strictly to high - low (3 - 1 = 2)
sub := s[1:3:3] 
sub = append(sub, 999) // Capacity is full! Go MUST allocate a brand new backing array!
// s remains completely untouched!</code></pre>
</div>

<h3>How \`append()\` Grows Backing Arrays</h3>
<p>When <code>append(slice, elem)</code> exceeds current <code>cap</code>, the Go runtime allocates a new contiguous block, copies existing elements, and reassigns the slice header's pointer.</p>
<ul>
  <li><b>Under 256 elements:</b> Backing array capacity doubles ($2\\times$) on every growth step.</li>
  <li><b>Above 256 elements:</b> Growth transitions smoothly using the formula:
    $$\\text{newCap} = \\text{oldCap} + \\frac{\\text{oldCap} + 3 \\times 256}{4}$$
    yielding an amortized $\\approx 1.25\\times$ growth factor to prevent runaway memory waste.</li>
</ul>

<div class="callout key"><b class="t">The Memory Leak of Sub-Slicing Giant Payloads</b>
<pre data-lang="go"><code class="language-go">func getHeader(filepath string) []byte {
    rawFile, _ := os.ReadFile(filepath) // 100 Megabyte backing array!
    return rawFile[:16] // Returns 16 bytes, but keeps ALL 100 MB in RAM!
}
// Fix: Always clone when returning small slices from large buffers:
func getHeaderSafe(filepath string) []byte {
    rawFile, _ := os.ReadFile(filepath)
    return slices.Clone(rawFile[:16]) // Allocates exactly 16 bytes; 100MB freed by GC
}</code></pre>
</div>

<h3>Go Maps: Hash Buckets &amp; Evacuation Internals</h3>
<p>A Go <code>map[K]V</code> is a pointer to an internal <code>runtime.hmap</code> structure. It is implemented as a hash table with bucket chaining:</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               Go Hash Map Architecture                                 │
│                                                                                        │
│   Hash(key) ──► 64-bit integer: [ Top 8 bits (tophash) ] ... [ Low B bits (bucket idx) ]│
│                                                                                        │
│   Bucket Array (Length = 2^B):                                                         │
│   ┌──────────────┐                                                                     │
│   │  Bucket 0    │ ──► [ tophash: [8]uint8 | 8 Keys | 8 Values | overflow* ]           │
│   ├──────────────┤                                                                     │
│   │  Bucket 1    │ ──► [ tophash: [8]uint8 | 8 Keys | 8 Values | overflow* ]           │
│   │              │                                                   │                 │
│   │              │                                                   ▼                 │
│   │              │                                       [ Overflow Bucket: 8 KV ]     │
│   └──────────────┘                                                                     │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h4>Key Mechanics of Go Maps:</h4>
<ol>
  <li><b>8 Entries per Bucket:</b> Each bucket holds up to 8 keys and 8 values contiguously. Storing keys together and values together prevents alignment padding waste when keys and values have different byte sizes (e.g. <code>map[int64]byte</code>).</li>
  <li><b>The tophash Array:</b> The top 8 bits of the key's hash are cached in an 8-byte array. Scanning a bucket checks these 8 bytes with fast SIMD/register comparisons before doing expensive full-key equality checks.</li>
  <li><b>Load Factor Threshold (6.5):</b> When average items per bucket exceed 6.5, Go doubles the bucket array size ($2^{B+1}$) and incrementally evacuates entries to the new buckets during subsequent writes.</li>
  <li><b>Non-Thread-Safe:</b> Concurrent read + write to a Go map causes a direct kernel panic: <code>fatal error: concurrent map read and map write</code>. Use <code>sync.RWMutex</code> or <code>sync.Map</code>.</li>
</ol>

<h3>Strings, Runes &amp; UTF-8 in Memory</h3>
<p>A Go <code>string</code> is an immutable 16-byte header: <code>struct { Data *byte; Len int }</code>.</p>
<ul>
  <li><code>len("₹50")</code> returns <b>5</b>, NOT 3! The Indian Rupee symbol <code>₹</code> is 3 bytes in UTF-8 (<code>0xE2 0x82 0xB9</code>), plus <code>'5'</code> (1 byte) and <code>'0'</code> (1 byte).</li>
  <li>To count characters, use <code>utf8.RuneCountInString("₹50")</code> (returns 3).</li>
  <li>A <code>rune</code> in Go is an alias for <code>int32</code>, representing a single Unicode Code Point.</li>
</ul>

<pre data-lang="go"><code class="language-go">// Zero-allocation string concatenation with strings.Builder
var b strings.Builder
b.Grow(64) // Pre-allocate buffer to prevent intermediate reallocations
b.WriteString("Order #")
b.WriteString(orderId)
result := b.String() // Returns string pointing to builder's buffer with zero copy</code></pre>

<details class="ex">
  <summary><b>Drill: Why does pass-by-value of a slice modify elements, but not append?</b> (Click to expand)</summary>
  <pre data-lang="go"><code class="language-go">func modify(s []int) {
    s[0] = 99
    s = append(s, 100)
}
func main() {
    v := []int{1, 2}
    modify(v)
    fmt.Println(v) // What does this print?
}</code></pre>
  <div class="callout key">
    <p><b>Answer: It prints <code>[99, 2]</code>!</b></p>
    <p>Because the 24-byte SliceHeader is passed by value (copied), <code>modify</code> gets its own local copy of <code>{Data, Len, Cap}</code>. Since both headers point to the same <code>Data</code> memory address, <code>s[0] = 99</code> mutates the shared backing array.</p>
    <p>However, when <code>append</code> executes, it updates the local <code>Len</code> from 2 to 3 (and possibly reallocates <code>Data</code>). The caller's <code>v</code> header in <code>main</code> still has <code>Len = 2</code>, so <code>main</code> never sees the third appended element!</p>
  </div>
</details>
`;export{e as default};

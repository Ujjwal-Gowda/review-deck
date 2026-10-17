const e=`<p class="goal">Declaring names, choosing types, and controlling mutation, compared across the five languages. The theory is in <a class="xref" data-old="c02">Variables &amp; Types</a>.</p>
<h3>Declaring variables</h3>
<pre data-lang="python"><code class="language-python">count = 0                 # dynamic: the VALUE has a type, the name doesn't
count = "zero"            # allowed (a type checker would flag it)
MAX_ITEMS: int = 50       # constant by convention only</code></pre>
<pre data-lang="typescript"><code class="language-typescript">let count = 0;            // inferred: number; reassignable
const MAX_ITEMS = 50;     // binding can't be reassigned
// count = "zero";        // compile error: string isn't number</code></pre>
<pre data-lang="go"><code class="language-go">var count int             // zero value: 0
total := 0                // short declaration + inference (inside functions)
const MaxItems = 50       // compile-time constant</code></pre>
<pre data-lang="rust"><code class="language-rust">let count = 0;            // immutable by default!
let mut total = 0;        // opt in to mutation
const MAX_ITEMS: u32 = 50;
let count = "zero";       // shadowing: a NEW variable with the same name is allowed</code></pre>
<pre data-lang="c"><code class="language-c">int count = 0;            // uninitialised locals contain garbage, so always initialise
const int max_items = 50;
#define MAX_ITEMS 50      // preprocessor constant (text substitution)</code></pre>
<h3>The primitive types</h3>
<table>
<tr><th>Concept</th><th>Python</th><th>TS</th><th>Go</th><th>Rust</th><th>C</th></tr>
<tr><td>integer</td><td><code>int</code> (unlimited)</td><td><code>number</code> (float!), <code>bigint</code></td><td><code>int</code> (64-bit), <code>int32</code>, <code>uint8</code>…</td><td><code>i32</code>, <code>i64</code>, <code>u8</code>, <code>usize</code>…</td><td><code>int</code> (≥16, usually 32), <code>int64_t</code>…</td></tr>
<tr><td>float</td><td><code>float</code></td><td><code>number</code></td><td><code>float64</code></td><td><code>f64</code></td><td><code>double</code></td></tr>
<tr><td>boolean</td><td><code>bool</code></td><td><code>boolean</code></td><td><code>bool</code></td><td><code>bool</code></td><td><code>bool</code> (<code>&lt;stdbool.h&gt;</code>)</td></tr>
<tr><td>character</td><td>a 1-char <code>str</code></td><td>a 1-char <code>string</code></td><td><code>rune</code> (int32)</td><td><code>char</code> (4-byte Unicode scalar)</td><td><code>char</code> (1 byte)</td></tr>
<tr><td>"nothing"</td><td><code>None</code></td><td><code>null</code>, <code>undefined</code></td><td><code>nil</code> (pointers, slices, maps…)</td><td><code>Option&lt;T&gt;</code></td><td><code>NULL</code> (pointers)</td></tr>
</table>
<h3>Conversions</h3>
<pre data-lang="plaintext"><code class="language-plaintext">string → int     Python int("42")        TS Number("42") / parseInt("42", 10)    Go strconv.Atoi("42")
                 Rust "42".parse::&lt;i32&gt;()  C strtol(s, &amp;end, 10)   ← all can fail; each reports failure differently
int → string     str(42)                 String(42) / \`\${42}\`                     strconv.Itoa(42)
                 42.to_string()          snprintf(buf, sizeof buf, "%d", 42)
int → float      float(n)                n is already a number                    float64(n)
                 n as f64                (double)n</code></pre>
<h3>Switching between languages: traps</h3>
<ul>
<li><b>Implicit conversion:</b> Go and Rust never convert numeric types implicitly (<code>int32 + int64</code> is an error). C converts silently, including signed to unsigned. JS coerces almost anything.</li>
<li><b>Integer overflow:</b> Python never overflows; Go wraps; Rust panics in debug and wraps in release; C signed overflow is undefined behaviour; JS loses precision after 2⁵³.</li>
<li><b>Division:</b> <code>7/2</code> is 3.5 in Python and JS, 3 in Go, Rust and C (integer division).</li>
<li><b>Uninitialised values:</b> Go gives zero values; Rust refuses to compile; C gives garbage; Python raises NameError; JS gives <code>undefined</code>.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">think</span> Predict each result, then run it: <code>7 / 2</code>, <code>-7 / 2</code>, <code>-7 % 3</code>, and 255 + 1 stored in an unsigned 8-bit type, in all five languages.</summary><div><p>Python: 3.5, -3.5, 2 (and 256, since there&#39;s no u8). JS: 3.5, -3.5, -1. Go: 3, -3, -1, and 0 for uint8. Rust: 3, -3, -1, and a debug panic for u8 (use <code>wrapping_add</code> to get 0). C: 3, -3, -1, and 0 for unsigned char.</p></div></details>
</div>
`;export{e as default};

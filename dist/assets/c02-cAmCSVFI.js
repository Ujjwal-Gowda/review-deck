const e=`<p class="goal">What data is, how it's represented, and what a variable really is.</p>

<h3>1. Values and Types: The Two Foundational Questions</h3>
<p>A <b>value</b> is a piece of data: <code>42</code>, <code>3.14</code>, <code>"hi"</code>, <code>True</code>. Every value has a <b>type</b>, which answers two fundamental questions:</p>
<ul>
  <li><b>Storage Representation:</b> How many bits does it take, and how are those bits interpreted in memory?</li>
  <li><b>Permissible Operations:</b> Which operations make semantic sense? (e.g. you can add two numbers, but dividing a string by a boolean is an error).</li>
</ul>

<table>
<tr><th>Concept</th><th>Python</th><th>C</th><th>JavaScript</th><th>Go</th><th>Rust</th></tr>
<tr><td>Integer</td><td><code>int</code> (unbounded!)</td><td><code>int</code>, <code>long</code>, <code>int64_t</code>…</td><td><code>number</code> (a float!), <code>BigInt</code></td><td><code>int</code>, <code>int64</code>, <code>uint8</code>…</td><td><code>i32</code>, <code>i64</code>, <code>u8</code>…</td></tr>
<tr><td>Floating point</td><td><code>float</code> (64-bit)</td><td><code>float</code>, <code>double</code></td><td><code>number</code></td><td><code>float64</code></td><td><code>f64</code></td></tr>
<tr><td>Boolean</td><td><code>bool</code></td><td><code>_Bool</code> / int 0/1</td><td><code>boolean</code></td><td><code>bool</code></td><td><code>bool</code></td></tr>
<tr><td>Text</td><td><code>str</code> (Unicode)</td><td><code>char*</code> (bytes + <code>\\0</code>)</td><td><code>string</code></td><td><code>string</code> (UTF-8)</td><td><code>String</code>, <code>&amp;str</code></td></tr>
<tr><td>"Nothing"</td><td><code>None</code></td><td><code>NULL</code> (pointers only)</td><td><code>null</code>, <code>undefined</code></td><td><code>nil</code></td><td><code>Option&lt;T&gt;</code> (no null)</td></tr>
</table>

<h3>2. How Integers Are Stored: Binary &amp; Two's Complement</h3>
<p>Computers store everything in <b>bits</b> (0 or 1). 8 bits make 1 <b>byte</b>. Integers work with powers of 2:</p>
<div class="diagram">  bit value:  128  64  32  16   8   4   2   1
  13      =    0   0   0   0   1   1   0   1     (8 + 4 + 1)
  255     =    1   1   1   1   1   1   1   1     (max for one unsigned byte)</div>

<ul>
  <li><b>Unsigned integers:</b> All bits represent magnitude. An unsigned 8-bit integer (<code>u8</code>) holds <code>0</code> to <code>255</code>.</li>
  <li><b>Signed integers:</b> The highest bit represents the sign using <b>two's complement</b> (to negate: flip all bits and add 1). An <code>i32</code> holds <code>−2,147,483,648</code> to <code>2,147,483,647</code>.</li>
  <li><b>Hexadecimal shorthand:</b> Base-16 (digits 0–9, a–f). Each hex character corresponds to exactly 4 bits (nibble). <code>0xFF</code> = <code>255</code> = <code>0b11111111</code>.</li>
</ul>

<h4>Integer Overflow: What Happens at Limit + 1?</h4>
<p>When you add <code>1</code> to the maximum value of a fixed integer type, languages diverge fundamentally:</p>
<ul>
  <li><b>C &amp; C++:</b> Unsigned wraps around to <code>0</code> by specification; signed overflow is <b>Undefined Behavior (UB)</b>, allowing compiler optimizations that delete checks.</li>
  <li><b>Rust:</b> Panics on overflow in debug builds; requires explicit methods like <code>wrapping_add()</code> or <code>checked_add()</code> in release builds.</li>
  <li><b>Go:</b> Silently wraps around for fixed types (<code>uint8(255) + 1 == 0</code>).</li>
  <li><b>Python:</b> Automatically promotes to arbitrary-precision integers (grows unbounded, never overflows, but uses more memory).</li>
</ul>

<pre data-lang="c"><code class="language-c">unsigned char u = 255; u = u + 1;   // wraps to 0 (defined for unsigned)
int i = 2147483647;    i = i + 1;   // UNDEFINED BEHAVIOUR in C: anything may happen</code></pre>
<pre data-lang="rust"><code class="language-rust">let x: u8 = 255;
let y = x + 1;               // debug build: panics "attempt to add with overflow"
let z = x.wrapping_add(1);   // explicit wrapping: 0
let w = x.checked_add(1);    // explicit checked: None</code></pre>
<pre data-lang="python"><code class="language-python">print(2 ** 200)   # Python ints grow dynamically: no overflow, ever (but slower)</code></pre>

<h3>3. How Decimals Are Stored: IEEE 754 Floating Point</h3>
<p>Floats represent real numbers using three components: a <b>sign</b>, an <b>exponent</b>, and a <b>fraction (mantissa)</b>:</p>
<ul>
  <li><b>The Representation Problem:</b> Most decimal fractions (like <code>0.1</code> or <code>0.2</code>) cannot be represented exactly in binary powers of 2, just as <code>1/3</code> cannot be written exactly in decimal.</li>
  <li><b>Equality Trap:</b> Because <code>0.1 + 0.2 = 0.30000000000000004</code>, never compare floating-point numbers with <code>==</code>.</li>
  <li><b>Tolerance Comparison:</b> Always compare floats using an epsilon delta: <code>abs(a - b) &lt; 1e-9</code> or <code>math.isclose(a, b)</code>.</li>
  <li><b>Special Values:</b> Floats support <code>inf</code>, <code>-inf</code>, and <code>nan</code> ("not a number"). Note that <code>nan != nan</code> evaluates to <code>true</code>!</li>
</ul>

<pre data-lang="python"><code class="language-python">&gt;&gt;&gt; 0.1 + 0.2
0.30000000000000004
&gt;&gt;&gt; 0.1 + 0.2 == 0.3
False
&gt;&gt;&gt; import math; math.isclose(0.1 + 0.2, 0.3)
True</code></pre>

<div class="callout warn"><b class="t">Golden Rule for Financial Systems</b>
<ul>
  <li><b>Never use binary floats for money or currencies.</b></li>
  <li><b>Store monetary amounts as integers</b> in the lowest atomic denomination (cents, paise, yen: ₹12.50 &rarr; <code>1250</code>).</li>
  <li>Alternatively, use dedicated exact decimal libraries (<code>decimal.Decimal</code> in Python, <code>BigDecimal</code> in Java, <code>shopspring/decimal</code> in Go).</li>
</ul>
</div>

<h3>4. Variables: Names vs Boxes</h3>
<p>A <b>variable</b> is a name bound to a value. There are two distinct mental models:</p>

<div class="diagram">  "BOX" model (C, Go, Rust for primitives)         "LABEL / REFERENCE" model (Python, JS, Java objects)
  int a = 5;  int b = a;                             a = [1, 2];   b = a
  ┌─a─┐  ┌─b─┐                                        a ──┐
  │ 5 │  │ 5 │   two separate boxes;                    ├──► [1, 2]   one object,
  └───┘  └───┘   changing b leaves a alone             b ──┘            two labels</div>

<ul>
  <li><b>The Box Model (Value Semantics):</b> The variable <i>is</i> the storage location. Assigning <code>b = a</code> makes an independent copy of the value. Modifying <code>b</code> never affects <code>a</code>.</li>
  <li><b>The Label Model (Reference Semantics):</b> The variable is a tag/pointer pointing to an object in heap memory. Assigning <code>b = a</code> merely attaches a second label to the exact same object.</li>
  <li><b>The Aliasing Bug:</b> If <code>a</code> and <code>b</code> reference the same mutable object, calling <code>b.append(3)</code> silently mutates <code>a</code>. This is one of the most common sources of production bugs.</li>
</ul>

<pre data-lang="python"><code class="language-python">a = [1, 2]
b = a            # b is another NAME pointing to the same list
b.append(3)
print(a)         # [1, 2, 3]: aliased mutation!

x = 5
y = x
y = y + 1        # rebinding y to a NEW int object; ints are immutable
print(x)         # 5</code></pre>

<h3>5. Static vs Dynamic &amp; Strong vs Weak Typing</h3>
<p>Typing disciplines operate on two independent axes:</p>
<ul>
  <li><b>Static Typing:</b> Types are verified at compile time before execution. Variables hold types. <i>(C, Go, Rust, Java, TypeScript)</i></li>
  <li><b>Dynamic Typing:</b> Types are checked at runtime during execution. Values hold types; variables are generic references. <i>(Python, JavaScript, Ruby)</i></li>
  <li><b>Strong Typing:</b> The language strictly refuses implicit incompatible conversions. <code>"5" + 3</code> triggers a type error. <i>(Python, Rust, Go)</i></li>
  <li><b>Weak Typing:</b> The language silently coerces types behind your back. <code>"5" + 3</code> becomes <code>"53"</code>. <i>(JavaScript, C)</i></li>
</ul>

<pre data-lang="python"><code class="language-python">"5" + 3        # TypeError: Python is dynamic but STRONG (refuses coercion)</code></pre>
<pre data-lang="javascript"><code class="language-javascript">"5" + 3        // "53"   JavaScript is dynamic and WEAK (silently coerces)
"5" - 3        // 2      …inconsistently coerces to number!
[] + {}        // "[object Object]"
0 == ""        // true   always use === (strict equality) in JS</code></pre>
<pre data-lang="go"><code class="language-go">var n int = 5
var s string = "5"
// n + s   → compile-time error before running: Go is static and strong</code></pre>

<h3>6. Immutability and Constants</h3>
<ul>
  <li><b>Default Immutability (Rust, Functional):</b> Bindings are immutable by default. You must explicitly opt into mutation with <code>mut</code>, eliminating accidental state corruption.</li>
  <li><b>Shallow Const (JavaScript):</b> <code>const a = []</code> prevents reassigning the variable <code>a</code>, but the underlying array remains fully mutable (<code>a.push(1)</code> succeeds).</li>
  <li><b>Conventions (Python):</b> Python has no compiler-enforced constants; developers use <code>UPPER_CASE</code> as an advisory convention.</li>
</ul>

<pre data-lang="rust"><code class="language-rust">let x = 5;       // immutable by default in Rust
// x = 6;        // compile error!
let mut y = 5;   // explicitly opt in to mutation
y += 1;</code></pre>

<h3>7. Type Conversion Quirks &amp; Idioms</h3>
<ul>
  <li><b>Truncation vs Rounding:</b> <code>int(4.9)</code> truncates towards zero (producing <code>4</code>), it does not round.</li>
  <li><b>Banker's Rounding:</b> In Python, <code>round(4.5) == 4</code> and <code>round(5.5) == 6</code>. Ties round to the nearest <i>even</i> number to avoid statistical bias.</li>
  <li><b>Truthiness &amp; Falsiness:</b> In dynamic languages, empty containers (<code>[]</code>, <code>""</code>, <code>{}</code>), <code>0</code>, and <code>None</code> evaluate to <code>False</code>. However, the string <code>"False"</code> evaluates to <code>True</code> because it is non-empty!</li>
</ul>

<pre data-lang="python"><code class="language-python">int("42")       # 42
int(4.9)        # 4    truncates toward zero, doesn't round
round(4.5)      # 4    banker's rounding: ties go to the even number
bool(0), bool(""), bool([]), bool(None)   # all False ("falsy")
bool("False")   # True: any non-empty string is truthy</code></pre>

<div class="exercises"><h3>Practice Exercises</h3>
<details class="ex"><summary>2.1 <span class="levels">basic</span> By hand: convert 37 to binary and 0x2A to decimal. Then verify with <code>bin(37)</code> and <code>0x2A</code> in Python.</summary><div><p>37 = 32 + 4 + 1 = <code>100101</code>. 0x2A = 2×16 + 10 = 42.</p></div></details>
<details class="ex"><summary>2.2 <span class="levels">basic</span> Predict the output, then run it: <code>a = [0]; b = a; b = b + [1]; print(a)</code>. Now replace <code>b = b + [1]</code> with <code>b += [1]</code>. Explain the difference.</summary><div><p>First prints <code>[0]</code>: <code>b + [1]</code> builds a <i>new</i> list and rebinds <code>b</code> to it. Second prints <code>[0, 1]</code>: for lists, <code>+=</code> mutates in place (it calls <code>__iadd__</code>, which is like <code>extend</code>), and <code>a</code> is the same object. Same-looking syntax, different semantics.</p></div></details>
<details class="ex"><summary>2.3 <span class="levels">think</span> Write a function that adds up prices <code>[19.99, 5.01, 0.10]</code> correctly to <code>25.10</code>. Do it without floats.</summary><div>
<pre data-lang="python"><code class="language-python">def total(prices: list[str]) -&gt; str:
    paise = 0
    for p in prices:
        rupees, _, frac = p.partition(".")
        paise += int(rupees) * 100 + int((frac + "00")[:2])
    return f"{paise // 100}.{paise % 100:02d}"

print(total(["19.99", "5.01", "0.10"]))   # 25.10
# or: from decimal import Decimal; sum(map(Decimal, ["19.99","5.01","0.10"]))</code></pre>
<p>Note that the input is strings: once a value is a float, precision is already lost.</p></div></details>
<details class="ex"><summary>2.4 <span class="levels">think</span> In C, what does <code>printf("%d\\n", (unsigned char)300);</code> print, and why?</summary><div><p><code>44</code>. 300 in binary is <code>1 0010 1100</code> (9 bits). Keeping only the low 8 bits gives <code>0010 1100</code> = 44. It's the same as 300 mod 256.</p></div></details>
</div>
`;export{e as default};

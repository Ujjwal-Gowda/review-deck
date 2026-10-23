const e=`<p class="goal">How values combine, and the traps in division, precedence and logic.</p>

<h3>1. Expressions vs Statements</h3>
<ul>
  <li><b>Expression:</b> Any piece of code that evaluates to and produces a value (e.g. <code>2 + 3</code>, <code>len(x) &gt; 0</code>, <code>f(4)</code>).</li>
  <li><b>Statement:</b> A construct that performs an action or controls flow but does not produce a value (e.g. <code>x = 5</code>, <code>return</code>).</li>
  <li><b>Language Differences:</b> In Rust and Kotlin, <code>if/else</code> is an expression (<code>let y = if x &gt; 0 { 1 } else { -1 };</code>). In C, assignment is an expression, which enables accidental assignment bugs like <code>if (x = 5)</code>.</li>
</ul>

<h3>2. Arithmetic and the Division Trap</h3>
<p>Division behavior is one of the most frequent sources of bugs when moving between languages:</p>

<pre data-lang="python"><code class="language-python">7 / 2     # 3.5   true division: always produces a float in Python 3
7 // 2    # 3     floor division
-7 // 2   # -4    FLOOR: rounds toward negative infinity!
7 % 3     # 1     remainder (modulo)
-7 % 3    # 2     sign follows the divisor in Python
2 ** 10   # 1024  exponentiation</code></pre>

<pre data-lang="c"><code class="language-c">7 / 2     // 3    integer division: truncates toward zero
-7 / 2    // -3   TRUNCATION: rounds toward zero (not floor!)
-7 % 3    // -1   sign follows the dividend in C
7 / 2.0   // 3.5  one float operand promotes the entire expression to float</code></pre>

<div class="callout warn"><b class="t">Portable Division Checklist</b>
<ul>
  <li><b>Positive Numbers:</b> Floor division and truncation yield the same result.</li>
  <li><b>Negative Numbers:</b> Python rounds toward negative infinity (<code>-7 // 2 == -4</code>); C, Go, Java, JS, and Rust truncate toward zero (<code>-7 / 2 == -3</code>).</li>
  <li><b>Common Modulo (<code>%</code>) Idioms:</b>
    <ul>
      <li>Even/Odd check: <code>n % 2 == 0</code></li>
      <li>Circular ring buffer wrap-around: <code>(i + 1) % length</code></li>
      <li>Digit extraction from the right: <code>last_digit = n % 10</code></li>
    </ul>
  </li>
</ul>
</div>

<h3>3. Comparison, Identity, and Equality</h3>
<ul>
  <li><b>Value Equality (<code>==</code>):</b> Compares whether the contents or states of two objects are equivalent.</li>
  <li><b>Reference Identity (<code>is</code> / <code>===</code>):</b> Checks whether two references point to the exact same location in memory.</li>
  <li><b>Chaining Invariants:</b> Python supports algebraic chaining (<code>0 &lt;= i &lt; n</code>). In C/C++, <code>0 &lt;= i &lt; n</code> parses as <code>(0 &lt;= i) &lt; n</code>, comparing a boolean <code>0</code> or <code>1</code> to <code>n</code>!</li>
  <li><b>The <code>None</code> Idiom:</b> Always test for singletons using identity: <code>if x is None:</code> instead of <code>if x == None:</code>.</li>
</ul>

<pre data-lang="python"><code class="language-python">a = [1, 2]
b = [1, 2]
print(a == b)    # True: identical content
print(a is b)    # False: two distinct allocations in heap memory
print(a is a)    # True: identical address</code></pre>

<h3>4. Logic and Short-Circuit Evaluation</h3>
<p>Logical operators evaluate left-to-right and terminate as soon as the outcome is mathematically determined:</p>

<ul>
  <li><b>Logical AND (<code>and</code> / <code>&amp;&amp;</code>):</b> Stops immediately at the first <i>falsy</i> operand; subsequent operands are never executed.</li>
  <li><b>Logical OR (<code>or</code> / <code>||</code>):</b> Stops immediately at the first <i>truthy</i> operand; subsequent operands are bypassed.</li>
  <li><b>Guard Clause Pattern:</b> Use short-circuiting to prevent null dereferencing: <code>if user is not None and user.is_admin:</code>.</li>
  <li><b>Default Value Idiom:</b> <code>name = input_name or "anonymous"</code> returns the first truthy value.</li>
</ul>

<h4>Truthiness Across Languages</h4>
<ul>
  <li><b>Python Falsy:</b> <code>False</code>, <code>None</code>, <code>0</code>, <code>0.0</code>, <code>""</code>, <code>[]</code>, <code>{}</code>, <code>set()</code>.</li>
  <li><b>JavaScript Falsy:</b> <code>false</code>, <code>0</code>, <code>-0</code>, <code>0n</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>.</li>
  <li><b>The Cross-Language Trap:</b> An empty array <code>[]</code> is <b>truthy</b> in JavaScript, but <b>falsy</b> in Python!</li>
  <li><b>Go &amp; Rust Strictness:</b> No implicit truthiness exists. Conditions must strictly evaluate to a real <code>bool</code> (e.g. <code>len(arr) == 0</code>), eliminating an entire class of bugs.</li>
</ul>

<h3>5. Bitwise Operators &amp; Bitmasks</h3>
<pre data-lang="python"><code class="language-python">a, b = 0b1100, 0b1010
a &amp; b    # 0b1000  AND: both bits must be 1
a | b    # 0b1110  OR: either bit is 1
a ^ b    # 0b0110  XOR: bits differ
~a       # invert all bits (NOT)
a &lt;&lt; 2   # 0b110000  left shift: multiplies by 2^2 (4)
a &gt;&gt; 1   # 0b110     right shift: divides by 2^1 (2)

# Packing permissions into a single integer flag (e.g. Unix chmod)
READ, WRITE, EXEC = 4, 2, 1
perm = READ | WRITE
can_write = (perm &amp; WRITE) != 0   # True</code></pre>

<h3>6. Operator Precedence Hierarchy</h3>
<p>From tightest binding to loosest:</p>
<ol>
  <li><b>Grouping &amp; Access:</b> Function calls <code>f()</code>, array indexing <code>a[i]</code>, attribute access <code>obj.x</code></li>
  <li><b>Exponents:</b> <code>**</code> (binds right-to-left: <code>2 ** 3 ** 2 == 512</code>)</li>
  <li><b>Unary Signs:</b> Unary plus and minus <code>+x</code>, <code>-x</code>, bitwise NOT <code>~x</code></li>
  <li><b>Multiplication &amp; Division:</b> <code>*</code>, <code>/</code>, <code>//</code>, <code>%</code></li>
  <li><b>Addition &amp; Subtraction:</b> <code>+</code>, <code>-</code></li>
  <li><b>Bitwise Shifts:</b> <code>&lt;&lt;</code>, <code>&gt;&gt;</code></li>
  <li><b>Bitwise Logic:</b> <code>&amp;</code>, then <code>^</code>, then <code>|</code></li>
  <li><b>Comparisons:</b> <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code>, <code>&gt;=</code>, <code>is</code>, <code>in</code></li>
  <li><b>Boolean Logic:</b> <code>not</code>, then <code>and</code>, then <code>or</code></li>
</ol>

<div class="callout note"><b class="t">Precedence Rule of Thumb</b>
<p>Never rely on obscure precedence rules. <b>Always add explicit parentheses</b> around bitwise expressions and mixed logical operators (e.g. <code>(x &amp; 1) == 0</code>). Code readability and bug prevention always outweigh brevity.</p>
</div>

<div class="exercises"><h3>Practice Exercises</h3>
<details class="ex"><summary>3.1 <span class="levels">basic</span> Given a total number of seconds (e.g. 98765), format it as <code>1d 03:26:05</code> using only <code>//</code> and <code>%</code>.</summary><div>
<pre data-lang="python"><code class="language-python">s = 98765
d, s = divmod(s, 86400)
h, s = divmod(s, 3600)
m, s = divmod(s, 60)
print(f"{d}d {h:02d}:{m:02d}:{s:02d}")</code></pre></div></details>
<details class="ex"><summary>3.2 <span class="levels">basic</span> Write <code>is_power_of_two(n)</code> in a single expression using a bitwise trick.</summary><div><p><code>n &gt; 0 and (n &amp; (n - 1)) == 0</code>. A power of two has exactly one 1-bit. Subtracting 1 flips that bit and sets every bit below it to 1, making their bitwise AND zero.</p></div></details>
<details class="ex"><summary>3.3 <span class="levels">think</span> Why does <code>print(True + True)</code> output 2 in Python?</summary><div><p>In Python, <code>bool</code> is an explicit subclass of <code>int</code> where <code>True == 1</code> and <code>False == 0</code>. While useful for quick summations like <code>sum(x &gt; 0 for x in nums)</code>, it means <code>isinstance(True, int)</code> is True, which can introduce subtle type validation bugs.</p></div></details>
</div>
`;export{e as default};

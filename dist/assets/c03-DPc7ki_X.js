const e=`<p class="goal">How values combine, and the traps in division, precedence and logic.</p>

<h3>Expressions vs statements</h3>
<p>An <b>expression</b> produces a value: <code>2 + 3</code>, <code>len(x) &gt; 0</code>, <code>f(4)</code>. A <b>statement</b> does something: <code>x = 5</code>, <code>if …</code>, <code>return</code>. Some languages blur the line. In Rust, <code>if</code> is an expression (<code>let y = if x &gt; 0 { 1 } else { -1 };</code>), and in C, assignment is an expression, which enables the classic bug <code>if (x = 5)</code>.</p>

<h3>Arithmetic, and the division trap</h3>
<pre data-lang="python"><code class="language-python">7 / 2     # 3.5   true division always gives a float in Python 3
7 // 2    # 3     floor division
-7 // 2   # -4    FLOOR: rounds toward negative infinity
7 % 3     # 1     remainder (modulo)
-7 % 3    # 2     in Python the result takes the sign of the divisor
2 ** 10   # 1024  exponent</code></pre>
<pre data-lang="c"><code class="language-c">7 / 2     // 3    int / int = int division (truncates)
-7 / 2    // -3   TRUNCATES toward zero (not floor!)
-7 % 3    // -1   sign follows the dividend
7 / 2.0   // 3.5  one float operand makes it float division</code></pre>
<div class="callout warn"><b class="t">Portable habit</b><p>Integer division and modulo with negative numbers differ between languages (Python floors; C, Go, Java, JS and Rust truncate). When porting code, test negatives explicitly. Classic use of <code>%</code>: even/odd (<code>n % 2 == 0</code>), wrap-around (<code>(i + 1) % len</code>), and digit extraction (<code>n % 10</code>).</p></div>

<h3>Comparison and equality</h3>
<ul>
<li><code>==</code> means value equality. <code>is</code> (Python) and <code>===</code> on objects (JS) mean identity: is this the <i>same object</i>?</li>
<li>Python: <code>[1,2] == [1,2]</code> is True; <code>[1,2] is [1,2]</code> is False (two different objects). Use <code>is</code> only for <code>None</code>: <code>if x is None</code>.</li>
<li>Python allows chaining: <code>0 &lt;= i &lt; n</code>. In C, <code>0 &lt;= i &lt; n</code> compiles but means <code>(0 &lt;= i) &lt; n</code>, which compares a 0/1 result to <code>n</code>. That's a bug.</li>
</ul>

<h3>Logic and short-circuiting</h3>
<p><code>and</code>/<code>&amp;&amp;</code> stops as soon as a result is certain: if the left side is false, the right side <b>is never evaluated</b>. <code>or</code>/<code>||</code> stops at the first true. This is used deliberately as a guard:</p>
<pre data-lang="python"><code class="language-python">if user is not None and user.is_admin:   # safe: .is_admin never runs on None
    ...
name = input_name or "anonymous"          # 'or' returns the first truthy VALUE, not just True</code></pre>
<p><b>Truthiness</b>: in Python and JS, non-booleans are treated as true/false in conditions. Falsy values in Python: <code>False, None, 0, 0.0, "", [], {}, set()</code>. In JS: <code>false, 0, -0, 0n, "", null, undefined, NaN</code>. An empty array <code>[]</code> is <b>truthy</b> in JS but falsy in Python, which is a classic porting bug. Go and Rust have no truthiness: conditions must be real <code>bool</code>s, which removes a whole class of bugs.</p>

<h3>Bitwise operators</h3>
<pre data-lang="python"><code class="language-python">a, b = 0b1100, 0b1010
a &amp; b    # 0b1000  AND: both bits 1
a | b    # 0b1110  OR: either bit 1
a ^ b    # 0b0110  XOR: bits differ
~a       # invert all bits
a &lt;&lt; 2   # 0b110000  shift left = multiply by 4
a &gt;&gt; 1   # 0b110     shift right = floor divide by 2

READ, WRITE, EXEC = 4, 2, 1          # flags packed into one int (like chmod 755)
perm = READ | WRITE
can_write = perm &amp; WRITE != 0</code></pre>

<h3>Precedence</h3>
<p>Roughly, from binding tightest to loosest: calls/indexing, then <code>**</code>, then unary minus, then <code>* / // %</code>, then <code>+ -</code>, then shifts, then bitwise, then comparisons, then <code>not</code>, then <code>and</code>, then <code>or</code>. <code>-2 ** 2</code> is <code>-4</code> in Python (the power binds first). In C, <code>x &amp; 1 == 0</code> parses as <code>x &amp; (1 == 0)</code>. <b>When in doubt, add parentheses</b>. Code is read far more often than it's written.</p>

<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>3.1 <span class="levels">basic</span> Given a total number of seconds (e.g. 98765), print it as <code>1d 03:26:05</code> using only <code>//</code> and <code>%</code>.</summary><div>
<pre data-lang="python"><code class="language-python">s = 98765
d, s = divmod(s, 86400)
h, s = divmod(s, 3600)
m, s = divmod(s, 60)
print(f"{d}d {h:02d}:{m:02d}:{s:02d}")</code></pre></div></details>
<details class="ex"><summary>3.2 <span class="levels">basic</span> Write <code>is_power_of_two(n)</code> in one expression using a bitwise trick.</summary><div><p><code>n &gt; 0 and (n &amp; (n - 1)) == 0</code>. A power of two has exactly one 1-bit. Subtracting 1 flips it and every bit below it, so the AND is zero.</p></div></details>
<details class="ex"><summary>3.3 <span class="levels">think</span> Why does <code>print(True + True)</code> print 2 in Python?</summary><div><p><code>bool</code> is a subclass of <code>int</code> in Python; <code>True == 1</code>. Handy for counting (<code>sum(x &gt; 0 for x in xs)</code>), but it means <code>isinstance(True, int)</code> is True, which can surprise validation code.</p></div></details>
</div>
`;export{e as default};

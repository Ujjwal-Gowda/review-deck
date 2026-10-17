const e=`<p class="goal">Branching and looping in five syntaxes, and the semantic differences hiding behind similar-looking code.</p>
<h3>Conditionals</h3>
<pre data-lang="python"><code class="language-python">if n &lt; 0: sign = "neg"
elif n == 0: sign = "zero"
else: sign = "pos"
sign = "neg" if n &lt; 0 else "non-neg"          # conditional expression</code></pre>
<pre data-lang="typescript"><code class="language-typescript">const sign = n &lt; 0 ? "neg" : n === 0 ? "zero" : "pos";</code></pre>
<pre data-lang="go"><code class="language-go">if v, err := strconv.Atoi(s); err != nil {  // if with an init statement: v and err are scoped to the if
    return err
} else if v &lt; 0 { sign = "neg" }</code></pre>
<pre data-lang="rust"><code class="language-rust">let sign = if n &lt; 0 { "neg" } else if n == 0 { "zero" } else { "pos" };   // if is an EXPRESSION</code></pre>
<pre data-lang="c"><code class="language-c">const char *sign = n &lt; 0 ? "neg" : (n == 0 ? "zero" : "pos");</code></pre>
<h3>Multi-way branching</h3>
<table>
<tr><th></th><th>Construct</th><th>Falls through?</th><th>Exhaustive?</th></tr>
<tr><td>Python</td><td><code>match</code> with patterns</td><td>no</td><td>no (use <code>case _:</code>)</td></tr>
<tr><td>TS</td><td><code>switch</code></td><td><b>yes</b>, unless you <code>break</code></td><td>with a <code>never</code> check</td></tr>
<tr><td>Go</td><td><code>switch</code> (no condition = if-chain)</td><td>no (explicit <code>fallthrough</code>)</td><td>no</td></tr>
<tr><td>Rust</td><td><code>match</code> with patterns and guards</td><td>no</td><td><b>yes</b>: the compiler enforces it</td></tr>
<tr><td>C</td><td><code>switch</code> on integers</td><td><b>yes</b>, unless you <code>break</code></td><td>no (<code>-Wswitch</code> helps for enums)</td></tr>
</table>
<pre data-lang="rust"><code class="language-rust">match status {
    Status::Paid { amount } if amount &gt; 100_000 =&gt; review(),   // pattern + guard
    Status::Paid { .. } =&gt; ship(),
    Status::Cancelled | Status::Refunded =&gt; archive(),
    Status::Placed =&gt; wait(),
}</code></pre>
<h3>Loops</h3>
<pre data-lang="plaintext"><code class="language-plaintext">                 count 0..n                         over a collection                 while condition
Python   for i in range(n):                 for x in xs:  / enumerate(xs)     while cond:
TS       for (let i = 0; i &lt; n; i++)          for (const x of xs)               while (cond)
Go       for i := 0; i &lt; n; i++ {}  / range n  for i, x := range xs {}           for cond {}   (for {} = forever)
Rust     for i in 0..n {}                   for x in &amp;xs {} / .iter().enumerate()  while cond {}  (loop {} = forever)
C        for (int i = 0; i &lt; n; i++) {}      for (size_t i = 0; i &lt; len; i++)  while (cond) {}</code></pre>
<h3>Traps</h3>
<ul>
<li><b>JS <code>for…in</code></b> iterates over <i>keys</i> (as strings, including inherited ones). Use <code>for…of</code> for values.</li>
<li><b>Go <code>range</code></b> gives a <i>copy</i> of each element: modifying <code>x</code> doesn't change the slice. Use the index: <code>xs[i].Field = …</code>.</li>
<li><b>Rust <code>for x in xs</code></b> <i>consumes</i> <code>xs</code> (moves it). Use <code>&amp;xs</code> to borrow, or <code>&amp;mut xs</code> to modify.</li>
<li><b>Python and Go</b> have no do-while; <b>Rust's <code>loop</code></b> can return a value with <code>break value</code>.</li>
<li><b>Labelled breaks:</b> Go, Rust, JS and Java support <code>break outer</code>; Python and C don't (use a function, a flag, or <code>goto</code> in C).</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Write FizzBuzz for 1–15 in all five languages without looking anything up. Which language fought you the most?</summary><div><p>Most people trip on C&#39;s printf formats, Rust&#39;s <code>1..=15</code> (inclusive range syntax) and Go&#39;s lack of a ternary operator. Note it down: those are your practice targets.</p></div></details>
</div>
`;export{e as default};

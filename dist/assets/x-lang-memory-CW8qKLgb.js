const t=`<p class="goal">What happens to data when you assign it, pass it or return it, and who frees it, in each language. Theory: <a class="xref" data-old="c10">Memory &amp; Pointers</a>.</p>
<h3>The central question: copy or share?</h3>
<table>
<tr><th>Assign or pass a…</th><th>Python</th><th>TS</th><th>Go</th><th>Rust</th><th>C</th></tr>
<tr><td>number</td><td>share an immutable object (same effect as a copy)</td><td>copy</td><td>copy</td><td>copy (<code>Copy</code> type)</td><td>copy</td></tr>
<tr><td>list / array</td><td><b>share</b></td><td><b>share</b></td><td>slice: <b>share the backing array</b>; <code>[N]T</code>: copy</td><td>Vec: <b>move</b> (the old name is invalid)</td><td>array decays to a pointer: <b>share</b></td></tr>
<tr><td>record / object</td><td><b>share</b></td><td><b>share</b></td><td>struct: <b>copy</b> (<code>*T</code> to share)</td><td>struct: <b>move</b> (or <code>&amp;</code> to borrow)</td><td>struct: <b>copy</b> (pointer to share)</td></tr>
<tr><td>map</td><td>share</td><td>share</td><td>share (a map is a reference type)</td><td>move</td><td>n/a</td></tr>
</table>
<h3>The same bug, and how each language handles it</h3>
<pre data-lang="python"><code class="language-python">defaults = {"qty": 1}
order = defaults            # shared!
order["qty"] = 5            # defaults["qty"] is now 5 too
order = dict(defaults)      # fix: copy (copy.deepcopy for nested data)</code></pre>
<pre data-lang="go"><code class="language-go">type Cfg struct{ Qty int; Tags []string }
a := Cfg{Qty: 1, Tags: []string{"x"}}
b := a            // struct copied… but Tags still SHARES its backing array
b.Qty = 5         // a.Qty stays 1
b.Tags[0] = "y"   // a.Tags[0] is now "y"!</code></pre>
<pre data-lang="rust"><code class="language-rust">let a = vec![1, 2];
let b = a;            // move: a can no longer be used, so the shared-mutation bug can't compile
let c = b.clone();    // explicit deep copy when you really want two</code></pre>
<h3>Who frees memory?</h3>
<table>
<tr><th>Language</th><th>Strategy</th><th>What you must still do</th></tr>
<tr><td>Python</td><td>reference counting + cycle collector</td><td>close files and sockets (<code>with</code>); avoid ever-growing caches</td></tr>
<tr><td>TS/JS</td><td>tracing GC (V8)</td><td>remove listeners and timers; watch closures holding big objects</td></tr>
<tr><td>Go</td><td>concurrent tracing GC</td><td>close resources (<code>defer f.Close()</code>); avoid goroutine leaks</td></tr>
<tr><td>Rust</td><td>ownership: freed when the owner goes out of scope (Drop)</td><td>nothing for memory; choose Rc/Arc for shared ownership</td></tr>
<tr><td>C</td><td>manual (<code>malloc</code>/<code>free</code>)</td><td>free everything exactly once; document who owns each pointer</td></tr>
</table>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">think</span> In each language, write a function that "adds a tag" to an order it receives, then check in the caller whether the original changed. Explain each result.</summary><div><p>Python/TS: yes, since objects are shared. Go: no if the struct is passed by value, unless the tags slice has spare capacity (subtle!); yes with <code>*Order</code>. Rust: it has to take <code>&amp;mut Order</code>, so mutation is explicit at the call site. C: no with a struct by value; yes with <code>Order *</code>.</p></div></details>
</div>
`;export{t as default};

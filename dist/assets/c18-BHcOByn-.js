const e=`<p class="goal">Using types to make invalid states impossible to represent.</p>
<h3>Generics (parametric polymorphism)</h3>
<p>Write one piece of code that works for many types while keeping type safety. Think "a list of <i>T</i>" rather than "a list of anything".</p>
<pre data-lang="rust"><code class="language-rust">fn largest&lt;T: PartialOrd + Copy&gt;(xs: &amp;[T]) -&gt; T {   // T must be comparable: a "trait bound"
    let mut m = xs[0];
    for &amp;x in xs { if x &gt; m { m = x; } }
    m
}</code></pre>
<pre data-lang="typescript"><code class="language-typescript">function first&lt;T&gt;(xs: T[]): T | undefined { return xs[0]; }
const n = first([1, 2]);        // n: number | undefined, inferred</code></pre>
<pre data-lang="python"><code class="language-python">def first[T](xs: list[T]) -&gt; T | None:      # Python 3.12+ syntax; checked by mypy/pyright
    return xs[0] if xs else None</code></pre>
<p>How it's implemented differs. <b>Monomorphisation</b> (Rust, C++ templates) generates a specialised copy for each type: fastest, but bigger binaries and slower compiles. <b>Type erasure</b> (Java) keeps one copy, with types checked only at compile time. Go uses a hybrid approach.</p>
<h3>Algebraic data types (ADTs)</h3>
<ul>
<li><b>Product types</b> ("A <i>and</i> B"): structs and tuples. The number of possible values is the product of the parts.</li>
<li><b>Sum types</b> ("A <i>or</i> B"): tagged unions, Rust <code>enum</code>, TS discriminated unions. Exactly one variant at a time.</li>
</ul>
<pre data-lang="rust"><code class="language-rust">enum OrderStatus {
    Placed,
    Paid { txn_id: String },
    Shipped { tracking: String },
    Cancelled { reason: String },
}
fn label(s: &amp;OrderStatus) -&gt; String {
    match s {                                    // EXHAUSTIVE: add a variant and every match
        OrderStatus::Placed =&gt; "placed".into(),  // that forgets it becomes a compile error
        OrderStatus::Paid { txn_id } =&gt; format!("paid ({txn_id})"),
        OrderStatus::Shipped { tracking } =&gt; format!("shipped {tracking}"),
        OrderStatus::Cancelled { reason } =&gt; format!("cancelled: {reason}"),
    }
}</code></pre>
<p>Compare the "bag of optional fields" design (<code>status: str; txn_id: str | None; tracking: str | None</code>), which allows nonsense such as a "placed" order with a tracking number. <b>Make illegal states unrepresentable.</b></p>
<h3>Null safety</h3>
<p>Tony Hoare called the null reference his "billion-dollar mistake": any reference might secretly be null, so crashes happen at runtime. Modern languages make absence explicit: Rust's <code>Option&lt;T&gt;</code> (<code>Some(x)</code> / <code>None</code>), Kotlin and Swift's <code>T?</code>, TS <code>strictNullChecks</code>. The compiler forces you to handle the "none" case before you can use the value.</p>
<h3>Other terms</h3>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td><b>Type inference</b></td><td>The compiler deduces types (<code>let x = 5</code>).</td></tr>
<tr><td><b>Nominal vs structural</b></td><td>Types are compatible by <i>name</i> (Java, Rust) or by <i>shape</i> (TS, Go interfaces).</td></tr>
<tr><td><b>Subtyping / variance</b></td><td>Whether <code>List&lt;Cat&gt;</code> may be used as <code>List&lt;Animal&gt;</code>. It's safe for read-only collections (covariant) but not for writable ones.</td></tr>
<tr><td><b>Gradual typing</b></td><td>Optional types added to a dynamic language (Python hints, TypeScript over JS).</td></tr>
<tr><td><b>Newtype</b></td><td>Wrapping a primitive so it can't be confused: <code>struct UserId(u64)</code> vs <code>struct OrderId(u64)</code>.</td></tr>
<tr><td><b>Type coercion / cast</b></td><td>Implicit vs explicit conversion between types.</td></tr>
</table>
<div class="callout key"><b class="t">Trade-offs: static vs dynamic typing</b><p><b>Static pros:</b> bugs caught before running; fearless refactoring; the IDE knows everything; types act as documentation; faster code. <b>Static cons:</b> more upfront ceremony; slower prototyping; complex type errors. <b>Dynamic pros:</b> fast to write, flexible, great for scripts and exploration. <b>Dynamic cons:</b> type bugs show up in production; large codebases get hard to change safely. <b>Trend:</b> gradual typing gives you both (TypeScript, typed Python).</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>24.1 <span class="levels">think</span> Model a payment in TypeScript as a discriminated union so that "paid" requires a txnId and "failed" requires a reason. Try constructing an invalid state.</summary><div><p><code>type Payment = {s:"pending"} | {s:"paid"; txnId:string} | {s:"failed"; reason:string}</code>. Writing <code>{s:"paid"}</code> without a txnId is a compile error: illegal states are unrepresentable.</p></div></details>
</div>
`;export{e as default};

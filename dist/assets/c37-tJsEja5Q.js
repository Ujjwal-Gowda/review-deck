const e=`<p class="goal">Ownership, borrowing, traits and enums: the ideas behind the hardest language here to learn.</p>
<h3>Mental model</h3>
<ul>
<li>Compiled (LLVM), statically typed, with <b>no GC</b>. Memory safety and data-race freedom are proven at compile time by <b>ownership + borrowing</b> (<a class="xref" data-old="c10">chapter 10</a>). Performance is like C and C++.</li>
<li><b>Immutable by default</b>; <b>expressions everywhere</b> (<code>if</code>, <code>match</code> and blocks all return values).</li>
<li>Data is modelled with <b>structs</b> and <b>enums</b> (real sum types); behaviour with <b>traits</b>. There's no inheritance.</li>
<li>No null (<code>Option</code>), no exceptions (<code>Result</code>). <code>panic!</code> is only for bugs.</li>
<li><b>Zero-cost abstractions:</b> iterators and generics compile down to hand-written-loop speed.</li>
<li>The compiler is strict but helpful: its error messages are the tutorial. <b>Read them fully.</b></li>
</ul>
<pre data-lang="rust"><code class="language-rust">use std::collections::HashMap;
use std::fmt;

#[derive(Debug, Clone, PartialEq)]
enum Status { Placed, Paid { txn: String }, Shipped }

#[derive(Debug, Clone)]
struct Item { sku: String, qty: u32, price_paise: u64 }

#[derive(Debug)]
struct Order { id: u64, items: Vec&lt;Item&gt;, status: Status }

impl Order {
    fn total(&amp;self) -&gt; u64 {                               // &amp;self: borrow, read-only
        self.items.iter().map(|i| i.qty as u64 * i.price_paise).sum()
    }
    fn pay(&amp;mut self, txn: &amp;str) -&gt; Result&lt;(), String&gt; {   // &amp;mut self: exclusive borrow
        match self.status {
            Status::Placed =&gt; { self.status = Status::Paid { txn: txn.to_string() }; Ok(()) }
            _ =&gt; Err(format!("order {} can't be paid in state {:?}", self.id, self.status)),
        }
    }
}

impl fmt::Display for Order {                              // a trait implementation
    fn fmt(&amp;self, f: &amp;mut fmt::Formatter) -&gt; fmt::Result {
        write!(f, "#{} ₹{:.2}", self.id, self.total() as f64 / 100.0)
    }
}

fn find(orders: &amp;HashMap&lt;u64, Order&gt;, id: u64) -&gt; Option&lt;&amp;Order&gt; {
    orders.get(&amp;id)
}

fn main() -&gt; Result&lt;(), String&gt; {
    let mut orders = HashMap::new();
    orders.insert(1, Order { id: 1, items: vec![Item { sku: "milk".into(), qty: 2, price_paise: 6000 }], status: Status::Placed });

    if let Some(o) = find(&amp;orders, 1) { println!("{o}"); }
    orders.get_mut(&amp;1).ok_or("no order")?.pay("TXN42")?;     // ? propagates errors
    let skus: Vec&lt;&amp;str&gt; = orders.values().flat_map(|o| o.items.iter().map(|i| i.sku.as_str())).collect();
    println!("{skus:?}");
    Ok(())
}</code></pre>
<h3>Concepts to master, in this order</h3>
<ol>
<li><b>Ownership, move, clone and borrowing</b> (<code>&amp;</code> vs <code>&amp;mut</code>). <code>String</code> (owned, heap) vs <code>&amp;str</code> (borrowed view); <code>Vec&lt;T&gt;</code> vs <code>&amp;[T]</code>.</li>
<li><b>Enums + <code>match</code></b>, <code>Option</code>/<code>Result</code>, <code>?</code>, <code>if let</code>, and combinators like <code>map</code>, <code>ok_or</code>, <code>unwrap_or</code>.</li>
<li><b>Traits and generics:</b> <code>impl Trait</code>, trait bounds, and <code>dyn Trait</code> (dynamic dispatch) vs generics (static dispatch). The derivable traits: Debug, Clone, Copy, PartialEq, Hash.</li>
<li><b>Iterators</b> and closures (<code>Fn</code>/<code>FnMut</code>/<code>FnOnce</code>).</li>
<li><b>Lifetimes</b> (<code>'a</code>): annotations that tell the compiler how long borrows last. Usually inferred; learn them when the compiler asks.</li>
<li><b>Smart pointers:</b> <code>Box</code> (heap), <code>Rc</code>/<code>Arc</code> (shared ownership), <code>RefCell</code>/<code>Mutex</code> (interior mutability).</li>
<li><b>Concurrency:</b> <code>std::thread</code>, channels, <code>Arc&lt;Mutex&lt;T&gt;&gt;</code>, the <code>Send</code>/<code>Sync</code> traits; async with <b>tokio</b>.</li>
<li>Modules, crates, <code>cargo</code>, and the ecosystem: serde (serialisation), clap (CLIs), anyhow/thiserror (errors), tokio + axum (web), rayon (data parallelism).</li>
</ol>
<h3>Traps</h3>
<ul>
<li><b>Fighting the borrow checker:</b> it's usually pointing at a real design problem. Restructure: shorter borrows, clone small things, use indices instead of references, and separate reads from writes.</li>
<li>Scattering <code>.unwrap()</code> everywhere (it panics on error). Use <code>?</code> and handle errors properly.</li>
<li>Trying to write OOP inheritance hierarchies or linked graphs of references. Use enums, traits, and arenas/indices instead.</li>
<li>Integer overflow panics in debug builds but wraps in release builds. Use <code>checked_*</code> where it matters.</li>
</ul>
<h3>Learning path</h3>
<ol>
<li><b>"The Rust Programming Language"</b> (the Book, free at doc.rust-lang.org/book), all of it, typing every example. Do the <b>Rustlings</b> exercises alongside it.</li>
<li><b>Rust by Example</b> for reference; then "Rust for Rustaceans" (Gjengset) once you're comfortable.</li>
<li>Build: a <code>grep</code> clone (the Book's <a class="xref" data-old="c12">chapter 12</a>); a CLI with clap + serde that reads CSV and outputs JSON; a multithreaded file hasher with rayon; an axum JSON API; a small interpreter for a calculator language (it teaches enums, recursion and ownership all at once).</li>
</ol>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>31.1 <span class="levels">think</span> Write <code>fn longest&lt;'a&gt;(a: &amp;'a str, b: &amp;'a str) -&gt; &amp;'a str</code>. Then try to return a reference to a <code>String</code> created inside the function and read the compiler error.</summary><div><p>The error "returns a value referencing data owned by the current function" appears because the String is dropped at the end of the function. Return an owned <code>String</code> instead.</p></div></details>
</div>
`;export{e as default};

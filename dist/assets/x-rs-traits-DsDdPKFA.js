const t=`<p class="goal">Traits define shared behaviour; generics write code once for many types. Together they're how Rust does polymorphism without inheritance.</p>
<h3>Defining and implementing traits</h3>
<pre data-lang="rust"><code class="language-rust">pub trait Notifier {
    fn send(&amp;self, to: &amp;str, msg: &amp;str) -&gt; Result&lt;(), String&gt;;
    fn send_all(&amp;self, tos: &amp;[&amp;str], msg: &amp;str) -&gt; Result&lt;(), String&gt; {   // default method
        for t in tos { self.send(t, msg)?; }
        Ok(())
    }
}
struct Sms { sender: String }
impl Notifier for Sms {
    fn send(&amp;self, to: &amp;str, msg: &amp;str) -&gt; Result&lt;(), String&gt; { println!("SMS {} → {to}: {msg}", self.sender); Ok(()) }
}</code></pre>
<h3>Static vs dynamic dispatch</h3>
<pre data-lang="rust"><code class="language-rust">fn announce&lt;N: Notifier&gt;(n: &amp;N, msg: &amp;str) { n.send("owner", msg).ok(); }     // generic: monomorphised, inlined, fastest
fn announce2(n: &amp;impl Notifier, msg: &amp;str) {}                                   // the same thing, shorter syntax
fn many(ns: &amp;[Box&lt;dyn Notifier&gt;]) { for n in ns { n.send("x", "y").ok(); } }      // trait objects: mixed types at runtime (vtable)
fn with_where&lt;T&gt;(x: T) where T: Clone + std::fmt::Debug {}                         // several bounds</code></pre>
<h3>The standard traits you'll use constantly</h3>
<table>
<tr><th>Trait</th><th>Gives you</th><th>How</th></tr>
<tr><td><code>Debug</code></td><td><code>{:?}</code> printing</td><td><code>#[derive(Debug)]</code></td></tr>
<tr><td><code>Clone</code> / <code>Copy</code></td><td><code>.clone()</code> / implicit copies</td><td>derive</td></tr>
<tr><td><code>PartialEq</code>, <code>Eq</code>, <code>Hash</code></td><td><code>==</code>, and use as a HashMap key</td><td>derive</td></tr>
<tr><td><code>PartialOrd</code>, <code>Ord</code></td><td><code>&lt;</code> and sorting</td><td>derive (compares fields in order)</td></tr>
<tr><td><code>Default</code></td><td><code>T::default()</code>, <code>..Default::default()</code></td><td>derive or implement</td></tr>
<tr><td><code>Display</code></td><td><code>{}</code> formatting, <code>.to_string()</code></td><td>implement by hand</td></tr>
<tr><td><code>From</code> / <code>Into</code></td><td>conversions (<code>?</code> uses From for errors)</td><td>implement <code>From</code></td></tr>
<tr><td><code>Iterator</code></td><td>works in <code>for</code> plus all the adaptors</td><td>implement <code>next()</code></td></tr>
<tr><td><code>serde::Serialize/Deserialize</code></td><td>JSON, TOML…</td><td>derive (the serde crate)</td></tr>
</table>
<pre data-lang="rust"><code class="language-rust">use std::fmt;
impl fmt::Display for Item {
    fn fmt(&amp;self, f: &amp;mut fmt::Formatter) -&gt; fmt::Result { write!(f, "{} ×{} = ₹{:.2}", self.sku, self.qty, self.total() as f64 / 100.0) }
}
impl From&lt;(&amp;str, u64)&gt; for Item { fn from((sku, p): (&amp;str, u64)) -&gt; Self { Item::new(sku, p) } }
let it: Item = ("milk", 6000).into();

struct Countdown(u32);
impl Iterator for Countdown {
    type Item = u32;
    fn next(&amp;mut self) -&gt; Option&lt;u32&gt; { if self.0 == 0 { None } else { self.0 -= 1; Some(self.0 + 1) } }
}
let v: Vec&lt;u32&gt; = Countdown(3).collect();   // [3, 2, 1]</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Define <code>trait Shape { fn area(&amp;self) -&gt; f64; fn name(&amp;self) -&gt; String { "shape".into() } }</code>, implement it for Circle and Rect, then compute the total area of a <code>Vec&lt;Box&lt;dyn Shape&gt;&gt;</code> and, separately, of a <code>&amp;[Circle]</code> with a generic function.</summary><div><p>Dynamic: <code>shapes.iter().map(|s| s.area()).sum::&lt;f64&gt;()</code>. Generic: <code>fn total&lt;S: Shape&gt;(xs: &amp;[S]) -&gt; f64</code>. The generic version can&#39;t hold mixed shapes; the dyn version can. That&#39;s the trade-off.</p></div></details>
</div>
`;export{t as default};

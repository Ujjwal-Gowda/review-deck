const e=`<p class="goal">The patterns you'll actually use, each introduced by the problem it solves, in the language where it's most natural.</p>
<p><a class="xref" data-old="c21">Chapter 33</a> has the name-and-purpose table. Here are the working versions.</p>
<h3>Strategy: swap an algorithm</h3>
<p><b>Problem:</b> delivery fee rules differ by zone and change often.</p>
<pre data-lang="typescript"><code class="language-typescript">type FeeRule = (order: Order) =&gt; number;           // in TS/Go/Rust, a strategy is often just a function
const flat: FeeRule = () =&gt; 3000;
const freeAbove = (min: number): FeeRule =&gt; o =&gt; (o.total &gt;= min ? 0 : 3000);
const rules: Record&lt;Zone, FeeRule&gt; = { central: freeAbove(49900), outskirts: flat };
const fee = rules[order.zone](order);</code></pre>
<h3>Observer / pub-sub: react to events without coupling</h3>
<p><b>Problem:</b> when an order is placed, inventory, SMS and analytics should all react, but the order code shouldn't know about any of them.</p>
<pre data-lang="typescript"><code class="language-typescript">type Handler&lt;T&gt; = (e: T) =&gt; void | Promise&lt;void&gt;;
class EventBus&lt;Events extends Record&lt;string, unknown&gt;&gt; {
  private hs: { [K in keyof Events]?: Handler&lt;Events[K]&gt;[] } = {};
  on&lt;K extends keyof Events&gt;(k: K, h: Handler&lt;Events[K]&gt;) { (this.hs[k] ??= []).push(h); }
  async emit&lt;K extends keyof Events&gt;(k: K, e: Events[K]) { await Promise.all((this.hs[k] ?? []).map(h =&gt; h(e))); }
}
const bus = new EventBus&lt;{ orderPlaced: { id: number } }&gt;();
bus.on("orderPlaced", e =&gt; reserveStock(e.id));</code></pre>
<h3>Adapter: wrap a vendor behind your interface</h3>
<pre data-lang="go"><code class="language-go">type Payments interface{ Charge(ctx context.Context, paise int64, ref string) (string, error) }
type razorpayAdapter struct{ c *razorpay.Client }       // the vendor SDK stays in one file
func (a razorpayAdapter) Charge(ctx context.Context, p int64, ref string) (string, error) {
    res, err := a.c.Order.Create(map[string]any{"amount": p, "receipt": ref}, nil)
    if err != nil { return "", fmt.Errorf("razorpay: %w", err) }
    return res["id"].(string), nil
}   // switching providers means writing a new adapter; the rest of the app never changes</code></pre>
<h3>Decorator / middleware: add behaviour around a call</h3>
<pre data-lang="go"><code class="language-go">func Logging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        slog.Info("request", "path", r.URL.Path, "dur", time.Since(start))
    })
}
handler := Logging(Auth(RateLimit(mux)))     // stack cross-cutting concerns</code></pre>
<h3>Builder: complex construction, readable call sites</h3>
<pre data-lang="rust"><code class="language-rust">let req = Request::builder().method("POST").uri("/orders").header("Idempotency-Key", key).body(json)?;</code></pre>
<p>In Go, the equivalent idiom is <b>functional options</b>: <code>NewServer(addr, WithTimeout(5*time.Second), WithTLS(cfg))</code>.</p>
<h3>State machine: explicit states and legal transitions</h3>
<pre data-lang="rust"><code class="language-rust">enum Order { Placed, Paid { txn: String }, Packed, Shipped, Cancelled }
impl Order {
    fn pack(self) -&gt; Result&lt;Order, String&gt; {
        match self { Order::Paid { .. } =&gt; Ok(Order::Packed), s =&gt; Err(format!("can't pack from {s:?}")) }
    }
}   // illegal transitions are impossible to express by accident</code></pre>
<h3>Repository: hide persistence behind a collection-like interface</h3>
<pre data-lang="python"><code class="language-python">class OrderRepo(Protocol):
    def get(self, id: int) -&gt; Order: ...
    def add(self, o: Order) -&gt; None: ...
class SqlOrderRepo: ...          # production
class InMemoryOrderRepo: ...     # tests: fast, no database needed</code></pre>
<h3>Command: turn actions into objects</h3>
<p><b>Problem:</b> undo/redo, queueing jobs, audit logs. Represent each action as data, e.g. <code>{"type": "adjust_stock", "sku": "milk", "delta": -2}</code>. Then you can queue it, log it, replay it, or reverse it.</p>
<div class="callout warn"><b class="t">Pattern misuse</b><p>Patterns are a vocabulary, not a goal. Many of the "Gang of Four" patterns exist to work around missing language features. In languages with first-class functions, Strategy, Command and Observer shrink to a function, a value and a list of callbacks. Apply a pattern only after you feel the problem it solves.</p></div>
<details class="ex"><summary>36.1 <span class="levels">think</span> Implement a retry decorator for any async function in TS: <code>withRetry(fn, {tries, baseMs})</code> with exponential backoff and jitter.</summary><div><pre data-lang="typescript"><code class="language-typescript">function withRetry&lt;A extends unknown[], R&gt;(fn: (...a: A) =&gt; Promise&lt;R&gt;, { tries = 3, baseMs = 200 } = {}) {
  return async (...a: A): Promise&lt;R&gt; =&gt; {
    for (let i = 0; ; i++) {
      try { return await fn(...a); }
      catch (e) {
        if (i + 1 &gt;= tries) throw e;
        await new Promise(r =&gt; setTimeout(r, baseMs * 2 ** i * (0.5 + Math.random())));
      }
    }
  };
}</code></pre></div></details>
`;export{e as default};

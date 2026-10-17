const e=`<p class="goal">Give code its dependencies instead of letting it build them. It's the single change that makes code testable.</p>
<h3>The problem</h3>
<pre data-lang="python"><code class="language-python">class OrderService:
    def place(self, cart):
        db = psycopg.connect(os.environ["DATABASE_URL"])   # hidden dependency #1
        now = datetime.now()                                # hidden dependency #2 (the clock!)
        requests.post("https://sms…", …)                    # hidden dependency #3
# To test this you need a real database, a real SMS gateway, and time travel.</code></pre>
<h3>Constructor injection (the default)</h3>
<pre data-lang="python"><code class="language-python">class OrderService:
    def __init__(self, repo: OrderRepo, sms: Sms, clock: Callable[[], datetime]):
        self.repo, self.sms, self.clock = repo, sms, clock
    def place(self, cart):
        order = Order.from_cart(cart, placed_at=self.clock())
        self.repo.add(order); self.sms.send(order.phone, "Order received")
        return order

# test: fakes in, assertions out; no network, no DB, and a deterministic time
svc = OrderService(InMemoryRepo(), FakeSms(), clock=lambda: datetime(2026, 9, 25, 10, 0))</code></pre>
<pre data-lang="go"><code class="language-go">type Service struct { repo Repo; sms Sms; now func() time.Time }
func NewService(repo Repo, sms Sms, now func() time.Time) *Service { return &amp;Service{repo, sms, now} }</code></pre>
<pre data-lang="typescript"><code class="language-typescript">export function makeOrderService(deps: { repo: OrderRepo; sms: Sms; now: () =&gt; Date }) {
  return { place: async (cart: Cart) =&gt; { /* uses deps.* */ } };
}</code></pre>
<h3>The composition root</h3>
<p>Create the real objects in <b>one place</b> (<code>main.go</code>, <code>main.py</code>, the server entry file) and pass them down. Everything else just receives what it needs.</p>
<pre data-lang="go"><code class="language-go">func main() {
    db := mustOpenDB(os.Getenv("DATABASE_URL"))
    svc := orders.NewService(postgres.NewRepo(db), twilio.New(cfg.SMSKey), time.Now)
    http.ListenAndServe(":8080", httpapi.NewRouter(svc))
}</code></pre>
<h3>DI containers and frameworks</h3>
<p>Java/Spring, NestJS (TS), .NET and FastAPI's <code>Depends</code> wire dependencies automatically. They're useful in large apps, but they add "magic" that makes it hard to see where things come from. Go and Rust communities mostly prefer plain constructors. <b>Learn manual DI first</b>: containers only automate it.</p>
<div class="callout key"><b class="t">Trade-offs</b><p><b>Pros:</b> testable, swappable implementations, explicit dependencies (a constructor that takes 9 parameters tells you the class does too much). <b>Cons:</b> more wiring code; indirection. <b>Inject:</b> I/O, the clock, randomness, config, third-party APIs. <b>Don't inject:</b> pure helper functions and value objects. Just call them.</p></div>
<details class="ex"><summary>37.1 <span class="levels">basic</span> Refactor a function that calls <code>random.random()</code> and <code>time.time()</code> internally so it can be tested deterministically.</summary><div><p>Add parameters with defaults: <code>def f(..., rng=random.random, now=time.time)</code>. Tests pass <code>rng=lambda: 0.42</code> and <code>now=lambda: 1_700_000_000</code>.</p></div></details>
`;export{e as default};

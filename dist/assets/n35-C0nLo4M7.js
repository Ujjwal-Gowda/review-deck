const e=`<p class="goal">How to structure a whole application, and when <i>not</i> to use each style.</p>
<h3>The styles</h3>
<table>
<tr><th>Style</th><th>Shape</th><th>Use when</th><th>Avoid when</th></tr>
<tr><td><b>Monolith</b></td><td>one deployable, one codebase, one DB</td><td>almost always to start: small team, new product</td><td>…rarely a mistake early on</td></tr>
<tr><td><b>Modular monolith</b></td><td>one deployable, strict internal modules (orders, inventory, payments) with explicit interfaces and owned tables</td><td>a growing product and team; the best default at scale</td><td>tiny scripts</td></tr>
<tr><td><b>Layered</b> (presentation → service → data)</td><td>horizontal layers</td><td>CRUD apps</td><td>complex domains (logic leaks into every layer)</td></tr>
<tr><td><b>MVC</b></td><td>Model / View / Controller</td><td>server-rendered web apps (Rails, Django)</td><td>as your whole-system architecture</td></tr>
<tr><td><b>Clean / Hexagonal</b> (ports and adapters)</td><td>the domain at the centre; HTTP, DB and queues are adapters plugged into ports</td><td>rich business logic, many integrations, long life</td><td>simple CRUD (too much ceremony)</td></tr>
<tr><td><b>Event-driven</b></td><td>components emit and react to events via a broker</td><td>decoupled workflows, audit trails, fan-out ("order placed" → stock, SMS, analytics)</td><td>when you need simple request/response and easy debugging</td></tr>
<tr><td><b>Microservices</b></td><td>many independently deployed services, each owning its data</td><td>many teams, independent scaling or release needs, clear domain boundaries</td><td>a small team: you pay for distributed failures, network latency, data consistency and DevOps overhead</td></tr>
<tr><td><b>Serverless</b></td><td>functions triggered by events, with managed infrastructure</td><td>spiky or low traffic, glue code, webhooks</td><td>long-running, stateful or latency-critical work; vendor lock-in</td></tr>
</table>
<h3>The evolution path</h3>
<div class="diagram">small app ──► monolith ──► modular monolith (enforce boundaries) ──► extract ONE service only when a module has a real
                                                                       reason: different scaling, deploy cadence, team, or tech</div>
<p>"Microservices are advanced, therefore better" is the most expensive myth in the industry. Many companies have merged services back into modular monoliths.</p>
<h3>Hexagonal architecture in a folder tree (Go)</h3>
<pre data-lang="plaintext"><code class="language-plaintext">cmd/api/main.go            ← composition root: wires the adapters into the domain
internal/orders/           ← DOMAIN: entities, rules, the service, and the port interfaces
    order.go  service.go  ports.go   (type Repo interface{…}; type Payments interface{…})
internal/postgres/         ← ADAPTER: implements orders.Repo with SQL
internal/razorpay/         ← ADAPTER: implements orders.Payments
internal/httpapi/          ← ADAPTER: HTTP handlers call orders.Service
Rule: internal/orders imports NOTHING from the adapters.</code></pre>
<h3>What actually matters, whatever the style</h3>
<ul>
<li><b>Boundaries:</b> each module has a small public interface; everything else is private.</li>
<li><b>Dependency direction:</b> it points inward, toward business rules.</li>
<li><b>Data ownership:</b> one module owns each table; others go through its interface, never its SQL.</li>
<li><b>Coupling and cohesion:</b> high cohesion inside a module, low coupling between modules.</li>
</ul>
<details class="ex"><summary>35.1 <span class="levels">think</span> For FreshOn (POS, online orders, inventory, delivery, attendance), sketch the modules of a modular monolith: what does each own, and which events cross the boundaries?</summary><div><p>One reasonable split: <b>catalog</b> (products, prices), <b>inventory</b> (stock levels, movements), <b>orders</b> (carts, orders, states), <b>payments</b>, <b>delivery</b> (assignments, tracking), <b>people</b> (staff, attendance). Events: OrderPlaced → inventory reserves stock; PaymentCaptured → orders marks paid; OrderPacked → delivery assigns a rider. Each module owns its tables.</p></div></details>
`;export{e as default};

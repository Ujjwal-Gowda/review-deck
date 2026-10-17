const e=`<p class="goal">The five SOLID principles as concrete refactorings, not slogans, with the misuse of each.</p>
<h3>S: Single Responsibility</h3>
<p>"A module should have one reason to change", meaning one <i>actor</i> or stakeholder whose needs drive it. It doesn't mean "one function per class".</p>
<pre data-lang="typescript"><code class="language-typescript">// ✗ changes when the tax rules change, when the PDF layout changes, AND when the DB schema changes
class Invoice { calcTax() {} renderPdf() {} save() {} }
// ✓ three reasons to change, three homes
const tax = calcTax(invoice);            // pricing rules (pure)
const pdf = renderInvoicePdf(invoice);   // presentation
await invoiceRepo.save(invoice);         // persistence</code></pre>
<p><b>Misuse:</b> splitting everything into tiny pieces until you need 9 files to follow one feature.</p>
<h3>O: Open/Closed</h3>
<p>Add new behaviour by adding code, not by editing working code. The usual mechanism is polymorphism, or a registry.</p>
<pre data-lang="go"><code class="language-go">type Notifier interface{ Notify(ctx context.Context, to, msg string) error }
var notifiers = map[string]Notifier{"sms": SMS{}, "email": Email{}}   // WhatsApp = one new type + one line
func Send(kind, to, msg string) error { return notifiers[kind].Notify(ctx, to, msg) }</code></pre>
<p><b>Misuse:</b> building extension points for variations that never arrive (YAGNI). Wait until the second or third case.</p>
<h3>L: Liskov Substitution</h3>
<p>Anything that accepts a type must work correctly with every subtype: no stronger preconditions, no weaker guarantees, no surprise exceptions. The classic violation is a <code>ReadOnlyList</code> subclass whose <code>add()</code> throws. In practice, if a subtype has to disable or override a parent method with "not supported", the hierarchy is wrong.</p>
<h3>I: Interface Segregation</h3>
<p>Clients shouldn't depend on methods they don't use. Go's standard library is the model: <code>io.Reader</code> has exactly one method, so hundreds of types satisfy it.</p>
<pre data-lang="go"><code class="language-go">type Reader interface { Read(p []byte) (n int, err error) }
type Writer interface { Write(p []byte) (n int, err error) }
type ReadWriter interface { Reader; Writer }   // compose small interfaces into bigger ones as needed
// Go proverb: "The bigger the interface, the weaker the abstraction."</code></pre>
<h3>D: Dependency Inversion</h3>
<p>High-level policy (business rules) shouldn't import low-level details (Postgres, Stripe, SMTP). Both depend on an abstraction <b>owned by the high-level side</b>.</p>
<div class="diagram">✗  OrderService ──imports──► PostgresOrderRepo            (business logic knows about SQL)
✓  OrderService ──uses──► OrderRepo (interface, defined in the domain package)
                                   ▲
            PostgresOrderRepo ─────┘ implements             (the detail depends on the policy)</div>
<pre data-lang="rust"><code class="language-rust">pub trait OrderRepo { fn get(&amp;self, id: u64) -&gt; Result&lt;Order, RepoError&gt;; }
pub struct OrderService&lt;R: OrderRepo&gt; { repo: R }            // tests pass an in-memory R
impl&lt;R: OrderRepo&gt; OrderService&lt;R&gt; {
    pub fn total(&amp;self, id: u64) -&gt; Result&lt;u64, RepoError&gt; { Ok(self.repo.get(id)?.total()) }
}</code></pre>
<p><b>Misuse:</b> an interface for every class, each with exactly one implementation forever. Add the abstraction at real boundaries (I/O, third parties, things you'll swap or fake in tests).</p>
<div class="callout key"><b class="t">Trade-offs</b><p>SOLID helps most in big, long-lived codebases with several contributors. In a 300-line script it's overhead. The goal behind all five is the same: <b>keep changes local</b>. If a typical change touches one or two files, you're fine.</p></div>
<details class="ex"><summary>34.1 <span class="levels">think</span> A function <code>export_report(format)</code> has a 6-branch if/elif on "csv"/"json"/"xlsx"/… and grows every month. Refactor it using O and D.</summary><div><p>Define <code>Exporter</code> with <code>export(rows) -&gt; bytes</code>; implement one class per format; keep a registry <code>{"csv": CsvExporter(), …}</code>; <code>export_report</code> looks the format up. Adding a format now means one new class and one registry line, and no existing code is edited.</p></div></details>
`;export{e as default};

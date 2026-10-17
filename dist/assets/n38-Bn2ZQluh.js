const e=`<p class="goal">Splitting code into files and namespaces with clear boundaries, in each of your five languages.</p>
<h3>How each language organises code</h3>
<table>
<tr><th>Language</th><th>Unit</th><th>Visibility</th><th>Import</th></tr>
<tr><td>Python</td><td>module = file; package = directory</td><td>convention: <code>_private</code>; <code>__all__</code> lists the public names</td><td><code>from shop.orders import place</code></td></tr>
<tr><td>TypeScript</td><td>ES module = file</td><td>only what you <code>export</code> is visible</td><td><code>import { place } from "./orders.js"</code></td></tr>
<tr><td>Go</td><td><b>package = directory</b> (all its files share scope); module = repo (<code>go.mod</code>)</td><td>Capitalised names are exported; <code>internal/</code> directories can only be imported from inside their parent</td><td><code>import "github.com/you/shop/orders"</code></td></tr>
<tr><td>Rust</td><td>crate = compilation unit; <code>mod</code> tree inside it</td><td>private by default; <code>pub</code>, <code>pub(crate)</code></td><td><code>use crate::orders::place;</code></td></tr>
<tr><td>C</td><td>translation unit = <code>.c</code> file; a header (<code>.h</code>) declares the interface</td><td><code>static</code> = file-private</td><td><code>#include "orders.h"</code> (textual copy-paste by the preprocessor)</td></tr>
</table>
<h3>Designing module boundaries</h3>
<ul>
<li><b>Organise by feature, not by technical type:</b> prefer <code>orders/ inventory/ payments/</code> over <code>controllers/ models/ services/</code>. Things that change together live together.</li>
<li><b>Deep modules</b> (John Ousterhout): a small interface hiding a lot of implementation. <code>open()</code>/<code>read()</code> hide filesystems, caches and drivers. Shallow modules (a big interface, little behind it) add complexity without hiding any.</li>
<li><b>Minimise the public surface:</b> everything public is a promise you'll have to keep.</li>
<li><b>No import cycles:</b> Go and Rust (between crates) forbid them; Python and JS allow them but break at load time in confusing ways. A cycle means two modules are really one, or that a shared piece should move into a third module.</li>
</ul>
<h3>C headers: the most explicit interface/implementation split</h3>
<pre data-lang="c"><code class="language-c">/* stock.h: the public interface */
#ifndef STOCK_H
#define STOCK_H
typedef struct Stock Stock;           /* opaque type: callers can't see the fields */
Stock *stock_new(void);
int stock_remove(Stock *s, const char *sku, int qty);
void stock_free(Stock *s);
#endif
/* stock.c: the implementation; the struct definition and static helpers live only here */</code></pre>
<p>The "opaque pointer" trick is encapsulation in C, and it's the ancestor of the <code>private</code> keyword.</p>
<h3>Rust module tree</h3>
<pre data-lang="rust"><code class="language-rust">// src/lib.rs
pub mod orders;          // loads src/orders.rs or src/orders/mod.rs
mod db;                  // private to the crate
pub use orders::Order;   // re-export: users write shop::Order instead of shop::orders::Order</code></pre>
<details class="ex"><summary>38.1 <span class="levels">think</span> Two Python modules import each other and crash with "ImportError: cannot import name". Give two fixes.</summary><div><p>(1) Move the shared piece into a third module that both import. (2) Invert one dependency: pass a function or object in as a parameter instead of importing it. A local import inside a function is a last-resort patch, not a real fix.</p></div></details>
`;export{e as default};

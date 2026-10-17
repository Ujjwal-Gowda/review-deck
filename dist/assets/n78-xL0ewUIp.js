const t=`<p class="goal">Where and when HTML gets generated, and what each choice costs.</p>
<table>
<tr><th>Strategy</th><th>HTML generated</th><th>Good for</th><th>Cost</th></tr>
<tr><td><b>CSR</b> (client-side rendering)</td><td>in the browser, by JS</td><td>dashboards, apps behind a login</td><td>blank until the JS runs; weak SEO</td></tr>
<tr><td><b>SSR</b> (server-side rendering)</td><td>on the server, per request</td><td>personalised or fresh pages that must be indexed</td><td>a server on every request; time-to-first-byte depends on the data</td></tr>
<tr><td><b>SSG</b> (static generation)</td><td>at build time</td><td>docs, blogs, marketing</td><td>rebuild to update</td></tr>
<tr><td><b>ISR</b> (incremental static regeneration)</td><td>static, regenerated in the background after N seconds or on demand</td><td>product pages, catalogues</td><td>briefly stale content</td></tr>
<tr><td><b>Streaming SSR</b></td><td>the server sends the shell first, then streams slow parts (Suspense)</td><td>pages with some slow data</td><td>complexity</td></tr>
</table>
<p><b>Hydration:</b> SSR/SSG HTML arrives already rendered, then React downloads and "attaches" event handlers. Until then, the page is visible but not interactive. A mismatch between the server and client output (dates, <code>Math.random</code>, <code>window</code>) causes hydration errors.</p>
<pre data-lang="typescript"><code class="language-typescript">// Next.js App Router
export const revalidate = 300;                       // ISR: this page's data is re-fetched at most every 5 min
await fetch(url, { next: { revalidate: 60, tags: ["products"] } });
revalidateTag("products");                           // on-demand: after an admin edits a product
export const dynamic = "force-dynamic";              // opt out: always SSR</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>78.1 <span class="levels">basic</span> Classify these pages as CSR, SSR, SSG or ISR: the marketing homepage, a product page, the order-tracking page, and the admin dashboard.</summary><div><p>Homepage: SSG. Product page: ISR (revalidated every few minutes). Order tracking: SSR or CSR with live updates. Admin dashboard: CSR behind a login.</p></div></details>
</div>
`;export{t as default};

const e=`<p class="goal">What the browser does between receiving HTML and showing pixels, and why that's the key to frontend performance.</p>
<h3>The critical rendering path</h3>
<div class="diagram">HTML bytes → parse → DOM ─┐
CSS  bytes → parse → CSSOM ┴→ render tree → LAYOUT (geometry) → PAINT (pixels into layers) → COMPOSITE (GPU)
&lt;script&gt; without defer/async BLOCKS parsing: fetch, run, then continue</div>
<ul>
<li>CSS blocks rendering (the browser won't paint unstyled content), so keep critical CSS small.</li>
<li>Scripts: <code>defer</code> means download in parallel and run after parsing, in order (Vite's <code>type="module"</code> is deferred by default). <code>async</code> runs as soon as it's downloaded, in any order.</li>
<li><b>Reflow</b> (layout) happens when geometry changes: width, top, font size, adding DOM nodes. <b>Repaint</b>: colour changes. <b>Composite-only</b>: <code>transform</code> and <code>opacity</code>. That's why animations should use transform and opacity.</li>
<li><b>Layout thrashing:</b> alternating reads (<code>offsetHeight</code>) and writes (<code>style.height</code>) in a loop forces a layout on every iteration. Batch reads, then batch writes.</li>
</ul>
<h3>The event loop (browser)</h3>
<p>One main thread runs your JS, style, layout and paint. A long task (more than 50 ms of JS) freezes the page: clicks queue up and animations stutter. Order of work: take a task (event, timer), run it, drain <b>all microtasks</b> (promise callbacks), then possibly render (about 60 times a second, with <code>requestAnimationFrame</code> callbacks just before). Heavy computation belongs in Web Workers.</p>
<h3>Storage and the network in the browser</h3>
<table>
<tr><th>Storage</th><th>Size</th><th>Notes</th></tr>
<tr><td>Cookies</td><td>~4 KB</td><td>sent with every request; the right home for session IDs (HttpOnly)</td></tr>
<tr><td>localStorage / sessionStorage</td><td>~5 MB</td><td>synchronous, strings only; readable by any JS on the page, so never store tokens there</td></tr>
<tr><td>IndexedDB</td><td>large</td><td>async, structured; offline apps</td></tr>
<tr><td>Cache API + Service Worker</td><td>large</td><td>offline and PWA caching (and the stale-deploy problem mentioned for the demo kit)</td></tr>
</table>
<p><b>DevTools</b> is your debugger: Elements (DOM + computed styles), Console, Network (waterfall, timing, headers), Performance (flame chart of the main thread), Application (storage, service workers), Lighthouse (audits).</p>
<details class="ex"><summary>65.1 <span class="levels">basic</span> Record a Performance profile while one of the FreshOn demos plays. Find the longest task and the function behind it.</summary><div><p>DevTools → Performance → record → stop. Long tasks have red corners in the Main track. Click one to see the bottom-up list of the functions that took the time.</p></div></details>
`;export{e as default};

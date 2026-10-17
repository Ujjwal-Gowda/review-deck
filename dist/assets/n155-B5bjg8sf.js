const e=`<p class="goal">Numbers over time that tell you whether a system is healthy.</p>
<table>
<tr><th>Method</th><th>For</th><th>Signals</th></tr>
<tr><td><b>RED</b></td><td>services and endpoints</td><td><b>R</b>ate (requests/s), <b>E</b>rrors (failed/s or %), <b>D</b>uration (latency distribution)</td></tr>
<tr><td><b>USE</b></td><td>resources (CPU, disk, connection pools)</td><td><b>U</b>tilisation, <b>S</b>aturation (queued work), <b>E</b>rrors</td></tr>
<tr><td>Four golden signals (Google SRE)</td><td>everything</td><td>latency, traffic, errors, saturation</td></tr>
</table>
<h3>Metric types</h3>
<ul>
<li><b>Counter:</b> only goes up (requests total); you graph its rate.</li>
<li><b>Gauge:</b> goes up and down (queue depth, memory in use).</li>
<li><b>Histogram:</b> counts values in buckets, so you can compute percentiles (latency). <b>Use p50/p95/p99, never the average.</b></li>
</ul>
<ul>
<li><b>Labels / dimensions</b> (route, status, store) make metrics sliceable. <b>Beware high cardinality:</b> labelling by <code>user_id</code> or <code>order_id</code> creates millions of time series and can take down the metrics system.</li>
<li>Add <b>business metrics</b> too: orders per minute, payment success rate, average cart value. These often notice problems before technical metrics do.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>155.1 <span class="levels">basic</span> Expose request count and a latency histogram from a small API, and compute p95 in PromQL.</summary><div><p>Use a counter and a histogram with sensible buckets, then <code>histogram_quantile(0.95, sum(rate(..._bucket[5m])) by (le))</code>.</p></div></details>
</div>
`;export{e as default};

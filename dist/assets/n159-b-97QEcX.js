const e=`<p class="goal">Turning telemetry into dashboards that people actually read.</p>
<p>Grafana queries many data sources (Prometheus, Loki, Tempo, Postgres, CloudWatch) and shows them together. The LGTM stack is <b>L</b>oki (logs), <b>G</b>rafana, <b>T</b>empo (traces) and <b>M</b>imir (metrics). With it, you can jump from a latency spike on a graph → an example trace → that request's logs.</p>
<h3>Dashboard design</h3>
<ul>
<li><b>One overview dashboard per service</b>, with RED metrics at the top (rate, errors, p95/p99 latency), then saturation (CPU, memory, pool usage, queue depth), then dependencies (DB, external APIs).</li>
<li>A <b>business dashboard</b>: orders per minute, payment success, active riders.</li>
<li>Consistent time ranges, SLO lines drawn on graphs, and deploy events as annotations: most incidents start with a deploy.</li>
<li>Use variables (environment, store, route) instead of copying dashboards. Keep dashboards as code (JSON in git, or Grafana provisioning).</li>
<li>If nobody would act on a panel, delete it.</li>
</ul>
<pre data-lang="plaintext"><code class="language-plaintext"># LogQL (Loki): error logs for one order, then error counts per service
{service="orders"} |= "error" | json | order_id="42"
sum by (service) (count_over_time({env="prod"} | json | level="error" [5m]))</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>159.1 <span class="levels">basic</span> Build a 4-panel Grafana dashboard: request rate, error rate, p95 latency, and CPU. Add a deploy annotation.</summary><div><p>Use variables for the service and environment; draw the SLO as a threshold line; save the dashboard JSON into git.</p></div></details>
</div>
`;export{e as default};

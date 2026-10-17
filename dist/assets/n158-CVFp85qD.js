const e=`<p class="goal">Prometheus: pull-based metrics collection and the PromQL query language.</p>
<pre data-lang="go"><code class="language-go">var reqs = promauto.NewCounterVec(prometheus.CounterOpts{Name: "http_requests_total"}, []string{"route", "status"})
var dur = promauto.NewHistogramVec(prometheus.HistogramOpts{Name: "http_request_duration_seconds",
    Buckets: []float64{.01, .05, .1, .25, .5, 1, 2.5}}, []string{"route"})
http.Handle("/metrics", promhttp.Handler())      // Prometheus scrapes (pulls) this endpoint every 15 s</code></pre>
<pre data-lang="plaintext"><code class="language-plaintext"># PromQL
sum(rate(http_requests_total[5m])) by (route)                                         # requests per second per route
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))  # error ratio
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))  # p95 latency
up == 0                                                                                  # scrape targets that are down</code></pre>
<ul>
<li><b>Exporters</b> expose metrics for things you didn't write: <code>node_exporter</code> (the host), <code>postgres_exporter</code>, <code>redis_exporter</code>, <code>blackbox_exporter</code> (probes a URL from outside).</li>
<li><code>rate()</code> works on counters and handles resets; always graph counters through <code>rate()</code>.</li>
<li><b>Recording rules</b> precompute expensive queries; <b>Alertmanager</b> routes and deduplicates alerts. For long-term retention and scale: Thanos, Mimir, VictoriaMetrics.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>158.1 <span class="levels">basic</span> Run node_exporter and Prometheus locally and graph your machine's available memory over time.</summary><div><p>Query <code>node_memory_MemAvailable_bytes</code>. Compare it with <code>free -h</code>: it's the same "available" figure from <a class="xref" data-old="n53">chapter 53</a>.</p></div></details>
</div>
`;export{e as default};

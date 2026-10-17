const t=`<p class="goal">Designing systems that degrade gracefully instead of cascading into total failure.</p>
<table>
<tr><th>Pattern</th><th>What it prevents</th><th>How</th></tr>
<tr><td><b>Timeouts</b></td><td>threads and connections stuck forever on a slow dependency</td><td>a deadline on every network call, shorter than the caller's own; pass the deadline down (Go <code>context</code>)</td></tr>
<tr><td><b>Retries + exponential backoff + jitter</b></td><td>transient failures</td><td>retry only idempotent operations, 2–3 times, waiting <code>base × 2^n × random</code>; use a retry budget</td></tr>
<tr><td><b>Circuit breaker</b></td><td>hammering a dependency that's down, and wasting time waiting on it</td><td>after N failures, fail fast for a cooldown period, then let a few trial requests through</td></tr>
<tr><td><b>Bulkhead</b></td><td>one slow dependency consuming every worker</td><td>separate connection pools or concurrency limits per dependency</td></tr>
<tr><td><b>Load shedding</b></td><td>overload collapsing everything</td><td>reject excess work early with 503/429, prioritising important traffic (checkout over analytics)</td></tr>
<tr><td><b>Backpressure</b></td><td>unbounded queues that grow until memory runs out</td><td>bounded queues; slow the producers down</td></tr>
<tr><td><b>Graceful degradation / fallbacks</b></td><td>a whole page failing because one widget's service is down</td><td>serve cached or default data; hide the recommendations section; queue it for later</td></tr>
</table>
<div class="callout warn"><b class="t">Retry storms</b><p>Retries at every layer multiply: 3 layers × 3 retries = 27× the load on a struggling service, just when it can least handle it. Retry at one layer only, with jitter, and stop retrying when the circuit is open.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>177.1 <span class="levels">basic</span> Wrap a flaky HTTP call with a timeout, retries with jittered backoff (only for idempotent calls), and a simple circuit breaker. Test it against a server that fails 50% of the time.</summary><div><p>Track consecutive failures; after 5, open the circuit for 30 s, then allow a half-open probe. The logs should show fast failures while it's open instead of slow timeouts.</p></div></details>
</div>
`;export{t as default};

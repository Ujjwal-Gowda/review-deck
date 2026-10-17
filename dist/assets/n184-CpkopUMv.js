const t=`<p class="goal">Asking "what happens when X fails?" for every box and arrow in the design.</p>
<table>
<tr><th>Failure</th><th>Impact</th><th>Mitigation</th></tr>
<tr><td>One app instance dies</td><td>its requests fail</td><td>several instances + health checks + retries at the load balancer</td></tr>
<tr><td>Database primary dies</td><td>writes stop</td><td>automatic failover to a replica; the app reconnects; a small data-loss window</td></tr>
<tr><td>Redis down</td><td>cache misses, lost sessions</td><td>fall back to the DB (with rate limiting); keep sessions somewhere durable too, or accept re-login</td></tr>
<tr><td>Payment provider slow</td><td>checkout hangs, workers pile up</td><td>timeouts, a circuit breaker, "payment pending" status plus webhook reconciliation</td></tr>
<tr><td>SMS provider down</td><td>no notifications</td><td>queue and retry; a secondary provider; in-app notifications</td></tr>
<tr><td>Store internet down</td><td>the POS can't sell</td><td>offline mode with a local queue, synced later</td></tr>
<tr><td>A bad deploy</td><td>everything breaks</td><td>canary release, automatic rollback, feature flags</td></tr>
<tr><td>A region outage</td><td>total outage</td><td>backups in another region; a disaster-recovery runbook (<a class="xref" data-old="n153">chapter 153</a>)</td></tr>
</table>
<ul>
<li>Find the <b>single points of failure</b> (SPOFs): one database, one load balancer, one person who knows the deploy process.</li>
<li><b>Graceful degradation:</b> decide in advance what gets switched off first (recommendations, analytics) to protect the core (checkout).</li>
<li><b>Blast radius:</b> isolate by tenant, region or cell, so one failure affects a few stores rather than all of them.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>184.1 <span class="levels">basic</span> Make a failure-mode table for your printer-hub system: each component, what happens when it fails, and the mitigation.</summary><div><p>For example: the printer offline → queue the jobs and show status; the bridge host down → alert and have a fallback print path; wrong USB permissions → udev rule; network change → mDNS discovery. Include a runbook link for each.</p></div></details>
</div>
`;export{t as default};

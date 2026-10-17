const e=`<p class="goal">Mutual exclusion across machines, and why it's harder than it looks.</p>
<p>The use case: "only one worker should run the nightly settlement" or "only one process edits this order at a time". The naive approach, a Redis <code>SET lock NX PX 30000</code>, breaks because:</p>
<ul>
<li>the holder pauses (a garbage-collection pause, VM freeze, or slow network) longer than the lease, the lock expires, another worker takes it, and <b>both</b> now think they hold it;</li>
<li>a Redis failover can lose the lock key entirely.</li>
</ul>
<h3>Fencing tokens</h3>
<p>The lock service hands out a <b>monotonically increasing token</b> with each lock (33, then 34…). The protected resource (e.g. the database) rejects writes carrying a token older than the newest it has seen. A zombie holder with token 33 is then refused after 34 has written.</p>
<table>
<tr><th>Need</th><th>Use</th></tr>
<tr><td>Efficiency only (avoid duplicate work; an occasional double run is harmless)</td><td>a Redis lock with a TTL is fine</td></tr>
<tr><td>Correctness (a double run corrupts data or double-pays)</td><td>a consensus-backed lease (etcd, ZooKeeper) <b>plus</b> fencing, or better, database-level guarantees</td></tr>
<tr><td>A single job at a time from Postgres</td><td><code>pg_advisory_lock</code>, or <code>SELECT … FOR UPDATE SKIP LOCKED</code></td></tr>
</table>
<p>Often the best lock is none at all: make the operation idempotent, or use a unique constraint so the database rejects the duplicate.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>176.1 <span class="levels">think</span> A cron job must not run twice at the same time across 3 servers, and a double run double-pays suppliers. Design it.</summary><div><p>Use a Postgres advisory lock or a lease with a fencing token, <b>and</b> make the payment step idempotent with a unique (supplier, period) payout record. Rely on the database constraint, not just the lock.</p></div></details>
</div>
`;export{e as default};

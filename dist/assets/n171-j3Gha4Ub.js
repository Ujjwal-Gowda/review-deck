const e=`<p class="goal">Keeping copies of data on several machines for availability, read scaling and durability.</p>
<table>
<tr><th>Topology</th><th>How</th><th>Pros</th><th>Cons</th></tr>
<tr><td><b>Single leader</b> (primary/replica)</td><td>all writes go to the leader; it streams changes to followers</td><td>simple, no write conflicts</td><td>the leader limits write throughput; failover is needed if it dies</td></tr>
<tr><td><b>Multi-leader</b></td><td>several nodes accept writes (e.g. one per region, or offline devices)</td><td>local writes, works through partitions</td><td><b>write conflicts</b> must be resolved</td></tr>
<tr><td><b>Leaderless</b> (Dynamo-style)</td><td>clients write to and read from several nodes using quorums</td><td>highly available</td><td>tuning, repair, weaker guarantees</td></tr>
</table>
<ul>
<li><b>Synchronous</b> replication waits for the replica to confirm (no data loss, slower writes); <b>asynchronous</b> doesn't (fast, but recent writes can be lost on failover). Common middle ground: one synchronous replica, the rest asynchronous.</li>
<li><b>Replication lag</b> causes stale reads from replicas (<a class="xref" data-old="n170">chapter 170</a>).</li>
<li><b>Failover dangers:</b> split brain (two nodes both think they're the leader), lost async writes, and clients still pointing at the old leader. Use proven tools (Patroni, managed database failover) rather than scripts.</li>
</ul>
<p>An offline-first POS that syncs later is <i>multi-leader</i> replication: every till is a leader while offline, so it needs a conflict strategy (e.g. sales are append-only events; stock is recomputed from events).</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>171.1 <span class="levels">think</span> An asynchronously replicated primary fails over. Which orders might be lost, and how could the app detect or recover them?</summary><div><p>Writes acknowledged by the primary but not yet replicated. Mitigations: a synchronous replica for critical data, client retries with idempotency keys, and reconciling against the payment provider's records.</p></div></details>
</div>
`;export{e as default};

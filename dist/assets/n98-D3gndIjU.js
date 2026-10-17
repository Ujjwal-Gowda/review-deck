const e=`<p class="goal">How Postgres lets readers and writers work simultaneously without blocking each other.</p>
<h3>MVCC (multi-version concurrency control)</h3>
<p>An UPDATE doesn't overwrite a row. It writes a <b>new version</b> and marks the old one dead from that transaction onward. Each row version carries <code>xmin</code> (the transaction that created it) and <code>xmax</code> (the one that deleted or replaced it). A transaction's <b>snapshot</b> decides which versions it can see.</p>
<div class="diagram">row "paneer": v1 (qty 5, xmin=100, xmax=205)  ←  a reader whose snapshot is before txn 205 sees this
              v2 (qty 3, xmin=205, xmax=∞)    ←  readers after 205 commits see this
Readers never block writers, and writers never block readers. Only writer-vs-writer on the SAME row waits.</div>
<h3>Consequences</h3>
<ul>
<li><b>Dead tuples</b> accumulate. <b>VACUUM</b> reclaims them for reuse; autovacuum does it automatically. Heavily updated tables (stock counters) need tuned autovacuum.</li>
<li><b>Long-running transactions</b> (an idle-in-transaction connection, a 3-hour report) keep old versions alive for everyone. That causes bloat and slowness. Set <code>idle_in_transaction_session_timeout</code>.</li>
<li>A <code>count(*)</code> must check visibility row by row, which is why it's slow on huge tables.</li>
<li>Transaction ID wraparound: autovacuum "freezes" old rows. Never disable it.</li>
</ul>
<h3>Locks you still get</h3>
<table>
<tr><th>Operation</th><th>Blocks</th></tr>
<tr><td>UPDATE/DELETE a row</td><td>other writers of that row</td></tr>
<tr><td><code>SELECT … FOR UPDATE</code> / <code>FOR SHARE</code></td><td>writers (and FOR UPDATE lockers)</td></tr>
<tr><td><code>ALTER TABLE</code> (most forms)</td><td><b>everything</b>, even reads: dangerous on busy tables (<a class="xref" data-old="n99">chapter 99</a>)</td></tr>
<tr><td><code>CREATE INDEX</code> (without CONCURRENTLY)</td><td>writes</td></tr>
</table>
<p>Debug waiting queries with <code>SELECT pid, state, wait_event_type, query FROM pg_stat_activity WHERE state &lt;&gt; 'idle';</code> and <code>pg_blocking_pids(pid)</code>.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>98.1 <span class="levels">basic</span> Leave a psql session idle in an open transaction, update a table heavily in another, then check <code>n_dead_tup</code> in <code>pg_stat_user_tables</code>.</summary><div><p>Dead tuples pile up because vacuum can't remove row versions that the old transaction might still see. Commit the idle session, run <code>VACUUM</code>, and they're cleared.</p></div></details>
</div>
`;export{e as default};

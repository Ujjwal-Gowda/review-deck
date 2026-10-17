const t=`<p class="goal">Splitting data across machines when one database can't hold it all or keep up with the writes.</p>
<table>
<tr><th>Strategy</th><th>How</th><th>Pro</th><th>Con</th></tr>
<tr><td>Range</td><td>ids 1–1M on shard A, the next 1M on B; or by date</td><td>efficient range scans</td><td>hot spots (all new writes hit the newest shard)</td></tr>
<tr><td>Hash</td><td><code>hash(key) mod N</code></td><td>even spread</td><td>changing N moves almost every key; no range queries</td></tr>
<tr><td><b>Consistent hashing</b></td><td>keys and nodes placed on a ring; each key belongs to the next node clockwise (with virtual nodes)</td><td>adding a node moves only ~1/N of the keys</td><td>more complex</td></tr>
<tr><td>Directory / tenant</td><td>a lookup table: <code>store_id → shard</code></td><td>flexible; can move big tenants</td><td>the directory is a dependency</td></tr>
</table>
<ul>
<li><b>The shard key is the most important choice.</b> Queries that include it are fast; queries across shards (a global report) have to fan out. For FreshOn, <code>store_id</code> is a natural key: most queries are per store.</li>
<li><b>Hot keys:</b> one celebrity or giant tenant overloads its shard. Split it further, cache it, or give it a dedicated shard.</li>
<li>Cross-shard transactions are hard; design so that one transaction stays within one shard.</li>
<li><b>Shard last:</b> first try indexes, caching, read replicas, a bigger machine, and archiving old data. Citus, Vitess and distributed SQL databases (CockroachDB, Yugabyte, Spanner) shard for you.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>172.1 <span class="levels">basic</span> Implement consistent hashing with virtual nodes in Python and measure how many of 10,000 keys move when you add a 5th node.</summary><div><p>Use a sorted ring of hash(node#i) positions and bisect to find a key's owner. About 20% (1/5) of keys should move, versus about 80% with <code>hash mod N</code>.</p></div></details>
</div>
`;export{t as default};

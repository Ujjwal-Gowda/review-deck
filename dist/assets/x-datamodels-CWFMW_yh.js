const e=`<p class="goal">The concepts every database is built from. Learn these first, and PostgreSQL, Redis and MongoDB become different <i>implementations</i> of them rather than separate things to memorise.</p>
<h3>Data models</h3>
<table>
<tr><th>Model</th><th>Shape</th><th>Strength</th><th>Implementations</th></tr>
<tr><td>Relational</td><td>tables of rows; relationships via keys; SQL</td><td>flexible queries, joins, constraints, transactions</td><td>PostgreSQL, MySQL, SQLite</td></tr>
<tr><td>Document</td><td>nested JSON-like records</td><td>read and write a whole aggregate at once; flexible schema</td><td>MongoDB, Firestore, Postgres <code>jsonb</code></td></tr>
<tr><td>Key-value</td><td>key → opaque value</td><td>extreme speed and simplicity</td><td>Redis, DynamoDB, etcd</td></tr>
<tr><td>Wide-column</td><td>rows with dynamic columns, partitioned by key</td><td>huge write volume at scale</td><td>Cassandra, ScyllaDB, Bigtable</td></tr>
<tr><td>Graph</td><td>nodes and edges</td><td>relationship traversal</td><td>Neo4j</td></tr>
<tr><td>Time-series / columnar</td><td>append-heavy, stored column by column</td><td>analytics and aggregations over billions of rows</td><td>ClickHouse, TimescaleDB, DuckDB</td></tr>
</table>
<h3>How data is stored</h3>
<ul>
<li><b>Pages:</b> data lives in fixed-size blocks (8 KB in Postgres). Reading one row loads its whole page, which is why locality matters (<a class="xref" data-old="n03">Memory &amp; Data Representation</a>).</li>
<li><b>B-tree engines</b> (Postgres, MySQL InnoDB): update pages in place; fast reads and range scans.</li>
<li><b>LSM-tree engines</b> (RocksDB, Cassandra): append writes to memory, flush sorted files, and merge them in the background (compaction). Very fast writes; reads may check several files, helped by Bloom filters.</li>
<li><b>Row vs column storage:</b> row stores (OLTP) are fast for fetching whole records; column stores (OLAP) are fast for aggregating one column across millions of rows.</li>
</ul>
<h3>Durability: the write-ahead log</h3>
<p>Before changing data pages, a database appends the change to a <b>write-ahead log (WAL)</b> and <code>fsync</code>s it. After a crash, it replays the log. The same log drives replication and point-in-time recovery (<a class="xref" data-old="n171">Replication</a>, <a class="xref" data-old="n152">Backups</a>).</p>
<h3>The concepts, and where each is covered</h3>
<table>
<tr><th>Concept</th><th>Chapter</th></tr>
<tr><td>keys, constraints, normalisation</td><td><a class="xref" data-old="c25">Relational Databases</a></td></tr>
<tr><td>transactions, ACID, isolation</td><td><a class="xref" data-old="n97">Transactions</a>, <a class="xref" data-old="n98">MVCC</a></td></tr>
<tr><td>indexes and query planning</td><td><a class="xref" data-old="n95">Indexes</a>, <a class="xref" data-old="n96">Query Planning</a></td></tr>
<tr><td>replication, sharding, consistency</td><td><a class="xref" data-old="n171">Replication</a>, <a class="xref" data-old="n172">Sharding</a>, <a class="xref" data-old="n170">Consistency</a></td></tr>
<tr><td>backups and recovery</td><td><a class="xref" data-old="n152">Backups</a></td></tr>
</table>
<div class="callout key"><b class="t">Choosing</b><p>Start with PostgreSQL. It covers relational, document (jsonb), full-text, vector (pgvector) and queue (SKIP LOCKED) needs well enough for most products. Add a specialised store only when a measured need appears: Redis for caching and ephemeral data, ClickHouse for heavy analytics, a search engine for relevance tuning.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">think</span> For each FreshOn dataset, pick a data model and justify it: orders, the product catalogue with variable attributes, rider GPS pings, sales analytics over 3 years, and sessions.</summary><div><p>Orders: relational (transactions, relationships). Catalogue: relational plus a <code>jsonb</code> attributes column. GPS pings: a time-series table with retention (or Redis for the latest position). Analytics: a columnar store (ClickHouse, or DuckDB on exports). Sessions: key-value (Redis) with a TTL.</p></div></details>
</div>
`;export{e as default};

const t=`<p class="goal">Storing data durably, and querying it correctly and quickly.</p>
<pre data-lang="sql"><code class="language-sql">CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),   -- foreign key
  amount_paise INTEGER NOT NULL CHECK (amount_paise &gt;= 0),
  created_at TEXT NOT NULL
);
INSERT INTO customers (name, city) VALUES ('Asha', 'Bengaluru');
SELECT c.name, COUNT(*) AS n, SUM(o.amount_paise) AS total
FROM orders o JOIN customers c ON c.id = o.customer_id      -- JOIN: combine tables
WHERE o.created_at &gt;= '2026-09-01'
GROUP BY c.name HAVING SUM(o.amount_paise) &gt; 100000
ORDER BY total DESC LIMIT 10;
CREATE INDEX idx_orders_customer ON orders(customer_id);    -- speeds up lookups by customer</code></pre>
<p>Try it now: <code>python3 -c "import sqlite3"</code>. SQLite is built into Python, so run SQL with no server at all.</p>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td><b>Primary key / foreign key</b></td><td>A row's unique id / a reference to another table's row.</td></tr>
<tr><td><b>Normalisation</b></td><td>Store each fact once (no copying the customer name into every order). <b>Denormalise</b> deliberately for read speed.</td></tr>
<tr><td><b>Index</b></td><td>A B-tree on column(s): lookups go from O(n) scans to O(log n). Costs write speed and space. <code>EXPLAIN QUERY PLAN</code> shows whether one is used.</td></tr>
<tr><td><b>Transaction</b></td><td>Several statements that succeed or fail as one unit (<code>BEGIN … COMMIT/ROLLBACK</code>).</td></tr>
<tr><td><b>ACID</b></td><td><b>A</b>tomic (all or nothing), <b>C</b>onsistent (constraints hold), <b>I</b>solated (concurrent transactions don't see each other's half-done work), <b>D</b>urable (committed data survives a crash).</td></tr>
<tr><td><b>N+1 query problem</b></td><td>Loading 100 orders, then running 1 query per order for its customer. Use a JOIN or batch instead.</td></tr>
<tr><td><b>ORM</b></td><td>Maps tables to objects (SQLAlchemy, Prisma, Django ORM). Productive, but it can hide slow queries.</td></tr>
<tr><td><b>Migration</b></td><td>A versioned, scripted schema change.</td></tr>
<tr><td><b>Replication / sharding</b></td><td>Copies for reads and availability / splitting data across machines for scale.</td></tr>
<tr><td><b>CAP theorem</b></td><td>During a network partition, a distributed store must choose Consistency or Availability.</td></tr>
</table>
<div class="callout key"><b class="t">Trade-offs: SQL vs NoSQL</b>
<table>
<tr><th>Type</th><th>Examples</th><th>Good for</th><th>Weak at</th></tr>
<tr><td>Relational (SQL)</td><td>PostgreSQL, MySQL, SQLite</td><td>structured data, relationships, transactions, ad-hoc queries. <b>The default choice.</b></td><td>schema changes at huge scale; horizontal write scaling</td></tr>
<tr><td>Document</td><td>MongoDB, Firestore</td><td>flexible nested records</td><td>joins, cross-document consistency</td></tr>
<tr><td>Key-value</td><td>Redis, DynamoDB</td><td>caching, sessions, extreme speed</td><td>querying by anything but the key</td></tr>
<tr><td>Wide-column / time-series</td><td>Cassandra, ClickHouse, TimescaleDB</td><td>huge write volume, analytics, metrics</td><td>transactions, ad-hoc updates</td></tr>
<tr><td>Graph</td><td>Neo4j</td><td>deep relationship traversal</td><td>bulk tabular work</td></tr>
<tr><td><b>Vector</b></td><td>pgvector, Qdrant, FAISS</td><td>similarity search over embeddings (AI, <a class="xref" data-old="c31">chapter 31</a>)</td><td>exact queries</td></tr>
</table></div>
<div class="callout seclens"><b class="t">Security lens · Databases</b><p>Always use parameterised queries, connect with a least-privilege role, encrypt connections (TLS), and never expose the database port to the internet.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>92.1 <span class="levels">basic</span> Create the customers, orders and order_items tables in SQLite with foreign keys, and insert sample data. Write a query for revenue per customer.</summary><div><p><code>SELECT c.name, SUM(oi.qty*oi.price) FROM customers c JOIN orders o ON o.customer_id=c.id JOIN order_items oi ON oi.order_id=o.id GROUP BY c.id ORDER BY 2 DESC;</code> Remember <code>PRAGMA foreign_keys=ON</code> in SQLite.</p></div></details>
</div>
`;export{t as default};

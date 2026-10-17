const e=`<p class="goal">Testing the part of your system with the longest memory: schema, queries and data migrations.</p>
<ul>
<li><b>Migrations in every test run:</b> build the test database by running the real migrations from empty (<a class="xref" data-old="n106">Integration Testing</a>). That proves they apply cleanly in order.</li>
<li><b>Test against realistic data:</b> apply new migrations to an <b>anonymised copy of production</b> in CI or staging. Duration, locks and failures only show up at real size (<a class="xref" data-old="n99">Migrations</a>).</li>
<li><b>Constraint tests:</b> assert that the database itself rejects invalid data (negative stock, duplicate phone numbers, orphaned items). Constraints are your last line of defence, so make sure they exist.</li>
<li><b>Query correctness:</b> seed a small known dataset and compare report queries against hand-computed answers, especially aggregations, time zones and NULL handling.</li>
<li><b>Concurrency tests:</b> run two transactions in parallel and assert there's no lost update or oversell (<a class="xref" data-old="n97">Transactions</a>).</li>
<li><b>Data-migration tests:</b> backfills and transformations get their own before/after assertions, and must be idempotent (safe to re-run after a partial failure).</li>
<li><b>Isolation between tests:</b> wrap each test in a transaction that's rolled back, or use a template database cloned per test (<code>CREATE DATABASE t1 TEMPLATE base</code> is fast).</li>
</ul>
<pre data-lang="python"><code class="language-python">def test_stock_cannot_go_negative(db):
    db.execute("INSERT INTO stock(sku, qty) VALUES ('milk', 1)")
    with pytest.raises(psycopg.errors.CheckViolation):
        db.execute("UPDATE stock SET qty = qty - 2 WHERE sku = 'milk'")</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Write a test proving two concurrent "reserve 1 unit" transactions on stock = 1 can&#39;t both succeed.</summary><div><p>Use two connections and two threads, each running <code>UPDATE stock SET qty=qty-1 WHERE sku=$1 AND qty&gt;=1</code> and checking the row count. Assert that exactly one reports 1 row affected and the final qty is 0.</p></div></details>
</div>
`;export{e as default};

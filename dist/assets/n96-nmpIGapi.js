const e=`<p class="goal">Reading the database's plan so you can see why a query is slow instead of guessing.</p>
<pre data-lang="sql"><code class="language-sql">EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE store_id = 7 ORDER BY created_at DESC LIMIT 20;
-- Limit  (actual time=0.041..0.063 rows=20 loops=1)
--   -&gt;  Index Scan using idx_orders_store_created on orders  (cost=0.43..812.10 rows=4210 width=96)
--         (actual time=0.040..0.058 rows=20 loops=1)
--         Index Cond: (store_id = 7)
--         Buffers: shared hit=24          ← pages served from cache (read= means from disk)
-- Planning Time: 0.1 ms   Execution Time: 0.08 ms</code></pre>
<h3>How to read it</h3>
<ul>
<li>Read from the <b>innermost</b> (most indented) node outwards. Each node shows the <b>estimated</b> cost and rows, and (with ANALYZE) the <b>actual</b> time and rows.</li>
<li><b>Estimated rows far from actual rows</b> (e.g. 10 vs 500,000) is the root cause of most bad plans: stale or insufficient statistics, or correlated columns. Run <code>ANALYZE</code>; consider <code>CREATE STATISTICS</code>.</li>
<li><code>loops=N</code>: the time shown is per loop, so multiply.</li>
</ul>
<table>
<tr><th>Node</th><th>Meaning</th></tr>
<tr><td>Seq Scan</td><td>reads the whole table: fine for small tables or when most rows are needed</td></tr>
<tr><td>Index Scan / Index Only Scan</td><td>index lookups (Only = no table visit: a covering index)</td></tr>
<tr><td>Bitmap Heap Scan</td><td>collects many matches from an index, then reads the pages in order</td></tr>
<tr><td>Nested Loop</td><td>for each outer row, look up inner rows. Great when the outer side is small and the inner side is indexed.</td></tr>
<tr><td>Hash Join</td><td>build a hash table from one side and probe it with the other: large unsorted joins</td></tr>
<tr><td>Merge Join</td><td>both inputs already sorted</td></tr>
<tr><td>Sort (external merge Disk)</td><td>a spill to disk: raise <code>work_mem</code>, or add an index that provides the order</td></tr>
</table>
<p>Paste plans into explain.dalibo.com for a visual view. Careful: <code>EXPLAIN ANALYZE</code> <b>really executes</b> the query, so wrap writes in <code>BEGIN … ROLLBACK</code>.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>96.1 <span class="levels">think</span> A plan shows "rows=12" estimated but "rows=480000" actual on a join. What's likely wrong, and what do you try?</summary><div><p>The statistics are stale or can't capture a correlation. Run <code>ANALYZE</code>; raise the statistics target for the column; add <code>CREATE STATISTICS</code> for correlated columns. The planner probably picked a nested loop where a hash join fits.</p></div></details>
</div>
`;export{e as default};

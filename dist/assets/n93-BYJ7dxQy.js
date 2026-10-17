const e=`<p class="goal">SQL beyond SELECT *: joins, aggregation, CTEs and window functions, the tools that replace pages of application code.</p>
<pre data-lang="sql"><code class="language-sql">-- JOIN types
SELECT o.id, c.name FROM orders o JOIN customers c ON c.id = o.customer_id;        -- INNER: only matches
SELECT c.name, o.id FROM customers c LEFT JOIN orders o ON o.customer_id = c.id;   -- all customers, NULL if no orders
SELECT c.name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);  -- anti-join: never ordered

-- aggregation
SELECT store_id, date_trunc('day', created_at) AS day, count(*) AS orders, sum(total_paise) AS revenue
FROM orders WHERE created_at &gt;= now() - interval '30 days'
GROUP BY 1, 2 HAVING count(*) &gt; 10 ORDER BY day;

-- CTE: name intermediate steps (readable, composable)
WITH daily AS (
  SELECT date_trunc('day', created_at) AS day, sum(total_paise) AS rev FROM orders GROUP BY 1
)
SELECT day, rev,
       rev - lag(rev) OVER (ORDER BY day)                              AS change_vs_yesterday,
       avg(rev) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS avg_7d
FROM daily;

-- window functions: rank WITHIN groups without collapsing the rows
SELECT * FROM (
  SELECT p.*, row_number() OVER (PARTITION BY category ORDER BY units_sold DESC) AS rn FROM products p
) t WHERE rn &lt;= 3;                                                     -- top 3 per category

-- upsert
INSERT INTO stock (sku, qty) VALUES ('milk', 10)
ON CONFLICT (sku) DO UPDATE SET qty = stock.qty + EXCLUDED.qty;</code></pre>
<h3>NULL logic</h3>
<p><code>NULL</code> means "unknown": <code>NULL = NULL</code> is NULL (not true), so use <code>IS NULL</code>. <code>count(col)</code> skips NULLs, while <code>count(*)</code> doesn't. <code>NOT IN (subquery)</code> returns nothing if the subquery contains a NULL, so prefer <code>NOT EXISTS</code>. <code>coalesce(x, 0)</code> supplies defaults.</p>
<h3>The logical order a query runs in</h3>
<p><code>FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → window functions → ORDER BY → LIMIT</code>. That's why you can't use a SELECT alias in WHERE, and why HAVING filters on aggregates.</p>
<details class="ex"><summary>93.1 <span class="levels">think</span> For each customer, find their first order date and how many days until their second order (NULL if there isn't one).</summary><div><pre data-lang="sql"><code class="language-sql">SELECT customer_id, min(created_at) FILTER (WHERE rn = 1) AS first,
       min(created_at) FILTER (WHERE rn = 2) - min(created_at) FILTER (WHERE rn = 1) AS gap
FROM (SELECT customer_id, created_at, row_number() OVER (PARTITION BY customer_id ORDER BY created_at) rn FROM orders) t
GROUP BY customer_id;</code></pre></div></details>
`;export{e as default};

const e=`<p class="goal">Changing the schema safely while the app keeps running.</p>
<pre data-lang="sql"><code class="language-sql">-- migrations/0012_add_zone_to_orders.sql   (versioned, reviewed in PRs, applied by a tool, never by hand)
ALTER TABLE orders ADD COLUMN zone text;                               -- nullable add: instant
UPDATE orders SET zone = 'central' WHERE zone IS NULL;                -- [WARN] backfill in batches on big tables
ALTER TABLE orders ALTER COLUMN zone SET NOT NULL;                    -- scans the table while holding a lock</code></pre>
<p>Tools: Prisma Migrate, Drizzle Kit, Alembic (Python), golang-migrate / goose (Go), sqlx/refinery (Rust), Flyway, Atlas. They all record which migrations have run in a table and apply the rest in order.</p>
<h3>Zero-downtime: expand → migrate → contract</h3>
<p>The old code version and the new one run <i>at the same time</i> during a deploy, so every step must work with both.</p>
<ol>
<li><b>Expand:</b> add the new column or table (nullable, no default rewrite). Deploy code that writes both old and new.</li>
<li><b>Migrate:</b> backfill in batches (<code>UPDATE … WHERE id BETWEEN …</code> with small pauses).</li>
<li><b>Switch reads</b> to the new column; deploy.</li>
<li><b>Contract:</b> stop writing the old column, then drop it in a later release.</li>
</ol>
<table>
<tr><th>Dangerous</th><th>Safer</th></tr>
<tr><td>renaming a column in one step</td><td>add the new one, dual-write, backfill, switch, drop the old one</td></tr>
<tr><td><code>CREATE INDEX</code></td><td><code>CREATE INDEX CONCURRENTLY</code> (outside a transaction)</td></tr>
<tr><td><code>SET NOT NULL</code> on a huge table</td><td>add <code>CHECK (col IS NOT NULL) NOT VALID</code>, <code>VALIDATE CONSTRAINT</code>, then SET NOT NULL</td></tr>
<tr><td>adding a foreign key</td><td><code>NOT VALID</code>, then <code>VALIDATE</code> separately</td></tr>
<tr><td>any DDL on a busy table</td><td><code>SET lock_timeout = '3s'</code> so it fails fast instead of queueing every other query behind it</td></tr>
</table>
<p>Rollbacks: prefer <b>roll-forward</b> fixes. Down-migrations that drop data are rarely safe in production. Back up before destructive changes.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>99.1 <span class="levels">think</span> Plan a zero-downtime rename of <code>orders.phone</code> to <code>orders.customer_phone</code> on a busy table.</summary><div><p>Add the new column → deploy code that writes both → backfill in batches → switch reads to the new column → stop writing the old one → drop it in a later release. Each step works with both the old and new app versions.</p></div></details>
</div>
`;export{e as default};

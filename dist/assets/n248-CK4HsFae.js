const e=`<p class="goal">Engineering Practice: High-Impact Code Review. Master the multi-tier review framework, Conventional Comments semantics, cognitive load management, and the silent bug checklist.</p>

<h3>The Real Purpose of Code Review</h3>
<p>In low-maturity teams, code reviews degenerate into "nitpick wars" over indentation, variable naming preferences, and stylistic bikeshedding. Linters and automated formatters (Prettier, Biome, Ruff, gofmt) should handle 100% of syntax and formatting rules.</p>

<p>A senior engineer's review is an architectural and cognitive defense mechanism. Your primary goals are:
<ol>
  <li><b>Catch silent operational bugs</b> (race conditions, unindexed queries, connection leaks, security flaws) that pass unit tests.</li>
  <li><b>Preserve mental model clarity</b> so future teammates (and your future self at 3 AM) can modify the code without introducing regressions.</li>
  <li><b>Knowledge sharing &amp; mentorship</b> without creating adversarial friction.</li>
</ol>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              The Code Review Priority Pyramid                          │
│                                                                                        │
│                         ▲                                                              │
│                        / \\     Tier 1: Architecture &amp; System Invariants               │
│                       /   \\    (Does this design scale? Does it break boundaries?)     │
│                      /─────\\                                                           │
│                     /       \\    Tier 2: Correctness, Concurrency &amp; Edge Cases         │
│                    /         \\   (Deadlocks, TOCTOU, unhandled error paths, leaks)     │
│                   /───────────\\                                                        │
│                  /             \\   Tier 3: Security &amp; Resource Efficiency              │
│                 /               \\  (IDOR, N+1 queries, memory growth, SQL injection)   │
│                /─────────────────\\                                                     │
│               /                   \\  Tier 4: Maintainability &amp; Cognitive Load          │
│              /                     \\ (Naming, test coverage, self-documenting APIs)    │
│             └───────────────────────┘                                                  │
│             ═════════════════════════  [Automated by Linters / CI: Formatting &amp; Typos] │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: The "Conventional Comments" Standard</h3>
<p>Ambiguous comments like <i>"Why did you do this?"</i> or <i>"Fix this"</i> trigger defensiveness. Explicitly tag every review comment with intent and severity:</p>

<table>
  <tr><th>Label</th><th>Blocking?</th><th>Meaning &amp; Example</th></tr>
  <tr>
    <td><code>issue (blocking)</code></td>
    <td><b>YES</b></td>
    <td>Must be resolved before merging. <i>"issue (blocking): This DB query is inside the loop, creating an N+1 query that will exhaust database connections under load."</i></td>
  </tr>
  <tr>
    <td><code>security (blocking)</code></td>
    <td><b>YES</b></td>
    <td>Critical vulnerability. <i>"security (blocking): <code>customerId</code> is taken directly from the URL param without checking if it matches <code>req.user.id</code> (IDOR vulnerability)."</i></td>
  </tr>
  <tr>
    <td><code>suggestion</code></td>
    <td>No</td>
    <td>Alternative implementation proposed for consideration. <i>"suggestion: We could use <code>Promise.allSettled</code> here to allow non-failing notifications to continue."</i></td>
  </tr>
  <tr>
    <td><code>nitpick</code></td>
    <td>No</td>
    <td>Minor polish item. Author may ignore if pressed for time. <i>"nitpick: Rename <code>d</code> to <code>departureDate</code> for readability."</i></td>
  </tr>
  <tr>
    <td><code>question</code></td>
    <td>No</td>
    <td>Seeking understanding. <i>"question: What is the expected behavior if the third-party webhook returns HTTP 429?"</i></td>
  </tr>
  <tr>
    <td><code>praise</code></td>
    <td>No</td>
    <td>Highlighting great engineering. <i>"praise: Excellent use of the transactional outbox pattern here—very clean error boundary!"</i></td>
  </tr>
</table>

<h3>Part 2: The Silent Bug Checklist</h3>
<p>Look specifically for the bugs that compilers and tests frequently miss:</p>

<div class="cheat">
  <div class="card">
    <h4>1. The Floating Promise</h4>
    <pre data-lang="typescript"><code class="language-typescript">// [FAIL] BUG: Async function called without await
// If this throws, it causes an unhandled promise rejection
emailService.sendWelcome(user.id);

// [OK] FIX:
await emailService.sendWelcome(user.id);
// OR explicitly handle background failure:
void emailService.sendWelcome(user.id).catch(logErr);</code></pre>
  </div>
  <div class="card">
    <h4>2. The Unbounded Query</h4>
    <pre data-lang="sql"><code class="language-sql">-- [FAIL] BUG: Works with 50 rows in testing; crashes server with 500,000 rows
SELECT * FROM audit_logs WHERE org_id = $1;

-- [OK] FIX: Force pagination limit & cursor
SELECT * FROM audit_logs 
WHERE org_id = $1 AND id < $2 
ORDER BY id DESC LIMIT 50;</code></pre>
  </div>
  <div class="card">
    <h4>3. Leaked Connection / Lock</h4>
    <pre data-lang="typescript"><code class="language-typescript">// [FAIL] BUG: If processOrder throws, client is NEVER released back to pool!
const client = await pool.connect();
await processOrder(client);
client.release();

// [OK] FIX: Always wrap in try...finally
const client = await pool.connect();
try {
  await processOrder(client);
} finally {
  client.release();
}</code></pre>
  </div>
  <div class="card">
    <h4>4. Missing Database Index</h4>
    <pre data-lang="sql"><code class="language-sql">-- [FAIL] In PR: "Added created_at filter to invoices"
-- Missing migration:
CREATE INDEX CONCURRENTLY idx_invoices_created_at 
ON invoices(created_at);</code></pre>
  </div>
</div>

<h3>Part 3: The Author's Self-Review Discipline</h3>
<p>The single most effective way to speed up PR approvals is the <b>Author Pre-Review</b>:</p>
<ol>
  <li>Open your own Pull Request diff in GitHub before requesting review.</li>
  <li>Read through the entire diff line by line as if you were a skeptical outsider.</li>
  <li>Delete all leftover <code>console.log()</code> statements, commented-out test code, and unused imports.</li>
  <li>Add self-explanatory comments on complex design choices: <i>"Note to reviewer: I chose a pessimistic lock here because..."</i>.</li>
</ol>

<details class="ex">
  <summary><b>Drill: Spot the 3 Production Bugs in this PR Diff</b> (Click to expand)</summary>
  <pre data-lang="typescript"><code class="language-typescript">async function transferCredits(fromId: string, toId: string, amount: number) {
  const sender = await db.query("SELECT balance FROM accounts WHERE id = $1", [fromId]);
  if (sender.rows[0].balance >= amount) {
    await db.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromId]);
    await db.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toId]);
    auditLogService.logTransfer(fromId, toId, amount);
  }
}</code></pre>
  <div class="callout warn">
    <p><b>The 3 Critical Bugs:</b></p>
    <ol>
      <li><b>No Transaction Boundary:</b> If the second <code>UPDATE</code> fails (e.g. server crash or invalid <code>toId</code>), money is deducted from sender and disappears forever! Must use <code>BEGIN...COMMIT</code>.</li>
      <li><b>Check-Then-Act Race Condition:</b> Reading balance with plain <code>SELECT</code> allows two concurrent transfers to overdraft the account. Must use <code>SELECT FOR UPDATE</code> or conditional atomic decrement.</li>
      <li><b>Floating Background Call:</b> <code>auditLogService.logTransfer</code> is an async promise that is not awaited or caught, potentially swallowing audit log failures silently.</li>
    </ol>
  </div>
</details>
`;export{e as default};

const t=`<p class="goal">Knowing which kind of test to write, when, and what each one can and can't catch.</p>
<h3>The testing ladder</h3>
<div class="diagram">Unit ─► Integration ─► API ─► Database ─► End-to-end ─► Contract ─► Load / stress ─► Production verification
fast, cheap, precise ─────────────────────────────────────────────────► slow, costly, realistic</div>
<table>
<tr><th>Level</th><th>Catches</th><th>Misses</th><th>Chapter</th></tr>
<tr><td>Unit</td><td>logic errors in pure functions and classes</td><td>wiring, SQL, configuration, the network</td><td><a class="xref" data-old="c16">Unit Testing</a></td></tr>
<tr><td>Integration</td><td>code + real DB/queue: wrong SQL, migrations, transactions</td><td>the full user flow</td><td><a class="xref" data-old="n106">Integration Testing</a></td></tr>
<tr><td>API</td><td>HTTP contract: status codes, schemas, auth, errors</td><td>UI problems</td><td><a class="xref" data-old="x-apitest">API Testing</a></td></tr>
<tr><td>Database</td><td>migrations, constraints, query results, data migrations</td><td>app logic</td><td><a class="xref" data-old="x-dbtest">Database Testing</a></td></tr>
<tr><td>End-to-end</td><td>the real journey across UI, API and DB</td><td>edge cases (too slow to cover them all)</td><td><a class="xref" data-old="n107">E2E</a></td></tr>
<tr><td>Contract</td><td>breaking changes between separately deployed services</td><td>behaviour inside each service</td><td><a class="xref" data-old="n106">Integration Testing</a></td></tr>
<tr><td>Load / stress</td><td>capacity limits, latency under load, leaks</td><td>correctness</td><td><a class="xref" data-old="n110">Load Testing</a></td></tr>
<tr><td>Production verification</td><td>what's actually true for real users right now</td><td>problems before release</td><td><a class="xref" data-old="x-prodtest">Testing in Production</a></td></tr>
</table>
<h3>Choosing tests for a change</h3>
<ul>
<li><b>New pure business rule</b> (a discount calculation): unit tests plus property tests.</li>
<li><b>New endpoint:</b> API tests for the success path, validation errors, authorisation (a user can't see others' data) and not-found; integration tests for the queries.</li>
<li><b>Schema change:</b> a migration test on a copy of realistic data, and an API test run against both the old and new code.</li>
<li><b>Money path</b> (checkout): all of the above plus one E2E test and a production smoke test.</li>
<li><b>Performance-sensitive change:</b> a benchmark or load test before and after.</li>
</ul>
<div class="callout key"><b class="t">Cost vs confidence</b><p>Aim for many fast tests that give precise failures, and a few slow realistic ones for the flows that matter. A test's value is roughly (the bugs it catches × how likely those bugs are) ÷ (the time to run and maintain it). Delete tests that never fail and constantly break on refactors.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">think</span> List the tests you would write for "a manager can refund an order up to ₹5,000 for their own store", with each assigned to a level.</summary><div><p>Unit: the authorisation rule (roles × amounts × store, including exactly ₹5,000 and ₹5,000.01). API: 200 for an allowed refund, 403 for another store, 403 above the limit, 404 for an unknown order, 409 if already refunded. Integration: the refund row and order status update atomically. E2E: one happy-path refund. Production: an alert on the refund error rate.</p></div></details>
</div>
`;export{t as default};

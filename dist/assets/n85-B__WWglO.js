const e=`<p class="goal">Deciding what an authenticated user may do. Broken access control is the #1 web vulnerability.</p>
<h3>Models</h3>
<table>
<tr><th>Model</th><th>Rule looks like</th><th>Fits</th></tr>
<tr><td><b>RBAC</b> (roles)</td><td>cashier can <code>sale:create</code>; manager can also <code>refund:approve</code></td><td>most business apps (a POS, FOS's owner/manager/staff)</td></tr>
<tr><td><b>Ownership</b></td><td>a customer may read an order only if <code>order.user_id == user.id</code></td><td>every consumer app</td></tr>
<tr><td><b>ABAC</b> (attributes)</td><td>a manager may approve a refund under ₹5,000 for <i>their own store</i> during a shift</td><td>complex policies</td></tr>
<tr><td><b>ReBAC</b> (relationships)</td><td>can edit if they're a member of the doc's folder's team (Google Zanzibar, OpenFGA)</td><td>sharing and collaboration</td></tr>
</table>
<pre data-lang="typescript"><code class="language-typescript">const PERMS = { cashier: ["sale:create"], manager: ["sale:create", "refund:approve"], owner: ["*"] } as const;
function can(user: User, perm: string, resource?: { storeId: string }) {
  const p = PERMS[user.role] as readonly string[];
  const allowed = p.includes("*") || p.includes(perm);
  return allowed &amp;&amp; (!resource || resource.storeId === user.storeId);     // + tenant/ownership check
}
// in EVERY handler, on the server:
if (!can(req.user, "refund:approve", order)) return res.status(403).json({ error: "forbidden" });</code></pre>
<h3>Rules</h3>
<ul>
<li><b>Check on the server, on every request.</b> Hiding a button in the UI is cosmetic.</li>
<li><b>IDOR</b> (insecure direct object reference): <code>GET /orders/1049</code> must verify that the order belongs to the caller. Changing the ID in the URL is attack #1.</li>
<li>Deny by default; centralise the checks (middleware or a policy module) so nobody forgets one.</li>
<li><b>Multi-tenant</b> data (many stores): scope every query by <code>store_id</code>. Postgres Row-Level Security can enforce it inside the database.</li>
<li>Log authorisation failures: they're a strong attack signal.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>85.1 <span class="levels">think</span> Write the authorisation rule for "a manager may approve refunds up to ₹5,000 for their own store; the owner may approve any refund".</summary><div><p><code>allow = user.role=="owner" or (user.role=="manager" and refund.store_id==user.store_id and refund.amount_paise&lt;=500000)</code>, checked on the server in the approve handler, with an audit log entry.</p></div></details>
</div>
`;export{e as default};

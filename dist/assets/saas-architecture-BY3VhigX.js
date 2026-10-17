const e=`<p class="goal">Architecting multi-tenant SaaS applications: data isolation models, schema-per-tenant, Row-Level Security, and slug routing.</p>
<h3>Multi-Tenant Data Isolation Models</h3>
<ul>
  <li><b>Shared DB, Shared Schema (Row-Level Security):</b> Simplest and cheapest. Every table has a <code>tenant_id</code> column. Use Postgres RLS to enforce isolation at the database layer.</li>
  <li><b>Schema per Tenant:</b> Isolated Postgres schemas per tenant within one database. Better compliance, higher migration complexity.</li>
  <li><b>Database per Tenant:</b> Strict isolation for enterprise contracts (HIPAA, SOC2). High operational overhead.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>376.1 <span class="levels">basic</span> Configure PostgreSQL Row-Level Security (RLS) on a multi-tenant documents table.</summary><div><p><code>ALTER TABLE docs ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation ON docs USING (tenant_id = current_setting('app.current_tenant_id')::uuid);</code></p></div></details>
</div>`;export{e as default};

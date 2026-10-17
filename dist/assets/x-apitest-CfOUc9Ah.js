const e=`<p class="goal">Testing a service through its HTTP interface, exactly as clients use it.</p>
<pre data-lang="typescript"><code class="language-typescript">// vitest + an in-process app (Hono's app.request / supertest for Express): no network port needed
import { describe, it, expect } from "vitest";
describe("POST /orders", () =&gt; {
  it("creates an order (201, Location header, body matches schema)", async () =&gt; {
    const res = await app.request("/orders", { method: "POST", headers: auth(cashier), body: JSON.stringify(validOrder) });
    expect(res.status).toBe(201);
    expect(res.headers.get("location")).toMatch(/^\\/orders\\/\\d+$/);
    expect(OrderSchema.safeParse(await res.json()).success).toBe(true);
  });
  it("rejects invalid input with a problem+json 422", async () =&gt; {
    const res = await app.request("/orders", { method: "POST", headers: auth(cashier), body: JSON.stringify({ items: [] }) });
    expect(res.status).toBe(422);
    expect(res.headers.get("content-type")).toContain("application/problem+json");
  });
  it("returns 401 without auth and 403 for another store", async () =&gt; { /* … */ });
  it("is idempotent with the same Idempotency-Key", async () =&gt; { /* two POSTs → same order id */ });
});</code></pre>
<h3>What to cover for every endpoint</h3>
<ul>
<li>The <b>success path</b>, and the response shape validated against the same schema or OpenAPI spec that clients use.</li>
<li><b>Validation:</b> missing fields, wrong types, boundaries, oversized payloads.</li>
<li><b>Auth matrix:</b> anonymous → 401; wrong role → 403; another tenant's resource → 403 or 404 (the <b>most important</b> security test: <a class="xref" data-old="n85">Authorization</a>).</li>
<li><b>Errors:</b> not found, conflicts (409), a dependency failing (stub it and expect 503 with a clean body).</li>
<li><b>Semantics:</b> idempotency, pagination (cursor stability), sorting and filtering.</li>
</ul>
<p>Tools: in-process test clients (fastest), Hurl or Bruno collections for readable request files, Schemathesis (generates tests from an OpenAPI spec, i.e. property-based API testing), and Pact for consumer-driven contracts.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Run Schemathesis against the OpenAPI spec of one of your APIs. What did it find?</summary><div><p>Run <code>uvx schemathesis run http://localhost:8080/openapi.json --checks all</code>. Typical finds: 500s on unexpected input (a missing validation), responses that don&#39;t match the declared schema, and undocumented status codes. Each one is a real bug or a doc fix.</p></div></details>
</div>
`;export{e as default};

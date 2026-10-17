const e=`<p class="goal">API design beyond REST basics: contracts, evolution, safety and developer experience.</p>
<h3>Contract first: OpenAPI</h3>
<pre data-lang="yaml"><code class="language-yaml">paths:
  /orders/{id}:
    get:
      parameters: [{ name: id, in: path, required: true, schema: { type: string } }]
      responses:
        "200": { content: { application/json: { schema: { $ref: "#/components/schemas/Order" } } } }
        "404": { $ref: "#/components/responses/NotFound" }</code></pre>
<p>One spec gives you docs (Swagger UI, Redoc), generated typed clients (<code>openapi-typescript</code>, oapi-codegen), request validation, and mock servers. FastAPI and many TS frameworks generate the spec from your code.</p>
<h3>Evolving without breaking clients</h3>
<table>
<tr><th>Safe (additive)</th><th>Breaking</th></tr>
<tr><td>new endpoint; new optional field in a request; new field in a response</td><td>removing or renaming a field; changing a type; making an optional field required; changing error codes or semantics</td></tr>
</table>
<p>For breaking changes: version the API (<code>/v2/…</code> or a header), run both versions, announce a deprecation date (the <code>Deprecation</code>/<code>Sunset</code> headers), and watch traffic to the old version before removing it. Mobile apps stay installed for years, so plan for old clients.</p>
<h3>Safety features</h3>
<ul>
<li><b>Idempotency keys:</b> the client sends <code>Idempotency-Key: uuid</code> on POST; the server stores the result under that key and replays it on retry. This is essential for payments and orders (a retried network call must not double-charge).</li>
<li><b>Rate limiting:</b> token bucket per user or API key; return 429 with <code>Retry-After</code>, and show the remaining quota in headers.</li>
<li><b>Pagination limits</b> (cap <code>limit</code> at 100), request size limits, timeouts.</li>
<li><b>Least data:</b> return only the fields the client needs; never internal IDs or other users' data.</li>
</ul>
<h3>Choosing a style</h3>
<table>
<tr><th>Style</th><th>Pick when</th></tr>
<tr><td>REST + JSON</td><td>default; public APIs; cacheable reads</td></tr>
<tr><td>GraphQL</td><td>many different clients need different shapes of deeply related data</td></tr>
<tr><td>gRPC</td><td>internal service-to-service calls; streaming; strict contracts</td></tr>
<tr><td>tRPC</td><td>a TS frontend and backend in one repo: end-to-end types with no spec</td></tr>
</table>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>83.1 <span class="levels">think</span> A client retries <code>POST /payments</code> after a timeout. Design the server so the customer is charged exactly once.</summary><div><p>Require an <code>Idempotency-Key</code>. Store (key, request hash, response) with a unique constraint; on a repeat, return the stored response; if the same key arrives with a different body, return 422. Keep keys for about 24 hours.</p></div></details>
</div>
`;export{e as default};

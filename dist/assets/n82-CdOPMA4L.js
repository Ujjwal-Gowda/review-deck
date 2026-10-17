const e=`<p class="goal">Designing resource-oriented HTTP APIs that clients can guess.</p>
<table>
<tr><th>Operation</th><th>Request</th><th>Success</th></tr>
<tr><td>List</td><td><code>GET /orders?status=paid&amp;limit=20&amp;cursor=abc</code></td><td>200 + a page of results</td></tr>
<tr><td>Get one</td><td><code>GET /orders/42</code></td><td>200, or 404</td></tr>
<tr><td>Create</td><td><code>POST /orders</code> + body</td><td><b>201</b> + <code>Location: /orders/43</code> + the new resource</td></tr>
<tr><td>Replace</td><td><code>PUT /orders/42</code></td><td>200 / 204</td></tr>
<tr><td>Partial update</td><td><code>PATCH /orders/42</code> <code>{"status":"packed"}</code></td><td>200</td></tr>
<tr><td>Delete</td><td><code>DELETE /orders/42</code></td><td>204 (repeating it is also fine: idempotent)</td></tr>
<tr><td>Sub-resource</td><td><code>GET /orders/42/items</code></td><td>200</td></tr>
<tr><td>Action that isn't CRUD</td><td><code>POST /orders/42/refund</code></td><td>202 if it's processed asynchronously</td></tr>
</table>
<h3>Conventions</h3>
<ul>
<li>Plural nouns, not verbs (<code>/orders</code>, not <code>/getOrders</code>). Consistent casing in JSON (<code>camelCase</code> or <code>snake_case</code>, pick one).</li>
<li><b>Status codes carry meaning:</b> 400 (malformed input), 401 (not logged in), 403 (logged in but not allowed), 404, 409 (conflict: stock already reserved), 422 (validation failed), 429 (rate-limited), 500 (a bug), 503 (overloaded or down).</li>
<li><b>One error shape everywhere</b>, e.g. RFC 9457 "problem details": <code>{"type":"…/out-of-stock","title":"Out of stock","status":409,"detail":"paneer: 0 left"}</code>.</li>
<li><b>Money as integers</b> (paise) or decimal strings, never floats. Timestamps in ISO 8601 UTC (<code>2026-09-27T10:15:00Z</code>). IDs as strings if they might exceed 2⁵³ (JS clients).</li>
</ul>
<h3>Lists: pagination, filtering, sorting</h3>
<p><b>Offset</b> (<code>?page=3&amp;limit=20</code>): simple, but slow at deep offsets, and it skips or duplicates rows when data changes. <b>Cursor</b> (<code>?after=ord_9f2c&amp;limit=20</code>, with the server returning <code>next_cursor</code>): stable and fast, using <code>WHERE id &gt; $cursor ORDER BY id LIMIT 20</code>. Prefer cursors for feeds and large tables.</p>
<p>Richardson maturity levels, and <b>HATEOAS</b> (links in responses), are good to recognise but rarely matter in practice. Consistency matters much more.</p>
<div class="callout seclens"><b class="t">Security lens · REST</b><p>Sequential IDs make enumeration trivial: always check ownership (IDOR). Return 404 rather than 403 for other tenants' resources if existence itself is sensitive.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>82.1 <span class="levels">basic</span> Design the URLs, methods and status codes for: listing a store's products, adding stock, marking an order packed, and cancelling an order.</summary><div><p><code>GET /stores/7/products?cursor=</code> (200); <code>POST /stores/7/stock-adjustments</code> (201); <code>PATCH /orders/42 {status:"packed"}</code> or <code>POST /orders/42/pack</code> (200/409 if the state is wrong); <code>POST /orders/42/cancel</code> (200/409).</p></div></details>
</div>
`;export{e as default};

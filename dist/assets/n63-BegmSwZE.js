const t=`<p class="goal">HTTP in depth: the protocol every web app, API and webhook speaks.</p>
<h3>Anatomy</h3>
<pre data-lang="http"><code class="language-http">GET /api/orders?status=paid&amp;limit=20 HTTP/1.1      ← method, path + query, version
Host: api.freshon.in                              ← required: one IP can host many sites
Accept: application/json                          ← what I can handle
Authorization: Bearer eyJ…
If-None-Match: "v42"                              ← conditional: "only send it if it changed"

HTTP/1.1 304 Not Modified                         ← status line
ETag: "v42"
Cache-Control: private, max-age=60</code></pre>
<h3>Method semantics</h3>
<table>
<tr><th>Method</th><th>Safe (no side effects)</th><th>Idempotent (repeat = same result)</th><th>Body</th></tr>
<tr><td>GET, HEAD</td><td>✓</td><td>✓</td><td>no</td></tr>
<tr><td>OPTIONS</td><td>✓</td><td>✓</td><td>no (used by CORS preflight)</td></tr>
<tr><td>PUT, DELETE</td><td>✗</td><td>✓</td><td>PUT yes</td></tr>
<tr><td>POST</td><td>✗</td><td>✗ (make it idempotent with an <code>Idempotency-Key</code> header)</td><td>yes</td></tr>
<tr><td>PATCH</td><td>✗</td><td>not necessarily</td><td>yes</td></tr>
</table>
<p>Browsers and proxies may retry idempotent requests automatically, and crawlers follow GET links. Never change data on GET.</p>
<h3>Headers worth knowing</h3>
<table>
<tr><th>Header</th><th>Purpose</th></tr>
<tr><td><code>Content-Type</code> / <code>Accept</code></td><td>the format of the body / the formats wanted back</td></tr>
<tr><td><code>Cache-Control</code></td><td><code>no-store</code>, <code>private</code>, <code>public, max-age=31536000, immutable</code> (for hashed assets)</td></tr>
<tr><td><code>ETag</code> / <code>If-None-Match</code></td><td>revalidation: a 304 response has no body, which saves bandwidth</td></tr>
<tr><td><code>Set-Cookie</code> / <code>Cookie</code></td><td>state across requests (sessions); flags covered in <a class="xref" data-old="n70">chapter 70</a></td></tr>
<tr><td><code>Location</code></td><td>the redirect target (with 301/302/307/308) or a new resource's URL (201)</td></tr>
<tr><td><code>Retry-After</code></td><td>with 429/503: when to try again</td></tr>
<tr><td><code>Content-Encoding: gzip/br</code></td><td>compression</td></tr>
</table>
<h3>Versions</h3>
<table>
<tr><th>Version</th><th>Transport</th><th>Key change</th></tr>
<tr><td>HTTP/1.1</td><td>TCP</td><td>keep-alive connections; one request at a time per connection (head-of-line blocking), so browsers open about 6 connections</td></tr>
<tr><td>HTTP/2</td><td>TCP + TLS</td><td>binary; many streams multiplexed over one connection; header compression</td></tr>
<tr><td>HTTP/3</td><td>QUIC over UDP</td><td>no TCP head-of-line blocking; faster handshakes; survives network changes (Wi-Fi → mobile)</td></tr>
</table>
<pre data-lang="shell"><code class="language-bash">curl -i https://freshon-demos.netlify.app          # response headers + body
curl -X POST -H 'Content-Type: application/json' -d '{"sku":"milk","qty":2}' localhost:8080/api/orders
curl -I --http2 https://example.com                  # HEAD request over HTTP/2</code></pre>
<details class="ex"><summary>63.1 <span class="levels">basic</span> Write a raw HTTP GET by hand with <code>nc</code> to example.com on port 80 and read the response.</summary><div><p><code>printf 'GET / HTTP/1.1\\r\\nHost: example.com\\r\\nConnection: close\\r\\n\\r\\n' | nc example.com 80</code>. Note the blank line (<code>\\r\\n\\r\\n</code>) that ends the headers.</p></div></details>
<div class="callout seclens"><b class="t">Security lens · HTTP</b><p>Send security headers on every response: <code>Strict-Transport-Security</code>, <code>Content-Security-Policy</code>, <code>X-Content-Type-Options: nosniff</code>, <code>Referrer-Policy</code>. Never put secrets or tokens in URLs: they end up in logs and Referer headers.</p></div>
`;export{t as default};

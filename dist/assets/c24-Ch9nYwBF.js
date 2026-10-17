const e=`<p class="goal">How programs talk across machines.</p>
<h3>Layers</h3>
<table>
<tr><th>Layer</th><th>Protocols</th><th>Job</th></tr>
<tr><td>Application</td><td>HTTP, DNS, WebSocket, SMTP, IPP (your printer project)</td><td>meaning</td></tr>
<tr><td>Security</td><td>TLS</td><td>encryption + server identity (the "S" in HTTPS)</td></tr>
<tr><td>Transport</td><td><b>TCP</b> (reliable, ordered stream; handshake) / <b>UDP</b> (fast, fire-and-forget; video, games, DNS, QUIC)</td><td>process to process, via <b>ports</b></td></tr>
<tr><td>Network</td><td>IP (v4/v6)</td><td>machine to machine, via <b>IP addresses</b> and routing</td></tr>
<tr><td>Link</td><td>Ethernet, Wi-Fi</td><td>the local hop</td></tr>
</table>
<h3>What happens when you open a URL</h3>
<ol>
<li><b>DNS</b> resolves <code>freshon.in</code> to an IP address (with caching at every level).</li>
<li>A <b>TCP handshake</b> (SYN, SYN-ACK, ACK), then a <b>TLS handshake</b> (certificate check, key exchange).</li>
<li>An <b>HTTP request</b> is sent; the server routes it, runs code, queries the DB, and returns a response.</li>
<li>The browser parses HTML, fetches CSS, JS and images (more requests), builds the DOM, and renders.</li>
</ol>
<h3>HTTP</h3>
<pre data-lang="http"><code class="language-http">POST /api/orders HTTP/1.1
Host: api.freshon.in
Content-Type: application/json
Authorization: Bearer eyJhbGci...

{"items": [{"sku": "milk-1l", "qty": 2}]}

HTTP/1.1 201 Created
Content-Type: application/json

{"id": 1048, "status": "placed"}</code></pre>
<table>
<tr><th>Methods</th><th>Status codes</th></tr>
<tr><td><b>GET</b> read (safe, idempotent) · <b>POST</b> create · <b>PUT</b> replace (idempotent) · <b>PATCH</b> partial update · <b>DELETE</b></td><td><b>2xx</b> success (200 OK, 201 Created, 204 No Content) · <b>3xx</b> redirect · <b>4xx</b> client error (400 bad request, 401 unauthenticated, 403 forbidden, 404, 409 conflict, 429 rate-limited) · <b>5xx</b> server error (500, 502 bad gateway, 503, 504 timeout)</td></tr>
</table>
<p><b>HTTP is stateless</b>: each request stands alone, and sessions are rebuilt from cookies or tokens. Headers carry metadata such as caching (<code>Cache-Control</code>, <code>ETag</code>) and <b>CORS</b> (which browser origins may call your API).</p>
<h3>API styles</h3>
<table>
<tr><th>Style</th><th>Pros</th><th>Cons</th></tr>
<tr><td><b>REST</b> (resources + HTTP verbs + JSON)</td><td>simple, cacheable, universal</td><td>over- or under-fetching; many round trips</td></tr>
<tr><td><b>GraphQL</b></td><td>client asks for exactly the fields it needs; one endpoint</td><td>caching and security are harder; server complexity</td></tr>
<tr><td><b>gRPC</b> (Protobuf over HTTP/2)</td><td>fast, typed, streaming; good between services</td><td>not browser-native; binary format</td></tr>
<tr><td><b>WebSocket / SSE</b></td><td>real-time server push (live order status)</td><td>stateful connections to scale; reconnection logic</td></tr>
<tr><td><b>Webhooks</b></td><td>the server calls <i>you</i> when events happen</td><td>you need a public endpoint, retries and signature checks</td></tr>
</table>
<pre data-lang="python"><code class="language-python">import urllib.request, json            # (or the requests / httpx libraries)
with urllib.request.urlopen("https://api.github.com/repos/python/cpython", timeout=10) as r:
    data = json.load(r)
print(data["stargazers_count"])</code></pre>
<p>Also know: <b>client/server</b>; <b>load balancer</b>; <b>reverse proxy</b> (nginx); <b>CDN</b> (caches static files near users); <b>latency</b> vs <b>bandwidth</b>; <b>NAT</b> and private IPs (<code>192.168.x.x</code>); <b>localhost</b> (127.0.0.1).</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>60.1 <span class="levels">basic</span> Trace what happens when you open https://freshon-demos.netlify.app using <code>dig</code>, <code>curl -v</code> and the browser's Network tab. Label each phase.</summary><div><p>DNS lookup (a CNAME to Netlify), TCP connect, the TLS handshake (certificate for *.netlify.app), the HTTP/2 GET for the HTML, then further requests for JS and CSS, with CDN cache headers (<code>age</code>, <code>cache-status</code>).</p></div></details>
</div>
`;export{e as default};

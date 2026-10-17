const t=`<p class="goal">The boxes that sit between clients and servers, and what each one actually does.</p>
<table>
<tr><th>Box</th><th>Acts for</th><th>Examples</th></tr>
<tr><td><b>Forward proxy</b></td><td>clients: they send their outbound traffic through it</td><td>corporate proxies, Squid, VPN egress</td></tr>
<tr><td><b>Reverse proxy</b></td><td>servers: clients think it <i>is</i> the server</td><td>nginx, Caddy, Traefik (<a class="xref" data-old="n149">Reverse Proxies</a>)</td></tr>
<tr><td><b>Load balancer</b></td><td>a pool of servers: it spreads the traffic</td><td>AWS ALB/NLB, HAProxy, Envoy, cloud LBs</td></tr>
<tr><td><b>NAT gateway</b></td><td>a private network sharing public IPs for outbound traffic</td><td>home routers, cloud NAT</td></tr>
<tr><td><b>API gateway</b></td><td>APIs: authentication, rate limits, routing, transformation</td><td>Kong, AWS API Gateway</td></tr>
</table>
<h3>L4 vs L7 load balancing</h3>
<table>
<tr><th></th><th>L4 (TCP/UDP)</th><th>L7 (HTTP)</th></tr>
<tr><td>Sees</td><td>IPs and ports</td><td>URLs, headers, cookies</td></tr>
<tr><td>Can do</td><td>very fast forwarding; any protocol</td><td>path/host routing, TLS termination, retries, header rewrites, WebSocket upgrades</td></tr>
<tr><td>Examples</td><td>AWS NLB, IPVS, HAProxy in TCP mode</td><td>ALB, nginx, Envoy</td></tr>
</table>
<h3>Balancing algorithms</h3>
<ul>
<li><b>Round robin:</b> simple, and assumes all requests cost the same.</li>
<li><b>Least connections / least outstanding requests:</b> better when requests vary in cost.</li>
<li><b>Weighted:</b> bigger machines get more traffic; gradual canaries.</li>
<li><b>Consistent hashing</b> (by user or key): keeps a user on the same backend, which helps caches (<a class="xref" data-old="n172">Sharding</a>).</li>
<li><b>Power of two choices:</b> pick 2 at random and send to the less loaded one. Surprisingly effective.</li>
</ul>
<h3>Essentials</h3>
<ul>
<li><b>Health checks</b> remove bad backends from rotation (<a class="xref" data-old="x-health">Health Checks</a>).</li>
<li><b>Sticky sessions</b> pin a client to one backend. Needed only when servers hold state; better to make them stateless.</li>
<li><b>Connection draining</b> finishes in-flight requests before removing a backend during deploys.</li>
<li><b>Client IP</b> is lost behind proxies. Use <code>X-Forwarded-For</code> or the PROXY protocol, and trust it only from your own proxies.</li>
<li><b>NAT</b> is why your laptop can't be reached from the internet without port forwarding, a tunnel (Cloudflare Tunnel, ngrok) or a mesh VPN (Tailscale).</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Run two copies of a small HTTP server on ports 8081 and 8082 behind nginx or Caddy with round robin. Hit it 10 times with curl, then stop one copy and hit it again.</summary><div><p>Have the responses show which backend answered: they alternate. After you stop one, the proxy keeps retrying or failing on it until a health check (or <code>max_fails</code>) marks it down, and then all traffic goes to the survivor.</p></div></details>
</div>
`;export{t as default};

const t=`<p class="goal">The whole journey of a code change, from your editor to a monitored production system. Every DevOps tool exists to make one arrow in this diagram safe and automatic.</p>
<div class="diagram">developer ─► git commit ─► GitHub ─► pull request ─► CI ──┬─ lint · typecheck
   (ch Git)                   (review)            │         ├─ unit / integration / API tests
                                                  │         └─ build + security scan
                                                  ▼
                                 merge ─► build Docker image (tag = git SHA) ─► container registry
                                                  ▼
                           deploy (staging ─► smoke tests ─► approval ─► production: rolling/canary)
                                                  ▼
            DNS ─► CDN ─► reverse proxy / load balancer (TLS) ─► app instances ─► PostgreSQL + Redis + queue
                                                  ▼
                        logs · metrics · traces ─► dashboards · SLOs · alerts ─► on-call ─► postmortems ─► back to the developer</div>
<table>
<tr><th>Arrow</th><th>Problem it solves</th><th>Chapters</th></tr>
<tr><td>git + PR</td><td>collaborate without overwriting each other; review</td><td><a class="xref" data-old="n43">Git Fundamentals</a>, <a class="xref" data-old="n48">Pull Requests</a></td></tr>
<tr><td>CI</td><td>catch broken code before it merges</td><td><a class="xref" data-old="n120">Continuous Integration</a></td></tr>
<tr><td>image + registry</td><td>"works on my machine": ship the exact environment</td><td><a class="xref" data-old="n114">Dockerfiles</a>, <a class="xref" data-old="n117">Registries</a></td></tr>
<tr><td>deploy strategy</td><td>release without downtime; limit the blast radius</td><td><a class="xref" data-old="n124">Continuous Delivery</a>, <a class="xref" data-old="n125">Deployment Strategies</a></td></tr>
<tr><td>proxy / load balancer</td><td>TLS, routing, spreading load, removing unhealthy instances</td><td><a class="xref" data-old="n149">Reverse Proxies</a>, <a class="xref" data-old="x-lb">Load Balancers</a></td></tr>
<tr><td>data stores</td><td>durable state; caching; async work</td><td><a class="xref" data-old="x-datamodels">Data Models</a>, <a class="xref" data-old="n90">Queues</a></td></tr>
<tr><td>observability</td><td>know it works; find out why when it doesn't</td><td><a class="xref" data-old="n154">Logging</a>, <a class="xref" data-old="n161">SLOs</a></td></tr>
<tr><td>on-call loop</td><td>fix, learn, prevent</td><td><a class="xref" data-old="n251">Incident Response</a></td></tr>
</table>
<p>Build this pipeline once for real in the project ladder (<a class="xref" data-old="n239">CI/CD Project</a>, <a class="xref" data-old="n240">Cloud Project</a>). After that, every new tool you meet slots into one of these arrows.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">think</span> Draw this pipeline for the foundations site itself (Vite + Netlify). Which arrows exist today, which are manual, and which are missing?</summary><div><p>Today: git (local), a manual <code>npm run build</code>, and a manual Netlify deploy. Missing: a GitHub repo and PRs, CI (typecheck, build, link checker), automatic deploys with previews, and a smoke test (the page title and one chapter load). Adding these is a perfect first CI/CD exercise.</p></div></details>
</div>
`;export{t as default};

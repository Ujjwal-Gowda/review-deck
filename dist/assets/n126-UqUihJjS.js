const e=`<p class="goal">What "the cloud" actually offers, and how to reason about it before learning any single provider.</p>
<table>
<tr><th>Model</th><th>You manage</th><th>Provider manages</th><th>Examples</th></tr>
<tr><td>Bare metal / colocation</td><td>everything above the hardware</td><td>power, network</td><td>Hetzner dedicated servers</td></tr>
<tr><td><b>IaaS</b> (VMs)</td><td>OS, runtime, app, scaling</td><td>hardware, virtualisation</td><td>EC2, Compute Engine, DigitalOcean Droplets</td></tr>
<tr><td>Containers as a service</td><td>images, config</td><td>servers, scheduling</td><td>ECS Fargate, Cloud Run, Fly.io</td></tr>
<tr><td><b>PaaS</b></td><td>code, config</td><td>everything else</td><td>Render, Railway, Heroku, App Engine</td></tr>
<tr><td><b>Serverless / FaaS</b></td><td>functions</td><td>everything, including scaling to zero</td><td>Lambda, Cloud Functions, Cloudflare Workers</td></tr>
<tr><td>Managed services</td><td>schema, usage</td><td>ops, backups, HA</td><td>RDS, S3, SQS, managed Redis</td></tr>
</table>
<h3>Core concepts</h3>
<ul>
<li><b>Region</b> (e.g. <code>ap-south-1</code>, Mumbai) contains several <b>availability zones</b> (separate data centres). Spread across AZs for high availability; pick regions close to users (and to meet data-residency rules).</li>
<li><b>Shared responsibility:</b> the provider secures the cloud; <i>you</i> secure what you put in it (IAM, open buckets, patching your VMs).</li>
<li><b>Elasticity:</b> scale out on demand, and pay per use.</li>
<li><b>Cost</b> is an engineering concern: egress (data out) is expensive, idle resources cost money, and managed services cost more but save engineering hours.</li>
</ul>
<div class="callout key"><b class="t">Trade-offs: how much cloud do you need?</b><p>A single VPS with Docker Compose, Caddy and backups serves a surprising amount of traffic for very little money. Move up the managed ladder when ops time, uptime needs or scale justify the cost, not because big companies do it.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>126.1 <span class="levels">think</span> Estimate the monthly cost of hosting FreshOn on one 4 vCPU / 8 GB VPS plus managed backups, and compare it with a fully managed setup (container platform + managed Postgres + Redis).</summary><div><p>The VPS route is typically a small fraction of the managed route. You trade ops time (patching, backups, on-call) for money. Write down what you'd have to handle yourself.</p></div></details>
</div>
`;export{e as default};

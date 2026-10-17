const e=`<p class="goal">Managed databases: what you're paying for, and what's still your job.</p>
<p>The service handles provisioning, patching, automated backups with point-in-time recovery, replicas, failover, monitoring and storage growth. <b>Still your job:</b> schema design, indexes, query performance, connection management, access control, and <i>testing a restore</i>.</p>
<table>
<tr><th>Feature</th><th>What to know</th></tr>
<tr><td>Multi-AZ / HA</td><td>a synchronous standby in another zone; automatic failover in about 1–2 minutes (the app must reconnect)</td></tr>
<tr><td>Read replicas</td><td>asynchronous copies for read scaling and reporting; <b>replication lag</b> means reads can be stale (don't read your own writes from a replica)</td></tr>
<tr><td>Backups</td><td>daily snapshots plus transaction logs give point-in-time restore within the retention window; take manual snapshots before risky migrations</td></tr>
<tr><td>Instance size</td><td>RAM matters most (the working set should fit in cache); watch CPU, IOPS and connection count</td></tr>
<tr><td>Networking</td><td>private subnet only, reachable from the app's security group; never publicly exposed</td></tr>
</table>
<p>Serverless options (Aurora Serverless, Neon, PlanetScale-style services) scale compute automatically and can scale to zero, trading some latency and predictability for convenience.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>130.1 <span class="levels">think</span> Your read replica lags 5 seconds. A user updates their address and immediately sees the old one. Name two fixes.</summary><div><p>Read from the primary for that user for a short window after a write (read-your-writes), or show the value you just wrote on the client side. Or route this particular read to the primary.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">The standard moves for handling more load, in the order you should try them.</p>
<ol>
<li><b>Measure and optimise first:</b> indexes, N+1 fixes, caching, query tuning. Often worth 10–100×.</li>
<li><b>Vertical scaling:</b> a bigger machine. Simple and underrated, but it has a ceiling and remains a single point of failure.</li>
<li><b>Stateless app servers + a load balancer:</b> horizontal scaling. Move sessions, uploads and in-memory state out of the process (Redis, object storage).</li>
<li><b>Cache and CDN</b> for read-heavy traffic.</li>
<li><b>Read replicas</b> for database reads (watch replication lag).</li>
<li><b>Asynchronous work via queues:</b> smooths spikes and takes slow work off the request path.</li>
<li><b>Split by function:</b> separate the hot path (rider locations) into its own service or store.</li>
<li><b>Partition the data (sharding)</b> once writes or data size exceed one primary (<a class="xref" data-old="n172">chapter 172</a>).</li>
<li><b>Multi-region</b> for global latency or disaster recovery. That brings the hardest consistency trade-offs.</li>
</ol>
<p>Scaling costs complexity at every step, so take the next step only when the metrics say the current one is saturated.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>183.1 <span class="levels">think</span> Traffic grows 10×. List your scaling steps for FreshOn in the order you'd actually do them.</summary><div><p>Profile and fix slow queries → cache the catalogue → add stateless API replicas → read replica for reports → queue the side effects → move the rider-location path to its own store → consider partitioning by store only if writes demand it.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">Letting the platform know when your service is alive, ready, and about to stop, so deploys and failures are invisible to users.</p>
<table>
<tr><th>Endpoint</th><th>Question</th><th>Should check</th><th>If it fails</th></tr>
<tr><td><code>/livez</code> (liveness)</td><td>is the process stuck?</td><td>only the process itself (the event loop responds). <b>Never</b> the database.</td><td>restart the process</td></tr>
<tr><td><code>/readyz</code> (readiness)</td><td>should it receive traffic right now?</td><td>startup finished; required dependencies reachable; not shutting down</td><td>stop sending traffic (no restart)</td></tr>
<tr><td>startup probe</td><td>has it finished booting?</td><td>migrations or warm-up done</td><td>wait longer before checking liveness</td></tr>
</table>
<div class="callout warn"><b class="t">Classic mistake</b><p>If liveness checks the database, a 30-second database blip makes the orchestrator restart <i>every</i> instance at once, turning a small outage into a full one.</p></div>
<h3>Graceful shutdown</h3>
<div class="diagram">SIGTERM received ─► mark NOT READY (readyz → 503) ─► load balancer stops sending new requests (a few seconds)
                 ─► stop accepting connections ─► finish in-flight requests and jobs (with a deadline)
                 ─► close DB pools, flush logs and metrics ─► exit 0      (all before the platform's SIGKILL, ~30 s)</div>
<pre data-lang="go"><code class="language-go">var shuttingDown atomic.Bool
http.HandleFunc("/readyz", func(w http.ResponseWriter, r *http.Request) {
    if shuttingDown.Load() || db.PingContext(r.Context()) != nil { w.WriteHeader(503); return }
    w.WriteHeader(200)
})
ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM, os.Interrupt)
&lt;-ctx.Done(); stop()
shuttingDown.Store(true)
time.Sleep(5 * time.Second)                          // let the load balancer notice we're not ready
c, cancel := context.WithTimeout(context.Background(), 20*time.Second); defer cancel()
srv.Shutdown(c)                                       // drains in-flight requests
workers.Stop(c); db.Close()</code></pre>
<p>Background workers: finish or hand back the current job on SIGTERM; never take a new one after the signal (<a class="xref" data-old="n91">Background Jobs</a>). The details of signals are in <a class="xref" data-old="n04">Processes &amp; Programs</a>; Kubernetes probes in <a class="xref" data-old="n136">Pods</a>.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Add /livez and /readyz to one of your servers, implement graceful shutdown, and prove it: run a load of slow requests, send SIGTERM, and confirm none fail.</summary><div><p>Use <code>hey</code> or <code>oha</code> to run slow requests, then <code>kill -TERM pid</code> during the load. Every in-flight request should complete with 200. Then compare with <code>kill -9</code>, which drops them.</p></div></details>
</div>
`;export{e as default};

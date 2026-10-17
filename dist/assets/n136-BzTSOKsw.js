const e=`<p class="goal">The pod: Kubernetes' smallest unit, one or more containers sharing a network and storage.</p>
<pre data-lang="yaml"><code class="language-yaml">apiVersion: v1
kind: Pod
metadata: { name: api, labels: { app: api } }
spec:
  containers:
    - name: api
      image: ghcr.io/ujjwal/shop-api:1.4.2
      ports: [{ containerPort: 8080 }]
      resources:
        requests: { cpu: 100m, memory: 128Mi }    # what the scheduler reserves
        limits:   { memory: 256Mi }               # above this → OOMKilled
      readinessProbe: { httpGet: { path: /readyz, port: 8080 }, periodSeconds: 5 }   # ready for traffic?
      livenessProbe:  { httpGet: { path: /healthz, port: 8080 }, initialDelaySeconds: 10 }  # stuck? → restart
      startupProbe:   { httpGet: { path: /healthz, port: 8080 }, failureThreshold: 30, periodSeconds: 2 }</code></pre>
<ul>
<li>Containers in one pod share <b>localhost</b> and volumes. That's used for <b>sidecars</b> (log shippers, proxies) and <b>init containers</b> (run migrations or wait for a dependency before the app starts).</li>
<li>Pods are <b>ephemeral</b>: they get new IPs when recreated, and you rarely create them directly. Deployments manage them (<a class="xref" data-old="n137">chapter 137</a>).</li>
<li>Lifecycle phases: Pending → Running → Succeeded/Failed. Common failures: <code>ImagePullBackOff</code> (wrong image or registry auth), <code>CrashLoopBackOff</code> (the app exits: check <code>kubectl logs --previous</code>), <code>OOMKilled</code> (raise the memory limit or fix the leak), Pending (no node has enough resources).</li>
<li><b>Readiness vs liveness:</b> readiness failing removes the pod from traffic; liveness failing restarts it. A liveness probe that checks the database will restart every pod during a DB blip, so keep liveness shallow.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>136.1 <span class="levels">basic</span> Deploy a pod whose liveness probe fails after 30 seconds. Watch the restarts and read the events.</summary><div><p><code>kubectl describe pod</code> shows "Liveness probe failed" events and an increasing restart count. <code>kubectl logs --previous</code> shows the crashed container's output.</p></div></details>
</div>
`;export{e as default};

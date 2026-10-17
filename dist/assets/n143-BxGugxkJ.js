const e=`<p class="goal">Sizing workloads correctly and scaling them automatically.</p>
<h3>Requests and limits</h3>
<table>
<tr><th></th><th>requests</th><th>limits</th></tr>
<tr><td>CPU (<code>500m</code> = half a core)</td><td>guaranteed share; used by the scheduler</td><td>throttled above it (many teams set no CPU limit, to avoid throttling)</td></tr>
<tr><td>Memory</td><td>used for scheduling</td><td><b>killed (OOMKilled)</b> above it; set limit ≈ request for predictability</td></tr>
</table>
<p>Set requests from observed usage (p90 in your metrics), not guesses. Too low leads to noisy neighbours and evictions; too high wastes money.</p>
<pre data-lang="yaml"><code class="language-yaml">apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: api }
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: api }
  minReplicas: 2                  # ≥ 2 for availability
  maxReplicas: 20
  metrics: [{ type: Resource, resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } } }]</code></pre>
<ul>
<li><b>HPA</b> changes the replica count based on CPU, memory or custom metrics (requests per second, queue depth via KEDA).</li>
<li><b>Cluster Autoscaler / Karpenter</b> add nodes when pods can't be scheduled, and remove idle ones.</li>
<li><b>VPA</b> recommends or adjusts requests.</li>
<li><b>PodDisruptionBudget</b> keeps a minimum number available during node maintenance; <b>topology spread constraints</b> spread replicas across zones.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>143.1 <span class="levels">basic</span> Configure an HPA on a CPU-heavy deployment and load it with a loop. Watch the replicas scale up and then down.</summary><div><p><code>kubectl autoscale deploy app --cpu-percent=60 --min=1 --max=5</code>, then <code>kubectl get hpa -w</code> while running the load. It needs metrics-server and CPU requests set.</p></div></details>
</div>
`;export{e as default};

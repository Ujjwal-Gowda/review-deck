const e=`<p class="goal">A firewall between pods: by default every pod can talk to every other pod.</p>
<pre data-lang="yaml"><code class="language-yaml">apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: db-allow-api, namespace: shop }
spec:
  podSelector: { matchLabels: { app: db } }       # this policy protects the db pods
  policyTypes: [Ingress]
  ingress:
    - from: [{ podSelector: { matchLabels: { app: api } } }]   # only api pods may connect
      ports: [{ port: 5432 }]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: default-deny, namespace: shop }
spec: { podSelector: {}, policyTypes: [Ingress] }  # deny all inbound unless another policy allows it</code></pre>
<p>Policies are <b>additive allow-lists</b>: once any policy selects a pod, only the explicitly allowed traffic reaches it. They're enforced by the <b>CNI plugin</b> (Calico, Cilium); on a CNI without support, they silently do nothing. Start with default-deny per namespace, then open what's needed, remembering DNS egress (port 53) if you also restrict egress. Cilium adds L7 rules (HTTP paths) and good visibility (Hubble).</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>146.1 <span class="levels">basic</span> Apply a default-deny ingress policy to a namespace, then allow only app=api to reach app=db on 5432. Test with curl or nc.</summary><div><p>It needs a CNI that enforces policies (k3d's default may not; Calico or Cilium do). Traffic from other pods should now time out.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">Injecting non-secret configuration into pods.</p>
<pre data-lang="yaml"><code class="language-yaml">apiVersion: v1
kind: ConfigMap
metadata: { name: api-config }
data:
  LOG_LEVEL: info
  FEATURE_ZONE_FEES: "true"
  app.yaml: |
    rateLimit: 100
---
# in the Deployment's container spec:
envFrom: [{ configMapRef: { name: api-config } }]          # every key becomes an env var
volumeMounts: [{ name: cfg, mountPath: /etc/app }]           # or mount as files: /etc/app/app.yaml
# volumes: [{ name: cfg, configMap: { name: api-config } }]</code></pre>
<ul>
<li><b>Env vars</b> are read once at startup, so changing the ConfigMap needs a pod restart (<code>kubectl rollout restart deploy/api</code>). A common trick: put a hash of the config in a pod annotation so changes trigger a rollout.</li>
<li><b>Mounted files</b> update in place (after a delay), which suits apps that watch and reload their config.</li>
<li>One image, many environments: the same Deployment YAML with a different ConfigMap per environment (Kustomize overlays or Helm values: <a class="xref" data-old="n144">chapter 144</a>).</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>140.1 <span class="levels">basic</span> Mount a ConfigMap as a file, change it, and observe whether the running pod sees the change (file vs env var).</summary><div><p>The mounted file updates after a short delay; environment variables don't change until the pod restarts (<code>kubectl rollout restart</code>).</p></div></details>
</div>
`;export{e as default};

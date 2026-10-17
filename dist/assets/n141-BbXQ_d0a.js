const e=`<p class="goal">Secrets in Kubernetes: what they protect, and what they don't.</p>
<pre data-lang="shell"><code class="language-bash">kubectl create secret generic api-secrets --from-literal=DATABASE_URL='postgres://…' --dry-run=client -o yaml
# consumed like ConfigMaps: envFrom: [{ secretRef: { name: api-secrets } }]  or mounted as files</code></pre>
<div class="callout warn"><b class="t">base64 is not encryption</b><p>Secret values are only base64-encoded. Anyone who can read Secrets in a namespace (RBAC) or read etcd can see them. So: enable <b>encryption at rest</b> for etcd, restrict <code>get secrets</code> via RBAC, and never commit Secret YAML to git.</p></div>
<table>
<tr><th>Approach</th><th>How</th></tr>
<tr><td><b>External Secrets Operator</b></td><td>syncs from AWS/GCP Secret Manager or Vault into k8s Secrets. <b>The common production choice.</b></td></tr>
<tr><td>Sealed Secrets / SOPS</td><td>commit <i>encrypted</i> secrets to git; the cluster decrypts them (fits GitOps)</td></tr>
<tr><td>Secrets Store CSI driver</td><td>mounts secrets straight from the cloud manager as files</td></tr>
<tr><td>Workload identity (IRSA, GKE WI)</td><td>pods get cloud IAM roles, so many secrets aren't needed at all</td></tr>
</table>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>141.1 <span class="levels">basic</span> Create a Secret, then read it back with <code>kubectl get secret -o yaml</code> and base64-decode it. What does that tell you?</summary><div><p>Anyone with read access to Secrets can see the values: base64 isn't encryption. Restrict it with RBAC, and enable encryption at rest.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">Storing and distributing images.</p>
<pre data-lang="shell"><code class="language-bash">echo $GHCR_TOKEN | docker login ghcr.io -u ujjwal --password-stdin
docker build -t ghcr.io/ujjwal/shop-api:1.4.2 -t ghcr.io/ujjwal/shop-api:sha-$(git rev-parse --short HEAD) .
docker push ghcr.io/ujjwal/shop-api --all-tags</code></pre>
<table><tr><th>Registry</th><th>Notes</th></tr>
<tr><td>Docker Hub</td><td>the default public registry; pull rate limits for anonymous users</td></tr>
<tr><td>GHCR (GitHub)</td><td>tied to repos and Actions (<code>GITHUB_TOKEN</code> can push)</td></tr>
<tr><td>ECR / Artifact Registry / ACR</td><td>the cloud providers' own; IAM-integrated</td></tr>
<tr><td>Harbor / self-hosted</td><td>on-prem, with scanning and replication</td></tr></table>
<h3>Tagging strategy</h3>
<ul>
<li>Tag every build with the <b>git SHA</b> (immutable and traceable), plus semver for releases (<code>1.4.2</code>, <code>1.4</code>, <code>1</code>).</li>
<li>Deploy by SHA or digest, never by <code>latest</code>: you want to know exactly what's running and roll back precisely.</li>
<li>Set retention policies to delete old untagged images; scan images for vulnerabilities (Trivy, Docker Scout, registry scanning); sign them (cosign) for supply-chain integrity.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>117.1 <span class="levels">basic</span> Push an image to GHCR tagged with the git SHA and a version, then pull it by digest.</summary><div><p><code>docker push ghcr.io/you/app:$SHA</code>; get the digest with <code>docker inspect --format '{{index .RepoDigests 0}}'</code>; <code>docker pull ghcr.io/you/app@sha256:…</code> is immutable.</p></div></details>
</div>
`;export{e as default};

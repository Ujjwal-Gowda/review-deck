const e=`<p class="goal">Getting every verified change into users' hands safely and automatically.</p>
<div class="diagram">merge to main → CI green → build image (tag = SHA) → push to registry
 → deploy to STAGING → smoke tests / E2E → (approval gate) → deploy to PRODUCTION
 → health checks + metrics watch → auto-rollback if error rate spikes</div>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>Continuous Delivery</td><td>every change is <i>deployable</i>; production deploys happen at the push of a button</td></tr>
<tr><td>Continuous Deployment</td><td>every green change goes to production automatically</td></tr>
<tr><td>Environment</td><td>dev → staging (production-like) → production, each with its own config and secrets</td></tr>
<tr><td>Smoke test</td><td>a quick "is it alive and are the key paths working" check right after a deploy</td></tr>
<tr><td>GitOps</td><td>the desired state lives in git; a controller (Argo CD, Flux) syncs the cluster to match it</td></tr>
</table>
<p><b>Principles:</b> deploy small and often (small changes are low-risk and easy to debug); make rollback a one-click, practised operation; decouple deploy from release with feature flags; and run database migrations as a separate, backward-compatible step (<a class="xref" data-old="n99">chapter 99</a>). Tools: GitHub Actions deploy jobs, Argo CD, Spinnaker, the cloud providers' deploy services, and platforms (Netlify, Vercel, Render, Fly.io, Railway) that do it for you.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>124.1 <span class="levels">think</span> Sketch the delivery pipeline for the foundations site itself: from a push to main to a live Netlify deploy, with a preview for PRs.</summary><div><p>On PR: build, then deploy a preview (<code>netlify deploy --dir dist</code>) and comment its URL on the PR. On main: build, <code>netlify deploy --prod</code>, then smoke-test the site title and one chapter URL.</p></div></details>
</div>
`;export{e as default};

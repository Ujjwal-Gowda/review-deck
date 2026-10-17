const e=`<p class="goal">Why infrastructure belongs in git, and the workflow around it.</p>
<table>
<tr><th>Clicking in consoles</th><th>Infrastructure as code</th></tr>
<tr><td>undocumented; "who changed the security group?"</td><td>every change is a reviewed commit with a reason</td></tr>
<tr><td>staging and prod drift apart</td><td>the same modules with different variables</td></tr>
<tr><td>disaster recovery = remembering 200 clicks</td><td><code>apply</code> recreates the environment</td></tr>
<tr><td>hard to audit</td><td>the git history is the audit log</td></tr>
</table>
<div class="diagram">branch → edit .tf → PR → CI runs fmt, validate, tflint, security scan (checkov/trivy) + \`terraform plan\`, posted as a PR comment
      → review the PLAN (not just the code) → merge → CI runs \`apply\` with an OIDC role → drift detection on a schedule</div>
<ul>
<li><b>Declarative:</b> describe the end state; the tool computes the steps. <b>Idempotent:</b> applying twice changes nothing the second time.</li>
<li>Structure it as small <b>modules</b> (network, database, service) composed per environment; keep separate state per environment to limit the blast radius.</li>
<li>Protect critical resources (<code>prevent_destroy</code>, deletion protection) and never run <code>apply</code> from a laptop against production.</li>
<li>Treat configuration of servers (Ansible) and of clusters (Helm/Kustomize + GitOps) the same way: everything in git.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>148.1 <span class="levels">think</span> Someone changed a security group in the AWS console. How does IaC detect it, and what should happen next?</summary><div><p><code>terraform plan</code> shows the drift (the real resource differs from the config). Either revert it by applying the code, or codify the change in a PR. Scheduled drift-detection jobs catch this automatically.</p></div></details>
</div>
`;export{e as default};

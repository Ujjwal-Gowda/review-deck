const e=`<p class="goal">The cloud-specific security basics that prevent most breaches.</p>
<ul>
<li><b>Identity is the perimeter:</b> SSO with MFA for people; roles instead of access keys for workloads; no daily use of the root account; least-privilege policies (<a class="xref" data-old="n132">chapter 132</a>).</li>
<li><b>Account structure:</b> separate prod and dev accounts or projects, with organisation-wide guardrails (service control policies: "no one may disable audit logging").</li>
<li><b>Network:</b> private subnets for apps and data; security groups that reference each other; no databases or admin ports (22, 3389) open to the internet; VPN or SSM Session Manager for admin access.</li>
<li><b>Data:</b> encryption at rest (on by default with KMS keys), public-access blocks on every bucket, and TLS everywhere.</li>
<li><b>Visibility:</b> audit logs (CloudTrail) on in every region and sent to a locked-down account; security findings (GuardDuty, Security Hub, Defender); config rules that detect drift ("bucket became public").</li>
<li><b>The breaches that actually happen:</b> leaked keys in git, public buckets, over-privileged roles, unpatched internet-facing VMs, and SSRF that reaches the instance metadata service (require IMDSv2).</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>167.1 <span class="levels">think</span> List the five cloud misconfigurations you'd check first in a new AWS account.</summary><div><p>Public buckets, access keys that are old or unused, security groups open to 0.0.0.0/0 on admin or database ports, CloudTrail disabled, and the root account without MFA. Also check that instances require IMDSv2.</p></div></details>
</div>
`;export{e as default};

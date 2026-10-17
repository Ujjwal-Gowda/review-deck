const t=`<p class="goal">Security isn't a final chapter: it's a lens on every layer. This map shows where you've already met it, and where to look next.</p>
<table>
<tr><th>Layer</th><th>Threats</th><th>Where it's covered</th></tr>
<tr><td>Machine and OS</td><td>memory corruption, privilege escalation</td><td><a class="xref" data-old="c38">C</a> (undefined behaviour, sanitizers), <a class="xref" data-old="n55">Permissions</a>, <a class="xref" data-old="n57">SSH</a></td></tr>
<tr><td>Code and dependencies</td><td>injection, unsafe deserialisation, malicious packages</td><td><a class="xref" data-old="c26">OWASP Top 10</a>, <a class="xref" data-old="n168">Supply Chain Security</a></td></tr>
<tr><td>Network</td><td>eavesdropping, spoofing, exposed ports</td><td><a class="xref" data-old="n64">HTTPS/TLS</a>, <a class="xref" data-old="n131">Cloud Networking</a></td></tr>
<tr><td>Browser</td><td>XSS, CSRF, clickjacking</td><td><a class="xref" data-old="n70">Web Security</a></td></tr>
<tr><td>Identity</td><td>credential stuffing, session theft, broken access control</td><td><a class="xref" data-old="n84">Authentication</a>, <a class="xref" data-old="n85">Authorization</a>, <a class="xref" data-old="n163">Authentication Security</a></td></tr>
<tr><td>Data</td><td>leaks, tampering, loss</td><td><a class="xref" data-old="n164">Cryptography</a>, <a class="xref" data-old="n152">Backups</a></td></tr>
<tr><td>Delivery pipeline</td><td>leaked secrets, poisoned CI, unsigned artifacts</td><td><a class="xref" data-old="n123">Secrets</a>, <a class="xref" data-old="n51">GitHub Actions</a></td></tr>
<tr><td>Infrastructure</td><td>over-privileged roles, public buckets, container escape</td><td><a class="xref" data-old="n132">IAM</a>, <a class="xref" data-old="n166">Container Security</a>, <a class="xref" data-old="n167">Cloud Security</a></td></tr>
<tr><td>AI features</td><td>prompt injection, data exfiltration, excessive agency</td><td><a class="xref" data-old="n226">AI Security</a></td></tr>
</table>
<h3>Threat modelling in 20 minutes</h3>
<ol>
<li><b>Draw the system:</b> components, data stores and the arrows between them. Mark the <b>trust boundaries</b> (internet → your API, your API → a third party, user → admin).</li>
<li><b>Walk every arrow that crosses a boundary with STRIDE:</b> <b>S</b>poofing, <b>T</b>ampering, <b>R</b>epudiation, <b>I</b>nformation disclosure, <b>D</b>enial of service, <b>E</b>levation of privilege. Ask "how could this go wrong here?"</li>
<li><b>Rank</b> by likelihood × impact, and pick mitigations for the top few.</li>
<li><b>Repeat</b> whenever the design changes: new integrations and new data are when threats appear.</li>
</ol>
<p><b>Defence in depth:</b> assume any single control fails, and layer them: input validation, <i>and</i> parameterised queries, <i>and</i> a least-privilege database role, <i>and</i> monitoring. Throughout the curriculum, look for the <b>Security lens</b> notes in non-security chapters.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">think</span> Threat-model the FreshOn demo kit deployment on Netlify with STRIDE. Name one threat per letter and one mitigation.</summary><div><p>S: someone clones the demos under a look-alike domain (publish the official link). T: a compromised Netlify account alters the files (2FA, deploy notifications). R: nobody knows who deployed what (deploy logs). I: the embedded Google API key gets reused (referrer restrictions). D: bandwidth abuse (Netlify limits, a CDN). E: none, since it&#39;s static. That&#39;s the point: static sites have a small attack surface.</p></div></details>
</div>
`;export{t as default};

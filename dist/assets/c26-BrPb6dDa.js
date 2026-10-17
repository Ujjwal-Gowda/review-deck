const e=`<p class="goal">Every input is hostile until proven otherwise.</p>
<table>
<tr><th>Vulnerability</th><th>What happens</th><th>Defence</th></tr>
<tr><td><b>SQL injection</b></td><td><code>"… WHERE name = '" + name + "'"</code> with name <code>' OR 1=1 --</code> dumps the table</td><td><b>Parameterised queries</b> always: <code>cur.execute("… WHERE name = ?", (name,))</code></td></tr>
<tr><td><b>Command injection</b></td><td><code>os.system("convert " + filename)</code> with <code>x; rm -rf ~</code></td><td><code>subprocess.run([...list of args...])</code>, never <code>shell=True</code> with input</td></tr>
<tr><td><b>XSS</b></td><td>User text rendered as HTML runs attacker JS in other users' browsers</td><td>Escape output (React does by default); Content-Security-Policy</td></tr>
<tr><td><b>CSRF</b></td><td>Another site makes your browser send authenticated requests</td><td>SameSite cookies, CSRF tokens</td></tr>
<tr><td><b>Path traversal</b></td><td><code>?file=../../etc/passwd</code></td><td>Resolve the path and check it stays inside the allowed directory</td></tr>
<tr><td><b>Broken access control</b></td><td><code>/orders/1049</code> shows someone else's order</td><td>Check authorisation on <i>every</i> request, server-side</td></tr>
<tr><td><b>Memory-safety bugs</b></td><td>Buffer overflow, use-after-free (C/C++)</td><td>Memory-safe languages; sanitizers; fuzzing</td></tr>
<tr><td><b>Secrets leakage</b></td><td>API keys committed to git</td><td>Env vars / secret managers; <code>.gitignore</code>; rotate a key if it's ever exposed</td></tr>
<tr><td><b>Supply chain</b></td><td>Malicious dependency</td><td>Lockfiles, audits (<code>npm audit</code>, <code>pip-audit</code>), minimal dependencies</td></tr>
<tr><td><b>Prompt injection</b> (AI)</td><td>Text in a document or web page instructs your LLM agent to do something harmful</td><td>Treat model output as untrusted; least-privilege tools; human confirmation (<a class="xref" data-old="c32">chapter 32</a>)</td></tr>
</table>
<h3>Core concepts</h3>
<ul>
<li><b>Authentication</b> (who you are) vs <b>authorisation</b> (what you may do).</li>
<li><b>Passwords:</b> never store them. Store a slow salted hash (<b>bcrypt, scrypt, Argon2</b>), never MD5/SHA-1/SHA-256 alone.</li>
<li><b>Hashing</b> (one-way, fixed-size fingerprint) vs <b>encryption</b> (reversible with a key). <b>Symmetric</b> (AES: one shared key, fast) vs <b>asymmetric</b> (RSA/ECC: public key encrypts or verifies, private key decrypts or signs; TLS and SSH use it). <b>Digital signature:</b> proves who sent something and that it wasn't altered.</li>
<li><b>Tokens:</b> sessions (server-side state) vs <b>JWT</b> (signed, self-contained; hard to revoke). <b>OAuth 2 / OIDC</b> for "Log in with Google".</li>
<li><b>Principles:</b> least privilege; defence in depth; validate input and escape output; secure defaults; never roll your own crypto.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>162.1 <span class="levels">think</span> Audit one of your apps against the injection, XSS, access-control and secrets rows of the table in this chapter. Write down one finding for each.</summary><div><p>Typical findings: string-built SQL somewhere, <code>dangerouslySetInnerHTML</code>, an endpoint that doesn't check ownership of the resource, a key in a committed file. Fix each finding and add a test for it.</p></div></details>
</div>
`;export{e as default};

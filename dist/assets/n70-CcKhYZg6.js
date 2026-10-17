const e=`<p class="goal">The browser's security model, and the attacks that exploit gaps in it.</p>
<h3>Same-origin policy</h3>
<p>An <b>origin</b> is scheme + host + port (<code>https://app.freshon.in:443</code>). JS on one origin can't <i>read</i> responses from another. Otherwise any site you visit could read your Gmail using your cookies. <b>CORS</b> is the server opting in to relax this:</p>
<pre data-lang="http"><code class="language-http">OPTIONS /api/orders            ← browser "preflight" for non-simple requests (JSON body, custom headers)
Origin: https://app.freshon.in

Access-Control-Allow-Origin: https://app.freshon.in     ← an exact origin, not * when credentials are involved
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Authorization</code></pre>
<p>CORS errors happen in the browser only: curl ignores them, which is why "it works in curl". CORS is not protection for your API; it protects the <i>user</i>.</p>
<h3>Attacks and defences</h3>
<table>
<tr><th>Attack</th><th>How</th><th>Defence</th></tr>
<tr><td><b>XSS</b></td><td>attacker text gets rendered as HTML/JS on your page and steals tokens or acts as the user</td><td>escape output (React does by default; beware <code>dangerouslySetInnerHTML</code>); sanitise with DOMPurify; <b>CSP</b></td></tr>
<tr><td><b>CSRF</b></td><td>another site submits a form to your site; the browser attaches your cookies</td><td><code>SameSite=Lax</code>/<code>Strict</code> cookies; CSRF tokens; check <code>Origin</code></td></tr>
<tr><td><b>Clickjacking</b></td><td>your site is framed invisibly and the user is tricked into clicks</td><td><code>frame-ancestors 'none'</code> in CSP</td></tr>
<tr><td><b>Open redirect</b></td><td><code>?next=https://evil</code> is used in phishing</td><td>allow-list redirect targets</td></tr>
<tr><td><b>Token theft</b></td><td>JWTs in localStorage are readable by any XSS</td><td>session in an <code>HttpOnly</code> cookie</td></tr>
</table>
<h3>Cookie flags</h3>
<pre data-lang="http"><code class="language-http">Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400
# HttpOnly: JS can't read it (limits XSS damage)   Secure: HTTPS only   SameSite: not sent on cross-site POSTs</code></pre>
<h3>Content Security Policy</h3>
<pre data-lang="http"><code class="language-http">Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self' data: https:; connect-src 'self' https://api.freshon.in; frame-ancestors 'none'</code></pre>
<p>CSP tells the browser which sources may run scripts, load images and so on. Even if XSS injects a <code>&lt;script&gt;</code>, it won't execute. Start with <code>Content-Security-Policy-Report-Only</code> to find what would break.</p>
<details class="ex"><summary>70.1 <span class="levels">think</span> A React page renders <code>&lt;div dangerouslySetInnerHTML={{__html: product.description}} /&gt;</code> where sellers write the descriptions. What's the risk, and what are two fixes?</summary><div><p>Stored XSS: a seller writes <code>&lt;img src=x onerror=…&gt;</code>, and it runs for every buyer. Fixes: render plain text (or Markdown converted to safe elements); or sanitise with DOMPurify on output, plus a strict CSP.</p></div></details>
`;export{e as default};

const e=`<p class="goal">Designing developer-facing public APIs: hashed API keys (sk_live_...), scoping, rate limits, webhooks, and OpenAPI/Swagger documentation.</p>
<pre data-lang="typescript"><code class="language-typescript">import crypto from "crypto";

export function generateApiKey() {
  const secret = crypto.randomBytes(24).toString("hex");
  const fullKey = \`sk_live_\${secret}\`;
  const hashedKey = crypto.createHash("sha256").update(fullKey).digest("hex");
  return { fullKey, hashedKey, prefix: fullKey.slice(0, 12) };
}</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>386.1 <span class="levels">basic</span> Store only the SHA-256 hash of API keys in your DB, showing the plaintext key to the user exactly once.</summary><div><p>Validate incoming <code>Authorization: Bearer sk_...</code> by hashing and querying by hash.</p></div></details>
</div>`;export{e as default};

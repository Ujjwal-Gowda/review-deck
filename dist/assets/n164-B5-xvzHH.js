const e=`<p class="goal">The cryptographic building blocks: what each one guarantees, and which library call to use.</p>
<table>
<tr><th>Primitive</th><th>Guarantees</th><th>Use</th><th>Don't</th></tr>
<tr><td><b>Hash</b> (SHA-256, BLAKE3)</td><td>fixed-size fingerprint; one-way; any change alters it</td><td>checksums, content addressing (git), deduplication</td><td>store passwords with it</td></tr>
<tr><td><b>Password hash</b> (Argon2id, bcrypt, scrypt)</td><td>deliberately slow, salted</td><td>passwords</td><td>use a fast hash</td></tr>
<tr><td><b>HMAC</b></td><td>integrity + authenticity with a shared secret</td><td>webhook signatures, signed cookies, API request signing</td><td>compare with <code>==</code> (use a constant-time compare)</td></tr>
<tr><td><b>Symmetric AEAD</b> (AES-256-GCM, ChaCha20-Poly1305)</td><td>confidentiality + integrity with one key</td><td>encrypting data at rest and fields in a database</td><td>reuse a nonce with the same key (catastrophic)</td></tr>
<tr><td><b>Asymmetric encryption / key exchange</b> (X25519, RSA-OAEP)</td><td>agreeing a key with a public key</td><td>TLS, sealed boxes</td><td>encrypt large data directly</td></tr>
<tr><td><b>Signature</b> (Ed25519, ECDSA)</td><td>proves who signed and that nothing changed</td><td>JWT (RS256/EdDSA), code and image signing, SSH</td><td>confuse it with encryption</td></tr>
<tr><td><b>CSPRNG</b></td><td>unpredictable randomness</td><td>tokens, IDs, keys: <code>secrets.token_urlsafe(32)</code>, <code>crypto.randomBytes</code></td><td>use <code>Math.random</code> or <code>random.random</code></td></tr>
</table>
<pre data-lang="python"><code class="language-python">from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os
key = AESGCM.generate_key(bit_length=256)          # keep it in a KMS or secret manager, not in code
nonce = os.urandom(12)                              # unique per encryption
ct = AESGCM(key).encrypt(nonce, b"PAN 4111…", b"order:42")   # the last argument is authenticated but not secret
pt = AESGCM(key).decrypt(nonce, ct, b"order:42")    # raises if anything was tampered with</code></pre>
<div class="callout warn"><b class="t">Never roll your own</b><p>Use high-level, well-reviewed libraries (libsodium/PyNaCl, <code>cryptography</code>, Go's <code>crypto/*</code>, Web Crypto) and protocols (TLS, JWT libraries). Avoid ECB mode, MD5/SHA-1 for security, homemade ciphers, and hard-coded keys. For large systems, use <b>envelope encryption</b>: data keys encrypted by a master key held in a KMS.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>164.1 <span class="levels">basic</span> Sign and verify a webhook payload with HMAC-SHA256 in Python, using a constant-time comparison.</summary><div><p><code>sig = hmac.new(key, body, "sha256").hexdigest()</code>, then <code>hmac.compare_digest(sig, received)</code>. Never use <code>==</code>, which leaks timing information.</p></div></details>
</div>
`;export{e as default};

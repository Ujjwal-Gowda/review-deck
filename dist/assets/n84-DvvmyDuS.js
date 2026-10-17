const e=`<p class="goal">Proving who a user is, safely. The cryptography is covered in the security chapters; this is the application side.</p>
<h3>Passwords</h3>
<pre data-lang="python"><code class="language-python">from argon2 import PasswordHasher          # pip install argon2-cffi
ph = PasswordHasher()                        # memory-hard: slow for attackers' GPUs
stored = ph.hash("hunter2")                  # '$argon2id$v=19$m=65536,t=3,p=4$&lt;salt&gt;$&lt;hash&gt;': salt included
ph.verify(stored, attempt)                   # constant-time comparison; raises on mismatch
if ph.check_needs_rehash(stored): ...        # upgrade parameters on next login</code></pre>
<p>Never store plain passwords or fast hashes (MD5/SHA-256). Use argon2id, or bcrypt/scrypt.</p>
<h3>The login flow</h3>
<div class="diagram">POST /login {email, password}
 → rate-limit by IP and account → look up user → verify hash (the SAME error message for unknown email and wrong password)
 → create a session: random 256-bit ID stored server-side (Redis/DB) with user_id, expiry, device
 → Set-Cookie: sid=…; HttpOnly; Secure; SameSite=Lax
later requests → middleware loads the session by cookie → req.user → handlers</div>
<h3>Account features, and their traps</h3>
<table>
<tr><th>Feature</th><th>Do</th></tr>
<tr><td>Registration</td><td>verify the email or phone before trusting it; check passwords against breach lists (HIBP)</td></tr>
<tr><td>Password reset</td><td>single-use random token, stored <i>hashed</i>, expiring in about 15–60 min; same response whether or not the email exists; invalidate all sessions after a reset</td></tr>
<tr><td>OTP login (common in India)</td><td>6 digits, about 5 min expiry, at most ~5 attempts, rate-limit sends (SMS costs money, and "SMS pumping" fraud exists)</td></tr>
<tr><td>MFA</td><td>TOTP apps or passkeys (WebAuthn: phishing-proof); keep recovery codes</td></tr>
<tr><td>Logout</td><td>delete the server-side session, not just the cookie</td></tr>
</table>
<div class="callout key"><b class="t">Build vs buy</b><p>Auth is easy to get subtly wrong. Libraries and services (Auth.js, Lucia-style session libraries, Clerk, Supabase Auth, Firebase Auth, Keycloak) handle the edge cases. Build it yourself once to learn it, then prefer a vetted library in production.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>84.1 <span class="levels">basic</span> Implement signup and login in Python with argon2 and server-side sessions stored in SQLite. Make the response identical for "no such user" and "wrong password".</summary><div><p>Hash at signup with <code>PasswordHasher().hash</code>; on login, verify (running a dummy verify for unknown users equalises the timing); create a random session ID with <code>secrets.token_urlsafe</code>; set an HttpOnly cookie.</p></div></details>
</div>
`;export{e as default};

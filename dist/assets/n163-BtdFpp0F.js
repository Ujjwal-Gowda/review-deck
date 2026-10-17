const e=`<p class="goal">Defending the login and session layer against real attacks.</p>
<table>
<tr><th>Attack</th><th>Defence</th></tr>
<tr><td><b>Credential stuffing</b> (email/password pairs leaked from other sites)</td><td>rate-limit per IP <i>and</i> per account; breached-password check at signup; MFA; bot detection</td></tr>
<tr><td>Brute force on OTPs and PINs</td><td>limited attempts per code, then lockout or a cooldown with exponential delay; codes expire quickly</td></tr>
<tr><td>Account enumeration</td><td>identical response and timing for "no such user" and "wrong password"</td></tr>
<tr><td>Session hijacking</td><td>HttpOnly + Secure + SameSite cookies; rotate the session ID at login and privilege changes; absolute and idle timeouts</td></tr>
<tr><td>Session fixation</td><td>always issue a new session ID after login</td></tr>
<tr><td>Phishing</td><td><b>passkeys/WebAuthn</b> (bound to the real domain, so they can't be phished); TOTP is better than SMS</td></tr>
<tr><td>SIM swap</td><td>don't rely on SMS alone for high-value actions</td></tr>
</table>
<ul>
<li><b>Step-up authentication:</b> ask for the password or MFA again before sensitive actions (changing bank details, large refunds, adding admins).</li>
<li>Show active sessions and devices, let users revoke them, and notify on new-device logins.</li>
<li>Log authentication events (success, failure, lockout, MFA change) for detection, but never log credentials.</li>
</ul>
<p>The basics of the login flow are in <a class="xref" data-old="n84">chapter 84</a>; tokens in <a class="xref" data-old="n86">chapter 86</a>.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>163.1 <span class="levels">basic</span> Add a per-account and per-IP login rate limit and a progressive delay to a login endpoint.</summary><div><p>Use Redis counters keyed by <code>login:ip:{ip}</code> and <code>login:acct:{email}</code>; after 5 failures add increasing delays or a temporary lock; reset on success; return the same error message either way.</p></div></details>
</div>
`;export{e as default};

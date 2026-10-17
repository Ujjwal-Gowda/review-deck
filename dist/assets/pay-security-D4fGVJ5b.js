const e=`<p class="goal">Fraud prevention, velocity checks, IP reputation, Stripe Radar rules, 3DS2 biometric authentication, and bot protection.</p>
<ul>
  <li><b>Card Testing Attacks:</b> Bots testing stolen cards on $1 donations. Defend with Cloudflare Turnstile / CAPTCHA on checkout submission and rate-limiting IP checkout requests.</li>
  <li><b>3D Secure 2 (3DS2):</b> Biometric / OTP two-factor authentication shifting liability away from the merchant to the card issuer in case of fraud.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>374.1 <span class="levels">basic</span> Configure a Stripe Radar custom rule blocking charges with risk score > 75.</summary><div><p>Use Radar rule editor: <code>Block if :risk_score: > 75</code>.</p></div></details>
</div>`;export{e as default};

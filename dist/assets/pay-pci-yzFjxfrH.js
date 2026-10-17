const e=`<p class="goal">PCI-DSS compliance scope reduction: Self-Assessment Questionnaires (SAQ A), tokenization, hosted fields, and security audits.</p>
<ul>
  <li><b>Golden Rule:</b> Never touch, process, or store unencrypted raw credit card numbers, CVVs, or PINs on your servers.</li>
  <li><b>SAQ A Scope Reduction:</b> Using hosted iframes (Stripe Elements / Razorpay Checkout) delegates card handling directly to the Level 1 PCI-certified gateway, reducing your compliance to a simple annual questionnaire.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>373.1 <span class="levels">basic</span> Audit network logs during a checkout flow to ensure no card PAN is sent to your backend origin.</summary><div><p>Inspect Chrome DevTools Network tab to confirm card numbers post exclusively to <code>api.stripe.com</code>.</p></div></details>
</div>`;export{e as default};

const e=`<p class="goal">Executing full and partial refunds, disputing chargebacks, evidence submission, and minimizing merchant risk.</p>
<pre data-lang="typescript"><code class="language-typescript">export async function issueRefund(chargeId: string, amountCents?: number) {
  return await stripe.refunds.create({
    charge: chargeId,
    amount: amountCents, // Omit for full refund
    reason: "requested_by_customer"
  });
}</code></pre>
<div class="callout warn"><b class="t">Warning · Chargeback Thresholds</b><p>If your chargeback rate exceeds 1% of transactions, card networks (Visa/Mastercard) place your merchant account into monitoring programs with heavy fines.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>370.1 <span class="levels">basic</span> Write a dispute webhook listener that flags disputed accounts for manual review.</summary><div><p>Listen for <code>charge.dispute.created</code> and update user dispute status in database.</p></div></details>
</div>`;export{e as default};

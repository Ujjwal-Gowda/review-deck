const e=`<p class="goal">Generating compliant PDF invoices, tax breakdowns, B2B net payment terms, and automated invoice delivery.</p>
<pre data-lang="typescript"><code class="language-typescript">export async function generateB2BInvoice(customerId: string, lineItems: Array<{ price: string; quantity: number }>) {
  const invoice = await stripe.invoices.create({
    customer: customerId,
    collection_method: "send_invoice",
    days_until_due: 30, // Net 30 terms
  });

  for (const item of lineItems) {
    await stripe.invoiceItems.create({
      customer: customerId,
      invoice: invoice.id,
      price: item.price,
      quantity: item.quantity
    });
  }

  return await stripe.invoices.sendInvoice(invoice.id);
}</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>375.1 <span class="levels">basic</span> Download and render a PDF invoice receipt from Stripe webhook.</summary><div><p>Fetch <code>invoice.invoice_pdf</code> URL and deliver via transactional email.</p></div></details>
</div>`;export{e as default};

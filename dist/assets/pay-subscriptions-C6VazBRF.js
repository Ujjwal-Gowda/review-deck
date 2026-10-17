const s=`<p class="goal">Subscription lifecycles: trials, plan upgrades, proration calculations, grace periods, dunning, and cancellation flows.</p>
<h3>Handling Upgrades and Proration</h3>
<pre data-lang="typescript"><code class="language-typescript">export async function upgradeSubscription(subscriptionId: string, newPriceId: string) {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: sub.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: "create_prorations", // Credits unused time on old plan
    payment_behavior: "pending_if_incomplete",
  });
}</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>368.1 <span class="levels">basic</span> Create a customer billing portal session redirecting the user to Stripe-hosted settings.</summary><div><p>Use <code>stripe.billingPortal.sessions.create({ customer, return_url })</code>.</p></div></details>
</div>`;export{s as default};

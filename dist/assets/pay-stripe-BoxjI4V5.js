const e=`<p class="goal">Production Stripe implementation: deterministic idempotency keys, Stripe Elements with 3D Secure 2, server-side PaymentIntents, and setup intents for recurring billing.</p>

<h3>1. Deterministic Idempotency Keys (Preventing Double-Charges)</h3>
<p><b>Anti-Pattern:</b> Never use <code>Date.now()</code> or a random UUID generated on each HTTP request attempt as an idempotency key! If network drops and the client retries, a new timestamp results in a duplicate charge.</p>
<p><b>Best Practice:</b> Tie the idempotency key deterministically to the persistent business entity (e.g. <code>cart_id</code>, <code>order_id</code>, or client-side checkout session UUID created once per checkout attempt).</p>

<pre data-lang="typescript"><code class="language-typescript">import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function createPaymentIntent(orderId: string, amountCents: number, currency = "usd") {
  // Deterministic key: retrying this function for the same orderId will return the exact same PaymentIntent
  const idempotencyKey = \`order_\${orderId}_payment\`;

  return await stripe.paymentIntents.create({
    amount: amountCents, // e.g. 2000 = $20.00
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
    metadata: { orderId },
  }, {
    idempotencyKey,
  });
}</code></pre>

<h3>2. Client-Side Stripe Elements & 3DS Confirmation</h3>
<pre data-lang="typescript"><code class="language-typescript">import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function handleFrontendCheckout(clientSecret: string) {
  const stripe = await stripePromise;
  if (!stripe) return;

  // Triggers 3D Secure OTP modal automatically if required by the customer's bank
  const { error, paymentIntent } = await stripe.confirmPayment({
    elements, // mounted Stripe PaymentElement
    clientSecret,
    confirmParams: {
      return_url: \`\${window.location.origin}/checkout/success\`,
    },
    redirect: "if_required", // only redirect if bank forces external redirect
  });

  if (error) {
    throw new Error(error.message);
  } else if (paymentIntent && paymentIntent.status === "succeeded") {
    console.log("Payment confirmed immediately without redirect!");
  }
}</code></pre>

<div class="callout key"><b class="t">Key insight · Never Fulfill on the Frontend</b><p>Even if <code>confirmPayment</code> succeeds on the frontend, never mark orders as paid or ship goods based on client responses! Network interruptions or client manipulation can spoof this. Only fulfill orders inside the verified <code>payment_intent.succeeded</code> webhook.</p></div>

<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>364.1 <span class="levels">basic</span> Test a 3DS authentication flow using Stripe's test card numbers.</summary><div><p>Use card <code>4000 0027 6000 3184</code> to force an interactive 3D Secure challenge modal in test mode.</p></div></details>
<details class="ex"><summary>364.2 <span class="levels">intermediate</span> Save a customer's payment method for future off-session billing using SetupIntents.</summary><div><p>Use <code>stripe.setupIntents.create({ customer: customerId })</code> and attach the payment method to avoid asking for card details again.</p></div></details>
</div>`;export{e as default};

const e=`<p class="goal">Complete Razorpay payment integration: server-side order creation, frontend checkout.js with UPI Intent, and constant-time HMAC signature verification.</p>

<h3>1. Server Order Creation</h3>
<pre data-lang="typescript"><code class="language-typescript">import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amountRupees: number, receiptId: string) {
  const options = {
    amount: Math.round(amountRupees * 100), // amount in smallest currency unit (paise)
    currency: "INR",
    receipt: receiptId,
    payment_capture: 1, // automatic capture
  };

  const order = await razorpay.orders.create(options);
  return order; // returns order.id (e.g. order_DBJOWzybf0sJbb)
}</code></pre>

<h3>2. Client-Side Checkout.js Integration</h3>
<pre data-lang="html"><code class="language-html">&lt;script src="https://checkout.razorpay.com/v1/checkout.js"&gt;&lt;/script&gt;
&lt;script&gt;
function openRazorpayCheckout(orderId, amountPaise, user) {
  const options = {
    key: "YOUR_RAZORPAY_KEY_ID",
    amount: amountPaise,
    currency: "INR",
    name: "Acme Corp",
    description: "Pro Subscription",
    order_id: orderId,
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone,
    },
    theme: { color: "#2f6fdf" },
    handler: async function (response) {
      // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });
      const data = await res.json();
      if (data.success) window.location.href = "/success";
    },
  };
  const rzp = new Razorpay(options);
  rzp.open();
}
&lt;/script&gt;</code></pre>

<h3>3. Constant-Time Server Verification</h3>
<pre data-lang="typescript"><code class="language-typescript">import crypto from "crypto";

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const text = \`\${orderId}|\${paymentId}\`;
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest("hex");

  // Constant-time comparison prevents timing side-channel attacks
  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature, "utf-8"),
    Buffer.from(signature, "utf-8")
  );
}</code></pre>

<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>365.1 <span class="levels">basic</span> Verify Razorpay Webhooks using the separate Webhook Secret header.</summary><div><p>Check <code>X-Razorpay-Signature</code> by HMAC-SHA256 hashing the raw request body with <code>RAZORPAY_WEBHOOK_SECRET</code>.</p></div></details>
</div>`;export{e as default};

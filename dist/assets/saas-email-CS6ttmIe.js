const e=`<p class="goal">Transactional email delivery: Resend, Postmark, React Email templates, bounce handling, and SPF/DKIM/DMARC domain authentication.</p>
<pre data-lang="typescript"><code class="language-typescript">import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  return await resend.emails.send({
    from: "Acme Team <support@acme.com>",
    to,
    subject: "Welcome to Acme!",
    html: \`<h1>Hi \${name},</h1><p>Thanks for joining. Start by creating your first project.</p>\`
  });
}</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>382.1 <span class="levels">basic</span> Configure DNS TXT records for SPF and DKIM on your custom domain.</summary><div><p>Verify DNS propagation using <code>dig TXT yourdomain.com</code>.</p></div></details>
</div>`;export{e as default};

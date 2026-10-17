const e=`<p class="goal">Integrating generative image pipelines (Flux, Stable Diffusion, DALL-E) safely into user-facing software products.</p>
<h3>The Image Generation Lifecycle</h3>
<p>Unlike text, image inference is heavily GPU-bound (often taking 2-15 seconds) and outputs binary blobs (0.5MB - 5MB). Direct synchronous blocking HTTP requests will exhaust server threads.</p>

<div class="diagram">
User ──► App API ──► Push Job to Queue ──► Return JobID (202 Accepted)
                         │
                   Worker Daemon ──► Call Flux / Stability API / Replicate
                         │
                   Upload PNG to S3 / Cloudflare R2
                         │
                   Save CDN URL in Postgres ──► Webhook / WebSocket to Client
</div>

<h3>Production Implementation (Replicate / Flux API)</h3>
<pre data-lang="typescript"><code class="language-typescript">import Replicate from "replicate";
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function generateProductBanner(userPrompt: string): Promise<string> {
  const sanitizedPrompt = sanitizePrompt(userPrompt);
  const engineeredPrompt = \`\${sanitizedPrompt}, clean minimalist digital UI product mockup, studio lighting, highly detailed, 4k\`;

  const output: any = await replicate.run(
    "black-forest-labs/flux-schnell",
    {
      input: {
        prompt: engineeredPrompt,
        aspect_ratio: "16:9",
        num_outputs: 1,
        output_format: "webp"
      }
    }
  );

  const rawUrl = Array.isArray(output) ? output[0] : output;
  const permanentUrl = await persistToS3(rawUrl);
  return permanentUrl;
}</code></pre>

<div class="callout warn"><b class="t">Warning · Ephemeral External URLs</b><p>APIs like OpenAI or Replicate return temporary pre-signed links that expire in 1-24 hours. Always download the image to your own private S3/R2 storage immediately before showing it to users.</p></div>

<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>351.1 <span class="levels">basic</span> Implement a webhook listener that receives completed image generations and saves the image to local storage.</summary><div><p>Accept POST callbacks with signature validation, pipe response stream directly to S3 multipart upload.</p></div></details>
<details class="ex"><summary>351.2 <span class="levels">intermediate</span> Implement cost budgeting per user: cap accounts on free tiers at 3 image generations per day.</summary><div><p>Use Redis counters with daily TTL (<code>INCR user:123:images:2026-10-16</code>).</p></div></details>
</div>`;export{e as default};

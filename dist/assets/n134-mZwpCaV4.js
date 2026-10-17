const e=`<p class="goal">Functions as a service: code that runs only when events happen.</p>
<pre data-lang="typescript"><code class="language-typescript">// AWS Lambda handler behind API Gateway / a Function URL
export const handler = async (event: { body?: string }) =&gt; {
  const order = OrderSchema.parse(JSON.parse(event.body ?? "{}"));
  await saveOrder(order);                     // create DB clients OUTSIDE the handler to reuse them across invocations
  return { statusCode: 201, body: JSON.stringify({ ok: true }) };
};</code></pre>
<table>
<tr><th>Pros</th><th>Cons</th></tr>
<tr><td>no servers to manage; scales automatically, including to zero; pay per request (cheap at low or spiky traffic); triggers from many events (HTTP, queues, S3 uploads, cron)</td><td><b>cold starts</b> (100 ms to seconds); time limits; statelessness; hard local debugging; DB connection storms (use a pooler); vendor lock-in; expensive at high steady load</td></tr>
</table>
<p>Good fits: webhooks, image thumbnails on upload, scheduled jobs, low-traffic APIs, glue between services. Edge functions (Cloudflare Workers, Vercel Edge) run in V8 isolates close to users, with near-zero cold starts but a restricted runtime.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>134.1 <span class="levels">think</span> Why can a Lambda function behind an API bring down a Postgres database during a traffic spike, and how do you prevent it?</summary><div><p>Each concurrent Lambda opens its own connections, so a spike can mean thousands of connections, well above <code>max_connections</code>. Use a pooler (RDS Proxy, PgBouncer), reserved concurrency limits, or a serverless-friendly database driver.</p></div></details>
</div>
`;export{e as default};

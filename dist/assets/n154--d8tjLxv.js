const e=`<p class="goal">Logs that answer questions quickly during an incident.</p>
<pre data-lang="json"><code class="language-json">{"ts":"2026-09-27T10:15:02.113Z","level":"error","msg":"payment capture failed","service":"orders",
 "request_id":"req_8f2c","order_id":42,"store_id":7,"provider":"razorpay","http_status":502,"duration_ms":1840}</code></pre>
<pre data-lang="go"><code class="language-go">logger := slog.New(slog.NewJSONHandler(os.Stdout, nil)).With("service", "orders")
log := logger.With("request_id", reqID)                     // attach context once, reuse it everywhere
log.Error("payment capture failed", "order_id", o.ID, "err", err)</code></pre>
<ul>
<li><b>Structured (JSON), not prose:</b> you can then query <code>order_id=42</code> across every service.</li>
<li><b>Levels:</b> DEBUG (off in production), INFO (business events: "order placed"), WARN (something unexpected that was handled), ERROR (a request failed and someone should look). Page on symptoms, not on log volume.</li>
<li><b>Correlation:</b> generate a request ID at the edge, pass it downstream (the <code>X-Request-ID</code> header / trace context), and put it on every log line and every error response, so a customer's complaint leads straight to the logs.</li>
<li><b>Never log</b> passwords, tokens, full card numbers, or OTPs. Mask personal data (<code>98•••••210</code>).</li>
<li>Write logs to stdout, and let the platform ship them to a central store (Loki, Elasticsearch, CloudWatch, Datadog). Set retention to balance cost against compliance needs.</li>
<li>Sample noisy success logs; keep every error.</li>
</ul>
<div class="callout seclens"><b class="t">Security lens · Logging</b><p>Logs are a data store: redact personal data, tokens and OTPs; restrict who can read them; and log security events (logins, permission changes) for detection.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>154.1 <span class="levels">basic</span> Switch one app's logs to structured JSON with a request ID on every line, then find all the lines for one request with <code>jq</code>.</summary><div><p><code>… | jq 'select(.request_id=="req_8f2c")'</code>. The ID is generated in middleware and attached to the logger context.</p></div></details>
</div>
`;export{e as default};

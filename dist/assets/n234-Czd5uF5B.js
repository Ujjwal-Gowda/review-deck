const e=`<p class="goal">Keeping AI features working when models are slow, wrong or unavailable.</p>
<ul>
<li><b>Timeouts and retries</b> with backoff on every call; stream long responses so users see progress.</li>
<li><b>Fallbacks:</b> a secondary model or provider (keep an abstraction layer), a cached answer, or a non-AI path ("we'll get back to you" plus a human queue). Decide per feature what "degraded" looks like.</li>
<li><b>Validation gates:</b> schema validation, business-rule checks (a refund can't exceed the order total), confidence thresholds that route uncertain cases to a human.</li>
<li><b>Budgets:</b> per request (max tokens, max steps), per user (quotas) and per day (a spend cap that alerts, then degrades gracefully).</li>
<li><b>Idempotent actions</b> so that retries don't double-act.</li>
<li><b>Audit logs</b> of AI decisions and actions (inputs, model, prompt version, outputs, tool calls, approvals), for debugging, disputes and compliance.</li>
<li><b>Kill switch:</b> a feature flag to turn an AI feature off instantly.</li>
<li><b>Human in the loop</b> for high-stakes decisions, and a clear way for users to reach a person.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>234.1 <span class="levels">basic</span> Add a fallback to a second model or provider when the primary returns 5xx or times out, plus a kill-switch feature flag.</summary><div><p>Wrap the call: try the primary with a timeout, fall back on error, log which one was used, and check a flag first so the feature can be switched off instantly.</p></div></details>
</div>
`;export{e as default};

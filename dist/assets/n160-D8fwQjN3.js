const e=`<p class="goal">Alerts that wake someone only when users are actually hurting.</p>
<ul>
<li><b>Alert on symptoms, not causes:</b> "checkout error rate above 2% for 5 minutes" (users are affected) rather than "CPU at 85%" (maybe fine). Causes belong on dashboards.</li>
<li><b>Every page must be urgent, actionable and real.</b> If the response is "ignore it", delete or downgrade the alert. Alert fatigue makes people miss the real one.</li>
<li><b>Severity:</b> page (someone acts now, day or night) vs ticket (next working day) vs dashboard only.</li>
<li><b>Every alert links to a runbook:</b> what it means, how to check, how to fix or escalate.</li>
<li><b>SLO burn-rate alerts</b> (<a class="xref" data-old="n161">chapter 161</a>) are the modern standard: page when the error budget is burning fast, file a ticket when it's burning slowly.</li>
<li>Use <code>for: 5m</code> to ignore short blips, group related alerts, and silence them during planned maintenance.</li>
</ul>
<pre data-lang="yaml"><code class="language-yaml">- alert: CheckoutErrorsHigh
  expr: sum(rate(http_requests_total{route="/checkout",status=~"5.."}[5m])) / sum(rate(http_requests_total{route="/checkout"}[5m])) &gt; 0.02
  for: 5m
  labels: { severity: page }
  annotations: { summary: "Checkout errors {{ $value | humanizePercentage }}", runbook: "https://wiki/runbooks/checkout" }</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>160.1 <span class="levels">think</span> Rewrite this alert: "CPU &gt; 80% for 1 minute, page". Why is it bad, and what's better?</summary><div><p>Too noisy and not tied to users: CPU can be high while everything is fine. Better: page on an SLO burn rate or a user-facing error or latency threshold sustained for 5+ minutes; keep CPU on a dashboard.</p></div></details>
</div>
`;export{e as default};

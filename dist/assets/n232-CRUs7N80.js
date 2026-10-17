const t=`<p class="goal">Observability for AI features: the usual metrics, plus tokens, quality and drift.</p>
<table>
<tr><th>Signal</th><th>Track</th></tr>
<tr><td>Latency</td><td>time to first token, total time, per model and feature; p95</td></tr>
<tr><td>Usage and cost</td><td>input, output and cached tokens per request, user, feature and day; cost per successful task</td></tr>
<tr><td>Reliability</td><td>error, timeout and rate-limit rates; fallback usage; parse and validation failures</td></tr>
<tr><td>Quality</td><td>feedback rate, sampled judge scores, refusal rate, hallucination flags</td></tr>
<tr><td>Behaviour</td><td>tool-call counts, steps per agent run, loops that hit the maximum</td></tr>
<tr><td><b>Drift</b></td><td>shifts in input topics or language, or in output distributions (e.g. the complaint-category mix), compared with a baseline</td></tr>
</table>
<ul>
<li><b>Trace every LLM call</b> (prompt version, model, tokens, latency, tool calls) using OpenTelemetry's GenAI conventions or tools like Langfuse, Helicone, LangSmith or Arize Phoenix. Redact personal data.</li>
<li><b>Alert</b> on cost spikes (runaway loops, abuse), error-rate jumps (provider incidents), and quality drops.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>232.1 <span class="levels">basic</span> Log tokens, latency and model for every LLM call in one app, and build a daily cost chart.</summary><div><p>Wrap the client in a function that records <code>usage</code> and timing to SQLite or logs; aggregate by day, feature and model.</p></div></details>
</div>
`;export{t as default};

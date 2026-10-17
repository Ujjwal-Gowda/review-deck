const e=`<p class="goal">One vendor-neutral standard for collecting traces, metrics and logs.</p>
<pre data-lang="typescript"><code class="language-typescript">// instrumentation.ts: load it before the app starts (node --import ./instrumentation.js server.js)
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
new NodeSDK({
  serviceName: "orders-api",
  traceExporter: new OTLPTraceExporter({ url: "http://otel-collector:4318/v1/traces" }),
  instrumentations: [getNodeAutoInstrumentations()],     // HTTP, Express, pg, Redis… traced automatically
}).start();
// custom span around business logic:
const tracer = trace.getTracer("orders");
await tracer.startActiveSpan("reserve-stock", async span =&gt; {
  span.setAttribute("order.id", id);
  try { await reserve(id); } finally { span.end(); }
});</code></pre>
<div class="diagram">apps (OTel SDK) ──OTLP──► OTel COLLECTOR (receive → process: batch, sample, redact → export)
                                     ├──► Tempo / Jaeger (traces)
                                     ├──► Prometheus / Mimir (metrics)
                                     └──► Loki (logs)   or any vendor: Datadog, Honeycomb, Grafana Cloud</div>
<p>Instrument with OpenTelemetry once and switch backends by changing the collector's configuration, without touching application code. Auto-instrumentation covers common libraries in every major language; add manual spans for the business steps that matter.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>157.1 <span class="levels">basic</span> Auto-instrument a Node or Python API with OpenTelemetry and send traces to a local Jaeger (<code>docker run jaegertracing/all-in-one</code>).</summary><div><p>Set <code>OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318</code> and use the auto-instrumentation package; the traces appear in the Jaeger UI with HTTP and database spans.</p></div></details>
</div>
`;export{e as default};

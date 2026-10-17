const e=`<p class="goal">Following one request across services to see where its time went.</p>
<div class="diagram">trace 4bf92f… (POST /orders, 1.9 s)
├─ api: handle request                       ████████████████████ 1900 ms
│  ├─ postgres: INSERT orders                ██ 40 ms
│  ├─ inventory-svc: reserve stock           ███ 120 ms
│  └─ razorpay: capture payment              ████████████████ 1650 ms  ← the culprit
└─ (async) worker: send SMS                                         span linked to the trace</div>
<ul>
<li>A <b>trace</b> is a tree of <b>spans</b>. Each span has a name, start and end times, attributes (<code>order.id</code>, <code>http.status_code</code>) and events or errors.</li>
<li><b>Context propagation:</b> the trace ID travels in the <code>traceparent</code> header (W3C standard) across HTTP calls, and in message metadata across queues. A service that doesn't forward it breaks the trace.</li>
<li><b>Sampling:</b> keeping every trace is expensive. Head sampling (keep 10% of requests) is cheap; tail sampling (keep all slow or failed traces) is smarter.</li>
<li>Use traces to answer "why was this particular request slow?"; metrics show that <i>something</i> is slow; logs give the detail. Link all three through the trace ID.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>156.1 <span class="levels">think</span> A trace shows 1.8 s total but the spans add up to only 400 ms. Where could the missing time be?</summary><div><p>Uninstrumented work (a missing span around a library call), time waiting for a connection from the pool or a lock, garbage-collection pauses, or queueing before the request was handled. Add spans around the gaps.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">Decoupling work in time: why queues exist, and the delivery guarantees you actually get.</p>
<div class="diagram">PRODUCER ──publish──► [ QUEUE / BROKER ] ──deliver──► CONSUMER(S) ──ack──► removed
  (API handler)            buffers bursts,             workers, scale              no ack (crash/timeout)
                           survives restarts           independently               → redelivered</div>
<h3>Why use one</h3>
<ul>
<li><b>Fast responses:</b> "order placed" returns in 50 ms; the invoice PDF, SMS and stock sync happen afterwards.</li>
<li><b>Absorb spikes:</b> a festive-sale burst queues up instead of overloading the DB.</li>
<li><b>Resilience:</b> if the SMS provider is down, messages wait and retry instead of failing the order.</li>
<li><b>Decoupling:</b> the producer doesn't know who consumes the event.</li>
</ul>
<h3>Delivery semantics</h3>
<table>
<tr><th>Guarantee</th><th>Meaning</th><th>Reality</th></tr>
<tr><td>At-most-once</td><td>may lose messages, never duplicates</td><td>ack before processing; only for metrics you can afford to lose</td></tr>
<tr><td><b>At-least-once</b></td><td>never lost, may duplicate</td><td><b>the practical default</b>: so make consumers <b>idempotent</b></td></tr>
<tr><td>Exactly-once</td><td>…</td><td>only within one system's boundary; end to end, it's at-least-once plus idempotency/dedup</td></tr>
</table>
<h3>Vocabulary</h3>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td>Queue (point-to-point)</td><td>each message goes to <b>one</b> consumer (work distribution)</td></tr>
<tr><td>Pub/sub (topic)</td><td>each message goes to <b>every</b> subscriber (fan-out events)</td></tr>
<tr><td>Log / stream (Kafka, NATS JetStream, Redis Streams)</td><td>an append-only history; consumers track their own offset and can replay</td></tr>
<tr><td>Dead-letter queue</td><td>where messages go after N failed attempts, for inspection</td></tr>
<tr><td>Visibility timeout / ack deadline</td><td>how long a consumer has before the message is given to someone else</td></tr>
<tr><td>Backpressure</td><td>slowing producers down when consumers can't keep up</td></tr>
</table>
<p><b>Tools:</b> Redis + BullMQ (simple, Node), RabbitMQ (classic broker), NATS/JetStream (light and fast), Kafka (high-volume event logs), SQS/Pub/Sub (managed), and <b>Postgres itself</b> (<code>SELECT … FOR UPDATE SKIP LOCKED</code>), which is often enough at small scale.</p>
<div class="callout seclens"><b class="t">Security lens · Queues</b><p>Message payloads are input: validate them in consumers. Restrict who can publish to each queue; a forged job is as dangerous as a forged API call.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>90.1 <span class="levels">think</span> For FreshOn, which of these should be queued rather than done inside the request: sending an SMS, reserving stock, generating the invoice PDF, charging the card?</summary><div><p>Queue the SMS and the PDF (slow, can retry, the user doesn't wait for them). Reserving stock and charging the card are usually done synchronously, because the user needs the result, often with an async reconciliation step afterwards.</p></div></details>
</div>
`;export{e as default};

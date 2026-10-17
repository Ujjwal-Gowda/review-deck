const e=`<p class="goal">Logs as the backbone: durable, replayable event streams.</p>
<div class="diagram">topic "orders" (append-only log, split into partitions for parallelism)
 partition 0: [e0][e1][e2][e3][e4] …    consumer group "inventory" is at offset 3
 partition 1: [e0][e1][e2] …            consumer group "analytics" is at offset 1  (each group has its own position)</div>
<table>
<tr><th></th><th>Queue (RabbitMQ, SQS)</th><th>Log / stream (Kafka, NATS JetStream, Redis Streams)</th></tr>
<tr><td>After consumption</td><td>the message is deleted</td><td>kept for the retention period</td></tr>
<tr><td>Many independent consumers</td><td>needs a fan-out setup</td><td>natural: each consumer group tracks its own offset</td></tr>
<tr><td>Replay history</td><td>no</td><td><b>yes</b>: rebuild a read model, backfill a new service</td></tr>
<tr><td>Ordering</td><td>per queue (roughly)</td><td>strict per partition</td></tr>
</table>
<ul>
<li><b>Kafka:</b> very high throughput and a huge ecosystem (Connect, Streams); heavier to operate (managed: Confluent, MSK, Redpanda).</li>
<li><b>NATS + JetStream:</b> lightweight, very fast, simple to run, with request-reply and key-value stores built in. A great fit for small teams.</li>
<li><b>Event sourcing:</b> store state changes as events (<code>OrderPlaced</code>, <code>ItemPacked</code>) and derive the current state from them. You get a full audit trail and can replay, at the cost of more complexity.</li>
<li><b>Change data capture</b> (Debezium): stream database changes into a log without changing the app.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>174.1 <span class="levels">basic</span> Run NATS with JetStream in Docker. Publish 10 events, consume them with two different durable consumers, then replay from the start.</summary><div><p>Create a stream with <code>nats stream add</code>, add two consumers, and each receives all 10 events. A new consumer with <code>--deliver all</code> replays the history.</p></div></details>
</div>
`;export{e as default};

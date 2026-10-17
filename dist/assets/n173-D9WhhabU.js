const e=`<p class="goal">Messaging between services when networks and processes fail at the worst moment.</p>
<p>A consumer processes a message, then crashes before acknowledging it: the broker redelivers it. A producer times out waiting for confirmation and retries: the message may now exist twice. <b>Duplicates are normal.</b> (Queue basics are in <a class="xref" data-old="n90">chapter 90</a>.)</p>
<h3>Making processing effectively exactly-once</h3>
<ul>
<li><b>Idempotent consumers:</b> record processed message IDs in the same database transaction as the side effect (<code>INSERT INTO processed(msg_id) … ON CONFLICT DO NOTHING</code>), and skip IDs you've already seen.</li>
<li><b>Natural idempotency:</b> "set status = paid" is safe to repeat; "add ₹500" isn't, so make it "apply payment <code>pay_123</code>" instead.</li>
<li><b>Transactional outbox:</b> write the business change and the outgoing event in one DB transaction; a relay publishes it afterwards. That removes the "saved but never published" gap.</li>
<li><b>Ordering:</b> only guaranteed within a partition or key. Route all events for one order to the same partition, and carry a version or sequence number so consumers can ignore stale events.</li>
<li><b>Poison messages:</b> after N failures, send to a dead-letter queue and alert, so one bad message doesn't block the queue forever.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>173.1 <span class="levels">basic</span> Make a consumer idempotent using a processed-messages table in the same transaction as the side effect, and prove it by delivering one message twice.</summary><div><p><code>BEGIN; INSERT INTO processed(id) VALUES($1) ON CONFLICT DO NOTHING RETURNING id;</code> If nothing was returned, skip; otherwise apply the effect; then COMMIT.</p></div></details>
</div>
`;export{e as default};

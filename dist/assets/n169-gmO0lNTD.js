const e=`<p class="goal">The fundamental trade-off of any system that stores data on more than one machine.</p>
<p><b>CAP:</b> when a <b>network partition</b> happens (nodes can't talk to each other, which <i>will</i> happen), a replicated data store must choose:</p>
<ul>
<li><b>C</b>onsistency: refuse or delay requests rather than return stale or conflicting data (e.g. a bank balance, stock reservations);</li>
<li><b>A</b>vailability: keep answering from whatever each side knows, and reconcile later (e.g. a shopping cart, a social feed, DNS).</li>
</ul>
<p>"Pick 2 of 3" is misleading: partition tolerance isn't optional. The real choice is <b>what happens during a partition</b>.</p>
<p><b>PACELC</b> adds the everyday case: if <b>P</b>artitioned, choose <b>A</b> or <b>C</b>; <b>E</b>lse (normal operation), choose <b>L</b>atency or <b>C</b>onsistency. Waiting for replicas in other zones or regions to confirm every write costs latency on <i>every</i> request, not just during failures.</p>
<table>
<tr><th>System</th><th>Leans towards</th></tr>
<tr><td>Single-leader Postgres with synchronous replicas; etcd; Spanner</td><td>CP / consistency</td></tr>
<tr><td>Cassandra, DynamoDB (default), DNS, CDNs</td><td>AP / latency (tunable in some)</td></tr>
</table>
<p>Choose <b>per feature</b>, not per company: stock and payments want consistency; the product catalogue and view counts can be eventually consistent.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>169.1 <span class="levels">think</span> For stock reservations and for the "trending products" widget, choose CP or AP behaviour during a partition. Justify each.</summary><div><p>Stock: CP. Refuse or queue the reservation rather than oversell. Trending: AP. Stale or approximate data is fine, and availability matters more.</p></div></details>
</div>
`;export{e as default};

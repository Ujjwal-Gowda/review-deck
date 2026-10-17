const e=`<p class="goal">How a group of machines agrees on one value, such as "who is the leader", despite failures.</p>
<p>Consensus algorithms (<b>Raft</b>, Paxos) let a cluster of typically 3 or 5 nodes agree on an ordered log of decisions. The cluster works as long as a <b>majority</b> (a quorum) is alive: 3 nodes tolerate 1 failure, 5 tolerate 2. Use odd numbers.</p>
<h3>Raft in brief</h3>
<ol>
<li>Nodes are followers, candidates or the leader. If a follower hears nothing from a leader within a random timeout, it becomes a candidate and requests votes. A majority of votes makes it leader for that <b>term</b>.</li>
<li>The leader appends client commands to its log and replicates them to followers. An entry is <b>committed</b> once a majority has stored it, and is then applied to each node's state machine.</li>
<li>Rules about terms and log matching ensure a stale leader can't commit, and every node applies the same sequence of commands.</li>
</ol>
<p>You'll rarely implement it, but you'll depend on it constantly: <b>etcd</b> (Kubernetes' brain), Consul, ZooKeeper, CockroachDB, and Kafka's KRaft mode all use consensus. That's why these clusters need 3 or more nodes, and why losing a majority makes them stop accepting writes, by design.</p>
<p>A good exercise: the MIT 6.5840 labs (implement Raft in Go), or play with the visualisation at raft.github.io.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>175.1 <span class="levels">think</span> A 5-node etcd cluster loses 2 nodes. Does it keep working? What about losing 3?</summary><div><p>With 2 lost, 3 of 5 is still a majority, so it keeps accepting writes. With 3 lost, no majority, so writes stop (reads may be stale). That's why clusters use odd sizes of 3 or 5.</p></div></details>
</div>
`;export{e as default};

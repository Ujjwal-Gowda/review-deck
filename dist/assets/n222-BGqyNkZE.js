const e=`<p class="goal">Giving AI systems memory beyond one context window.</p>
<table>
<tr><th>Kind</th><th>Holds</th><th>Implementation</th></tr>
<tr><td>Working memory</td><td>the current task and conversation</td><td>the context window; summarise or trim when it gets long</td></tr>
<tr><td>Episodic</td><td>past interactions ("last week you asked about Store 7's refunds")</td><td>conversation logs with summaries; retrieval by similarity and recency</td></tr>
<tr><td>Semantic</td><td>facts about the user or domain ("prefers Kannada", "owns 3 stores")</td><td>key-value or profile records; vector store; knowledge graph</td></tr>
<tr><td>Procedural</td><td>how to do things (learned instructions, skills)</td><td>stored prompts or tools; files like this assistant's memory directory</td></tr>
</table>
<ul>
<li><b>Writing memories:</b> decide what's worth keeping (explicit "remember X", stable preferences, decisions), deduplicate, and update or delete memories that are wrong or outdated. Without that, memory grows noisy.</li>
<li><b>Retrieval:</b> relevance (vectors), recency, and importance scores; keep the injected memory small.</li>
<li><b>Vector vs graph memory:</b> vectors are good for fuzzy recall; graphs (entities and relations, e.g. Graphiti or Neo4j) for "how is A related to B" and facts that change over time.</li>
<li><b>Privacy:</b> let users see, edit and delete what's remembered; never store secrets; scope memory per user or tenant.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>222.1 <span class="levels">think</span> Design the memory for a FreshOn owner assistant: what to remember, where to store it, and how the user can see or delete it.</summary><div><p>Profile facts (stores, preferences) as key-value records; weekly summaries as episodic memory with embeddings; a "What I remember" page with edit and delete; never store payment details or passwords.</p></div></details>
</div>
`;export{e as default};

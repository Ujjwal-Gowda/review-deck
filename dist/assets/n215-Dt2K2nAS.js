const e=`<p class="goal">What turns a RAG demo into a production system.</p>
<ul>
<li><b>Ingestion pipeline:</b> connectors (Drive, Notion, website, database) → parse (PDF, HTML, DOCX, OCR) → clean → chunk → embed → upsert, as <b>background jobs</b> with retries (<a class="xref" data-old="n91">chapter 91</a>).</li>
<li><b>Freshness:</b> incremental sync (hash each document, re-embed only what changed), delete removed documents, and record an "as of" date per source.</li>
<li><b>Access control:</b> filter retrieval by the user's permissions (store, role, tenant) <i>at query time</i>, stored as metadata on each chunk. Otherwise the model can quote documents the user isn't allowed to see.</li>
<li><b>Citations:</b> return source links with answers so users can verify them. That builds trust and catches hallucinations.</li>
<li><b>Guardrails:</b> answer only from context, and refuse or escalate when the context is weak. Treat retrieved text as <b>untrusted</b>: documents can contain prompt injections (<a class="xref" data-old="n226">chapter 226</a>).</li>
<li><b>Caching:</b> cache embeddings of frequent queries; use provider prompt caching for static instructions.</li>
<li><b>Observability:</b> log the query, the retrieved IDs and scores, the answer, latency, tokens and user feedback. That becomes your next evaluation set.</li>
<li><b>Cost:</b> embedding is cheap and one-off; generation is per query. Choose the model per question difficulty.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>215.1 <span class="levels">think</span> A user asks your RAG bot about another store's margins, which they shouldn't see. Where must you stop this, and why can't the prompt alone do it?</summary><div><p>In retrieval, by filtering chunks on the user's permissions before they reach the model. Prompt instructions can be overridden or ignored; access control has to be enforced in code.</p></div></details>
</div>
`;export{e as default};

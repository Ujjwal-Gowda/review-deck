const e=`<p class="goal">Giving models your knowledge: retrieve it at runtime, or train it in.</p>
<h3>Embeddings</h3>
<p>An embedding model turns text (or images) into a vector, e.g. 384–3072 numbers. Texts with similar <i>meaning</i> get vectors that point in similar directions, measured by <b>cosine similarity</b>. This powers semantic search, recommendations, clustering, deduplication and RAG.</p>
<pre data-lang="python"><code class="language-python">import math
def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x*x for x in a)) * math.sqrt(sum(y*y for y in b)))
# cosine(embed("refund my payment"), embed("I want my money back")) is high,
# although the two share no words.</code></pre>
<h3>RAG (retrieval-augmented generation)</h3>
<div class="diagram">INDEXING (once):   documents → split into chunks (~300–1000 tokens, with overlap) → embed each → store in a vector DB
QUERY (each time): question → embed → find the top-k most similar chunks → put them in the prompt → LLM answers, citing them</div>
<pre data-lang="python"><code class="language-python">def answer(question):
    chunks = vector_db.search(embed(question), k=5)          # retrieval
    context = "\\n\\n".join(f"&lt;doc id={c.id}&gt;{c.text}&lt;/doc&gt;" for c in chunks)
    return llm(f"Answer ONLY from these documents and cite ids. "
               f"If the answer isn't there, say so.\\n{context}\\n\\nQ: {question}")</code></pre>
<ul>
<li><b>Vector stores:</b> pgvector (Postgres), Qdrant, Weaviate, Milvus, Pinecone, Chroma, FAISS (a library). Approximate nearest-neighbour indexes (HNSW) keep search fast at millions of vectors.</li>
<li><b>Hybrid search</b> (keywords/BM25 + vectors) plus a <b>reranker</b> model greatly improves retrieval quality.</li>
<li>RAG quality mostly comes down to <b>retrieval quality</b>: chunking, metadata filters, and evaluating "was the right chunk retrieved?"</li>
</ul>
<h3>Fine-tuning</h3>
<p>Further training a model on your own examples. <b>LoRA</b> trains small low-rank adapter matrices added to frozen weights (a few MB to a few hundred MB), and <b>QLoRA</b> does the same on a 4-bit base (see <a class="xref" data-old="c28">chapter 28</a> for memory). Tools: Hugging Face <code>transformers</code> + <code>peft</code> + <code>trl</code>, Unsloth (fast, memory-efficient), Axolotl, and the providers' hosted fine-tuning APIs.</p>
<div class="callout key"><b class="t">Trade-offs: prompting vs RAG vs fine-tuning</b>
<table>
<tr><th>Approach</th><th>Use when</th><th>Pros</th><th>Cons</th></tr>
<tr><td><b>Prompting</b> (+ examples)</td><td>Always start here</td><td>Instant, cheap, easy to change</td><td>Limited by context size; repeated per call</td></tr>
<tr><td><b>RAG</b></td><td>The model needs <b>facts</b>: your docs, product catalogue, policies, fresh data</td><td>Updatable instantly; citations; less hallucination; access control per document</td><td>Retrieval can miss; extra infrastructure; latency</td></tr>
<tr><td><b>Fine-tuning</b></td><td>The model needs a <b>behaviour</b>: format, style, tone, a narrow task at high volume, or a small model distilled from a big one</td><td>Consistent output; shorter prompts; cheap small models</td><td>Needs hundreds to thousands of good examples; bad at teaching new facts; must redo it for new base models</td></tr>
</table></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>209.1 <span class="levels">basic</span> Embed 20 FAQ answers and retrieve the top 3 for 5 questions using cosine similarity in NumPy. Where does it fail?</summary><div><p>It fails on exact codes and numbers, or questions phrased very differently from the answers. That motivates hybrid search and reranking.</p></div></details>
</div>
`;export{e as default};

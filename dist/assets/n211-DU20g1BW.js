const e=`<p class="goal">Finding the nearest chunks for a query, quickly and with the right filters.</p>
<pre data-lang="python"><code class="language-python">q_vec = embed(query, input_type="query")            # many embedding models use different modes for queries vs documents
rows = db.execute("""
  SELECT id, body, source, 1 - (embedding &lt;=&gt; %s) AS score
  FROM chunks
  WHERE store_id = %s AND lang = 'en'                -- metadata filter (and permission filter!)
  ORDER BY embedding &lt;=&gt; %s LIMIT 20""", (q_vec, store_id, q_vec)).fetchall()</code></pre>
<ul>
<li><b>ANN indexes</b> (HNSW, IVF) trade a little recall for big speed (<a class="xref" data-old="n104">chapter 104</a>). Tune <code>ef_search</code> and measure recall against exact search on a sample.</li>
<li><b>Choose the embedding model</b> on your own data: multilingual support matters for Kannada or Hindi content; check the dimensions (cost) and the maximum input length. Re-embed everything if you switch models, because vectors from different models aren't compatible.</li>
<li><b>Filtering:</b> pre-filtering (filter, then search) is exact but can be slow; post-filtering can return too few results. Vector databases support filtered HNSW; in pgvector, check the plans.</li>
<li><b>Query transformation:</b> rewrite conversational questions into standalone ones ("what about paneer?" becomes "refund policy for paneer"); multi-query (several phrasings, merged results); HyDE (embed a hypothetical answer instead of the question).</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>211.1 <span class="levels">basic</span> Add a metadata filter (store_id) to a pgvector query and check with EXPLAIN whether the HNSW index is still used.</summary><div><p>With restrictive filters, the planner may skip the index or return too few rows. Try iterative index scans (pgvector 0.8+) or partial indexes per store.</p></div></details>
</div>
`;export{e as default};

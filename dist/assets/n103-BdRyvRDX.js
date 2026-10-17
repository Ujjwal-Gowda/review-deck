const e=`<p class="goal">How full-text search works, and when you need a search engine rather than SQL <code>LIKE</code>.</p>
<h3>The inverted index</h3>
<div class="diagram">documents:  1 "fresh paneer 200g"   2 "paneer tikka masala"   3 "fresh milk"
analyse (lowercase, tokenise, stem, remove stopwords) → build term → documents:
   fresh → [1, 3]    paneer → [1, 2]    milk → [3]    tikka → [2]    masala → [2]
query "fresh paneer" → intersect/union the posting lists → rank by relevance</div>
<p><b>BM25</b> ranking scores a document higher when the term is frequent in it (with diminishing returns), rare across all documents, and the document is short. It's the default in Elasticsearch, OpenSearch and Lucene.</p>
<table>
<tr><th>Option</th><th>Use when</th></tr>
<tr><td>Postgres full-text (<code>tsvector</code>, <code>GIN</code>) + <code>pg_trgm</code> for typos</td><td>up to millions of rows, simple relevance, and you want no extra system</td></tr>
<tr><td>Meilisearch / Typesense</td><td>instant, typo-tolerant product search with little setup</td></tr>
<tr><td>Elasticsearch / OpenSearch</td><td>large scale, complex relevance tuning, log analytics</td></tr>
<tr><td>Vector search + BM25 (hybrid)</td><td>semantic matching ("dairy for curry" finds paneer) (<a class="xref" data-old="n104">chapter 104</a>)</td></tr>
</table>
<pre data-lang="sql"><code class="language-sql">ALTER TABLE products ADD COLUMN search tsvector GENERATED ALWAYS AS (to_tsvector('english', name || ' ' || coalesce(description,''))) STORED;
CREATE INDEX ON products USING gin (search);
SELECT name, ts_rank(search, q) FROM products, websearch_to_tsquery('english', 'fresh paneer') q
WHERE search @@ q ORDER BY 2 DESC LIMIT 10;</code></pre>
<p>A search index is a <b>derived copy</b>: keep it in sync with the source of truth (via change data capture, events, or periodic reindexing), and expect it to lag slightly.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>103.1 <span class="levels">basic</span> Add Postgres full-text search to a products table and compare the results with <code>ILIKE '%term%'</code>.</summary><div><p><code>tsvector</code> handles stemming ("apples" matches "apple"), ranking and an index; ILIKE is a substring scan with no ranking. Add <code>pg_trgm</code> for typo tolerance.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">Project 9: Production-Grade Retrieval-Augmented Generation (RAG). Construct a hybrid search retrieval engine combining pgvector HNSW vector indexing, BM25 full-text search, Reciprocal Rank Fusion, and automated offline evaluation.</p>

<h3>The Dirty Secret of Naive RAG</h3>
<p>Toy tutorials tell you that RAG is easy: split a PDF into 500-character chunks, call OpenAI/Gemini embeddings, dump them into a vector database, and perform cosine similarity. In production, this naive approach fails catastrophically:</p>
<ul>
  <li><b>The Exact Keyword Blindspot:</b> If a user searches for an exact error code like <code>ERR_403_CSRF_INVALID</code> or a part ID <code>SKU-9921</code>, pure semantic embeddings produce fuzzy generic results while missing the exact document.</li>
  <li><b>Chunk Boundary Mutilation:</b> Splitting text purely by token count cuts markdown tables, SQL snippets, and sentences in half, stripping vital context.</li>
  <li><b>The "Lost in the Middle" Bias:</b> LLMs pay heavy attention to the start and end of their prompt context, while ignoring information buried in the middle of 10 retrieved chunks.</li>
</ul>

<p>In this capstone, you will construct <b>NexusRAG</b>: a high-precision retrieval system combining dense vector search and sparse BM25 keyword search using PostgreSQL, fused with <b>Reciprocal Rank Fusion (RRF)</b> and evaluated against a regression test suite.</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                Document Ingestion Pipeline                             │
│                                                                                        │
│   [Technical PDF / Markdown] ──► Structure-Aware Header &amp; Section Parser              │
│                                              │                                         │
│                                              ▼ Content Hash (SHA-256) Check            │
│                       ┌──────────────────────────────────────────────┐                 │
│                       │ Incremental Deduplication (Skip unchanged)   │                 │
│                       └──────────────────────┬───────────────────────┘                 │
│                                              ▼                                         │
│                       ┌──────────────────────────────────────────────┐                 │
│                       │ Embeddings API (text-embedding-3 / nomic)    │                 │
│                       └──────────────────────┬───────────────────────┘                 │
│                                              │                                         │
│                                              ▼                                         │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                      PostgreSQL 16 Unified Storage                           │     │
│   │   • \`embedding vector(1536)\` indexed with **HNSW** (Cosine Distance)         │     │
│   │   • \`search_vector tsvector\` indexed with **GIN** (BM25 Full Text)           │     │
│   │   • Metadata: \`{ doc_id, section_path: "DevOps > Docker", sha256 }\`         │     │
│   └──────────────────────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                Hybrid Query &amp; Retrieval Flow                           │
│                                                                                        │
│                                User Question: "How to fix ERR_403_CSRF?"               │
│                                              │                                         │
│                        ┌─────────────────────┴─────────────────────┐                   │
│                        ▼                                           ▼                   │
│        [Dense Search: pgvector HNSW]               [Sparse Search: BM25 tsvector]      │
│        Top 20 Semantic Candidates                  Top 20 Exact Keyword Matches        │
│                        │                                           │                   │
│                        └─────────────────────┬─────────────────────┘                   │
│                                              ▼                                         │
│                       ┌──────────────────────────────────────────────┐                 │
│                       │ Reciprocal Rank Fusion (RRF k=60) Scoring    │                 │
│                       └──────────────────────┬───────────────────────┘                 │
│                                              ▼                                         │
│                       ┌──────────────────────────────────────────────┐                 │
│                       │ Cross-Encoder Reranker (Top 5 Chunks)        │                 │
│                       └──────────────────────┬───────────────────────┘                 │
│                                              ▼                                         │
│                       ┌──────────────────────────────────────────────┐                 │
│                       │ Augmented Prompt with Strict Citation Tags   │                 │
│                       └──────────────────────┬───────────────────────┘                 │
│                                              ▼                                         │
│                                 Streaming Answer + Sources                             │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: The Unified PostgreSQL Hybrid Schema</h3>
<p>PostgreSQL with the <code>pgvector</code> extension is the premier unified database for production RAG: it handles ACID relational data, vector similarity, and BM25 full-text indexing in a single engine without synchronizing separate databases.</p>

<pre data-lang="sql"><code class="language-sql">-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_title TEXT NOT NULL,
    section_hierarchy TEXT NOT NULL, -- e.g. "Security > CSRF > Mitigation"
    content TEXT NOT NULL,
    content_hash CHAR(64) NOT NULL,
    embedding vector(1536) NOT NULL,
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(document_title, '') || ' ' || coalesce(section_hierarchy, '') || ' ' || content)
    ) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. HNSW Index for sub-millisecond approximate nearest-neighbor vector search
CREATE INDEX idx_chunks_hnsw ON document_chunks 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- 2. GIN Index for blazing-fast full text keyword search
CREATE INDEX idx_chunks_fts ON document_chunks 
USING gin(search_vector);</code></pre>

<h3>Part 2: Reciprocal Rank Fusion (RRF) in a Single Query</h3>
<p><b>Reciprocal Rank Fusion</b> combines disparate ranking scales (unbounded BM25 scores vs bounded cosine similarity) into a unified rank using the formula:</p>
<div class="callout key">
$$RRF\\_Score(d) = \\sum_{m \\in M} \\frac{1}{60 + r_m(d)}$$
<p>where $r_m(d)$ is the integer ranking position (1, 2, 3...) of document $d$ in retrieval method $m$.</p>
</div>

<pre data-lang="typescript"><code class="language-typescript">import { pool } from "./db";

export async function hybridSearch(queryText: string, queryEmbedding: number[], limit = 5) {
  const sql = \`
    WITH vector_scores AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY embedding <=> $1::vector) AS rank
      FROM document_chunks
      ORDER BY embedding <=> $1::vector
      LIMIT 20
    ),
    text_scores AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(search_vector, plainto_tsquery('english', $2)) DESC) AS rank
      FROM document_chunks
      WHERE search_vector @@ plainto_tsquery('english', $2)
      ORDER BY rank ASC
      LIMIT 20
    )
    SELECT 
      c.id,
      c.document_title,
      c.section_hierarchy,
      c.content,
      COALESCE(1.0 / (60 + v.rank), 0.0) + COALESCE(1.0 / (60 + t.rank), 0.0) AS rrf_score
    FROM document_chunks c
    LEFT JOIN vector_scores v ON c.id = v.id
    LEFT JOIN text_scores t ON c.id = t.id
    WHERE v.id IS NOT NULL OR t.id IS NOT NULL
    ORDER BY rrf_score DESC
    LIMIT $3;
  \`;

  const embeddingStr = \`[\${queryEmbedding.join(",")}]\`;
  const result = await pool.query(sql, [embeddingStr, queryText, limit]);
  return result.rows;
}</code></pre>

<h3>Part 3: Hallucination Defense &amp; Strict Citation Prompting</h3>
<p>Never give an LLM unconstrained freedom when answering from retrieved context. Force structured source attribution and defensive refusals:</p>

<pre data-lang="typescript"><code class="language-typescript">export function buildRAGPrompt(query: string, retrievedChunks: Array<{ id: string; content: string; section_hierarchy: string }>) {
  const contextBlock = retrievedChunks
    .map((chunk, index) => \`[Source \${index + 1}] (\${chunk.section_hierarchy}):\\n\${chunk.content}\`)
    .join("\\n\\n---\\n\\n");

  const systemPrompt = \`You are a strict technical support assistant.
Your answers MUST BE DERIVED ONLY from the provided [Source X] excerpts below.
RULES:
1. Every claim, code snippet, and recommendation MUST cite its source tag (e.g. [Source 1]).
2. If the excerpts do not contain sufficient evidence to answer the question with 100% confidence, respond EXACTLY: "I cannot answer this question based on the verified documentation."
3. Do not assume or extrapolate beyond the explicit facts in the context.\`;

  const userPrompt = \`CONTEXT SOURCES:\\n\${contextBlock}\\n\\nUSER QUESTION:\\n\${query}\`;

  return { systemPrompt, userPrompt };
}</code></pre>

<h3>Part 4: Continuous Automated RAG Evaluation</h3>
<p>To avoid regression when changing embedding models or chunk sizes, maintain a golden evaluation suite verifying the <b>RAG Triad</b>:</p>

<table>
  <tr><th>Metric</th><th>Definition</th><th>Target Score</th></tr>
  <tr><td><b>Context Recall @ 5</b></td><td>Did the top-5 retrieved chunks contain the required ground-truth evidence?</td><td>&gt; 92%</td></tr>
  <tr><td><b>Faithfulness</b></td><td>Are all claims in the generated response mathematically supported by the context?</td><td>&gt; 98%</td></tr>
  <tr><td><b>Answer Relevance</b></td><td>Did the model directly address the user's question without extraneous filler?</td><td>&gt; 95%</td></tr>
</table>

<pre data-lang="typescript"><code class="language-typescript">import { test, expect } from "vitest";
import goldenDataset from "./evals/golden_50.json";
import { hybridSearch } from "./retrieval";

test("RAG Retrieval Recall@5 exceeds 90% across golden dataset", async () => {
  let hits = 0;

  for (const item of goldenDataset) {
    const embedding = await generateEmbedding(item.question);
    const retrieved = await hybridSearch(item.question, embedding, 5);
    const retrievedIds = retrieved.map((r) => r.id);

    const isMatch = item.expectedChunkIds.some((expectedId: string) => retrievedIds.includes(expectedId));
    if (isMatch) hits++;
  }

  const recall = hits / goldenDataset.length;
  console.log(\`Current Recall@5: \${(recall * 100).toFixed(1)}%\`);
  expect(recall).toBeGreaterThanOrEqual(0.90);
});</code></pre>

<details class="ex">
  <summary><b>Drill: Why is HNSW index superior to IVFFlat in production?</b> (Click to expand)</summary>
  <p><b>Scenario:</b> An engineer builds a vector index with <code>CREATE INDEX USING ivfflat</code>. As the table grows from 1,000 to 1,000,000 rows, retrieval recall plummets.</p>
  <p><b>Question:</b> Why does IVFFlat degrade on dynamic datasets, and why does HNSW maintain high recall?</p>
  <div class="callout note">
    <p><b>Answer:</b></p>
    <ul>
      <li><b>IVFFlat (Inverted File Flat):</b> Divides vector space into Voronoi clusters (lists) based on the data present <i>at index creation time</i>. When thousands of new vectors are inserted later, they are shoehorned into stale cluster centroids without rebalancing, destroying search recall unless the entire index is rebuilt.</li>
      <li><b>HNSW (Hierarchical Navigable Small World):</b> Builds a multi-layer geometric graph structure where nodes maintain small-world connections. Inserting new vectors dynamically updates the graph in real-time with zero degradation in recall.</li>
    </ul>
  </div>
</details>
`;export{e as default};

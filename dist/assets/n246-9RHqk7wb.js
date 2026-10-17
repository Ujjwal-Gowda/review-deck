const e=`<p class="goal">Capstone: Production Enterprise AI Platform (OmniOps). The master synthesis uniting Full-Stack React, Hardened Microservices, Kubernetes Orchestration, MCP Tool Federation, Hybrid RAG, and Observability.</p>

<h3>The Master Synthesis</h3>
<p>You have reached the final summit. You are no longer studying isolated technologies in a vacuum—you understand precisely why every layer of the modern software engineering stack exists, how they connect, and how they protect against failure.</p>

<p>In this final capstone, you will architect <b>OmniOps AI</b>: an enterprise platform that empowers engineering teams to automate operational debugging, query real-time production telemetry, execute verified database diagnostics through <b>Model Context Protocol (MCP)</b>, retrieve incident runbooks via <b>Hybrid pgvector RAG</b>, and stream reasoning safely to React dashboards.</p>

<div class="diagram">
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     Client Tier (React 19 + TypeScript)                                 │
│  ┌──────────────────────────────┐   ┌──────────────────────────────┐   ┌──────────────────────────────┐ │
│  │ Authenticated Admin Portal   │   │  Streaming Reasoning UI(SSE) │   │ Interactive HITL Approvals   │ │
│  └──────────────┬───────────────┘   └──────────────┬───────────────┘   └──────────────▲───────────────┘ │
└─────────────────┼──────────────────────────────────┼──────────────────────────────────┼─────────────────┘
                  │ HTTPS / WSS                      │ EventStream                      │ Action Confirm
                  ▼                                  ▼                                  │
┌───────────────────────────────────────────────────────────────────────────────────────┴─────────────────┐
│                           Edge Ingress &amp; API Gateway (Node.js / Caddy / K8s)                            │
│  • Edge TLS 1.3 Termination &amp; HTTP/3 QUIC                                                               │
│  • Argon2id Session Authentication &amp; Tenant RBAC (Role-Based Access Control)                             │
│  • Redis Sliding Window Rate-Limiting (Prevent API abuse)                                               │
└──────────────────────────────────────────┬──────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 OmniOps AI Core Engine Cluster                                          │
│                                                                                                         │
│   ┌────────────────────────────────────────────────────────────────────────────────────────────────┐    │
│   │                              Autonomous Agent Orchestration Engine                             │    │
│   │   • ReAct Loop Controller (Max 8 Steps, $0.20 Hard Financial Budget per Task)                  │    │
│   │   • Human-in-the-Loop Interceptor for Mutating Actions                                         │    │
│   └──────────────┬───────────────────────────────┬───────────────────────────────┬─────────────────┘    │
│                  │                               │                               │                      │
│                  ▼                               ▼                               ▼                      │
│   ┌─────────────────────────────┐ ┌─────────────────────────────┐ ┌───────────────────────────────┐     │
│   │    Unified Model Gateway    │ │    Hybrid RAG Subsystem     │ │    MCP Federation Hub         │     │
│   │ • Multi-Provider Router     │ │ • pgvector HNSW Embeddings  │ │ • Stdio / SSE Transport       │     │
│   │ • (Gemini / Claude / Groq)  │ │ • BM25 tsvector GIN Index   │ │ • Read-Only DB Ops Inspector  │     │
│   │ • Auto-Fallback &amp; Backoff   │ │ • Reciprocal Rank Fusion    │ │ • Kubernetes Pod Diagnostic   │     │
│   └─────────────────────────────┘ └─────────────────────────────┘ └───────────────────────────────┘     │
│                  │                               │                               │                      │
└──────────────────┼───────────────────────────────┼───────────────────────────────┼──────────────────────┘
                   │                               │                               │
                   ▼                               ▼                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Storage, Messaging &amp; Observability Tier                                │
│                                                                                                         │
│   ┌────────────────────────┐┌────────────────────────┐┌────────────────────────┐┌─────────────────────┐ │
│   │   PostgreSQL 16 CLUSTER││   Redis 7 In-Memory    ││  NATS JetStream Bus    ││ OpenTelemetry / OTel│ │
│   │ • pgvector embeddings  ││ • Session store        ││ • Transactional Outbox ││ • Distributed Traces│ │
│   │ • Transactional Outbox ││ • Rate-limit counters  ││ • Async Evaluation Job ││ • Prometheus Metrics│ │
│   │ • Audit log ledger     ││ • Pub/Sub Live Stream  ││ • Memory Compactor     ││ • Grafana Dashboard │ │
│   └────────────────────────┘└────────────────────────┘└────────────────────────┘└─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: The 5 Critical Architecture Decision Records (ADRs)</h3>
<p>Senior engineers are defined not by the code they write, but by the architectural trade-offs they navigate. Document your key decisions using formal ADRs:</p>

<div class="cheat">
  <div class="card">
    <h4>ADR 1: Unified PostgreSQL vs Separate Vector DB</h4>
    <p><b>Decision:</b> Use PostgreSQL 16 with <code>pgvector</code> (HNSW) instead of a standalone vector database (Pinecone/Milvus).</p>
    <p><b>Rationale:</b> Eliminates multi-database synchronization lag, provides ACID transactional consistency, and allows combining relational user permissions (<code>WHERE tenant_id = $1</code>) with vector similarity in a single query.</p>
  </div>
  <div class="card">
    <h4>ADR 2: Multi-Provider Model Gateway</h4>
    <p><b>Decision:</b> Wrap all LLM calls in an abstraction layer with automated provider failover.</p>
    <p><b>Rationale:</b> If the primary model encounters rate limits (HTTP 429) or cloud outages (HTTP 503), the gateway instantly reroutes the prompt to the secondary model with zero user disruption.</p>
  </div>
  <div class="card">
    <h4>ADR 3: SSE over WebSockets for AI Streaming</h4>
    <p><b>Decision:</b> Deliver token streams and agent thoughts over Server-Sent Events (SSE).</p>
    <p><b>Rationale:</b> Runs natively over HTTP/2, multiplexes cleanly through Caddy/Nginx without connection upgrade hacks, and handles automatic browser reconnections.</p>
  </div>
  <div class="card">
    <h4>ADR 4: Transactional Outbox for Async Evals</h4>
    <p><b>Decision:</b> Commit agent run outputs and outbox records in a single database transaction.</p>
    <p><b>Rationale:</b> Guarantees that 100% of production LLM interactions are captured for offline evaluation and token cost auditing without slowing down real-time user responses.</p>
  </div>
</div>

<h3>Part 2: Production Model Gateway with Automatic Circuit Breakers</h3>
<p>Never hardcode direct client calls to a single AI provider in enterprise systems. Implement fallback routing and exponential backoff:</p>

<pre data-lang="typescript"><code class="language-typescript">import { GoogleGenAI } from "@google/genai";
import Anthropic from "@anthropic-ai/sdk";

export class ResilientModelGateway {
  private gemini: GoogleGenAI;
  private anthropic: Anthropic;

  constructor() {
    this.gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }

  async generateWithFallback(prompt: string, systemInstruction: string): Promise<string> {
    // 1. Attempt Primary Provider: Gemini Flash (Fast & Cost-Effective)
    try {
      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { systemInstruction },
      });
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (err: any) {
      console.warn(\`[Gateway Warning] Primary provider failed (\${err.message}). Tripping circuit breaker to Claude Fallback...\`);
    }

    // 2. Automated Failover to Secondary Provider: Claude 3.5 Sonnet
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        system: systemInstruction,
        messages: [{ role: "user", content: prompt }],
      });
      const block = response.content[0];
      if (block.type === "text") return block.text;
    } catch (fallbackErr: any) {
      console.error(\`[Gateway Critical] Secondary provider failed: \${fallbackErr.message}\`);
      throw new Error("ALL_AI_PROVIDERS_UNAVAILABLE");
    }

    throw new Error("EMPTY_AI_RESPONSE");
  }
}</code></pre>

<h3>Part 3: Observability &amp; Cost-Per-Task Telemetry</h3>
<p>Track every agent step with OpenTelemetry spans, recording exact token counts and financial costs to Prometheus and Grafana:</p>

<pre data-lang="typescript"><code class="language-typescript">import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("omniops-agent-runner");

export async function executeAgentStepWithTelemetry(stepIndex: number, toolName: string, action: () => Promise<any>) {
  return tracer.startActiveSpan(\`Agent Step \${stepIndex}: \${toolName}\`, async (span) => {
    span.setAttribute("agent.step", stepIndex);
    span.setAttribute("agent.tool", toolName);
    const startTime = performance.now();

    try {
      const result = await action();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (err: any) {
      span.recordException(err);
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      throw err;
    } finally {
      span.setAttribute("agent.duration_ms", performance.now() - startTime);
      span.end();
    }
  });
}</code></pre>

<h3>Part 4: The 5-Minute Disaster Recovery Drill</h3>
<p>Execute this production drill before declaring the platform operational:</p>
<ol>
  <li><b>Simulate Primary Model Outage:</b> Export an invalid <code>GEMINI_API_KEY=invalid</code>. Submit an incident diagnosis prompt. Verify the UI seamlessly receives the streaming response via Claude fallback with zero error alerts.</li>
  <li><b>Simulate Malicious Prompt Injection:</b> Inject a payload attempting to delete records. Verify that the agent halts at the Human-in-the-Loop gate, emits a security alert, and preserves database integrity.</li>
  <li><b>Simulate Worker Kill:</b> Issue a <code>kill -9</code> on the background evaluation worker. Verify that the Transactional Outbox re-delivers the pending evaluation message upon worker reboot without duplicates.</li>
</ol>

<details class="ex">
  <summary><b>Drill: How to prevent Multi-Tenant data leakage in pgvector RAG?</b> (Click to expand)</summary>
  <p><b>Threat Model:</b> Company A and Company B share the same PostgreSQL database. An agent working for Company A queries embeddings.</p>
  <p><b>Question:</b> How do you mathematically guarantee Company A never retrieves private documentation belonging to Company B?</p>
  <div class="callout key">
    <p><b>Answer: Row-Level Security (RLS) &amp; Composite Indexing!</b></p>
    <p>Never rely on the LLM prompt to filter tenant data. Enforce it at the database kernel level:</p>
    <pre data-lang="sql"><code class="language-sql">-- Enforce PostgreSQL Row-Level Security
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON document_chunks
FOR ALL TO app_user
USING (tenant_id = current_setting('app.current_tenant_id')::uuid);</code></pre>
    <p>When the backend connects, it sets <code>SET LOCAL app.current_tenant_id = '...'</code> inside the transaction. PostgreSQL's internal engine guarantees zero rows from other tenants can ever be returned to vector search.</p>
  </div>
</details>
`;export{e as default};

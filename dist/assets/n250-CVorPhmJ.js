const e=`<p class="goal">Engineering Practice: Architecture Reviews &amp; Design Documents (RFCs). Master the art of writing compelling technical design docs, defending architectural trade-offs, and conducting rigorous architecture reviews before writing code.</p>

<h3>The Cost of Change Curve</h3>
<p>In software engineering, architectural mistakes become exponentially more expensive to fix the later they are discovered:</p>

<div class="diagram">
Cost to Fix
    ▲
    │                                                     [Production Outage / Migration]
    │                                                               ($100,000s + Months)
    │                                                      ┌────────────────────────────┐
    │                                                      │ 6-month dual-write rebuild │
    │                                        [In Code / PR]└────────────────────────────┘
    │                                         ($1,000s + Days)
    │                                  ┌──────────────────────┐
    │                                  │ 2-week refactor &amp; CI │
    │                    [In RFC Doc]  └──────────────────────┘
    │                   ($10s + Hours)
    │             ┌────────────────────┐
    │             │ Erase 2 lines text │
    │             └────────────────────┘
    └───────────────────────────────────────────────────────────────────────────────────► Time
</div>

<p>A well-crafted <b>Request for Comments (RFC) / Design Document</b> forces you to confront hidden assumptions, compute back-of-the-envelope capacity constraints, and evaluate failure modes while changes are still free.</p>

<h3>Part 1: The Production Design Document Blueprint</h3>
<p>Avoid 40-page theoretical dissertations. Use this focused, battle-tested structure:</p>

<table>
  <tr><th>Section</th><th>Purpose</th><th>Common Pitfall to Avoid</th></tr>
  <tr>
    <td><b>1. Context &amp; Problem</b></td>
    <td>Why are we building this now? Provide quantitative metrics (e.g. <i>"P99 checkout latency degraded from 80ms to 4.2s as user count reached 500k"</i>).</td>
    <td>Vague complaints: <i>"The current code is messy and legacy."</i></td>
  </tr>
  <tr>
    <td><b>2. Goals &amp; Explicit Non-Goals</b></td>
    <td>Draw strict boundaries around project scope. (e.g. <i>"Goal: Real-time inventory sync. Non-Goal: International multi-currency support."</i>).</td>
    <td>Scope creep and trying to solve world hunger in a single release.</td>
  </tr>
  <tr>
    <td><b>3. Proposed Architecture</b></td>
    <td>System topology, database schemas, API contracts, and ASCII sequence diagrams.</td>
    <td>Hand-waving box diagrams with undefined network arrows.</td>
  </tr>
  <tr>
    <td><b>4. Alternatives Considered</b></td>
    <td><b>The most important section!</b> Document at least 2 alternative approaches and the exact technical trade-offs that led to their rejection.</td>
    <td>Omitting alternatives, making it look like only one obvious solution exists.</td>
  </tr>
  <tr>
    <td><b>5. Failure Modes &amp; Blast Radius</b></td>
    <td>What happens when the database drops connections? When Redis crashes? When the third-party API returns 500s?</td>
    <td>Assuming the "happy path" where all networks are reliable.</td>
  </tr>
  <tr>
    <td><b>6. Migration &amp; Rollback Plan</b></td>
    <td>Step-by-step zero-downtime database migrations (Expand-Contract pattern) and kill-switch feature flags.</td>
    <td>Requiring a scheduled 4-hour maintenance window where the app is shut down.</td>
  </tr>
</table>

<h3>Part 2: The 5 Challenge Questions of Architecture Reviews</h3>
<p>When reviewing a proposed system design, ask these targeted questions:</p>

<div class="cheat">
  <div class="card">
    <h4>1. The 10x Scale Test</h4>
    <p><i>"What breaks first if traffic or dataset size increases by 10x next quarter?"</i> (Identify single points of bottleneck: unindexed joins, single-leader locks, memory limits).</p>
  </div>
  <div class="card">
    <h4>2. The Simplicity Challenge</h4>
    <p><i>"Can we achieve 80% of this business value using a 10x simpler architecture?"</i> (e.g. Do we really need a Kafka cluster, or does a Postgres table with <code>SKIP LOCKED</code> suffice?).</p>
  </div>
  <div class="card">
    <h4>3. The Partial Failure Drill</h4>
    <p><i>"If downstream Service B is latency-degraded by 5 seconds, does Service A degrade gracefully or crash the whole company?"</i></p>
  </div>
  <div class="card">
    <h4>4. The Operability Audit</h4>
    <p><i>"How will the on-call engineer know this is failing at 3 AM? What metric or alert fires, and what is the exact rollback step in the runbook?"</i></p>
  </div>
</div>

<h3>Part 3: The Expand-Contract (Parallel Run) Migration Pattern</h3>
<p>Never perform a destructive schema migration in one deploy. Always execute zero-downtime data migrations in 4 phases:</p>

<div class="diagram">
Phase 1: Expand      ──► Add new nullable column/table; deploy app writing to BOTH old and new.
Phase 2: Backfill    ──► Run background worker backfilling historical records in small batches.
Phase 3: Switch Read ──► Switch API reads to new column/table with feature flag safety.
Phase 4: Contract    ──► Drop old column/table after 2 weeks of verified stability.
</div>

<details class="ex">
  <summary><b>Drill: Evaluating Trade-offs: Microservices vs Modular Monolith</b> (Click to expand)</summary>
  <p><b>Scenario:</b> A team of 6 engineers proposes splitting their monolith into 8 microservices to "improve scalability".</p>
  <p><b>Question:</b> What hidden operational costs will this team immediately inherit?</p>
  <div class="callout warn">
    <p><b>The Hidden Costs:</b></p>
    <ul>
      <li><b>Distributed Transactions:</b> Replacing ACID database joins with distributed sagas, 2-phase commits, and eventual consistency bugs.</li>
      <li><b>Observability Overhead:</b> Requiring OpenTelemetry distributed tracing across network hops to debug single user requests.</li>
      <li><b>Network Latency &amp; Failure Modes:</b> In-process function calls (0.001ms) become network RPCs (5–50ms) that can timeout, partition, or fail.</li>
      <li><b>Deployment Complexity:</b> Managing 8 separate CI/CD pipelines, container registries, and version compatibility matrices.</li>
    </ul>
    <p><b>Senior Recommendation:</b> Build a clean <b>Modular Monolith</b> with strict package boundaries until team size exceeds 30+ engineers.</p>
  </div>
</details>
`;export{e as default};

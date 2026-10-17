const e=`<p class="goal">Engineering Practice: Technical Interview Mastery. Master the DSA pattern decision tree, the 45-minute coding interview protocol, and the senior behavioral STAR matrix.</p>

<h3>The Real Nature of Technical Interviews</h3>
<p>Interviewers are not looking for someone who memorized 600 LeetCode solutions. They are assessing: <i>"Would I trust this person on-call at 2 AM, and would I enjoy collaborating with them on a complex architectural design?"</i></p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               The 3-Pillar Technical Assessment                        │
│                                                                                        │
│   ┌──────────────────────────┐┌──────────────────────────┐┌──────────────────────────┐ │
│   │ 1. Coding &amp; DSA          ││ 2. System Design         ││ 3. Behavioral (STAR)     │ │
│   │ • Algorithmic patterns   ││ • Capacity math          ││ • On-call war stories    │ │
│   │ • Clean invariants       ││ • Trade-off defense      ││ • Blameless accountability││
│   │ • Edge-case verification ││ • Failure resilience     ││ • Technical leadership   │ │
│   └──────────────────────────┘└──────────────────────────┘└──────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: The Algorithmic Pattern Decision Tree</h3>
<p>When given a coding problem, do not guess randomly. Classify the problem pattern within 60 seconds using this decision framework:</p>

<table>
  <tr><th>Input / Problem Characteristic</th><th>Optimal Pattern</th><th>Key Data Structure</th><th>Time Complexity</th></tr>
  <tr>
    <td>Sorted array, search for pairs, target sum</td>
    <td><b>Two Pointers</b> (Left &amp; Right converging)</td>
    <td>Array indices</td>
    <td>$O(n)$</td>
  </tr>
  <tr>
    <td>Subarray with condition (contiguous window, max sum, longest unique)</td>
    <td><b>Sliding Window</b> (Dynamic or Fixed)</td>
    <td>Hash Map / Frequency table</td>
    <td>$O(n)$</td>
  </tr>
  <tr>
    <td>Find Top-K elements or continuously track running median</td>
    <td><b>Heap / Priority Queue</b></td>
    <td>Min-Heap / Max-Heap</td>
    <td>$O(n \\log k)$</td>
  </tr>
  <tr>
    <td>Shortest path in unweighted maze / level-by-level traversal</td>
    <td><b>Breadth-First Search (BFS)</b></td>
    <td>Queue (FIFO) + Visited Set</td>
    <td>$O(V + E)$</td>
  </tr>
  <tr>
    <td>Dependency ordering / task build pipeline</td>
    <td><b>Topological Sort</b> (Kahn's algorithm)</td>
    <td>In-degree Array + Queue</td>
    <td>$O(V + E)$</td>
  </tr>
  <tr>
    <td>Max/Min choices with overlapping subproblems (Knapsack, Grid paths)</td>
    <td><b>Dynamic Programming</b> (Memoization / Tabulation)</td>
    <td>1D/2D DP Array</td>
    <td>$O(n \\cdot m)$</td>
  </tr>
</table>

<h3>Part 2: The 45-Minute Coding Interview Protocol</h3>
<ol>
  <li><b>[0–5 min] Clarify Invariants &amp; Edge Cases:</b>
    <ul>
      <li><i>"Can the input array be empty or null?"</i></li>
      <li><i>"Are the numbers strictly positive, or can they be negative/zero?"</i></li>
      <li><i>"Can there be duplicate values?"</i></li>
      <li>Write down 3 concrete test cases: a normal case, an edge case, and a negative case.</li>
    </ul>
  </li>
  <li><b>[5–12 min] State Approach &amp; Analyze Complexity OUT LOUD:</b>
    <ul>
      <li>State the naive brute force solution: <i>"The brute force is $O(n^2)$ using nested loops."</i></li>
      <li>Propose the optimal approach: <i>"We can optimize this to $O(n)$ time using a sliding window with a frequency map."</i></li>
      <li><b>Crucial rule:</b> Get the interviewer's explicit verbal agreement before typing a single line of code!</li>
    </ul>
  </li>
  <li><b>[12–30 min] Write Clean, Idiomatic Code:</b>
    <ul>
      <li>Use descriptive variable names (<code>left</code>, <code>right</code>, <code>windowSum</code> instead of <code>i</code>, <code>j</code>, <code>s</code>).</li>
      <li>Handle guard clauses and base cases first at the top of the function.</li>
    </ul>
  </li>
  <li><b>[30–40 min] Dry-Run with Example (Manual Tracing):</b>
    <ul>
      <li>Never say "I'm done" without testing. Walk through your written code line-by-line using your test cases, tracking variable values in comments.</li>
    </ul>
  </li>
</ol>

<h3>Part 3: Behavioral Interviews: The Senior STAR Matrix</h3>
<p>Prepare 5 distinct stories from real engineering work, structured strictly in <b>STAR</b> format (Situation, Task, Action, Result):</p>

<div class="cheat">
  <div class="card">
    <h4>1. High-Pressure Production Incident</h4>
    <p><b>Situation:</b> Checkout database locks crashed the store on a Friday afternoon.</p>
    <p><b>Task:</b> Mitigate customer impact and eliminate the recurring race condition.</p>
    <p><b>Action:</b> Commanded the war room, rolled back the release in 4m, and rebuilt the stock decrement using atomic conditional updates.</p>
    <p><b>Result:</b> Zero overselling incidents since; reduced checkout P99 latency by 65%.</p>
  </div>
  <div class="card">
    <h4>2. Technical Disagreement with Senior Stakeholder</h4>
    <p><b>Situation:</b> A teammate advocated rewriting our monolithic backend in 8 microservices.</p>
    <p><b>Task:</b> Align the team on the lowest-risk architecture for our 5-person team.</p>
    <p><b>Action:</b> Wrote an RFC with concrete latency numbers, operational overhead math, and built a prototype modular monolith.</p>
    <p><b>Result:</b> Team unanimously adopted the modular monolith, saving an estimated 3 months of devops overhead.</p>
  </div>
</div>

<details class="ex">
  <summary><b>Drill: What is the #1 Red Flag in technical coding rounds?</b> (Click to expand)</summary>
  <p><b>Question:</b> What is the most common reason candidates fail coding interviews despite writing code that works?</p>
  <div class="callout warn">
    <p><b>Answer: Silent coding without clarifying requirements or communicating thought processes!</b></p>
    <p>If you read the prompt, say nothing for 10 minutes, and start typing code, you fail the collaboration assessment. In real engineering, engineers who jump to implementation without asking questions build the wrong product and introduce architectural debt.</p>
    <p>Treat the interviewer as a senior peer with whom you are pair-programming.</p>
  </div>
</details>
`;export{e as default};

const e=`<p class="goal">Why the skill fades, and the rules that rebuild it.</p>

<h3>1. Why It Feels Like You're Losing It</h3>
<p>Programming skill is not knowledge of syntax. It is built upon three pillars:</p>
<ul>
  <li><b>Mental Model of the Machine:</b> A precise understanding of what happens to memory, registers, and the call stack when a specific line runs.</li>
  <li><b>Problem Decomposition:</b> The ability to dissect a vague or complex requirement into small, testable, deterministic units.</li>
  <li><b>Debugging &amp; Gap Analysis:</b> Noticing the exact gap between expected and actual behavior, formulating a hypothesis, and closing it.</li>
</ul>

<p>All three pillars are strengthened exclusively through <b>deliberate struggle</b>—the uncomfortable minutes where you do not yet know the answer:</p>
<ul>
  <li><b>Desirable Difficulty:</b> Cognitive science shows that effortful retrieval is the mechanism that encodes neural connections into long-term memory.</li>
  <li><b>Recognition vs Recall:</b> When AI writes code, you exercise <i>recognition</i> (which is easy and passive). But engineering requires <i>recall</i> and generation (which is hard and active).</li>
  <li><b>The AI Competence Trap:</b> Mistaking the ability to understand generated code for the ability to invent and architect it yourself from a blank screen.</li>
</ul>

<h3>2. The Eight Rules for This Curriculum</h3>
<div class="callout key"><b class="t">The Foundational Rules</b>
<ul>
  <li><b>Rule 1: No AI for initial exercise attempts.</b> Always attempt solutions yourself. Use AI only as an aggressive reviewer after you pass tests or struggle.</li>
  <li><b>Rule 2: Type every code example manually.</b> Never copy-paste. Muscle memory and kinesthetic typing internalize syntax quirks and idioms.</li>
  <li><b>Rule 3: Predict before you run.</b> State out loud (or in your notes) the exact output or error before executing code. A wrong prediction is pure gold because it pinpoints where your mental model is flawed.</li>
  <li><b>Rule 4: The 20-minute rule.</b> When stuck, struggle deliberately for 20 minutes: re-read, print state, draw memory boxes, check documentation. Only then consult a hint.</li>
  <li><b>Rule 5: Master the official documentation.</b> Consult <code>python3 -c "help(str.split)"</code>, <code>man 3 printf</code>, <code>go doc strings.Split</code>, and MDN directly. Navigating primary documentation is a superpower.</li>
  <li><b>Rule 6: Draw memory diagrams on paper.</b> Sketch boxes, pointers, and stack frames. Every senior engineer does this in their mind; you must train it on paper first.</li>
  <li><b>Rule 7: Spaced repetition for permanent mastery.</b> Re-solve old problems after 1 day, 7 days, and 30 days without looking at past answers. If you cannot solve it, you merely recognized it, not mastered it.</li>
  <li><b>Rule 8: Never learn a tool without building something that breaks.</b> Don't read abstract descriptions. Build a service, break it under load, hit a real constraint, and learn the tool as the natural solution.</li>
</ul>
</div>

<h3>3. How to Use AI Correctly as a Learning Multiplier</h3>
<table>
<tr><th>Ineffective Prompting (Atrophy)</th><th>High-Leverage Pedagogical Prompting (Mastery)</th></tr>
<tr><td>"Write a function that does X"</td><td>"Here is my working implementation for X. Act as a Staff Engineer. Don't rewrite it; critique edge cases, algorithmic complexity, and failure modes I missed."</td></tr>
<tr><td>"Fix this error for me"</td><td>"Here is the traceback. My current hypothesis is Y because of Z. Am I analyzing the root cause correctly? Guide my investigation without giving the fix."</td></tr>
<tr><td>"Explain this code snippet"</td><td>"Here is my explanation of what this code does. Grade my explanation out of 10 and point out any misconceptions in my mental model."</td></tr>
<tr><td>Accepting generated code you couldn't defend</td><td>Never commit or merge a line of code you cannot defend in a live technical review.</td></tr>
</table>

<h3>4. The 15 Stages of This Natural Progression</h3>
<table>
<tr><th>Stage</th><th>Theme</th><th>What you will master</th></tr>
<tr><td><b>0</b></td><td>Learn how to learn</td><td>Deliberate practice, spaced repetition, predicting before running, and using AI as a reviewer rather than author.</td></tr>
<tr><td><b>1</b></td><td>How a computer works</td><td>CPU execution cycle, binary, hexadecimal, two's complement, IEEE-754 floats, and memory address layout.</td></tr>
<tr><td><b>2</b></td><td>Core programming</td><td>Universal language primitives: variables, types, control flow, functions, scope, collections, text, files, errors, and debugging.</td></tr>
<tr><td><b>3</b></td><td>The modern polyglot</td><td>Cross-language Rosetta comparisons, mastering Python, TypeScript, and Go in depth early on.</td></tr>
<tr><td><b>4</b></td><td>The developer's workbench</td><td>The Linux terminal, navigation, pipes, permissions, processes, Git branches, interactive rebase, and code reviews.</td></tr>
<tr><td><b>5</b></td><td>Computer science &amp; foundations</td><td>Stack vs heap, pointers, Big-O asymptotic analysis, recursion, and core data structures and algorithm patterns.</td></tr>
<tr><td><b>6</b></td><td>Software engineering &amp; architecture</td><td>Clean code, SOLID principles, OOP &amp; composition, functional programming, design patterns, and dependency injection.</td></tr>
<tr><td><b>7</b></td><td>Systems &amp; low-level programming</td><td>Compilers, ASTs, linkers, ELF binaries, OS kernels, virtual memory, non-blocking I/O (epoll/io_uring), C, and Rust.</td></tr>
<tr><td><b>8</b></td><td>How networks work</td><td>Packet routing, TCP/IP, subnets, DNS resolution, HTTP/1/2/3, TLS encryption, and browser engines.</td></tr>
<tr><td><b>9</b></td><td>How applications work</td><td>Frontend (React/Next.js), Backend HTTP services, SQL &amp; PostgreSQL, transactions, Redis, and full-stack testing.</td></tr>
<tr><td><b>10</b></td><td>How software ships</td><td>Docker containers, multi-stage images, automated CI/CD pipelines, Cloud infrastructure, Kubernetes, and Terraform.</td></tr>
<tr><td><b>11</b></td><td>How production systems run</td><td>Production readiness reviews, health checks, rate limiting, OpenTelemetry, metrics, alerting, SLOs, and web security.</td></tr>
<tr><td><b>12</b></td><td>How distributed systems work</td><td>CAP theorem, replication, sharding, distributed consensus (Raft), resilience patterns, and high-scale system design.</td></tr>
<tr><td><b>13</b></td><td>How AI systems work</td><td>Machine learning math, Transformers, tokenization, local LLMs, VRAM budgets, RAG vector search, AI agents, and MCP.</td></tr>
<tr><td><b>14</b></td><td>Build and practise</td><td>A 12-tier progressive capstone ladder from CLI to distributed AI platform, senior code reviews, and mock design interviews.</td></tr>
</table>
`;export{e as default};

const e=`<p class="goal">The Model Context Protocol: a standard way to plug tools and data into AI applications.</p>
<div class="diagram">HOST (Claude Code, Claude Desktop, an IDE, your app)
  └─ MCP CLIENT (one per server connection)  ──JSON-RPC 2.0──►  MCP SERVER (your integration)
                                                   transport: stdio (a local subprocess) or Streamable HTTP (remote)</div>
<table>
<tr><th>Server exposes</th><th>Controlled by</th><th>Example</th></tr>
<tr><td><b>Tools</b></td><td>the model decides to call them</td><td><code>search_orders</code>, <code>print_label</code></td></tr>
<tr><td><b>Resources</b></td><td>the app or user attaches them as context</td><td><code>file:///…</code>, <code>db://stores/7/schema</code></td></tr>
<tr><td><b>Prompts</b></td><td>the user picks them (like slash commands)</td><td>"daily sales summary" template</td></tr>
</table>
<ul>
<li><b>Lifecycle:</b> <code>initialize</code> (version and capability negotiation), then <code>tools/list</code>, then <code>tools/call</code> …, plus notifications (e.g. "the tool list changed").</li>
<li><b>Why it matters:</b> write an integration once and it works in any MCP host. This session's Chrome, ElevenLabs and Gmail tools are MCP servers.</li>
<li><b>stdio vs HTTP:</b> stdio servers run locally as a subprocess of the host, with no hosting needed and the user's own machine and credentials. Remote (Streamable HTTP) servers are hosted services, shared across users, and need authentication (OAuth).</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>223.1 <span class="levels">basic</span> Connect an existing MCP server to Claude Code with <code>claude mcp add</code> and list its tools. Then look at the JSON-RPC traffic with the MCP Inspector.</summary><div><p>The Inspector shows <code>initialize</code>, <code>tools/list</code>, and each <code>tools/call</code> request and response: the whole protocol is visible.</p></div></details>
</div>
`;export{e as default};

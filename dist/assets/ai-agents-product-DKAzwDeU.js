const e=`<p class="goal">Embedding autonomous tool-calling agents into production apps: safety boundaries, approval gates, and stateful execution.</p>
<h3>Human-In-The-Loop Approval Gate</h3>
<pre data-lang="typescript"><code class="language-typescript">interface ToolAction {
  id: string;
  toolName: string;
  params: Record<string, any>;
  requiresApproval: boolean;
}

async function executeAgentStep(action: ToolAction, userApproved: boolean) {
  if (action.requiresApproval && !userApproved) {
    throw new Error("Action cancelled by user.");
  }
  return await registry[action.toolName](action.params);
}</code></pre>

<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>357.1 <span class="levels">basic</span> Write a tool registry that enforces timeouts on all external agent tool invocations.</summary><div><p>Use <code>Promise.race</code> with an AbortController timeout of 10 seconds.</p></div></details>
</div>`;export{e as default};

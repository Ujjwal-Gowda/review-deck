const e=`<p class="goal">Letting the model call your functions: the loop, the edge cases, the production details.</p>
<pre data-lang="python"><code class="language-python">TOOLS = {"get_stock": get_stock, "create_refund": create_refund}
schemas = [{"name": "get_stock", "description": "Current stock for a SKU at a store. Use before promising availability.",
            "input_schema": {"type": "object", "properties": {"sku": {"type": "string"}, "store_id": {"type": "integer"}},
                             "required": ["sku", "store_id"]}}, …]
messages = [{"role": "user", "content": question}]
for step in range(8):                                        # hard cap on the number of steps
    resp = client.messages.create(model="claude-sonnet-5", max_tokens=2048, tools=schemas, messages=messages)
    messages.append({"role": "assistant", "content": resp.content})
    if resp.stop_reason != "tool_use":
        break
    results = []
    for b in resp.content:                                   # there may be SEVERAL tool calls: run them in parallel if independent
        if b.type != "tool_use": continue
        try:
            out = run_with_timeout(TOOLS[b.name], b.input, seconds=10)
            results.append({"type": "tool_result", "tool_use_id": b.id, "content": json.dumps(out)})
        except Exception as e:                               # report errors TO THE MODEL: it can often recover
            results.append({"type": "tool_result", "tool_use_id": b.id, "content": f"error: {e}", "is_error": True})
    messages.append({"role": "user", "content": results})</code></pre>
<ul>
<li><b>Tool descriptions are prompts:</b> say when to use the tool, what it returns, and its limits. Good names and descriptions matter more than clever system prompts.</li>
<li>Validate the model's arguments like any untrusted input; enforce timeouts; return concise, structured results (don't dump 50 KB of JSON into the context).</li>
<li>Keep the tool set small and focused: many overlapping tools confuse the model.</li>
<li>Log every call (name, arguments, result, latency) for debugging and auditing.</li>
</ul>
<div class="callout seclens"><b class="t">Security lens · Tool calling</b><p>The model's tool arguments are untrusted input. Validate them, authorise against the end user, and require confirmation for irreversible actions.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>219.1 <span class="levels">basic</span> Build a two-tool agent (get_stock, get_price) and ask a question that needs both. Log each step.</summary><div><p>The model issues tool_use blocks (often both in one turn); you run them and return tool_result blocks; it then answers. The log shows the whole loop.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">The details of production LLM API use: conversation structure, stop reasons, limits and retries. The provider overview is in <a class="xref" data-old="c30">chapter 216</a>.</p>
<pre data-lang="python"><code class="language-python">import anthropic
client = anthropic.Anthropic(max_retries=3, timeout=60)        # the SDK retries 429/5xx with backoff
resp = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    system=[{"type": "text", "text": LONG_STATIC_INSTRUCTIONS, "cache_control": {"type": "ephemeral"}}],   # prompt caching
    messages=[
        {"role": "user", "content": "Summarise yesterday's complaints."},
        {"role": "assistant", "content": "Here are the main themes:"},      # optional prefill to steer the format
    ],
)
match resp.stop_reason:
    case "end_turn": ...            # finished normally
    case "max_tokens": ...          # truncated: raise max_tokens, or ask it to continue
    case "tool_use": ...            # the model wants a tool run (<a class="xref" data-old="n219">chapter 219</a>)
    case "stop_sequence": ...
print(resp.usage)                   # input, output, cache_creation and cache_read tokens</code></pre>
<ul>
<li><b>Roles:</b> the system prompt holds stable instructions; user and assistant turns alternate; the whole history is sent every call (the API is stateless).</li>
<li><b>Rate limits:</b> requests and tokens per minute per model. Handle 429 with backoff (it has a <code>retry-after</code> header); queue bulk work; use the Batch API for offline jobs.</li>
<li><b>Errors:</b> 400 (bad request: don't retry), 401/403 (key or permission), 429/529 (overloaded: back off), 5xx (retry).</li>
<li><b>Streaming</b> for user-facing latency (SSE, <a class="xref" data-old="n88">chapter 88</a>).</li>
<li><b>Pin model IDs</b>, and re-evaluate before upgrading (<a class="xref" data-old="n228">chapter 228</a>).</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>217.1 <span class="levels">basic</span> Make one request that hits <code>max_tokens</code> and one that ends normally, and handle both stop reasons in code.</summary><div><p>For <code>max_tokens</code>, either continue (send the partial answer back and ask it to continue) or raise the limit; for <code>end_turn</code>, finish normally. Never silently show a truncated answer.</p></div></details>
</div>
`;export{e as default};

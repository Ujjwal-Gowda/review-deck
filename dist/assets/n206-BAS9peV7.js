const e=`<p class="goal">What happens when a model serves a request, and the tricks that make serving fast and cheap.</p>
<ul>
<li><b>Prefill</b> processes the prompt in parallel (compute-bound) and sets time-to-first-token. <b>Decode</b> generates one token per step, reading all the weights each time (memory-bandwidth-bound), and sets tokens per second.</li>
<li><b>KV cache:</b> stores the keys and values for past tokens so they aren't recomputed. It grows with context length × batch size, and is often the real memory limit (<a class="xref" data-old="c28">chapter 208</a>).</li>
<li><b>Continuous batching</b> (vLLM, SGLang, TGI): add and remove sequences from the running batch at every step, keeping the GPU busy. This gives 10–20× the throughput of naive serving.</li>
<li><b>PagedAttention:</b> the KV cache is stored in fixed-size pages like virtual memory, with no fragmentation, so more users fit.</li>
<li><b>Prefix caching:</b> reuse the KV cache for shared prompt prefixes (system prompts, documents). It's what provider "prompt caching" discounts are built on.</li>
<li><b>Speculative decoding:</b> a small draft model proposes several tokens, and the big model verifies them in one pass, giving 2–3× faster decoding with identical output.</li>
<li><b>Parallelism:</b> tensor-parallel splits each layer across GPUs (for speed); pipeline-parallel splits the layers (for capacity).</li>
<li><b>Structured decoding:</b> constrain generation to a grammar or JSON schema, so the output is guaranteed to parse.</li>
</ul>
<p>Metrics to watch: time to first token (TTFT), inter-token latency, throughput (tokens per second per GPU), and cost per million tokens.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>206.1 <span class="levels">basic</span> Measure time-to-first-token and tokens/sec for a local model with a short prompt and then a 3,000-token prompt. Which one changes?</summary><div><p>Time-to-first-token grows with prompt length (prefill); tokens/sec in decode stays roughly the same (until the KV cache pressures memory).</p></div></details>
</div>
`;export{e as default};

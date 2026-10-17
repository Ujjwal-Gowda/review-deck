const e=`<p class="goal">Calling a model from code, choosing a provider, and controlling cost.</p>
<h3>The provider landscape</h3>
<table>
<tr><th>Category</th><th>Who</th><th>What you get</th></tr>
<tr><td><b>Frontier labs (API)</b></td><td><b>Anthropic</b> (Claude: Opus, Sonnet, Haiku), <b>OpenAI</b> (GPT and o-series), <b>Google</b> (Gemini), <b>xAI</b> (Grok), <b>Mistral</b>, <b>DeepSeek</b>, <b>Alibaba</b> (Qwen), Cohere (enterprise and RAG)</td><td>The strongest models, pay per token, no hardware needed</td></tr>
<tr><td><b>Open-weights publishers</b></td><td>Meta (Llama), Alibaba (Qwen), Mistral, Google (Gemma), DeepSeek, Microsoft (Phi), NVIDIA (Nemotron)</td><td>Downloadable models to run or fine-tune yourself (check each licence)</td></tr>
<tr><td><b>Cloud platforms</b></td><td>AWS Bedrock, Google Vertex AI, Azure AI Foundry</td><td>Many providers' models under your existing cloud account, billing and compliance</td></tr>
<tr><td><b>Fast inference hosts</b></td><td>Groq, Cerebras, Together AI, Fireworks, DeepInfra</td><td>Open models served very fast or cheaply through APIs</td></tr>
<tr><td><b>Aggregators</b></td><td>OpenRouter</td><td>One API key and one API shape for hundreds of models</td></tr>
<tr><td><b>Model hub</b></td><td>Hugging Face</td><td>Hosts almost every open model and dataset; the "GitHub of ML"</td></tr>
<tr><td><b>Local runners</b></td><td><b>Ollama</b> (easiest CLI and server), <b>LM Studio</b> (GUI), <b>llama.cpp</b> (the engine under both; CPU+GPU), <b>vLLM</b> / SGLang (high-throughput GPU serving), MLX (Mac)</td><td>Private, offline, free per token; limited by your hardware (<a class="xref" data-old="c28">chapter 28</a>)</td></tr>
<tr><td><b>Specialised</b></td><td>ElevenLabs (voice, audio, and video via partners), Midjourney, Runway, Deepgram, Voyage AI</td><td>One modality done very well</td></tr>
</table>
<div class="callout key"><b class="t">Trade-offs: API vs self-hosted</b><p><b>API:</b> best quality, zero ops, scales instantly. But you pay per token, data leaves your machine (check retention and compliance terms), you depend on the vendor and rate limits, and you need a network connection. <b>Self-hosted open weights:</b> privacy, offline use, fixed cost, full control and fine-tuning. But lower quality at a given size, hardware cost, and ops work; utilisation must be high to beat API prices. <b>Common pattern:</b> APIs for hard tasks; small local or cheap models for high-volume simple tasks (classification, extraction).</p></div>

<h3>Calling an API: Anthropic (Claude)</h3>
<pre data-lang="shell"><code class="language-bash">pip install anthropic
export ANTHROPIC_API_KEY="sk-ant-..."      # from console.anthropic.com. NEVER commit it</code></pre>
<pre data-lang="python"><code class="language-python">import anthropic
client = anthropic.Anthropic()                 # reads ANTHROPIC_API_KEY from the environment

msg = client.messages.create(
    model="claude-sonnet-5",                   # tiers: claude-opus-5-5 (most capable),
    max_tokens=1024,                           #        claude-sonnet-5 (balanced), claude-haiku-4-5 (fast/cheap)
    system="You are a concise assistant for a grocery business.",
    messages=[
        {"role": "user", "content": "Write 3 subject lines for a festive offer email."},
    ],
)
print(msg.content[0].text)
print(msg.usage.input_tokens, msg.usage.output_tokens)    # what you're billed for</code></pre>
<p>The API is <b>stateless</b>: for a multi-turn chat, you send the whole conversation every time (alternating <code>user</code>/<code>assistant</code> messages). That's why long chats get slower and more expensive per turn.</p>
<h4>Streaming</h4>
<pre data-lang="python"><code class="language-python">with client.messages.stream(model="claude-sonnet-5", max_tokens=1024,
        messages=[{"role": "user", "content": "Explain KV cache in 3 lines"}]) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)        # show tokens as they arrive</code></pre>
<h4>Tool use (function calling)</h4>
<pre data-lang="python"><code class="language-python">tools = [{
    "name": "get_stock",
    "description": "Current stock quantity for a SKU",
    "input_schema": {"type": "object", "properties": {"sku": {"type": "string"}}, "required": ["sku"]},
}]
resp = client.messages.create(model="claude-sonnet-5", max_tokens=1024, tools=tools,
    messages=[{"role": "user", "content": "Do we have paneer?"}])
# resp.stop_reason == "tool_use" → the MODEL asks YOU to run get_stock(sku="paneer").
# Your code runs it, sends back a "tool_result" message, and the model writes the final answer.
# The model never executes anything itself; your code decides what actually runs.</code></pre>

<h3>Calling an OpenAI-compatible API (OpenAI, and many others)</h3>
<p>Many providers and local servers (Ollama, vLLM, LM Studio, Together, Groq, OpenRouter) expose the same "chat completions" shape, so one client works by changing <code>base_url</code>:</p>
<pre data-lang="python"><code class="language-python">from openai import OpenAI
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")   # local Ollama
# client = OpenAI()   # real OpenAI, reads OPENAI_API_KEY
r = client.chat.completions.create(
    model="llama3.2:3b",
    messages=[{"role": "system", "content": "Be brief."},
              {"role": "user", "content": "What is a KV cache?"}],
    temperature=0.2,
)
print(r.choices[0].message.content)</code></pre>
<p>Google Gemini has its own SDK (<code>pip install google-genai</code>) and an OpenAI-compatible endpoint. Always check each provider's current docs for model names: they change every few months.</p>

<h3>Running locally with Ollama</h3>
<pre data-lang="shell"><code class="language-bash">curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:3b          # ~2 GB download; 4-bit by default
ollama run llama3.2:3b           # interactive chat in the terminal
ollama ps                        # what's loaded, and how much is on GPU vs CPU
curl http://localhost:11434/api/generate -d '{"model":"llama3.2:3b","prompt":"hi","stream":false}'</code></pre>
<p>Ollama and LM Studio pick a quantisation for you and offload whatever doesn't fit in VRAM to the CPU, at a big speed cost. <code>ollama ps</code> shows the split (e.g. "40%/60% CPU/GPU").</p>

<h3>Cost and token control</h3>
<div class="callout key"><b class="t">Cost formula</b><p><code>cost = input_tokens × input_price + output_tokens × output_price</code>, with prices quoted per <b>million tokens</b>. Output usually costs about 3–5× input. Prices vary about 100× between the cheapest small models and frontier models, and drop over time, so always check the provider's pricing page.</p></div>
<ul>
<li><b>Right-size the model:</b> a small or fast tier for classification and extraction; the largest only for hard reasoning. Route tasks between tiers.</li>
<li><b>Prompt caching:</b> providers discount a repeated prompt prefix (system prompt, documents) heavily. Put static content first and variable content last.</li>
<li><b>Batch APIs:</b> about 50% cheaper for non-urgent bulk jobs, with results within hours.</li>
<li><b>Trim context:</b> don't resend huge histories; summarise, and retrieve only relevant chunks (RAG).</li>
<li><b>Cap output:</b> <code>max_tokens</code>, and ask for concise or structured output.</li>
<li><b>Count before sending:</b> SDKs have token-counting endpoints. Log <code>usage</code> on every call.</li>
<li><b>Rate limits:</b> requests per minute and tokens per minute. Handle HTTP 429 with exponential backoff (<a class="xref" data-old="c19">chapter 19</a>).</li>
</ul>
<h3>Prompting that works</h3>
<ul>
<li>Be explicit about the task, audience, format and constraints. Give context and the reason behind rules.</li>
<li>Give <b>examples</b> (few-shot) of the exact output you want.</li>
<li>Separate instructions from data with clear delimiters or XML tags (<code>&lt;document&gt;…&lt;/document&gt;</code>).</li>
<li>Ask for <b>structured output</b> (JSON matching a schema) and validate it in code.</li>
<li>For hard problems, allow reasoning (extended thinking), and break big tasks into steps (<b>prompt chaining</b>).</li>
<li><b>Evaluate:</b> keep a small test set of inputs with expected outputs, and re-run it whenever you change the prompt or model.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>216.1 <span class="levels">basic</span> Call a model through the API, print <code>usage</code>, then compute the cost of your call from the provider's current pricing page.</summary><div><p>Cost = input_tokens × input_price/1e6 + output_tokens × output_price/1e6. Log it per request from now on.</p></div></details>
</div>
`;export{e as default};

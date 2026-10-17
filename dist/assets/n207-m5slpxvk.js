const t=`<p class="goal">Running models on your own hardware: choosing an engine, a model and settings.</p>
<table>
<tr><th>Engine</th><th>Best for</th></tr>
<tr><td><b>Ollama</b></td><td>the easiest local runner: CLI + API + model library; GGUF under the hood</td></tr>
<tr><td>LM Studio</td><td>a GUI, model discovery, an OpenAI-compatible server</td></tr>
<tr><td><b>llama.cpp</b> (<code>llama-server</code>)</td><td>maximum control: CPU/GPU split, quantisation, speculative decoding; runs almost anywhere</td></tr>
<tr><td><b>vLLM</b> / SGLang</td><td>serving many users on NVIDIA GPUs with high throughput</td></tr>
<tr><td>MLX-LM</td><td>Apple Silicon</td></tr>
</table>
<pre data-lang="shell"><code class="language-bash">ollama pull qwen2.5:3b &amp;&amp; ollama run qwen2.5:3b "Summarise: …"
ollama ps                                  # how much of the model is on the GPU vs the CPU
llama-server -m model-Q4_K_M.gguf -ngl 99 -c 8192 --port 8080    # -ngl = layers offloaded to the GPU; -c = context size
# OpenAI-compatible API at http://localhost:8080/v1 (<a class="xref" data-old="c30">chapter 216</a>)</code></pre>
<ul>
<li><b>Choosing a model:</b> fit weights + KV cache in VRAM (<a class="xref" data-old="c28">chapter 208</a>); prefer the biggest model at Q4 that fits; choose instruct/chat variants; check the licence.</li>
<li><b>Partial offload:</b> layers that don't fit run on the CPU, and speed drops sharply, because each token must stream through system RAM.</li>
<li><b>Context size costs memory:</b> set <code>-c</code> or <code>num_ctx</code> to what you need, not the maximum.</li>
<li>On your 4 GB GPU with ~7 GB RAM: 1–3B models at Q4 run well; anything larger means heavy offloading. Local models are great for private, bulk, simple tasks (classification, extraction, drafts); use APIs for hard reasoning.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>207.1 <span class="levels">basic</span> Using the VRAM formulas, pick the largest model and quantisation that runs fully on your 4 GB GPU with an 8K context. Then verify with <code>ollama ps</code>.</summary><div><p>Roughly a 3B model at Q4 (about 2 GB of weights plus KV cache). <code>ollama ps</code> should show 100% GPU; a 7–8B model shows a CPU/GPU split and a large slowdown.</p></div></details>
</div>
`;export{t as default};

const t=`<p class="goal">Predict, for any model and any GPU, whether it fits and how fast it will run.</p>
<h3>Why GPUs</h3>
<p>A CPU has a few (8–64) powerful cores built for branching logic. A GPU has thousands of simple cores that do the same maths on lots of data at once, which is ideal for matrix multiplication. Modern NVIDIA GPUs add <b>Tensor Cores</b> (matrix units) that are many times faster at low precision. Two numbers decide what a GPU can do for AI:</p>
<ul>
<li><b>VRAM capacity (GB):</b> does the model <i>fit</i>?</li>
<li><b>Memory bandwidth (GB/s):</b> how fast can it generate tokens? Compute (TFLOPS) matters most for training and for processing long prompts.</li>
</ul>
<p><b>CUDA</b> is NVIDIA's GPU programming platform, and the main reason NVIDIA dominates: nearly all AI software targets it first. Alternatives: AMD <b>ROCm</b>, Apple <b>Metal/MLX</b>, Intel oneAPI, Vulkan (llama.cpp supports it), and Google <b>TPUs</b> (cloud only).</p>
<h3>Number formats (precision)</h3>
<table>
<tr><th>Format</th><th>Bytes / param</th><th>Use</th></tr>
<tr><td>FP32</td><td>4</td><td>classic training "master weights"; rarely used for inference now</td></tr>
<tr><td>FP16 / <b>BF16</b></td><td>2</td><td>standard training and inference precision (BF16 has FP32's range with less precision)</td></tr>
<tr><td>FP8 / INT8</td><td>1</td><td>fast inference on H100+ GPUs; near-lossless</td></tr>
<tr><td>INT4 / FP4 / NF4 (4-bit)</td><td>0.5 (~0.55–0.6 in practice with scales)</td><td>local inference (GGUF Q4_K_M, AWQ, GPTQ), QLoRA; small quality loss</td></tr>
<tr><td>2–3 bit</td><td>0.25–0.4</td><td>squeezing very large models in; noticeable quality loss</td></tr>
</table>
<p><b>Quantisation</b> means storing weights at lower precision. It shrinks memory and speeds up bandwidth-bound generation. Rule of thumb: <b>a bigger model at 4-bit beats a smaller model at 16-bit</b> for the same VRAM, down to about 4 bits. Common formats: <b>GGUF</b> (llama.cpp, Ollama, LM Studio; runs on CPU+GPU; names like <code>Q4_K_M</code>, <code>Q5_K_M</code>, <code>Q8_0</code>), <b>AWQ/GPTQ</b> (GPU-only; vLLM), <b>MLX</b> (Apple), <b>bitsandbytes</b> (NF4 for QLoRA).</p>

<h3>Formula 1: weights</h3>
<div class="callout key"><b class="t">Weights memory</b><p><code>weights_GB ≈ parameters (billions) × bytes_per_param</code><br>7B at FP16 = 7 × 2 = <b>14 GB</b>; at 8-bit, <b>7 GB</b>; at 4-bit, about <b>4 GB</b> (plus ~10% for quantisation scales and unquantised layers).</p></div>
<table>
<tr><th>Model size</th><th>FP16/BF16</th><th>8-bit</th><th>~4-bit (Q4_K_M)</th><th>Example open models (families)</th></tr>
<tr><td>1B</td><td>2 GB</td><td>1 GB</td><td>~0.7 GB</td><td>Llama 3.2 1B, Gemma small</td></tr>
<tr><td>3–4B</td><td>6–8 GB</td><td>3–4 GB</td><td>~2–2.5 GB</td><td>Llama 3.2 3B, Phi, Qwen small</td></tr>
<tr><td>7–9B</td><td>14–18 GB</td><td>7–9 GB</td><td>~4.5–5.5 GB</td><td>Llama 3.1 8B, Qwen 7B, Mistral 7B, Gemma 9B</td></tr>
<tr><td>12–14B</td><td>24–28 GB</td><td>12–14 GB</td><td>~8–9 GB</td><td>Mistral Nemo 12B, Qwen 14B, Phi medium</td></tr>
<tr><td>27–34B</td><td>54–68 GB</td><td>27–34 GB</td><td>~16–20 GB</td><td>Gemma 27B, Qwen 32B</td></tr>
<tr><td>70B</td><td>140 GB</td><td>70 GB</td><td>~40–43 GB</td><td>Llama 3.x 70B, Qwen 72B</td></tr>
<tr><td>405B</td><td>810 GB</td><td>405 GB</td><td>~230 GB</td><td>Llama 3.1 405B</td></tr>
<tr><td>~670B MoE</td><td>~1.3 TB</td><td>~670 GB</td><td>~380 GB</td><td>DeepSeek V3/R1 (37B active)</td></tr>
</table>
<p><b>Mixture of Experts (MoE)</b>: only some "expert" sub-networks run per token, so an MoE with 670B total and 37B active parameters <i>computes</i> like a 37B model but must <i>store</i> all 670B. VRAM follows total parameters; speed follows active parameters.</p>

<h3>Formula 2: the KV cache (the part people forget)</h3>
<p>While generating, a transformer caches the attention Keys and Values for every previous token, so it doesn't recompute them. The cache grows linearly with context length and with the number of simultaneous users.</p>
<div class="callout key"><b class="t">KV cache memory</b><p><code>KV_bytes = 2 (K and V) × layers × kv_heads × head_dim × bytes_per_value × context_tokens × batch</code></p>
<p><b>Llama 3.1 8B</b> (32 layers, 8 KV heads, head_dim 128, FP16): 2 × 32 × 8 × 128 × 2 = <b>128 KB per token</b>. 8K context is about 1 GB; 32K about 4 GB; 128K about <b>16 GB</b>, more than the 4-bit weights themselves.<br>
<b>Llama 3 70B</b> (80 layers, 8 KV heads): <b>320 KB per token</b>. 8K context is about 2.5 GB; 128K about 40 GB per user.</p></div>
<p>Models use <b>GQA</b> (grouped-query attention: few KV heads shared by many query heads) precisely to shrink this. Servers can also quantise the KV cache to 8-bit, halving it. The model's config file (<code>config.json</code>: <code>num_hidden_layers</code>, <code>num_key_value_heads</code>, <code>head_dim</code> or <code>hidden_size/num_attention_heads</code>) gives you every number in the formula.</p>

<h3>Formula 3: total inference VRAM</h3>
<div class="callout key"><b class="t">Rule of thumb</b><p><code>VRAM ≈ weights + KV cache + ~0.5–2 GB overhead</code> (CUDA context, activations, framework buffers). Leave about 10% headroom.</p></div>

<h3>Formula 4: speed</h3>
<p>Generation has two phases. <b>Prefill</b> processes your whole prompt in parallel; it's <b>compute-bound</b> and shows up as "time to first token". <b>Decode</b> produces one token at a time, and each token reads <i>all</i> weights from memory, so it's <b>memory-bandwidth-bound</b>:</p>
<div class="callout key"><b class="t">Decode speed ceiling</b><p><code>tokens/sec ≲ memory_bandwidth (GB/s) ÷ model_size_in_memory (GB)</code> (for MoE, use the <i>active</i> size). Real speeds reach about 50–80% of this.<br>8B at 4-bit (~5 GB) on an RTX 4090 (~1000 GB/s): about 200 t/s ceiling, ~120–150 real. The same model on dual-channel DDR4 system RAM (~45 GB/s): about 9 t/s ceiling.</p></div>
<p>Serving many users at once (<b>batching</b>) reuses each weight read for many sequences, which is why data-centre throughput is vastly higher than single-user speed. Engines like <b>vLLM</b> (PagedAttention, continuous batching), <b>SGLang</b> and <b>TensorRT-LLM</b> exist for this.</p>

<h3>Formula 5: training and fine-tuning memory</h3>
<table>
<tr><th>Method</th><th>Memory per parameter</th><th>7–8B model</th><th>70B model</th></tr>
<tr><td><b>Full fine-tune</b> (mixed precision + AdamW: 2 B weights + 2 B grads + 4 B FP32 master + 8 B Adam moments)</td><td>~16 bytes + activations</td><td>~120–160 GB (multi-GPU)</td><td>~1.2 TB+ (a cluster)</td></tr>
<tr><td><b>LoRA</b> (freeze the base in BF16, train small adapter matrices)</td><td>~2 bytes + small</td><td>~18–24 GB</td><td>~150+ GB</td></tr>
<tr><td><b>QLoRA</b> (4-bit frozen base + LoRA adapters)</td><td>~0.6 bytes + small</td><td>~8–12 GB</td><td>~45–50 GB</td></tr>
</table>
<p>Training from scratch is a different league. Compute ≈ <code>6 × parameters × training_tokens</code> FLOPs. A 70B model on 15 trillion tokens is about 6 × 7×10¹⁰ × 1.5×10¹³ ≈ 6×10²⁴ FLOPs: millions of GPU-hours on thousands of H100s. That's why only a handful of labs pretrain frontier models, and everyone else fine-tunes or uses APIs.</p>

<h3>The hardware landscape (approximate specs)</h3>
<table>
<tr><th>Class</th><th>Hardware</th><th>Memory</th><th>Bandwidth</th><th>Comfortably runs (4-bit)</th></tr>
<tr><td>Entry laptop GPU</td><td>GTX 1650 Ti, RTX 3050/4050</td><td>4–6 GB</td><td>~190–260 GB/s</td><td>1–4B models; 7–8B with CPU offload</td></tr>
<tr><td>Mid consumer</td><td>RTX 3060 12GB, 4060 Ti 16GB, 4070</td><td>8–16 GB</td><td>~270–500 GB/s</td><td>7–14B</td></tr>
<tr><td>High-end consumer</td><td>RTX 3090 / 4090 (24 GB), 5090 (32 GB)</td><td>24–32 GB</td><td>~0.9–1.8 TB/s</td><td>27–34B; 70B across 2–3 cards</td></tr>
<tr><td>Apple Silicon (unified memory)</td><td>M-series Pro / Max / Ultra</td><td>16–512 GB shared</td><td>~150–800 GB/s</td><td>big models fit (70B+ on 64–128 GB), with slower prefill</td></tr>
<tr><td>Workstation</td><td>RTX 6000 Ada / Blackwell Pro</td><td>48–96 GB</td><td>~1–1.8 TB/s</td><td>70B on one card</td></tr>
<tr><td>Data centre</td><td>NVIDIA A100 (40/80 GB), <b>H100</b> (80 GB), H200 (141 GB), B200 (~180–192 GB); AMD MI300X (192 GB); Google TPU</td><td>80–192 GB per GPU, 8 GPUs per node</td><td>2–8 TB/s</td><td>anything, with enough of them (NVLink/InfiniBand interconnect)</td></tr>
<tr><td>Cloud rental</td><td>RunPod, Lambda, Vast.ai, Modal, AWS/GCP/Azure</td><td>…</td><td>…</td><td>rent H100s by the hour for fine-tuning</td></tr>
</table>
<h3>Worked example: this machine</h3>
<p>GTX 1650 Ti (<b>4 GB VRAM</b>, ~190 GB/s, Turing, no tensor cores), Ryzen 5 4600H, <b>~7 GB RAM</b> with only ~2 GB usually free.</p>
<ul>
<li><b>Fits fully on the GPU:</b> 1–3B models at 4-bit (about 1–2.5 GB weights + 0.5–1 GB KV at 4–8K context). Expect roughly 40–80 tokens/sec.</li>
<li><b>7–8B at Q4 (~4.9 GB):</b> doesn't fit in 4 GB. llama.cpp/Ollama would split layers between the GPU and system RAM, but with ~2 GB of free RAM it would swap. Realistically it's not viable until you close everything else.</li>
<li><b>Training anything beyond toys:</b> no. Rent a cloud GPU (an A100/H100 hour is a few dollars) or use Google Colab.</li>
<li><b>Frontier-quality work:</b> use APIs (<a class="xref" data-old="c30">chapter 30</a>).</li>
</ul>
<details class="ex"><summary>28.1 <span class="levels">think</span> A 32B model at Q4_K_M with a 16K context for one user, with 48 layers, 8 KV heads and head_dim 128. How much VRAM, and will a 24 GB card do?</summary><div><p>Weights: 32 × ~0.6 ≈ 19 GB. KV: 2×48×8×128×2 = 196,608 B ≈ 192 KB/token × 16,384 ≈ 3 GB. Overhead ~1 GB. Total ≈ <b>23 GB</b>. That's tight on 24 GB: drop to 8K context or quantise the KV cache to 8-bit.</p></div></details>
<details class="ex"><summary>28.2 <span class="levels">basic</span> Estimate decode speed for a 70B model at 4-bit (~40 GB) on a Mac with 800 GB/s, and on two RTX 3090s (936 GB/s each, split layer by layer).</summary><div><p>Mac: 800/40 ≈ 20 t/s ceiling (~12–15 real). With a layer split, each token passes through the cards <i>sequentially</i>, so it's roughly 936/40 ≈ 23 t/s ceiling: the second card adds capacity, not speed (tensor parallelism can add speed).</p></div></details>
`;export{t as default};

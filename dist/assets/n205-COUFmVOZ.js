const t=`<p class="goal">How quantisation shrinks models, and how to choose a format. The memory maths is in <a class="xref" data-old="c28">chapter 208</a>.</p>
<p><b>Quantisation</b> maps weights from 16-bit floats to fewer bits. Values are grouped into blocks (e.g. 32 weights), and each block stores small integers plus a scale factor (and sometimes an offset). Smarter schemes spend more bits on the weights that matter most.</p>
<table>
<tr><th>Format</th><th>Runs on</th><th>Notes</th></tr>
<tr><td><b>GGUF</b> (llama.cpp): Q8_0, Q6_K, Q5_K_M, <b>Q4_K_M</b>, IQ3/IQ2</td><td>CPU, GPU, Apple, and mixed CPU+GPU offload</td><td>the local default; Q4_K_M is the usual sweet spot; "imatrix" quantisations keep more quality</td></tr>
<tr><td><b>AWQ</b> / <b>GPTQ</b></td><td>NVIDIA GPUs (vLLM, TGI)</td><td>4-bit weight-only; calibrated with sample data</td></tr>
<tr><td>FP8 (E4M3)</td><td>Hopper/Blackwell GPUs</td><td>near-lossless and fast: the production-server default</td></tr>
<tr><td>bitsandbytes NF4</td><td>NVIDIA</td><td>used for QLoRA training</td></tr>
<tr><td>MLX 4/8-bit</td><td>Apple Silicon</td><td>fast on Macs</td></tr>
<tr><td>KV-cache quantisation (q8/q4)</td><td>most engines</td><td>saves memory on long contexts</td></tr>
</table>
<ul>
<li><b>Quality:</b> 8-bit ≈ lossless; 5–6-bit, minor loss; 4-bit, small but measurable (maths and code suffer first); 3-bit and below, noticeable. Bigger models tolerate quantisation better.</li>
<li><b>Speed:</b> decoding is bandwidth-bound, so fewer bytes per weight means proportionally more tokens per second.</li>
<li>Always evaluate on <i>your</i> task. Perplexity numbers don't tell you about your use case.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>205.1 <span class="levels">basic</span> Run the same 3B model at Q4_K_M and Q8_0 in Ollama or llama.cpp. Compare tokens/sec and the answers on 5 maths questions.</summary><div><p>Q4 is faster and smaller; on easy prompts the answers are similar, while harder maths may differ. Measure on your task rather than assuming.</p></div></details>
</div>
`;export{t as default};

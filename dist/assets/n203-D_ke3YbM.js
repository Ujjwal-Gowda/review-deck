const e=`<p class="goal">How foundation models are trained, at the level of understanding rather than doing.</p>
<ul>
<li><b>Data:</b> trillions of tokens of filtered web text, code, books, papers and synthetic data. Deduplication, quality filtering and the data mix matter enormously; data is the main differentiator between labs.</li>
<li><b>Compute:</b> ≈ <code>6 × parameters × tokens</code> FLOPs. For a 70B model on 15T tokens that's about 6×10²⁴ FLOPs, or millions of GPU-hours (<a class="xref" data-old="c28">chapter 208</a>).</li>
<li><b>Scaling laws:</b> loss falls predictably with more compute, data and parameters. "Chinchilla-optimal" was about 20 tokens per parameter; today's models train far beyond that, so they're cheaper to <i>run</i>.</li>
<li><b>Parallelism</b> across thousands of GPUs: data parallel (FSDP/ZeRO), tensor parallel, and pipeline parallel, connected by fast interconnects.</li>
<li><b>Post-training:</b> SFT, then preference optimisation (RLHF, DPO, constitutional methods), then RL on verifiable tasks (reasoning). This is what turns a base model into a helpful, safe assistant.</li>
<li><b>Evaluation</b> throughout: benchmarks, red-teaming, and safety testing before release.</li>
</ul>
<p>Practically, you'll use or fine-tune pretrained models rather than pretrain. But knowing this explains model behaviour: knowledge cutoffs, why training data quality matters, and why models differ.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>203.1 <span class="levels">think</span> Using 6·N·D, how much compute does training a 1B-parameter model on 20B tokens need, and roughly how long would one H100 (~1e15 FLOP/s effective) take?</summary><div><p>6 × 1e9 × 2e10 = 1.2e20 FLOPs, and 1.2e20 / 1e15 = 1.2e5 s ≈ 33 hours. Small models are trainable; frontier models are about a million times more compute.</p></div></details>
</div>
`;export{e as default};

const t=`<p class="goal">What makes deep networks train well. The ML basics are in <a class="xref" data-old="c27">chapter 193</a>.</p>
<table>
<tr><th>Component</th><th>Common choices</th><th>Why</th></tr>
<tr><td>Activation</td><td>ReLU, GELU, SiLU</td><td>non-linearity; without it, stacked layers collapse into a single linear function</td></tr>
<tr><td>Loss</td><td>cross-entropy (classification, next-token prediction), MSE (regression)</td><td>what "wrong" means</td></tr>
<tr><td>Optimiser</td><td><b>AdamW</b>, SGD with momentum</td><td>per-parameter adaptive steps; weight decay</td></tr>
<tr><td>Learning-rate schedule</td><td>warm-up, then cosine decay</td><td>stable start, fine convergence</td></tr>
<tr><td>Normalisation</td><td>LayerNorm / RMSNorm (transformers), BatchNorm (CNNs)</td><td>keeps activations in a healthy range</td></tr>
<tr><td>Regularisation</td><td>dropout, weight decay, data augmentation, early stopping</td><td>fights overfitting</td></tr>
<tr><td>Residual connections</td><td><code>x + f(x)</code></td><td>lets gradients flow through very deep networks</td></tr>
<tr><td>Initialisation</td><td>Kaiming / Xavier</td><td>avoids vanishing or exploding gradients at the start</td></tr>
</table>
<ul>
<li><b>Batch size</b> trades gradient noise against memory: bigger batches need more VRAM (gradient accumulation fakes large batches on small GPUs).</li>
<li><b>Mixed precision</b> (BF16) halves memory and speeds up training on modern GPUs.</li>
<li><b>Debugging training:</b> first overfit a tiny batch (if it can't, there's a bug); plot training vs validation loss (a widening gap means overfitting); check for NaNs (learning rate too high).</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>197.1 <span class="levels">think</span> Your training loss keeps falling but validation loss rises after epoch 3. What's happening, and what are three remedies?</summary><div><p>Overfitting. Remedies: early stopping at the best validation epoch, more or augmented data, regularisation (dropout, weight decay), or a smaller model.</p></div></details>
</div>
`;export{t as default};

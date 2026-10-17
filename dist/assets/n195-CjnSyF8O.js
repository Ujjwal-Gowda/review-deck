const e=`<p class="goal">The linear algebra behind ML, kept to what you actually use.</p>
<ul>
<li><b>Vector:</b> a list of numbers, meaning a point or a direction in n-dimensional space. An embedding is a vector (<a class="xref" data-old="c31">chapter 209</a>).</li>
<li><b>Dot product:</b> <code>a·b = Σ aᵢbᵢ</code>. Large when the vectors point the same way. <b>Cosine similarity</b> = a·b / (|a||b|).</li>
<li><b>Matrix:</b> a grid of numbers, and also a <i>transformation</i>. Multiplying a vector by a matrix rotates, scales or projects it. A neural-network layer is <code>y = activation(W·x + b)</code>.</li>
<li><b>Matrix multiplication:</b> (m×n)·(n×p) → (m×p), costing about m·n·p multiply-adds. That's why GPUs, which do billions of these in parallel, run AI.</li>
<li><b>Transpose, identity, inverse:</b> basic operations. <b>Rank</b> is the "real" number of dimensions (LoRA exploits low rank: <a class="xref" data-old="n204">chapter 204</a>).</li>
<li><b>Gradient:</b> the vector of partial derivatives, pointing uphill. Training moves the weights against it.</li>
</ul>
<pre data-lang="python"><code class="language-python">import numpy as np
a, b = np.array([1., 2., 3.]), np.array([2., 0., 1.])
a @ b                                   # dot product: 5.0
cos = a @ b / (np.linalg.norm(a) * np.linalg.norm(b))
W = np.random.randn(4, 3); x = np.random.randn(3)
y = np.maximum(0, W @ x)                # one dense layer with ReLU: 3 inputs → 4 outputs</code></pre>
<p>A good resource: 3Blue1Brown's "Essence of linear algebra" video series, for the geometric intuition.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>195.1 <span class="levels">basic</span> With NumPy, compute the cosine similarity between 3 sentence embeddings (use any small embedding model locally) and check that similar sentences score higher.</summary><div><p>Normalise the vectors, then take dot products; related sentences score clearly higher than unrelated ones. That's the geometry behind vector search.</p></div></details>
</div>
`;export{e as default};

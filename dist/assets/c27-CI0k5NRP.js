const t=`<p class="goal">From "rules written by hand" to "rules learned from data".</p>
<h3>The vocabulary</h3>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td><b>AI ⊃ ML ⊃ Deep learning ⊃ Generative AI / LLMs</b></td><td>AI is any system acting intelligently. ML means systems that learn from data. Deep learning means ML with many-layered neural networks. LLMs are deep networks trained on text to predict the next token.</td></tr>
<tr><td><b>Model</b></td><td>A function with adjustable numbers (<b>parameters / weights</b>) mapping inputs to outputs.</td></tr>
<tr><td><b>Training</b></td><td>Adjusting the parameters so outputs match data. Expensive; done once (or rarely).</td></tr>
<tr><td><b>Inference</b></td><td>Using the trained model to make predictions. Done constantly; this is what an API call is.</td></tr>
<tr><td><b>Supervised</b></td><td>Learn from labelled examples (image → "cat"; email → spam or not).</td></tr>
<tr><td><b>Unsupervised / self-supervised</b></td><td>Find structure without labels (clustering), or create labels from the data itself (predict the next word). This is how LLMs pretrain.</td></tr>
<tr><td><b>Reinforcement learning (RL)</b></td><td>Learn from rewards for actions (game playing, RLHF, reasoning models).</td></tr>
<tr><td><b>Classification / regression</b></td><td>Predict a category / predict a number.</td></tr>
<tr><td><b>Features / labels</b></td><td>The inputs / the correct answers.</td></tr>
<tr><td><b>Loss function</b></td><td>A number measuring how wrong the model is (mean squared error, cross-entropy).</td></tr>
<tr><td><b>Gradient descent</b></td><td>Nudge each parameter slightly in the direction that reduces the loss; repeat millions of times.</td></tr>
<tr><td><b>Backpropagation</b></td><td>An efficient way (the chain rule) to compute the gradient for every parameter at once.</td></tr>
<tr><td><b>Learning rate</b></td><td>How big each nudge is. Too big and training diverges; too small and it's slow.</td></tr>
<tr><td><b>Epoch / batch</b></td><td>One pass over the whole dataset / the examples processed per update step.</td></tr>
<tr><td><b>Overfitting / underfitting</b></td><td>Memorising the training data (fails on new data) / too simple to capture the pattern.</td></tr>
<tr><td><b>Train / validation / test split</b></td><td>Learn on one set, tune on another, report final quality on data the model has never seen.</td></tr>
<tr><td><b>Hyperparameters</b></td><td>Settings you choose (learning rate, layer count), as opposed to learned parameters.</td></tr>
<tr><td><b>Tensor</b></td><td>An n-dimensional array of numbers (scalar, then vector, then matrix, and beyond).</td></tr>
</table>
<h3>Learning, in 15 lines</h3>
<p>Fit <code>y = w·x + b</code> to data by gradient descent. Every neural network is this idea scaled up to billions of parameters.</p>
<pre data-lang="python"><code class="language-python">xs = [1, 2, 3, 4, 5]; ys = [3, 5, 7, 9, 11]      # truth: y = 2x + 1
w, b, lr = 0.0, 0.0, 0.01
for step in range(2000):
    dw = db = 0.0
    for x, y in zip(xs, ys):
        err = (w * x + b) - y                     # prediction minus truth
        dw += 2 * err * x / len(xs)               # d(loss)/dw for mean squared error
        db += 2 * err / len(xs)                   # d(loss)/db
    w -= lr * dw                                  # step DOWNHILL
    b -= lr * db
print(round(w, 3), round(b, 3))                  # ≈ 2.0 1.0</code></pre>
<h3>Neural networks</h3>
<p>A <b>neuron</b> computes a weighted sum of its inputs plus a bias, then applies a non-linear <b>activation</b> (ReLU: <code>max(0, x)</code>). Stacking <b>layers</b> of neurons lets networks represent very complex functions. Without the non-linearity, any number of layers collapses into one linear function. Almost all of the compute is <b>matrix multiplication</b>, which is exactly what GPUs are built for.</p>
<table>
<tr><th>Architecture</th><th>Good at</th></tr>
<tr><td>MLP (fully connected)</td><td>tabular data, building blocks</td></tr>
<tr><td>CNN (convolutional)</td><td>images (sliding filters detect edges, then shapes, then objects)</td></tr>
<tr><td>RNN / LSTM</td><td>sequences (the pre-2017 approach to text and speech)</td></tr>
<tr><td><b>Transformer</b></td><td>everything now: text, code, images, audio, video (<a class="xref" data-old="c29">chapter 29</a>)</td></tr>
<tr><td><b>Diffusion</b></td><td>generating images and video by iteratively denoising random noise</td></tr>
</table>
<p><b>Classical ML</b> (not deep learning) still wins on small tabular data and is cheap: linear/logistic regression, decision trees, <b>gradient-boosted trees</b> (XGBoost, LightGBM), k-means, via <code>scikit-learn</code>. Don't reach for an LLM to predict next month's sales from a spreadsheet.</p>
<p><b>Frameworks:</b> <b>PyTorch</b> (dominant for research and most production), JAX (Google; TPUs), TensorFlow/Keras (older production), scikit-learn (classical), and Hugging Face <code>transformers</code> (pretrained models on top of PyTorch).</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>193.1 <span class="levels">basic</span> Extend the 15-line gradient-descent example to fit <code>y = 3x² + 2</code> by adding an x² feature. What learning rate works?</summary><div><p>Use features [x², 1]; the gradients follow the same pattern. With larger x values, a smaller learning rate (~1e-3) is needed or it diverges. That's the learning-rate sensitivity in practice.</p></div></details>
</div>
`;export{t as default};

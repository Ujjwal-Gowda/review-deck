const e=`<p class="goal">What actually happens when a model "answers".</p>
<h3>Tokens</h3>
<p>Models don't see characters or words. They see <b>tokens</b>: chunks from a fixed vocabulary (~32K–260K entries) built by <b>BPE</b> (byte-pair encoding). As a rough guide, 1 token ≈ 4 English characters ≈ ¾ of a word. Code, numbers, and non-Latin scripts (Hindi, emoji) use more tokens per character. Everything is measured in tokens: <b>context window</b> size, <b>price</b>, <b>speed</b>, and <b>rate limits</b>. It's also why models are bad at counting letters: they never see the letters.</p>
<h3>The pipeline</h3>
<ol>
<li><b>Tokenise</b> the text into IDs: <code>"FreshOn app"</code> → <code>[36, 4891, 263, 1057]</code> (illustrative).</li>
<li><b>Embed</b>: each ID becomes a vector of thousands of numbers (its <b>embedding</b>). Similar meanings end up near each other in this space.</li>
<li><b>Transformer layers</b> (32–120 of them): each has <b>self-attention</b>, where every token looks at every earlier token and mixes in relevant information (Query·Key similarity decides how much; Values carry the content), then an <b>MLP</b> that transforms each position. Attention cost grows with context length squared, which is why long contexts are expensive.</li>
<li><b>Output</b>: a probability for every token in the vocabulary as the next one.</li>
<li><b>Sample</b> one token, append it, and repeat (<b>autoregressive</b> generation) until a stop token or the length limit.</li>
</ol>
<table>
<tr><th>Sampling setting</th><th>Effect</th></tr>
<tr><td><b>Temperature</b></td><td>0 is near-deterministic (pick the likeliest token); higher is more random and creative. Use 0–0.3 for extraction and code, 0.7–1 for brainstorming.</td></tr>
<tr><td><b>Top-p / top-k</b></td><td>Only sample from the most likely tokens (the top p probability mass, or the top k tokens).</td></tr>
<tr><td><b>Max tokens</b></td><td>A hard cap on output length (and cost).</td></tr>
<tr><td><b>Stop sequences</b></td><td>Strings that end generation.</td></tr>
</table>
<h3>How a chat model is made</h3>
<ol>
<li><b>Pretraining:</b> next-token prediction on trillions of tokens of web, books and code. The result is a "base model" that continues text but doesn't follow instructions.</li>
<li><b>Supervised fine-tuning (SFT) / instruction tuning:</b> training on example conversations. Now it answers like an assistant.</li>
<li><b>Preference training</b> (<b>RLHF</b>, DPO, Constitutional AI): learning which of two answers people (or principles) prefer. This improves helpfulness, honesty and harmlessness.</li>
<li><b>Reasoning / RL on verifiable tasks:</b> rewarding correct maths and passing code tests teaches models to "think" at length before answering (<b>extended thinking</b> / reasoning models). This spends more tokens at inference time to get better answers (<b>test-time compute</b>).</li>
</ol>
<h3>Key terms</h3>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td><b>Parameters</b></td><td>The learned weights (e.g. 8B). More parameters generally means more knowledge and ability, but more cost.</td></tr>
<tr><td><b>Context window</b></td><td>The maximum tokens the model can see at once (input + output): typically 128K–1M+ now. Models use information in the middle of long contexts less reliably.</td></tr>
<tr><td><b>System prompt</b></td><td>Instructions that set the model's role and rules for a conversation.</td></tr>
<tr><td><b>Hallucination</b></td><td>Fluent but false output. The model predicts plausible text, not verified truth. Mitigate with grounding (RAG), citations and verification.</td></tr>
<tr><td><b>Knowledge cutoff</b></td><td>Training data ends at a date; later events are unknown unless provided (search, RAG).</td></tr>
<tr><td><b>Multimodal</b></td><td>Accepts or produces images, audio, PDFs and video, not just text.</td></tr>
<tr><td><b>Open-weights vs closed</b></td><td>Downloadable weights you can run yourself (Llama, Qwen, Mistral, Gemma, DeepSeek) vs API-only (Claude, GPT, Gemini).</td></tr>
<tr><td><b>Distillation</b></td><td>Training a small model to imitate a large one.</td></tr>
<tr><td><b>Scaling laws</b></td><td>Loss falls predictably as parameters, data and compute grow.</td></tr>
<tr><td><b>Benchmarks</b></td><td>MMLU (knowledge), GPQA (hard science), SWE-bench (real coding tasks), and others. They're useful but gameable; always test on <i>your</i> task.</td></tr>
</table>
<h3>Other generative modalities</h3>
<table>
<tr><th>Modality</th><th>How</th><th>Examples of providers and models</th></tr>
<tr><td>Image generation</td><td>diffusion / flow models, text-conditioned</td><td>Midjourney, OpenAI image models, Google Imagen, Black Forest Labs FLUX (open), Stable Diffusion (open)</td></tr>
<tr><td>Video generation</td><td>diffusion transformers over space and time</td><td>OpenAI Sora, Google Veo, Runway, Kling, Luma (you used one via ElevenLabs)</td></tr>
<tr><td>Speech to text (STT)</td><td>encoder-decoder transformers</td><td>OpenAI Whisper (open), Deepgram, AssemblyAI, ElevenLabs Scribe</td></tr>
<tr><td>Text to speech (TTS) / voice</td><td>neural audio codecs + transformers</td><td>ElevenLabs, OpenAI TTS, Google, Cartesia; open: Kokoro, XTTS</td></tr>
<tr><td>Music</td><td>audio diffusion / transformers</td><td>Suno, Udio, ElevenLabs Music</td></tr>
<tr><td>Embeddings</td><td>encoder models → vectors (<a class="xref" data-old="c31">chapter 31</a>)</td><td>OpenAI, Voyage AI, Cohere, Google; open: BGE, nomic, E5</td></tr>
</table>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>202.1 <span class="levels">think</span> Why might a model confidently give a wrong answer about a FreshOn store policy? Name two changes that reduce this.</summary><div><p>It generates plausible text from training patterns, and has never seen your policy. Fixes: RAG with the actual policy plus an "answer only from the context" instruction and citations; and asking it to say "I don't know" when the context is missing.</p></div></details>
</div>
`;export{e as default};

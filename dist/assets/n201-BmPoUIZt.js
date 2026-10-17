const e=`<p class="goal">How text becomes tokens, and why it affects cost, context and model behaviour.</p>
<p><b>BPE</b> (byte-pair encoding): start from bytes, then repeatedly merge the most frequent adjacent pair into a new token, until the vocabulary reaches its target size (32K–260K). Common words become one token; rare words split into pieces.</p>
<pre data-lang="python"><code class="language-python">import tiktoken                                  # OpenAI's tokenizer (the counts are illustrative for other models)
enc = tiktoken.get_encoding("o200k_base")
for s in ["paneer", "FreshOn", "ಕನ್ನಡ", "   indentation", "1234567"]:
    ids = enc.encode(s); print(repr(s), len(ids), [enc.decode([i]) for i in ids])
# Claude: client.messages.count_tokens(model=…, messages=[…]) gives the exact count for Claude models</code></pre>
<ul>
<li><b>Language cost:</b> English is about 4 characters per token. Hindi, Kannada and other scripts can take several times more tokens for the same meaning, so they cost more and fit less in the context window.</li>
<li><b>Why models struggle with</b> spelling, counting letters, reversing strings and some arithmetic: they see token pieces, not characters or digits.</li>
<li>Whitespace, JSON punctuation and code indentation all consume tokens. Compact formats save money.</li>
<li>Every model family has its own tokenizer, so token counts (and prices) aren't comparable across providers.</li>
<li>Special tokens mark roles and boundaries (system, user, assistant, end of turn); chat templates insert them for you.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>201.1 <span class="levels">basic</span> Count the tokens for the same sentence in English, Hindi and Kannada. What's the cost ratio?</summary><div><p>Non-Latin scripts often need 2–4× the tokens for the same meaning, so they cost more and fit less context. Use it when estimating costs for multilingual features.</p></div></details>
</div>
`;export{e as default};

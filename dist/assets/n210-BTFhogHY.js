const e=`<p class="goal">Splitting documents into retrievable pieces. Chunking quality caps RAG quality.</p>
<table>
<tr><th>Strategy</th><th>How</th><th>Good for</th></tr>
<tr><td>Fixed-size + overlap</td><td>~500–1000 tokens, 10–20% overlap</td><td>quick baseline</td></tr>
<tr><td>Recursive / separator-aware</td><td>split on headings, then paragraphs, then sentences, until each chunk fits</td><td>most prose</td></tr>
<tr><td><b>Structure-aware</b></td><td>follow the document's own units: Markdown sections, HTML headings, one FAQ entry, one function, one table</td><td>docs, code, policies. Usually the best choice.</td></tr>
<tr><td>Semantic</td><td>split where the embedding similarity between neighbouring sentences drops</td><td>long unstructured text</td></tr>
<tr><td>Parent-child / small-to-big</td><td>embed small chunks for precise matching, return the surrounding parent section for context</td><td>precision plus context</td></tr>
</table>
<ul>
<li><b>Carry context into each chunk:</b> prepend the document title and section path ("Refund policy › Perishables › …"). Or use <i>contextual retrieval</i>: an LLM writes a one-line summary of where the chunk sits in the document.</li>
<li><b>Keep metadata</b> with every chunk: source, URL, date, store, permissions, language. It's needed for filtering and citations.</li>
<li><b>Clean first:</b> strip navigation, boilerplate and repeated headers; turn tables into text or Markdown; OCR scanned PDFs.</li>
<li>Test different chunk sizes against your evaluation set (<a class="xref" data-old="n214">chapter 214</a>). There's no universal best.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>210.1 <span class="levels">basic</span> Chunk one long Markdown doc three ways (fixed 500 tokens, by heading, by heading with the heading path prepended) and compare the retrieval hits for 5 questions.</summary><div><p>Heading-based chunks with their heading path usually retrieve best, because each chunk is one self-contained idea and carries its context.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">A checklist that turns this whole guide into a method.</p>
<p>For any new language, answer these questions (write the answers down: that's your personal cheat sheet):</p>
<ol>
<li><b>Execution:</b> compiled, VM or interpreted? How do I build, run, and produce a release?</li>
<li><b>Types:</b> static or dynamic? Inference? Generics? Sum types? How is null handled?</li>
<li><b>Memory:</b> GC, refcount, ownership or manual? Value or reference semantics for assignment and arguments? What's mutable?</li>
<li><b>Errors:</b> exceptions, error values or Result? What's idiomatic?</li>
<li><b>Abstraction:</b> classes, structs + interfaces, traits, or modules? How is visibility controlled?</li>
<li><b>Collections:</b> the standard list, map and set; their Big-O; iteration idioms.</li>
<li><b>Strings:</b> the encoding, indexing rules, and the builder.</li>
<li><b>Concurrency:</b> threads, async, goroutines or actors? Which synchronisation tools?</li>
<li><b>Tooling:</b> package manager, formatter, linter, test runner, debugger, docs site.</li>
<li><b>Idioms:</b> read the official style guide and 500 lines of a well-regarded open-source project.</li>
</ol>
<p>Then write the <b>same five programs</b> you write in every language: FizzBuzz + tests; a word-frequency counter reading a file; a JSON-over-HTTP client; a small concurrent job runner; a tiny REST API with a database. When those five feel natural, you know the language.</p>
<h3>12-week plan (about 1–2 hours a day, no AI for writing code)</h3>
<table>
<tr><th>Weeks</th><th>Focus</th><th>Output</th></tr>
<tr><td>1–2</td><td>Parts I and II in <b>Python</b>, with every exercise done</td><td>the <code>exercises/</code> folder passing; wc and CSV-to-JSON tools</td></tr>
<tr><td>3</td><td><b>C</b> (see <a class="xref" data-old="c10">10</a>, <a class="xref" data-old="c12">12</a>, <a class="xref" data-old="c22">22</a>, <a class="xref" data-old="c23">23</a>, <a class="xref" data-old="c38">38</a>)</td><td>dynamic array + hash map in C, sanitizer-clean</td></tr>
<tr><td>4–5</td><td><b>TypeScript</b> (see <a class="xref" data-old="c35">35</a>+ Handbook)</td><td>typed Node CLI + small API with zod; explain your Remotion types</td></tr>
<tr><td>6–7</td><td><b>Go</b> (see <a class="xref" data-old="c20">20</a>, <a class="xref" data-old="c36">36</a>)</td><td>concurrent URL checker; REST API + SQLite + table tests</td></tr>
<tr><td>8–10</td><td><b>Rust</b> (see <a class="xref" data-old="c18">18</a>, <a class="xref" data-old="c19">19</a>, <a class="xref" data-old="c37">37</a>+ the Book + Rustlings)</td><td>grep clone; CSV/JSON CLI; axum API</td></tr>
<tr><td>11</td><td>Part III review + <b>AI</b> part</td><td>call a model API from Python and Go; run a local model; tiny RAG over your notes</td></tr>
<tr><td>12</td><td>Capstone</td><td>one project using 2 languages (e.g. a Go API + a TS frontend, or a Rust CLI + Python analysis)</td></tr>
</table>
<p>Throughout: re-do old exercises from memory after 1 day, 1 week and 1 month. Use AI only to <i>review</i> finished work.</p>
`;export{e as default};

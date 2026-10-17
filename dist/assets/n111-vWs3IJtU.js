const e=`<p class="goal">Feeding programs random and mutated inputs to find crashes and security bugs automatically.</p>
<p>A <b>coverage-guided fuzzer</b> keeps any input that reaches new code paths and mutates it further. It's how most memory-safety bugs in parsers, image decoders and protocol handlers are found (Google's OSS-Fuzz has found tens of thousands).</p>
<pre data-lang="go"><code class="language-go">func FuzzParseStock(f *testing.F) {
    f.Add("milk,2\\npaneer,1")                         // seed corpus
    f.Fuzz(func(t *testing.T, s string) {
        items, err := ParseStock(s)
        if err != nil { return }                       // errors are fine; panics and invariant breaks are not
        for _, it := range items { if it.Qty &lt; 0 { t.Fatalf("negative qty from %q", s) } }
    })
}
// go test -fuzz=FuzzParseStock -fuzztime=60s   → failing inputs are saved to testdata/fuzz/ as regression tests</code></pre>
<pre data-lang="shell"><code class="language-bash">cargo install cargo-fuzz &amp;&amp; cargo fuzz init &amp;&amp; cargo fuzz run parse_stock    # Rust (libFuzzer)
clang -g -fsanitize=fuzzer,address parse.c -o fuzz &amp;&amp; ./fuzz corpus/         # C: libFuzzer + ASan catch memory bugs
pip install atheris                                                           # Python</code></pre>
<p>Fuzz anything that parses <b>untrusted input</b>: file formats, network protocols, config parsers, deserialisers. Pair it with sanitizers (ASan, UBSan) in C and C++ so silent memory corruption becomes a loud crash.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>111.1 <span class="levels">basic</span> Fuzz the <code>ParseStock</code> function from the Go drills for 60 seconds. Did it find a crash, and what input caused it?</summary><div><p>Run <code>go test -fuzz=FuzzParseStock -fuzztime=60s</code>. Any failing input is saved under <code>testdata/fuzz/</code> and becomes a permanent regression test. Common finds are empty fields, huge numbers that overflow, and odd unicode.</p></div></details>
</div>
`;export{e as default};

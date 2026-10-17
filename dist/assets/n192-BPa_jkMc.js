const e=`<p class="goal">Measuring performance changes accurately, so you don't fool yourself.</p>
<pre data-lang="go"><code class="language-go">func BenchmarkParse(b *testing.B) {
    data := loadFixture()                    // setup outside the timed loop
    b.ReportAllocs(); b.ResetTimer()
    for b.Loop() { sink = Parse(data) }      // Go 1.24+ b.Loop; assign to a package-level sink so the compiler can't remove the call
}
// go test -bench=Parse -count=10 &gt; old.txt; (change code); … &gt; new.txt; benchstat old.txt new.txt</code></pre>
<pre data-lang="shell"><code class="language-bash">hyperfine 'python3 old.py' 'python3 new.py' --warmup 3    # CLI programs, with statistics
cargo bench                                               # criterion.rs: confidence intervals built in</code></pre>
<ul>
<li><b>Micro-benchmarks</b> measure one function in isolation: easy to fool (dead-code elimination, a warm cache, unrealistic inputs). <b>Macro-benchmarks</b> measure the whole system under load: what users actually feel.</li>
<li><b>Noise:</b> repeat runs, report the median and variance, and use statistical comparison (<code>benchstat</code>, criterion). A 3% "win" inside ±5% noise is nothing.</li>
<li><b>Control the environment:</b> the same machine, nothing else running, CPU frequency scaling and thermal throttling in mind. Laptops on battery are unreliable.</li>
<li>Benchmark before and after <i>every</i> optimisation, and keep the benchmarks in CI to catch regressions.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>192.1 <span class="levels">basic</span> Use hyperfine to compare <code>grep -r</code> with <code>rg</code> on a large directory, with warm-up runs. Report the mean and the variation.</summary><div><p><code>hyperfine --warmup 3 'grep -r foo .' 'rg foo'</code> reports mean ± σ and a relative speed. Without warm-up, the first run includes disk cache effects.</p></div></details>
</div>
`;export{e as default};

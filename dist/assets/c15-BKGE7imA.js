const e=`<p class="goal">Organising code across files, and using other people's code safely.</p>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td><b>Module</b></td><td>One file of code with its own namespace (<code>import math</code>).</td></tr>
<tr><td><b>Package</b></td><td>A directory or distribution of modules, published to a registry.</td></tr>
<tr><td><b>Namespace</b></td><td>A container that prevents name clashes (<code>json.loads</code> vs <code>pickle.loads</code>).</td></tr>
<tr><td><b>Package manager / registry</b></td><td>pip + PyPI, npm + npmjs, cargo + crates.io, go modules, apt.</td></tr>
<tr><td><b>Manifest</b></td><td>Declares your dependencies: <code>pyproject.toml</code>, <code>package.json</code>, <code>Cargo.toml</code>, <code>go.mod</code>.</td></tr>
<tr><td><b>Lockfile</b></td><td>Pins the exact resolved version of <i>every</i> transitive dependency, for reproducible installs: <code>package-lock.json</code>, <code>Cargo.lock</code>, <code>uv.lock</code>, <code>go.sum</code>. Commit it for applications.</td></tr>
<tr><td><b>Transitive dependency</b></td><td>A dependency of your dependency. Your Remotion project pulls in about 230 packages from 12 direct ones.</td></tr>
<tr><td><b>Virtual environment</b></td><td>An isolated per-project set of packages (<code>python3 -m venv .venv</code>, <code>uv venv</code>). <code>node_modules</code> is npm's equivalent.</td></tr>
<tr><td><b>SemVer</b></td><td><code>MAJOR.MINOR.PATCH</code>. MAJOR changes break things, MINOR adds features, PATCH fixes bugs. <code>^1.4.2</code> allows &lt;2.0.0; <code>~1.4.2</code> allows &lt;1.5.0.</td></tr>
</table>
<pre data-lang="python"><code class="language-python"># shop/pricing.py
def with_tax(p): return round(p * 1.18)
# shop/main.py
from shop.pricing import with_tax        # import a name
import shop.pricing as pricing           # import the module under an alias
if __name__ == "__main__":               # runs only when executed directly, not when imported
    print(with_tax(100))</code></pre>
<ul>
<li><b>Avoid circular imports</b> (A imports B, and B imports A). They usually signal that a shared piece belongs in a third module.</li>
<li><b>Public API vs internals:</b> expose a small surface and keep helpers private. That lets you change internals without breaking users.</li>
<li><b>Static vs dynamic linking</b> (compiled languages): static copies the library into your binary (one self-contained file; Go's default). Dynamic loads a shared <code>.so</code>/<code>.dll</code> at runtime (smaller binaries, shared security updates, but "DLL hell" when versions mismatch).</li>
</ul>
<div class="callout key"><b class="t">Trade-offs: adding a dependency</b><p><b>Pros:</b> saves time; battle-tested code; someone else maintains it. <b>Cons:</b> supply-chain risk (malicious or hijacked packages); breaking upgrades; bloat; abandonment; licence obligations (MIT and Apache are permissive; GPL has copyleft). <b>Before adding one, check:</b> is it maintained (recent commits, open issues), how popular is it, how many transitive dependencies does it bring, what's the licence, and could you write the 20 lines yourself?</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>39.1 <span class="levels">basic</span> Run <code>npm ls --all | wc -l</code> in your film project. How many transitive packages are there? Pick one and find why it's installed with <code>npm explain</code>.</summary><div><p>Several hundred packages from about 12 direct dependencies. <code>npm explain &lt;pkg&gt;</code> shows the chain of packages that pulled it in. That chain is your supply-chain surface.</p></div></details>
</div>
`;export{e as default};

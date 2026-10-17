const e=`<p class="goal">Trusting the code you didn't write: dependencies, build tools and CI.</p>
<table>
<tr><th>Threat</th><th>Real examples</th><th>Defence</th></tr>
<tr><td>Malicious package / typosquat</td><td>fake packages with names like <code>reqeusts</code> on npm and PyPI</td><td>check names; lockfiles; allow-lists for new dependencies</td></tr>
<tr><td>Compromised maintainer</td><td>event-stream (npm), the xz-utils backdoor (2024)</td><td>pin versions with lockfiles; review dependency updates; limit transitive dependencies</td></tr>
<tr><td>Install scripts</td><td>npm <code>postinstall</code> running arbitrary code</td><td><code>npm ci --ignore-scripts</code> where possible; pnpm's approved-builds list</td></tr>
<tr><td>Compromised CI action</td><td>tj-actions/changed-files (2025)</td><td>pin actions to commit SHAs; minimal token permissions</td></tr>
<tr><td>Known vulnerabilities</td><td>Log4Shell</td><td><code>npm audit</code>, <code>pip-audit</code>, <code>govulncheck</code>, <code>cargo audit</code>, Dependabot/Renovate</td></tr>
</table>
<ul>
<li><b>SBOM</b> (software bill of materials: <code>syft</code>, CycloneDX/SPDX): a list of everything inside an artifact, so when the next Log4Shell hits you can answer "are we affected?" in minutes.</li>
<li><b>Provenance and signing</b> (SLSA levels, Sigstore/cosign, npm provenance): prove where and how an artifact was built.</li>
<li><b>Fewer dependencies</b> is the cheapest defence: do you really need a package to pad a string?</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>168.1 <span class="levels">basic</span> Generate an SBOM for one of your projects with <code>syft</code> and scan it with <code>grype</code>.</summary><div><p><code>syft dir:. -o cyclonedx-json &gt; sbom.json</code>, then <code>grype sbom:sbom.json</code>. It lists every dependency with known vulnerabilities, even transitive ones.</p></div></details>
</div>
`;export{e as default};

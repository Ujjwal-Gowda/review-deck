const e=`<p class="goal">Continuous integration: every change is automatically built and verified, so main is always releasable.</p>
<div class="diagram">push / PR → checkout → install (cached) → format check → lint → typecheck → unit tests → build
          → integration tests (containers) → security scans → build image → ✓ required status check on the PR</div>
<h3>Principles</h3>
<ul>
<li><b>Fast feedback:</b> aim for under 10 minutes. Parallelise jobs, cache dependencies, and run the slow suites only on main or nightly if needed.</li>
<li><b>Fail early, fail cheap:</b> order stages from quickest to slowest.</li>
<li><b>Deterministic:</b> pinned versions and lockfiles (<code>npm ci</code>, not <code>npm install</code>); no dependence on test order or the wall clock.</li>
<li><b>Same commands locally:</b> CI calls <code>make check</code> / <code>npm run ci</code>, so developers can reproduce failures exactly.</li>
<li><b>Required checks + branch protection:</b> nothing merges red.</li>
<li><b>Fix a broken main immediately:</b> it blocks everyone. Revert first, debug second.</li>
<li><b>Flaky tests</b> destroy trust in CI. Quarantine and fix them; never "just re-run until it's green".</li>
</ul>
<p>The mechanics (workflows, matrix, caching) are covered in <a class="xref" data-old="n51">chapter 51</a>. Other CI systems follow the same model: GitLab CI, CircleCI, Buildkite, Jenkins.</p>
<div class="callout seclens"><b class="t">Security lens · CI</b><p>CI has your deploy keys, which makes it a prime target. Pin actions to SHAs, minimise token permissions, and never run untrusted PR code with secrets.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>120.1 <span class="levels">basic</span> Add a CI workflow to one repo that runs lint, typecheck and tests on every PR, and make it a required check.</summary><div><p>Use one job with cached dependencies (<code>actions/setup-node</code> with <code>cache: npm</code>). Then Settings → Rules → require the status check. Open a PR that breaks a test to confirm the merge is blocked.</p></div></details>
</div>
`;export{e as default};

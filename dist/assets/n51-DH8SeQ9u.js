const e=`<p class="goal">Automating builds, tests and deploys on every push, and making those pipelines fast and safe.</p>
<h3>The model</h3>
<div class="diagram">event (push, pull_request, schedule, manual) → workflow (.github/workflows/*.yml)
   → jobs (run in parallel on fresh VMs called runners; use needs: to order them)
      → steps (shell commands, or reusable actions like actions/checkout)</div>
<pre data-lang="yaml"><code class="language-yaml">name: ci
on:
  push: { branches: [main] }
  pull_request:
concurrency: { group: ci-\${{ github.ref }}, cancel-in-progress: true }   # cancel superseded runs
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix: { node: [20, 22] }             # one job per value
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "\${{ matrix.node }}", cache: npm }   # caches ~/.npm between runs
      - run: npm ci
      - run: npm run lint &amp;&amp; npx tsc --noEmit &amp;&amp; npm test
  deploy:
    needs: test                              # only after tests pass
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production                  # can require manual approval
    steps:
      - uses: actions/checkout@v4
      - run: npm ci &amp;&amp; npm run build
      - run: npx netlify deploy --prod --dir dist
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}</code></pre>
<h3>Key features</h3>
<table>
<tr><th>Feature</th><th>Use</th></tr>
<tr><td>Secrets (<code>\${{ secrets.X }}</code>)</td><td>encrypted; masked in logs; <b>not</b> given to PRs from forks</td></tr>
<tr><td>Artifacts (<code>upload-artifact</code>)</td><td>pass build output between jobs; download test reports</td></tr>
<tr><td>Caching</td><td>dependency caches keyed by the lockfile hash: often turns 3-minute installs into 20 seconds</td></tr>
<tr><td>Reusable workflows / composite actions</td><td>share one pipeline across many repos</td></tr>
<tr><td>OIDC (<code>permissions: id-token: write</code>)</td><td>log into AWS/GCP with short-lived tokens instead of stored keys</td></tr>
<tr><td>Self-hosted runners</td><td>your own machine runs jobs (GPU work, private network)</td></tr>
</table>
<h3>Security rules</h3>
<ul>
<li>Pin third-party actions to a full commit SHA (<code>uses: org/action@a1b2c3…</code>): tags can be moved by an attacker.</li>
<li>Set <code>permissions:</code> to the minimum (the default token can write to your repo).</li>
<li>Never run <code>pull_request_target</code> workflows on untrusted PR code with secrets available.</li>
</ul>
<details class="ex"><summary>51.1 <span class="levels">basic</span> Add CI to the drills repo: a matrix over [python, go, rust] that runs each language's tests, with dependency caching.</summary><div><p>Use one job per language (the setup actions differ), or a matrix with <code>include:</code> entries mapping each language to its setup action and test command. Cache <code>~/.cargo</code> and <code>~/go/pkg/mod</code>, keyed by the lockfile hash.</p></div></details>
`;export{e as default};

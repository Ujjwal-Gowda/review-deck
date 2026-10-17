const e=`<p class="goal">GitHub is a collaboration platform built around git: planning, review, automation and security.</p>
<h3>Remotes</h3>
<pre data-lang="shell"><code class="language-bash">git remote -v                         # origin → your GitHub repo
git fetch origin                      # download new commits; changes nothing locally
git pull                              # fetch + integrate (rebase, given pull.rebase=true)
git push -u origin feature/stock      # first push sets the upstream; later just: git push
git remote add upstream https://github.com/org/project.git   # forks: track the original project</code></pre>
<p>Authentication: an SSH key (<code>ssh-keygen -t ed25519</code>, add the <code>.pub</code> file to GitHub) or <code>gh auth login</code>. Passwords don't work for git operations.</p>
<h3>The <code>gh</code> CLI</h3>
<pre data-lang="shell"><code class="language-bash">gh repo create shop --private --source=. --push
gh issue create --title "Negative stock after refund" --label bug
gh pr create --fill                   # PR from the current branch
gh pr checkout 42                     # review someone's PR locally
gh pr checks --watch                  # CI status
gh run view --log-failed              # why did CI fail?</code></pre>
<h3>The repository toolkit</h3>
<table>
<tr><th>Feature</th><th>Use</th></tr>
<tr><td>Issues + labels + milestones</td><td>track bugs and features; <code>Fixes #12</code> in a PR closes the issue on merge</td></tr>
<tr><td>Projects</td><td>kanban/table views over issues</td></tr>
<tr><td>Releases + tags</td><td>versioned downloads with notes (can be auto-generated from PRs)</td></tr>
<tr><td>Branch protection / rulesets</td><td>require PRs, reviews and passing checks before merging to main; block force-pushes</td></tr>
<tr><td>CODEOWNERS</td><td>auto-request reviews from the owners of the touched paths</td></tr>
<tr><td>Actions</td><td>CI/CD automation</td></tr>
<tr><td>Secrets / environments</td><td>encrypted values for Actions; environments add approvals ("production needs a manual OK")</td></tr>
<tr><td>Dependabot</td><td>automatic PRs for vulnerable or outdated dependencies</td></tr>
<tr><td>Code scanning / secret scanning / push protection</td><td>find vulnerabilities; block pushes that contain API keys</td></tr>
<tr><td>Community files</td><td>README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.md, issue and PR templates</td></tr>
</table>
<h3>A first CI workflow</h3>
<pre data-lang="yaml"><code class="language-yaml"># .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with: { go-version: "1.26" }
      - run: go vet ./...
      - run: go test -race ./...</code></pre>
<p>Chapters 50 and 51 (open source and GitHub Actions in depth) are next on the roadmap.</p>
<details class="ex"><summary>47.1 <span class="levels">basic</span> Push your drills repo to a private GitHub repo with the workflow above, adapted to run all five languages' tests. Protect <code>main</code> so it requires the check to pass.</summary><div><p>Use one job per language (setup-python, setup-node, setup-go, dtolnay/rust-toolchain, and plain gcc for C). The drills start failing, which is expected until you solve them. Branch protection lives under Settings → Rules → New ruleset → Require status checks.</p></div></details>
`;export{e as default};

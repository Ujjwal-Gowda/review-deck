const e=`<p class="goal">The daily environment every programmer lives in.</p>
<h3>Shell essentials</h3>
<pre data-lang="shell"><code class="language-bash">pwd; ls -la; cd ~/learn; mkdir -p a/b; cp -r src dst; mv a b; rm file   # rm has NO undo
cat f; less f; head -20 f; tail -f log            # view files; follow a live log
grep -rn "TODO" src/                              # search text (rg/ripgrep is faster)
find . -name "*.py" -mtime -1                     # find files changed in the last day
cmd1 | cmd2                                       # pipe: stdout of 1 → stdin of 2
cmd &gt; out.txt 2&gt;&amp;1                                # stdout and stderr to a file
cmd1 &amp;&amp; cmd2   ;   cmd1 || echo failed            # run on success / on failure
export VAR=value; echo $PATH                      # environment variables
chmod +x script.sh; ./script.sh                   # permissions: r=4 w=2 x=1 (755 = rwxr-xr-x)
ps aux | grep python; kill PID; htop              # processes
man grep; grep --help                             # built-in documentation</code></pre>
<p><b>PATH</b> is the list of directories the shell searches for commands (<code>which python3</code> shows which one wins). <b>Environment variables</b> configure programs without changing code, and are the usual place for secrets (never hard-code them).</p>
<h3>Git: the mental model</h3>
<p>Git stores <b>snapshots</b> (commits) of your whole project. Each commit points to its parent, forming a graph. A <b>branch</b> is just a movable label on a commit; <b>HEAD</b> is "where you are now". There are three areas: <b>working directory</b> → (<code>git add</code>) → <b>staging area</b> → (<code>git commit</code>) → <b>repository</b>.</p>
<pre data-lang="shell"><code class="language-bash">git init; git status; git diff                     # what changed?
git add -p                                         # stage chunk by chunk: review your own change
git commit -m "Fix negative stock on refund"       # message: imperative, explains WHY
git log --oneline --graph
git switch -c feature/x                            # new branch
git merge feature/x      # combine histories (merge commit)
git rebase main          # replay your commits on top of main (linear history; never rebase shared commits)
git push / git pull      # sync with a remote (GitHub)
git stash                # shelve uncommitted work
git restore file         # discard changes to a file (destructive)
git revert &lt;sha&gt;         # new commit that undoes an old one (safe for shared history)
git bisect               # binary-search history for the commit that introduced a bug
git reflog               # safety net: where HEAD has been, which recovers "lost" commits</code></pre>
<p><b>Merge conflicts</b> happen when both sides changed the same lines. Git marks them with <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>/<code>=======</code>/<code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>. You edit the file to the correct result, <code>git add</code> it, and continue. Commit small, focused changes often. Your film project has one commit; commit before every risky change.</p>
<h3>Editor and quality tools</h3>
<ul>
<li><b>Formatter</b> (black/ruff format, prettier, gofmt, rustfmt): ends style debates automatically.</li>
<li><b>Linter</b> (ruff, eslint, clippy, go vet): flags likely bugs and smells.</li>
<li><b>Type checker</b> (mypy/pyright, tsc): catches type errors before running.</li>
<li><b>LSP</b> (language server): go-to-definition, find references and rename across a project. Learn the keyboard shortcuts for these; navigating code quickly is half of reading it.</li>
</ul>
<h3>Reading documentation and unfamiliar code</h3>
<p>For a library: read the <b>quickstart</b>, then the <b>API reference</b> for the functions you use, then the <b>source</b> when the docs are unclear. For an unfamiliar codebase: find the entry point (<code>main</code>, <code>Root.tsx</code>), follow one real request or feature end to end, and read the tests (they're executable documentation).</p>
<div class="callout seclens"><b class="t">Security lens · Shell</b><p>Never paste <code>curl … | sh</code> from untrusted sources without reading it; quote variables (<code>"$f"</code>) to avoid word-splitting injection; keep secrets out of shell history (a leading space with <code>HISTCONTROL=ignorespace</code>, or read them from files).</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>52.1 <span class="levels">basic</span> Write a one-liner that shows the 5 most common words in all the <code>.md</code> files under a folder.</summary><div><p><code>cat **/*.md | tr -cs 'A-Za-z' '\\n' | tr A-Z a-z | sort | uniq -c | sort -rn | head -5</code>, which chains six small tools with pipes.</p></div></details>
</div>
`;export{e as default};

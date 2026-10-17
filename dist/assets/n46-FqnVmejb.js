const e=`<p class="goal">Git is a content-addressed key-value store with a history graph on top. Seeing the internals makes every command make sense.</p>
<h3>Four object types</h3>
<table>
<tr><th>Object</th><th>Stores</th></tr>
<tr><td><b>blob</b></td><td>a file's contents (no name, no permissions)</td></tr>
<tr><td><b>tree</b></td><td>a directory: a list of (mode, name, blob-or-tree SHA)</td></tr>
<tr><td><b>commit</b></td><td>a root tree SHA, parent commit SHA(s), author, committer, message</td></tr>
<tr><td><b>tag</b> (annotated)</td><td>a pointer to an object, plus a tagger, a message and an optional signature</td></tr>
</table>
<div class="diagram">commit 9f2c… ──► tree a1b3… (project root)
   │ parent            ├── blob 5d4e…  README.md
   ▼                   ├── tree 77aa… src/
commit 41be…           │     └── blob 0c9f…  main.go
                       └── blob 5d4e…  COPY.md   ← identical content = the SAME blob (automatic dedup)</div>
<p>Each object's ID is the SHA-1 (moving to SHA-256) of its type, size and content. Change one byte of a file and its blob ID changes, so its tree changes, so the commit changes, and so does every descendant commit. That's why history is tamper-evident, and why rebase has to create new commits.</p>
<h3>Look inside with plumbing commands</h3>
<pre data-lang="shell"><code class="language-bash">git cat-file -t HEAD                 # commit
git cat-file -p HEAD                 # tree …, parent …, author …, message
git cat-file -p 'HEAD^{tree}'        # the root directory listing
git ls-tree -r HEAD | head           # every file → blob SHA
echo 'hello' | git hash-object --stdin   # compute a blob ID (same everywhere, on every machine)
ls .git/objects/ | head              # loose objects, stored zlib-compressed by the first 2 hex digits
git count-objects -vH                # packfiles: delta-compressed bundles of objects</code></pre>
<h3>Refs: human names for SHAs</h3>
<pre data-lang="shell"><code class="language-bash">cat .git/HEAD                        # ref: refs/heads/main
cat .git/refs/heads/main             # 9f2c…  ← a branch IS just this file
git rev-parse origin/main v1.0 HEAD~3   # resolve any name to a SHA</code></pre>
<p>Branches (<code>refs/heads/</code>), remote-tracking branches (<code>refs/remotes/origin/</code>) and tags (<code>refs/tags/</code>) are all refs. <code>HEAD~2</code> means "two parents back"; <code>HEAD^2</code> means "the second parent of a merge".</p>
<h3>Consequences you can now explain</h3>
<ul>
<li>Branching is instant, because it just writes a 41-byte file.</li>
<li>Git never loses committed data easily: objects stay until garbage collection prunes the unreachable ones (after the reflog expires).</li>
<li>Big binary files bloat the repo forever, even after deletion, because old blobs remain in history. Use <b>Git LFS</b> for media, and never commit renders or model weights.</li>
<li>Committed a secret? Deleting it in a new commit doesn't remove the old blob. You need a history rewrite (<code>git filter-repo</code>) <i>and</i> a key rotation.</li>
</ul>
<details class="ex"><summary>46.1 <span class="levels">think</span> Make a commit using only plumbing: <code>hash-object -w</code>, <code>update-index</code>, <code>write-tree</code>, <code>commit-tree</code>, <code>update-ref</code>.</summary><div><pre data-lang="shell"><code class="language-bash">b=$(echo "hi" | git hash-object -w --stdin)
git update-index --add --cacheinfo 100644 "$b" hi.txt
t=$(git write-tree)
c=$(echo "plumbing commit" | git commit-tree "$t" -p HEAD)
git update-ref refs/heads/main "$c"</code></pre><p>That's exactly what <code>git add</code> + <code>git commit</code> do for you.</p></div></details>
`;export{e as default};

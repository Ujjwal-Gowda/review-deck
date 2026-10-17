const e=`<p class="goal">Tracking datasets like code, because a model is only as reproducible as its data.</p>
<pre data-lang="shell"><code class="language-bash">pip install dvc &amp;&amp; dvc init
dvc add data/train.jsonl            # stores a small pointer file in git; the data itself goes to remote storage
dvc remote add -d store s3://freshon-ml/dvc
git add data/train.jsonl.dvc .gitignore &amp;&amp; git commit -m "Training set v3: +400 Kannada complaints"
dvc push                            # upload the data; dvc pull on another machine restores exactly this version</code></pre>
<ul>
<li><b>Lineage:</b> record which raw sources, filters and labelling round produced each dataset version, and which model was trained on it.</li>
<li><b>Datasets are immutable:</b> never edit v3 in place; create v4.</li>
<li><b>Splits are frozen:</b> fixed train, validation and test splits, so scores stay comparable across experiments.</li>
<li><b>Data quality checks</b> (schema, duplicates, label balance, leakage between splits) before every training run.</li>
<li>Alternatives: lakeFS, Hugging Face datasets with revisions, Delta/Iceberg tables with time travel.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>229.1 <span class="levels">basic</span> Put a training JSONL under DVC, make a change, commit both versions, and check out the old one.</summary><div><p><code>dvc add</code>, <code>git commit</code>, edit the file, <code>dvc add</code> again, <code>git commit</code>, then <code>git checkout HEAD~1 data.jsonl.dvc &amp;&amp; dvc checkout</code> restores the old data exactly.</p></div></details>
</div>
`;export{e as default};

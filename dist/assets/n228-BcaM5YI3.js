const e=`<p class="goal">Knowing exactly which model produced which output, and upgrading deliberately.</p>
<ul>
<li><b>Pin model identifiers</b> in config (e.g. a specific <code>claude-sonnet-5</code> snapshot, or a fixed Ollama tag or digest). Floating aliases can change behaviour underneath you.</li>
<li><b>Version the whole "AI config" together:</b> model ID, prompt template, sampling settings, tool schemas, and retrieval settings. A change to any of them is a new version, recorded with each output (log <code>prompt_version=14</code>).</li>
<li><b>Model registry</b> for models you train or fine-tune (MLflow, Weights &amp; Biases, Hugging Face Hub): artifacts, metrics, the lineage back to data and code, and stage labels (staging, production).</li>
<li><b>Upgrades:</b> run the eval suite on the new model (<a class="xref" data-old="n227">chapter 227</a>), compare quality, cost and latency, roll out gradually, and keep a rollback path. Watch providers' deprecation schedules.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>228.1 <span class="levels">think</span> Your provider announces that the model version you use will be retired in 3 months. Write the migration checklist.</summary><div><p>Run the evals on candidate models, compare quality, cost and latency, adjust prompts, shadow-test on live traffic, roll out gradually by percentage, monitor, and update the pinned model ID in config.</p></div></details>
</div>
`;export{e as default};

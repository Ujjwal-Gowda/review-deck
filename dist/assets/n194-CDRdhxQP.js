const t=`<p class="goal">The statistics you need to read data, evaluate models, and avoid being fooled by noise.</p>
<table>
<tr><th>Concept</th><th>Meaning</th></tr>
<tr><td>Mean / median / mode</td><td>average / middle value (robust to outliers: use it for latency and income) / most common value</td></tr>
<tr><td>Variance / standard deviation</td><td>how spread out the values are (SD is in the same units as the data)</td></tr>
<tr><td>Percentiles</td><td>p95 = 95% of values are below it (<a class="xref" data-old="n155">chapter 155</a>)</td></tr>
<tr><td>Distribution</td><td>normal (bell curve), long-tailed (latency, sales per product), uniform, Poisson (arrivals per minute)</td></tr>
<tr><td>Sampling / sample bias</td><td>conclusions only generalise if the sample represents the population</td></tr>
<tr><td>Correlation ≠ causation</td><td>ice-cream sales and drownings both rise in summer</td></tr>
<tr><td>Confidence interval</td><td>a range that plausibly contains the true value</td></tr>
<tr><td>p-value / significance</td><td>how surprising the data would be if there were no real effect. It isn't the probability that the effect is real.</td></tr>
<tr><td>A/B test</td><td>randomised comparison; decide the sample size up front and don't stop early when it looks good</td></tr>
<tr><td>Base rate</td><td>a 99%-accurate fraud detector still flags mostly innocent orders if fraud is rare</td></tr>
</table>
<pre data-lang="python"><code class="language-python">import numpy as np, pandas as pd
lat = np.array(latencies_ms)
print(lat.mean(), np.median(lat), np.percentile(lat, [95, 99]), lat.std())
df = pd.read_csv("orders.csv", parse_dates=["created_at"])
df.groupby(df.created_at.dt.hour)["total"].describe()      # count, mean, std, min, quartiles, max per hour</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>194.1 <span class="levels">basic</span> Load a CSV of any real data (your expenses, say) with pandas and report the mean, median, p90 and std of one column. Why do the mean and median differ?</summary><div><p>Skewed data (a few large values) pulls the mean above the median. Report the median and percentiles for skewed quantities like prices, latency or incomes.</p></div></details>
</div>
`;export{t as default};

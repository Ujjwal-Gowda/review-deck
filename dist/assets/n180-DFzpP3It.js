const e=`<p class="goal">Back-of-the-envelope estimates that tell you whether a design is even in the right ballpark.</p>
<h3>Numbers to remember</h3>
<table>
<tr><th>Fact</th><th>Value</th></tr>
<tr><td>Seconds per day</td><td>~86,400 ≈ 10⁵</td></tr>
<tr><td>1M requests/day</td><td>≈ 12/s average; peak ≈ 3–10× that</td></tr>
<tr><td>One Postgres on a good VM</td><td>thousands to tens of thousands of simple queries per second</td></tr>
<tr><td>One app server (Go/Node, simple API)</td><td>thousands of requests per second</td></tr>
<tr><td>Redis</td><td>~100K operations per second per core</td></tr>
<tr><td>RAM / SSD / network round trip in a region / cross-continent</td><td>100 ns / 100 µs / 0.5 ms / 150 ms</td></tr>
</table>
<h3>Worked example: FreshOn at 10× scale</h3>
<pre data-lang="plaintext"><code class="language-plaintext">50 stores × 2,000 orders/day = 100K orders/day  → ~1.2 orders/s average, ~12/s peak   (tiny for a database)
reads: 50 page views per order                   → 5M/day ≈ 60/s avg, 600/s peak      (cache the catalogue)
rider pings: 500 riders × 1 every 5 s             = 100 writes/s continuous            (the real hot path)
storage: 100K orders × 2 KB × 365                 ≈ 73 GB/year                          (one Postgres, easily)
location history: 100/s × 50 B × 86,400 × 365     ≈ 160 GB/year                         (time-series table or TTL)</code></pre>
<p>Conclusion: a single well-indexed Postgres, a cache, and a separate path for location updates. No sharding, no Kafka. Estimation stops you from over-engineering far more often than from under-engineering.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>180.1 <span class="levels">basic</span> Estimate the storage and QPS for storing every POS line item for 50 stores over 5 years.</summary><div><p>For example 2,000 bills/day × 8 lines × 50 stores = 800K rows/day, about 1.5 billion rows in 5 years. At ~150 bytes that's roughly 220 GB plus indexes. Partition by month; still one Postgres, with archiving.</p></div></details>
</div>
`;export{e as default};

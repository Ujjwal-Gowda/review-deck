const e=`<p class="goal">The features that make Python code lazy, composable and elegant: iterators, generators, itertools and decorators.</p>
<h3>The iteration protocol</h3>
<p>A <code>for</code> loop calls <code>iter(obj)</code> to get an iterator, then calls <code>next()</code> on it until <code>StopIteration</code>. Anything that implements <code>__iter__</code> works in a for loop, in comprehensions, and with <code>sum</code>, <code>zip</code> and friends.</p>
<h3>Generators: functions that pause</h3>
<pre data-lang="python"><code class="language-python">def read_orders(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            if line.strip():
                yield parse(line)              # pause here and hand one item out; resume on the next next()

def paid(orders):
    return (o for o in orders if o.status == "paid")   # generator expression

total = sum(o.total for o in paid(read_orders("orders.log")))   # a pipeline over a 10 GB file with constant memory</code></pre>
<div class="diagram">list:       build all 10 million items in memory, then use them
generator:  produce one → use it → produce the next …   (lazy; nothing happens until someone iterates)</div>
<h3>itertools essentials</h3>
<pre data-lang="python"><code class="language-python">from itertools import islice, chain, groupby, batched, pairwise, product, accumulate, count
list(islice(read_orders(p), 10))                 # the first 10 without reading everything
chain(store_a_orders, store_b_orders)            # iterate several iterables as one
for day, items in groupby(sorted_orders, key=lambda o: o.day): ...   # input must be sorted by the key
for chunk in batched(skus, 100): bulk_update(chunk)                  # 3.12+: groups of 100
list(pairwise([1, 4, 9]))                        # [(1,4), (4,9)]: consecutive pairs
list(accumulate([3, 1, 4]))                      # [3, 4, 8]: running totals</code></pre>
<h3>Decorators: wrapping functions</h3>
<pre data-lang="python"><code class="language-python">import functools, time
def timed(fn):
    @functools.wraps(fn)                          # keep the original name and docstring
    def wrapper(*args, **kwargs):
        t = time.perf_counter()
        try: return fn(*args, **kwargs)
        finally: print(f"{fn.__name__} took {time.perf_counter() - t:.3f}s")
    return wrapper

def retry(times=3):                               # a decorator WITH arguments = a function returning a decorator
    def deco(fn):
        @functools.wraps(fn)
        def wrapper(*a, **kw):
            for i in range(times):
                try: return fn(*a, **kw)
                except ConnectionError:
                    if i == times - 1: raise
                    time.sleep(2 ** i)
        return wrapper
    return deco

@timed
@retry(times=5)
def fetch_prices(): ...                           # same as: fetch_prices = timed(retry(times=5)(fetch_prices))

@functools.cache                                  # memoisation, built in
def shipping_zone(pincode: str) -&gt; str: ...</code></pre>
<h3>In practice</h3>
<p>Generators for streaming large files and paginated APIs; <code>itertools</code> instead of hand-written index loops; decorators for cross-cutting concerns (timing, retries, caching, auth checks in web frameworks like <code>@app.get</code>).</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Write a generator <code>paginate(fetch_page)</code> that keeps calling <code>fetch_page(cursor)</code> and yields items until the cursor is None. Then take the first 25 items with <code>islice</code>, and check that only the needed pages were fetched.</summary><div><p>Use <code>cursor = None; while True: items, cursor = fetch_page(cursor); yield from items; if cursor is None: return</code>. With pages of 10, <code>islice(..., 25)</code> fetches just 3 pages, because generators are lazy.</p></div></details>
</div>
`;export{e as default};

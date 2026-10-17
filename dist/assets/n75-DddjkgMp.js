const e=`<p class="goal">Loading server data in the UI: caching, loading and error states, and keeping data fresh.</p>
<p>Hand-rolled <code>useEffect</code> + <code>fetch</code> gets the hard parts wrong: race conditions (a slow old response overwrites a newer one), no caching, no retries, no deduplication, and no refetch when the tab regains focus. Use a server-state library:</p>
<pre data-lang="typescript"><code class="language-typescript">const qc = new QueryClient();                                // wrap the app in &lt;QueryClientProvider client={qc}&gt;
function Orders({ status }: { status: string }) {
  const q = useQuery({
    queryKey: ["orders", status],                            // the cache key: it changes → refetch
    queryFn: ({ signal }) =&gt; fetch(\`/api/orders?status=\${status}\`, { signal }).then(r =&gt; {
      if (!r.ok) throw new Error(\`HTTP \${r.status}\`); return r.json() as Promise&lt;Order[]&gt;;
    }),
    staleTime: 30_000,                                        // fresh for 30 s: no refetch storms
  });
  if (q.isPending) return &lt;Skeleton /&gt;;
  if (q.isError) return &lt;ErrorBox error={q.error} retry={q.refetch} /&gt;;
  return &lt;OrderList orders={q.data} /&gt;;
}
const m = useMutation({
  mutationFn: (o: NewOrder) =&gt; api.post("/orders", o),
  onSuccess: () =&gt; qc.invalidateQueries({ queryKey: ["orders"] }),   // refetch the affected lists
});</code></pre>
<h3>Patterns</h3>
<ul>
<li><b>Every request has 3 UI states:</b> loading (skeletons beat spinners), error (with retry), and empty ("No orders yet").</li>
<li><b>Optimistic updates:</b> update the UI immediately, and roll back if the server fails. Great for toggles and likes; risky for payments.</li>
<li><b>Pagination:</b> cursor-based with <code>useInfiniteQuery</code>.</li>
<li><b>Real-time:</b> WebSocket or SSE events that invalidate or patch the cache (<a class="xref" data-old="n87">chapter 87</a>).</li>
<li><b>Avoid waterfalls:</b> fetch independent data in parallel, and start fetching in route loaders rather than after the component mounts.</li>
</ul>
<div class="callout seclens"><b class="t">Security lens · Data fetching</b><p>Don't store access tokens in localStorage; prefer HttpOnly cookies. Never cache private API responses in a shared cache or service worker.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>75.1 <span class="levels">think</span> Why does <code>useEffect(() =&gt; { fetch(url).then(r =&gt; r.json()).then(setData) }, [url])</code> show wrong data when the URL changes quickly?</summary><div><p>It's a race: an older, slower response can arrive after a newer one and overwrite it. Fix it with an AbortController in the cleanup, or an "ignore stale results" flag, or use TanStack Query, which keys results by URL.</p></div></details>
</div>
`;export{e as default};

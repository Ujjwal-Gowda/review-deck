const e=`<p class="goal">Go's signature feature: cheap goroutines, channels for communication, and context for cancellation. With the patterns you'll actually use.</p>
<h3>1. The M:N Runtime Scheduler: Why Goroutines Are Not Just "Lightweight Threads"</h3>
<p>Calling goroutines "lightweight threads" obscures how Go actually achieves high concurrency. The Go runtime implements an <b>$M:N$ multiplexer</b> that schedules $G$ goroutines across $M$ kernel threads on $P$ logical processors:</p>

<div class="diagram">  ┌──────────────────────── Go Runtime M:N Scheduler ────────────────────────┐
  │                                                                           │
  │   [G: Goroutines]                [P: Logical Processors]      [M: OS Threads]
  │   - 2 KB starting stack          - GOMAXPROCS count           - Kernel threads
  │   - Dynamically resizable        - Owns Local Run Queue (LRQ) - Scheduled by OS
  │                                                                           │
  │   ┌───┐ ┌───┐ ┌───┐              ┌───────────────────────┐    ┌─────────┐ │
  │   │ G │ │ G │ │ G │ ───────────► │ P0 (LRQ: G1, G2, G3)  │ ──►│ M0 (CPU)│ │
  │   └───┘ └───┘ └───┘              └───────────────────────┘    └─────────┘ │
  │                                                                           │
  │   Work Stealing: If P0's queue empties, it steals half the goroutines from P1!   │
  │   Syscall Handoff: If M0 blocks in a syscall (read/write), P0 detaches to M1!     │
  └───────────────────────────────────────────────────────────────────────────┘</div>

<ul>
  <li><b>Initial Cost:</b> Goroutines start with a tiny 2 KB contiguous stack (vs 1–8 MB for a native OS thread). Stacks grow and shrink dynamically on the heap as needed.</li>
  <li><b>Cooperative vs Preemptive:</b> Since Go 1.14, the runtime uses non-cooperative signal-based preemption (via OS signals), preventing tight loops without function calls from starving a thread.</li>
  <li><b>Work Stealing:</b> If an OS thread starves its local run queue (LRQ), it steals half the runnable goroutines from another processor's queue, preventing load imbalance.</li>
</ul>

<h3>2. The Go Memory Model: Happens-Before Guarantees</h3>
<p>Modern multi-core CPUs execute out-of-order and maintain private L1/L2 caches. <b>Without synchronization, Core 1 may not see memory writes made by Core 2.</b> The Go Memory Model defines exact <i>happens-before</i> guarantees:</p>
<ul>
  <li><b>Channel Send &amp; Receive:</b> A send on a channel happens before the corresponding receive from that channel completes.</li>
  <li><b>Channel Close:</b> A channel close happens before a receive that returns the zero value and <code>false</code> completes.</li>
  <li><b>Sync Primitives:</b> An unlock of a <code>sync.Mutex</code> happens before any subsequent lock of that mutex returns.</li>
  <li><b>Goroutine Creation:</b> The <code>go</code> statement that creates a new goroutine happens before the execution of that goroutine begins.</li>
</ul>

<h3>Goroutines</h3>
<pre data-lang="go"><code class="language-go">go sendReceipt(order)              // runs concurrently; costs ~2 KB of stack, so you can start thousands
// main returning ends the program, including running goroutines: wait for them explicitly</code></pre>
<h3>WaitGroup and errgroup: start N, wait for all</h3>
<pre data-lang="go"><code class="language-go">var wg sync.WaitGroup
results := make([]int, len(urls))
for i, u := range urls {
    wg.Add(1)
    go func() {                    // Go 1.22+: i and u are per-iteration copies (safe to capture)
        defer wg.Done()
        results[i] = check(u)      // each goroutine writes its OWN index: no lock needed
    }()
}
wg.Wait()

g, ctx := errgroup.WithContext(ctx)   // golang.org/x/sync/errgroup: returns the first error, cancels the rest
g.SetLimit(10)                        // at most 10 at once
for _, u := range urls { g.Go(func() error { return fetch(ctx, u) }) }
if err := g.Wait(); err != nil { … }</code></pre>
<h3>Channels</h3>
<pre data-lang="go"><code class="language-go">jobs := make(chan Order)              // unbuffered: send waits for a receiver (a synchronisation point)
done := make(chan Result, 100)        // buffered: send waits only when the buffer is full
go func() { for _, o := range orders { jobs &lt;- o }; close(jobs) }()   // the SENDER closes
for o := range jobs { … }                                            // the receiver loops until closed
v, ok := &lt;-ch                                                        // ok == false once closed and drained</code></pre>
<h3>A worker pool</h3>
<pre data-lang="go"><code class="language-go">func process(ctx context.Context, orders []Order, workers int) []Result {
    jobs, out := make(chan Order), make(chan Result)
    var wg sync.WaitGroup
    for range workers {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for o := range jobs { out &lt;- handle(ctx, o) }
        }()
    }
    go func() {
        defer close(jobs)
        for _, o := range orders {
            select {
            case jobs &lt;- o:
            case &lt;-ctx.Done(): return                  // stop feeding if cancelled
            }
        }
    }()
    go func() { wg.Wait(); close(out) }()             // close out once all workers finish
    var res []Result
    for r := range out { res = append(res, r) }
    return res
}</code></pre>
<h3>select and context</h3>
<pre data-lang="go"><code class="language-go">ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)   // pass ctx as the first argument everywhere
defer cancel()
select {
case res := &lt;-resultCh: use(res)
case &lt;-ctx.Done(): return ctx.Err()                  // context.DeadlineExceeded or context.Canceled
case &lt;-time.After(time.Second): log.Println("slow…") // a timeout branch
}</code></pre>
<h3>Mutex for shared state</h3>
<pre data-lang="go"><code class="language-go">type Stock struct { mu sync.Mutex; qty map[string]int }
func (s *Stock) Reserve(sku string, n int) bool {
    s.mu.Lock(); defer s.mu.Unlock()
    if s.qty[sku] &lt; n { return false }
    s.qty[sku] -= n; return true
}</code></pre>
<p>"Share memory by communicating" (channels) for pipelines and hand-offs; a mutex for protecting a simple shared structure. Always run tests with <code>-race</code>. Leaks happen when a goroutine blocks forever on a channel nobody reads, so make sure every goroutine has a way to finish (context or close).</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Build the concurrent URL checker: read URLs from a file, check them with a pool of 10 workers, a 3-second per-request timeout, and Ctrl-C cancelling everything cleanly. Run it with <code>-race</code>.</summary><div><p>Use <code>signal.NotifyContext</code> for Ctrl-C, <code>http.NewRequestWithContext(ctx…)</code> with <code>context.WithTimeout</code> per request, and the worker pool above. On cancel, workers see <code>ctx.Done()</code> and requests abort; the result channel closes after <code>wg.Wait()</code>.</p></div></details>
</div>
`;export{e as default};

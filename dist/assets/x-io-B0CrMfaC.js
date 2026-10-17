const e=`<p class="goal">How programs wait for disks and networks. This is the idea underneath every server, event loop and async runtime.</p>
<h3>The problem</h3>
<p>A network read might take 100 ms: millions of CPU cycles spent waiting. A server with 10,000 mostly idle connections has to wait on all of them efficiently.</p>
<table>
<tr><th>Model</th><th>How</th><th>Used by</th><th>Trade-off</th></tr>
<tr><td><b>Blocking, a thread per connection</b></td><td><code>read()</code> sleeps the thread until data arrives</td><td>classic Apache, JDBC, simple Python servers</td><td>simple code; each thread costs memory (~1–8 MB stack) and context switches, so it tops out at thousands of connections</td></tr>
<tr><td><b>Non-blocking + readiness notification</b></td><td>set sockets non-blocking; ask the kernel "which ones are ready?" with <code>select</code>/<code>poll</code> → <b>epoll</b> (Linux) / kqueue (BSD, macOS)</td><td>nginx, Node (libuv), Redis, Python asyncio, Rust tokio</td><td>one thread can handle 100K+ connections; code needs callbacks or async/await</td></tr>
<tr><td><b>Completion-based</b></td><td>submit operations and get notified when they're <i>done</i>: <b>io_uring</b> (Linux), IOCP (Windows)</td><td>newer databases, high-performance runtimes</td><td>fewer system calls; newer and more complex</td></tr>
<tr><td><b>Green threads over async I/O</b></td><td>the runtime parks a lightweight thread on I/O and uses epoll underneath</td><td>Go goroutines, Java virtual threads</td><td>blocking-style code with event-loop efficiency</td></tr>
</table>
<div class="diagram">event loop (Node / asyncio / tokio), simplified:
loop:
   ready = epoll_wait(all_sockets, timeout = next_timer)
   for each ready socket → run the callback / resume the coroutine waiting on it
   run expired timers, then microtasks
   (any CPU-heavy callback here blocks EVERY other connection)</div>
<pre data-lang="shell"><code class="language-bash">strace -f -e trace=epoll_wait,read,write -p $(pgrep -f "node server") 2&gt;&amp;1 | head   # watch an event loop work</code></pre>
<p>This is why Go code can simply "block", why Node must never do sync I/O in a request handler (<a class="xref" data-old="n81">Node.js</a>), and why async Python needs async libraries throughout (<a class="xref" data-old="c20">Concurrency</a>).</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">think</span> Your Python Flask API (sync, 4 workers) stalls when a downstream API is slow. Explain why using the I/O models, and give two fixes.</summary><div><p>Each worker blocks for the whole slow call, so 4 slow requests occupy every worker and new requests queue up. Fixes: more threads or processes (costly), an async framework (FastAPI with an async HTTP client), timeouts plus a circuit breaker, or offloading the slow work to a queue.</p></div></details>
</div>
`;export{e as default};

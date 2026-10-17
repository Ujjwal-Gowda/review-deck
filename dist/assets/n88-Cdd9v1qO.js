const e=`<p class="goal">Server-Sent Events: the simplest way to push updates from server to browser.</p>
<pre data-lang="typescript"><code class="language-typescript">// server (Hono / any framework): keep the response open and write "data:" lines
app.get("/events", c =&gt; streamSSE(c, async stream =&gt; {
  for await (const ev of orderEvents(c.req.query("store"))) {
    await stream.writeSSE({ id: String(ev.seq), event: "order", data: JSON.stringify(ev) });
  }
}));
// client: reconnection and Last-Event-ID resume are BUILT IN
const es = new EventSource("/events?store=hsr");
es.addEventListener("order", e =&gt; update(JSON.parse(e.data)));</code></pre>
<table>
<tr><th></th><th>SSE</th><th>WebSocket</th></tr>
<tr><td>Direction</td><td>server → client only</td><td>both ways</td></tr>
<tr><td>Protocol</td><td>plain HTTP (works through proxies and HTTP/2)</td><td>its own protocol after the upgrade</td></tr>
<tr><td>Reconnect + resume</td><td>automatic (<code>Last-Event-ID</code>)</td><td>you write it</td></tr>
<tr><td>Data</td><td>text (UTF-8)</td><td>text or binary</td></tr>
<tr><td>Use for</td><td>notifications, dashboards, live status, <b>LLM token streaming</b> (most AI APIs stream via SSE)</td><td>chat, collaboration, games</td></tr>
</table>
<p>Watch out for proxies that buffer responses (disable buffering with <code>X-Accel-Buffering: no</code> in nginx) and for the browser's limit of 6 connections per domain over HTTP/1.1 (HTTP/2 removes it).</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>88.1 <span class="levels">basic</span> Stream the numbers 1–10, one per second, to the browser with SSE, and show them live in a page.</summary><div><p>Server: set <code>Content-Type: text/event-stream</code> and write <code>data: N\\n\\n</code> each second. Client: <code>new EventSource("/events").onmessage = e =&gt; …</code>.</p></div></details>
</div>
`;export{e as default};

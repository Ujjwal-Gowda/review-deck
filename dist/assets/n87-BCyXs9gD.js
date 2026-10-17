const e=`<p class="goal">Two-way, real-time connections, like live order status on FreshOn's TV wall.</p>
<pre data-lang="typescript"><code class="language-typescript">// server (Node, the 'ws' library)
const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
wss.on("connection", (ws, req) =&gt; {
  const user = authFromCookie(req.headers.cookie);          // authenticate the UPGRADE request
  if (!user) return ws.close(4401, "unauthorised");
  ws.on("message", raw =&gt; { const msg = Schema.parse(JSON.parse(String(raw))); /* … */ });
  const t = setInterval(() =&gt; ws.ping(), 30_000);           // heartbeat: detect dead connections
  ws.on("close", () =&gt; clearInterval(t));
});
// client
function connect() {
  const ws = new WebSocket(\`wss://\${location.host}/ws\`);
  ws.onmessage = e =&gt; handle(JSON.parse(e.data));
  ws.onclose = () =&gt; setTimeout(connect, backoffWithJitter());   // ALWAYS reconnect
}</code></pre>
<h3>How it works</h3>
<p>The connection starts as HTTP with <code>Upgrade: websocket</code>; the server answers <code>101 Switching Protocols</code>, and from then on it's a full-duplex framed message channel over the same TCP connection.</p>
<h3>Scaling problems</h3>
<ul>
<li><b>Stateful connections:</b> user A is connected to server 1, but the event happens on server 2. Fix: a <b>pub/sub backbone</b> (Redis pub/sub, NATS) that every server subscribes to, then forwards to its local sockets.</li>
<li>Load balancers need sticky sessions or a WebSocket-aware config, and long idle timeouts.</li>
<li>Reconnects lose messages. Send a sequence number and replay missed events, or refetch state on reconnect.</li>
<li>Each connection holds memory and a file descriptor, so raise <code>ulimit -n</code>.</li>
</ul>
<p>Alternatives: <b>SSE</b> when only the server pushes (<a class="xref" data-old="n88">chapter 88</a>); managed services (Pusher, Ably, Supabase Realtime); Socket.IO (adds rooms and fallbacks, but isn't plain WebSocket).</p>
<div class="callout seclens"><b class="t">Security lens · WebSockets</b><p>Authenticate the upgrade request and check the <code>Origin</code> header (cross-site WebSocket hijacking); authorise each subscribed channel; validate every incoming message.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>87.1 <span class="levels">basic</span> Build a tiny WebSocket echo server in Node plus a client that reconnects with backoff when you kill the server.</summary><div><p>Use <code>ws</code> on the server. On the client, the <code>onclose</code> handler calls <code>setTimeout(connect, Math.min(30000, 500*2**attempt) * (0.5+Math.random()))</code>, resetting the attempt count on open.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">Redis: an in-memory data-structure server used for caching, counters, rate limits, queues and real-time features.</p>
<pre data-lang="shell"><code class="language-bash">SET session:abc '{"uid":7}' EX 86400      # string with a TTL (expiry in seconds)
GET session:abc
INCR views:product:42                       # atomic counter
HSET cart:7 milk 2 paneer 1                 # hash: a small object
HGETALL cart:7
LPUSH jobs '{"id":1}'   /   BRPOP jobs 0    # list as a simple queue (blocking pop)
SADD online:hsr rider:9                     # set: unique members
ZADD leaderboard 1520 rider:9               # sorted set: rankings, time-ordered items
ZREVRANGE leaderboard 0 9 WITHSCORES        # top 10
XADD orders * id 42 status paid             # stream: an append-only log with consumer groups
PUBLISH order-events '{"id":42}'            # pub/sub (fire-and-forget)
EXPIRE key 60; TTL key; SCAN 0 MATCH cart:* COUNT 100   # never KEYS * in production</code></pre>
<h3>Common patterns</h3>
<table>
<tr><th>Pattern</th><th>How</th></tr>
<tr><td>Cache-aside</td><td><code>GET</code>; on a miss, load from the DB, then <code>SET … EX 300</code></td></tr>
<tr><td>Rate limit</td><td><code>INCR ratelimit:{ip}:{minute}</code> + <code>EXPIRE 60</code>; reject when above N</td></tr>
<tr><td>Distributed lock</td><td><code>SET lock:x token NX PX 10000</code>; release only if the token matches (a Lua script)</td></tr>
<tr><td>Sessions</td><td>a key per session with a TTL</td></tr>
<tr><td>Job queues</td><td>BullMQ / Sidekiq on top of lists and streams (<a class="xref" data-old="n91">chapter 91</a>)</td></tr>
</table>
<p><b>Mental model:</b> single-threaded command execution, so every command is atomic (use <code>MULTI</code> or Lua for multi-step atomicity). Everything lives in RAM: set <code>maxmemory</code> plus an eviction policy (<code>allkeys-lru</code> for caches). Persistence (RDB snapshots / AOF log) exists, but treat Redis as a cache or coordination layer, not as the only copy of important data. Open-source forks: Valkey, KeyDB, Dragonfly.</p>
<div class="callout seclens"><b class="t">Security lens · Redis</b><p>Redis has no authentication by default and has been mass-exploited when exposed. Bind to private interfaces, require a password or ACLs, and disable dangerous commands.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>102.1 <span class="levels">basic</span> Implement a fixed-window rate limiter (10 requests per minute per IP) with Redis INCR and EXPIRE, and test it with a loop of curl calls.</summary><div><p><code>n = INCR rl:{ip}:{minute}; if n == 1: EXPIRE key 60; if n &gt; 10: return 429</code>. Consider a Lua script so INCR and EXPIRE happen atomically.</p></div></details>
</div>
`;export{e as default};

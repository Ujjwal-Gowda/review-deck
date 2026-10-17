const e=`<p class="goal">Node.js Internals in Depth: The 6 Event Loop Phases, libuv Thread Pool, Microtask Queues, Streams with Backpressure, and Production Express Architecture.</p>

<h3>The Real Architecture of Node.js: V8 + libuv</h3>
<p>A common misconception is that Node.js is "single-threaded". In reality, only your JavaScript application code executes on a single main thread (inside Google's <b>V8</b> engine). Underneath V8 sits <b>libuv</b>: a high-performance C library that manages asynchronous non-blocking I/O across operating systems.</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 The Node.js Runtime Layers                             │
│                                                                                        │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                        JavaScript Code (Your Application)                    │     │
│   └──────────────────────────────────────┬───────────────────────────────────────┘     │
│                                          │ Bytecode Execution                          │
│                                          ▼                                             │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                        V8 Engine (Single Threaded)                           │     │
│   │   • Call Stack (Function execution frames)                                   │     │
│   │   • Memory Heap (Object allocations, Generational Garbage Collection)        │     │
│   └──────────────────────────────────────┬───────────────────────────────────────┘     │
│                                          │ C++ Bindings                                │
│                                          ▼                                             │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                             libuv (Multi-Threaded)                           │     │
│   │                                                                              │     │
│   │   ┌──────────────────────────────────────┐  ┌─────────────────────────────┐  │     │
│   │   │     Kernel Event Demultiplexer       │  │    libuv Worker Pool        │  │     │
│   │   │     (Linux epoll / macOS kqueue)     │  │    (Default 4 Threads)      │  │     │
│   │   │   ★ Handles: TCP/UDP Network Sockets │  │   ★ Handles: File I/O, DNS, │  │     │
│   │   │     Zero worker threads used!        │  │     Crypto (\`pbkdf2\`), zlib │  │     │
│   │   └──────────────────────────────────────┘  └─────────────────────────────┘  │     │
│   └──────────────────────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: The 6 Phases of the Event Loop</h3>
<p>The event loop does not just process callbacks in a random FIFO list. It cycles through <b>6 distinct phases</b> in strict order:</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              The 6 Event Loop Phases                                   │
│                                                                                        │
│   ┌───────────────┐     ┌───────────────┐     ┌───────────────┐                        │
│   │  1. Timers    │────►│  2. Pending   │────►│  3. Idle /    │                        │
│   │ setTimeout,   │     │  Callbacks    │     │  Prepare      │                        │
│   │ setInterval   │     │ (System errors│     │ (Internal)    │                        │
│   └───────────────┘     └───────────────┘     └───────┬───────┘                        │
│                                                       │                                │
│                                                       ▼                                │
│   ┌───────────────┐     ┌───────────────┐     ┌───────────────┐                        │
│   │  6. Close     │◄────│  5. Check     │◄────│  4. Poll      │                        │
│   │  Callbacks    │     │ setImmediate  │     │ (Network I/O, │                        │
│   │ socket.close  │     │ callbacks     │     │ new events)   │                        │
│   └───────┬───────┘     └───────────────┘     └───────────────┘                        │
│           │                                                                            │
│           └────────────────────── Cycle Repeats ────────────────────────┘              │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h4>The Microtask Priority Rule:</h4>
<p>Between <i>every single phase</i> (and after every callback within a phase), Node drains the <b>Microtask Queues</b> before moving to the next phase:</p>
<ol>
  <li><code>process.nextTick()</code> Queue: Executed <b>first</b> with highest priority. Recursive <code>nextTick()</code> calls will starve the entire event loop and freeze all network I/O!</li>
  <li><b>Promise Microtask Queue</b>: Executed immediately after <code>nextTick</code> (resolved promises, <code>queueMicrotask()</code>).</li>
</ol>

<h3>Part 2: Streams &amp; The Backpressure Problem</h3>
<p>Reading a 2 GB video or database export into memory with <code>fs.readFile()</code> will trigger a fatal Out-Of-Memory (OOM) crash. Node streams solve this by processing data in chunks. But what happens if the source reads at 500 MB/s from an NVMe SSD, while the network client is downloading over 3G at 100 KB/s?</p>
<p>Without flow control, unconsumed chunks accumulate in RAM, consuming gigabytes until the process dies. This is <b>Backpressure</b>.</p>

<pre data-lang="typescript"><code class="language-typescript">import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

// ❌ DANGEROUS: Naive manual piping without error cleanup
// const read = createReadStream("huge.csv");
// read.pipe(res); // If client disconnects halfway, file descriptor leaks!

// ✅ THE PRODUCTION STANDARD: stream/promises pipeline
export async function streamCompressedExport(inputFile: string, outputFile: string) {
  try {
    await pipeline(
      createReadStream(inputFile, { highWaterMark: 64 * 1024 }), // 64 KB chunk size
      createGzip(),
      createWriteStream(outputFile)
    );
    console.log("Stream completed cleanly with constant 64KB RAM usage!");
  } catch (err) {
    console.error("Stream failed. pipeline automatically destroyed all open file handles!", err);
    throw err;
  }
}</code></pre>

<h3>Part 3: Production Express / Fastify Architecture</h3>
<p>A production Node backend enforces strict separation of concerns, clean middleware pipelines, and deterministic signal handling:</p>

<pre data-lang="typescript"><code class="language-typescript">import express, { Request, Response, NextFunction } from "express";
import http from "node:http";
import { pool } from "./db";

const app = express();
app.use(express.json({ limit: "1mb" })); // Prevent JSON payload Denial-of-Service attacks

// Keep-Alive timeout must exceed load balancer (Nginx/AWS ALB) timeouts
const server = http.createServer(app);
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

// Centralized Asynchronous Error Boundary Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    type: "https://api.example.com/errors/" + (err.code || "INTERNAL_ERROR"),
    title: err.message || "An unexpected error occurred",
    status,
    instance: req.originalUrl,
  });
});

// Deterministic Graceful Shutdown on SIGTERM (Kubernetes / Docker)
async function gracefulShutdown(signal: string) {
  console.log(\`Received \${signal}. Draining connections...\`);
  
  // 1. Stop accepting new HTTP requests
  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      // 2. Drain database connection pools
      await pool.end();
      console.log("Database connection pool terminated.");
      process.exit(0);
    } catch (err) {
      console.error("Error during teardown", err);
      process.exit(1);
    }
  });

  // 3. Force kill if connections hang longer than 15 seconds
  setTimeout(() => {
    console.error("Forced kill: shutdown timed out after 15s.");
    process.exit(1);
  }, 15000).unref();
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));</code></pre>

<details class="ex">
  <summary><b>Drill: Why does synchronous crypto or JSON parsing freeze all concurrent users?</b> (Click to expand)</summary>
  <p><b>Scenario:</b> An endpoint executes: <code>const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');</code> which takes 400ms of CPU time.</p>
  <p><b>Question:</b> What happens to the 500 other concurrent users browsing the site during those 400ms?</p>
  <div class="callout warn">
    <p><b>Answer: Total server freeze!</b></p>
    <p>Because V8 JavaScript execution is strictly single-threaded, synchronous CPU-bound operations occupy the main thread completely. The event loop cannot tick, cannot accept new TCP handshakes, cannot read incoming packets, and cannot send responses. Every single user experiences a 400ms latency spike.</p>
    <p><b>The Fix:</b> Use the asynchronous version <code>crypto.pbkdf2()</code> (which offloads calculation to libuv's background thread pool) or dispatch heavy CPU tasks to <code>worker_threads</code>.</p>
  </div>
</details>
`;export{e as default};

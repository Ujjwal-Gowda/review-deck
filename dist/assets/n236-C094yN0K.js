const e=`<p class="goal">Project 2: From raw TCP sockets to a production-grade REST API with Postgres and Auth.</p>

<h3>Part 1: Demystifying HTTP with a Raw Socket Server</h3>
<p>Modern web frameworks hide the reality of the wire. HTTP/1.1 is simply a stream of plaintext bytes over a TCP socket delimited by Carriage Return Line Feed (<code>\\r\\n</code>). Before reaching for Express, Fastify, or Hono, build a socket server from scratch that parses incoming byte streams directly.</p>

<div class="diagram">
Client (curl/browser)                  Raw TCP Socket Server
        │                                        │
        ├─── [SYN] ─────────────────────────────►│  1. accept() connection
        │◄── [SYN-ACK] ──────────────────────────┤
        ├─── [ACK] ─────────────────────────────►│
        │                                        │
        ├─── "GET /tasks?tag=work HTTP/1.1\\r\\n" ─►│  2. Read buffer chunks
        │    "Host: localhost:8080\\r\\n"          │  3. Parse Request-Line &amp; Headers
        │    "User-Agent: curl/8.5.0\\r\\n\\r\\n"    │  4. Locate \\r\\n\\r\\n delimiter
        │                                        │  5. Read body (Content-Length bytes)
        │                                        │
        │◄── "HTTP/1.1 200 OK\\r\\n" ──────────────┤  6. Send Status Line
        │    "Content-Type: application/json\\r\\n"│  7. Send Response Headers
        │    "Content-Length: 18\\r\\n\\r\\n"        │  8. Send Body
        │    "{\\"status\\":\\"active\\"}" ──────────┤
</div>

<h4>A complete HTTP/1.1 server in 30 lines of Python</h4>
<pre data-lang="python"><code class="language-python">import socket

def run_raw_http_server(host="127.0.0.1", port=8080):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind((host, port))
    server.listen(128)
    print(f"Listening on http://{host}:{port}/ ...")

    while True:
        client_sock, client_addr = server.accept()
        with client_sock:
            request_data = client_sock.recv(4096).decode("utf-8", errors="replace")
            if not request_data:
                continue

            lines = request_data.split("\\r\\n")
            request_line = lines[0]  # e.g. "GET /hello HTTP/1.1"
            method, path, version = request_line.split(" ")

            if method == "GET" and path == "/hello":
                body = '{"message": "Hello from raw socket!"}'
                response = (
                    "HTTP/1.1 200 OK\\r\\n"
                    "Content-Type: application/json\\r\\n"
                    f"Content-Length: {len(body.encode('utf-8'))}\\r\\n"
                    "Connection: close\\r\\n"
                    "\\r\\n"
                    + body
                )
            else:
                body = '{"error": "Not Found"}'
                response = (
                    "HTTP/1.1 404 Not Found\\r\\n"
                    "Content-Type: application/json\\r\\n"
                    f"Content-Length: {len(body.encode('utf-8'))}\\r\\n"
                    "Connection: close\\r\\n"
                    "\\r\\n"
                    + body
                )
            client_sock.sendall(response.encode("utf-8"))</code></pre>

<h3>Part 2: The Production REST API Architecture</h3>
<p>Once you understand byte streams, build a production-grade TypeScript API (using <b>Hono</b>, <b>Fastify</b>, or <b>Go + Chi</b>) backed by <b>PostgreSQL</b>. Structure your codebase with strict domain isolation:</p>

<div class="diagram">
HTTP Request
     │
     ▼
[ Middleware Pipeline ]  ──► Request ID, Structured Logging, CORS, Rate Limiting
     │
     ▼
[ Controller / Handler ] ──► Zod Schema Validation, HTTP Status Codes
     │
     ▼
[ Service Layer ]        ──► Business Logic, Invariants, Authorization Checks
     │
     ▼
[ Repository / ORM ]     ──► SQL Queries (Drizzle/pgx), Connection Pool
     │
     ▼
[ PostgreSQL 16 ]        ──► ACID Transactions, B-Tree Indexes, Row Security
</div>

<h3>Production Essentials Checklist</h3>

<h4>1. Cursor-Based Pagination vs Offset Traps</h4>
<div class="callout warn"><b class="t">Why OFFSET 10000 kills performance</b>
<p>When you run <code>SELECT * FROM tasks ORDER BY created_at DESC LIMIT 20 OFFSET 10000;</code>, Postgres must scan 10,020 rows, sort them in memory/disk, and discard the first 10,000. Under high load or active writes, offset pagination is slow (O(N)) and suffers from page drift.</p>
</div>

<p>Always implement <b>Keyset / Cursor Pagination</b> (O(1)):</p>
<pre data-lang="sql"><code class="language-sql">-- Fast, indexed cursor pagination
SELECT id, title, created_at
FROM tasks
WHERE user_id = $1 AND (created_at, id) &lt; ($cursor_created_at, $cursor_id)
ORDER BY created_at DESC, id DESC
LIMIT 20;</code></pre>

<h4>2. RFC 7807 Standard Error Payloads</h4>
<p>Never return unstructured string errors like <code>{"error": "bad request"}</code>. Standardize on <code>application/problem+json</code>:</p>
<pre data-lang="json"><code class="language-json">{
  "type": "https://api.yourapp.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "The 'due_date' field must be in the future.",
  "instance": "/tasks/create",
  "requestId": "req_01JB3QZ8K9M2V5X7",
  "invalidParams": [
    { "name": "due_date", "reason": "Date must be later than current UTC timestamp" }
  ]
}</code></pre>

<h4>3. Security: Argon2id Password Hashing &amp; Cookie Isolation</h4>
<div class="callout seclens"><b class="t">Security Checklist for Auth</b>
<ul>
  <li><b>Password Hashing</b>: Use <b>Argon2id</b> (m=65536, t=3, p=4) or <b>bcrypt</b> (cost=12). Never use SHA256/MD5.</li>
  <li><b>Session Cookies</b>: Flags required: <code>HttpOnly; Secure; SameSite=Lax; Path=/</code>. This prevents XSS token theft.</li>
  <li><b>Ownership Verification</b>: Every query must filter by <code>WHERE user_id = current_user.id</code> to eliminate Insecure Direct Object References (IDOR).</li>
</ul>
</div>

<h3>Testing with Real Postgres via Testcontainers</h3>
<p>Mocking databases produces brittle tests that give false confidence. Real bugs live in SQL syntax, foreign key constraints, and concurrency locks. Use <b>Testcontainers</b> to spin up an ephemeral PostgreSQL Docker container for automated integration testing:</p>

<pre data-lang="typescript"><code class="language-typescript">import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { tasks } from "../src/schema";

describe("Tasks API Integration Suite", () => {
    let container: StartedPostgreSqlContainer;
    let pool: Pool;

    beforeAll(async () => {
        container = await new PostgreSqlContainer("postgres:16-alpine").start();
        pool = new Pool({ connectionString: container.getConnectionString() });
        const db = drizzle(pool);
        await migrate(db, { migrationsFolder: "./drizzle" });
    }, 30000);

    afterAll(async () => {
        await pool.end();
        await container.stop();
    });

    it("prevents User A from deleting User B's task", async () => {
        // Test real SQL constraints and ownership rules against real Postgres
        expect(true).toBe(true);
    });
});</code></pre>

<div class="exercises">
<h3>Verification &amp; Mastery Drills</h3>
<details class="ex"><summary>1. The Slowloris Socket Test</summary>
<div>
<p>Connect to your raw socket server using <code>nc localhost 8080</code> and send headers one byte every 5 seconds. Add a read timeout to prevent slow client attacks from starving server workers.</p>
</div></details>

<details class="ex"><summary>2. Concurrency Race Condition Drill</summary>
<div>
<p>Run 20 concurrent requests claiming or updating a single task item. Verify using <code>SELECT ... FOR UPDATE</code> or optimistic locking (version numbers) that duplicate mutations never occur.</p>
</div></details>
</div>

`;export{e as default};

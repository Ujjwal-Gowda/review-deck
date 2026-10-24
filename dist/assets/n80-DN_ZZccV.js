const e=`<p class="goal">HTTP Servers from Scratch: From Raw TCP Sockets to Production Middlewares, Request Contexts, Slowloris Defenses, and Graceful Teardown.</p>

<h3>The Naked Truth of Web Servers</h3>
<p>Every web framework on earth—Express, Fastify, Go <code>net/http</code>, FastAPI, Axum—is merely a structured abstraction over a fundamental loop: listening on a TCP socket, parsing ASCII byte streams terminated by <code>\\r\\n\\r\\n</code>, dispatching a handler, and writing byte frames back down the wire.</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               The Anatomy of an HTTP Request                           │
│                                                                                        │
│   Client TCP Connection                                                                │
│   ──► Handshake (SYN, SYN-ACK, ACK)                                                    │
│   ──► Byte Stream over Socket:                                                         │
│                                                                                        │
│   GET /api/v1/orders/42 HTTP/1.1\\r\\n          ◄── Request Line                         │
│   Host: api.example.com\\r\\n                   ◄── Headers                              │
│   Authorization: Bearer token123\\r\\n          ◄── Headers                              │
│   Accept: application/json\\r\\n                ◄── Headers                              │
│   \\r\\n                                        ◄── Empty Line (\\r\\n\\r\\n marks END of headers)
│   {"optional":"body"}                         ◄── Request Payload (Content-Length bytes)
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: The Raw TCP Socket HTTP Server in Python</h3>
<p>Building an HTTP server directly over raw sockets demystifies every framework:</p>

<pre data-lang="python"><code class="language-python">import socket

def run_socket_server(port=8080):
    # AF_INET = IPv4, SOCK_STREAM = TCP
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # SO_REUSEADDR allows immediate reboot without "address already in use" errors
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(("0.0.0.0", port))
    server.listen(128)
    print(f"TCP socket listening on port {port}...")

    while True:
        client_sock, addr = server.accept()
        try:
            raw_data = client_sock.recv(4096).decode("utf-8")
            if not raw_data:
                continue

            # Parse Request Line
            lines = raw_data.split("\\r\\n")
            request_line = lines[0]
            method, path, proto = request_line.split(" ")

            if method == "GET" and path == "/health":
                body = '{"status":"healthy"}'
                response = (
                    f"HTTP/1.1 200 OK\\r\\n"
                    f"Content-Type: application/json\\r\\n"
                    f"Content-Length: {len(body)}\\r\\n"
                    f"Connection: close\\r\\n\\r\\n"
                    f"{body}"
                )
            else:
                body = '{"error":"NOT_FOUND"}'
                response = (
                    f"HTTP/1.1 404 Not Found\\r\\n"
                    f"Content-Type: application/json\\r\\n"
                    f"Content-Length: {len(body)}\\r\\n"
                    f"Connection: close\\r\\n\\r\\n"
                    f"{body}"
                )

            client_sock.sendall(response.encode("utf-8"))
        finally:
            client_sock.close()</code></pre>

<h3>Part 2: The Production Go \`net/http\` Implementation</h3>
<p>In production, you do not write raw socket parsers because of edge cases: connection pooling, HTTP/2 multiplexing, chunked transfers, and denial-of-service attacks. Go's standard <code>net/http</code> provides an enterprise-ready server out of the box:</p>

<pre data-lang="go"><code class="language-go">package main

import (
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
)

type Order struct {
	ID    int    \`json:"id"\`
	Total int    \`json:"totalCents"\`
	Paid  bool   \`json:"paid"\`
}

func main() {
	mux := http.NewServeMux()
	
	// Go 1.22+ Native Pattern Routing (Method + Path Variables)
	mux.HandleFunc("GET /api/orders/{id}", getOrderHandler)
	mux.HandleFunc("POST /api/orders", createOrderHandler)

	// Wrap mux with Middleware Onion
	handler := requestIDMiddleware(loggingMiddleware(mux))

	// [WARN] PRODUCTION MANDATORY: Explicit Timeout Hardening
	// Prevents Slowloris attacks from exhausting server sockets!
	server := &http.Server{
		Addr:              ":8080",
		Handler:           handler,
		ReadHeaderTimeout: 3 * time.Second,  // Time allowed to read HTTP headers
		ReadTimeout:       10 * time.Second, // Total request read time
		WriteTimeout:      15 * time.Second, // Response write timeout
		IdleTimeout:       60 * time.Second, // Keep-alive idle socket reuse
		MaxHeaderBytes:    1 << 20,          // 1 MB header limit
	}

	// 1. Run server in background goroutine
	go func() {
		slog.Info("Server listening on :8080")
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("Server crashed", "error", err)
			os.Exit(1)
		}
	}()

	// 2. Listen for POSIX termination signals (Ctrl+C, SIGTERM)
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	<-ctx.Done()

	slog.Info("Shutdown signal received. Finishing in-flight requests...")

	// 3. Graceful teardown with 10-second deadline
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		slog.Error("Forced shutdown", "error", err)
	}
	slog.Info("Server exited cleanly.")
}

func getOrderHandler(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		writeJSONError(w, http.StatusBadRequest, "INVALID_ID", "Order ID must be an integer")
		return
	}

	// Always pass r.Context() to database calls!
	// If the user cancels the request or closes their tab, the database query is aborted!
	order := Order{ID: id, Total: 4500, Paid: true}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(order)
}

func writeJSONError(w http.ResponseWriter, status int, code, msg string) {
	w.Header().Set("Content-Type", "application/problem+json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]any{
		"status":  status,
		"code":    code,
		"message": msg,
	})
}

// Middleware Onion Pattern
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		slog.Info("HTTP request", "method", r.Method, "path", r.URL.Path, "duration", time.Since(start))
	})
}

func requestIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		reqID := r.Header.Get("X-Request-ID")
		if reqID == "" {
			reqID = "req-" + strconv.FormatInt(time.Now().UnixNano(), 36)
		}
		w.Header().Set("X-Request-ID", reqID)
		next.ServeHTTP(w, r)
	})
}

func createOrderHandler(w http.ResponseWriter, r *http.Request) {
	// Request handling
}</code></pre>

<h3>Part 3: The Slowloris Denial-of-Service Attack</h3>
<div class="callout warn"><b class="t">Why default http.ListenAndServe() is vulnerable to 1 single laptop</b>
<p>In a <b>Slowloris attack</b>, an attacker opens 1,000 TCP connections to your server and sends incomplete headers agonizingly slowly (e.g. 1 byte every 10 seconds):</p>
<pre data-lang="plaintext"><code class="language-plaintext">X-Custom-Header: a... (sleep 10s)
b... (sleep 10s)</code></pre>
<p>If your server does not set an explicit <code>ReadHeaderTimeout</code>, each open socket holds a server thread/goroutine alive waiting forever. Within 30 seconds, all server file descriptors and worker pools are consumed, completely locking out legitimate users!</p>
</div>

<details class="ex">
  <summary><b>Drill: Why pass \`r.Context()\` to all downstream DB queries?</b> (Click to expand)</summary>
  <p><b>Question:</b> A user requests a heavy report that takes 8 seconds to query in PostgreSQL. 1 second in, the user closes their browser tab. What happens if you do NOT pass <code>r.Context()</code> to the database query?</p>
  <div class="callout key">
    <p><b>Answer: Wasted database CPU & connection locks!</b></p>
    <p>If you use <code>context.Background()</code> instead of <code>r.Context()</code>, the database has no idea the client disconnected. PostgreSQL continues running the expensive 8-second sequential scan to completion, wasting CPU and holding table locks for a response that will be discarded into a broken TCP pipe!</p>
    <p>Passing <code>r.Context()</code> notifies PostgreSQL the moment the socket closes, cancelling the query instantly.</p>
  </div>
</details>
`;export{e as default};

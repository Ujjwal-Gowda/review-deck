const e=`<p class="goal">Go projects in practice: modules, layout, testing (unit, table, benchmark, fuzz) and the built-in tooling.</p>
<h3>Modules and layout</h3>
<pre data-lang="shell"><code class="language-bash">go mod init github.com/ujjwal/shop     # creates go.mod (the module path = the import prefix)
go get github.com/jackc/pgx/v5         # adds the dependency + go.sum checksums
go mod tidy                            # removes unused deps, adds missing ones</code></pre>
<pre data-lang="plaintext"><code class="language-plaintext">shop/
  go.mod  go.sum
  cmd/shop/main.go          package main: wiring, flags, startup
  internal/orders/          package orders: domain logic (internal/ = importable only within this module)
    orders.go  orders_test.go
  internal/postgres/        adapters</code></pre>
<h3>Testing</h3>
<pre data-lang="go"><code class="language-go">// orders_test.go: same package, so unexported names are accessible
func TestTotal(t *testing.T) {
    tests := []struct {
        name  string
        items []Item
        want  int
    }{
        {"empty", nil, 0},
        {"one", []Item{{Qty: 2, PricePaise: 6000}}, 12000},
        {"many", []Item{{Qty: 1, PricePaise: 100}, {Qty: 3, PricePaise: 200}}, 700},
    }
    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            if got := Total(tc.items); got != tc.want {
                t.Errorf("Total() = %d, want %d", got, tc.want)
            }
        })
    }
}
func BenchmarkTotal(b *testing.B) { items := makeItems(1000); for b.Loop() { Total(items) } }
func FuzzParseQty(f *testing.F) { f.Add("3"); f.Fuzz(func(t *testing.T, s string) { ParseQty(s) }) }</code></pre>
<pre data-lang="shell"><code class="language-bash">go test ./...                  # everything
go test ./internal/orders -run TestTotal/many -v
go test -race -cover ./...     # data races + coverage
go test -bench . -benchmem     # benchmarks
go test -fuzz FuzzParseQty -fuzztime 30s</code></pre>
<h3>Tooling</h3>
<table>
<tr><th>Command</th><th>Does</th></tr>
<tr><td><code>gofmt -w .</code> / <code>goimports</code></td><td>format (non-negotiable in Go culture) / also fix imports</td></tr>
<tr><td><code>go vet ./...</code>, <code>staticcheck</code>, <code>golangci-lint</code></td><td>find likely bugs</td></tr>
<tr><td><code>go build -o bin/shop ./cmd/shop</code></td><td>one static binary; cross-compile with <code>GOOS=linux GOARCH=arm64</code></td></tr>
<tr><td><code>go run ./cmd/shop</code></td><td>compile and run</td></tr>
<tr><td><code>go doc</code>, pkg.go.dev</td><td>documentation from comments</td></tr>
<tr><td><code>go tool pprof</code></td><td>CPU and memory profiling (<a class="xref" data-old="n186">Profiling</a>)</td></tr>
<tr><td><code>dlv debug</code></td><td>the Delve debugger</td></tr>
</table>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Create a module with <code>internal/wordfreq</code> (a library) and <code>cmd/wf</code> (the CLI), with table tests, a benchmark and a fuzz test. Cross-compile a Windows .exe from Linux.</summary><div><p><code>GOOS=windows GOARCH=amd64 go build -o wf.exe ./cmd/wf</code>. Because Go binaries are static by default (no cgo), the .exe runs on Windows with nothing else installed.</p></div></details>
</div>
`;export{e as default};

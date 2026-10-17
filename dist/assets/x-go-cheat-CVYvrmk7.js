const n=`<p class="goal">Go on one screen.</p>
<div class="cheat">
<div><h4>Program &amp; variables</h4><pre data-lang="go"><code class="language-go">package main
import ("fmt"; "os")
func main() { fmt.Println("hi", os.Args) }
var n int              // zero value 0
x := 42                // declare + infer (inside funcs)
const Pi = 3.14
a, b = b, a
var s string = "héllo"; len(s) // BYTES</code></pre></div>
<div><h4>Types</h4><pre data-lang="go"><code class="language-go">int int64 uint8 float64 bool string rune byte
[]int  map[string]int  [4]int  *T  chan T  func(int) int
struct{}  interface{ M() }  any
float64(n) int(f) string(rune(65))  // "A"
strconv.Itoa(n) strconv.Atoi(s) strconv.ParseFloat(s, 64)</code></pre></div>
<div><h4>Control flow</h4><pre data-lang="go"><code class="language-go">if v, err := f(); err != nil { … } else { … }
switch x { case 1, 2: … default: … }   // no fallthrough
switch { case n &lt; 0: … case n == 0: … }
for i := 0; i &lt; n; i++ {}
for i := range 10 {}            // Go 1.22+
for cond {}  for {}             // while / forever
for i, v := range xs {}  for k, v := range m {}
defer f.Close()                 // runs at function return</code></pre></div>
<div><h4>Slices</h4><pre data-lang="go"><code class="language-go">xs := []int{3, 1, 2}
xs = append(xs, 4, 5)
ys := make([]int, 0, 100)       // len 0, cap 100
xs[1:3]  len(xs)  cap(xs)       // a slice SHARES memory
slices.Sort(xs); slices.Contains(xs, 3); slices.Index(xs, 2)
slices.Clone(xs); copy(dst, src)
slices.SortFunc(os, func(a, b O) int { return cmp.Compare(a.T, b.T) })</code></pre></div>
<div><h4>Maps &amp; strings</h4><pre data-lang="go"><code class="language-go">m := map[string]int{"milk": 12}
m["curd"] = 5; delete(m, "milk")
v, ok := m["x"]                 // ok = present?
for k, v := range m {}          // random order
keys := slices.Sorted(maps.Keys(m))
strings.Split(s, ",") strings.Join(xs, ",") strings.TrimSpace(s)
strings.Contains strings.HasPrefix strings.ReplaceAll strings.Fields
var b strings.Builder; b.WriteString("x"); b.String()</code></pre></div>
<div><h4>Structs &amp; methods</h4><pre data-lang="go"><code class="language-go">type Item struct {
    SKU string \`json:"sku"\`
    Qty int    \`json:"qty"\`
}
it := Item{SKU: "milk", Qty: 2}; p := &amp;it; p.Qty++
func (i Item) Total(p int) int { return i.Qty * p }   // value receiver
func (i *Item) Add(n int) { i.Qty += n }              // pointer receiver
type Stringer interface{ String() string }           // implicit</code></pre></div>
<div><h4>Errors</h4><pre data-lang="go"><code class="language-go">if err != nil { return fmt.Errorf("load %s: %w", p, err) }
var ErrNotFound = errors.New("not found")
errors.Is(err, ErrNotFound)
var pe *fs.PathError; errors.As(err, &amp;pe)
panic("impossible"); recover() // only in deferred funcs</code></pre></div>
<div><h4>Concurrency</h4><pre data-lang="go"><code class="language-go">go work()                        // goroutine
ch := make(chan int, 10); ch &lt;- 1; v := &lt;-ch; close(ch)
for v := range ch {}
select { case v := &lt;-ch: … case &lt;-ctx.Done(): … }
var wg sync.WaitGroup; wg.Add(1); go func(){ defer wg.Done() }(); wg.Wait()
var mu sync.Mutex; mu.Lock(); defer mu.Unlock()
ctx, cancel := context.WithTimeout(ctx, 5*time.Second); defer cancel()</code></pre></div>
<div><h4>Commands</h4><pre data-lang="shell"><code class="language-bash">go mod init example.com/app; go get pkg@latest; go mod tidy
go run .; go build -o app .; GOOS=windows go build
go test ./... -race -cover; go test -run TestX -v; go test -bench .
go vet ./...; gofmt -w .; go doc strings.Split
dlv debug ./cmd/app</code></pre></div>
</div>
`;export{n as default};

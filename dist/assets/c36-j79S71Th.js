const e=`<p class="goal">A small language designed for large teams and network services.</p>
<h3>Mental model</h3>
<ul>
<li>Compiled, statically typed and garbage-collected; produces a <b>single static binary</b>. Fast compiles by design.</li>
<li><b>Deliberately small:</b> no classes, no inheritance, no exceptions, no ternary operator. One loop keyword (<code>for</code>). The idea is that there's usually one obvious way to write something, so code reads the same everywhere.</li>
<li><b>Composition</b> via struct embedding; <b>implicit interfaces</b> (<a class="xref" data-old="c13">chapter 13</a>).</li>
<li><b>Zero values:</b> every type has a usable default (<code>0</code>, <code>""</code>, <code>nil</code>, an empty struct). There are no uninitialised variables.</li>
<li>Concurrency is built in: <b>goroutines</b> (cheap threads) and <b>channels</b> (<a class="xref" data-old="c20">chapter 20</a>).</li>
<li>Visibility is set by capitalisation: <code>Order</code> is exported, <code>order</code> is package-private.</li>
</ul>
<pre data-lang="go"><code class="language-go">package main

import (
	"errors"
	"fmt"
	"sort"
)

type Item struct {
	SKU        string
	Qty        int
	PricePaise int
}

type Order struct {
	ID    int
	Items []Item
}

// method with a value receiver (read-only); use *Order to mutate
func (o Order) Total() int {
	t := 0
	for _, it := range o.Items { // range gives index, value
		t += it.Qty * it.PricePaise
	}
	return t
}

var ErrNotFound = errors.New("not found") // sentinel error

func find(orders map[int]Order, id int) (Order, error) {
	o, ok := orders[id] // comma-ok idiom
	if !ok {
		return Order{}, fmt.Errorf("order %d: %w", id, ErrNotFound) // wrap with context
	}
	return o, nil
}

func main() {
	orders := map[int]Order{1: {ID: 1, Items: []Item{{"milk", 2, 6000}}}}
	o, err := find(orders, 2)
	if errors.Is(err, ErrNotFound) {
		fmt.Println("missing:", err)
	} else {
		fmt.Println(o.Total())
	}

	nums := []int{3, 1, 2}
	sort.Ints(nums)
	defer fmt.Println("runs last") // defer: runs when the function returns (LIFO)
}</code></pre>
<pre data-lang="go"><code class="language-go">// concurrency: worker pool with a WaitGroup
func process(jobs []string) []int {
	results := make([]int, len(jobs))
	var wg sync.WaitGroup
	for i, j := range jobs {
		wg.Add(1)
		go func() {                 // Go 1.22+: loop vars are per-iteration, so this is safe
			defer wg.Done()
			results[i] = len(j)     // each goroutine writes its own index: no race
		}()
	}
	wg.Wait()
	return results
}
// also learn: context.Context (cancellation/timeouts), select, buffered channels, sync.Mutex</code></pre>
<h3>Traps</h3>
<ul>
<li><b>nil maps panic on write</b>: <code>var m map[string]int; m["a"] = 1</code> panics. Use <code>make</code>.</li>
<li><b>Slices share backing arrays</b>: <code>b := a[:2]; b = append(b, 9)</code> may overwrite <code>a[2]</code>. Copy with <code>slices.Clone</code> when you need independence.</li>
<li><b>A nil interface isn't the same as an interface holding a nil pointer</b>: <code>err != nil</code> can be true for a "nil" <code>*MyErr</code>.</li>
<li>Ignoring errors with <code>_</code>; goroutine leaks (a goroutine blocked forever on a channel); data races. Run <code>go test -race</code>.</li>
<li>Map iteration order is random; value receivers mutate copies.</li>
</ul>
<h3>Learning path</h3>
<ol>
<li><b>A Tour of Go</b> (go.dev/tour) in one sitting, then <b>Effective Go</b>, then "Learning Go" (Bodner) or "The Go Programming Language" (Donovan &amp; Kernighan).</li>
<li><b>gobyexample.com</b> as a reference.</li>
<li>Build: a CLI (a <code>wc</code> or <code>grep</code> clone); a JSON REST API with <code>net/http</code> (the standard library router is good now) + SQLite; a concurrent URL checker with a worker pool + <code>context</code> timeouts; table-driven tests for all of them.</li>
</ol>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>30.1 <span class="levels">basic</span> Write a Go program that fetches 10 URLs concurrently with a WaitGroup and prints the status codes in input order. Run it with <code>-race</code>.</summary><div><p>Allocate a results slice of length 10; each goroutine writes <code>results[i]</code>; call <code>wg.Wait()</code>, then print. No mutex is needed because each goroutine owns its own index.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">Go's minimal control flow (one loop keyword, a friendlier switch) and its functions: multiple returns, closures and defer.</p>
<h3>if and switch</h3>
<pre data-lang="go"><code class="language-go">if qty, err := strconv.Atoi(s); err != nil {    // the init statement's variables live only in the if/else
    return err
} else if qty &gt; 50 {
    return errTooMany
}

switch zone {
case "central", "hsr":                           // several values; no fallthrough needed or implied
    fee = 2000
default:
    fee = 3500
}
switch {                                         // switch with no condition = a clean if-else chain
case total &gt;= 49900: fee = 0
case express:        fee += 1500
}</code></pre>
<h3>for is the only loop</h3>
<pre data-lang="go"><code class="language-go">for i := 0; i &lt; 3; i++ {}                 // classic
for i := range 3 {}                        // 0,1,2 (Go 1.22+)
for retries &lt; 3 {}                         // "while"
for {}                                     // forever: break out
for i, it := range items {}                // index + COPY of the element
for i := range items { items[i].Qty++ }    // modify in place via the index
for _, r := range "héllo" {}               // runes, not bytes</code></pre>
<h3>Functions</h3>
<pre data-lang="go"><code class="language-go">func split(total, parts int) (each, rem int, err error) {   // named results
    if parts &lt;= 0 {
        return 0, 0, errors.New("parts must be positive")
    }
    return total / parts, total % parts, nil
}
each, _, err := split(1001, 3)                  // _ discards a value

func sum(nums ...int) int { t := 0; for _, n := range nums { t += n }; return t }   // variadic
sum(1, 2, 3); sum(xs...)                        // spread a slice

apply := func(f func(int) int, x int) int { return f(x) }   // functions are values</code></pre>
<p>No default parameters and no overloading. The usual patterns are an options struct (<code>NewServer(Config{Port: 8080})</code>) or functional options (<code>NewServer(WithPort(8080))</code>).</p>
<h3>Closures</h3>
<pre data-lang="go"><code class="language-go">func counter() func() int {
    n := 0
    return func() int { n++; return n }    // n lives on (escapes to the heap)
}</code></pre>
<h3>defer: cleanup that always runs</h3>
<pre data-lang="go"><code class="language-go">func copyFile(dst, src string) (err error) {
    in, err := os.Open(src)
    if err != nil { return err }
    defer in.Close()                              // runs when copyFile returns, on every path
    out, err := os.Create(dst)
    if err != nil { return err }
    defer func() {                                // deferred closure can adjust the named return error
        if cerr := out.Close(); cerr != nil &amp;&amp; err == nil { err = cerr }
    }()
    _, err = io.Copy(out, in)
    return err
}
// deferred calls run LIFO; the arguments are evaluated when defer runs, not at the end</code></pre>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Write <code>parseQty(s string) (int, error)</code> that trims, parses, and rejects values below 1 or above 50 with distinct errors, plus a table-driven test with 6 cases.</summary><div><p>Tests: <code>cases := []struct{ in string; want int; wantErr bool }{…}</code>; loop with <code>t.Run(c.in, func(t *testing.T){…})</code>. Compare errors with <code>errors.Is</code> against sentinel errors <code>ErrTooSmall</code> and <code>ErrTooBig</code>.</p></div></details>
</div>
`;export{e as default};

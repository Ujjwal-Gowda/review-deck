const t=`<p class="goal">One table to translate between everything you know.</p>
<table>
<tr><th>Concept</th><th>Python</th><th>TypeScript</th><th>Go</th><th>Rust</th><th>C</th></tr>
<tr><td>Run</td><td><code>python3 a.py</code></td><td><code>npx tsx a.ts</code> / <code>tsc</code> then <code>node</code></td><td><code>go run .</code></td><td><code>cargo run</code></td><td><code>gcc -Wall -g a.c &amp;&amp; ./a.out</code></td></tr>
<tr><td>Variable</td><td><code>x = 5</code></td><td><code>const x = 5; let y = 1;</code></td><td><code>x := 5</code> / <code>var x int</code></td><td><code>let x = 5; let mut y = 1;</code></td><td><code>int x = 5;</code></td></tr>
<tr><td>Function</td><td><code>def f(a: int) -&gt; int:</code></td><td><code>function f(a: number): number {}</code></td><td><code>func f(a int) int {}</code></td><td><code>fn f(a: i32) -&gt; i32 {}</code></td><td><code>int f(int a) {}</code></td></tr>
<tr><td>Multiple returns</td><td>tuple <code>return a, b</code></td><td>array/object</td><td><code>return a, b</code> (native)</td><td>tuple <code>(a, b)</code></td><td>out-pointers / struct</td></tr>
<tr><td>Array / list</td><td><code>list</code></td><td><code>number[]</code></td><td><code>[]int</code> slice</td><td><code>Vec&lt;i32&gt;</code>, <code>&amp;[i32]</code></td><td><code>int a[10]</code> / malloc</td></tr>
<tr><td>Map</td><td><code>dict</code></td><td><code>Map&lt;K,V&gt;</code> / <code>Record</code></td><td><code>map[string]int</code></td><td><code>HashMap&lt;K,V&gt;</code></td><td>write your own</td></tr>
<tr><td>Record</td><td><code>@dataclass</code></td><td><code>interface</code> / <code>type</code></td><td><code>struct</code></td><td><code>struct</code></td><td><code>struct</code></td></tr>
<tr><td>Sum type</td><td><code>Union</code> + <code>match</code></td><td>discriminated union</td><td>interface + type switch</td><td><code>enum</code> + <code>match</code></td><td>tagged <code>union</code></td></tr>
<tr><td>Absence</td><td><code>None</code></td><td><code>undefined</code>/<code>null</code> (strict checks)</td><td><code>nil</code>, zero values</td><td><code>Option&lt;T&gt;</code></td><td><code>NULL</code></td></tr>
<tr><td>Errors</td><td>exceptions</td><td>exceptions (+ Result by convention)</td><td><code>error</code> values</td><td><code>Result&lt;T,E&gt;</code> + <code>?</code>, <code>panic!</code></td><td>return codes, <code>errno</code></td></tr>
<tr><td>Polymorphism</td><td>duck typing, ABC, Protocol</td><td>structural interfaces</td><td>implicit interfaces</td><td>traits (+ generics / <code>dyn</code>)</td><td>function pointers</td></tr>
<tr><td>Generics</td><td><code>def f[T](x: T)</code></td><td><code>&lt;T&gt;</code></td><td><code>[T any]</code></td><td><code>&lt;T: Trait&gt;</code></td><td>macros / <code>void*</code></td></tr>
<tr><td>Memory</td><td>refcount + GC</td><td>GC (V8)</td><td>GC (low-latency)</td><td>ownership, no GC</td><td>manual</td></tr>
<tr><td>Concurrency</td><td>asyncio; threads (GIL); processes</td><td>async/await, event loop; workers</td><td>goroutines + channels</td><td>threads, <code>async</code> (tokio), Send/Sync</td><td>pthreads</td></tr>
<tr><td>Packages</td><td>pip / <b>uv</b>, <code>pyproject.toml</code></td><td>npm / pnpm, <code>package.json</code></td><td><code>go mod</code>, <code>go.mod</code></td><td><b>cargo</b>, <code>Cargo.toml</code></td><td>system libs, make/CMake</td></tr>
<tr><td>Test</td><td><code>pytest</code></td><td><code>vitest</code> / <code>node --test</code></td><td><code>go test</code> (built-in)</td><td><code>cargo test</code> (built-in)</td><td>assert / Unity / CMocka</td></tr>
<tr><td>Format / lint</td><td>ruff</td><td>prettier, eslint, <code>tsc --noEmit</code></td><td>gofmt, go vet, staticcheck</td><td>rustfmt, clippy</td><td>clang-format, <code>-Wall -Wextra</code>, sanitizers</td></tr>
<tr><td>Output</td><td><code>print(f"{x}")</code></td><td><code>console.log(\`\${x}\`)</code></td><td><code>fmt.Println(x)</code> / <code>Printf</code></td><td><code>println!("{x}")</code></td><td><code>printf("%d\\n", x)</code></td></tr>
</table>
<div class="callout key"><b class="t">Trade-offs: when to reach for which</b>
<table>
<tr><th>Language</th><th>Best at</th><th>Weakest at</th></tr>
<tr><td><b>Python</b></td><td>scripting, automation, data, ML/AI, glue, prototypes</td><td>raw CPU speed, mobile/browser, large untyped codebases</td></tr>
<tr><td><b>TypeScript</b></td><td>anything web: frontends (React, Remotion), Node backends, full-stack with shared types</td><td>CPU-heavy work; runtime type safety (types are erased)</td></tr>
<tr><td><b>Go</b></td><td>network services, APIs, CLIs, DevOps tooling (Docker and Kubernetes are written in Go); simple, fast compiles, one static binary</td><td>expressive type modelling; GC-sensitive low-latency systems; GUI</td></tr>
<tr><td><b>Rust</b></td><td>performance plus safety: systems, CLIs, WebAssembly, embedded, engines, anything where C++ was used</td><td>learning curve; compile times; fast prototyping</td></tr>
<tr><td><b>C</b></td><td>understanding the machine; OS kernels, embedded firmware, and the libraries every other language calls (FFI)</td><td>memory safety; productivity; big applications</td></tr>
</table></div>
`;export{t as default};

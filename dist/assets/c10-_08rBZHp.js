const e=`<p class="goal">Where your data physically lives, who is responsible for freeing it, and why aliasing bites.</p>

<h3>The memory layout of a process</h3>
<div class="diagram">  high addresses
  ┌──────────────────────────┐
  │ STACK   ↓ grows down     │  function frames: locals, params, return addresses
  │                          │  automatic: freed when the function returns. Fast. Small (~8 MB).
  ├──────────────────────────┤
  │          (free)          │
  ├──────────────────────────┤
  │ HEAP    ↑ grows up       │  anything whose size/lifetime isn't known at compile time
  │                          │  requested at runtime (malloc/new). Big. Someone must free it.
  ├──────────────────────────┤
  │ DATA / BSS               │  globals, static variables, string literals
  ├──────────────────────────┤
  │ TEXT (code)              │  the machine instructions, read-only
  └──────────────────────────┘
  low addresses</div>
<table>
<tr><th></th><th>Stack</th><th>Heap</th></tr>
<tr><td>Allocation</td><td>move a pointer: nearly free</td><td>find a free block: slower, can fragment</td></tr>
<tr><td>Lifetime</td><td>ends when the function returns</td><td>until explicitly freed, or collected</td></tr>
<tr><td>Size</td><td>small, fixed at compile time</td><td>large, dynamic</td></tr>
<tr><td>Typical contents</td><td>ints, small structs, pointers</td><td>lists, strings, objects, anything that grows</td></tr>
<tr><td>Failure mode</td><td>stack overflow (deep recursion)</td><td>leaks, use-after-free, double free (in manual languages)</td></tr>
</table>

<h3>Pointers and references</h3>
<p>A <b>pointer</b> is a variable whose value is a memory <b>address</b>. It "points to" data stored elsewhere. A <b>reference</b> is a safer, restricted pointer (it can't be null or do arithmetic, in most languages). In Python, JS and Java, <i>every</i> object variable is effectively a reference; you just never see the address.</p>
<pre data-lang="c"><code class="language-c">int x = 42;
int *p = &amp;x;        // &amp;x = "address of x";  p holds that address
printf("%d\\n", *p); // *p = "the value at p" (dereference): 42
*p = 7;             // writes through the pointer: x is now 7

int *arr = malloc(100 * sizeof(int));   // heap allocation: 100 ints
if (arr == NULL) { /* allocation failed */ }
arr[0] = 1;
free(arr);          // YOU must free it, exactly once
// arr[0] = 2;      // use-after-free: undefined behaviour, a classic security hole</code></pre>

<h3>Value semantics vs reference semantics</h3>
<p>The question to ask of every language: <b>"when I assign or pass this, is it copied, or shared?"</b></p>
<table>
<tr><th>Language</th><th>Assignment / passing does…</th></tr>
<tr><td>C, Go (structs, arrays)</td><td>copies the value. Pass a pointer (<code>&amp;x</code>) to share it.</td></tr>
<tr><td>Go (slices, maps, channels)</td><td>copies a small header that <i>points to</i> shared data, so mutations are visible to both.</td></tr>
<tr><td>Python, JS, Java, C# (objects)</td><td>copies the <i>reference</i>. Both names see the same object. Primitives in JS and Java are copied.</td></tr>
<tr><td>Rust</td><td><b>moves</b> ownership (the old name becomes unusable), or copies small <code>Copy</code> types, or borrows with <code>&amp;</code> / <code>&amp;mut</code>.</td></tr>
<tr><td>C++</td><td>copies by default (copy constructor). <code>&amp;</code> references and <code>std::move</code> opt out.</td></tr>
</table>
<p><b>"Is Python pass-by-value or pass-by-reference?"</b> Neither, precisely: it's <b>pass by object reference</b> (also called "call by sharing"). The function receives a reference to the same object. Mutating the object is visible to the caller; <i>rebinding</i> the parameter name isn't.</p>
<pre data-lang="python"><code class="language-python">def mutate(lst):  lst.append(99)     # caller sees it
def rebind(lst):  lst = [99]         # caller does NOT see it; only the local name moved
a = [1]; mutate(a); rebind(a); print(a)   # [1, 99]</code></pre>

<h3>Shallow vs deep copy</h3>
<pre data-lang="python"><code class="language-python">import copy
grid = [[0, 0], [0, 0]]
shallow = grid.copy()          # new OUTER list; inner lists are SHARED
deep = copy.deepcopy(grid)     # copies all the way down
shallow[0][0] = 1
print(grid[0][0])              # 1: the inner list is shared!

bad = [[0] * 3] * 3            # three references to ONE row
bad[0][0] = 1                  # [[1,0,0],[1,0,0],[1,0,0]]
good = [[0] * 3 for _ in range(3)]   # three separate rows</code></pre>

<h3>Mutability: the root of aliasing bugs</h3>
<p>Aliasing (two names for one object) is only dangerous when the object is <b>mutable</b>. If it can't change, sharing is perfectly safe. That's why strings, numbers and tuples are immutable in Python, and why functional languages and Rust lean hard on immutability. Defensive habits: don't mutate arguments you were given (return a new value instead), and copy on the way in when you store something a caller might later change.</p>

<h3>Who frees heap memory? Four strategies</h3>
<div class="callout key"><b class="t">Trade-offs: memory management</b>
<table>
<tr><th>Strategy</th><th>Languages</th><th>Pros</th><th>Cons</th></tr>
<tr><td><b>Manual</b> (malloc/free)</td><td>C, (C++ raw <code>new/delete</code>)</td><td>Total control; zero runtime overhead; predictable</td><td>Leaks, double frees, use-after-free, dangling pointers. Most historic security bugs come from here.</td></tr>
<tr><td><b>Tracing garbage collection</b></td><td>Java, Go, JS, C#, Python (for cycles)</td><td>Safe and easy: you never free anything</td><td>GC pauses; more memory; freeing isn't deterministic (bad for closing files and sockets)</td></tr>
<tr><td><b>Reference counting</b></td><td>Python (primary), Swift, Objective-C, C++ <code>shared_ptr</code>, Rust <code>Rc</code></td><td>Frees immediately when the count hits 0; predictable</td><td>Count updates cost time; cycles leak unless there's a cycle collector or weak refs</td></tr>
<tr><td><b>Ownership + borrowing</b> (checked at compile time)</td><td>Rust, (C++ RAII / <code>unique_ptr</code> by convention)</td><td>Memory safety with no GC; deterministic cleanup; prevents data races</td><td>Steeper learning curve; the compiler rejects some valid programs; more upfront design</td></tr>
</table></div>
<p><b>Garbage collection</b> in brief: an object is garbage when nothing reachable from the "roots" (globals, the stack) references it. A <b>mark-and-sweep</b> collector marks everything reachable, then frees the rest. <b>Generational</b> GCs exploit the fact that most objects die young, so they scan new objects often and old ones rarely.</p>
<p><b>Rust ownership</b>, the three rules: (1) every value has exactly one owner; (2) when the owner goes out of scope, the value is dropped (freed); (3) you can have <i>either</i> any number of shared references (<code>&amp;T</code>) <i>or</i> exactly one mutable reference (<code>&amp;mut T</code>) at a time, never both.</p>
<pre data-lang="rust"><code class="language-rust">let a = String::from("hi");   // a owns the heap string
let b = a;                     // ownership MOVES to b
// println!("{a}");            // compile error: a was moved
let c = b.clone();             // explicit deep copy: now two owners of two strings
fn len(s: &amp;String) -&gt; usize { s.len() }   // borrow: look, don't own
println!("{}", len(&amp;c));       // c is still usable afterwards
// c's and b's memory is freed automatically at the end of scope</code></pre>
<p>Rule 3 is the same rule that prevents aliasing bugs and data races: <b>sharing XOR mutation</b>. It's worth absorbing even if you never write Rust.</p>

<h3>Memory leaks happen in GC languages too</h3>
<p>A GC only frees <i>unreachable</i> objects. If you keep a reference forever (a global cache that only grows, event listeners never removed, closures capturing big objects), it's a leak. Measure with <code>tracemalloc</code> (Python), Chrome DevTools heap snapshots (JS), <code>pprof</code> (Go) and <code>valgrind</code> (C).</p>

<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>10.1 <span class="levels">basic</span> Predict the output, then explain with a box-and-arrow drawing:
<pre data-lang="python"><code class="language-python">a = {"tags": ["x"]}
b = dict(a)
b["tags"].append("y")
b["name"] = "n"
print(a)</code></pre></summary><div><p><code>{'tags': ['x', 'y']}</code>. <code>dict(a)</code> is a shallow copy: <code>b</code> is a new dict (so "name" isn't added to <code>a</code>), but both dicts point to the <i>same</i> tags list.</p></div></details>
<details class="ex"><summary>10.2 <span class="levels">basic</span> In C: write <code>void swap(int *a, int *b)</code> and explain why <code>void swap(int a, int b)</code> can't work.</summary><div>
<pre data-lang="c"><code class="language-c">void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }
int x = 1, y = 2; swap(&amp;x, &amp;y);</code></pre><p>C passes by value: the version taking ints swaps local copies that vanish when the function returns.</p></div></details>
<details class="ex"><summary>10.3 <span class="levels">think</span> Compile this with <code>gcc -g -fsanitize=address bug.c &amp;&amp; ./a.out</code> and read the report: <code>int *a = malloc(3*sizeof(int)); a[3] = 1; free(a);</code></summary><div><p>AddressSanitizer reports a <i>heap-buffer-overflow</i> on the write, with the exact line and the allocation site. Without the sanitizer, the program probably "works", which is exactly why memory bugs are so dangerous.</p></div></details>
<details class="ex"><summary>10.4 <span class="levels">think</span> Write a Rust function that takes a <code>&amp;Vec&lt;i32&gt;</code> and returns the sum. Then try to push to the vec while holding a reference to an element. Read the compiler's error.</summary><div>
<pre data-lang="rust"><code class="language-rust">let mut v = vec![1, 2, 3];
let first = &amp;v[0];
v.push(4);            // error[E0502]: cannot borrow \`v\` as mutable because it is also borrowed as immutable
println!("{first}");</code></pre><p>Why it matters: <code>push</code> may reallocate the buffer, which would leave <code>first</code> pointing at freed memory. In C++ this is a real, silent bug ("iterator invalidation"). Rust rejects it at compile time.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">Rust Ownership, Borrowing &amp; Lifetimes in Depth: The Invariant of Aliasing XOR Mutability, Non-Lexical Lifetimes (NLL), RAII Drop Semantics, and Dangling Reference Prevention.</p>

<h3>The Core Innovation of Rust</h3>
<p>Every programming language must solve the problem of memory reclamation:</p>
<ul>
  <li><b>Manual Memory (C, C++):</b> Fast and zero-overhead, but leads to catastrophic memory corruption: use-after-free, double-free, and dangling pointers.</li>
  <li><b>Garbage Collection (Java, Go, JS, Python):</b> Safe, but incurs runtime overhead, stop-the-world pauses, and heavy memory footprints.</li>
  <li><b>Rust's Ownership:</b> <b>Compile-time memory safety with zero runtime overhead.</b> The compiler statically tracks every allocation and inserts the exact machine <code>free()</code> instructions at compile time via deterministic RAII (Resource Acquisition Is Initialization).</li>
</ul>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              The 3 Sacred Rules of Ownership                           │
│                                                                                        │
│   1. Each value in Rust has an OWNER (a variable binding).                             │
│   2. There can only be ONE owner at any given moment.                                  │
│   3. When the owner goes out of scope, the value is DROPPED (freed) automatically.     │
│                                                                                        │
│   let s1 = String::from("hello");                                                      │
│   ┌──────────────┬──────────────┬──────────────┐                                       │
│   │ ptr: 0x1000  │    len: 5    │    cap: 5    │ ──► Heap Buffer: ['h','e','l','l','o']│
│   └──────────────┴──────────────┴──────────────┘                                       │
│                                                                                        │
│   let s2 = s1; // ⚠️ MOVE! (Shallow bitwise copy of stack header, s1 is INVALIDATED!)   │
│                                                                                        │
│   s1 (INVALID)   ┌──────────────┬──────────────┬──────────────┐                        │
│                  │ ptr: 0x1000  │    len: 5    │    cap: 5    │ ──► Heap Buffer        │
│                  └──────────────┴──────────────┴──────────────┘                        │
│                  s2 (NEW OWNER)                                                        │
│                                                                                        │
│   ★ When s2 exits scope, free(0x1000) is called ONCE. Double-free is IMPOSSIBLE!       │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: The Move Semantics vs Copy Types</h3>
<p>In most languages, assigning an object either creates a deep copy (C++ default) or creates an aliased reference (Python/Java/JS). In Rust, assignment is a <b>Move</b> by default:</p>

<pre data-lang="rust"><code class="language-rust">let s1 = String::from("ferris");
let s2 = s1; // Ownership MOVED to s2.

// println!("{s1}"); 
// ❌ COMPILE ERROR [E0382]: borrow of moved value: \`s1\`
// Rust prevents you from touching s1, guaranteeing zero dangling references!

// Types that live entirely on the stack implement the \`Copy\` trait:
let x: i32 = 42;
let y = x; // Bitwise stack copy! Both x and y are valid.</code></pre>

<h3>Part 2: Borrowing &amp; The Aliasing XOR Mutability Invariant</h3>
<p>If you had to move ownership on every function call, programming in Rust would be unbearable. Rust provides <b>References (Borrowing)</b>:</p>

<div class="callout key"><b class="t">The Golden Law of Borrowing</b>
<p>At any given point in program execution, you may have <b>EITHER</b>:</p>
<ul>
  <li>Any number of immutable shared references (<code>&amp;T</code>), <b>OR</b></li>
  <li>Exactly <b>ONE</b> mutable reference (<code>&amp;mut T</code>).</li>
</ul>
<p><b>Never both at the same time:</b> $\\text{Aliasing} \\oplus \\text{Mutability}$. If data is shared, it cannot be mutated. If data is mutated, it cannot be shared.</p>
</div>

<h4>Why Rule 2 Prevents Catastrophic Use-After-Free:</h4>
<pre data-lang="rust"><code class="language-rust">let mut v = vec![1, 2, 3];
let first = &v[0]; // Immutable borrow of v's heap array

v.push(4); 
// ❌ COMPILE ERROR [E0502]: cannot borrow \`v\` as mutable because it is also borrowed as immutable
// Why? Because push() might reallocate the backing array to a new heap address!
// If this compiled, \`first\` would point to deallocated garbage memory (Use-After-Free)!

println!("First element is: {first}");</code></pre>

<h3>Part 3: Non-Lexical Lifetimes (NLL)</h3>
<p>In older versions of Rust, a borrow lasted until the closing curly brace <code>}</code>. In modern Rust, the borrow checker uses <b>Non-Lexical Lifetimes</b>: a reference is only alive until the <i>last line it is actually read</i>:</p>

<pre data-lang="rust"><code class="language-rust">let mut data = String::from("initial");

let r1 = &data;
println!("Read: {r1}"); // r1's lifetime ENDS here!

// ✅ VALID: No conflict, because r1 is never used again!
let r2 = &mut data;
r2.push_str(" modified");
println!("Updated: {r2}");</code></pre>

<h3>Part 4: Lifetimes: Proving References Never Outlive Data</h3>
<p>A lifetime (e.g. <code>'a</code>) is a compile-time generic parameter that proves to the borrow checker that output references live no longer than the inputs that provided them:</p>

<pre data-lang="rust"><code class="language-rust">// 'a means: "The returned reference is valid for as long as BOTH a and b remain alive"
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}

fn main() {
    let string1 = String::from("long string");
    let result: &str;
    {
        let string2 = String::from("xyz");
        // result = longest(&string1, &string2);
        // ❌ COMPILE ERROR [E0597]: \`string2\` does not live long enough!
        // result would survive outside the block, but string2 is dropped at the brace!
    }
}</code></pre>

<details class="ex">
  <summary><b>Drill: How do you share mutable data across multiple threads in Rust?</b> (Click to expand)</summary>
  <p><b>Question:</b> If Rust only allows one owner and one mutable reference, how can two concurrent threads safely mutate a shared counter?</p>
  <div class="callout key">
    <p><b>Answer: Combine <code>Arc&lt;T&gt;</code> (Atomic Reference Counting) + <code>Mutex&lt;T&gt;</code>!</b></p>
    <pre data-lang="rust"><code class="language-rust">use std::sync::{Arc, Mutex};
use std::thread;

let counter = Arc::new(Mutex::new(0));
let mut handles = vec![];

for _ in 0..10 {
    let counter_clone = Arc::clone(&counter);
    handles.push(thread::spawn(move || {
        // Lock acquired; RAII MutexGuard releases lock when it drops out of scope
        let mut num = counter_clone.lock().unwrap();
        *num += 1;
    }));
}

for h in handles { h.join().unwrap(); }
println!("Final Result: {}", *counter.lock().unwrap()); // Exactly 10!</code></pre>
    <p><code>Arc</code> provides shared thread-safe ownership, and <code>Mutex</code> provides safe runtime-checked interior mutability. Zero data races possible!</p>
  </div>
</details>
`;export{e as default};

const e=`<p class="goal">From text file to electrons: what "running code" really means.</p>

<h3>The machine</h3>
<p>A computer is, at its core, a <b>CPU</b> that repeatedly does one thing: <i>fetch</i> an instruction from memory, <i>decode</i> it, <i>execute</i> it, and move on to the next. Instructions are tiny: "add these two numbers", "copy this value from memory address 1000 into a register", "if the last result was zero, jump to instruction 57". Billions per second.</p>
<div class="diagram">  ┌──────────────── CPU ────────────────┐          ┌──────── RAM (memory) ────────┐
  │  registers: tiny, ultra-fast slots  │  ◄────►  │ addr 0000: instruction/data  │
  │  ALU: does arithmetic & logic       │   bus    │ addr 0001: …                 │
  │  control unit: fetch → decode → run │          │ … billions of numbered bytes │
  └─────────────────────────────────────┘          └──────────────────────────────┘
                     ▲                                            ▲
                     └── disk / network / keyboard / screen (I/O) ┘  (much slower)</div>
<p><b>Memory (RAM)</b> is a giant array of bytes, each with a numeric <b>address</b>. Everything (your numbers, your text, the program itself) is bytes at addresses. <b>Disk</b> keeps data after power-off but is thousands of times slower than RAM. That speed gap drives many design decisions you'll see later.</p>

<h3>From source code to machine code</h3>
<p>You write <b>source code</b>: text for humans. The CPU only understands <b>machine code</b>: numbers encoding instructions. Something must translate. There are three main strategies:</p>
<table>
<tr><th>Strategy</th><th>How</th><th>Examples</th><th>Trade-off</th></tr>
<tr><td><b>Compiled (ahead of time)</b></td><td>A compiler translates the whole program to machine code <i>before</i> it runs, producing an executable.</td><td>C, C++, Rust, Go</td><td>Fast at runtime; errors caught early; must rebuild after changes; binary is platform-specific.</td></tr>
<tr><td><b>Interpreted</b></td><td>An interpreter reads your program and performs it step by step.</td><td>classic shells, early BASIC</td><td>Instant start, very flexible, slower.</td></tr>
<tr><td><b>Bytecode + VM (often with JIT)</b></td><td>Compiled to an intermediate "bytecode" that a virtual machine runs; hot code may be <b>JIT</b>-compiled to machine code while running.</td><td>Python (CPython bytecode), Java/Kotlin (JVM), C# (.NET), JavaScript (V8)</td><td>Portable and flexible; JIT can be fast. Startup and memory cost.</td></tr>
</table>
<p>This is why "Python is interpreted, C is compiled" is a simplification: Python is compiled to bytecode, then interpreted by the CPython VM. You'll dig into this in <a class="xref" data-old="c22">chapter 22</a>.</p>

<h3>Your first program, in five languages</h3>
<p>Look at what's <i>the same</i> (output some text) and what's <i>ceremony</i> (imports, main functions, types).</p>
<pre data-lang="python"><code class="language-python"># hello.py        run: python3 hello.py
print("Hello, world")</code></pre>
<pre data-lang="c"><code class="language-c">// hello.c        build: gcc hello.c -o hello    run: ./hello
#include &lt;stdio.h&gt;

int main(void) {
    printf("Hello, world\\n");
    return 0;              // exit code 0 = success
}</code></pre>
<pre data-lang="javascript"><code class="language-javascript">// hello.js       run: node hello.js
console.log("Hello, world");</code></pre>
<pre data-lang="go"><code class="language-go">// hello.go       run: go run hello.go
package main

import "fmt"

func main() {
    fmt.Println("Hello, world")
}</code></pre>
<pre data-lang="rust"><code class="language-rust">// hello.rs       build: rustc hello.rs    run: ./hello
fn main() {
    println!("Hello, world");
}</code></pre>
<div class="callout note"><b class="t">Notice</b>
<p>C, Go and Rust have an entry point called <code>main</code>: the OS starts the program there. Python and JS just run the file top to bottom. The C program <i>returns an exit code</i>; every process has one. In your shell, run <code>./hello; echo $?</code> to see it. <code>0</code> means success, anything else means failure. Scripts and CI pipelines rely on this.</p>
</div>

<h3>Programs as processes</h3>
<p>When you run a program, the operating system creates a <b>process</b>: a running instance with its own private memory, a program counter (which instruction is next), open files, and three standard streams:</p>
<ul>
<li><b>stdin</b> (standard input, fd 0): where input comes from (keyboard, or a pipe)</li>
<li><b>stdout</b> (standard output, fd 1): normal output</li>
<li><b>stderr</b> (standard error, fd 2): error messages, kept separate so they aren't mixed into data</li>
</ul>
<pre data-lang="shell"><code class="language-bash">python3 hello.py > out.txt        # stdout goes to a file
python3 broken.py 2> errors.txt   # stderr goes to a file
echo "5" | python3 double.py      # stdout of echo becomes stdin of python</code></pre>

<h3>Syntax vs semantics</h3>
<p><b>Syntax</b> is the grammar: where the brackets go. <b>Semantics</b> is the meaning: what actually happens when it runs. New languages are mostly new syntax; the semantics (variables, loops, functions, references) are what this guide teaches, and they transfer. But watch for places where the <i>same syntax means different things</i>. For example, <code>a = b</code> copies a whole struct in C and Go but only copies a reference to a list in Python. Those are the dangerous spots.</p>

<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>1.1 <span class="levels">basic</span> Build and run hello world in C and Go. Then make the C program exit with code 3 and verify it in the shell.</summary><div>
<pre data-lang="c"><code class="language-c">int main(void) { printf("Hello\\n"); return 3; }</code></pre>
<p><code>gcc hello.c -o hello &amp;&amp; ./hello; echo $?</code> prints <code>3</code>. Note that <code>&amp;&amp;</code> runs the next command only if the previous exited 0, which is exit codes in action.</p></div></details>
<details class="ex"><summary>1.2 <span class="levels">basic</span> Write a Python program that prints to stderr. Prove it by redirecting stdout to /dev/null and still seeing the message.</summary><div>
<pre data-lang="python"><code class="language-python">import sys
print("normal")
print("problem!", file=sys.stderr)</code></pre>
<p><code>python3 e.py > /dev/null</code> still shows "problem!" because only stdout was discarded.</p></div></details>
<details class="ex"><summary>1.3 <span class="levels">think</span> Look at the bytecode Python makes for a function. What do you notice?</summary><div>
<pre data-lang="python"><code class="language-python">import dis
def add(a, b):
    return a + b
dis.dis(add)</code></pre>
<p>You'll see instructions like <code>LOAD_FAST a</code>, <code>LOAD_FAST b</code>, <code>BINARY_OP +</code>, <code>RETURN_VALUE</code>. It's a stack machine: push two values, add them, return the top. This is the "bytecode" layer between your source and the CPU.</p></div></details>
</div>
`;export{e as default};

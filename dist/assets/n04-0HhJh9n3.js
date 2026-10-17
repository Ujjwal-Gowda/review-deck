const e=`<p class="goal">A program is a file; a process is that program running. What the OS gives each process, and how processes start, talk and stop.</p>
<h3>Program vs process vs thread</h3>
<table>
<tr><th></th><th>What it is</th><th>Owns</th></tr>
<tr><td><b>Program</b></td><td>an executable file on disk (<code>/usr/bin/python3</code>, <code>./a.out</code>)</td><td>code + static data</td></tr>
<tr><td><b>Process</b></td><td>a running instance, identified by a <b>PID</b></td><td>its own virtual memory, open file descriptors, environment, current directory, user ID, and one or more threads</td></tr>
<tr><td><b>Thread</b></td><td>an independent path of execution <i>inside</i> a process</td><td>its own stack, registers and <b>program counter</b> (the address of the next instruction); shares everything else</td></tr>
</table>
<pre data-lang="shell"><code class="language-bash">echo $$                       # this shell's PID
ps -ef --forest | less        # every process, as a tree (all descend from PID 1, systemd)
cat /proc/$$/status | head    # the kernel's view of a process: memory, threads, state
ls -l /proc/$$/fd             # its open file descriptors (0,1,2 = stdin, stdout, stderr)</code></pre>
<h3>How a process starts</h3>
<ol>
<li>The shell calls <b>fork()</b>, creating a near-copy of itself (copy-on-write, so it's cheap).</li>
<li>The child calls <b>exec()</b>, which replaces its memory with the new program. The kernel loads the ELF binary, maps its code, sets up the stack with <b>argv</b> and the <b>environment</b>, and jumps to the entry point (eventually <code>main</code>).</li>
<li>The parent <b>wait()</b>s for the child's exit code. A finished child that nobody has waited for is a <b>zombie</b>; a child whose parent died gets adopted by PID 1 (it becomes an <b>orphan</b>).</li>
</ol>
<h3>Arguments, environment, exit codes</h3>
<pre data-lang="python"><code class="language-python">import os, sys
print(sys.argv)                          # ['prog.py', '--port', '8080']
port = int(os.environ.get("PORT", "8000"))   # env vars: inherited copies, strings only
sys.exit(2)                              # exit code 2 (conventionally: usage error)</code></pre>
<pre data-lang="go"><code class="language-go">fmt.Println(os.Args, os.Getenv("PORT"))
os.Exit(1)            // note: deferred functions do NOT run on os.Exit</code></pre>
<pre data-lang="rust"><code class="language-rust">let args: Vec&lt;String&gt; = std::env::args().collect();
let port = std::env::var("PORT").unwrap_or_else(|_| "8000".into());
std::process::exit(1);</code></pre>
<p>Environment variables are copied into the child at start. A child can never change its parent's environment, which is why <code>cd</code> and <code>export</code> have to be shell built-ins. Exit code conventions: <code>0</code> ok, <code>1</code> general error, <code>2</code> usage error, <code>126</code> not executable, <code>127</code> command not found, <code>128+N</code> killed by signal N (so <code>130</code> = Ctrl-C, <code>137</code> = SIGKILL, often the OOM killer).</p>
<h3>Signals</h3>
<table>
<tr><th>Signal</th><th>Sent by</th><th>Default</th><th>Catchable?</th></tr>
<tr><td>SIGINT (2)</td><td>Ctrl-C</td><td>terminate</td><td>yes</td></tr>
<tr><td>SIGTERM (15)</td><td><code>kill PID</code>, Docker/Kubernetes/systemd stop</td><td>terminate</td><td>yes: this is your cue for a <b>graceful shutdown</b></td></tr>
<tr><td>SIGKILL (9)</td><td><code>kill -9</code>, OOM killer</td><td>terminate immediately</td><td><b>no</b></td></tr>
<tr><td>SIGHUP (1)</td><td>terminal closed; by convention also "reload config"</td><td>terminate</td><td>yes</td></tr>
<tr><td>SIGCHLD</td><td>a child exited</td><td>ignore</td><td>yes</td></tr>
<tr><td>SIGSEGV</td><td>invalid memory access</td><td>crash + core dump</td><td>technically</td></tr>
</table>
<pre data-lang="python"><code class="language-python">import signal, sys
def shutdown(signum, frame):
    print("finishing in-flight work, closing DB…"); sys.exit(0)
signal.signal(signal.SIGTERM, shutdown)     # a container stop gives you ~10s before SIGKILL</code></pre>
<pre data-lang="go"><code class="language-go">ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
defer stop()
&lt;-ctx.Done()                  // block until Ctrl-C or SIGTERM
srv.Shutdown(context.Background())   // stop accepting new requests, finish current ones</code></pre>
<h3>Talking between processes (IPC)</h3>
<p><b>Pipes</b> (<code>a | b</code>), <b>files</b>, <b>sockets</b> (TCP or Unix domain), <b>shared memory</b>, <b>signals</b>, and message queues. Spawning a child process from code:</p>
<pre data-lang="python"><code class="language-python">import subprocess
r = subprocess.run(["git", "status", "--short"], capture_output=True, text=True, check=True)
print(r.stdout)        # pass a LIST of args: no shell, so no injection (see the security chapter)</code></pre>
<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>4.1 <span class="levels">basic</span> Run <code>sleep 100 &amp;</code>, find it with <code>ps</code>, stop it with SIGTERM, and check <code>echo $?</code> after <code>wait</code>.</summary><div><p><code>kill %1; wait %1; echo $?</code> prints <b>143</b> = 128 + 15 (SIGTERM).</p></div></details>
<details class="ex"><summary>4.2 <span class="levels">think</span> Write a Python or Go program that counts to 10 slowly and, on Ctrl-C, prints "saved at N" before exiting cleanly with code 0.</summary><div><p>Python: wrap the loop in <code>try … except KeyboardInterrupt:</code> (SIGINT raises it). Go: <code>signal.NotifyContext</code> plus a <code>select</code> on <code>ctx.Done()</code> and a ticker.</p></div></details>
</div>
`;export{e as default};

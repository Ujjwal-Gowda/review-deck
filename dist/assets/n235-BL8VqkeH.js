const e=`<p class="goal">Project 1: A production-grade CLI. Small scope, uncompromising engineering discipline.</p>

<h3>The philosophy of CLI engineering</h3>
<p>Most developers treat Command Line Interfaces (CLIs) as quick throwaway scripts: a messy <code>sys.argv</code> slice, a direct write to a file, and unhandled tracebacks dumped to the terminal. But the greatest developer tools on earth—<code>git</code>, <code>ripgrep</code>, <code>docker</code>, <code>curl</code>—are masterclasses in software engineering. They follow strict UNIX conventions, guarantee atomic durability, respect terminal streams, and never corrupt user data under power cuts.</p>

<p>In this capstone, you will build a robust task management CLI (<code>todo</code>). You will structure it with clean architectural separation between CLI parsing, pure business logic, and durable atomic storage.</p>

<div class="diagram">
┌─────────────────────────────────────────────────────────────┐
│                  CLI Presentation Layer                     │
│  (Arg Parsing, Flag Validation, Exit Codes, ANSI Styling)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ commands &amp; filters
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Pure Domain Core                          │
│  (Task Model, Status Transitions, Date Calculations)        │
│          ★ 100% Deterministic · Zero I/O · Fast Tests       │
└──────────────────────────────┬──────────────────────────────┘
                               │ load / save DTOs
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Durable Storage Layer                     │
│  (XDG Directory, Atomic Tempfile Rename, POSIX File Locks)  │
└─────────────────────────────────────────────────────────────┘
</div>

<h3>The Functional Specification</h3>
<p>Your CLI binary must support five core commands, following standard POSIX argument conventions:</p>
<pre data-lang="shell"><code class="language-bash"># 1. Add task with optional due date and tags
todo add "Audit database connection pool" --due 2026-10-15 --tag infra --tag urgent

# 2. List tasks with filtering and search
todo list
todo list --tag infra --pending
todo list --due-before today --json

# 3. Mark task as completed
todo done 4

# 4. Remove task by ID
todo rm 4

# 5. Export tasks to stdout for UNIX pipeline composability
todo export --format csv > tasks_backup.csv
todo export --format json | jq '.[] | select(.done == false)'</code></pre>

<h3>Crucial Rule 1: The XDG Base Directory Standard</h3>
<p>Never dump random configuration files in the current working directory or clutter the user's home folder with <code>~/.todo_data</code>. Respect the <a href="https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html" target="_blank">XDG Base Directory Specification</a>:</p>
<ul>
  <li><b>Data directory</b>: <code>$XDG_DATA_HOME/todo/</code> (defaults to <code>~/.local/share/todo/</code> on Linux/macOS or <code>%LOCALAPPDATA%\\todo\\</code> on Windows).</li>
  <li><b>Config directory</b>: <code>$XDG_CONFIG_HOME/todo/config.toml</code> (defaults to <code>~/.config/todo/</code>).</li>
  <li><b>Cache / Locks</b>: <code>$XDG_STATE_HOME/todo/</code> or <code>$XDG_CACHE_HOME/todo/</code>.</li>
</ul>

<h3>Crucial Rule 2: Atomic Writes &amp; Crash Durability</h3>
<div class="callout warn"><b class="t">Why open("todos.json", "w") is a production bug</b>
<p>If you open a file in write mode (<code>"w"</code>) and your program crashes, gets killed by the OS (<code>SIGKILL</code>, out-of-memory), or the user pulls the power cable halfway through writing the JSON buffer, your file is truncated to 0 bytes or left with corrupted syntax. <b>All user data is permanently lost.</b></p>
</div>

<p>To guarantee zero data loss, always perform an <b>Atomic File Swap</b>:</p>
<ol>
  <li>Write the new state into a temporary file in the <i>same directory</i>: <code>todos.json.tmp.PID</code>.</li>
  <li>Flush and sync bytes to physical disk using <code>os.fsync(fd)</code> / <code>f.Sync()</code>.</li>
  <li>Execute an atomic filesystem rename (<code>rename(2)</code> syscall). On POSIX systems, <code>rename()</code> is atomic: either the old file exists in full, or the new file replaces it instantly. There is no intermediate corrupted state.</li>
</ol>

<pre data-lang="python"><code class="language-python">import json, os, tempfile
from pathlib import Path

def save_atomic(filepath: Path, data: dict) -> None:
    filepath.parent.mkdir(parents=True, exist_ok=True)
    # Write to temp file in the same directory so rename is an inode swap on the same filesystem
    temp_file = filepath.with_suffix(f".tmp.{os.getpid()}")
    try:
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            f.flush()
            os.fsync(f.fileno())  # Ensure bytes hit physical drive platters/NAND
        
        # Atomic replacement syscall
        os.replace(temp_file, filepath)
    except Exception:
        if temp_file.exists():
            temp_file.unlink()
        raise</code></pre>

<h3>Crucial Rule 3: UNIX Standard Streams &amp; Exit Codes</h3>
<p>CLIs must be respectful citizens of shell pipelines:</p>
<table>
  <tr><th>Exit Code</th><th>Meaning</th><th>When to use</th></tr>
  <tr><td><code>0</code></td><td>Success</td><td>Command executed cleanly and did what was requested.</td></tr>
  <tr><td><code>1</code></td><td>Runtime / Domain Error</td><td>Task ID not found, validation error, file locked. Written to <code>stderr</code>.</td></tr>
  <tr><td><code>2</code></td><td>CLI Usage Error</td><td>Unknown flag, missing mandatory argument, bad syntax. Written to <code>stderr</code>.</td></tr>
  <tr><td><code>130</code></td><td>Interrupted</td><td>Process terminated by <code>SIGINT</code> (Ctrl+C).</td></tr>
</table>

<div class="callout key"><b class="t">Detecting TTY for ANSI Color formatting</b>
<p>When printing to an interactive terminal, colorful badges and bold text make the CLI enjoyable. But when piped to another tool (e.g. <code>todo list | grep urgent</code> or <code>todo export > file.txt</code>), ANSI escape codes like <code>\\033[31m</code> pollute data pipelines.</p>
<p>Always inspect <code>sys.stdout.isatty()</code> (or Go's <code>isatty.IsTerminal</code> / Rust's <code>std::io::stdout().is_terminal()</code>) to automatically disable colors and decorations when output is redirected.</p>
</div>

<h3>Multi-Language Comparison: Building the Same CLI</h3>
<p>To deepen your engineering models, build this exact CLI across multiple languages:</p>

<div class="cheat">
  <div>
    <h4>Python (argparse + dataclasses)</h4>
    <pre data-lang="python"><code class="language-python">from dataclasses import dataclass, asdict
from datetime import date
from typing import List, Optional

@dataclass(frozen=True)
class Task:
    id: int
    title: str
    due: Optional[date] = None
    tags: tuple[str, ...] = ()
    done: bool = False</code></pre>
  </div>

  <div>
    <h4>Go (Clean Structs + Type Safety)</h4>
    <pre data-lang="go"><code class="language-go">type Task struct {
    ID    int       \`json:"id"\`
    Title string    \`json:"title"\`
    Due   *time.Time \`json:"due,omitempty"\`
    Tags  []string  \`json:"tags"\`
    Done  bool      \`json:"done"\`
}</code></pre>
  </div>

  <div>
    <h4>Rust (clap + serde)</h4>
    <pre data-lang="rust"><code class="language-rust">use serde::{Serialize, Deserialize};
use chrono::NaiveDate;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Task {
    pub id: u32,
    pub title: String,
    pub due: Option<NaiveDate>,
    pub tags: Vec<String>,
    pub done: bool,
}</code></pre>
  </div>
</div>

<div class="exercises">
<h3>Engineering Verification Drills</h3>
<details class="ex"><summary>1. The Power-Cut Stress Drill</summary>
<div>
<p>Write a script that launches 50 concurrent processes appending tasks to your CLI while randomly issuing <code>kill -9</code> to running instances. Verify with an integrity check that <code>todos.json</code> is never corrupted and that every completed operation is valid JSON.</p>
</div></details>

<details class="ex"><summary>2. Piping and Filter Verification</summary>
<div>
<p>Run <code>todo list | wc -l</code> and <code>todo export --format json | jq length</code>. Ensure that headers, interactive prompts, and terminal colors never leak into standard output streams.</p>
</div></details>
</div>

`;export{e as default};

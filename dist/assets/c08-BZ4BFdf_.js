const e=`<p class="goal">Talking to the outside world: users, files, and the formats data travels in.</p>

<h3>Reading input and command-line arguments</h3>
<pre data-lang="python"><code class="language-python">import sys
name = input("Name? ")                  # reads ONE line from stdin, always a str
age = int(input("Age? "))               # convert explicitly (may raise ValueError)

for line in sys.stdin:                  # read all of stdin, line by line (works with pipes)
    process(line.rstrip("\\n"))

# python3 tool.py report.csv --verbose
print(sys.argv)                         # ['tool.py', 'report.csv', '--verbose']
# for real tools use argparse (Python), flag (Go), clap (Rust), commander/yargs (JS)</code></pre>

<h3>Files</h3>
<p>A file is a named sequence of bytes on disk. To use one, you <b>open</b> it (the OS gives you a handle, or "file descriptor"), <b>read/write</b>, and <b>close</b> it. Forgetting to close leaks handles, and written data may not be flushed to disk. Every modern language has a construct that closes automatically:</p>
<pre data-lang="python"><code class="language-python">with open("notes.txt", "w", encoding="utf-8") as f:    # "w" truncates! "a" appends
    f.write("line one\\n")
# file is closed here, even if an exception happened inside the block

with open("notes.txt", encoding="utf-8") as f:
    for line in f:                      # streams line by line: works for huge files
        print(line.rstrip())

text = open("notes.txt", encoding="utf-8").read()        # whole file at once (small files)
data = open("photo.jpg", "rb").read()                    # "b" = binary: bytes, no decoding</code></pre>
<p>Equivalents: Go <code>defer f.Close()</code>, Rust closes on <b>drop</b> (when the variable goes out of scope, <a class="xref" data-old="c10">chapter 10</a>), Java/C# <code>try-with-resources</code>/<code>using</code>, C++ destructors (RAII), C an explicit <code>fclose</code>.</p>

<h3>Paths</h3>
<pre data-lang="python"><code class="language-python">from pathlib import Path
home = Path.home()
p = home / "learn" / "notes.txt"        # joins with the right separator for the OS
p.exists(), p.suffix, p.stem, p.parent
p.write_text("hi", encoding="utf-8"); p.read_text(encoding="utf-8")
for f in (home / "learn").glob("**/*.py"): ...     # recursive search</code></pre>
<p><b>Absolute path</b>: from the root (<code>/home/ujjwal/learn</code>). <b>Relative path</b>: from the current working directory, which is wherever the program was <i>launched from</i>, not where the script lives. That difference is a classic "works on my machine" bug. To find files next to your script, use <code>Path(__file__).parent</code>. And paths with spaces (like your <code>~/video generation /</code> folder) must be quoted in the shell.</p>

<h3>Data formats</h3>
<table>
<tr><th>Format</th><th>Looks like</th><th>Pros</th><th>Cons</th></tr>
<tr><td><b>CSV</b></td><td><code>name,qty\\nmilk,12</code></td><td>Opens in Excel; compact; streamable</td><td>No types (all strings); quoting and comma edge cases; flat only</td></tr>
<tr><td><b>JSON</b></td><td><code>{"name":"milk","qty":12}</code></td><td>Universal on the web; nested; basic types</td><td>No comments, no dates, no integers above 2⁵³ in JS; verbose</td></tr>
<tr><td><b>YAML / TOML</b></td><td><code>name: milk</code></td><td>Human-friendly config files</td><td>YAML's whitespace and implicit typing are full of surprises (<code>no</code> → false)</td></tr>
<tr><td><b>Binary (Protobuf, MessagePack, SQLite)</b></td><td>bytes</td><td>Small, fast, typed schemas</td><td>Not human-readable; needs tooling</td></tr>
</table>
<pre data-lang="python"><code class="language-python">import json, csv
obj = json.loads('{"milk": 12}')             # text → Python dict
text = json.dumps(obj, indent=2)             # dict → text
with open("stock.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):            # use the csv module; never split(",") yourself
        print(row["name"], int(row["qty"]))</code></pre>
<p><b>Serialisation</b> is turning in-memory objects into bytes or text (for files or the network). <b>Deserialisation</b> (parsing) is the reverse. Treat all input as untrusted: validate it after parsing (<a class="xref" data-old="c26">chapter 26</a>).</p>

<h3>Buffering</h3>
<p>Writing to disk or a terminal is slow, so output is <b>buffered</b>: collected in memory and written in chunks. That's why a <code>print</code> sometimes doesn't appear before a crash, or appears late when piped. <code>print(..., flush=True)</code> or <code>sys.stdout.flush()</code> forces it out. stderr is usually unbuffered for exactly this reason.</p>

<div class="exercises"><h3>Exercises</h3>
<details class="ex"><summary>8.1 <span class="levels">basic</span> Write <code>wc.py</code>: given a filename argument, print lines, words and bytes like the Unix <code>wc</code>. Compare your output with <code>wc file</code>.</summary><div>
<pre data-lang="python"><code class="language-python">import sys
data = open(sys.argv[1], "rb").read()
print(data.count(b"\\n"), len(data.split()), len(data), sys.argv[1])</code></pre><p>Reading as bytes matches <code>wc</code> exactly, including non-UTF-8 files.</p></div></details>
<details class="ex"><summary>8.2 <span class="levels">basic</span> Read a CSV of <code>item,qty,price</code> and write a JSON file with the total value per item and a grand total.</summary><div>
<pre data-lang="python"><code class="language-python">import csv, json
out, grand = {}, 0
with open("in.csv", newline="") as f:
    for r in csv.DictReader(f):
        v = int(r["qty"]) * int(r["price"])      # prices in paise!
        out[r["item"]] = out.get(r["item"], 0) + v
        grand += v
json.dump({"items": out, "total": grand}, open("out.json", "w"), indent=2)</code></pre></div></details>
<details class="ex"><summary>8.3 <span class="levels">think</span> Write <code>find_large.py DIR N</code> that lists the N largest files under DIR, handling permission errors without crashing.</summary><div>
<pre data-lang="python"><code class="language-python">import sys, heapq
from pathlib import Path
def sizes(root):
    for p in Path(root).rglob("*"):
        try:
            if p.is_file(): yield p.stat().st_size, p
        except (PermissionError, FileNotFoundError):
            continue
for size, p in heapq.nlargest(int(sys.argv[2]), sizes(sys.argv[1])):
    print(f"{size/1e6:8.1f} MB  {p}")</code></pre><p>Note <code>yield</code> (a generator: files are streamed, not all held in memory) and <code>heapq.nlargest</code> (you'll learn heaps in <a class="xref" data-old="c12">chapter 12</a>).</p></div></details>
</div>
`;export{e as default};

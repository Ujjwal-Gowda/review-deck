const e=`<p class="goal">The everyday standard-library tasks (files, JSON, HTTP, time, command-line arguments) side by side.</p>
<div class="cheat">
<div><h4>Read a whole file</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  Path("f.txt").read_text(encoding="utf-8")
TS  await readFile("f.txt", "utf8")   // node:fs/promises
Go  data, err := os.ReadFile("f.txt")
Rs  let s = fs::read_to_string("f.txt")?;
C   fopen + fread into a malloc'd buffer (check sizes)</code></pre></div>
<div><h4>Read line by line (big files)</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  with open(p) as f: for line in f:
TS  for await (const line of readline.createInterface({ input: createReadStream(p) }))
Go  sc := bufio.NewScanner(f); for sc.Scan() { sc.Text() }
Rs  for line in BufReader::new(File::open(p)?).lines() { let line = line?; }
C   while (fgets(buf, sizeof buf, f)) { … }</code></pre></div>
<div><h4>Write a file</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  Path("out.txt").write_text(s, encoding="utf-8")
TS  await writeFile("out.txt", s)
Go  os.WriteFile("out.txt", []byte(s), 0o644)
Rs  fs::write("out.txt", s)?;
C   FILE *f = fopen("out.txt", "w"); fputs(s, f); fclose(f);</code></pre></div>
<div><h4>JSON</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  json.loads(s); json.dumps(obj, indent=2)
TS  JSON.parse(s) as unknown → validate (zod); JSON.stringify(o)
Go  json.Unmarshal(data, &amp;order); json.Marshal(order)   // struct tags \`json:"id"\`
Rs  serde_json::from_str::&lt;Order&gt;(&amp;s)?; serde_json::to_string(&amp;o)?
C   a library (cJSON, jansson)</code></pre></div>
<div><h4>HTTP GET (JSON)</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  httpx.get(url, timeout=10).json()
TS  await (await fetch(url, { signal: AbortSignal.timeout(10_000) })).json()
Go  c := http.Client{Timeout: 10*time.Second}; r, err := c.Get(url); defer r.Body.Close()
Rs  reqwest::get(url).await?.json::&lt;T&gt;().await?
C   libcurl</code></pre></div>
<div><h4>Command-line arguments</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  sys.argv / argparse
TS  process.argv.slice(2) / util.parseArgs
Go  os.Args / flag.String("port", "8080", "…")
Rs  std::env::args() / clap (derive)
C   int main(int argc, char **argv) / getopt</code></pre></div>
<div><h4>Environment + exit</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  os.environ.get("PORT"); sys.exit(1)
TS  process.env.PORT; process.exit(1)
Go  os.Getenv("PORT"); os.Exit(1)
Rs  env::var("PORT").ok(); process::exit(1)
C   getenv("PORT"); exit(1) / return 1 from main</code></pre></div>
<div><h4>Time</h4><pre data-lang="plaintext"><code class="language-plaintext">Py  datetime.now(timezone.utc); time.perf_counter()
TS  new Date().toISOString(); performance.now()
Go  time.Now().UTC(); time.Since(start)
Rs  SystemTime::now(); Instant::now().elapsed()   // chrono/jiff for dates
C   time(NULL); clock_gettime(CLOCK_MONOTONIC, &amp;ts)</code></pre></div>
</div>
<p>Rules that apply in every language: always set a timeout on network calls; always name the encoding (UTF-8); stream big files instead of loading them whole; close what you open (<code>with</code>, <code>defer</code>, Drop, <code>fclose</code>); use a <b>monotonic</b> clock to measure durations, and UTC for stored timestamps.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Build <code>jsonstat FILE</code> in any two languages: read a JSON array of orders, and print the count, total and average amount. Handle a missing file and invalid JSON with clear messages and exit code 1.</summary><div><p>The structure is the same everywhere: parse the arguments, then read the file (error: exit 1), then parse the JSON (error: exit 1), then validate the shape, then compute, then print. Notice how Go and Rust force you to handle each failure at the call site, while Python and TS let exceptions bubble up unless you catch them.</p></div></details>
</div>
`;export{e as default};

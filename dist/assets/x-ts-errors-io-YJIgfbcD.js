const e=`<p class="goal">Errors, ES modules, and the Node APIs for files, paths, processes and environment: what CLI tools and servers are made of.</p>
<h3>Errors</h3>
<pre data-lang="typescript"><code class="language-typescript">class NotFoundError extends Error {
  constructor(public resource: string, public id: string | number) {
    super(\`\${resource} \${id} not found\`);
    this.name = "NotFoundError";
  }
}
try {
  await loadOrder(42);
} catch (err) {                                     // err is \`unknown\` in strict mode
  if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
  throw new Error("loading order failed", { cause: err });   // wrap with context
} finally {
  release();
}</code></pre>
<p>Only throw <code>Error</code> objects (they carry a stack trace). Async functions reject instead of throwing synchronously, so <code>await</code> them inside <code>try</code>. Some teams prefer returning <code>{ ok: true, value } | { ok: false, error }</code> results for expected failures.</p>
<h3>ES modules</h3>
<pre data-lang="typescript"><code class="language-typescript">// orders.ts
export interface Order { id: number }
export function placeOrder() {}
export default class OrderService {}
// main.ts
import OrderService, { placeOrder, type Order } from "./orders.js";   // .js extension even in TS (NodeNext)
import * as fs from "node:fs/promises";                               // "node:" prefix for built-ins
const { default: heavy } = await import("./heavy.js");                // dynamic import (code splitting)</code></pre>
<h3>Node essentials</h3>
<pre data-lang="typescript"><code class="language-typescript">import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({ options: { out: { type: "string", default: "report.json" }, verbose: { type: "boolean" } } });
const dir = path.join(process.cwd(), "exports");
await mkdir(dir, { recursive: true });
for (const f of await readdir(dir)) if (f.endsWith(".csv")) console.log(f);
const orders = JSON.parse(await readFile(path.join(dir, "orders.json"), "utf8")) as unknown;
await writeFile(values.out!, JSON.stringify({ count: 1 }, null, 2));
const port = Number(process.env.PORT ?? 8080);
process.on("SIGTERM", () =&gt; { server.close(() =&gt; process.exit(0)); });   // graceful shutdown
console.error("warning");       // stderr; process.exitCode = 1 to fail without abrupt exit</code></pre>
<h3>In practice</h3>
<p>Validate parsed JSON with zod at the boundary; use <code>node:fs/promises</code> (never the sync versions inside servers); use streams (<code>createReadStream</code> + <code>readline</code>) for big files; exit with a non-zero code on failure so scripts and CI notice.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Build a Node CLI <code>csv2json --in orders.csv --out orders.json</code> with parseArgs, clear errors (missing file: exit code 1 with a message) and a zod schema for rows.</summary><div><p>Use <code>readFile</code>, split the lines, map to objects, then <code>z.array(RowSchema).safeParse</code>. On failure, print the issues and set <code>process.exitCode = 1</code>. Wrap the whole flow in <code>main().catch(e =&gt; { console.error(e.message); process.exit(1); })</code>.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">Setting up and running a professional TypeScript project: tsconfig, package scripts, running, building, testing and linting.</p>
<h3>Project setup</h3>
<pre data-lang="shell"><code class="language-bash">mkdir shop &amp;&amp; cd shop &amp;&amp; npm init -y
npm i zod                                           # runtime dependency
npm i -D typescript tsx vitest @types/node eslint typescript-eslint prettier
npx tsc --init</code></pre>
<pre data-lang="json"><code class="language-json">// package.json (the important parts)
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "test": "vitest run",
    "check": "tsc --noEmit &amp;&amp; eslint . &amp;&amp; prettier --check ."
  },
  "bin": { "shop": "dist/cli.js" }
}</code></pre>
<pre data-lang="json"><code class="language-json">// tsconfig.json for a Node project
{ "compilerOptions": {
    "target": "ES2022", "module": "NodeNext", "moduleResolution": "NodeNext",
    "strict": true, "noUncheckedIndexedAccess": true, "exactOptionalPropertyTypes": true,
    "outDir": "dist", "rootDir": "src", "sourceMap": true, "skipLibCheck": true },
  "include": ["src"] }</code></pre>
<h3>Running TypeScript</h3>
<table>
<tr><th>Tool</th><th>Use</th></tr>
<tr><td><code>tsx file.ts</code></td><td>run TS directly in development (fast, no type check)</td></tr>
<tr><td><code>tsc --noEmit</code></td><td>type-check only (in CI and before commits)</td></tr>
<tr><td><code>tsc</code></td><td>compile to <code>dist/*.js</code> for production Node</td></tr>
<tr><td>Vite / esbuild / tsup</td><td>bundle for browsers or libraries</td></tr>
<tr><td><code>node --experimental-strip-types</code></td><td>Node 22+ can run simple TS itself (as your drills do)</td></tr>
</table>
<h3>Testing with Vitest</h3>
<pre data-lang="typescript"><code class="language-typescript">import { describe, it, expect, vi } from "vitest";
import { total } from "./orders.js";
describe("total", () =&gt; {
  it("sums qty × price", () =&gt; expect(total([{ qty: 2, pricePaise: 6000 }])).toBe(12000));
  it("rejects negative qty", () =&gt; expect(() =&gt; total([{ qty: -1, pricePaise: 1 }])).toThrow(/qty/));
  it("calls the notifier once", async () =&gt; {
    const send = vi.fn().mockResolvedValue(undefined);
    await placeOrder({ send }, order);
    expect(send).toHaveBeenCalledOnce();
  });
});</code></pre>
<h3>Package managers</h3>
<p>npm is the default. <b>pnpm</b> is faster and stricter (a content-addressed store, no phantom dependencies), and good for monorepos (workspaces). Bun is a runtime plus package manager plus bundler. Commit the lockfile; use <code>npm ci</code> in CI.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Set up the project above from scratch. Make <code>npm run check</code> and <code>npm test</code> pass on a small module, then add a GitHub Actions job running both.</summary><div><p>The job: checkout, setup-node with <code>cache: npm</code>, <code>npm ci</code>, <code>npm run check</code>, <code>npm test</code>. Break a type on purpose and confirm CI fails. It&#39;s the same pipeline as the CI chapters, just in a TS setting.</p></div></details>
</div>
`;export{e as default};

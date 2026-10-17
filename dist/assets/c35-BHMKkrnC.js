const e=`<p class="goal">Understanding the JS runtime underneath, and a type system that exists only at compile time.</p>
<h3>Mental model</h3>
<ul>
<li>TypeScript = JavaScript + static types. The compiler (<code>tsc</code>) checks types and then <b>erases</b> them: at runtime it's plain JS. That means <b>no runtime checking</b>, so validate external data (API responses, JSON) with a schema library such as <b>zod</b>.</li>
<li>The type system is <b>structural</b>: any value with the right shape fits.</li>
<li>The JS runtime: single-threaded <b>event loop</b>; objects and arrays are references; <code>number</code> is a 64-bit float (integers are exact only up to 2⁵³; use <code>bigint</code> beyond); prototypes underlie classes.</li>
<li>Where it runs: browsers, Node.js, Deno, Bun. Your Remotion film is TS + React.</li>
</ul>
<pre data-lang="typescript"><code class="language-typescript">// types: annotations, inference, unions, literal types
type Status = "placed" | "paid" | "shipped";
interface Item { sku: string; qty: number; pricePaise: number }
interface Order { id: number; items: Item[]; status: Status; note?: string }   // ? = optional

const total = (o: Order): number =&gt;
  o.items.reduce((sum, i) =&gt; sum + i.qty * i.pricePaise, 0);

// discriminated union + exhaustive switch (the TS version of a Rust enum)
type Result&lt;T&gt; = { ok: true; value: T } | { ok: false; error: string };
function show(r: Result&lt;number&gt;): string {
  switch (r.ok) {
    case true:  return \`value \${r.value}\`;       // narrowed: r.value exists here
    case false: return \`error \${r.error}\`;
  }
}

// generics + utility types
function byId&lt;T extends { id: number }&gt;(xs: T[]): Map&lt;number, T&gt; {
  return new Map(xs.map(x =&gt; [x.id, x]));
}
type Draft = Partial&lt;Order&gt;;            // all fields optional
type Summary = Pick&lt;Order, "id" | "status"&gt;;
type ReadonlyOrder = Readonly&lt;Order&gt;;

// async
async function load(id: number): Promise&lt;Order&gt; {
  const res = await fetch(\`/api/orders/\${id}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return (await res.json()) as Order;   // 'as' is a PROMISE to the compiler, not a check. Validate!
}
const [a, b] = await Promise.all([load(1), load(2)]);   // run concurrently</code></pre>
<h3>Traps</h3>
<ul>
<li><code>any</code> switches type checking off and spreads. Use <code>unknown</code> and narrow it instead. Turn on <code>"strict": true</code> in <code>tsconfig.json</code>, always.</li>
<li><code>==</code> coercion (use <code>===</code>); <code>this</code> binding (arrow functions capture it; regular functions don't); <code>var</code> hoisting (use <code>let</code>/<code>const</code>).</li>
<li>Forgetting <code>await</code>, so you get a Promise instead of a value; unhandled promise rejections; <code>forEach</code> doesn't await async callbacks (use <code>for…of</code> or <code>Promise.all</code>).</li>
<li><code>0.1 + 0.2</code>; <code>[] </code> being truthy; <code>typeof null === "object"</code>; sorting numbers with <code>.sort()</code> sorts them as <i>strings</i> (use <code>.sort((a, b) =&gt; a - b)</code>).</li>
<li>ESM vs CommonJS module confusion (<code>import</code> vs <code>require</code>, <code>"type": "module"</code>).</li>
</ul>
<h3>Clear-up path</h3>
<ol>
<li>Understand the JS event loop, closures, <code>this</code> and promises first. That's where most TS confusion actually comes from.</li>
<li>Read the official <b>TypeScript Handbook</b> end to end (narrowing, generics, and mapped/conditional types).</li>
<li>Do the <b>type-challenges</b> repo (easy → medium) to master the type system.</li>
<li>Build: a Node CLI with <code>node --test</code>; a small API with Hono or Express + zod; then read your own Remotion code again and explain every type.</li>
</ol>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>29.1 <span class="levels">basic</span> Enable <code>"noUncheckedIndexedAccess": true</code> in your Remotion project's tsconfig and run <code>npx tsc --noEmit</code>. Fix three errors.</summary><div><p>Every <code>arr[i]</code> becomes <code>T | undefined</code>. Fix with a guard (<code>if (!x) return</code>), <code>.at()</code> plus a check, or restructuring. Each fix covers a real out-of-range case.</p></div></details>
</div>
`;export{e as default};

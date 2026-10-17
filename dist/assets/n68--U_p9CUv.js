const e=`<p class="goal">The JavaScript runtime model beneath TypeScript, React and Node. Most JS confusion comes from these five ideas.</p>
<h3>1. Closures and scope</h3>
<p>Covered in <a class="xref" data-old="n11">chapter 11</a>. Always use <code>const</code>/<code>let</code>, never <code>var</code>.</p>
<h3>2. <code>this</code> is decided by the call, not the definition</h3>
<pre data-lang="javascript"><code class="language-javascript">const cart = {
  items: [1, 2],
  count() { return this.items.length; },
  later() { setTimeout(function () { console.log(this.items); }, 0); },  // undefined: 'this' is lost
  fixed() { setTimeout(() =&gt; console.log(this.items), 0); },             // arrow functions capture 'this'
};
const f = cart.count; f();          // TypeError: 'this' is undefined (method detached from its object)
button.addEventListener("click", cart.count.bind(cart));   // bind fixes 'this' permanently</code></pre>
<h3>3. Prototypes</h3>
<p>Objects inherit from other objects via a hidden <code>[[Prototype]]</code> link. <code>class</code> is syntax over this. Property lookup walks the chain: <code>obj → Class.prototype → Object.prototype → null</code>.</p>
<h3>4. Modules</h3>
<p><b>ESM</b> (<code>import</code>/<code>export</code>): static, async, the standard. <b>CommonJS</b> (<code>require</code>/<code>module.exports</code>): Node's legacy system. <code>"type": "module"</code> in package.json makes <code>.js</code> files ESM. Mixing the two causes most "cannot use import statement" errors.</p>
<h3>5. The event loop: microtasks vs macrotasks</h3>
<pre data-lang="javascript"><code class="language-javascript">console.log("1 sync");
setTimeout(() =&gt; console.log("4 macrotask (timer)"), 0);
Promise.resolve().then(() =&gt; console.log("3 microtask (promise)"));
queueMicrotask(() =&gt; console.log("3b microtask"));
console.log("2 sync");
// 1, 2, 3, 3b, 4: every microtask runs before the next macrotask</code></pre>
<h3>Async patterns</h3>
<pre data-lang="javascript"><code class="language-javascript">const [a, b] = await Promise.all([getOrder(1), getOrder(2)]);          // parallel; fails fast
const results = await Promise.allSettled(urls.map(u =&gt; fetch(u)));      // never throws; check .status
const first = await Promise.race([fetch(url), timeout(5000)]);          // timeout pattern
const ctrl = new AbortController(); fetch(url, { signal: ctrl.signal }); ctrl.abort();   // cancellation
for await (const chunk of response.body) process(chunk);                // async iteration over streams</code></pre>
<h3>Equality, copying, numbers</h3>
<p>Always use <code>===</code>. <code>structuredClone(obj)</code> deep-copies; spread (<code>{...o}</code>) is shallow. Integers are exact only up to <code>Number.MAX_SAFE_INTEGER</code> (2⁵³−1); use <code>BigInt</code> beyond. <code>??</code> falls back only on null/undefined, whereas <code>||</code> also treats <code>0</code> and <code>""</code> as missing.</p>
<details class="ex"><summary>68.1 <span class="levels">think</span> Predict the output order: <code>setTimeout(()=&gt;log('a')); Promise.resolve().then(()=&gt;{log('b'); setTimeout(()=&gt;log('c'))}); log('d');</code></summary><div><p><b>d, b, a, c</b>. First the sync code; then the microtask (b, which schedules timer c); then the macrotasks in order: timer a was queued before c.</p></div></details>
<div class="callout seclens"><b class="t">Security lens · JavaScript</b><p>Avoid <code>eval</code>, <code>new Function</code> and <code>innerHTML</code> with untrusted data. Watch for prototype pollution when merging user JSON into objects (<code>__proto__</code> keys).</p></div>
`;export{e as default};

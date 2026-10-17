const t=`<p class="goal">HTML as structure and meaning. Getting it right gives you accessibility, SEO and working forms almost for free.</p>
<pre data-lang="html"><code class="language-html">&lt;!doctype html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;   &lt;!-- mobile layout --&gt;
  &lt;title&gt;Paneer 200g · FreshOn&lt;/title&gt;
  &lt;meta name="description" content="Fresh paneer delivered in 30 minutes"&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;header&gt;&lt;nav aria-label="Main"&gt;…&lt;/nav&gt;&lt;/header&gt;
  &lt;main&gt;
    &lt;article&gt;
      &lt;h1&gt;Paneer 200g&lt;/h1&gt;
      &lt;img src="paneer.webp" alt="Block of fresh paneer" width="600" height="400" loading="lazy"&gt;
      &lt;form action="/cart" method="post"&gt;
        &lt;label for="qty"&gt;Quantity&lt;/label&gt;
        &lt;input id="qty" name="qty" type="number" min="1" max="10" value="1" required&gt;
        &lt;button type="submit"&gt;Add to cart&lt;/button&gt;
      &lt;/form&gt;
    &lt;/article&gt;
  &lt;/main&gt;
  &lt;footer&gt;…&lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<h3>Semantic elements beat divs</h3>
<table>
<tr><th>Use</th><th>Instead of</th><th>Why</th></tr>
<tr><td><code>&lt;button&gt;</code></td><td><code>&lt;div onclick&gt;</code></td><td>keyboard focus, Enter/Space and screen-reader role for free</td></tr>
<tr><td><code>&lt;a href&gt;</code></td><td>a button that navigates</td><td>open in new tab, copy link, crawlable</td></tr>
<tr><td><code>&lt;label for&gt;</code></td><td>placeholder-only inputs</td><td>click the label to focus; screen readers announce it</td></tr>
<tr><td>landmarks (<code>header nav main footer</code>)</td><td>div soup</td><td>screen-reader navigation; SEO structure</td></tr>
<tr><td>one <code>&lt;h1&gt;</code>, headings in order</td><td>styled spans</td><td>document outline</td></tr>
<tr><td><code>&lt;table&gt;</code> for tabular data</td><td>div grids</td><td>row and column semantics</td></tr>
</table>
<h3>Forms</h3>
<p>Built-in validation (<code>required</code>, <code>type="email"</code>, <code>min</code>, <code>pattern</code>) gives instant feedback, but <b>always validate again on the server</b>, because anyone can bypass the browser. Pick input types that bring up the right mobile keyboard: <code>type="tel"</code>, <code>inputmode="numeric"</code>, <code>autocomplete="one-time-code"</code> for OTP fields.</p>
<p><b>ARIA</b> adds semantics when HTML has none (<code>aria-expanded</code>, <code>role="dialog"</code>). First rule of ARIA: don't use ARIA if a native element exists.</p>
<p><b>SEO basics:</b> a unique <code>&lt;title&gt;</code> and meta description per page, real links, <code>alt</code> text, fast loading, and server-rendered content for pages that must be indexed (<a class="xref" data-old="n78">chapter 78</a>).</p>
<div class="callout seclens"><b class="t">Security lens · HTML</b><p>Forms that change state need CSRF protection; <code>target="_blank"</code> links should have <code>rel="noopener"</code>; never trust hidden fields or client-side validation.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>66.1 <span class="levels">basic</span> Run Lighthouse's Accessibility and SEO audits on one of your sites and fix the top three issues.</summary><div><p>The usual findings are missing <code>alt</code> text, missing labels, low contrast, no <code>lang</code> attribute, missing meta description, and buttons without accessible names. Each has a small fix in the HTML.</p></div></details>
</div>
`;export{t as default};

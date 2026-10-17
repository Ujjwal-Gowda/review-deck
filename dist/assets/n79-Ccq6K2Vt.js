const e=`<p class="goal">Building interfaces everyone can use: keyboard users, screen-reader users, people with low vision. It's a legal requirement in many markets, too.</p>
<h3>The checklist that catches most issues</h3>
<ol>
<li><b>Semantic HTML</b> (<a class="xref" data-old="n66">chapter 66</a>): real buttons, links, labels, headings and landmarks.</li>
<li><b>Keyboard:</b> everything works with Tab, Shift-Tab, Enter, Space, Esc and the arrow keys; focus order follows the visual order; there's a <b>visible focus ring</b> (never <code>outline: none</code> without a replacement: use <code>:focus-visible</code>).</li>
<li><b>Contrast:</b> text at least 4.5:1 against its background (3:1 for large text and UI parts). Check in DevTools → Accessibility.</li>
<li><b>Alt text:</b> describe the purpose (<code>alt="Fresh paneer, 200 g pack"</code>); <code>alt=""</code> for decorative images.</li>
<li><b>Don't rely on colour alone:</b> "red = failed" also needs an icon or text (like the ✓/✗ used in tables here).</li>
<li><b>Dialogs:</b> trap focus inside while open, close on Esc, return focus on close. Prefer the native <code>&lt;dialog&gt;</code> element.</li>
<li><b>Motion:</b> respect <code>prefers-reduced-motion</code>.</li>
<li><b>Dynamic updates:</b> announce toasts and errors with <code>role="status"</code> / <code>role="alert"</code>.</li>
<li><b>Zoom:</b> the layout must survive 200% zoom and 320px width without horizontal scrolling.</li>
</ol>
<h3>Testing it</h3>
<p>Put the mouse away for 5 minutes and use the site with only the keyboard. Run Lighthouse or axe DevTools (they catch about 30–40% of issues automatically). Try a screen reader: Orca on Linux (<code>orca</code>), VoiceOver on a Mac or iPhone, TalkBack on Android. Standard: <b>WCAG 2.2 AA</b>.</p>
<details class="ex"><summary>79.1 <span class="levels">basic</span> Tab through this site. Is the focus always visible? Can you collapse the sidebar and tick topics without a mouse?</summary><div><p>The sidebar toggle and topic checkboxes are real buttons and inputs, so they're reachable. The <code>[</code> shortcut also toggles the sidebar. Note anything you can't reach: that's your first accessibility bug report.</p></div></details>
`;export{e as default};

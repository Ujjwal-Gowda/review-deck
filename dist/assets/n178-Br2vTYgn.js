const e=`<p class="goal">Every design starts with the right questions: what the system must do, and how well.</p>
<table>
<tr><th>Functional (what it does)</th><th>Non-functional (how well)</th></tr>
<tr><td>customers place orders; riders see assigned deliveries; owners see sales by store</td><td>scale (users, requests/s, data size); latency (p99 &lt; 300 ms); availability (99.9%); consistency needs; durability; security and compliance; cost; offline support</td></tr>
</table>
<h3>Questions to ask before drawing boxes</h3>
<ul>
<li>Who are the users and what are the core use cases? What's explicitly <b>out of scope</b>?</li>
<li>Read-heavy or write-heavy? What's the read:write ratio?</li>
<li>Peak vs average traffic (a festival sale spike, the 7–9 pm rush)? Growth over 2 years?</li>
<li>What must never be wrong (money, stock) and what can be briefly stale (view counts)?</li>
<li>Latency expectations per operation? Global or single-region?</li>
<li>Constraints: team size, existing stack, budget, deadline, regulation (data residency, PCI).</li>
</ul>
<p>Write the answers down as numbered requirements. Every later decision should trace back to one of them. That's how you justify trade-offs instead of following fashion.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>178.1 <span class="levels">basic</span> Write the functional and non-functional requirements for the FreshOn rider app in 10 bullet points with numbers.</summary><div><p>For example: 500 active riders; a location update every 5 s; assignment within 30 s; works on flaky 3G/4G; 99.9% availability in the evening peak; battery-friendly; offline queue for status updates.</p></div></details>
</div>
`;export{e as default};

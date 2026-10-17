const e=`<p class="goal">Measuring AI quality with real users, not just offline test sets.</p>
<table>
<tr><th>Offline evaluation</th><th>Online evaluation</th></tr>
<tr><td>a fixed test set, before release; fast, repeatable, safe</td><td>real traffic after release; captures what users actually do and care about</td></tr>
</table>
<ul>
<li><b>Implicit signals:</b> did the user accept the suggestion, edit it heavily, retry, copy the answer, or escalate to a human? Resolution rate, time to resolution.</li>
<li><b>Explicit feedback:</b> thumbs up or down with an optional reason. It's sparse and biased, but valuable for finding failure cases.</li>
<li><b>A/B tests:</b> randomly assign users to model or prompt A vs B, pick one primary metric in advance, and run until the sample size you planned (<a class="xref" data-old="n194">chapter 194</a>).</li>
<li><b>Shadow mode:</b> run the new version alongside the old one and compare outputs without showing them to users.</li>
<li><b>Sampled grading:</b> run LLM-as-judge or human review on a daily sample of production traffic, to watch quality trends.</li>
<li>Feed failures back into the offline eval set. That loop is how AI products improve.</li>
</ul>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>230.1 <span class="levels">think</span> Design an online A/B test comparing two prompts for complaint replies. What's the primary metric, and how long do you run it?</summary><div><p>Primary metric: the share of replies sent without edits (or resolution rate). Randomise by customer; compute the sample size in advance; run whole weeks to cover weekday patterns; don't stop early.</p></div></details>
</div>
`;export{e as default};

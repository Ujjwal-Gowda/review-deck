const e=`<p class="goal">The ongoing work of keeping a service healthy after launch.</p>
<ul>
<li><b>Clear ownership:</b> every service has an owning person or team, listed in a service catalogue with its repo, dashboards, runbooks, dependencies and on-call rota.</li>
<li><b>On-call that's humane:</b> alerts only for user-facing symptoms; a rotation with handovers; paging only when action is needed now (<a class="xref" data-old="n160">Alerting</a>). Track pages per week, and treat a rising count as a bug.</li>
<li><b>Runbooks:</b> for each alert, what it means, how to check it, how to mitigate, and when to escalate. Test them during game days.</li>
<li><b>Deploy hygiene:</b> small, frequent, reversible deploys; avoid peak hours for a POS (the evening rush); tell people about risky changes.</li>
<li><b>Reduce toil:</b> manual, repetitive operational work (restarting things, rotating keys by hand, one-off data fixes). Automate what recurs; cap toil at roughly half of operations time.</li>
<li><b>Capacity reviews:</b> monthly, look at growth trends (traffic, storage, database size, queue depth) against limits, and plan before you hit them (<a class="xref" data-old="n180">Capacity Planning</a>).</li>
<li><b>Dependency upkeep:</b> patch regularly (Renovate or Dependabot), upgrade runtimes before they reach end of life, and retire unused features.</li>
<li><b>Learn from incidents:</b> blameless postmortems, with action items that actually get done (<a class="xref" data-old="n251">Incident Response</a>).</li>
</ul>
<p>The SRE principle: <b>operations is a software problem</b>. When you find yourself doing something by hand for the third time, it's time to write code instead.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Write a service catalogue entry and one runbook for your printer hub.</summary><div><p>Catalogue: owner, purpose, host (192.168.68.222), dependencies (CUPS, HPLIP, USB), dashboards or logs, how to deploy. Runbook "prints stuck": check the queue (<code>lpstat -o</code>), check the USB device (<code>lsusb</code>), restart CUPS, test page, then escalate to reseating the cable.</p></div></details>
</div>
`;export{e as default};

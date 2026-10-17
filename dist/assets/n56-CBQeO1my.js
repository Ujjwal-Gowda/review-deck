const e=`<p class="goal">Running programs as long-lived services that start at boot, restart on crash, and log somewhere findable.</p>
<pre data-lang="ini"><code class="language-ini"># /etc/systemd/system/shop-api.service
[Unit]
Description=Shop API
After=network-online.target postgresql.service
Wants=network-online.target

[Service]
User=shop                         # never root
WorkingDirectory=/opt/shop
EnvironmentFile=/etc/shop/env     # secrets/config, chmod 600
ExecStart=/opt/shop/shop-api --port 8080
Restart=on-failure
RestartSec=3
# hardening
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=/var/lib/shop

[Install]
WantedBy=multi-user.target</code></pre>
<pre data-lang="shell"><code class="language-bash">sudo systemctl daemon-reload           # after editing unit files
sudo systemctl enable --now shop-api   # start now AND at every boot
systemctl status shop-api              # state + the last log lines
sudo systemctl restart shop-api
journalctl -u shop-api -f              # follow its logs
journalctl -u shop-api --since "1 hour ago" -p err
systemctl --user …                     # per-user services, no sudo needed
systemctl list-timers                  # systemd timers: the modern cron</code></pre>
<p>systemd sends SIGTERM on stop and waits (90 s by default) before SIGKILL, so handle SIGTERM (<a class="xref" data-old="n04">chapter 4</a>). stdout and stderr go to the journal automatically, so just log to stdout. <b>Timers</b> (<code>.timer</code> units) replace cron: they're logged, can catch up on runs missed while the machine was off, and can be listed and managed like everything else.</p>
<details class="ex"><summary>56.1 <span class="levels">basic</span> Run the FreshOn demo kit's <code>server.mjs</code> as a <code>--user</code> service that restarts on failure.</summary><div><p>Create <code>~/.config/systemd/user/freshon-demo.service</code> with <code>ExecStart=/usr/bin/node /home/ujjwal/Downloads/FreshOn-demo-kit/server.mjs</code> and <code>Restart=on-failure</code>, then run <code>systemctl --user daemon-reload &amp;&amp; systemctl --user enable --now freshon-demo</code>.</p></div></details>
<div class="callout seclens"><b class="t">Security lens · Services</b><p>Run each service as its own unprivileged user and use systemd hardening (<code>ProtectSystem</code>, <code>NoNewPrivileges</code>, <code>PrivateTmp</code>). <code>systemd-analyze security name.service</code> scores it.</p></div>
`;export{e as default};

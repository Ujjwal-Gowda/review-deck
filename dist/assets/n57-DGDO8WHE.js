const e=`<p class="goal">Secure remote shells, file copies and tunnels, with key-based login.</p>
<pre data-lang="shell"><code class="language-bash">ssh-keygen -t ed25519 -C "ujjwal@laptop"      # creates ~/.ssh/id_ed25519 (private) + .pub (public)
ssh-copy-id user@server                        # appends your .pub to the server's ~/.ssh/authorized_keys
ssh user@server                                # first connect: verify the host fingerprint → saved in known_hosts
scp file user@server:/tmp/                     # copy (simple)
rsync -avz --progress ./dist/ user@server:/var/www/app/   # sync only changes; add --delete to mirror
ssh -L 5433:localhost:5432 user@server         # LOCAL forward: your :5433 → the server's Postgres
ssh -R 8080:localhost:3000 user@server         # REMOTE forward: expose your local :3000 on the server
ssh -J bastion user@private-host               # jump through a bastion host</code></pre>
<pre data-lang="plaintext"><code class="language-plaintext"># ~/.ssh/config: short names and per-host settings
Host hub
    HostName 192.168.68.222
    User ujjwal
    IdentityFile ~/.ssh/id_ed25519
# now just: ssh hub   /   rsync -av x hub:~/</code></pre>
<h3>How it's secure</h3>
<p>Key exchange sets up an encrypted channel. The server proves its identity with a host key (that's what <code>known_hosts</code> remembers; a "REMOTE HOST IDENTIFICATION HAS CHANGED" warning means a re-installed server, or an attack). You prove yours by signing a challenge with your private key, which never leaves your machine.</p>
<h3>Hardening a server</h3>
<p>In <code>/etc/ssh/sshd_config</code>: <code>PasswordAuthentication no</code>, <code>PermitRootLogin no</code>. Add fail2ban, or keep SSH reachable only over a VPN like Tailscale (which you already run).</p>
<details class="ex"><summary>57.1 <span class="levels">basic</span> Reach Postgres on a remote box from your laptop's DB client without opening port 5432 on the server.</summary><div><p><code>ssh -N -L 5433:localhost:5432 user@box</code>, then point the client at <code>localhost:5433</code>. The traffic travels inside the encrypted SSH connection.</p></div></details>
`;export{e as default};

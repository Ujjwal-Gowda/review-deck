const e=`<p class="goal">Project 6: Production Cloud Infrastructure &amp; Hardened Host Deployment. Provision a secure Linux host, configure DNS, automate TLS 1.3 with Caddy, and build a verified disaster-recovery backup pipeline.</p>

<h3>The Real World of Internet-Facing Servers</h3>
<p>The moment you attach a public IPv4 address to a cloud Virtual Machine (Hetzner, DigitalOcean, AWS, Linode), automated botnets and port scanners (Shodan, Censys, Mirai variants) begin hammering port 22 with dictionary attacks within 90 seconds. If you leave root password login enabled, expose raw database ports to <code>0.0.0.0</code>, or fail to configure kernel firewall rules, your server will be hijacked for crypto mining before you even finish deploying your app.</p>

<p>In this capstone, you will build a rock-solid, production-grade cloud deployment. You will enforce defense-in-depth host security, configure DNS with strict CAA records, terminate modern TLS 1.3 / HTTP/3 with <b>Caddy</b>, manage services with <code>systemd</code>, and establish encrypted, off-site database backups with verified restore drills.</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Public Internet                                      │
│               (Authoritative DNS: A / AAAA / CAA / DNSSEC Records)                     │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │ HTTPS (Port 443) / HTTP/3 (UDP 443)
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           Hardened Linux Host (Debian / Ubuntu)                        │
│                                                                                        │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                      Uncomplicated Firewall (UFW)                            │     │
│   │   • Block ALL incoming traffic by default                                    │     │
│   │   • ALLOW 80/tcp, 443/tcp, 443/udp (QUIC)                                    │     │
│   │   • Port 22 (SSH) restricted to Tailscale / WireGuard VPN mesh only          │     │
│   └──────────────────────────────────────┬───────────────────────────────────────┘     │
│                                          │                                             │
│                                          ▼                                             │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                  Caddy Edge Reverse Proxy (Systemd Service)                  │     │
│   │   • Automatic Let's Encrypt TLS 1.3 Certificate Lifecycle &amp; OCSP Stapling   │     │
│   │   • Strict Security Headers (HSTS, CSP, X-Content-Type-Options)              │     │
│   │   • Gzip / Zstandard On-The-Fly Compression                                 │     │
│   └──────────────────────────────────────┬───────────────────────────────────────┘     │
│                                          │ http://127.0.0.1:8080                       │
│                                          ▼                                             │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                   Docker Compose Stack (Local Loopback Only)                 │     │
│   │   [Web Nginx SPA] ──► [API Node.js] ──► [Postgres 16] &amp; [Redis 7]            │     │
│   └──────────────────────────────────────┬───────────────────────────────────────┘     │
│                                          │                                             │
│                                          ▼ (Daily Cron / Systemd Timer)                │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │           Encrypted Off-Site Backup Pipeline (Restic / pg_dump)              │     │
│   │   • Atomic snapshot compressed with Zstandard                                │     │
│   │   • Client-side AES-256 encryption pushed to S3-compatible Object Storage    │     │
│   └──────────────────────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: Host Hardening with Cloud-Init / Bash</h3>
<p>Never manually configure a server over SSH without documenting the configuration in code. Use a cloud-init script or baseline provisioning recipe:</p>

<pre data-lang="shell"><code class="language-bash">#!/usr/bin/env bash
set -euo pipefail

echo "=== 1. Updating base operating system &amp; installing security packages ==="
export DEBIAN_FRONTEND=noninteractive
apt-get update &amp;&amp; apt-get upgrade -y
apt-get install -y ufw fail2ban unattended-upgrades curl git jq restic

echo "=== 2. Creating unprivileged deployer user with SSH access ==="
useradd -m -s /bin/bash -G sudo deployer
mkdir -p /home/deployer/.ssh
chmod 700 /home/deployer/.ssh
# Paste public SSH key (NEVER allow passwords)
cat &lt;&lt; 'EOF' &gt; /home/deployer/.ssh/authorized_keys
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExampleKeyForDeployerUserSecurity admin@workstation
EOF
chmod 600 /home/deployer/.ssh/authorized_keys
chown -R deployer:deployer /home/deployer/.ssh

echo "=== 3. Hardening SSH Daemon Configuration ==="
cat &lt;&lt; 'EOF' &gt; /etc/ssh/sshd_config.d/99-hardened.conf
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
X11Forwarding no
MaxAuthTries 3
AllowUsers deployer
EOF
systemctl restart ssh

echo "=== 4. Enforcing Strict Firewall (UFW) ==="
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH Access'
ufw allow 80/tcp comment 'HTTP ACME Challenge'
ufw allow 443/tcp comment 'HTTPS TLS'
ufw allow 443/udp comment 'HTTP/3 QUIC'
ufw --force enable

echo "=== 5. Enabling Automatic Security Upgrades ==="
systemctl enable unattended-upgrades
systemctl start unattended-upgrades

echo "=== Host Baseline Hardening Complete ==="</code></pre>

<h3>Part 2: DNS Records &amp; CAA Security</h3>
<p>Configure the following DNS records at your registrar or DNS provider (Cloudflare, Route53, Namecheap):</p>

<table>
  <tr><th>Type</th><th>Host</th><th>Value</th><th>Purpose</th></tr>
  <tr><td><code>A</code></td><td><code>yourapp.domain.com</code></td><td><code>203.0.113.10</code> (Your VM IPv4)</td><td>Directs IPv4 traffic to host</td></tr>
  <tr><td><code>AAAA</code></td><td><code>yourapp.domain.com</code></td><td><code>2001:db8::10</code> (Your VM IPv6)</td><td>Directs modern IPv6 traffic</td></tr>
  <tr><td><code>CAA</code></td><td><code>@</code></td><td><code>0 issue "letsencrypt.org"</code></td><td>Blocks unauthorized Certificate Authorities from issuing spoofed certificates</td></tr>
</table>

<h3>Part 3: The Caddy Reverse Proxy Configuration</h3>
<p>Unlike Nginx (which requires complex Certbot renewal scripts, Diffie-Hellman parameter generation, and manual TLS cipher selection), <b>Caddy</b> negotiates TLS 1.3 certificates automatically, handles renewal in the background, and enables HTTP/3 with zero hassle:</p>

<pre data-lang="caddy"><code class="language-caddy"># /etc/caddy/Caddyfile

yourapp.domain.com {
    # Encode responses with Zstandard or Gstandard
    encode zstd gzip

    # Modern Security Headers
    header {
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "camera=(), microphone=(), geolocation=()"
    }

    # Proxy all traffic to the Docker Compose web ingress
    reverse_proxy 127.0.0.1:80 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }

    # Custom log format for audit analysis
    log {
        output file /var/log/caddy/access.log {
            roll_size 10MB
            roll_keep 10
        }
    }
}</code></pre>

<h3>Part 4: Encrypted Off-Site Backup Pipeline with Restic</h3>
<div class="callout warn"><b class="t">The Immutable Law of Backups</b>
<p>An untested backup is purely theoretical. If you have not restored your database from an encrypted backup into a clean instance and verified user records, <b>you do not have a backup system—you have a wish list</b>.</p>
</div>

<p>Create <code>/opt/scripts/backup.sh</code> managed by a <code>systemd.timer</code>:</p>

<pre data-lang="shell"><code class="language-bash">#!/usr/bin/env bash
set -euo pipefail

export RESTIC_REPOSITORY="s3:https://s3.eu-central-1.wasabisys.com/freshpulse-backups"
export RESTIC_PASSWORD_FILE="/etc/restic-password.txt"
export AWS_ACCESS_KEY_ID="WASABI_KEY_ID"
export AWS_SECRET_ACCESS_KEY="WASABI_SECRET_KEY"

BACKUP_TEMP=$(mktemp -d)
trap 'rm -rf "\${BACKUP_TEMP}"' EXIT

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="\${BACKUP_TEMP}/postgres_\${TIMESTAMP}.sql.zst"

echo "=== 1. Creating streaming compressed Postgres snapshot ==="
docker compose -f /opt/app/compose.yaml exec -T postgres \\
  pg_dump -U appuser -d freshpulse --format=custom \\
  | zstd -3 > "\${DUMP_FILE}"

echo "=== 2. Encrypting &amp; pushing snapshot to Object Storage ==="
restic backup "\${DUMP_FILE}" --tag "database" --tag "automated"

echo "=== 3. Pruning snapshots older than 30 days ==="
restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 12 --prune

echo "=== Backup completed successfully at $(date) ==="</code></pre>

<h3>Part 5: The Disaster Recovery Restore Drill</h3>
<p>Run this verification drill on your local machine or a scratch test container to verify disaster readiness:</p>

<pre data-lang="shell"><code class="language-bash"># 1. Fetch latest snapshot from remote object storage
restic restore latest --target /tmp/restore_drill/ --tag database

# 2. Boot clean Postgres container
docker run -d --name restore_test -e POSTGRES_PASSWORD=test -p 5439:5432 postgres:16-alpine
sleep 3

# 3. Restore dump into fresh database
zstd -d /tmp/restore_drill/tmp/*.sql.zst --stdout \\
  | docker exec -i restore_test pg_restore -U postgres -d postgres

# 4. Verify record count matches production
docker exec -i restore_test psql -U postgres -d postgres -c "SELECT count(*) FROM orders;"</code></pre>

<details class="ex">
  <summary><b>Drill: What happens if port 5432 is bound to \`0.0.0.0\` in \`compose.yaml\`?</b> (Click to expand)</summary>
  <p><b>Scenario:</b> In <code>compose.yaml</code>, you specify <code>ports: ["5432:5432"]</code> while having UFW firewall active.</p>
  <p><b>Question:</b> Does UFW block external attackers on the internet from connecting to Postgres?</p>
  <div class="callout warn">
    <p><b>Answer: NO! Docker bypasses UFW rules by default!</b></p>
    <p>Docker directly manipulates the Linux kernel's <code>iptables</code> raw routing tables (the <code>PREROUTING</code> chain). When you publish a port with <code>ports: ["5432:5432"]</code>, Docker opens the port in <code>iptables</code> <b>before</b> UFW filtering rules ever execute!</p>
    <p>To safely expose ports only to the internal machine, always bind explicitly to loopback: <code>ports: ["127.0.0.1:5432:5432"]</code> or keep database containers purely on internal Docker bridge networks without host port bindings.</p>
  </div>
</details>
`;export{e as default};

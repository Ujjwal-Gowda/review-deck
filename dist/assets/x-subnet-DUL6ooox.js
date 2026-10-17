const e=`<p class="goal">Reading and designing IP address plans: the maths behind every VPC, firewall rule and home router.</p>
<h3>CIDR notation</h3>
<p><code>192.168.68.0/22</code> means the first <b>22 bits</b> identify the network and the remaining 10 bits identify hosts: 2¹⁰ = 1024 addresses (1022 usable, since the first is the network address and the last is broadcast).</p>
<div class="diagram">192.168.68.0/22
binary:  11000000.10101000.010001|00.00000000
         ───────── network (22) ─┘└─ hosts (10)
mask:    255.255.252.0      range: 192.168.68.0 – 192.168.71.255
so 192.168.68.222 (your print hub) and 192.168.70.5 are on the SAME subnet: they talk directly, no router</div>
<table>
<tr><th>Prefix</th><th>Addresses</th><th>Typical use</th></tr>
<tr><td>/32</td><td>1</td><td>a single host (firewall rules)</td></tr>
<tr><td>/24</td><td>256</td><td>a small LAN or subnet</td></tr>
<tr><td>/20</td><td>4,096</td><td>a cloud subnet</td></tr>
<tr><td>/16</td><td>65,536</td><td>a whole VPC</td></tr>
<tr><td>/0</td><td>everything</td><td><code>0.0.0.0/0</code> = "anywhere" (dangerous in inbound rules)</td></tr>
</table>
<pre data-lang="python"><code class="language-python">import ipaddress
net = ipaddress.ip_network("10.0.0.0/16")
list(net.subnets(new_prefix=20))[:3]          # carve a VPC into /20 subnets
ipaddress.ip_address("10.0.17.5") in ipaddress.ip_network("10.0.16.0/20")   # True</code></pre>
<h3>Routing</h3>
<p>Each host has a <b>routing table</b> (<code>ip route</code>). The most specific matching prefix wins; <code>default</code> (0.0.0.0/0) goes to the gateway. Cloud route tables work the same way.</p>
<h3>IPv6</h3>
<p>128-bit addresses (<code>2001:db8::1</code>), typically a /64 per subnet, no NAT needed, and every device can have a globally routable address. That means firewalls matter even more. Most networks run both (dual stack).</p>
<p>Plan ranges so they never overlap: VPCs, office LANs and VPNs (Tailscale uses 100.64.0.0/10) must stay distinct if you ever connect them.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>0.1 <span class="levels">basic</span> Split <code>10.20.0.0/16</code> into 4 equal subnets. What are their ranges, and which subnet contains <code>10.20.130.7</code>?</summary><div><p>Four /18s: 10.20.0.0–63.255, 10.20.64.0–127.255, 10.20.128.0–191.255, 10.20.192.0–255.255. So 10.20.130.7 is in the third one, 10.20.128.0/18. Check with <code>ipaddress</code>.</p></div></details>
</div>
`;export{e as default};

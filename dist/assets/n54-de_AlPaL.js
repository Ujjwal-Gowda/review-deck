const e=`<p class="goal">How Linux organises files, what an inode is, and where to look when a disk fills up.</p>
<h3>The hierarchy</h3>
<table>
<tr><th>Path</th><th>Contains</th></tr>
<tr><td><code>/etc</code></td><td>system configuration (text files)</td></tr>
<tr><td><code>/home/ujjwal</code></td><td>your files; dot-files are per-user config (<code>~/.zshrc</code>, <code>~/.config/</code>)</td></tr>
<tr><td><code>/usr/bin</code>, <code>/usr/lib</code></td><td>installed programs and libraries (managed by the package manager)</td></tr>
<tr><td><code>/usr/local</code>, <code>/opt</code></td><td>software installed outside the package manager</td></tr>
<tr><td><code>/var</code></td><td>variable data: <code>/var/log</code>, <code>/var/lib</code> (databases, Docker), caches</td></tr>
<tr><td><code>/tmp</code></td><td>temporary files, often RAM-backed (tmpfs) and cleared on reboot</td></tr>
<tr><td><code>/proc</code>, <code>/sys</code></td><td>virtual: the kernel's live view of processes and hardware (<code>cat /proc/meminfo</code>)</td></tr>
<tr><td><code>/dev</code></td><td>devices as files (<code>/dev/sda</code>, <code>/dev/null</code>, <code>/dev/urandom</code>)</td></tr>
<tr><td><code>/mnt</code>, <code>/media</code></td><td>mount points for other disks</td></tr>
</table>
<h3>Inodes and links</h3>
<p>A file's name is just a directory entry pointing to an <b>inode</b>, which holds the metadata (size, owner, permissions, timestamps) and the locations of the data blocks. <code>ls -i</code> shows inode numbers.</p>
<pre data-lang="shell"><code class="language-bash">ln file hard       # hard link: a second name for the SAME inode; data lives until every name is deleted
ln -s file soft    # symlink: a tiny file containing a path; breaks if the target moves
stat file          # the full inode info</code></pre>
<p>That's why deleting a file that a running process still has open doesn't free its space until the process closes it. <code>lsof +L1</code> lists such files.</p>
<h3>Disks and mounts</h3>
<pre data-lang="shell"><code class="language-bash">lsblk -f                  # disks, partitions, filesystems, mount points
df -h                     # free space per mounted filesystem
df -i                     # free INODES (millions of tiny files can exhaust them before bytes)
du -sh ~/* | sort -h      # what is big in home?
ncdu ~                    # interactive explorer: the best tool for "where did my disk go?"
sudo mount -o ro,noload /dev/sda1 /mnt   # read-only mount (the right way to handle a failing disk)</code></pre>
<p>Filesystems you'll meet: <b>ext4</b> (the Linux default), <b>btrfs</b> (snapshots), <b>xfs</b>, <b>vfat/exfat</b> (USB sticks), <b>ntfs</b> (Windows), <b>tmpfs</b> (RAM). <code>/etc/fstab</code> lists what gets mounted at boot.</p>
<details class="ex"><summary>54.1 <span class="levels">basic</span> Find the 10 largest directories under your home without descending into node_modules.</summary><div><p><code>du -h --exclude=node_modules -d 2 ~ 2&gt;/dev/null | sort -h | tail -10</code>, or run <code>ncdu</code> and press <code>d</code> to delete interactively.</p></div></details>
`;export{e as default};

const e=`<p class="goal">What a container really is: an ordinary Linux process with walls around it, not a small VM.</p>
<h3>The problem containers solve</h3>
<p>"It works on my machine" happens because the app depends on things outside its code: a runtime version, system libraries, env vars, file paths, other services. A container packages the app <b>with its whole userland filesystem</b> and runs it isolated, so it behaves the same on your laptop, in CI and in production.</p>
<h3>The kernel features underneath</h3>
<table>
<tr><th>Feature</th><th>Isolates / limits</th></tr>
<tr><td><b>Namespaces</b></td><td>what the process can <i>see</i>: its own PID tree (it thinks it's PID 1), network stack, mounts, hostname, users</td></tr>
<tr><td><b>cgroups</b></td><td>what it can <i>use</i>: CPU, memory, I/O, number of processes</td></tr>
<tr><td>Union / overlay filesystem</td><td>stacked read-only image layers plus a thin writable layer</td></tr>
<tr><td>seccomp, capabilities, AppArmor</td><td>which system calls and privileges are allowed</td></tr>
</table>
<pre data-lang="shell"><code class="language-bash">docker run --rm -it --memory 256m --cpus 0.5 alpine sh    # inside: ps shows only your processes; hostname differs
ps aux | grep containerd-shim                               # on the host: it's just processes</code></pre>
<table>
<tr><th></th><th>Container</th><th>Virtual machine</th></tr>
<tr><td>Kernel</td><td><b>shared</b> with the host</td><td>its own guest kernel</td></tr>
<tr><td>Start time / overhead</td><td>milliseconds / MBs</td><td>seconds to minutes / GBs</td></tr>
<tr><td>Isolation</td><td>good (process-level)</td><td>strong (hardware-level)</td></tr>
<tr><td>Runs other OSes</td><td>no (Linux containers need a Linux kernel; Docker Desktop hides a VM on Mac and Windows)</td><td>yes</td></tr>
</table>
<p><b>Ecosystem names:</b> Docker (the tooling), containerd/runc (the runtimes underneath), Podman (daemonless and rootless, Docker-compatible), and OCI (the open standard for images and runtimes).</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>112.1 <span class="levels">basic</span> Run <code>docker run --rm -it alpine sh</code>, then inside run <code>ps</code>, <code>hostname</code> and <code>ip addr</code>. On the host, find the same process with <code>ps</code>.</summary><div><p>Inside, PID 1 is <code>sh</code>, with its own hostname and network. On the host it's an ordinary process under containerd-shim: namespaces, not a VM.</p></div></details>
</div>
`;export{e as default};

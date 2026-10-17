const e=`<p class="goal">Keeping data when containers are replaced, and sharing files between the host and containers.</p>
<pre data-lang="shell"><code class="language-bash">docker volume create pgdata
docker run -d -v pgdata:/var/lib/postgresql/data postgres:17   # NAMED volume: managed by Docker, survives container removal
docker run --rm -v "$PWD":/app -w /app node:22 npm test        # BIND mount: a host folder appears inside (dev workflows)
docker run --rm --tmpfs /tmp alpine                             # tmpfs: in RAM, gone on stop
docker volume ls; docker volume inspect pgdata                  # data lives under /var/lib/docker/volumes/…
docker run --rm -v pgdata:/data -v "$PWD":/backup alpine tar czf /backup/pg.tgz -C /data .   # back up a volume</code></pre>
<table>
<tr><th>Type</th><th>Use for</th><th>Watch out for</th></tr>
<tr><td>Named volume</td><td>databases, uploads: data the app owns</td><td>deleted by <code>docker compose down -v</code> or <code>volume prune</code></td></tr>
<tr><td>Bind mount</td><td>live-reloading source code in dev; config files</td><td>host UID/GID permission mismatches; slow on Mac/Windows</td></tr>
<tr><td>tmpfs</td><td>scratch and sensitive temporary data</td><td>counts against memory</td></tr>
</table>
<p><b>The golden rule:</b> containers are cattle, so anything written to the container's own filesystem disappears when it's replaced. Every piece of state lives in a volume, a database or object storage.</p>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>115.1 <span class="levels">basic</span> Run Postgres with a named volume, insert data, delete the container, start a new one on the same volume, and confirm the data survived.</summary><div><p>The data lives in the volume, not the container. Also run <code>docker compose down -v</code> once to see how easily volumes, and their data, get deleted.</p></div></details>
</div>
`;export{e as default};

const e=`<p class="goal">Defining a whole multi-service stack in one file and running it with one command.</p>
<pre data-lang="yaml"><code class="language-yaml"># compose.yaml
services:
  api:
    build: ./api
    ports: ["8080:8080"]
    environment:
      DATABASE_URL: postgres://shop:\${DB_PASSWORD}@db:5432/shop     # from .env next to compose.yaml
      REDIS_URL: redis://redis:6379
    depends_on:
      db: { condition: service_healthy }        # wait for READY, not just "started"
      redis: { condition: service_started }
    restart: unless-stopped
  worker:
    build: ./api
    command: ["node", "dist/worker.js"]          # same image, different process
    depends_on: [db, redis]
  web:
    build: ./web
    ports: ["3000:80"]
  db:
    image: postgres:17
    environment: { POSTGRES_USER: shop, POSTGRES_PASSWORD: "\${DB_PASSWORD}", POSTGRES_DB: shop }
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck: { test: ["CMD-SHELL", "pg_isready -U shop"], interval: 5s, retries: 10 }
  redis:
    image: redis:7-alpine
  adminer:
    image: adminer
    ports: ["8081:8080"]
    profiles: [tools]                            # only with: docker compose --profile tools up
volumes:
  pgdata:</code></pre>
<pre data-lang="shell"><code class="language-bash">docker compose up -d --build        # build + start everything in the background
docker compose ps; docker compose logs -f api
docker compose exec db psql -U shop # a shell or psql inside a running service
docker compose down                 # stop + remove containers (add -v to ALSO delete volumes: data gone!)
docker compose watch                # dev: sync or rebuild on file changes</code></pre>
<p>Compose creates a network for the project automatically, so services reach each other by name. Use <code>compose.override.yaml</code> for dev-only settings (bind mounts, debug ports). Compose is great for development and for single-server production; beyond one machine you move to Kubernetes or a managed platform.</p>
<details class="ex"><summary>118.1 <span class="levels">think</span> Containerise one of your projects (the printer-doctor app, say) with its dependencies in Compose, so a teammate can run it with <code>docker compose up</code> and nothing else.</summary><div><p>Work through the ladder: a Dockerfile for the app; a service per dependency; env vars in <code>.env</code> (committing a <code>.env.example</code>); healthchecks plus <code>depends_on</code> conditions; a named volume for data. Test it from a fresh clone.</p></div></details>
<div class="callout seclens"><b class="t">Security lens · Compose</b><p>Don't publish database ports in production Compose files, and keep <code>.env</code> out of git. Compose is often the first place secrets leak.</p></div>
`;export{e as default};

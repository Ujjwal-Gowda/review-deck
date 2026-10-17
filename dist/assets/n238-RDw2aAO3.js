const e=`<p class="goal">Project 4: Production Containerization &amp; Orchestration. Package the full stack into hardened, minimal, reproducible multi-stage images with Docker Compose.</p>

<h3>The Realities of Production Containers</h3>
<p>Most Docker tutorials teach patterns that would get you instantly flagged in an enterprise security review: running as <code>root</code>, copying the entire repository including <code>.git</code> and <code>node_modules</code> into a 1.4 GB bloated Debian image, storing database passwords directly in the image layers, and launching the container without signal handlers (so <code>docker stop</code> hangs for 10 seconds before forcefully murdering the container with <code>SIGKILL</code>).</p>

<p>In this capstone, you will containerize the full-stack architecture from Project 3 using multi-stage builds, distroless/alpine non-root runtimes, layer caching mounts, health-checked dependency graphs, and a <code>compose.yaml</code> that boots the entire cluster cleanly with a single command.</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Host Docker Network                                    │
│                                                                                        │
│   ┌────────────────────────────────────────┐                                           │
│   │        web (Nginx Unprivileged)        │                                           │
│   │   • Serves optimized React 19 bundle   │                                           │
│   │   • SPA route fallback to /index.html  │                                           │
│   │   • Reverse proxies /api → api:3000    │                                           │
│   └───────────────────┬────────────────────┘                                           │
│                       │ http://api:3000 (Internal Bridge Network)                      │
│                       ▼                                                                │
│   ┌────────────────────────────────────────┐                                           │
│   │           api (Node / Alpine)          │                                           │
│   │   • Non-root user \`node\` (UID 1000)    │                                           │
│   │   • Read-only root filesystem          │                                           │
│   │   • Fast tsc runtime (28 MB image)     │                                           │
│   └───────────┬─────────────────┬──────────┘                                           │
│               │                 │                                                      │
│    depends_on │ (healthy)       │ depends_on (healthy)                                 │
│               ▼                 ▼                                                      │
│   ┌───────────────────────┐ ┌───────────────────────┐                                  │
│   │       postgres        │ │         redis         │                                  │
│   │   • Named Data Volume │ │   • AOF Persistence   │                                  │
│   │   • Healthcheck query │ │   • PING Healthcheck  │                                  │
│   └───────────────────────┘ └───────────────────────┘                                  │
│               ▲                                                                        │
│               │ depends_on (completed_successfully)                                    │
│   ┌───────────┴───────────┐                                                            │
│   │       migrator        │                                                            │
│   │  (One-shot SQL runner)│                                                            │
│   └───────────────────────┘                                                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: The Hardened Node.js Multi-Stage Dockerfile</h3>
<p>Notice the discipline in this Dockerfile: separation of dependencies, layer caching with BuildKit, compilation step, and an execution stage running as an unprivileged user.</p>

<pre data-lang="dockerfile"><code class="language-dockerfile"># syntax=docker/dockerfile:1.7
# -------------------------------------------------------------------
# Stage 1: Base Dependencies
# -------------------------------------------------------------------
FROM node:22-alpine AS dependencies
WORKDIR /app

# Install native compilation dependencies only if needed, then strip
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
# Use BuildKit cache mount to prevent redownloading npm packages on unchanged manifests
RUN --mount=type=cache,target=/root/.npm \\
    npm ci --include=dev

# -------------------------------------------------------------------
# Stage 2: Application Builder
# -------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript to /app/dist
RUN npm run build && \\
    npm prune --omit=dev

# -------------------------------------------------------------------
# Stage 3: Minimal Hardened Production Runtime
# -------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install dumb-init to properly handle PID 1 signal forwarding (SIGTERM / SIGINT)
RUN apk add --no-cache dumb-init

# Use pre-existing unprivileged user created in standard Alpine node image
USER node

# Copy only production artifacts with correct ownership
COPY --chown=node:node package.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000

# Native healthcheck inside the container
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]</code></pre>

<h3>Part 2: The React SPA + Nginx Hardened Dockerfile</h3>
<p>Frontends do not need Node.js in production! A compiled React app is simply a directory of static <code>.html</code>, <code>.js</code>, and <code>.css</code> assets. Serve them with a high-performance, unprivileged Nginx web server:</p>

<pre data-lang="dockerfile"><code class="language-dockerfile"># -------------------------------------------------------------------
# Stage 1: Compile React Frontend
# -------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

# -------------------------------------------------------------------
# Stage 2: Serve with Non-Root Nginx
# -------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:alpine-slim AS runner

# Copy custom Nginx configuration for SPA routing & reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \\
  CMD wget --spider http://127.0.0.1:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]</code></pre>

<h4>The Custom \`nginx.conf\`</h4>
<pre data-lang="nginx"><code class="language-nginx">server {
    listen 8080;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Healthcheck endpoint for Docker & load balancers
    location /health {
        access_log off;
        return 200 "healthy\\n";
    }

    # Proxy API traffic directly to the backend container
    location /api/ {
        proxy_pass http://api:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SPA Routing: Fallback all unrecognised client routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}</code></pre>

<h3>Part 3: The Complete \`compose.yaml\` Architecture</h3>
<p>A production-ready Compose specification coordinates database readiness, one-shot migration tasks, resource constraints, and isolated networks:</p>

<pre data-lang="yaml"><code class="language-yaml">services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${DB_USER:-appuser}
      POSTGRES_PASSWORD: \${DB_PASSWORD:-supersecret}
      POSTGRES_DB: \${DB_NAME:-freshpulse}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend-tier
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${DB_USER:-appuser} -d \${DB_NAME:-freshpulse}"]
      interval: 5s
      timeout: 3s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes", "--maxmemory", "256mb", "--maxmemory-policy", "allkeys-lru"]
    volumes:
      - redis_data:/data
    networks:
      - backend-tier
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  # One-shot container that applies database migrations before API boots
  migrator:
    build:
      context: ./backend
      target: runner
    command: ["node", "dist/scripts/migrate.js"]
    environment:
      DATABASE_URL: postgres://\${DB_USER:-appuser}:\${DB_PASSWORD:-supersecret}@postgres:5432/\${DB_NAME:-freshpulse}
    networks:
      - backend-tier
    depends_on:
      postgres:
        condition: service_healthy

  api:
    build:
      context: ./backend
      target: runner
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgres://\${DB_USER:-appuser}:\${DB_PASSWORD:-supersecret}@postgres:5432/\${DB_NAME:-freshpulse}
      REDIS_URL: redis://redis:6379
    networks:
      - frontend-tier
      - backend-tier
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      migrator:
        condition: service_completed_successfully

  web:
    build:
      context: ./frontend
      target: runner
    restart: unless-stopped
    ports:
      - "\${PORT:-80}:8080"
    networks:
      - frontend-tier
    depends_on:
      api:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:

networks:
  frontend-tier:
  backend-tier:
    internal: true # Database & Redis are completely unreachable from outside host network!</code></pre>

<h3>Part 4: Security Audits &amp; Image Profiling</h3>
<p>Before deploying containers to production, verify them using industry standard diagnostic tools:</p>

<div class="callout key"><b class="t">Container Quality Checklist</b>
<ul>
  <li><b>Vulnerability Scan with Trivy:</b> <code>trivy image freshpulse-api:latest --severity HIGH,CRITICAL</code> (Ensure 0 critical CVEs).</li>
  <li><b>Layer &amp; Wasted Space Inspection with Dive:</b> <code>dive freshpulse-api:latest</code> (Target image efficiency score &gt; 95%).</li>
  <li><b>Non-Root Audit:</b> <code>docker run --rm freshpulse-api:latest whoami</code> must print <code>node</code>, NOT <code>root</code>.</li>
</ul>
</div>

<details class="ex">
  <summary><b>Drill: Why does \`docker compose up\` crash without \`service_healthy\`?</b> (Click to expand)</summary>
  <p><b>Scenario:</b> You configure <code>depends_on: [postgres]</code>. When you run <code>docker compose up</code>, your API immediately crashes with <code>ECONNREFUSED 127.0.0.1:5432</code>.</p>
  <p><b>Question:</b> Why does standard <code>depends_on</code> fail, and why is <code>condition: service_healthy</code> required?</p>
  <div class="callout note">
    <p><b>Answer:</b> Standard <code>depends_on</code> only waits for the Postgres container process to start. But Postgres takes 2–4 seconds to initialize the database cluster, replay WAL logs, and open TCP listening sockets. If the API boots during this window, the TCP port is closed.</p>
    <p>Using <code>condition: service_healthy</code> forces Docker to poll <code>pg_isready</code> and only release the API once PostgreSQL explicitly reports it is ready to accept queries.</p>
  </div>
</details>
`;export{e as default};

const e=`<p class="goal">Project 5: Automated Production Delivery Pipeline. Construct a bulletproof CI/CD system with GitHub Actions, OIDC cloud security, and automated zero-downtime rollbacks.</p>

<h3>The Realities of Continuous Delivery</h3>
<p>In high-performing software engineering teams (as measured by DORA metrics), shipping code is not a nerve-wracking midnight ritual involving SSH terminals, manual database commands, and praying nothing breaks. It is a completely automated, deterministic conveyor belt. Every pull request is validated against parallel integration test suites, images are compiled and cryptographically verified, and deployments execute without a single millisecond of user downtime.</p>

<p>In this capstone, you will construct an enterprise-grade CI/CD pipeline. You will eliminate long-lived cloud credentials using <b>OIDC (OpenID Connect)</b>, accelerate Docker builds with GitHub Actions Cache mounts (<code>gha</code>), enforce branch protection rules, and implement automated health-checked rollbacks.</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                Pull Request Created / Updated                          │
│                                                                                        │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                        Parallel Validation Matrix (CI)                       │     │
│   │  ┌────────────────────┐   ┌────────────────────────┐   ┌───────────────────┐ │     │
│   │  │ Lint &amp; Typecheck   │   │ Integration (Postgres) │   │ Playwright E2E    │ │     │
│   │  │ (tsc, eslint)      │   │ (Live ephemeral DB)    │   │ (Headless Chrome) │ │     │
│   │  └────────────────────┘   └────────────────────────┘   └───────────────────┘ │     │
│   └──────────────────────────────────────┬───────────────────────────────────────┘     │
└──────────────────────────────────────────┼─────────────────────────────────────────────┘
                                           │ Merge to \`main\` branch
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Automated Build &amp; Publish                                 │
│  • GitHub OIDC Token Exchange (Zero static API keys stored in secrets)                 │
│  • Multi-stage Docker build with GHA cache (Sub-30s compilation)                       │
│  • Push to GitHub Container Registry (GHCR) tagged with commit SHA: \`sha-a1b2c3d\`      │
│  • Vulnerability Scan with Trivy (Block deployment on CVE CVSS &gt;= 8.0)                 │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           Staging Deployment &amp; Smoke Test                              │
│  • Deploy to Staging Environment → Run automated HTTP &amp; Database smoke checks          │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼ (Manual Gate: \`environment: production\`)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        Production Blue-Green Zero-Downtime Rollout                     │
│                                                                                        │
│     [Old Version: Green (Active)] ───────────► [New Version: Blue (Booting)]           │
│                                                              │                         │
│                                                   Run Health Probe (/health)           │
│                                                   /               \\                    │
│                                        Passed 200 OK             Failed / Timeout      │
│                                             │                            │             │
│                                  Switch Ingress Traffic       Abort &amp; Maintain Active  │
│                                  Terminate Green Version      Green (Zero Disruption)  │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: The Secure CI Pipeline with Ephemeral Postgres</h3>
<p>Create <code>.github/workflows/ci.yaml</code>. Notice the security posture: strict permissions, concurrency cancellation on new pushes, and action pinning to full immutable commit SHAs.</p>

<pre data-lang="yaml"><code class="language-yaml">name: Continuous Integration

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

# Cancel in-progress runs on new commits to save GitHub Actions compute minutes
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  static-analysis:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1

      - name: Setup Node.js Runtime
        uses: actions/setup-node@60edb5dd545a775178f525247059d3517833f713 # v4.0.2
        with:
          node-version: 22
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Typecheck TypeScript
        run: npm run typecheck

      - name: Lint Codebase
        run: npm run lint

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
          --health-timeout 3s
          --health-retries 5

    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
      - uses: actions/setup-node@60edb5dd545a775178f525247059d3517833f713 # v4.0.2
        with:
          node-version: 22
          cache: 'npm'

      - run: npm ci

      - name: Run Database Migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgres://testuser:testpassword@localhost:5432/testdb

      - name: Execute Vitest Integration Suite
        run: npm run test:integration
        env:
          DATABASE_URL: postgres://testuser:testpassword@localhost:5432/testdb</code></pre>

<h3>Part 2: Fast Container Build with GitHub Actions Cache (GHA)</h3>
<p>Standard Docker builds in CI start from zero on every run, re-downloading hundreds of megabytes. By leveraging BuildKit's <code>gha</code> cache backend, only modified layers recompile:</p>

<pre data-lang="yaml"><code class="language-yaml">  build-and-publish:
    needs: [static-analysis, integration-tests]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write # Required to push to GHCR

    steps:
      - uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@f95db51fddba0c2d1ec667646a06c2ce06100226 # v3.0.0

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@343f7c4344506bcbf9b4de18042ae17996df046d # v3.0.0
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Extract Metadata &amp; Tags
        id: meta
        uses: docker/metadata-action@8e5442c4ef9f78752691e2d8f8d19755c6f78e81 # v5.5.1
        with:
          images: ghcr.io/\${{ github.repository }}/api
          tags: |
            type=sha,prefix=sha-,format=short
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@4a13e500e05cf64e737e56893549740d75a8eebe # v5.1.0
        with:
          context: ./backend
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max</code></pre>

<h3>Part 3: Security: Why OpenID Connect (OIDC) Replaces Long-Lived API Keys</h3>
<div class="callout seclens"><b class="t">The Risk of Storing AWS/Cloud Secret Keys in CI</b>
<p>If you generate an IAM user with <code>AWS_ACCESS_KEY_ID</code> and store it in GitHub Secrets, that key never expires. If an attacker breaches a third-party action or extracts environment secrets via a rogue pull request, your entire cloud infrastructure is compromised until you manually revoke the key.</p>
</div>

<p>With <b>OIDC</b>, your CI runner requests a short-lived cryptographically signed JWT token from GitHub's token authority. Your cloud provider (AWS, GCP, Azure) validates the signature against GitHub's public OIDC keys and grants temporary 15-minute IAM permissions tied strictly to your specific repository and branch.</p>

<pre data-lang="yaml"><code class="language-yaml"># Example OIDC Authentication with AWS
- name: Authenticate to AWS via OIDC
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/GitHubDeployRole
    aws-region: us-east-1
    audience: sts.amazonaws.com</code></pre>

<h3>Part 4: Zero-Downtime Blue-Green Rollout &amp; Auto-Rollback Script</h3>
<p>Here is the automated deployment verification script running on the deployment target:</p>

<pre data-lang="shell"><code class="language-bash">#!/usr/bin/env bash
set -euo pipefail

NEW_IMAGE="ghcr.io/org/api:sha-\${GITHUB_SHA:0:7}"
OLD_CONTAINER="api_active"
NEW_CONTAINER="api_candidate"

echo "=== Pulling immutable release artifact: \${NEW_IMAGE} ==="
docker pull "\${NEW_IMAGE}"

echo "=== Booting candidate container on port 3001 ==="
docker run -d --name "\${NEW_CONTAINER}" \\
  --network internal-net \\
  --env-file /etc/app/production.env \\
  -p 3001:3000 \\
  "\${NEW_IMAGE}"

echo "=== Running synthetic health probes against candidate ==="
HEALTHY=false
for i in {1..12}; do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3001/health || true)
  if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "Probe $i: Healthcheck 200 OK!"
    HEALTHY=true
    break
  fi
  echo "Probe $i: Waiting for candidate to become healthy (HTTP $HTTP_STATUS)..."
  sleep 3
done

if [ "$HEALTHY" = true ]; then
  echo "=== Candidate verified healthy. Flipping Nginx upstream to port 3001 ==="
  sed -i 's/proxy_pass http:\\/\\/127.0.0.1:3000/proxy_pass http:\\/\\/127.0.0.1:3001/g' /etc/nginx/sites-available/app.conf
  nginx -s reload

  echo "=== Gracefully stopping previous container ==="
  docker stop "\${OLD_CONTAINER}" || true
  docker rm "\${OLD_CONTAINER}" || true
  docker rename "\${NEW_CONTAINER}" "\${OLD_CONTAINER}"
  echo "=== Deployment Succeeded with Zero Downtime ==="
else
  echo "[FAIL] Candidate failed health checks! Triggering instant automatic rollback..."
  docker stop "\${NEW_CONTAINER}"
  docker rm "\${NEW_CONTAINER}"
  echo "Active production container was untouched. No user disruption."
  exit 1
fi</code></pre>

<details class="ex">
  <summary><b>Drill: Why pin Actions to commit SHAs instead of \`@v4\` tags?</b> (Click to expand)</summary>
  <p><b>Scenario:</b> You use <code>uses: third-party/action@v1</code> in your deployment pipeline.</p>
  <p><b>Question:</b> How can an attacker compromise your production servers without touching your repository?</p>
  <div class="callout warn">
    <p><b>Answer:</b> Git tags (like <code>v1</code> or <code>v1.2.0</code>) are mutable pointers! If an attacker compromises the maintainer's GitHub account, they can push malicious code and move the <code>v1</code> tag to point to their malware.</p>
    <p>Git commit SHAs (e.g. <code>b4ffde65f463...</code>) are immutable cryptographic hashes of the exact tree. Pinning to SHAs guarantees you run the exact audited code forever.</p>
  </div>
</details>
`;export{e as default};

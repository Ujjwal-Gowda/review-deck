const e=`<p class="goal">Project 7: Cloud-Native Orchestration with Kubernetes. Migrate the full-stack system to a declarative, self-healing Kubernetes cluster with zero-downtime rolling updates and autoscaling.</p>

<h3>The Mental Model of Kubernetes: Declarative Reconciliation</h3>
<p>In traditional server management, you issue imperative commands: <i>"start this process"</i>, <i>"restart if it crashes"</i>. If a kernel panic occurs at 3:00 AM, the process remains dead until an engineer wakes up. In Kubernetes, you declare the <b>Desired State</b> in YAML (<i>"I want 3 healthy replicas of the API, each using under 256MB RAM"</i>). The Kubernetes <b>Control Plane</b> runs a continuous reconciliation loop:</p>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               The Kubernetes Control Loop                              │
│                                                                                        │
│     ┌──────────────────┐          Compare          ┌────────────────────┐              │
│     │  Observed State  │ ◄───────────────────────► │   Desired State    │              │
│     │  (2 Pods Alive)  │                           │   (3 Pods in YAML) │              │
│     └────────┬─────────┘                           └────────────────────┘              │
│              │                                                                         │
│              ▼ Diff Detected (Under-replicated by 1 Pod)                               │
│     ┌────────────────────────────────────────────────────────────────────┐             │
│     │ Scheduler assigns new Pod to healthy Node ──► Kubelet boots Docker │             │
│     └────────────────────────────────────────────────────────────────────┘             │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<div class="diagram">
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                Cluster Network Architecture                            │
│                                                                                        │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                      Ingress Controller (Traefik / Nginx)                    │     │
│   │   • Routes https://api.domain.com/ ──► api-service:80                        │     │
│   │   • Routes https://app.domain.com/ ──► web-service:80                        │     │
│   └──────────────────────────────────────┬───────────────────────────────────────┘     │
│                                          │                                             │
│                                          ▼                                             │
│   ┌──────────────────────────────────────────────────────────────────────────────┐     │
│   │                     ClusterIP Service (Internal Load Balancer)               │     │
│   └──────────────┬───────────────────────────────┬───────────────────────────────┘     │
│                  │                               │                                     │
│                  ▼                               ▼                                     │
│   ┌──────────────────────────────┐┌──────────────────────────────┐                     │
│   │ Pod 1: API (v1.4)            ││ Pod 2: API (v1.4)            │                     │
│   │ • Readiness: HTTP 200 /ready ││ • Readiness: HTTP 200 /ready │                     │
│   │ • CPU: 50m / Mem: 120Mi      ││ • CPU: 48m / Mem: 118Mi      │                     │
│   └──────────────────────────────┘└──────────────────────────────┘                     │
│                  ▲                               ▲                                     │
│                  └───────────────┬───────────────┘                                     │
│                                  │ (Watches CPU metrics)                               │
│   ┌──────────────────────────────┴───────────────────────────────┐                     │
│   │        Horizontal Pod Autoscaler (HPA) [Min: 2, Max: 10]     │                     │
│   └──────────────────────────────────────────────────────────────┘                     │
└────────────────────────────────────────────────────────────────────────────────────────┘
</div>

<h3>Part 1: The Production-Grade Deployment Manifest</h3>
<p>Notice the vital production configurations: non-root security context, explicit memory/CPU requests, and separated liveness vs readiness probes.</p>

<pre data-lang="yaml"><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata:
  name: freshpulse-api
  labels:
    app.kubernetes.io/name: freshpulse-api
    app.kubernetes.io/part-of: freshpulse
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Boot 1 extra pod before killing old pod
      maxUnavailable: 0  # Never drop below desired replica count
  selector:
    matchLabels:
      app: freshpulse-api
  template:
    metadata:
      labels:
        app: freshpulse-api
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      containers:
        - name: api
          image: ghcr.io/org/freshpulse-api:v1.4.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
              name: http
          envFrom:
            - configMapRef:
                name: freshpulse-config
            - secretRef:
                name: freshpulse-secrets
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 256Mi
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
          # 1. Startup Probe: Allows slow initialization without premature killing
          startupProbe:
            httpGet:
              path: /health/startup
              port: http
            failureThreshold: 30
            periodSeconds: 2
          # 2. Readiness Probe: Controls whether traffic is routed to this pod
          readinessProbe:
            httpGet:
              path: /health/ready
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5
            timeoutSeconds: 2
          # 3. Liveness Probe: Restarts deadlocked / corrupted processes
          livenessProbe:
            httpGet:
              path: /health/live
              port: http
            initialDelaySeconds: 10
            periodSeconds: 10
            timeoutSeconds: 2</code></pre>

<h3>Part 2: Service &amp; Ingress Definition</h3>
<p>ClusterIP provides internal load balancing across all ready pods matching the label selector:</p>

<pre data-lang="yaml"><code class="language-yaml">apiVersion: v1
kind: Service
metadata:
  name: freshpulse-api-service
spec:
  type: ClusterIP
  selector:
    app: freshpulse-api
  ports:
    - name: http
      port: 80
      targetPort: 3000
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: freshpulse-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - api.freshpulse.internal
      secretName: freshpulse-api-tls
  rules:
    - host: api.freshpulse.internal
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: freshpulse-api-service
                port:
                  number: 80</code></pre>

<h3>Part 3: Horizontal Pod Autoscaler (HPA)</h3>
<p>Autoscale workloads automatically based on real-time traffic surges:</p>

<pre data-lang="yaml"><code class="language-yaml">apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: freshpulse-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: freshpulse-api
  minReplicas: 2
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70</code></pre>

<h3>Part 4: The Chaos Engineering Drill (Break it on Purpose!)</h3>
<p>To truly understand Kubernetes, you must observe its resilience mechanisms in action under simulated catastrophic failures:</p>

<pre data-lang="shell"><code class="language-bash"># Drill 1: Simulate node hardware death / Pod crash
kubectl delete pod -l app=freshpulse-api --now
# In another terminal running \`kubectl get pods -w\`, watch the ReplicaSet
# spawn fresh replacement pods in under 800ms!

# Drill 2: Deploy a broken container image
kubectl set image deployment/freshpulse-api api=ghcr.io/org/freshpulse-api:broken-tag
# Observe how the rollout pauses: old pods remain active, new pods fail readiness,
# zero user requests are dropped!
kubectl rollout undo deployment/freshpulse-api

# Drill 3: Simulate high traffic spike
kubectl run load-generator --rm -it --image=williamyeh/hey -- \\
  -z 60s -q 100 -c 20 http://freshpulse-api-service/health/ready
# Watch HPA scale pods up from 2 to 6 replicas:
kubectl get hpa freshpulse-api-hpa --watch</code></pre>

<div class="callout warn"><b class="t">The Fatal Difference: Liveness vs Readiness Probes</b>
<p><b>Readiness Probe:</b> <i>"Can I receive user traffic right now?"</i> (e.g. database connection is warm). If it fails, Kubernetes removes the pod from the Service load balancer. <b>The pod is not restarted.</b></p>
<p><b>Liveness Probe:</b> <i>"Is the internal process deadlocked / hung in an infinite loop?"</i> If it fails, Kubernetes <b>kills and restarts</b> the pod.</p>
<p><b>The Disaster Pattern:</b> Never check downstream dependencies (like PostgreSQL or Redis) inside your Liveness probe! If the database temporarily slows down under heavy load, all 10 API pods will fail their liveness checks simultaneously. Kubernetes will murder all 10 pods, trigger a cascading reboot loop, and take down the entire company!</p>
</div>

<details class="ex">
  <summary><b>Drill: What happens when a container exceeds its Memory Limit vs CPU Limit?</b> (Click to expand)</summary>
  <p><b>Question:</b> If a pod is assigned <code>memory: 256Mi</code> and <code>cpu: 500m</code>, what happens when it tries to use 300Mi of RAM vs 100% of a CPU core?</p>
  <div class="callout key">
    <p><b>Answer:</b></p>
    <ul>
      <li><b>Memory Limit Exceeded:</b> The Linux kernel Out-Of-Memory killer instantly fires <code>SIGKILL</code> (Exit code <code>137</code>: <code>OOMKilled</code>). The container terminates immediately with data loss for in-flight requests.</li>
      <li><b>CPU Limit Exceeded:</b> The Linux Completely Fair Scheduler (CFS) <b>throttles</b> the container's CPU time slices. The process slows down, but is <b>never killed</b>.</li>
    </ul>
  </div>
</details>
`;export{e as default};

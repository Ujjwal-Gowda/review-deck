const e=`<p class="goal">Why orchestration exists, and how Kubernetes is put together.</p>
<p>Docker runs containers on <i>one</i> machine. Once you have many services across many machines, you need something to decide <b>where</b> each container runs, <b>restart</b> it when it dies, <b>scale</b> it, <b>route</b> traffic to it, and <b>roll out</b> new versions. That's orchestration. Kubernetes (k8s) is the standard.</p>
<div class="diagram">CONTROL PLANE                                    WORKER NODES (many)
 ├── kube-apiserver  ← everything talks to this     ├── kubelet: runs the pods assigned to this node
 ├── etcd            ← the cluster's database         ├── container runtime (containerd)
 ├── scheduler       ← picks a node for each pod      └── kube-proxy / CNI: pod networking
 └── controller-manager ← reconciliation loops</div>
<h3>The core idea: declarative reconciliation</h3>
<p>You declare the <b>desired state</b> in YAML ("3 replicas of shop-api:1.4.2"). Controllers constantly compare desired with actual state and act to close the gap: a pod dies, so a new one starts; a node dies, so its pods reschedule elsewhere. You never say "start a container"; you say what should exist.</p>
<pre data-lang="shell"><code class="language-bash">kind create cluster            # or minikube / k3d: a local cluster in Docker (heavy on 7 GB RAM; k3d is lightest)
kubectl get nodes,pods -A
kubectl apply -f k8s/           # make it so
kubectl describe pod api-7d9…   # events at the bottom explain most problems
kubectl logs -f deploy/api; kubectl exec -it deploy/api -- sh
kubectl get events --sort-by=.lastTimestamp</code></pre>
<div class="callout key"><b class="t">Do you need it?</b><p>Kubernetes pays off with many services, several teams, and a need for self-healing at scale. For one to three services, Compose on a VM, or a managed container platform (Cloud Run, ECS, Fly.io, Render), is simpler and cheaper. Managed k8s (GKE, EKS, AKS) removes the control-plane ops but not the complexity.</p></div>
<div class="exercises"><h3>Practice</h3>
<details class="ex"><summary>135.1 <span class="levels">basic</span> Create a k3d cluster, deploy nginx with 3 replicas, delete a pod, and watch the controller replace it.</summary><div><p><code>k3d cluster create dev</code>; <code>kubectl create deploy web --image=nginx --replicas=3</code>; <code>kubectl delete pod …</code>; <code>kubectl get pods -w</code> shows a replacement appear within seconds.</p></div></details>
</div>
`;export{e as default};

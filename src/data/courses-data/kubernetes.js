export const kubernetesCourse = {
    id: 'kubernetes', title: 'Kubernetes', description: 'Container orchestration platform for deploying, scaling, and managing microservices in production.',
    officialDocs: 'https://kubernetes.io/docs/', tutorialLink: 'https://kubernetes.io/docs/tutorials/', exerciseLink: null,
    sections: [
      { title: 'What is Kubernetes', image: '/images/kubernetes/k8s-cluster-layout.svg', content: `**Kubernetes (K8s)** is a container orchestration platform that automates deployment, scaling, and management of containerized applications. It takes Docker containers and runs them across a cluster of machines with built-in self-healing, load balancing, and rolling updates.

### Why Kubernetes for This Project

| Factor | Decision Rationale |
|---|---|
| **Auto-Scaling** | Scale services independently based on CPU/memory/custom metrics |
| **Self-Healing** | Restarts failed containers; replaces unresponsive pods |
| **Rolling Updates** | Zero-downtime deployments with rollback capability |
| **Service Discovery** | Built-in DNS — services find each other by name |
| **Resource Management** | CPU/memory limits prevent one service from starving others |
| **Industry Standard** | Supported by every major cloud provider (AKS, EKS, GKE) |

### Cluster Layout

The project runs all microservices in a \`billing\` namespace: gateway, identity-api, catalog-api, commerce-api, engagement-api, web frontend, plus infrastructure (PostgreSQL, Redis, RabbitMQ, MinIO). An Ingress controller routes external traffic to the gateway.`, keyPoints: ['Kubernetes automates deployment, scaling, and self-healing.', 'Services are auto-discovered via built-in DNS.', 'Rolling updates provide zero-downtime deployments.', 'All major cloud providers offer managed K8s (AKS, EKS, GKE).'] },

      { title: 'Advantages & Disadvantages', content: `### Advantages

| # | Advantage | Detail |
|---|---|---|
| 1 | **Auto-scaling** | HPA scales pods based on CPU/memory metrics |
| 2 | **Self-healing** | Restarts crashed pods automatically |
| 3 | **Rolling updates** | Zero-downtime deployments with safe rollback |
| 4 | **Service discovery** | Internal DNS for service-to-service communication |
| 5 | **Resource limits** | CPU/memory quotas per pod prevent noisy neighbors |
| 6 | **Declarative config** | YAML manifests = infrastructure as code |
| 7 | **Multi-cloud** | Works on AWS EKS, Azure AKS, GCP GKE, DigitalOcean |

### Disadvantages

| # | Disadvantage | Mitigation |
|---|---|---|
| 1 | **Complexity** | Significant learning curve → use managed K8s (AKS/EKS) |
| 2 | **Resource overhead** | K8s itself uses CPU/RAM → managed services handle control plane |
| 3 | **YAML verbosity** | Many config files → use Helm charts or Kustomize |
| 4 | **Networking** | Complex networking model → use service mesh if needed |
| 5 | **Overkill for small scale** | Start with Docker Compose, migrate to K8s when needed |`, keyPoints: ['HPA auto-scales pods based on real-time metrics.', 'Self-healing restarts crashed containers automatically.', 'Managed K8s eliminates control plane complexity.', 'Start with Docker Compose, migrate to K8s when scale demands it.'] },

      { title: 'Prerequisites & Setup', content: `### Required Tools

| Tool | Version | Purpose |
|---|---|---|
| **kubectl** | 1.30+ | K8s command-line tool |
| **Docker Desktop** | Latest | Local K8s cluster (enable in settings) |
| **Helm** | 3.x | Package manager for K8s |
| **Lens** | Latest | K8s GUI dashboard (optional) |

### Enable Kubernetes Locally

Docker Desktop includes a single-node Kubernetes cluster. Enable it in Settings → Kubernetes → Enable Kubernetes.`, code: `# Verify cluster\nkubectl cluster-info\nkubectl get nodes\n\n# Create project namespace\nkubectl create namespace billing\nkubectl config set-context --current --namespace=billing\n\n# Install kubectl (if not via Docker Desktop)\nwinget install Kubernetes.kubectl\nkubectl version --client\n\n# Install Helm\nwinget install Helm.Helm\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm repo update`, codeLabel: 'Setup & Verification', keyPoints: ['Docker Desktop includes a built-in Kubernetes cluster.', 'kubectl is the primary CLI for interacting with K8s.', 'Helm is the package manager for Kubernetes.', 'Namespaces isolate project resources within the cluster.'] },

      { title: 'Core Concepts', image: '/images/kubernetes/k8s-core-concepts.svg', content: `| Concept | Description |
|---|---|
| **Pod** | Smallest deployable unit — one or more containers sharing network/storage |
| **Deployment** | Manages replicas of pods; handles rolling updates and rollbacks |
| **Service** | Stable network endpoint that load-balances traffic to a set of pods |
| **Ingress** | Routes external HTTP/HTTPS traffic to internal services |
| **ConfigMap** | Non-sensitive configuration data (key-value pairs) |
| **Secret** | Sensitive data (passwords, tokens) — base64 encoded |
| **Namespace** | Virtual cluster for resource isolation |
| **HPA** | Horizontal Pod Autoscaler — auto-scale based on metrics |
| **PVC** | Persistent Volume Claim — storage for stateful services |
| **Job** | Run-to-completion task (e.g., database migration) |
| **StatefulSet** | For stateful workloads (databases) — stable network identity + storage |

### How They Connect

Deployments create Pods → Services expose Pods → Ingress routes external traffic to Services. ConfigMaps and Secrets provide configuration. HPAs watch metrics and scale Deployments up/down.`, keyPoints: ['Pods are the smallest unit — usually one container per pod.', 'Deployments manage pod replicas and rolling updates.', 'Services provide stable DNS names for pod sets.', 'Ingress routes external HTTP traffic into the cluster.'] },

      { title: 'Namespaces & Deployments', content: `### Namespace

Namespaces provide logical isolation within a cluster. Use separate namespaces for environments: \`billing-dev\`, \`billing-staging\`, \`billing-prod\`.

### Deployment Manifest

A Deployment declares the desired state — image, replicas, resource limits, health probes, and environment variables. Kubernetes ensures the actual state matches.`, code: `# namespace.yml\napiVersion: v1\nkind: Namespace\nmetadata:\n  name: billing\n  labels:\n    app.kubernetes.io/part-of: billing-software\n\n---\n# catalog-deployment.yml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: catalog-api\n  namespace: billing\n  labels:\n    app: catalog-api\n    tier: backend\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: catalog-api\n  template:\n    metadata:\n      labels:\n        app: catalog-api\n        tier: backend\n    spec:\n      containers:\n        - name: catalog-api\n          image: ghcr.io/your-org/billing-catalog:1.0.0\n          ports:\n            - containerPort: 8080\n          env:\n            - name: ASPNETCORE_ENVIRONMENT\n              value: "Production"\n            - name: ConnectionStrings__DefaultConnection\n              valueFrom:\n                secretKeyRef:\n                  name: billing-secrets\n                  key: postgres-connection\n          resources:\n            requests:\n              cpu: "100m"\n              memory: "128Mi"\n            limits:\n              cpu: "500m"\n              memory: "512Mi"\n          livenessProbe:\n            httpGet:\n              path: /health/live\n              port: 8080\n            initialDelaySeconds: 10\n            periodSeconds: 15\n          readinessProbe:\n            httpGet:\n              path: /health/ready\n              port: 8080\n            initialDelaySeconds: 5\n            periodSeconds: 10\n      restartPolicy: Always`, codeLabel: 'Namespace & Deployment', keyPoints: ['Namespaces isolate environments within one cluster.', 'Deployments declare desired state — K8s enforces it.', 'Resource requests and limits are mandatory for production.', 'Health probes enable self-healing and traffic management.'] },

      { title: 'Services & Ingress', image: '/images/kubernetes/k8s-networking.svg', content: `### Service Types

| Type | Access | Use Case |
|---|---|---|
| **ClusterIP** | Internal only | Service-to-service (default) |
| **NodePort** | External via node IP:port | Development / testing |
| **LoadBalancer** | External via cloud LB | Production (expensive) |
| **Ingress** | External via HTTP/HTTPS routing | Production (preferred) |

### Internal DNS

Inside the cluster, services are reachable by name:
- Same namespace: \`http://catalog-api:80\`
- Cross-namespace: \`http://catalog-api.billing.svc.cluster.local:80\`

### Ingress

Ingress routes external HTTP traffic to internal services based on hostnames and paths. TLS termination is handled at the Ingress level.`, code: `# catalog-service.yml\napiVersion: v1\nkind: Service\nmetadata:\n  name: catalog-api\n  namespace: billing\nspec:\n  selector:\n    app: catalog-api\n  ports:\n    - port: 80\n      targetPort: 8080\n      protocol: TCP\n  type: ClusterIP\n\n---\n# ingress.yml\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: billing-ingress\n  namespace: billing\n  annotations:\n    nginx.ingress.kubernetes.io/ssl-redirect: "true"\n    nginx.ingress.kubernetes.io/proxy-body-size: "10m"\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts:\n        - api.billing.example.com\n        - app.billing.example.com\n      secretName: billing-tls\n  rules:\n    - host: api.billing.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: gateway\n                port:\n                  number: 80\n    - host: app.billing.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web\n                port:\n                  number: 80`, codeLabel: 'Service & Ingress', keyPoints: ['ClusterIP is default — internal-only access.', 'Ingress routes external traffic by hostname and path.', 'Services load-balance across all matching pods.', 'TLS termination happens at the Ingress controller.'] },

      { title: 'ConfigMaps & Secrets', content: `### ConfigMap

Non-sensitive configuration that can be injected as environment variables or mounted as files. Changes to ConfigMaps can be picked up without rebuilding images.

### Secret

Sensitive data stored as base64-encoded values. **Never commit Secrets to Git** — create them from CI/CD or use an external secrets manager.

### Using in Deployments

Environment variables can reference ConfigMap keys or Secret keys using \`valueFrom\`.`, code: `# configmap.yml\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: billing-config\n  namespace: billing\ndata:\n  ASPNETCORE_ENVIRONMENT: "Production"\n  RabbitMQ__Host: "rabbitmq"\n  Redis__InstanceName: "billing:"\n\n---\n# secret.yml (apply from CI/CD — NEVER commit to git!)\napiVersion: v1\nkind: Secret\nmetadata:\n  name: billing-secrets\n  namespace: billing\ntype: Opaque\nstringData:\n  postgres-connection: "Host=postgres;Database=billing;Username=billing_app;Password=SECURE_PASSWORD"\n  postgres-user: "billing_app"\n  postgres-password: "SECURE_PASSWORD"\n  redis-connection: "redis:6379,password=SECURE_PASSWORD"\n  jwt-secret: "LONG_RANDOM_SECRET_KEY"\n\n---\n# Usage in Deployment\nenv:\n  # From ConfigMap\n  - name: ASPNETCORE_ENVIRONMENT\n    valueFrom:\n      configMapKeyRef:\n        name: billing-config\n        key: ASPNETCORE_ENVIRONMENT\n  # From Secret\n  - name: ConnectionStrings__DefaultConnection\n    valueFrom:\n      secretKeyRef:\n        name: billing-secrets\n        key: postgres-connection`, codeLabel: 'ConfigMap & Secrets', keyPoints: ['ConfigMaps hold non-sensitive configuration.', 'Secrets hold credentials — never commit to Git.', 'Both can be injected as environment variables.', 'Use external secrets managers for production.'] },

      { title: 'StatefulSets & Persistent Storage', content: `**StatefulSets** are for workloads that need stable network identities and persistent storage — primarily databases. Unlike Deployments, each pod in a StatefulSet gets a unique, persistent identity.

### PersistentVolumeClaim (PVC)

PVCs request storage from the cluster. Each StatefulSet pod gets its own dedicated volume that persists across restarts.

### Database Migration Job

Kubernetes **Jobs** run a container to completion and then stop — ideal for database migrations. Set \`backoffLimit\` for retry attempts.`, code: `# postgres-statefulset.yml\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: postgres\n  namespace: billing\nspec:\n  serviceName: postgres\n  replicas: 1\n  selector:\n    matchLabels:\n      app: postgres\n  template:\n    metadata:\n      labels:\n        app: postgres\n    spec:\n      containers:\n        - name: postgres\n          image: postgres:16-alpine\n          ports:\n            - containerPort: 5432\n          env:\n            - name: POSTGRES_DB\n              value: "billing"\n            - name: POSTGRES_USER\n              valueFrom:\n                secretKeyRef:\n                  name: billing-secrets\n                  key: postgres-user\n            - name: POSTGRES_PASSWORD\n              valueFrom:\n                secretKeyRef:\n                  name: billing-secrets\n                  key: postgres-password\n          volumeMounts:\n            - name: postgres-storage\n              mountPath: /var/lib/postgresql/data\n          resources:\n            requests:\n              cpu: "250m"\n              memory: "512Mi"\n            limits:\n              cpu: "1"\n              memory: "1Gi"\n  volumeClaimTemplates:\n    - metadata:\n        name: postgres-storage\n      spec:\n        accessModes: ["ReadWriteOnce"]\n        resources:\n          requests:\n            storage: 20Gi\n\n---\n# db-migration-job.yml\napiVersion: batch/v1\nkind: Job\nmetadata:\n  name: db-migrator-v1-0-0\n  namespace: billing\nspec:\n  backoffLimit: 3\n  template:\n    spec:\n      containers:\n        - name: migrator\n          image: ghcr.io/your-org/billing-migrator:1.0.0\n          env:\n            - name: ConnectionStrings__DefaultConnection\n              valueFrom:\n                secretKeyRef:\n                  name: billing-secrets\n                  key: postgres-connection\n      restartPolicy: Never`, codeLabel: 'StatefulSet & Migration Job', keyPoints: ['StatefulSets provide stable identity and persistent storage.', 'Each StatefulSet pod gets its own dedicated PVC.', 'Jobs run tasks to completion — ideal for migrations.', 'Database credentials come from Secrets, never hardcoded.'] },

      { title: 'Auto-Scaling (HPA)', image: '/images/kubernetes/k8s-autoscaling.svg', content: `The **Horizontal Pod Autoscaler (HPA)** automatically scales the number of pods based on CPU utilization, memory usage, or custom metrics.

### Scaling Targets per Service

| Service | Min | Max | CPU Target | Memory Target |
|---|---|---|---|---|
| **gateway** | 2 | 6 | 60% | 70% |
| **identity-api** | 2 | 4 | 70% | 80% |
| **catalog-api** | 2 | 10 | 70% | 80% |
| **commerce-api** | 2 | 8 | 70% | 80% |
| **engagement-api** | 2 | 4 | 70% | 80% |
| **web** | 2 | 6 | 60% | 70% |

### Scaling Behavior

Configure stabilization windows to prevent flapping — scale up quickly (30s window) but scale down slowly (300s window) to handle traffic fluctuations.`, code: `# hpa.yml\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: catalog-api-hpa\n  namespace: billing\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: catalog-api\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70\n    - type: Resource\n      resource:\n        name: memory\n        target:\n          type: Utilization\n          averageUtilization: 80\n  behavior:\n    scaleUp:\n      stabilizationWindowSeconds: 30\n      policies:\n        - type: Pods\n          value: 2\n          periodSeconds: 60\n    scaleDown:\n      stabilizationWindowSeconds: 300\n      policies:\n        - type: Pods\n          value: 1\n          periodSeconds: 120`, codeLabel: 'Horizontal Pod Autoscaler', keyPoints: ['HPA scales pods based on CPU and memory metrics.', 'Set minReplicas >= 2 for high availability.', 'Scale up fast (30s), scale down slow (300s) to prevent flapping.', 'Resource requests must be set for HPA to work.'] },

      { title: 'Health Probes', content: `Kubernetes uses **health probes** to determine pod health. Without probes, K8s can't self-heal or route traffic correctly.

### Probe Types

| Probe | Purpose | Failure Action |
|---|---|---|
| **Liveness** | Is the process alive? | **Restart** the pod |
| **Readiness** | Can it handle traffic? | **Remove from service** (stop routing) |
| **Startup** | Has it finished initializing? | **Delay** liveness/readiness checks |

### .NET Health Endpoints

ASP.NET Core provides built-in health check middleware. \`/health/live\` just confirms the app is running. \`/health/ready\` checks all dependencies (database, Redis, RabbitMQ).`, code: `// Program.cs — .NET Health Check Setup\nbuilder.Services.AddHealthChecks()\n    .AddNpgSql(connectionString, name: "postgres")\n    .AddRedis(redisConnection, name: "redis")\n    .AddRabbitMQ(name: "rabbitmq");\n\napp.MapHealthChecks("/health/live", new HealthCheckOptions\n{\n    Predicate = _ => false  // Just checks if app is running\n});\n\napp.MapHealthChecks("/health/ready", new HealthCheckOptions\n{\n    Predicate = _ => true  // Checks all dependencies\n});\n\n// ── Kubernetes Manifest ──\n// livenessProbe:\n//   httpGet:\n//     path: /health/live\n//     port: 8080\n//   initialDelaySeconds: 10\n//   periodSeconds: 15\n// readinessProbe:\n//   httpGet:\n//     path: /health/ready\n//     port: 8080\n//   initialDelaySeconds: 5\n//   periodSeconds: 10\n// startupProbe:\n//   httpGet:\n//     path: /health/live\n//     port: 8080\n//   failureThreshold: 30\n//   periodSeconds: 5`, codeLabel: 'Health Probes (.NET)', keyPoints: ['Liveness failure → pod is restarted.', 'Readiness failure → pod is removed from service (no traffic).', 'Startup probe delays other probes during initialization.', 'Always implement health endpoints in every service.'] },

      { title: 'Best Practices', content: `### Do's

| # | Practice | Reason |
|---|---|---|
| 1 | **Set resource requests AND limits** | Prevents resource starvation; enables HPA |
| 2 | **Use namespaces** | Isolate environments (billing-dev, billing-staging, billing-prod) |
| 3 | **Use health probes** | K8s needs pod health info for self-healing |
| 4 | **Use Secrets for credentials** | Never hardcode passwords in manifests |
| 5 | **Pin image tags** | \`1.0.0\` not \`latest\` — reproducible deployments |
| 6 | **Use rolling update strategy** | Zero-downtime deployments |
| 7 | **Set pod disruption budgets** | Prevent all pods from being evicted simultaneously |

### Don'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Commit secrets to git** | Use \`kubectl create secret\` or external secrets manager |
| 2 | **Use \`latest\` tag** | Pin exact version (e.g., \`1.0.0\`) |
| 3 | **Skip resource limits** | Always set to prevent noisy neighbor issues |
| 4 | **Run as root** | Set \`securityContext.runAsNonRoot: true\` |
| 5 | **Use NodePort in production** | Use Ingress instead |
| 6 | **Deploy without health checks** | K8s can't self-heal without probes |`, keyPoints: ['Resource requests AND limits are mandatory for production.', 'Pin image tags — never use :latest.', 'Pod disruption budgets protect against mass eviction.', 'Never run pods as root in production.'] },

      { title: 'Monitoring & Observability', content: `### Key Tools

| Tool | Purpose |
|---|---|
| **kubectl top** | Quick CPU/memory usage per node/pod |
| **Lens** | GUI dashboard for cluster visualization |
| **Prometheus + Grafana** | Metrics collection and visualization |
| **Loki** | Log aggregation across all pods |

### Quick Monitoring Commands

\`\`\`bash
kubectl top nodes                              # Node resource usage
kubectl top pods -n billing                    # Pod resource usage
kubectl get events -n billing --sort-by='.lastTimestamp'  # Recent events
kubectl logs -f deployment/catalog-api -n billing         # Follow logs
\`\`\`

### Production Monitoring Checklist

- CPU and memory utilization per pod
- Request latency (p50, p95, p99)
- Error rates (5xx responses)
- Pod restart counts
- HPA scaling events`, keyPoints: ['kubectl top gives quick resource usage snapshots.', 'Prometheus + Grafana for production-grade monitoring.', 'Track pod restarts — frequent restarts indicate issues.', 'Monitor HPA events to validate scaling thresholds.'] },

      { title: 'Local Deployment', content: `### Using Docker Desktop Kubernetes

Docker Desktop includes a single-node cluster for local development. After enabling K8s, you can deploy the entire stack locally.

### Port Forwarding

Since there's no external load balancer locally, use \`kubectl port-forward\` to access services from your browser.`, code: `# Switch to Docker Desktop context\nkubectl config use-context docker-desktop\n\n# Create namespace\nkubectl create namespace billing\n\n# Apply all manifests\nkubectl apply -f k8s/namespace.yml\nkubectl apply -f k8s/secrets.yml\nkubectl apply -f k8s/configmap.yml\nkubectl apply -f k8s/postgres/\nkubectl apply -f k8s/redis/\nkubectl apply -f k8s/rabbitmq/\nkubectl apply -f k8s/services/\nkubectl apply -f k8s/ingress.yml\nkubectl apply -f k8s/hpa/\n\n# Check status\nkubectl get all -n billing\n\n# Port-forward for local access\nkubectl port-forward svc/gateway 5000:80 -n billing\nkubectl port-forward svc/web 3000:80 -n billing\n\n# Access:\n#   API: http://localhost:5000\n#   Web: http://localhost:3000`, codeLabel: 'Local Deployment', keyPoints: ['Docker Desktop provides a local K8s cluster.', 'Apply manifests in order: namespace → secrets → infra → services.', 'Use port-forward to access services locally.', 'kubectl get all shows the complete deployment status.'] },

      { title: 'Cloud Deployment', content: `### Managed Kubernetes Services

| Provider | Service | Command |
|---|---|---|
| **Azure** | AKS | \`az aks create --resource-group billing-rg --name billing-aks\` |
| **AWS** | EKS | \`eksctl create cluster --name billing-eks\` |
| **GCP** | GKE | \`gcloud container clusters create billing-gke\` |
| **DigitalOcean** | DOKS | \`doctl kubernetes cluster create billing-doks\` |

### Production Deployment Flow

\`\`\`
1. CI/CD builds Docker image → pushes to GHCR
2. CI/CD updates image tag in K8s manifest
3. kubectl apply (or ArgoCD auto-sync)
4. K8s performs rolling update
5. Health probes verify new pods
6. Old pods are terminated
\`\`\`

Managed services handle the **control plane** (API server, scheduler, etcd) — you only manage the **worker nodes** where your pods run.`, keyPoints: ['Use managed K8s — never run your own control plane.', 'All major clouds offer managed K8s services.', 'CI/CD builds images and applies manifests automatically.', 'Rolling updates ensure zero-downtime deployments.'] },

      { title: 'Troubleshooting & Commands', content: `### Common Issues

| Issue | Diagnosis | Fix |
|---|---|---|
| **CrashLoopBackOff** | \`kubectl logs <pod>\` | Fix app error; check env vars |
| **Pending pod** | \`kubectl describe pod <pod>\` | Not enough resources; scale cluster |
| **ImagePullBackOff** | Wrong image name/registry | Fix tag; add \`imagePullSecrets\` |
| **Service not reachable** | \`kubectl get endpoints <svc>\` | Check selector labels match pod labels |
| **HPA not scaling** | \`kubectl describe hpa\` | Install metrics-server |

### Essential Commands

\`\`\`bash
# Cluster
kubectl cluster-info
kubectl get nodes
kubectl top nodes

# Pods
kubectl get pods -n billing
kubectl describe pod <name> -n billing
kubectl logs <pod> -n billing -f
kubectl exec -it <pod> -n billing -- sh
kubectl top pods -n billing

# Deployments
kubectl rollout status deployment/catalog-api -n billing
kubectl rollout restart deployment/catalog-api -n billing
kubectl rollout undo deployment/catalog-api -n billing
kubectl scale deployment/catalog-api --replicas=3 -n billing

# Services & Networking
kubectl get svc -n billing
kubectl port-forward svc/gateway 5000:80 -n billing
kubectl get events -n billing --sort-by='.lastTimestamp'

# Config
kubectl get configmaps -n billing
kubectl get secrets -n billing
kubectl get hpa -n billing
\`\`\``, keyPoints: ['kubectl logs is the first debugging step for crashes.', 'kubectl describe shows events and status details.', 'rollout undo is the fastest way to revert a bad deployment.', 'kubectl top requires metrics-server to be installed.'] }
    ]
  };

/*
 * GCP course extension — extra sections and worked examples merged into
 * courses-data/gcp.js at load time. CLI examples use the gcloud / bq / gcloud
 * storage commands from the Google Cloud SDK; Python functions run locally
 * with `python main.py` using a sample event before you deploy them.
 */

export default {
  examples: {
    'Runtime Choices: Compute Engine, Cloud Run & GKE': [
      {
        title: 'Deploy a container to Cloud Run from source',
        language: 'bash',
        explanation: '`--source .` builds the image with Cloud Build (using a Dockerfile or buildpacks), pushes it to Artifact Registry and deploys a new **revision**. Traffic shifts only when the revision is healthy.',
        code: `gcloud config set project acme-shop-dev
gcloud config set run/region europe-west1
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

gcloud run deploy orders-api \\
  --source . \\
  --service-account orders-api@acme-shop-dev.iam.gserviceaccount.com \\
  --set-env-vars APP_ENV=dev \\
  --set-secrets DB_PASSWORD=orders-db-password:latest \\
  --cpu 1 --memory 512Mi --concurrency 80 \\
  --min-instances 0 --max-instances 20 \\
  --allow-unauthenticated

URL=$(gcloud run services describe orders-api --format 'value(status.url)')
curl -s "$URL/health"
gcloud run services logs read orders-api --limit 20`,
      },
    ],
  },

  sections: [
    {
      title: 'gcloud CLI & Configurations',
      after: 'Projects, IAM & Resource Hierarchy',
      content: `The **Google Cloud CLI** (\`gcloud\`, plus \`bq\` and \`gcloud storage\`) drives almost everything.

| Task | Command |
|---|---|
| Log in (you) | \`gcloud auth login\` |
| Credentials for local code / SDKs (ADC) | \`gcloud auth application-default login\` |
| Named configurations | \`gcloud config configurations create prod\` / \`activate\` |
| Set defaults | \`gcloud config set project …\`, \`compute/region\`, \`run/region\` |
| Enable APIs | \`gcloud services enable run.googleapis.com\` |
| Format / filter output | \`--format="table(name,status)"\`, \`--filter="status=RUNNING"\`, \`--format="value(…)"\` |
| Impersonate a service account | \`--impersonate-service-account=sa@proj.iam.gserviceaccount.com\` |

**Application Default Credentials (ADC)** let client libraries find credentials automatically: your user locally, the attached service account in Cloud Run/GKE/GCE. Avoid downloading **service-account keys** — use impersonation locally and Workload Identity Federation in CI.`,
      code: `# Separate configurations for dev and prod
gcloud config configurations create dev
gcloud config set account ada@acme.com
gcloud config set project acme-shop-dev
gcloud config set compute/region europe-west1

gcloud config configurations create prod
gcloud config set project acme-shop-prod
gcloud config configurations activate dev
gcloud config list

# ADC for local development, impersonating a least-privilege service account
gcloud auth application-default login \\
  --impersonate-service-account=orders-api@acme-shop-dev.iam.gserviceaccount.com

# Formatting and filtering
gcloud compute instances list \\
  --filter="status=RUNNING AND labels.env=dev" \\
  --format="table(name, zone.basename(), machineType.basename(), networkInterfaces[0].networkIP)"

gcloud projects get-iam-policy acme-shop-dev \\
  --flatten="bindings[].members" \\
  --filter="bindings.members:serviceAccount" \\
  --format="table(bindings.role, bindings.members)"

# Value output for scripting
PROJECT_NUMBER=$(gcloud projects describe acme-shop-dev --format='value(projectNumber)')
echo "$PROJECT_NUMBER"`,
      codeLabel: 'Configurations, ADC impersonation, filters and formats',
      keyPoints: [
        'Use named configurations to switch accounts and projects safely.',
        'Application Default Credentials let SDKs find credentials automatically.',
        'Impersonate service accounts instead of downloading key files.',
        '`--filter` and `--format` turn gcloud output into tables or script values.',
      ],
    },
    {
      title: 'Cloud Run in Depth',
      after: 'Runtime Choices: Compute Engine, Cloud Run & GKE',
      content: `**Cloud Run** runs stateless containers that listen on \`$PORT\`, scaling from zero to many instances per request load.

| Setting | Guidance |
|---|---|
| \`--concurrency\` | requests per instance (default 80); lower for CPU-heavy work |
| \`--min-instances\` | > 0 removes cold starts for latency-sensitive services |
| \`--cpu-boost\`, \`--cpu-throttling\` | faster startup; "always allocated" CPU for background work |
| Revisions & traffic | \`--no-traffic\` deploy, then split: \`--to-revisions=new=10\` (canary) |
| Secrets | \`--set-secrets\` from Secret Manager (env var or mounted file) |
| Networking | Direct VPC egress / Serverless VPC connector for private IPs (Cloud SQL, Memorystore) |
| Auth | \`--no-allow-unauthenticated\` + IAM \`roles/run.invoker\` for service-to-service calls |
| Jobs | \`gcloud run jobs\` for batch tasks that run to completion |

### Container contract

Listen on \`0.0.0.0:$PORT\`, start fast, log to stdout/stderr (JSON logs become structured in Cloud Logging), handle \`SIGTERM\` for graceful shutdown, keep no local state.`,
      code: `# Dockerfile — small, non-root Python image listening on $PORT
cat > Dockerfile <<'EOF'
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PORT=8080
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd --uid 10001 app
USER app
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 2 --threads 8 --timeout 0 main:app
EOF

# Build once, deploy a new revision without traffic, then canary 10%
IMAGE=europe-west1-docker.pkg.dev/acme-shop-prod/apps/orders-api:$(git rev-parse --short HEAD)
gcloud builds submit --tag "$IMAGE"
gcloud run deploy orders-api --image "$IMAGE" --region europe-west1 \\
  --no-traffic --tag canary \\
  --min-instances 1 --cpu-boost --concurrency 40 \\
  --network default --subnet default --vpc-egress private-ranges-only \\
  --no-allow-unauthenticated
gcloud run services update-traffic orders-api --region europe-west1 --to-tags canary=10

# Promote when metrics look good (or roll back with --to-revisions=PREVIOUS=100)
gcloud run services update-traffic orders-api --region europe-west1 --to-latest

# Service-to-service call: caller's SA needs roles/run.invoker; send an ID token
gcloud run services add-iam-policy-binding orders-api --region europe-west1 \\
  --member serviceAccount:checkout@acme-shop-prod.iam.gserviceaccount.com --role roles/run.invoker
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" "$(gcloud run services describe orders-api \\
  --region europe-west1 --format 'value(status.url)')/health"

# Batch work: Cloud Run job with 10 parallel tasks
gcloud run jobs create nightly-export --image "$IMAGE" --region europe-west1 \\
  --tasks 10 --parallelism 10 --max-retries 2 --command python --args export.py`,
      codeLabel: 'Dockerfile, canary traffic split, private egress and jobs',
      keyPoints: [
        'Containers must listen on `$PORT`, be stateless and log to stdout.',
        'Deploy with `--no-traffic` and shift traffic gradually using tags.',
        'Use min instances and CPU boost for latency-sensitive services.',
        'Secure service-to-service calls with IAM `run.invoker` and ID tokens.',
      ],
    },
    {
      title: 'Pub/Sub & Event-Driven Functions',
      after: 'Cloud Run in Depth',
      content: `**Pub/Sub** is a global, at-least-once messaging service: publishers send to a **topic**, each **subscription** gets a copy.

| Feature | Notes |
|---|---|
| Pull vs push subscriptions | workers pull, or Pub/Sub pushes to an HTTPS endpoint (Cloud Run) |
| Ack deadline | redelivered if not acknowledged in time (extendable) |
| Dead-letter topic | after N failed deliveries |
| Ordering keys | ordered delivery per key (enable on the subscription) |
| Exactly-once delivery | optional on pull subscriptions |
| Filters | subscription-level attribute filters |

**Eventarc** routes events (Pub/Sub, Cloud Storage, audit logs) to Cloud Run; **Cloud Run functions** (formerly Cloud Functions) are the quickest way to write a handler. Messages arrive **base64-encoded** inside a CloudEvent — and may be **duplicated**, so handlers must be idempotent.`,
      code: `# main.py — Pub/Sub-triggered function (Cloud Run functions, 2nd gen)
# Deploy:
#   gcloud functions deploy process-order --gen2 --runtime python312 --region europe-west1 \\
#     --trigger-topic orders --entry-point process_order --retry
import base64, json

try:                                       # functions-framework is present when deployed
    import functions_framework
    cloud_event = functions_framework.cloud_event
except ImportError:                        # plain decorator for local runs
    cloud_event = lambda fn: fn

SEEN = set()                               # use Firestore/Redis for real idempotency

@cloud_event
def process_order(event):
    message = event.data["message"]
    msg_id = message["messageId"]
    if msg_id in SEEN:
        print(f"duplicate {msg_id} ignored")
        return
    order = json.loads(base64.b64decode(message["data"]))
    attrs = message.get("attributes", {})
    if order.get("total", 0) <= 0:
        # Raising makes Pub/Sub retry (with --retry); a poison message ends in the dead-letter topic.
        # For permanently bad data, log and return instead so it is acknowledged.
        print(f"rejecting invalid order {order.get('id')}")
        return
    SEEN.add(msg_id)
    print(f"processing order {order['id']} total={order['total']} source={attrs.get('source')}")

if __name__ == "__main__":
    class FakeEvent:                       # mimics the CloudEvent the platform delivers
        def __init__(self, payload, msg_id):
            self.data = {"message": {
                "messageId": msg_id,
                "data": base64.b64encode(json.dumps(payload).encode()).decode(),
                "attributes": {"source": "web"}}}
    process_order(FakeEvent({"id": "A-1", "total": 42.5}, "m-1"))
    process_order(FakeEvent({"id": "A-1", "total": 42.5}, "m-1"))      # redelivery
    process_order(FakeEvent({"id": "A-2", "total": 0}, "m-2"))

# Topic, subscription with dead-lettering, and a test publish:
#   gcloud pubsub topics create orders orders-dlq
#   gcloud pubsub subscriptions create orders-worker --topic orders --ack-deadline 60 \\
#     --dead-letter-topic orders-dlq --max-delivery-attempts 5 --enable-message-ordering
#   gcloud pubsub topics publish orders --message '{"id":"A-3","total":10}' --attribute source=cli`,
      codeLabel: 'Idempotent Pub/Sub handler, runnable locally',
      codeLanguage: 'python',
      keyPoints: [
        'Topics fan out to subscriptions; each subscription receives every message.',
        'Delivery is at-least-once — deduplicate with the message ID or a business key.',
        'Configure dead-letter topics and max delivery attempts.',
        'Pub/Sub message data is base64-encoded inside the CloudEvent.',
      ],
    },
    {
      title: 'Cloud Storage',
      after: 'Storage, Databases & Analytics',
      content: `**Cloud Storage** holds objects in **buckets** (globally unique names) with a location: region, dual-region or multi-region.

| Class | Minimum storage duration | Use |
|---|---|---|
| Standard | none | hot data, websites, analytics |
| Nearline | 30 days | accessed < once a month |
| Coldline | 90 days | accessed < once a quarter |
| Archive | 365 days | long-term retention |
| **Autoclass** | — | moves objects between classes automatically |

### Practices

- Enable **uniform bucket-level access** (IAM only, no per-object ACLs) and **public access prevention**.
- **Object versioning** + **lifecycle rules** for retention and cost control.
- **Signed URLs** for temporary access; **CMEK** when you must control keys.
- Use \`gcloud storage\` (faster successor of \`gsutil\`).`,
      code: `BUCKET=gs://acme-shop-dev-uploads-$RANDOM

gcloud storage buckets create "$BUCKET" --location=europe-west1 \\
  --uniform-bucket-level-access --public-access-prevention --enable-autoclass
gcloud storage buckets update "$BUCKET" --versioning

# Lifecycle: delete noncurrent versions after 30 days, temp/ objects after 7 days
cat > lifecycle.json <<'EOF'
{
  "rule": [
    { "action": { "type": "Delete" }, "condition": { "daysSinceNoncurrentTime": 30 } },
    { "action": { "type": "Delete" }, "condition": { "age": 7, "matchesPrefix": ["temp/"] } }
  ]
}
EOF
gcloud storage buckets update "$BUCKET" --lifecycle-file=lifecycle.json

# Copy, sync, list
gcloud storage cp report.pdf "$BUCKET/reports/2026/"
gcloud storage rsync ./site "$BUCKET/site" --recursive --delete-unmatched-destination-objects
gcloud storage ls -l "$BUCKET/reports/**"

# Grant read to a service account (IAM, not ACLs)
gcloud storage buckets add-iam-policy-binding "$BUCKET" \\
  --member=serviceAccount:orders-api@acme-shop-dev.iam.gserviceaccount.com \\
  --role=roles/storage.objectViewer

# Temporary download link (1 hour) signed by impersonating a service account
gcloud storage sign-url "$BUCKET/reports/2026/report.pdf" --duration=1h \\
  --impersonate-service-account=signer@acme-shop-dev.iam.gserviceaccount.com`,
      codeLabel: 'Secure bucket, lifecycle, rsync, IAM and signed URLs',
      keyPoints: [
        'Turn on uniform bucket-level access and public access prevention.',
        'Pick storage classes (or Autoclass) by access frequency.',
        'Use versioning plus lifecycle rules to balance safety and cost.',
        'Share objects temporarily with signed URLs, not public buckets.',
      ],
    },
    {
      title: 'BigQuery for Analytics',
      after: 'Cloud Storage',
      content: `**BigQuery** is a serverless data warehouse: storage and compute are separate, and you pay per data **scanned** (on-demand) or for reserved slots.

| Feature | Why it matters |
|---|---|
| **Partitioning** (by date/timestamp/integer) | queries scan only the partitions they filter on |
| **Clustering** (up to 4 columns) | prunes blocks inside partitions for filters/joins |
| Nested & repeated fields (\`STRUCT\`, \`ARRAY\`) | store orders with their line items; \`UNNEST\` to query |
| External tables / BigLake | query files in Cloud Storage directly |
| Scheduled queries, materialized views | incremental transforms and fast dashboards |
| BigQuery ML | train/predict with SQL |

### Cost control

- Never \`SELECT *\` — columnar storage bills per column read.
- Always filter on the partition column; set \`require_partition_filter\`.
- Use \`--dry_run\` to see bytes processed before running; set **maximum bytes billed**.`,
      code: `# Create a dataset and a partitioned, clustered table with nested line items
bq --location=EU mk --dataset acme-shop-dev:sales

bq query --use_legacy_sql=false '
CREATE TABLE IF NOT EXISTS sales.orders (
  order_id   STRING NOT NULL,
  customer   STRUCT<id STRING, country STRING>,
  items      ARRAY<STRUCT<sku STRING, qty INT64, price NUMERIC>>,
  status     STRING,
  created_at TIMESTAMP NOT NULL
)
PARTITION BY DATE(created_at)
CLUSTER BY status, customer.country
OPTIONS (require_partition_filter = TRUE, partition_expiration_days = 730)'

# Load newline-delimited JSON from Cloud Storage
bq load --source_format=NEWLINE_DELIMITED_JSON sales.orders gs://acme-shop-dev-exports/orders/2026-10-*.json

# Check cost first, then run with a hard cap on bytes billed
QUERY='
SELECT customer.country, item.sku,
       SUM(item.qty) AS units,
       ROUND(SUM(item.qty * item.price), 2) AS revenue
FROM sales.orders, UNNEST(items) AS item
WHERE DATE(created_at) BETWEEN "2026-10-01" AND "2026-10-31"
  AND status = "PAID"
GROUP BY 1, 2
ORDER BY revenue DESC
LIMIT 20'
bq query --use_legacy_sql=false --dry_run "$QUERY"            # "will process N bytes"
bq query --use_legacy_sql=false --maximum_bytes_billed=1000000000 "$QUERY"

# Which queries cost the most this week?
bq query --use_legacy_sql=false '
SELECT user_email, ROUND(SUM(total_bytes_billed) / POW(1024, 4), 3) AS tib_billed, COUNT(*) AS jobs
FROM \`region-eu\`.INFORMATION_SCHEMA.JOBS
WHERE creation_time > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY) AND job_type = "QUERY"
GROUP BY user_email ORDER BY tib_billed DESC LIMIT 10'`,
      codeLabel: 'Partitioned + clustered table, UNNEST, dry runs and cost audit',
      keyPoints: [
        'Partition by date and cluster by common filters to cut scanned bytes.',
        'Use nested/repeated fields for parent–child data and `UNNEST` to query them.',
        'Avoid `SELECT *`; dry-run queries and cap bytes billed.',
        'Audit spend with `INFORMATION_SCHEMA.JOBS`.',
      ],
    },
    {
      title: 'GKE Essentials',
      after: 'Networking, Security & Service Accounts',
      content: `**Google Kubernetes Engine** runs managed Kubernetes clusters.

| Mode | You manage | Billing |
|---|---|---|
| **Autopilot** (recommended default) | workloads only; Google manages nodes, scaling, security hardening | per pod resource requests |
| **Standard** | node pools, machine types, upgrades | per node VM |

### Key integrations

- **Workload Identity Federation for GKE** — map a Kubernetes service account to IAM without keys.
- **Gateway API / Ingress** with Google Cloud load balancers; **managed certificates**.
- **Artifact Registry** for images; **Binary Authorization** to enforce signed images.
- **Release channels** (rapid/regular/stable) for automatic upgrades.
- **Cloud Logging/Monitoring** and **Managed Service for Prometheus** built in.

Always set **resource requests** (Autopilot bills by them), readiness/liveness probes, and a PodDisruptionBudget for critical services.`,
      code: `# Create an Autopilot cluster and get credentials
gcloud container clusters create-auto shop-prod --region europe-west1 --release-channel regular
gcloud container clusters get-credentials shop-prod --region europe-west1

# Workload Identity: KSA orders-api ↔ GSA orders-api@...
gcloud iam service-accounts add-iam-policy-binding orders-api@acme-shop-prod.iam.gserviceaccount.com \\
  --role roles/iam.workloadIdentityUser \\
  --member "serviceAccount:acme-shop-prod.svc.id.goog[shop/orders-api]"

kubectl apply -f - <<'EOF'
apiVersion: v1
kind: ServiceAccount
metadata:
  name: orders-api
  namespace: shop
  annotations:
    iam.gke.io/gcp-service-account: orders-api@acme-shop-prod.iam.gserviceaccount.com
---
apiVersion: apps/v1
kind: Deployment
metadata: { name: orders-api, namespace: shop }
spec:
  replicas: 3
  selector: { matchLabels: { app: orders-api } }
  template:
    metadata: { labels: { app: orders-api } }
    spec:
      serviceAccountName: orders-api
      containers:
        - name: api
          image: europe-west1-docker.pkg.dev/acme-shop-prod/apps/orders-api:1.4.2
          ports: [{ containerPort: 8080 }]
          resources:
            requests: { cpu: 250m, memory: 512Mi }
            limits: { memory: 512Mi }
          readinessProbe: { httpGet: { path: /health/ready, port: 8080 } }
          livenessProbe:  { httpGet: { path: /health/live,  port: 8080 }, initialDelaySeconds: 10 }
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata: { name: orders-api, namespace: shop }
spec:
  minAvailable: 2
  selector: { matchLabels: { app: orders-api } }
EOF

kubectl -n shop rollout status deploy/orders-api
kubectl -n shop get pods -o wide`,
      codeLabel: 'Autopilot cluster, Workload Identity and a production-ready Deployment',
      keyPoints: [
        'Start with Autopilot unless you need node-level control.',
        'Use Workload Identity instead of service-account keys in pods.',
        'Set resource requests, probes and PodDisruptionBudgets for every service.',
        'Use release channels to stay on supported Kubernetes versions.',
      ],
    },
    {
      title: 'Keyless CI/CD with Workload Identity Federation',
      after: 'CI/CD, Infrastructure as Code & Operations',
      content: `**Workload Identity Federation** lets external identities (GitHub Actions, GitLab, AWS, Azure, any OIDC/SAML provider) obtain short-lived Google credentials — **no JSON keys** to leak or rotate.

### Setup steps

1. Create a **workload identity pool** and an **OIDC provider** for your CI issuer.
2. Add an **attribute condition** restricting which repositories/branches may authenticate.
3. Grant \`roles/iam.workloadIdentityUser\` on a deploy service account to the matching principal set.
4. In CI, exchange the job's OIDC token for Google credentials.

Combine with **Artifact Registry** (images), **Cloud Deploy** (promotion pipelines with approvals) and **Terraform** state in a versioned Cloud Storage bucket.`,
      code: `PROJECT=acme-shop-prod
PROJECT_NUMBER=$(gcloud projects describe $PROJECT --format='value(projectNumber)')

gcloud iam workload-identity-pools create github --project $PROJECT --location global \\
  --display-name "GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc acme-repos --project $PROJECT \\
  --location global --workload-identity-pool github \\
  --issuer-uri "https://token.actions.githubusercontent.com" \\
  --attribute-mapping "google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \\
  --attribute-condition "assertion.repository_owner == 'acme' && assertion.ref == 'refs/heads/main'"

gcloud iam service-accounts add-iam-policy-binding deployer@$PROJECT.iam.gserviceaccount.com \\
  --role roles/iam.workloadIdentityUser \\
  --member "principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github/attribute.repository/acme/shop"

# .github/workflows/deploy.yml
cat > deploy.yml <<'EOF'
name: deploy
on: { push: { branches: [main] } }
permissions: { contents: read, id-token: write }     # id-token is required for OIDC
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: projects/123456789/locations/global/workloadIdentityPools/github/providers/acme-repos
          service_account: deployer@acme-shop-prod.iam.gserviceaccount.com
      - uses: google-github-actions/setup-gcloud@v2
      - run: |
          gcloud run deploy orders-api --source . --region europe-west1 --quiet
EOF`,
      codeLabel: 'OIDC pool + provider for GitHub Actions and a keyless deploy workflow',
      keyPoints: [
        'Workload Identity Federation replaces long-lived service-account keys in CI.',
        'Restrict which repositories and branches can authenticate with attribute conditions.',
        'Grant the CI identity only `workloadIdentityUser` on a narrowly-scoped deploy account.',
        'GitHub workflows need `id-token: write` permission for OIDC.',
      ],
    },
    {
      title: 'Monitoring, Logging & Cost Control',
      after: 'Keyless CI/CD with Workload Identity Federation',
      content: `### Observe

| Tool | Use |
|---|---|
| **Cloud Logging** + Logs Explorer | central logs; write **JSON** to stdout for structured fields (\`severity\`, \`trace\`) |
| **Log-based metrics** | count matching log entries (e.g. payment failures) |
| **Cloud Monitoring** | metrics, dashboards, **uptime checks**, **alerting policies**, SLOs |
| **Cloud Trace / Profiler** | latency traces (OpenTelemetry) and continuous profiling |
| **Error Reporting** | groups exceptions automatically |
| **Log sinks** | route logs to BigQuery / Storage / Pub/Sub (and exclude noisy logs) |

### Control cost

- **Budgets & alerts** per billing account/project, optionally publishing to Pub/Sub for automation.
- **Billing export to BigQuery** for detailed analysis by label/service/SKU.
- **Labels** on every resource (\`env\`, \`team\`, \`app\`).
- **Recommender** for idle VMs, over-provisioned resources and unused IPs; **committed use discounts** for steady workloads; **Spot VMs** for interruptible work.`,
      code: `# Log-based metric: count payment failures from structured logs
gcloud logging metrics create payment_failures \\
  --description="Payment failures in orders-api" \\
  --log-filter='resource.type="cloud_run_revision" AND resource.labels.service_name="orders-api" AND jsonPayload.event="payment_failed"'

# Query recent errors from the CLI
gcloud logging read 'resource.type="cloud_run_revision" AND severity>=ERROR' \\
  --freshness=1h --limit=20 --format='table(timestamp, resource.labels.service_name, jsonPayload.message)'

# Exclude noisy health-check logs from ingestion (saves money)
gcloud logging sinks update _Default \\
  --add-exclusion=name=health-checks,filter='httpRequest.requestUrl:"/health"'

# Uptime check on the public endpoint
gcloud monitoring uptime create orders-api-uptime \\
  --resource-type=uptime-url --resource-labels=host=api.acme.com,project_id=acme-shop-prod \\
  --path=/health --period=1 --protocol=https

# Budget with 50/90/100% alerts
gcloud billing budgets create --billing-account=000000-AAAAAA-BBBBBB \\
  --display-name="shop-prod monthly" --budget-amount=800EUR \\
  --filter-projects=projects/acme-shop-prod \\
  --threshold-rule=percent=0.5 --threshold-rule=percent=0.9 --threshold-rule=percent=1.0

# Idle-resource recommendations
gcloud recommender recommendations list --project=acme-shop-prod --location=europe-west1-b \\
  --recommender=google.compute.instance.IdleResourceRecommender \\
  --format='table(description, primaryImpact.costProjection.cost.units)'`,
      codeLabel: 'Log-based metrics, exclusions, uptime checks, budgets and recommendations',
      keyPoints: [
        'Write structured JSON logs so fields are searchable and countable.',
        'Turn important log events into metrics and alert on them.',
        'Exclude noisy logs and set budgets with alert thresholds.',
        'Use labels, billing export and Recommender to find and cut waste.',
      ],
    },
  ],
};

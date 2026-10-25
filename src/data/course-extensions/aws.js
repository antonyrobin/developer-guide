/*
 * AWS course extension — extra sections and worked examples merged into
 * courses-data/aws.js at load time. CLI examples use AWS CLI v2; Python
 * Lambda handlers run locally with plain `python handler.py` (they include a
 * sample event), so you can test the logic before deploying.
 */

export default {
  examples: {
    'Serverless Request Flow': [
      {
        title: 'API Gateway → Lambda handler, testable locally',
        language: 'python',
        explanation: 'An HTTP API (payload v2) passes `rawPath`, `queryStringParameters`, `pathParameters` and a JSON `body` string. The handler must return `statusCode`, `headers` and a string `body`. The `__main__` block invokes it with a sample event.',
        code: `import json

PRODUCTS = {"1": {"id": "1", "name": "Keyboard", "price": 49.9}}

def respond(status, body):
    return {"statusCode": status, "headers": {"Content-Type": "application/json"}, "body": json.dumps(body)}

def handler(event, context):
    method = event["requestContext"]["http"]["method"]
    product_id = (event.get("pathParameters") or {}).get("id")
    if method == "GET" and product_id:
        product = PRODUCTS.get(product_id)
        return respond(200, product) if product else respond(404, {"error": "not found"})
    if method == "POST":
        data = json.loads(event.get("body") or "{}")
        if not data.get("name"):
            return respond(400, {"error": "name is required"})
        new_id = str(len(PRODUCTS) + 1)
        PRODUCTS[new_id] = {"id": new_id, **data}
        return respond(201, PRODUCTS[new_id])
    return respond(405, {"error": "method not allowed"})

if __name__ == "__main__":
    def event(method, path_id=None, body=None):
        return {"requestContext": {"http": {"method": method}},
                "pathParameters": {"id": path_id} if path_id else None,
                "body": json.dumps(body) if body else None}
    print(handler(event("GET", "1"), None))
    print(handler(event("POST", body={"name": "Mouse", "price": 19}), None)["statusCode"])
    print(handler(event("GET", "9"), None)["statusCode"])`,
        output: `{'statusCode': 200, 'headers': {'Content-Type': 'application/json'}, 'body': '{"id": "1", "name": "Keyboard", "price": 49.9}'}
201
404`,
      },
    ],
  },

  sections: [
    {
      title: 'AWS CLI, Profiles & Credentials',
      after: 'Accounts, Regions & Availability Zones',
      content: `The **AWS CLI v2** is the fastest way to explore and automate AWS. Credentials are resolved in a fixed **provider chain**:

1. Environment variables (\`AWS_ACCESS_KEY_ID\`, \`AWS_SECRET_ACCESS_KEY\`, \`AWS_SESSION_TOKEN\`)
2. **IAM Identity Center (SSO)** / profiles in \`~/.aws/config\` and \`~/.aws/credentials\`
3. Container credentials (ECS task role) or **instance profile** (EC2 role)

| Task | Command |
|---|---|
| Configure SSO login | \`aws configure sso\` then \`aws sso login --profile dev\` |
| Who am I? | \`aws sts get-caller-identity\` |
| Pick a profile | \`--profile prod\` or \`export AWS_PROFILE=prod\` |
| Pick a region | \`--region eu-west-1\` or \`AWS_REGION\` |
| Filter output | \`--query\` (JMESPath) + \`--output table/json/text\` |
| Assume a role | \`aws sts assume-role\` or \`role_arn\` + \`source_profile\` in config |

**Avoid long-lived access keys.** Use SSO for humans and IAM roles for workloads (EC2, Lambda, ECS, GitHub Actions via OIDC).`,
      code: `# ~/.aws/config — SSO for humans, role chaining for prod
cat >> ~/.aws/config <<'EOF'
[sso-session corp]
sso_start_url = https://corp.awsapps.com/start
sso_region = eu-west-1
sso_registration_scopes = sso:account:access

[profile dev]
sso_session = corp
sso_account_id = 111111111111
sso_role_name = Developer
region = eu-west-1

[profile prod-readonly]
sso_session = corp
sso_account_id = 222222222222
sso_role_name = ReadOnly
region = eu-west-1
EOF

aws sso login --profile dev
aws sts get-caller-identity --profile dev

# JMESPath queries: running instances as a table
aws ec2 describe-instances --profile dev \\
  --filters Name=instance-state-name,Values=running \\
  --query 'Reservations[].Instances[].{Id:InstanceId,Type:InstanceType,AZ:Placement.AvailabilityZone,Name:Tags[?Key==\`Name\`]|[0].Value}' \\
  --output table

# Largest S3 buckets' object counts (text output for scripting)
for b in $(aws s3api list-buckets --query 'Buckets[].Name' --output text --profile dev); do
  echo "$b $(aws s3 ls "s3://$b" --recursive --summarize --profile dev | awk '/Total Objects/ {print $3}')"
done`,
      codeLabel: 'SSO profiles, identity check and JMESPath queries',
      keyPoints: [
        'Credentials come from a provider chain: env vars, profiles/SSO, then roles.',
        'Use IAM Identity Center (SSO) for people and roles for workloads.',
        'Check the active identity with `aws sts get-caller-identity`.',
        'Use `--query` and `--output` to shape CLI results for humans or scripts.',
      ],
    },
    {
      title: 'IAM Policies in Practice',
      after: 'Networking, IAM & Security Foundations',
      content: `A request is allowed only if some policy **allows** it and nothing **denies** it (explicit deny always wins).

| Policy type | Attached to | Purpose |
|---|---|---|
| **Identity-based** | users, groups, roles | what this principal can do |
| **Resource-based** | S3 bucket, SQS queue, KMS key, Lambda | who can access this resource (incl. other accounts) |
| **Trust policy** | role | who may **assume** the role |
| **Permissions boundary** | user/role | maximum permissions it can ever get |
| **SCP** (Organizations) | accounts / OUs | guardrails for whole accounts |
| **Session policy** | assumed session | further restrict a session |

### Policy anatomy

\`Effect\` (Allow/Deny), \`Action\` (\`s3:GetObject\`), \`Resource\` (ARN), optional \`Condition\` (\`aws:SourceIp\`, \`aws:PrincipalTag/team\`, \`s3:prefix\`, \`aws:SecureTransport\`).

Start from **least privilege**: scope actions and resources, then use **IAM Access Analyzer** to generate policies from CloudTrail activity and flag public/cross-account access.`,
      code: `// 1) Identity policy for an app role: read/write only its own prefix, require TLS
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListOwnPrefix",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::acme-uploads",
      "Condition": { "StringLike": { "s3:prefix": ["orders-service/*"] } }
    },
    {
      "Sid": "ReadWriteOwnObjects",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::acme-uploads/orders-service/*"
    },
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::acme-uploads", "arn:aws:s3:::acme-uploads/*"],
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    }
  ]
}

// 2) Trust policy: let GitHub Actions (OIDC) assume a deploy role for one repo + branch
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::111111111111:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      "StringLike":   { "token.actions.githubusercontent.com:sub": "repo:acme/shop:ref:refs/heads/main" }
    }
  }]
}

// Test before deploying:
// aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::111111111111:role/orders-app \\
//   --action-names s3:GetObject --resource-arns arn:aws:s3:::acme-uploads/other-team/x.csv`,
      codeLabel: 'Least-privilege identity policy and an OIDC trust policy',
      codeLanguage: 'json',
      keyPoints: [
        'Explicit deny beats allow; everything not allowed is denied.',
        'Scope actions, resources and conditions as tightly as possible.',
        'Use roles with trust policies (incl. OIDC for CI) instead of access keys.',
        'Validate with the policy simulator and IAM Access Analyzer.',
      ],
    },
    {
      title: 'S3 in Depth',
      after: 'Storage and Database Services',
      content: `S3 stores **objects** (up to 5 TB) in **buckets**, with 11 nines of durability.

| Storage class | Use |
|---|---|
| Standard | hot data |
| Intelligent-Tiering | unknown/changing access patterns |
| Standard-IA / One Zone-IA | infrequent access, millisecond retrieval |
| Glacier Instant / Flexible / Deep Archive | archives (ms → hours to restore) |

### Features you will use

- **Block Public Access** (on by default) + **bucket policies** for access control.
- **Versioning** + **lifecycle rules** (transition to IA/Glacier, expire old versions).
- **Encryption** at rest is on by default (SSE-S3); use **SSE-KMS** for key control and audit.
- **Presigned URLs** give temporary upload/download access without making objects public.
- **Event notifications** → Lambda / SQS / EventBridge on uploads.
- **Static website** hosting — put **CloudFront** in front with Origin Access Control.`,
      code: `BUCKET=acme-uploads-$RANDOM
aws s3api create-bucket --bucket "$BUCKET" --region eu-west-1 \\
  --create-bucket-configuration LocationConstraint=eu-west-1
aws s3api put-bucket-versioning --bucket "$BUCKET" --versioning-configuration Status=Enabled
aws s3api put-public-access-block --bucket "$BUCKET" --public-access-block-configuration \\
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Lifecycle: logs → IA after 30 days → Glacier after 90 → delete after 365; trim old versions
aws s3api put-bucket-lifecycle-configuration --bucket "$BUCKET" --lifecycle-configuration '{
  "Rules": [{
    "ID": "logs-tiering", "Status": "Enabled", "Filter": { "Prefix": "logs/" },
    "Transitions": [ { "Days": 30, "StorageClass": "STANDARD_IA" }, { "Days": 90, "StorageClass": "GLACIER" } ],
    "Expiration": { "Days": 365 },
    "NoncurrentVersionExpiration": { "NoncurrentDays": 30 },
    "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
  }]
}'

# Copy and sync
aws s3 cp report.pdf "s3://$BUCKET/reports/2026/report.pdf" --sse aws:kms
aws s3 sync ./site "s3://$BUCKET/site/" --delete --exclude "*.map"

# Temporary download link (15 minutes) — no public access needed
aws s3 presign "s3://$BUCKET/reports/2026/report.pdf" --expires-in 900

# Inspect
aws s3api list-object-versions --bucket "$BUCKET" --prefix reports/ \\
  --query 'Versions[].{Key:Key,Version:VersionId,Latest:IsLatest,Size:Size}' --output table`,
      codeLabel: 'Secure bucket, lifecycle tiers, sync and presigned URLs',
      keyPoints: [
        'Keep Block Public Access on; share via presigned URLs or CloudFront.',
        'Enable versioning and lifecycle rules to control cost and recover from mistakes.',
        'Choose storage classes by access frequency and retrieval time.',
        'Use SSE-KMS when you need key control and access auditing.',
      ],
    },
    {
      title: 'DynamoDB Data Modeling',
      after: 'S3 in Depth',
      content: `DynamoDB is a serverless key-value/document database with single-digit-millisecond latency at any scale — **if** you model for your access patterns.

| Concept | Meaning |
|---|---|
| **Partition key (PK)** | hashed to choose a partition; must spread load |
| **Sort key (SK)** | orders items within a partition; enables range queries (\`begins_with\`, \`between\`) |
| **Item collection** | all items sharing a PK — fetched with one \`Query\` |
| **GSI** | alternate PK/SK for other access patterns (eventually consistent) |
| **LSI** | alternate SK, same PK (created with the table) |
| Capacity | on-demand (pay per request) or provisioned + auto scaling |

### Design steps

1. **List access patterns first** ("get customer's orders newest first", "orders by status").
2. Choose PK/SK (often generic \`PK\`/\`SK\` with prefixes — **single-table design**).
3. Add GSIs for remaining patterns.
4. Avoid \`Scan\` in production; use \`Query\`. Use **conditional writes** for uniqueness and optimistic locking, and **TTL** for expiry.`,
      code: `# Table: customer + orders in one item collection (single-table design)
aws dynamodb create-table --table-name Shop \\
  --attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S \\
                          AttributeName=GSI1PK,AttributeType=S AttributeName=GSI1SK,AttributeType=S \\
  --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE \\
  --global-secondary-indexes '[{"IndexName":"GSI1","KeySchema":[{"AttributeName":"GSI1PK","KeyType":"HASH"},{"AttributeName":"GSI1SK","KeyType":"RANGE"}],"Projection":{"ProjectionType":"ALL"}}]' \\
  --billing-mode PAY_PER_REQUEST

# Items:  PK=CUSTOMER#42  SK=PROFILE            → customer profile
#         PK=CUSTOMER#42  SK=ORDER#2026-10-25#A → order (sorted by date)
#         GSI1PK=STATUS#PENDING GSI1SK=2026-10-25#A → "pending orders by date"
aws dynamodb put-item --table-name Shop --item '{
  "PK": {"S": "CUSTOMER#42"}, "SK": {"S": "PROFILE"}, "name": {"S": "Ada"}, "email": {"S": "ada@example.com"}
}' --condition-expression "attribute_not_exists(PK)"          # insert-only

aws dynamodb put-item --table-name Shop --item '{
  "PK": {"S": "CUSTOMER#42"}, "SK": {"S": "ORDER#2026-10-25#A"}, "total": {"N": "99.50"},
  "status": {"S": "PENDING"}, "GSI1PK": {"S": "STATUS#PENDING"}, "GSI1SK": {"S": "2026-10-25#A"}
}'

# Access pattern 1: a customer's orders, newest first
aws dynamodb query --table-name Shop \\
  --key-condition-expression "PK = :pk AND begins_with(SK, :o)" \\
  --expression-attribute-values '{":pk":{"S":"CUSTOMER#42"},":o":{"S":"ORDER#"}}' \\
  --no-scan-index-forward --limit 10

# Access pattern 2: all pending orders (GSI)
aws dynamodb query --table-name Shop --index-name GSI1 \\
  --key-condition-expression "GSI1PK = :s" \\
  --expression-attribute-values '{":s":{"S":"STATUS#PENDING"}}'

# Atomic status change only if still pending
aws dynamodb update-item --table-name Shop \\
  --key '{"PK":{"S":"CUSTOMER#42"},"SK":{"S":"ORDER#2026-10-25#A"}}' \\
  --update-expression "SET #s = :paid REMOVE GSI1PK, GSI1SK" \\
  --condition-expression "#s = :pending" \\
  --expression-attribute-names '{"#s":"status"}' \\
  --expression-attribute-values '{":paid":{"S":"PAID"},":pending":{"S":"PENDING"}}'`,
      codeLabel: 'Single-table design with a GSI and conditional writes',
      keyPoints: [
        'Start from access patterns, then design keys — not the other way round.',
        'Partition keys must spread traffic; sort keys enable range queries.',
        'Use GSIs for additional patterns and avoid Scan in hot paths.',
        'Conditional expressions give uniqueness and optimistic concurrency.',
      ],
    },
    {
      title: 'VPC Networking',
      after: 'IAM Policies in Practice',
      content: `A **VPC** is your private network in a region. A typical production layout spans **2–3 AZs**:

| Component | Role |
|---|---|
| **Public subnets** | load balancers, NAT gateways; route \`0.0.0.0/0\` → Internet Gateway |
| **Private subnets** | app servers, containers, Lambda (in VPC); outbound via **NAT gateway** |
| **Isolated subnets** | databases; no internet route at all |
| **Security groups** | stateful, instance-level allow rules (reference other SGs!) |
| **Network ACLs** | stateless subnet-level rules (rarely needed) |
| **VPC endpoints** | private access to S3/DynamoDB (gateway) and other services (interface/PrivateLink) — saves NAT cost |
| **Peering / Transit Gateway** | connect VPCs and on-prem networks |

Plan CIDR ranges up front (e.g. \`/16\` per VPC, non-overlapping across accounts), and turn on **VPC Flow Logs** for troubleshooting and security.`,
      code: `# Terraform — 3-tier VPC using the community module
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "shop-prod"
  cidr = "10.20.0.0/16"
  azs  = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]

  public_subnets   = ["10.20.0.0/24", "10.20.1.0/24", "10.20.2.0/24"]
  private_subnets  = ["10.20.10.0/24", "10.20.11.0/24", "10.20.12.0/24"]
  database_subnets = ["10.20.20.0/24", "10.20.21.0/24", "10.20.22.0/24"]

  enable_nat_gateway     = true
  one_nat_gateway_per_az = true          # survive an AZ outage
  enable_dns_hostnames   = true
  enable_flow_log                      = true
  create_flow_log_cloudwatch_log_group = true
  create_flow_log_cloudwatch_iam_role  = true
}

# Gateway endpoint: S3 traffic stays private and skips NAT charges
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = module.vpc.vpc_id
  service_name      = "com.amazonaws.eu-west-1.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = module.vpc.private_route_table_ids
}

# Security groups referencing each other: ALB → app → DB
resource "aws_security_group" "alb" {
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "app" {
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "db" {
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [aws_security_group.app.id]
  }
}`,
      codeLabel: 'Three-tier VPC, S3 endpoint and chained security groups (Terraform)',
      codeLanguage: 'hcl',
      keyPoints: [
        'Spread public, private and isolated subnets across at least two AZs.',
        'Keep databases in subnets without internet routes.',
        'Chain security groups by reference instead of opening CIDR ranges.',
        'Use VPC endpoints for S3/DynamoDB to stay private and cut NAT costs.',
      ],
    },
    {
      title: 'Lambda in Practice',
      after: 'Serverless Request Flow',
      content: `| Setting | Guidance |
|---|---|
| Memory (128 MB–10 GB) | also scales CPU — more memory is often **faster and cheaper** |
| Timeout (max 15 min) | set slightly above p99 duration; API Gateway caps at 29 s |
| Concurrency | reserved (limit/guarantee) and provisioned (no cold starts) |
| Cold starts | keep packages small, init SDK clients **outside** the handler, SnapStart (Java/Python/.NET) |
| Configuration | environment variables; secrets from **Secrets Manager / Parameter Store** (cache them) |
| Packaging | zip, layers, or container images (up to 10 GB) |
| Observability | structured logs, **Powertools for AWS Lambda** (logger, metrics, tracer, idempotency) |

### Event sources

Synchronous (API Gateway, ALB, function URLs), asynchronous (S3, SNS, EventBridge — retries + DLQ/on-failure destination), and **poll-based** (SQS, Kinesis, DynamoDB Streams — batches, partial batch failures).

Design handlers to be **idempotent**: most event sources deliver **at least once**.`,
      code: `# handler.py — SQS batch consumer with partial batch failure reporting
# Enable "ReportBatchItemFailures" on the event source mapping so only failed
# messages are retried (instead of the whole batch).
import json, os, logging

logger = logging.getLogger()
logger.setLevel(os.environ.get("LOG_LEVEL", "INFO"))

PROCESSED = set()            # stand-in for a DynamoDB idempotency table; lives across warm invocations

def process(order):
    if order["total"] <= 0:
        raise ValueError(f"invalid total for {order['orderId']}")
    if order["orderId"] in PROCESSED:
        logger.info("duplicate %s skipped", order["orderId"])   # idempotent
        return
    PROCESSED.add(order["orderId"])
    logger.info("charged %s %.2f", order["orderId"], order["total"])

def handler(event, context):
    failures = []
    for record in event["Records"]:
        try:
            process(json.loads(record["body"]))
        except Exception as exc:
            logger.error("failed %s: %s", record["messageId"], exc)
            failures.append({"itemIdentifier": record["messageId"]})
    return {"batchItemFailures": failures}

if __name__ == "__main__":
    logging.basicConfig(format="%(levelname)s %(message)s")
    sample = {"Records": [
        {"messageId": "m1", "body": json.dumps({"orderId": "A1", "total": 10})},
        {"messageId": "m2", "body": json.dumps({"orderId": "A2", "total": -5})},
        {"messageId": "m3", "body": json.dumps({"orderId": "A1", "total": 10})},   # redelivery
    ]}
    print(handler(sample, None))`,
      codeLabel: 'SQS-triggered Lambda with partial batch failures and idempotency',
      codeLanguage: 'python',
      keyPoints: [
        'Tune memory for speed and cost; initialise clients outside the handler.',
        'Most triggers are at-least-once — make handlers idempotent.',
        'Report partial batch failures for SQS/Kinesis to avoid reprocessing successes.',
        'Configure DLQs or on-failure destinations for async invocations.',
      ],
    },
    {
      title: 'Messaging: SQS, SNS & EventBridge',
      after: 'Lambda in Practice',
      content: `| Service | Model | Use when |
|---|---|---|
| **SQS** | queue (pull), one consumer group | decouple producers/consumers, buffer spikes, work queues |
| SQS **FIFO** | ordered per message group, exactly-once processing (dedup window) | order-sensitive workflows |
| **SNS** | pub/sub push to many subscribers | fan-out to SQS queues, Lambda, email/SMS |
| **EventBridge** | event bus with content-based **rules**, schema registry, archive/replay, scheduler | event-driven architectures, SaaS/AWS service events |
| Kinesis / MSK | ordered streams with replay | high-throughput streaming, analytics |

### SQS essentials

- **Visibility timeout** ≥ 6× the consumer's processing time (for Lambda).
- **Dead-letter queue** after N receives (\`maxReceiveCount\`) — and alarm on its depth.
- Long polling (\`WaitTimeSeconds=20\`) reduces empty receives and cost.

Typical pattern: **SNS/EventBridge → SQS per consumer → Lambda/ECS** — each consumer gets its own buffer and retry policy.`,
      code: `# Queue + DLQ
DLQ_URL=$(aws sqs create-queue --queue-name orders-dlq --query QueueUrl --output text)
DLQ_ARN=$(aws sqs get-queue-attributes --queue-url "$DLQ_URL" --attribute-names QueueArn --query Attributes.QueueArn --output text)
cat > orders-queue.json <<EOF
{
  "VisibilityTimeout": "180",
  "ReceiveMessageWaitTimeSeconds": "20",
  "RedrivePolicy": "{\\"deadLetterTargetArn\\":\\"$DLQ_ARN\\",\\"maxReceiveCount\\":\\"5\\"}"
}
EOF
aws sqs create-queue --queue-name orders --attributes file://orders-queue.json

# EventBridge rule: route only large paid orders from our app to the queue
aws events put-rule --name large-paid-orders --event-bus-name default --event-pattern '{
  "source": ["com.acme.shop"],
  "detail-type": ["OrderPaid"],
  "detail": { "total": [{ "numeric": [">=", 1000] }], "currency": ["EUR", "USD"] }
}'
QUEUE_ARN=$(aws sqs get-queue-attributes --queue-url "$(aws sqs get-queue-url --queue-name orders --query QueueUrl --output text)" \\
  --attribute-names QueueArn --query Attributes.QueueArn --output text)
aws events put-targets --rule large-paid-orders --targets "Id"="orders-queue","Arn"="$QUEUE_ARN"
# (the queue also needs a resource policy allowing events.amazonaws.com to SendMessage)

# Publish a test event
aws events put-events --entries '[{
  "Source": "com.acme.shop", "DetailType": "OrderPaid",
  "Detail": "{\\"orderId\\":\\"A-1001\\",\\"total\\":1250,\\"currency\\":\\"EUR\\"}"
}]'

# Inspect / redrive
aws sqs receive-message --queue-url "$DLQ_URL" --max-number-of-messages 5 --wait-time-seconds 5
aws sqs start-message-move-task --source-arn "$DLQ_ARN"        # move DLQ messages back to the source queue`,
      codeLabel: 'Queue with DLQ, EventBridge content filtering and redrive',
      keyPoints: [
        'SQS buffers work for one consumer; SNS and EventBridge fan out to many.',
        'Always attach a dead-letter queue and alarm on its depth.',
        'Set visibility timeout well above processing time and use long polling.',
        'EventBridge rules filter on event content, so consumers get only what they need.',
      ],
    },
    {
      title: 'CloudWatch Monitoring & Cost Control',
      after: 'Deployment, IaC & Observability',
      content: `### Observe

| Tool | Use |
|---|---|
| **CloudWatch Metrics** | built-in service metrics + custom metrics (Embedded Metric Format in logs) |
| **CloudWatch Logs + Logs Insights** | central logs with a query language |
| **Alarms** | thresholds or anomaly detection → SNS / auto scaling / incident tools |
| **X-Ray / Application Signals** | distributed traces and service maps (OpenTelemetry supported) |
| **CloudTrail** | who did what via the API — keep an org trail on |

Set **log retention** (default is *never expire*).

### Control cost

- **Budgets** with alerts (actual and forecast), **Cost Explorer**, **Cost Anomaly Detection**.
- **Tag** everything (\`project\`, \`env\`, \`owner\`) and activate cost-allocation tags.
- Right-size with **Compute Optimizer**; buy **Savings Plans** for steady usage; use **Spot** for fault-tolerant work.
- Classic surprises: idle NAT gateways, unattached EBS volumes/EIPs, old snapshots, never-expiring logs, cross-AZ data transfer.`,
      code: `# Logs Insights: top error messages in the last hour
aws logs start-query --log-group-name /aws/lambda/orders-handler \\
  --start-time $(($(date +%s) - 3600)) --end-time $(date +%s) \\
  --query-string 'fields @timestamp, @message
    | filter level = "ERROR"
    | stats count(*) as errors by message
    | sort errors desc | limit 10'
# then: aws logs get-query-results --query-id <id>

# Never-expiring log groups → 30-day retention
for g in $(aws logs describe-log-groups --query 'logGroups[?!retentionInDays].logGroupName' --output text); do
  aws logs put-retention-policy --log-group-name "$g" --retention-in-days 30
done

# Alarm: Lambda errors > 5 in 5 minutes → SNS topic
aws cloudwatch put-metric-alarm --alarm-name orders-handler-errors \\
  --namespace AWS/Lambda --metric-name Errors --dimensions Name=FunctionName,Value=orders-handler \\
  --statistic Sum --period 300 --evaluation-periods 1 --threshold 5 \\
  --comparison-operator GreaterThanThreshold --treat-missing-data notBreaching \\
  --alarm-actions arn:aws:sns:eu-west-1:111111111111:oncall

# Monthly budget with an 80% forecast alert
aws budgets create-budget --account-id 111111111111 \\
  --budget '{"BudgetName":"monthly-total","BudgetLimit":{"Amount":"500","Unit":"USD"},"TimeUnit":"MONTHLY","BudgetType":"COST"}' \\
  --notifications-with-subscribers '[{"Notification":{"NotificationType":"FORECASTED","ComparisonOperator":"GREATER_THAN","Threshold":80},
    "Subscribers":[{"SubscriptionType":"EMAIL","Address":"finops@example.com"}]}]'

# Cost by service for last month
aws ce get-cost-and-usage --time-period Start=$(date -d "$(date +%Y-%m-01) -1 month" +%F),End=$(date +%Y-%m-01) \\
  --granularity MONTHLY --metrics UnblendedCost --group-by Type=DIMENSION,Key=SERVICE \\
  --query 'ResultsByTime[0].Groups[].[Keys[0],Metrics.UnblendedCost.Amount]' --output table

# Find waste: unattached EBS volumes
aws ec2 describe-volumes --filters Name=status,Values=available \\
  --query 'Volumes[].{Id:VolumeId,GiB:Size,Created:CreateTime}' --output table`,
      codeLabel: 'Logs Insights, retention, alarms, budgets and waste hunting',
      keyPoints: [
        'Set log retention explicitly and query logs with Logs Insights.',
        'Alarm on symptoms users feel (errors, latency, queue depth) and route to on-call.',
        'Create budgets with forecast alerts and tag resources for cost allocation.',
        'Regularly remove idle resources: NAT gateways, volumes, snapshots, IPs.',
      ],
    },
  ],
};

export const rabbitmqCourse = {
    id: 'rabbitmq', title: 'RabbitMQ + MassTransit', description: 'Industry-standard message broker with MassTransit abstraction for building event-driven microservices in .NET, Java, Python, Node.js, and Go.',
    officialDocs: 'https://www.rabbitmq.com/docs', tutorialLink: 'https://www.rabbitmq.com/tutorials', exerciseLink: null,
    sections: [
      { title: 'What is RabbitMQ', image: '/images/rabbitmq/rabbitmq-overview.svg', content: `**RabbitMQ** is an open-source message broker that enables applications to communicate asynchronously through message queues. It implements the **AMQP (Advanced Message Queuing Protocol)** standard.

### Why Use a Message Broker?

| Problem | Solution |
|---|---|
| **Tight coupling** | Services communicate via messages instead of direct calls |
| **Service unavailability** | Messages queue up and are processed when the service recovers |
| **Traffic spikes** | Queue absorbs bursts — consumers process at their own pace |
| **Fire-and-forget** | Producer publishes and moves on — no waiting for response |
| **Fan-out** | One event notifies multiple services simultaneously |

### Key Concepts

| Concept | Description |
|---|---|
| **Producer** | Application that sends messages |
| **Consumer** | Application that receives and processes messages |
| **Queue** | Buffer that stores messages until consumed |
| **Exchange** | Routes messages to queues based on rules |
| **Binding** | Link between an exchange and a queue |
| **Routing Key** | Label used by the exchange for routing decisions |
| **Virtual Host** | Logical namespace for isolation (like a database schema) |
| **Channel** | Multiplexed connection for efficiency |

### RabbitMQ vs Alternatives

| Feature | RabbitMQ | Apache Kafka | Azure Service Bus |
|---|---|---|---|
| **Model** | Message Queue | Event Log | Message Queue |
| **Protocol** | AMQP | Custom | AMQP |
| **Ordering** | Per-queue | Per-partition | Per-session |
| **Replay** | ❌ | ✅ | ❌ |
| **Best For** | Task queues, RPC | Event streaming, analytics | Azure-native apps |`, keyPoints: ['RabbitMQ enables asynchronous, decoupled communication between services.', 'Messages queue up when consumers are slow or offline.', 'Exchanges route messages to queues based on routing keys.', 'Supports AMQP protocol — clients available for all major languages.', 'Best for task queues, notifications, and microservice events.'] },

      { title: 'Installation & Setup', content: `### Local Installation

| Platform | Method |
|---|---|
| **Docker (Recommended)** | \`docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management\` |
| **Windows** | Download from [rabbitmq.com/install-windows.html](https://www.rabbitmq.com/docs/install-windows) |
| **macOS** | \`brew install rabbitmq\` |
| **Linux** | \`sudo apt-get install rabbitmq-server\` |

### Docker Compose Setup

\`\`\`yaml
# docker-compose.yml
services:
  rabbitmq:
    image: rabbitmq:3.13-management-alpine
    ports:
      - "5672:5672"     # AMQP protocol
      - "15672:15672"   # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: secret
      RABBITMQ_DEFAULT_VHOST: /
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  rabbitmq_data:
\`\`\`

### Management UI

After starting RabbitMQ, open **http://localhost:15672** to access the management dashboard.

| Feature | Path |
|---|---|
| **Overview** | Connections, channels, queues, messages in/out |
| **Queues** | Create, inspect, purge, and delete queues |
| **Exchanges** | View and manage exchange bindings |
| **Users** | Create users and set permissions |
| **Virtual Hosts** | Create isolated environments |

### Configuration

\`\`\`text
# rabbitmq.conf (key settings)
listeners.tcp.default = 5672
management.tcp.port = 15672

# Memory and disk limits
vm_memory_high_watermark.relative = 0.7
disk_free_limit.absolute = 2GB

# Durable queues by default
queue.default.durable = true
\`\`\``, keyPoints: ['Docker is the recommended installation method for local development.', 'Port 5672 is AMQP, port 15672 is the management web UI.', 'Management UI provides full visibility into queues and messages.', 'Health checks ensure RabbitMQ is ready before starting dependent services.', 'Configure memory and disk limits to prevent resource exhaustion.'] },

      { title: 'Exchange Types & Routing', image: '/images/rabbitmq/rabbitmq-exchange.svg', content: `### Exchange Types

| Type | Routing | Use Case |
|---|---|---|
| **Direct** | Exact routing key match | Task queues, specific routing |
| **Fanout** | Broadcast to ALL bound queues | Notifications, events |
| **Topic** | Wildcard pattern matching (\`*\`, \`#\`) | Log routing, flexible subscriptions |
| **Headers** | Header attribute matching | Complex routing logic |

### Direct Exchange Example

\`\`\`text
Producer → exchange: "orders" (routing_key: "new")
  ├── Queue: "order-processing" (binding: "new")      ✅ Receives
  └── Queue: "order-analytics" (binding: "completed")  ❌ Skipped
\`\`\`

### Fanout Exchange Example

\`\`\`text
Producer → exchange: "events" (type: fanout)
  ├── Queue: "email-service"      ✅ Receives
  ├── Queue: "notification-svc"   ✅ Receives
  └── Queue: "analytics-svc"     ✅ Receives
\`\`\`

### Topic Exchange Example

\`\`\`text
Producer → exchange: "logs" (routing_key: "app.orders.error")
  ├── Queue: "all-logs"     (binding: "#")             ✅ Matches all
  ├── Queue: "order-logs"   (binding: "app.orders.*")  ✅ Matches
  └── Queue: "error-logs"   (binding: "*.*.error")     ✅ Matches
\`\`\`

### Message Properties

| Property | Purpose |
|---|---|
| **delivery_mode=2** | Persistent message (survives broker restart) |
| **content_type** | MIME type (e.g., \`application/json\`) |
| **correlation_id** | Request-response correlation |
| **reply_to** | RPC callback queue |
| **expiration** | Message TTL in milliseconds |
| **priority** | 0-9 priority level |`, keyPoints: ['Direct exchanges route by exact routing key match — use for task queues.', 'Fanout exchanges broadcast to all bound queues — use for notifications.', 'Topic exchanges support wildcards (* = one word, # = zero or more).', 'Set delivery_mode=2 for persistent messages that survive restarts.', 'Use correlation_id for request-response (RPC) patterns.'] },

      { title: 'Lifecycle, Configurations & High-Traffic Tuning', content: `Understanding message and connection lifecycles, configuration parameters, and tuning techniques is essential for running RabbitMQ under high load.

### 1. Message & Connection Lifecycle

- **Message States**:
  1. **Published**: Sent by producer to an Exchange.
  2. **Routed**: Evaluated against bindings and placed into target Queues (state: \`Ready\`).
  3. **Delivered / Unacknowledged**: Delivered to active consumer over AMQP channel (state: \`Unacked\`).
  4. **Processed & Acknowledged**: Consumer calls \`basic.ack\` → message is deleted from queue.
  5. **Rejected / Dead-Lettered**: Consumer calls \`basic.nack(requeue=false)\` or message TTL expires → routed to Dead Letter Exchange (DLX).
- **Connection & Channel Lifecycle**: TCP connection is established once; multiple lightweight AMQP channels are multiplexed over it. Channels should be long-lived and reused.

---

### 2. RabbitMQ Configuration Reference (\`rabbitmq.conf\`)

| Setting | Default | Recommended Production Value | Purpose |
|---|---|---|---|
| **\`vm_memory_high_watermark.relative\`** | \`0.4\` | \`0.6\` - \`0.7\` | Blocks publishers when RAM reaches threshold |
| **\`vm_memory_high_watermark_paging_ratio\`**| \`0.5\` | \`0.5\` | Ratio at which queue contents page to disk |
| **\`disk_free_limit.absolute\`** | \`50MB\` | \`5GB\` - \`10GB\` | Blocks publishers if disk space falls below limit |
| **\`heartbeat\`** | \`60\` | \`30\` - \`60\` | Heartbeat interval in seconds to detect stale TCP |
| **\`channel_max\`** | \`2047\` | \`2047\` | Maximum concurrent channels per connection |
| **\`consumer_timeout\`** | \`1800000\` (30m) | \`900000\` (15m) | Max time consumer can hold unacked message |

---

### 3. Handling High-Traffic Queues & Preventing Bottlenecks

1. **Consumer Prefetch Tuning (\`basic.qos\`)**:
   - By default, RabbitMQ pushes messages greedily to connected consumers, which can overwhelm consumer memory.
   - Set \`basic.qos(prefetch_count = 50)\` to maintain a controlled pipeline of unacknowledged messages.
2. **Quorum Queues (Raft Consensus)**:
   - Modern replacement for legacy mirrored classic queues.
   - Uses the Raft consensus algorithm across 3 or 5 cluster nodes for data safety, high availability, and poison message handling.
3. **Lazy Queues (\`x-queue-mode: lazy\`)**:
   - Moves messages to disk as early as possible and loads them into RAM only when requested by consumers.
   - Essential for absorbing spikes of millions of messages without inflating RAM usage.
4. **Publisher Confirms**:
   - Enables asynchronous acknowledgment from the broker to the producer, guaranteeing that messages reached disk or replicated queues before proceeding.`, code: `# rabbitmq.conf — High-Performance Production Setup
listeners.tcp.default = 5672
management.tcp.port = 15672

# Memory & Resource Limits
vm_memory_high_watermark.relative = 0.65
vm_memory_high_watermark_paging_ratio = 0.5
disk_free_limit.absolute = 10GB

# TCP Connection & Channel Tuning
heartbeat = 30
channel_max = 2047
tcp_listen_options.backlog = 4096
tcp_listen_options.nodelay = true

# Cluster & Quorum Queue Settings
cluster_formation.peer_discovery_backend = classic_config
cluster_partition_handling = autoheal

# Consumer Timeout (15 minutes)
consumer_timeout = 900000`, codeLabel: 'High-Traffic rabbitmq.conf Template', keyPoints: ['Message moves: Ready → Unacked → Acked / Nacked / Dead-Lettered.', 'Always configure prefetch (e.g. 50-100) on consumers to prevent memory overload.', 'Use Quorum Queues for high-availability distributed data consistency.', 'Enable Lazy Queues (x-queue-mode: lazy) to absorb massive message backlogs onto disk.', 'Publisher confirms guarantee data persistence before producer commits.'] },

      { title: 'Sensitive Data & PII Message Transfer Patterns', content: `Sending sensitive information (such as **email addresses**, **passwords**, **credit card numbers**, or **health records**) through message brokers requires stringent security controls.

### 1. The Risk of Plaintext Payloads in Message Queues

- Queues persist messages to disk and store them in unencrypted broker logs.
- RabbitMQ Management UI allows authorized users with view access to read payload bodies.
- Multiple consumers or analytics monitors might consume unmasked payload fields.

---

### 2. Pattern A: Payload Envelope Encryption (AES-256 GCM)

Encrypt sensitive payload data with symmetric encryption before publishing to RabbitMQ, and decrypt inside the authorized consumer:

\`\`\`text
Producer ──▶ [ AES-256 Encrypt (PII) ] ──▶ RabbitMQ Message ──▶ [ Consumer ] ──▶ [ Decrypt ]
\`\`\`

### 3. Pattern B: Claim-Check Pattern (Recommended for Large / Sensitive Data)

Instead of passing the sensitive payload through the message broker:
1. Producer stores the full encrypted recipient list or sensitive data in an encrypted object store / Key Vault / Redis.
2. Producer publishes a lightweight notification message containing only a **Claim-Check ID** / Reference Token.
3. Consumer retrieves the data directly from the secure vault using the ID and deletes it upon completion.

### 4. Transport & Access Security

- **AMQPS (Port 5671)**: Always mandate TLS 1.3 encryption between clients and the broker.
- **Virtual Host Isolation**: Separate sensitive workflows into isolated vhosts (e.g., \`/pci-compliance\`) with restricted credentials.`, code: `// Java: AES-256 GCM Envelope Encryption Utility for RabbitMQ Payloads
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.security.SecureRandom;
import java.util.Base64;

public class PayloadEncryptor {
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    public static String encrypt(String plaintext, SecretKey key) throws Exception {
        byte[] iv = new byte[GCM_IV_LENGTH];
        new SecureRandom().nextBytes(iv);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);

        byte[] cipherText = cipher.doFinal(plaintext.getBytes());
        byte[] combined = new byte[iv.length + cipherText.length];
        System.arraycopy(iv, 0, combined, 0, iv.length);
        System.arraycopy(cipherText, 0, combined, iv.length, cipherText.length);

        return Base64.getEncoder().encodeToString(combined);
    }

    public static String decrypt(String encryptedBase64, SecretKey key) throws Exception {
        byte[] combined = Base64.getDecoder().decode(encryptedBase64);
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, combined, 0, GCM_IV_LENGTH);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.DECRYPT_MODE, key, spec);

        byte[] plaintext = cipher.doFinal(combined, GCM_IV_LENGTH, combined.length - GCM_IV_LENGTH);
        return new String(plaintext);
    }
}`, codeLabel: 'AES-256 GCM Message Payload Encryption', keyPoints: ['Never send raw passwords or unencrypted credit cards in message payloads.', 'Use AES-256-GCM Envelope Encryption for encrypting sensitive PII fields.', 'Apply the Claim-Check Pattern to store sensitive large data in secure storage.', 'Mandate AMQPS (port 5671) with TLS 1.3 in all production environments.', 'Isolate compliance-sensitive queues into restricted virtual hosts.'] },

      { title: 'Real-World Scenario: Multi-Recipient Email Broadcast Engine', image: '/images/rabbitmq/rabbitmq-email-workflow.svg', content: `### Scenario: Mass Email Notification System

**Requirement**: An administrator triggers a marketing announcement to **10,000 users simultaneously**. The system must handle high throughput, maintain order where required, throttle email dispatch to adhere to SMTP provider limits, prevent duplicates, and recover gracefully from failures.

---

### Step-by-Step Architecture Flow

1. **Trigger & Batching**:
   - Admin triggers the request via API Gateway (\`POST /campaigns/broadcast\`).
   - The Broadcast Service splits 10,000 recipients into chunks of **50 recipients** (200 lightweight messages).
   - Each message is assigned a unique \`broadcast_id\` and \`chunk_id\` with idempotency tracking.

2. **Publishing**:
   - Messages are published to \`email.broadcast.exchange\` (Topic Exchange) with routing key \`email.dispatch.batch\`.
   - Message headers include \`delivery_mode: 2\` (durable) and correlation tracking headers.

3. **Queue & Processing**:
   - \`email.dispatch.queue\` (Quorum Queue) receives the batches.
   - A scaled pool of **Email Workers** consume messages with \`prefetch_count = 10\`.
   - Workers decrypt sensitive email addresses, call SendGrid/SES/SMTP APIs, and call \`basic.ack\` upon successful sending.

4. **Handling Failures & Dead Lettering (DLQ)**:
   - If an SMTP provider returns a \`503 Service Unavailable\` or rate-limit error:
     - Worker sets \`x-retry-count = current + 1\`.
     - If \`retry_count < 3\`, message is published to \`email.retry.5s.queue\` with a 5-second TTL. When TTL expires, RabbitMQ automatically dead-letters it back to the primary queue for reprocessing.
     - If \`retry_count >= 3\`, message is sent to \`email.dlq\` (Dead Letter Queue) for manual inspection and alerting.

5. **Idempotency & Deduplication (Redis)**:
   - Before dispatching an email, the worker checks Redis: \`SET email_job:broadcast_12:user_89 "SENT" EX 86400 NX\`.
   - If key exists, the message is acknowledged and skipped, preventing duplicate emails.`, code: `// ============================================================================
// Complete Java Spring AMQP Email Broadcast Worker with DLQ & Retry
// ============================================================================

@Configuration
public class EmailRabbitConfig {
    public static final String MAIN_EXCHANGE = "email.broadcast.exchange";
    public static final String RETRY_EXCHANGE = "email.retry.exchange";
    public static final String DLX_EXCHANGE = "email.dlx.exchange";

    public static final String MAIN_QUEUE = "email.dispatch.queue";
    public static final String RETRY_QUEUE = "email.retry.5s.queue";
    public static final String DLQ_QUEUE = "email.dlq";

    // 1. Main Work Queue with DLX configuration
    @Bean
    public Queue mainQueue() {
        return QueueBuilder.durable(MAIN_QUEUE)
            .withArgument("x-dead-letter-exchange", DLX_EXCHANGE)
            .withArgument("x-dead-letter-routing-key", "email.poison")
            .build();
    }

    // 2. Retry Queue with 5000ms TTL that dead-letters back to Main Exchange
    @Bean
    public Queue retryQueue() {
        return QueueBuilder.durable(RETRY_QUEUE)
            .withArgument("x-message-ttl", 5000)
            .withArgument("x-dead-letter-exchange", MAIN_EXCHANGE)
            .withArgument("x-dead-letter-routing-key", "email.dispatch.batch")
            .build();
    }

    // 3. Dead Letter Queue
    @Bean
    public Queue dlq() {
        return QueueBuilder.durable(DLQ_QUEUE).build();
    }
}

// Consumer Service
@Component
public class EmailBroadcastConsumer {
    @Autowired private StringRedisTemplate redis;
    @Autowired private RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = EmailRabbitConfig.MAIN_QUEUE, concurrency = "5-10")
    public void processEmailBatch(EmailBatchMessage message, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws Exception {
        String deduplicationKey = "email:dedup:" + message.getBatchId();

        // Check Idempotency via Redis
        Boolean isNew = redis.opsForValue().setIfAbsent(deduplicationKey, "PROCESSING", Duration.ofHours(24));
        if (Boolean.FALSE.equals(isNew)) {
            channel.basicAck(tag, false); // Skip duplicate
            return;
        }

        try {
            // Dispatch emails to SMTP Provider (SendGrid / SES)
            sendEmails(message.getRecipients(), message.getSubject(), message.getBody());

            // Mark successful in Redis & Acknowledge
            redis.opsForValue().set(deduplicationKey, "DONE", Duration.ofHours(24));
            channel.basicAck(tag, false);
        } catch (TransientSmtpException ex) {
            // Handle retry with exponential backoff
            if (message.getRetryCount() < 3) {
                message.setRetryCount(message.getRetryCount() + 1);
                rabbitTemplate.convertAndSend(EmailRabbitConfig.RETRY_EXCHANGE, "email.retry", message);
                channel.basicAck(tag, false); // Remove from main queue; retry queue will hold it
            } else {
                // Reject to DLQ
                channel.basicNack(tag, false, false);
            }
        }
    }
}`, codeLabel: 'Multi-Recipient Email Worker Implementation', keyPoints: ['Split mass broadcasts into manageable batch chunks (e.g. 50 recipients).', 'Use Quorum Queues with Dead Letter Exchanges for fault isolation.', 'Implement TTL-based retry queues for exponential backoff retry cycles.', 'Use Redis SETNX deduplication keys to guarantee exactly-once email dispatch.', 'Tune consumer concurrency and prefetch count to adhere to downstream SMTP rate limits.'] },

      { title: 'Language Integration', content: `### .NET with MassTransit

**MassTransit** is the most popular RabbitMQ abstraction for .NET. It handles serialization, retry, consumer registration, and saga orchestration.

\`\`\`csharp
// Install: dotnet add package MassTransit.RabbitMQ

// Program.cs — Configure MassTransit
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<OrderCreatedConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/", h =>
        {
            h.Username("admin");
            h.Password("secret");
        });

        cfg.ConfigureEndpoints(context);
    });
});

// Publishing a message
public record OrderCreated(int OrderId, string CustomerEmail, decimal Total);

public class OrderService(IPublishEndpoint publisher)
{
    public async Task CreateOrder(Order order)
    {
        // Save to database...
        await publisher.Publish(new OrderCreated(order.Id, order.Email, order.Total));
    }
}

// Consumer
public class OrderCreatedConsumer : IConsumer<OrderCreated>
{
    public async Task Consume(ConsumeContext<OrderCreated> context)
    {
        var msg = context.Message;
        // Send email, update inventory, etc.
        Console.WriteLine($"Order {msg.OrderId} created for {msg.CustomerEmail}");
    }
}
\`\`\`

### Node.js with amqplib

\`\`\`javascript
// npm install amqplib
const amqp = require('amqplib');

// Producer
async function publishOrder(order) {
    const conn = await amqp.connect('amqp://admin:secret@localhost');
    const ch = await conn.createChannel();
    await ch.assertQueue('orders', { durable: true });
    ch.sendToQueue('orders', Buffer.from(JSON.stringify(order)),
        { persistent: true });
    await ch.close();
    await conn.close();
}

// Consumer
async function consumeOrders() {
    const conn = await amqp.connect('amqp://admin:secret@localhost');
    const ch = await conn.createChannel();
    await ch.assertQueue('orders', { durable: true });
    ch.prefetch(1); // Process one at a time
    ch.consume('orders', (msg) => {
        const order = JSON.parse(msg.content.toString());
        console.log('Processing order:', order.id);
        ch.ack(msg); // Acknowledge after processing
    });
}
\`\`\`

### Python with pika

\`\`\`python
# pip install pika
import pika, json

connection = pika.BlockingConnection(
    pika.ConnectionParameters('localhost',
        credentials=pika.PlainCredentials('admin', 'secret')))
channel = connection.channel()
channel.queue_declare(queue='orders', durable=True)

# Publish
channel.basic_publish(
    exchange='', routing_key='orders',
    body=json.dumps({'id': 1, 'total': 99.99}),
    properties=pika.BasicProperties(delivery_mode=2))

# Consume
def callback(ch, method, properties, body):
    order = json.loads(body)
    print(f"Processing order: {order['id']}")
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(queue='orders', on_message_callback=callback)
channel.start_consuming()
\`\`\`

### Java with Spring AMQP

\`\`\`java
// build.gradle: implementation 'org.springframework.boot:spring-boot-starter-amqp'

@Configuration
public class RabbitConfig {
    @Bean
    public Queue ordersQueue() {
        return QueueBuilder.durable("orders").build();
    }
}

// Producer
@Service
public class OrderPublisher {
    @Autowired private RabbitTemplate template;

    public void publish(Order order) {
        template.convertAndSend("orders", order);
    }
}

// Consumer
@Component
@RabbitListener(queues = "orders")
public class OrderConsumer {
    @RabbitHandler
    public void process(Order order) {
        System.out.println("Processing: " + order.getId());
    }
}
\`\`\``, keyPoints: ['MassTransit is the recommended abstraction for .NET applications.', 'Node.js uses amqplib — always acknowledge messages after processing.', 'Python uses pika — set delivery_mode=2 for persistent messages.', 'Java uses Spring AMQP with @RabbitListener annotation.', 'All languages follow: connect → declare queue → publish/consume → ack.'] },

      { title: 'Cloud Hosting', content: `### Cloud Options

| Provider | Service | Pricing Model |
|---|---|---|
| **CloudAMQP** | Managed RabbitMQ | Free tier (1M msgs/month) → paid plans |
| **Amazon MQ** | Managed RabbitMQ | Per-hour + per-message |
| **Azure Service Bus** | Azure-native (AMQP compatible) | Per-million operations |
| **Google Cloud** | Pub/Sub (different model) | Per-million messages |
| **Kubernetes** | Self-hosted via Helm chart | Infrastructure cost only |

### CloudAMQP Setup (Recommended for Dev/Staging)

1. Sign up at [cloudamqp.com](https://www.cloudamqp.com/)
2. Create instance → get connection URL
3. Use URL in your application:

\`\`\`text
amqps://user:pass@crane.rmq.cloudamqp.com/vhost
\`\`\`

### Kubernetes Deployment

\`\`\`yaml
# Install via Helm
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install rabbitmq bitnami/rabbitmq \\
  --set auth.username=admin \\
  --set auth.password=secret \\
  --set persistence.size=10Gi
\`\`\`

### Production Configuration

| Setting | Value | Reason |
|---|---|---|
| **Durable Queues** | \`durable: true\` | Survive broker restart |
| **Persistent Messages** | \`delivery_mode: 2\` | Messages survive restart |
| **Prefetch Count** | \`1-10\` | Control consumer throughput |
| **Dead Letter Exchange** | Configure DLX | Capture failed messages |
| **Clustering** | 3+ nodes | High availability |
| **Mirrored Queues** | HA policy | Replicate across nodes |`, keyPoints: ['CloudAMQP offers a free tier for development and staging.', 'Amazon MQ provides managed RabbitMQ on AWS infrastructure.', 'Use Helm charts for Kubernetes deployment.', 'Always use durable queues and persistent messages in production.', 'Configure dead letter exchanges to capture failed messages.'] },

      { title: 'Best Practices', content: `### ✅ Do's

| # | Practice | Reason |
|---|---|---|
| 1 | **Use durable queues** | Survive broker restarts |
| 2 | **Persistent messages** | Don't lose messages on crash |
| 3 | **Manual acknowledgment** | Only ack AFTER successful processing |
| 4 | **Set prefetch count** | Prevent one consumer from hogging all messages |
| 5 | **Use dead letter exchanges** | Capture and retry failed messages |
| 6 | **Monitor queue depth** | Alert when queues grow unexpectedly |
| 7 | **Use MassTransit for .NET** | Handles retry, serialization, and sagas |

### ❌ Don'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Auto-ack messages** | Use manual ack after processing |
| 2 | **Unbounded queues** | Set max-length and TTL policies |
| 3 | **Single node in prod** | Use 3+ node cluster for HA |
| 4 | **Store large payloads** | Store reference (URL/ID), not full data |
| 5 | **Ignore dead letters** | Monitor and re-process failed messages |

### Advantages & Disadvantages

| Advantages | Disadvantages |
|---|---|
| Mature, battle-tested (15+ years) | Not designed for event replay (use Kafka) |
| AMQP standard — multi-language | Requires management and monitoring |
| Flexible routing with exchanges | Memory-intensive for large queues |
| Built-in management UI | Clustering adds operational complexity |
| Free, open-source | Message ordering is per-queue only |`, keyPoints: ['Always use manual acknowledgment — ack AFTER processing.', 'Configure dead letter exchanges for failed message handling.', 'Use prefetch count to balance load across consumers.', 'Monitor queue depth — growing queues indicate consumer issues.', 'Use MassTransit for .NET to handle retry, serialization, and sagas.'] }
    ]
  };

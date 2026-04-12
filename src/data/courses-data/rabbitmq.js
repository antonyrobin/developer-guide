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

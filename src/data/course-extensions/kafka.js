/*
 * Kafka course extension — extra sections and worked examples merged into
 * courses-data/kafka.js at load time. Java examples target the official
 * kafka-clients 3.x/4.x API (Maven: org.apache.kafka:kafka-clients) and a
 * broker on localhost:9092; CLI examples use the scripts in Kafka's bin/.
 */

export default {
  examples: {
    'Producer & Consumer Example': [
      {
        title: 'Keyed messages from the console',
        language: 'bash',
        explanation: 'With `parse.key=true` everything before the separator becomes the key, so all events for `user-1` land in the same partition and stay in order.',
        code: `bin/kafka-topics.sh --create --topic user-events --partitions 3 --replication-factor 1 \\
  --bootstrap-server localhost:9092

bin/kafka-console-producer.sh --topic user-events --bootstrap-server localhost:9092 \\
  --property parse.key=true --property key.separator=:
> user-1:{"action":"login"}
> user-2:{"action":"login"}
> user-1:{"action":"add_to_cart","sku":"LAP"}

bin/kafka-console-consumer.sh --topic user-events --from-beginning --bootstrap-server localhost:9092 \\
  --property print.key=true --property print.partition=true --property print.offset=true \\
  --group demo-readers`,
      },
    ],
  },

  sections: [
    {
      title: 'Topics, Partitions & Keys',
      after: 'Core Concepts',
      content: `A **topic** is split into **partitions** — ordered, append-only logs. Partitions are the unit of **parallelism** and **ordering**.

| Concept | What to know |
|---|---|
| Partition count | max parallel consumers in a group; can be increased, never decreased |
| Key | \`hash(key) % partitions\` picks the partition → same key, same partition, **ordered** |
| No key | records spread across partitions (sticky batching) — no ordering guarantee |
| Offset | position of a record in a partition; consumers track it |
| Replication factor | copies of each partition (3 in production) |
| \`min.insync.replicas\` | replicas that must acknowledge with \`acks=all\` (usually 2) |
| Retention | \`retention.ms\` / \`retention.bytes\` — time or size based deletion |
| Compaction | \`cleanup.policy=compact\` keeps the **latest value per key** (changelogs, state) |

### Choosing a key

Use the entity whose events must stay in order (\`orderId\`, \`userId\`, \`deviceId\`). Avoid **hot keys** — one huge customer on one partition limits throughput.`,
      code: `# Create a production-style topic
bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic orders \\
  --partitions 12 --replication-factor 3 \\
  --config min.insync.replicas=2 --config retention.ms=604800000   # 7 days

# Compacted topic: keeps the latest record per key forever
bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic customer-profiles \\
  --partitions 6 --replication-factor 3 --config cleanup.policy=compact

# Inspect and change
bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic orders
bin/kafka-configs.sh --bootstrap-server localhost:9092 --alter --entity-type topics \\
  --entity-name orders --add-config retention.ms=1209600000
bin/kafka-topics.sh --bootstrap-server localhost:9092 --alter --topic orders --partitions 24  # keys re-map!

# Where does each key go? (uses murmur2 like the Java client)
bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic orders \\
  --property parse.key=true --property key.separator=:`,
      codeLabel: 'Creating, describing and configuring topics',
      codeLanguage: 'bash',
      keyPoints: [
        'Partitions give parallelism; ordering is guaranteed only within a partition.',
        'Records with the same key always go to the same partition.',
        'Adding partitions changes key → partition mapping for new records.',
        'Use replication factor 3 with `min.insync.replicas=2` in production.',
      ],
    },
    {
      title: 'Java Producer: Acks, Batching & Idempotence',
      after: 'Producer & Consumer Example',
      content: `The producer batches records per partition and sends them asynchronously.

| Setting | Recommended | Effect |
|---|---|---|
| \`acks\` | \`all\` | wait for all in-sync replicas — no data loss on leader failure |
| \`enable.idempotence\` | \`true\` (default in 3.x) | no duplicates from retries, per-partition ordering kept |
| \`retries\` / \`delivery.timeout.ms\` | defaults (MAX / 120 s) | retry transient errors until the timeout |
| \`linger.ms\` | 5–20 | wait a little to fill batches → higher throughput |
| \`batch.size\` | 32–64 KB | max bytes per partition batch |
| \`compression.type\` | \`lz4\` / \`zstd\` | smaller network & disk usage |
| \`max.in.flight.requests.per.connection\` | ≤ 5 | required ≤ 5 for idempotence |

### Delivery semantics

- **At most once** — \`acks=0\`, fire and forget.
- **At least once** — \`acks=all\` + retries (possible duplicates downstream).
- **Exactly once** — idempotent producer + transactions (next sections).

Always handle the callback/future — a failed send is otherwise silent.`,
      code: `import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.concurrent.Future;

public class OrderProducer {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.ACKS_CONFIG, "all");
        props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        props.put(ProducerConfig.LINGER_MS_CONFIG, 10);
        props.put(ProducerConfig.BATCH_SIZE_CONFIG, 64 * 1024);
        props.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, "zstd");
        props.put(ProducerConfig.CLIENT_ID_CONFIG, "order-service");

        try (Producer<String, String> producer = new KafkaProducer<>(props)) {
            for (int i = 1; i <= 10; i++) {
                String orderId = "ORD-" + (1000 + i);
                String json = "{\\"orderId\\":\\"" + orderId + "\\",\\"total\\":" + (i * 10) + "}";
                ProducerRecord<String, String> record = new ProducerRecord<>("orders", orderId, json);
                record.headers().add("event-type", "OrderCreated".getBytes());

                producer.send(record, (metadata, exception) -> {
                    if (exception != null) {
                        System.err.println("Send failed for " + orderId + ": " + exception);
                    } else {
                        System.out.printf("%s -> partition %d offset %d%n",
                                orderId, metadata.partition(), metadata.offset());
                    }
                });
            }

            // Synchronous send when you must know the result before continuing
            Future<RecordMetadata> f = producer.send(new ProducerRecord<>("orders", "ORD-SYNC", "{}"));
            System.out.println("sync offset = " + f.get().offset());
            producer.flush();
        }
    }
}`,
      codeLabel: 'Reliable producer with callbacks and headers',
      keyPoints: [
        'Use `acks=all` with idempotence enabled for durable, duplicate-free writes.',
        '`linger.ms`, `batch.size` and compression trade a little latency for throughput.',
        'Always check the send callback or future for errors.',
        'Put routing/metadata in headers and keep the value as the business payload.',
      ],
    },
    {
      title: 'Consumer Groups, Offsets & Rebalancing',
      after: 'Java Producer: Acks, Batching & Idempotence',
      content: `Consumers with the same \`group.id\` **share** a topic's partitions — each partition is read by exactly one member. Different groups each get **all** the data.

### Offsets

The group stores its position in the internal \`__consumer_offsets\` topic.

| Commit style | Semantics |
|---|---|
| \`enable.auto.commit=true\` | periodic commit — may lose or duplicate on crash |
| \`commitSync()\` **after** processing | **at-least-once** (most common) |
| commit **before** processing | at-most-once |
| store offsets in the same DB transaction as results | effectively once |

\`auto.offset.reset\` = \`earliest\` / \`latest\` decides where a **new** group starts.

### Rebalancing

When members join/leave or \`max.poll.interval.ms\` is exceeded, partitions are reassigned. Use the **cooperative-sticky** assignor (or the KIP-848 \`group.protocol=consumer\` in Kafka 4) to avoid stop-the-world rebalances, keep processing per poll short, and commit in \`onPartitionsRevoked\`.

Make processing **idempotent** — at-least-once means duplicates will happen.`,
      code: `import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.*;

public class OrderConsumer {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "billing-service");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);          // we commit ourselves
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 200);
        props.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG,
                  CooperativeStickyAssignor.class.getName());

        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
        Runtime.getRuntime().addShutdownHook(new Thread(consumer::wakeup));   // graceful stop

        try (consumer) {
            consumer.subscribe(List.of("orders"), new ConsumerRebalanceListener() {
                public void onPartitionsRevoked(Collection<TopicPartition> parts) {
                    consumer.commitSync();                                    // don't lose progress
                    System.out.println("Revoked " + parts);
                }
                public void onPartitionsAssigned(Collection<TopicPartition> parts) {
                    System.out.println("Assigned " + parts);
                }
            });

            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(500));
                for (ConsumerRecord<String, String> r : records) {
                    process(r);                                               // must be idempotent
                }
                if (!records.isEmpty()) consumer.commitSync();                // at-least-once
            }
        } catch (org.apache.kafka.common.errors.WakeupException e) {
            System.out.println("Shutting down");
        }
    }

    static void process(ConsumerRecord<String, String> r) {
        System.out.printf("p%d@%d key=%s value=%s%n", r.partition(), r.offset(), r.key(), r.value());
    }
}`,
      codeLabel: 'At-least-once consumer with manual commits',
      keyPoints: [
        'Each partition is consumed by one member of a group; scale up to the partition count.',
        'Commit offsets after processing for at-least-once delivery.',
        'Use the cooperative-sticky assignor and keep poll loops fast to avoid rebalances.',
        'Design handlers to be idempotent — duplicates are part of at-least-once.',
      ],
    },
    {
      title: 'Exactly-Once with Transactions',
      after: 'Consumer Groups, Offsets & Rebalancing',
      content: `For **consume → transform → produce** pipelines, Kafka transactions make the output records **and** the consumer offsets commit atomically.

### How it works

1. The producer has a stable \`transactional.id\` and calls \`initTransactions()\` (fences zombie instances).
2. \`beginTransaction()\`, send output records.
3. \`sendOffsetsToTransaction(offsets, consumer.groupMetadata())\` — offsets become part of the transaction.
4. \`commitTransaction()\` — or \`abortTransaction()\` on error.
5. Downstream consumers use \`isolation.level=read_committed\` so they never see aborted data.

### Limits

Exactly-once covers Kafka-to-Kafka. Side effects in external systems (emails, REST calls, DB writes) still need **idempotency keys** or the **outbox pattern**. Kafka Streams enables all of this with one setting: \`processing.guarantee=exactly_once_v2\`.`,
      code: `import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.KafkaException;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.*;

import java.time.Duration;
import java.util.*;

public class PaymentEnricher {
    public static void main(String[] args) {
        Properties c = new Properties();
        c.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        c.put(ConsumerConfig.GROUP_ID_CONFIG, "payment-enricher");
        c.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        c.put(ConsumerConfig.ISOLATION_LEVEL_CONFIG, "read_committed");
        c.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        c.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        Properties p = new Properties();
        p.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        p.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "payment-enricher-1");   // stable per instance
        p.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        p.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        try (var consumer = new KafkaConsumer<String, String>(c);
             var producer = new KafkaProducer<String, String>(p)) {
            producer.initTransactions();
            consumer.subscribe(List.of("payments"));

            while (true) {
                ConsumerRecords<String, String> batch = consumer.poll(Duration.ofSeconds(1));
                if (batch.isEmpty()) continue;
                producer.beginTransaction();
                try {
                    Map<TopicPartition, OffsetAndMetadata> offsets = new HashMap<>();
                    for (ConsumerRecord<String, String> r : batch) {
                        String enriched = r.value().replace("}", ",\\"riskScore\\":0.12}");
                        producer.send(new ProducerRecord<>("payments-enriched", r.key(), enriched));
                        offsets.put(new TopicPartition(r.topic(), r.partition()),
                                    new OffsetAndMetadata(r.offset() + 1));          // next offset to read
                    }
                    producer.sendOffsetsToTransaction(offsets, consumer.groupMetadata());
                    producer.commitTransaction();
                } catch (KafkaException e) {
                    producer.abortTransaction();       // outputs discarded, offsets not committed
                    // rewind so the batch is re-processed
                    batch.partitions().forEach(tp ->
                        consumer.seek(tp, batch.records(tp).get(0).offset()));
                }
            }
        }
    }
}`,
      codeLabel: 'Transactional consume-transform-produce loop',
      keyPoints: [
        'Transactions commit output records and consumer offsets atomically.',
        'Downstream consumers must use `isolation.level=read_committed`.',
        'A stable `transactional.id` fences zombie producers after restarts.',
        'External side-effects still need idempotency or the outbox pattern.',
      ],
    },
    {
      title: 'Serialization & Schema Registry',
      after: 'Exactly-Once with Transactions',
      content: `Kafka stores bytes; producers and consumers must agree on a format. A **Schema Registry** (Confluent, Apicurio, Karapace) stores versioned schemas and enforces **compatibility**, so a producer can't break consumers.

| Format | Pros | Cons |
|---|---|---|
| JSON | human-readable, easy | no enforced schema, verbose |
| **Avro** | compact, rich evolution rules, common in Kafka | needs registry + codegen |
| **Protobuf** | compact, great tooling, gRPC alignment | needs registry for Kafka |
| JSON Schema | validated JSON | larger messages |

### Compatibility modes

| Mode | Allowed change |
|---|---|
| \`BACKWARD\` (default) | new consumers can read old data — add optional fields, remove fields |
| \`FORWARD\` | old consumers can read new data |
| \`FULL\` | both directions |

Rule of thumb: **add fields with defaults**, never rename or change types in place.`,
      code: `// order.avsc — Avro schema (version 2 adds "channel" WITH a default: backward compatible)
{
  "type": "record",
  "name": "OrderCreated",
  "namespace": "com.example.orders",
  "fields": [
    { "name": "orderId",  "type": "string" },
    { "name": "customerId", "type": "string" },
    { "name": "totalCents", "type": "long" },
    { "name": "createdAt", "type": { "type": "long", "logicalType": "timestamp-millis" } },
    { "name": "channel", "type": { "type": "enum", "name": "Channel", "symbols": ["WEB", "APP", "STORE"] },
      "default": "WEB" }
  ]
}

// Producer configuration (Java) using Confluent's Avro serializer
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "io.confluent.kafka.serializers.KafkaAvroSerializer");
props.put("schema.registry.url", "http://localhost:8081");
props.put("auto.register.schemas", false);          // register via CI, not at runtime
props.put("use.latest.version", true);

// Consumer: get generated classes instead of GenericRecord
props.put("value.deserializer", "io.confluent.kafka.serializers.KafkaAvroDeserializer");
props.put("specific.avro.reader", true);

// Check compatibility before deploying (REST API):
// curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" \\
//   --data @order-v2.json http://localhost:8081/compatibility/subjects/orders-value/versions/latest`,
      codeLabel: 'Avro schema with a defaulted field + serializer config',
      codeLanguage: 'java',
      keyPoints: [
        'A schema registry enforces compatible evolution between producers and consumers.',
        'Avro and Protobuf are compact and typed; JSON is easy but unenforced.',
        'Add new fields with defaults; never rename or retype fields in place.',
        'Register schemas from CI and test compatibility before deploying.',
      ],
    },
    {
      title: 'Stream Processing with Kafka Streams',
      after: 'Serialization & Schema Registry',
      content: `**Kafka Streams** is a Java library (no separate cluster) for stateful stream processing. Scale by running more instances — partitions are shared like a consumer group.

| Abstraction | Meaning |
|---|---|
| \`KStream\` | stream of events (inserts) |
| \`KTable\` | changelog → latest value per key |
| \`GlobalKTable\` | full copy of a small table on every instance |
| Stateless ops | \`filter\`, \`mapValues\`, \`flatMapValues\`, \`branch/split\` |
| Stateful ops | \`groupByKey\`, \`count\`, \`aggregate\`, \`reduce\`, joins |
| Windows | tumbling, hopping, sliding, session |

State lives in local **RocksDB** stores backed by compacted **changelog topics**, so it survives restarts. Interactive queries expose that state over your own API. Alternatives: **Apache Flink**, **ksqlDB** (SQL over streams).`,
      code: `import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.*;
import org.apache.kafka.streams.kstream.*;

import java.time.Duration;
import java.util.Properties;

public class RevenuePerMinute {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "revenue-per-minute");   // also the group.id
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE_V2);
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.StringSerde.class);
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.StringSerde.class);

        StreamsBuilder builder = new StreamsBuilder();

        // key = orderId, value = "customerId,country,amountCents"
        KStream<String, String> orders = builder.stream("orders");

        orders
            .filter((orderId, csv) -> csv != null && csv.split(",").length == 3)
            .map((orderId, csv) -> {
                String[] f = csv.split(",");
                return KeyValue.pair(f[1], Long.parseLong(f[2]));               // re-key by country
            })
            .groupByKey(Grouped.with(Serdes.String(), Serdes.Long()))
            .windowedBy(TimeWindows.ofSizeAndGrace(Duration.ofMinutes(1), Duration.ofSeconds(30)))
            .reduce(Long::sum, Materialized.as("revenue-store"))
            .toStream()
            .map((windowedCountry, cents) -> KeyValue.pair(
                windowedCountry.key() + "@" + windowedCountry.window().startTime(),
                String.valueOf(cents / 100.0)))
            .to("revenue-per-minute", Produced.with(Serdes.String(), Serdes.String()));

        KafkaStreams streams = new KafkaStreams(builder.build(), props);
        Runtime.getRuntime().addShutdownHook(new Thread(streams::close));
        streams.start();
    }
}`,
      codeLabel: 'Windowed revenue per country with exactly-once',
      keyPoints: [
        'Kafka Streams is a library — scale it by running more app instances.',
        '`KStream` models events; `KTable` models the latest state per key.',
        'Re-keying triggers a repartition topic so related records meet on one instance.',
        'Windowed aggregations need a grace period for late events.',
      ],
    },
    {
      title: 'Kafka Connect',
      after: 'Stream Processing with Kafka Streams',
      content: `**Kafka Connect** moves data between Kafka and other systems with configuration instead of code.

| Connector type | Examples |
|---|---|
| **Source** (into Kafka) | Debezium CDC (Postgres, MySQL, SQL Server), JDBC source, S3, MQTT |
| **Sink** (out of Kafka) | JDBC sink, Elasticsearch/OpenSearch, S3/GCS, Snowflake, BigQuery |

### Key features

- Runs as a scalable worker cluster (distributed mode) managed over a **REST API** (\`:8083\`).
- **Single Message Transforms (SMTs)** for light changes: rename fields, route topics, mask data.
- **Converters** pick the format (JSON, Avro, Protobuf).
- **Error handling**: \`errors.tolerance=all\` + a **dead letter queue** topic for bad records.

**Debezium** CDC is the standard way to turn database changes into events (and to implement the **outbox pattern**) without dual writes.`,
      code: `# Register a Debezium PostgreSQL source (captures every insert/update/delete)
curl -s -X PUT http://localhost:8083/connectors/pg-orders/config \\
  -H 'Content-Type: application/json' -d '{
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "\${file:/secrets/pg.properties:password}",
    "database.dbname": "shop",
    "topic.prefix": "shop",
    "table.include.list": "public.orders,public.customers",
    "plugin.name": "pgoutput",
    "transforms": "unwrap",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState"
  }'

# Sink the change topics into Elasticsearch with a dead letter queue
curl -s -X PUT http://localhost:8083/connectors/es-orders/config \\
  -H 'Content-Type: application/json' -d '{
    "connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
    "topics": "shop.public.orders",
    "connection.url": "http://elasticsearch:9200",
    "key.ignore": "false",
    "errors.tolerance": "all",
    "errors.deadletterqueue.topic.name": "dlq.es-orders",
    "errors.deadletterqueue.context.headers.enable": "true"
  }'

# Operate connectors
curl -s http://localhost:8083/connectors?expand=status
curl -s -X POST http://localhost:8083/connectors/es-orders/restart?includeTasks=true
curl -s -X PUT  http://localhost:8083/connectors/es-orders/pause`,
      codeLabel: 'Debezium source + Elasticsearch sink via the REST API',
      codeLanguage: 'bash',
      keyPoints: [
        'Connect integrates external systems by configuration, not custom code.',
        'Debezium CDC streams database changes without dual writes.',
        'Use SMTs for light transforms and Streams/Flink for real processing.',
        'Route bad records to a dead letter queue instead of stopping the connector.',
      ],
    },
    {
      title: 'Spring Boot Integration (Spring for Apache Kafka)',
      after: 'Kafka Connect',
      content: `Spring for Apache Kafka wraps the clients with auto-configuration, \`KafkaTemplate\` for sending and \`@KafkaListener\` for consuming.

| Feature | How |
|---|---|
| Configuration | \`spring.kafka.*\` properties in \`application.yml\` |
| Send | \`kafkaTemplate.send(topic, key, value)\` → \`CompletableFuture\` |
| Consume | \`@KafkaListener(topics = "...", groupId = "...")\` |
| Concurrency | \`concurrency = "3"\` → three consumer threads |
| Retries + DLT | \`@RetryableTopic\` or \`DefaultErrorHandler\` + \`DeadLetterPublishingRecoverer\` |
| JSON | \`JsonSerializer\` / \`JsonDeserializer\` with trusted packages |
| Testing | \`@EmbeddedKafka\` or Testcontainers |`,
      code: `// application.yml
// spring:
//   kafka:
//     bootstrap-servers: localhost:9092
//     producer:
//       acks: all
//       value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
//     consumer:
//       group-id: shipping-service
//       auto-offset-reset: earliest
//       value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
//       properties:
//         spring.json.trusted.packages: "com.example.orders"

package com.example.orders;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Service;

record OrderCreated(String orderId, String customerId, long totalCents) {}

@Service
class OrderEvents {
    private final KafkaTemplate<String, OrderCreated> kafka;

    OrderEvents(KafkaTemplate<String, OrderCreated> kafka) { this.kafka = kafka; }

    void publish(OrderCreated event) {
        kafka.send("orders", event.orderId(), event)
             .whenComplete((result, ex) -> {
                 if (ex != null) System.err.println("Publish failed: " + ex.getMessage());
             });
    }
}

@Service
class ShippingListener {

    @RetryableTopic(attempts = "4", backoff = @Backoff(delay = 1000, multiplier = 2.0),
                    dltTopicSuffix = ".dlt")
    @KafkaListener(topics = "orders", groupId = "shipping-service", concurrency = "3")
    void onOrder(OrderCreated event,
                 @Header(KafkaHeaders.RECEIVED_PARTITION) int partition) {
        if (event.totalCents() <= 0) throw new IllegalArgumentException("Invalid total");
        System.out.printf("Ship %s (partition %d)%n", event.orderId(), partition);
    }
}`,
      codeLabel: 'KafkaTemplate + @KafkaListener with retry topics',
      keyPoints: [
        'Configure clients through `spring.kafka.*` properties.',
        '`KafkaTemplate.send` returns a future — handle failures.',
        '`@RetryableTopic` adds non-blocking retries and a dead-letter topic.',
        'Set `concurrency` up to the number of partitions per instance.',
      ],
    },
    {
      title: 'Monitoring & Operations',
      after: 'Deployment & Configuration',
      content: `### Metrics that matter

| Metric | Why |
|---|---|
| **Consumer lag** (per group/partition) | the #1 health signal — growing lag = consumers can't keep up |
| Under-replicated partitions | broker or disk trouble; should be 0 |
| Offline partitions / active controller count | availability |
| Request latency (produce/fetch p99) | client experience |
| Disk usage & retention | brokers stop when disks fill |
| Rebalance rate | unstable consumers |

Tools: **Kafka UI / AKHQ / Conduktor** for browsing, **Burrow** or exporter + **Prometheus/Grafana** for lag, JMX metrics from brokers and clients.

### Everyday operations

- Reset offsets to replay (\`--reset-offsets\`) — the group must be stopped.
- Add partitions for throughput (mind key re-mapping).
- Rolling broker restarts one at a time; wait for ISR to recover.
- Since Kafka 4.0, clusters run in **KRaft** mode — ZooKeeper is gone.`,
      code: `# Consumer lag per partition for a group
bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group billing-service
# GROUP           TOPIC  PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG  CONSUMER-ID ...

# Replay: move a (stopped) group back in time — dry run first, then --execute
bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group billing-service \\
  --topic orders --reset-offsets --to-datetime 2026-10-24T00:00:00.000 --dry-run
bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group billing-service \\
  --topic orders --reset-offsets --to-earliest --execute

# Cluster health
bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --under-replicated-partitions
bin/kafka-metadata-quorum.sh --bootstrap-server localhost:9092 describe --status   # KRaft
bin/kafka-log-dirs.sh --bootstrap-server localhost:9092 --describe --topic-list orders

# Peek at messages around an offset
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic orders \\
  --partition 3 --offset 1500 --max-messages 5 --property print.key=true`,
      codeLabel: 'Lag, offset resets and health checks',
      codeLanguage: 'bash',
      keyPoints: [
        'Consumer lag is the key indicator of pipeline health — alert on it.',
        'Under-replicated partitions should always be zero.',
        'Reset offsets only with the group stopped, and dry-run first.',
        'Kafka 4 runs on KRaft; ZooKeeper is no longer used.',
      ],
    },
  ],
};

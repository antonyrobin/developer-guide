export const kafkaCourse = {
  id: 'kafka',
  title: 'Apache Kafka',
  description: 'Distributed event streaming platform used for high-performance data pipelines and streaming analytics.',
  icon: 'Activity',
  category: 'Messaging & Caching',
  sections: [
    {
      id: 'kafka-intro',
      title: 'Introduction to Apache Kafka',
      content: `Apache Kafka is a distributed event streaming platform capable of handling trillions of events a day. It is used for building real-time data pipelines and streaming apps. It is horizontally scalable, fault-tolerant, and wicked fast.`,
      image: '/images/courses/data_pipeline_kafka_1776183804632.png'
    },
    {
      id: 'kafka-concepts',
      title: 'Core Concepts',
      content: `- **Topic:** A category or feed name to which records are published.
- **Producer:** An application that publishes (writes) events to Kafka topics.
- **Consumer:** An application that subscribes to (reads) those topics.
- **Broker:** A Kafka server that stores data and serves clients.
- **Zookeeper:** Used for managing and coordinating Kafka brokers (though newer versions are moving away from it in favor of KRaft).`
    },
    {
      id: 'kafka-setup',
      title: 'Installation & Setup',
      content: `### 1. Prerequisites
Java 8+ installed.

### 2. Download
Download Kafka from the official website and extract it.

### 3. Start Zookeeper & Kafka
\`\`\`bash
# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Start Kafka Broker
bin/kafka-server-start.sh config/server.properties
\`\`\``
    },
    {
      id: 'kafka-example',
      title: 'Producer & Consumer Example',
      content: `### Create a Topic
\`\`\`bash
bin/kafka-topics.sh --create --topic quickstart-events --bootstrap-server localhost:9092
\`\`\`

### Produce Events
\`\`\`bash
bin/kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092
> Hello Kafka World!
\`\`\`

### Consume Events
\`\`\`bash
bin/kafka-console-consumer.sh --topic quickstart-events --from-beginning --bootstrap-server localhost:9092
\`\`\``
    },
    {
      id: 'kafka-deployment',
      title: 'Deployment & Configuration',
      content: `### Clustering
Deploy multiple brokers across different servers for fault tolerance. Use replication factors to ensure data availability even if a broker fails.

### Monitoring
Use tools like Confluent Control Center or Prometheus/Grafana to monitor broker health, throughput, and consumer lag.`
    }
  ]
};

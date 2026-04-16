export const elasticsearchCourse = {
  id: 'elasticsearch',
  title: 'Elasticsearch DB',
  description: 'Distributed, RESTful search and analytics engine.',
  icon: 'Search',
  category: 'Databases',
  sections: [
    {
      id: 'es-intro',
      title: 'Introduction to Elasticsearch',
      image: '/images/courses/elasticsearch_1776186212968.png',
      content: `Elasticsearch is a distributed, open-source search and analytics engine for all types of data, including textual, numerical, geospatial, structured, and unstructured. It is built on Apache Lucene and is known for its speed, scalability, and powerful search capabilities.`
    },
    {
      id: 'es-setup',
      title: 'Installation & Setup',
      content: `### 1. Download & Install
Download the appropriate version for your OS from the Elastic website. Extract and run \`bin/elasticsearch\` (Linux/macOS) or \`bin/elasticsearch.bat\` (Windows).

### 2. Verify Installation
Run the following command:
\`\`\`bash
curl -X GET "localhost:9200/"
\`\`\`

### 3. Kibana (Recommended)
Kibana is the visualization tool for Elasticsearch. Install it to interact with your data easily via a UI.`
    },
    {
      id: 'es-concepts',
      title: 'Core Concepts',
      content: `### Index
An index is a collection of documents that have similar characteristics (like a database in RDBMS).

### Document
A document is a basic unit of information that can be indexed (like a row in RDBMS). It's expressed in JSON.

### Field
A document contains fields, which are key-value pairs.`
    },
    {
      id: 'es-example',
      title: 'Example: CRUD with REST API',
      content: `### Indexing a Document
\`\`\`bash
curl -X POST "localhost:9200/my-index/_doc/1" -H 'Content-Type: application/json' -d'
{
  "name": "John Doe",
  "occupation": "Software Engineer"
}
'
\`\`\`

### Searching Documents
\`\`\`bash
curl -X GET "localhost:9200/my-index/_search?q=occupation:Engineer"
\`\`\``
    },
    {
      id: 'es-deployment',
      title: 'Deployment & Configuration',
      content: `### Production Config
- **Memory:** Set \`ES_JAVA_OPTS\` to at least 50% of available RAM for heap.
- **Cluster Name:** Set a unique \`cluster.name\` in \`elasticsearch.yml\`.
- **Nodes:** Configure multiple nodes for high availability and horizontal scaling.`
    }
  ]
};

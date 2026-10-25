/*
 * Elasticsearch course extension — extra sections and worked examples merged
 * into courses-data/elasticsearch.js at load time. Requests use Kibana Dev
 * Tools console syntax (METHOD /path + JSON body) for Elasticsearch 8.x; paste
 * them into Dev Tools or convert to curl with "Copy as cURL".
 */

const PRODUCTS = `# Sample data (run once) ------------------------------------------
PUT /products
{
  "mappings": {
    "properties": {
      "name":     { "type": "text", "fields": { "keyword": { "type": "keyword" } } },
      "brand":    { "type": "keyword" },
      "category": { "type": "keyword" },
      "price":    { "type": "scaled_float", "scaling_factor": 100 },
      "rating":   { "type": "half_float" },
      "tags":     { "type": "keyword" },
      "in_stock": { "type": "boolean" },
      "released": { "type": "date" },
      "description": { "type": "text", "analyzer": "english" }
    }
  }
}

POST /products/_bulk?refresh=true
{ "index": { "_id": "1" } }
{ "name": "Wireless Mouse", "brand": "Logi", "category": "accessories", "price": 29.99, "rating": 4.5, "tags": ["wireless", "office"], "in_stock": true, "released": "2025-03-01", "description": "Quiet clicks and a long battery life for office work" }
{ "index": { "_id": "2" } }
{ "name": "Mechanical Keyboard", "brand": "Keychron", "category": "accessories", "price": 89.00, "rating": 4.8, "tags": ["mechanical", "office"], "in_stock": true, "released": "2024-11-15", "description": "Hot-swappable switches with a wireless Bluetooth mode" }
{ "index": { "_id": "3" } }
{ "name": "4K Monitor", "brand": "Dell", "category": "displays", "price": 349.00, "rating": 4.6, "tags": ["4k", "office"], "in_stock": false, "released": "2025-06-20", "description": "Sharp 27 inch display for designers and developers" }
{ "index": { "_id": "4" } }
{ "name": "Gaming Mouse", "brand": "Razer", "category": "accessories", "price": 59.50, "rating": 4.2, "tags": ["gaming", "wired"], "in_stock": true, "released": "2025-09-10", "description": "Fast optical sensor built for gaming" }
# ---------------------------------------------------------------
`;

export default {
  examples: {
    'Example: CRUD with REST API': [
      {
        title: 'CRUD with optimistic concurrency',
        language: 'http',
        explanation: 'Every write returns `_seq_no` and `_primary_term`. Passing them back with `if_seq_no` / `if_primary_term` makes the update fail with **409** if someone else changed the document first.',
        code: `PUT /books/_doc/1
{ "title": "Dune", "author": "Frank Herbert", "year": 1965, "copies": 3 }

GET /books/_doc/1
# → "_seq_no": 0, "_primary_term": 1, "_source": {...}

POST /books/_update/1?if_seq_no=0&if_primary_term=1
{ "doc": { "copies": 2 } }

POST /books/_update/1
{ "script": { "source": "ctx._source.copies -= params.n", "params": { "n": 1 } } }

POST /books/_update/2
{ "doc": { "title": "Neuromancer", "copies": 1 }, "doc_as_upsert": true }

DELETE /books/_doc/2
GET /books/_count`,
      },
    ],
  },

  sections: [
    {
      title: 'Mappings & Field Types',
      after: 'Core Concepts',
      content: `A **mapping** is the schema of an index: which fields exist and how each is indexed. Dynamic mapping guesses types from the first document — fine for experiments, risky in production (a field first seen as \`"42"\` becomes \`text\` forever).

| Type | Use for | Searchable with |
|---|---|---|
| \`text\` | prose — analysed into tokens | \`match\`, \`multi_match\` |
| \`keyword\` | exact values: IDs, tags, status, emails | \`term\`, \`terms\`, aggregations, sorting |
| \`long\`, \`integer\`, \`scaled_float\`, \`double\` | numbers | \`range\`, aggregations |
| \`date\` | timestamps | \`range\`, \`date_histogram\` |
| \`boolean\` | flags | \`term\` |
| \`object\` / \`nested\` | sub-documents (\`nested\` keeps array items independent) | \`nested\` query |
| \`geo_point\` | lat/lon | geo queries |
| \`dense_vector\` | embeddings | kNN / semantic search |

### Multi-fields

\`"name": { "type": "text", "fields": { "keyword": { "type": "keyword" } } }\` gives full-text search on \`name\` **and** exact sort/aggregations on \`name.keyword\`.

Mappings of existing fields **can't be changed** — create a new index and **reindex**.`,
      code: `PUT /orders
{
  "settings": { "number_of_shards": 1, "number_of_replicas": 1 },
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "order_id":    { "type": "keyword" },
      "customer":    {
        "properties": {
          "name":  { "type": "text", "fields": { "keyword": { "type": "keyword" } } },
          "email": { "type": "keyword" }
        }
      },
      "status":      { "type": "keyword" },
      "total":       { "type": "scaled_float", "scaling_factor": 100 },
      "created_at":  { "type": "date" },
      "notes":       { "type": "text" },
      "lines": {
        "type": "nested",
        "properties": {
          "sku": { "type": "keyword" },
          "qty": { "type": "integer" }
        }
      },
      "shipping_location": { "type": "geo_point" }
    }
  }
}

GET /orders/_mapping

# "dynamic": "strict" rejects documents with unknown fields:
POST /orders/_doc
{ "order_id": "A1", "unexpected_field": true }
# → 400 strict_dynamic_mapping_exception`,
      codeLabel: 'Explicit mapping with nested lines and strict dynamic mode',
      codeLanguage: 'http',
      keyPoints: [
        'Define mappings explicitly for production indices.',
        '`text` is analysed for full-text search; `keyword` is exact for filters, sorts and aggs.',
        'Use `nested` when array items must be matched independently.',
        'Field mappings are immutable — reindex to change them.',
      ],
    },
    {
      title: 'Analyzers & Text Analysis',
      after: 'Mappings & Field Types',
      content: `When a \`text\` field is indexed (and when a \`match\` query runs), an **analyzer** turns text into **tokens**:

1. **Character filters** — e.g. strip HTML.
2. **Tokenizer** — split into words (\`standard\`, \`whitespace\`, \`ngram\`, \`edge_ngram\`).
3. **Token filters** — \`lowercase\`, \`stop\`, \`stemmer\`, \`synonym\`, \`asciifolding\`.

| Built-in analyzer | Result for "The Running Foxes!" |
|---|---|
| \`standard\` | \`the\`, \`running\`, \`foxes\` |
| \`english\` | \`run\`, \`fox\` (stop words removed, stemmed) |
| \`keyword\` | \`The Running Foxes!\` (one token) |
| \`whitespace\` | \`The\`, \`Running\`, \`Foxes!\` |

Use \`_analyze\` to see exactly what is indexed — most "why doesn't this match?" questions are answered there. **Autocomplete** typically uses an \`edge_ngram\` analyzer at index time and \`standard\` at search time.`,
      code: `GET /_analyze
{ "analyzer": "english", "text": "The Running Foxes!" }

PUT /articles
{
  "settings": {
    "analysis": {
      "filter": {
        "autocomplete_filter": { "type": "edge_ngram", "min_gram": 2, "max_gram": 15 },
        "product_synonyms": { "type": "synonym", "synonyms": ["laptop, notebook", "tv, television"] }
      },
      "analyzer": {
        "autocomplete": {
          "tokenizer": "standard",
          "filter": ["lowercase", "asciifolding", "autocomplete_filter"]
        },
        "english_synonyms": {
          "tokenizer": "standard",
          "filter": ["lowercase", "product_synonyms", "stop", "porter_stem"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "english_synonyms",
        "fields": {
          "suggest": { "type": "text", "analyzer": "autocomplete", "search_analyzer": "standard" }
        }
      }
    }
  }
}

GET /articles/_analyze
{ "analyzer": "autocomplete", "text": "Café Notebook" }
# → ca, caf, cafe, no, not, note, noteb, ...

GET /articles/_search
{ "query": { "match": { "title.suggest": "noteb" } } }`,
      codeLabel: 'Custom analyzers for synonyms and autocomplete',
      codeLanguage: 'http',
      keyPoints: [
        'Analyzers = character filters → tokenizer → token filters.',
        'The same analyzer normally runs at index and search time.',
        'Use `_analyze` to debug why a query does or does not match.',
        'Edge n-grams at index time power fast autocomplete.',
      ],
    },
    {
      title: 'Full-Text & Bool Queries',
      after: 'Example: CRUD with REST API',
      content: `The Query DSL distinguishes two contexts:

| Context | Question | Affects score | Cached |
|---|---|---|---|
| **Query** (\`must\`, \`should\`) | *How well* does it match? | yes | no |
| **Filter** (\`filter\`, \`must_not\`) | *Does* it match? | no | yes — faster |

### The bool query

| Clause | Meaning |
|---|---|
| \`must\` | must match, contributes to score |
| \`filter\` | must match, no scoring |
| \`should\` | optional; boosts score (or required with \`minimum_should_match\`) |
| \`must_not\` | excluded |

### Full-text queries

\`match\` (analysed, OR by default, \`operator: and\`, \`fuzziness: AUTO\`), \`multi_match\` across fields with boosts (\`name^3\`), \`match_phrase\` (word order, \`slop\`), \`query_string\` / \`simple_query_string\` (user search syntax).

Put every exact condition (status, category, price range, dates) in **filter**.`,
      code: PRODUCTS + `
GET /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "multi_match": {
            "query": "wireless mous",
            "fields": ["name^3", "description", "tags"],
            "fuzziness": "AUTO"
        } }
      ],
      "filter": [
        { "term":  { "in_stock": true } },
        { "range": { "price": { "lte": 100 } } }
      ],
      "should": [
        { "term": { "tags": "office" } }
      ],
      "must_not": [
        { "term": { "brand": "Razer" } }
      ]
    }
  },
  "_source": ["name", "brand", "price"],
  "highlight": { "fields": { "description": {} } }
}

GET /products/_search
{
  "query": { "match_phrase": { "description": { "query": "battery life", "slop": 1 } } }
}`,
      codeLabel: 'multi_match with fuzziness inside a bool query',
      codeLanguage: 'http',
      keyPoints: [
        'Use `filter` for yes/no conditions — it is faster and cached.',
        '`must` and `should` clauses drive the relevance score.',
        'Boost important fields in `multi_match` (e.g. `name^3`).',
        '`fuzziness: AUTO` tolerates typos; `match_phrase` respects word order.',
      ],
    },
    {
      title: 'Term-Level Queries, Sorting & Pagination',
      after: 'Full-Text & Bool Queries',
      content: `**Term-level** queries match exact values and are **not analysed** — use them on \`keyword\`, numeric, date and boolean fields.

| Query | Example |
|---|---|
| \`term\` / \`terms\` | \`{ "terms": { "category": ["displays", "audio"] } }\` |
| \`range\` | \`{ "range": { "released": { "gte": "now-1y/d" } } }\` |
| \`exists\` | documents that have a field |
| \`prefix\` / \`wildcard\` / \`regexp\` | pattern matching (can be slow) |
| \`ids\` | fetch by \`_id\` |

⚠️ \`term\` on a \`text\` field almost never matches — the indexed tokens are lowercased/stemmed.

### Pagination

| Method | When |
|---|---|
| \`from\` + \`size\` | first pages only (default limit: 10 000 hits) |
| \`search_after\` + **point in time (PIT)** | deep pagination / infinite scroll, consistent view |
| \`_async_search\`, scroll | large exports (scroll is legacy) |

Always add a unique **tiebreaker** to the sort (e.g. \`_shard_doc\` with PIT or an ID keyword).`,
      code: PRODUCTS + `
GET /products/_search
{
  "query": {
    "bool": {
      "filter": [
        { "terms": { "category": ["accessories", "displays"] } },
        { "range": { "released": { "gte": "2025-01-01", "lt": "now" } } },
        { "exists": { "field": "rating" } }
      ]
    }
  },
  "sort": [ { "rating": "desc" }, { "price": "asc" } ],
  "from": 0,
  "size": 2
}

# Deep pagination: open a point in time, then page with search_after
POST /products/_pit?keep_alive=2m

GET /_search
{
  "size": 2,
  "pit": { "id": "<pit id from previous call>", "keep_alive": "2m" },
  "sort": [ { "price": "asc" }, { "_shard_doc": "asc" } ]
}

GET /_search
{
  "size": 2,
  "pit": { "id": "<pit id>", "keep_alive": "2m" },
  "sort": [ { "price": "asc" }, { "_shard_doc": "asc" } ],
  "search_after": [59.5, 3]
}

DELETE /_pit
{ "id": "<pit id>" }`,
      codeLabel: 'Filters, sorting and search_after with a PIT',
      codeLanguage: 'http',
      keyPoints: [
        'Term-level queries are exact and should target keyword/numeric/date fields.',
        '`from + size` is for shallow pages; use `search_after` with a PIT for deep paging.',
        'Add a unique tiebreaker to every paginated sort.',
        'Avoid leading wildcards — they scan the whole term dictionary.',
      ],
    },
    {
      title: 'Aggregations',
      after: 'Term-Level Queries, Sorting & Pagination',
      content: `Aggregations compute analytics over the documents matched by the query — in the **same request** as the hits.

| Family | Examples |
|---|---|
| **Bucket** (group) | \`terms\`, \`range\`, \`date_histogram\`, \`histogram\`, \`filters\`, \`nested\` |
| **Metric** | \`avg\`, \`sum\`, \`min\`, \`max\`, \`stats\`, \`cardinality\` (approx. distinct), \`percentiles\` |
| **Pipeline** | \`bucket_sort\`, \`derivative\`, \`cumulative_sum\`, \`moving_fn\` |

Buckets can contain **sub-aggregations** (brand → average price). Set \`"size": 0\` when you only need the aggregations. Use \`post_filter\` to filter hits **without** changing facet counts — the standard pattern for faceted search UIs.

Aggregations run on **keyword**, numeric and date fields (doc values), not on analysed \`text\`.`,
      code: PRODUCTS + `
GET /products/_search
{
  "size": 0,
  "query": { "range": { "price": { "lte": 400 } } },
  "aggs": {
    "by_category": {
      "terms": { "field": "category", "size": 10 },
      "aggs": {
        "avg_price":  { "avg": { "field": "price" } },
        "top_rated":  { "top_hits": { "size": 1, "sort": [{ "rating": "desc" }], "_source": ["name"] } }
      }
    },
    "price_bands": {
      "range": { "field": "price", "ranges": [ { "to": 50 }, { "from": 50, "to": 100 }, { "from": 100 } ] }
    },
    "released_per_quarter": {
      "date_histogram": { "field": "released", "calendar_interval": "quarter", "format": "yyyy-QQQ" }
    },
    "brands": { "cardinality": { "field": "brand" } },
    "rating_stats": { "stats": { "field": "rating" } }
  }
}

# Faceted search: facets count everything, hits respect the user's selected brand
GET /products/_search
{
  "query": { "match": { "description": "office" } },
  "aggs": { "brands": { "terms": { "field": "brand" } } },
  "post_filter": { "term": { "brand": "Logi" } }
}`,
      codeLabel: 'Bucket, metric and nested aggregations',
      codeLanguage: 'http',
      keyPoints: [
        'Bucket aggs group documents; metric aggs compute numbers per bucket.',
        'Use `size: 0` when you only need aggregation results.',
        '`post_filter` narrows hits without affecting facet counts.',
        'Aggregate on keyword/numeric/date fields, not analysed text.',
      ],
    },
    {
      title: 'Bulk Indexing & Reindexing',
      after: 'Aggregations',
      content: `### Bulk API

\`_bulk\` sends many index/create/update/delete actions in one request (NDJSON: action line + document line). Aim for **5–15 MB** per request and check \`errors\` in the response — a bulk call returns 200 even if some items failed.

For large initial loads, temporarily set \`refresh_interval: -1\` and \`number_of_replicas: 0\`, then restore them.

### Reindex with zero downtime

1. Create \`products_v2\` with the new mapping.
2. \`POST _reindex\` from \`products_v1\` (optionally transform with a script or ingest pipeline).
3. Atomically switch the **alias** \`products\` from v1 to v2.
4. Delete v1 when you are confident.

Applications always talk to the **alias**, never to a versioned index name.

### Ingest pipelines

Run processors on documents before indexing: \`set\`, \`rename\`, \`lowercase\`, \`date\`, \`grok\`, \`geoip\`, \`script\`.`,
      code: `# 1. New index with improved mapping
PUT /products_v2
{
  "settings": { "number_of_replicas": 0, "refresh_interval": "-1" },
  "mappings": {
    "properties": {
      "name":  { "type": "text", "fields": { "keyword": { "type": "keyword" } } },
      "brand": { "type": "keyword" },
      "price": { "type": "scaled_float", "scaling_factor": 100 },
      "slug":  { "type": "keyword" }
    }
  }
}

# 2. Ingest pipeline that derives a slug during the copy
PUT /_ingest/pipeline/add-slug
{
  "processors": [
    { "lowercase": { "field": "name", "target_field": "slug" } },
    { "gsub": { "field": "slug", "pattern": "[^a-z0-9]+", "replacement": "-" } }
  ]
}

POST /_reindex?wait_for_completion=false
{
  "source": { "index": "products_v1", "size": 1000 },
  "dest":   { "index": "products_v2", "pipeline": "add-slug" }
}
GET /_tasks?actions=*reindex&detailed

# 3. Restore settings, then switch the alias atomically
PUT /products_v2/_settings
{ "index": { "number_of_replicas": 1, "refresh_interval": "1s" } }

POST /_aliases
{
  "actions": [
    { "remove": { "index": "products_v1", "alias": "products" } },
    { "add":    { "index": "products_v2", "alias": "products", "is_write_index": true } }
  ]
}

# Bulk writes always go through the alias
POST /products/_bulk
{ "index":  { "_id": "10" } }
{ "name": "USB-C Hub", "brand": "Anker", "price": 39.9 }
{ "update": { "_id": "2" } }
{ "doc": { "price": 79.0 } }
{ "delete": { "_id": "4" } }`,
      codeLabel: 'Reindex through a pipeline and swap the alias',
      codeLanguage: 'http',
      keyPoints: [
        'Use `_bulk` for throughput and always inspect per-item errors.',
        'Disable refresh and replicas during big loads, then restore them.',
        'Point applications at aliases so reindexing needs no downtime.',
        'Ingest pipelines transform documents on the way in.',
      ],
    },
    {
      title: 'Index Templates, ILM & Data Streams',
      after: 'Bulk Indexing & Reindexing',
      content: `Time-series data (logs, metrics, events) grows forever. Elasticsearch manages it with:

| Feature | Role |
|---|---|
| **Index template** | settings + mappings applied automatically to new indices matching a pattern |
| **Component templates** | reusable building blocks for index templates |
| **Data stream** | one name for append-only data backed by hidden rolling indices |
| **ILM policy** | lifecycle phases: hot → warm → cold → frozen → delete |
| **Rollover** | start a new backing index at a size/age threshold |

### Typical ILM policy

- **hot**: rollover at 50 GB per primary shard or 1 day
- **warm** (7 d): shrink, force-merge, move to cheaper nodes
- **delete** (30–90 d)

Shard sizing rule of thumb: **10–50 GB per shard**; too many small shards waste heap.`,
      code: `PUT /_ilm/policy/logs-30d
{
  "policy": {
    "phases": {
      "hot":    { "actions": { "rollover": { "max_primary_shard_size": "50gb", "max_age": "1d" } } },
      "warm":   { "min_age": "7d",  "actions": { "forcemerge": { "max_num_segments": 1 }, "shrink": { "number_of_shards": 1 } } },
      "delete": { "min_age": "30d", "actions": { "delete": {} } }
    }
  }
}

PUT /_index_template/app-logs
{
  "index_patterns": ["logs-app-*"],
  "data_stream": {},
  "priority": 200,
  "template": {
    "settings": { "index.lifecycle.name": "logs-30d", "number_of_shards": 1 },
    "mappings": {
      "properties": {
        "@timestamp": { "type": "date" },
        "level":      { "type": "keyword" },
        "service":    { "type": "keyword" },
        "message":    { "type": "text" },
        "trace_id":   { "type": "keyword" }
      }
    }
  }
}

# Writing to a data stream creates it automatically (op_type must be create)
POST /logs-app-checkout/_doc
{ "@timestamp": "2026-10-25T10:15:00Z", "level": "ERROR", "service": "checkout", "message": "Payment timeout", "trace_id": "4bf92f35" }

GET /_data_stream/logs-app-checkout
GET /logs-app-checkout/_ilm/explain`,
      codeLabel: 'ILM policy + index template + data stream',
      codeLanguage: 'http',
      keyPoints: [
        'Index templates apply settings and mappings to new indices automatically.',
        'Data streams give append-only time-series data a single name.',
        'ILM rolls over, shrinks and deletes indices as they age.',
        'Keep shards roughly 10–50 GB; avoid thousands of tiny shards.',
      ],
    },
    {
      title: 'Using Elasticsearch from Code',
      after: 'Index Templates, ILM & Data Streams',
      content: `Official clients exist for Java, JavaScript, Python, .NET, Go, PHP and Ruby. They handle connection pooling, retries, node sniffing and auth.

| Concern | Tip |
|---|---|
| Auth | API keys (\`ApiKey\`) or service accounts — not the \`elastic\` superuser |
| TLS | verify certificates (\`caFingerprint\` / CA file) |
| Bulk loading | client bulk helpers handle batching, retries and backpressure |
| Timeouts | set request timeouts; long searches → async search |
| Index naming | read/write through aliases |
| Testing | Testcontainers with the official image |

Keep search logic (query building) in one module so relevance tuning doesn't require touching every caller.`,
      code: `// npm install @elastic/elasticsearch   •   node search.mjs
import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: process.env.ES_URL ?? "https://localhost:9200",
  auth: { apiKey: process.env.ES_API_KEY ?? "" },
  tls: { rejectUnauthorized: process.env.NODE_ENV === "production" },
  requestTimeout: 10_000,
});

async function indexProducts(products) {
  const result = await client.helpers.bulk({
    datasource: products,
    onDocument: (doc) => ({ index: { _index: "products", _id: doc.id } }),
    onDrop: (failed) => console.error("Dropped:", failed.error),
    refreshOnCompletion: true,
  });
  console.log(\`indexed \${result.successful}/\${result.total} in \${result.time}ms\`);
}

async function searchProducts({ text, maxPrice, page = 1, size = 10 }) {
  const res = await client.search({
    index: "products",
    from: (page - 1) * size,
    size,
    query: {
      bool: {
        must: text ? [{ multi_match: { query: text, fields: ["name^3", "description"], fuzziness: "AUTO" } }] : [],
        filter: [{ term: { in_stock: true } }, ...(maxPrice ? [{ range: { price: { lte: maxPrice } } }] : [])],
      },
    },
    aggs: { brands: { terms: { field: "brand" } } },
  });
  return {
    total: res.hits.total.value,
    items: res.hits.hits.map((h) => ({ id: h._id, score: h._score, ...h._source })),
    brands: res.aggregations.brands.buckets.map((b) => \`\${b.key} (\${b.doc_count})\`),
  };
}

await indexProducts([
  { id: "1", name: "Wireless Mouse", brand: "Logi", price: 29.99, in_stock: true, description: "Quiet office mouse" },
  { id: "2", name: "Mechanical Keyboard", brand: "Keychron", price: 89, in_stock: true, description: "Wireless keyboard" },
]);
console.log(await searchProducts({ text: "wireles", maxPrice: 100 }));`,
      codeLabel: 'Node client: bulk helper and a search function',
      codeLanguage: 'javascript',
      keyPoints: [
        'Use the official client with API-key auth and TLS verification.',
        'The bulk helper batches, retries and reports dropped documents.',
        'Centralise query building so relevance changes happen in one place.',
        'Read the total from `hits.total.value` and facets from `aggregations`.',
      ],
    },
  ],
};

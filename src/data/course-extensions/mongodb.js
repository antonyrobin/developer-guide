/*
 * MongoDB course extension — extra sections and worked examples merged into
 * courses-data/mongodb.js at load time. Shell examples are written for
 * mongosh and start by inserting their own sample data, so you can paste each
 * one into a fresh database (`use guide`).
 */

const PRODUCTS = `// Sample data ---------------------------------------------------
db.products.drop();
db.products.insertMany([
  { _id: 1, name: "Laptop",   category: "tech",  price: 1200, stock: 5,  tags: ["work", "portable"], ratings: [5, 4, 5] },
  { _id: 2, name: "Mouse",    category: "tech",  price: 25,   stock: 80, tags: ["work"],             ratings: [4, 4] },
  { _id: 3, name: "Desk",     category: "home",  price: 300,  stock: 0,  tags: ["work", "wood"],     ratings: [3] },
  { _id: 4, name: "Lamp",     category: "home",  price: 45,   stock: 12, tags: ["light"],            ratings: [] },
  { _id: 5, name: "Monitor",  category: "tech",  price: 220,  stock: 7,  tags: ["work", "screen"],   ratings: [5, 5, 4, 3] }
]);
// ---------------------------------------------------------------
`;

const ORDERS = `// Sample data ---------------------------------------------------
db.orders.drop();
db.orders.insertMany([
  { customer: "ana", status: "paid",    createdAt: ISODate("2026-03-01"), items: [{ sku: "LAP", qty: 1, price: 1200 }, { sku: "MOU", qty: 2, price: 25 }] },
  { customer: "ben", status: "paid",    createdAt: ISODate("2026-03-02"), items: [{ sku: "MOU", qty: 1, price: 25 }] },
  { customer: "ana", status: "shipped", createdAt: ISODate("2026-04-10"), items: [{ sku: "MON", qty: 2, price: 220 }] },
  { customer: "cy",  status: "cancelled", createdAt: ISODate("2026-04-11"), items: [{ sku: "DSK", qty: 1, price: 300 }] }
]);
// ---------------------------------------------------------------
`;

export default {
  examples: {
    'Basic CRUD Operations (Mongosh / Shell)': [
      {
        title: 'Full CRUD round-trip in mongosh',
        language: 'javascript',
        explanation: 'Run in `mongosh` after `use guide`. `insertOne` returns the generated `_id`; update operators such as `$set` change only the named fields.',
        code: `db.users.drop();
const { insertedId } = db.users.insertOne({ name: "Ada", email: "ada@example.com", roles: ["dev"], createdAt: new Date() });
db.users.insertMany([
  { name: "Linus", email: "linus@example.com", roles: ["dev", "admin"] },
  { name: "Grace", email: "grace@example.com", roles: ["admin"] }
]);

db.users.find({ roles: "admin" }, { _id: 0, name: 1 });            // array contains "admin"
db.users.findOne({ _id: insertedId });
db.users.updateOne({ name: "Ada" }, { $set: { email: "ada@lovelace.dev" }, $push: { roles: "author" } });
db.users.updateMany({}, { $currentDate: { updatedAt: true } });
db.users.deleteOne({ name: "Linus" });
db.users.countDocuments();                                         // 2`,
      },
    ],
  },

  sections: [
    {
      title: 'Data Modeling: Embed vs Reference',
      after: 'Basic CRUD Operations (Mongosh / Shell)',
      content: `MongoDB stores **documents** (BSON, max 16 MB). Model around how the application **reads** data: data that is read together should usually be stored together.

| Embed (sub-documents / arrays) | Reference (store \`_id\`s) |
|---|---|
| one-to-few (addresses on a user) | one-to-many with unbounded growth (comments on a viral post) |
| data always read with the parent | data read independently |
| atomic updates of parent + children in one write | many-to-many relationships |
| child has no meaning on its own | shared entities (a product referenced by many orders) |

### Useful patterns

- **Extended reference** — copy a few frequently-read fields (e.g. \`customer.name\`) next to the reference to avoid a lookup.
- **Subset** — embed the latest 10 reviews, keep the rest in their own collection.
- **Bucket** — group time-series readings per hour/device (or use native **time-series collections**).
- **Computed** — store pre-aggregated totals updated on write.

Avoid unbounded arrays: a document that grows forever eventually hits 16 MB and slows every update.`,
      code: `// Embedded: an order owns its line items and a snapshot of the shipping address
db.orders.insertOne({
  _id: "ORD-1001",
  customer: { _id: ObjectId(), name: "Ana Silva" },        // extended reference
  shipTo: { street: "Rua A 1", city: "Lisbon", zip: "1000-001" },
  items: [
    { sku: "LAP", name: "Laptop", qty: 1, price: 1200 },
    { sku: "MOU", name: "Mouse",  qty: 2, price: 25 }
  ],
  total: 1250,
  status: "paid"
});

// Referenced: posts and comments (comments can grow without limit)
const postId = db.posts.insertOne({ title: "Schema design", tags: ["mongodb"], commentCount: 0 }).insertedId;
db.comments.insertMany([
  { postId, author: "ben", text: "Great post!", at: new Date() },
  { postId, author: "cy",  text: "What about buckets?", at: new Date() }
]);
db.posts.updateOne({ _id: postId }, { $inc: { commentCount: 2 } });   // computed pattern
db.comments.createIndex({ postId: 1, at: -1 });

// Read a post with its latest comments
db.posts.aggregate([
  { $match: { _id: postId } },
  { $lookup: { from: "comments", localField: "_id", foreignField: "postId", as: "latest",
               pipeline: [{ $sort: { at: -1 } }, { $limit: 10 }, { $project: { _id: 0, author: 1, text: 1 } }] } }
]);`,
      codeLabel: 'Embedded order vs referenced comments',
      keyPoints: [
        'Design the schema around your queries — data read together lives together.',
        'Embed bounded, owned data; reference unbounded or shared data.',
        'Copy a few hot fields next to a reference to avoid frequent `$lookup`s.',
        'Never let arrays grow without limit; documents cap at 16 MB.',
      ],
    },
    {
      title: 'Query Operators & Projections',
      after: 'Data Modeling: Embed vs Reference',
      content: `\`find(filter, projection)\` returns a cursor. Filters are documents built from operators.

| Category | Operators |
|---|---|
| Comparison | \`$eq\`, \`$ne\`, \`$gt\`, \`$gte\`, \`$lt\`, \`$lte\`, \`$in\`, \`$nin\` |
| Logical | \`$and\` (implicit with commas), \`$or\`, \`$nor\`, \`$not\` |
| Element | \`$exists\`, \`$type\` |
| Array | \`$all\`, \`$size\`, \`$elemMatch\`, plain value = "array contains" |
| Evaluation | \`$regex\`, \`$expr\` (compare fields), \`$text\` |

### Cursor modifiers

\`.sort({ price: -1 })\`, \`.skip(20)\`, \`.limit(10)\`, \`.count()\` → prefer \`countDocuments(filter)\`.

### Projection

\`{ name: 1, price: 1, _id: 0 }\` includes fields; \`{ ratings: 0 }\` excludes. Use \`"field.sub": 1\` for nested fields and \`$slice\` for arrays. Returning only what you need saves bandwidth and lets covered queries use indexes alone.`,
      code: PRODUCTS + `
// Comparison + logical
db.products.find({ category: "tech", price: { $gte: 100, $lte: 1000 } }, { _id: 0, name: 1, price: 1 });
db.products.find({ $or: [{ stock: 0 }, { price: { $lt: 30 } }] }, { name: 1 });

// Arrays
db.products.countDocuments({ tags: "work" });                  // 4 — array contains "work"
db.products.find({ tags: { $all: ["work", "portable"] } });     // contains both
db.products.find({ ratings: { $size: 0 } }, { name: 1 });       // no ratings yet
db.products.find({ ratings: { $elemMatch: { $gte: 5 } } }, { name: 1, ratings: { $slice: 2 } });

// Field existence, regex, comparing two fields with $expr
db.products.find({ discount: { $exists: false } }).limit(2);
db.products.find({ name: { $regex: "^m", $options: "i" } }, { name: 1 });
db.products.find({ $expr: { $lt: ["$stock", { $size: "$ratings" }] } }, { name: 1 });

// Sorting & paging
db.products.find({}, { name: 1, price: 1 }).sort({ price: -1, _id: 1 }).skip(0).limit(3);
db.products.countDocuments({ category: "home" });               // 2`,
      codeLabel: 'Filters, array queries, $expr and paging',
      keyPoints: [
        'Multiple conditions in one filter document are an implicit AND.',
        'Querying an array field with a value matches if any element equals it.',
        'Use `$elemMatch` when several conditions must hold for the same element.',
        'Project only needed fields and always sort before skip/limit.',
      ],
    },
    {
      title: 'Update Operators & Arrays',
      after: 'Query Operators & Projections',
      content: `Updates take a filter and an **update document** with operators. A replacement document (no operators) overwrites the whole document — use \`replaceOne\` for that on purpose.

| Operator | Effect |
|---|---|
| \`$set\` / \`$unset\` | set / remove fields |
| \`$inc\`, \`$mul\` | atomic arithmetic |
| \`$min\` / \`$max\` | update only if lower / higher |
| \`$rename\`, \`$currentDate\` | rename field, set timestamp |
| \`$push\` (+ \`$each\`, \`$slice\`, \`$sort\`) | append to array (capped) |
| \`$addToSet\` | append if not present |
| \`$pull\` / \`$pop\` | remove matching / first-last element |
| \`$\`, \`$[]\`, \`$[elem]\` | positional: first match, all, filtered |

### Options

- \`{ upsert: true }\` — insert when nothing matches.
- \`findOneAndUpdate(..., { returnDocument: "after" })\` — update and return the document atomically (counters, job queues).
- Single-document updates are **atomic**, including embedded arrays.`,
      code: PRODUCTS + `
// Atomic stock decrement only if enough stock (prevents overselling)
db.products.updateOne({ _id: 2, stock: { $gte: 3 } }, { $inc: { stock: -3 }, $currentDate: { updatedAt: true } });

// Arrays
db.products.updateOne({ _id: 4 }, { $addToSet: { tags: "home" } });
db.products.updateOne({ _id: 4 }, { $addToSet: { tags: "home" } });          // no duplicate
db.products.updateOne({ _id: 1 }, { $push: { ratings: { $each: [3, 2], $slice: -3 } } }); // keep last 3
db.products.updateMany({}, { $pull: { tags: "wood" } });

// Positional operators on arrays of sub-documents
db.carts.drop();
db.carts.insertOne({ _id: "c1", items: [{ sku: "A", qty: 1 }, { sku: "B", qty: 5 }] });
db.carts.updateOne({ _id: "c1", "items.sku": "B" }, { $inc: { "items.$.qty": 1 } });      // first match
db.carts.updateOne({ _id: "c1" }, { $set: { "items.$[big].bulk": true } },
                   { arrayFilters: [{ "big.qty": { $gte: 5 } }] });                        // filtered

// Upsert and atomic counters
db.counters.updateOne({ _id: "invoice" }, { $inc: { seq: 1 } }, { upsert: true });
db.counters.findOneAndUpdate({ _id: "invoice" }, { $inc: { seq: 1 } }, { returnDocument: "after" });  // { seq: 2 }
db.carts.findOne({ _id: "c1" });`,
      codeLabel: 'Conditional decrement, array updates and upserts',
      keyPoints: [
        'Always use update operators; a plain document replaces the whole record.',
        'Put preconditions in the filter (e.g. `stock: { $gte: n }`) for safe atomic updates.',
        '`$addToSet`, `$push` with `$slice`, and `$pull` manage arrays without read-modify-write.',
        'Use `arrayFilters` to update specific elements inside arrays.',
      ],
    },
    {
      title: 'Indexes & Query Performance',
      after: 'Update Operators & Arrays',
      content: `Without an index MongoDB scans every document (**COLLSCAN**). Indexes are B-trees on one or more fields.

| Index type | Example |
|---|---|
| Single field | \`{ email: 1 }\` (+ \`{ unique: true }\`) |
| Compound | \`{ status: 1, createdAt: -1 }\` |
| Multikey | on an array field — automatic |
| Text | \`{ title: "text", body: "text" }\` |
| TTL | \`{ createdAt: 1 }, { expireAfterSeconds: 3600 }\` — auto-delete |
| Partial | \`{ partialFilterExpression: { status: "active" } }\` |
| Wildcard / 2dsphere / hashed | dynamic fields / geo / sharding |

### The ESR rule for compound indexes

Order fields as **E**quality → **S**ort → **R**ange. For \`find({ status: "paid", total: { $gt: 100 } }).sort({ createdAt: -1 })\` use \`{ status: 1, createdAt: -1, total: 1 }\`.

### Reading explain()

\`explain("executionStats")\` → look for \`IXSCAN\` vs \`COLLSCAN\`, and compare \`totalDocsExamined\` with \`nReturned\` — ideally close to 1:1.`,
      code: ORDERS + `
db.orders.createIndex({ status: 1, createdAt: -1 });             // equality, then sort
db.orders.createIndex({ customer: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });   // TTL
db.orders.createIndex({ "items.sku": 1 });                         // multikey on array of docs

const plan = db.orders.find({ status: "paid" }).sort({ createdAt: -1 }).explain("executionStats");
printjson({
  stage: plan.queryPlanner.winningPlan.inputStage?.stage ?? plan.queryPlanner.winningPlan.stage,
  returned: plan.executionStats.nReturned,
  docsExamined: plan.executionStats.totalDocsExamined,
  keysExamined: plan.executionStats.totalKeysExamined,
  ms: plan.executionStats.executionTimeMillis
});

db.orders.getIndexes().map(i => i.name);
db.orders.aggregate([{ $indexStats: {} }, { $project: { name: 1, "accesses.ops": 1 } }]);  // find unused indexes`,
      codeLabel: 'Creating indexes and checking explain()',
      keyPoints: [
        'Every frequent query should be served by an index (IXSCAN, not COLLSCAN).',
        'Order compound index fields by Equality, Sort, Range.',
        'Unique, TTL and partial indexes enforce rules and save storage.',
        'Each index slows writes — remove unused ones found via `$indexStats`.',
      ],
    },
    {
      title: 'Aggregation Pipeline',
      after: 'Indexes & Query Performance',
      content: `The aggregation pipeline transforms documents through **stages**, like a Unix pipe.

| Stage | SQL analogue |
|---|---|
| \`$match\` | \`WHERE\` (put it first to use indexes) |
| \`$project\` / \`$addFields\` / \`$set\` | \`SELECT\` expressions |
| \`$group\` | \`GROUP BY\` with \`$sum\`, \`$avg\`, \`$min\`, \`$max\`, \`$push\`, \`$addToSet\` |
| \`$sort\`, \`$limit\`, \`$skip\` | \`ORDER BY\`, \`LIMIT\`, \`OFFSET\` |
| \`$unwind\` | one document per array element |
| \`$lookup\` | \`LEFT OUTER JOIN\` |
| \`$facet\` | several sub-pipelines on the same input |
| \`$bucket\` | histograms |
| \`$merge\` / \`$out\` | write results to a collection (materialised views) |

Field paths use \`"$field"\`; stages can use expression operators like \`$multiply\`, \`$cond\`, \`$dateToString\`.`,
      code: ORDERS + `
// Revenue per customer for non-cancelled orders
db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $unwind: "$items" },
  { $group: {
      _id: "$customer",
      revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
      units:   { $sum: "$items.qty" },
      orders:  { $addToSet: "$_id" } } },
  { $project: { _id: 0, customer: "$_id", revenue: 1, units: 1, orderCount: { $size: "$orders" } } },
  { $sort: { revenue: -1 } }
]);
// [ { customer: 'ana', revenue: 1690, units: 5, orderCount: 2 },
//   { customer: 'ben', revenue: 25,   units: 1, orderCount: 1 } ]

// Monthly totals + top SKUs in one pass with $facet
db.orders.aggregate([
  { $match: { status: { $in: ["paid", "shipped"] } } },
  { $unwind: "$items" },
  { $facet: {
      byMonth: [
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    total: { $sum: { $multiply: ["$items.qty", "$items.price"] } } } },
        { $sort: { _id: 1 } } ],
      topSkus: [
        { $group: { _id: "$items.sku", qty: { $sum: "$items.qty" } } },
        { $sort: { qty: -1 } }, { $limit: 2 } ]
  } }
]);`,
      codeLabel: '$unwind → $group → $project and $facet',
      keyPoints: [
        'Start pipelines with `$match` (and `$sort`) so they can use indexes.',
        '`$unwind` + `$group` is the standard way to aggregate array contents.',
        '`$lookup` joins collections; keep it off hot paths where possible.',
        '`$facet` computes several reports from one scan of the input.',
      ],
    },
    {
      title: 'Schema Validation & Transactions',
      after: 'Aggregation Pipeline',
      content: `### Schema validation

MongoDB is schema-flexible, not schema-less. A **\`$jsonSchema\` validator** rejects bad writes at the database level — useful when several services write to one collection.

| Option | Values |
|---|---|
| \`validationLevel\` | \`strict\` (all writes) / \`moderate\` (only already-valid docs) |
| \`validationAction\` | \`error\` (reject) / \`warn\` (log only) |

### Multi-document transactions

Single-document writes are always atomic. For changes spanning documents or collections (e.g. move money between two accounts) use a **transaction** on a replica set or sharded cluster.

- Keep transactions short (default limit 60 s) and touch few documents.
- Use \`session.withTransaction()\` — it retries on transient errors.
- Prefer modelling so that one document holds what changes together; transactions are the exception, not the norm.

### Write & read concerns

\`w: "majority"\` waits until a majority of replicas have the write; \`readConcern: "majority"\` reads only committed data.`,
      code: `// Enforce a schema on the accounts collection
db.accounts.drop();
db.createCollection("accounts", {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["owner", "balance", "currency"],
    properties: {
      owner:    { bsonType: "string", minLength: 1 },
      balance:  { bsonType: ["int", "long", "double", "decimal"], minimum: 0 },
      currency: { enum: ["EUR", "USD", "GBP"] }
    }
  } },
  validationLevel: "strict",
  validationAction: "error"
});

db.accounts.insertMany([
  { _id: "A", owner: "ana", balance: 500, currency: "EUR" },
  { _id: "B", owner: "ben", balance: 100, currency: "EUR" }
]);
try {
  db.accounts.insertOne({ owner: "", balance: -5, currency: "BTC" });
} catch (e) {
  print("rejected:", e.errInfo?.details?.operatorName ?? e.message);
}

// Transfer money atomically (needs a replica set, e.g. Atlas or rs.initiate())
const session = db.getMongo().startSession();
try {
  session.withTransaction(() => {
    const accounts = session.getDatabase(db.getName()).accounts;
    const res = accounts.updateOne({ _id: "A", balance: { $gte: 200 } }, { $inc: { balance: -200 } });
    if (res.modifiedCount !== 1) throw new Error("insufficient funds");
    accounts.updateOne({ _id: "B" }, { $inc: { balance: 200 } });
  }, { writeConcern: { w: "majority" }, readConcern: { level: "snapshot" } });
} finally {
  session.endSession();
}
db.accounts.find({}, { owner: 1, balance: 1 });`,
      codeLabel: '$jsonSchema validator and a money transfer transaction',
      keyPoints: [
        'Use `$jsonSchema` validators to enforce required fields, types and enums.',
        'Single-document operations are atomic without a transaction.',
        'Use `withTransaction` for multi-document changes; keep them short.',
        '`w: "majority"` makes writes durable across replica set failover.',
      ],
    },
    {
      title: 'Node.js Native Driver',
      after: 'Node.js (Mongoose) Integration',
      content: `The official \`mongodb\` package is a thin, fast driver; **Mongoose** adds schemas, validation and middleware on top. Use the native driver when you want full control or are writing infrastructure code.

| Task | Native driver |
|---|---|
| Connect once, reuse | \`const client = new MongoClient(uri); await client.connect()\` |
| Typed collections (TS) | \`db.collection<User>("users")\` |
| Iterate large results | \`for await (const doc of cursor)\` |
| Bulk writes | \`collection.bulkWrite([...], { ordered: false })\` |
| Transactions | \`client.withSession(s => s.withTransaction(...))\` |
| Change streams | \`collection.watch(pipeline)\` |

Create **one \`MongoClient\` per process** — it manages a connection pool. Store the URI in an environment variable.`,
      code: `// npm install mongodb   •   node app.mjs   (MONGODB_URI defaults to a local server)
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017", {
  maxPoolSize: 20,
  serverSelectionTimeoutMS: 5000,
});

async function main() {
  await client.connect();
  const db = client.db("guide");
  const tasks = db.collection("tasks");
  await tasks.createIndex({ owner: 1, due: 1 });

  const { insertedId } = await tasks.insertOne({ owner: "ada", title: "Write docs", due: new Date("2026-11-01"), done: false });

  await tasks.bulkWrite([
    { insertOne: { document: { owner: "ada", title: "Review PR", due: new Date("2026-10-30"), done: false } } },
    { updateOne: { filter: { _id: insertedId }, update: { $set: { done: true } } } },
  ], { ordered: false });

  const cursor = tasks.find({ owner: "ada" }).sort({ due: 1 }).project({ _id: 0, title: 1, done: 1 });
  for await (const task of cursor) console.log(task);

  const open = await tasks.countDocuments({ owner: "ada", done: false });
  console.log({ open, byId: await tasks.findOne({ _id: new ObjectId(insertedId) }) });
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(() => client.close());`,
      codeLabel: 'Connect, bulkWrite and stream results',
      keyPoints: [
        'Create one `MongoClient` per process and reuse its pool.',
        'Use `for await` to stream large cursors without loading everything.',
        '`bulkWrite` batches mixed operations into one round trip.',
        'Choose Mongoose for schemas and hooks, the native driver for control and speed.',
      ],
    },
  ],
};

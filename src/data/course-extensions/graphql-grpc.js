/*
 * GraphQL & gRPC course extension — extra sections and worked examples merged
 * into courses-data/graphql-grpc.js at load time. Node examples are ES modules
 * that run with `node file.mjs` after `npm i graphql dataloader` (GraphQL) or
 * `npm i @grpc/grpc-js @grpc/proto-loader` (gRPC); they start and call their
 * own server so no extra setup is needed.
 */

export default {
  examples: {
    'GraphQL Example (Node.js/Apollo)': [
      {
        title: 'Execute a query with graphql-js (no server)',
        language: 'javascript',
        explanation: '`graphql()` parses, validates and executes a query against a schema — the same engine Apollo Server uses under the hood. Great for experimenting and for unit-testing resolvers.',
        code: `import { buildSchema, graphql } from "graphql";

const schema = buildSchema(\`
  type Book { id: ID!, title: String!, year: Int }
  type Query { books(minYear: Int): [Book!]!, book(id: ID!): Book }
\`);

const BOOKS = [
  { id: "1", title: "Dune", year: 1965 },
  { id: "2", title: "Neuromancer", year: 1984 },
];

const rootValue = {
  books: ({ minYear = 0 }) => BOOKS.filter((b) => b.year >= minYear),
  book: ({ id }) => BOOKS.find((b) => b.id === id) ?? null,
};

const result = await graphql({
  schema,
  rootValue,
  source: "query ($y: Int) { books(minYear: $y) { title } book(id: \\"1\\") { title year } }",
  variableValues: { y: 1980 },
});
console.log(JSON.stringify(result));`,
        output: `{"data":{"books":[{"title":"Neuromancer"}],"book":{"title":"Dune","year":1965}}}`,
      },
    ],
  },

  sections: [
    {
      title: 'GraphQL Schema & Type System',
      after: 'GraphQL Example (Node.js/Apollo)',
      content: `The **schema** (written in SDL) is the contract between client and server. Everything a client can ask for is typed.

| Kind | Example |
|---|---|
| Scalars | \`Int\`, \`Float\`, \`String\`, \`Boolean\`, \`ID\`, custom \`scalar DateTime\` |
| Object type | \`type User { id: ID!, name: String! }\` |
| Non-null / list | \`String!\`, \`[Post!]!\` (non-null list of non-null posts) |
| Enum | \`enum Role { ADMIN EDITOR VIEWER }\` |
| Interface | shared fields: \`interface Node { id: ID! }\` |
| Union | \`union SearchResult = User \\| Post\` |
| Input type | arguments for mutations: \`input CreatePostInput { ... }\` |
| Root types | \`Query\`, \`Mutation\`, \`Subscription\` |

### Design tips

- Model the **domain graph**, not your database tables.
- Make fields **nullable by default** unless you can always return them — one failing non-null field nulls its whole parent.
- Use **connections** (\`edges\`, \`node\`, \`pageInfo\`, \`cursor\`) for paginated lists.
- Evolve without versions: add fields freely, mark old ones \`@deprecated(reason: "...")\`.`,
      code: `scalar DateTime

enum Role { ADMIN EDITOR VIEWER }

interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
  email: String!
  role: Role!
  posts(first: Int = 10, after: String): PostConnection!
}

type Post implements Node {
  id: ID!
  title: String!
  body: String
  author: User!
  tags: [String!]!
  publishedAt: DateTime
  legacySlug: String @deprecated(reason: "Use id")
}

type PostEdge { cursor: String!, node: Post! }
type PageInfo { hasNextPage: Boolean!, endCursor: String }
type PostConnection { edges: [PostEdge!]!, pageInfo: PageInfo!, totalCount: Int! }

union SearchResult = User | Post

input CreatePostInput {
  title: String!
  body: String
  tags: [String!] = []
}

type Query {
  node(id: ID!): Node
  me: User
  search(term: String!): [SearchResult!]!
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
  deletePost(id: ID!): Boolean!
}

type Subscription {
  postPublished: Post!
}`,
      codeLabel: 'schema.graphql — interfaces, unions, inputs and connections',
      keyPoints: [
        'The SDL schema is a typed contract; clients can only ask for what it defines.',
        '`!` means non-null — use it deliberately, since errors propagate to the parent.',
        'Use input types for mutation arguments and connections for pagination.',
        'Deprecate fields instead of versioning the API.',
      ],
    },
    {
      title: 'Queries, Variables, Fragments & Aliases',
      after: 'GraphQL Schema & Type System',
      content: `Clients describe the **exact shape** of the response.

| Feature | Purpose |
|---|---|
| **Operation name** | \`query DashboardData { ... }\` — shows up in logs and tooling |
| **Variables** | \`query ($id: ID!)\` + JSON variables — never string-concatenate values |
| **Aliases** | fetch the same field twice: \`admins: users(role: ADMIN)\` |
| **Fragments** | reuse selections: \`...UserCard\` |
| **Inline fragments** | select fields per type on unions/interfaces: \`... on Post { title }\` |
| **Directives** | \`@include(if: $withPosts)\`, \`@skip(if: ...)\` |
| **\`__typename\`** | which concrete type was returned |

Everything is sent as a POST to a single endpoint (usually \`/graphql\`) with \`{ "query", "variables", "operationName" }\`.`,
      code: `query Dashboard($userId: ID!, $withPosts: Boolean = true, $term: String!) {
  me {
    ...UserCard
  }
  author: node(id: $userId) {
    __typename
    ... on User {
      ...UserCard
      recent: posts(first: 3) @include(if: $withPosts) {
        totalCount
        edges { node { id title publishedAt } }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
  search(term: $term) {
    __typename
    ... on User { name }
    ... on Post { title author { name } }
  }
}

fragment UserCard on User {
  id
  name
  role
}

# Variables (sent as JSON alongside the query):
# { "userId": "VXNlcjo0Mg==", "term": "graphql" }`,
      codeLabel: 'Variables, fragments, aliases and inline fragments',
      keyPoints: [
        'Always pass dynamic values as variables, never by string concatenation.',
        'Fragments keep selections DRY and map nicely to UI components.',
        'Aliases let you request the same field with different arguments.',
        'Use inline fragments and `__typename` with unions and interfaces.',
      ],
    },
    {
      title: 'Resolvers, Mutations & Context',
      after: 'Queries, Variables, Fragments & Aliases',
      content: `A **resolver** is a function per field: \`(parent, args, context, info) => value\`. Fields without a resolver return \`parent[fieldName]\`.

| Argument | Contains |
|---|---|
| \`parent\` | the object returned by the parent field's resolver |
| \`args\` | the field's arguments (already validated and coerced) |
| \`context\` | per-request data: current user, DB, loaders |
| \`info\` | AST and schema details (rarely needed) |

### Mutations

Mutations are fields on \`Mutation\` that change data and return the changed object so clients can update their cache. Top-level mutation fields run **sequentially**; query fields may run in parallel.

### Errors

Throwing in a resolver puts an entry in \`errors[]\` and sets that field to \`null\` — the rest of the response still succeeds. Add an \`extensions.code\` (e.g. \`UNAUTHENTICATED\`, \`BAD_USER_INPUT\`) so clients can react.`,
      code: `import { buildSchema, graphql, GraphQLError } from "graphql";

const schema = buildSchema(\`
  type Todo { id: ID!, title: String!, done: Boolean!, owner: String! }
  input NewTodo { title: String! }
  type Query { todos(done: Boolean): [Todo!]! }
  type Mutation { addTodo(input: NewTodo!): Todo!, toggle(id: ID!): Todo! }
\`);

const db = { todos: [{ id: "1", title: "Learn GraphQL", done: false, owner: "ada" }] };

const root = {
  todos: ({ done }, ctx) =>
    db.todos.filter((t) => t.owner === ctx.user && (done === undefined || t.done === done)),
  addTodo: ({ input }, ctx) => {
    if (!ctx.user) throw new GraphQLError("Login required", { extensions: { code: "UNAUTHENTICATED" } });
    if (input.title.trim().length < 3)
      throw new GraphQLError("Title too short", { extensions: { code: "BAD_USER_INPUT", field: "title" } });
    const todo = { id: String(db.todos.length + 1), title: input.title, done: false, owner: ctx.user };
    db.todos.push(todo);
    return todo;
  },
  toggle: ({ id }, ctx) => {
    const todo = db.todos.find((t) => t.id === id && t.owner === ctx.user);
    if (!todo) throw new GraphQLError("Not found", { extensions: { code: "NOT_FOUND" } });
    todo.done = !todo.done;
    return todo;
  },
};

const run = (source, variableValues, user) =>
  graphql({ schema, source, rootValue: root, variableValues, contextValue: { user } })
    .then((r) => console.log(JSON.stringify(r)));

const ADD = "mutation ($t: String!) { addTodo(input: { title: $t }) { id title done } }";
await run(ADD, { t: "Write resolvers" }, "ada");
await run(ADD, { t: "x" }, "ada");
await run(ADD, { t: "Anonymous" }, null);
await run('mutation { toggle(id: "2") { id done } }', {}, "ada");
await run("{ todos(done: false) { title } }", {}, "ada");`,
      codeLabel: 'Mutations with context-based auth and typed errors',
      codeLanguage: 'javascript',
      keyPoints: [
        'Resolvers receive `(parent, args, context, info)`; context carries the user and data sources.',
        'Mutations return the modified object so clients can refresh their cache.',
        'Errors are partial: a failing field becomes `null` and is listed in `errors`.',
        'Add `extensions.code` to errors so clients can handle them programmatically.',
      ],
    },
    {
      title: 'Solving N+1 with DataLoader',
      after: 'Resolvers, Mutations & Context',
      content: `Naively, \`{ posts { author { name } } }\` runs **1** query for posts and **N** queries for authors — the **N+1 problem**.

**DataLoader** batches all \`load(id)\` calls made in the same tick into one \`batchFn(ids)\` call and caches results for the rest of the request.

### Rules

- Create **new loaders per request** (in the context) — the cache must not leak between users.
- The batch function must return results **in the same order** as the keys, with \`null\`/\`Error\` for missing ones.
- Use one loader per access pattern (\`userById\`, \`postsByAuthorId\`).

Other performance tools: query **complexity/depth limits**, **persisted queries**, and response caching with \`@cacheControl\`.`,
      code: `import { buildSchema, graphql } from "graphql";
import DataLoader from "dataloader";

const USERS = { u1: { id: "u1", name: "Ada" }, u2: { id: "u2", name: "Linus" } };
const POSTS = [
  { id: "p1", title: "Intro", authorId: "u1" },
  { id: "p2", title: "Kernels", authorId: "u2" },
  { id: "p3", title: "Engines", authorId: "u1" },
];

let dbCalls = 0;
async function getUsersByIds(ids) {                  // e.g. SELECT * FROM users WHERE id IN (...)
  dbCalls++;
  console.log("  SQL: users IN", ids);
  return ids.map((id) => USERS[id] ?? null);          // same order as keys
}

const schema = buildSchema(\`
  type User { id: ID!, name: String! }
  type Post { id: ID!, title: String!, author: User }
  type Query { posts: [Post!]! }
\`);

class PostType {
  constructor(row) { Object.assign(this, row); }
  author(args, ctx) { return ctx.loaders.user.load(this.authorId); }
}

async function execute(useLoader) {
  dbCalls = 0;
  const loaders = {
    user: useLoader
      ? new DataLoader(getUsersByIds)                                   // batched + cached
      : { load: async (id) => (await getUsersByIds([id]))[0] },         // naive: one call per post
  };
  const res = await graphql({
    schema,
    source: "{ posts { title author { name } } }",
    rootValue: { posts: () => POSTS.map((p) => new PostType(p)) },
    contextValue: { loaders },                                          // fresh loaders per request
  });
  console.log(useLoader ? "with DataLoader:" : "naive:", dbCalls, "DB calls",
              JSON.stringify(res.data.posts.map((p) => p.author.name)));
}

await execute(false);
await execute(true);`,
      codeLabel: 'Naive vs batched author lookups',
      codeLanguage: 'javascript',
      keyPoints: [
        'Nested resolvers easily cause N+1 queries.',
        'DataLoader batches loads from the same tick into one query.',
        'Create loaders per request so caches never leak between users.',
        'Batch functions must return results in key order.',
      ],
    },
    {
      title: 'GraphQL Security & Production Concerns',
      after: 'Solving N+1 with DataLoader',
      content: `One flexible endpoint means clients can craft **very expensive** queries. Protect the server:

| Risk | Mitigation |
|---|---|
| Deeply nested queries (\`friends { friends { friends ... } }\`) | **depth limit** (e.g. 7) |
| Huge fan-out (\`first: 100000\`) | cap pagination args, **cost/complexity analysis** |
| Schema discovery by attackers | disable **introspection** in production (or restrict it) |
| Arbitrary queries from the internet | **persisted / trusted documents** (allow-list of query hashes) |
| Batching attacks (many ops per request) | limit operations per request |
| Field-level data leaks | **authorise in resolvers or the business layer**, not just at the gateway |
| Error details | mask internal errors; return safe messages |

Monitor per-operation latency (operation names make this possible) and add timeouts to resolvers that call other services.`,
      code: `import { buildSchema, parse, validate, specifiedRules, GraphQLError, Kind } from "graphql";

const schema = buildSchema(\`
  type User { name: String!, friends(first: Int = 10): [User!]! }
  type Query { me: User }
\`);

// Custom validation rule: reject queries nested deeper than maxDepth
const depthLimit = (maxDepth) => (context) => {
  const check = (node, depth) => {
    if (depth > maxDepth) {
      context.reportError(new GraphQLError(\`Query depth \${depth} exceeds limit \${maxDepth}\`, { nodes: [node] }));
      return;
    }
    for (const sel of node.selectionSet?.selections ?? []) {
      if (sel.kind === Kind.FIELD) check(sel, depth + 1);
    }
  };
  return {
    OperationDefinition(op) { check(op, 0); },
  };
};

// Custom rule: cap list sizes requested via the "first" argument
const maxPageSize = (limit) => (context) => ({
  Argument(arg) {
    if (arg.name.value === "first" && arg.value.kind === Kind.INT && Number(arg.value.value) > limit) {
      context.reportError(new GraphQLError(\`"first" may not exceed \${limit}\`, { nodes: [arg] }));
    }
  },
});

const rules = [...specifiedRules, depthLimit(4), maxPageSize(50)];
for (const q of [
  "{ me { name friends { name } } }",
  "{ me { friends { friends { friends { friends { name } } } } } }",
  "{ me { friends(first: 100000) { name } } }",
]) {
  const errors = validate(schema, parse(q), rules);
  console.log(errors.length ? "REJECT " + errors.map((e) => e.message).join("; ") : "ACCEPT", "<-", q);
}`,
      codeLabel: 'Depth and page-size limits as validation rules',
      codeLanguage: 'javascript',
      keyPoints: [
        'Limit query depth, page sizes and overall cost before execution.',
        'Prefer persisted (allow-listed) queries for first-party clients.',
        'Disable or restrict introspection in production.',
        'Enforce authorisation per field or in the business layer.',
      ],
    },
    {
      title: 'Protocol Buffers Language Guide',
      after: 'gRPC Example (.proto)',
      content: `gRPC contracts are written in **proto3**. Each field has a **number** that identifies it on the wire — names can change, numbers must not.

| Feature | Syntax |
|---|---|
| Scalars | \`int32\`, \`int64\`, \`uint32\`, \`double\`, \`float\`, \`bool\`, \`string\`, \`bytes\` |
| Repeated (list) | \`repeated string tags = 4;\` |
| Map | \`map<string, int32> stock = 5;\` |
| Enum | first value must be \`0\` (\`..._UNSPECIFIED\`) |
| Oneof | at most one field set: \`oneof payment { Card card = 6; string iban = 7; }\` |
| Optional presence | \`optional string nickname = 8;\` |
| Well-known types | \`google.protobuf.Timestamp\`, \`Duration\`, \`Empty\`, \`FieldMask\`, wrappers |
| Nested / imported messages | \`import "common/money.proto";\` |

### Backward-compatible evolution

- ✅ Add new fields with **new numbers**; old clients ignore them.
- ✅ Remove fields only by marking them \`reserved\` (number **and** name).
- ❌ Never reuse or renumber a field, or change its type incompatibly.
- Field numbers 1–15 take one byte — use them for frequent fields.`,
      code: `syntax = "proto3";

package shop.v1;

import "google/protobuf/timestamp.proto";
import "google/protobuf/field_mask.proto";

option java_multiple_files = true;
option csharp_namespace = "Shop.V1";
option go_package = "example.com/shop/gen/shopv1";

enum OrderStatus {
  ORDER_STATUS_UNSPECIFIED = 0;
  ORDER_STATUS_PENDING = 1;
  ORDER_STATUS_PAID = 2;
  ORDER_STATUS_SHIPPED = 3;
}

message Money {
  string currency_code = 1;   // ISO 4217, e.g. "EUR"
  int64 units = 2;            // whole units
  int32 nanos = 3;            // fractional part, avoids floating point
}

message LineItem {
  string sku = 1;
  int32 quantity = 2;
  Money unit_price = 3;
}

message Order {
  reserved 4;                         // removed field number…
  reserved "coupon_code";             // …and name, never reuse them
  string id = 1;
  string customer_id = 2;
  repeated LineItem items = 3;
  OrderStatus status = 5;
  map<string, string> labels = 6;
  google.protobuf.Timestamp created_at = 7;
  oneof payment {
    string card_token = 8;
    string iban = 9;
  }
  optional string note = 10;
}

message GetOrderRequest { string id = 1; }
message ListOrdersRequest { string customer_id = 1; int32 page_size = 2; string page_token = 3; }
message ListOrdersResponse { repeated Order orders = 1; string next_page_token = 2; }
message UpdateOrderRequest { Order order = 1; google.protobuf.FieldMask update_mask = 2; }

service OrderService {
  rpc GetOrder(GetOrderRequest) returns (Order);
  rpc ListOrders(ListOrdersRequest) returns (ListOrdersResponse);
  rpc UpdateOrder(UpdateOrderRequest) returns (Order);
  rpc WatchOrders(ListOrdersRequest) returns (stream Order);
}`,
      codeLabel: 'shop/v1/orders.proto — enums, oneof, maps, reserved fields',
      codeLanguage: 'protobuf',
      keyPoints: [
        'Field numbers are the wire identity — never change or reuse them.',
        'Reserve removed field numbers and names.',
        'Enums start with a zero `_UNSPECIFIED` value.',
        'Use well-known types (Timestamp, FieldMask) and integer money, not floats.',
      ],
    },
    {
      title: 'gRPC Streaming: the Four RPC Types',
      after: 'Protocol Buffers Language Guide',
      content: `gRPC runs over **HTTP/2**, so a single call can carry a **stream** of messages in either direction.

| Type | proto | Use case |
|---|---|---|
| Unary | \`rpc Get(Req) returns (Res)\` | classic request/response |
| Server streaming | \`returns (stream Res)\` | live feeds, large result sets, progress |
| Client streaming | \`rpc Upload(stream Chunk) returns (Summary)\` | uploads, batching telemetry |
| Bidirectional | \`(stream Req) returns (stream Res)\` | chat, real-time collaboration |

The example below runs a Node server and client in one file using \`@grpc/grpc-js\` and \`@grpc/proto-loader\` (dynamic loading — no code generation needed). In typed languages you generate stubs with \`protoc\` / \`buf generate\` instead.`,
      code: `import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Normally this lives in proto/stats.proto
const PROTO = join(tmpdir(), "stats.proto");
writeFileSync(PROTO, \`
syntax = "proto3";
package stats;
message Number { double value = 1; }
message Range  { int32 from = 1; int32 to = 2; }
message Summary { int32 count = 1; double sum = 2; double mean = 3; }
service Stats {
  rpc Square (Number) returns (Number);                 // unary
  rpc Count (Range) returns (stream Number);            // server streaming
  rpc Summarize (stream Number) returns (Summary);      // client streaming
  rpc RunningTotal (stream Number) returns (stream Number); // bidirectional
}\`);

const { stats } = grpc.loadPackageDefinition(protoLoader.loadSync(PROTO));

const server = new grpc.Server();
server.addService(stats.Stats.service, {
  Square: (call, cb) => cb(null, { value: call.request.value ** 2 }),
  Count: (call) => {
    for (let i = call.request.from; i <= call.request.to; i++) call.write({ value: i });
    call.end();
  },
  Summarize: (call, cb) => {
    let count = 0, sum = 0;
    call.on("data", (n) => { count++; sum += n.value; });
    call.on("end", () => cb(null, { count, sum, mean: count ? sum / count : 0 }));
  },
  RunningTotal: (call) => {
    let total = 0;
    call.on("data", (n) => call.write({ value: (total += n.value) }));
    call.on("end", () => call.end());
  },
});

server.bindAsync("127.0.0.1:0", grpc.ServerCredentials.createInsecure(), async (err, port) => {
  if (err) throw err;
  const client = new stats.Stats(\`127.0.0.1:\${port}\`, grpc.credentials.createInsecure());

  // 1. Unary
  const sq = await new Promise((res, rej) => client.Square({ value: 12 }, (e, r) => (e ? rej(e) : res(r))));
  console.log("unary:", sq.value);

  // 2. Server streaming
  const counted = [];
  for await (const n of client.Count({ from: 1, to: 5 })) counted.push(n.value);
  console.log("server stream:", counted);

  // 3. Client streaming
  const summary = await new Promise((res, rej) => {
    const call = client.Summarize((e, r) => (e ? rej(e) : res(r)));
    [4, 8, 15, 16, 23, 42].forEach((value) => call.write({ value }));
    call.end();
  });
  console.log("client stream:", summary);

  // 4. Bidirectional
  const bidi = client.RunningTotal();
  const totals = [];
  bidi.on("data", (n) => totals.push(n.value));
  bidi.on("end", () => {
    console.log("bidi stream:", totals);
    client.close();
    server.forceShutdown();
  });
  [10, 20, 30].forEach((value) => bidi.write({ value }));
  bidi.end();
});`,
      codeLabel: 'stats.mjs — unary, server, client and bidi streaming in Node',
      codeLanguage: 'javascript',
      keyPoints: [
        'HTTP/2 lets one gRPC call stream messages in either or both directions.',
        'Server streaming suits feeds and large results; client streaming suits uploads.',
        'Bidirectional streams are independent — reads and writes interleave freely.',
        'Use dynamic loading for quick experiments and code generation for production.',
      ],
    },
    {
      title: 'gRPC Deadlines, Status Codes & Metadata',
      after: 'gRPC Streaming: the Four RPC Types',
      content: `### Deadlines

Every call should have a **deadline**. Without one, a slow dependency can hold resources forever. Deadlines propagate: a server calling another service should pass on the remaining time.

### Status codes (not HTTP codes)

| Code | Meaning |
|---|---|
| \`OK\` (0) | success |
| \`INVALID_ARGUMENT\` (3) | bad input — don't retry |
| \`DEADLINE_EXCEEDED\` (4) | took too long |
| \`NOT_FOUND\` (5) / \`ALREADY_EXISTS\` (6) | resource state |
| \`PERMISSION_DENIED\` (7) / \`UNAUTHENTICATED\` (16) | auth |
| \`RESOURCE_EXHAUSTED\` (8) | rate limited / quota |
| \`UNAVAILABLE\` (14) | transient — safe to retry with backoff |
| \`INTERNAL\` (13) | server bug |

### Metadata

Key/value headers sent with a call (\`authorization\`, \`x-request-id\`). Binary keys end in \`-bin\`. Servers read \`call.metadata\` and can send initial/trailing metadata back. **Interceptors** apply cross-cutting logic (auth, logging, retries) to every call.`,
      code: `import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PROTO = join(tmpdir(), "users.proto");
writeFileSync(PROTO, \`
syntax = "proto3";
package users;
message GetUserRequest { string id = 1; }
message User { string id = 1; string name = 2; }
service Users { rpc GetUser (GetUserRequest) returns (User); }\`);
const { users } = grpc.loadPackageDefinition(protoLoader.loadSync(PROTO));

const DB = { "42": { id: "42", name: "Ada" } };
const server = new grpc.Server();
server.addService(users.Users.service, {
  GetUser(call, callback) {
    const token = call.metadata.get("authorization")[0];
    if (token !== "Bearer secret") {
      return callback({ code: grpc.status.UNAUTHENTICATED, details: "missing or bad token" });
    }
    const { id } = call.request;
    if (!/^\\d+$/.test(id)) return callback({ code: grpc.status.INVALID_ARGUMENT, details: "id must be numeric" });
    if (id === "999") return setTimeout(() => callback(null, { id, name: "slow" }), 500);  // simulate slowness
    const user = DB[id];
    if (!user) return callback({ code: grpc.status.NOT_FOUND, details: \`user \${id} not found\` });
    const trailer = new grpc.Metadata();
    trailer.set("x-served-by", "users-1");
    callback(null, user, trailer);
  },
});

server.bindAsync("127.0.0.1:0", grpc.ServerCredentials.createInsecure(), async (err, port) => {
  const client = new users.Users(\`127.0.0.1:\${port}\`, grpc.credentials.createInsecure());

  const getUser = (id, { token = "Bearer secret", timeoutMs = 200 } = {}) =>
    new Promise((resolve) => {
      const md = new grpc.Metadata();
      md.set("authorization", token);
      md.set("x-request-id", \`req-\${id}\`);
      const deadline = new Date(Date.now() + timeoutMs);              // always set a deadline
      client.GetUser({ id }, md, { deadline }, (e, user) =>
        resolve(e ? \`\${grpc.status[e.code]}: \${e.details}\` : \`OK: \${user.name}\`));
    });

  console.log(await getUser("42"));
  console.log(await getUser("7"));
  console.log(await getUser("abc"));
  console.log(await getUser("42", { token: "nope" }));
  console.log(await getUser("999"));                                  // deadline hits first
  client.close();
  server.forceShutdown();
});`,
      codeLabel: 'Deadlines, status codes and metadata',
      codeLanguage: 'javascript',
      keyPoints: [
        'Set a deadline on every call and propagate it to downstream calls.',
        'Use the precise gRPC status code; clients decide retries from it.',
        'Retry only transient codes such as `UNAVAILABLE`, with backoff.',
        'Carry auth tokens and request IDs in metadata; use interceptors for cross-cutting logic.',
      ],
    },
    {
      title: 'gRPC Tooling, gRPC-Web & Gateways',
      after: 'gRPC Deadlines, Status Codes & Metadata',
      content: `| Tool | Purpose |
|---|---|
| **buf** | lint protos, detect breaking changes, generate code (\`buf generate\`) |
| **protoc** + plugins | classic code generator for every language |
| **grpcurl** / **grpcui** | curl-like CLI / web UI for calling services (needs reflection or protos) |
| **Server reflection** | lets tools discover services at runtime (enable in dev) |
| **Health checking** | standard \`grpc.health.v1.Health\` service for load balancers/Kubernetes |
| **gRPC-Web** + Envoy | call gRPC from browsers (which can't speak raw HTTP/2 gRPC) |
| **grpc-gateway** / JSON transcoding | expose the same service as REST/JSON (\`google.api.http\` annotations) |
| **Connect** (connectrpc.com) | gRPC-compatible protocol that also works over HTTP/1.1 and from browsers |

In **Kubernetes**, HTTP/2 keeps long-lived connections, so L4 load balancing pins clients to one pod — use client-side load balancing, a service mesh, or an L7 proxy.`,
      code: `# Lint and catch breaking changes against main before merging
buf lint
buf breaking --against '.git#branch=main'
buf generate                                   # uses buf.gen.yaml plugins

# Call services from the terminal (server reflection enabled)
grpcurl -plaintext localhost:50051 list
grpcurl -plaintext localhost:50051 describe shop.v1.OrderService
grpcurl -plaintext -H 'authorization: Bearer dev-token' \\
  -d '{"id": "ORD-1001"}' localhost:50051 shop.v1.OrderService/GetOrder

# Standard health check (used by Kubernetes grpc probes)
grpcurl -plaintext -d '{"service": ""}' localhost:50051 grpc.health.v1.Health/Check

# buf.gen.yaml — generate TypeScript and Go stubs
cat > buf.gen.yaml <<'EOF'
version: v2
plugins:
  - remote: buf.build/bufbuild/es
    out: gen/ts
  - remote: buf.build/protocolbuffers/go
    out: gen/go
    opt: paths=source_relative
EOF`,
      codeLabel: 'buf, grpcurl and code generation',
      codeLanguage: 'bash',
      keyPoints: [
        'Use buf to lint protos and block breaking changes in CI.',
        'grpcurl is the curl of gRPC — enable reflection in development.',
        'Browsers need gRPC-Web, Connect or a REST gateway.',
        'Long-lived HTTP/2 connections need L7 or client-side load balancing.',
      ],
    },
  ],
};

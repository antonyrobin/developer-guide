export const redisCourse = {
    id: 'redis', title: 'Redis', description: 'Ultra-fast in-memory data store used for caching, session management, real-time leaderboards, rate limiting, and pub/sub messaging — with support for persistence and clustering.',
    officialDocs: 'https://redis.io/docs/', tutorialLink: 'https://redis.io/learn', exerciseLink: null,
    sections: [
      { title: 'What is Redis', image: '/images/redis/redis-overview.svg', content: `**Redis** (Remote Dictionary Server) is an open-source, in-memory data structure store. It can be used as a **database**, **cache**, **message broker**, and **streaming engine**.

### Why Redis?

| Factor | Benefit |
|---|---|
| **Speed** | Sub-millisecond latency — everything is in memory |
| **Data Structures** | Strings, Hashes, Lists, Sets, Sorted Sets, Streams |
| **Persistence** | Optional RDB snapshots and AOF append logs |
| **Pub/Sub** | Real-time messaging between services |
| **Atomic Operations** | INCR, DECR, SETNX — thread-safe by design |
| **TTL** | Built-in key expiration for caching |
| **Cluster** | Horizontal scaling across multiple nodes |

### Common Use Cases

| Use Case | Redis Feature | Why Not a Database? |
|---|---|---|
| **API Response Caching** | GET/SET with TTL | 1000x faster than DB query |
| **Session Storage** | Hash with TTL | Shared across app instances |
| **Rate Limiting** | INCR + EXPIRE | Atomic counters at scale |
| **Leaderboards** | Sorted Sets (ZADD/ZRANGE) | Real-time ranking |
| **Job Queues** | Lists (LPUSH/BRPOP) | FIFO with blocking |
| **Real-Time Notifications** | Pub/Sub | Instant message fan-out |
| **Distributed Locks** | SET NX EX | Prevent race conditions |

### Redis vs Memcached vs Database

| Feature | Redis | Memcached | PostgreSQL |
|---|---|---|---|
| **Speed** | < 1ms | < 1ms | 1-100ms |
| **Data Types** | Rich structures | Key-value only | Tables |
| **Persistence** | ✅ RDB/AOF | ❌ | ✅ |
| **Pub/Sub** | ✅ | ❌ | ✅ (LISTEN/NOTIFY) |
| **Clustering** | ✅ | ❌ | ❌ (replication only) |`, keyPoints: ['Redis delivers sub-millisecond latency — everything runs in memory.', 'Supports rich data structures beyond simple key-value.', 'Optional persistence via RDB snapshots and AOF logs.', 'Built-in TTL for automatic cache expiration.', 'Used for caching, sessions, rate limiting, leaderboards, and more.'] },

      { title: 'Installation & Setup', image: '/images/redis/redis-data-types.svg', content: `### Local Installation

| Platform | Method |
|---|---|
| **Docker (Recommended)** | \`docker run -d -p 6379:6379 --name redis redis:7-alpine\` |
| **Windows** | Use Docker or WSL2 (native Redis not available on Windows) |
| **macOS** | \`brew install redis && brew services start redis\` |
| **Linux** | \`sudo apt install redis-server && sudo systemctl start redis\` |

### Docker Compose

\`\`\`yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: >
      redis-server
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
      --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      retries: 5

volumes:
  redis_data:
\`\`\`

### Verify Installation

\`\`\`powershell
# Connect to Redis CLI
redis-cli

# Test connectivity
127.0.0.1:6379> PING
PONG

# Basic operations
127.0.0.1:6379> SET greeting "Hello Redis"
OK
127.0.0.1:6379> GET greeting
"Hello Redis"
127.0.0.1:6379> SET session:123 "user-data" EX 3600
OK
127.0.0.1:6379> TTL session:123
(integer) 3600
\`\`\`

### Configuration (redis.conf)

\`\`\`text
# Memory
maxmemory 512mb
maxmemory-policy allkeys-lru

# Persistence
appendonly yes
appendfsync everysec
save 900 1       # RDB snapshot: after 900s if 1+ keys changed
save 300 10      # After 300s if 10+ keys changed

# Security
requirepass YourStrongPassword
bind 127.0.0.1
protected-mode yes
\`\`\`

### Eviction Policies

| Policy | Behavior |
|---|---|
| **allkeys-lru** | Evict least recently used keys (recommended for caching) |
| **volatile-lru** | Evict LRU keys that have TTL set |
| **allkeys-random** | Evict random keys |
| **noeviction** | Return error when memory is full |`, keyPoints: ['Docker is the easiest setup — Redis is not natively available on Windows.', 'Use allkeys-lru eviction policy for caching use cases.', 'appendonly yes enables AOF persistence for durability.', 'Always set maxmemory to prevent Redis from consuming all RAM.', 'redis-cli PING verifies connectivity instantly.'] },

      { title: 'Language Integration', content: `### .NET (StackExchange.Redis)

\`\`\`csharp
// Install: dotnet add package StackExchange.Redis
// Or for IDistributedCache: dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis

// Program.cs — Register Redis
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration
        .GetConnectionString("Redis");  // "localhost:6379"
});

// Usage in Service (IDistributedCache)
public class ProductService(IDistributedCache cache, IProductRepository repo)
{
    public async Task<Product?> GetByIdAsync(int id)
    {
        var cacheKey = $"product:{id}";
        var cached = await cache.GetStringAsync(cacheKey);

        if (cached != null)
            return JsonSerializer.Deserialize<Product>(cached);

        var product = await repo.GetByIdAsync(id);
        if (product != null)
        {
            await cache.SetStringAsync(cacheKey,
                JsonSerializer.Serialize(product),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
                });
        }
        return product;
    }

    public async Task InvalidateCache(int id)
    {
        await cache.RemoveAsync($"product:{id}");
    }
}
\`\`\`

### Node.js (ioredis)

\`\`\`javascript
// npm install ioredis
import Redis from 'ioredis';

const redis = new Redis({
    host: 'localhost',
    port: 6379,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
});

// Caching pattern
async function getProduct(id) {
    const cached = await redis.get(\`product:\${id}\`);
    if (cached) return JSON.parse(cached);

    const product = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    await redis.setex(\`product:\${id}\`, 1800, JSON.stringify(product));
    return product;
}

// Rate limiting
async function rateLimitMiddleware(req, res, next) {
    const key = \`rate:\${req.ip}\`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60); // 1 minute window
    if (count > 100) return res.status(429).json({ error: 'Too many requests' });
    next();
}
\`\`\`

### Python (redis-py)

\`\`\`python
# pip install redis
import redis, json

r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Caching
def get_product(product_id):
    cached = r.get(f"product:{product_id}")
    if cached:
        return json.loads(cached)

    product = db.query("SELECT * FROM products WHERE id = %s", product_id)
    r.setex(f"product:{product_id}", 1800, json.dumps(product))
    return product

# Pub/Sub
pubsub = r.pubsub()
pubsub.subscribe('notifications')
for message in pubsub.listen():
    if message['type'] == 'message':
        print(f"Received: {message['data']}")
\`\`\`

### Java (Jedis / Spring Data Redis)

\`\`\`java
// build.gradle: implementation 'org.springframework.boot:spring-boot-starter-data-redis'

@Configuration
@EnableCaching
public class RedisConfig {
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        return RedisCacheManager.builder(factory)
            .cacheDefaults(RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30)))
            .build();
    }
}

@Service
public class ProductService {
    @Cacheable(value = "products", key = "#id")
    public Product getById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @CacheEvict(value = "products", key = "#id")
    public void update(Long id, Product product) {
        productRepository.save(product);
    }
}
\`\`\``, keyPoints: ['.NET uses StackExchange.Redis or IDistributedCache abstraction.', 'Node.js uses ioredis — supports pipelining and clustering.', 'Python uses redis-py with simple get/set and pub/sub APIs.', 'Java uses Spring Data Redis with @Cacheable annotation.', 'All languages follow: connect → get/set → expire/TTL → invalidate.'] },

      { title: 'Cloud Hosting', content: `### Cloud Options

| Provider | Service | Free Tier | Features |
|---|---|---|---|
| **Redis Cloud** | redis.io/cloud | 30MB free | Full Redis Stack, HA |
| **AWS ElastiCache** | aws.amazon.com | 750hrs/month (t2.micro) | Managed, VPC-integrated |
| **Azure Cache** | azure.microsoft.com | No free tier | Managed, geo-replication |
| **GCP Memorystore** | cloud.google.com | No free tier | Managed, VPC-integrated |
| **Upstash** | upstash.com | 10K commands/day | Serverless, REST API |
| **Kubernetes** | Self-hosted | Infrastructure cost | Full control |

### Redis Cloud Setup

1. Sign up at [redis.io/cloud](https://redis.io/cloud)
2. Create a free database (30MB)
3. Get connection details:

\`\`\`text
Host: redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com
Port: 12345
Password: your-password
\`\`\`

### AWS ElastiCache

\`\`\`hcl
# Terraform
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "app-cache"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}
\`\`\`

### Kubernetes Deployment

\`\`\`yaml
# Install via Helm
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis \\
  --set auth.password=secret \\
  --set master.persistence.size=5Gi \\
  --set replica.replicaCount=2
\`\`\`

### Production Architecture

\`\`\`text
Primary/Replica (High Availability)
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Primary     │────▶│  Replica 1   │────▶│  Replica 2   │
│  Read/Write  │     │  Read-only   │     │  Read-only   │
└─────────────┘     └──────────────┘     └──────────────┘
       │
       ▼
┌─────────────┐
│  Sentinel    │  Automatic failover monitoring
└─────────────┘
\`\`\``, keyPoints: ['Redis Cloud offers a free 30MB tier for development.', 'AWS ElastiCache provides managed Redis with VPC integration.', 'Upstash offers serverless Redis with a REST API — great for edge.', 'Use Helm charts for Kubernetes deployment with replicas.', 'Production requires Primary/Replica setup with Sentinel for HA.'] },

      { title: 'Advanced Patterns', content: `### Cache-Aside Pattern (Most Common)

\`\`\`text
1. App checks Redis cache
2. Cache HIT → return cached data
3. Cache MISS → query database → store in Redis → return data
4. On data UPDATE → invalidate Redis key
\`\`\`

### Distributed Locking

\`\`\`javascript
// Prevent race conditions with Redis locks
async function acquireLock(key, ttlSeconds = 10) {
    const result = await redis.set(
        \`lock:\${key}\`, 'locked', 'EX', ttlSeconds, 'NX'
    );
    return result === 'OK';
}

async function releaseLock(key) {
    await redis.del(\`lock:\${key}\`);
}

// Usage
if (await acquireLock('process-payment:123')) {
    try {
        await processPayment(123);
    } finally {
        await releaseLock('process-payment:123');
    }
}
\`\`\`

### Pub/Sub for Real-Time Events

\`\`\`javascript
// Publisher
await redis.publish('order-events', JSON.stringify({
    type: 'order.created',
    orderId: 123,
    amount: 99.99,
}));

// Subscriber
const sub = redis.duplicate();
await sub.subscribe('order-events');
sub.on('message', (channel, message) => {
    const event = JSON.parse(message);
    console.log('Event:', event.type, event.orderId);
});
\`\`\`

### Session Storage

\`\`\`javascript
// Express.js session with Redis
import session from 'express-session';
import RedisStore from 'connect-redis';

app.use(session({
    store: new RedisStore({ client: redis }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, maxAge: 86400000 }, // 24 hours
}));
\`\`\`

### Leaderboard with Sorted Sets

\`\`\`powershell
# Redis CLI
ZADD leaderboard 1500 "player:1"
ZADD leaderboard 2300 "player:2"
ZADD leaderboard 900  "player:3"

# Top 10 players (highest first)
ZREVRANGE leaderboard 0 9 WITHSCORES

# Player rank (0-indexed)
ZREVRANK leaderboard "player:2"
\`\`\``, keyPoints: ['Cache-Aside is the most common caching pattern.', 'Distributed locks prevent race conditions in multi-instance apps.', 'Pub/Sub enables real-time event broadcasting between services.', 'Redis sessions are shared across all app instances automatically.', 'Sorted Sets power real-time leaderboards with O(log N) operations.'] },

      { title: 'Best Practices', content: `### ✅ Do's

| # | Practice | Reason |
|---|---|---|
| 1 | **Set maxmemory** | Prevent Redis from using all available RAM |
| 2 | **Use allkeys-lru** | Automatically evict old data when memory is full |
| 3 | **Set TTL on all cache keys** | Prevent stale data and memory leaks |
| 4 | **Use key namespacing** | \`user:123:session\`, \`product:456:details\` |
| 5 | **Enable persistence** | RDB + AOF for data durability |
| 6 | **Use connection pooling** | Reduce connection overhead |
| 7 | **Monitor with INFO** | Track memory, clients, and hit rate |

### ❌ Don'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Store large objects** | Keep values under 100KB — use references |
| 2 | **Use KEYS in production** | Use SCAN for iterating — KEYS blocks |
| 3 | **Skip authentication** | Always set \`requirepass\` in production |
| 4 | **Expose to internet** | Bind to localhost or use VPC |
| 5 | **Cache everything** | Only cache frequently-read, rarely-changed data |
| 6 | **Forget cache invalidation** | Always invalidate on data changes |

### Advantages & Disadvantages

| Advantages | Disadvantages |
|---|---|
| Sub-millisecond latency | Data limited by available RAM |
| Rich data structures | Requires operational management |
| Built-in persistence options | Single-threaded (one core only) |
| Pub/Sub and Streams | Not a replacement for a database |
| Active open-source community | Clustering adds complexity |

### Monitoring Commands

\`\`\`powershell
# Server info
redis-cli INFO server

# Memory usage
redis-cli INFO memory

# Cache hit rate
redis-cli INFO stats | findstr "keyspace_hits keyspace_misses"

# Connected clients
redis-cli INFO clients

# Slow queries
redis-cli SLOWLOG GET 10
\`\`\``, keyPoints: ['Always set maxmemory and an eviction policy.', 'Use key namespacing for organized, debuggable data.', 'Never use KEYS in production — use SCAN instead.', 'Set TTL on all cache keys to prevent memory leaks.', 'Monitor cache hit rate — low hit rate means ineffective caching.'] }
    ]
  };

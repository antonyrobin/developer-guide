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

      { title: 'Key Lifecycle & Storage Limit Eviction', image: '/images/redis/redis-lifecycle-eviction.svg', content: `Understanding how keys are born, accessed, expired, and evicted when memory fills up is crucial for building resilient caching and database layers.

### 1. The Redis Key Lifecycle

Every key in Redis traverses a defined lifecycle:

1. **Allocation & Creation**: Keys are initialized via write commands (\`SET\`, \`HSET\`, \`LPUSH\`, \`ZADD\`). Optional TTL can be attached immediately (\`SET key value EX 60\`).
2. **Access & Update**: Read operations (\`GET\`, \`HGET\`) reset LRU/LFU access metadata without changing TTL. Commands like \`INCR\` or \`APPEND\` mutate value in-place.
3. **TTL Countdown**: Redis tracks time-to-live with millisecond precision (\`PTTL\` / \`TTL\`). \`PERSIST\` removes expiration, making the key permanent.
4. **Expiration Execution**:
   - **Passive (Lazy) Expiration**: When a client attempts to read a key whose TTL has expired, Redis detects it, deletes the key immediately, and returns \`nil\`.
   - **Active Expiration**: Redis runs a background cycle 10 times per second (10 Hz). It samples 20 random keys with TTL; if more than 25% are expired, it repeats the process to ensure expired keys don't accumulate in memory.
5. **Memory Reclamation**: The underlying allocator (\`jemalloc\`) reclaims memory back to the OS or Redis memory pool.

---

### 2. What Happens When \`maxmemory\` Limit is Reached?

When Redis memory usage reaches the configured \`maxmemory\` limit:

- **Read commands** (\`GET\`, \`MGET\`, \`ZRANGE\`, \`INFO\`) **continue to function normally**.
- **Write commands** (\`SET\`, \`LPUSH\`, \`INCR\`, \`HSET\`) trigger the configured **\`maxmemory-policy\`**.

If the eviction policy cannot free enough space (or if \`noeviction\` is active), Redis **rejects all write commands** with the following error:
\`\`\`text
(error) OOM command not allowed when used memory > 'maxmemory'.
\`\`\`

---

### 3. Complete Eviction Policy Comparison

| Eviction Policy | Target Keys | Eviction Algorithm | Best Use Case |
|---|---|---|---|
| **\`noeviction\`** *(Default)* | None | No eviction; throws \`OOM\` error on writes | When Redis is used as a primary persistent database |
| **\`allkeys-lru\`** | All keys | Least Recently Used (time since last access) | General API & database response caching |
| **\`volatile-lru\`** | Keys with TTL | Least Recently Used among expiring keys | Mixed usage: cache keys with TTL + permanent metadata |
| **\`allkeys-lfu\`** | All keys | Least Frequently Used (access frequency count) | When access patterns follow power-law / popularity |
| **\`volatile-lfu\`** | Keys with TTL | Least Frequently Used among expiring keys | Mixed data with frequency-based cache eviction |
| **\`allkeys-random\`** | All keys | Randomly selects keys to delete | Uniform random cache access workloads |
| **\`volatile-random\`** | Keys with TTL | Randomly selects keys with TTL set | Random eviction of temporary keys |
| **\`volatile-ttl\`** | Keys with TTL | Shortest remaining time-to-live first | Time-sensitive cache pipelines |

### 4. How Redis Approximates LRU & LFU

Redis does not maintain a full doubly-linked list of every key (which would cost huge memory overhead). Instead, it uses an **approximated sampling algorithm**:
- When eviction triggers, Redis samples **\`maxmemory-samples\`** keys (default: \`5\`).
- It evicts the best candidate among the sample.
- Increasing \`maxmemory-samples 10\` yields nearly true LRU at a slight CPU cost.`, code: `# Inspect current memory usage
redis-cli INFO memory

# Output highlights:
# used_memory: 536870912          # 512 MB in bytes
# used_memory_human: 512.00M
# maxmemory: 536870912
# maxmemory_policy: allkeys-lru
# evicted_keys: 14205             # Total keys evicted since startup

# Dynamically update memory limits at runtime without restart:
127.0.0.1:6379> CONFIG SET maxmemory 1gb
OK
127.0.0.1:6379> CONFIG SET maxmemory-policy allkeys-lru
OK
127.0.0.1:6379> CONFIG SET maxmemory-samples 7
OK

# Check remaining TTL of a key
127.0.0.1:6379> TTL session:usr_9812
(integer) 342   # Seconds remaining (-1 = no TTL, -2 = key does not exist)

# Force eviction sampling diagnostics
127.0.0.1:6379> MEMORY USAGE product:catalog:901
(integer) 4128  # Memory in bytes consumed by key and internal overhead`, codeLabel: 'Redis Memory & Eviction Commands', keyPoints: ['Redis uses dual expiration: lazy on-read + active 10Hz background sampling.', 'Under maxmemory, writes trigger eviction; reads are never blocked.', 'noeviction throws OOM error — allkeys-lru is standard for caching.', 'allkeys-lfu tracks access frequency; volatile-ttl evicts shortest TTL.', 'maxmemory-samples controls accuracy vs CPU balance for LRU/LFU approximation.'] },

      { title: 'Configuration & Production Tuning (`redis.conf`)', content: `Below is a comprehensive production configuration reference organized by functional category.

### 1. Memory & Eviction Settings

| Setting | Default | Recommended Production Value | Description |
|---|---|---|---|
| **\`maxmemory\`** | \`0\` (Unlimited) | \`75%\` of available server RAM | Memory threshold before eviction triggers |
| **\`maxmemory-policy\`** | \`noeviction\` | \`allkeys-lru\` or \`allkeys-lfu\` | Eviction behavior on full memory |
| **\`maxmemory-samples\`** | \`5\` | \`7\` - \`10\` | Sampling size for LRU/LFU estimation |
| **\`active-defrag-enabled\`** | \`no\` | \`yes\` | Online memory defragmentation |

### 2. Persistence Configuration (RDB & AOF)

| Setting | Default | Recommended | Description |
|---|---|---|---|
| **\`save\`** | \`3600 1 300 100\` | \`save 900 1 300 10\` | RDB snapshot intervals (\`seconds changes\`) |
| **\`appendonly\`** | \`no\` | \`yes\` | Enables Append-Only File logging |
| **\`appendfsync\`** | \`everysec\` | \`everysec\` | \`always\` (slowest, zero data loss), \`everysec\` (balanced), \`no\` (OS managed) |
| **\`auto-aof-rewrite-percentage\`**| \`100\` | \`100\` | Rewrites AOF when file doubles in size |

### 3. Security, Network & Connection Limits

| Setting | Default | Recommended | Description |
|---|---|---|---|
| **\`bind\`** | \`127.0.0.1\` | \`127.0.0.1\` or Private VPC IP | Restrict listening network interfaces |
| **\`protected-mode\`** | \`yes\` | \`yes\` | Blocks external connections if no password |
| **\`requirepass\`** | none | \`StrongPassword64Chars\` | Client authentication password |
| **\`maxclients\`** | \`10000\` | \`10000\` - \`50000\` | Maximum concurrent TCP client sockets |
| **\`tcp-keepalive\`** | \`300\` | \`60\` | Detects dead socket connections |
| **\`timeout\`** | \`0\` | \`300\` | Closes idle client connections after seconds |

### 4. Dangerous Command Renaming

In production environments, rename or disable commands that block the single-threaded event loop or risk data wipeout:

\`\`\`text
# Disable FLUSHALL, FLUSHDB, KEYS, CONFIG
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command KEYS ""
rename-command CONFIG "SYS_CONFIG_SECURE_99182"
\`\`\``, code: `# ==========================================
# Production redis.conf Template
# ==========================================

# Network & Ports
port 6379
bind 127.0.0.1 10.0.1.50
protected-mode yes
tcp-backlog 511
timeout 300
tcp-keepalive 60

# Security
requirepass S3cur3P@ssw0rd!LongAndComplex2026
rename-command FLUSHALL ""
rename-command FLUSHDB ""
rename-command KEYS ""

# Memory Management
maxmemory 4gb
maxmemory-policy allkeys-lru
maxmemory-samples 7
activedefrag yes

# Persistence: RDB + AOF
dir /var/lib/redis
dbfilename dump.rdb
save 900 1
save 300 10
save 60 10000

appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite yes
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# Slowlog & Diagnostics
slowlog-log-slower-than 10000 # Log queries taking > 10ms
slowlog-max-len 1024`, codeLabel: 'Production redis.conf Template', keyPoints: ['Always configure maxmemory (e.g. 75% of machine RAM) to avoid OS OOM killer.', 'Use appendonly yes with appendfsync everysec for durable persistence.', 'Disable or rename destructive commands (FLUSHALL, FLUSHDB, KEYS) in production.', 'Enable active-defrag-enabled to prevent memory fragmentation in long-running instances.', 'Set slowlog-log-slower-than 10000 (10ms) to detect blocking commands.'] },

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

      { title: 'Advanced Patterns & Real-Time Implementations', content: `Here are battle-tested production implementations of key Redis architectural patterns with atomic safety.

### 1. Sliding Window Rate Limiter (Atomic Lua Script)

Fixed counters suffer from "boundary burst" flaws (e.g. 100 requests at 00:59 and 100 at 01:01). A **Sliding Window Log** using Redis Sorted Sets ensures exact window rate limiting:

\`\`\`lua
-- sliding_window_rate_limiter.lua
-- KEYS[1]: rate limit key (e.g. "rate:user_123")
-- ARGV[1]: current timestamp in milliseconds
-- ARGV[2]: window size in milliseconds (e.g. 60000 for 1 min)
-- ARGV[3]: max allowed requests (e.g. 100)

local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local clear_before = now - window

-- 1. Remove entries older than sliding window
redis.call('ZREMRANGEBYSCORE', key, '-inf', clear_before)

-- 2. Count requests in current window
local current_requests = redis.call('ZCARD', key)

if current_requests < limit then
    -- 3. Add current request
    redis.call('ZADD', key, now, now)
    -- 4. Set TTL on set
    redis.call('PEXPIRE', key, window)
    return 1 -- Allowed
else
    return 0 -- Rejected (Rate limit exceeded)
end
\`\`\`

### 2. Distributed Locking (Redlock Safe Token Release)

Distributed locking with \`SET resource_name my_random_value NX PX 30000\` prevents multiple workers from processing the same order. To release safely without removing another worker's expired lock, use a Lua script:

\`\`\`lua
-- safe_unlock.lua
-- KEYS[1]: Lock key
-- ARGV[1]: Unique Lock Value / Owner Token
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
\`\`\`

### 3. Real-Time Leaderboard with Sorted Sets

Leaderboards require high-speed score updates and ranking lookups. Sorted Sets (\`ZSET\`) store pairs of \`(member, score)\` sorted in \`O(log N)\`:

\`\`\`powershell
# Add/update player scores
ZADD game:leaderboard 14500 "user:player_one"
ZADD game:leaderboard 29800 "user:player_two"
ZADD game:leaderboard 18200 "user:player_three"

# Increment player score atomically
ZINCRBY game:leaderboard 500 "user:player_one"

# Fetch Top 10 Leaderboard (Highest to lowest) with scores
ZREVRANGE game:leaderboard 0 9 WITHSCORES

# Fetch specific player rank (1-based ranking)
ZREVRANK game:leaderboard "user:player_one"
\`\`\``, code: `// Java Redisson / Spring Boot Atomic Sliding Window Rate Limiter
@Component
public class SlidingWindowRateLimiter {
    private final StringRedisTemplate redisTemplate;
    private final RedisScript<Long> rateLimitScript;

    public SlidingWindowRateLimiter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
        String lua = """
            local key = KEYS[1]
            local now = tonumber(ARGV[1])
            local window = tonumber(ARGV[2])
            local limit = tonumber(ARGV[3])
            redis.call('ZREMRANGEBYSCORE', key, '-inf', now - window)
            local count = redis.call('ZCARD', key)
            if count < limit then
                redis.call('ZADD', key, now, now)
                redis.call('PEXPIRE', key, window)
                return 1
            else
                return 0
            end
            """;
        this.rateLimitScript = RedisScript.of(lua, Long.class);
    }

    public boolean allowRequest(String userId, int maxRequests, long windowMs) {
        String key = "ratelimit:" + userId;
        long now = System.currentTimeMillis();
        Long result = redisTemplate.execute(
            rateLimitScript,
            List.of(key),
            String.valueOf(now),
            String.valueOf(windowMs),
            String.valueOf(maxRequests)
        );
        return result != null && result == 1L;
    }
}`, codeLabel: 'Real-Time Lua Sliding Window Rate Limiter', keyPoints: ['Lua scripts execute atomically on Redis, preventing race conditions.', 'Sliding Window Log prevents boundary request spikes.', 'Distributed locks must release via owner token verification in Lua.', 'Sorted Sets (ZSET) provide O(log N) leaderboard ranking and range queries.', 'Pipelining batches multiple Redis commands to eliminate network round-trip overhead.'] },

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

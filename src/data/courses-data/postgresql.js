export const postgresqlCourse = {
  id: 'postgresql',
  title: 'PostgreSQL Database',
  description: 'Advanced open-source relational database with JSON/NoSQL support, performance tuning, and cloud deployment.',
  officialDocs: 'https://www.postgresql.org/docs/current/',
  tutorialLink: 'https://www.w3schools.com/postgresql/',
  exerciseLink: 'https://www.w3schools.com/postgresql/postgresql_exercises.php',
  sections: [
    {
      title: 'Introduction to PostgreSQL',
      image: '/images/postgresql/pg-introduction.svg',
      content: `**PostgreSQL** (often called **Postgres**) is a powerful, free, and open-source **object-relational database management system** (ORDBMS). It supports both **relational (SQL)** and **non-relational (JSON)** queries, making it one of the most versatile databases available.\n\nPostgreSQL was originally developed at the **University of California, Berkeley** starting in 1986 as a successor to the Ingres database. It has over 35 years of active development and a proven architecture that has earned it a strong reputation for reliability, data integrity, and extensibility.\n\n### Why PostgreSQL?\n\n- **ACID Compliant** — Full transactional support with atomicity, consistency, isolation, and durability.\n- **Extensible** — Custom data types, operators, functions, index methods, and procedural languages.\n- **Standards Compliant** — Closely follows the SQL standard with rich SQL:2016 feature support.\n- **JSON & NoSQL** — Native \`JSONB\` type lets you store and query semi-structured data with full indexing.\n- **Advanced Features** — Window functions, CTEs, materialized views, table partitioning, full-text search, and more.\n- **Cross-Platform** — Runs on Linux, macOS, Windows, BSD, and Solaris.\n\nPostgreSQL supports all major programming languages including **Python**, **Java**, **C/C++**, **C#/.NET**, **Node.js**, **Go**, **Ruby**, **PHP**, and **Rust**.\n\nIt powers companies like **Apple**, **Instagram**, **Spotify**, **Reddit**, **Twitch**, and **The International Space Station** databases.`,
      keyPoints: [
        'PostgreSQL is a free, open-source ORDBMS with over 35 years of development.',
        'Supports both SQL (relational) and JSON (non-relational) queries.',
        'ACID compliant with advanced features like window functions, CTEs, and partitioning.',
        'Used by major companies: Apple, Instagram, Spotify, Reddit, Twitch.'
      ]
    },
    {
      title: 'Installation & Setup',
      image: '/images/postgresql/pg-installation.svg',
      content: `PostgreSQL can be installed on all major operating systems. The recommended approach depends on your environment and use case.\n\n### Windows Installation\n\nDownload the official installer from **postgresql.org** or use **Chocolatey**:\n\n\`choco install postgresql16\`\n\nThe installer includes **pgAdmin 4** (GUI management tool) and the **psql** command-line client.\n\n### macOS Installation\n\nUse **Homebrew** for the simplest setup:\n\n\`brew install postgresql@16\`\n\nStart with: \`brew services start postgresql@16\`\n\n### Linux (Ubuntu/Debian)\n\nAdd the official APT repository for the latest version:\n\n### Docker (Recommended for Development)\n\nDocker provides the most portable and reproducible setup. You can spin up a PostgreSQL instance in seconds without polluting your host system.\n\n### Post-Installation\n\nAfter installation, connect using **psql**:\n\n\`psql -U postgres\`\n\nVerify the version: \`SELECT version();\`\n\nCreate your first database: \`CREATE DATABASE myapp;\``,
      code: `# --- Docker Setup (Recommended) ---
docker run -d \\
  --name postgres-dev \\
  -e POSTGRES_USER=admin \\
  -e POSTGRES_PASSWORD=secret \\
  -e POSTGRES_DB=myapp \\
  -p 5432:5432 \\
  -v pgdata:/var/lib/postgresql/data \\
  postgres:16-alpine

# Connect to the container
docker exec -it postgres-dev psql -U admin -d myapp

# --- Linux (Ubuntu/Debian) ---
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \\
  > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install postgresql-16

# Start and enable the service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# --- docker-compose.yml ---
# version: "3.9"
# services:
#   db:
#     image: postgres:16-alpine
#     environment:
#       POSTGRES_USER: admin
#       POSTGRES_PASSWORD: secret
#       POSTGRES_DB: myapp
#     ports:
#       - "5432:5432"
#     volumes:
#       - pgdata:/var/lib/postgresql/data
# volumes:
#   pgdata:`,
      codeLabel: 'Installation Commands',
      keyPoints: [
        'Docker is the recommended approach for portable development environments.',
        'Use the official APT repository on Linux for the latest PostgreSQL version.',
        'pgAdmin 4 provides a GUI; psql is the command-line client.',
        'Always persist data with Docker volumes to avoid data loss on container restart.'
      ]
    },
    {
      title: 'Create Database & Tables',
      image: '/images/postgresql/pg-create-database.svg',
      content: `In PostgreSQL, a **database** is a collection of schemas, and each **schema** contains tables, views, functions, and other objects. The default schema is \`public\`.\n\n### Creating a Database\n\nUse \`CREATE DATABASE\` to create a new database. You can specify encoding, locale, and template:\n\n### Creating Tables\n\nTables are defined with \`CREATE TABLE\`. PostgreSQL supports a rich set of data types:\n\n| Category | Types |\n|----------|-------|\n| Numeric | \`INTEGER\`, \`BIGINT\`, \`SERIAL\`, \`NUMERIC\`, \`REAL\`, \`DOUBLE PRECISION\` |\n| Text | \`VARCHAR(n)\`, \`TEXT\`, \`CHAR(n)\` |\n| Boolean | \`BOOLEAN\` |\n| Date/Time | \`DATE\`, \`TIME\`, \`TIMESTAMP\`, \`TIMESTAMPTZ\`, \`INTERVAL\` |\n| JSON | \`JSON\`, \`JSONB\` |\n| Other | \`UUID\`, \`BYTEA\`, \`ARRAY\`, \`INET\`, \`CIDR\`, \`MONEY\` |\n\n### Constraints\n\n\`PRIMARY KEY\`, \`FOREIGN KEY\`, \`UNIQUE\`, \`NOT NULL\`, \`CHECK\`, and \`DEFAULT\` enforce data integrity at the database level.\n\n### SERIAL vs IDENTITY\n\nPostgreSQL offers both \`SERIAL\` (legacy) and \`GENERATED ALWAYS AS IDENTITY\` (SQL standard) for auto-incrementing columns. Prefer **IDENTITY** for new projects.`,
      code: `-- Create a database
CREATE DATABASE myapp
  WITH ENCODING 'UTF8'
       LC_COLLATE 'en_US.UTF-8'
       LC_CTYPE 'en_US.UTF-8'
       TEMPLATE template0;

-- Connect to the database
\\c myapp

-- Create schema
CREATE SCHEMA IF NOT EXISTS app;

-- Create tables with constraints
CREATE TABLE app.users (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username    VARCHAR(50) UNIQUE NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    is_active   BOOLEAN DEFAULT true,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE app.posts (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    body        TEXT,
    tags        TEXT[] DEFAULT '{}',  -- Array type
    published   BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Add a CHECK constraint
ALTER TABLE app.users
ADD CONSTRAINT chk_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z]{2,}$');

-- Create an index
CREATE INDEX idx_posts_user_id ON app.posts(user_id);
CREATE INDEX idx_users_email ON app.users(email);`,
      codeLabel: 'Database & Table Creation',
      keyPoints: [
        'Use GENERATED ALWAYS AS IDENTITY instead of SERIAL for new projects.',
        'PostgreSQL supports arrays, JSONB, UUID, INET, and other advanced types.',
        'Schemas help organize objects; the default schema is public.',
        'Always add indexes on foreign keys and frequently filtered columns.'
      ]
    },
    {
      title: 'INSERT, SELECT & Basic Queries',
      image: '/images/postgresql/pg-crud-operations.svg',
      content: `The core of working with PostgreSQL is **CRUD** operations: Create (\`INSERT\`), Read (\`SELECT\`), Update (\`UPDATE\`), and Delete (\`DELETE\`).\n\n### INSERT\n\n\`INSERT INTO\` adds rows to a table. PostgreSQL extends standard SQL with \`RETURNING\` to return inserted data, and \`ON CONFLICT\` for upsert behavior.\n\n### SELECT\n\n\`SELECT\` retrieves data. It supports:\n- **WHERE** — filter rows with conditions\n- **ORDER BY** — sort results (ASC/DESC)\n- **LIMIT / OFFSET** — paginate results\n- **DISTINCT** — remove duplicate rows\n- **AS** — column aliases for readability\n\n### Comparison Operators\n\nPostgreSQL supports standard operators: \`=\`, \`!=\` or \`<>\`, \`<\`, \`>\`, \`<=\`, \`>=\`, and also \`BETWEEN\`, \`IN\`, \`LIKE\`, \`ILIKE\` (case-insensitive), \`IS NULL\`, \`IS NOT NULL\`.\n\n### Logical Operators\n\nCombine conditions with \`AND\`, \`OR\`, and \`NOT\`. Use parentheses to control evaluation order.`,
      code: `-- INSERT with RETURNING
INSERT INTO app.users (username, email, password)
VALUES ('alice', 'alice@example.com', crypt('secret123', gen_salt('bf')))
RETURNING id, username, created_at;

-- INSERT multiple rows
INSERT INTO app.posts (user_id, title, body, tags)
VALUES
  (1, 'Getting Started with PostgreSQL', 'Learn the basics...', ARRAY['postgresql', 'tutorial']),
  (1, 'Advanced JSON Queries', 'Deep dive into JSONB...', ARRAY['json', 'nosql']),
  (1, 'Performance Tuning Guide', 'Optimize your queries...', ARRAY['performance']);

-- UPSERT (INSERT ... ON CONFLICT)
INSERT INTO app.users (username, email, password)
VALUES ('alice', 'alice@example.com', crypt('newpass', gen_salt('bf')))
ON CONFLICT (email) DO UPDATE
SET password = EXCLUDED.password,
    updated_at = now();

-- SELECT with filtering, sorting, pagination
SELECT id, username, email, created_at
FROM app.users
WHERE is_active = true
  AND email ILIKE '%@example.com'
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;

-- SELECT with BETWEEN, IN, LIKE
SELECT title, tags, created_at
FROM app.posts
WHERE created_at BETWEEN '2025-01-01' AND '2025-12-31'
  AND tags && ARRAY['postgresql']  -- Array overlap operator
ORDER BY title ASC;

-- UPDATE with RETURNING
UPDATE app.posts
SET published = true, title = CONCAT(title, ' [Updated]')
WHERE user_id = 1 AND published = false
RETURNING id, title;

-- DELETE
DELETE FROM app.posts
WHERE published = false AND created_at < now() - INTERVAL '90 days';`,
      codeLabel: 'CRUD Operations',
      keyPoints: [
        'RETURNING clause lets you get inserted/updated/deleted data back immediately.',
        'ON CONFLICT enables upsert behavior without separate SELECT + INSERT.',
        'Use ILIKE for case-insensitive pattern matching.',
        'The && operator checks array overlap; @> checks array containment.'
      ]
    },
    {
      title: 'Aggregate Functions & GROUP BY',
      image: '/images/postgresql/pg-aggregate-groupby.svg',
      content: `**Aggregate functions** compute a single result from a set of rows. PostgreSQL provides a rich set of built-in aggregates.\n\n### Common Aggregate Functions\n\n| Function | Purpose |\n|----------|--------|\n| \`COUNT(*)\` | Number of rows |\n| \`COUNT(col)\` | Non-null values in column |\n| \`SUM(col)\` | Total of numeric column |\n| \`AVG(col)\` | Average value |\n| \`MIN(col)\` / \`MAX(col)\` | Smallest / largest value |\n| \`STRING_AGG(col, sep)\` | Concatenate strings |\n| \`ARRAY_AGG(col)\` | Collect values into array |\n| \`BOOL_AND(col)\` / \`BOOL_OR(col)\` | Logical aggregates |\n\n### GROUP BY\n\n\`GROUP BY\` divides rows into groups, and aggregate functions compute values for each group. Every selected column must either appear in \`GROUP BY\` or be used in an aggregate.\n\n### HAVING\n\n\`HAVING\` filters groups after aggregation (unlike \`WHERE\` which filters rows before grouping).\n\n### GROUPING SETS, CUBE, ROLLUP\n\nPostgreSQL supports advanced grouping for subtotals and cross-tabulation:\n- \`ROLLUP\` — hierarchical subtotals\n- \`CUBE\` — all combinations of grouping columns\n- \`GROUPING SETS\` — explicit groups`,
      code: `-- Basic aggregates
SELECT
    COUNT(*) AS total_posts,
    COUNT(DISTINCT user_id) AS unique_authors,
    MIN(created_at) AS earliest_post,
    MAX(created_at) AS latest_post
FROM app.posts;

-- GROUP BY with HAVING
SELECT
    u.username,
    COUNT(p.id) AS post_count,
    AVG(LENGTH(p.body)) AS avg_body_length
FROM app.users u
JOIN app.posts p ON p.user_id = u.id
GROUP BY u.username
HAVING COUNT(p.id) >= 2
ORDER BY post_count DESC;

-- STRING_AGG and ARRAY_AGG
SELECT
    user_id,
    STRING_AGG(title, ', ' ORDER BY created_at) AS post_titles,
    ARRAY_AGG(DISTINCT unnest) AS all_tags
FROM app.posts, LATERAL unnest(tags)
GROUP BY user_id;

-- ROLLUP for subtotals
SELECT
    COALESCE(u.username, '== TOTAL ==') AS author,
    COUNT(p.id) AS post_count,
    SUM(CASE WHEN p.published THEN 1 ELSE 0 END) AS published_count
FROM app.users u
JOIN app.posts p ON p.user_id = u.id
GROUP BY ROLLUP(u.username)
ORDER BY u.username NULLS LAST;

-- GROUPING SETS
SELECT
    published,
    EXTRACT(YEAR FROM created_at) AS year,
    COUNT(*)
FROM app.posts
GROUP BY GROUPING SETS (
    (published),
    (EXTRACT(YEAR FROM created_at)),
    ()  -- grand total
);`,
      codeLabel: 'Aggregates & Grouping',
      keyPoints: [
        'GROUP BY divides rows into groups; each non-aggregated column must appear in GROUP BY.',
        'HAVING filters groups; WHERE filters individual rows before grouping.',
        'STRING_AGG and ARRAY_AGG are PostgreSQL-specific and extremely useful.',
        'ROLLUP, CUBE, and GROUPING SETS provide subtotals without multiple queries.'
      ]
    },
    {
      title: 'JOINs & Subqueries',
      image: '/images/postgresql/pg-joins.svg',
      content: `**JOINs** combine rows from two or more tables based on related columns. They are fundamental to relational databases.\n\n### JOIN Types\n\n| Join Type | Description |\n|-----------|------------|\n| \`INNER JOIN\` | Returns only matching rows from both tables |\n| \`LEFT JOIN\` | All rows from left table + matching from right |\n| \`RIGHT JOIN\` | All rows from right table + matching from left |\n| \`FULL OUTER JOIN\` | All rows from both tables, with NULLs for non-matches |\n| \`CROSS JOIN\` | Cartesian product of both tables |\n| \`SELF JOIN\` | Join a table with itself |\n| \`LATERAL JOIN\` | Subquery can reference columns from preceding tables |\n\n### Subqueries\n\nSubqueries (nested queries) can appear in \`WHERE\`, \`FROM\`, \`SELECT\`, or \`HAVING\` clauses:\n- **Scalar subquery** — returns a single value\n- **Row subquery** — returns a single row\n- **Table subquery** — returns a result set\n- **Correlated subquery** — references outer query\n\n### EXISTS, IN, ANY, ALL\n\n\`EXISTS\` checks if a subquery returns any rows. \`IN\` checks membership. \`ANY\`/\`ALL\` compare against a set of values.`,
      code: `-- INNER JOIN
SELECT u.username, p.title, p.created_at
FROM app.users u
INNER JOIN app.posts p ON p.user_id = u.id
WHERE p.published = true;

-- LEFT JOIN (find users with no posts)
SELECT u.username, COUNT(p.id) AS post_count
FROM app.users u
LEFT JOIN app.posts p ON p.user_id = u.id
GROUP BY u.username
HAVING COUNT(p.id) = 0;

-- FULL OUTER JOIN
SELECT
    u.username,
    p.title
FROM app.users u
FULL OUTER JOIN app.posts p ON p.user_id = u.id;

-- LATERAL JOIN (top 3 posts per user)
SELECT u.username, latest.*
FROM app.users u
CROSS JOIN LATERAL (
    SELECT title, created_at
    FROM app.posts p
    WHERE p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT 3
) latest;

-- Subquery with EXISTS
SELECT u.username
FROM app.users u
WHERE EXISTS (
    SELECT 1 FROM app.posts p
    WHERE p.user_id = u.id AND p.published = true
);

-- Subquery with IN
SELECT title FROM app.posts
WHERE user_id IN (
    SELECT id FROM app.users WHERE is_active = true
);

-- Correlated subquery
SELECT
    p.title,
    (SELECT COUNT(*) FROM app.posts p2
     WHERE p2.user_id = p.user_id) AS author_total_posts
FROM app.posts p;`,
      codeLabel: 'JOINs & Subqueries',
      keyPoints: [
        'LATERAL JOIN lets subqueries reference columns from preceding FROM items.',
        'Prefer EXISTS over IN for correlated checks — it short-circuits on first match.',
        'LEFT JOIN + IS NULL pattern efficiently finds missing relationships.',
        'CROSS JOIN LATERAL is powerful for top-N-per-group queries.'
      ]
    },
    {
      title: 'Window Functions',
      image: '/images/postgresql/pg-window-functions.svg',
      content: `**Window functions** perform calculations across a set of rows related to the current row, without collapsing them into a single output row like aggregates do.\n\n### Syntax\n\n\`\`\`\nfunction_name(...) OVER (\n    [PARTITION BY col1, col2]\n    [ORDER BY col3 ASC|DESC]\n    [ROWS|RANGE BETWEEN ... AND ...]\n)\n\`\`\`\n\n### Common Window Functions\n\n| Function | Purpose |\n|----------|--------|\n| \`ROW_NUMBER()\` | Unique sequential number per partition |\n| \`RANK()\` | Rank with gaps for ties |\n| \`DENSE_RANK()\` | Rank without gaps |\n| \`NTILE(n)\` | Divide rows into n equal buckets |\n| \`LAG(col, n)\` | Value from n rows before |\n| \`LEAD(col, n)\` | Value from n rows after |\n| \`FIRST_VALUE(col)\` | First value in the window frame |\n| \`LAST_VALUE(col)\` | Last value in the window frame |\n| \`SUM/AVG/COUNT OVER()\` | Running or partitioned aggregates |\n\n### Frame Specification\n\nThe frame defines which rows are included in the window:\n- \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\` — cumulative\n- \`ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING\` — sliding 3-row window\n- \`RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW\` — time-based`,
      code: `-- ROW_NUMBER, RANK, DENSE_RANK
SELECT
    username,
    post_count,
    ROW_NUMBER() OVER (ORDER BY post_count DESC) AS row_num,
    RANK() OVER (ORDER BY post_count DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY post_count DESC) AS dense_rank
FROM (
    SELECT u.username, COUNT(p.id) AS post_count
    FROM app.users u
    LEFT JOIN app.posts p ON p.user_id = u.id
    GROUP BY u.username
) stats;

-- Running total
SELECT
    created_at::date AS day,
    COUNT(*) AS daily_posts,
    SUM(COUNT(*)) OVER (ORDER BY created_at::date) AS cumulative_posts
FROM app.posts
GROUP BY created_at::date;

-- LAG / LEAD (compare to previous/next)
SELECT
    title,
    created_at,
    LAG(created_at) OVER (ORDER BY created_at) AS prev_post_at,
    created_at - LAG(created_at) OVER (ORDER BY created_at) AS gap
FROM app.posts
WHERE user_id = 1;

-- NTILE (split into quartiles)
SELECT
    username,
    post_count,
    NTILE(4) OVER (ORDER BY post_count DESC) AS quartile
FROM (
    SELECT u.username, COUNT(p.id) AS post_count
    FROM app.users u
    JOIN app.posts p ON p.user_id = u.id
    GROUP BY u.username
) stats;

-- Named window
SELECT
    title,
    created_at,
    ROW_NUMBER() OVER w AS rn,
    FIRST_VALUE(title) OVER w AS first_title
FROM app.posts
WHERE user_id = 1
WINDOW w AS (ORDER BY created_at);`,
      codeLabel: 'Window Functions',
      keyPoints: [
        'Window functions compute values across related rows without collapsing them.',
        'PARTITION BY divides rows into groups; ORDER BY controls the sequence.',
        'Use named windows (WINDOW w AS ...) to avoid repeating the same definition.',
        'LAG/LEAD are essential for time-series comparisons and gap detection.'
      ]
    },
    {
      title: 'Common Table Expressions (CTEs)',
      image: '/images/postgresql/pg-cte.svg',
      content: `A **Common Table Expression** (CTE) is a temporary named result set defined within a \`WITH\` clause. CTEs improve readability by breaking complex queries into logical steps.\n\n### Types of CTEs\n\n- **Standard CTE** — A named subquery for the duration of one statement.\n- **Recursive CTE** — References itself to traverse hierarchical/tree data.\n- **Writable CTE** — Uses \`INSERT\`, \`UPDATE\`, or \`DELETE\` to modify data in a CTE.\n\n### Materialization\n\nBy default in PostgreSQL 12+, CTEs that are referenced once are **inlined** (optimized like subqueries). Use \`MATERIALIZED\` or \`NOT MATERIALIZED\` hints to control this:\n\n\`WITH stats AS MATERIALIZED (...)\`\n\n### Recursive CTEs\n\nRecursive CTEs have two parts:\n1. **Base case** — the initial query (non-recursive term)\n2. **Recursive step** — references the CTE name and adds rows iteratively\n\nThey are essential for traversing trees (org charts, category hierarchies, file systems) and generating series.`,
      code: `-- Standard CTE
WITH active_authors AS (
    SELECT u.id, u.username
    FROM app.users u
    WHERE u.is_active = true
),
author_stats AS (
    SELECT
        a.username,
        COUNT(p.id) AS post_count,
        MAX(p.created_at) AS last_post_at
    FROM active_authors a
    JOIN app.posts p ON p.user_id = a.id
    GROUP BY a.username
)
SELECT * FROM author_stats
WHERE post_count >= 1
ORDER BY last_post_at DESC;

-- Recursive CTE (employee hierarchy)
CREATE TABLE app.employees (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    manager_id BIGINT REFERENCES app.employees(id)
);

WITH RECURSIVE org_tree AS (
    -- Base case: top-level managers
    SELECT id, name, manager_id, 0 AS depth, name::text AS path
    FROM app.employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive step
    SELECT e.id, e.name, e.manager_id, t.depth + 1,
           t.path || ' > ' || e.name
    FROM app.employees e
    JOIN org_tree t ON t.id = e.manager_id
)
SELECT * FROM org_tree ORDER BY path;

-- Writable CTE (archive old posts)
WITH archived AS (
    DELETE FROM app.posts
    WHERE published = false
      AND created_at < now() - INTERVAL '1 year'
    RETURNING *
)
INSERT INTO app.archived_posts SELECT * FROM archived;

-- Generate series using recursive CTE
WITH RECURSIVE dates AS (
    SELECT '2025-01-01'::date AS d
    UNION ALL
    SELECT d + 1 FROM dates WHERE d < '2025-01-31'
)
SELECT d, EXTRACT(DOW FROM d) AS day_of_week FROM dates;`,
      codeLabel: 'CTEs & Recursive Queries',
      keyPoints: [
        'CTEs simplify complex queries by breaking them into named steps.',
        'Recursive CTEs traverse trees and hierarchies with a base case + recursive step.',
        'Writable CTEs can INSERT, UPDATE, or DELETE data within the same statement.',
        'PostgreSQL 12+ inlines single-reference CTEs; use MATERIALIZED to force caching.'
      ]
    },
    {
      title: 'Views & Materialized Views',
      image: '/images/postgresql/pg-views.svg',
      content: `**Views** are saved queries that behave like virtual tables. They simplify access to complex joins, enforce security boundaries, and provide a stable API even when underlying tables change.\n\n### Regular Views\n\nA regular view does **not** store data. Every time you query it, PostgreSQL re-executes the underlying query.\n\n### Updatable Views\n\nSimple views (single table, no aggregates/grouping) are automatically updatable in PostgreSQL. For complex views, use \`INSTEAD OF\` triggers.\n\n### Materialized Views\n\n**Materialized views** physically store the query result. They are ideal for:\n- Expensive aggregate reports\n- Dashboard data\n- Search indexes\n- Denormalized read models\n\nRefresh manually with \`REFRESH MATERIALIZED VIEW\` or set up a cron job / \`pg_cron\` extension.\n\n### CONCURRENTLY\n\n\`REFRESH MATERIALIZED VIEW CONCURRENTLY\` avoids locking the view during refresh, but requires a **UNIQUE index** on the materialized view.`,
      code: `-- Regular view
CREATE OR REPLACE VIEW app.v_user_stats AS
SELECT
    u.id,
    u.username,
    u.email,
    COUNT(p.id) AS post_count,
    MAX(p.created_at) AS last_post_at,
    SUM(CASE WHEN p.published THEN 1 ELSE 0 END) AS published_count
FROM app.users u
LEFT JOIN app.posts p ON p.user_id = u.id
GROUP BY u.id, u.username, u.email;

-- Query the view like a table
SELECT * FROM app.v_user_stats WHERE post_count > 0;

-- Materialized view
CREATE MATERIALIZED VIEW app.mv_daily_post_stats AS
SELECT
    created_at::date AS day,
    COUNT(*) AS total_posts,
    COUNT(DISTINCT user_id) AS unique_authors,
    SUM(CASE WHEN published THEN 1 ELSE 0 END) AS published
FROM app.posts
GROUP BY created_at::date
WITH DATA;

-- Add unique index for CONCURRENTLY refresh
CREATE UNIQUE INDEX idx_mv_daily_day
ON app.mv_daily_post_stats(day);

-- Refresh options
REFRESH MATERIALIZED VIEW app.mv_daily_post_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY app.mv_daily_post_stats;

-- Automate refresh with pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule(
    'refresh-daily-stats',
    '0 * * * *',  -- every hour
    $$REFRESH MATERIALIZED VIEW CONCURRENTLY app.mv_daily_post_stats$$
);`,
      codeLabel: 'Views & Materialized Views',
      keyPoints: [
        'Regular views re-execute the query each time; materialized views cache the result.',
        'Use CONCURRENTLY to refresh materialized views without blocking reads.',
        'CONCURRENTLY requires a UNIQUE index on the materialized view.',
        'pg_cron can automate periodic materialized view refreshes.'
      ]
    },
    {
      title: 'Indexes & Performance',
      image: '/images/postgresql/pg-indexes.svg',
      content: `**Indexes** speed up data retrieval by creating optimized data structures for lookups. Without indexes, PostgreSQL must perform a sequential scan of the entire table.\n\n### Index Types\n\n| Type | Use Case |\n|------|----------|\n| \`B-tree\` | Default. Equality and range queries (\`=\`, \`<\`, \`>\`, \`BETWEEN\`) |\n| \`Hash\` | Equality comparisons only (\`=\`) |\n| \`GIN\` | Full-text search, JSONB, arrays, \`pg_trgm\` |\n| \`GiST\` | Geometric data, range types, full-text |\n| \`BRIN\` | Very large tables with naturally ordered data (timestamps) |\n| \`SP-GiST\` | Partitioned search trees (IP addresses, phone numbers) |\n\n### Index Strategies\n\n- **Partial Index** — Index a subset of rows: \`WHERE is_active = true\`\n- **Expression Index** — Index computed values: \`LOWER(email)\`\n- **Covering Index** — Include extra columns: \`INCLUDE (name, email)\`\n- **Multicolumn Index** — Index multiple columns for compound queries\n- **Unique Index** — Enforce uniqueness\n\n### EXPLAIN ANALYZE\n\nAlways use \`EXPLAIN ANALYZE\` to verify that your indexes are being used. Look for **Index Scan** or **Index Only Scan** instead of **Seq Scan**.`,
      code: `-- B-tree index (default)
CREATE INDEX idx_posts_created ON app.posts(created_at DESC);

-- Partial index (only active users)
CREATE INDEX idx_users_active ON app.users(email)
WHERE is_active = true;

-- Expression index (case-insensitive search)
CREATE INDEX idx_users_email_lower ON app.users(LOWER(email));

-- Covering index (index-only scan)
CREATE INDEX idx_posts_user_covering ON app.posts(user_id)
INCLUDE (title, created_at);

-- GIN index for JSONB
CREATE INDEX idx_users_metadata ON app.users USING gin(metadata);

-- GIN index for array columns
CREATE INDEX idx_posts_tags ON app.posts USING gin(tags);

-- GIN index for full-text search
ALTER TABLE app.posts ADD COLUMN search_vector tsvector;
CREATE INDEX idx_posts_search ON app.posts USING gin(search_vector);

-- BRIN index for large time-series tables
CREATE INDEX idx_logs_timestamp ON app.audit_logs USING brin(created_at);

-- EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM app.users WHERE LOWER(email) = 'alice@example.com';
-- Expected: Index Scan using idx_users_email_lower

-- Check index usage statistics
SELECT
    schemaname, tablename, indexname,
    idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'app'
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND schemaname = 'app';`,
      codeLabel: 'Index Types & Strategies',
      keyPoints: [
        'B-tree is the default; use GIN for JSONB, arrays, and full-text search.',
        'Partial indexes reduce size by indexing only relevant rows.',
        'Always verify with EXPLAIN ANALYZE that indexes are actually used.',
        'Covering indexes (INCLUDE) enable index-only scans for better performance.'
      ]
    },
    {
      title: 'JSON & NoSQL Support (JSONB)',
      image: '/images/postgresql/pg-jsonb.svg',
      content: `PostgreSQL is unique among relational databases in offering **first-class JSON support**. The \`JSONB\` data type stores JSON in a binary, decomposed format that enables **indexing**, **fast queries**, and **in-place updates** — giving you the flexibility of a **NoSQL document store** inside a relational database.\n\n### JSON vs JSONB\n\n| Feature | JSON | JSONB |\n|---------|------|-------|\n| Storage | Text (preserves formatting) | Binary (decomposed) |\n| Indexing | No | GIN, GiST |\n| Duplicate keys | Preserves | Last value wins |\n| Processing speed | Slower (parse on read) | Faster (pre-parsed) |\n| Modification | Replace entire value | In-place with operators |\n\n**Always use JSONB** unless you need to preserve exact JSON text formatting.\n\n### Key Operators\n\n| Operator | Description | Example |\n|----------|-------------|--------|\n| \`->\` | Get JSON element by key (returns JSON) | \`data->'name'\` |\n| \`->>\` | Get JSON element as text | \`data->>'name'\` |\n| \`#>\` | Get nested element by path | \`data#>'{address,city}'\` |\n| \`#>>\` | Get nested element as text | \`data#>>'{address,city}'\` |\n| \`@>\` | Contains (left contains right) | \`data @> '{"role":"admin"}'\` |\n| \`<@\` | Contained by | \`'{"role":"admin"}' <@ data\` |\n| \`?\` | Key exists | \`data ? 'email'\` |\n| \`?|\` | Any key exists | \`data ?| array['a','b']\` |\n| \`?&\` | All keys exist | \`data ?& array['a','b']\` |\n| \`||\` | Concatenate (merge) | \`data || '{"new":"val"}'\` |\n| \`-\` | Delete key | \`data - 'key'\` |\n| \`#-\` | Delete nested path | \`data #- '{nested,key}'\` |\n\n### When to Use JSONB vs Columns\n\nUse JSONB for **variable/dynamic schemas**, **metadata**, **user preferences**, **API payloads**, and **event data**. Use traditional columns for **frequently queried fields**, **foreign keys**, and **data that needs constraints**.`,
      code: `-- Create table with JSONB column
CREATE TABLE app.products (
    id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    TEXT NOT NULL,
    data    JSONB NOT NULL DEFAULT '{}'
);

-- Insert JSON data
INSERT INTO app.products (name, data) VALUES
('Laptop', '{
    "brand": "Dell",
    "price": 999.99,
    "specs": {
        "cpu": "i7-13700H",
        "ram": "16GB",
        "storage": "512GB SSD"
    },
    "tags": ["electronics", "computer"],
    "in_stock": true
}'),
('Phone', '{
    "brand": "Samsung",
    "price": 799.99,
    "specs": {
        "cpu": "Snapdragon 8 Gen 3",
        "ram": "8GB",
        "storage": "256GB"
    },
    "tags": ["electronics", "mobile"],
    "in_stock": true
}');

-- Query JSONB: extract values
SELECT
    name,
    data->>'brand' AS brand,
    (data->>'price')::numeric AS price,
    data#>>'{specs,cpu}' AS cpu
FROM app.products;

-- Filter by JSONB content (containment)
SELECT * FROM app.products
WHERE data @> '{"brand": "Dell"}';

-- Filter by nested value
SELECT * FROM app.products
WHERE data#>>'{specs,ram}' = '16GB';

-- Check key existence
SELECT * FROM app.products
WHERE data ? 'specs';

-- Array operations in JSONB
SELECT * FROM app.products
WHERE data->'tags' ? 'mobile';

-- Update JSONB: set a nested value
UPDATE app.products
SET data = jsonb_set(data, '{specs,ram}', '"32GB"')
WHERE name = 'Laptop';

-- Update JSONB: add a new key
UPDATE app.products
SET data = data || '{"warranty": "2 years"}'
WHERE name = 'Laptop';

-- Remove a key
UPDATE app.products
SET data = data - 'warranty'
WHERE name = 'Laptop';

-- GIN index for fast JSONB queries
CREATE INDEX idx_products_data ON app.products USING gin(data);

-- GIN index on specific path
CREATE INDEX idx_products_tags ON app.products
USING gin((data->'tags'));

-- Aggregate JSONB: build object from rows
SELECT jsonb_object_agg(name, data->>'brand') AS brand_map
FROM app.products;

-- Expand JSONB array elements
SELECT name, tag
FROM app.products, jsonb_array_elements_text(data->'tags') AS tag;`,
      codeLabel: 'JSONB Queries & Operations',
      keyPoints: [
        'Always use JSONB over JSON — it is indexed, faster, and supports in-place updates.',
        'The @> containment operator with a GIN index is the fastest way to query JSONB.',
        'jsonb_set() updates nested values; || merges objects; - removes keys.',
        'JSONB gives you NoSQL flexibility inside a fully ACID-compliant relational database.'
      ]
    },
    {
      title: 'Advanced JSONB & Document Patterns',
      image: '/images/postgresql/pg-jsonb-advanced.svg',
      content: `PostgreSQL's JSONB support goes far beyond basic storage. You can build **full document-store patterns** — schemas that rival **MongoDB** and **DynamoDB** — while retaining SQL joins, transactions, and constraints.\n\n### JSONB Functions\n\n| Function | Purpose |\n|----------|--------|\n| \`jsonb_build_object(k,v,...)\` | Build JSONB from key-value pairs |\n| \`jsonb_build_array(v,...)\` | Build JSONB array |\n| \`jsonb_each(jsonb)\` | Expand top-level keys to rows |\n| \`jsonb_array_elements(jsonb)\` | Expand array to rows |\n| \`jsonb_to_record(jsonb)\` | Convert JSONB to a named record |\n| \`jsonb_typeof(jsonb)\` | Returns JSON type as text |\n| \`jsonb_strip_nulls(jsonb)\` | Remove null-valued keys |\n| \`jsonb_path_query(jsonb, path)\` | SQL/JSON path query |\n| \`jsonb_pretty(jsonb)\` | Pretty-print JSON |\n\n### SQL/JSON Path Language (PostgreSQL 12+)\n\nPostgreSQL implements the **SQL/JSON path language** standard, enabling XPath-like traversal of JSON documents:\n\n\`jsonb_path_query(data, '$.specs.cpu')\`\n\nPath expressions support filters, arithmetic, regex, and boolean logic.\n\n### Document Store Pattern\n\nStore entire documents as JSONB rows. Use **generated columns** to extract frequently queried fields into real columns that can have indexes, constraints, and foreign keys — getting the best of both worlds.`,
      code: `-- SQL/JSON Path Language
SELECT name, jsonb_path_query(data, '$.specs.cpu') AS cpu
FROM app.products;

-- Path with filter
SELECT name, jsonb_path_query(data, '$.tags[*] ? (@ starts with "elec")')
FROM app.products;

-- Path exists check
SELECT * FROM app.products
WHERE jsonb_path_exists(data, '$.price ? (@ > 500)');

-- Document Store Pattern: events table
CREATE TABLE app.events (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_type  TEXT GENERATED ALWAYS AS (payload->>'type') STORED,
    user_id     BIGINT GENERATED ALWAYS AS ((payload->>'user_id')::bigint) STORED,
    payload     JSONB NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Generated columns are real and indexable
CREATE INDEX idx_events_type ON app.events(event_type);
CREATE INDEX idx_events_user ON app.events(user_id);
CREATE INDEX idx_events_payload ON app.events USING gin(payload);

-- Insert events as documents
INSERT INTO app.events (payload) VALUES
('{"type":"page_view","user_id":1,"page":"/home","duration":3.5}'),
('{"type":"click","user_id":1,"element":"#buy-btn","page":"/product"}'),
('{"type":"purchase","user_id":2,"amount":99.99,"items":["sku-001","sku-002"]}');

-- Query using generated column (fast B-tree scan)
SELECT * FROM app.events WHERE event_type = 'purchase';

-- Query using JSONB containment (GIN scan)
SELECT * FROM app.events
WHERE payload @> '{"type":"click","page":"/product"}';

-- Aggregate: purchases per user with total
SELECT
    user_id,
    COUNT(*) AS purchases,
    SUM((payload->>'amount')::numeric) AS total_spent
FROM app.events
WHERE event_type = 'purchase'
GROUP BY user_id;

-- jsonb_each: expand JSONB keys to rows
SELECT key, value
FROM app.events, jsonb_each(payload)
WHERE id = 1;

-- Build JSONB dynamically
SELECT jsonb_build_object(
    'summary', jsonb_build_object(
        'total_events', COUNT(*),
        'event_types', jsonb_agg(DISTINCT event_type)
    )
) FROM app.events;`,
      codeLabel: 'Advanced JSONB Patterns',
      keyPoints: [
        'SQL/JSON path language provides XPath-like queries inside PostgreSQL.',
        'Generated columns extract JSONB fields into real, indexable columns.',
        'The document-store pattern combines NoSQL flexibility with SQL power.',
        'Use jsonb_path_query for complex filtering, arithmetic, and regex in JSON.'
      ]
    },
    {
      title: 'Full-Text Search',
      image: '/images/postgresql/pg-fulltext-search.svg',
      content: `PostgreSQL has a **built-in full-text search** engine that eliminates the need for external tools like **Elasticsearch** for many use cases.\n\n### Core Concepts\n\n- **\`tsvector\`** — A document transformed into a sorted list of lexemes (normalized words).\n- **\`tsquery\`** — A search query with boolean operators (\`&\` AND, \`|\` OR, \`!\` NOT).\n- **\`to_tsvector(config, text)\`** — Converts text to a tsvector with language-aware stemming.\n- **\`to_tsquery(config, text)\`** — Converts text to a tsquery.\n- **\`@@\`** — The match operator: \`tsvector @@ tsquery\`.\n\n### Search Configurations\n\nPostgreSQL provides locale-aware configurations: \`english\`, \`french\`, \`german\`, etc. These handle **stemming** (running → run), **stop words** (the, is, a), and **normalization**.\n\n### Ranking\n\nUse \`ts_rank()\` or \`ts_rank_cd()\` to score results by relevance. Higher weight can be assigned to titles vs. body content using labels A, B, C, D.\n\n### Highlighting\n\n\`ts_headline()\` generates HTML-highlighted snippets showing where matches occur.`,
      code: `-- Add search vector column with auto-update trigger
ALTER TABLE app.posts ADD COLUMN search_vector tsvector;

UPDATE app.posts SET search_vector =
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(body, '')), 'B');

-- Create trigger to auto-update on INSERT/UPDATE
CREATE OR REPLACE FUNCTION app.posts_search_trigger()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.body, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_posts_search
BEFORE INSERT OR UPDATE OF title, body ON app.posts
FOR EACH ROW EXECUTE FUNCTION app.posts_search_trigger();

-- GIN index for fast full-text search
CREATE INDEX idx_posts_fts ON app.posts USING gin(search_vector);

-- Basic search
SELECT title, ts_rank(search_vector, query) AS rank
FROM app.posts, to_tsquery('english', 'postgresql & performance') AS query
WHERE search_vector @@ query
ORDER BY rank DESC;

-- Search with OR and NOT
SELECT title FROM app.posts
WHERE search_vector @@ to_tsquery('english', 'json | nosql & !mongodb');

-- Phrase search (PostgreSQL 9.6+)
SELECT title FROM app.posts
WHERE search_vector @@ phraseto_tsquery('english', 'getting started');

-- Highlight matched terms
SELECT
    ts_headline('english', body, to_tsquery('english', 'postgresql'),
        'StartSel=<mark>, StopSel=</mark>, MaxFragments=3') AS snippet
FROM app.posts
WHERE search_vector @@ to_tsquery('english', 'postgresql');

-- Fuzzy search with pg_trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_posts_title_trgm ON app.posts USING gin(title gin_trgm_ops);

-- Similarity search
SELECT title, similarity(title, 'postgre') AS sim
FROM app.posts
WHERE title % 'postgre'  -- uses trigram similarity threshold
ORDER BY sim DESC;`,
      codeLabel: 'Full-Text Search',
      keyPoints: [
        'tsvector + tsquery + @@ operator provide built-in full-text search.',
        'setweight() assigns relevance priority (A highest, D lowest) to different fields.',
        'pg_trgm extension enables fuzzy/similarity search with trigrams.',
        'GIN index on tsvector makes full-text search fast even on millions of rows.'
      ]
    },
    {
      title: 'Functions, Procedures & Triggers',
      image: '/images/postgresql/pg-functions.svg',
      content: `PostgreSQL supports **user-defined functions**, **stored procedures**, and **triggers** using multiple procedural languages.\n\n### Functions vs Procedures\n\n| Feature | Function | Procedure |\n|---------|----------|----------|\n| Returns value | Yes | No (but has OUT params) |\n| Transaction control | No (runs in caller's TX) | Yes (COMMIT/ROLLBACK) |\n| Called with | SELECT / FROM | CALL |\n| Available since | Always | PostgreSQL 11+ |\n\n### Procedural Languages\n\n- **PL/pgSQL** — Default, SQL-like syntax\n- **PL/Python** — Python functions inside PostgreSQL\n- **PL/V8** — JavaScript via V8 engine\n- **SQL** — Pure SQL functions (simplest, inline-optimizable)\n\n### Triggers\n\nTriggers automatically execute a function when a table event occurs:\n- **BEFORE / AFTER** — Timing\n- **INSERT / UPDATE / DELETE / TRUNCATE** — Event\n- **FOR EACH ROW / FOR EACH STATEMENT** — Granularity\n\nTriggers are powerful for **audit logging**, **data validation**, **computed fields**, and **cascading updates**.`,
      code: `-- SQL function (immutable, inline-optimizable)
CREATE OR REPLACE FUNCTION app.full_name(first TEXT, last TEXT)
RETURNS TEXT
LANGUAGE sql IMMUTABLE
AS $$ SELECT first || ' ' || last $$;

-- PL/pgSQL function with error handling
CREATE OR REPLACE FUNCTION app.create_user(
    p_username TEXT,
    p_email TEXT,
    p_password TEXT
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id BIGINT;
BEGIN
    INSERT INTO app.users (username, email, password)
    VALUES (p_username, p_email, crypt(p_password, gen_salt('bf')))
    RETURNING id INTO v_user_id;

    RETURN v_user_id;
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Username or email already exists';
END;
$$;

-- Stored procedure with transaction control
CREATE OR REPLACE PROCEDURE app.transfer_posts(
    from_user BIGINT,
    to_user BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE app.posts SET user_id = to_user WHERE user_id = from_user;
    UPDATE app.users SET is_active = false WHERE id = from_user;
    COMMIT;
END;
$$;

-- Call the procedure
CALL app.transfer_posts(1, 2);

-- Audit trigger
CREATE TABLE app.audit_log (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    table_name  TEXT NOT NULL,
    operation   TEXT NOT NULL,
    old_data    JSONB,
    new_data    JSONB,
    changed_by  TEXT DEFAULT current_user,
    changed_at  TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION app.audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO app.audit_log (table_name, operation, old_data, new_data)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END,
        CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_users_audit
AFTER INSERT OR UPDATE OR DELETE ON app.users
FOR EACH ROW EXECUTE FUNCTION app.audit_trigger();`,
      codeLabel: 'Functions, Procedures & Triggers',
      keyPoints: [
        'Functions return values (use in SELECT); procedures support COMMIT/ROLLBACK.',
        'Use LANGUAGE sql for simple functions — they are inline-optimizable.',
        'Triggers automate audit logging, validation, and computed field updates.',
        'PL/pgSQL exception blocks handle specific error conditions like unique_violation.'
      ]
    },
    {
      title: 'Table Partitioning',
      image: '/images/postgresql/pg-partitioning.svg',
      content: `**Table partitioning** splits a large table into smaller, physically separate sub-tables called **partitions**. PostgreSQL routes queries to only the relevant partitions, dramatically improving performance on large datasets.\n\n### Partitioning Strategies\n\n| Strategy | Description | Use Case |\n|----------|-------------|----------|\n| **RANGE** | Partition by value ranges | Time-series data (by month/year) |\n| **LIST** | Partition by explicit values | Multi-tenant (by tenant_id), by region |\n| **HASH** | Partition by hash of a column | Even distribution across N partitions |\n\n### When to Partition\n\n- Tables exceeding **10 million rows** or growing fast\n- Queries primarily filter on the **partition key**\n- Need to efficiently **drop old data** (detach partition instead of DELETE)\n- **Maintenance operations** (VACUUM, REINDEX) on smaller chunks\n\n### Partition Pruning\n\nPostgreSQL automatically **prunes** irrelevant partitions during query planning. This is enabled by default (\`enable_partition_pruning = on\`). Ensure your queries include the partition key in the WHERE clause.\n\n### Sub-Partitioning\n\nPartitions can themselves be partitioned (e.g., RANGE by year → LIST by region).`,
      code: `-- RANGE partitioning by date
CREATE TABLE app.events_partitioned (
    id          BIGINT GENERATED ALWAYS AS IDENTITY,
    event_type  TEXT NOT NULL,
    payload     JSONB NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE app.events_2025_01 PARTITION OF app.events_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE app.events_2025_02 PARTITION OF app.events_partitioned
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE app.events_2025_03 PARTITION OF app.events_partitioned
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- Default partition (catches unmatched rows)
CREATE TABLE app.events_default PARTITION OF app.events_partitioned DEFAULT;

-- LIST partitioning by tenant
CREATE TABLE app.tenant_data (
    id          BIGINT GENERATED ALWAYS AS IDENTITY,
    tenant_id   TEXT NOT NULL,
    data        JSONB NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
) PARTITION BY LIST (tenant_id);

CREATE TABLE app.tenant_acme PARTITION OF app.tenant_data
    FOR VALUES IN ('acme');
CREATE TABLE app.tenant_globex PARTITION OF app.tenant_data
    FOR VALUES IN ('globex');

-- HASH partitioning (even distribution)
CREATE TABLE app.sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     BIGINT NOT NULL,
    data        JSONB,
    created_at  TIMESTAMPTZ DEFAULT now()
) PARTITION BY HASH (id);

CREATE TABLE app.sessions_p0 PARTITION OF app.sessions
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE app.sessions_p1 PARTITION OF app.sessions
    FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE app.sessions_p2 PARTITION OF app.sessions
    FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE app.sessions_p3 PARTITION OF app.sessions
    FOR VALUES WITH (MODULUS 4, REMAINDER 3);

-- Detach old partitions (faster than DELETE)
ALTER TABLE app.events_partitioned
DETACH PARTITION app.events_2025_01;
DROP TABLE app.events_2025_01;  -- if no longer needed

-- Query with partition pruning
EXPLAIN ANALYZE
SELECT * FROM app.events_partitioned
WHERE created_at >= '2025-02-01' AND created_at < '2025-03-01';
-- Shows: Scan on events_2025_02 only`,
      codeLabel: 'Table Partitioning',
      keyPoints: [
        'RANGE partitioning is ideal for time-series; LIST for multi-tenant; HASH for even distribution.',
        'Detaching partitions is much faster than DELETE for removing old data.',
        'Partition pruning automatically skips irrelevant partitions in queries.',
        'Always include the partition key in WHERE to enable pruning.'
      ]
    },
    {
      title: 'Row Level Security (RLS)',
      image: '/images/postgresql/pg-rls.svg',
      content: `**Row Level Security** (RLS) lets you define policies that control which rows a user can see or modify. The database enforces these rules transparently — application code doesn't need to add WHERE clauses.\n\n### How RLS Works\n\n1. **Enable RLS** on a table: \`ALTER TABLE ... ENABLE ROW LEVEL SECURITY\`\n2. **Create policies** that define access rules for SELECT, INSERT, UPDATE, DELETE\n3. PostgreSQL automatically appends policy conditions to every query\n\n### Policy Types\n\n- **PERMISSIVE** (default) — Multiple permissive policies are OR'd together\n- **RESTRICTIVE** — AND'd with permissive policies (additional filter)\n\n### Use Cases\n\n- **Multi-tenant applications** — Each tenant sees only their own data\n- **Role-based access** — Admins see all; users see only their records\n- **Data privacy compliance** — GDPR, HIPAA\n- **Supabase** — RLS is the primary security mechanism in Supabase\n\n### Important Notes\n\n- Table owners **bypass RLS** by default. Use \`FORCE ROW LEVEL SECURITY\` to apply to owners too.\n- RLS works with **all SQL operations** including CTEs, views, and functions.\n- Combine with \`current_setting()\` to pass application context (e.g., tenant_id, user_id) from the app layer.`,
      code: `-- Enable RLS on the posts table
ALTER TABLE app.posts ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own posts
CREATE POLICY posts_select_own ON app.posts
    FOR SELECT
    USING (user_id = current_setting('app.current_user_id')::bigint);

-- Policy: users can only insert posts as themselves
CREATE POLICY posts_insert_own ON app.posts
    FOR INSERT
    WITH CHECK (user_id = current_setting('app.current_user_id')::bigint);

-- Policy: users can update only their own posts
CREATE POLICY posts_update_own ON app.posts
    FOR UPDATE
    USING (user_id = current_setting('app.current_user_id')::bigint)
    WITH CHECK (user_id = current_setting('app.current_user_id')::bigint);

-- Policy: users can delete only their own posts
CREATE POLICY posts_delete_own ON app.posts
    FOR DELETE
    USING (user_id = current_setting('app.current_user_id')::bigint);

-- Admin policy: admins can see everything
CREATE POLICY posts_admin ON app.posts
    FOR ALL
    USING (current_setting('app.current_role') = 'admin');

-- Multi-tenant RLS pattern
ALTER TABLE app.tenant_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON app.tenant_data
    FOR ALL
    USING (tenant_id = current_setting('app.tenant_id'))
    WITH CHECK (tenant_id = current_setting('app.tenant_id'));

-- Set context from application (in your connection setup)
SET app.current_user_id = '1';
SET app.current_role = 'user';
SET app.tenant_id = 'acme';

-- Now queries are automatically filtered
SELECT * FROM app.posts;       -- only user 1's posts
SELECT * FROM app.tenant_data; -- only acme's data

-- FORCE RLS on table owner too
ALTER TABLE app.posts FORCE ROW LEVEL SECURITY;

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'posts';`,
      codeLabel: 'Row Level Security',
      keyPoints: [
        'RLS enforces access control at the database level — no WHERE clauses needed in app code.',
        'USING controls which rows can be read; WITH CHECK controls which can be written.',
        'Use current_setting() to pass application context (user_id, tenant_id) to policies.',
        'Supabase uses RLS as its primary security model for client-side data access.'
      ]
    },
    {
      title: 'Transactions & Concurrency',
      image: '/images/postgresql/pg-transactions.svg',
      content: `PostgreSQL provides full **ACID** transaction support with **MVCC** (Multi-Version Concurrency Control) for high-performance concurrent access.\n\n### ACID Properties\n\n- **Atomicity** — All operations in a transaction succeed or all fail\n- **Consistency** — Database moves from one valid state to another\n- **Isolation** — Concurrent transactions don't interfere with each other\n- **Durability** — Committed data survives crashes\n\n### Isolation Levels\n\n| Level | Dirty Read | Nonrepeatable Read | Phantom Read | Serialization Anomaly |\n|-------|-----------|-------------------|-------------|----------------------|\n| READ COMMITTED (default) | No | Possible | Possible | Possible |\n| REPEATABLE READ | No | No | No* | Possible |\n| SERIALIZABLE | No | No | No | No |\n\n*PostgreSQL's REPEATABLE READ is actually snapshot isolation, which prevents phantom reads.\n\n### MVCC\n\nPostgreSQL uses **MVCC** instead of locking for reads. Each transaction sees a **snapshot** of the database at a point in time. Writers never block readers, and readers never block writers.\n\n### Advisory Locks\n\nFor application-level locking (e.g., preventing duplicate job execution), use PostgreSQL's **advisory locks**.`,
      code: `-- Basic transaction
BEGIN;
    INSERT INTO app.users (username, email, password)
    VALUES ('bob', 'bob@example.com', 'hashed');

    INSERT INTO app.posts (user_id, title)
    VALUES (currval('app.users_id_seq'), 'My First Post');
COMMIT;

-- Transaction with error handling
BEGIN;
    UPDATE app.users SET email = 'new@example.com' WHERE id = 1;
    -- If something goes wrong:
    -- ROLLBACK;
COMMIT;

-- Savepoints for partial rollback
BEGIN;
    INSERT INTO app.posts (user_id, title) VALUES (1, 'Post A');
    SAVEPOINT sp1;
    INSERT INTO app.posts (user_id, title) VALUES (1, 'Post B');
    -- Undo Post B only
    ROLLBACK TO sp1;
    INSERT INTO app.posts (user_id, title) VALUES (1, 'Post C');
COMMIT;  -- Post A and Post C are saved

-- Set isolation level
BEGIN ISOLATION LEVEL SERIALIZABLE;
    SELECT * FROM app.users WHERE username = 'alice';
    UPDATE app.users SET is_active = false WHERE username = 'alice';
COMMIT;

-- SELECT FOR UPDATE (pessimistic locking)
BEGIN;
    SELECT * FROM app.users WHERE id = 1 FOR UPDATE;
    -- Row is locked until COMMIT/ROLLBACK
    UPDATE app.users SET email = 'updated@example.com' WHERE id = 1;
COMMIT;

-- SKIP LOCKED (for job queues)
BEGIN;
    SELECT * FROM app.jobs
    WHERE status = 'pending'
    ORDER BY created_at
    LIMIT 1
    FOR UPDATE SKIP LOCKED;
    -- Process the job...
COMMIT;

-- Advisory locks
SELECT pg_advisory_lock(12345);      -- Acquire lock
-- Do exclusive work...
SELECT pg_advisory_unlock(12345);    -- Release lock

-- Try lock (non-blocking)
SELECT pg_try_advisory_lock(12345);  -- Returns true if acquired`,
      codeLabel: 'Transactions & Concurrency',
      keyPoints: [
        'PostgreSQL uses MVCC: readers never block writers and vice versa.',
        'Savepoints allow partial rollback within a transaction.',
        'FOR UPDATE SKIP LOCKED implements efficient job queue patterns.',
        'Advisory locks provide application-level locking without table row locks.'
      ]
    },
    {
      title: 'Backup, Recovery & Maintenance',
      image: '/images/postgresql/pg-backup.svg',
      content: `Regular backups and maintenance are essential for production PostgreSQL databases.\n\n### Backup Methods\n\n| Method | Type | Speed | Point-in-Time | Use Case |\n|--------|------|-------|---------------|----------|\n| \`pg_dump\` | Logical | Medium | No | Single database, cross-version migration |\n| \`pg_dumpall\` | Logical | Slow | No | All databases + roles + tablespaces |\n| \`pg_basebackup\` | Physical | Fast | Yes (with WAL) | Full cluster backup, replication setup |\n| **WAL Archiving** | Continuous | Fast | Yes | Point-in-time recovery (PITR) |\n\n### Maintenance Tasks\n\n- **VACUUM** — Reclaims dead tuple space. **Autovacuum** runs automatically but can be tuned.\n- **ANALYZE** — Updates table statistics for the query planner.\n- **REINDEX** — Rebuilds bloated indexes.\n- **pg_repack** — Reorganize tables without long-held locks.\n\n### Write-Ahead Logging (WAL)\n\nPostgreSQL writes all changes to the **WAL** before applying them. This ensures crash recovery. WAL archiving combined with base backups enables **Point-in-Time Recovery** (PITR) — restore to any second in time.\n\n### Monitoring\n\nKey system views for monitoring:\n- \`pg_stat_activity\` — Active connections and queries\n- \`pg_stat_user_tables\` — Table access statistics\n- \`pg_stat_user_indexes\` — Index usage\n- \`pg_stat_bgwriter\` — Background writer statistics`,
      code: `# --- Backup Commands ---

# Logical backup (single database)
pg_dump -U admin -d myapp -F custom -f myapp_backup.dump

# Logical backup (SQL format, portable)
pg_dump -U admin -d myapp --clean --if-exists -f myapp_backup.sql

# Backup specific tables
pg_dump -U admin -d myapp -t app.users -t app.posts -F custom -f tables.dump

# Backup all databases + roles
pg_dumpall -U admin -f full_cluster.sql

# Physical backup
pg_basebackup -U replication -D /backups/base -Ft -z -P

# --- Restore Commands ---

# Restore from custom format
pg_restore -U admin -d myapp --clean --if-exists myapp_backup.dump

# Restore from SQL
psql -U admin -d myapp -f myapp_backup.sql

# --- Maintenance ---

-- Manual VACUUM
VACUUM (VERBOSE) app.posts;
VACUUM (FULL) app.posts;        -- Rewrites table, requires exclusive lock
VACUUM (ANALYZE) app.posts;     -- VACUUM + update statistics

-- Update statistics only
ANALYZE app.posts;

-- Rebuild indexes
REINDEX INDEX CONCURRENTLY idx_posts_user_id;
REINDEX TABLE CONCURRENTLY app.posts;

-- Check table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_table_size(schemaname||'.'||tablename)) AS data_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'app'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor active queries
SELECT pid, state, query_start, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' AND query NOT ILIKE '%pg_stat_activity%'
ORDER BY duration DESC;

-- Kill a long-running query
SELECT pg_cancel_backend(pid);     -- Graceful
SELECT pg_terminate_backend(pid);  -- Force`,
      codeLabel: 'Backup & Maintenance',
      keyPoints: [
        'pg_dump for logical backups; pg_basebackup + WAL archiving for point-in-time recovery.',
        'Autovacuum runs automatically but may need tuning for high-write tables.',
        'REINDEX CONCURRENTLY rebuilds indexes without blocking writes.',
        'Monitor pg_stat_activity and pg_stat_user_tables for performance insights.'
      ]
    },
    {
      title: 'Extensions & Advanced Features',
      image: '/images/postgresql/pg-extensions.svg',
      content: `PostgreSQL's **extension system** is one of its greatest strengths. Extensions add new data types, operators, functions, and index methods without modifying the core.\n\n### Popular Extensions\n\n| Extension | Purpose |\n|-----------|--------|\n| \`pg_trgm\` | Trigram-based fuzzy search and similarity matching |\n| \`pgcrypto\` | Cryptographic functions (hashing, encryption) |\n| \`uuid-ossp\` | UUID generation functions |\n| \`pg_stat_statements\` | Track execution statistics of all SQL statements |\n| \`PostGIS\` | Geographic/spatial data and queries |\n| \`pgvector\` | Vector similarity search for AI/ML embeddings |\n| \`pg_cron\` | Cron-based job scheduling inside PostgreSQL |\n| \`hstore\` | Key-value store data type |\n| \`citext\` | Case-insensitive text type |\n| \`tablefunc\` | Crosstab / pivot table functions |\n\n### pgvector for AI/ML\n\n**pgvector** adds a \`vector\` data type and distance operators for **semantic search**, **recommendation engines**, and **RAG** (Retrieval-Augmented Generation) applications.\n\n### pg_stat_statements\n\nThe most important extension for **performance monitoring**. It tracks the total time, calls, rows, and buffer usage for every distinct query.`,
      code: `-- Install extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- pgcrypto: password hashing
INSERT INTO app.users (username, email, password)
VALUES ('charlie', 'charlie@example.com', crypt('mypass', gen_salt('bf', 12)));

-- Verify password
SELECT id, username
FROM app.users
WHERE email = 'charlie@example.com'
  AND password = crypt('mypass', password);

-- uuid-ossp
SELECT uuid_generate_v4();  -- Random UUID

-- pg_trgm: fuzzy search
SELECT title, similarity(title, 'postgrsql') AS sim  -- typo intentional
FROM app.posts
WHERE similarity(title, 'postgrsql') > 0.3
ORDER BY sim DESC;

-- pgvector: semantic search
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE app.documents (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content     TEXT NOT NULL,
    embedding   vector(1536)  -- OpenAI ada-002 dimension
);

-- Create HNSW index (faster than IVFFlat for most cases)
CREATE INDEX idx_docs_embedding ON app.documents
USING hnsw (embedding vector_cosine_ops);

-- Nearest neighbor search
SELECT content, embedding <=> '[0.1, 0.2, ...]'::vector AS distance
FROM app.documents
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 5;

-- pg_stat_statements: find slow queries
SELECT
    calls,
    round(total_exec_time::numeric, 2) AS total_ms,
    round(mean_exec_time::numeric, 2) AS avg_ms,
    rows,
    LEFT(query, 80) AS query_preview
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- pg_cron: schedule jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('nightly-cleanup', '0 3 * * *',
    $$DELETE FROM app.audit_log WHERE changed_at < now() - INTERVAL '90 days'$$
);`,
      codeLabel: 'Extensions & Advanced Features',
      keyPoints: [
        'Extensions add powerful features without modifying PostgreSQL core.',
        'pgvector enables AI/ML semantic search with vector similarity operators.',
        'pg_stat_statements is essential for identifying slow queries in production.',
        'pg_trgm provides fuzzy matching for search-as-you-type and typo tolerance.'
      ]
    },
    {
      title: 'Supabase Cloud Setup',
      image: '/images/postgresql/pg-supabase.svg',
      content: `**Supabase** is an open-source **Firebase alternative** built on top of PostgreSQL. It provides a managed PostgreSQL database with built-in authentication, real-time subscriptions, storage, edge functions, and auto-generated REST/GraphQL APIs.\n\n### Why Supabase?\n\n- **Full PostgreSQL** — Not a subset. You get extensions, RLS, functions, triggers, everything.\n- **Auto-generated APIs** — RESTful API via **PostgREST** and **GraphQL** instantly from your schema.\n- **Real-time** — Subscribe to database changes via WebSockets.\n- **Auth** — Built-in email/password, OAuth (Google, GitHub, etc.), magic links, and MFA.\n- **Storage** — S3-compatible file storage with RLS policies.\n- **Edge Functions** — Deno-based serverless functions.\n\n### Getting Started\n\n1. Sign up at **supabase.com**\n2. Create a new project (choose region, set database password)\n3. Use the **SQL Editor** to run queries directly\n4. Connect via **psql**, **pgAdmin**, or any PostgreSQL client\n5. Use the auto-generated API with your project URL and anon key\n\n### Connection Options\n\n- **Direct connection** — Standard PostgreSQL connection string (port 5432)\n- **Connection pooling** — Via Supavisor (port 6543), recommended for serverless\n- **Supabase Client Library** — JavaScript, Python, Flutter, Swift, Kotlin SDKs\n\n### Supabase + RLS\n\nSupabase uses **Row Level Security** as its primary security model. The \`anon\` and \`authenticated\` roles are mapped to JWT claims, letting you secure data access directly in PostgreSQL policies.`,
      code: `-- ===== Supabase SQL Editor Setup =====

-- 1. Create your schema
CREATE TABLE public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username    TEXT UNIQUE NOT NULL,
    full_name   TEXT,
    avatar_url  TEXT,
    bio         TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.todos (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    completed   BOOLEAN DEFAULT false,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS (required for Supabase security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
-- Profiles: anyone can read, users update their own
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Todos: users manage only their own
CREATE POLICY "Users can view own todos"
ON public.todos FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own todos"
ON public.todos FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
ON public.todos FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
ON public.todos FOR DELETE USING (auth.uid() = user_id);

-- 4. Auto-create profile on signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Enable real-time for a table
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;

-- ===== JavaScript Client =====
-- npm install @supabase/supabase-js
--
-- import { createClient } from '@supabase/supabase-js'
-- const supabase = createClient(
--   'https://YOUR_PROJECT.supabase.co',
--   'YOUR_ANON_KEY'
-- )
--
-- // Sign up
-- const { data, error } = await supabase.auth.signUp({
--   email: 'user@example.com',
--   password: 'password123',
--   options: { data: { username: 'alice', full_name: 'Alice Smith' } }
-- })
--
-- // Insert a todo (RLS ensures user_id matches)
-- const { data: todo } = await supabase
--   .from('todos')
--   .insert({ title: 'Learn PostgreSQL', user_id: user.id })
--   .select()
--
-- // Query with filters
-- const { data: todos } = await supabase
--   .from('todos')
--   .select('*')
--   .eq('completed', false)
--   .order('created_at', { ascending: false })
--
-- // Real-time subscription
-- supabase.channel('todos')
--   .on('postgres_changes',
--     { event: '*', schema: 'public', table: 'todos' },
--     (payload) => console.log('Change:', payload)
--   )
--   .subscribe()`,
      codeLabel: 'Supabase Setup & Configuration',
      keyPoints: [
        'Supabase is a managed PostgreSQL with auth, real-time, storage, and auto-generated APIs.',
        'RLS is mandatory in Supabase — use auth.uid() in policies for user-scoped access.',
        'Connection pooling (port 6543) is recommended for serverless and edge deployments.',
        'Real-time subscriptions use ALTER PUBLICATION to enable change tracking on tables.'
      ]
    },
    {
      title: 'Performance Tuning & Optimization',
      image: '/images/postgresql/pg-performance.svg',
      content: `Performance tuning in PostgreSQL involves **query optimization**, **configuration tuning**, **connection management**, and **monitoring**.\n\n### Query Optimization Checklist\n\n1. Run \`EXPLAIN ANALYZE\` to understand query plans\n2. Look for **Seq Scans** on large tables — add indexes\n3. Check for **nested loop joins** on large datasets — consider Hash or Merge joins\n4. Avoid \`SELECT *\` — select only needed columns\n5. Use **covering indexes** for index-only scans\n6. Optimize \`ORDER BY\` + \`LIMIT\` with matching index sort order\n7. Replace correlated subqueries with **JOINs** or **LATERAL**\n\n### Key Configuration Parameters\n\n| Parameter | Purpose | Typical Value |\n|-----------|---------|---------------|\n| \`shared_buffers\` | Shared memory cache | 25% of RAM |\n| \`effective_cache_size\` | Planner's estimate of OS cache | 50–75% of RAM |\n| \`work_mem\` | Per-operation memory (sorts, hashes) | 16–256 MB |\n| \`maintenance_work_mem\` | VACUUM, CREATE INDEX | 256 MB–1 GB |\n| \`random_page_cost\` | SSD vs HDD tuning | 1.1 (SSD) / 4.0 (HDD) |\n| \`max_connections\` | Max client connections | 100–200 (use pooler) |\n| \`wal_buffers\` | WAL write buffer | 64 MB |\n\n### Connection Pooling\n\nPostgreSQL creates a **process per connection** (unlike thread-per-connection in MySQL). For high-concurrency apps, use **PgBouncer** or **Supavisor** as a connection pooler.\n\n### EXPLAIN Output\n\nKey metrics in EXPLAIN ANALYZE:\n- **actual time** — Execution time in ms\n- **rows** — Actual rows processed\n- **loops** — Number of times the node ran\n- **Buffers: shared hit/read** — Cache hit ratio`,
      code: `-- EXPLAIN ANALYZE: understand query plans
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.username, COUNT(p.id)
FROM app.users u
JOIN app.posts p ON p.user_id = u.id
WHERE u.is_active = true
GROUP BY u.username;

-- Check if index is used
EXPLAIN ANALYZE
SELECT * FROM app.users WHERE LOWER(email) = 'alice@example.com';

-- Look for slow queries (pg_stat_statements)
SELECT
    LEFT(query, 100) AS query,
    calls,
    round(mean_exec_time::numeric, 2) AS avg_ms,
    round(total_exec_time::numeric, 2) AS total_ms,
    rows
FROM pg_stat_statements
WHERE mean_exec_time > 100  -- queries averaging >100ms
ORDER BY total_exec_time DESC
LIMIT 20;

-- Table bloat check
SELECT
    schemaname, tablename,
    n_dead_tup,
    n_live_tup,
    round(n_dead_tup * 100.0 / NULLIF(n_live_tup, 0), 1) AS dead_pct,
    last_autovacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;

-- Cache hit ratio (should be > 99%)
SELECT
    sum(heap_blks_hit) AS hits,
    sum(heap_blks_read) AS reads,
    round(sum(heap_blks_hit) * 100.0 /
        NULLIF(sum(heap_blks_hit) + sum(heap_blks_read), 0), 2) AS hit_ratio
FROM pg_statio_user_tables;

-- Index hit ratio
SELECT
    indexrelname,
    idx_blks_hit,
    idx_blks_read,
    round(idx_blks_hit * 100.0 /
        NULLIF(idx_blks_hit + idx_blks_read, 0), 2) AS hit_ratio
FROM pg_statio_user_indexes
WHERE schemaname = 'app';

-- Configuration tuning (postgresql.conf)
-- shared_buffers = '4GB'          -- 25% of 16GB RAM
-- effective_cache_size = '12GB'   -- 75% of RAM
-- work_mem = '64MB'               -- Per sort/hash operation
-- maintenance_work_mem = '512MB'  -- VACUUM, CREATE INDEX
-- random_page_cost = 1.1          -- SSD storage
-- wal_buffers = '64MB'
-- max_connections = 200
-- max_worker_processes = 8
-- max_parallel_workers = 4

-- PgBouncer configuration (pgbouncer.ini)
-- [databases]
-- myapp = host=localhost port=5432 dbname=myapp
--
-- [pgbouncer]
-- pool_mode = transaction
-- max_client_conn = 1000
-- default_pool_size = 25
-- reserve_pool_size = 5`,
      codeLabel: 'Performance Tuning',
      keyPoints: [
        'Always use EXPLAIN ANALYZE to diagnose slow queries before adding indexes.',
        'Set shared_buffers to ~25% of RAM; effective_cache_size to ~75%.',
        'Use PgBouncer or Supavisor for connection pooling in production.',
        'Cache hit ratio should be above 99%; check with pg_statio_user_tables.'
      ]
    },
    {
      title: 'Security Best Practices',
      image: '/images/postgresql/pg-security.svg',
      content: `Security in PostgreSQL involves **authentication**, **authorization**, **encryption**, and **hardening** at multiple layers.\n\n### Authentication (pg_hba.conf)\n\nThe \`pg_hba.conf\` file controls who can connect and how they authenticate:\n\n| Method | Description |\n|--------|------------|\n| \`scram-sha-256\` | Recommended password auth (PostgreSQL 10+) |\n| \`md5\` | Legacy password hash (avoid for new setups) |\n| \`cert\` | Client certificate authentication |\n| \`peer\` / \`ident\` | OS user matching (local connections) |\n| \`reject\` | Deny connection |\n\n### Authorization (GRANT/REVOKE)\n\nPostgreSQL uses a **role-based** permission system. Roles can own objects, have login privileges, and inherit permissions from other roles.\n\n### Encryption\n\n- **In transit** — SSL/TLS connections (\`ssl = on\` in postgresql.conf)\n- **At rest** — OS-level disk encryption or \`pgcrypto\` for column-level\n- **Passwords** — Always use \`crypt() + gen_salt()\` from pgcrypto\n\n### Hardening Checklist\n\n✅ Use \`scram-sha-256\` authentication\n✅ Enable SSL/TLS for all connections\n✅ Apply principle of least privilege with GRANT/REVOKE\n✅ Enable RLS for multi-tenant applications\n✅ Use parameterized queries (prevent SQL injection)\n✅ Restrict \`pg_hba.conf\` to known IP ranges\n✅ Disable \`trust\` authentication in production`,
      code: `-- Create roles with least privilege
CREATE ROLE app_readonly;
GRANT CONNECT ON DATABASE myapp TO app_readonly;
GRANT USAGE ON SCHEMA app TO app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA app TO app_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA app
    GRANT SELECT ON TABLES TO app_readonly;

CREATE ROLE app_readwrite;
GRANT CONNECT ON DATABASE myapp TO app_readwrite;
GRANT USAGE ON SCHEMA app TO app_readwrite;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_readwrite;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA app TO app_readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA app
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_readwrite;

-- Create login users inheriting from roles
CREATE USER api_user WITH PASSWORD 'strong_password_here' LOGIN;
GRANT app_readwrite TO api_user;

CREATE USER report_user WITH PASSWORD 'another_strong_pass' LOGIN;
GRANT app_readonly TO report_user;

-- Revoke public access (security hardening)
REVOKE ALL ON DATABASE myapp FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- SSL configuration (postgresql.conf)
-- ssl = on
-- ssl_cert_file = '/path/to/server.crt'
-- ssl_key_file = '/path/to/server.key'
-- ssl_ca_file = '/path/to/ca.crt'

-- pg_hba.conf entries
-- TYPE  DATABASE  USER        ADDRESS         METHOD
-- local all       postgres                    peer
-- host  myapp     api_user    10.0.0.0/8      scram-sha-256
-- host  myapp     report_user 10.0.0.0/8      scram-sha-256
-- host  all       all         0.0.0.0/0       reject

-- Audit user activity
SELECT
    usename, client_addr, application_name,
    backend_start, state, query
FROM pg_stat_activity
WHERE usename NOT IN ('postgres')
ORDER BY backend_start DESC;

-- Check granted permissions
SELECT
    grantee, table_schema, table_name,
    string_agg(privilege_type, ', ') AS privileges
FROM information_schema.table_privileges
WHERE table_schema = 'app'
GROUP BY grantee, table_schema, table_name
ORDER BY grantee, table_name;`,
      codeLabel: 'Security Configuration',
      keyPoints: [
        'Use scram-sha-256 authentication and SSL/TLS in production.',
        'Apply least privilege: create roles for read-only and read-write access.',
        'Revoke PUBLIC access on databases and schemas by default.',
        'Use pg_hba.conf to restrict connections to known IP ranges.'
      ]
    },
    {
      title: 'Replication & High Availability',
      image: '/images/postgresql/pg-replication.svg',
      content: `PostgreSQL supports multiple **replication** strategies for high availability, read scaling, and disaster recovery.\n\n### Replication Types\n\n| Type | Description | Use Case |\n|------|-------------|----------|\n| **Streaming Replication** | Physical byte-for-byte copy via WAL | HA standby, failover |\n| **Logical Replication** | Replicates changes at row level | Selective tables, cross-version |\n| **Synchronous** | Primary waits for standby confirmation | Zero data loss |\n| **Asynchronous** | Primary doesn't wait | Better write performance |\n\n### Streaming Replication\n\nThe most common setup. The **primary** streams WAL records to one or more **standbys**. Standbys can serve read-only queries (hot standby).\n\n### Logical Replication\n\nUses a **publication/subscription** model. The publisher defines which tables to replicate; subscribers consume changes. Useful for:\n- Replicating specific tables\n- Cross-version upgrades\n- Multi-master setups (with care)\n\n### Failover\n\nAutomatic failover tools:\n- **Patroni** — Industry-standard HA solution with etcd/consul\n- **pg_auto_failover** — Simpler alternative from Citus\n- **repmgr** — Replication manager with monitoring`,
      code: `-- ===== Streaming Replication Setup =====

-- On PRIMARY: postgresql.conf
-- wal_level = replica
-- max_wal_senders = 10
-- wal_keep_size = '1GB'
-- synchronous_standby_names = ''  # async by default

-- On PRIMARY: pg_hba.conf
-- host replication repl_user 10.0.0.0/8 scram-sha-256

-- On PRIMARY: create replication role
CREATE ROLE repl_user WITH REPLICATION LOGIN PASSWORD 'repl_password';

-- On STANDBY: create base backup
-- pg_basebackup -h primary-host -U repl_user -D /var/lib/postgresql/16/main -Fp -Xs -P

-- On STANDBY: create standby.signal
-- touch /var/lib/postgresql/16/main/standby.signal

-- On STANDBY: postgresql.conf
-- primary_conninfo = 'host=primary-host user=repl_user password=repl_password'
-- hot_standby = on

-- ===== Logical Replication =====

-- On PUBLISHER: postgresql.conf
-- wal_level = logical

-- On PUBLISHER: create publication
CREATE PUBLICATION my_pub FOR TABLE app.users, app.posts;

-- Or publish all tables
CREATE PUBLICATION all_tables_pub FOR ALL TABLES;

-- On SUBSCRIBER: create subscription
CREATE SUBSCRIPTION my_sub
CONNECTION 'host=publisher-host dbname=myapp user=repl_user password=repl_password'
PUBLICATION my_pub;

-- Monitor replication status (on PRIMARY)
SELECT
    client_addr,
    state,
    sent_lsn,
    write_lsn,
    flush_lsn,
    replay_lsn,
    pg_wal_lsn_diff(sent_lsn, replay_lsn) AS lag_bytes
FROM pg_stat_replication;

-- Monitor subscription (on SUBSCRIBER)
SELECT * FROM pg_stat_subscription;

-- Check replication slots
SELECT slot_name, slot_type, active, restart_lsn
FROM pg_replication_slots;`,
      codeLabel: 'Replication Setup',
      keyPoints: [
        'Streaming replication provides byte-for-byte standby copies for HA.',
        'Logical replication uses pub/sub model for selective, cross-version replication.',
        'Use Patroni or pg_auto_failover for automatic failover in production.',
        'Monitor pg_stat_replication to track replication lag.'
      ]
    },
    {
      title: 'PostgreSQL with Application Frameworks',
      image: '/images/postgresql/pg-frameworks.svg',
      content: `PostgreSQL integrates with all major application frameworks and programming languages through well-maintained drivers and ORMs.\n\n### Connection Libraries\n\n| Language | Driver / ORM |\n|----------|-------------|\n| **Node.js** | \`pg\` (node-postgres), Prisma, Drizzle, Knex, TypeORM, Sequelize |\n| **Python** | \`psycopg2\`, \`asyncpg\`, SQLAlchemy, Django ORM |\n| **Java** | JDBC, Hibernate, Spring Data JPA |\n| **C# / .NET** | Npgsql, Entity Framework Core, Dapper |\n| **Go** | \`pgx\`, GORM, sqlx |\n| **Ruby** | \`pg\` gem, ActiveRecord (Rails) |\n| **Rust** | \`tokio-postgres\`, Diesel, SQLx |\n\n### Connection String Format\n\n\`postgresql://user:password@host:5432/database?sslmode=require\`\n\n### Best Practices\n\n- Always use **parameterized queries** to prevent SQL injection\n- Use **connection pooling** (PgBouncer, built-in pool, or framework pool)\n- Set **statement timeouts** to prevent runaway queries\n- Use **migrations** (Prisma Migrate, Alembic, Flyway, EF Migrations) for schema changes\n- Enable **SSL** in production connections`,
      code: `// ===== Node.js with pg (node-postgres) =====
import pg from 'pg';
const pool = new pg.Pool({
  connectionString: 'postgresql://admin:secret@localhost:5432/myapp',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false
});

// Parameterized query (safe from SQL injection)
const { rows } = await pool.query(
  'SELECT id, username FROM app.users WHERE email = $1',
  ['alice@example.com']
);

// Transaction
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const userRes = await client.query(
    'INSERT INTO app.users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
    ['bob', 'bob@example.com', 'hashed']
  );
  await client.query(
    'INSERT INTO app.posts (user_id, title) VALUES ($1, $2)',
    [userRes.rows[0].id, 'Hello World']
  );
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}

# ===== Python with psycopg2 =====
# import psycopg2
# from psycopg2.extras import RealDictCursor
#
# conn = psycopg2.connect(
#     "postgresql://admin:secret@localhost:5432/myapp"
# )
# with conn.cursor(cursor_factory=RealDictCursor) as cur:
#     cur.execute(
#         "SELECT * FROM app.users WHERE email = %s",
#         ("alice@example.com",)
#     )
#     user = cur.fetchone()
# conn.close()

# ===== Python with SQLAlchemy =====
# from sqlalchemy import create_engine, text
# engine = create_engine("postgresql://admin:secret@localhost:5432/myapp")
# with engine.connect() as conn:
#     result = conn.execute(text("SELECT * FROM app.users WHERE id = :id"), {"id": 1})`,
      codeLabel: 'Application Integration',
      keyPoints: [
        'Always use parameterized queries ($1, %s, :param) to prevent SQL injection.',
        'Use connection pools to manage database connections efficiently.',
        'Enable SSL and set statement timeouts in production environments.',
        'Use database migrations instead of manual DDL for schema changes.'
      ]
    }
  ]
};

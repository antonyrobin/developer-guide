/*
 * SQL course extension — extra sections and worked examples merged into
 * courses-data/sql.js at load time. Examples are SQLite-compatible so they run
 * unchanged in the Playground; dialect differences are noted in the text.
 */

// Small sample schema prepended to examples so each one runs on its own.
const HR = `-- Sample data -------------------------------------------------
CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  dept_id INTEGER REFERENCES departments(id),
  manager_id INTEGER REFERENCES employees(id),
  salary REAL NOT NULL,
  hired_on TEXT NOT NULL
);
INSERT INTO departments VALUES (1, 'Engineering'), (2, 'Sales'), (3, 'Marketing'), (4, 'Legal');
INSERT INTO employees VALUES
  (1, 'Alice',   1, NULL, 150000, '2018-03-01'),
  (2, 'Bob',     1, 1,     98000, '2020-07-15'),
  (3, 'Charlie', 1, 1,    112000, '2019-11-04'),
  (4, 'Diana',   2, NULL,  91000, '2017-01-20'),
  (5, 'Eve',     2, 4,     67000, '2022-05-09'),
  (6, 'Frank',   3, NULL,  73000, '2021-02-28'),
  (7, 'Grace',   2, 4,     67000, '2023-09-01');
-- ---------------------------------------------------------------
`;

const SHOP = `-- Sample data -------------------------------------------------
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, ordered_on TEXT, total REAL);
INSERT INTO customers VALUES (1, 'Ana', 'Lisbon'), (2, 'Ben', 'Berlin'), (3, 'Cy', 'Lisbon'), (4, 'Dee', 'Paris');
INSERT INTO orders VALUES
  (1, 1, '2026-01-05', 120), (2, 1, '2026-02-11', 80), (3, 2, '2026-02-14', 300),
  (4, 3, '2026-03-01', 45),  (5, 1, '2026-03-20', 60), (6, 2, '2026-04-02', 150);
-- ---------------------------------------------------------------
`;

export default {
  examples: {
    'CRUD Operations & Filtering': [
      {
        title: 'Filtering operators in one place',
        language: 'sql',
        code: HR + `
SELECT name, salary, hired_on
FROM employees
WHERE salary BETWEEN 70000 AND 120000      -- inclusive range
  AND name LIKE '%a%'                      -- % any chars, _ one char
  AND dept_id IN (1, 2)
  AND manager_id IS NOT NULL               -- never "= NULL"
ORDER BY salary DESC, name
LIMIT 5 OFFSET 0;                          -- SQL Server: OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY`,
      },
      {
        title: 'UPDATE / DELETE safely and UPSERT',
        language: 'sql',
        explanation: 'Always run the `WHERE` clause as a `SELECT` first. An `UPDATE` or `DELETE` without `WHERE` changes **every row**.',
        code: HR + `
-- 1. Preview the rows you are about to change
SELECT id, name, salary FROM employees WHERE dept_id = 2;

-- 2. Give Sales a 5% raise
UPDATE employees SET salary = ROUND(salary * 1.05) WHERE dept_id = 2;

-- 3. Delete with a subquery condition
DELETE FROM employees WHERE hired_on > '2023-01-01';

-- 4. Upsert: insert or update on key conflict (SQLite/PostgreSQL syntax; MySQL: ON DUPLICATE KEY UPDATE)
INSERT INTO departments (id, name) VALUES (4, 'Legal & Compliance')
ON CONFLICT(id) DO UPDATE SET name = excluded.name;

SELECT * FROM departments;
SELECT name, salary FROM employees WHERE dept_id = 2;`,
      },
    ],
    'JOINs, Self Joins & Relationships': [
      {
        title: 'Every JOIN type on the same data',
        language: 'sql',
        code: HR + `
-- INNER: only employees with a department
SELECT e.name, d.name AS dept
FROM employees e
JOIN departments d ON d.id = e.dept_id;

-- LEFT: every department, even with no employees (Legal)
SELECT d.name AS dept, COUNT(e.id) AS headcount
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
GROUP BY d.id
ORDER BY headcount DESC;

-- Anti-join: departments WITHOUT employees
SELECT d.name FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
WHERE e.id IS NULL;

-- SELF JOIN: employee and their manager
SELECT e.name AS employee, COALESCE(m.name, '— none —') AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;

-- CROSS JOIN: every combination (use with care)
SELECT d.name, s.size FROM departments d CROSS JOIN (SELECT 'S' AS size UNION ALL SELECT 'M') s LIMIT 4;`,
      },
    ],
    'Indexes & Performance Tuning': [
      {
        title: 'Read the query plan',
        language: 'sql',
        explanation: 'Use `EXPLAIN QUERY PLAN` (SQLite), `EXPLAIN ANALYZE` (PostgreSQL/MySQL) or the actual execution plan (SQL Server) to confirm an index is used. Watch for **SCAN** (full table scan) vs **SEARCH … USING INDEX**.',
        code: HR + `
EXPLAIN QUERY PLAN SELECT * FROM employees WHERE dept_id = 1 AND salary > 100000;

-- Composite index: equality column first, then range column
CREATE INDEX idx_emp_dept_salary ON employees (dept_id, salary);

EXPLAIN QUERY PLAN SELECT * FROM employees WHERE dept_id = 1 AND salary > 100000;

-- Function on the column defeats the index ("non-sargable")
EXPLAIN QUERY PLAN SELECT * FROM employees WHERE dept_id + 0 = 1;`,
      },
    ],
    'CTE (Common Table Expression)': [
      {
        title: 'Recursive CTE: org chart & date series',
        language: 'sql',
        code: HR + `
-- Walk the management hierarchy from the top
WITH RECURSIVE org(id, name, manager_id, depth, path) AS (
  SELECT id, name, manager_id, 0, name
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, org.depth + 1, org.path || ' > ' || e.name
  FROM employees e
  JOIN org ON e.manager_id = org.id
)
SELECT substr('        ', 1, depth * 2) || name AS tree, path FROM org ORDER BY path;

-- Generate a calendar of dates (fill gaps in reports)
WITH RECURSIVE days(d) AS (
  SELECT date('2026-01-01')
  UNION ALL
  SELECT date(d, '+1 day') FROM days WHERE d < '2026-01-07'
)
SELECT d, strftime('%w', d) AS weekday FROM days;`,
      },
    ],
  },

  sections: [
    {
      title: 'SQL Commands: DDL, DQL, DML, DCL & TCL',
      after: 'What is SQL',
      image: '/images/sql/sql-commands.svg',
      content: `Every SQL statement belongs to one of five command groups. Knowing the group tells you **what the statement touches** and **how it behaves in a transaction**.

| Group | Stands for | Acts on | Commands |
|---|---|---|---|
| **DDL** | Data Definition Language | structure (tables, views, indexes) | \`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\`, \`RENAME\`, \`COMMENT\` |
| **DQL** | Data Query Language | reads rows | \`SELECT\` (with \`FROM\`, \`WHERE\`, \`JOIN\`, \`GROUP BY\`, \`HAVING\`, \`ORDER BY\`) |
| **DML** | Data Manipulation Language | changes rows | \`INSERT\`, \`UPDATE\`, \`DELETE\`, \`MERGE\` / upsert |
| **DCL** | Data Control Language | permissions | \`GRANT\`, \`REVOKE\` (\`DENY\` in SQL Server) |
| **TCL** | Transaction Control Language | units of work | \`BEGIN\`, \`COMMIT\`, \`ROLLBACK\`, \`SAVEPOINT\` |

Some books fold \`SELECT\` into DML; separating it as DQL makes the read/write split clearer.

### DELETE vs TRUNCATE vs DROP

| | \`DELETE\` (DML) | \`TRUNCATE\` (DDL) | \`DROP\` (DDL) |
|---|---|---|---|
| Removes | chosen rows (\`WHERE\`) | all rows | the whole table + its data |
| Table still exists | yes | yes | no |
| Fires row triggers | yes | no | no |
| Speed on big tables | slow (row by row, logged) | fast (deallocates pages) | fast |
| Resets identity | no | yes (most engines) | — |

### Transactions and DDL

DML is transactional everywhere. **DDL** auto-commits in Oracle and MySQL, but can be rolled back inside a transaction in PostgreSQL, SQL Server and SQLite.`,
      code: `-- DDL: define structure
CREATE TABLE accounts (
  id      INTEGER PRIMARY KEY,
  owner   TEXT NOT NULL,
  balance REAL NOT NULL CHECK (balance >= 0)
);
ALTER TABLE accounts ADD COLUMN currency TEXT DEFAULT 'EUR';
CREATE INDEX idx_accounts_owner ON accounts(owner);

-- DML: change data
INSERT INTO accounts (owner, balance) VALUES ('Ana', 500), ('Ben', 100), ('Cy', 0);
UPDATE accounts SET balance = balance + 50 WHERE owner = 'Cy';
DELETE FROM accounts WHERE balance = 0;              -- removes nothing: Cy now has 50

-- TCL: move money atomically
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 200 WHERE owner = 'Ana';
UPDATE accounts SET balance = balance + 200 WHERE owner = 'Ben';
SAVEPOINT before_fee;
UPDATE accounts SET balance = balance - 5 WHERE owner = 'Ben';
ROLLBACK TO before_fee;                              -- undo only the fee
COMMIT;

-- DQL: read data
SELECT owner, balance, currency
FROM accounts
WHERE balance > 0
ORDER BY balance DESC;

-- DCL (server databases such as PostgreSQL / SQL Server / MySQL; SQLite has no users):
-- GRANT SELECT, INSERT ON accounts TO reporting_app;
-- REVOKE INSERT ON accounts FROM reporting_app;

-- DDL: remove structure
DROP INDEX idx_accounts_owner;`,
      codeLabel: 'One example per command group',
      codeLanguage: 'sql',
      keyPoints: [
        'DDL defines structure, DQL reads, DML changes rows, DCL controls access, TCL groups work into transactions.',
        '`DELETE` removes chosen rows; `TRUNCATE` empties a table fast; `DROP` removes the table itself.',
        'Use `BEGIN` / `COMMIT` / `ROLLBACK` (and `SAVEPOINT`) so related changes succeed or fail together.',
        'DDL auto-commits in Oracle and MySQL but is transactional in PostgreSQL, SQL Server and SQLite.',
      ],
    },
    {
      title: 'Aggregates, GROUP BY & HAVING',
      after: 'CRUD Operations & Filtering',
      content: `Aggregate functions collapse many rows into one value: \`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\` (plus \`STRING_AGG\`/\`GROUP_CONCAT\` for text).

### Logical query order

SQL is **written** in one order but **evaluated** in another — this explains most GROUP BY errors:

| Step | Clause | Can use aggregates? |
|---|---|---|
| 1 | \`FROM\` / \`JOIN\` | — |
| 2 | \`WHERE\` | ❌ filters **rows** |
| 3 | \`GROUP BY\` | — |
| 4 | \`HAVING\` | ✅ filters **groups** |
| 5 | \`SELECT\` | ✅ |
| 6 | \`ORDER BY\` | ✅ (can use SELECT aliases) |
| 7 | \`LIMIT\` / \`OFFSET\` | — |

### Rules

- Every selected column must be either **in the GROUP BY** or **inside an aggregate**.
- \`COUNT(*)\` counts rows; \`COUNT(col)\` ignores NULLs; \`COUNT(DISTINCT col)\` counts unique values.
- Put row filters in \`WHERE\` (cheaper) and aggregate filters in \`HAVING\`.`,
      code: HR + `
SELECT d.name                       AS department,
       COUNT(*)                     AS employees,
       COUNT(e.manager_id)          AS with_manager,     -- NULLs not counted
       ROUND(AVG(e.salary))         AS avg_salary,
       MIN(e.hired_on)              AS first_hire,
       MAX(e.salary) - MIN(e.salary) AS salary_spread,
       GROUP_CONCAT(e.name, ', ')   AS people            -- STRING_AGG in PostgreSQL/SQL Server
FROM employees e
JOIN departments d ON d.id = e.dept_id
WHERE e.hired_on >= '2017-01-01'                         -- row filter
GROUP BY d.name
HAVING COUNT(*) >= 2                                     -- group filter
ORDER BY avg_salary DESC;

-- Conditional aggregation: pivot counts into columns
SELECT COUNT(*) AS total,
       SUM(CASE WHEN salary >= 100000 THEN 1 ELSE 0 END) AS six_figures,
       SUM(CASE WHEN hired_on >= '2021-01-01' THEN 1 ELSE 0 END) AS hired_since_2021
FROM employees;`,
      codeLabel: 'GROUP BY, HAVING and conditional aggregation',
      keyPoints: [
        'WHERE filters rows before grouping; HAVING filters groups after.',
        'Non-aggregated SELECT columns must appear in GROUP BY.',
        'COUNT(col) skips NULLs; COUNT(*) counts all rows.',
        'SUM(CASE WHEN …) pivots categories into columns.',
      ],
    },
    {
      title: 'Subqueries & EXISTS',
      after: 'JOINs, Self Joins & Relationships',
      content: `A **subquery** is a query nested inside another. Where it appears determines what it must return:

| Location | Returns | Example |
|---|---|---|
| \`WHERE x = (…)\` | single value (scalar) | salary above the company average |
| \`WHERE x IN (…)\` | a list | customers who ordered |
| \`WHERE EXISTS (…)\` | true/false | at least one matching row |
| \`FROM (…) AS t\` | a derived table | aggregate, then join |
| \`SELECT (…)\` | scalar per row | correlated lookup |

### Correlated subqueries

A subquery that references the outer query runs **once per outer row** — e.g. "employees earning above their *own department's* average". Often rewritable as a JOIN or window function for speed.

### EXISTS vs IN

\`EXISTS\` stops at the first match and handles NULLs safely. **Beware \`NOT IN\`**: if the subquery returns any NULL, \`NOT IN\` returns no rows — prefer \`NOT EXISTS\`.`,
      code: HR + `
-- Scalar: above company average
SELECT name, salary FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Correlated: above their own department's average
SELECT e.name, e.dept_id, e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(salary) FROM employees x WHERE x.dept_id = e.dept_id);

-- EXISTS / NOT EXISTS
SELECT d.name FROM departments d
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id);

-- Derived table: aggregate first, then filter/join
SELECT d.name, stats.avg_salary
FROM (SELECT dept_id, AVG(salary) AS avg_salary FROM employees GROUP BY dept_id) AS stats
JOIN departments d ON d.id = stats.dept_id
WHERE stats.avg_salary > 80000;

-- Scalar subquery in SELECT
SELECT name,
       salary,
       ROUND(salary * 100.0 / (SELECT SUM(salary) FROM employees), 1) AS pct_of_payroll
FROM employees
ORDER BY pct_of_payroll DESC;`,
      codeLabel: 'Scalar, correlated, EXISTS and derived-table subqueries',
      keyPoints: [
        'Subqueries can return a value, a list, a table or a boolean (EXISTS).',
        'Correlated subqueries run per outer row — consider JOINs or window functions.',
        'Prefer NOT EXISTS over NOT IN when NULLs are possible.',
        'Derived tables let you aggregate first, then join or filter.',
      ],
    },
    {
      title: 'CASE, NULL Handling & Common Functions',
      after: 'Subqueries & EXISTS',
      content: `### CASE expressions

\`CASE WHEN condition THEN value … ELSE value END\` adds if/else logic anywhere an expression is allowed: SELECT, ORDER BY, GROUP BY, even inside aggregates.

### NULL semantics

\`NULL\` means *unknown*. Any comparison with NULL (\`= NULL\`, \`<> NULL\`) is unknown, so those rows are filtered out.

| Need | Use |
|---|---|
| Test for NULL | \`IS NULL\` / \`IS NOT NULL\` |
| First non-null value | \`COALESCE(a, b, 'default')\` |
| Turn a value into NULL | \`NULLIF(x, 0)\` — avoids division by zero |
| NULL-safe equality | \`IS NOT DISTINCT FROM\` (PostgreSQL), \`IS\` (SQLite) |

### Function cheat sheet (dialects differ!)

| Purpose | SQLite | PostgreSQL | SQL Server | MySQL |
|---|---|---|---|---|
| Concatenate | \`a || b\` | \`a || b\`, \`CONCAT\` | \`a + b\`, \`CONCAT\` | \`CONCAT\` |
| Substring | \`substr\` | \`SUBSTRING\` | \`SUBSTRING\` | \`SUBSTRING\` |
| Current date | \`date('now')\` | \`CURRENT_DATE\` | \`GETDATE()\` | \`CURDATE()\` |
| Date part | \`strftime('%Y', d)\` | \`EXTRACT(YEAR FROM d)\` | \`YEAR(d)\` | \`YEAR(d)\` |
| Add days | \`date(d, '+7 day')\` | \`d + INTERVAL '7 day'\` | \`DATEADD(day, 7, d)\` | \`DATE_ADD(d, INTERVAL 7 DAY)\` |`,
      code: HR + `
SELECT name,
       salary,
       CASE
         WHEN salary >= 120000 THEN 'Senior'
         WHEN salary >= 90000  THEN 'Mid'
         ELSE 'Junior'
       END AS band,
       COALESCE(CAST(manager_id AS TEXT), 'top-level') AS reports_to,
       UPPER(substr(name, 1, 3)) || '-' || id          AS code,
       strftime('%Y', hired_on)                         AS hire_year,
       CAST(julianday('2026-10-25') - julianday(hired_on) AS INTEGER) / 365 AS years_employed
FROM employees
ORDER BY CASE WHEN manager_id IS NULL THEN 0 ELSE 1 END, salary DESC;   -- managers first

-- NULL traps
SELECT COUNT(*) AS eq_null      FROM employees WHERE manager_id = NULL;      -- 0 rows!
SELECT COUNT(*) AS is_null      FROM employees WHERE manager_id IS NULL;     -- correct
SELECT 100 / NULLIF(0, 0)       AS safe_division;                            -- NULL instead of error`,
      codeLabel: 'CASE, COALESCE, NULLIF and functions (SQLite dialect)',
      keyPoints: [
        'CASE works in SELECT, ORDER BY, GROUP BY and inside aggregates.',
        'Use IS NULL — comparisons with = NULL are never true.',
        'COALESCE supplies defaults; NULLIF prevents division by zero.',
        'String and date functions differ by database — check your dialect.',
      ],
    },
    {
      title: 'Transactions, ACID & Isolation',
      after: 'Stored Procedures',
      content: `A **transaction** groups statements into one all-or-nothing unit.

### ACID

| Property | Guarantee |
|---|---|
| **A**tomicity | All statements succeed or none do (\`ROLLBACK\`) |
| **C**onsistency | Constraints hold before and after |
| **I**solation | Concurrent transactions do not see each other's partial work |
| **D**urability | Committed data survives crashes |

### Isolation levels and anomalies

| Level | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| Read Uncommitted | possible | possible | possible |
| **Read Committed** (default in PostgreSQL, SQL Server) | ✅ prevented | possible | possible |
| **Repeatable Read** (default in MySQL InnoDB) | ✅ | ✅ | possible* |
| Serializable | ✅ | ✅ | ✅ |

\\* InnoDB and PostgreSQL prevent most phantoms at Repeatable Read using MVCC.

### Practical rules

- Keep transactions **short**; never wait for user input inside one.
- Lock rows you intend to update: \`SELECT … FOR UPDATE\` (PostgreSQL/MySQL).
- Use **savepoints** for partial rollback.
- Handle **deadlocks** by retrying the whole transaction.`,
      code: `CREATE TABLE accounts (id INTEGER PRIMARY KEY, owner TEXT, balance REAL CHECK (balance >= 0));
INSERT INTO accounts VALUES (1, 'Ana', 500), (2, 'Ben', 100);

-- Transfer money atomically
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 200 WHERE id = 1;
  UPDATE accounts SET balance = balance + 200 WHERE id = 2;
COMMIT;

SELECT * FROM accounts;   -- Ana 300, Ben 300

-- Savepoint: undo part of a transaction
BEGIN;
  UPDATE accounts SET balance = balance + 50 WHERE id = 1;
  SAVEPOINT before_fee;
  UPDATE accounts SET balance = balance - 999 WHERE id = 2 AND balance >= 999;  -- affects 0 rows
  ROLLBACK TO before_fee;
COMMIT;

SELECT * FROM accounts;   -- Ana 350, Ben 300

-- In application code (pseudo):
--   BEGIN; SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
--   ... check business rules ...
--   UPDATE ...; COMMIT;   -- on error: ROLLBACK and possibly retry`,
      codeLabel: 'Atomic transfer with savepoints',
      keyPoints: [
        'Transactions are all-or-nothing: COMMIT or ROLLBACK.',
        'Higher isolation prevents more anomalies but reduces concurrency.',
        'Keep transactions short and lock rows with SELECT … FOR UPDATE.',
        'Retry the whole transaction after a deadlock.',
      ],
    },
    {
      title: 'Window Functions: LAG, LEAD & Running Totals',
      after: 'RANK() & PARTITION BY',
      content: `Window functions compute values **across related rows without collapsing them** (unlike GROUP BY). The \`OVER (PARTITION BY … ORDER BY … frame)\` clause defines the window.

| Function | Returns |
|---|---|
| \`ROW_NUMBER()\` / \`RANK()\` / \`DENSE_RANK()\` | position within the partition |
| \`NTILE(n)\` | bucket number (quartiles, deciles) |
| \`LAG(col, n)\` / \`LEAD(col, n)\` | value from a previous / next row |
| \`FIRST_VALUE\` / \`LAST_VALUE\` | first / last value in the frame |
| \`SUM/AVG/COUNT(...) OVER\` | running totals, moving averages, shares |

### Frames

\`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\` gives a 3-row moving window. With \`ORDER BY\` and no explicit frame, the default is "from the first row to the current row" — a running total.

### Typical questions solved

Month-over-month growth, running balance, top-N per group, gaps between events, percentage of total.`,
      code: SHOP + `
SELECT c.name,
       o.ordered_on,
       o.total,
       SUM(o.total)   OVER (PARTITION BY c.id ORDER BY o.ordered_on)          AS running_total,
       LAG(o.total)   OVER (PARTITION BY c.id ORDER BY o.ordered_on)          AS prev_order,
       o.total - LAG(o.total) OVER (PARTITION BY c.id ORDER BY o.ordered_on)  AS change,
       LEAD(o.ordered_on) OVER (PARTITION BY c.id ORDER BY o.ordered_on)      AS next_order_date,
       ROUND(AVG(o.total) OVER (ORDER BY o.ordered_on
                                ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS moving_avg_3,
       ROUND(100.0 * o.total / SUM(o.total) OVER (), 1)                       AS pct_of_revenue
FROM orders o
JOIN customers c ON c.id = o.customer_id
ORDER BY c.name, o.ordered_on;

-- Month-over-month revenue growth
WITH monthly AS (
  SELECT strftime('%Y-%m', ordered_on) AS month, SUM(total) AS revenue
  FROM orders GROUP BY month
)
SELECT month, revenue,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month), 1) AS growth_pct
FROM monthly;`,
      codeLabel: 'Running totals, LAG/LEAD and moving averages',
      keyPoints: [
        'Window functions keep every row while adding aggregate context.',
        'PARTITION BY restarts the calculation per group; ORDER BY sets row order.',
        'LAG/LEAD compare a row with its neighbours.',
        'ROWS BETWEEN … defines moving windows.',
      ],
    },
    {
      title: 'Classic SQL Interview Queries',
      after: 'Normalization & Denormalization',
      content: `Patterns that come up again and again in interviews and real reporting work.

| Question | Technique |
|---|---|
| Nth highest salary | \`DENSE_RANK()\` or \`ORDER BY … LIMIT 1 OFFSET n-1\` |
| Top N per group | \`ROW_NUMBER() OVER (PARTITION BY …)\` in a CTE |
| Find duplicates | \`GROUP BY … HAVING COUNT(*) > 1\` |
| Delete duplicates, keep one | \`ROW_NUMBER()\` / \`MIN(id)\` per group |
| Customers with no orders | \`LEFT JOIN … WHERE o.id IS NULL\` or \`NOT EXISTS\` |
| Employees earning more than their manager | self join |
| Consecutive days / gaps | date minus \`ROW_NUMBER()\` ("gaps and islands") |
| Cumulative sum | \`SUM() OVER (ORDER BY …)\` |`,
      code: HR + `
-- 1. Second highest distinct salary
SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1;

-- 2. Highest-paid employee per department (top 1 per group)
WITH ranked AS (
  SELECT e.*, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
  FROM employees e
)
SELECT dept_id, name, salary FROM ranked WHERE rn = 1;

-- 3. Duplicate salaries
SELECT salary, COUNT(*) AS n, GROUP_CONCAT(name) AS who
FROM employees GROUP BY salary HAVING COUNT(*) > 1;

-- 4. Employees earning more than their manager
SELECT e.name, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e JOIN employees m ON m.id = e.manager_id
WHERE e.salary > m.salary;

-- 5. Departments whose average salary beats the company average
SELECT dept_id, ROUND(AVG(salary)) AS avg_salary
FROM employees GROUP BY dept_id
HAVING AVG(salary) > (SELECT AVG(salary) FROM employees);

-- 6. Remove duplicate rows but keep the lowest id
CREATE TABLE emails (id INTEGER PRIMARY KEY, address TEXT);
INSERT INTO emails (address) VALUES ('a@x.io'), ('b@x.io'), ('a@x.io'), ('a@x.io');
DELETE FROM emails WHERE id NOT IN (SELECT MIN(id) FROM emails GROUP BY address);
SELECT * FROM emails;

-- 7. Gaps and islands: consecutive login streaks
CREATE TABLE logins (user_id INTEGER, day TEXT);
INSERT INTO logins VALUES (1,'2026-01-01'),(1,'2026-01-02'),(1,'2026-01-03'),(1,'2026-01-07'),(1,'2026-01-08');
WITH grp AS (
  SELECT user_id, day,
         julianday(day) - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY day) AS island
  FROM logins
)
SELECT user_id, MIN(day) AS streak_start, MAX(day) AS streak_end, COUNT(*) AS days
FROM grp GROUP BY user_id, island;`,
      codeLabel: 'Seven interview favourites',
      keyPoints: [
        'Use window functions for Nth-highest and top-N-per-group questions.',
        'GROUP BY … HAVING COUNT(*) > 1 finds duplicates.',
        'Self joins compare rows within the same table.',
        'date − ROW_NUMBER() groups consecutive values (gaps and islands).',
      ],
    },
  ],
};

export const remainingCourses = [
  {
    id: 'php', title: 'PHP', description: 'Server-side scripting language powering 77% of the web.',
    officialDocs: 'https://www.php.net/docs.php', tutorialLink: 'https://www.w3schools.com/php/', exerciseLink: 'https://www.w3schools.com/php/php_exercises.asp',
    sections: [
      { title: 'What is PHP', image: '/images/php/php-request-lifecycle.svg', content: `**PHP** (PHP: Hypertext Preprocessor) is a widely-used, open-source server-side scripting language. It powers approximately **77% of all websites**, including *WordPress*, *Facebook*, and *Wikipedia*.\n\nPHP code is embedded within HTML and executed on the **server** — the client receives only the resulting HTML. This makes it ideal for dynamic web content, form processing, session management, and database interaction.\n\n### Modern PHP\n\nModern PHP (**8.0+**) has evolved dramatically from its early days. It now features **strict typing**, named arguments, \`match\` expressions, \`enum\`s, fibers (async), and attributes. Frameworks like **Laravel** and **Symfony** have established PHP as a professional enterprise language. See the [official PHP docs](https://www.php.net/docs.php) for more.`, keyPoints: ['Powers ~77% of all websites (WordPress, Wikipedia).', 'Server-side execution — client receives only HTML.', 'Modern PHP 8+ is a professional, typed language.', 'Laravel is the most popular modern PHP framework.'] },
      { title: 'Installation & Setup', content: `PHP can be installed standalone or as part of a stack. **XAMPP** (Windows/macOS/Linux) bundles Apache, MySQL, and PHP together — ideal for beginners.\n\nFor production-like environments, install **PHP-FPM** (FastCGI Process Manager) with **Nginx**. Docker provides the cleanest setup: run \`php:8.2-fpm\` as a container.\n\n### Package Management\n\n**Composer** is PHP's dependency manager (similar to npm for Node.js). It manages packages from [Packagist](https://packagist.org/) and handles autoloading.`, code: `# Install PHP (Ubuntu)\nsudo apt install php php-cli php-fpm php-mysql php-mbstring\n\n# Verify\nphp -v\n\n# Built-in development server\nphp -S localhost:8000\n\n# Install Composer\ncurl -sS https://getcomposer.org/installer | php\nsudo mv composer.phar /usr/local/bin/composer\n\n# Create Laravel project\ncomposer create-project laravel/laravel my-app\ncd my-app\nphp artisan serve`, codeLabel: 'Installation Commands', keyPoints: ['XAMPP for quick local setup, Docker for production.', 'Composer is the standard package manager.', 'php -S localhost:8000 for built-in dev server.', 'Laravel: composer create-project laravel/laravel app.'] },
      { title: 'Core Syntax & Features', content: `PHP variables start with \`$\` (e.g., \`$name = "Alice"\`). It is dynamically typed but supports **strict type declarations** since PHP 7. Use \`declare(strict_types=1)\` at the top of files to enforce type checking.\n\n### PHP 8 Features\n\nPHP 8 introduced powerful features: **Named arguments** (improved readability), **Match expressions** (safer than \`switch\`), **Enums** (type-safe constants), and **Attributes** (metadata annotations like Java's annotations).\n\n### Database Access\n\nPHP excels at database interaction through **PDO** (PHP Data Objects), which provides a unified interface for multiple databases with *prepared statements* for SQL injection prevention.`, code: `<?php\ndeclare(strict_types=1);\n\n// Modern PHP\nfunction greet(string $name, int $age): string {\n    return match(true) {\n        $age < 18 => "Hi $name, you're young!",\n        $age < 65 => "Hello $name!",\n        default   => "Respected $name!"\n    };\n}\n\n// Enum (PHP 8.1+)\nenum Status: string {\n    case Active = 'active';\n    case Inactive = 'inactive';\n    case Banned = 'banned';\n}\n\n// PDO Database query (prepared statement)\n$pdo = new PDO('mysql:host=localhost;dbname=myapp', 'root', '');\n$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');\n$stmt->execute(['email' => $email]);\n$user = $stmt->fetch(PDO::FETCH_ASSOC);`, codeLabel: 'Modern PHP 8+', keyPoints: ['declare(strict_types=1) for type safety.', 'Match expressions are safer than switch statements.', 'Enums provide type-safe constants (PHP 8.1+).', 'Always use PDO prepared statements for database queries.'] },
      { title: 'Laravel Framework', content: `**Laravel** is the most popular PHP framework, known for its elegant syntax, powerful ORM (**Eloquent**), and extensive ecosystem. It follows the **MVC** (Model-View-Controller) pattern.\n\n### Key Components\n\n**Eloquent ORM** (database modeling with elegant syntax), **Blade Templates** (server-side templating engine), **Artisan CLI** (code generation and task running), **Migrations** (versioned database schema changes), and **Middleware** (request/response filtering).\n\n### Laravel Ecosystem\n\nLaravel's ecosystem includes: **Livewire** (reactive UI without JavaScript), **Inertia.js** (SPA bridge with Vue/React), **Laravel Forge** (server provisioning), and **Laravel Vapor** (serverless deployment on AWS Lambda).`, code: `// Route (routes/web.php)\nRoute::get('/users', [UserController::class, 'index']);\nRoute::post('/users', [UserController::class, 'store']);\n\n// Controller\nclass UserController extends Controller {\n    public function index() {\n        $users = User::where('active', true)\n                     ->orderBy('name')\n                     ->paginate(15);\n        return view('users.index', compact('users'));\n    }\n\n    public function store(Request $request) {\n        $validated = $request->validate([\n            'name' => 'required|max:255',\n            'email' => 'required|email|unique:users',\n        ]);\n        User::create($validated);\n        return redirect('/users');\n    }\n}\n\n// Eloquent Model\nclass User extends Model {\n    protected $fillable = ['name', 'email'];\n    public function posts() {\n        return $this->hasMany(Post::class);\n    }\n}\n\n# Artisan commands\nphp artisan make:model Post -mc  # Model + Migration + Controller\nphp artisan migrate\nphp artisan serve`, codeLabel: 'Laravel Example', keyPoints: ['Eloquent ORM provides elegant database interaction.', 'Artisan CLI generates boilerplate code.', 'Blade templates for server-side rendering.', 'Migrations version your database schema.'] },
      { title: 'Build & Deploy', content: `PHP applications don't require compilation. For deployment, configure **Nginx + PHP-FPM** for production performance. Use \`composer install --no-dev\` to exclude development dependencies.\n\n### Laravel Deployment Checklist\n\nRun \`composer install --no-dev\`, set \`APP_ENV=production\`, run \`php artisan config:cache\`, \`php artisan route:cache\`, and \`php artisan view:cache\` for optimization.\n\n### Hosting Options\n\n**Docker** or managed hosting (**Laravel Forge**, *Ploi*) simplifies deployment. For serverless, **Laravel Vapor** deploys to AWS Lambda.`, code: `# Production deployment\ncomposer install --optimize-autoloader --no-dev\nphp artisan config:cache\nphp artisan route:cache\nphp artisan view:cache\n\n# Nginx config\nserver {\n    listen 80;\n    root /var/www/html/public;\n    index index.php;\n\n    location / {\n        try_files $uri $uri/ /index.php?$query_string;\n    }\n\n    location ~ \\.php$ {\n        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;\n        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;\n        include fastcgi_params;\n    }\n}`, codeLabel: 'Deployment Config', keyPoints: ['Nginx + PHP-FPM for production performance.', 'Cache config, routes, and views for speed.', 'Use --no-dev flag in production.', 'Laravel Forge or Docker for deployment automation.'] }
    ]
  },
  {
    id: 'sql', title: 'SQL Database', description: 'Relational database management with structured queries.',
    officialDocs: 'https://www.postgresql.org/docs/', tutorialLink: 'https://www.w3schools.com/sql/', exerciseLink: 'https://www.w3schools.com/sql/sql_exercises.asp',
    sections: [
      {
        title: 'What is SQL',
        content: `**SQL** (*Structured Query Language*) is the standard language used to define, query, manipulate, and secure **relational databases**. Relational databases organize data into tables made of rows and columns, then connect those tables with keys and relationships so information can be queried reliably at scale.\n\nSQL is *declarative*. You describe **what** data you need, not **how** to fetch it step by step. The database engine decides the execution plan, chooses indexes, and optimizes the query under the hood.\n\n### SQL Sublanguages\n\nSQL is commonly grouped into sublanguages: **DDL** for schema changes (\`CREATE\`, \`ALTER\`, \`DROP\`), **DML** for data operations (\`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`), **DCL** for permissions (\`GRANT\`, \`REVOKE\`), and **TCL** for transaction control (\`COMMIT\`, \`ROLLBACK\`). **PostgreSQL**, **MySQL**, **SQL Server**, **Oracle**, and **SQLite** all speak SQL, though each has dialect-specific features.\n\nTogether, tables, constraints, joins, indexing, set operators, and query-tuning techniques make SQL the backbone of most transactional systems such as e-commerce apps, payroll systems, ERP software, banking platforms, and analytics dashboards.`,
        keyPoints: [
          'SQL is declarative: specify what to retrieve, not the algorithm.',
          'Relational databases store structured data in related tables.',
          'DDL, DML, DCL, and TCL cover schema, data, security, and transactions.',
          'SQL powers most production transactional systems and reporting layers.'
        ]
      },
      {
        title: 'Tables, Schema, Data Types & Constraints',
        content: `A **table** is the core storage unit in a relational database. Each column has a defined type, and each row represents a record. The **schema** is the complete database design: tables, columns, relationships, defaults, constraints, and indexes.\n\n### Common Data Types\n\nCommon data types include \`INTEGER\`/\`BIGINT\` for whole numbers, \`DECIMAL\`/\`NUMERIC\` for exact precision, \`VARCHAR\` and \`TEXT\` for strings, \`BOOLEAN\` for true/false values, \`DATE\` and \`TIMESTAMP\` for temporal data, \`UUID\` for identifiers, and \`JSON\`/\`JSONB\` for semi-structured data in engines like **PostgreSQL**.\n\n### Constraints\n\nConstraints act like security guards at the database gate. \`NOT NULL\` prevents empty values. \`UNIQUE\` prevents duplicates. \`PRIMARY KEY\` uniquely identifies each row. \`FOREIGN KEY\` enforces relationships between parent and child tables. \`CHECK\` restricts allowed ranges or conditions. \`DEFAULT\` supplies fallback values automatically.\n\n### ON DELETE Behavior\n\nForeign keys also control delete behavior. \`ON DELETE CASCADE\` removes dependent child rows automatically. \`ON DELETE SET NULL\` preserves child rows but clears the relationship. \`ON DELETE RESTRICT\` blocks deletion if dependent records still exist.`,
        code: `CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    dept_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    salary NUMERIC(10,2) CHECK (salary >= 0),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE employees
ADD CONSTRAINT chk_email_format CHECK (position('@' in email) > 1);`,
        codeLabel: 'Schema & Constraints',
        image: '/images/sql/sql-schema-constraints.svg',
        keyPoints: [
          'Constraints preserve data accuracy, consistency, and integrity.',
          'PRIMARY KEY and UNIQUE typically create indexes automatically.',
          'FOREIGN KEY relationships prevent orphaned records.',
          'Use CHECK and DEFAULT to enforce business rules at the database layer.'
        ]
      },
      {
        title: 'CRUD Operations & Filtering',
        content: `**CRUD** stands for **Create**, **Read**, **Update**, and **Delete**. These four operations drive nearly every application that persists relational data. \`INSERT\` adds new rows, \`SELECT\` reads them, \`UPDATE\` changes them, and \`DELETE\` removes them.\n\n### SELECT Deep Dive\n\n\`SELECT\` is the richest part of SQL. It supports filtering with \`WHERE\`, sorting with \`ORDER BY\`, pagination with \`LIMIT\` and \`OFFSET\`, grouping with \`GROUP BY\`, aggregated calculations such as \`COUNT\` and \`SUM\`, and post-group filtering with \`HAVING\`.\n\n### Best Practices\n\nFiltering should be as precise as possible. Apply restrictive predicates early, request only the columns you need, and avoid \`SELECT *\` in production queries unless you truly need every column.\n\nWhen user input is involved, always use **parameterized queries** or **prepared statements** in the application layer. *SQL injection* remains one of the most common and dangerous database vulnerabilities.`,
        code: `-- INSERT
INSERT INTO employees (name, email, dept_id, salary)
VALUES ('Alice', 'alice@mail.com', 1, 65000.00);

-- READ with filtering, sorting, and paging
SELECT name, email, salary
FROM employees
WHERE active = true AND salary >= 50000
ORDER BY salary DESC
LIMIT 10 OFFSET 0;

-- GROUP BY + HAVING
SELECT dept_id, COUNT(*) AS employee_count, AVG(salary) AS avg_salary
FROM employees
GROUP BY dept_id
HAVING COUNT(*) >= 2;

-- UPDATE
UPDATE employees
SET salary = salary * 1.10
WHERE dept_id = 1;

-- DELETE
DELETE FROM employees
WHERE active = false AND created_at < '2025-01-01';`,
        codeLabel: 'CRUD Operations',
        keyPoints: [
          'INSERT, SELECT, UPDATE, and DELETE form the foundation of SQL data work.',
          'WHERE filters rows; HAVING filters grouped results.',
          'Avoid SELECT * when only a subset of columns is needed.',
          'Always parameterize user-driven SQL to prevent injection.'
        ]
      },
      {
        title: 'JOINs, Self Joins & Relationships',
        content: `**JOINs** combine rows from multiple tables using related columns. They are the reason relational databases are so powerful: you can **normalize** data into separate tables and still query it together when needed.\n\n### JOIN Types\n\n\`INNER JOIN\` returns only rows with matches in both tables. \`LEFT JOIN\` returns every row from the left table and matching rows from the right, filling unmatched columns with \`NULL\`. \`RIGHT JOIN\` mirrors LEFT JOIN. \`FULL JOIN\` returns all rows from both sides. \`CROSS JOIN\` creates the *Cartesian product* and should be used only intentionally.\n\n### Self Joins\n\nA **self join** joins a table to itself by using aliases. This is useful for *employee-manager relationships*, category hierarchies, and dependency graphs. **Recursive CTEs** often build on this idea to walk parent-child trees level by level.\n\n### Performance\n\nJoin performance depends on good keys, matching data types, selective filtering, and correct **indexes** on join columns. In advanced systems, reading execution plans matters as much as writing the SQL itself.`,
        code: `-- INNER JOIN
SELECT e.name, d.name AS department
FROM employees e
INNER JOIN departments d ON d.id = e.dept_id;

-- LEFT JOIN
SELECT d.name, COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
GROUP BY d.name
ORDER BY employee_count DESC;

-- SELF JOIN: employee -> manager
SELECT e.name AS employee_name, m.name AS manager_name
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;

-- Recursive CTE pattern for hierarchies
WITH RECURSIVE org_chart AS (
    SELECT id, name, manager_id, 1 AS depth
    FROM employees
    WHERE manager_id IS NULL
  UNION ALL
    SELECT e.id, e.name, e.manager_id, oc.depth + 1
    FROM employees e
    JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart;`,
        codeLabel: 'JOIN Patterns',
        image: '/images/sql/sql-joins.svg',
        keyPoints: [
          'INNER JOIN returns matches only; LEFT JOIN preserves the left table.',
          'Self joins compare rows within the same table using aliases.',
          'Recursive CTEs are the standard pattern for hierarchical SQL data.',
          'Index join columns and inspect execution plans for slow joins.'
        ]
      },
      {
        title: 'Set Operators',
        content: `**Set operators** combine or compare the results of multiple \`SELECT\` statements. They are useful when datasets have compatible column structures and you need merging, overlap detection, or difference analysis.\n\n### Operators\n\n\`UNION\` merges results and removes duplicates. \`UNION ALL\` merges results but keeps duplicates, making it *faster* because the engine skips deduplication. \`INTERSECT\` returns only rows that appear in both result sets. \`EXCEPT\` returns rows from the first query that are absent from the second.\n\n### Rules\n\nAll participating \`SELECT\` statements must return the **same number of columns** in the same order, and the data types must be compatible. The final \`ORDER BY\` applies to the combined output.\n\nIn practice, prefer \`UNION ALL\` unless you explicitly need duplicate elimination.`,
        code: `-- UNION removes duplicates
SELECT name, department FROM current_employees
UNION
SELECT name, department FROM former_employees;

-- UNION ALL keeps duplicates and is faster
SELECT name, department FROM current_employees
UNION ALL
SELECT name, department FROM former_employees;

-- INTERSECT returns common rows
SELECT email FROM newsletter_subscribers
INTERSECT
SELECT email FROM customers;

-- EXCEPT returns rows only in the first result
SELECT email FROM customers
EXCEPT
SELECT email FROM newsletter_subscribers;`,
        codeLabel: 'Set Operators',
        image: '/images/sql/sql-set-operators.svg',
        keyPoints: [
          'UNION removes duplicates; UNION ALL keeps them and is usually faster.',
          'INTERSECT finds overlap; EXCEPT finds differences.',
          'All set-operation queries must return compatible column shapes.',
          'Use UNION ALL by default when deduplication is not required.'
        ]
      },
      {
        title: 'Indexes & Performance Tuning',
        content: `**Indexes** speed up reads by building fast lookup structures, usually **B-trees**, on specific columns. Without indexes, the database may perform *full table scans* that inspect every row.\n\n### Index Types\n\nPrimary keys and unique constraints often create indexes automatically, but **secondary indexes** are still needed for frequently filtered, joined, or sorted columns. Common types include *single-column indexes*, *unique indexes*, *composite indexes* for multi-column predicates, and *clustered indexes* in engines that support them.\n\n### Query Optimization\n\nAvoid \`SELECT *\`, limit unnecessary retrieval, filter early in \`WHERE\` clauses, avoid wrapping indexed columns in functions, and replace expensive correlated subqueries with joins or CTEs. \`EXISTS\` is often more efficient than \`IN\` for large subqueries.\n\n### Execution Plans\n\nUse \`EXPLAIN\` or \`EXPLAIN ANALYZE\` to understand how the engine executes a query. Execution plans reveal scans, index usage, join strategies, sort costs, and row estimates. *Tuning without reading the plan is mostly guesswork*.`,
        code: `-- Single-column index
CREATE INDEX idx_employees_email ON employees(email);

-- Composite index for common filters
CREATE INDEX idx_employees_dept_active ON employees(dept_id, active);

-- Bad: function prevents efficient index use
SELECT *
FROM employees
WHERE YEAR(hire_date) = 2020;

-- Better: sargable predicate
SELECT *
FROM employees
WHERE hire_date >= '2020-01-01'
  AND hire_date < '2021-01-01';

-- EXISTS often beats IN on large subqueries
SELECT *
FROM orders o
WHERE EXISTS (
    SELECT 1
    FROM customers c
    WHERE c.customer_id = o.customer_id
      AND c.country = 'USA'
);

EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE dept_id = 1 AND active = true;`,
        codeLabel: 'Indexing & Tuning',
        image: '/images/sql/sql-indexes.svg',
        keyPoints: [
          'Indexes speed up reads but add write overhead on inserts, updates, and deletes.',
          'Index columns commonly used in WHERE, JOIN, and ORDER BY clauses.',
          'Prefer sargable predicates over functions applied to indexed columns.',
          'Read execution plans before and after tuning changes.'
        ]
      },
      {
        title: 'SQL Views',
        content: `A **view** is a virtual table defined by a stored \`SELECT\` query. It does not store physical data; instead, the database executes the underlying query when the view is referenced. Views simplify repeated joins, expose a stable interface to applications, and restrict access to base tables.\n\n### Why Views Matter\n\nViews improve **readability** and **maintainability** because complex logic can be written once and reused everywhere. Analysts or applications can query a clean, business-friendly object instead of dealing with raw schema complexity. Security teams use views to expose only selected columns or *filtered subsets* of data.\n\n### Tradeoffs\n\nViews are not a free performance feature. Large or deeply nested views can become hard to reason about, and some engines have update limitations or require **materialized views** if you want persisted results. Use them to simplify access patterns, not to hide poor schema design.`,
        code: `CREATE VIEW active_employee_details AS
SELECT e.id,
       e.name,
       e.email,
       d.name AS department
FROM employees e
JOIN departments d ON d.id = e.dept_id
WHERE e.active = true;

SELECT *
FROM active_employee_details
ORDER BY name;`,
        codeLabel: 'SQL View',
        image: '/images/sql/concepts-08.png',
        keyPoints: [
          'A view stores query logic, not usually the data itself.',
          'Views simplify repeated complex SELECT statements.',
          'Views can improve security by hiding base-table details.',
          'Do not assume views automatically improve performance.'
        ]
      },
      {
        title: 'Triggers',
        content: `A **trigger** is a special database object that runs automatically when a defined event occurs on a table or view. Typical trigger events are \`INSERT\`, \`UPDATE\`, and \`DELETE\`. Triggers are used for *auditing*, enforcing business rules, maintaining derived data, and blocking invalid state transitions.\n\n### Trigger Types\n\n\`AFTER\` triggers run after the original data modification succeeds. \`INSTEAD OF\` triggers replace the underlying operation and are commonly used on views or when you need to intercept and rewrite behavior before data changes are applied.\n\n### Use Wisely\n\nTriggers are powerful but easy to abuse. They add *hidden execution paths*, can slow down writes, and make debugging harder because extra SQL runs implicitly behind ordinary DML statements. Keep trigger logic short, **deterministic**, and well documented. If application-level code can handle a workflow more transparently, that is often preferable.`,
        code: `CREATE TRIGGER trg_log_employee_insert
AFTER INSERT ON employees
FOR EACH ROW
BEGIN
    INSERT INTO audit_log(table_name, action_name, record_id, created_at)
    VALUES ('employees', 'INSERT', NEW.id, CURRENT_TIMESTAMP);
END;

-- SQL Server style concept
-- CREATE TRIGGER trg_InsertEmployee ON Employee AFTER INSERT AS
-- BEGIN
--   PRINT 'Record Inserted Successfully';
-- END;`,
        codeLabel: 'Trigger Example',
        image: '/images/sql/concepts-10.png',
        keyPoints: [
          'Triggers execute automatically on INSERT, UPDATE, or DELETE events.',
          'AFTER triggers run post-change; INSTEAD OF triggers intercept the action.',
          'Triggers help with auditing and business-rule enforcement.',
          'Overusing triggers makes debugging and performance tuning harder.'
        ]
      },
      {
        title: 'SQL Functions',
        content: `A **SQL function** encapsulates reusable logic inside the database and returns either a **scalar value** or a **table result**. Functions are useful for calculations, formatting, reusable business rules, and query composition.\n\n### Function Types\n\n**Scalar functions** return a single value. **Table-valued functions** return a result set and can often be joined like a regular table. Functions improve reuse and shorten repeated query logic, especially when the same transformation appears in many reports or stored routines.\n\n### Performance Considerations\n\nComplex user-defined functions can become bottlenecks, especially *scalar functions called row by row* in very large queries. Use them when they genuinely improve reuse or clarity, but validate with \`EXPLAIN\` plans and runtime measurements.`,
        code: `CREATE FUNCTION add_bonus(@salary INT)
RETURNS INT
AS
BEGIN
    DECLARE @result INT;
    SET @result = @salary + 5000;
    RETURN @result;
END;

SELECT name, dbo.add_bonus(salary) AS revised_salary
FROM Employee;`,
        codeLabel: 'SQL Function',
        image: '/images/sql/concepts-09.png',
        keyPoints: [
          'Functions return either a scalar value or a table result.',
          'Functions improve reuse for repeated calculations and transformations.',
          'Large row-by-row scalar functions can hurt query performance.',
          'Use functions for clarity, but verify cost in production workloads.'
        ]
      },
      {
        title: 'Stored Procedures',
        content: `A **stored procedure** is a named collection of SQL statements stored in the database and executed on demand. Procedures are useful for multi-step workflows, controlled write operations, **parameterized business logic**, and reducing repeated network chatter between an application and the database.\n\n### Capabilities\n\nStored procedures can accept **input parameters**, return output values, execute conditional logic, open **transactions**, and coordinate multiple SQL statements as a single unit. Because the logic lives in the database, procedures can also centralize access control and keep application code thinner.\n\n### When to Use\n\nThey are not automatically better than application code. Overly large procedures become difficult to *test and version*. The best use cases are write-heavy workflows, administrative routines, or well-defined operations that benefit from being close to the data.`,
        code: `CREATE PROCEDURE GetEmployeeById
    @EmpID INT
AS
BEGIN
    SELECT EmployeeID, Name, Department, Salary
    FROM Employee
    WHERE EmployeeID = @EmpID;
END;

EXEC GetEmployeeById 1;`,
        codeLabel: 'Stored Procedure',
        image: '/images/sql/concepts-07.png',
        keyPoints: [
          'Stored procedures group reusable SQL statements behind a callable interface.',
          'They support parameters, conditional logic, and transactions.',
          'Procedures can improve security by restricting direct table access.',
          'Keep procedures focused; huge procedural blobs become maintenance problems.'
        ]
      },
      {
        title: 'CTE (Common Table Expression)',
        content: `A **Common Table Expression** (CTE) is a temporary named result set defined with the \`WITH\` keyword and used within a single SQL statement. CTEs make complex queries more readable by breaking them into *logical steps*.\n\n### Use Cases\n\nCTEs are especially useful for layered transformations, reusable aggregates inside one query, **recursive traversals**, and replacing deeply nested subqueries with something easier to read and maintain. **Recursive CTEs** are the standard SQL technique for trees, org charts, threaded comments, and parent-child hierarchies.\n\n### Performance\n\nCTEs improve clarity, but they are not magic performance boosters. Depending on the engine, a CTE may be *inlined* or *materialized*. For large data volumes, test the execution plan and compare alternatives such as derived tables, temp tables, or indexed staging tables.`,
        code: `WITH DepartmentSalary AS (
    SELECT dept_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
)
SELECT e.name, e.salary, ds.avg_salary
FROM employees e
JOIN DepartmentSalary ds ON ds.dept_id = e.dept_id
WHERE e.salary > ds.avg_salary;

-- Recursive CTE example pattern
WITH RECURSIVE numbers AS (
    SELECT 1 AS n
  UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 5
)
SELECT * FROM numbers;`,
        codeLabel: 'CTE Example',
        image: '/images/sql/concepts-06.png',
        keyPoints: [
          'CTEs make complex SQL easier to read and maintain.',
          'Use recursive CTEs for hierarchical or iterative query patterns.',
          'CTEs exist only for the duration of a single statement.',
          'Always compare execution plans for large or performance-critical CTEs.'
        ]
      },
      {
        title: 'Dynamic SQL',
        content: `**Dynamic SQL** builds a query string at runtime and then executes it. This is useful when filters, table names, sort clauses, or optional predicates are *not known until execution time*. Administrative tooling, generic reporting systems, and metadata-driven database utilities often rely on dynamic SQL.\n\n### SQL Injection Risk\n\nThe major risk is **SQL injection**. If dynamic SQL is built by concatenating raw user input, attackers can inject arbitrary commands. The safe pattern is to **parameterize values**, validate object names against allowlists, and use engine-specific safe execution helpers such as \`sp_executesql\` in SQL Server.\n\n### When to Use\n\nDynamic SQL is powerful when flexibility is required, but it should be the *exception* rather than the default. If a static parameterized query can solve the problem, it is usually easier to secure, debug, and optimize.`,
        code: `DECLARE @sql NVARCHAR(MAX);
DECLARE @dept NVARCHAR(50);

SET @dept = 'HR';
SET @sql = N'SELECT EmployeeID, Name, Department
             FROM Employee
             WHERE Department = @Department';

EXEC sp_executesql
    @sql,
    N'@Department NVARCHAR(50)',
    @Department = @dept;`,
        codeLabel: 'Dynamic SQL',
        image: '/images/sql/concepts-01.png',
        keyPoints: [
          'Dynamic SQL constructs statements at runtime for flexible querying.',
          'Use parameterization and validation to prevent SQL injection.',
          'Prefer static SQL when the query shape is already known.',
          'sp_executesql is safer than raw string execution in SQL Server.'
        ]
      },
      {
        title: 'ROW_NUMBER()',
        content: `**ROW_NUMBER()** is a **window function** that assigns a unique sequential number to each row in a result set according to an \`ORDER BY\` inside the \`OVER\` clause. It is commonly used for *pagination*, top-N queries, deduplication, and deterministic row labeling.\n\n### Handling Ties\n\nBecause \`ROW_NUMBER()\` always assigns unique numbers, tied values still receive different positions. If two employees have the same salary, one still gets row 1 and the other row 2 depending on the ordering rules. That makes it ideal when you need a **strict sequence** rather than shared ranks.\n\n### Window Functions Concept\n\nWindow functions do not collapse rows the way \`GROUP BY\` does. They let you calculate values across a logical window while *preserving every original row* in the result. That distinction is central to advanced analytical SQL.`,
        code: `SELECT
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
    name,
    salary
FROM Employee;

-- Pagination pattern
WITH OrderedEmployees AS (
    SELECT
        ROW_NUMBER() OVER (ORDER BY EmployeeID) AS rn,
        EmployeeID,
        Name
    FROM Employee
)
SELECT *
FROM OrderedEmployees
WHERE rn BETWEEN 11 AND 20;`,
        codeLabel: 'ROW_NUMBER()',
        image: '/images/sql/sql-window-functions.svg',
        keyPoints: [
          'ROW_NUMBER() assigns a unique sequence based on the ORDER BY clause.',
          'Useful for pagination, top-N queries, and deduplication patterns.',
          'Tied values still get different row numbers.',
          'Window functions preserve row detail instead of grouping rows away.'
        ]
      },
      {
        title: 'RANK() & PARTITION BY',
        content: `**RANK()** is a window function that assigns rank positions based on an ordering expression. Unlike \`ROW_NUMBER()\`, ties receive the **same rank**, and later ranks are skipped. If two rows tie for first place, the next row receives rank 3.\n\n### PARTITION BY\n\n\`PARTITION BY\` divides the result set into logical groups and then applies the window function independently within each partition. This is how you build *group-wise rankings*, department leaderboards, per-category top sellers, or rolling metrics partitioned by customer, region, or month.\n\n### Analytical Power\n\nTogether, \`RANK()\` and \`PARTITION BY\` are core analytical SQL tools. They are widely used in reporting, dashboards, leaderboard features, and data engineering pipelines where you need **local rankings** inside each business segment rather than across the whole table.`,
        code: `SELECT
    department,
    name,
    salary,
    RANK() OVER (ORDER BY salary DESC) AS overall_rank,
    ROW_NUMBER() OVER (
        PARTITION BY department
        ORDER BY salary DESC
    ) AS dept_row_num
FROM Employee;

-- Top paid employee in each department
WITH ranked AS (
    SELECT
        department,
        name,
        salary,
        ROW_NUMBER() OVER (
            PARTITION BY department
            ORDER BY salary DESC
        ) AS rn
    FROM Employee
)
SELECT *
FROM ranked
WHERE rn = 1;`,
        codeLabel: 'RANK() & PARTITION BY',
        image: '/images/sql/sql-window-functions.svg',
        keyPoints: [
          'RANK() gives the same rank to ties and skips later rank numbers.',
          'PARTITION BY restarts the window function inside each logical group.',
          'Use these together for department-level or category-level rankings.',
          'They are foundational for analytical and reporting SQL.'
        ]
      },
      {
        title: 'Normalization & Denormalization',
        content: `**Normalization** organizes relational data to reduce redundancy and prevent *insert*, *update*, and *delete* anomalies. Each normal form introduces stricter rules for dependency management and schema decomposition. In practice, most application databases aim for **3NF**, with BCNF or higher reserved for more specialized designs.\n\n### Normal Forms\n\n**1NF** requires atomic values and no repeating groups. **2NF** removes partial dependencies so non-key attributes depend on the whole key. **3NF** removes transitive dependencies so non-key attributes do not depend on other non-key attributes. **BCNF** strengthens the rule further so every determinant is a superkey. **4NF** removes multi-valued dependencies, and **5NF** removes problematic join dependencies.\n\n### Denormalization\n\n**Denormalization** intentionally adds redundancy to speed up reads and simplify expensive joins. Common patterns include merged tables, duplicated lookup values, precomputed totals, flattened reporting tables, \`JSON\` columns for nested read models, and summary tables for aggregates.\n\n### The Tradeoff\n\nNormalization improves *consistency and integrity*, while denormalization improves *read performance*. Start normalized, measure the bottlenecks, then denormalize carefully where proven beneficial.`,
        code: `-- Example of a summary table used for denormalized reporting
CREATE TABLE daily_sales_summary (
    sales_date DATE PRIMARY KEY,
    total_sales NUMERIC(12,2) NOT NULL,
    total_orders INTEGER NOT NULL
);

-- Refresh summary from normalized transactional data
INSERT INTO daily_sales_summary (sales_date, total_sales, total_orders)
SELECT
    order_date::date,
    SUM(amount) AS total_sales,
    COUNT(*) AS total_orders
FROM orders
GROUP BY order_date::date;`,
        codeLabel: 'Normalization vs Denormalization',
        image: '/images/sql/sql-normalization.svg',
        keyPoints: [
          '1NF through 5NF progressively reduce redundancy and anomalies.',
          'Most application schemas target 3NF unless special needs justify more.',
          'Denormalization improves read speed by introducing controlled redundancy.',
          'Normalize first, then denormalize only for measured performance reasons.'
        ]
      }
    ]
  },
  {
    id: 'nosql', title: 'NoSQL Database', description: 'Flexible, non-relational databases for modern applications.',
    officialDocs: 'https://www.mongodb.com/docs/', tutorialLink: 'https://www.w3schools.com/mongodb/', exerciseLink: null,
    sections: [
      { title: 'What is NoSQL', image: '/images/nosql/nosql-types.svg', content: `**NoSQL** (Not Only SQL) databases store data in formats other than traditional relational tables. They are designed for specific use cases where relational databases struggle: **massive scale**, flexible schemas, high write throughput, and distributed systems.\n\n### Four Main Types\n\n**Document stores** (MongoDB, Firestore — JSON-like documents), **Key-Value stores** (Redis, DynamoDB — simple key-value pairs, extremely fast), **Column-Family stores** (Cassandra, HBase — columns grouped into families, great for time-series), and **Graph databases** (Neo4j — nodes and edges for complex relationships).\n\n### BASE vs ACID\n\nNoSQL databases typically follow **BASE** (*Basically Available, Soft state, Eventually consistent*) rather than ACID. They sacrifice strict consistency for availability and partition tolerance (the **CAP theorem**).`, keyPoints: ['4 types: Document, Key-Value, Column-Family, Graph.', 'Designed for scale, flexibility, and distributed systems.', 'BASE model: eventually consistent, highly available.', 'Choose based on data access patterns, not popularity.'] },
      { title: 'MongoDB CRUD Operations', content: `**MongoDB** is the most popular document database. It stores data as **BSON** (Binary JSON) documents — flexible, nested structures without predefined schemas. Documents are stored in **Collections** (analogous to tables).\n\nMongoDB operations are designed to be intuitive and closely map to how applications use data. Documents can contain *nested objects* and *arrays*, allowing you to store related data together instead of normalizing across tables.`, code: `// Insert documents\ndb.users.insertOne({\n  name: "Alice",\n  email: "alice@mail.com",\n  age: 28,\n  address: { city: "NYC", zip: "10001" },\n  hobbies: ["reading", "coding", "hiking"]\n});\n\n// Find with query operators\ndb.users.find({\n  age: { $gte: 25, $lte: 35 },\n  "address.city": "NYC"\n}).sort({ name: 1 }).limit(10);\n\n// Update\ndb.users.updateOne(\n  { email: "alice@mail.com" },\n  { $set: { age: 29 }, $push: { hobbies: "gaming" } }\n);\n\n// Aggregation pipeline\ndb.orders.aggregate([\n  { $match: { status: "completed" } },\n  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },\n  { $sort: { total: -1 } },\n  { $limit: 10 }\n]);`, codeLabel: 'MongoDB Operations', keyPoints: ['Documents are flexible BSON (JSON-like) structures.', 'Query operators: $gte, $lte, $in, $regex, $exists.', 'Aggregation pipeline for complex data transformations.', 'Embed related data to avoid the need for JOINs.'] },
      { title: 'Schema Design Patterns', content: `MongoDB schema design is fundamentally different from SQL. Instead of normalizing data across tables, you design based on **how your application queries data**.\n\n### When to Embed\n\n**Embed** (denormalize) when data is frequently accessed together, there is a *1:1* or *1:few* relationship, and the embedded data doesn't grow without bound. Example: user addresses, order line items.\n\n### When to Reference\n\n**Reference** (normalize) when data is accessed independently, there is a *1:many* or *many:many* relationship, or the related data is large/grows unboundedly. Example: user's posts (reference), post comments (embed if few, reference if many).\n\n### Anti-pattern\n\n**Unbounded arrays** — if a document's array can grow indefinitely, it will eventually exceed MongoDB's **16MB document size limit**. Move such data to a separate collection with references.`, keyPoints: ['Design for query patterns, not data relationships.', 'Embed data accessed together (1:1, 1:few).', 'Reference data accessed independently (1:many).', 'Avoid unbounded arrays (16MB document limit).'] },
      { title: 'MongoDB vs SQL — When to Use Which', content: `### Use SQL (Relational) When\n\nData is highly structured with clear relationships. You need complex **JOIN** queries. **ACID transactions** are critical (banking, inventory). Data integrity and consistency are top priorities.\n\n### Use MongoDB When\n\nSchema needs to evolve rapidly (startups, prototyping). Data is naturally **document-shaped** (user profiles, product catalogs). You need **horizontal scaling** across distributed servers. Read/write patterns are simple (CRUD per document).\n\n### Other NoSQL Options\n\nUse **Redis** (Key-Value) for sub-millisecond response times — caching, session storage, rate limiting, and real-time leaderboards. Use **Neo4j** (Graph) when relationships are the primary concern — social networks, recommendation engines, fraud detection.\n\n### Polyglot Persistence\n\nMany modern applications use **polyglot persistence** — multiple databases, each optimized for specific use cases. Example: *PostgreSQL* for transactional data, *MongoDB* for product catalogs, *Redis* for caching, *Elasticsearch* for search.`, keyPoints: ['SQL for structured data with complex relationships.', 'MongoDB for flexible schemas and horizontal scaling.', 'Redis for caching and sub-millisecond reads.', 'Polyglot persistence: use the right DB for each use case.'] }
    ]
  },
  {
    id: 'docker', title: 'Docker', description: 'Containerization platform for consistent, portable deployments.',
    officialDocs: 'https://docs.docker.com/', tutorialLink: 'https://docs.docker.com/get-started/', exerciseLink: null,
    sections: [
      { title: 'What is Docker', image: '/images/docker/docker-vs-vm.svg', content: `**Docker** is a platform for developing, shipping, and running applications inside **containers**. Containers are lightweight, isolated environments that package an application with everything it needs to run — code, runtime, libraries, and system tools.\n\nUnlike virtual machines (which emulate entire operating systems), containers **share the host OS kernel** and only isolate the application layer. This makes them extremely lightweight (*MBs vs GBs*), fast to start (*seconds vs minutes*), and efficient with resources.\n\n### Core Value Proposition\n\nDocker solves the **"works on my machine"** problem. A containerized application runs identically on a developer's laptop, a CI/CD server, a staging environment, and production. See the [Docker documentation](https://docs.docker.com/) for getting started guides.`, keyPoints: ['Containers package apps with all dependencies.', 'Lightweight and fast compared to virtual machines.', 'Eliminates "works on my machine" problems.', 'Applications run identically everywhere.'] },
      { title: 'Installation & Architecture', content: `**Docker Desktop** (Windows/macOS) bundles the Docker Engine, CLI, and Docker Compose. On Linux, install Docker Engine directly. Verify installation with \`docker --version\`.\n\n### Architecture\n\nThe **Docker Daemon** (background service) manages containers, images, networks, and volumes. The **Docker CLI** sends commands to the daemon via its REST API. [Docker Hub](https://hub.docker.com/) is the default image registry — a cloud repository of pre-built images.`, code: `# Verify installation\ndocker --version\ndocker compose version\n\n# Test with Hello World\ndocker run hello-world\n\n# Run Nginx web server\ndocker run -d -p 8080:80 --name web nginx\n\n# List running containers\ndocker ps\n\n# Stop and remove\ndocker stop web\ndocker rm web\n\n# List all images\ndocker images`, codeLabel: 'Docker Basics', keyPoints: ['Docker Desktop for Windows/macOS, Docker Engine for Linux.', 'Daemon manages containers, CLI sends commands.', 'Docker Hub is the default image registry.', 'docker run starts containers, docker ps lists them.'] },
      { title: 'Dockerfile Deep Dive', content: `A **Dockerfile** is a text file with instructions for building a Docker image. Each instruction creates a **layer** in the image. Docker caches layers — if a layer hasn't changed, Docker reuses the cache, dramatically speeding up builds.\n\n### Key Instructions\n\n\`FROM\` (base image), \`WORKDIR\` (set working directory), \`COPY\` (copy files from host), \`RUN\` (execute commands during build), \`ENV\` (set environment variables), \`EXPOSE\` (document which port the app uses), \`CMD\` (default command when container starts).\n\n### Optimization\n\nOrder instructions from *least-frequently-changed* to *most-frequently-changed*. Copy \`package.json\` and install dependencies **before** copying source code — this way, dependency installation is cached unless \`package.json\` changes.`, code: `# Optimized Node.js Dockerfile\nFROM node:20-alpine\n\n# Set working directory\nWORKDIR /app\n\n# Copy dependency files first (caching layer)\nCOPY package.json package-lock.json ./\n\n# Install dependencies (cached if package.json unchanged)\nRUN npm ci --only=production\n\n# Copy source code (changes most frequently)\nCOPY . .\n\n# Set environment\nENV NODE_ENV=production\nENV PORT=3000\n\n# Document which port is used\nEXPOSE 3000\n\n# Start command\nCMD ["node", "server.js"]\n\n# Build the image\n# docker build -t my-app:1.0 .\n# docker run -d -p 3000:3000 my-app:1.0`, codeLabel: 'Optimized Dockerfile', keyPoints: ['Each instruction creates a cached layer.', 'Copy dependencies before source code for better caching.', 'Use alpine-based images for smaller size.', 'CMD defines the default startup command.'] },
      { title: 'Docker Compose', content: `**Docker Compose** defines and runs multi-container applications. Instead of running multiple \`docker run\` commands, you define all services in a \`docker-compose.yml\` file and start everything with \`docker compose up\`.\n\n### Services, Networks & Volumes\n\n**Services** are containers defined in the compose file. They can communicate over a shared network using **service names as hostnames** (e.g., \`db:5432\` instead of \`localhost:5432\`). **Volumes** persist data between container restarts. **Environment variables** configure services.`, code: `# docker-compose.yml\nversion: "3.8"\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - DATABASE_URL=postgres://user:pass@db:5432/mydb\n      - REDIS_URL=redis://cache:6379\n    depends_on:\n      - db\n      - cache\n\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n      POSTGRES_DB: mydb\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    ports:\n      - "5432:5432"\n\n  cache:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n\nvolumes:\n  pgdata:\n\n# Commands\n# docker compose up -d       # Start all services\n# docker compose down        # Stop all services\n# docker compose logs -f app # Follow app logs`, codeLabel: 'Docker Compose', keyPoints: ['Define multi-container apps in one YAML file.', 'Services communicate via service names (db, cache).', 'Volumes persist data across container restarts.', 'depends_on controls startup order.'] },
      { title: 'Docker Best Practices', content: `Use **specific image tags** (\`node:20-alpine\`, not \`node:latest\`) for reproducible builds. Use \`.dockerignore\` to exclude \`node_modules\`, \`.git\`, and other unnecessary files from the build context.\n\n### Multi-Stage Builds\n\n**Multi-stage builds** separate the build environment from the production image. The build stage installs dev dependencies and compiles code. The production stage copies only the compiled output, resulting in a **much smaller image**.\n\n### Security\n\nDon't run containers as root (\`USER node\`). Don't store secrets in Dockerfiles or images — use environment variables or **Docker secrets**. Scan images for vulnerabilities with \`docker scout\`.\n\n### Keep Images Small\n\nUse **alpine-based** images, minimize layers (combine \`RUN\` commands), and remove cache files after installing packages.`, code: `# Multi-stage build (React app)\nFROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json .\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Production stage — only compiled output\nFROM nginx:alpine\nCOPY --from=build /app/dist /usr/share/nginx/html\nEXPOSE 80\n\n# .dockerignore\nnode_modules\n.git\n*.md\n.env\ndist`, codeLabel: 'Multi-Stage Build', keyPoints: ['Use specific image tags, never :latest.', 'Multi-stage builds dramatically reduce image size.', 'Never run containers as root in production.', 'Use .dockerignore to exclude unnecessary files.'] }
    ]
  }
];

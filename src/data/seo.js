/*
 * Search-engine metadata shared by the app (useSEO) and the build-time
 * prerender script (scripts/generate-seo.mjs).
 *
 * Per course:
 *   title       — keyword-rich page title (kept under ~60 chars with the site suffix)
 *   description — meta description (~150–160 chars, shown as the search snippet)
 *   keywords    — comma-separated search terms (meta keywords + JSON-LD `keywords`)
 */
export const SITE_URL = 'https://guide.redexoans.com';
export const SITE_NAME = 'QuickDevGuide';
export const SITE_TAGLINE = 'Developer Quick Reference, Tutorials & Code Examples';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export const HOME_SEO = {
  title: `${SITE_NAME} — Free Developer Quick Reference, Programming Tutorials & Cheat Sheets`,
  description:
    'Free developer quick reference with programming tutorials, cheat sheets, code examples and diagrams for 55+ technologies — JavaScript, React, Java, Python, C#, SQL, Docker, Kubernetes, AWS and more.',
  keywords: [
    'developer quick reference', 'programming tutorials', 'free coding tutorials', 'programming cheat sheet',
    'developer cheat sheet', 'learn programming online', 'coding guide for beginners', 'software development guide',
    'code examples', 'interview preparation', 'full stack developer guide', 'web development tutorial',
    'backend development tutorial', 'frontend development tutorial', 'DevOps tutorial', 'cloud computing tutorial',
    'JavaScript tutorial', 'React tutorial', 'Angular tutorial', 'Next.js tutorial', 'Java tutorial', 'Python tutorial',
    'C# tutorial', '.NET tutorial', 'Spring Boot tutorial', 'Django tutorial', 'FastAPI tutorial', 'SQL tutorial',
    'PostgreSQL tutorial', 'MongoDB tutorial', 'Redis tutorial', 'Docker tutorial', 'Kubernetes tutorial',
    'Terraform tutorial', 'AWS tutorial', 'GCP tutorial', 'Azure DevOps tutorial', 'GitHub Actions tutorial',
    'Kafka tutorial', 'RabbitMQ tutorial', 'Playwright tutorial', 'Selenium tutorial', 'OWASP Top 10',
    'system design', 'design patterns', 'data structures and algorithms', 'OOP concepts', 'SDLC', 'QuickDevGuide',
  ].join(', '),
};

export const courseSEO = {
  sdlc: {
    title: 'SDLC Tutorial — Software Development Life Cycle Models, Agile & Scrum',
    description: 'Learn the Software Development Life Cycle (SDLC): phases, Waterfall, Agile, Scrum, Kanban, V-Model, Spiral and DevOps models with diagrams and real-world examples.',
    keywords: 'SDLC, software development life cycle, SDLC phases, SDLC models, waterfall model, agile methodology, scrum framework, kanban, V-model, spiral model, iterative model, DevOps lifecycle, sprint planning, requirement analysis, software testing life cycle, STLC, software engineering, project management, agile vs waterfall, scrum roles, user stories, SDLC interview questions',
  },
  'development-strategies': {
    title: 'Software Development Strategies — Greenfield, Brownfield, Blue-Green & Canary',
    description: 'Software development and deployment strategies explained: greenfield vs brownfield, strangler fig, replatforming, blue-green, canary releases, and testing strategies.',
    keywords: 'software development strategies, deployment strategies, greenfield vs brownfield, strangler fig pattern, legacy modernization, replatforming, rehosting, refactoring, blue-green deployment, canary deployment, rolling deployment, feature flags, A/B testing, integration strategies, testing strategies, test pyramid, shift-left testing, application migration, cloud migration strategy, 6 Rs of migration',
  },
  oops: {
    title: 'OOPs Concepts Tutorial — Classes, Inheritance, Polymorphism & SOLID',
    description: 'Master Object-Oriented Programming (OOPs): classes, objects, encapsulation, inheritance, polymorphism, abstraction, interfaces and SOLID principles with code examples.',
    keywords: 'OOPs concepts, object oriented programming, OOP tutorial, classes and objects, encapsulation, inheritance, polymorphism, abstraction, interfaces, abstract class, method overloading, method overriding, constructors, composition vs inheritance, SOLID principles, single responsibility principle, dependency inversion, OOP interview questions, four pillars of OOP, OOP in Java, OOP in C#, OOP in Python, OOP in JavaScript',
  },
  'data-structure': {
    title: 'Data Structures Tutorial — Arrays, Linked Lists, Trees, Graphs & Big O',
    description: 'Learn data structures and algorithms: arrays, linked lists, stacks, queues, hash tables, trees, heaps, graphs, sorting, searching and Big O complexity with code.',
    keywords: 'data structures, data structures and algorithms, DSA tutorial, arrays, linked list, stack, queue, hash table, hash map, binary tree, binary search tree, heap, priority queue, graph, trie, sorting algorithms, binary search, BFS, DFS, recursion, dynamic programming, Big O notation, time complexity, space complexity, coding interview, LeetCode preparation',
  },
  'design-patterns': {
    title: 'Design Patterns Tutorial — Gang of Four, SOLID & DDD with Examples',
    description: 'Software design patterns explained with code: creational, structural and behavioral GoF patterns — Singleton, Factory, Observer, Strategy, Adapter, Decorator — plus DDD.',
    keywords: 'design patterns, software design patterns, gang of four, GoF design patterns, creational patterns, structural patterns, behavioral patterns, singleton pattern, factory pattern, abstract factory, builder pattern, prototype pattern, adapter pattern, decorator pattern, facade pattern, proxy pattern, observer pattern, strategy pattern, command pattern, repository pattern, dependency injection, domain driven design, DDD, SOLID principles, design patterns interview questions',
  },
  'sys-arch': {
    title: 'System Design & Architecture Tutorial — Microservices, Scalability & Caching',
    description: 'System design and software architecture guide: monolith vs microservices, scalability, load balancing, caching, CAP theorem, message queues and event-driven design.',
    keywords: 'system design, system architecture, software architecture, system design interview, microservices architecture, monolith vs microservices, scalability, horizontal scaling, vertical scaling, load balancing, caching strategies, CDN, database sharding, replication, CAP theorem, message queue, event driven architecture, API gateway, service discovery, high availability, fault tolerance, distributed systems, high level design, low level design',
  },
  html: {
    title: 'HTML Tutorial — HTML5 Tags, Forms, Semantic HTML & Accessibility',
    description: 'Complete HTML5 tutorial and cheat sheet: elements, attributes, semantic tags, forms, tables, media, SEO meta tags and accessibility (ARIA) with copy-ready examples.',
    keywords: 'HTML, HTML5, HTML tutorial, HTML cheat sheet, learn HTML, HTML tags, HTML elements, HTML attributes, semantic HTML, HTML forms, input types, HTML tables, HTML lists, HTML links, HTML images, audio and video tags, iframe, meta tags, SEO HTML, web accessibility, ARIA, HTML canvas, HTML for beginners, web development basics, HTML interview questions',
  },
  css: {
    title: 'CSS Tutorial — Flexbox, Grid, Responsive Design & Animations',
    description: 'CSS3 tutorial and cheat sheet: selectors, box model, specificity, Flexbox, CSS Grid, positioning, media queries, responsive design, variables, transitions and animations.',
    keywords: 'CSS, CSS3, CSS tutorial, CSS cheat sheet, learn CSS, CSS selectors, CSS specificity, box model, CSS flexbox, flexbox tutorial, CSS grid, grid layout, CSS position, display property, responsive web design, media queries, CSS variables, custom properties, CSS animations, keyframes, CSS transitions, CSS gradients, box shadow, pseudo classes, pseudo elements, CSS for beginners, CSS interview questions',
  },
  'tailwind-css': {
    title: 'Tailwind CSS Tutorial — Utility-First Classes, Responsive & Dark Mode',
    description: 'Tailwind CSS tutorial and cheat sheet: utility-first classes, responsive breakpoints, Flexbox and Grid, dark mode, custom themes, plugins and React/Next.js setup.',
    keywords: 'Tailwind CSS, Tailwind tutorial, Tailwind CSS cheat sheet, utility-first CSS, Tailwind classes, Tailwind responsive design, Tailwind breakpoints, Tailwind flexbox, Tailwind grid, Tailwind dark mode, tailwind.config.js, Tailwind custom theme, Tailwind plugins, Tailwind v4, Tailwind with React, Tailwind with Next.js, PostCSS, Tailwind components, Tailwind vs Bootstrap, @apply directive',
  },
  javascript: {
    title: 'JavaScript Tutorial — ES6+, DOM, Promises, Async/Await & Closures',
    description: 'Modern JavaScript tutorial and cheat sheet: ES6+ syntax, functions, closures, prototypes, DOM, events, promises, async/await, modules and the event loop with examples.',
    keywords: 'JavaScript, JS, JavaScript tutorial, JavaScript cheat sheet, learn JavaScript, ES6, ES2024, modern JavaScript, let const var, arrow functions, closures, hoisting, scope, this keyword, prototypes, classes, destructuring, spread operator, array methods, map filter reduce, DOM manipulation, event handling, event loop, promises, async await, fetch API, modules, JSON, JavaScript interview questions',
  },
  react: {
    title: 'React Tutorial — Hooks, Components, State, Router & Performance',
    description: 'React JS tutorial and cheat sheet: JSX, components, props, state, hooks (useState, useEffect, useContext, useMemo), React Router, forms, context and performance tips.',
    keywords: 'React, React JS, ReactJS, React tutorial, React cheat sheet, learn React, React hooks, useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef, custom hooks, JSX, React components, props, state management, React Router, React forms, Context API, Redux, React 19, React performance, virtual DOM, React interview questions, frontend development',
  },
  angular: {
    title: 'Angular Tutorial — Components, Signals, RxJS, Routing & DI',
    description: 'Angular tutorial for developers: standalone components, data binding, directives, services, dependency injection, routing, forms, RxJS, signals and lifecycle hooks.',
    keywords: 'Angular, Angular tutorial, Angular cheat sheet, learn Angular, Angular 18, Angular 19, TypeScript, Angular components, standalone components, Angular signals, data binding, directives, pipes, Angular services, dependency injection, Angular routing, reactive forms, template driven forms, RxJS, observables, HttpClient, lifecycle hooks, NgModule, Angular CLI, Angular interview questions',
  },
  nextjs: {
    title: 'Next.js Tutorial — App Router, Server Components, SSR, SSG & ISR',
    description: 'Next.js tutorial and cheat sheet: App Router, React Server Components, SSR, SSG, ISR, data fetching, server actions, route handlers, middleware and Vercel deployment.',
    keywords: 'Next.js, NextJS, Next.js tutorial, Next.js 15, Next.js App Router, Pages Router, React Server Components, server actions, SSR, server side rendering, SSG, static site generation, ISR, incremental static regeneration, Next.js data fetching, route handlers, API routes, Next.js middleware, dynamic routes, Next.js SEO, Next.js image optimization, Vercel deployment, Next.js interview questions',
  },
  ionic: {
    title: 'Ionic & Cordova Tutorial — Hybrid Mobile Apps with Angular & Capacitor',
    description: 'Build hybrid mobile apps with Ionic and Cordova: UI components, Angular integration, native plugins, Capacitor, and Android/iOS build and deployment workflow.',
    keywords: 'Ionic, Ionic framework, Ionic tutorial, Apache Cordova, Cordova tutorial, Capacitor, hybrid mobile app development, cross-platform mobile app, Ionic Angular, Ionic React, Ionic components, Cordova plugins, native device features, Android build, iOS build, Ionic CLI, Ionic deployment, PWA, mobile app tutorial',
  },
  flutter: {
    title: 'Flutter Tutorial — Dart, Widgets, State Management & Firebase',
    description: 'Flutter and Dart tutorial: widgets, layouts, navigation with GoRouter, state management with Riverpod/Provider, REST APIs, Firebase and building cross-platform apps.',
    keywords: 'Flutter, Flutter tutorial, Dart, Dart programming, Flutter widgets, stateless widget, stateful widget, Flutter layout, Flutter navigation, GoRouter, Flutter state management, Riverpod, Provider, BLoC, Flutter Firebase, Flutter REST API, Flutter forms, Material Design, cross-platform mobile development, Flutter Android iOS, Flutter web, barcode scanning, Flutter interview questions',
  },
  java: {
    title: 'Java Tutorial — Core Java, Collections, Streams, Lambdas & Multithreading',
    description: 'Core Java tutorial and cheat sheet: OOP, collections framework, generics, lambda expressions, Stream API, exception handling, multithreading, virtual threads and JVM.',
    keywords: 'Java, Java tutorial, core Java, Java cheat sheet, learn Java, Java 21, Java 17, JVM, JDK, Java OOP, Java collections, ArrayList, HashMap, generics, lambda expressions, functional interfaces, Stream API, collectors, Optional, exception handling, multithreading, concurrency, ExecutorService, CompletableFuture, virtual threads, records, sealed classes, Java interview questions',
  },
  csharp: {
    title: 'C# Tutorial — .NET, LINQ, Async/Await, Generics & OOP',
    description: 'C# tutorial and cheat sheet for .NET developers: types, OOP, generics, collections, LINQ, delegates, events, async/await, records, pattern matching and ASP.NET basics.',
    keywords: 'C#, C sharp, C# tutorial, C# cheat sheet, learn C#, .NET, .NET 8, .NET 9, C# 12, C# OOP, classes, interfaces, generics, collections, LINQ, lambda expressions, delegates, events, async await, Task, records, pattern matching, nullable reference types, exception handling, dependency injection, ASP.NET Core, C# interview questions',
  },
  python: {
    title: 'Python Tutorial — Syntax, Data Structures, OOP, Async & Libraries',
    description: 'Python tutorial and cheat sheet: syntax, lists, dicts, comprehensions, functions, OOP, decorators, generators, file handling, virtual environments, async and pip.',
    keywords: 'Python, Python tutorial, Python cheat sheet, learn Python, Python 3, Python for beginners, Python syntax, Python lists, dictionaries, tuples, sets, list comprehension, Python functions, lambda, Python OOP, classes, decorators, generators, iterators, exception handling, file handling, modules and packages, pip, virtual environment, asyncio, type hints, Python scripting, Python interview questions',
  },
  php: {
    title: 'PHP Tutorial — Syntax, OOP, MySQL, Composer & Laravel',
    description: 'PHP tutorial and cheat sheet: syntax, arrays, functions, OOP, forms, sessions, MySQL with PDO, Composer and Laravel basics for server-side web development.',
    keywords: 'PHP, PHP tutorial, PHP cheat sheet, learn PHP, PHP 8, PHP syntax, PHP arrays, PHP functions, PHP OOP, PHP forms, PHP sessions, cookies, PHP MySQL, PDO, prepared statements, Composer, Laravel, Eloquent ORM, Blade templates, PHP REST API, server-side scripting, PHP web development, PHP interview questions',
  },
  'java-reports': {
    title: 'Java Report Development — JasperReports, iText & Apache POI',
    description: 'Generate reports in Java: JasperReports, iText PDF, Apache POI Excel exports, report templates, charts and exporting PDF/Excel from Spring Boot applications.',
    keywords: 'Java reports, Java report development, JasperReports, Jaspersoft Studio, JRXML, iText, Java PDF generation, Apache POI, Java Excel export, Java reporting tools, BIRT, report templates, Spring Boot reports, export to PDF, export to Excel, Java charts, business reports',
  },
  'spring-boot': {
    title: 'Spring Boot Tutorial — REST APIs, Spring Data JPA, Security & Microservices',
    description: 'Spring Boot tutorial: auto-configuration, REST controllers, Spring Data JPA, validation, exception handling, Spring Security with JWT, testing and microservices.',
    keywords: 'Spring Boot, Spring Boot tutorial, Spring Boot 3, Spring Framework, Spring Boot REST API, Spring MVC, RestController, Spring Data JPA, Hibernate, Spring Boot validation, exception handling, Spring Security, JWT authentication, OAuth2, Spring Boot testing, JUnit, Mockito, Spring Boot microservices, Spring Cloud, application.properties, Actuator, dependency injection, Spring Boot interview questions',
  },
  'dotnet-api': {
    title: 'ASP.NET Core Web API Tutorial — REST, EF Core, JWT Auth & Middleware',
    description: 'Build REST APIs with ASP.NET Core Web API: controllers, minimal APIs, middleware, dependency injection, EF Core, JWT authentication, caching, logging and testing.',
    keywords: '.NET Core Web API, ASP.NET Core Web API, ASP.NET Core tutorial, .NET 8 Web API, REST API in C#, minimal APIs, controllers, middleware pipeline, dependency injection, Entity Framework Core, EF Core migrations, JWT authentication, authorization, caching, Redis cache, Serilog logging, multi-tenancy, API versioning, Swagger, OpenAPI, load testing, .NET backend, Web API interview questions',
  },
  blazor: {
    title: 'Blazor Tutorial — Razor Components, WebAssembly & Server in C#',
    description: 'Blazor tutorial: build interactive web UIs in C# with Razor components, Blazor Server, Blazor WebAssembly, data binding, routing, forms, DI and SignalR.',
    keywords: 'Blazor, Blazor tutorial, Blazor WebAssembly, Blazor WASM, Blazor Server, Blazor United, .NET 8 Blazor, Razor components, C# web development, Blazor data binding, Blazor routing, Blazor forms, EditForm, Blazor lifecycle, dependency injection, SignalR, JavaScript interop, Blazor state management, .NET frontend, Blazor vs React',
  },
  django: {
    title: 'Django Tutorial — Models, Views, ORM, Admin & Django REST Framework',
    description: 'Django tutorial for Python web developers: MVT pattern, models, ORM queries, views, templates, forms, admin panel, authentication and Django REST Framework APIs.',
    keywords: 'Django, Django tutorial, Python Django, Django framework, Django MVT, Django models, Django ORM, Django queryset, Django views, class based views, Django templates, Django forms, Django admin, Django authentication, Django REST Framework, DRF, serializers, Django migrations, Django middleware, Django deployment, Python web framework, Django interview questions',
  },
  flask: {
    title: 'Flask Tutorial — Python Web Framework, Routing, Jinja2 & REST APIs',
    description: 'Flask tutorial: routing, Jinja2 templates, forms, blueprints, SQLAlchemy, authentication, building REST APIs and deploying Python Flask apps to production.',
    keywords: 'Flask, Flask tutorial, Python Flask, Flask framework, Flask routing, Jinja2 templates, Flask forms, WTForms, Flask blueprints, Flask SQLAlchemy, Flask-Migrate, Flask login, Flask REST API, Flask-RESTful, Flask JWT, Flask application factory, Gunicorn, Flask deployment, Python web framework, Flask vs Django, microframework',
  },
  fastapi: {
    title: 'FastAPI Tutorial — Python REST APIs, Pydantic, Async & OAuth2',
    description: 'FastAPI tutorial: build fast Python REST APIs with path operations, Pydantic models, validation, dependency injection, async database access, OAuth2/JWT and docs.',
    keywords: 'FastAPI, FastAPI tutorial, Python FastAPI, Python REST API, Pydantic, Pydantic v2, request validation, path parameters, query parameters, dependency injection, async Python, SQLAlchemy, FastAPI database, OAuth2, JWT authentication, OpenAPI, Swagger UI, Uvicorn, background tasks, FastAPI testing, FastAPI vs Flask, FastAPI deployment',
  },
  'play-framework': {
    title: 'Play Framework Tutorial — Reactive Java Web Apps & REST APIs',
    description: 'Play Framework (Java) tutorial: routing, controllers, Twirl templates, forms, JSON REST APIs, async actions, database access with Ebean/JPA and deployment.',
    keywords: 'Play Framework, Play Framework tutorial, Play Framework Java, Play 2, reactive web framework, Akka, Pekko, Play routes, Play controllers, Twirl templates, Play forms, Play JSON, REST API Java, async actions, CompletionStage, Ebean, JPA, sbt, Play deployment, Java web framework',
  },
  'dotnet-framework': {
    title: '.NET Framework Tutorial — ASP.NET MVC, WCF, Web Forms & Migration',
    description: 'Legacy and enterprise .NET Framework guide: CLR, ASP.NET MVC, Web Forms, WCF, Web API 2, Entity Framework 6, IIS hosting and migrating to modern .NET.',
    keywords: '.NET Framework, .NET Framework 4.8, ASP.NET MVC, ASP.NET Web Forms, WCF, Web API 2, Entity Framework 6, CLR, GAC, web.config, IIS hosting, Windows services, legacy .NET, enterprise .NET, .NET Framework vs .NET Core, migrate to .NET 8, .NET upgrade assistant, C# legacy applications',
  },
  'graphql-grpc': {
    title: 'GraphQL & gRPC Tutorial — Schemas, Resolvers, Protobuf & Streaming',
    description: 'GraphQL and gRPC tutorial: schemas, queries, mutations, resolvers, subscriptions, Protocol Buffers, gRPC streaming, and choosing between REST, GraphQL and gRPC.',
    keywords: 'GraphQL, GraphQL tutorial, GraphQL schema, queries, mutations, subscriptions, resolvers, Apollo Server, Apollo Client, Hot Chocolate, gRPC, gRPC tutorial, Protocol Buffers, protobuf, gRPC streaming, gRPC .NET, gRPC Java, REST vs GraphQL, REST vs gRPC, API design, microservices communication',
  },
  sql: {
    title: 'SQL Tutorial — Queries, Joins, Indexes, Stored Procedures & Optimization',
    description: 'SQL tutorial and cheat sheet: SELECT, WHERE, JOINs, GROUP BY, subqueries, CTEs, window functions, indexes, normalization, transactions and query optimization.',
    keywords: 'SQL, SQL tutorial, SQL cheat sheet, learn SQL, SQL queries, SELECT statement, WHERE clause, SQL joins, inner join, left join, GROUP BY, HAVING, subqueries, CTE, window functions, ROW_NUMBER, indexes, normalization, primary key, foreign key, stored procedures, triggers, views, transactions, ACID, SQL Server, MySQL, query optimization, SQL interview questions',
  },
  postgresql: {
    title: 'PostgreSQL Tutorial — Queries, JSONB, Indexes, Performance & Replication',
    description: 'PostgreSQL tutorial: data types, queries, joins, CTEs, JSONB, indexes (B-tree, GIN), EXPLAIN ANALYZE, partitioning, functions, MVCC, backups and replication.',
    keywords: 'PostgreSQL, Postgres, PostgreSQL tutorial, PostgreSQL cheat sheet, psql, PostgreSQL data types, PostgreSQL queries, JSONB, PostgreSQL indexes, GIN index, B-tree index, EXPLAIN ANALYZE, query performance tuning, partitioning, PL/pgSQL, functions, triggers, MVCC, VACUUM, pg_dump, backup and restore, streaming replication, PostgreSQL vs MySQL, PostgreSQL interview questions',
  },
  nosql: {
    title: 'NoSQL Database Tutorial — Document, Key-Value, Column & Graph Databases',
    description: 'NoSQL databases explained: document, key-value, wide-column and graph stores, schema design, CAP theorem, and when to choose MongoDB, Redis, Cassandra or SQL.',
    keywords: 'NoSQL, NoSQL database, NoSQL tutorial, SQL vs NoSQL, document database, key-value store, wide column store, graph database, MongoDB, Redis, Cassandra, DynamoDB, Neo4j, CouchDB, schema design, denormalization, CAP theorem, BASE vs ACID, horizontal scaling, sharding, NoSQL interview questions',
  },
  redis: {
    title: 'Redis Tutorial — Caching, Data Types, Pub/Sub, Rate Limiting & Cluster',
    description: 'Redis tutorial: data types, caching patterns, TTL and eviction policies, pub/sub, streams, rate limiting, persistence (RDB/AOF), Sentinel and Redis Cluster.',
    keywords: 'Redis, Redis tutorial, Redis cheat sheet, Redis cache, in-memory database, Redis data types, Redis strings, hashes, lists, sets, sorted sets, Redis streams, cache aside pattern, TTL, key expiration, eviction policies, allkeys-lru, Redis pub sub, rate limiter, sliding window, distributed lock, RDB, AOF persistence, Redis Sentinel, Redis Cluster, Redis interview questions',
  },
  mongodb: {
    title: 'MongoDB Tutorial — CRUD, Aggregation Pipeline, Indexes & Schema Design',
    description: 'MongoDB tutorial: documents and collections, CRUD operations, query operators, aggregation pipeline, indexes, schema design, transactions, replica sets and sharding.',
    keywords: 'MongoDB, MongoDB tutorial, MongoDB cheat sheet, NoSQL database, document database, MongoDB CRUD, find query, MongoDB operators, aggregation pipeline, $lookup, $group, MongoDB indexes, schema design, embedding vs referencing, Mongoose, MongoDB transactions, replica set, sharding, MongoDB Atlas, mongosh, MongoDB interview questions',
  },
  elasticsearch: {
    title: 'Elasticsearch Tutorial — Indexing, Query DSL, Aggregations & Mappings',
    description: 'Elasticsearch tutorial: indices, mappings, analyzers, full-text search, Query DSL, bool queries, aggregations, relevance scoring, ELK stack and cluster scaling.',
    keywords: 'Elasticsearch, Elasticsearch tutorial, Elastic Stack, ELK stack, Kibana, Logstash, full text search, inverted index, Elasticsearch mapping, analyzers, tokenizers, Query DSL, bool query, match query, term query, aggregations, relevance scoring, BM25, shards and replicas, Elasticsearch cluster, OpenSearch, search engine, Elasticsearch interview questions',
  },
  ssrs: {
    title: 'SSRS Tutorial — SQL Server Reporting Services Report Development',
    description: 'SSRS report development tutorial: data sources, datasets, parameters, tablix, matrix, charts, expressions, subreports, drill-down, deployment and subscriptions.',
    keywords: 'SSRS, SQL Server Reporting Services, SSRS tutorial, SSRS report development, Report Builder, RDL, Visual Studio report designer, SSRS parameters, cascading parameters, tablix, matrix report, SSRS charts, SSRS expressions, subreports, drill-down reports, drill-through reports, SSRS deployment, report server, SSRS subscriptions, paginated reports, Power BI paginated reports',
  },
  etl: {
    title: 'ETL Tutorial — Talend & SSIS Data Integration and Pipelines',
    description: 'ETL tutorial with Talend and SSIS: extract, transform, load concepts, data flows, transformations, lookups, error handling, scheduling and data warehouse loading.',
    keywords: 'ETL, ETL tutorial, extract transform load, ETL pipeline, data integration, Talend, Talend Open Studio, Talend tutorial, SSIS, SQL Server Integration Services, SSIS tutorial, data flow task, control flow, transformations, lookup, slowly changing dimension, SCD, data warehouse, ELT vs ETL, data pipeline, data engineering, ETL testing, ETL interview questions',
  },
  playwright: {
    title: 'Playwright Tutorial — End-to-End Testing with TypeScript',
    description: 'Playwright tutorial: end-to-end browser testing with TypeScript, locators, auto-waiting, assertions, fixtures, Page Object Model, API testing and CI integration.',
    keywords: 'Playwright, Playwright tutorial, Playwright TypeScript, Playwright test, end to end testing, E2E testing, browser automation, test automation, Playwright locators, auto waiting, assertions, fixtures, Page Object Model, POM, Playwright API testing, codegen, trace viewer, parallel testing, cross browser testing, Playwright CI, Playwright vs Selenium, Playwright vs Cypress',
  },
  selenium: {
    title: 'Selenium Tutorial — WebDriver Automation Testing with Java & TestNG',
    description: 'Selenium WebDriver with Java tutorial: locators, waits, actions, TestNG, Page Object Model, data-driven frameworks, Selenium Grid and CI test automation.',
    keywords: 'Selenium, Selenium tutorial, Selenium WebDriver, Selenium Java, automation testing, test automation framework, locators, XPath, CSS selectors, implicit wait, explicit wait, fluent wait, Actions class, TestNG, JUnit, Page Object Model, Page Factory, data driven testing, Selenium Grid, cross browser testing, Maven, Selenium 4, Selenium interview questions',
  },
  k6: {
    title: 'Grafana k6 Tutorial — Load Testing & Performance Testing in JavaScript',
    description: 'Grafana k6 load testing tutorial: writing JavaScript test scripts, virtual users, stages, thresholds, checks, scenarios, metrics and running performance tests in CI.',
    keywords: 'k6, Grafana k6, k6 tutorial, load testing, performance testing, stress testing, spike testing, soak testing, k6 scripts, virtual users, VUs, k6 stages, thresholds, checks, scenarios, k6 metrics, k6 cloud, API load testing, k6 CI, k6 vs JMeter',
  },
  jmeter: {
    title: 'Apache JMeter Tutorial — Load Testing, Thread Groups & Reports',
    description: 'Apache JMeter tutorial: test plans, thread groups, samplers, listeners, assertions, correlation, parameterization, distributed load testing and HTML dashboard reports.',
    keywords: 'JMeter, Apache JMeter, JMeter tutorial, load testing, performance testing, stress testing, JMeter test plan, thread group, HTTP request sampler, listeners, assertions, timers, CSV data set config, parameterization, correlation, regular expression extractor, JMeter non-GUI mode, distributed testing, JMeter HTML report, JMeter API testing, JMeter vs k6',
  },
  mocha: {
    title: 'Mocha JS Testing Tutorial — Unit Testing with Chai, Sinon & Coverage',
    description: 'Mocha JavaScript testing tutorial: describe/it, hooks, async tests, Chai assertions, Sinon spies/stubs/mocks, Supertest API testing and code coverage with nyc.',
    keywords: 'Mocha, Mocha JS, Mocha tutorial, JavaScript unit testing, Node.js testing, Chai assertions, expect, should, Sinon, spies, stubs, mocks, async testing, hooks, before each, Supertest, API testing, code coverage, nyc, Istanbul, TDD, BDD, Mocha vs Jest',
  },
  linux: {
    title: 'Linux Tutorial — Commands, Administration, Bash, Nginx & Deployment',
    description: 'Linux administration tutorial and command cheat sheet: file system, permissions, users, processes, systemd, networking, Bash scripting, Nginx and app deployment.',
    keywords: 'Linux, Linux tutorial, Linux commands, Linux cheat sheet, Linux administration, Ubuntu, file permissions, chmod, chown, users and groups, sudo, process management, systemd, systemctl, cron jobs, Bash scripting, shell scripting, SSH, networking commands, firewall, ufw, Nginx, reverse proxy, SSL certificates, Let\'s Encrypt, deploy app on Linux server, Linux interview questions',
  },
  docker: {
    title: 'Docker Tutorial — Images, Containers, Dockerfile, Compose & Networking',
    description: 'Docker tutorial and cheat sheet: images, containers, Dockerfile best practices, multi-stage builds, volumes, networking, Docker Compose and container deployment.',
    keywords: 'Docker, Docker tutorial, Docker cheat sheet, Docker commands, containers, containerization, Docker image, Docker container, Dockerfile, multi-stage build, Docker Compose, Docker volumes, Docker networking, Docker Hub, container registry, Docker vs virtual machine, Docker for beginners, microservices, Docker best practices, DevOps, Docker interview questions',
  },
  kubernetes: {
    title: 'Kubernetes Tutorial — Pods, Deployments, Services, Helm & Autoscaling',
    description: 'Kubernetes (K8s) tutorial: architecture, pods, deployments, services, ingress, ConfigMaps, secrets, volumes, Helm charts, HPA autoscaling and kubectl commands.',
    keywords: 'Kubernetes, K8s, Kubernetes tutorial, Kubernetes cheat sheet, kubectl commands, container orchestration, Kubernetes architecture, pods, deployments, ReplicaSet, services, ingress, ConfigMap, secrets, persistent volumes, StatefulSet, DaemonSet, namespaces, Helm charts, HPA, horizontal pod autoscaler, AKS, EKS, GKE, Kubernetes interview questions',
  },
  terraform: {
    title: 'Terraform Tutorial — Infrastructure as Code with HCL, Modules & State',
    description: 'Terraform tutorial: Infrastructure as Code with HCL, providers, resources, variables, modules, state management, workspaces, multi-environment setups and Terragrunt.',
    keywords: 'Terraform, Terraform tutorial, Terraform cheat sheet, Infrastructure as Code, IaC, HCL, HashiCorp, Terraform providers, Terraform resources, variables, outputs, Terraform modules, Terraform state, remote state, state locking, workspaces, terraform plan, terraform apply, multi environment, Terragrunt, OpenTofu, Terraform AWS, Terraform Azure, Terraform interview questions',
  },
  github: {
    title: 'Git & GitHub Tutorial — Commands, Branching, Pull Requests & Workflow',
    description: 'Git and GitHub tutorial with command cheat sheet: commits, branches, merging, rebasing, resolving conflicts, pull requests, forks and team collaboration workflows.',
    keywords: 'GitHub, Git, Git tutorial, GitHub tutorial, Git commands, Git cheat sheet, version control, git commit, git branch, git merge, git rebase, merge conflicts, git stash, git reset, git revert, pull request, fork, clone, GitHub workflow, Git flow, trunk based development, code review, GitHub CLI, Git interview questions',
  },
  'github-actions': {
    title: 'GitHub Actions Tutorial — CI/CD Workflows, YAML, Runners & Secrets',
    description: 'GitHub Actions CI/CD tutorial: workflow YAML syntax, triggers, jobs, steps, matrix builds, caching, secrets, environments, reusable workflows and deployments.',
    keywords: 'GitHub Actions, GitHub Actions tutorial, CI/CD, continuous integration, continuous deployment, GitHub workflow, workflow YAML, triggers, on push, pull request trigger, jobs and steps, matrix strategy, runners, self-hosted runner, caching dependencies, secrets, environments, reusable workflows, composite actions, deploy with GitHub Actions, Docker build, DevOps automation',
  },
  'azure-devops': {
    title: 'Azure DevOps Tutorial — Pipelines, CI/CD, Boards, Repos & IaC',
    description: 'Complete Azure DevOps tutorial: Azure fundamentals, Boards, Repos, branching, YAML CI/CD pipelines, variables, agents, Infrastructure as Code and Docker deploys.',
    keywords: 'Azure DevOps, Azure DevOps tutorial, Azure Pipelines, YAML pipelines, CI/CD pipeline, Azure Boards, Azure Repos, Azure Artifacts, Azure Test Plans, build pipeline, release pipeline, pipeline variables, variable groups, self-hosted agent, service connections, branching strategy, ARM templates, Bicep, Infrastructure as Code, Azure virtual machines, VNet, App Service, Docker, Azure DevOps interview questions',
  },
  aws: {
    title: 'AWS Tutorial — EC2, S3, Lambda, IAM, VPC & Serverless',
    description: 'AWS tutorial and cheat sheet: core Amazon Web Services — EC2, S3, Lambda, IAM, VPC, RDS, DynamoDB, API Gateway, CloudWatch — plus serverless and security basics.',
    keywords: 'AWS, Amazon Web Services, AWS tutorial, AWS cheat sheet, cloud computing, AWS services, EC2, S3, Lambda, serverless, IAM, VPC, security groups, RDS, DynamoDB, API Gateway, CloudFront, Route 53, CloudWatch, SQS, SNS, ECS, EKS, Elastic Beanstalk, AWS CLI, AWS certification, AWS Solutions Architect, AWS interview questions',
  },
  gcp: {
    title: 'Google Cloud (GCP) Tutorial — Cloud Run, GKE, BigQuery & Pub/Sub',
    description: 'Google Cloud Platform (GCP) tutorial: Compute Engine, Cloud Run, Cloud Functions, GKE, Cloud Storage, Cloud SQL, BigQuery, Pub/Sub, IAM and gcloud CLI.',
    keywords: 'GCP, Google Cloud Platform, Google Cloud tutorial, GCP tutorial, gcloud CLI, Compute Engine, Cloud Run, Cloud Functions, App Engine, GKE, Google Kubernetes Engine, Cloud Storage, Cloud SQL, Firestore, BigQuery, Pub/Sub, IAM, VPC, Cloud Build, Artifact Registry, GCP certification, GCP vs AWS, cloud computing',
  },
  opentelemetry: {
    title: 'OpenTelemetry Tutorial — Distributed Tracing, Metrics & Logs',
    description: 'OpenTelemetry observability tutorial: traces, spans, metrics and logs, instrumenting .NET apps, the OTel Collector, context propagation, and exporting to Jaeger and Grafana.',
    keywords: 'OpenTelemetry, OTel, OpenTelemetry tutorial, observability, distributed tracing, traces, spans, metrics, logs, instrumentation, auto instrumentation, OpenTelemetry .NET, OpenTelemetry Collector, OTLP, context propagation, Jaeger, Zipkin, Prometheus, Grafana, Tempo, APM, monitoring microservices',
  },
  rabbitmq: {
    title: 'RabbitMQ & MassTransit Tutorial — Queues, Exchanges & Messaging in .NET',
    description: 'RabbitMQ with MassTransit tutorial: exchanges, queues, routing, quorum queues, retries, dead-letter queues, consumers, sagas and reliable messaging in .NET.',
    keywords: 'RabbitMQ, RabbitMQ tutorial, MassTransit, MassTransit tutorial, message broker, AMQP, message queue, exchanges, direct exchange, topic exchange, fanout exchange, queues, routing keys, quorum queues, lazy queues, dead letter queue, DLQ, retries, consumers, publish subscribe, sagas, outbox pattern, .NET messaging, event driven architecture, RabbitMQ vs Kafka',
  },
  kafka: {
    title: 'Apache Kafka Tutorial — Topics, Partitions, Producers, Consumers & Streams',
    description: 'Apache Kafka tutorial: brokers, topics, partitions, producers, consumer groups, offsets, delivery semantics, Kafka Connect, Kafka Streams and Spring Boot integration.',
    keywords: 'Apache Kafka, Kafka, Kafka tutorial, event streaming, message broker, Kafka topics, partitions, Kafka producer, Kafka consumer, consumer groups, offsets, Kafka brokers, ZooKeeper, KRaft, replication, exactly once semantics, Kafka Connect, Kafka Streams, Schema Registry, Avro, Spring Kafka, Kafka with Spring Boot, data pipeline, Kafka vs RabbitMQ, Kafka interview questions',
  },
  cloudflare: {
    title: 'Cloudflare Tutorial — CDN, DNS, WAF, DDoS Protection & Turnstile',
    description: 'Cloudflare guide: DNS setup, CDN caching, SSL/TLS, WAF rules, DDoS protection, bot management, Turnstile CAPTCHA, Workers and performance optimization.',
    keywords: 'Cloudflare, Cloudflare tutorial, Cloudflare CDN, Cloudflare DNS, SSL TLS, Cloudflare WAF, web application firewall, DDoS protection, bot management, Cloudflare Turnstile, CAPTCHA alternative, Cloudflare Workers, Cloudflare Pages, page rules, cache rules, rate limiting, Zero Trust, website security, website performance, edge computing',
  },
  owasp: {
    title: 'OWASP Top 10 Tutorial — Web Application Security Vulnerabilities & Fixes',
    description: 'OWASP Top 10 explained with examples and fixes: broken access control, injection, XSS, cryptographic failures, SSRF, misconfiguration and secure coding practices.',
    keywords: 'OWASP, OWASP Top 10, web application security, application security, secure coding, broken access control, cryptographic failures, injection, SQL injection, cross site scripting, XSS, CSRF, insecure design, security misconfiguration, vulnerable components, authentication failures, SSRF, security logging, penetration testing, OWASP ZAP, vulnerability prevention, security interview questions',
  },
};

/** Fallback metadata for a course without an entry above. */
export const getCourseSEO = (meta) =>
  courseSEO[meta.id] || {
    title: `${meta.title} Tutorial — Quick Reference & Code Examples`,
    description: `Learn ${meta.title}: ${meta.description} Concise explanations, code examples and diagrams.`,
    keywords: `${meta.title}, ${meta.title} tutorial, ${meta.title} cheat sheet, ${meta.title} examples, programming, developer guide`,
  };

/** Plain-text excerpt from markdown, trimmed on a word boundary. */
export const excerpt = (markdown, max = 155) => {
  const text = String(markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/^\s*\|?[-:| ]+\|?\s*$/gm, ' ')
    .replace(/[`*_~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s—-]+$/, '')}…`;
};

/** Metadata for a single section page of a course. */
export const getSectionSEO = (meta, section) => {
  const base = getCourseSEO(meta);
  const summary = excerpt(section.content, 120);
  return {
    title: `${section.title} — ${meta.title} Tutorial with Examples`,
    description: excerpt(`${meta.title} ${section.title}: ${summary || base.description}`, 158),
    keywords: `${meta.title} ${section.title}, ${section.title} tutorial, ${section.title} example, ${base.keywords}`,
  };
};

const ORGANIZATION = { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` };

export const websiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: 'Quick Dev Guide',
  url: `${SITE_URL}/`,
  description: HOME_SEO.description,
  inLanguage: 'en',
  publisher: ORGANIZATION,
});

/** JSON-LD for a course page, or one of its sections when `section` is given. */
export const courseJsonLd = (meta, { section, sectionPath, sections } = {}) => {
  const seo = getCourseSEO(meta);
  const courseUrl = `${SITE_URL}/${meta.id}`;
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: meta.title, item: courseUrl },
      ...(section ? [{ '@type': 'ListItem', position: 3, name: section.title, item: `${SITE_URL}${sectionPath}` }] : []),
    ],
  };

  if (section) {
    const sectionSeo = getSectionSEO(meta, section);
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TechArticle',
          headline: `${section.title} — ${meta.title}`,
          description: sectionSeo.description,
          keywords: sectionSeo.keywords,
          url: `${SITE_URL}${sectionPath}`,
          inLanguage: 'en',
          isAccessibleForFree: true,
          proficiencyLevel: 'Beginner',
          about: meta.title,
          isPartOf: { '@type': 'Course', name: `${meta.title} Tutorial`, url: courseUrl },
          author: ORGANIZATION,
          publisher: ORGANIZATION,
          image: DEFAULT_IMAGE,
        },
        breadcrumb,
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        name: `${meta.title} Tutorial`,
        description: seo.description,
        keywords: seo.keywords,
        url: courseUrl,
        inLanguage: 'en',
        isAccessibleForFree: true,
        educationalLevel: 'Beginner to Advanced',
        about: meta.title,
        image: DEFAULT_IMAGE,
        provider: ORGANIZATION,
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD', category: 'Free' },
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: `PT${Math.max(1, meta.sectionCount) * 10}M` },
        ...(sections ? { syllabusSections: sections.map(s => ({ '@type': 'Syllabus', name: s.title })) } : {}),
      },
      breadcrumb,
    ],
  };
};

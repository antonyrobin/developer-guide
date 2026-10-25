/*
 * Play Framework course extension — extra sections and worked examples merged
 * into courses-data/play-framework.js at load time. Examples use the Play 3.x
 * Java API (package play.mvc) with sbt; Play 2.9 code is identical apart from
 * the plugin version.
 */

export default {
  examples: {
    'Example Controller': [
      {
        title: 'Controller with status codes, headers and session',
        language: 'java',
        explanation: '`Results` helpers (`ok`, `created`, `badRequest`, `notFound`, `redirect`) build responses; chain `withHeader`, `withSession` or `as(...)` to customise them.',
        code: `package controllers;

import play.mvc.*;

public class GreetingController extends Controller {

    // GET /hello/:name?excited=true
    public Result hello(String name, boolean excited) {
        String msg = "Hello, " + name + (excited ? "!" : ".");
        return ok(msg).withHeader("X-Greeted", name);
    }

    // GET /me
    public Result me(Http.Request request) {
        return request.session().get("user")
                .map(user -> ok("Signed in as " + user))
                .orElseGet(() -> unauthorized("Please sign in"));
    }

    // POST /login
    public Result login(Http.Request request) {
        return redirect(routes.GreetingController.me())
                .addingToSession(request, "user", "ada");
    }

    public Result logout() {
        return redirect("/").withNewSession();
    }
}

// conf/routes
// GET   /hello/:name   controllers.GreetingController.hello(name: String, excited: Boolean ?= false)
// GET   /me            controllers.GreetingController.me(request: Request)
// POST  /login         controllers.GreetingController.login(request: Request)
// POST  /logout        controllers.GreetingController.logout()`,
      },
    ],
  },

  sections: [
    {
      title: 'Project Structure, sbt & Configuration',
      after: 'Installation & Setup',
      content: `\`sbt new playframework/play-java-seed.g8\` generates this layout:

\`\`\`
my-app/
├── app/                 # controllers, models, views (Twirl), services
│   ├── controllers/
│   └── views/index.scala.html
├── conf/
│   ├── application.conf # HOCON configuration
│   ├── routes           # URL → action mapping
│   └── logback.xml
├── public/              # static assets → /assets/*
├── test/
├── project/plugins.sbt  # sbt-plugin("org.playframework" % "sbt-plugin")
└── build.sbt
\`\`\`

### Everyday sbt commands

| Command | Purpose |
|---|---|
| \`sbt run\` | dev mode with hot reload on :9000 |
| \`sbt ~compile\` / \`~test\` | recompile / test on every change |
| \`sbt test\` | run tests |
| \`sbt dist\` / \`stage\` | production package |
| \`sbt dependencyUpdates\` | find outdated libs (plugin) |

### application.conf (HOCON)

Supports includes, substitutions and **environment overrides**: \`key = default\` followed by \`key = \${?ENV_VAR}\`. Read values with injected \`com.typesafe.config.Config\`.`,
      code: `// build.sbt
name := "orders-service"
version := "1.0.0"
scalaVersion := "2.13.15"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

libraryDependencies ++= Seq(
  guice,
  javaJdbc,
  evolutions,
  "org.postgresql" % "postgresql" % "42.7.4",
  "com.h2database" % "h2" % "2.3.232" % Test
)

// conf/application.conf
play.http.secret.key = "changeme"
play.http.secret.key = \${?APPLICATION_SECRET}

play.filters.enabled += play.filters.hosts.AllowedHostsFilter
play.filters.hosts.allowed = ["localhost:9000", \${?ALLOWED_HOST}]

db.default {
  driver = org.postgresql.Driver
  url = "jdbc:postgresql://localhost:5432/orders"
  url = \${?DATABASE_URL}
  username = orders
  password = \${?DB_PASSWORD}
}

orders {
  page-size = 20
  payment-timeout = 5 seconds
}`,
      codeLabel: 'build.sbt and application.conf',
      codeLanguage: 'scala',
      keyPoints: [
        '`app/` holds code, `conf/` holds routes and configuration, `public/` static assets.',
        '`sbt run` gives hot reload; `sbt dist` builds the production package.',
        'HOCON `${?VAR}` lets environment variables override defaults.',
        'Inject `Config` to read your own settings with types.',
      ],
    },
    {
      title: 'Routing & Request Parameters',
      after: 'Example Controller',
      content: `\`conf/routes\` maps **HTTP method + path** to a controller action. The file is **compiled**: typos and type mismatches fail the build, and Play generates a **reverse router** (\`routes.ProductController.show(42)\`) so links are never hard-coded.

| Pattern | Example |
|---|---|
| Static | \`GET /products\` |
| Dynamic part | \`GET /products/:id\` → \`show(id: Long)\` |
| Spanning slashes | \`GET /files/*path\` |
| Regex | \`GET /items/$id<[0-9]+>\` |
| Query parameter | \`list(page: Int ?= 1, q: String ?= "")\` |
| Optional | \`search(tag: java.util.Optional[String])\` |
| Request injection | \`create(request: Request)\` |

Routes are matched **top to bottom** — put specific routes before generic ones. Split large apps with \`-> /api api.Routes\`.`,
      code: `# conf/routes
GET     /products                 controllers.ProductController.list(page: Int ?= 1, q: String ?= "")
GET     /products/:id             controllers.ProductController.show(id: Long)
POST    /products                 controllers.ProductController.create(request: Request)
PUT     /products/:id             controllers.ProductController.update(id: Long, request: Request)
DELETE  /products/:id             controllers.ProductController.delete(id: Long)
GET     /files/*path              controllers.FileController.serve(path: String)
GET     /assets/*file             controllers.Assets.versioned(path = "/public", file: Asset)

# ---------------------------------------------------------------
# app/controllers/ProductController.java
package controllers;

import play.mvc.*;

public class ProductController extends Controller {

    public Result list(int page, String q) {
        if (page < 1) return badRequest("page must be >= 1");
        return ok("page=" + page + " q=" + q);
    }

    public Result show(Long id) {
        // Reverse routing: build URLs from actions, never by string concatenation
        String self = routes.ProductController.show(id).url();          // "/products/42"
        String next = routes.ProductController.list(2, "").url();       // "/products?page=2"
        return ok("product " + id + " self=" + self + " next=" + next);
    }

    public Result create(Http.Request request) {
        return created().withHeader(LOCATION, routes.ProductController.show(99L).url());
    }

    public Result update(Long id, Http.Request request) { return ok("updated " + id); }

    public Result delete(Long id) { return noContent(); }
}`,
      codeLabel: 'conf/routes + controller with reverse routing',
      codeLanguage: 'java',
      keyPoints: [
        'The routes file is compiled, so broken routes fail at build time.',
        'Path and query parameters are typed and can have defaults with `?=`.',
        'Use the reverse router (`routes.X.action(...)`) instead of hard-coded URLs.',
        'Routes match top to bottom — specific before generic.',
      ],
    },
    {
      title: 'JSON APIs',
      after: 'Routing & Request Parameters',
      content: `Play's Java API uses **Jackson** via \`play.libs.Json\`.

| Task | API |
|---|---|
| Object → JSON | \`Json.toJson(product)\` |
| JSON → object | \`Json.fromJson(node, Product.class)\` |
| Read request body | \`request.body().asJson()\` (returns \`null\` if not JSON) |
| Enforce JSON body | \`@BodyParser.Of(BodyParser.Json.class)\` |
| Build JSON by hand | \`Json.newObject().put("id", 1)\` |
| Respond | \`ok(jsonNode)\` → \`application/json\` |

Customise the \`ObjectMapper\` (dates as ISO strings, ignore unknown fields) by binding your own \`ObjectMapper\` provider, or call \`Json.setObjectMapper\` at startup.

Validate input before using it and return **400** with field errors for bad payloads.`,
      code: `package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.Json;
import play.mvc.*;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public class TodoController extends Controller {

    public record Todo(Long id, String title, boolean done) {}

    private static final Map<Long, Todo> TODOS = new ConcurrentHashMap<>();
    private static final AtomicLong IDS = new AtomicLong();

    public Result list() {
        return ok(Json.toJson(TODOS.values()));
    }

    @BodyParser.Of(BodyParser.Json.class)              // 400 automatically if body isn't JSON
    public Result create(Http.Request request) {
        JsonNode body = request.body().asJson();
        String title = Optional.ofNullable(body.get("title")).map(JsonNode::asText).orElse("").trim();
        if (title.length() < 3) {
            ObjectNode error = Json.newObject();
            error.putObject("errors").put("title", "must be at least 3 characters");
            return badRequest(error);
        }
        Todo todo = new Todo(IDS.incrementAndGet(), title, false);
        TODOS.put(todo.id(), todo);
        return created(Json.toJson(todo))
                .withHeader(LOCATION, "/todos/" + todo.id());
    }

    public Result toggle(Long id) {
        Todo current = TODOS.get(id);
        if (current == null) return notFound(Json.newObject().put("error", "todo " + id + " not found"));
        Todo updated = new Todo(id, current.title(), !current.done());
        TODOS.put(id, updated);
        return ok(Json.toJson(updated));
    }
}

// conf/routes
// GET    /todos              controllers.TodoController.list()
// POST   /todos              controllers.TodoController.create(request: Request)
// PATCH  /todos/:id/toggle   controllers.TodoController.toggle(id: Long)`,
      codeLabel: 'A JSON CRUD controller',
      codeLanguage: 'java',
      keyPoints: [
        '`Json.toJson` / `Json.fromJson` convert between objects and JSON with Jackson.',
        '`@BodyParser.Of(BodyParser.Json.class)` enforces a JSON request body.',
        'Return structured error objects with proper status codes.',
        'Configure the shared `ObjectMapper` once for dates and unknown fields.',
      ],
    },
    {
      title: 'Forms & Validation',
      after: 'JSON APIs',
      content: `\`FormFactory\` binds request data (form-encoded **or** JSON) to a Java class and runs **Jakarta Bean Validation** annotations.

| Annotation | Rule |
|---|---|
| \`@Required\` / \`@NotBlank\` | must be present |
| \`@Email\` | email format |
| \`@Min\`, \`@Max\`, \`@Size\` | numeric / length bounds |
| \`@Pattern\` | regex |
| class implements \`Validatable<String>\` | cross-field rules via \`validate()\` |

### Flow

1. \`Form<T> form = formFactory.form(T.class).bindFromRequest(request);\`
2. \`if (form.hasErrors())\` → re-render the view with \`badRequest(...)\` (or return \`form.errorsAsJson()\`).
3. Otherwise \`form.get()\` returns the bound object.

Templates use helpers like \`@helper.inputText(form("email"))\` and **\`@helper.CSRF.formField\`** — CSRF protection is on by default for form posts.`,
      code: `package forms;

import play.data.validation.Constraints.*;
import play.data.validation.Constraints.Validatable;
import play.data.validation.Constraints.Validate;

@Validate
public class SignupForm implements Validatable<String> {
    @Required @Email
    public String email;

    @Required @MinLength(12)
    public String password;

    @Required
    public String confirmPassword;

    @Min(13) @Max(120)
    public Integer age;

    @Override
    public String validate() {                     // cross-field rule → global error
        return password != null && password.equals(confirmPassword) ? null : "Passwords do not match";
    }
}

// app/controllers/SignupController.java
package controllers;

import forms.SignupForm;
import jakarta.inject.Inject;
import play.data.Form;
import play.data.FormFactory;
import play.i18n.MessagesApi;
import play.mvc.*;

public class SignupController extends Controller {
    private final FormFactory formFactory;
    private final MessagesApi messagesApi;

    @Inject
    public SignupController(FormFactory formFactory, MessagesApi messagesApi) {
        this.formFactory = formFactory;
        this.messagesApi = messagesApi;
    }

    public Result submit(Http.Request request) {
        Form<SignupForm> form = formFactory.form(SignupForm.class).bindFromRequest(request);
        if (form.hasErrors()) {
            return badRequest(form.errorsAsJson(messagesApi.preferred(request).lang()));
        }
        SignupForm data = form.get();
        return created("Welcome " + data.email);
    }
}`,
      codeLabel: 'Bean-validated form with a cross-field rule',
      codeLanguage: 'java',
      keyPoints: [
        '`FormFactory` binds form-encoded or JSON data to a class.',
        'Annotate fields with constraints; implement `Validatable` for cross-field checks.',
        'Return `badRequest` with errors when `hasErrors()` is true.',
        'Keep the CSRF token in HTML forms — the filter is enabled by default.',
      ],
    },
    {
      title: 'Async Actions & Non-Blocking I/O',
      after: 'Forms & Validation',
      content: `Play is built on **Pekko** (formerly Akka) and is **non-blocking**: a small thread pool serves many requests. Actions that wait on I/O should return \`CompletionStage<Result>\` instead of blocking.

| Situation | Approach |
|---|---|
| Call another HTTP service | \`WSClient\` (async) → \`thenApply\` |
| Run several calls in parallel | start them all, then \`thenCombine\` / \`CompletableFuture.allOf\` |
| Unavoidable blocking (JDBC, legacy SDK) | run on a **dedicated** execution context, never the default one |
| Timeouts | \`.toCompletableFuture().orTimeout(...)\` or \`Futures.timeout\` |
| Inside futures, need request context | use \`HttpExecutionContext\` / \`ClassLoaderExecutionContext\` |

Blocking on the default dispatcher (\`Thread.sleep\`, JDBC calls) can freeze the entire app under load.`,
      code: `package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.inject.Inject;
import play.libs.Json;
import play.libs.ws.WSClient;
import play.mvc.*;

import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.TimeUnit;

public class DashboardController extends Controller {
    private final WSClient ws;
    private final DatabaseExecutionContext dbEc;      // custom pool for blocking JDBC

    @Inject
    public DashboardController(WSClient ws, DatabaseExecutionContext dbEc) {
        this.ws = ws;
        this.dbEc = dbEc;
    }

    public CompletionStage<Result> dashboard(String userId) {
        CompletionStage<JsonNode> profile = ws.url("https://users.internal/api/users/" + userId)
                .setRequestTimeout(Duration.ofSeconds(2))
                .get()
                .thenApply(r -> r.asJson());

        CompletionStage<Integer> openOrders = CompletableFuture.supplyAsync(
                () -> countOpenOrders(userId), dbEc);   // blocking work off the default pool

        return profile.thenCombine(openOrders, (p, n) -> {
                    var json = Json.newObject();
                    json.set("profile", p);
                    json.put("openOrders", n);
                    return (Result) ok(json);
                })
                .toCompletableFuture()
                .orTimeout(3, TimeUnit.SECONDS)
                .exceptionally(ex -> status(GATEWAY_TIMEOUT, "Upstream too slow: " + ex.getClass().getSimpleName()));
    }

    private int countOpenOrders(String userId) {
        return 3;   // e.g. JDBC query
    }
}

// app/controllers/DatabaseExecutionContext.java
// public class DatabaseExecutionContext extends CustomExecutionContext {
//     @Inject public DatabaseExecutionContext(ActorSystem system) { super(system, "database.dispatcher"); }
// }
// application.conf:
// database.dispatcher { executor = "thread-pool-executor", thread-pool-executor.fixed-pool-size = 20 }`,
      codeLabel: 'Parallel async calls with a timeout and a blocking pool',
      codeLanguage: 'java',
      keyPoints: [
        'Return `CompletionStage<Result>` for I/O-bound actions.',
        'Start independent calls first, then combine them, so they run in parallel.',
        'Run blocking code on a dedicated execution context.',
        'Put timeouts on every outbound call and map failures to sensible status codes.',
      ],
    },
    {
      title: 'Dependency Injection with Guice',
      after: 'Async Actions & Non-Blocking I/O',
      content: `Play uses **Guice** (JSR-330) for dependency injection. Controllers and components declare dependencies with \`@Inject\` constructors.

| Need | How |
|---|---|
| Inject a dependency | \`@Inject public Ctrl(Service s)\` |
| One shared instance | annotate the class \`@Singleton\` |
| Bind interface → implementation | \`@ImplementedBy(Impl.class)\` or a Guice \`AbstractModule\` |
| Register a module | \`play.modules.enabled += "modules.AppModule"\` |
| Different impl per environment | branch on \`Environment\` / \`Config\` in the module |
| Run code on startup | eager singleton (\`bind(X.class).asEagerSingleton()\`) |
| Clean up on shutdown | \`ApplicationLifecycle.addStopHook\` |

Constructor injection keeps classes easy to unit test — just pass fakes to the constructor.`,
      code: `// app/services/PriceService.java
package services;

import com.google.inject.ImplementedBy;
import java.math.BigDecimal;

@ImplementedBy(DefaultPriceService.class)
public interface PriceService {
    BigDecimal priceFor(String sku);
}

// app/services/DefaultPriceService.java
package services;

import com.typesafe.config.Config;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import java.math.BigDecimal;
import java.util.Map;

@Singleton
public class DefaultPriceService implements PriceService {
    private final BigDecimal vat;
    private final Map<String, BigDecimal> prices = Map.of("LAP", new BigDecimal("1000"), "MOU", new BigDecimal("20"));

    @Inject
    public DefaultPriceService(Config config) {
        this.vat = new BigDecimal(config.hasPath("shop.vat") ? config.getString("shop.vat") : "0.23");
    }

    @Override
    public BigDecimal priceFor(String sku) {
        return prices.getOrDefault(sku, BigDecimal.ZERO).multiply(BigDecimal.ONE.add(vat));
    }
}

// app/modules/AppModule.java  (enable with play.modules.enabled += "modules.AppModule")
package modules;

import com.google.inject.AbstractModule;
import services.*;

public class AppModule extends AbstractModule {
    @Override
    protected void configure() {
        bind(StartupTasks.class).asEagerSingleton();     // runs at application start
    }
}

// app/services/StartupTasks.java
package services;

import jakarta.inject.Inject;
import play.inject.ApplicationLifecycle;
import java.util.concurrent.CompletableFuture;

public class StartupTasks {
    @Inject
    public StartupTasks(ApplicationLifecycle lifecycle) {
        System.out.println("Warming caches...");
        lifecycle.addStopHook(() -> {
            System.out.println("Flushing metrics before shutdown");
            return CompletableFuture.completedFuture(null);
        });
    }
}`,
      codeLabel: 'Interfaces, singletons, modules and lifecycle hooks',
      codeLanguage: 'java',
      keyPoints: [
        'Use constructor injection with `@Inject` for testable components.',
        'Mark stateless shared services `@Singleton`.',
        'Bind interfaces with `@ImplementedBy` or a Guice module.',
        'Use eager singletons for startup work and stop hooks for cleanup.',
      ],
    },
    {
      title: 'Database Access & Evolutions',
      after: 'Dependency Injection with Guice',
      content: `Play provides connection pooling (**HikariCP**) via \`javaJdbc\` and lets you choose a persistence style:

| Option | Style |
|---|---|
| Plain JDBC (\`play.db.Database\`) | full SQL control |
| **JPA / Hibernate** (\`javaJpa\`) | ORM with entities and \`JPAApi\` |
| **Ebean** (\`play-ebean\` plugin) | lightweight ORM, popular with Play |
| jOOQ, MyBatis | type-safe SQL / mappers |

### Evolutions

**Evolutions** are numbered SQL scripts in \`conf/evolutions/default/1.sql, 2.sql…\` with \`# --- !Ups\` and \`# --- !Downs\` sections. In dev mode Play offers to apply them; in production set \`play.evolutions.db.default.autoApply = true\` (or use Flyway/Liquibase instead).

JDBC is blocking — always run queries on a **custom execution context**.`,
      code: `-- conf/evolutions/default/1.sql
-- # --- !Ups
CREATE TABLE product (
  id         BIGSERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  price      NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
-- # --- !Downs
DROP TABLE product;

// app/repositories/ProductRepository.java
package repositories;

import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import play.db.Database;

import java.math.BigDecimal;
import java.sql.*;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

@Singleton
public class ProductRepository {
    public record Product(long id, String name, BigDecimal price) {}

    private final Database db;
    private final DatabaseExecutionContext ec;

    @Inject
    public ProductRepository(Database db, DatabaseExecutionContext ec) {
        this.db = db;
        this.ec = ec;
    }

    public CompletionStage<List<Product>> cheaperThan(BigDecimal max) {
        return CompletableFuture.supplyAsync(() -> db.withConnection(conn -> {
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT id, name, price FROM product WHERE price <= ? ORDER BY price")) {
                ps.setBigDecimal(1, max);                    // parameterised — no SQL injection
                List<Product> out = new ArrayList<>();
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) out.add(new Product(rs.getLong(1), rs.getString(2), rs.getBigDecimal(3)));
                }
                return out;
            }
        }), ec);
    }

    public CompletionStage<Long> insert(String name, BigDecimal price) {
        return CompletableFuture.supplyAsync(() -> db.withTransaction(conn -> {
            try (PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO product (name, price) VALUES (?, ?)", Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, name);
                ps.setBigDecimal(2, price);
                ps.executeUpdate();
                try (ResultSet keys = ps.getGeneratedKeys()) { keys.next(); return keys.getLong(1); }
            }
        }), ec);
    }
}`,
      codeLabel: 'Evolution script + JDBC repository on a DB execution context',
      codeLanguage: 'java',
      keyPoints: [
        'Play pools connections with HikariCP; choose JDBC, JPA, Ebean or jOOQ on top.',
        'Evolutions version the schema with Ups/Downs SQL scripts.',
        'Run blocking JDBC on a dedicated execution context.',
        'Always use prepared statements with parameters.',
      ],
    },
    {
      title: 'Filters, Action Composition & Security',
      after: 'Database Access & Evolutions',
      content: `Cross-cutting logic runs in **filters** (every request) or **action composition** (selected actions).

| Built-in filter | Protects against |
|---|---|
| \`CSRFFilter\` | cross-site request forgery on form posts (on by default) |
| \`SecurityHeadersFilter\` | clickjacking, MIME sniffing (CSP, X-Frame-Options…) |
| \`AllowedHostsFilter\` | Host header attacks (on by default) |
| \`CORSFilter\` | controls cross-origin browser access |
| \`GzipFilter\` | (performance) compresses responses |

### Action composition

Write an \`Action.Simple\` (or annotated \`Action<T>\`) and apply it with \`@With(...)\` or a custom annotation — ideal for authentication, rate limits, timing. Play's built-in \`@Security.Authenticated(Secured.class)\` covers simple session-based auth.`,
      code: `// app/actions/ApiKeyAction.java
package actions;

import play.mvc.*;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class ApiKeyAction extends Action.Simple {
    private static final Set<String> KEYS = Set.of(System.getenv().getOrDefault("API_KEY", "dev-key"));

    @Override
    public CompletionStage<Result> call(Http.Request req) {
        String key = req.header("X-Api-Key").orElse("");
        if (!KEYS.contains(key)) {
            return CompletableFuture.completedFuture(
                    Results.unauthorized("Missing or invalid API key"));
        }
        long start = System.nanoTime();
        return delegate.call(req).thenApply(result ->
                result.withHeader("X-Response-Time-ms", String.valueOf((System.nanoTime() - start) / 1_000_000)));
    }
}

// app/controllers/ReportController.java
package controllers;

import actions.ApiKeyAction;
import play.mvc.*;

@With(ApiKeyAction.class)            // applies to every action in this controller
public class ReportController extends Controller {
    public Result daily() { return ok("report"); }
}

// conf/application.conf — security filters
// play.filters.enabled += play.filters.cors.CORSFilter
// play.filters.cors.allowedOrigins = ["https://app.example.com"]
// play.filters.headers.contentSecurityPolicy = "default-src 'self'; frame-ancestors 'none'"
// play.filters.csrf.header.bypassHeaders { X-Requested-With = "*" }   # for JSON APIs called by your SPA`,
      codeLabel: 'API-key action composition + filter configuration',
      codeLanguage: 'java',
      keyPoints: [
        'Filters apply to every request; action composition to selected actions.',
        'CSRF, security headers and allowed-hosts filters are on by default — keep them.',
        'Configure CORS explicitly with an allow-list of origins.',
        'Use `@With` or custom annotations to reuse auth and timing logic.',
      ],
    },
    {
      title: 'Testing Play Applications',
      after: 'Build & Deployment',
      content: `Play ships test helpers for every level:

| Level | Tool |
|---|---|
| Unit test a service | plain JUnit, construct with fakes |
| Controller in isolation | call the action and inspect \`Result\` with \`Helpers.status\` / \`contentAsString\` |
| Through the router | \`Helpers.route(app, fakeRequest(GET, "/products"))\` with \`WithApplication\` |
| Override bindings | \`GuiceApplicationBuilder().overrides(bind(PriceService.class).to(FakePrices.class))\` |
| In-memory DB | \`Helpers.inMemoryDatabase()\` (H2) |
| Real HTTP server / browser | \`WithServer\`, \`WithBrowser\` (FluentLenium/Selenium) |

Run with \`sbt test\`, or \`sbt "testOnly *ProductControllerTest"\` for one class.`,
      code: `// test/controllers/ProductControllerTest.java
package controllers;

import org.junit.Test;
import play.Application;
import play.inject.guice.GuiceApplicationBuilder;
import play.mvc.Http;
import play.mvc.Result;
import play.test.WithApplication;
import services.PriceService;

import java.math.BigDecimal;

import static org.junit.Assert.*;
import static play.inject.Bindings.bind;
import static play.mvc.Http.Status.*;
import static play.test.Helpers.*;

public class ProductControllerTest extends WithApplication {

    public static class FakePrices implements PriceService {
        public BigDecimal priceFor(String sku) { return new BigDecimal("9.99"); }
    }

    @Override
    protected Application provideApplication() {
        return new GuiceApplicationBuilder()
                .configure("db.default.url", "jdbc:h2:mem:test;MODE=PostgreSQL")
                .overrides(bind(PriceService.class).to(FakePrices.class))
                .build();
    }

    @Test
    public void listReturnsOk() {
        Http.RequestBuilder request = fakeRequest(GET, "/products?page=2");
        Result result = route(app, request);
        assertEquals(OK, result.status());
        assertTrue(contentAsString(result).contains("page=2"));
    }

    @Test
    public void invalidPageIsBadRequest() {
        Result result = route(app, fakeRequest(GET, "/products?page=0"));
        assertEquals(BAD_REQUEST, result.status());
    }

    @Test
    public void createReturnsLocation() {
        Result result = route(app, fakeRequest(POST, "/products").bodyJson(play.libs.Json.newObject().put("name", "Pen")));
        assertEquals(CREATED, result.status());
        assertTrue(result.header(LOCATION).isPresent());
    }
}`,
      codeLabel: 'Routing tests with overridden bindings',
      codeLanguage: 'java',
      keyPoints: [
        'Use `WithApplication` + `route(app, fakeRequest(...))` to test through the router.',
        'Override Guice bindings to swap real services for fakes.',
        'Use an in-memory H2 database for fast repository tests.',
        'Assert on status, headers and body content.',
      ],
    },
  ],
};

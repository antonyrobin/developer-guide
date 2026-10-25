/*
 * Spring Boot course extension — extra sections and worked examples merged
 * into courses-data/springboot.js at load time. Examples target Spring Boot
 * 3.3+ on Java 21 (jakarta.* packages, records, RestClient).
 */

export default {
  examples: {
    'REST Controllers': [
      {
        title: 'ResponseEntity, Location header and query parameters',
        language: 'java',
        explanation: 'Return `ResponseEntity` when you need control over status and headers; `ServletUriComponentsBuilder` builds the `Location` of the new resource from the current request.',
        code: `@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) { this.service = service; }

    // GET /api/products?category=books&page=0&size=20&sort=price,desc
    @GetMapping
    public Page<ProductDto> search(@RequestParam(required = false) String category,
                                   @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        return service.search(category, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> get(@PathVariable Long id) {
        return service.find(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductDto> create(@Valid @RequestBody CreateProductRequest req) {
        ProductDto created = service.create(req);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}`,
      },
    ],
  },

  sections: [
    {
      title: 'Configuration, Profiles & Properties',
      after: 'Project Setup',
      content: `Spring Boot reads configuration from many sources with a clear **precedence** (later wins): \`application.yml\` → \`application-{profile}.yml\` → environment variables → command-line args.

| Mechanism | Example |
|---|---|
| Profiles | \`spring.profiles.active=prod\` (env: \`SPRING_PROFILES_ACTIVE=prod\`) |
| Profile-specific file | \`application-prod.yml\` |
| Multi-document YAML | \`---\` + \`spring.config.activate.on-profile: dev\` |
| Env var mapping | \`app.payment.timeout\` ← \`APP_PAYMENT_TIMEOUT\` (relaxed binding) |
| Typed config | \`@ConfigurationProperties(prefix = "app.payment")\` record + validation |
| Single value | \`@Value("\${app.name:demo}")\` (fine for one-offs) |
| Profile-only beans | \`@Profile("dev")\` |
| Secrets | env vars, Vault / AWS Secrets Manager via Spring Cloud, never Git |

Prefer **\`@ConfigurationProperties\` records** over scattered \`@Value\`s: type-safe, validated at startup, documented in IDEs.`,
      code: `// application.yml
// app:
//   payment:
//     base-url: https://sandbox.payments.example.com
//     timeout: 3s
//     retries: 2
//     currencies: [EUR, USD]
// ---
// spring.config.activate.on-profile: prod
// app.payment.base-url: https://api.payments.example.com

package com.example.shop.config;

import jakarta.validation.constraints.*;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.*;
import org.springframework.validation.annotation.Validated;

import java.net.URI;
import java.time.Duration;
import java.util.List;

@Validated
@ConfigurationProperties(prefix = "app.payment")
public record PaymentProperties(
        @NotNull URI baseUrl,
        @NotNull Duration timeout,               // "3s", "500ms", "1m" all bind
        @Min(0) @Max(5) int retries,
        @NotEmpty List<String> currencies) {
}

@Configuration
@EnableConfigurationProperties(PaymentProperties.class)
class PaymentConfig {

    @Bean
    @Profile("!prod")                            // fake gateway everywhere except prod
    PaymentGateway fakeGateway() { return amount -> "fake-" + amount; }

    @Bean
    @Profile("prod")
    PaymentGateway realGateway(PaymentProperties props) {
        return amount -> "charged via " + props.baseUrl() + " within " + props.timeout();
    }
}

interface PaymentGateway { String charge(long amountCents); }

// Run with:  java -jar app.jar --spring.profiles.active=prod --app.payment.retries=3`,
      codeLabel: 'Validated @ConfigurationProperties record + profile beans',
      keyPoints: [
        'Later property sources override earlier ones; env vars and CLI args win.',
        'Use profiles for environment differences, not code branches.',
        'Bind related settings into validated `@ConfigurationProperties` records.',
        'Keep secrets in environment variables or a secret manager.',
      ],
    },
    {
      title: 'Validation & Global Error Handling',
      after: 'REST Controllers',
      content: `Add \`spring-boot-starter-validation\` and annotate request DTOs with **Jakarta Bean Validation**; \`@Valid\` on the parameter triggers it.

| Annotation | Rule |
|---|---|
| \`@NotNull\`, \`@NotBlank\`, \`@NotEmpty\` | presence |
| \`@Size(min, max)\`, \`@Min\`, \`@Max\`, \`@Positive\` | ranges |
| \`@Email\`, \`@Pattern\` | formats |
| \`@Past\`, \`@Future\` | dates |
| \`@Valid\` on nested fields | cascade into child objects/lists |

### One place for errors

A \`@RestControllerAdvice\` translates exceptions into consistent responses. Spring 6 supports **RFC 9457 Problem Details** (\`ProblemDetail\`, \`application/problem+json\`) — enable it with \`spring.mvc.problemdetails.enabled=true\` and extend it with your own handlers.

Never return stack traces or entity objects in error bodies.`,
      code: `package com.example.shop.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.*;

public record CreateProductRequest(
        @NotBlank @Size(max = 100) String name,
        @NotNull @Positive @Digits(integer = 8, fraction = 2) BigDecimal price,
        @NotBlank @Pattern(regexp = "[A-Z]{3}-\\\\d{3}", message = "must look like ABC-123") String sku,
        @Size(max = 5) List<@NotBlank String> tags) {
}

class ProductNotFoundException extends RuntimeException {
    ProductNotFoundException(Long id) { super("Product " + id + " not found"); }
}

class DuplicateSkuException extends RuntimeException {
    DuplicateSkuException(String sku) { super("SKU " + sku + " already exists"); }
}

@RestControllerAdvice
class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail onValidation(MethodArgumentNotValidException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
        pd.setType(URI.create("https://api.example.com/problems/validation"));
        Map<String, String> errors = new TreeMap<>();
        ex.getBindingResult().getFieldErrors()
          .forEach(fe -> errors.putIfAbsent(fe.getField(), fe.getDefaultMessage()));
        pd.setProperty("errors", errors);
        return pd;
    }

    @ExceptionHandler(ProductNotFoundException.class)
    ProblemDetail onNotFound(ProductNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(DuplicateSkuException.class)
    ProblemDetail onConflict(DuplicateSkuException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
    }
}

// POST /api/products {"name":"","price":-1,"sku":"abc"}  →  400
// { "type": "https://api.example.com/problems/validation", "title": "Bad Request", "status": 400,
//   "detail": "Validation failed",
//   "errors": { "name": "must not be blank", "price": "must be greater than 0", "sku": "must look like ABC-123" } }`,
      codeLabel: 'Validated request record + ProblemDetail error handler',
      keyPoints: [
        'Annotate request DTOs and add `@Valid` to trigger Bean Validation.',
        'Handle exceptions centrally with `@RestControllerAdvice`.',
        'Return RFC 9457 `ProblemDetail` bodies for consistent errors.',
        'Use DTOs/records for requests and responses — never expose entities directly.',
      ],
    },
    {
      title: 'JPA Queries, Paging & Relationships',
      after: 'Spring Data JPA',
      content: `### Query options

| Style | Example |
|---|---|
| Derived query | \`findByStatusAndCreatedAtAfter(Status s, Instant t)\` |
| JPQL | \`@Query("select o from Order o where o.total > :min")\` |
| Native SQL | \`@Query(value = "...", nativeQuery = true)\` |
| Projections | interface or record with only needed fields |
| Paging & sorting | \`Page<T> findAll(Pageable p)\`, \`PageRequest.of(0, 20, Sort.by("name"))\` |
| Dynamic filters | \`Specification<T>\` / Querydsl |
| Bulk update | \`@Modifying @Query("update ...")\` |

### Relationships

- \`@ManyToOne\` — set \`fetch = FetchType.LAZY\` (default is EAGER).
- \`@OneToMany(mappedBy = "...")\` — lazy by default; avoid huge collections.
- Solve **N+1** with \`@EntityGraph(attributePaths = "items")\` or \`join fetch\`.
- Turn **off** \`spring.jpa.open-in-view\` so lazy loading can't silently run queries in the web layer.`,
      code: `package com.example.shop.orders;

import jakarta.persistence.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "orders")
class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) Customer customer;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderItem> items = new ArrayList<>();
    @Enumerated(EnumType.STRING) Status status = Status.NEW;
    BigDecimal total;
    Instant createdAt = Instant.now();
    @Version Long version;                       // optimistic locking

    void addItem(OrderItem item) { items.add(item); item.order = this; }
    enum Status { NEW, PAID, SHIPPED, CANCELLED }
}

@Entity class OrderItem {
    @Id @GeneratedValue Long id;
    @ManyToOne(fetch = FetchType.LAZY) Order order;
    String sku; int qty; BigDecimal price;
}

@Entity class Customer { @Id @GeneratedValue Long id; String name; String email; }

// Projection: only what the list screen needs
record OrderSummary(Long id, String customerName, BigDecimal total, Order.Status status) {}

interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    Page<Order> findByStatus(Order.Status status, Pageable pageable);          // derived

    @Query("""
           select new com.example.shop.orders.OrderSummary(o.id, c.name, o.total, o.status)
           from Order o join o.customer c
           where o.createdAt >= :since and o.total >= :min
           """)
    Page<OrderSummary> summaries(@Param("since") Instant since, @Param("min") BigDecimal min, Pageable p);

    @EntityGraph(attributePaths = {"items", "customer"})                       // no N+1
    Optional<Order> findWithItemsById(Long id);

    @Modifying
    @Query("update Order o set o.status = 'CANCELLED' where o.status = 'NEW' and o.createdAt < :cutoff")
    int cancelStale(@Param("cutoff") Instant cutoff);
}

// usage:
// var page = repo.summaries(Instant.now().minusSeconds(86400 * 30), new BigDecimal("50"),
//                           PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "total")));
// page.getContent(); page.getTotalElements(); page.hasNext();
// application.yml:  spring.jpa.open-in-view: false`,
      codeLabel: 'Entities, projections, paging, entity graphs and bulk updates',
      keyPoints: [
        'Use derived queries for simple cases and JPQL/projections for read models.',
        'Page large result sets with `Pageable` instead of loading everything.',
        'Make `@ManyToOne` lazy and fetch associations explicitly with entity graphs.',
        'Disable open-in-view and add `@Version` for optimistic locking.',
      ],
    },
    {
      title: 'Transactions',
      after: 'Service Layer & Dependency Injection',
      content: `\`@Transactional\` wraps a method in a database transaction via a **proxy**: commit on success, rollback on **unchecked** exceptions.

| Attribute | Notes |
|---|---|
| \`readOnly = true\` | hint for read-only work (Hibernate skips dirty checking) |
| \`rollbackFor = Exception.class\` | also roll back on checked exceptions |
| \`propagation = REQUIRED\` (default) | join an existing transaction or start one |
| \`propagation = REQUIRES_NEW\` | independent inner transaction (e.g. audit log that must persist) |
| \`isolation\` | \`READ_COMMITTED\`, \`REPEATABLE_READ\`, \`SERIALIZABLE\` |
| \`timeout\` | seconds before rollback |

### Proxy pitfalls

- Calling a \`@Transactional\` method **from the same class** bypasses the proxy — no transaction.
- Only **public** methods are intercepted (by default).
- Catching an exception inside the method prevents rollback unless you rethrow.

Put transactions on **service** methods (use-case boundaries), not on controllers or repositories. Publish events to external systems **after commit** (\`@TransactionalEventListener\`).`,
      code: `package com.example.shop.payments;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.math.BigDecimal;

@Service
public class TransferService {
    private final AccountRepository accounts;
    private final AuditService audit;
    private final ApplicationEventPublisher events;

    public TransferService(AccountRepository accounts, AuditService audit, ApplicationEventPublisher events) {
        this.accounts = accounts; this.audit = audit; this.events = events;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED, timeout = 5)
    public void transfer(long fromId, long toId, BigDecimal amount) {
        audit.record("transfer requested " + fromId + "->" + toId + " " + amount);   // REQUIRES_NEW: survives rollback

        Account from = accounts.findByIdForUpdate(fromId).orElseThrow();            // SELECT ... FOR UPDATE
        Account to = accounts.findByIdForUpdate(toId).orElseThrow();
        if (from.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(fromId);                            // unchecked → rollback
        }
        from.debit(amount);
        to.credit(amount);                                                          // dirty checking → UPDATEs at commit
        events.publishEvent(new TransferCompleted(fromId, toId, amount));
    }

    @Transactional(readOnly = true)
    public BigDecimal balance(long accountId) {
        return accounts.findById(accountId).orElseThrow().getBalance();
    }
}

@Service
class AuditService {
    private final AuditRepository repo;
    AuditService(AuditRepository repo) { this.repo = repo; }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String message) { repo.save(new AuditEntry(message)); }
}

record TransferCompleted(long from, long to, BigDecimal amount) {}

@Service
class TransferNotifications {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)   // only if the transfer committed
    void onCompleted(TransferCompleted e) {
        System.out.println("Send confirmation email for " + e);
    }
}

class InsufficientFundsException extends RuntimeException {
    InsufficientFundsException(long id) { super("Insufficient funds in account " + id); }
}

// AccountRepository:
//   @Lock(LockModeType.PESSIMISTIC_WRITE)
//   @Query("select a from Account a where a.id = :id")
//   Optional<Account> findByIdForUpdate(@Param("id") long id);`,
      codeLabel: 'Transfer with locking, REQUIRES_NEW audit and after-commit events',
      keyPoints: [
        'Put `@Transactional` on service methods that represent a use case.',
        'Unchecked exceptions roll back; use `rollbackFor` for checked ones.',
        'Self-invocation bypasses the transactional proxy.',
        'Trigger external side-effects after commit with `@TransactionalEventListener`.',
      ],
    },
    {
      title: 'Spring Security & JWT',
      after: 'Transactions',
      content: `Add \`spring-boot-starter-security\` and everything is locked down by default. Configure a \`SecurityFilterChain\` bean to describe what is public and how users authenticate.

| Scenario | Setup |
|---|---|
| Stateless REST API with JWTs | \`spring-boot-starter-oauth2-resource-server\` + \`oauth2ResourceServer(o -> o.jwt(...))\` |
| Server-rendered app | form login + session + CSRF |
| Login with Google/Entra/Keycloak | \`oauth2Login()\` |
| Method-level rules | \`@EnableMethodSecurity\` + \`@PreAuthorize("hasRole('ADMIN')")\` |
| Passwords | \`PasswordEncoder\` → BCrypt/Argon2 via \`PasswordEncoderFactories\` |

For JWT APIs, let an identity provider issue tokens and validate them with \`spring.security.oauth2.resourceserver.jwt.issuer-uri\` — Spring fetches the signing keys (JWKS) automatically. Map the token's roles/scopes to authorities.`,
      code: `// application.yml
// spring.security.oauth2.resourceserver.jwt.issuer-uri: https://login.example.com/realms/shop

package com.example.shop.security;

import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.*;

@Configuration
@EnableMethodSecurity
class SecurityConfig {

    @Bean
    SecurityFilterChain api(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())                                    // stateless token API
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health/**", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .oauth2ResourceServer(o -> o.jwt(jwt -> jwt.jwtAuthenticationConverter(rolesFromClaim())))
            .build();
    }

    // Map the "roles" claim (e.g. ["ADMIN","USER"]) to ROLE_ADMIN, ROLE_USER
    private JwtAuthenticationConverter rolesFromClaim() {
        JwtGrantedAuthoritiesConverter roles = new JwtGrantedAuthoritiesConverter();
        roles.setAuthoritiesClaimName("roles");
        roles.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(roles);
        return converter;
    }
}

@RestController
@RequestMapping("/api")
class MeController {

    @GetMapping("/me")
    Object me(@AuthenticationPrincipal Jwt jwt) {
        return java.util.Map.of("user", jwt.getSubject(), "email", jwt.getClaimAsString("email"));
    }

    @DeleteMapping("/orders/{id}")
    @PreAuthorize("hasRole('ADMIN') or @orderSecurity.isOwner(#id, authentication.name)")
    void cancel(@PathVariable Long id) { /* ... */ }
}`,
      codeLabel: 'Stateless JWT resource server with role mapping',
      keyPoints: [
        'Define access rules in a `SecurityFilterChain` bean.',
        'Let an identity provider issue JWTs; validate them via the issuer URI.',
        'Map token claims to authorities and use `@PreAuthorize` for fine-grained rules.',
        'Disable CSRF only for stateless token APIs, never for cookie-based sessions.',
      ],
    },
    {
      title: 'Calling Other Services & Caching',
      after: 'Spring Security & JWT',
      content: `### HTTP clients

| Client | Use |
|---|---|
| **\`RestClient\`** (Boot 3.2+) | modern synchronous fluent API — default choice |
| \`WebClient\` | reactive / non-blocking |
| **HTTP interface** (\`@HttpExchange\`) | declare an interface, Spring implements it |
| \`RestTemplate\` | legacy, maintenance mode |

Always configure **timeouts**, and add retries/circuit breakers with **Resilience4j** (\`@Retry\`, \`@CircuitBreaker\`) for flaky dependencies.

### Caching

\`@EnableCaching\` + \`@Cacheable("prices")\` caches method results; \`@CacheEvict\` / \`@CachePut\` keep it fresh. Back it with **Caffeine** (in-process) or **Redis** (shared across instances). Cache keys default to the method arguments.`,
      code: `package com.example.shop.pricing;

import org.springframework.boot.web.client.ClientHttpRequestFactories;
import org.springframework.boot.web.client.ClientHttpRequestFactorySettings;
import org.springframework.cache.annotation.*;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.Duration;

@Configuration
@EnableCaching
class ClientConfig {
    @Bean
    RestClient pricingClient(RestClient.Builder builder) {
        var settings = ClientHttpRequestFactorySettings.DEFAULTS
                .withConnectTimeout(Duration.ofSeconds(2))
                .withReadTimeout(Duration.ofSeconds(3));
        return builder
                .baseUrl("https://pricing.internal/api")
                .requestFactory(ClientHttpRequestFactories.get(settings))
                .defaultHeader("X-Client", "shop-service")
                .build();
    }
}

record PriceResponse(String sku, BigDecimal amount, String currency) {}

class PriceNotFoundException extends RuntimeException {
    PriceNotFoundException(String sku) { super("No price for " + sku); }
}

@Service
class PricingService {
    private final RestClient client;
    PricingService(RestClient pricingClient) { this.client = pricingClient; }

    @Cacheable(cacheNames = "prices", key = "#sku", unless = "#result == null")
    public PriceResponse priceFor(String sku) {
        return client.get()
                .uri("/prices/{sku}", sku)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> { throw new PriceNotFoundException(sku); })
                .body(PriceResponse.class);
    }

    @CacheEvict(cacheNames = "prices", key = "#sku")
    public void priceChanged(String sku) { /* called from a Kafka listener, webhook, ... */ }
}

// application.yml — Caffeine as the cache provider (add com.github.ben-manes.caffeine:caffeine)
// spring:
//   cache:
//     cache-names: prices
//     caffeine.spec: maximumSize=10000,expireAfterWrite=10m`,
      codeLabel: 'RestClient with timeouts + @Cacheable / @CacheEvict',
      keyPoints: [
        'Use `RestClient` (or HTTP interfaces) with explicit connect/read timeouts.',
        'Map error status codes to domain exceptions in `onStatus`.',
        'Cache expensive lookups with `@Cacheable` and evict on change.',
        'Use Caffeine for local caches and Redis when instances must share them.',
      ],
    },
    {
      title: 'Testing Spring Boot Applications',
      after: 'Calling Other Services & Caching',
      content: `| Annotation | Loads | Use for |
|---|---|---|
| none (plain JUnit + Mockito) | nothing | services and domain logic — fastest |
| \`@WebMvcTest(Controller.class)\` | MVC layer only | controllers, validation, JSON, security rules |
| \`@DataJpaTest\` | JPA + repositories | queries and mappings |
| \`@JsonTest\` | Jackson | serialisation |
| \`@SpringBootTest\` | whole context | end-to-end slices, wiring |
| **Testcontainers** (\`@ServiceConnection\`) | real Postgres/Kafka/Redis in Docker | realistic integration tests |

Mock collaborators in slice tests with **\`@MockitoBean\`** (Boot 3.4+; \`@MockBean\` earlier). Use **MockMvc** (or \`RestTestClient\`/\`WebTestClient\`) to call endpoints.

Keep the pyramid: many fast unit tests, fewer slice tests, a handful of full integration tests.`,
      code: `package com.example.shop.web;

import com.example.shop.products.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired MockMvc mvc;
    @MockitoBean ProductService service;

    @Test
    void returnsProduct() throws Exception {
        given(service.find(1L)).willReturn(Optional.of(new ProductDto(1L, "Pen", new BigDecimal("1.50"))));

        mvc.perform(get("/api/products/1"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.name").value("Pen"))
           .andExpect(jsonPath("$.price").value(1.50));
    }

    @Test
    void unknownProductIs404() throws Exception {
        given(service.find(99L)).willReturn(Optional.empty());
        mvc.perform(get("/api/products/99")).andExpect(status().isNotFound());
    }

    @Test
    void invalidBodyIs400WithFieldErrors() throws Exception {
        mvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                         {"name": "", "price": -5, "sku": "nope"}
                         """))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.errors.name").exists())
           .andExpect(jsonPath("$.errors.price").exists());
    }

    @Test
    void createReturnsLocation() throws Exception {
        given(service.create(any())).willReturn(new ProductDto(7L, "Mug", new BigDecimal("9.90")));
        mvc.perform(post("/api/products").contentType(MediaType.APPLICATION_JSON)
                .content("{\\"name\\":\\"Mug\\",\\"price\\":9.90,\\"sku\\":\\"MUG-001\\"}"))
           .andExpect(status().isCreated())
           .andExpect(header().string("Location", "http://localhost/api/products/7"));
    }
}

// Integration test with a real database:
// @SpringBootTest @Testcontainers
// class OrderRepositoryIT {
//     @Container @ServiceConnection
//     static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:16-alpine");
//     ...
// }`,
      codeLabel: '@WebMvcTest with MockMvc and @MockitoBean',
      keyPoints: [
        'Prefer plain unit tests; use slices like `@WebMvcTest` and `@DataJpaTest` for layers.',
        'Mock collaborators in slice tests with `@MockitoBean`.',
        'Assert status codes, JSON paths and headers with MockMvc.',
        'Use Testcontainers with `@ServiceConnection` for realistic integration tests.',
      ],
    },
    {
      title: 'Actuator, Metrics & Observability',
      after: 'Build & Deploy',
      content: `\`spring-boot-starter-actuator\` adds production endpoints under \`/actuator\`.

| Endpoint | Purpose |
|---|---|
| \`/health\` (+ \`/health/liveness\`, \`/health/readiness\`) | load balancer and Kubernetes probes |
| \`/metrics\`, \`/prometheus\` | Micrometer metrics (JVM, HTTP, DB pool, custom) |
| \`/info\` | build/git info |
| \`/loggers\` | change log levels at runtime |
| \`/env\`, \`/configprops\`, \`/beans\`, \`/mappings\` | diagnostics — **protect or disable** in prod |

### Observability stack

- **Micrometer** metrics → Prometheus / OTLP / Datadog via registry dependencies.
- **Micrometer Tracing** (Brave or OpenTelemetry bridge) → trace IDs in logs, spans to Zipkin/Tempo/OTLP.
- **Structured logging** (Boot 3.4+: \`logging.structured.format.console=ecs\` or \`logstash\`).

Expose only what you need and serve actuator on a separate management port if possible.`,
      code: `// application.yml
// management:
//   server.port: 8081                       # separate port, not public
//   endpoints.web.exposure.include: health,info,prometheus,loggers
//   endpoint.health:
//     probes.enabled: true                  # /actuator/health/liveness & /readiness
//     show-details: when-authorized
//   tracing.sampling.probability: 0.1
//   metrics.tags.application: shop-service
// logging.structured.format.console: ecs

package com.example.shop.observability;

import io.micrometer.core.instrument.*;
import io.micrometer.observation.annotation.Observed;
import org.springframework.boot.actuate.health.*;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
class PaymentProviderHealth implements HealthIndicator {
    private final PaymentClient client;
    PaymentProviderHealth(PaymentClient client) { this.client = client; }

    @Override
    public Health health() {
        long started = System.nanoTime();
        boolean up = client.ping();
        long ms = (System.nanoTime() - started) / 1_000_000;
        return (up ? Health.up() : Health.down()).withDetail("latencyMs", ms).build();
    }
}

@Service
class CheckoutService {
    private final Counter ordersPlaced;
    private final Timer checkoutTimer;

    CheckoutService(MeterRegistry registry) {
        this.ordersPlaced = Counter.builder("shop.orders.placed")
                .description("Orders successfully placed").tag("channel", "web").register(registry);
        this.checkoutTimer = Timer.builder("shop.checkout.duration")
                .publishPercentiles(0.5, 0.95, 0.99).register(registry);
    }

    @Observed(name = "shop.checkout", contextualName = "checkout")   // metric + span
    public void checkout(Cart cart) {
        checkoutTimer.record(() -> {
            // ... reserve stock, charge payment, save order
            ordersPlaced.increment();
        });
    }
}

interface PaymentClient { boolean ping(); }
record Cart(String id) {}

// curl localhost:8081/actuator/health/readiness
// curl localhost:8081/actuator/prometheus | grep shop_orders_placed_total
// curl -X POST localhost:8081/actuator/loggers/com.example.shop -H 'Content-Type: application/json' -d '{"configuredLevel":"DEBUG"}'`,
      codeLabel: 'Custom health indicator, Micrometer metrics and @Observed',
      keyPoints: [
        'Actuator provides health probes, metrics and runtime diagnostics.',
        'Expose only needed endpoints, ideally on a separate management port.',
        'Use Micrometer for custom counters/timers and `@Observed` for metrics + traces.',
        'Readiness and liveness probes integrate directly with Kubernetes.',
      ],
    },
  ],
};

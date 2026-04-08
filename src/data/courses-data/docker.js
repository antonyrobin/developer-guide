export const dockerCourse = {
    id: 'docker', title: 'Docker', description: 'Containerization platform for consistent, portable deployments across dev, staging, and production.',
    officialDocs: 'https://docs.docker.com/', tutorialLink: 'https://docs.docker.com/get-started/', exerciseLink: null,
    sections: [
      { title: 'What is Docker', image: '/images/docker/docker-vs-vm.svg', content: `**Docker** is a platform for developing, shipping, and running applications inside **containers**. Containers are lightweight, isolated environments that package an application with everything it needs to run — code, runtime, libraries, and system tools.

Unlike virtual machines (which emulate entire operating systems), containers **share the host OS kernel** and only isolate the application layer. This makes them extremely lightweight (*MBs vs GBs*), fast to start (*seconds vs minutes*), and efficient with resources.

### Why Docker for This Project

| Factor | Decision Rationale |
|---|---|
| **Environment Consistency** | "Works on my machine" eliminated — same container everywhere |
| **Isolation** | Each microservice runs in its own container with its own dependencies |
| **Fast Onboarding** | \`docker compose up\` → entire stack running in minutes |
| **Microservices** | Each service has its own Dockerfile and lifecycle |
| **CI/CD** | Build once, deploy the same image to staging and production |
| **Kubernetes Ready** | Docker images are the deployment unit for K8s |`, keyPoints: ['Containers package apps with all dependencies.', 'Lightweight and fast compared to virtual machines.', 'Eliminates "works on my machine" problems.', 'Docker is the first step toward Kubernetes orchestration.'] },

      { title: 'Advantages & Disadvantages', content: `### Advantages

| # | Advantage | Detail |
|---|---|---|
| 1 | **Consistency** | Same image in dev, staging, production |
| 2 | **Isolation** | Services can't interfere with each other |
| 3 | **Reproducible** | Dockerfile = infrastructure as code |
| 4 | **Fast Startup** | Containers start in seconds (vs minutes for VMs) |
| 5 | **Resource Efficient** | Shared kernel; much lighter than VMs |
| 6 | **Versioned** | Images are tagged; easy rollback |

### Disadvantages

| # | Disadvantage | Mitigation |
|---|---|---|
| 1 | **Learning Curve** | Docker concepts take time → this guide helps |
| 2 | **Debugging** | Can't just "open" a container → use \`docker exec\` and logs |
| 3 | **Storage** | Images accumulate → prune regularly |
| 4 | **Networking** | Container networking is different → use Compose networks |
| 5 | **Windows Compatibility** | Some Linux-only features → use WSL2 backend |`, keyPoints: ['Containers start in seconds, VMs take minutes.', 'Shared kernel makes containers much lighter than VMs.', 'Use docker exec and logs for debugging.', 'Regular pruning prevents disk space issues.'] },

      { title: 'Installation & Setup', content: `**Docker Desktop** (Windows/macOS) bundles the Docker Engine, CLI, and Docker Compose. On Linux, install Docker Engine directly.

### Windows (Docker Desktop)

1. Download from https://www.docker.com/products/docker-desktop
2. Install with **WSL2 backend** (recommended)
3. Verify installation

### Post-Install Configuration

Allocate sufficient resources in Docker Desktop → Settings → Resources:
- **CPUs:** 4+
- **Memory:** 8GB+
- **Disk:** 50GB+`, code: `# Verify installation\ndocker --version          # Docker version 27.x\ndocker compose version    # Docker Compose version v2.x\n\n# Test with Hello World\ndocker run hello-world\n\n# Run Nginx web server\ndocker run -d -p 8080:80 --name web nginx\n\n# List running containers\ndocker ps\n\n# Stop and remove\ndocker stop web\ndocker rm web\n\n# List all images\ndocker images`, codeLabel: 'Installation & Verification', keyPoints: ['Docker Desktop for Windows/macOS, Docker Engine for Linux.', 'Use WSL2 backend on Windows for best performance.', 'Allocate 4+ CPUs and 8GB+ RAM for microservice projects.', 'docker run starts containers, docker ps lists them.'] },

      { title: 'Core Concepts', image: '/images/docker/docker-core-concepts.svg', content: `Understanding Docker's core concepts is essential before writing Dockerfiles.

| Concept | Description |
|---|---|
| **Image** | Read-only template with OS, runtime, app code |
| **Container** | Running instance of an image |
| **Dockerfile** | Instructions to build an image |
| **Layer** | Each Dockerfile instruction creates a cached layer |
| **Volume** | Persistent storage that survives container restarts |
| **Network** | Virtual network connecting containers |
| **Registry** | Storage for images (Docker Hub, GitHub Container Registry) |
| **Tag** | Version label for an image (e.g., \`billing-catalog:1.2.3\`) |

### Image Layering

Layers are cached and reused. The **least-changing** instructions go at the bottom (base image), and **most-changing** instructions go at the top (app code). When a layer changes, all layers above it are rebuilt.`, keyPoints: ['Images are read-only templates, containers are running instances.', 'Each Dockerfile instruction creates a cached layer.', 'Volumes persist data across container restarts.', 'Tags version images for reproducible deployments.'] },

      { title: 'Dockerfile Patterns', content: `A **Dockerfile** is a text file with instructions for building a Docker image. Each instruction creates a **layer** — Docker caches unchanged layers to speed up builds.

### Key Instructions

\`FROM\` (base image), \`WORKDIR\` (set working directory), \`COPY\` (copy files), \`RUN\` (execute build commands), \`ENV\` (environment variables), \`EXPOSE\` (document port), \`USER\` (run as non-root), \`ENTRYPOINT\`/\`CMD\` (startup command).

### .NET Service (Multi-Stage)

Multi-stage builds separate the **build environment** (SDK with compiler) from the **runtime image** (only ASP.NET runtime). The result is a much smaller, more secure production image.`, code: `# ── Stage 1: Build ──\nFROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build\nWORKDIR /src\n\n# Copy project files first (for layer caching)\nCOPY ["Billing.sln", "./"]\nCOPY ["src/Services/Catalog.Api/Catalog.Api.csproj", "src/Services/Catalog.Api/"]\nCOPY ["src/Shared/Billing.Contracts/Billing.Contracts.csproj", "src/Shared/Billing.Contracts/"]\nRUN dotnet restore "src/Services/Catalog.Api/Catalog.Api.csproj"\n\n# Copy everything and build\nCOPY . .\nWORKDIR "/src/src/Services/Catalog.Api"\nRUN dotnet publish -c Release -o /app/publish --no-restore\n\n# ── Stage 2: Runtime ──\nFROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS runtime\nWORKDIR /app\n\n# Security: run as non-root\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\nUSER appuser\n\nCOPY --from=build /app/publish .\n\nEXPOSE 8080\nENV ASPNETCORE_URLS=http://+:8080\nENTRYPOINT ["dotnet", "Catalog.Api.dll"]`, codeLabel: '.NET Multi-Stage Dockerfile', keyPoints: ['Multi-stage builds: SDK for build, runtime-only for production.', 'Copy .csproj first, then restore — caches dependencies.', 'Always run as non-root user for security.', 'Alpine base images are ~50% smaller than Debian.'] },

      { title: 'Next.js & Database Migrator Dockerfiles', content: `### Next.js (Multi-Stage)

The Next.js Dockerfile uses three stages: install dependencies, build the app, and create a minimal runtime image using the standalone output.

### Database Migrator (Run-Once)

The migrator is a short-lived container that runs database migrations and exits. It uses \`restartPolicy: Never\` in Kubernetes or \`restart: "no"\` in Compose.`, code: `# ── Next.js Dockerfile ──\n# Stage 1: Dependencies\nFROM node:22-alpine AS deps\nWORKDIR /app\nCOPY package.json pnpm-lock.yaml ./\nRUN corepack enable && pnpm install --frozen-lockfile\n\n# Stage 2: Build\nFROM node:22-alpine AS build\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\nRUN corepack enable && pnpm build\n\n# Stage 3: Runtime\nFROM node:22-alpine AS runtime\nWORKDIR /app\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\nCOPY --from=build /app/.next/standalone ./\nCOPY --from=build /app/.next/static ./.next/static\nCOPY --from=build /app/public ./public\nUSER appuser\nEXPOSE 3000\nENV NODE_ENV=production\nCMD ["node", "server.js"]\n\n# ── Database Migrator Dockerfile ──\nFROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build\nWORKDIR /src\nCOPY ["src/Migrations/DatabaseMigrator/DatabaseMigrator.csproj", "./"]\nRUN dotnet restore\nCOPY src/Migrations/DatabaseMigrator/ .\nRUN dotnet publish -c Release -o /app/publish --no-restore\n\nFROM mcr.microsoft.com/dotnet/runtime:9.0-alpine\nWORKDIR /app\nCOPY --from=build /app/publish .\nENTRYPOINT ["dotnet", "DatabaseMigrator.dll"]`, codeLabel: 'Next.js & Migrator Dockerfiles', keyPoints: ['Next.js uses 3 stages: deps, build, runtime.', 'Standalone output produces a minimal server.js.', 'Database migrators are run-once containers.', 'All Dockerfiles follow the same non-root user pattern.'] },

      { title: 'Docker Compose', image: '/images/docker/docker-compose-stack.svg', content: `**Docker Compose** defines and runs multi-container applications. Instead of individual \`docker run\` commands, you define all services in a YAML file and start everything with \`docker compose up\`.

### Project Container Stack

| Container | Base Image | Port | Purpose |
|---|---|---|---|
| **gateway** | dotnet/aspnet:9.0-alpine | 5000 | YARP API Gateway |
| **identity-api** | dotnet/aspnet:9.0-alpine | 5001 | Auth & tenant management |
| **catalog-api** | dotnet/aspnet:9.0-alpine | 5002 | Products, categories, inventory |
| **commerce-api** | dotnet/aspnet:9.0-alpine | 5003 | Orders, invoices, payments |
| **web** | node:22-alpine | 3000 | Next.js frontend |
| **postgres** | postgres:16-alpine | 5432 | Database |
| **redis** | redis:7-alpine | 6379 | Cache & sessions |
| **rabbitmq** | rabbitmq:3.13-management-alpine | 5672 | Message broker |
| **minio** | minio/minio:latest | 9000 | Object storage (dev) |`, code: `# docker-compose.dev.yml\nname: billing-dev\n\nservices:\n  # ─── Infrastructure ───\n  postgres:\n    image: postgres:16-alpine\n    ports:\n      - "5432:5432"\n    environment:\n      POSTGRES_DB: billing\n      POSTGRES_USER: billing_admin\n      POSTGRES_PASSWORD: dev_password\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U billing_admin -d billing"]\n      interval: 5s\n      timeout: 5s\n      retries: 5\n\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru\n    healthcheck:\n      test: ["CMD", "redis-cli", "ping"]\n      interval: 5s\n      retries: 5\n\n  rabbitmq:\n    image: rabbitmq:3.13-management-alpine\n    ports:\n      - "5672:5672"\n      - "15672:15672"\n    environment:\n      RABBITMQ_DEFAULT_USER: billing\n      RABBITMQ_DEFAULT_PASS: dev_password\n    healthcheck:\n      test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]\n      interval: 10s\n      retries: 5\n\n  # ─── API Services ───\n  catalog-api:\n    build:\n      context: .\n      dockerfile: samples/docker/Dockerfile.service\n      args:\n        SERVICE_NAME: Catalog.Api\n    ports:\n      - "5002:8080"\n    depends_on:\n      postgres:\n        condition: service_healthy\n      redis:\n        condition: service_healthy\n    environment:\n      - ASPNETCORE_ENVIRONMENT=Development\n      - ConnectionStrings__DefaultConnection=Host=postgres;Database=billing;Username=billing_admin;Password=dev_password\n      - ConnectionStrings__Redis=redis:6379\n\n  # ─── Web Frontend ───\n  web:\n    build:\n      context: .\n      dockerfile: samples/docker/Dockerfile.web\n    ports:\n      - "3000:3000"\n    depends_on:\n      - gateway\n    environment:\n      - NEXT_PUBLIC_API_URL=http://gateway:8080\n\nvolumes:\n  postgres_data:\n  redis_data:\n  rabbitmq_data:`, codeLabel: 'Docker Compose (Development)', keyPoints: ['Define multi-container apps in one YAML file.', 'Services communicate via service names as hostnames.', 'Health checks ensure dependencies are ready before starting.', 'depends_on with condition: service_healthy for proper ordering.'] },

      { title: 'Image Optimization', content: `Image size directly impacts build speed, push/pull times, and security surface area. Smaller images have fewer packages and fewer potential vulnerabilities.

### Size Comparison

| Approach | Image Size |
|---|---|
| \`dotnet/sdk:9.0\` (no multi-stage) | ~900MB |
| \`dotnet/aspnet:9.0\` (multi-stage) | ~220MB |
| \`dotnet/aspnet:9.0-alpine\` (multi-stage + Alpine) | ~110MB |

### Optimization Techniques

| # | Technique | Impact |
|---|---|---|
| 1 | **Multi-stage builds** | Only runtime in final image |
| 2 | **Alpine base images** | ~50% smaller than Debian |
| 3 | **\`.dockerignore\`** | Exclude bin/, obj/, .git, node_modules |
| 4 | **Layer ordering** | Copy .csproj first → restore → copy code (caching) |
| 5 | **Specific tags** | \`9.0-alpine\` not \`latest\` — reproducible builds |`, code: `# .dockerignore\n**/bin/\n**/obj/\n**/node_modules/\n**/.next/\n.git/\n.vs/\n.vscode/\n*.md\n*.sln.DotSettings`, codeLabel: '.dockerignore', keyPoints: ['Alpine images are ~50% smaller than Debian equivalents.', 'Multi-stage builds exclude build tools from production.', '.dockerignore prevents unnecessary files from entering the build context.', 'Layer ordering maximizes cache hits.'] },

      { title: 'Networking', image: '/images/docker/docker-networking.svg', content: `All services in the same \`docker-compose.yml\` share a **default network**. Services reach each other by **service name** — no need for IP addresses or localhost.

### Internal DNS Resolution

\`\`\`
gateway → http://identity-api:8080
gateway → http://catalog-api:8080
catalog-api → postgres:5432
catalog-api → redis:6379
catalog-api → rabbitmq:5672
\`\`\`

### Custom Networks for Isolation

You can create separate networks to **restrict communication**. For example, the web frontend can reach the gateway, but not the database directly.`, code: `services:\n  gateway:\n    networks:\n      - frontend\n      - backend\n\n  catalog-api:\n    networks:\n      - backend\n\n  web:\n    networks:\n      - frontend\n\n  postgres:\n    networks:\n      - backend\n\nnetworks:\n  frontend:   # web ↔ gateway\n  backend:    # gateway ↔ services ↔ database`, codeLabel: 'Custom Network Isolation', keyPoints: ['Services communicate by name within the same network.', 'Default Compose network connects all services.', 'Custom networks isolate frontend from backend.', 'Never expose database ports to the frontend network.'] },

      { title: 'Volumes & Data Persistence', content: `Containers are **ephemeral** — data inside a container is lost when it stops. **Volumes** provide persistent storage that survives container restarts and rebuilds.

### Volume Types

| Type | Syntax | Use Case |
|---|---|---|
| **Named volume** | \`postgres_data:/var/lib/postgresql/data\` | Managed by Docker, persists data |
| **Bind mount** | \`./src:/app/src\` | Development hot-reload |

### Project Volumes

| Volume | Container | Purpose |
|---|---|---|
| \`postgres_data\` | postgres | Database files |
| \`redis_data\` | redis | Cache persistence (RDB/AOF) |
| \`rabbitmq_data\` | rabbitmq | Queue data |
| \`minio_data\` | minio | Uploaded files |`, code: `# Named volumes (managed by Docker)\nvolumes:\n  postgres_data:\n    driver: local\n\n# Usage in services\nservices:\n  postgres:\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n\n  # Bind mounts for development hot-reload\n  web:\n    volumes:\n      - ./src:/app/src  # Live code changes`, codeLabel: 'Volumes & Bind Mounts', keyPoints: ['Named volumes persist data across container restarts.', 'Bind mounts enable live development with hot-reload.', 'Never store important data only inside a container.', 'Use docker volume prune to clean unused volumes.'] },

      { title: 'Security', content: `Container security follows the principle of **least privilege**. Each container should run with minimal permissions and access only what it needs.

| Practice | Implementation |
|---|---|
| **Non-root user** | \`RUN adduser -S appuser\` + \`USER appuser\` |
| **Read-only filesystem** | \`docker run --read-only\` |
| **No new privileges** | \`--security-opt=no-new-privileges\` |
| **Scan images** | \`docker scout cves billing-catalog:latest\` |
| **Minimal base** | Alpine-based images reduce attack surface |
| **No unnecessary ports** | Only expose what's needed in Compose |
| **Use secrets** | \`docker secret\` or environment variables from vault |

### Never Put in a Dockerfile

- Passwords, API keys, or tokens
- Production connection strings
- Private SSH keys
- Any value that should differ between environments`, keyPoints: ['Always run containers as non-root users.', 'Scan images for vulnerabilities with docker scout.', 'Never store secrets in Dockerfiles or images.', 'Alpine base images have a smaller attack surface.'] },

      { title: 'Best Practices', content: `### Do's

| # | Practice | Reason |
|---|---|---|
| 1 | **Use multi-stage builds** | Smaller images; no build tools in production |
| 2 | **Use \`.dockerignore\`** | Faster builds; smaller context |
| 3 | **Run as non-root** | Security — containers shouldn't run as root |
| 4 | **Use specific image tags** | \`9.0-alpine\` not \`latest\` — reproducible |
| 5 | **Use health checks** | Compose and K8s need to know service health |
| 6 | **Layer ordering** | Least-changing layers first for cache efficiency |
| 7 | **One process per container** | Easier to scale and debug |

### Don'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Secrets in Dockerfile** | Use environment variables or secrets managers |
| 2 | **Use \`latest\` tag** | Pin specific versions for reproducibility |
| 3 | **Run as root** | Add \`USER appuser\` in Dockerfile |
| 4 | **Install unnecessary packages** | Keep images minimal — Alpine + only what's needed |
| 5 | **Store data in containers** | Use volumes for persistence |
| 6 | **Ignore \`.dockerignore\`** | Always create one — prevents context bloat |`, keyPoints: ['One process per container for easier scaling.', 'Pin image versions for reproducible builds.', 'Health checks are required for orchestration.', 'Layer ordering maximizes Docker cache efficiency.'] },

      { title: 'Cloud Deployment', content: `For production, images are built in CI/CD, tagged with a version, and pushed to a container registry. Production Compose files reference pre-built images instead of building locally.

### Build & Push to Registry

\`\`\`bash
# Tag images
docker tag billing-catalog:latest ghcr.io/your-org/billing-catalog:1.0.0

# Push to GitHub Container Registry
docker push ghcr.io/your-org/billing-catalog:1.0.0
\`\`\`

### Production Considerations

| Setting | Purpose |
|---|---|
| \`restart: always\` | Auto-restart on failure |
| \`deploy.resources.limits\` | CPU/memory caps per container |
| \`deploy.replicas\` | Multiple instances for availability |
| Image tags (\`\${VERSION}\`) | Version controlled deployments |`, code: `# docker-compose.prod.yml\nservices:\n  gateway:\n    image: ghcr.io/your-org/billing-gateway:\${VERSION}\n    restart: always\n    deploy:\n      resources:\n        limits:\n          cpus: "0.5"\n          memory: 256M\n\n  catalog-api:\n    image: ghcr.io/your-org/billing-catalog:\${VERSION}\n    restart: always\n    deploy:\n      replicas: 2\n      resources:\n        limits:\n          cpus: "1.0"\n          memory: 512M`, codeLabel: 'Production Docker Compose', keyPoints: ['Build once in CI/CD, deploy the same image everywhere.', 'Use GitHub Container Registry (GHCR) for image storage.', 'Set resource limits to prevent one service from starving others.', 'Version images with semver tags, never :latest.'] },

      { title: 'Troubleshooting & Commands', content: `### Common Issues

| Issue | Cause | Fix |
|---|---|---|
| **Container exits immediately** | App crash on startup | \`docker logs <container>\` |
| **Port already in use** | Another process on same port | Change mapping or stop conflict |
| **Build cache not working** | \`.dockerignore\` missing | Create \`.dockerignore\` |
| **Out of disk space** | Dangling images | \`docker system prune -a\` |
| **Can't connect to service** | Wrong hostname | Use service name inside containers |
| **Permission denied** | Running as root | Check \`USER\` in Dockerfile |

### Essential Commands

\`\`\`bash
# Images:     docker images | docker build -t app:1.0 . | docker rmi app:1.0
# Containers: docker ps | docker run -d app:1.0 | docker stop/rm <name>
# Compose:    docker compose up -d | down | build | logs -f <svc>
# Debug:      docker exec -it <container> sh | docker logs <container> -f
# Cleanup:    docker system prune -a | docker volume prune
# Disk:       docker system df
\`\`\``, keyPoints: ['docker logs is the first debugging step.', 'docker system prune -a reclaims disk space.', 'Use service names, not localhost, inside containers.', 'docker exec -it opens a shell inside a running container.'] }
    ]
  };

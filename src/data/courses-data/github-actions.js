export const githubActionsCourse = { id: 'github-actions', title: 'GitHub Actions', description: 'Automate CI/CD workflows — build, test, and deploy directly from GitHub.',
    officialDocs: 'https://docs.github.com/en/actions', tutorialLink: 'https://docs.github.com/en/actions/quickstart', exerciseLink: null,
    sections: [
      { title: 'What are GitHub Actions', image: '/images/github-actions/workflow-anatomy.svg', content: `GitHub Actions is GitHub's built-in automation platform for CI, CD, release workflows, repository maintenance, and pull request quality checks. Workflows live in \`.github/workflows/\` so the automation is versioned with the application code.

### Pipeline Overview

\`\`\`
Code Push/PR → CI Pipeline → CD Pipeline
                ├── Restore        ├── Build Docker images
                ├── Build          ├── Push to Registry
                ├── Unit Tests     ├── Run DB migrations
                ├── Integration    ├── Deploy to staging
                ├── Lint/Quality   ├── Smoke tests
                └── Security scan  └── Deploy to production (manual)
\`\`\`

The key mental model is **event → workflow → jobs → steps**. An event starts the workflow, jobs run on runners, and each job executes steps that either use existing actions or run shell commands.`, keyPoints: ['Automation is stored in the repository with the code.', 'The core structure is event → workflow → job → step.', 'No external CI/CD server needed — native to GitHub.', 'Free tier: 2,000 minutes/month for private repos.'] },

      { title: 'Why GitHub Actions & Trade-offs', content: `### Why We Chose GitHub Actions

| Factor | Decision Rationale |
|---|---|
| **Native to GitHub** | No external CI/CD tool needed — workflows live in the repo |
| **Free Tier** | 2,000 minutes/month for private repos |
| **Matrix Builds** | Test across multiple OS/runtime versions in parallel |
| **Reusable Workflows** | DRY across services — write once, use in all pipelines |
| **Marketplace** | Thousands of pre-built actions (Docker, Azure, K8s) |
| **Self-Hosted Runners** | Run on your own machines for faster builds if needed |

### Advantages vs Disadvantages

| Advantage | Disadvantage |
|---|---|
| Native GitHub integration | YAML can get verbose for complex workflows |
| Parallel matrix builds | Debugging without SSH access is harder |
| Dependency caching (NuGet, pnpm, Pub) | 2,000 min/month limit on free tier |
| Encrypted secrets management | GitHub-hosted runners can be slow |
| Environment approval gates | — |`, keyPoints: ['Native integration means workflows, issues, PRs all in one place.', 'Matrix builds test across OS and runtime versions in parallel.', 'Reusable workflows keep pipelines DRY across microservices.', 'Use caching to stay within the free minutes quota.'] },

      { title: 'Core Concepts', image: '/images/github-actions/triggers-and-pr.svg', content: `| Concept | Description |
|---|---|
| **Workflow** | A YAML file in \`.github/workflows/\` — defines the automation |
| **Trigger** | Event that starts a workflow (\`push\`, \`pull_request\`, \`release\`) |
| **Job** | A set of steps that run on the same runner (VM) |
| **Step** | A single command or action within a job |
| **Action** | Reusable unit (from Marketplace or custom) |
| **Runner** | VM that executes jobs (GitHub-hosted or self-hosted) |
| **Matrix** | Run the same job with different configurations in parallel |
| **Artifact** | Files produced by a build (APKs, binaries, test results) |
| **Cache** | Persist dependencies between runs for faster builds |
| **Environment** | Named deployment target with protection rules |

### Workflow File Location

\`\`\`
.github/
  workflows/
    ci-pr.yml              # PR validation
    deploy-service.yml     # Reusable: build & deploy a .NET service
    deploy-web.yml         # Build & deploy Next.js web
    deploy-flutter.yml     # Build Flutter APK/Windows
    db-migrate.yml         # Run database migrations
\`\`\``, keyPoints: ['Workflows are YAML files in .github/workflows/.', 'Jobs run on runners — GitHub-hosted or self-hosted.', 'Matrix strategy tests across OS and versions in parallel.', 'Caching NuGet/pnpm/Pub packages dramatically speeds up builds.'] },

      { title: 'YAML, Triggers & Secrets', image: '/images/github-actions/runners-and-matrix.svg', content: `Every workflow is a YAML file. The most important keys are \`name\`, \`on\`, \`jobs\`, \`env\`, \`permissions\`, and \`concurrency\`. YAML indentation matters — many workflow bugs come from structure mistakes.

### Trigger Events

Common triggers: \`push\`, \`pull_request\`, \`workflow_dispatch\` (manual), \`schedule\`, \`release\`, and \`workflow_call\` (reusable). Use **path filters** to only build what changed.

### Secrets & Permissions

Use **repository secrets** for sensitive values. Reduce \`GITHUB_TOKEN\` permissions so each workflow gets only what it needs.

| Secret | Purpose |
|---|---|
| \`GITHUB_TOKEN\` | Auto-provided — GHCR and API access |
| \`KUBE_CONFIG\` | Base64-encoded kubeconfig for kubectl |
| \`STAGING_DB_CONNECTION\` | Staging PostgreSQL connection string |
| \`PRODUCTION_DB_CONNECTION\` | Production PostgreSQL connection string |`, code: `name: Pull Request Validation\n\non:\n  pull_request:\n    branches: [main, development]\n  workflow_dispatch:\n    inputs:\n      target_env:\n        description: 'Environment to deploy'\n        required: true\n        type: choice\n        options: [dev, stage, prod]\n\npermissions:\n  contents: read\n  pull-requests: write\n\nconcurrency:\n  group: ci-\${{ github.head_ref }}\n  cancel-in-progress: true\n\nenv:\n  DOTNET_VERSION: "9.0.x"\n  NODE_VERSION: "22"\n\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n    - run: npm ci\n    - run: npm test\n    - run: echo Deploying to \${{ inputs.target_env }}\n      env:\n        API_TOKEN: \${{ secrets.DEPLOY_API_TOKEN }}`, codeLabel: 'Workflow with Triggers, Secrets & Concurrency', keyPoints: ['Path filters prevent unnecessary builds.', 'Concurrency groups cancel older runs on the same PR.', 'workflow_dispatch adds a manual "Run workflow" button.', 'Minimize GITHUB_TOKEN permissions for security.'] },

      { title: 'CI Pipeline (PR Validation)', image: '/images/github-actions/ci-pipeline.svg', content: `The CI pipeline validates every pull request. It runs .NET build + tests with PostgreSQL/Redis service containers, Next.js lint + build, and a security scan — all in parallel jobs.

### Service Containers

GitHub Actions can spin up PostgreSQL, Redis, and other services right in the workflow runner. Integration tests connect to them via \`localhost\`.

### Test Results

Upload test results as artifacts so they're accessible from the GitHub UI even after the run completes.`, code: `# .github/workflows/ci-pr.yml\nname: CI — Pull Request Validation\n\non:\n  pull_request:\n    branches: [main, develop]\n\njobs:\n  # ─── .NET Backend ───\n  dotnet-build-test:\n    name: ".NET Build & Test"\n    runs-on: ubuntu-latest\n    services:\n      postgres:\n        image: postgres:16-alpine\n        env:\n          POSTGRES_DB: billing_test\n          POSTGRES_USER: test_user\n          POSTGRES_PASSWORD: test_pass\n        ports:\n          - 5432:5432\n        options: >-\n          --health-cmd "pg_isready -U test_user -d billing_test"\n          --health-interval 10s\n          --health-timeout 5s\n          --health-retries 5\n      redis:\n        image: redis:7-alpine\n        ports:\n          - 6379:6379\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-dotnet@v4\n        with:\n          dotnet-version: "9.0.x"\n      - uses: actions/cache@v4\n        with:\n          path: ~/.nuget/packages\n          key: nuget-\${{ hashFiles('**/*.csproj') }}\n      - run: dotnet restore\n      - run: dotnet build --no-restore -c Release\n      - run: dotnet test --no-build -c Release --filter "Category!=Integration"\n      - run: dotnet test --no-build -c Release --filter "Category=Integration"\n        env:\n          ConnectionStrings__DefaultConnection: "Host=localhost;Database=billing_test;Username=test_user;Password=test_pass"\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: test-results\n          path: "**/*.trx"\n\n  # ─── Next.js Frontend ───\n  nextjs-build:\n    name: "Next.js Build & Lint"\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: "22"\n      - uses: pnpm/action-setup@v4\n        with:\n          version: 9\n      - uses: actions/cache@v4\n        with:\n          path: ~/.local/share/pnpm/store\n          key: pnpm-\${{ hashFiles('**/pnpm-lock.yaml') }}\n      - run: pnpm install --frozen-lockfile\n        working-directory: ./src/web\n      - run: pnpm lint\n        working-directory: ./src/web\n      - run: pnpm build\n        working-directory: ./src/web\n\n  # ─── Security Scan ───\n  security-scan:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: aquasecurity/trivy-action@master\n        with:\n          scan-type: "fs"\n          severity: "HIGH,CRITICAL"`, codeLabel: 'Full CI Pipeline', keyPoints: ['Service containers provide PostgreSQL and Redis for integration tests.', 'NuGet and pnpm caches speed up builds by 2-5x.', '.NET, Next.js, and security scan jobs run in parallel.', 'Upload test results as artifacts for post-run analysis.'] },

      { title: 'CD Pipeline (Deploy Services)', image: '/images/github-actions/environments-approvals.svg', content: `The CD pipeline builds a Docker image, pushes it to GitHub Container Registry (GHCR), deploys to **staging** (auto), then to **production** (manual approval required).

### Reusable Workflow Pattern

Instead of duplicating deployment logic for each service, we use a \`workflow_call\` reusable workflow. Each service has a thin wrapper that calls the shared workflow with its service name and path.

### Environments

| Environment | Protection Rules |
|---|---|
| **staging** | Auto-deploy on merge to main |
| **production** | Requires manual approval from admin |

Configure at: **Settings → Environments → Add required reviewers**.`, code: `# .github/workflows/deploy-service.yml (Reusable)\nname: CD — Deploy Service\n\non:\n  workflow_call:\n    inputs:\n      service-name:\n        required: true\n        type: string\n      service-path:\n        required: true\n        type: string\n    secrets:\n      REGISTRY_TOKEN:\n        required: true\n      KUBE_CONFIG:\n        required: true\n\nenv:\n  REGISTRY: ghcr.io\n  IMAGE_NAME: \${{ github.repository_owner }}/billing-\${{ inputs.service-name }}\n\njobs:\n  build-push:\n    name: "Build & Push Docker Image"\n    runs-on: ubuntu-latest\n    outputs:\n      image-tag: \${{ steps.meta.outputs.tags }}\n    steps:\n      - uses: actions/checkout@v4\n      - uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: \${{ github.actor }}\n          password: \${{ secrets.REGISTRY_TOKEN }}\n      - uses: docker/metadata-action@v5\n        id: meta\n        with:\n          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}\n          tags: |\n            type=sha\n            type=semver,pattern={{version}}\n      - uses: docker/build-push-action@v6\n        with:\n          context: .\n          file: \${{ inputs.service-path }}/Dockerfile\n          push: true\n          tags: \${{ steps.meta.outputs.tags }}\n          cache-from: type=gha\n          cache-to: type=gha,mode=max\n\n  deploy-staging:\n    needs: build-push\n    runs-on: ubuntu-latest\n    environment: staging\n    steps:\n      - uses: azure/setup-kubectl@v4\n      - run: |\n          echo "\${{ secrets.KUBE_CONFIG }}" | base64 -d > \\$HOME/.kube/config\n          kubectl set image deployment/\${{ inputs.service-name }} \\\\\n            \${{ inputs.service-name }}=\${{ needs.build-push.outputs.image-tag }} \\\\\n            -n billing-staging\n          kubectl rollout status deployment/\${{ inputs.service-name }} -n billing-staging --timeout=120s\n\n  deploy-production:\n    needs: [build-push, deploy-staging]\n    runs-on: ubuntu-latest\n    environment: production  # Requires manual approval\n    steps:\n      - uses: azure/setup-kubectl@v4\n      - run: |\n          echo "\${{ secrets.KUBE_CONFIG }}" | base64 -d > \\$HOME/.kube/config\n          kubectl set image deployment/\${{ inputs.service-name }} \\\\\n            \${{ inputs.service-name }}=\${{ needs.build-push.outputs.image-tag }} \\\\\n            -n billing-production\n          kubectl rollout status deployment/\${{ inputs.service-name }} -n billing-production --timeout=180s`, codeLabel: 'Reusable CD Pipeline', keyPoints: ['Reusable workflows prevent duplication across services.', 'Docker images are tagged with SHA and semver.', 'Staging deploys automatically, production requires approval.', 'GHA cache speeds up Docker builds significantly.'] },

      { title: 'Calling Reusable Workflows', content: `Each service has a thin deployment workflow that calls the shared reusable workflow. **Path filters** ensure only the changed service is rebuilt and deployed.

### Composite Action — Setup .NET + Cache

Custom composite actions bundle common setup steps (install SDK, restore cache) into a reusable unit that any workflow can reference.`, code: `# .github/workflows/deploy-catalog.yml\nname: Deploy Catalog Service\n\non:\n  push:\n    branches: [main]\n    paths:\n      - "src/Services/Catalog.Api/**"\n\njobs:\n  deploy:\n    uses: ./.github/workflows/deploy-service.yml\n    with:\n      service-name: catalog-api\n      service-path: src/Services/Catalog.Api\n    secrets:\n      REGISTRY_TOKEN: \${{ secrets.GITHUB_TOKEN }}\n      KUBE_CONFIG: \${{ secrets.KUBE_CONFIG }}\n\n# ── Composite Action: .github/actions/setup-dotnet/action.yml ──\nname: "Setup .NET with Cache"\ndescription: "Setup .NET SDK with NuGet cache"\ninputs:\n  dotnet-version:\n    description: ".NET SDK version"\n    default: "9.0.x"\nruns:\n  using: "composite"\n  steps:\n    - uses: actions/setup-dotnet@v4\n      with:\n        dotnet-version: \${{ inputs.dotnet-version }}\n    - uses: actions/cache@v4\n      with:\n        path: ~/.nuget/packages\n        key: nuget-\${{ hashFiles('**/*.csproj') }}`, codeLabel: 'Service Wrapper & Composite Action', keyPoints: ['Path filters trigger builds only for changed services.', 'Each service wrapper is just ~15 lines of YAML.', 'Composite actions bundle common setup into reusable units.', 'secrets: inherit passes all repository secrets to called workflows.'] },

      { title: 'Flutter Build Pipeline', content: `The Flutter pipeline builds both **Android APK** and **Windows Desktop** artifacts. It uses the \`subosito/flutter-action\` to install Flutter, runs tests, then builds platform-specific binaries.

### Build Matrix

- **Android APK**: Runs on \`ubuntu-latest\`, produces \`app-release.apk\`
- **Windows Desktop**: Runs on \`windows-latest\`, produces portable executable

Both artifacts are uploaded and available for download from the GitHub Actions run.`, code: `# .github/workflows/deploy-flutter.yml\nname: Flutter Build\n\non:\n  push:\n    branches: [main]\n    paths:\n      - "src/mobile/**"\n  workflow_dispatch:\n\njobs:\n  build-android:\n    name: "Build Android APK"\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: subosito/flutter-action@v2\n        with:\n          flutter-version: "3.x"\n      - run: flutter pub get\n        working-directory: ./src/mobile\n      - run: flutter test\n        working-directory: ./src/mobile\n      - run: flutter build apk --release\n        working-directory: ./src/mobile\n      - uses: actions/upload-artifact@v4\n        with:\n          name: android-apk\n          path: src/mobile/build/app/outputs/flutter-apk/app-release.apk\n\n  build-windows:\n    name: "Build Windows Desktop"\n    runs-on: windows-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: subosito/flutter-action@v2\n        with:\n          flutter-version: "3.x"\n      - run: flutter pub get\n        working-directory: ./src/mobile\n      - run: flutter build windows --release\n        working-directory: ./src/mobile\n      - uses: actions/upload-artifact@v4\n        with:\n          name: windows-build\n          path: src/mobile/build/windows/x64/runner/Release/`, codeLabel: 'Flutter Build Pipeline', keyPoints: ['subosito/flutter-action installs Flutter on any runner.', 'Android runs on ubuntu-latest, Windows on windows-latest.', 'Artifacts are uploaded for download from the run page.', 'workflow_dispatch allows manual builds from the GitHub UI.'] },

      { title: 'Database Migration Pipeline', content: `Database migrations run as a separate pipeline triggered when migration files change. It deploys to **staging first**, then to **production with manual approval** — ensuring safe, staged rollouts.

This is critical because database changes can't be rolled back as easily as code deployments.`, code: `# .github/workflows/db-migrate.yml\nname: Database Migration\n\non:\n  push:\n    branches: [main]\n    paths:\n      - "src/Migrations/**"\n  workflow_dispatch:\n\njobs:\n  migrate-staging:\n    name: "Migrate Staging DB"\n    runs-on: ubuntu-latest\n    environment: staging\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-dotnet@v4\n        with:\n          dotnet-version: "9.0.x"\n      - run: dotnet run --project src/Migrations/DatabaseMigrator\n        env:\n          ConnectionStrings__DefaultConnection: \${{ secrets.STAGING_DB_CONNECTION }}\n\n  migrate-production:\n    name: "Migrate Production DB"\n    needs: migrate-staging\n    runs-on: ubuntu-latest\n    environment: production  # Manual approval required\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-dotnet@v4\n        with:\n          dotnet-version: "9.0.x"\n      - run: dotnet run --project src/Migrations/DatabaseMigrator\n        env:\n          ConnectionStrings__DefaultConnection: \${{ secrets.PRODUCTION_DB_CONNECTION }}`, codeLabel: 'Database Migration Pipeline', keyPoints: ['Migrations trigger only when src/Migrations/ changes.', 'Staging migrates first to catch issues early.', 'Production requires manual approval before migration.', 'Database changes are harder to rollback than code — always stage first.'] },

      { title: 'Environments & Approval Gates', image: '/images/github-actions/environments-approvals.svg', content: `GitHub **Environments** are the cleanest way to model dev, stage, and prod. Each environment can have its own secrets, wait timers, required reviewers, and deployment history.

### Environment Configuration

| Environment | Protection Rules |
|---|---|
| **staging** | Auto-deploy on merge to main |
| **production** | Requires manual approval from admin |

### Practical Pattern

- **Automatic** deployment to dev/staging — fast feedback
- **Gated** promotion to production — explicit, reviewable releases
- Each environment has **scoped secrets** — staging DB creds are separate from production

Configure at: **Settings → Environments → Add required reviewers**.`, keyPoints: ['Environment rules should reflect deployment risk.', 'Dev/staging can be fast while production stays protected.', 'Environment-scoped secrets reduce accidental leakage.', 'Approval history improves release traceability.'] },

      { title: 'Local Testing & Troubleshooting', image: '/images/github-actions/review-coverage.svg', content: `### Local Testing with \`act\`

Test workflows locally before pushing to GitHub using the \`act\` tool:

\`\`\`bash
winget install nektos.act    # Install
act -l                       # List available workflows
act -j dotnet-build-test     # Run a specific job
act -j deploy --secret-file .secrets  # With secrets
\`\`\`

### Common Issues

| Issue | Cause | Fix |
|---|---|---|
| **Workflow not triggered** | Wrong branch/path filter | Check \`on:\` triggers |
| **Permission denied (GHCR)** | Missing \`packages: write\` | Add \`permissions\` block |
| **Cache miss** | Key changed | Check \`hashFiles()\` pattern |
| **Timeout** | Slow build or hanging test | Add \`timeout-minutes\`; check test |
| **Secret not available** | Wrong environment or name | Check secret name and env |

### GitHub CLI Commands

\`\`\`bash
gh workflow list          # List workflows
gh workflow run <name>    # Trigger manually
gh run list               # List recent runs
gh run view <id> --log    # View logs
gh run watch <id>         # Watch in real-time
gh run rerun <id>         # Rerun a failed run
\`\`\``, keyPoints: ['Use act to test workflows locally before pushing.', 'GitHub CLI (gh) provides workflow management from terminal.', 'Most issues come from wrong triggers or missing permissions.', 'Always add timeout-minutes to prevent hanging jobs.'] },

      { title: 'Best Practices', content: `### Do's

| # | Practice | Reason |
|---|---|---|
| 1 | **Cache dependencies** | NuGet, pnpm, Pub — 2-5x faster builds |
| 2 | **Use \`concurrency\` groups** | Cancel older runs on same PR |
| 3 | **Pin action versions** | \`actions/checkout@v4\` not \`@main\` |
| 4 | **Use path filters** | Only build what changed |
| 5 | **Use reusable workflows** | DRY across services |
| 6 | **Add timeouts** | \`timeout-minutes: 15\` — prevent hanging jobs |
| 7 | **Use environments** | Staging → approval → production |

### Don'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Store secrets in YAML** | Use repository secrets |
| 2 | **Skip tests in CI** | Tests are the point of CI |
| 3 | **Use \`latest\` image tag** | Use SHA-based or semver tags |
| 4 | **Run on every push** | Use path filters and branch restrictions |
| 5 | **Use \`continue-on-error\`** | Failures should fail the pipeline |

The fastest way to learn GitHub Actions is to build one real workflow end to end: PR validation, Docker build, a deployment gate, and one PR automation rule like coverage or checklist validation.`, keyPoints: ['Cache dependencies for 2-5x faster builds.', 'Concurrency groups cancel older runs on the same PR.', 'Pin action versions — never use @main.', 'Workflow quality is part of code quality.'] }
    ]
  };

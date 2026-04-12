export const playwrightCourse = {
    id: 'playwright', title: 'Playwright', description: 'Modern end-to-end testing framework by Microsoft for web applications — supports Chromium, Firefox, and WebKit with built-in code generation and CI/CD integration.',
    officialDocs: 'https://playwright.dev/docs/intro', tutorialLink: 'https://playwright.dev/docs/writing-tests', exerciseLink: null,
    sections: [
      { title: 'What is Playwright', image: '/images/playwright/playwright-overview.svg', content: `**Playwright** is a modern end-to-end testing framework built by Microsoft. It enables reliable cross-browser testing across **Chromium**, **Firefox**, and **WebKit** with a single API.

### Why Playwright?

| Feature | Benefit |
|---|---|
| **Cross-Browser** | Chromium (Chrome/Edge), Firefox, WebKit (Safari) |
| **Auto-Wait** | Automatically waits for elements — no manual \`sleep()\` |
| **Codegen** | Record tests by clicking in the browser |
| **Parallel Execution** | Tests run in parallel by default |
| **Trace Viewer** | Time-travel debugging with screenshots and DOM |
| **Multi-Language** | JavaScript, TypeScript, Python, C#, Java |
| **Network Interception** | Mock APIs and control network conditions |
| **Mobile Emulation** | Test responsive designs on mobile viewports |

### Playwright vs Other Frameworks

| Feature | Playwright | Cypress | Selenium |
|---|---|---|---|
| **Browsers** | Chromium, Firefox, WebKit | Chromium, Firefox | All browsers |
| **Speed** | ⚡ Very fast | ⚡ Fast | 🐢 Slower |
| **Auto-Wait** | ✅ Built-in | ✅ Built-in | ❌ Manual waits |
| **Codegen** | ✅ Built-in | ❌ | ❌ |
| **Parallel** | ✅ Default | ❌ (paid) | ✅ Grid |
| **Languages** | JS, TS, Python, C#, Java | JavaScript only | All |`, keyPoints: ['Playwright supports Chromium, Firefox, and WebKit in one framework.', 'Built-in auto-wait eliminates flaky tests.', 'Code generation records browser interactions as test code.', 'Tests run in parallel by default for fast execution.', 'Supports JavaScript, TypeScript, Python, C#, and Java.'] },

      { title: 'Installation & Setup', content: `### Download & Install

\`\`\`powershell
# Create a new Playwright project
npm init playwright@latest

# Or add to existing project
npm install -D @playwright/test

# Install browsers (Chromium, Firefox, WebKit)
npx playwright install
\`\`\`

### Project Structure After Init

\`\`\`text
project/
├── playwright.config.ts     # Configuration
├── tests/
│   └── example.spec.ts      # Test files
├── tests-examples/
│   └── demo-todo-app.spec.ts
├── .github/
│   └── workflows/
│       └── playwright.yml   # CI config
└── package.json
\`\`\`

### Configuration

\`\`\`typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',

    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
        { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
    ],

    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});
\`\`\``, keyPoints: ['npm init playwright@latest scaffolds a complete project.', 'npx playwright install downloads Chromium, Firefox, and WebKit.', 'Configuration defines browsers, retries, reporters, and base URL.', 'webServer config auto-starts dev server before tests.', 'Projects define browser/device matrix for cross-browser testing.'] },

      { title: 'Code Generation', image: '/images/playwright/playwright-codegen.svg', content: `Playwright's **Codegen** tool opens a browser window where you interact with your app. Every click, type, and navigation is recorded as test code in real-time.

### Generate Tests from Browser Interactions

\`\`\`powershell
# Open codegen with your app URL
npx playwright codegen http://localhost:3000

# Generate tests in a specific language
npx playwright codegen --target csharp http://localhost:3000
npx playwright codegen --target python http://localhost:3000
npx playwright codegen --target java http://localhost:3000

# Open codegen with specific viewport
npx playwright codegen --viewport-size=375,667 http://localhost:3000

# Save generated test to file
npx playwright codegen --output tests/generated.spec.ts http://localhost:3000
\`\`\`

### How Codegen Works

1. **Run codegen** → Browser opens with your app + a code panel
2. **Interact** → Click, type, navigate, select dropdowns
3. **Code appears** → Real test code is generated live
4. **Copy/Save** → Paste into your test file and customize

### Example Generated Output

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('user can submit contact form', async ({ page }) => {
    await page.goto('http://localhost:3000/contact');
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Message').fill('Hello from Playwright!');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Thank you')).toBeVisible();
});
\`\`\`

### Locator Priority (Best to Worst)

| Priority | Locator | Example |
|---|---|---|
| 1 | **Role** | \`page.getByRole('button', { name: 'Submit' })\` |
| 2 | **Label** | \`page.getByLabel('Email')\` |
| 3 | **Text** | \`page.getByText('Welcome')\` |
| 4 | **Test ID** | \`page.getByTestId('submit-btn')\` |
| 5 | **CSS** | \`page.locator('.btn-primary')\` (less stable) |`, keyPoints: ['Codegen records browser interactions as test code automatically.', 'Supports TypeScript, Python, C#, and Java output.', 'Prefer getByRole and getByLabel locators for stability.', 'Generated tests can be customized and extended.', 'Use --output flag to save generated tests directly to files.'] },

      { title: 'Writing & Running Tests', content: `### Basic Test Structure

\`\`\`typescript
import { test, expect } from '@playwright/test';

test.describe('Category Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/categories');
    });

    test('should display category list', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Categories' }))
            .toBeVisible();
        await expect(page.locator('table tbody tr'))
            .toHaveCount(5);
    });

    test('should create a new category', async ({ page }) => {
        await page.getByRole('button', { name: 'Add' }).click();

        // Fill the form
        await page.getByLabel('Code').fill('ELEC');
        await page.getByLabel('Name').fill('Electronics');
        await page.getByRole('button', { name: 'Save' }).click();

        // Verify success
        await expect(page.getByText('Category created'))
            .toBeVisible();
    });

    test('should handle validation errors', async ({ page }) => {
        await page.getByRole('button', { name: 'Add' }).click();
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('Code is required'))
            .toBeVisible();
    });
});
\`\`\`

### Running Tests

\`\`\`powershell
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/categories.spec.ts

# Run in headed mode (see the browser)
npx playwright test --headed

# Run specific browser only
npx playwright test --project=chromium

# Run with debug inspector
npx playwright test --debug

# Run specific test by title
npx playwright test -g "should create a new category"

# Generate HTML report
npx playwright show-report
\`\`\`

### API Testing with Playwright

\`\`\`typescript
import { test, expect } from '@playwright/test';

test('API: create and fetch category', async ({ request }) => {
    // POST
    const createRes = await request.post('/api/categories', {
        data: { code: 'ELEC', name: 'Electronics' }
    });
    expect(createRes.ok()).toBeTruthy();

    const created = await createRes.json();
    expect(created.code).toBe('ELEC');

    // GET
    const getRes = await request.get('/api/categories/' + created.id);
    expect(getRes.ok()).toBeTruthy();
});
\`\`\``, keyPoints: ['Use test.describe() to group related tests.', 'beforeEach() sets up common page state (navigation, login).', 'expect() provides rich assertions — toBeVisible, toHaveCount, toHaveText.', '--headed runs tests with a visible browser for debugging.', 'Playwright also supports API testing via request context.'] },

      { title: 'Advanced Features', content: `### Network Interception (Mock API)

\`\`\`typescript
test('show error on API failure', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/categories', (route) => {
        route.fulfill({
            status: 500,
            body: JSON.stringify({ error: 'Server error' }),
        });
    });

    await page.goto('/categories');
    await expect(page.getByText('Something went wrong'))
        .toBeVisible();
});
\`\`\`

### Authentication State (Reuse Login)

\`\`\`typescript
// auth.setup.ts — Login once, save state
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@test.com');
    await page.getByLabel('Password').fill('Test123!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('/dashboard');
    await page.context().storageState({ path: '.auth/user.json' });
});

// Use in playwright.config.ts
{
    name: 'authenticated tests',
    use: { storageState: '.auth/user.json' },
    dependencies: ['authenticate'],
}
\`\`\`

### Visual Regression Testing

\`\`\`typescript
test('homepage looks correct', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png', {
        maxDiffPixels: 100,
    });
});

// Update screenshots:
// npx playwright test --update-snapshots
\`\`\`

### Trace Viewer — Time-Travel Debugging

\`\`\`powershell
# Run with trace recording
npx playwright test --trace on

# Open trace viewer
npx playwright show-trace trace.zip
\`\`\`

Trace Viewer shows:
- Every action with screenshots and timing
- DOM snapshot at each step
- Network requests and responses
- Console logs`, keyPoints: ['Network interception enables mocking API responses for error testing.', 'Save authentication state to reuse login across tests.', 'Visual regression catches unintended UI changes.', 'Trace Viewer provides time-travel debugging with DOM snapshots.', 'page.route() intercepts and modifies network requests.'] },

      { title: 'CI/CD Integration', content: `### GitHub Actions

\`\`\`yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
\`\`\`

### Docker Execution

\`\`\`yaml
# docker-compose.test.yml
services:
  playwright:
    image: mcr.microsoft.com/playwright:v1.48.0-noble
    working_dir: /app
    volumes:
      - .:/app
    command: npx playwright test
    depends_on:
      - web
  web:
    build: .
    ports:
      - "3000:3000"
\`\`\`

### Best Practices

| # | Practice | Reason |
|---|---|---|
| 1 | **Use codegen for initial tests** | Faster test creation |
| 2 | **Prefer role-based locators** | Resilient to CSS changes |
| 3 | **Run in CI with retries** | Handle flaky network conditions |
| 4 | **Use trace on failure** | Debug without reproducing issues |
| 5 | **Test mobile viewports** | Catch responsive design issues |
| 6 | **Mock external APIs** | Faster, deterministic tests |
| 7 | **Reuse auth state** | Avoid logging in for every test |

### Don'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Use CSS selectors** | Prefer getByRole, getByLabel |
| 2 | **Hard-code timeouts** | Rely on auto-wait |
| 3 | **Skip cross-browser** | Test Chromium, Firefox, WebKit |
| 4 | **Ignore flaky tests** | Fix root cause or add retries |`, keyPoints: ['Run Playwright in GitHub Actions with auto-report upload.', 'Use Microsoft Docker image for consistent CI environments.', 'Prefer role-based locators for resilient, maintainable tests.', 'Enable trace-on-failure to debug CI failures without reproducing.', 'Test across multiple browsers and mobile viewports.'] }
    ]
  };

/*
 * Selenium course extension — extra sections and worked examples merged into
 * courses-data/selenium.js at load time. Examples use Selenium 4 (Java) with
 * TestNG; Selenium Manager downloads the right browser driver automatically,
 * so no System.setProperty("webdriver.chrome.driver", ...) is needed.
 */

export default {
  examples: {
    'Your First Test Script': [
      {
        title: 'Selenium 4 test with setup, teardown and assertions',
        language: 'java',
        explanation: 'Selenium Manager (built into Selenium 4.6+) resolves the driver for you. Create the driver in `@BeforeMethod`, quit it in `@AfterMethod` (runs even when the test fails), and **assert** rather than print.',
        code: `import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.*;

import java.time.Duration;

public class SearchTest {
    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeMethod
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new", "--window-size=1366,768");
        driver = new ChromeDriver(options);              // Selenium Manager finds chromedriver
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @Test
    public void searchShowsResults() {
        driver.get("https://www.selenium.dev/documentation/");
        driver.findElement(By.cssSelector("button.DocSearch")).click();
        WebElement box = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("docsearch-input")));
        box.sendKeys("WebDriverWait");
        WebElement firstHit = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".DocSearch-Hit a")));
        Assert.assertTrue(firstHit.getText().toLowerCase().contains("wait"),
                "First result should mention waits but was: " + firstHit.getText());
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}`,
      },
    ],
  },

  sections: [
    {
      title: 'Locator Strategies',
      after: 'Your First Test Script',
      content: `Stable locators are the single biggest factor in a maintainable suite.

| Strategy | Example | Notes |
|---|---|---|
| \`By.id\` | \`By.id("email")\` | fast and stable if IDs aren't generated |
| **test attribute** | \`By.cssSelector("[data-testid='checkout']")\` | **best** — agree on it with developers |
| \`By.name\` | \`By.name("q")\` | good for forms |
| \`By.cssSelector\` | \`"form#login button[type=submit]"\` | flexible, fast |
| \`By.xpath\` | \`"//button[normalize-space()='Pay now']"\` | only when you need text or axes |
| \`By.linkText\` | \`By.linkText("Sign out")\` | links only, breaks on text changes |
| \`By.className\` / \`tagName\` | | rarely unique |
| **Relative locators** (Selenium 4) | \`with(By.tagName("input")).below(labelEl)\` | layout-based fallback |

### Avoid

- Absolute XPath (\`/html/body/div[3]/div[2]/...\`) — breaks with any layout change.
- Auto-generated classes/IDs (\`css-1x2y3z\`, \`ember123\`).
- Index-based selectors unless order is meaningful.

### CSS cheat sheet

\`#id\`, \`.class\`, \`[attr='v']\`, \`[attr^='start']\`, \`[attr*='part']\`, \`parent > child\`, \`a + b\` (next sibling), \`li:nth-child(2)\`.`,
      code: `import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import java.util.List;

import static org.openqa.selenium.support.locators.RelativeLocator.with;

public class Locators {
    // Prefer dedicated test attributes agreed with the dev team
    static final By EMAIL       = By.cssSelector("[data-testid='login-email']");
    static final By PASSWORD    = By.id("password");
    static final By SUBMIT      = By.cssSelector("form#login button[type='submit']");
    static final By ERROR_TOAST = By.cssSelector("[role='alert']");

    // XPath when you need visible text or to move up the tree
    static final By PAY_BUTTON  = By.xpath("//button[normalize-space()='Pay now']");
    static By rowFor(String sku) {
        return By.xpath("//tr[td[@data-col='sku' and text()='" + sku + "']]");
    }

    static void examples(WebDriver driver) {
        driver.findElement(EMAIL).sendKeys("ada@example.com");

        // findElements never throws — use it to check absence or count
        List<WebElement> errors = driver.findElements(ERROR_TOAST);
        System.out.println("errors shown: " + errors.size());

        // Scope a search inside a container element
        WebElement row = driver.findElement(rowFor("LAP-01"));
        String price = row.findElement(By.cssSelector("td[data-col='price']")).getText();

        // Relative locator: the input below the "Coupon" label
        WebElement couponLabel = driver.findElement(By.xpath("//label[text()='Coupon']"));
        WebElement couponInput = driver.findElement(with(By.tagName("input")).below(couponLabel));
        couponInput.sendKeys("SAVE10");
        System.out.println("price=" + price);
    }
}`,
      codeLabel: 'A locator catalogue with CSS, XPath and relative locators',
      keyPoints: [
        'Prefer IDs and dedicated `data-testid` attributes over layout-based selectors.',
        'Use CSS by default and XPath for text matching or ancestor navigation.',
        'Use `findElements` to check for absence without exceptions.',
        'Never use absolute XPaths or generated class names.',
      ],
    },
    {
      title: 'Waits: Implicit, Explicit & Fluent',
      after: 'Locator Strategies',
      content: `Modern pages load asynchronously. Synchronise on **conditions**, never on fixed sleeps.

| Wait | Scope | Use |
|---|---|---|
| \`Thread.sleep\` | fixed delay | ❌ slow and still flaky |
| **Implicit** | every \`findElement\` polls up to N s | simple, but hides problems and mixes badly with explicit waits |
| **Explicit** (\`WebDriverWait\`) | one condition | ✅ recommended |
| **Fluent** (\`FluentWait\`) | explicit + custom polling / ignored exceptions | special cases |

### Useful \`ExpectedConditions\`

\`visibilityOfElementLocated\`, \`elementToBeClickable\`, \`invisibilityOfElementLocated\` (spinners), \`textToBePresentInElementLocated\`, \`urlContains\`, \`numberOfElementsToBe\`, \`frameToBeAvailableAndSwitchToIt\`, \`alertIsPresent\`, \`stalenessOf\`.

**Don't mix** implicit and explicit waits — timeouts can multiply unpredictably. Set implicit wait to 0 and use explicit waits everywhere.`,
      code: `import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;

import java.time.Duration;
import java.util.List;

public class WaitExamples {

    static void checkout(WebDriver driver) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        // Click only when clickable (visible + enabled)
        wait.until(ExpectedConditions.elementToBeClickable(By.id("checkout"))).click();

        // Wait for the loading spinner to disappear
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(".spinner")));

        // Wait for navigation and for specific text
        wait.until(ExpectedConditions.urlContains("/checkout/payment"));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.id("total"), "€"));

        // Custom condition with a lambda: cart badge shows the expected count
        Boolean updated = wait.until(d -> d.findElement(By.id("cart-count")).getText().equals("3"));

        // Fluent wait: poll every 250 ms, ignore stale elements while a list re-renders
        Wait<WebDriver> fluent = new FluentWait<>(driver)
                .withTimeout(Duration.ofSeconds(15))
                .pollingEvery(Duration.ofMillis(250))
                .ignoring(StaleElementReferenceException.class)
                .withMessage("search results never reached 5 items");
        List<WebElement> results = fluent.until(d -> {
            List<WebElement> items = d.findElements(By.cssSelector("[data-testid='result']"));
            return items.size() >= 5 ? items : null;     // null/false → keep polling
        });
        System.out.println(updated + " " + results.size());
    }
}`,
      codeLabel: 'Explicit, custom and fluent waits',
      keyPoints: [
        'Use explicit waits for specific conditions; never `Thread.sleep`.',
        'Wait for spinners to vanish and for elements to be clickable before acting.',
        'Lambdas make custom conditions easy: return a value or null/false to keep polling.',
        'Don\'t combine implicit and explicit waits.',
      ],
    },
    {
      title: 'Forms, Dropdowns, Alerts, Frames & Windows',
      after: 'Waits: Implicit, Explicit & Fluent',
      content: `| Element | API |
|---|---|
| Text input | \`clear()\`, \`sendKeys("...")\`, \`sendKeys(Keys.ENTER)\` |
| Checkbox / radio | \`isSelected()\` then \`click()\` |
| \`<select>\` | \`new Select(el).selectByVisibleText("…")\` / \`selectByValue\` / \`selectByIndex\` |
| File upload | \`input[type=file].sendKeys(absolutePath)\` |
| JS alert / confirm / prompt | \`driver.switchTo().alert()\` → \`accept()\`, \`dismiss()\`, \`sendKeys()\` |
| iframe | \`switchTo().frame(element)\` … \`switchTo().defaultContent()\` |
| New tab / window | \`getWindowHandles()\`, \`switchTo().window(handle)\`, \`switchTo().newWindow(WindowType.TAB)\` |
| Shadow DOM | \`host.getShadowRoot().findElement(By.cssSelector(...))\` |
| Read values | \`getText()\`, \`getAttribute("value")\` / \`getDomProperty("value")\`, \`isDisplayed()\`, \`isEnabled()\` |

Custom dropdowns built from \`div\`s are **not** \`<select>\` — click to open, then click the option.`,
      code: `import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;

import java.nio.file.Path;
import java.time.Duration;

public class InteractionExamples {
    static void fillProfile(WebDriver driver) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement name = driver.findElement(By.id("fullName"));
        name.clear();
        name.sendKeys("Ada Lovelace");

        WebElement newsletter = driver.findElement(By.id("newsletter"));
        if (!newsletter.isSelected()) newsletter.click();

        new Select(driver.findElement(By.id("country"))).selectByVisibleText("Portugal");

        driver.findElement(By.cssSelector("input[type='file']"))
              .sendKeys(Path.of("src/test/resources/avatar.png").toAbsolutePath().toString());

        // Native confirm() dialog
        driver.findElement(By.id("delete-account")).click();
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        System.out.println("Alert says: " + alert.getText());
        alert.dismiss();

        // Payment form inside an iframe
        wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(By.cssSelector("iframe[title='Secure payment']")));
        driver.findElement(By.name("cardnumber")).sendKeys("4242424242424242");   // test card
        driver.switchTo().defaultContent();

        // Link that opens a new tab
        String original = driver.getWindowHandle();
        driver.findElement(By.linkText("Terms")).click();
        wait.until(ExpectedConditions.numberOfWindowsToBe(2));
        for (String handle : driver.getWindowHandles()) {
            if (!handle.equals(original)) driver.switchTo().window(handle);
        }
        System.out.println("Terms title: " + driver.getTitle());
        driver.close();
        driver.switchTo().window(original);

        // Element inside a web component's shadow root
        SearchContext shadow = driver.findElement(By.cssSelector("app-rating")).getShadowRoot();
        shadow.findElement(By.cssSelector("button[aria-label='5 stars']")).click();
    }
}`,
      codeLabel: 'Inputs, select, upload, alert, iframe, tabs and shadow DOM',
      keyPoints: [
        'Use the `Select` class only for real `<select>` elements.',
        'Upload files by sending an absolute path to the file input.',
        'Switch into iframes and windows explicitly — and switch back afterwards.',
        'Reach into shadow DOM with `getShadowRoot()`.',
      ],
    },
    {
      title: 'Page Object Model',
      after: 'Forms, Dropdowns, Alerts, Frames & Windows',
      content: `The **Page Object Model** wraps each page (or component) in a class that exposes **intent-revealing methods** (\`login(user, pass)\`) and hides locators and waits.

| Rule | Why |
|---|---|
| Tests contain **no locators** | UI changes are fixed in one place |
| Page methods return the **next page object** | fluent, readable flows |
| No assertions inside page objects (mostly) | keep pages reusable; assert in tests |
| Components for repeated widgets (header, cart drawer) | avoid duplication |
| Waits live inside page methods | tests read like user stories |

A **BasePage** can hold the driver, a shared \`WebDriverWait\` and helpers like \`click(By)\` and \`type(By, text)\`.`,
      code: `// pages/BasePage.java
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;

abstract class BasePage {
    protected final WebDriver driver;
    protected final WebDriverWait wait;

    BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }
    protected void click(By by) { wait.until(ExpectedConditions.elementToBeClickable(by)).click(); }
    protected void type(By by, String text) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(by));
        el.clear();
        el.sendKeys(text);
    }
    protected String text(By by) { return wait.until(ExpectedConditions.visibilityOfElementLocated(by)).getText(); }
}

// pages/LoginPage.java
class LoginPage extends BasePage {
    private static final By EMAIL = By.cssSelector("[data-testid='login-email']");
    private static final By PASSWORD = By.id("password");
    private static final By SUBMIT = By.cssSelector("[data-testid='login-submit']");
    private static final By ERROR = By.cssSelector("[role='alert']");

    LoginPage(WebDriver driver) { super(driver); }

    LoginPage open(String baseUrl) { driver.get(baseUrl + "/login"); return this; }

    DashboardPage loginAs(String email, String password) {
        type(EMAIL, email);
        type(PASSWORD, password);
        click(SUBMIT);
        return new DashboardPage(driver);
    }

    String loginExpectingError(String email, String password) {
        type(EMAIL, email);
        type(PASSWORD, password);
        click(SUBMIT);
        return text(ERROR);
    }
}

// pages/DashboardPage.java
class DashboardPage extends BasePage {
    private static final By WELCOME = By.cssSelector("[data-testid='welcome']");
    DashboardPage(WebDriver driver) {
        super(driver);
        wait.until(ExpectedConditions.urlContains("/dashboard"));   // page is "loaded"
    }
    String welcomeText() { return text(WELCOME); }
}

// tests/LoginTest.java — reads like a user story, no locators
public class LoginTest extends BaseTest {          // BaseTest creates/quits the driver
    @org.testng.annotations.Test
    public void validUserSeesDashboard() {
        String welcome = new LoginPage(driver).open(baseUrl)
                .loginAs("ada@example.com", "correct-horse")
                .welcomeText();
        org.testng.Assert.assertEquals(welcome, "Welcome back, Ada");
    }

    @org.testng.annotations.Test
    public void wrongPasswordShowsError() {
        String error = new LoginPage(driver).open(baseUrl).loginExpectingError("ada@example.com", "nope");
        org.testng.Assert.assertTrue(error.contains("Invalid"));
    }
}`,
      codeLabel: 'BasePage, two page objects and a readable test',
      keyPoints: [
        'Keep locators and waits inside page objects, never in tests.',
        'Page methods express user intent and return the next page.',
        'Put assertions in tests so page objects stay reusable.',
        'A BasePage centralises waits and common actions.',
      ],
    },
    {
      title: 'Actions API & JavaScript Executor',
      after: 'Page Object Model',
      content: `### Actions API

Simulates low-level input for things \`click()\` and \`sendKeys()\` can't express:

| Interaction | Code |
|---|---|
| Hover menu | \`actions.moveToElement(menu).perform()\` |
| Drag and drop | \`actions.dragAndDrop(source, target).perform()\` |
| Right / double click | \`contextClick(el)\`, \`doubleClick(el)\` |
| Key chords | \`keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL)\` |
| Scroll (Selenium 4) | \`scrollToElement(el)\`, \`scrollByAmount(0, 500)\` |

Always end with **\`.perform()\`**.

### JavaScriptExecutor

\`((JavascriptExecutor) driver).executeScript(...)\` runs JS in the page — useful for reading state, scrolling, or setting up test data. Use it sparingly: JS-clicking hidden elements bypasses what a real user can do and can hide genuine bugs.`,
      code: `import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;

import java.time.Duration;

public class AdvancedInteractions {
    static void run(WebDriver driver) {
        Actions actions = new Actions(driver);

        // Hover to reveal a sub-menu, then click an item
        WebElement products = driver.findElement(By.id("menu-products"));
        actions.moveToElement(products).pause(Duration.ofMillis(300)).perform();
        driver.findElement(By.linkText("Laptops")).click();

        // Drag a card to the "Done" column
        WebElement card = driver.findElement(By.cssSelector("[data-card='TASK-42']"));
        WebElement done = driver.findElement(By.cssSelector("[data-column='done']"));
        actions.dragAndDrop(card, done).perform();

        // Keyboard shortcut: select all + copy in an editor
        WebElement editor = driver.findElement(By.cssSelector(".editor"));
        Keys mod = System.getProperty("os.name").toLowerCase().contains("mac") ? Keys.COMMAND : Keys.CONTROL;
        actions.click(editor).keyDown(mod).sendKeys("a").sendKeys("c").keyUp(mod).perform();

        // Scroll an element into view (Selenium 4 wheel actions)
        WebElement footer = driver.findElement(By.tagName("footer"));
        actions.scrollToElement(footer).perform();

        // JavaScript: read app state and page metrics
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Long cartItems = (Long) js.executeScript("return window.__APP_STATE__?.cart?.items?.length ?? 0;");
        Object loadMs = js.executeScript(
            "const n = performance.getEntriesByType('navigation')[0]; return Math.round(n.loadEventEnd - n.startTime);");
        js.executeScript("arguments[0].scrollIntoView({block: 'center'});", footer);
        System.out.println("cart=" + cartItems + " pageLoadMs=" + loadMs);
    }
}`,
      codeLabel: 'Hover, drag-and-drop, key chords, scrolling and JS',
      keyPoints: [
        'Use the Actions API for hover, drag-and-drop, key chords and scrolling.',
        'Every Actions chain must end with `.perform()`.',
        '`executeScript` is great for reading state, not for bypassing the UI.',
        'Pass elements to scripts via `arguments[0]`.',
      ],
    },
    {
      title: 'Data-Driven Tests with DataProvider',
      after: 'Advanced TestNG Features',
      content: `TestNG's **\`@DataProvider\`** runs one test method with many input rows — perfect for validation rules, roles, or locales.

| Feature | How |
|---|---|
| Inline data | \`return new Object[][] { {"a", 1}, {"b", 2} };\` |
| External data | read CSV/JSON/Excel in the provider |
| Parallel rows | \`@DataProvider(parallel = true)\` + \`data-provider-thread-count\` in \`testng.xml\` |
| Shared provider | \`dataProviderClass = TestData.class\` |
| Readable names | implement \`ITest\` or include the case name in the data |

Keep data close to the test when it's small; move it to resource files when it is large or owned by testers.`,
      code: `import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.IOException;
import java.nio.file.*;
import java.util.stream.Stream;

public class SignupValidationTest extends BaseTest {

    @DataProvider(name = "invalidEmails")
    public Object[][] invalidEmails() {
        return new Object[][] {
            { "plainaddress",        "Enter a valid email" },
            { "missing@domain",      "Enter a valid email" },
            { "@no-local-part.com",  "Enter a valid email" },
            { "",                    "Email is required" },
        };
    }

    @Test(dataProvider = "invalidEmails")
    public void rejectsInvalidEmail(String email, String expectedError) {
        SignupPage page = new SignupPage(driver).open(baseUrl);
        String error = page.submitWithEmail(email);
        Assert.assertEquals(error, expectedError, "for input '" + email + "'");
    }

    // CSV in src/test/resources/roles.csv:  role,menuItem,visible
    @DataProvider(name = "roleMenus", parallel = true)
    public Object[][] roleMenus() throws IOException {
        Path csv = Paths.get("src/test/resources/roles.csv");
        try (Stream<String> lines = Files.lines(csv)) {
            return lines.skip(1)
                        .map(l -> l.split(","))
                        .map(f -> new Object[] { f[0], f[1], Boolean.parseBoolean(f[2]) })
                        .toArray(Object[][]::new);
        }
    }

    @Test(dataProvider = "roleMenus")
    public void menuVisibilityByRole(String role, String menuItem, boolean visible) {
        DashboardPage dash = loginAsRole(role);
        Assert.assertEquals(dash.hasMenuItem(menuItem), visible, role + " → " + menuItem);
    }
}`,
      codeLabel: 'Inline and CSV-backed data providers',
      keyPoints: [
        'One test method + a DataProvider covers many input cases.',
        'Include the input in assertion messages so failures are easy to read.',
        'Load larger data sets from CSV/JSON resources.',
        'Run provider rows in parallel only when the test is fully isolated.',
      ],
    },
    {
      title: 'Screenshots, Logs & Failure Reporting',
      after: 'Data-Driven Tests with DataProvider',
      content: `When a UI test fails in CI, you need evidence: **screenshot**, **page source**, **browser console logs** and the **URL**.

| Evidence | API |
|---|---|
| Full screenshot | \`((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE)\` |
| Element screenshot | \`element.getScreenshotAs(OutputType.BYTES)\` |
| HTML | \`driver.getPageSource()\` |
| Console logs (Chrome) | BiDi \`LogInspector\` or \`driver.manage().logs().get(LogType.BROWSER)\` |
| Network (Chrome/Edge) | DevTools / BiDi network events |

Hook capture into a **TestNG listener** (\`ITestListener.onTestFailure\`) so every test gets it for free. Attach files to **Allure** or **ExtentReports** for rich HTML reports with history and trends.`,
      code: `import org.openqa.selenium.*;
import org.testng.ITestListener;
import org.testng.ITestResult;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/** Register with @Listeners(FailureArtifacts.class) or in testng.xml <listeners>. */
public class FailureArtifacts implements ITestListener {

    @Override
    public void onTestFailure(ITestResult result) {
        Object instance = result.getInstance();
        if (!(instance instanceof BaseTest test) || test.driver == null) return;
        WebDriver driver = test.driver;

        String name = result.getTestClass().getRealClass().getSimpleName() + "_" + result.getName() + "_"
                + LocalDateTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));
        Path dir = Paths.get("target", "failures");
        try {
            Files.createDirectories(dir);
            Path png = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE).toPath();
            Files.copy(png, dir.resolve(name + ".png"), StandardCopyOption.REPLACE_EXISTING);
            Files.writeString(dir.resolve(name + ".html"), driver.getPageSource());
            Files.writeString(dir.resolve(name + ".txt"),
                    "URL: " + driver.getCurrentUrl() + System.lineSeparator()
                    + "Title: " + driver.getTitle() + System.lineSeparator()
                    + "Error: " + result.getThrowable());
            System.out.println("Saved failure artifacts to " + dir.resolve(name) + ".*");
        } catch (IOException | WebDriverException e) {
            System.err.println("Could not capture artifacts: " + e.getMessage());
        }
    }
}`,
      codeLabel: 'TestNG listener that saves screenshot, HTML and context on failure',
      keyPoints: [
        'Capture screenshot, page source and URL automatically on every failure.',
        'Implement capture once in a TestNG listener, not in each test.',
        'Store artifacts where CI can publish them (e.g. `target/failures`).',
        'Use Allure or ExtentReports for shareable HTML reports.',
      ],
    },
    {
      title: 'Cross-Browser Testing & Selenium Grid',
      after: 'Screenshots, Logs & Failure Reporting',
      content: `**Selenium Grid 4** runs tests on remote browsers in parallel. Tests use \`RemoteWebDriver\` with browser **options** instead of local drivers.

| Mode | Command |
|---|---|
| Standalone (one process) | \`java -jar selenium-server-4.x.jar standalone\` |
| Hub + nodes | \`... hub\` and \`... node --hub http://hub:4444\` |
| Docker (recommended) | \`selenium/standalone-chrome\` or docker-compose with hub + node images |
| Cloud | BrowserStack, Sauce Labs, LambdaTest (same RemoteWebDriver API) |

The Grid UI at \`http://localhost:4444\` shows sessions; Docker images also provide **VNC/noVNC** to watch tests live and record video.

### Parallel execution

Use TestNG \`parallel="methods"\` (or \`tests\`/\`classes\`) and keep the driver in a **\`ThreadLocal\`** so threads never share a browser.`,
      code: `// docker compose up -d   (docker-compose.yml)
// services:
//   selenium-hub:   { image: selenium/hub:4.25.0, ports: ["4442:4442", "4443:4443", "4444:4444"] }
//   chrome:  { image: selenium/node-chrome:4.25.0,  shm_size: 2gb, depends_on: [selenium-hub],
//              environment: { SE_EVENT_BUS_HOST: selenium-hub, SE_NODE_MAX_SESSIONS: 4 } }
//   firefox: { image: selenium/node-firefox:4.25.0, shm_size: 2gb, depends_on: [selenium-hub],
//              environment: { SE_EVENT_BUS_HOST: selenium-hub } }

import org.openqa.selenium.MutableCapabilities;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.testng.annotations.*;

import java.net.URL;

public class BaseTest {
    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();
    protected WebDriver driver;
    protected String baseUrl = System.getProperty("baseUrl", "https://staging.example.com");

    @Parameters({"browser"})
    @BeforeMethod(alwaysRun = true)
    public void startBrowser(@Optional("chrome") String browser) throws Exception {
        MutableCapabilities options = switch (browser) {
            case "firefox" -> new FirefoxOptions().addArguments("-headless");
            default -> new ChromeOptions().addArguments("--headless=new", "--window-size=1366,768");
        };
        String gridUrl = System.getProperty("gridUrl", "http://localhost:4444");
        DRIVER.set(new RemoteWebDriver(new URL(gridUrl), options));
        driver = DRIVER.get();
    }

    @AfterMethod(alwaysRun = true)
    public void stopBrowser() {
        WebDriver d = DRIVER.get();
        if (d != null) { d.quit(); DRIVER.remove(); }
    }
}

/* testng.xml — same tests on two browsers, 4 parallel threads each
<suite name="Cross-browser" parallel="tests" thread-count="2">
  <test name="Chrome" parallel="methods" thread-count="4">
    <parameter name="browser" value="chrome"/>
    <packages><package name="tests"/></packages>
  </test>
  <test name="Firefox" parallel="methods" thread-count="4">
    <parameter name="browser" value="firefox"/>
    <packages><package name="tests"/></packages>
  </test>
</suite>
mvn test -DgridUrl=http://localhost:4444 -DbaseUrl=https://staging.example.com */`,
      codeLabel: 'RemoteWebDriver BaseTest + Grid in Docker + parallel testng.xml',
      keyPoints: [
        'Selenium Grid runs browsers remotely; tests use `RemoteWebDriver`.',
        'Docker images are the easiest way to run a Grid locally or in CI.',
        'Keep one driver per thread with `ThreadLocal` for parallel runs.',
        'Parameterise browser and base URL so one suite covers every environment.',
      ],
    },
  ],
};

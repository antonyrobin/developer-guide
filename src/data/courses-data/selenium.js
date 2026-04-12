export const seleniumCourse = {
  id: 'selenium',
  title: 'Selenium Automation (Java)',
  description: 'Master web automation using Selenium WebDriver with Java and TestNG.',
  icon: 'ShieldCheck',
  category: 'Testing',
  sections: [
    {
      id: 'selenium-intro',
      title: 'Introduction to Selenium',
      content: `Selenium is a powerful open-source framework used for automating web browsers. It allows developers and testers to write scripts in various languages (like Java, Python, C#) to simulate user actions in a browser.

### Why Selenium?
- **Open Source:** Free to use and large community support.
- **Cross-Browser:** Supports Chrome, Firefox, Safari, Edge.
- **Multi-Platform:** Works on Windows, macOS, and Linux.
- **Language Support:** Java is the most popular choice for Selenium.`,
      image: '/artifacts/selenium_logo_1775988751543.png'
    },
    {
      id: 'selenium-setup',
      title: 'Installation & Setup',
      content: `### 1. Install Java (JDK)
Download and install the latest JDK from Oracle or OpenJDK. Set the \`JAVA_HOME\` environment variable.

### 2. Download Selenium WebDriver
Get the Selenium Java client libraries from the official site.

### 3. Setup Browser Drivers
Download drivers like \`chromedriver\` or \`geckodriver\` matching your browser version.

### 4. Create a Maven Project
Add the following dependencies to your \`pom.xml\`:
\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.seleniumhq.selenium</groupId>
        <artifactId>selenium-java</artifactId>
        <version>4.x.x</version>
    </dependency>
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>7.x.x</version>
    </dependency>
</dependencies>
\`\`\``
    },
    {
      id: 'selenium-first-script',
      title: 'Your First Test Script',
      content: `Here is a standard format for a Selenium test script in Java.

\`\`\`java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.Test;

public class FirstTest {
    @Test
    public void openBrowser() {
        // Setup driver path
        System.setProperty("webdriver.chrome.driver", "path/to/chromedriver");
        
        // Initialize WebDriver
        WebDriver driver = new ChromeDriver();
        
        // Open URL
        driver.get("https://www.google.com");
        
        // Print Title
        System.out.println("Title: " + driver.getTitle());
        
        // Close Browser
        driver.quit();
    }
}
\`\`\`

### Common Commands:
- \`driver.get(url)\`: Navigates to a page.
- \`driver.findElement(By.id("id"))\`: Locates an element.
- \`element.sendKeys("text")\`: Types into a field.
- \`element.click()\`: Clicks a button.`,
      image: '/artifacts/selenium_workflow_1775988768976.png'
    },
    {
      id: 'selenium-testng',
      title: 'Advanced TestNG Features',
      content: `TestNG is used for organizing and executing test cases efficiently.

### Execution by Priority
\`\`\`java
@Test(priority = 1)
public void login() { ... }

@Test(priority = 2)
public void searchProduct() { ... }
\`\`\`

### Grouping Tests
\`\`\`java
@Test(groups = {"smoke"})
public void fastTest() { ... }

@Test(groups = {"regression"})
public void slowTest() { ... }
\`\`\`

### Generating Reports
TestNG automatically generates an \`index.html\` report in the \`test-output\` folder after execution.`
    },
    {
      id: 'selenium-best-practices',
      title: 'Best Practices & Do\'s/Don\'ts',
      content: `### Best Practices
- **Use Page Object Model (POM):** Separate page elements from test logic.
- **Use Explicit Waits:** Avoid \`Thread.sleep()\`; use \`WebDriverWait\`.
- **Clean Up:** Always close the browser in \`@AfterMethod\` or \`@AfterClass\`.

### Do's & Don'ts
| Do's | Don'ts |
| --- | --- |
| Use meaningful variable names | Don't hardcode URLs or Credentials |
| Capture screenshots on failure | Don't use absolute XPaths |
| Run tests in parallel | Don't ignore browser version compatibility |`
    }
  ]
};

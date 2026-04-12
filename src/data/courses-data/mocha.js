export const mochaCourse = {
  id: 'mocha',
  title: 'Mocha JS Testing',
  description: 'A feature-rich JavaScript test framework running on Node.js.',
  icon: 'Coffee',
  category: 'Testing',
  sections: [
    {
      id: 'mocha-intro',
      title: 'Introduction to Mocha',
      content: `Mocha is a flexible JavaScript test framework for Node.js programs, making asynchronous testing simple and fun. It runs tests serially, allowing for flexible and accurate reporting.

### Why Mocha?
- **Asynchronous Support:** Excellent handling of promises and callbacks.
- **Flexible Reporters:** Choose between spec, dot, nyan, and many others.
- **Hook Support:** Easily setup and teardown your test environment with \`before()\`, \`after()\`, etc.`,
      image: '/artifacts/mocha_logo_1775988846761.png'
    },
    {
      id: 'mocha-setup',
      title: 'Setup & Installation',
      content: `### 1. Initialize NPM
\`\`\`bash
npm init -y
\`\`\`

### 2. Install Mocha & Chai
Chai is an assertion library commonly used with Mocha.
\`\`\`bash
npm install --save-dev mocha chai
\`\`\`

### 3. Update Package.json
Add Mocha to your test script:
\`\`\`json
"scripts": {
  "test": "mocha"
}
\`\`\``
    },
    {
      id: 'mocha-basic-test',
      title: 'Writing Your First Test',
      content: `Create a \`test\` folder and add a file named \`sample.test.js\`.

\`\`\`javascript
const assert = require('chai').assert;

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
    
    it('should return 0 when the value is at the first position', function() {
      assert.equal([1, 2, 3].indexOf(1), 0);
    });
  });
});
\`\`\`

### Running the tests
\`\`\`bash
npm test
\`\`\``
    },
    {
      id: 'mocha-async',
      title: 'Asynchronous Testing',
      content: `Mocha makes it easy to test async code using promises or \`async/await\`.

\`\`\`javascript
it('should return data from API', async function() {
  const res = await someApiCall();
  assert.equal(res.status, 200);
});
\`\`\``
    },
    {
      id: 'mocha-best-practices',
      title: 'Best Practices',
      content: `### Do's
- Use descriptive strings in \`describe\` and \`it\` blocks.
- Clean up database records in the \`afterEach\` hook.
- Use arrow functions only if you don't need to access Mocha's \`this\` context.

### Don'ts
- Don't write large, complex tests; keep them atomic.
- Don't use Global variables to share state between tests.
- Don't forget to handle rejection in async tests.`
    }
  ]
};

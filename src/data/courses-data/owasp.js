export const owaspCourse = {
  id: 'owasp',
  title: 'OWASP Top 10',
  description: 'A standard awareness document for developers and web application security.',
  icon: 'ShieldCheck',
  category: 'Security & Performance',
  sections: [
    {
      id: 'owasp-intro',
      title: 'Introduction to OWASP Top 10',
      content: `The OWASP Top 10 is a standard awareness document for developers and web application security. It represents a broad consensus about the most critical security risks to web applications.`,
      image: '/images/courses/security_shield_owasp_1776183785263.png'
    },
    {
      id: 'top-10-list',
      title: 'The OWASP Top 10 (Current)',
      content: `1. **Broken Access Control:** Failures to enforce restrictions on what authenticated users can do.
2. **Cryptographic Failures:** Focus on failures related to cryptography (or lack thereof).
3. **Injection:** SQL, NoSQL, OS, and LDAP injection occur when untrusted data is sent to an interpreter as part of a command or query.
4. **Insecure Design:** Focus on risks related to design flaws.
5. **Security Misconfiguration:** Often the result of insecure default configurations, incomplete or ad hoc configurations, or open cloud storage.
6. **Vulnerable and Outdated Components:** Using components with known vulnerabilities.
7. **Identification and Authentication Failures:** Confirmation of the user's identity, authentication, and session management.
8. **Software and Data Integrity Failures:** Focusing on making assumptions related to software updates, critical data, and CI/CD pipelines without verifying integrity.
9. **Security Logging and Monitoring Failures:** Failures to detect, escalate, and respond to active breaches.
10. **Server-Side Request Forgery (SSRF):** Occurs whenever a web application is fetching a remote resource without validating the user-supplied URL.`
    },
    {
      id: 'mitigation',
      title: 'Mitigation Strategies',
      content: `### General Best Practices
- **Never trust user input:** Always validate and sanitize inputs.
- **Implement least privilege:** Give users only the permissions they need.
- **Keep everything updated:** Regularly patch dependencies and OS.
- **Use secure headers:** Implement Content Security Policy (CSP), HSTS, etc.`
    }
  ]
};

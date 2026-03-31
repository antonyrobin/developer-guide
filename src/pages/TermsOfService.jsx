import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const TermsOfService = () => {
  useSEO({
    title: 'Terms of Service',
    description: 'QuickDevGuide Terms of Service — Read our terms and conditions for using the developer quick-reference guide and educational resources.',
    keywords: 'terms of service, terms and conditions, usage policy, QuickDevGuide'
  });

  return (
    <div className="legal-page">
      <div className="legal-header">
        <NavLink to="/" className="legal-back-link">
          <ArrowLeft className="icon" /> Back to Home
        </NavLink>
        <div className="legal-icon-badge">
          <FileText className="icon-huge" />
        </div>
        <h1>Terms of Service</h1>
        <p className="legal-subtitle">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using QuickDevGuide ("the Site"), you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service ("Terms"). If you do not agree
            to these Terms, please do not use the Site.
          </p>
          <p>
            We reserve the right to update or modify these Terms at any time without prior notice.
            Your continued use of the Site after any changes constitutes your acceptance of the
            revised Terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Description of Service</h2>
          <p>
            QuickDevGuide is a free educational resource that provides quick-reference developer guides,
            tutorials, code examples, and learning materials across multiple programming languages,
            frameworks, and technologies including but not limited to:
          </p>
          <ul>
            <li>Programming Languages (JavaScript, Java, C#, Python, PHP)</li>
            <li>Frontend Frameworks (React, HTML, CSS)</li>
            <li>Backend Frameworks (Spring Boot, .NET Core, Django)</li>
            <li>Databases (SQL, NoSQL/MongoDB)</li>
            <li>DevOps & Cloud (Docker, AWS, GCP, Azure DevOps, GitHub Actions)</li>
            <li>Software Engineering (SDLC, OOP, Design Patterns, Data Structures, System Architecture)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Use of Content</h2>
          <h3>3.1 Educational Purpose</h3>
          <p>
            All content on QuickDevGuide is provided for educational and informational purposes only.
            The code examples, explanations, and guides are intended as learning resources and quick
            references for software developers.
          </p>

          <h3>3.2 Code Examples</h3>
          <p>
            Code snippets and examples provided on the Site may be used in your personal and commercial
            projects. However, you acknowledge that:
          </p>
          <ul>
            <li>Code examples are simplified for educational purposes and may not be production-ready</li>
            <li>You are responsible for testing and adapting any code for your specific use case</li>
            <li>We do not guarantee that code examples are free of errors or security vulnerabilities</li>
            <li>You should always follow industry best practices and security guidelines in production environments</li>
          </ul>

          <h3>3.3 Restrictions</h3>
          <p>You agree NOT to:</p>
          <ul>
            <li>Reproduce, duplicate, or copy the entire site content for redistribution as a competing service</li>
            <li>Use automated tools (bots, scrapers) to mass-download site content</li>
            <li>Remove or alter any copyright notices or attributions</li>
            <li>Use the Site for any unlawful purpose or in violation of any applicable laws</li>
            <li>Attempt to gain unauthorized access to any part of the Site or its infrastructure</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Intellectual Property</h2>
          <p>
            The Site's design, layout, graphics, logos, icons, and original written content are the
            intellectual property of QuickDevGuide and are protected by applicable copyright and
            trademark laws.
          </p>
          <p>
            Third-party trademarks, logos, and brand names mentioned on the Site (such as React, Java,
            Docker, AWS, etc.) are the property of their respective owners and are used solely for
            identification and educational purposes. QuickDevGuide is not affiliated with or endorsed
            by any of these companies unless explicitly stated.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. External Links</h2>
          <p>
            The Site contains links to third-party websites, including official documentation, tutorial
            platforms, and code exercise sites. These links are provided for convenience and reference.
            We do not control, endorse, or assume responsibility for the content, privacy policies, or
            practices of any third-party websites.
          </p>
          <p>
            Visiting external links is at your own risk, and we encourage you to review the terms and
            privacy policies of any third-party site you visit.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Disclaimer of Warranties</h2>
          <p>
            QuickDevGuide is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis
            without warranties of any kind, either express or implied, including but not limited to:
          </p>
          <ul>
            <li>Warranties of merchantability or fitness for a particular purpose</li>
            <li>Accuracy, completeness, or reliability of any content</li>
            <li>Uninterrupted or error-free operation of the Site</li>
            <li>Freedom from viruses or other harmful components</li>
          </ul>
          <p>
            Technology evolves rapidly. While we strive to keep content current, some information may
            become outdated. Always verify against official documentation for the most up-to-date information.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall QuickDevGuide, its creators, contributors, or affiliates be liable for any
            direct, indirect, incidental, special, consequential, or punitive damages arising from:
          </p>
          <ul>
            <li>Your use of or inability to use the Site</li>
            <li>Any errors or omissions in the content</li>
            <li>Any code examples used in your projects</li>
            <li>Any unauthorized access to or alteration of your data</li>
            <li>Any third-party content, products, or services linked from the Site</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>8. User Conduct</h2>
          <p>When using the Site, you agree to:</p>
          <ul>
            <li>Respect the intellectual property rights of QuickDevGuide and third parties</li>
            <li>Use the Site in compliance with all applicable local, state, national, and international laws</li>
            <li>Not interfere with or disrupt the Site's infrastructure or services</li>
            <li>Not attempt to probe, scan, or test the vulnerability of the Site</li>
            <li>Not impersonate any person or entity or misrepresent your affiliation</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless QuickDevGuide and its creators from and
            against any claims, liabilities, damages, losses, costs, and expenses (including reasonable
            attorney's fees) arising from your use of the Site, violation of these Terms, or infringement
            of any intellectual property or other rights of any person or entity.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws, without
            regard to conflict of law principles. Any disputes arising under these Terms shall be subject
            to the exclusive jurisdiction of the courts in the applicable jurisdiction.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision will
            be limited or eliminated to the minimum extent necessary so that these Terms will otherwise
            remain in full force and effect.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Contact Information</h2>
          <p>
            If you have any questions or concerns about these Terms of Service, please contact us:
          </p>
          <div className="legal-contact-card">
            <p><strong>QuickDevGuide</strong></p>
            <p>Email: contact@quickdevguide.com</p>
            <p>GitHub: github.com/antonyrobin</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;

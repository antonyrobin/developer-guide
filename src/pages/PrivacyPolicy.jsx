import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const PrivacyPolicy = () => {
  useSEO({
    title: 'Privacy Policy',
    description: 'QuickDevGuide Privacy Policy — Learn how we collect, use, and protect your personal information when you use our developer reference guide.',
    keywords: 'privacy policy, data protection, cookies, QuickDevGuide'
  });

  return (
    <div className="legal-page">
      <div className="legal-header">
        <NavLink to="/" className="legal-back-link">
          <ArrowLeft className="icon" /> Back to Home
        </NavLink>
        <div className="legal-icon-badge">
          <Shield className="icon-huge" />
        </div>
        <h1>Privacy Policy</h1>
        <p className="legal-subtitle">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to QuickDevGuide ("we," "our," or "us"). We are committed to protecting your privacy
            and ensuring the security of your personal information. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p>
            By accessing or using QuickDevGuide, you agree to this Privacy Policy. If you do not agree with
            the terms of this policy, please do not access the site.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <p>We may collect information that you voluntarily provide when you:</p>
          <ul>
            <li>Contact us through our website or email</li>
            <li>Subscribe to our newsletter</li>
            <li>Participate in surveys or provide feedback</li>
            <li>Report a problem with our website</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect certain information, including:</p>
          <ul>
            <li><strong>Device Information:</strong> Browser type, operating system, screen resolution, and device type</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, and navigation paths</li>
            <li><strong>Network Information:</strong> IP address, internet service provider, and approximate geographic location</li>
            <li><strong>Referral Data:</strong> The website that referred you to our site</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li><strong>Provide and Maintain:</strong> To deliver our educational content and maintain site functionality</li>
            <li><strong>Improve Experience:</strong> To understand how users interact with our site and improve content quality</li>
            <li><strong>Analytics:</strong> To analyze usage trends, track page performance, and optimize user experience</li>
            <li><strong>Communication:</strong> To respond to inquiries and send relevant updates (with your consent)</li>
            <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are
            small data files stored on your device that help us remember your preferences and understand how
            you use our site.
          </p>
          <h3>Types of Cookies We Use:</h3>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., navigation, session management)</li>
            <li><strong>Analytics Cookies:</strong> Help us understand visitor behavior to improve our content and services</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences for future visits</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Disabling certain cookies may affect
            website functionality.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Third-Party Services</h2>
          <p>We may use third-party services that collect, monitor, and analyze data to improve our service:</p>
          <ul>
            <li><strong>Google Analytics:</strong> For website traffic analysis and user behavior insights</li>
            <li><strong>Google Fonts:</strong> For typography (may collect IP addresses)</li>
            <li><strong>Unsplash:</strong> For stock images displayed on course pages</li>
          </ul>
          <p>
            These third-party services have their own privacy policies. We recommend reviewing their
            policies for more information about their data practices.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction. However, no method
            of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes
            described in this Privacy Policy, unless a longer retention period is required or permitted by law.
            Analytics data is retained in an aggregated and anonymized form.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Your Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Objection:</strong> Object to processing of your personal data</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
          </ul>
          <p>To exercise any of these rights, please contact us using the information below.</p>
        </section>

        <section className="legal-section">
          <h2>9. Children's Privacy</h2>
          <p>
            QuickDevGuide is an educational resource intended for developers of all ages. We do not knowingly
            collect personal information from children under the age of 13. If we discover that a child under 13
            has provided us with personal information, we will delete it immediately.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for
            other operational, legal, or regulatory reasons. We will notify you of any material changes by
            posting the new Privacy Policy on this page with an updated "Last Updated" date.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
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

export default PrivacyPolicy;

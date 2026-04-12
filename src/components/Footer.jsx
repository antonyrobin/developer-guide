import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">
            <BookOpen className="icon-large" />
            <span>QuickDev<span className="logo-accent-light">Guide</span></span>
          </div>
          <p className="footer-tagline">
            The ultimate quick-reference guide for modern developers. Master new technologies with simplified explanations and practical examples.
          </p>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Frontend &amp; Backend</h4>
          <ul className="footer-links">
            <li><NavLink to="/react">ReactJS</NavLink></li>
            <li><NavLink to="/nextjs">Next.js</NavLink></li>
            <li><NavLink to="/javascript">JavaScript</NavLink></li>
            <li><NavLink to="/dotnet-api">.NET Web API</NavLink></li>
            <li><NavLink to="/springboot">Spring Boot</NavLink></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Infrastructure &amp; Testing</h4>
          <ul className="footer-links">
            <li><NavLink to="/docker">Docker</NavLink></li>
            <li><NavLink to="/kubernetes">Kubernetes</NavLink></li>
            <li><NavLink to="/terraform">Terraform</NavLink></li>
            <li><NavLink to="/playwright">Playwright</NavLink></li>
            <li><NavLink to="/k6">Grafana k6</NavLink></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Data &amp; Security</h4>
          <ul className="footer-links">
            <li><NavLink to="/postgresql">PostgreSQL</NavLink></li>
            <li><NavLink to="/redis">Redis</NavLink></li>
            <li><NavLink to="/rabbitmq">RabbitMQ</NavLink></li>
            <li><NavLink to="/cloudflare">Cloudflare</NavLink></li>
            <li><NavLink to="/github-actions">GitHub Actions</NavLink></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} QuickDevGuide. Released under the <a
                href="https://github.com/antonyrobin/developer-guide/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
              >MIT License</a>. Free and Open Source.</p>
        <div className="footer-bottom-links">
          <NavLink to="/privacy-policy">Privacy Policy</NavLink>
          <NavLink to="/terms-of-service">Terms of Service</NavLink>
        </div>
      </div>      
    </footer>
  );
};

export default Footer;

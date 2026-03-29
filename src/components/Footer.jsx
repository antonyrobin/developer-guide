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
          <h4 className="footer-heading">Courses</h4>
          <ul className="footer-links">
            <li><NavLink to="/html">HTML &amp; CSS</NavLink></li>
            <li><NavLink to="/javascript">JavaScript</NavLink></li>
            <li><NavLink to="/react">ReactJS</NavLink></li>
            <li><NavLink to="/java">Java &amp; C#</NavLink></li>
            <li><NavLink to="/python">Python</NavLink></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Cloud &amp; DevOps</h4>
          <ul className="footer-links">
            <li><NavLink to="/docker">Docker</NavLink></li>
            <li><NavLink to="/github-actions">GitHub Actions</NavLink></li>
            <li><NavLink to="/aws">AWS Cloud</NavLink></li>
            <li><NavLink to="/azure-devops">Azure DevOps</NavLink></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4 className="footer-heading">Architecture</h4>
          <ul className="footer-links">
            <li><NavLink to="/sys-arch">System Architecture</NavLink></li>
            <li><NavLink to="/design-patterns">Design Patterns</NavLink></li>
            <li><NavLink to="/data-structure">Data Structures</NavLink></li>
            <li><NavLink to="/sdlc">SDLC Guide</NavLink></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} QuickDevGuide. All rights reserved.</p>
        <div className="footer-bottom-links">
          <NavLink to="/privacy-policy">Privacy Policy</NavLink>
          <NavLink to="/terms-of-service">Terms of Service</NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

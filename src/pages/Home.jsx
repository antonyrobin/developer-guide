import React from 'react';
import { NavLink } from 'react-router-dom';
import { courses, courseGroups, slugify } from '../data/courses';
import { BookOpen, Rocket, Terminal, Database, Cloud, Layout, Code2, Play, Search, Layers, FlaskConical, ArrowRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { HOME_SEO, websiteJsonLd } from '../data/seo';
import { openSearch } from '../search/searchEvents';

const groupIcon = (label) => {
  if (/database/i.test(label)) return Database;
  if (/devops|cloud|others/i.test(label)) return Cloud;
  if (/web|frontend/i.test(label)) return Layout;
  return Terminal;
};

const Home = () => {
  useSEO({
    title: null,
    description: HOME_SEO.description,
    keywords: HOME_SEO.keywords,
    path: '/',
    jsonLd: websiteJsonLd(),
  });

  const totalTopics = courses.reduce((sum, c) => sum + c.sectionCount, 0);

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-logo animate-pop-in">
          <BookOpen className="hero-icon" />
          <span>Quick<span className="hero-accent">Dev</span></span>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">The developer quick reference</h1>
          <p className="hero-subtitle">
            Short explanations, copy-ready examples and diagrams for the moment you need them — from HTML to Kubernetes.
          </p>
        </div>

        <button type="button" className="hero-search" onClick={openSearch} aria-label="Search all courses">
          <Search className="icon" />
          <span className="hero-search-text">Search courses, topics or code — e.g. “flexbox”, “stream api”</span>
          <kbd className="search-trigger-kbd">Ctrl K</kbd>
        </button>

        <div className="hero-stats">
          <div className="hero-stat"><Layers className="icon-small" /><strong>{courses.length}</strong> courses</div>
          <div className="hero-stat"><BookOpen className="icon-small" /><strong>{totalTopics}</strong> topics</div>
          <div className="hero-stat"><FlaskConical className="icon-small" /><strong>8</strong> runnable languages</div>
        </div>

        <div className="hero-actions">
          <NavLink className="btn-primary btn-large" to="/html">
            Start with HTML <Rocket className="icon" />
          </NavLink>
          <a className="btn-secondary btn-large" href="https://github.com/antonyrobin/developer-guide" target="_blank" rel="noopener noreferrer">
            View GitHub
          </a>
        </div>
      </header>

      {/* Playground CTA */}
      <section className="playground-cta">
        <div className="playground-cta-content">
          <div className="playground-cta-icon-wrap">
            <Code2 className="icon-large" />
          </div>
          <div className="playground-cta-text">
            <h2>Code Playground</h2>
            <p>Write and run <strong>HTML, CSS, JavaScript, TypeScript, React, Python, SQL</strong> and more right in your browser — with ready-made examples to start from.</p>
          </div>
          <NavLink to="/playground" className="playground-cta-btn">
            <Play className="icon-small" />
            <span>Try It Now</span>
          </NavLink>
        </div>
      </section>

      <section className="courses-section">
        <div className="courses-header">
          <span className="section-label">Our Curriculum</span>
          <h2 className="section-title">Explore Courses</h2>
        </div>

        <nav className="group-chips" aria-label="Jump to category">
          {courseGroups.map(group => (
            <a key={group.label} href={`#${slugify(group.label)}`} className="group-chip">{group.label}</a>
          ))}
        </nav>

        {courseGroups.map((group) => {
          const allCourses = group.courses ? group.courses : group.children.flatMap(child => child.courses);
          const Icon = groupIcon(group.label);

          return (
            <div key={group.label} className="course-group" id={slugify(group.label)}>
              <h3 className="course-group-label">
                {group.label}
                <span className="course-group-count">{allCourses.length}</span>
              </h3>
              <div className="courses-grid">
                {allCourses.map((course, localIdx) => (
                  <NavLink key={course.id} to={`/${course.id}`} className="course-card-link">
                    <div className="course-card animate-card-in" style={{ animationDelay: `${Math.min(localIdx * 0.04, 0.4)}s` }}>
                      <div className="course-card-content">
                        <div className="course-card-top">
                          <div className="course-icon-wrapper"><Icon className="icon" /></div>
                          <span className="course-topic-count">{course.sectionCount} topics</span>
                        </div>
                        <h3 className="course-title">{course.title}</h3>
                        <p className="course-desc">{course.description}</p>
                        <div className="course-link-text">
                          Open guide <ArrowRight className="icon-xs" />
                        </div>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Home;

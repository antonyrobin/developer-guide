import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { courses } from '../data/courses';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle, Code, Layers, Info, BookOpen, Globe, PenTool } from 'lucide-react';

const CoursePage = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setActiveTab(0);
    window.scrollTo(0, 0);
  }, [id]);

  if (!course) return <Navigate to="/" />;

  const section = course.sections[activeTab];

  return (
    <div className="course-page-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <h3 className="sidebar-title">
          <Layers className="icon" />
          <span>{course.title}</span>
        </h3>
        <nav className="sidebar-nav">
          {course.sections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveTab(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`sidebar-nav-btn ${activeTab === idx ? 'active' : ''}`}
            >
              {sec.title}
            </button>
          ))}
        </nav>

        {/* Resource Links */}
        {(course.officialDocs || course.tutorialLink || course.exerciseLink) && (
          <div className="sidebar-info">
            <h4 className="sidebar-links-heading">Resources</h4>
            <div className="sidebar-links">
              {course.officialDocs && (
                <a href={course.officialDocs} target="_blank" rel="noopener noreferrer" className="sidebar-resource-link">
                  <Globe className="icon-small" />
                  <span>Official Docs</span>
                  <ExternalLink className="icon-small" />
                </a>
              )}
              {course.tutorialLink && (
                <a href={course.tutorialLink} target="_blank" rel="noopener noreferrer" className="sidebar-resource-link">
                  <BookOpen className="icon-small" />
                  <span>Tutorial Guide</span>
                  <ExternalLink className="icon-small" />
                </a>
              )}
              {course.exerciseLink && (
                <a href={course.exerciseLink} target="_blank" rel="noopener noreferrer" className="sidebar-resource-link">
                  <PenTool className="icon-small" />
                  <span>Exercises</span>
                  <ExternalLink className="icon-small" />
                </a>
              )}
            </div>
          </div>
        )}

        <div className="sidebar-info">
          <div className="info-box">
            <Info className="icon text-primary" style={{flexShrink:0}} />
            <p>Quick-reference guide for fast recall. Bookmark this page for future use.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="course-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={id + activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="course-content-wrapper"
          >
            {/* Header */}
            <div className="course-header-info">
              <span className="badge">{course.title}</span>
              <h1 className="course-heading">{section.title}</h1>
            </div>

            {/* Main Content Text */}
            <div className="course-body-text">
              {section.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="course-paragraph">{paragraph}</p>
              ))}
            </div>

            {/* Image */}
            {section.image && (
              <div className="course-image-container">
                <img
                  src={section.image}
                  alt={section.title}
                  className="course-image"
                />
              </div>
            )}

            {/* Code Block */}
            {section.code && (
              <div className="code-section">
                <h3 className="section-subtitle">
                  <Code className="icon text-primary" />
                  <span>{section.codeLabel || 'Code Example'}</span>
                </h3>
                <div className="code-block-container">
                  <pre className="code-block">
                    <code>{section.code}</code>
                  </pre>
                  <button
                    className="btn-copy"
                    onClick={() => {
                      navigator.clipboard.writeText(section.code);
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Key Points */}
            {section.keyPoints && section.keyPoints.length > 0 && (
              <div className="key-points-full">
                <h3 className="section-subtitle">
                  <CheckCircle className="icon text-success" />
                  <span>Key Takeaways</span>
                </h3>
                <div className="key-points-list">
                  {section.keyPoints.map((point, i) => (
                    <div key={i} className="key-point-item">
                      <CheckCircle className="icon-small text-success" style={{flexShrink:0, marginTop:'2px'}} />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="course-nav-buttons">
              {activeTab > 0 && (
                <button
                  className="btn-secondary"
                  onClick={() => { setActiveTab(activeTab - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  ← {course.sections[activeTab - 1].title}
                </button>
              )}
              {activeTab < course.sections.length - 1 && (
                <button
                  className="btn-primary"
                  onClick={() => { setActiveTab(activeTab + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{marginLeft: 'auto'}}
                >
                  {course.sections[activeTab + 1].title} →
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CoursePage;

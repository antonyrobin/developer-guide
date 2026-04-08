import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { courses } from '../data/courses';
import { ExternalLink, CheckCircle, Code, Layers, Info, BookOpen, Globe, PenTool } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* Course-specific SEO keywords map */
const courseKeywords = {
  sdlc: 'SDLC, software development life cycle, agile, scrum, waterfall, kanban, V-model, sprint, software engineering',
  html: 'HTML, HTML5, web development, semantic HTML, forms, tables, accessibility, markup language',
  css: 'CSS, CSS3, flexbox, grid, responsive design, animations, media queries, web styling',
  javascript: 'JavaScript, ES6, DOM, async await, promises, closures, prototypes, web development',
  oops: 'OOP, object oriented programming, classes, inheritance, polymorphism, encapsulation, abstraction, SOLID principles',
  java: 'Java, JVM, Spring, collections framework, exception handling, multithreading, enterprise programming',
  csharp: 'C#, .NET, LINQ, async programming, entity framework, object oriented, Microsoft development',
  python: 'Python, Django, Flask, data science, machine learning, automation, scripting, pip',
  react: 'React, JSX, hooks, useState, useEffect, components, virtual DOM, frontend framework',
  php: 'PHP, Laravel, Composer, server-side scripting, web development, MySQL, Eloquent ORM',
  sql: 'SQL, database, PostgreSQL, MySQL, joins, indexes, normalization, stored procedures, queries',
  nosql: 'NoSQL, MongoDB, Redis, document database, key-value store, schema design, aggregation',
  docker: 'Docker, containers, Dockerfile, Docker Compose, DevOps, microservices, deployment',
  'spring-boot': 'Spring Boot, Java framework, REST API, Spring MVC, JPA, microservices, enterprise Java',
  blazor: 'Blazor, C# web, WebAssembly, .NET frontend, Razor components, SignalR',
  'dotnet-api': '.NET Core, Web API, REST, C# backend, Entity Framework, middleware, authentication',
  django: 'Django, Python web framework, ORM, templates, REST framework, admin panel, MVT',
  aws: 'AWS, Amazon Web Services, EC2, S3, Lambda, cloud computing, serverless, IAM',
  gcp: 'GCP, Google Cloud Platform, Cloud Run, BigQuery, Pub/Sub, Kubernetes, cloud services',
  'data-structure': 'data structures, algorithms, arrays, linked lists, trees, graphs, hash tables, sorting',
  'sys-arch': 'system architecture, microservices, scalability, load balancing, caching, message queues, design',
  'design-patterns': 'design patterns, singleton, factory, observer, strategy, SOLID, Gang of Four, software design',
  github: 'GitHub, Git, version control, repositories, pull requests, branches, collaboration',
  'github-actions': 'GitHub Actions, CI/CD, workflows, YAML, automation, continuous integration, deployment',
  'azure-devops': 'Azure DevOps, pipelines, boards, repos, CI/CD, Microsoft DevOps, agile project management',
  nextjs: 'Next.js, React framework, SSR, SSG, ISR, App Router, Server Components, API routes, middleware, Vercel',
  flutter: 'Flutter, Dart, cross-platform, mobile development, widget, Riverpod, GoRouter, Firebase, barcode scanning, POS, Material Design',
  kubernetes: 'Kubernetes, K8s, container orchestration, pods, deployments, services, Helm, kubectl, HPA, auto-scaling, microservices'
};



const getLanguage = (courseId) => {
  const map = {
    javascript: 'javascript',
    react: 'jsx',
    html: 'html',
    css: 'css',
    python: 'python',
    java: 'java',
    csharp: 'csharp',
    php: 'php',
    sql: 'sql',
    nosql: 'javascript',
    docker: 'bash',
    'spring-boot': 'java',
    blazor: 'csharp',
    'dotnet-api': 'csharp',
    django: 'python',
    aws: 'bash',
    gcp: 'bash',
    github: 'bash',
    'github-actions': 'yaml',
    'azure-devops': 'yaml',
    'data-structure': 'javascript',
    'sys-arch': 'text',
    'design-patterns': 'javascript',
    oops: 'javascript',
    sdlc: 'text',
    nextjs: 'tsx',
    flutter: 'dart',
    kubernetes: 'yaml'
  };
  return map[courseId] || 'javascript';
};

const CoursePage = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState(0);
  const [prevId, setPrevId] = useState(id);

  // Reset tab synchronously when the course changes (before render completes)
  if (id !== prevId) {
    setPrevId(id);
    setActiveTab(0);
  }

  useSEO({
    title: course ? course.title : null,
    description: course ? `Learn ${course.title} — ${course.description} Concise explanations, code examples, and visual diagrams on QuickDevGuide.` : null,
    keywords: course ? (courseKeywords[course.id] || `${course.title}, programming, developer guide, tutorial`) : null
  });

  useEffect(() => {
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
          <div
            key={id + activeTab}
            className="course-content-wrapper animate-content-in"
          >
            {/* Header */}
            <div className="course-header-info">
              <span className="badge">{course.title}</span>
              <h1 className="course-heading">{section.title}</h1>
            </div>

            {/* Main Content Text */}
            <div className="course-body-text">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="course-heading mt-6 mb-4" style={{ marginTop: '1.5rem', marginBottom: '1rem' }} {...props} />,
                  h2: ({node, ...props}) => <h2 className="content-subheading-lg mt-6" style={{ marginTop: '1.5rem' }} {...props} />,
                  h3: ({node, ...props}) => <h3 className="content-subheading mt-4" style={{ marginTop: '1rem' }} {...props} />,
                  h4: ({node, ...props}) => <h4 className="font-bold mt-4" style={{ marginTop: '1rem' }} {...props} />,
                  p: ({node, ...props}) => <p className="course-paragraph my-2" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }} {...props} />,
                  ul: ({node, ...props}) => <ul className="course-paragraph my-2" style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '0.5rem', marginBottom: '0.5rem' }} {...props} />,
                  ol: ({node, ...props}) => <ol className="course-paragraph my-2" style={{ listStyleType: 'decimal', paddingLeft: '2rem', marginTop: '0.5rem', marginBottom: '0.5rem' }} {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" style={{ marginBottom: '0.25rem' }} {...props} />,
                  a: ({node, ...props}) => <a className="content-link" target="_blank" rel="noopener noreferrer" {...props} />,
                  strong: ({node, ...props}) => <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }} {...props} />,
                  em: ({node, ...props}) => <em style={{ fontStyle: 'italic', color: 'var(--text-primary)' }} {...props} />,
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <div className="code-section" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="code-block-container" style={{ position: 'relative' }}>
                          <SyntaxHighlighter
                            language={match[1]}
                            style={vscDarkPlus}
                            customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '0.875rem' }}
                            codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                          <button
                            className="btn-copy"
                            onClick={() => navigator.clipboard.writeText(String(children))}
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <code className="inline-code" {...props}>
                        {children}
                      </code>
                    )
                  },
                  img: ({node, ...props}) => (
                    <div className="course-image-container my-4" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                      <img className="course-image" {...props} />
                    </div>
                  )
                }}
              >
                {section.content}
              </ReactMarkdown>
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
                  <SyntaxHighlighter
                    language={getLanguage(id)}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: 0,
                      background: 'transparent',
                      fontSize: '0.875rem'
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: 'var(--font-mono)'
                      }
                    }}
                  >
                    {section.code}
                  </SyntaxHighlighter>
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
          </div>
      </div>
    </div>
  );
};

export default CoursePage;

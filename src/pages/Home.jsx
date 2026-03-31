import React from 'react';
import { NavLink } from 'react-router-dom';
import { courses } from '../data/courses';
import { BookOpen, Rocket, Terminal, Database, Cloud, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSEO } from '../hooks/useSEO';

const Home = () => {
    useSEO({
        title: null,
        description: 'QuickDevGuide — A curated developer quick-reference guide with concise explanations, code examples, and visual diagrams across 28+ technologies including JavaScript, React, Java, Python, SQL, Docker, AWS, and more.',
        keywords: 'developer guide, programming tutorial, quick reference, JavaScript, React, Java, Python, C#, SQL, Docker, AWS, GCP, HTML, CSS, OOP, SDLC, Spring Boot, .NET, Django, design patterns, data structures, system architecture, GitHub Actions, Azure DevOps'
    });

    return (
        <div className="home-page">
            <header className="hero-section">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="hero-logo"
                >
                    <BookOpen className="hero-icon" />
                    <span>Quick<span className="hero-accent">Dev</span></span>
                </motion.div>
                <div className="hero-content">
                    <h1 className="hero-title">Master Modern Development in Minutes</h1>
                    <p className="hero-subtitle">
                        A curated guide with short explanations, live examples, and everything you need for the "Projection Blue" experience.
                    </p>
                </div>
                <div className="hero-actions">
                    <a className="btn-primary btn-large" href="/sdlc" rel="noopener noreferrer">
                        Get Started <Rocket className="icon" />
                    </a>
                    <a className="btn-secondary btn-large" href="https://github.com/antonyrobin/developer-guide" target="_blank" rel="noopener noreferrer">
                        View GitHub
                    </a>
                </div>
            </header>

            <section className="courses-section">
                <div className="courses-header">
                    <span className="section-label">Our Curriculum</span>
                    <h2 className="section-title">Explore Courses</h2>
                </div>

                <div className="courses-grid">
                    {courses.map((course, idx) => (
                        <NavLink key={course.id} to={`/${course.id}`} className="course-card-link">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.04 }}
                                className="course-card"
                            >
                                <div className="course-bg-icon">
                                    <Rocket className="icon-huge" />
                                </div>
                                <div className="course-card-content">
                                    <div className="course-icon-wrapper">
                                        {course.title.includes('Data') ? <Database className="icon-large" /> :
                                            course.title.includes('AWS') || course.title.includes('GCP') ? <Cloud className="icon-large" /> :
                                                course.title.includes('HTML') || course.title.includes('CSS') ? <Layout className="icon-large" /> :
                                                    <Terminal className="icon-large" />}
                                    </div>
                                    <h3 className="course-title">{course.title}</h3>
                                    <p className="course-desc">{course.description}</p>
                                    <div className="course-link-text">
                                        Learn More &rarr;
                                    </div>
                                </div>
                            </motion.div>
                        </NavLink>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;

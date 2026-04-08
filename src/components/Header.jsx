import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Menu, X } from 'lucide-react';
import { courses, courseGroups } from '../data/courses';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const filteredCourses = searchTerm.trim()
    ? courses.filter(c =>
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') { setIsSearchOpen(false); setSearchTerm(''); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setIsSearchOpen(true); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Close mobile menu on route change / resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (id) => {
    navigate(`/${id}`);
    setIsSearchOpen(false);
    setSearchTerm('');
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="header glass">
        <div className="header-container">
          <NavLink to="/" className="logo">
            <BookOpen className="icon-large text-primary" />
            <span>QuickDev<span className="logo-accent">Guide</span></span>
          </NavLink>

          <nav className="desktop-nav">
            {courseGroups.map(group => (
              <div key={group.label} className="desktop-nav-group">
                <span className="desktop-nav-group-label">{group.label}</span>
                <div className="desktop-nav-dropdown">
                  {group.courses.map(course => (
                    <NavLink
                      key={course.id}
                      to={`/${course.id}`}
                      className={({ isActive }) => `dropdown-link ${isActive ? 'active' : ''}`}
                    >
                      {course.title}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="icon-btn"
              title="Search courses (Ctrl+K)"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="icon" />
            </button>

            <button
              className="icon-btn mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="icon" /> : <Menu className="icon" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-inner">
              {courseGroups.map(group => (
                <div key={group.label} className="mobile-menu-group">
                  <h4 className="mobile-menu-group-label">{group.label}</h4>
                  <div className="mobile-menu-grid">
                    {group.courses.map(course => (
                      <NavLink
                        key={course.id}
                        to={`/${course.id}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="mobile-nav-link"
                      >
                        {course.title}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="search-overlay" onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }}>
          <div className="search-modal" onClick={e => e.stopPropagation()}>
            <div className="search-input-wrapper">
              <Search className="icon text-primary" />
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Search courses... (e.g. React, Docker, SQL)"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button
                className="search-close-btn"
                onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }}
              >
                ESC
              </button>
            </div>

            {searchTerm.trim() && (
              <div className="search-results">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                    <button
                      key={course.id}
                      className="search-result-item"
                      onClick={() => handleSelect(course.id)}
                    >
                      <div className="search-result-title">{course.title}</div>
                      <div className="search-result-desc">{course.description}</div>
                    </button>
                  ))
                ) : (
                  <div className="search-no-results">
                    No courses found for "{searchTerm}"
                  </div>
                )}
              </div>
            )}

            {!searchTerm.trim() && (
              <div className="search-results">
                <div className="search-hint">Type to search across all {courses.length} courses</div>
                <div className="search-popular">
                  <span className="search-popular-label">Popular:</span>
                  {['React', 'Docker', 'JavaScript', 'SQL', 'Python'].map(term => (
                    <button key={term} className="search-tag" onClick={() => setSearchTerm(term)}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Search, Menu, X, ChevronDown, ChevronRight, Code2 } from 'lucide-react';
import { courseGroups } from '../data/courses';
import SearchModal from './SearchModal';
import { OPEN_SEARCH_EVENT } from '../search/searchEvents';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState(null);
  const location = useLocation();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  // Ctrl/Cmd + K opens search
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setIsSearchOpen(true); }
    };
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener('keydown', handleKey);
    window.addEventListener(OPEN_SEARCH_EVENT, handleOpen);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, handleOpen);
    };
  }, []);

  // Close mobile menu when the route changes
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsMenuOpen(false);
  }

  // Close mobile menu on resize to desktop; lock body scroll while it is open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', isMenuOpen || isSearchOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [isMenuOpen, isSearchOpen]);

  const toggleMobileGroup = (label) => {
    setExpandedMobileGroup(prev => prev === label ? null : label);
  };

  // Render a regular nav group (flat courses)
  const renderDesktopGroup = (group) => (
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
  );

  // Render the "Others" nav group with nested children sub-menus
  const renderDesktopNestedGroup = (group) => (
    <div key={group.label} className="desktop-nav-group desktop-nav-group--nested">
      <span className="desktop-nav-group-label">
        {group.label}
        <ChevronDown className="nav-chevron" />
      </span>
      <div className="desktop-nav-dropdown desktop-nav-dropdown--mega">
        {group.children.map(child => (
          <div key={child.label} className="desktop-nav-submenu">
            <span className="desktop-nav-submenu-label">{child.label}</span>
            <div className="desktop-nav-submenu-items">
              {child.courses.map(course => (
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
      </div>
    </div>
  );

  // Render a mobile menu group (flat)
  const renderMobileGroup = (group) => (
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
  );

  // Render the "Others" mobile group with expandable children
  const renderMobileNestedGroup = (group) => (
    <div key={group.label} className="mobile-menu-group">
      <button
        className="mobile-menu-group-label mobile-menu-group-label--expandable"
        onClick={() => toggleMobileGroup(group.label)}
      >
        {group.label}
        <ChevronRight
          className={`mobile-chevron ${expandedMobileGroup === group.label ? 'mobile-chevron--open' : ''}`}
        />
      </button>
      <div className={`mobile-nested-container ${expandedMobileGroup === group.label ? 'mobile-nested-container--open' : ''}`}>
        {group.children.map(child => (
          <div key={child.label} className="mobile-nested-group">
            <h5 className="mobile-nested-label">{child.label}</h5>
            <div className="mobile-menu-grid">
              {child.courses.map(course => (
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
  );

  return (
    <>
      <header className="header glass">
        <div className="header-container">
          <NavLink to="/" className="logo">
            <BookOpen className="icon-large text-primary" />
            <span>QuickDev<span className="logo-accent">Guide</span></span>
          </NavLink>

          <nav className="desktop-nav">
            {courseGroups.map(group =>
              group.children
                ? renderDesktopNestedGroup(group)
                : renderDesktopGroup(group)
            )}
            <NavLink to="/playground" className={({ isActive }) => `playground-nav-link ${isActive ? 'active' : ''}`}>
              <Code2 className="icon-small" />
              <span>Playground</span>
            </NavLink>
          </nav>

          <div className="header-actions">
            <button
              className="search-trigger"
              title="Search (Ctrl+K)"
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="icon" />
              <span className="search-trigger-text">Search…</span>
              <kbd className="search-trigger-kbd">{isMac ? '⌘' : 'Ctrl'} K</kbd>
            </button>

            <button
              className="icon-btn mobile-menu-btn"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="icon" /> : <Menu className="icon" />}
            </button>
          </div>
        </div>

      </header>

      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-inner">
            <NavLink
              to="/playground"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `mobile-playground-link ${isActive ? 'mobile-playground-link--active' : ''}`}
            >
              <Code2 className="icon" />
              <span>Code Playground</span>
            </NavLink>
            {courseGroups.map(group =>
              group.children
                ? renderMobileNestedGroup(group)
                : renderMobileGroup(group)
            )}
          </div>
        </div>
      )}

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default Header;

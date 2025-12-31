import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import resumeData from '../data/resume.json';

function Layout({ children }) {
  const { data } = resumeData;
  const location = useLocation();

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="nav-brand">{data.personal.name}</Link>
          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>About</Link>
            <Link to="/resume" className={location.pathname === '/resume' ? 'active' : ''}>Resume</Link>
            <Link to="/demos" className={location.pathname === '/demos' ? 'active' : ''}>Demos</Link>
          </div>
        </div>
      </nav>

      {children}

      <footer className="footer">
        <p>{data.personal.name} | <a href={`mailto:${data.personal.email}`}>{data.personal.email}</a></p>
      </footer>
    </div>
  );
}

export default Layout;

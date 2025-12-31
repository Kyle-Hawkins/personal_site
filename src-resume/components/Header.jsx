import React from 'react';

function Header({ personal }) {
  return (
    <header className="header">
      <div className="header-content">
        <img
          src="/images/me.jpg"
          alt={personal.name}
          className="profile-image"
        />
        <div className="header-text">
          <h1>{personal.name}</h1>
          <p className="tagline">{personal.taglines?.default}</p>
          <div className="contact-links">
            <a href={`mailto:${personal.email}`}>{personal.email}</a>
            <span>|</span>
            <a href={`https://github.com/${personal.github}`} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <span>|</span>
            <a href={`https://linkedin.com/in/${personal.linkedin}`} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            {personal.orcid && (
              <>
                <span>|</span>
                <a href={`https://orcid.org/${personal.orcid}`} target="_blank" rel="noopener noreferrer">
                  ORCID
                </a>
              </>
            )}
          </div>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>{personal.location}</p>
        </div>
      </div>
    </header>
  );
}

export default Header;

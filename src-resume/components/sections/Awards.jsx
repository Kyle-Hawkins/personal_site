import React from 'react';
import HighlightText from '../HighlightText';

function Awards({ data, searchQuery }) {
  const grants = data?.grants || [];
  const honors = data?.honors || [];

  if (grants.length === 0 && honors.length === 0) return null;

  return (
    <section className="section">
      <h2 className="section-title">Awards & Honors</h2>

      {grants.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Grants & Fellowships</h3>
          {grants.map((grant, idx) => (
            <div key={idx} className="award-item">
              <div className="award-name">
                <HighlightText text={grant.name} highlight={searchQuery} />
              </div>
              <div className="award-dates">
                {grant.dates || grant.year}
                {grant.institution && ` | ${grant.institution}`}
              </div>
              {grant.description && (
                <div className="award-description">
                  <HighlightText text={grant.description} highlight={searchQuery} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {honors.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Academic Honors</h3>
          {honors.map((honor, idx) => (
            <div key={idx} className="award-item">
              <div className="award-name">
                <HighlightText text={honor.name} highlight={searchQuery} />
              </div>
              <div className="award-dates">{honor.year}</div>
              {honor.description && (
                <div className="award-description">
                  <HighlightText text={honor.description} highlight={searchQuery} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Awards;

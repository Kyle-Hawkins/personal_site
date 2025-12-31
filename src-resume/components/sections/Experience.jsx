import React from 'react';
import HighlightText from '../HighlightText';

function Experience({ data, searchQuery }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="section">
      <h2 className="section-title">Research Experience</h2>
      {data.map((exp, idx) => (
        <div key={idx} className="experience-item">
          <div className="exp-header">
            <span className="exp-title">{exp.title}</span>
            <span className="exp-dates">{exp.dates}</span>
          </div>
          <div className="exp-institution">{exp.institution}, {exp.location}</div>

          {exp.projects?.map((proj, pIdx) => (
            <div key={pIdx} className="exp-project">
              <div className="project-name">
                <HighlightText text={proj.name} highlight={searchQuery} />
                <span className="project-dates"> ({proj.dates})</span>
              </div>
              {proj.description && (
                <p className="project-description">
                  <HighlightText text={proj.description} highlight={searchQuery} />
                </p>
              )}
              {proj.tags && proj.tags.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  {proj.tags.map(tag => (
                    <span key={tag} className={`tag tag-${tag}`}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

export default Experience;

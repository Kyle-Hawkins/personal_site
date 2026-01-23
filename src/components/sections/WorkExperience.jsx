import React from 'react';
import HighlightText from '../HighlightText';

function WorkExperience({ data, searchQuery }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="section">
      <h2 className="section-title">Work Experience</h2>
      {data.map((exp, idx) => (
        <div key={idx} className="experience-item">
          <div className="exp-header">
            <span className="exp-title">{exp.title}</span>
            <span className="exp-dates">{exp.dates}</span>
          </div>
          <div className="exp-institution">{exp.organization}, {exp.location}</div>

          {exp.bullets && exp.bullets.length > 0 && (
            <ul className="exp-bullets">
              {exp.bullets.map((bullet, bIdx) => (
                <li key={bIdx}>
                  <HighlightText text={bullet} highlight={searchQuery} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

export default WorkExperience;

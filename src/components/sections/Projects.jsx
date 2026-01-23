import React from 'react';
import HighlightText from '../HighlightText';

function Projects({ data, searchQuery }) {
  if (!data || data.length === 0) return null;

  // Filter to only show visible projects
  const visibleProjects = data.filter(project => project.visible !== false);

  if (visibleProjects.length === 0) return null;

  return (
    <section className="section">
      <h2 className="section-title">Projects</h2>
      {visibleProjects.map((project, idx) => (
        <div key={idx} className="project-card">
          <div className="project-header">
            <span className="project-title">
              {project.url ? (
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <HighlightText text={project.name} highlight={searchQuery} />
                </a>
              ) : (
                <HighlightText text={project.name} highlight={searchQuery} />
              )}
            </span>
            <span className="project-type">{project.type} | {project.dates}</span>
          </div>

          {project.description && (
            <p>
              <HighlightText text={project.description} highlight={searchQuery} />
            </p>
          )}

          {project.bullets && project.bullets.length > 0 && (
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
              {project.bullets.map((bullet, bIdx) => (
                <li key={bIdx} style={{ fontSize: '0.9rem' }}>
                  <HighlightText text={bullet} highlight={searchQuery} />
                </li>
              ))}
            </ul>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="project-tech">
              {project.technologies.map((tech, tIdx) => (
                <span key={tIdx} className="tech-tag">
                  <HighlightText text={tech} highlight={searchQuery} />
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

export default Projects;

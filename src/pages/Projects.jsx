import React from 'react';
import { Link } from 'react-router-dom';
import projectsData from '../data/projects.json';

function Projects() {
  const { projects } = projectsData;

  // Filter to only show visible projects
  const visibleProjects = projects.filter(project => project.visible !== false);

  return (
    <main className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
        <p>Personal projects and experiments in scientific computing, visualization, and software development.</p>
      </div>

      <div className="projects-grid">
        {visibleProjects.map(project => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="project-card-link"
          >
            <article className="project-card">
              {project.thumbnail && (
                <div className="project-thumbnail">
                  <img src={project.thumbnail} alt={project.title} />
                </div>
              )}
              <div className="project-card-content">
                <h2>{project.title}</h2>
                <div className="project-dates">
                  {project.created && <span className="project-card-date">Created: {project.created}</span>}
                  {project.updated && project.updated !== project.created && (
                    <span className="project-card-date"> • Updated: {project.updated}</span>
                  )}
                </div>
                <p>{project.summary}</p>
                {project.keywords && project.keywords.length > 0 && (
                  <div className="project-tech-tags">
                    {project.keywords.map(keyword => (
                      <span key={keyword} className="tech-tag">{keyword}</span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {visibleProjects.length === 0 && (
        <div className="no-projects">
          <p>No projects yet. Check back soon!</p>
        </div>
      )}
    </main>
  );
}

export default Projects;

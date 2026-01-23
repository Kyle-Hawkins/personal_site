import React from 'react';
import { useParams, Link } from 'react-router-dom';
import projectsData from '../data/projects.json';
import { MarkdownCell, CodeCell, YoutubeCell, ImageCell, MermaidCell } from '../components/cells';

function ProjectDetail() {
  const { projectId } = useParams();
  const { projects } = projectsData;
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <main className="project-detail-page">
        <div className="project-not-found">
          <h1>Project Not Found</h1>
          <p>The project you're looking for doesn't exist.</p>
          <Link to="/projects" className="back-link">Back to Projects</Link>
        </div>
      </main>
    );
  }

  const renderCell = (cell, index) => {
    switch (cell.type) {
      case 'markdown':
        return <MarkdownCell key={index} content={cell.content} />;
      case 'code':
        return <CodeCell key={index} content={cell.content} language={cell.language} />;
      case 'youtube':
        return <YoutubeCell key={index} videoId={cell.videoId} title={cell.title} />;
      case 'image':
        return <ImageCell key={index} src={cell.src} caption={cell.caption} alt={cell.alt} />;
      case 'mermaid':
        return <MermaidCell key={index} content={cell.content} config={cell.config} />;
      default:
        return null;
    }
  };

  return (
    <main className="project-detail-page">
      <div className="project-detail-header">
        <Link to="/projects" className="back-link">Back to Projects</Link>
        <h1>{project.title}</h1>
        <div className="project-metadata">
          {project.created && <p className="project-date">Created: {project.created}</p>}
          {project.updated && <p className="project-date">Last updated: {project.updated}</p>}
        </div>
        {project.keywords && project.keywords.length > 0 && (
          <div className="project-tech-tags">
            {project.keywords.map(keyword => (
              <span key={keyword} className="tech-tag">{keyword}</span>
            ))}
          </div>
        )}
      </div>

      <div className="project-cells">
        {project.cells && project.cells.map((cell, index) => renderCell(cell, index))}
      </div>
    </main>
  );
}

export default ProjectDetail;

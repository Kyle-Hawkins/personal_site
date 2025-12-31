import React from 'react';
import { Link } from 'react-router-dom';
import resumeData from '../data/resume.json';

function About() {
  const { data } = resumeData;
  const { personal } = data;

  return (
    <main className="about-page">
      <div className="about-hero">
        <img
          src="/images/me.jpg"
          alt={personal.name}
          className="about-image"
        />
        <div className="about-intro">
          <h1>Hi, I'm {personal.name.split(' ')[0]}!</h1>
          <p className="about-tagline">{personal.taglines?.default}</p>
        </div>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>About Me</h2>
          <p>
            I'm a computational physicist with a Ph.D. from Vanderbilt University,
            specializing in mathematical optimization and scientific software development.
            My research focuses on developing computational frameworks for biological systems,
            including explicit pH modeling and metabolic simulations.
          </p>
          <p>
            I enjoy building tools that bridge the gap between complex mathematical models
            and practical applications, working across Julia, Python, and MATLAB to create
            robust scientific computing solutions.
          </p>
        </section>

        <section className="about-section">
          <h2>What I Do</h2>
          <div className="about-cards">
            <div className="about-card">
              <h3>Scientific Computing</h3>
              <p>Building mathematical optimization frameworks and simulation pipelines for complex systems.</p>
            </div>
            <div className="about-card">
              <h3>Software Development</h3>
              <p>Creating robust, maintainable code in Julia, Python, and other languages for research applications.</p>
            </div>
            <div className="about-card">
              <h3>Data Science</h3>
              <p>Applying statistical analysis and machine learning to extract insights from experimental data.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Get In Touch</h2>
          <div className="about-links">
            <a href={`mailto:${personal.email}`} className="about-link">
              Email
            </a>
            <a href={`https://github.com/${personal.github}`} target="_blank" rel="noopener noreferrer" className="about-link">
              GitHub
            </a>
            <a href={`https://linkedin.com/in/${personal.linkedin}`} target="_blank" rel="noopener noreferrer" className="about-link">
              LinkedIn
            </a>
            {personal.orcid && (
              <a href={`https://orcid.org/${personal.orcid}`} target="_blank" rel="noopener noreferrer" className="about-link">
                ORCID
              </a>
            )}
          </div>
          <p className="about-location">{personal.location}</p>
        </section>

        <div className="about-cta">
          <Link to="/resume" className="btn-primary">View My Resume</Link>
        </div>
      </div>
    </main>
  );
}

export default About;

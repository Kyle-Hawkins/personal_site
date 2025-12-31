import React, { useState } from 'react';

function Demos() {
  const [activeDemo, setActiveDemo] = useState('surface-plot');

  const demos = [
    {
      id: 'surface-plot',
      title: '3D Surface Plot',
      description: 'Interactive 3D surface visualization built with Julia and PlotlyJS. Rotate, zoom, and pan to explore the mathematical surface.',
      tech: ['Julia', 'PlotlyJS', 'WebGL'],
      file: '/demos/surface-plot.html'
    }
  ];

  const currentDemo = demos.find(d => d.id === activeDemo);

  const openFullScreen = () => {
    if (currentDemo) {
      window.open(currentDemo.file, '_blank');
    }
  };

  return (
    <main className="demos-page">
      <div className="demos-header">
        <h1>Demos</h1>
        <p>Interactive visualizations and projects showcasing scientific computing capabilities.</p>
      </div>

      <div className="demos-container">
        <aside className="demos-sidebar">
          <h3>Projects</h3>
          <ul className="demo-list">
            {demos.map(demo => (
              <li key={demo.id}>
                <button
                  className={`demo-item ${activeDemo === demo.id ? 'active' : ''}`}
                  onClick={() => setActiveDemo(demo.id)}
                >
                  {demo.title}
                </button>
              </li>
            ))}
          </ul>
          <p className="demos-note">More demos coming soon...</p>
        </aside>

        <div className="demo-content">
          {currentDemo && (
            <>
              <div className="demo-info">
                <h2>{currentDemo.title}</h2>
                <p>{currentDemo.description}</p>
                <div className="demo-tech">
                  {currentDemo.tech.map(t => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
                <button className="fullscreen-btn" onClick={openFullScreen}>
                  Open Full Screen
                </button>
              </div>

              <div className="demo-viewer">
                <iframe
                  src={currentDemo.file}
                  title={currentDemo.title}
                  className="demo-iframe"
                  allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              </div>

              <div className="demo-instructions">
                <h4>Controls</h4>
                <ul>
                  <li><strong>Rotate:</strong> Left-click and drag</li>
                  <li><strong>Zoom:</strong> Scroll wheel or pinch</li>
                  <li><strong>Pan:</strong> Shift + left-click drag</li>
                  <li><strong>Reset:</strong> Double-click or home button</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Demos;

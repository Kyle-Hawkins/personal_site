import React, { useEffect, useRef, useId } from 'react';
import mermaid from 'mermaid';

// Default config - only called once
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
});

const defaultConfig = {
  padding: 20,
  nodeSpacing: 50,
  rankSpacing: 60,
  nodeFontSize: 16,
  edgeFontSize: 14,
};

function MermaidCell({ content, config = {} }) {
  const containerRef = useRef(null);
  const id = useId().replace(/:/g, '-');

  // Merge defaults with provided config
  const {
    padding,
    nodeSpacing,
    rankSpacing,
    nodeFontSize,
    edgeFontSize,
  } = { ...defaultConfig, ...config };

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !content) return;

      // Clear previous content
      containerRef.current.innerHTML = '';

      // Prepend init directive to content for per-diagram config
      const initDirective = `%%{init: {'flowchart': {'padding': ${padding}, 'nodeSpacing': ${nodeSpacing}, 'rankSpacing': ${rankSpacing}, 'useMaxWidth': true}}}%%\n`;
      const fullContent = initDirective + content.trim();

      // Create a div with the mermaid content
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = fullContent;
      containerRef.current.appendChild(div);

      // Tell mermaid to render it
      try {
        await mermaid.run({
          nodes: [div],
        });
      } catch (err) {
        console.error('Mermaid render error:', err);
        div.innerHTML = `<pre style="color: red;">Error: ${err.message}</pre>`;
      }
    };

    renderDiagram();
  }, [content, id, padding, nodeSpacing, rankSpacing]);

  // CSS variables for font sizes
  const style = {
    '--mermaid-node-font-size': `${nodeFontSize}px`,
    '--mermaid-edge-font-size': `${edgeFontSize}px`,
  };

  return (
    <div className="cell cell-mermaid" style={style}>
      <div ref={containerRef} className="mermaid-container" />
    </div>
  );
}

export default MermaidCell;

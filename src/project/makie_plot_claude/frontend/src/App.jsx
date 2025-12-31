import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [plotUrl, setPlotUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plotType, setPlotType] = useState('surface');
  const [plots, setPlots] = useState([]);
  const [backendStatus, setBackendStatus] = useState(null);

  // Check backend status on mount
  useEffect(() => {
    checkBackendStatus();
    loadPlotsList();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();
      setBackendStatus(data);
    } catch (err) {
      console.error('Backend not available:', err);
      setBackendStatus({ status: 'offline' });
    }
  };

  const loadPlotsList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/plots`);
      const data = await response.json();
      setPlots(data.plots);
    } catch (err) {
      console.error('Failed to load plots list:', err);
    }
  };

  const generatePlot = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-plot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plot_type: plotType }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plot');
      }

      const data = await response.json();
      setPlotUrl(`${API_BASE_URL}${data.url}`);

      // Reload the plots list
      await loadPlotsList();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPlot = (filename) => {
    setPlotUrl(`${API_BASE_URL}/plots/${filename}`);
  };

  const deletePlot = async (filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/plots/${filename}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Reload plots list and clear current plot if it was deleted
        await loadPlotsList();
        if (plotUrl && plotUrl.includes(filename)) {
          setPlotUrl(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete plot:', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WGLMakie Interactive Plot Generator</h1>
        <p>Julia + FastAPI + React Pipeline Demo</p>
      </header>

      <main className="container">
        {/* Backend Status */}
        <div className="status-bar">
          <span className={`status-indicator ${backendStatus?.status === 'running' ? 'online' : 'offline'}`}>
            Backend: {backendStatus?.status || 'checking...'}
          </span>
          {backendStatus?.julia_initialized !== undefined && (
            <span className={`status-indicator ${backendStatus.julia_initialized ? 'online' : 'offline'}`}>
              Julia: {backendStatus.julia_initialized ? 'initialized' : 'not initialized'}
            </span>
          )}
        </div>

        {/* Plot Controls */}
        <div className="controls">
          <h2>Generate New Plot</h2>
          <div className="control-group">
            <label htmlFor="plot-type">Plot Type:</label>
            <select
              id="plot-type"
              value={plotType}
              onChange={(e) => setPlotType(e.target.value)}
              disabled={loading}
            >
              <option value="surface">3D Surface Plot</option>
              <option value="line">2D Line Plot</option>
            </select>
          </div>

          <button
            onClick={generatePlot}
            disabled={loading || backendStatus?.status !== 'running'}
            className="btn-primary"
          >
            {loading ? 'Generating...' : 'Generate Plot'}
          </button>

          {error && <div className="error">{error}</div>}
        </div>

        {/* Plot Display */}
        {plotUrl && (
          <div className="plot-container">
            <h2>Generated Plot (Interactive)</h2>
            <iframe
              src={plotUrl}
              title="Generated plot"
              className="plot-iframe"
              style={{
                width: '100%',
                height: '700px',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            />
          </div>
        )}

        {/* Plots History */}
        {plots.length > 0 && (
          <div className="plots-list">
            <h2>Plot History ({plots.length})</h2>
            <div className="plots-grid">
              {plots.map((filename) => (
                <div key={filename} className="plot-item">
                  <div
                    className="plot-thumbnail"
                    onClick={() => loadPlot(filename)}
                    style={{ cursor: 'pointer' }}
                  >
                    <iframe
                      src={`${API_BASE_URL}/plots/${filename}`}
                      title={filename}
                      style={{
                        width: '100%',
                        height: '200px',
                        border: 'none',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                  <div className="plot-item-footer">
                    <span className="plot-filename">{filename}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlot(filename);
                      }}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

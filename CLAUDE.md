# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Personal site repository with multi-project structure. The main active project is `makie_plot_claude` - a full-stack pipeline demonstrating Julia-Python-React integration for scientific visualization.

## Architecture

```
Julia (WGLMakie) → Python (FastAPI) → React (Vite)
     ↓                  ↓                  ↓
 Plot Engine       REST API            Web UI
```

**Key design decision:** Julia runs as a subprocess (not embedded via juliacall) to avoid OpenSSL library conflicts between conda and Julia.

**Data flow:**
1. React frontend sends plot request to FastAPI (port 8000)
2. FastAPI spawns Julia subprocess to generate plot
3. Julia/WGLMakie creates standalone interactive HTML file
4. HTML served back through FastAPI, displayed in iframe

## Build & Run Commands

### Quick Start (main project)
```bash
cd src/project/makie_plot_claude
./start_all.sh          # Start both backend and frontend
./backend/stop_server.sh # Stop all servers
```

### Backend
```bash
cd src/project/makie_plot_claude/backend
conda env create -f environment.yml
conda activate glmakie-demo
julia --project=julia-env -e 'using Pkg; Pkg.instantiate()'
./start_server.sh       # Or: cd app && python main.py
```

### Frontend
```bash
cd src/project/makie_plot_claude/frontend
npm install
./start_frontend.sh     # Or: npm run dev
npm run build           # Production build
```

### Testing
```bash
# Health check
curl http://localhost:8000

# Generate plot
curl -X POST http://localhost:8000/generate-plot \
  -H "Content-Type: application/json" \
  -d '{"plot_type":"surface"}'

# List plots
curl http://localhost:8000/plots
```

## Project Structure

```
src/project/
├── makie_plot_claude/           # ACTIVE - Interactive WGLMakie plots
│   ├── backend/
│   │   ├── app/main.py          # FastAPI server
│   │   ├── julia-env/           # Julia Project.toml/Manifest.toml
│   │   ├── julia-src/generate_plot.jl  # Julia plotting functions
│   │   └── outputs/             # Generated HTML plots
│   └── frontend/
│       ├── src/App.jsx          # Main React component
│       └── vite.config.js
├── project_makie_plot/          # Earlier version (similar structure)
├── project_ferment/             # Planned fermentation simulation
└── project_file_system/         # Julia file system module experiment
```

## Adding New Plot Types

1. Add Julia function in `backend/julia-src/generate_plot.jl`
2. Add handler in `backend/app/main.py` (elif branch in generate_plot endpoint)
3. Add option to React dropdown in `frontend/src/App.jsx`

## Tech Stack

- **Backend:** Python 3.12, FastAPI, Julia 1.10, WGLMakie, Bonito
- **Frontend:** React 18, Vite 5
- **Package Management:** Conda (backend), npm (frontend)
- **Ports:** Backend 8000, Frontend 3000

## Important Notes

- First WGLMakie load takes 3-5 minutes (precompilation)
- HTML plot files are 500KB-2MB (self-contained with embedded JS)
- Julia subprocess pattern in `main.py:36-63` handles plot generation
- VS Code Julia env configured in `.vscode/settings.json`

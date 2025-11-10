# Quick Setup Guide

Follow these steps to get the GLMakie plot generator running:

## Prerequisites

- Conda (Miniconda or Anaconda)
- Node.js (v18 or higher) and npm
- Git

## Quick Start (Recommended)

After completing the initial setup below, you can use these convenience scripts:

```bash
# From the project root directory
cd src/project/makie_plot_claude

# Start both servers in the background
./start_all.sh

# Stop both servers
./backend/stop_server.sh
```

The `start_all.sh` script will start both backend and frontend servers in the background and show you their status.

## Step-by-Step Setup

### 1. Backend Setup (Terminal 1)

```bash
# Navigate to backend directory
cd src/project/makie_plot_claude/backend

# Create conda environment
conda env create -f environment.yml

# Activate environment
conda activate glmakie-demo

# Install Julia packages
julia --project=julia-env -e 'using Pkg; Pkg.instantiate()'

# Precompile GLMakie (takes 2-3 minutes on first run)
julia --project=julia-env -e 'using GLMakie; println("GLMakie ready!")'

# Start the server (Option 1: using startup script)
./start_server.sh

# OR start manually (Option 2)
# cd app
# python main.py
```

**Note:** The first time you load GLMakie, it needs to precompile which takes 2-3 minutes. Subsequent runs will be much faster.

Keep this terminal running. The backend should now be available at http://localhost:8000

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend directory
cd src/project/makie_plot_claude/frontend

# Install npm packages
npm install

# Start the development server (Option 1: using startup script)
./start_frontend.sh

# OR start manually (Option 2)
# npm run dev
```

Keep this terminal running. The frontend should now be available at http://localhost:3000

### 3. Test the Pipeline

1. Open http://localhost:3000 in your browser
2. You should see:
   - Backend status: **online** (green)
   - Julia status: **initialized** (green)
3. Select a plot type (Surface or Line)
4. Click "Generate Plot"
5. Wait a few seconds for the plot to generate
6. The plot should appear on the page

## Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:8000
```

Expected response:
```json
{"status":"running","service":"GLMakie Plot Generator","julia_initialized":true}
```

### Test Plot Generation
```bash
curl -X POST http://localhost:8000/generate-plot \
  -H "Content-Type: application/json" \
  -d '{"plot_type":"line"}'
```

### List Generated Plots
```bash
curl http://localhost:8000/plots
```

## Common Issues

**Problem:** Backend says Julia not initialized or OpenSSL version conflict
```bash
# Solution 1: GLMakie takes 2-3 minutes to precompile on first run
# Just wait patiently for it to finish

# Solution 2: Manually precompile GLMakie before starting the backend
cd backend
julia --project=julia-env -e 'using GLMakie; println("GLMakie loaded successfully")'

# This can take several minutes on first run but subsequent runs will be fast
```

**Problem:** OpenSSL library version conflicts
```bash
# This has been fixed - the backend now uses subprocess to call Julia
# Julia runs independently with its own libraries, avoiding conflicts with conda's OpenSSL
```

**Problem:** Port 8000 already in use
```bash
# Solution: Change port in backend/app/main.py (line at bottom)
# Change: uvicorn.run(app, host="0.0.0.0", port=8000)
# To: uvicorn.run(app, host="0.0.0.0", port=8001)
# Also update API_BASE_URL in frontend/src/App.jsx
```

**Problem:** Frontend can't connect to backend
- Check backend is running at http://localhost:8000
- Check CORS is enabled in main.py
- Check browser console for error messages

## Stopping the Servers

**Option 1: Use the stop script (recommended)**
```bash
cd src/project/makie_plot_claude/backend
./stop_server.sh
```

**Option 2: Manual stop**

**Backend (Terminal 1):**
- Press `Ctrl+C`
- Deactivate conda: `conda deactivate`

**Frontend (Terminal 2):**
- Press `Ctrl+C`

## Next Steps

Once everything is working:
1. Explore the code in `backend/julia-src/generate_plot.jl`
2. Modify the plot functions to create your own visualizations
3. Add new plot types following the README instructions
4. Customize the frontend styling in `frontend/src/App.css`

Happy plotting!

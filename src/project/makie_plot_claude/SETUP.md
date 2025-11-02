# Quick Setup Guide

Follow these steps to get the GLMakie plot generator running:

## Prerequisites

- Conda (Miniconda or Anaconda)
- Node.js (v18 or higher) and npm
- Git

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

# Start the server
cd app
python main.py
```

Keep this terminal running. The backend should now be available at http://localhost:8000

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend directory
cd src/project/makie_plot_claude/frontend

# Install npm packages
npm install

# Start the development server
npm run dev
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

**Problem:** Backend says Julia not initialized
```bash
# Solution: Manually test Julia
julia --project=julia-env -e 'using GLMakie; println("GLMakie loaded!")'
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

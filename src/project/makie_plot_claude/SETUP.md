# Quick Setup Guide

Follow these steps to get the WGLMakie interactive plot generator running:

## Prerequisites

- Conda (Miniconda or Anaconda)
- Julia (v1.10 or higher)
- Node.js (v18 or higher) and npm
- Git
- Modern web browser with WebGL support (Chrome, Firefox, Safari, or Edge)

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

# Install Julia packages (WGLMakie and Bonito)
julia --project=julia-env -e 'using Pkg; Pkg.instantiate()'

# Precompile WGLMakie (takes 3-5 minutes on first run)
julia --project=julia-env -e 'using WGLMakie, Bonito; println("WGLMakie ready!")'

# Start the server (Option 1: using startup script)
./start_server.sh

# OR start manually (Option 2)
# cd app
# python main.py
```

**Note:** The first time you load WGLMakie, it needs to precompile which takes 3-5 minutes. Subsequent runs will be much faster.

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
6. An interactive plot should appear in the viewer
   - **3D Surface:** Click and drag to rotate, scroll to zoom
   - **2D Line:** Click and drag to pan, scroll to zoom

## Quick Test Commands

### Test Backend Health
```bash
curl http://localhost:8000
```

Expected response:
```json
{"status":"running","service":"WGLMakie Plot Generator","julia_initialized":true}
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

## Interactive Features

The application generates **interactive HTML plots** using WGLMakie and WebGL:

### 3D Surface Plots
- **Rotate:** Left-click and drag to rotate the plot in 3D space
- **Zoom:** Scroll wheel to zoom in/out
- **Pan:** Right-click and drag to pan the view
- **Reset:** Double-click to reset the view to default

### 2D Line Plots
- **Pan:** Left-click and drag to pan the plot
- **Zoom:** Scroll wheel to zoom in/out
- **Reset:** Double-click to reset the view to default

### Technical Details
- Plots are exported as standalone HTML files (~500KB-2MB each)
- All JavaScript dependencies are embedded (Three.js, WebGL helpers)
- No Julia server needed after generation
- Works offline once generated
- Requires modern browser with WebGL 2.0 support

## Common Issues

**Problem:** Backend says Julia not initialized
```bash
# Solution 1: WGLMakie takes 3-5 minutes to precompile on first run
# Just wait patiently for it to finish

# Solution 2: Manually precompile WGLMakie before starting the backend
cd backend
julia --project=julia-env -e 'using WGLMakie, Bonito; println("WGLMakie loaded successfully")'

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

**Problem:** Interactive plots not working or blank display
```bash
# Solution: This requires WebGL support in your browser
# Check if your browser supports WebGL: https://get.webgl.org/

# If WebGL is supported but plots still don't work:
# 1. Try a different browser (Chrome/Firefox recommended)
# 2. Update your graphics drivers
# 3. Disable browser extensions that might block WebGL
# 4. Check browser console for JavaScript errors
```

**Problem:** Plot files are large (1-2MB)
```bash
# This is expected - WGLMakie HTML files include all JavaScript dependencies
# The files are self-contained and fully interactive
# They include Three.js and WebGL rendering code (~500KB-2MB)
```

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
2. Modify the plot functions to create your own interactive visualizations
3. Add new plot types following the README instructions
4. Customize the frontend styling in `frontend/src/App.css`
5. Experiment with WGLMakie's interactive features and plot customizations

## What's New in v1.2

This version uses **WGLMakie** instead of GLMakie for true web-based interactivity:

- ✅ **Interactive HTML plots** - Rotate, zoom, and pan directly in the browser
- ✅ **WebGL rendering** - Hardware-accelerated 3D graphics
- ✅ **Standalone exports** - HTML files work without a running Julia server
- ✅ **Offline support** - All dependencies embedded in the HTML file
- ✅ **Modern web deployment** - Easy to share and embed

**Previous version (v1.1):** Generated static PNG images
**Current version (v1.2):** Generates interactive HTML visualizations

For detailed migration information, see `.claude/FIXES_AND_CHANGES.md`.

Happy plotting!

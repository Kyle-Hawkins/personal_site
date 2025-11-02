from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
from pathlib import Path
from datetime import datetime

app = FastAPI(title="GLMakie Plot Generator")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BACKEND_DIR = Path(__file__).parent.parent
JULIA_SRC_DIR = BACKEND_DIR / "julia-src"
OUTPUTS_DIR = BACKEND_DIR / "outputs"
OUTPUTS_DIR.mkdir(exist_ok=True)


class PlotRequest(BaseModel):
    plot_type: str = "surface"  # "surface" or "line"


# Initialize Julia once at startup
_julia_initialized = False
_jl = None


def initialize_julia():
    """Initialize Julia runtime and load the plotting module."""
    global _julia_initialized, _jl

    if _julia_initialized:
        return _jl

    try:
        from juliacall import Main as jl

        # Add the julia-src directory to Julia's load path
        jl.seval(f'push!(LOAD_PATH, "{JULIA_SRC_DIR}")')

        # Load GLMakie and our plotting functions
        plot_script = JULIA_SRC_DIR / "generate_plot.jl"
        jl.seval(f'include("{plot_script}")')

        _julia_initialized = True
        _jl = jl
        print("Julia initialized successfully!")
        return jl

    except Exception as e:
        print(f"Failed to initialize Julia: {e}")
        raise


@app.on_event("startup")
async def startup_event():
    """Initialize Julia when the app starts."""
    try:
        initialize_julia()
    except Exception as e:
        print(f"Warning: Julia initialization failed: {e}")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "running",
        "service": "GLMakie Plot Generator",
        "julia_initialized": _julia_initialized
    }


@app.post("/generate-plot")
async def generate_plot(request: PlotRequest):
    """
    Generate a plot using Julia GLMakie.

    Args:
        request: PlotRequest containing the plot type

    Returns:
        JSON with the path to the generated plot
    """
    try:
        # Ensure Julia is initialized
        jl = initialize_julia()

        # Generate unique filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"plot_{request.plot_type}_{timestamp}.png"
        output_path = OUTPUTS_DIR / filename

        # Call the appropriate Julia function
        if request.plot_type == "surface":
            jl.generate_surface_plot(str(output_path))
        elif request.plot_type == "line":
            jl.generate_line_plot(str(output_path))
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid plot type: {request.plot_type}. Use 'surface' or 'line'."
            )

        return {
            "success": True,
            "filename": filename,
            "url": f"/plots/{filename}",
            "plot_type": request.plot_type
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Plot generation failed: {str(e)}")


@app.get("/plots/{filename}")
async def get_plot(filename: str):
    """
    Retrieve a generated plot image.

    Args:
        filename: Name of the plot file

    Returns:
        The PNG image file
    """
    file_path = OUTPUTS_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Plot not found")

    return FileResponse(
        file_path,
        media_type="image/png",
        headers={"Content-Disposition": f"inline; filename={filename}"}
    )


@app.get("/plots")
async def list_plots():
    """
    List all available plots.

    Returns:
        List of plot filenames
    """
    plots = [f.name for f in OUTPUTS_DIR.glob("*.png")]
    plots.sort(reverse=True)  # Most recent first

    return {
        "plots": plots,
        "count": len(plots)
    }


@app.delete("/plots/{filename}")
async def delete_plot(filename: str):
    """
    Delete a specific plot.

    Args:
        filename: Name of the plot file to delete

    Returns:
        Success status
    """
    file_path = OUTPUTS_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Plot not found")

    try:
        os.remove(file_path)
        return {"success": True, "message": f"Plot {filename} deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete plot: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

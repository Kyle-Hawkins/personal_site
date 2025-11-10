from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import subprocess
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


# Julia initialization (using subprocess approach to avoid OpenSSL conflicts)
_julia_initialized = False


def check_julia():
    """Check if Julia can run and load GLMakie."""
    global _julia_initialized

    if _julia_initialized:
        return True

    try:
        # Test if Julia can load GLMakie
        result = subprocess.run(
            ["julia", f"--project={BACKEND_DIR / 'julia-env'}",
             "-e", "using GLMakie; println(\"OK\")"],
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode == 0 and "OK" in result.stdout:
            _julia_initialized = True
            print("Julia initialized successfully!")
            return True
        else:
            print(f"Julia check failed: {result.stderr}")
            return False

    except Exception as e:
        print(f"Failed to check Julia: {e}")
        return False


@app.on_event("startup")
async def startup_event():
    """Check Julia availability when the app starts."""
    try:
        check_julia()
    except Exception as e:
        print(f"Warning: Julia check failed: {e}")


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
        # Ensure Julia is available
        if not check_julia():
            raise HTTPException(
                status_code=503,
                detail="Julia is not available"
            )

        # Generate unique filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"plot_{request.plot_type}_{timestamp}.png"
        output_path = OUTPUTS_DIR / filename

        # Prepare Julia command based on plot type
        if request.plot_type == "surface":
            function_call = f'generate_surface_plot("{output_path}")'
        elif request.plot_type == "line":
            function_call = f'generate_line_plot("{output_path}")'
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid plot type: {request.plot_type}. Use 'surface' or 'line'."
            )

        # Call Julia as subprocess
        julia_code = f'include("{JULIA_SRC_DIR / "generate_plot.jl"}"); {function_call}'
        result = subprocess.run(
            ["julia", f"--project={BACKEND_DIR / 'julia-env'}", "-e", julia_code],
            capture_output=True,
            text=True,
            timeout=60
        )

        if result.returncode != 0:
            raise HTTPException(
                status_code=500,
                detail=f"Julia execution failed: {result.stderr}"
            )

        # Verify the file was created
        if not output_path.exists():
            raise HTTPException(
                status_code=500,
                detail="Plot file was not created"
            )

        return {
            "success": True,
            "filename": filename,
            "url": f"/plots/{filename}",
            "plot_type": request.plot_type
        }

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Plot generation timed out")
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

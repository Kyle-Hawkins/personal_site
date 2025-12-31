#!/usr/bin/env julia

# Generate interactive demo plots for static site using PlotlyJS
# PlotlyJS produces truly interactive standalone HTML (rotate, zoom, pan work without a server)
# Run: julia --project=src/project/makie_plot_claude/backend/julia-env scripts/generate-demo-plots.jl

using PlotlyJS

# Output directory
output_dir = joinpath(@__DIR__, "..", "public", "demos")
mkpath(output_dir)

println("Generating demo plots...")

# 3D Surface Plot
function generate_surface_plot()
    println("  Creating 3D surface plot...")

    # Create data for a parametric surface
    xs = range(-3, 3, length=100)
    ys = range(-3, 3, length=100)

    # Create a function for an interesting surface (sinc function variation)
    zs = [sinc(sqrt(x^2 + y^2)) * cos(x) * sin(y) for x in xs, y in ys]

    # Create the surface trace
    trace = surface(
        x=collect(xs),
        y=collect(ys),
        z=zs,
        colorscale="Viridis",
        colorbar=attr(title="Height", titleside="right")
    )

    # Create layout with 3D scene configuration
    layout = Layout(
        title=attr(
            text="Interactive 3D Surface: sinc(r) × cos(x) × sin(y)",
            font=attr(size=20)
        ),
        scene=attr(
            xaxis=attr(title="X Axis"),
            yaxis=attr(title="Y Axis"),
            zaxis=attr(title="Z Axis"),
            camera=attr(
                eye=attr(x=1.5, y=1.5, z=1.2)
            )
        ),
        margin=attr(l=0, r=0, t=50, b=0),
        paper_bgcolor="rgba(0,0,0,0)",
        autosize=true
    )

    # Create the plot
    p = plot(trace, layout)

    output_path = joinpath(output_dir, "surface-plot.html")

    # Save as standalone HTML with full Plotly.js included
    savefig(p, output_path; include_plotlyjs="cdn")

    println("  Saved to: $output_path")
    println("  File size: $(round(filesize(output_path) / 1024, digits=1)) KB")
end

generate_surface_plot()

println("\nDone! Plots saved to: $output_dir")
println("\nControls:")
println("  - Rotate: Left-click and drag")
println("  - Zoom: Scroll wheel or pinch")
println("  - Pan: Right-click and drag (or Shift + left-click)")
println("  - Reset: Double-click or use home button in toolbar")

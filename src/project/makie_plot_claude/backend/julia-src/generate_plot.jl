using GLMakie

"""
Generate a beautiful 3D surface plot using GLMakie.
Saves the plot as a PNG image to the specified output path.
"""
function generate_surface_plot(output_path::String)
    # Create data for a parametric surface
    xs = range(-3, 3, length=100)
    ys = range(-3, 3, length=100)

    # Create a function for an interesting surface (sinc function variation)
    zs = [sinc(sqrt(x^2 + y^2)) * cos(x) * sin(y) for x in xs, y in ys]

    # Create the figure with custom styling
    fig = Figure(resolution=(800, 600), backgroundcolor=:white)

    # Add an axis with labels
    ax = Axis3(fig[1, 1],
        xlabel="X Axis",
        ylabel="Y Axis",
        zlabel="Z Axis",
        title="3D Surface Plot: sinc(r) × cos(x) × sin(y)",
        titlesize=20,
        elevation=0.3,
        azimuth=2.5
    )

    # Create the surface plot with color mapping
    surface!(ax, xs, ys, zs,
        colormap=:viridis,
        shading=true
    )

    # Add a colorbar
    Colorbar(fig[1, 2], limits=extrema(zs), colormap=:viridis, label="Height")

    # Save the figure
    save(output_path, fig)

    println("Plot saved successfully to: $output_path")
    return output_path
end

"""
Simple function to demonstrate parametric plotting.
Creates a 2D line plot with multiple series.
"""
function generate_line_plot(output_path::String)
    # Create data
    x = range(0, 4π, length=100)
    y1 = sin.(x)
    y2 = cos.(x)
    y3 = sin.(x) .* cos.(x)

    # Create figure
    fig = Figure(resolution=(800, 600), backgroundcolor=:white)

    # Add axis
    ax = Axis(fig[1, 1],
        xlabel="x",
        ylabel="y",
        title="Trigonometric Functions",
        titlesize=20
    )

    # Plot multiple lines
    lines!(ax, x, y1, label="sin(x)", color=:blue, linewidth=2)
    lines!(ax, x, y2, label="cos(x)", color=:red, linewidth=2)
    lines!(ax, x, y3, label="sin(x)×cos(x)", color=:green, linewidth=2)

    # Add legend
    axislegend(ax, position=:rt)

    # Save
    save(output_path, fig)

    println("Plot saved successfully to: $output_path")
    return output_path
end

# If running directly (not through juliacall)
if abspath(PROGRAM_FILE) == @__FILE__
    output = joinpath(@__DIR__, "..", "outputs", "test_plot.png")
    generate_surface_plot(output)
end

using WGLMakie
using Bonito

# Activate WGLMakie backend
WGLMakie.activate!()

"""
Generate a beautiful 3D surface plot using WGLMakie.
Saves the plot as an interactive HTML file to the specified output path.
"""
function generate_surface_plot(output_path::String)
    # Create data for a parametric surface
    xs = range(-3, 3, length=100)
    ys = range(-3, 3, length=100)

    # Create a function for an interesting surface (sinc function variation)
    zs = [sinc(sqrt(x^2 + y^2)) * cos(x) * sin(y) for x in xs, y in ys]

    # Create the figure with custom styling
    fig = Figure(size=(800, 600))

    # Add an axis with labels
    ax = Axis3(fig[1, 1],
        xlabel="X Axis",
        ylabel="Y Axis",
        zlabel="Z Axis",
        title="3D Surface Plot: sinc(r) × cos(x) × sin(y)",
        titlesize=20
    )

    # Create the surface plot with color mapping
    surface!(ax, xs, ys, zs,
        colormap=:viridis
    )

    # Add a colorbar
    Colorbar(fig[1, 2], limits=extrema(zs), colormap=:viridis, label="Height")

    # Export as standalone HTML with all dependencies inlined
    open(output_path, "w") do io
        println(io, """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>3D Surface Plot</title>
        </head>
        <body style="margin: 0; padding: 0;">
        """)

        # Create exportable page
        page = Bonito.Page(exportable=true, offline=true)

        # Show the figure
        show(io, MIME"text/html"(), page, fig)

        println(io, """
        </body>
        </html>
        """)
    end

    println("Interactive plot saved successfully to: $output_path")
    return output_path
end

"""
Simple function to demonstrate parametric plotting.
Creates a 2D line plot with multiple series as an interactive HTML file.
"""
function generate_line_plot(output_path::String)
    # Create data
    x = range(0, 4π, length=100)
    y1 = sin.(x)
    y2 = cos.(x)
    y3 = sin.(x) .* cos.(x)

    # Create figure
    fig = Figure(size=(800, 600))

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

    # Export as standalone HTML with all dependencies inlined
    open(output_path, "w") do io
        println(io, """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>2D Line Plot</title>
        </head>
        <body style="margin: 0; padding: 0;">
        """)

        # Create exportable page
        page = Bonito.Page(exportable=true, offline=true)

        # Show the figure
        show(io, MIME"text/html"(), page, fig)

        println(io, """
        </body>
        </html>
        """)
    end

    println("Interactive plot saved successfully to: $output_path")
    return output_path
end

# If running directly (not through juliacall)
if abspath(PROGRAM_FILE) == @__FILE__
    output = joinpath(@__DIR__, "..", "outputs", "test_plot.html")
    generate_surface_plot(output)
end

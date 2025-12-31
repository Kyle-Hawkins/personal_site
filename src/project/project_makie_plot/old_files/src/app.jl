using Genie, Genie.Renderer.Html
using ..ProjectMakiePlots

route("/") do
    # Build the figure on‑the‑fly
    fig = ProjectMakiePlots.plot_rosenbrock_function(2,100)

    # Save the figure to an *in‑memory* HTML string.
    # `fmt = :html` tells WGLMakie to emit a self‑contained <canvas>.
    io = IOBuffer()
    save(io, fig; fmt = :html)          # ← this is the crucial line
    plot_html = String(take!(io))

    # Assemble a tiny HTML page that embeds the canvas.
    # You can add any extra CSS/JS you like around it.
    html("""
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>My Makie Plot via Genie</title>
        <style>
            body {font-family: sans-serif; margin: 2rem;}
            h1   {margin-bottom: 1rem;}
        </style>
    </head>
    <body>
        <h1>Interactive Makie plot</h1>
        $(plot_html)   <!-- ← the WebGL canvas lands here -->
        <p>Powered by <strong>Genie.jl</strong> + <strong>WGLMakie</strong>.</p>
    </body>
    </html>
    """)
end

up()
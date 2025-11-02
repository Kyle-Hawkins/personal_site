using WGLMakie


function generate_plot(a,b)
    
    func_rosenbrock(x,y) = (a - x)^2 + b*(y-x^2)^2
    vector_x = -10:0.1:10
    vector_y = -10:0.1:10

    fig = Figure()
    ax = Axis3(fig[1,1])

    surface!(ax, vector_x, vector_y, log10.(func_rosenbrock.(vector_x', vector_y)))

    ax = Makie.Axis(fig[1,2])
    hm = heatmap!(ax, vector_x, vector_y, log10.(func_rosenbrock.(vector_x', vector_y)))

    #log_ticks = -6:1:0
    #string_ticks = 10 .^ log_ticks .|> string
    #cb = Makie.Colorbar(fig[1,3], hm; ticks = (log_ticks, string_ticks))

    return fig
end
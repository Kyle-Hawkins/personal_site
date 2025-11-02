
module ProjectMakiePlots
using JuMP, Ipopt, WGLMakie
export plot_rosenbrock_function

function plot_rosenbrock_function(a::Real,b::Real)

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

function save_figure_as_html(fig)
    mkpath("project_makie_plot/public/plots")               # ensures the directory exists
    outfile = joinpath("project_makie_plot/public/plots", "demo.html")
    # Save the figure *as an HTML fragment* to that file
    save(outfile; fmt = :html, fig)
    return outfile
end

function optimize_rosenbrock_function(a,b)

    model = JuMP.Model(Ipopt.Optimizer)

    @variable(model, x)
    @variable(model, y)
    @variable(model, func_rosenbrock)
    @variable(model, a)
    @variable(model, b)


    #https://en.wikipedia.org/wiki/Rosenbrock_function

    @constraint(model, func_rosenbrock == (a - x)^2 + b*(y-x^2)^2)
    @constraint(model, a == 2)
    @constraint(model, b == 100)

    @objective(model, Min, func_rosenbrock)
    JuMP.optimize!(model)

    return model
end

end






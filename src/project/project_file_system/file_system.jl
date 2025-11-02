module module_file_system
export Node, FileSystem, get_pwd, make_directory, change_directory

    mutable struct Node
        name :: String
        parent :: Union{Node, Nothing}
        children :: Dict{String, Node}

        Node(name, parent = nothing) = new(name, parent, Dict{String,Node}())
    end

    mutable struct FileSystem
        root :: Node
        pwd :: Node

        function FileSystem(root_name::String = "/")
            node_root = Node(root_name)
            new(node_root, node_root)
        end
    end

    function get_pwd(fs::FileSystem)
        return fs.pwd.name
    end

    function make_directory(name::String, fs::FileSystem)
        node_parent = fs.pwd
        node_new = Node(name, node_parent)
        node_parent.children[name] = node_new

        fs.pwd = node_new
    end

    function change_directory(name::String, fs::FileSystem)
        #fs.pwd = 
    end

end


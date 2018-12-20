# Vue Graph Visualizer (Vis)

A Vue component to render graph on canvas, based on [Vis.js network](http://visjs.org/docs/network/).

## How to

Perform an npm installation of the package:

```
npm i vue-graph-vis
```

The default import is the Vue component, so you can import it in your project with a statement like this:

```
import VueGraphVis from 'vue-graph-vis';

```

and use it in you Vue template in this way (supposed you are using webpack):
```
<template>
    ...
        <GraphDiagram class="canvas" :graph="graph" :options="options" />
    ...
</template>

```

You could also import some classes, useful to build the diagram such as:
```
import { DefaultCommmandManager, Node, Edge, Graph, NodeType, Cluster, ClusterType } from 'vue-graph-vis';

```


### The Vue component

The Vue Component props that are mandatory to be bound are:
- A Graph   object (graph)
- A Options object (options)

An optional prop is 'commandManager'. By default a DummyCommandManager is assigned which doesn't manipulate the graph provided to the component.

### The Graph Object

By default a graph contains:
- nodes ( Node[] )
- edges ( Edge[] )

For nodes and edges documentation see: http://visjs.org/docs/network/.

IMPORTANT: Do not use nodes groups. A more sophisticated group version has been implemented which uses NodeType.

- Groups: do not use nodes groups. A more sophisticated group system has been implemented which uses NodeType.
- HTML Nodes: you can now define a node with inner html, by putting your HTML code inside the _graphCanvas property of the node, as a string
- Clusters: similarly to groups, a more sophisticated clustering system has been implemented which uses ClusterType.
- resizable: node are now resizable, but you can decide to make them not resizable, giving this boolean a value of false


Example:
```
            _graphCanvas:
            {
                nodeType:     'start',
                clusterType : 'logic',
                resizable : false,

                html: `<table style='width: 100%;' border='1' cellspacing='0' cellpadding='5'> 
                            <tr>
                                <td>a</td>
                                <td>b</td>
                            </tr> 
                            <tr>
                                <td>c</td>
                                <td>d</td>
                            </tr> 
                        </table>`
            }
```



### The Options Object

See http://visjs.org/docs/network/.

New options are available under the _graphCanvas property:
- background: a background can be defined through a URL
- NodeTypes: see the implementation details below
- ClusterTypes: see the implementation details below
- canAddEdges: allows to add edges to the graph, in addition to the initial one (if an appropriate CommandManager is provided)
- saveNodesPosition: save the new nodes' positions on the model (if an appropriate CommandManager is provided)
- allowMultiselect: enable or disable the multiple selection of nodes and edges
- allowResizing: enable or disable the interactive resizing of nodes

Example:

```
var options = {
    ...
    _graphCanvas:
    {
        canAddEdges     : true,
        allowMultiselect: false,
        allowResizing   : false,
        nodeTypes: [...],
        background: ***random_url***,
        clusterTypes : [...]
    }
}

```

#### NodeType(s)

Example:

```

var nodeType = {
    linkIn: {
        max: 2, //default 0, means no limits
        allowedNodeTypes: ["nodeType1"] // default ["*"], means all nodeTypes allowed
    },
    linkOut: {
        max: 2, //default 0, means no limits
        allowedNodeTypes: ["nodeType1"] // default ["*"], means all nodeTypes allowed
    },
    options: {
        color : {
            background: blue,
            border: black
        }
    }
}

```

You can also use the Class constructor of the NodeType class, importing the class with:

```
import { NodeType } from 'vue-graph-vis';
```

In this case you can code:


```
var nodeType = new NodeType( 
    { 
        linkIn:  { allowedNodeTypes: [] }, 
        linkOut: { allowedNodeTypes: ["*"], max: 1 },
        options: 
        { 
            color: { background: "#99B898" },  
            shape: "circle",  
            margin: 1, 
            borderWidth: 3 
        }
});
```

#### ClusterType(s)

Example:
```
var x = {
    id: 'main',
    level: 1
}

```

You can also use the Class constructor of the ClusterType class, importing the class with:

```
import { ClusterType } from 'vue-graph-vis';
```

In this case you can code:


```
var clusterType =  new ClusterType( { id : 'world',  level : 0})
```

### CommandManager

I strongly suggest you to use defaultCommandManager.

If you want to create you should at least implements the standard interface:

```
export default interface CommandManager
{
    updateNode  (payload : {node: Node; graph: Graph}) : any
    addEdge     (payload : {edge: Edge; graph: Graph}) : any             
}
```

which requires an updateNode method and an addEdge method.

## Contributing

You can clone the GitHub repo from [here](https://github.com/PietroMazz/vue-graph-vis).

Default commands are:

```
npm run serve
```

```
npm run build
```

```
npm run test:unit
```

```
npm run test:watch
```
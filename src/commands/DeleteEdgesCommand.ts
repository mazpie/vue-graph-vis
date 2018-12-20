import GraphCommand from './GraphCommand'
import Edge         from './../model/Edge';
import Graph        from './../model/Graph';


export default class DeleteEdgesCommand extends GraphCommand
{
    edgeIds : string[];
    edges   : Edge[];

    constructor(edgeIds : string[])
    {
        super();
        this.edgeIds = edgeIds;
        this.edges = [];
    }

    execute(graph : Graph)
    {
        for(let id  of this.edgeIds)  
        {
            this.edges.push( graph.findEdgeById(id) );
            graph.removeEdgeById(id);
        }
    }

    undo(graph : Graph)
    {
        if( this.edges.length === 0) return;
        for (let edge of this.edges) graph.addEdge(edge);
        this.edges = [];
    }
}
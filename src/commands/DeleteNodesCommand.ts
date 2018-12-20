import GraphCommand from './GraphCommand'
import Node         from './../model/Node';
import Graph        from './../model/Graph';
import Edge         from './../model/Edge';

export default class DeleteNodesCommand extends GraphCommand
{
    nodeIds         : string[];
    nodes           : Node[];
    connectedEdges  : Edge[];

    constructor(nodeIds : string[])
    {
        super();
        this.nodeIds = nodeIds;
        this.nodes = [];
        this.connectedEdges = [];
    }

    execute(graph : Graph)
    {
        for(let id of this.nodeIds) 
        {
            this.nodes.push( graph.findNodeById(id) );
            graph.getConnectedEdges(id).forEach( edgeId => this.connectedEdges.push(graph.findEdgeById(edgeId) ) );
            graph.removeNodeById(id);
        }
    }

    undo(graph : Graph)
    {
        if( this.nodes.length === 0) return;
        for (let node of this.nodes) graph.addNode(node);
        for (let edge of this.connectedEdges) graph.addEdge(edge);
        this.nodes = [];
        this.connectedEdges = [];
    }
}
import GraphCommand     from './GraphCommand'
import Edge             from './../model/Edge';
import Graph            from './../model/Graph';

export default class AddEdgeCommand extends GraphCommand
{
    addedEdge: Edge;

    constructor(edge : Edge)
    {
        super();
        this.addedEdge = edge;
    }

    execute(graph : Graph)
    {
        graph.addEdge(this.addedEdge);
    }

    undo(graph : Graph)
    {
        graph.removeEdgeById(this.addedEdge.id);
    }
}
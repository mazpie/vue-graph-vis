import GraphCommand from './GraphCommand'
import Graph        from './../model/Graph';
import Node         from './../model/Node';

export default class AddNodeCommand extends GraphCommand
{
    addedNode : Node;

    constructor(node : Node)
    {
        super();
        this.addedNode = node;
    }

    execute(graph : Graph)
    {
        graph.addNode(this.addedNode);
    }

    undo(graph : Graph)
    {
        graph.removeNodeById(this.addedNode.id);
    }
}
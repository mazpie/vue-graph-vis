import GraphCommand from './GraphCommand';
import Graph from './../model/Graph';
import Node from './../model/Node';
export default class AddNodeCommand extends GraphCommand {
    addedNode: Node;
    constructor(node: Node);
    execute(graph: Graph): void;
    undo(graph: Graph): void;
}

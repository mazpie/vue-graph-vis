import GraphCommand from './GraphCommand';
import Node from './../model/Node';
import Graph from './../model/Graph';
export default class UpdateNodeCommand extends GraphCommand {
    newNode: Node | any;
    oldNode: Node | any;
    constructor(node: Node);
    execute(graph: Graph): void;
    undo(graph: Graph): void;
}

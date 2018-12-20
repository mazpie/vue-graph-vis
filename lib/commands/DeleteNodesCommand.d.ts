import GraphCommand from './GraphCommand';
import Node from './../model/Node';
import Graph from './../model/Graph';
import Edge from './../model/Edge';
export default class DeleteNodesCommand extends GraphCommand {
    nodeIds: string[];
    nodes: Node[];
    connectedEdges: Edge[];
    constructor(nodeIds: string[]);
    execute(graph: Graph): void;
    undo(graph: Graph): void;
}

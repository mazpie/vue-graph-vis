import GraphCommand from './GraphCommand';
import Edge from './../model/Edge';
import Graph from './../model/Graph';
export default class AddEdgeCommand extends GraphCommand {
    addedEdge: Edge;
    constructor(edge: Edge);
    execute(graph: Graph): void;
    undo(graph: Graph): void;
}

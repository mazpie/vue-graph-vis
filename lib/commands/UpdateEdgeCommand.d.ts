import GraphCommand from './GraphCommand';
import Edge from './../model/Edge';
import Graph from './../model/Graph';
export default class UpdateEdgeCommand extends GraphCommand {
    newEdge: Edge | any;
    oldEdge: Edge | any;
    constructor(Edge: Edge);
    execute(graph: Graph): void;
    undo(graph: Graph): void;
}

import GraphCommand from './GraphCommand';
import Edge from './../model/Edge';
import Graph from './../model/Graph';
export default class DeleteEdgesCommand extends GraphCommand {
    edgeIds: string[];
    edges: Edge[];
    constructor(edgeIds: string[]);
    execute(graph: Graph): void;
    undo(graph: Graph): void;
}

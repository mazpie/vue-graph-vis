import Graph from './../model/Graph';
export default class GraphCommand {
    execute(graph: Graph): void;
    undo(graph: Graph): void;
}

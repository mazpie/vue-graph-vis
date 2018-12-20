import GraphCommand from './GraphCommand';
import Edge from '../model/Edge';
import Node from '../model/Node';
import Graph from '../model/Graph';
declare const _default: {
    undoHistory: GraphCommand[];
    redoHistory: GraphCommand[];
    historyLength: number;
    updateHistory(command: GraphCommand): void;
    undo(graph: Graph): void;
    redo(graph: Graph): void;
    clean(): void;
    addNode(payload: {
        node: Node;
        graph: Graph;
    }): void;
    addEdge(payload: {
        edge: Edge;
        graph: Graph;
    }): void;
    updateNode(payload: {
        node: Node;
        graph: Graph;
    }): void;
    deleteNodes(payload: {
        nodeIds: string[];
        graph: Graph;
    }): void;
    deleteEdges(payload: {
        edgeIds: string[];
        graph: Graph;
    }): void;
};
export default _default;

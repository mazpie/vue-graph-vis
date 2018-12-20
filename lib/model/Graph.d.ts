import Node from './Node';
import Edge from './Edge';
export default class Graph {
    nodes: Node[];
    edges: Edge[];
    constructor(nodes: any[], edges: any[]);
    findNodeById(id: string): Node;
    addNode(node: Node): void;
    getConnectedEdges(id: string): string[];
    updateNode(node: Node): void;
    removeNodeById(id: string): void;
    findEdge(edge: Edge): Edge | undefined;
    findEdgeById(id: string): Edge;
    addEdge(edge: Edge): void;
    updateEdge(edge: Edge): void;
    removeEdgeById(id: string): void;
}

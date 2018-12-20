"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const GraphFX_1 = tslib_1.__importDefault(require("./../utils/GraphFX"));
const lodash_1 = require("lodash");
class Graph {
    constructor(nodes, edges) {
        this.nodes = [];
        this.edges = [];
        nodes.forEach(node => this.addNode(node));
        edges.forEach(edge => this.addEdge(edge));
    }
    findNodeById(id) {
        let node = this.nodes.find(node => node.id === id);
        if (node === undefined)
            GraphFX_1.default.throwErr(`Node with id='${id}' not found`);
        return node;
    }
    addNode(node) {
        if (!node.id)
            node.id = GraphFX_1.default.makeId();
        this.nodes.push(node);
    }
    getConnectedEdges(id) {
        let connectedEdges = [];
        for (let edge of this.edges)
            if (edge.from === id || edge.to === id)
                connectedEdges.push(edge.id);
        return connectedEdges;
    }
    updateNode(node) {
        let foundNode = this.findNodeById(node.id);
        if (foundNode === undefined)
            GraphFX_1.default.throwErr("Node to update not found");
        lodash_1.merge(foundNode, node);
    }
    removeNodeById(id) {
        let foundNode = this.findNodeById(id);
        if (foundNode === undefined)
            GraphFX_1.default.throwErr("Node to remove not found");
        this.getConnectedEdges(id).forEach(edgeId => this.removeEdgeById(edgeId));
        let indexToDelete = this.nodes.indexOf(foundNode);
        this.nodes.splice(indexToDelete, 1);
    }
    findEdge(edge) { return this.edges.find(e => edge.from === e.from && edge.to === e.to); }
    findEdgeById(id) {
        let edge = this.edges.find(edge => edge.id === id);
        if (edge === undefined)
            GraphFX_1.default.throwErr(`Edge with id='${id}' not found`);
        return edge;
    }
    addEdge(edge) {
        if (!edge.id)
            edge.id = GraphFX_1.default.makeId();
        if (this.findEdge(edge) !== undefined)
            GraphFX_1.default.throwErr("It's already present an edge connecting the same nodes");
        this.edges.push(edge);
    }
    updateEdge(edge) {
        let foundEdge = this.findEdgeById(edge.id);
        if (foundEdge === undefined)
            GraphFX_1.default.throwErr("Edge to update not found");
        lodash_1.merge(foundEdge, edge);
    }
    removeEdgeById(id) {
        let foundEdge = this.findEdgeById(id);
        this.edges.splice(this.edges.indexOf(foundEdge), 1);
    }
}
exports.default = Graph;
//# sourceMappingURL=Graph.js.map
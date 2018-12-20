"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const GraphCommand_1 = tslib_1.__importDefault(require("./GraphCommand"));
class DeleteNodesCommand extends GraphCommand_1.default {
    constructor(nodeIds) {
        super();
        this.nodeIds = nodeIds;
        this.nodes = [];
        this.connectedEdges = [];
    }
    execute(graph) {
        for (let id of this.nodeIds) {
            this.nodes.push(graph.findNodeById(id));
            graph.getConnectedEdges(id).forEach(edgeId => this.connectedEdges.push(graph.findEdgeById(edgeId)));
            graph.removeNodeById(id);
        }
    }
    undo(graph) {
        if (this.nodes.length === 0)
            return;
        for (let node of this.nodes)
            graph.addNode(node);
        for (let edge of this.connectedEdges)
            graph.addEdge(edge);
        this.nodes = [];
        this.connectedEdges = [];
    }
}
exports.default = DeleteNodesCommand;
//# sourceMappingURL=DeleteNodesCommand.js.map
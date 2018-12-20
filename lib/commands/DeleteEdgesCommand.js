"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const GraphCommand_1 = tslib_1.__importDefault(require("./GraphCommand"));
class DeleteEdgesCommand extends GraphCommand_1.default {
    constructor(edgeIds) {
        super();
        this.edgeIds = edgeIds;
        this.edges = [];
    }
    execute(graph) {
        for (let id of this.edgeIds) {
            this.edges.push(graph.findEdgeById(id));
            graph.removeEdgeById(id);
        }
    }
    undo(graph) {
        if (this.edges.length === 0)
            return;
        for (let edge of this.edges)
            graph.addEdge(edge);
        this.edges = [];
    }
}
exports.default = DeleteEdgesCommand;
//# sourceMappingURL=DeleteEdgesCommand.js.map
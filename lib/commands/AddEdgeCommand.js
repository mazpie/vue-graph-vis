"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const GraphCommand_1 = tslib_1.__importDefault(require("./GraphCommand"));
class AddEdgeCommand extends GraphCommand_1.default {
    constructor(edge) {
        super();
        this.addedEdge = edge;
    }
    execute(graph) {
        graph.addEdge(this.addedEdge);
    }
    undo(graph) {
        graph.removeEdgeById(this.addedEdge.id);
    }
}
exports.default = AddEdgeCommand;
//# sourceMappingURL=AddEdgeCommand.js.map
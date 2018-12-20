"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const GraphCommand_1 = tslib_1.__importDefault(require("./GraphCommand"));
const lodash_1 = require("lodash");
class UpdateEdgeCommand extends GraphCommand_1.default {
    constructor(Edge) {
        super();
        this.newEdge = lodash_1.cloneDeep(Edge);
        this.oldEdge = null;
    }
    execute(graph) {
        this.oldEdge = lodash_1.cloneDeep(graph.findEdgeById(this.newEdge.id));
        graph.updateEdge(this.newEdge);
    }
    undo(graph) {
        if (!this.oldEdge)
            return;
        graph.updateEdge(this.oldEdge);
        this.oldEdge = null;
    }
}
exports.default = UpdateEdgeCommand;
//# sourceMappingURL=UpdateEdgeCommand.js.map
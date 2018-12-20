"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const GraphCommand_1 = tslib_1.__importDefault(require("./GraphCommand"));
class AddNodeCommand extends GraphCommand_1.default {
    constructor(node) {
        super();
        this.addedNode = node;
    }
    execute(graph) {
        graph.addNode(this.addedNode);
    }
    undo(graph) {
        graph.removeNodeById(this.addedNode.id);
    }
}
exports.default = AddNodeCommand;
//# sourceMappingURL=AddNodeCommand.js.map
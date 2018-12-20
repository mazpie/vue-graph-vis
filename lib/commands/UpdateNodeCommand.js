"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const GraphCommand_1 = tslib_1.__importDefault(require("./GraphCommand"));
const lodash_1 = require("lodash");
class UpdateNodeCommand extends GraphCommand_1.default {
    constructor(node) {
        super();
        this.newNode = lodash_1.cloneDeep(node);
        this.oldNode = null;
    }
    execute(graph) {
        this.oldNode = lodash_1.cloneDeep(graph.findNodeById(this.newNode.id));
        graph.updateNode(this.newNode);
    }
    undo(graph) {
        if (!this.oldNode)
            return;
        graph.updateNode(this.oldNode);
        this.oldNode = null;
    }
}
exports.default = UpdateNodeCommand;
//# sourceMappingURL=UpdateNodeCommand.js.map
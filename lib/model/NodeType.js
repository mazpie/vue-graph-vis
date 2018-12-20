"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodeType {
    constructor(obj) {
        this.linkIn = obj.linkIn || { max: 0, allowedNodeTypes: ["*"] };
        this.linkOut = obj.linkOut || { max: 0, allowedNodeTypes: ["*"] };
        this.options = obj.options || {};
        this.linkIn.max ? "" : this.linkIn.max = 0;
        this.linkOut.max ? "" : this.linkOut.max = 0;
        this.linkIn.allowedNodeTypes ? "" : this.linkOut.allowedNodeTypes = ["*"];
        this.linkOut.allowedNodeTypes ? "" : this.linkOut.allowedNodeTypes = ["*"];
    }
}
exports.default = NodeType;
//# sourceMappingURL=NodeType.js.map
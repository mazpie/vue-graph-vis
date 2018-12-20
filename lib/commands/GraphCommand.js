"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GraphCommand {
    execute(graph) { throw "method must be overriden in derived classes"; }
    undo(graph) { throw "method must be overriden in derived classes"; }
}
exports.default = GraphCommand;
//# sourceMappingURL=GraphCommand.js.map
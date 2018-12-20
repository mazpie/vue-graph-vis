"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AddEdgeCommand_1 = tslib_1.__importDefault(require("./AddEdgeCommand"));
const AddNodeCommand_1 = tslib_1.__importDefault(require("./AddNodeCommand"));
const UpdateNodeCommand_1 = tslib_1.__importDefault(require("./UpdateNodeCommand"));
const DeleteNodesCommand_1 = tslib_1.__importDefault(require("./DeleteNodesCommand"));
const DeleteEdgesCommand_1 = tslib_1.__importDefault(require("./DeleteEdgesCommand"));
exports.default = new class DefaultCommandManager {
    constructor(historyLength = 50) {
        this.undoHistory = [];
        this.redoHistory = [];
        this.historyLength = historyLength;
    }
    updateHistory(command) {
        console.log(command);
        if (this.undoHistory.length >= this.historyLength)
            this.undoHistory = this.undoHistory.slice(1);
        this.undoHistory.push(command);
        this.redoHistory = [];
    }
    undo(graph) {
        if (this.undoHistory.length === 0)
            return;
        let commandToUndo = this.undoHistory.pop();
        commandToUndo.undo(graph);
        this.redoHistory.push(commandToUndo);
    }
    redo(graph) {
        if (this.redoHistory.length === 0)
            return;
        let commandToRedo = this.redoHistory.pop();
        commandToRedo.execute(graph);
        this.undoHistory.push(commandToRedo);
    }
    clean() {
        this.undoHistory = [];
        this.redoHistory = [];
    }
    addNode(payload) {
        let c = new AddNodeCommand_1.default(payload.node);
        c.execute(payload.graph);
        this.updateHistory(c);
    }
    addEdge(payload) {
        let c = new AddEdgeCommand_1.default(payload.edge);
        c.execute(payload.graph);
        this.updateHistory(c);
    }
    updateNode(payload) {
        let c = new UpdateNodeCommand_1.default(payload.node);
        c.execute(payload.graph);
        this.updateHistory(c);
    }
    deleteNodes(payload) {
        let c = new DeleteNodesCommand_1.default(payload.nodeIds);
        c.execute(payload.graph);
        this.updateHistory(c);
    }
    deleteEdges(payload) {
        let c = new DeleteEdgesCommand_1.default(payload.edgeIds);
        c.execute(payload.graph);
        this.updateHistory(c);
    }
};
//# sourceMappingURL=DefaultCommandManager.js.map
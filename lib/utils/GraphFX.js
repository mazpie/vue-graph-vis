"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let FX = {
    throwErr: (msg) => { throw new Error("Graph: " + msg); },
    makeId: () => {
        let id = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 20; i++)
            id += possible.charAt(Math.floor(Math.random() * possible.length));
        return id;
    }
};
exports.default = FX;
//# sourceMappingURL=GraphFX.js.map
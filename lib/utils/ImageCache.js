"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new class ImageCache {
    constructor() {
        this.cache = {};
    }
    get(url) {
        if (!url)
            throw new Error("URL for the node not specified");
        return this.cache[url];
    }
    set(url, imageData) {
        this.cache[url] = imageData;
    }
};
//# sourceMappingURL=ImageCache.js.map
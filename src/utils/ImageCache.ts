// SINGLETON
export default new class ImageCache {
    // Object with no determined keys
    cache : any;
    
    constructor()
    {
        this.cache = {};
    }
    
    get(url : string)
    {
        if (!url) throw new Error("URL for the node not specified");
        return this.cache[url];
    }

    set(url : string, imageData : string | HTMLImageElement)
    {
        this.cache[url] = imageData;
    }
}
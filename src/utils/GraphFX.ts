let FX = {
    /**
     * Throws an error with the given message
     * @param msg Error message string
     */
    throwErr : (msg : string) => { throw new Error("Graph: " + msg) },
    
    /**
     * @returns A new possible id for a node/edge/cluster
     */
    makeId   : () => 
    {
        let id : string = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 20; i++) id += possible.charAt(Math.floor(Math.random() * possible.length));
        return id;
    }
}

export default FX;



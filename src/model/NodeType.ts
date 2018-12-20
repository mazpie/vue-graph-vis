/*
Example:

let x = {
    linkIn: {
        max: 2, //default 0, means no limits
        allowedNodeTypes: ["nodeType1"] // default ["*"], means all nodeTypes allowed
    },
    linkOut: {
        max: 2, //default 0, means no limits
        allowedNodeTypes: ["nodeType1"] // default ["*"], means all nodeTypes allowed
    },
    options: {
        color : {
            background: blue,
            border: black
        }
    }
}

*/
 
export default class NodeType {
    linkIn      ?: { max: number; allowedNodeTypes: string[] | [] };
    linkOut     ?: { max: number; allowedNodeTypes: string[] | [] };
    options     ?: Node | Object;

    constructor(obj : NodeType) 
    {
        this.linkIn  = obj.linkIn   || { max: 0, allowedNodeTypes: ["*"]};
        this.linkOut = obj.linkOut  || { max: 0, allowedNodeTypes: ["*"]};
        this.options = obj.options  || {};

        this.linkIn.max?   "" : this.linkIn.max = 0;
        this.linkOut.max?  "" : this.linkOut.max = 0;
        this.linkIn.allowedNodeTypes?  "" : this.linkOut.allowedNodeTypes = ["*"];
        this.linkOut.allowedNodeTypes? "" : this.linkOut.allowedNodeTypes = ["*"];

    }
}
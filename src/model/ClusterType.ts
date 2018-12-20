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
 
export default class ClusterType {
    id      : string;
    level   : number;

    constructor(obj : ClusterType) 
    {
        this.id = obj.id;
        this.level = obj.level;
    }
}
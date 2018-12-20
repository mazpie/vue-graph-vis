export default class NodeType {
    linkIn?: {
        max: number;
        allowedNodeTypes: string[] | [];
    };
    linkOut?: {
        max: number;
        allowedNodeTypes: string[] | [];
    };
    options?: Node | Object;
    constructor(obj: NodeType);
}

/*
Example:

let x = {
    id: 'main',
    level: 1
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
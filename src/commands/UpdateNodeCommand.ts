import GraphCommand from './GraphCommand'
import {cloneDeep}  from 'lodash'
import Node         from './../model/Node';
import Graph        from './../model/Graph';

export default class UpdateNodeCommand extends GraphCommand
{
    newNode : Node | any;
    oldNode : Node | any;

    constructor(node : Node)
    {
        super();
        this.newNode = cloneDeep( node );
        this.oldNode = null;
    }

    execute(graph : Graph)
    {
        this.oldNode = cloneDeep( graph.findNodeById(this.newNode.id) );
        graph.updateNode(this.newNode) 
    }
    
    undo(graph : Graph)
    {
        if(!this.oldNode) return;
        graph.updateNode(this.oldNode);
        this.oldNode = null;
    }
}
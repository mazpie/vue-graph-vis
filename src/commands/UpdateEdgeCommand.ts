import GraphCommand from './GraphCommand'
import {cloneDeep}  from 'lodash'
import Edge         from './../model/Edge';
import Graph        from './../model/Graph';

export default class UpdateEdgeCommand extends GraphCommand
{
    newEdge : Edge | any;
    oldEdge : Edge | any;

    constructor(Edge : Edge)
    {
        super();
        this.newEdge = cloneDeep( Edge );
        this.oldEdge = null;
    }

    execute(graph : Graph)
    {
        this.oldEdge = cloneDeep( graph.findEdgeById(this.newEdge.id) );
        graph.updateEdge(this.newEdge) 
    }
    
    undo(graph : Graph)
    {
        if(!this.oldEdge) return;
        graph.updateEdge(this.oldEdge);
        this.oldEdge = null;
    }
}
import Node from './Node'
import Edge from './Edge'

import FX from './../utils/GraphFX';

import {merge} from 'lodash';

export default class Graph {
    nodes : Node[];
    edges : Edge[];

    constructor(nodes : any[] , edges : any[] ) 
    {
        this.nodes = [];
        this.edges  = [];
        nodes.forEach( node => this.addNode(node));
        edges.forEach( edge => this.addEdge(edge));
    }
    
    findNodeById(id : string) 
    { 
        let node = this.nodes.find( node => node.id === id) 
        if ( node === undefined) FX.throwErr(`Node with id='${id}' not found`);
        return node as Node;
    }       

    addNode(node : Node) 
    {
        if( !node.id ) node.id = FX.makeId();
        this.nodes.push(node);
    }
    
    getConnectedEdges(id : string)
    {
        let connectedEdges : string[] = [];
        for (let edge of this.edges)
        if (edge.from === id || edge.to === id) connectedEdges.push(edge.id)
        return connectedEdges;
    }
    
    updateNode(node : Node)
    {
        let foundNode : Node | undefined  = this.findNodeById(node.id);
        if( foundNode === undefined )  FX.throwErr("Node to update not found");
        merge(foundNode, node);
    }
    
    removeNodeById(id : string) 
    {
        let foundNode : Node | undefined = this.findNodeById(id);
        if(foundNode === undefined) FX.throwErr("Node to remove not found");
        
        // Remove connected edges
        this.getConnectedEdges(id).forEach( edgeId => this.removeEdgeById(edgeId) );

        let indexToDelete = this.nodes.indexOf(foundNode);
        this.nodes.splice(indexToDelete, 1);
    }

    findEdge(edge : Edge) { return this.edges.find( e => edge.from === e.from && edge.to === e.to ); }

    findEdgeById(id : string)
    { 
        let edge = this.edges.find( edge => edge.id === id) 
        if ( edge === undefined) FX.throwErr(`Edge with id='${id}' not found`);
        return edge as Edge;
    }

    addEdge(edge : Edge)
    {
        if( !edge.id ) edge.id = FX.makeId();
        if( this.findEdge(edge) !== undefined ) FX.throwErr("It's already present an edge connecting the same nodes");
        this.edges.push(edge);
    }

    updateEdge(edge : Edge)
    {
        let foundEdge : Edge | undefined  = this.findEdgeById(edge.id);
        if( foundEdge === undefined )  FX.throwErr("Edge to update not found");
        merge(foundEdge, edge);
    }

    removeEdgeById(id : string)
    {
        let foundEdge = this.findEdgeById(id);
        this.edges.splice(this.edges.indexOf(foundEdge), 1);
    }
}
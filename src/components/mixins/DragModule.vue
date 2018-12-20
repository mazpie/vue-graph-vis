<script lang="ts">
import Node from './../../model/Node'

import BaseModule from './BaseModule.vue';

interface DraggingNodes 
{
    nodes   : Node[];
    dx      : number[];
    dy      : number[];
}


export default BaseModule.extend({

    data()
    {
        return{
            draggingNodes : <DraggingNodes> { nodes: [], dx: [], dy: [] }
        }
    },

    methods:
    {
        dragNodes()
        {
            if(!this.getOptions()._graphCanvas) return;
            if(this.getOptions()._graphCanvas.saveNodesPositions == false) return;
            this.getNetwork().on("dragStart", this.dragStart);
            this.getNetwork().on("dragEnd",   this.dragEnd);
        },
        /**
         * Check when a node dragging starts (dragStart) in order to update graph model node x/y coordinates
         */
        dragStart(evt : any)
		{
            if(evt.nodes.length === 0) return;
			
			let nodes = this.getNodesDataset().get(evt.nodes);			
            if(!nodes[0]) return;
            if(nodes.length === 0) return;

            nodes.forEach( (node : Node, index : number) => 
            {
                this.draggingNodes.nodes[index] = node;
                this.draggingNodes.dx[index]  = this.getNetwork().getPositions(node.id)[node.id].x - evt.pointer.canvas.x;
                this.draggingNodes.dy[index]  = this.getNetwork().getPositions(node.id)[node.id].y - evt.pointer.canvas.y;			
            });
        },

        /**
         * Check when a node is released (dragEnd) to update graph model node x/y coordinates
         */
        dragEnd(evt : any)
		{
            if(evt.nodes.length === 0) return;
            
            const nodes = this.draggingNodes.nodes;
            if(nodes.length === 0) return;

            nodes.forEach( (node : Node, index : number) => 
            {
                let graphNode = this.getNodesDataset().get(node.id);
                if(node.fixed === true) return;
                let newNode = { id: graphNode.id, x: graphNode.x, y: graphNode.y}

                let fixedX = node.fixed !== undefined && node.fixed !== false && node.fixed.x;
                let fixedY = node.fixed !== undefined && node.fixed !== false && node.fixed.y;
                
                if( !fixedX) newNode.x =  evt.pointer.canvas.x + this.draggingNodes.dx[index];
                if( !fixedY) newNode.y =  evt.pointer.canvas.y + this.draggingNodes.dy[index];

                this.getCommandManager().updateNode( { node: newNode, graph: this.getGraph() } ); 
            });
            
            this.draggingNodes.nodes = [];
        }
    },
    beforeDestroy()
    {
        // Remove listeners added for tracking nodes positions
        this.getNetwork().off("dragStart", this.dragStart);
        this.getNetwork().off("dragEnd",   this.dragEnd);
    }
})
</script>

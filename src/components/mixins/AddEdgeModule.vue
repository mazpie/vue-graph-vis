<script lang="ts">
import BaseModule from './BaseModule.vue';

import Node from './../../model/Node'
import Edge from './../../model/Edge'


export default BaseModule.extend({

    methods: 
    {
        enableAddEdgeMode(enabled : boolean)
        {
            enabled ?  this.addEdge() : this.getNetwork().disableEditMode();
        },
        
        /**
         * Set the network 'addEdge' mode
         */
        addEdge()
		{
            console.log('GraphCanvas: Entering addEdge mode...');
            
            this.getNetwork().addEdgeMode();
            // Disable tracking
            this.getNetwork().off("dragStart", this.getDragStart() );
            this.getNetwork().off("dragEnd",   this.getDragEnd() );    
        },

        /**
         * This method sets the options to addEdge
         */
        onAddEdge(edgeData : Edge, callback : Function)
        {
            if(!this.nodesCanLink(edgeData.from, edgeData.to)) this.$emit('canvasError', {edgeData, msg: "These nodes can't be linked in this way"});
            else if ( !(edgeData.from === edgeData.to && !confirm("Do you want to connect the node to itself?"))) this.$emit("addEdge", edgeData);

            this.getCommandManager().addEdge( { edge: edgeData, graph: this.getGraph() } ); 

            this.getNetwork().disableEditMode();
            // Re-enable tracking
            this.getNetwork().on("dragStart", this.getDragStart());            
            this.getNetwork().on("dragEnd",   this.getDragEnd()  );  
        }, 

        /**
         * Check if two nodes types are compatible (in/out) and if the maximum number of links was reached
         */
        nodesCanLink(from : string, to : string) : boolean
		{
            const nodeTypes = this.getOptions()._graphCanvas.nodeTypes;
            
            const nodeFrom  = this.getNodesDataset().get(from);
            const nodeTo    = this.getNodesDataset().get(to);

            const groupFrom = nodeFrom._graphCanvas? nodeFrom._graphCanvas.nodeType : null; 
            const groupTo   = nodeTo  ._graphCanvas? nodeTo  ._graphCanvas.nodeType : null; 
            
            let cond1 = true, cond2 = true, cond3 = true, cond4 = true;

            if( groupFrom )
            {
                cond1 = nodeTypes[groupFrom].linkOut.max === 0 || 
                        this.getEdgesDataset().get(this.getNetwork().getConnectedEdges(from)).filter( (edge: Edge) => edge.from === from).length < nodeTypes[groupFrom].linkOut.max;
                
            }
            if( groupTo)
            {
                cond2 = nodeTypes[groupTo]  .linkIn .max === 0 || 
                        this.getEdgesDataset().get(this.getNetwork().getConnectedEdges(to))  .filter( (edge : Edge) => edge.to   === to)  .length < nodeTypes[groupTo]  .linkIn .max;
            }

            if ( groupFrom && groupTo) 
            {
                cond3 =  (nodeTypes[groupFrom].linkOut.allowedNodeTypes.includes(groupTo)    || nodeTypes[groupFrom].linkOut.allowedNodeTypes[0] === "*");
                cond4 =  (nodeTypes[groupTo]  .linkIn .allowedNodeTypes.includes(groupFrom)  || nodeTypes[groupTo]  .linkIn .allowedNodeTypes[0] === "*");
            }

			return cond1 && cond2 && cond3 && cond4;
		}
    }            
    
})
</script>

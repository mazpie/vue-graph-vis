<template>
    <div>
        <div ref="canvas" style="height: 100%; width: 100%" />
    </div>
</template>

<script>
import vis from 'vis/dist/vis'
import 'vis/dist/vis.css'

import Vue                  from 'vue';
import ConfigModule         from './mixins/ConfigModule.vue'
import ResizeModule         from './mixins/ResizeModule.vue'
import DragModule           from './mixins/DragModule.vue';
import MultiselectModule    from './mixins/MultiselectModule.vue';
import AddEdgeModule        from './mixins/AddEdgeModule.vue';
import ClusteringModule     from './mixins/ClusteringModule.vue';
import Graph                from './../model/Graph';
import DummyCommandManager  from './../commands/DummyCommandManager';


const events = 
[
	"click",
	"doubleClick",
	"oncontext",
	"hold",
	"release",
	"select",
	"selectNode",
	"selectEdge",
	"deselectNode",
	"deselectEdge",
	"dragStart",
	"dragging",
	"dragEnd",
	"hoverNode",
	"blurNode",
	"hoverEdge",
	"blurEdge",
	"zoom",
	"showPopup",
	"hidePopup"
];


export default Vue.extend({ 

    mixins: [ ConfigModule, ResizeModule, DragModule, MultiselectModule, AddEdgeModule, ClusteringModule ] ,
    
    props: 
    { 
        graph:	                { type: Object, required: true,     default : () => new Graph([],[]) }, 
        options:                { type: Object, required: true,     default : () => {} },
        commandManager :        { type: Object, required: false,    default : () => DummyCommandManager } 
    },

    watch: 
    { 
        graph:   { deep: true, handler(newGraph, oldGraph)   { this.configNetwork(newGraph, oldGraph) }}, 
        options: { deep: true, handler(newOptions) { this.context.network.setOptions(this.preprocessOptions(newOptions)) }} 
    },

    created()
    {
        // Initialize private instance variables (NOT reactives, so not in data() function)
        this.context = 
        {
            network      : null,
            nodesDataset : null,
            edgesDataset : null,
        };
    },

	mounted() 
	{
		console.log("GraphCanvas: Mounting ...");
        
		// Create VISJS network datasets and network instances
		this.context.nodesDataset = new vis.DataSet(this.preprocessNodes(this.graph.nodes));
		this.context.edgesDataset = new vis.DataSet(this.graph.edges);		
        this.context.network      = new vis.Network(this.$refs.canvas, { nodes: this.context.nodesDataset, edges: this.context.edgesDataset }, this.preprocessOptions(this.options));                                                       

        // Moves the canvas to a default initial position and a default initial scale
        this.context.network.moveTo( { scale: 1, position: { x:0, y:0 } } );

		// Track node dragging to upadte their positions (x,y) in the graph model
        this.dragNodes();
        
        // Clustering on zoom
        this.nodesClustering();       
        
        // Draw background
        this.drawBackground();
        
        // Draws resizing node utils
        this.handleResizing();        
        
        // Make Canvas multiselect
        this.handleMultiSelect();

		// Maps all network events to Vue component events
        events.forEach(eventName => this.context.network.on(eventName, props => this.$emit(eventName, props)) );

	},

    beforeDestroy()
    {
        console.log("GraphCanvas: Destroying...");

		// Cleanup VisJS network resources
        this.context.network.destroy();

		// Remove all listeners
        events.forEach(eventName => this.context.network.off(eventName, props => this.$emit(eventName, props)) );
    }
});

</script>
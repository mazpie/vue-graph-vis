<script lang="ts">
import Vue from 'vue'

export default Vue.extend(
{
    methods: 
    {
        //@ts-ignore
        getNetwork()
        {
            //@ts-ignore
            return this.context.network;
        },

        //@ts-ignore
        getEdgesDataset()
        {
            //@ts-ignore
            return this.context.edgesDataset;
        },

        //@ts-ignore
        getNodesDataset()
        {
            //@ts-ignore
            return this.context.nodesDataset;
        },

        //@ts-ignore
        getGraph()
        {
            //@ts-ignore
            return this.graph;
        },

        //@ts-ignore
        getOptions()
        {
            //@ts-ignore
            return this.options;
        },

        //@ts-ignore
        getCommandManager()
        {
            //@ts-ignore
            return this.commandManager;
        },

        //@ts-ignore
        getDragStart()
        {
            //@ts-ignore
            return this.dragStart;
        },

        //@ts-ignore
        getDragEnd()
        {
            //@ts-ignore
            return this.dragEnd;
        },

        //@ts-ignore
        getOnAddEdge()
        {
            //@ts-ignore
            return this.addEdge;
        }   
    }
});
</script>

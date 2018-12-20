
<script lang="ts">

import BaseModule   from './BaseModule.vue';

import Node         from './../../model/Node'
import Cluster      from './../../model/Cluster'
import ClusterType  from './../../model/ClusterType';

import FX           from './../../utils/GraphFX'

import {merge}     from 'lodash'


export default BaseModule.extend({

    data()
    {
        return {
            clusters        : [] as Cluster[],
            zoomLevel       : 0,
            initialScale    : 0
        }
    },

    methods: 
    {
        nodesClustering()
        {
            if(!this.getOptions()._graphCanvas) return;
            if(!this.getOptions()._graphCanvas.clusterTypes) return;
            this.initialScale = this.getNetwork().getScale();
            this.getNetwork().on("zoom", this.clusterNodes);
        },

        clusterNodes(evt : any)
        {
            const zoomThreshold = 0.20;
            
            let clusteringId = '';

            // REDEFINE ON CLUSTER LEVEL 
            if (evt.scale < 10)  this.zoomLevel = 4; 
            if (evt.scale < 8)   this.zoomLevel = 3; 
            if (evt.scale < 6)   this.zoomLevel = 2; 
            if (evt.scale < 4)   this.zoomLevel = 1; 
            if (evt.scale < 2)   this.zoomLevel = 0; 
            if (evt.scale < 0.8) this.zoomLevel = -1; 
            if (evt.scale < 0.6) this.zoomLevel = -2; 
            if (evt.scale < 0.4) this.zoomLevel = -3; 
            if (evt.scale < 0.2) this.zoomLevel = -4; 

            let options = 
            {
                joinCondition: (node : Node) =>
                {
                    if(!node._graphCanvas) return false;
                    if(!node._graphCanvas.clusterTypes) return false;

                    return node._graphCanvas.clusterTypes.includes(clusteringId); 
                },

                processProperties: (clusterOptions : any, childNodes : any) =>
                {
                    // Give an ID to cluster
                    let id = FX.makeId();
                    clusterOptions.id = id;
                    // Count Children
                    let childrenCount = 0;
                    for (let i = 0; i < childNodes.length; i++) {
                        childrenCount += childNodes[i].childrenCount || 1;
                    }
                    clusterOptions.childrenCount = childrenCount;
                    // Give the cluster a label
                    clusterOptions.label =  clusteringId + "# " + + childrenCount + "";
                    // Decide font size on the basis of n# of children
                    clusterOptions.font = {size: childrenCount*5+30}

                    this.clusters.push( { id, level : this.zoomLevel  });
                    return clusterOptions;
                },

                clusterNodeProperties:
                {
                    label : "Cluster",
                    fixed : true,
                    color: 
                    {
                        background: "white"
                    }
                }
            } // options

            let clustersToRemove : string[] = [];
            for(let cluster of this.clusters)
            {
                let cid = cluster.id;
                clustersToRemove.push(cid);
                this.getNetwork().openCluster(cid, { releaseFunction: (clusterPos : any, nodesPositions: any) => nodesPositions } );
            }

            this.clusters = this.clusters.filter( (cluster : Cluster) => 
            {
                return !clustersToRemove.includes( cluster.id ) ; 
            });

            for(let cluster of Object.values(this.getOptions()._graphCanvas.clusterTypes))                
            {
                if( (cluster as ClusterType).level !== this.zoomLevel) continue;
                clusteringId  = (cluster as ClusterType).id;

                this.getNetwork().cluster(options);
            }

        }
        
    }, // methods

    beforeDestroy()
    {
        // Remove listeners added for clustering
        this.getNetwork().off("zoom", this.clusterNodes);
    }
})
</script>

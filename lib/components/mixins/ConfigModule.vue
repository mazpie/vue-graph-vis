<script lang="ts">
import Node       from './../../model/Node'
import Edge       from './../../model/Edge'
import Graph      from './../../model/Graph'

import ImageCache from './../../utils/ImageCache'

import {merge, cloneDeep} from 'lodash'

import BaseModule from './BaseModule.vue'

export default BaseModule.extend({

    methods:
    {
        /**
         * Update VisJS datasets when variations are detected on the model
         */
        configNetwork(graph : Graph, oldGraph : Graph)
        {
            if( graph !== oldGraph )
            {
                console.log("Redrawing Everything");
                this.getNodesDataset().clear();
                this.getEdgesDataset().clear();
            }

            // Have nodes been added / updated ?
            if(graph.nodes.length >= this.getNodesDataset().length) 
            {
                let nodes = this.preprocessNodes(graph.nodes);
                this.getNodesDataset().update(nodes);
            }
            else 
            // Nodes have been removed...
            {
                let nodesToDelete : String[] = [];
                this.getNodesDataset().forEach( (node: Node) => { if( !graph.findNodeById(node.id) ) nodesToDelete.push(node.id); });
                for(let id of nodesToDelete) this.getNodesDataset().remove(id);
            }

            // Have edges been added / updated ?
            if(graph.edges.length >= this.getEdgesDataset().length) 
                this.getEdgesDataset().update(graph.edges);
            else 
            // Edges have been removed...
            {
                let edgesToDelete : String[] = [];
                this.getEdgesDataset().forEach( (edge: Edge) => { if(!graph.findEdgeById(edge.id)) edgesToDelete.push(edge.id); });
                for(let id of edgesToDelete) this.getEdgesDataset().remove(id);
            }
        },

        /**
         * Add custom properties to nodes for enabling the added functionalities
         * @param {Node[]} graphNodes nodes withdrawn from the model
          */
        preprocessNodes(graphNodes: Node[])
        {
            let newNodesArray : Node[] = [];
            if(!graphNodes ) return newNodesArray;
            for (let graphNode of graphNodes) 
            {
                let node : Node = { id: '' };

                // Set nodetype options (if needed) for this node (options are the ones supported by Vis)
                const ngc = graphNode._graphCanvas;
                if(ngc && ngc.nodeType) merge(node, this.getOptions()._graphCanvas.nodeTypes[ngc.nodeType].options);
                
                // Node options override nodeType options
                merge(node, graphNode);

                // Set default position if not present
                //if(!node.x && !node.physics) node.x = 0; 
                //if(!node.y && !node.physics) node.y = 0; 

                // Set default size if not present
                if( !node.widthConstraint )  node.widthConstraint = 200;
                if( !node.heightConstraint)  node.heightConstraint = 100; 

                let adjustLabel = ( node : Node) =>
                {
                    if(node._graphCanvas === undefined) node._graphCanvas = {};
                    node._graphCanvas.imageSize = { width: node.widthConstraint as number, height : node.heightConstraint as number};
                    // Removing distance from label to node
                    node.widthConstraint = 0;
                    node.heightConstraint = 0;
                }

                // Enhancements for ellipse shape
                if(node.shape === 'ellipse')
                {
                    node.shape = "box";
                    node.shapeProperties = { borderRadius: 100 }
                }
                // Enhancements for image shape
                else if(node.shape === 'image')
                {
                    if( node.image === undefined) throw new Error("Unexpected node with shape image and no image url/data");
                    let url = node.image;
                    let imgData = ImageCache.get(url);
                    let img = new Image();

                    let imageToBase64 = (width : number , height : number ) => 
                    {
                        let canvas = <HTMLCanvasElement> document.createElement('CANVAS');
                        let ctx    = <CanvasRenderingContext2D> canvas.getContext   ('2d');
                        if(!imgData)
                        {
                            canvas.width  = img.naturalWidth ;
                            canvas.height = img.naturalHeight;
                            ctx.drawImage( img, 0, 0, img.naturalWidth, img.naturalHeight);
                            ImageCache.set( url , img );
                        }
                        canvas.width  = width;
                        canvas.height = height;
                        ctx.drawImage( img, 0, 0, canvas.width, canvas.height);
                        return canvas.toDataURL();
                    }

                    let imagePromise = new Promise( resolve => 
                    {
                        if(imgData !== undefined) 
                        {
                            img = imgData;
                            resolve( imageToBase64(node.widthConstraint as number, node.heightConstraint as number) );
                        }
                        img.src = url;
                        img.onload = () => resolve( imageToBase64(node.widthConstraint as number, node.heightConstraint as number) );
                    });

                    imagePromise.then( data => {

                        adjustLabel(node);
                        
                        merge(node, 
                        {
                            shape : 'image',
                            image : data,
                            color: {
                                background: "#00000000" 
                            },
                            shadow: false,
                            shapeProperties: { useImageSize: true, useBorderWithImage: false}
                        });
                        this.getNodesDataset().update(node);
                    });
                }
                // Enhancements for icon shape
                else if (node.shape === 'icon')
                {
                    node.shape = 'box';
                    node.color = { background: "#00000000", border: "#00000000" };

                    let canvas = document.createElement('CANVAS') as HTMLCanvasElement;
                    let ctx    = canvas.getContext  ('2d') as CanvasRenderingContext2D;
                        node.heightConstraint = node.widthConstraint;
                    
                    let FontFaceObserver = require('fontfaceobserver');

                    let font = new FontFaceObserver('Font Awesome 5 Free', { weight: 900 });

                    font.load('\uf024').then( () => {
                        canvas.width  = canvas.height = node.heightConstraint as number;
                        ctx.font = `900 ${node.heightConstraint}px "Font Awesome 5 Free"`;
                        ctx.fillText(node.icon as string, 0, node.heightConstraint as number / 1.15);
                        
                        adjustLabel(node);
                        merge(node, 
                        {
                            shape : 'image',
                            image : canvas.toDataURL(),
                            color: {
                                background: "#00000000" 
                            },
                            shadow: false,
                            shapeProperties: { useImageSize: true, useBorderWithImage: false },
                            _graphCanvas   : { keepOneToOneAspectRatio: true } // inject the default prop
                        });

                        this.getNodesDataset().update(node);
                    },  () => {
                        throw new Error('Font is not available');
                    });
                }
                // Enable the possibility to add inner custom HTML to the nodes
                if(ngc && ngc.html)
                {
                    let svg  = `<svg xmlns="http://www.w3.org/2000/svg" width="${node.widthConstraint}px" height="${node.heightConstraint}px" style=" background-color: white;">
                                    <foreignObject x="0" y="0" width="100%" height="100%"> 
                                        <div xmlns="http://www.w3.org/1999/xhtml" width="100%" height="100%" style="overflow: hidden; padding: 2px;">
                                            ${ngc.html} 
                                        </div>
                                    </foreignObject> 
                                </svg>`;
                    adjustLabel(node);
                    merge(node, 
                    {
                        shape : 'image',
                        image : "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg),
                        shadow: false,
                        shapeProperties: { useImageSize: true, useBorderWithImage: true }
                    });
                }
                newNodesArray.push(node);
            }

            return newNodesArray;
        },

        /**
         * Add _graphCanvas settings to the actual configuration and updates VisJs options
         */        
		preprocessOptions(opt : any)
		{
            if(!this.getOptions()._graphCanvas) return opt;
            
            let options : any = cloneDeep(opt);
            
            if(this.getOptions()._graphCanvas.canAddEdges) options.manipulation = { enabled: false, addEdge: this.getOnAddEdge()};
            
            delete options._graphCanvas;

			return options;
        },

        // Draw background
        drawBackgroundOnCanvas(ctx : CanvasRenderingContext2D) 
        {
            let url = this.getOptions()._graphCanvas.background;
            let imgCached = ImageCache.get(url);
            let img = imgCached !== undefined ? imgCached : new Image();
            if(imgCached === undefined) 
            {
                img.onload = () => 
                {
                    ImageCache.set(url, img);
                    this.getNetwork().redraw();
                }
                img.src = url;
            }
            let w = (this.$refs.canvas as HTMLElement).offsetWidth;
            let h = (this.$refs.canvas as HTMLElement).offsetHeight;
            ctx.drawImage( img, -w/2, -h/2, w, h);
        },

        drawBackground()
        {
            if (!this.getOptions()._graphCanvas) return;
            if (this.getOptions()._graphCanvas.background) this.getNetwork().on('beforeDrawing', this.drawBackgroundOnCanvas);
        }

    },

    beforeDestroy()
    {
        // Remove listener for drawing background
        this.getNetwork().off('beforeDrawing', this.drawBackgroundOnCanvas);
    }
});
</script>

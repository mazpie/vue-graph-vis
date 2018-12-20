<script lang="ts">
import Node from './../../model/Node'

import {merge, cloneDeep} from 'lodash'

import BaseModule from './BaseModule.vue';

interface Coordinates
{
    x: number;
    y: number;
}

class Rectangle 
{  
    startX : number;
    startY : number;
    width  : number;
    height : number;

    constructor(startX : number = 0, startY : number = 0, width : number = 0, height : number = 0)
    {
        this.startX = startX;
        this.startY = startY;
        this.width  = width;
        this.height = height;
    }
}


const CORNER_SIZE = 10;

class Corner extends Rectangle
{   
    constructor(startX : number = 0, startY: number = 0)
    {
        super(startX, startY, CORNER_SIZE, CORNER_SIZE);
    }
}



export default BaseModule.extend({

    data()
    {
        return {
            resizeHandlers: {} as any
        }
    },

    methods:
    {
        handleResizing()
        {
            if ( !this.getOptions()._graphCanvas) return;
            if ( this.getOptions()._graphCanvas.allowResizing == false) return;

            let rect = new Rectangle(),              // overlay rect
                //
                TR = new Corner(), 
                TL = new Corner(), 
                BR = new Corner(), 
                BL = new Corner(),          
                // corners of the overlay rect
                nodeId : string,                    // ID of the selected node
                resizingCorner : Rectangle,         // it tells what corner was chosen to resize the node
                pointerCoordinates : Coordinates, // store the pointer coordinates between events
                fixedProps : any = {},              // To prevent nodes dragging: object whose keys are nodeIds and contents are fixed prop of the node
                initWidth : number, 
                initHeight : number,                // initial width and height of the rect
                dragging = false,                   // tells us if we are dragging the node instead of resizing 
                selected = false;

            // Utility function to correctly exit from the SELECTED mode
            const removeSelection = () => 
            {
                selected = false;
                nodeId = '';

                assignCorners(new Corner(), new Corner(), new Corner(), new Corner());
                rect = new Rectangle();
            }

            // Utility function to set initial dimensions in different cases
            const setInitialDimensions = () =>
            {
                let node = this.getNodesDataset().get(nodeId);

                initWidth  = node.widthConstraint;
                initHeight = node.heightConstraint;

                if(node.shape === "circle" || node._graphCanvas.keepOneToOneAspectRatio === true) initHeight = initWidth;
                
                if(node.shape === 'image') 
                {
                    initWidth = node._graphCanvas.imageSize.width;
                    initHeight= node._graphCanvas.imageSize.height;
                }
            }

            let assignCorners = (updBL : any, updBR : any, updTL : any, updTR : any) =>
            {
                merge( BL , updBL);                
                merge( BR , updBR);                
                merge( TL , updTL);                
                merge( TR , updTR);                
            }

            // Utility functions to assign the correct values to overlay rect and corners
            const setOverlayRect = () =>
            {
                //
                setInitialDimensions();

                // Assigns position, width and height to the rect
                merge(rect, {
                    startX: this.getNetwork().getPositions(nodeId)[nodeId].x - initWidth /2 ,
                    startY: this.getNetwork().getPositions(nodeId)[nodeId].y - initHeight/2 ,
                    width:  initWidth ,
                    height: initHeight      
                });

                // Assigns the 4 rectangles which drive the resizing
                assignCorners(
                    { startX: rect.startX, startY: rect.startY + rect.height - CORNER_SIZE },                             // BL
                    { startX: rect.startX + rect.width - CORNER_SIZE , startY: rect.startY + rect.height - CORNER_SIZE }, // BR
                    { startX: rect.startX, startY: rect.startY },                            // TL
                    { startX: rect.startX + rect.width - CORNER_SIZE , startY: rect.startY } // TR
                );
            }


            // Function that prevents anomalous behaviour in case of right mouse button multiple selection
            this.resizeHandlers.onMouseDown = () =>
            {
                removeSelection();
                (this.$refs.canvas as Element).removeEventListener("mousedown", this.resizeHandlers.onMouseDown); 
            }

            this.resizeHandlers.onSelectNode = (evt : any) => 
            {
                // Get the selected node id
                nodeId = evt.nodes[0];
                // Get the correspondant node
                let node = this.getNodesDataset().get(nodeId);

                if(node === null ) return;

                // If the node is not resizable return
                if( !this.getNodesDataset().get(nodeId)._graphCanvas || this.getNodesDataset().get(nodeId)._graphCanvas.resizable === false ) return;
                
                selected = true;

                // Finds width and height of the node
                setOverlayRect();

                // Prevents issues with nodes multiselection
                (this.$refs.canvas as Element).addEventListener("mousedown", this.resizeHandlers.onMouseDown); 
            }


            // Adds Event Listener on node deselection
            this.resizeHandlers.onDeselectNode = () => removeSelection();

            this.resizeHandlers.onDragStart = (evt : any) =>
            {
                if(!selected) return;
                
                // Checks whether dragStart happens on a corner
                for ( let corner of [TR, TL, BR, BL] ) {
                    let condX = ( evt.pointer.canvas.x >= corner.startX &&  evt.pointer.canvas.x <= (corner.startX + corner.width) );
                    let condY = ( evt.pointer.canvas.y >= corner.startY &&  evt.pointer.canvas.y <= (corner.startY + corner.height));

                    if ( condX && condY )
                    {
                        // Stores the corner and the pointer coordinates at the dragStart (initial state)
                        resizingCorner = corner;
                        pointerCoordinates = { x: evt.pointer.canvas.x, y: evt.pointer.canvas.y };

                        // This ensures that if it is not the first dragStart, the rect is appropriately assigned -> ANALYSE
                        setInitialDimensions();

                        // Disables nodes dragging
                        this.getNodesDataset().get().forEach( (node : Node) =>
                        {
                            {
                                fixedProps[node.id] = {};
                                let fixedX = node.fixed === true? true : (node.fixed !== undefined && node.fixed !== false && node.fixed.x);
                                let fixedY = node.fixed === true? true : (node.fixed !== undefined && node.fixed !== false && node.fixed.y);
                                fixedProps[node.id].x = fixedX || false;
                                fixedProps[node.id].y = fixedY || false;
                            }
                            this.getNodesDataset().update( { id: node.id, fixed: {x: true, y: true} } );
                        });

                        // Removes listeners for position tracking
                        this.getNetwork().off("dragStart", this.getDragStart() );
                        this.getNetwork().off("dragEnd",   this.getDragEnd() );

                        // Adds listeners for resizing
                        this.getNetwork().on ("dragging",  this.resizeHandlers.onDragging);
                        return;
                    }
                }
                
                // A click outside of the corners was detected hence exits from SELECTED mode and forces unselect 
                selected = false;

                // Checks whether the user wants to drag the selected node or not
                let condX = ( evt.pointer.canvas.x < (rect.startX + rect.width) ) && (evt.pointer.canvas.x > rect.startX);
                let condY = ( evt.pointer.canvas.y < (rect.startY + rect.height)) && (evt.pointer.canvas.y > rect.startY);  
                
                if (condX && condY) 
                { 
                    dragging = true; 
                    return; 
                }

                // If dragging the view or another node we deselect all before starting the new action
                this.getNetwork().unselectAll();
            };

            this.resizeHandlers.onDragEnd = () => 
            {
                if (!selected) 
                {
                    // If the nodes is dragging you should update the rect overlay at the end of drags'
                    if(dragging)
                    {
                        setOverlayRect();
                        dragging = false;
                        selected = true;
                    }
                    return;
                }

                // Restores event listeners
                this.getNetwork().off("dragging",  this.resizeHandlers.onDragging);
                this.getNetwork().on ("dragStart", this.getDragStart() );
                this.getNetwork().on ("dragEnd",   this.getDragEnd() );

                // Rehabilitates node dragging
                this.getNodesDataset().get().forEach( (node : Node) => 
                {
                    this.getNodesDataset().update( { id: node.id, fixed: cloneDeep(fixedProps[node.id]) } )
                    console.log(node.id, fixedProps[node.id]);
                });

                // Deals with X axis inversion
                if(rect.width < 0 )
                {
                    rect.startX = rect.startX + rect.width ;
                    rect.width *= (-1);
                }
                // Deals with Y axis inversion
                if(rect.height < 0 )
                {
                    rect.startY = rect.startY + rect.height;
                    rect.height *= (-1);
                }
                
                // Emits event which updates node
                let node = this.getNodesDataset().get(nodeId);
                let newNode : Node =  { id: nodeId }; 
                newNode.widthConstraint     = rect.width;
                newNode.heightConstraint    = rect.height;
                newNode.x                   = rect.startX + rect.width/2;
                newNode.y                   = rect.startY + rect.height/2;

                this.$emit('updateNode', newNode);
                
                this.getCommandManager().updateNode( { node: newNode, graph: this.getGraph() } ); 

            };


            this.resizeHandlers.onDragging = (evt : any) =>
            {
                if(!selected) return;                

                // While dragging we update our resize rectangle overlay
                let resizeCoordinates =
                {
                    x :  evt.pointer.canvas.x - pointerCoordinates.x,
                    y :  evt.pointer.canvas.y - pointerCoordinates.y
                }

                if( resizingCorner === BL || resizingCorner === TL ) merge(rect, { startX: evt.pointer.canvas.x, width:  initWidth  -  resizeCoordinates.x +2} );
                if( resizingCorner === TL || resizingCorner === TR ) merge(rect, { startY: evt.pointer.canvas.y, height: initHeight -  resizeCoordinates.y +2} );
                if( resizingCorner === BR || resizingCorner === BL ) merge(rect, { height: initHeight +  resizeCoordinates.y +2} );
                if( resizingCorner === TR || resizingCorner === BR ) merge(rect, { width:  initWidth  +  resizeCoordinates.x +2} );

                let node = this.getNodesDataset().get(nodeId);
                if(node.shape === "circle" || node._graphCanvas.keepOneToOneAspectRatio === true) 
                {
                    if(resizingCorner === TL) rect.startX = pointerCoordinates.x; // This is tricky, but it prevents weird behaviour, limitating the user to Y resizing
                    resizingCorner === BL? rect.height = rect.width : rect.width = rect.height;
                }
                // And we also update the position of the four courners
                assignCorners(
                    { startX: rect.startX, startY: rect.startY + rect.height - CORNER_SIZE},
                { startX: rect.startX + rect.width - CORNER_SIZE , startY: rect.startY + rect.height - CORNER_SIZE},
                { startX: rect.startX,                             startY: rect.startY,                           },
                { startX: rect.startX + rect.width - CORNER_SIZE , startY: rect.startY,                           });
                // Deal with X axis inversion
                if(rect.width < 0) assignCorners( { startX: rect.startX + rect.width }, { startX: rect.startX - CORNER_SIZE },
                                                    { startX: rect.startX + rect.width }, { startX: rect.startX - CORNER_SIZE });
                // Deal with Y axis inversion
                if(rect.height < 0) assignCorners( { startY: rect.startY - CORNER_SIZE }, { startY: rect.startY - CORNER_SIZE },
                                                    { startY: rect.startY + rect.height }, { startY: rect.startY + rect.height });
            }


            // Functions thah handles the drawing of the overlay rect and of the corners, if we are in SELECTED mode
            this.resizeHandlers.onAfterDrawing = (ctx : any) => 
            {
                if(!selected) return;

                const RED                   = 'rgba(255, 0, 0, 1)';
                const RED_SEMITRANSPARENT   = 'rgba(255, 0, 0, 0.6)';
                const TRANSPARENT           = 'rgba(255, 255, 255, 0.3)';
                const THIN            = 1;
                const STRAIGHT              = 0;
                const DASHED                = 6;


                ctx.strokeStyle = RED_SEMITRANSPARENT;           
                ctx.lineWidth   = THIN;                                
                ctx.setLineDash([DASHED]);
                ctx.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
                
                ctx.fillStyle   = TRANSPARENT;          
                ctx.fillRect(rect.startX, rect.startY, rect.width, rect.height);

                ctx.strokeStyle = RED;           
                ctx.fillStyle   = RED;              
                ctx.lineWidth   = THIN;                                
                ctx.setLineDash([STRAIGHT]);
                let corners = [TR, BL, BR, TL];
                for ( let corner of corners )
                {
                    ctx.strokeRect(corner.startX, corner.startY, corner.width, corner.height);
                    ctx.fillRect  (corner.startX, corner.startY, corner.width, corner.height);
                }
            }

            this.getNetwork().on("selectNode",      this.resizeHandlers.onSelectNode);
            this.getNetwork().on('deselectNode',    this.resizeHandlers.onDeselectNode);
            this.getNetwork().on('dragStart',       this.resizeHandlers.onDragStart);            
            this.getNetwork().on('dragEnd',         this.resizeHandlers.onDragEnd );
            this.getNetwork().on('afterDrawing',    this.resizeHandlers.onAfterDrawing);
        }

    }, // methods

    beforeDestroy()
    {
        // Remove this.resizeHandlers listeners
        this.getNetwork().off("selectNode",     this.resizeHandlers.onSelectNode);
        this.getNetwork().off('deselectNode',   this.resizeHandlers.onDeselectNode);
        this.getNetwork().off('dragStart',      this.resizeHandlers.onDragStart);
        this.getNetwork().off('dragEnd',        this.resizeHandlers.onDragEnd );
        this.getNetwork().off('afterDrawing',   this.resizeHandlers.onAfterDrawing);
    }
})
</script>

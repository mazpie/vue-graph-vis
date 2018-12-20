<script lang="ts">
import {merge} from 'lodash'

import BaseModule from './BaseModule.vue';

interface Rect 
{
    startX  : number;
    startY  : number;
    endX    : number;
    endY    : number;
}

export default BaseModule.extend({

    data()
    {
        return {
            multiSelectHandlers : <any> {}
        }
    },

    methods: 
    {
        handleMultiSelect()
        {
            if ( !this.getOptions()._graphCanvas) return;
            if( this.getOptions()._graphCanvas.allowMultiselect == false) return;

            const NO_CLICK    = 0;
            const RIGHT_CLICK = 3;
                        
            // State
            let drag = false, DOMRect : Rect = { startX: 0, startY: 0, endX: 0, endY : 0};

            const correctRange = (start : number, end : number) => start < end ? [start, end] : [end, start];

            // Selector
            const canvasify = (DOMx : number, DOMy : number) => 
            {
                const { x, y } = this.getNetwork().DOMtoCanvas({ x: DOMx, y: DOMy });
                return [x, y];
            };
            
            const selectFromDOMRect = () => 
            {
                const [sX, sY]       = canvasify(DOMRect.startX, DOMRect.startY);
                const [eX, eY]       = canvasify(DOMRect.endX, DOMRect.endY);
                const [startX, endX] = correctRange(sX, eX);
                const [startY, endY] = correctRange(sY, eY);

                this.getNetwork().selectNodes(this.getNodesDataset().get().reduce(
                    // @ts-ignore
                    (selected , { id }) => 
                    {
                        const { x, y } = this.getNetwork().getPositions(id)[id];
                        return (startX <= x && x <= endX && startY <= y && y <= endY) ? selected.concat(id) : selected;
                    }, []
                ));
            }

            // Listeners
            this.multiSelectHandlers.onMouseDown = ({ which, offsetX, offsetY } : {which : number; offsetX : number; offsetY : number}) =>
            {
                // When mousedown, save the initial rectangle state
                if(which !== RIGHT_CLICK) return;

                (this.$refs.canvas as HTMLElement).style.cursor = "crosshair";
                merge(DOMRect, 
                {
                    startX: offsetX - (this.$refs.canvas as HTMLElement).offsetLeft,
                    startY: offsetY - (this.$refs.canvas as HTMLElement).offsetTop,
                    endX:   offsetX - (this.$refs.canvas as HTMLElement).offsetLeft,
                    endY:   offsetY - (this.$refs.canvas as HTMLElement).offsetTop
                });
                drag = true;
            };


            this.multiSelectHandlers.onMouseMove = ({ which, offsetX, offsetY } : {which : number; offsetX : number; offsetY : number}) =>
            {
                // Make selection rectangle disappear when accidently mouseupped outside '(this.$refs.canvas as HTMLElement)'
                if(which === NO_CLICK && drag) 
                {
                    drag = false;
                    this.getNetwork().redraw();
                }
                // When mousemove, update the rectangle state
                else if(!drag) return; 
                
                merge(DOMRect, 
                {
                    endX: offsetX - (this.$refs.canvas as HTMLElement).offsetLeft,
                    endY: offsetY - (this.$refs.canvas as HTMLElement).offsetTop
                });
                this.getNetwork().redraw();
            };


            /**
             * On multiple select the events raised return only nodes and edges
             */
            this.multiSelectHandlers.onMouseUp = ({ which } : { which : number }) =>
            {
                // When mouseup, select the nodes in the rectangle
                if(which !== RIGHT_CLICK) return; 

                (this.$refs.canvas as HTMLElement).style.cursor = "auto";                
                drag = false;
                this.getNetwork().redraw();
                selectFromDOMRect();

                const nodes = this.getNetwork().getSelectedNodes(), edges = this.getNetwork().getSelectedEdges()
                this.$emit("select",     { nodes, edges } );
                this.$emit("selectNode", { nodes, edges } )
                this.$emit("selectEdge", { nodes, edges } )
            };

            // Drawer
            this.multiSelectHandlers.afterDrawing = (ctx : CanvasRenderingContext2D) => 
            {
                if(!drag) return;
                
                const [startX, startY] = canvasify(DOMRect.startX, DOMRect.startY);
                const [endX, endY] = canvasify(DOMRect.endX, DOMRect.endY);

                ctx.setLineDash([5]);
                ctx.strokeStyle = 'rgba(78, 146, 237, 0.75)';
                ctx.strokeRect(startX, startY, endX - startX, endY - startY);
                ctx.setLineDash([]);
                ctx.fillStyle   = 'rgba(151, 194, 252, 0.45)';
                ctx.fillRect  (startX, startY, endX - startX, endY - startY);
            }
            
            (this.$refs.canvas as HTMLElement).addEventListener("mousedown", this.multiSelectHandlers.onMouseDown); 
            (this.$refs.canvas as HTMLElement).addEventListener("mousemove", this.multiSelectHandlers.onMouseMove);
            (this.$refs.canvas as HTMLElement).addEventListener("mouseup",   this.multiSelectHandlers.onMouseUp);
            this.getNetwork().on('afterDrawing', this.multiSelectHandlers.afterDrawing);
        }

    }, // methods

    beforeDestroy()
    {
        // Remove multiSelectionHandlers listeners
        (this.$refs.canvas as HTMLElement).removeEventListener("mousedown",  this.multiSelectHandlers.onMouseDown); 
        (this.$refs.canvas as HTMLElement).removeEventListener("mousemove",  this.multiSelectHandlers.onMouseMove); 
        (this.$refs.canvas as HTMLElement).removeEventListener("mouseup",    this.multiSelectHandlers.onMouseUp); 
        this.getNetwork().off('afterDrawing', this.multiSelectHandlers.afterDrawing);
    }
})
</script>

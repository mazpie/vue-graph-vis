export default interface Edge {
    arrows              ?: string | Arrow;
    arrowStrikethrough  ?: boolean;
    chosen              ?: boolean | {node : Function | string; label : Function | string};
    color               ?: Color | string;
    dashes              ?: number[] | boolean;
    font                ?: object | string;
    from                : string;
    hidden              ?: boolean;
    hoverWidth          ?: number | Function;
    id                  : string;
    label               ?: string;
    labelHighlightBold  ?: boolean;
    length              ?: number;
    physics             ?: boolean;
    scaling             ?: object;
    selectionWidth      ?: number | Function;
    selfReferenceSize   ?: number;
    shadow              ?: object | boolean;
    shape               ?: string;
    shapeProperties     ?: object;
    smoooth             ?: Smooth | boolean;
    title               ?: string | Element;
    to                  : string;
    value               ?: number;
    width               ?: number;
    widthConstraint     ?: number | boolean | { maximum: number;};
}

interface Color 
{
    color               ?: string;
    highlight           ?: string;
    hover               ?: string;
    inherit             ?: string | boolean;
    opacity             ?: number;
}

interface Arrow 
{
    from                ?: boolean | { enabled : boolean; scaleFactor: number; type: string};
    middle              ?: boolean | { enabled : boolean; scaleFactor: number; type: string};
    to                  ?: boolean | { enabled : boolean; scaleFactor: number; type: string};
    strikethrough       ?: boolean;
}

interface Smooth
{
    enabled             ?: boolean;
    forceDirection      ?: boolean | string;
    roundness           ?: number;
    type                ?: string;

}
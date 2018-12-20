import Graph from './../model/Graph';

export default class GraphCommand
{
    // eslint-disable-next-line
    execute(graph : Graph)    { throw "method must be overriden in derived classes"; }
    
    // eslint-disable-next-line
    undo   (graph : Graph)    { throw "method must be overriden in derived classes"; }
}
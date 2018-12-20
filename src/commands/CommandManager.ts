import Edge   from '../model/Edge'
import Node   from '../model/Node'
import Graph  from '../model/Graph'

export default interface CommandManager
{
    updateNode  (payload : {node: Node; graph: Graph}) : any
    addEdge     (payload : {edge: Edge; graph: Graph}) : any             
}
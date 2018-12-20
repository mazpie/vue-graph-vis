import AddEdgeCommand       from './AddEdgeCommand';
import AddNodeCommand       from './AddNodeCommand';
import UpdateNodeCommand    from './UpdateNodeCommand';
import DeleteNodesCommand   from './DeleteNodesCommand';
import DeleteEdgesCommand   from './DeleteEdgesCommand';
import GraphCommand         from './GraphCommand';

import CommandManager       from './CommandManager';

import Edge   from '../model/Edge';
import Node   from '../model/Node';
import Graph  from '../model/Graph';

// exporting singleton
export default new class DefaultCommandManager implements CommandManager {
  undoHistory : GraphCommand[];
  redoHistory : GraphCommand[];
  historyLength : number;

  constructor(historyLength = 50)
  {
    this.undoHistory = [];
    this.redoHistory = [];
    this.historyLength = historyLength;
  }
  
  updateHistory(command : GraphCommand)
  {
    console.log(command);
    if(this.undoHistory.length >= this.historyLength) this.undoHistory = this.undoHistory.slice(1);
    
    this.undoHistory.push( command );
    this.redoHistory = [];
  }

  undo(graph : Graph)
  {
    if(this.undoHistory.length  === 0) return;
    let commandToUndo : GraphCommand = <GraphCommand> this.undoHistory.pop();
    commandToUndo.undo( graph );
    this.redoHistory.push( commandToUndo );
  }
  
  redo(graph : Graph)
  {
    if(this.redoHistory.length === 0) return;
    let commandToRedo : GraphCommand = <GraphCommand> this.redoHistory.pop();      
    commandToRedo.execute( graph );
    this.undoHistory.push( commandToRedo );
  }

  clean()
  {
    this.undoHistory = [];
    this.redoHistory = [];
  }
  
  addNode(payload : {node: Node; graph: Graph})             
  { 
    let c = new AddNodeCommand( payload.node );
    c.execute(payload.graph);
    this.updateHistory(c);
  }

  addEdge(payload : {edge: Edge; graph: Graph})             
  { 
    let c = new AddEdgeCommand( payload.edge );
    c.execute(payload.graph);
    this.updateHistory(c);
  }

  updateNode(payload : {node: Node; graph: Graph})          
  { 
    let c = new UpdateNodeCommand( payload.node );
    c.execute(payload.graph);         
    this.updateHistory(c);
  }
  
  deleteNodes(payload : {nodeIds: string[]; graph: Graph})      
  { 
    let c = new DeleteNodesCommand( payload.nodeIds );
    c.execute(payload.graph);
    this.updateHistory(c);
  }
  
  deleteEdges(payload : {edgeIds: string[]; graph: Graph})      
  { 
    let c = new DeleteEdgesCommand( payload.edgeIds );
    c.execute(payload.graph);
    this.updateHistory(c);
  }
  
}
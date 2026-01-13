import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  applyEdgeChanges, 
  applyNodeChanges 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useRCCStore } from './store';

// Custom Node to display Metro Governance Data
const CityNode = ({ data }) => (
  <div className={`px-4 py-3 shadow-xl rounded-xl border-2 transition-all duration-500 ${
    data.isRupture 
    ? 'bg-red-950/40 border-red-500 shadow-red-500/20' 
    : 'bg-slate-900/80 border-emerald-500/50 shadow-emerald-500/10'
  }`}>
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        {data.compliance || 'AUDITING'}
      </span>
      <span className="text-sm font-bold text-white">{data.label}</span>
      <div className={`mt-1 h-1 w-full rounded-full bg-slate-800 overflow-hidden`}>
         <div 
           className={`h-full ${data.isRupture ? 'bg-red-500' : 'bg-emerald-500'}`} 
           style={{ width: `${data.faultIntensity}%` }}
         />
      </div>
      <span className="text-[9px] font-mono text-slate-400 mt-1">{data.valueDisplay}</span>
    </div>
  </div>
);

const nodeTypes = { rccNode: CityNode };

export default function RelationalGraph() {
  const { graphData, setSelectedCity } = useRCCStore();

  const onNodeClick = (event, node) => {
    setSelectedCity(node.data.label);
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={graphData.nodes}
        edges={graphData.edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        // Style the canvas for a "Grid Auditor" feel
        style={{ background: 'transparent' }}
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls showInteractive={false} className="bg-slate-900 border-slate-800 fill-slate-400" />
      </ReactFlow>
    </div>
  );
}
import React from 'react';
import { Handle, Position } from 'reactflow';
import { Cpu, Zap } from 'lucide-react';

export default function RCCNode({ data }) {
  const isCompressed = data.isCompressed;

  return (
    <div className={`px-4 py-2 shadow-lg rounded-md border-2 transition-all duration-500 ${
      isCompressed 
        ? 'bg-indigo-950 border-indigo-500 shadow-indigo-500/50' 
        : 'bg-slate-900 border-cyan-500 shadow-cyan-500/20'
    }`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-500" />
      
      <div className="flex items-center gap-2">
        {isCompressed ? (
          <Zap size={14} className="text-indigo-400 animate-pulse" />
        ) : (
          <Cpu size={14} className="text-cyan-400" />
        )}
        <div className="text-xs font-bold uppercase tracking-wider text-slate-100">
          {data.label}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-slate-500" />
    </div>
  );
}
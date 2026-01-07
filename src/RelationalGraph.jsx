import React, { useMemo, useEffect } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import { useRCCStore } from './store';
import RCCNode from './RCCNode';
import 'reactflow/dist/style.css';

const nodeTypes = { rccNode: RCCNode };

export default function RelationalGraph() {
  // 1. Pull everything from the store in one clean sweep
  const { 
    graphData, 
    compressionLevel, 
    isPredicting, 
    setCompression, 
    setPredicting 
  } = useRCCStore();

  // 2. Animation Logic: Overrides manual slider when 'Run Prediction' is clicked
  useEffect(() => {
    let interval;
    if (isPredicting) {
      let progress = 0;
      interval = setInterval(() => {
        progress += 2; 
        setCompression(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setPredicting(false); 
        }
      }, 100); // Total 5-second simulation
    }
    return () => clearInterval(interval);
  }, [isPredicting, setCompression, setPredicting]);

  // 3. Transformation Logic: f(R(X), C)
  // This memo transforms raw input nodes into compressed concepts
  const displayData = useMemo(() => {
    // Stage 2: Final Compressed State (Threshold: 80%)
    if (compressionLevel > 80) {
      return {
        nodes: [{ 
          id: 'c1', 
          type: 'rccNode', 
          data: { label: 'Compressed Concept', isCompressed: true }, 
          position: { x: 250, y: 100 } 
        }],
        edges: []
      };
    }

    // Stage 1: Raw Dynamic Entities (R(X))
    // We add a slight positional offset based on compression to simulate "gravitation"
    const dynamicNodes = graphData.nodes.map((node, index) => ({
      ...node,
      position: {
        x: node.position.x + (compressionLevel * (index % 2 === 0 ? 0.2 : -0.2)),
        y: node.position.y
      }
    }));

    return { nodes: dynamicNodes, edges: graphData.edges };
  }, [graphData, compressionLevel]);

  return (
    <div className="w-full h-full bg-slate-950">
      <ReactFlow 
        nodes={displayData.nodes} 
        edges={displayData.edges} 
        nodeTypes={nodeTypes} 
        fitView
      >
        <Background color="#1e293b" variant="dots" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
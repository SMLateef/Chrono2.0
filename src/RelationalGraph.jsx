import React, { useMemo, useEffect } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import { useRCCStore } from './store';
import RCCNode from './RCCNode';
import ChronoChart from './ChronoChart'; // Import the high-accuracy time-series
import 'reactflow/dist/style.css';

const nodeTypes = { rccNode: RCCNode };

export default function RelationalGraph() {
  const { 
    graphData, 
    compressionLevel, 
    isPredicting, 
    setCompression, 
    setPredicting,
    setCurrentTime,
    volatilityData,
    currentTime
  } = useRCCStore();

  // 1. AUTOMATION LOGIC
  // Syncs the timeline and compression during the 'Full Projection' sequence
  useEffect(() => {
    let interval;
    if (isPredicting) {
      let progress = 0;
      let startYear = 2021;
      
      interval = setInterval(() => {
        progress += 2; 
        setCompression(progress);
        
        // Sync time axis with animation progress
        if (progress % 20 === 0 && startYear < 2026) {
          startYear++;
          setCurrentTime(startYear);
        }
        
        if (progress >= 100) {
          clearInterval(interval);
          setPredicting(false); 
        }
      }, 80); 
    }
    return () => clearInterval(interval);
  }, [isPredicting, setCompression, setPredicting, setCurrentTime]);

  // 2. TOPOLOGY TRANSFORMATION
  const displayData = useMemo(() => {
    const currentStatus = volatilityData[currentTime]?.status;

    // If a rupture is detected at this time, add jitter/volatility to nodes
    const dynamicNodes = graphData.nodes.map((node, index) => {
      const jitter = currentStatus === "Rupture" ? (Math.random() - 0.5) * 40 : 0;
      
      return {
        ...node,
        position: {
          x: node.position.x + (compressionLevel * (index % 2 === 0 ? 0.2 : -0.2)) + jitter,
          y: node.position.y + jitter
        },
        // Visual feedback for rupture state on nodes
        data: { 
          ...node.data, 
          isRupture: currentStatus === "Rupture" 
        }
      };
    });

    return { nodes: dynamicNodes, edges: graphData.edges };
  }, [graphData, compressionLevel, volatilityData, currentTime]);

  return (
    <div className="w-full h-full bg-slate-950 relative overflow-hidden">
      
      {/* LAYER 0: The Highly Accurate Time-Series Plot (Background) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ChronoChart />
      </div>

      {/* LAYER 1: Relational Topology (Foreground) */}
      <div className="absolute inset-0 z-10">
        <ReactFlow 
          nodes={displayData.nodes} 
          edges={displayData.edges} 
          nodeTypes={nodeTypes} 
          fitView
          // Precision settings: prevent accidental zoom from breaking the visual sync
          minZoom={0.5}
          maxZoom={1.5}
          zoomOnScroll={false}
          panOnDrag={true}
          elementsSelectable={true}
        >
          {/* Subtle dots background to give depth between the chart and nodes */}
          <Background color="#0f172a" variant="dots" gap={25} size={1} />
          <Controls showInteractive={false} className="bg-slate-900 border-slate-700 fill-slate-400" />
        </ReactFlow>
      </div>

      {/* OPTIONAL: Scan-line overlay for "AI Processing" aesthetic */}
      {isPredicting && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-20 w-full animate-scan z-20" />
      )}
    </div>
  );
}
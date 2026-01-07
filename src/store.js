import { create } from 'zustand';

// Simple parser utility to generate nodes from raw text
const parseInputToNodes = (text) => {
  if (!text) return { nodes: [], edges: [] };
  
  const tokens = text.split(/\s+/).filter(word => word.length > 3);
  const uniqueEntities = [...new Set(tokens.map(t => t.replace(/[.,]/g, '')))].slice(0, 6);
  
  const nodes = uniqueEntities.map((label, index) => ({
    id: `node-${index}`,
    type: 'rccNode',
    data: { label: label.charAt(0).toUpperCase() + label.slice(1) },
    position: { x: index * 180, y: (index % 2 === 0 ? 50 : -50) }, 
  }));

  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `edge-${i}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      animated: true,
      style: { stroke: '#06b6d4' }
    });
  }

  return { nodes, edges };
};

export const useRCCStore = create((set, get) => ({
  // --- STATE ---
  compressionLevel: 0,
  isPredicting: false,
  currentTime: 2021, 
  rawText: "Doctor prescribes Medicine to Patient",
  graphData: parseInputToNodes("Doctor prescribes Medicine to Patient"),

  // --- ACTIONS ---
  setCompression: (val) => set({ compressionLevel: val }),
  
  setPredicting: (val) => set({ isPredicting: val }),

  setCurrentTime: (year) => set({ currentTime: year }),

  setRawText: (text) => set({ 
    rawText: text,
    graphData: parseInputToNodes(text) 
  }),

  // --- ANALYTICAL LOGIC ---
  getPredictedValue: (year) => {
    const { graphData, compressionLevel } = get();
    const baseValue = 1250.00; 
    const timeFactor = (year - 2021) * 0.15; 
    const efficiencyFactor = (compressionLevel / 100) * 0.25;
    const complexityFactor = graphData.nodes.length * 0.05;

    const totalValue = baseValue * (1 + timeFactor + efficiencyFactor + complexityFactor);
    
    return totalValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  resetSystem: () => set({
    compressionLevel: 0,
    currentTime: 2021,
    isPredicting: false
  })
})); // <-- This closes the create function
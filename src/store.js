import { create } from 'zustand';

// Current USD to INR conversion rate (Jan 2026)
const USD_TO_INR = 89.94; 

/**
 * Normalizes values to a Y-coordinate system
 * @param {number} value - The raw price/value
 * @param {number} min - Minimum value in the set
 * @param {number} max - Maximum value in the set
 * @param {number} height - The total height of the graph area
 */
const getYCoordinate = (value, min, max, height = 400) => {
  if (max === min) return height / 2;
  // We subtract from height because SVG/ReactFlow (0,0) is top-left
  return height - ((value - min) / (max - min)) * height;
};

const processMarketDynamics = (rawData) => {
  const volatilityMap = {};
  const nodes = [];
  const edges = [];
  
  // Calculate INR values and min/max for coordinate mapping
  const pointsWithINR = rawData.map(p => ({ ...p, valueINR: p.value * USD_TO_INR }));
  const inrValues = pointsWithINR.map(p => p.valueINR);
  const minVal = Math.min(...inrValues);
  const maxVal = Math.max(...inrValues);

  pointsWithINR.forEach((point, i) => {
    let status = "Stable";
    let score = 20;

    if (i > 0) {
      const change = Math.abs((point.value - pointsWithINR[i-1].value) / pointsWithINR[i-1].value);
      if (change > 0.40) { status = "Rupture"; score = 95; }
      else if (change > 0.15) { status = "Volatile"; score = 55; }
    }

    volatilityMap[point.year] = { 
      score, 
      status, 
      valueINR: point.valueINR,
      desc: status === "Rupture" ? "Significant Valuation Breach" : "Normal Market Flow" 
    };

    // --- ACCURATE XY PLOTTING ---
    // X-axis: Time progression (250px intervals)
    // Y-axis: Precise Valuation height in INR
    nodes.push({
      id: `n${point.year}`,
      type: 'rccNode',
      data: { 
        label: `${point.year}`,
        valueDisplay: new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(point.valueINR),
        isRupture: status === "Rupture"
      },
      position: { 
        x: i * 250, 
        y: getYCoordinate(point.valueINR, minVal, maxVal) 
      }
    });

    if (i > 0) {
      edges.push({
        id: `e${i}`,
        source: `n${pointsWithINR[i-1].year}`,
        target: `n${point.year}`,
        animated: status === "Rupture",
        style: { stroke: status === "Rupture" ? "#ef4444" : "#06b6d4", strokeWidth: 2 }
      });
    }
  });

  return { volatilityMap, nodes, edges, pointsWithINR };
};

export const useRCCStore = create((set, get) => ({
  rawText: "",
  isPredicting: false,
  currentTime: 2021,
  graphData: { nodes: [], edges: [] },
  volatilityData: {}, 
  historicalPoints: [], 

  setCurrentTime: (year) => set({ currentTime: year }),
  setCompression: (val) => set({ compressionLevel: val }),

  analyzeTopic: async (topic) => {
    if (!topic) return;
    set({ isPredicting: true, rawText: topic });

    try {
      // Simulate/Fetch Data
      const rawData = await simulateInternetFetch(topic); 
      const { volatilityMap, nodes, edges, pointsWithINR } = processMarketDynamics(rawData);

      set({ 
        historicalPoints: pointsWithINR,
        volatilityData: volatilityMap,
        graphData: { nodes, edges },
        isPredicting: false 
      });
    } catch (error) {
      console.error("Analysis Failed", error);
      set({ isPredicting: false });
    }
  },

  getPredictedValue: (year) => {
    const data = get().volatilityData[year];
    if (!data) return "₹0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(data.valueINR);
  }
}));

async function simulateInternetFetch(topic) {
  await new Promise(r => setTimeout(r, 1200));
  return [
    { year: 2021, value: 100 + Math.random() * 20 },
    { year: 2022, value: 250 + Math.random() * 50 }, 
    { year: 2023, value: 210 + Math.random() * 30 },
    { year: 2024, value: 115 + Math.random() * 20 }, 
    { year: 2025, value: 380 + Math.random() * 60 },
    { year: 2026, value: 440 + Math.random() * 40 }
  ];
}
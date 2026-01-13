import { create } from 'zustand';
import { getUrbanVerdict } from './services/aiAgent'; 

/**
 * Normalizes scores (0-100) to the Y-axis.
 */
const getYCoordinate = (score, height = 400) => {
  return height - (score / 100) * height;
};

/**
 * Logic Engine: Converts city telemetry into governance status and graph nodes.
 */
const processUrbanDynamics = (enrichedData) => {
  const cityMetrics = {};
  const nodes = [];
  const edges = [];
  
  enrichedData.forEach((city, i) => {
    const { metrics } = city;

    // 1. COMPOSITE FAULT SCORE CALCULATION
    // Higher Score = Poorer Governance. 
    // We normalize each metric to a 0-100 scale then apply weights.
    const faultScore = Math.min(100, (
        (metrics.aqi / 500) * 30 +        // 30% Weight: Environment
        (metrics.transport / 60) * 25 +   // 25% Weight: Infrastructure
        (metrics.crime / 100) * 20 +      // 20% Weight: Safety
        (metrics.poverty / 50) * 15 +     // 15% Weight: Social
        (Math.max(0, 10 - metrics.growth) * 1.5) // 10% Weight: Economic Stagnation
    ));

    const status = faultScore > 70 ? "Critical" : faultScore > 40 ? "Strained" : "Stable";

    // 2. DATA MAPPING FOR STATE
    cityMetrics[city.name.toLowerCase()] = { 
      score: faultScore.toFixed(1), 
      status, 
      metrics: city.metrics,
      aiVerdict: city.aiVerdict, 
      reasons: city.aiVerdict?.reasons || ["Audit trail synchronized."]
    };

    // 3. GRAPH TOPOLOGY
    nodes.push({
      id: city.id,
      type: 'rccNode',
      data: { 
        label: city.name,
        valueDisplay: `FAULT_INDEX: ${faultScore.toFixed(1)}%`,
        faultIntensity: faultScore,
        isRupture: status === "Critical",
        compliance: city.aiVerdict?.compliance
      },
      // Quadrant Positioning based on i (X) and Governance Health (Y)
      position: { x: i * 350, y: getYCoordinate(faultScore) }
    });

    if (i > 0) {
      edges.push({
        id: `e${i}`,
        source: enrichedData[i-1].id,
        target: city.id,
        animated: status === "Critical",
        style: { stroke: status === "Critical" ? "#ef4444" : "#10b981", strokeWidth: 2 }
      });
    }
  });

  return { cityMetrics, nodes, edges };
};

export const useRCCStore = create((set, get) => ({
  isPredicting: false,
  selectedCity: "Mumbai", 
  graphData: { nodes: [], edges: [] },
  volatilityData: {}, 

  // Sets the global focus on a specific metro
  setSelectedCity: (cityName) => set({ selectedCity: cityName }),

  analyzeMetros: async () => {
    set({ isPredicting: true });

    try {
      // 1. FETCH: Telemetry from cities
      const rawData = await simulateUrbanDataFetch(); 

      // 2. ENRICH: Parallel AI Auditing for each city
      const enrichedData = await Promise.all(rawData.map(async (city) => {
        const verdict = await getUrbanVerdict(city.name, city.metrics);
        return { ...city, aiVerdict: verdict };
      }));

      // 3. PROCESS: Generate final metrics and graph state
      const { cityMetrics, nodes, edges } = processUrbanDynamics(enrichedData);

      set({ 
        volatilityData: cityMetrics,
        graphData: { nodes, edges },
        isPredicting: false 
      });
    } catch (error) {
      console.error("Critical State Failure:", error);
      set({ isPredicting: false });
    }
  }
}));

/**
 * Institutional Data Mock for 4 Metros
 */
async function simulateUrbanDataFetch() {
  await new Promise(r => setTimeout(r, 1200));
  return [
    { id: 'mumbai', name: 'Mumbai', metrics: { crime: 42, poverty: 20, aqi: 160, transport: 45, growth: 7.2 } },
    { id: 'delhi', name: 'Delhi', metrics: { crime: 58, poverty: 15, aqi: 380, transport: 50, growth: 6.8 } },
    { id: 'bangalore', name: 'Bangalore', metrics: { crime: 30, poverty: 12, aqi: 95, transport: 55, growth: 8.4 } },
    { id: 'hyderabad', name: 'Hyderabad', metrics: { crime: 28, poverty: 18, aqi: 110, transport: 35, growth: 7.9 } }
  ];
}
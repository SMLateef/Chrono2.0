export const calculateTrend = (history) => {
  // history = Array of previous graph states
  const nodeGrowth = history.map(h => h.nodes.length);
  const edgeDensity = history.map(h => h.edges.length);
  
  // Calculate if the system is becoming more "Complex" or more "Compressed"
  const complexityTrend = edgeDensity[edgeDensity.length - 1] > edgeDensity[0] ? 'Expanding' : 'Compressing';
  
  return {
    velocity: (edgeDensity[edgeDensity.length - 1] - edgeDensity[0]) / history.length,
    state: complexityTrend
  };
};
export const parseInputToNodes = (text) => {
  // 1. Clean and tokenize the text
  const tokens = text.split(/\s+/).filter(word => word.length > 3);
  
  // 2. Identify "Significant Entities" (simple heuristic: unique words > 3 chars)
  const uniqueEntities = [...new Set(tokens.map(t => t.replace(/[.,]/g, '')))].slice(0, 5);
  
  // 3. Generate Nodes
  const nodes = uniqueEntities.map((label, index) => ({
    id: `node-${index}`,
    type: 'rccNode',
    data: { label: label.charAt(0).toUpperCase() + label.slice(1) },
    // Arrange nodes in a circular or grid pattern
    position: { x: index * 200, y: Math.sin(index) * 50 }, 
  }));

  // 4. Generate Edges (Sequential relations for this prototype)
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `edge-${i}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      animated: true,
      label: 'relation',
      style: { stroke: '#06b6d4' }
    });
  }

  return { nodes, edges };
};
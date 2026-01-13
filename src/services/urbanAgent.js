// src/services/urbanAgent.js
const URBAN_PROMPT = (city, metrics) => `
  Act as an Urban Governance Auditor for ${city}.
  Analyze these metrics:
  - Crime Rate Index
  - Poverty/Growth Ratio
  - AQI (Air Quality)
  - Transport Speed (5km/30min)

  Identify "Governance Ruptures"—points where infrastructure fails to meet population demand.
  Check for Ethical Governance: Is the growth sustainable or exploitative?
`;
const conditions = require("../data/conditions.json");

function detectConditions(text) {
  if (!text || text.trim() === "") {
    console.log('[conditionDetector] Empty input → returning ["general"]');
    return ["general"];
  }

  const lower = text.toLowerCase();
  const scores = {};

  for (const [keyword, condition] of Object.entries(conditions)) {
    if (lower.includes(keyword)) {
      scores[condition] = (scores[condition] || 0) + 1;
      console.log(
        `[conditionDetector] Keyword matched: "${keyword}" → ${condition} (score: ${scores[condition]})`,
      );
    }
  }

  if (Object.keys(scores).length === 0) {
    console.log(
      '[conditionDetector] No keywords matched → returning ["general"]',
    );
    return ["general"];
  }

  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([condition]) => condition);

  console.log("[conditionDetector] Final ranked conditions:", sorted);
  return sorted;
}

// Keep backward-compatible single export too
function detectCondition(text) {
  return detectConditions(text)[0];
}

module.exports = { detectConditions, detectCondition };

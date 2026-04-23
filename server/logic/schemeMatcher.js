const schemes = require('../data/schemes.json');

function matchSchemes(conditions, state, bpl, income) {
  // Accept both array and string for backward compatibility
  const conditionList = Array.isArray(conditions) ? conditions : [conditions];

  console.log(`[schemeMatcher] conditions=${JSON.stringify(conditionList)}, state=${state}, bpl=${bpl}, income=${income}`);

  const seen = new Set();
  const results = [];

  for (const condition of conditionList) {
    for (const scheme of schemes) {
      // Skip duplicates
      if (seen.has(scheme.id)) continue;

      // Rule 1: Condition must match
      const conditionMatch = scheme.condition.includes(condition);
      if (!conditionMatch) continue;

      // Rule 2: State must match or scheme covers all states
      const stateMatch =
        !state ||
        scheme.states.includes('all') ||
        scheme.states.includes(state);
      if (!stateMatch) continue;

      // Rule 3: If scheme requires BPL, user must have BPL card
      if (scheme.bpl_required === true && bpl !== true) continue;

      // Rule 4: Income limit check
      if (
        scheme.income_limit !== null &&
        income !== undefined &&
        income !== null &&
        !isNaN(Number(income))
      ) {
        if (Number(income) > scheme.income_limit) continue;
      }

      seen.add(scheme.id);
      results.push({
        ...scheme,
        matched_condition: condition
      });
    }
  }

  console.log(`[schemeMatcher] Total schemes matched: ${results.length}`);
  return results;
}

module.exports = { matchSchemes };

const hospitals = require('../data/hospitals.json');

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const toRad = deg => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

function filterHospitals(conditions, state, userLat, userLng) {
  // Accept both array and string
  const conditionList = Array.isArray(conditions) ? conditions : [conditions];

  console.log(`[hospitalFilter] conditions=${JSON.stringify(conditionList)}, state=${state}, userLat=${userLat}, userLng=${userLng}`);

  // Step 1: Match hospitals by any condition in the list
  let filtered = hospitals.filter(h =>
    conditionList.some(c => h.speciality.includes(c))
  );

  // Step 2: Prefer same state — fall back to all if not enough
  if (state) {
    const stateFiltered = filtered.filter(h => h.state === state);
    if (stateFiltered.length > 0) {
      filtered = stateFiltered;
    }
  }

  // Step 3: Add distance if user coordinates provided
  if (
    userLat !== undefined && userLat !== null &&
    userLng !== undefined && userLng !== null &&
    !isNaN(Number(userLat)) && !isNaN(Number(userLng))
  ) {
    filtered = filtered.map(h => ({
      ...h,
      distance_km: haversineDistance(
        Number(userLat), Number(userLng),
        h.lat, h.lng
      )
    }));

    // Sort by nearest first
    filtered.sort((a, b) => a.distance_km - b.distance_km);
    console.log('[hospitalFilter] Sorted by distance');
  }

  const result = filtered.slice(0, 3);
  console.log(`[hospitalFilter] Returning ${result.length} hospital(s)`);
  return result;
}

module.exports = { filterHospitals };

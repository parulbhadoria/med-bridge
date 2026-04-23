const express = require('express');
const router = express.Router();
const axios = require('axios');

const { detectConditions } = require('../logic/conditionDetector');
const { matchSchemes } = require('../logic/schemeMatcher');
const { filterHospitals } = require('../logic/hospitalFilter');
const { translateText } = require('../utils/translate');

async function pincodeToCoords(pincode) {
  if (!pincode || String(pincode).trim() === '') return { lat: null, lng: null };

  const cleanPin = String(pincode).trim().replace(/\D/g, '');
  if (cleanPin.length !== 6) return { lat: null, lng: null };

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        postalcode: cleanPin,
        country: 'India',
        format: 'json',
        limit: 1
      },
      headers: { 'User-Agent': 'MedBridge/2.0 (medbridge-app)' },
      timeout: 5000
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      console.log(`[search/pincodeToCoords] Pincode ${cleanPin} → lat: ${lat}, lng: ${lon}`);
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
  } catch (err) {
    console.error('[search/pincodeToCoords] Failed:', err.message);
  }

  return { lat: null, lng: null };
}

router.post('/search', async (req, res) => {
  try {
    console.log('\n[/api/search] Incoming request:', req.body);

    const { query, state, bpl, income, lang, pincode } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Step 1: Translate if non-English
    let translatedQuery = query;
    if (lang && lang !== 'en') {
      translatedQuery = await translateText(query, 'en');
    }
    console.log('[/api/search] Translated query:', translatedQuery);

    // Step 2: Detect multiple conditions
    const conditions = detectConditions(translatedQuery);
    console.log('[/api/search] Detected conditions:', conditions);

    // Step 3: Match schemes for all conditions
    const schemes = matchSchemes(conditions, state, bpl, income);
    console.log('[/api/search] Schemes matched:', schemes.length);

    // Step 4: Resolve pincode to coordinates (if provided)
    let userLat = null;
    let userLng = null;

    if (pincode) {
      const coords = await pincodeToCoords(pincode);
      userLat = coords.lat;
      userLng = coords.lng;
    }

    // Step 5: Filter and sort hospitals
    const hospitals = filterHospitals(conditions, state, userLat, userLng);
    console.log('[/api/search] Hospitals returned:', hospitals.length);

    return res.json({
      conditions,
      condition: conditions[0],           // backward-compatible single field
      translated_query: translatedQuery,
      schemes,
      hospitals,
      meta: {
        total_schemes: schemes.length,
        total_hospitals: hospitals.length,
        location_resolved: userLat !== null
      }
    });

  } catch (err) {
    console.error('[/api/search] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;

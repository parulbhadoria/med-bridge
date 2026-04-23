const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/locate', async (req, res) => {
  const { pincode } = req.query;

  if (!pincode || pincode.trim() === '') {
    return res.status(400).json({ error: 'Pincode is required' });
  }

  const cleanPin = pincode.trim().replace(/\D/g, '');

  if (cleanPin.length !== 6) {
    return res.status(400).json({ error: 'Enter a valid 6-digit Indian pincode' });
  }

  console.log(`[/api/locate] Looking up pincode: ${cleanPin}`);

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          postalcode: cleanPin,
          country: 'India',
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'MedBridge/2.0 (medbridge-app)'
        },
        timeout: 6000
      }
    );

    if (!response.data || response.data.length === 0) {
      console.log(`[/api/locate] No result for pincode ${cleanPin}`);
      return res.json({ lat: null, lng: null, found: false });
    }

    const { lat, lon, display_name } = response.data[0];

    console.log(`[/api/locate] Found: ${display_name} → lat: ${lat}, lng: ${lon}`);

    return res.json({
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      display_name,
      found: true
    });

  } catch (err) {
    console.error('[/api/locate] Error:', err.message);
    return res.json({ lat: null, lng: null, found: false });
  }
});

module.exports = router;

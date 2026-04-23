const { translate } = require('@vitalets/google-translate-api');

async function translateText(text, to = 'en') {
  try {
    const result = await translate(text, { to });
    console.log(`[translate] Translated: "${text}" → "${result.text}"`);
    return result.text;
  } catch (err) {
    console.error('[translate] Failed, using original text:', err.message);
    return text; // Safe fallback — never crash
  }
}

module.exports = { translateText };

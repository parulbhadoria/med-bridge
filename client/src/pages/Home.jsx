import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EXAMPLES = [
  { label: 'Dialysis',    query: 'My father needs kidney dialysis' },
  { label: 'Pregnancy',   query: 'My wife is pregnant, need free delivery' },
  { label: 'TB / Cough',  query: 'Coughing for months, suspected tuberculosis' },
  { label: 'Diabetes',    query: 'Managing blood sugar, need diabetes support' },
  { label: 'Mental Health', query: 'Feeling depressed and anxious, need help' },
  { label: 'Child Health', query: 'Baby needs vaccination and health checkup' },
];

const STATES = [
  'Delhi', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Tamil Nadu',
];

export default function Home() {
  const navigate  = useNavigate();

  const [query,   setQuery]   = useState('');
  const [pincode, setPincode] = useState('');
  const [state,   setState]   = useState('Delhi');
  const [bpl,     setBpl]     = useState(false);
  const [income,  setIncome]  = useState('');
  const [err,     setErr]     = useState('');

  function handleChip(q) { setQuery(q); }

  function validate() {
    if (!query.trim()) { setErr('Please describe your health problem.'); return false; }
    if (pincode && !/^\d{6}$/.test(pincode.trim())) {
      setErr('Pincode must be exactly 6 digits.'); return false;
    }
    setErr('');
    return true;
  }

  function handleSearch() {
    if (!validate()) return;
    navigate('/results', {
      state: {
        query:   query.trim(),
        pincode: pincode.trim(),
        state,
        bpl,
        income: income ? Number(income) : undefined,
        lang: 'en',
      },
    });
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); }
  }

  return (
    <div className="home">

      {/* ── NAV ── */}
      <nav className="home__nav">
        <span className="home__nav-brand">🏥 MedBridge</span>
        <span className="home__nav-tag">Free · Multilingual · Instant</span>
      </nav>

      {/* ── HERO ── */}
      <header className="home__hero">
        <h1 className="home__hero-title">
          Healthcare schemes,<br />
          <span className="home__hero-accent">found in seconds.</span>
        </h1>
        <p className="home__hero-sub">
          Describe your health problem. We match you to free government schemes,
          required documents, and nearby hospitals — instantly.
        </p>
      </header>

      {/* ── SEARCH CARD ── */}
      <section className="home__card-wrap">
        <div className="home__card">

          {/* query */}
          <label className="field-label">Describe health problem</label>
          <textarea
            className="field-textarea"
            placeholder="e.g. My father needs kidney dialysis…"
            value={query}
            rows={3}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />

          {/* example chips */}
          <div className="chip-row">
            <span className="chip-row__label">Try:</span>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className="chip"
                onClick={() => handleChip(ex.query)}
              >
                {ex.label}
              </button>
            ))}
          </div>

          {/* grid of small fields */}
          <div className="home__fields">
            <div className="field-group">
              <label className="field-label">State</label>
              <select
                className="field-select"
                value={state}
                onChange={e => setState(e.target.value)}
              >
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">
                Pincode
                <span className="field-hint"> (for nearest hospitals)</span>
              </label>
              <input
                className="field-input"
                type="text"
                placeholder="e.g. 110001"
                maxLength={6}
                value={pincode}
                onChange={e => setPincode(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">
                Annual Income ₹
                <span className="field-hint"> (optional)</span>
              </label>
              <input
                className="field-input"
                type="number"
                placeholder="e.g. 150000"
                min={0}
                value={income}
                onChange={e => setIncome(e.target.value)}
              />
            </div>

            <div className="field-group field-group--center">
              <label className="bpl-label">
                <input
                  type="checkbox"
                  checked={bpl}
                  onChange={e => setBpl(e.target.checked)}
                  className="bpl-checkbox"
                />
                <span>BPL Cardholder</span>
              </label>
              <p className="field-hint" style={{ marginTop: 4 }}>
                Unlocks additional schemes
              </p>
            </div>
          </div>

          {/* error */}
          {err && <p className="home__error">⚠️ {err}</p>}

          {/* submit */}
          <button className="home__btn" onClick={handleSearch}>
            🔍 Find Schemes
          </button>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="trust-strip">
        {[
          { icon: '🏛️', text: '6+ Schemes Covered' },
          { icon: '🏥', text: 'Verified Hospitals' },
          { icon: '🆓', text: '100% Free Service' },
          { icon: '🌐', text: 'Hindi + English' },
        ].map((item, i) => (
          <React.Fragment key={i}>
            <div className="trust-item">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
            {i < 3 && <div className="trust-divider" />}
          </React.Fragment>
        ))}
      </section>

      <footer className="home__footer">
        MedBridge · Connecting citizens to free government healthcare
      </footer>
    </div>
  );
}

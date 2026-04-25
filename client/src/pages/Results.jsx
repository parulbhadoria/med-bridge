import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SchemeCard    from '../components/SchemeCard';
import HospitalCard  from '../components/HospitalCard';
import ConditionBadge from '../components/ConditionBadge';

export default function Results() {
  const navigate = useNavigate();
  const { state: navState } = useLocation();

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Guard: no search params → send home
  useEffect(() => {
    if (!navState?.query) {
      navigate('/', { replace: true });
    }
  }, [navState, navigate]);

  // Fetch results
  useEffect(() => {
    if (!navState?.query) return;

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const payload = {
          query:   navState.query,
          state:   navState.state   || 'Delhi',
          bpl:     navState.bpl     || false,
          lang:    navState.lang    || 'en',
          pincode: navState.pincode || undefined,
          income:  navState.income  || undefined,
        };
        const res = await axios.post('/api/search', payload);
        if (!cancelled) setData(res.data);
      } catch (e) {
        if (!cancelled)
          setError(
            e?.response?.data?.error ||
            'Something went wrong. Please try again.'
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [navState]);

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="fullscreen-center">
        <div className="big-spinner" />
        <p className="loading-title">Finding schemes for you…</p>
        <p className="loading-sub">Checking eligibility across government programmes</p>
      </div>
    );
  }

  /* ── ERROR ── */
  if (error) {
    return (
      <div className="fullscreen-center">
        <span style={{ fontSize: 48 }}>⚠️</span>
        <h2 style={{ marginTop: 12 }}>Something went wrong</h2>
        <p style={{ color: '#666', margin: '8px 0 20px' }}>{error}</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { conditions = [], schemes = [], hospitals = [], meta = {} } = data;
  const topScheme = schemes[0] || null;

  return (
    <div className="results-page">

      {/* ── STICKY HEADER ── */}
      <header className="results-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← New Search
        </button>
        <span className="results-header__brand">🏥 MedBridge</span>
        <div className="results-header__badges">
          {meta.location_resolved && (
            <span className="header-pill header-pill--green">📍 Sorted by distance</span>
          )}
          <span className="header-pill header-pill--blue">
            {schemes.length} scheme{schemes.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </header>

      <main className="results-main">

        {/* ── QUERY ECHO ── */}
        <div className="results-echo">
          Showing results for: <em>"{navState.query}"</em>
          {navState.state && <span> · {navState.state}</span>}
          {navState.bpl   && <span> · BPL</span>}
        </div>

        {/* ── CONDITIONS ── */}
        <section className="results-section">
          <h2 className="results-section__title">🧠 Detected Conditions</h2>
          {conditions.length === 0 ? (
            <p className="muted">No specific condition detected.</p>
          ) : (
            <div className="conditions-row">
              {conditions.map((c, i) => (
                <ConditionBadge key={c} condition={c} isPrimary={i === 0} />
              ))}
            </div>
          )}
        </section>

        {/* ── TOP RECOMMENDATION BANNER ── */}
        {topScheme && (
          <div className="top-rec-banner">
            <div className="top-rec-banner__label">⭐ Top Recommendation</div>
            <div className="top-rec-banner__body">
              <div className="top-rec-banner__left">
                <h3 className="top-rec-banner__name">{topScheme.name_en}</h3>
                <p className="top-rec-banner__desc">{topScheme.description_en}</p>
              </div>
              <div className="top-rec-banner__stats">
                <div className="stat-box">
                  <span className="stat-box__num">{topScheme.documents.length}</span>
                  <span className="stat-box__lbl">Docs needed</span>
                </div>
                <div className="stat-box">
                  <span className="stat-box__num">{hospitals.length}</span>
                  <span className="stat-box__lbl">Hospitals</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TWO-COLUMN RESULTS ── */}
        <div className="results-cols">

          {/* LEFT — SCHEMES */}
          <section className="results-col">
            <div className="col-header">
              <h2 className="col-header__title">💊 Government Schemes</h2>
              <span className="col-header__count">{schemes.length} found</span>
            </div>

            {schemes.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state__icon">🔍</span>
                <p className="empty-state__title">No schemes matched</p>
                <p className="empty-state__hint">
                  Try keywords like "dialysis", "pregnancy", "TB", or "diabetes"
                </p>
                <button className="retry-btn" onClick={() => navigate('/')}>
                  Try Different Search
                </button>
              </div>
            ) : (
              <div className="cards-stack">
                {schemes.map((s, i) => (
                  <div
                    key={s.id}
                    className="card-anim"
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    <SchemeCard scheme={s} lang="en" isTop={i === 0} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* RIGHT — HOSPITALS + DOC CHECKLIST */}
          <section className="results-col">
            <div className="col-header">
              <h2 className="col-header__title">🏥 Nearby Hospitals</h2>
              <span className="col-header__count">{hospitals.length} found</span>
            </div>

            {hospitals.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state__icon">🏥</span>
                <p className="empty-state__title">No hospitals found</p>
                <p className="empty-state__hint">Try selecting a different state</p>
              </div>
            ) : (
              <div className="cards-stack">
                {hospitals.map((h, i) => (
                  <div
                    key={h.id}
                    className="card-anim"
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    <HospitalCard hospital={h} />
                  </div>
                ))}
              </div>
            )}

            {/* DOCUMENT CHECKLIST from top scheme */}
            {topScheme && (
              <div className="doc-checklist">
                <h3 className="doc-checklist__title">
                  📋 Documents for {topScheme.name_en}
                </h3>
                <ul className="doc-checklist__list">
                  {topScheme.documents.map((doc, i) => (
                    <li key={i} className="doc-checklist__item">
                      <span className="doc-checklist__check">✓</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
                <p className="doc-checklist__apply">📍 {topScheme.apply_at}</p>
              </div>
            )}
          </section>

        </div>
      </main>

      <footer className="results-footer">
        MedBridge · Free government healthcare discovery ·
        Data sourced from official government portals
      </footer>
    </div>
  );
}

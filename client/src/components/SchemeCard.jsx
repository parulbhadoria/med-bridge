import React, { useState } from 'react';
import ConditionBadge from './ConditionBadge';

export default function SchemeCard({ scheme, lang = 'en', isTop = false }) {
  const [open, setOpen] = useState(false);

  const name        = lang === 'hi' ? scheme.name_hi        : scheme.name_en;
  const description = lang === 'hi' ? scheme.description_hi : scheme.description_en;

  return (
    <div className={`scheme-card ${isTop ? 'scheme-card--top' : ''}`}>
      {isTop && <div className="scheme-card__top-tag">⭐ Best Match</div>}

      <div className="scheme-card__header">
        <h3 className="scheme-card__name">{name}</h3>
        <div className="scheme-card__pills">
          {scheme.bpl_required && (
            <span className="pill pill--bpl">BPL Required</span>
          )}
          {scheme.income_limit && (
            <span className="pill pill--income">
              ≤ ₹{Number(scheme.income_limit).toLocaleString('en-IN')}
            </span>
          )}
          {!scheme.bpl_required && !scheme.income_limit && (
            <span className="pill pill--free">Open to All</span>
          )}
        </div>
      </div>

      {scheme.matched_condition && (
        <div className="scheme-card__condition">
          <ConditionBadge condition={scheme.matched_condition} />
        </div>
      )}

      <p className="scheme-card__desc">{description}</p>

      <button
        className="scheme-card__toggle"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        {open ? '▲ Hide Documents' : '▼ View Required Documents'}
      </button>

      {open && (
        <div className="scheme-card__docs">
          <ul className="doc-list">
            {scheme.documents.map((doc, i) => (
              <li key={i} className="doc-list__item">
                <span className="doc-list__check">✓</span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
          <p className="scheme-card__apply">📍 {scheme.apply_at}</p>
        </div>
      )}
    </div>
  );
}

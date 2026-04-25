import React from 'react';

const CONDITION_META = {
  kidney_disease: { label: 'Kidney Disease',   icon: '🫁', bg: '#e8f0fe', color: '#1a73e8' },
  cancer:         { label: 'Cancer',            icon: '🔬', bg: '#fce8e6', color: '#c62828' },
  heart_disease:  { label: 'Heart Disease',     icon: '❤️', bg: '#fce8e6', color: '#d32f2f' },
  diabetes:       { label: 'Diabetes',          icon: '💉', bg: '#fff3e0', color: '#e65100' },
  tuberculosis:   { label: 'Tuberculosis',      icon: '🫁', bg: '#f3e5f5', color: '#7b1fa2' },
  maternity:      { label: 'Maternity',         icon: '🤰', bg: '#fce4ec', color: '#c2185b' },
  child_health:   { label: 'Child Health',      icon: '👶', bg: '#e8f5e9', color: '#2e7d32' },
  mental_health:  { label: 'Mental Health',     icon: '🧠', bg: '#e3f2fd', color: '#1565c0' },
  eye_disease:    { label: 'Eye Disease',       icon: '👁️', bg: '#f3e5f5', color: '#6a1b9a' },
  trauma:         { label: 'Trauma / Injury',   icon: '🩹', bg: '#fff8e1', color: '#f57f17' },
  general:        { label: 'General',           icon: '🏥', bg: '#f5f5f5', color: '#616161' },
};

export default function ConditionBadge({ condition, isPrimary = false }) {
  const meta = CONDITION_META[condition] || CONDITION_META.general;

  return (
    <span
      className={`condition-badge ${isPrimary ? 'condition-badge--primary' : ''}`}
      style={{ background: meta.bg, color: meta.color }}
    >
      <span className="condition-badge__icon">{meta.icon}</span>
      <span className="condition-badge__label">{meta.label}</span>
    </span>
  );
}

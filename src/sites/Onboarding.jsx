import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ob-root {
    min-height: 100vh;
    background: #0a0f1e;
    font-family: 'Geist', system-ui, sans-serif;
    display: flex;
    flex-direction: column;
  }

  /* ── Progress bar ── */
  .ob-progress-bar {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: rgba(255,255,255,0.06);
    z-index: 100;
  }

  .ob-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #a78bfa, #6366f1);
    background-size: 200% 100%;
    animation: ob-shimmer 2s linear infinite;
    border-radius: 0 99px 99px 0;
    transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
  }

  @keyframes ob-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Top nav ── */
  .ob-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 32px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(10,15,30,0.8);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .ob-logo {
    font-size: 15px;
    font-weight: 800;
    color: white;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ob-logo-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6366f1;
    box-shadow: 0 0 8px #6366f1;
  }

  .ob-step-indicator {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.05em;
  }

  /* ── Main layout ── */
  .ob-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    position: relative;
  }

  /* Ambient background glow */
  .ob-body::before {
    content: '';
    position: fixed;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Welcome screen ── */
  .ob-welcome {
    text-align: center;
    max-width: 520px;
    width: 100%;
    animation: ob-up 0.6s ease both;
    position: relative;
    z-index: 1;
  }

  .ob-welcome-emoji {
    font-size: 52px;
    margin-bottom: 24px;
    display: block;
    animation: ob-bounce 0.8s ease both 0.2s;
  }

  @keyframes ob-bounce {
    0%   { transform: scale(0.5) rotate(-10deg); opacity: 0; }
    70%  { transform: scale(1.15) rotate(4deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  .ob-welcome h1 {
    font-size: 42px;
    font-weight: 800;
    color: white;
    letter-spacing: -1.5px;
    margin-bottom: 14px;
    line-height: 1.1;
  }

  .ob-welcome h1 span {
    background: linear-gradient(135deg, #818cf8, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ob-welcome p {
    font-size: 16px;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    margin-bottom: 40px;
  }

  .ob-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 15px 36px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #7c3aed);
    color: white;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.2s;
    letter-spacing: -0.2px;
    box-shadow: 0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px rgba(99,102,241,0.3);
  }

  .ob-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(99,102,241,0.5), 0 16px 40px rgba(99,102,241,0.4);
  }

  .ob-privacy {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 28px;
    font-size: 12px;
    color: rgba(255,255,255,0.25);
  }

  .ob-privacy-icon {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  /* ── Form steps ── */
  .ob-step {
    max-width: 580px;
    width: 100%;
    animation: ob-up 0.4s ease both;
    position: relative;
    z-index: 1;
  }

  @keyframes ob-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ob-step-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #818cf8;
    margin-bottom: 12px;
  }

  .ob-step h2 {
    font-size: 32px;
    font-weight: 800;
    color: white;
    letter-spacing: -0.8px;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .ob-step-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.4);
    margin-bottom: 36px;
    line-height: 1.6;
  }

  /* ── Card wrapper for form inputs ── */
  .ob-form-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 28px;
    backdrop-filter: blur(8px);
  }

  /* ── Fields ── */
  .ob-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 18px;
  }

  .ob-field:last-child { margin-bottom: 0; }

  .ob-field label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: rgba(255,255,255,0.4);
  }

  .ob-input {
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 13px 16px;
    font-size: 14px;
    color: white;
    font-family: 'Geist', system-ui, sans-serif;
    outline: none;
    background: rgba(255,255,255,0.06);
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    width: 100%;
  }

  .ob-input::placeholder { color: rgba(255,255,255,0.2); }

  .ob-input:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.08);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .ob-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  /* ── Status cards ── */
  .ob-status-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 8px;
  }

  .ob-status-card {
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 22px 16px;
    cursor: pointer;
    text-align: center;
    background: rgba(255,255,255,0.04);
    transition: all 0.25s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    backdrop-filter: blur(8px);
  }

  .ob-status-card:hover {
    border-color: rgba(99,102,241,0.4);
    background: rgba(99,102,241,0.06);
    transform: translateY(-3px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }

  .ob-status-card.selected {
    border-color: rgba(99,102,241,0.7);
    background: rgba(99,102,241,0.12);
    box-shadow: 0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px rgba(99,102,241,0.15);
  }

  .ob-status-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    background: rgba(255,255,255,0.08);
  }

  .ob-status-card h3 {
    font-size: 13px;
    font-weight: 700;
    color: white;
    margin: 0;
  }

  .ob-status-card p {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    line-height: 1.5;
    margin: 0;
  }

  /* ── Skills ── */
  .ob-skills-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    min-height: 44px;
    padding: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
  }

  .ob-skill-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 8px;
    background: rgba(99,102,241,0.2);
    border: 1px solid rgba(99,102,241,0.35);
    color: #a5b4fc;
    animation: ob-pop 0.2s ease both;
  }

  @keyframes ob-pop {
    from { transform: scale(0.7); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  .ob-skill-remove {
    cursor: pointer;
    color: rgba(165,180,252,0.5);
    font-size: 15px;
    line-height: 1;
    transition: color 0.12s;
  }

  .ob-skill-remove:hover { color: #f87171; }

  .ob-skill-input-row {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
  }

  .ob-skill-input-row .ob-input { flex: 1; }

  .ob-btn-add {
    padding: 13px 20px;
    border-radius: 12px;
    border: none;
    background: rgba(99,102,241,0.25);
    border: 1px solid rgba(99,102,241,0.4);
    color: #a5b4fc;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    white-space: nowrap;
    transition: all 0.15s;
  }

  .ob-btn-add:hover {
    background: rgba(99,102,241,0.4);
    color: white;
  }

  .ob-skill-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .ob-skill-suggest-btn {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.35);
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
  }

  .ob-skill-suggest-btn:hover {
    border-color: rgba(99,102,241,0.5);
    color: #a5b4fc;
    background: rgba(99,102,241,0.1);
  }

  /* ── Feature slides (keep light) ── */
  .ob-feature {
    max-width: 560px;
    width: 100%;
    animation: ob-up 0.4s ease both;
    position: relative;
    z-index: 1;
  }

  .ob-feature-visual {
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 28px;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .ob-feature-visual.indigo  { background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%); }
  .ob-feature-visual.violet  { background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); }
  .ob-feature-visual.emerald { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); }

  .ob-feature-mock {
    width: 320px;
    background: white;
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06);
    overflow: hidden;
    font-size: 11px;
  }

  .ob-mock-header {
    padding: 10px 14px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ob-mock-dot { width: 7px; height: 7px; border-radius: 50%; }
  .ob-mock-title { font-size: 11px; font-weight: 700; color: #0f172a; }

  .ob-kanban-mock {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    padding: 10px;
  }

  .ob-kanban-col-label {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.07em; color: #94a3b8; margin-bottom: 5px; padding: 0 2px;
  }

  .ob-kanban-card {
    background: #f8fafc; border: 1px solid #e2e8f0;
    border-radius: 6px; padding: 6px 7px; margin-bottom: 4px;
  }

  .ob-kanban-card-company { font-size: 10px; font-weight: 700; color: #0f172a; }
  .ob-kanban-card-role    { font-size: 9px; color: #64748b; }

  .ob-kanban-tag {
    display: inline-block; font-size: 8px; font-weight: 600;
    padding: 1px 5px; border-radius: 4px; margin-top: 3px;
  }

  .ob-cv-mock    { padding: 12px 14px; }
  .ob-cv-name    { font-size: 13px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px; }
  .ob-cv-title   { font-size: 9px; color: #64748b; margin-bottom: 8px; }
  .ob-cv-section {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.07em; color: #c8a96e;
    border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; margin-bottom: 5px;
  }
  .ob-cv-line { height: 5px; background: #f1f5f9; border-radius: 3px; margin-bottom: 3px; }
  .ob-cv-line.short  { width: 60%; }
  .ob-cv-line.medium { width: 80%; }

  .ob-ai-mock      { padding: 12px 14px; }
  .ob-ai-score-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .ob-ai-score     { font-size: 24px; font-weight: 800; color: #16a34a; }
  .ob-ai-score-label { font-size: 9px; color: #64748b; font-weight: 600; }
  .ob-ai-badge     { font-size: 8px; font-weight: 700; padding: 3px 7px; border-radius: 99px; background: #dcfce7; color: #15803d; }
  .ob-ai-row       { display: flex; align-items: center; gap: 5px; margin-bottom: 4px; }
  .ob-ai-check     { width: 12px; height: 12px; border-radius: 50%; background: #dcfce7; display: flex; align-items: center; justify-content: center; font-size: 7px; color: #15803d; flex-shrink: 0; }
  .ob-ai-text      { font-size: 9px; color: #374151; }

  .ob-feature h2 {
    font-size: 26px; font-weight: 800; color: white;
    letter-spacing: -0.6px; margin-bottom: 10px; line-height: 1.25;
  }

  .ob-feature p { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.65; }

  .ob-feature .ob-step-label { color: #818cf8; }

  /* ── Done screen ── */
  .ob-done {
    text-align: center; max-width: 500px; width: 100%;
    animation: ob-up 0.5s ease both; position: relative; z-index: 1;
  }

  .ob-done-icon {
    width: 76px; height: 76px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(34,197,94,0.2), rgba(22,163,74,0.1));
    border: 1px solid rgba(34,197,94,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 34px; margin: 0 auto 24px;
    animation: ob-bounce 0.6s ease both;
    box-shadow: 0 0 40px rgba(34,197,94,0.15);
  }

  .ob-done h2 { font-size: 32px; font-weight: 800; color: white; letter-spacing: -0.8px; margin-bottom: 12px; }
  .ob-done p  { font-size: 15px; color: rgba(255,255,255,0.4); line-height: 1.65; margin-bottom: 32px; }

  .ob-summary-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 32px; }

  .ob-summary-chip {
    font-size: 12px; font-weight: 600; padding: 5px 14px;
    border-radius: 99px;
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.3);
    color: #a5b4fc;
  }

  /* ── Bottom nav ── */
  .ob-bottom {
    padding: 20px 32px;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: rgba(10,15,30,0.8);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ob-btn-back {
    padding: 10px 20px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.4);
    cursor: pointer; font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
  }

  .ob-btn-back:hover { background: rgba(255,255,255,0.08); color: white; border-color: rgba(255,255,255,0.2); }

  .ob-btn-next {
    padding: 12px 28px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #6366f1, #7c3aed);
    color: white; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.2s;
    display: flex; align-items: center; gap: 7px;
    box-shadow: 0 4px 16px rgba(99,102,241,0.3);
  }

  .ob-btn-next:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.45);
  }

  .ob-btn-next:disabled {
    opacity: 0.25; cursor: not-allowed;
    transform: none; box-shadow: none;
  }

  .ob-btn-next.green {
    background: linear-gradient(135deg, #16a34a, #15803d);
    box-shadow: 0 4px 16px rgba(22,163,74,0.3);
  }

  .ob-btn-next.green:hover { box-shadow: 0 8px 28px rgba(22,163,74,0.45); }

  @media (max-width: 600px) {
    .ob-welcome h1  { font-size: 30px; }
    .ob-status-grid { grid-template-columns: 1fr; }
    .ob-field-row   { grid-template-columns: 1fr; }
    .ob-step h2     { font-size: 24px; }
    .ob-feature h2  { font-size: 22px; }
    .ob-bottom      { padding: 16px 20px; }
    .ob-body        { padding: 28px 16px; }
  }
`;

const SKILL_SUGGESTIONS = [
  "React", "TypeScript", "Node.js", "Python", "Figma", "SQL",
  "AWS", "Docker", "GraphQL", "Vue", "Next.js", "Tailwind",
  "Product Management", "UX Research", "Data Analysis", "Go",
];

const STATUS_OPTIONS = [
  {
    value: "Open to work",
    icon: "🟢",
    iconBg: "#dcfce7",
    title: "Active Job Seeker",
    desc: "Actively looking for new opportunities and want to find a role soon.",
  },
  {
    value: "Passively looking",
    icon: "🔄",
    iconBg: "#fef9c3",
    title: "Passive Job Seeker",
    desc: "Browsing opportunities that could be a step up or an interesting transition.",
  },
  {
    value: "Not looking",
    icon: "⏸️",
    iconBg: "#f1f5f9",
    title: "Not Looking",
    desc: "Not seeking new roles but want to use the tracker and CV builder.",
  },
];

const FEATURE_SLIDES = [
  {
    key: "tracker",
    color: "indigo",
    title: "Track every application in one place",
    desc: "Your entire job search on one kanban board — move cards as you progress, never lose track of where you stand.",
    mock: "kanban",
  },
  {
    key: "ai",
    color: "violet",
    title: "AI analyses your fit before you apply",
    desc: "Paste a job description and get an instant fit score, keyword gaps, and red flags — so you apply smarter, not harder.",
    mock: "ai",
  },
  {
    key: "cv",
    color: "emerald",
    title: "Build a professional CV in minutes",
    desc: "A clean, ATS-friendly CV builder with live preview. Step by step — no design skills needed.",
    mock: "cv",
  },
];

// ── Mock visuals ──────────────────────────────────────────────────────────────
function KanbanMock() {
  return (
    <div className="ob-feature-mock">
      <div className="ob-mock-header">
        <div className="ob-mock-dot" style={{ background: "#ef4444" }} />
        <div className="ob-mock-dot" style={{ background: "#f59e0b" }} />
        <div className="ob-mock-dot" style={{ background: "#22c55e" }} />
        <span className="ob-mock-title" style={{ marginLeft: 4 }}>Job Tracker — Dashboard</span>
      </div>
      <div className="ob-kanban-mock">
        <div>
          <div className="ob-kanban-col-label">Wishlist</div>
          <div className="ob-kanban-card">
            <div className="ob-kanban-card-company">Spotify</div>
            <div className="ob-kanban-card-role">Product Designer</div>
            <span className="ob-kanban-tag" style={{ background: "#f1f5f9", color: "#64748b" }}>$90k</span>
          </div>
        </div>
        <div>
          <div className="ob-kanban-col-label">Applied</div>
          <div className="ob-kanban-card">
            <div className="ob-kanban-card-company">Google</div>
            <div className="ob-kanban-card-role">Frontend Eng.</div>
            <span className="ob-kanban-tag" style={{ background: "#eef2ff", color: "#4f46e5" }}>$140k</span>
          </div>
          <div className="ob-kanban-card">
            <div className="ob-kanban-card-company">Notion</div>
            <div className="ob-kanban-card-role">UX Researcher</div>
          </div>
        </div>
        <div>
          <div className="ob-kanban-col-label">Interview</div>
          <div className="ob-kanban-card">
            <div className="ob-kanban-card-company">Linear</div>
            <div className="ob-kanban-card-role">Full Stack Dev</div>
            <span className="ob-kanban-tag" style={{ background: "#fef9c3", color: "#92400e" }}>🔥 Hot</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIMock() {
  return (
    <div className="ob-feature-mock">
      <div className="ob-mock-header">
        <div className="ob-mock-dot" style={{ background: "#ef4444" }} />
        <div className="ob-mock-dot" style={{ background: "#f59e0b" }} />
        <div className="ob-mock-dot" style={{ background: "#22c55e" }} />
        <span className="ob-mock-title" style={{ marginLeft: 4 }}>AI Fit Analysis</span>
      </div>
      <div className="ob-ai-mock">
        <div className="ob-ai-score-row">
          <div>
            <div className="ob-ai-score">87%</div>
            <div className="ob-ai-score-label">Fit Score</div>
          </div>
          <span className="ob-ai-badge">Strong Match ✓</span>
        </div>
        {["React & TypeScript", "5+ years frontend", "Design systems"].map((t, i) => (
          <div key={i} className="ob-ai-row">
            <div className="ob-ai-check">✓</div>
            <div className="ob-ai-text">{t}</div>
          </div>
        ))}
        <div className="ob-ai-row" style={{ marginTop: 4 }}>
          <div className="ob-ai-check" style={{ background: "#fef9c3", color: "#92400e" }}>!</div>
          <div className="ob-ai-text" style={{ color: "#92400e" }}>GraphQL — gap detected</div>
        </div>
      </div>
    </div>
  );
}

function CVMock() {
  return (
    <div className="ob-feature-mock">
      <div className="ob-mock-header">
        <div className="ob-mock-dot" style={{ background: "#ef4444" }} />
        <div className="ob-mock-dot" style={{ background: "#f59e0b" }} />
        <div className="ob-mock-dot" style={{ background: "#22c55e" }} />
        <span className="ob-mock-title" style={{ marginLeft: 4 }}>CV Builder</span>
      </div>
      <div className="ob-cv-mock">
        <div className="ob-cv-name">Your Name</div>
        <div className="ob-cv-title">Senior Frontend Engineer · Oslo, Norway</div>
        <div className="ob-cv-section">Experience</div>
        <div className="ob-cv-line medium" />
        <div className="ob-cv-line short" />
        <div className="ob-cv-line" style={{ width: "90%" }} />
        <div className="ob-cv-section" style={{ marginTop: 8 }}>Skills</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {["React", "TypeScript", "Node.js"].map(s => (
            <span key={s} style={{ fontSize: 8, background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: "#374151", fontWeight: 600 }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Onboarding({ onComplete }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    title: "",
    location: "",
    email: "",
    seekStatus: "",
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");

  // Steps: 0=welcome, 1=basic info, 2=status, 3=skills, 4-6=feature slides, 7=done
  const TOTAL_STEPS = 7; // excluding welcome (0) and done (7)
  const progressPct = step === 0 ? 0 : step >= 7 ? 100 : Math.round((step / TOTAL_STEPS) * 100);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addSkill = (s) => {
    const trimmed = (s || skillInput).trim();
    if (!trimmed || form.skills.includes(trimmed)) { setSkillInput(""); return; }
    setForm(f => ({ ...f, skills: [...f.skills, trimmed] }));
    setSkillInput("");
  };

  const removeSkill = (s) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));

  const canNext = () => {
    if (step === 1) return form.name.trim().length > 0;
    if (step === 2) return form.seekStatus !== "";
    return true;
  };

  const handleFinish = () => {
    const profile = {
      name:        form.name,
      title:       form.title,
      location:    form.location,
      email:       form.email,
      seekStatus:  form.seekStatus,
      skills:      form.skills,
      targetRole:  "",
      targetSalary:"",
      workTypes:   [],
      bio:         "",
      linkedin:    "",
      github:      "",
      portfolio:   "",
    };
    try {
      localStorage.setItem("jobTrackerProfile", JSON.stringify(profile));
      localStorage.setItem("jobtracker_onboarded", "true");
    } catch {}
    onComplete(); 
    navigate("/home");
  };

  const next = () => {
    if (step === 7) { handleFinish(); return; }
    setStep(s => s + 1);
  };

  const back = () => setStep(s => Math.max(0, s - 1));

  const featureIndex = step - 4; // steps 4,5,6 = feature slides 0,1,2

  return (
    <>
      <style>{styles}</style>
      <div className="ob-root">

        {/* Progress bar */}
        <div className="ob-progress-bar">
          <div className="ob-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Nav */}
        <div className="ob-nav">
          <div className="ob-logo">
            <div className="ob-logo-dot" />
            JobTracker
          </div>
          {step > 0 && step < 7 && (
            <div className="ob-step-indicator">
              Step {step} of {TOTAL_STEPS}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="ob-body">

          {/* ── Step 0: Welcome ── */}
          {step === 0 && (
            <div className="ob-welcome">
              <span className="ob-welcome-emoji">👋</span>
              <h1>Welcome to <span>JobTracker</span></h1>
              <p>Let's set up your profile in under 2 minutes so we can personalise your experience and help the AI work better for you.</p>
              <button className="ob-btn-primary" onClick={next}>
                Get started — it's free
                <span>→</span>
              </button>
              <div className="ob-privacy">
                <div className="ob-privacy-icon">🔒</div>
                Your data is only stored on your device. We never share it.
              </div>
            </div>
          )}

          {/* ── Step 1: Basic info ── */}
          {step === 1 && (
            <div key="step1" className="ob-step">
              <div className="ob-step-label">Step 1 of {TOTAL_STEPS} — About you</div>
              <h2>Let's start with the basics</h2>
              <p className="ob-step-sub">This personalises your dashboard and pre-fills your CV builder.</p>
              <div className="ob-field-row">
                <div className="ob-field">
                  <label>First & last name *</label>
                  <input
                    className="ob-input"
                    placeholder="e.g. Alex Johnson"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="ob-field">
                  <label>Job title</label>
                  <input
                    className="ob-input"
                    placeholder="e.g. Frontend Engineer"
                    value={form.title}
                    onChange={e => set("title", e.target.value)}
                  />
                </div>
              </div>
              <div className="ob-field-row">
                <div className="ob-field">
                  <label>Location</label>
                  <input
                    className="ob-input"
                    placeholder="e.g. Oslo, Norway"
                    value={form.location}
                    onChange={e => set("location", e.target.value)}
                  />
                </div>
                <div className="ob-field">
                  <label>Email</label>
                  <input
                    className="ob-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Job search status ── */}
          {step === 2 && (
            <div key="step2" className="ob-step">
              <div className="ob-step-label">Step 2 of {TOTAL_STEPS} — Your situation</div>
              <h2>Where are you in your job search?</h2>
              <p className="ob-step-sub">This won't limit what you can do — it just helps us show you the most relevant features first.</p>
              <div className="ob-status-grid">
                {STATUS_OPTIONS.map(opt => (
                  <div
                    key={opt.value}
                    className={`ob-status-card ${form.seekStatus === opt.value ? "selected" : ""}`}
                    onClick={() => set("seekStatus", opt.value)}
                  >
                    <div className="ob-status-icon" style={{ background: opt.iconBg }}>
                      {opt.icon}
                    </div>
                    <h3>{opt.title}</h3>
                    <p>{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Skills ── */}
          {step === 3 && (
            <div key="step3" className="ob-step">
              <div className="ob-step-label">Step 3 of {TOTAL_STEPS} — Your skills</div>
              <h2>What are your top skills?</h2>
              <p className="ob-step-sub">These power the AI job fit analyser — the more you add, the better it works. You can always edit them later.</p>
              <div className="ob-skills-wrap">
                {form.skills.length === 0 && (
                  <span style={{ fontSize: 13, color: "#cbd5e1", fontStyle: "italic", alignSelf: "center" }}>No skills added yet…</span>
                )}
                {form.skills.map(s => (
                  <span key={s} className="ob-skill-tag">
                    {s}
                    <span className="ob-skill-remove" onClick={() => removeSkill(s)}>×</span>
                  </span>
                ))}
              </div>
              <div className="ob-skill-input-row">
                <input
                  className="ob-input"
                  placeholder="Type a skill and press Enter…"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSkill()}
                />
                <button className="ob-btn-add" onClick={() => addSkill()}>Add</button>
              </div>
              <div className="ob-skill-suggestions">
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, alignSelf: "center", marginRight: 2 }}>Quick add:</span>
                {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 10).map(s => (
                  <button key={s} className="ob-skill-suggest-btn" onClick={() => addSkill(s)}>+ {s}</button>
                ))}
              </div>
            </div>
          )}

          {/* ── Steps 4–6: Feature slides ── */}
          {step >= 4 && step <= 6 && (
            <div key={`feature${step}`} className="ob-feature">
              <div className={`ob-feature-visual ${FEATURE_SLIDES[featureIndex].color}`}>
                {featureIndex === 0 && <KanbanMock />}
                {featureIndex === 1 && <AIMock />}
                {featureIndex === 2 && <CVMock />}
              </div>
              <div className="ob-step-label">Step {step} of {TOTAL_STEPS} — What you get</div>
              <h2>{FEATURE_SLIDES[featureIndex].title}</h2>
              <p>{FEATURE_SLIDES[featureIndex].desc}</p>
            </div>
          )}

          {/* ── Step 7: Done ── */}
          {step === 7 && (
            <div key="done" className="ob-done">
              <div className="ob-done-icon">🎉</div>
              <h2>You're all set, {form.name.split(" ")[0] || "there"}!</h2>
              <p>Your profile is ready. Head to your dashboard to add your first job and let the AI go to work for you.</p>
              {form.skills.length > 0 && (
                <div className="ob-summary-chips">
                  {form.skills.slice(0, 6).map(s => (
                    <span key={s} className="ob-summary-chip">{s}</span>
                  ))}
                  {form.skills.length > 6 && (
                    <span className="ob-summary-chip">+{form.skills.length - 6} more</span>
                  )}
                </div>
              )}
              <button className="ob-btn-next green" style={{ margin: "0 auto", padding: "14px 36px", fontSize: 15 }} onClick={handleFinish}>
                Go to my dashboard →
              </button>
            </div>
          )}

        </div>

        {/* Bottom nav */}
        {step > 0 && step < 7 && (
          <div className="ob-bottom">
            <button className="ob-btn-back" onClick={back}>← Back</button>
            <button className="ob-btn-next" onClick={next} disabled={!canNext()}>
              {step >= 4 && step <= 6 ? "Next feature →" : step === 3 ? "Look good →" : "Continue →"}
            </button>
          </div>
        )}

      </div>
    </>
  );
}
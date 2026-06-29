import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CvScanner.jsx
// Matches the app's design language: Geist, #f0f4f8 bg, white cards,
// #4f46e5 indigo accent, 14px border-radius cards, tight spacing system.
// ─────────────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap');

  /* ── Root ── */
  .cvs-root {
    min-height: calc(100vh - 60px);
    background: #f0f4f8;
    font-family: 'Geist', system-ui, sans-serif;
    padding: 28px 24px 48px;
  }

  .cvs-inner {
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ── Topbar ── */
  .cvs-topbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 4px;
  }

  .cvs-topbar-left h1 {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 3px;
    letter-spacing: -0.3px;
  }

  .cvs-topbar-left p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }

  /* ── Shared card ── */
  .cvs-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    animation: cvs-fade 0.22s ease both;
  }

  @keyframes cvs-fade {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }

  .cvs-card-head {
    padding: 15px 22px 13px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .cvs-card-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    flex: 1;
  }

  .cvs-card-sub {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 400;
    margin: 0;
  }

  .cvs-card-body {
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ── Step badge ── */
  .cvs-step-badge {
    width: 22px;
    height: 22px;
    border-radius: 7px;
    background: #0f172a;
    color: white;
    font-size: 11px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    letter-spacing: -0.3px;
  }

  .cvs-step-badge.done {
    background: #dcfce7;
    color: #15803d;
  }

  /* ── Upload zone ── */
  .cvs-upload-zone {
    border: 2px dashed #e2e8f0;
    border-radius: 12px;
    padding: 28px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    text-align: center;
    position: relative;
  }

  .cvs-upload-zone:hover,
  .cvs-upload-zone.drag-over {
    border-color: #4f46e5;
    background: #fafbff;
  }

  .cvs-upload-zone.has-file {
    border-color: #bbf7d0;
    background: #f0fdf4;
    border-style: solid;
  }

  .cvs-upload-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .cvs-upload-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 11px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: background 0.15s, border-color 0.15s;
  }

  .cvs-upload-zone:hover .cvs-upload-icon-wrap,
  .cvs-upload-zone.drag-over .cvs-upload-icon-wrap {
    background: #eef2ff;
    border-color: #c7d2fe;
  }

  .cvs-upload-zone.has-file .cvs-upload-icon-wrap {
    background: #dcfce7;
    border-color: #bbf7d0;
  }

  .cvs-upload-title {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }

  .cvs-upload-sub {
    font-size: 12px;
    color: #94a3b8;
    margin: 0;
  }

  .cvs-upload-file-name {
    font-size: 12px;
    font-weight: 600;
    color: #15803d;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .cvs-clear-file {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    line-height: 1;
    transition: color 0.15s;
    position: relative;
    z-index: 2;
  }

  .cvs-clear-file:hover { color: #ef4444; }

  /* ── OR divider ── */
  .cvs-or {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .cvs-or-line { flex: 1; height: 1px; background: #f1f5f9; }

  .cvs-or-label {
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* ── Textarea ── */
  .cvs-textarea {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 13px;
    color: #0f172a;
    font-family: 'Geist', system-ui, sans-serif;
    outline: none;
    background: white;
    width: 100%;
    resize: none;
    height: 180px;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
    line-height: 1.65;
  }

  .cvs-textarea:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.08);
  }

  .cvs-textarea::placeholder { color: #cbd5e1; }

  .cvs-textarea.has-content {
    border-color: #bbf7d0;
  }

  /* ── Char count ── */
  .cvs-char-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .cvs-char-hint {
    font-size: 11px;
    color: #94a3b8;
  }

  .cvs-char-count {
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
  }

  .cvs-char-count.good { color: #16a34a; }
  .cvs-char-count.warn { color: #d97706; }

  /* ── Scan button ── */
  .cvs-scan-btn {
    width: 100%;
    padding: 12px;
    border-radius: 11px;
    border: none;
    background: #0f172a;
    font-size: 14px;
    font-weight: 700;
    color: white;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: opacity 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: -0.1px;
  }

  .cvs-scan-btn:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  .cvs-scan-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
  }

  .cvs-scan-btn-icon {
    font-size: 15px;
  }

  /* ── Loading state ── */
  .cvs-loading-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 52px 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    animation: cvs-fade 0.2s ease both;
  }

  .cvs-loading-ring {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 3.5px solid #f1f5f9;
    border-top-color: #4f46e5;
    animation: cvs-spin 0.75s linear infinite;
  }

  @keyframes cvs-spin { to { transform: rotate(360deg); } }

  .cvs-loading-title {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.2px;
  }

  .cvs-loading-sub {
    font-size: 12px;
    color: #94a3b8;
    margin: 0;
    text-align: center;
    line-height: 1.6;
  }

  .cvs-loading-steps {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 4px;
  }

  .cvs-loading-step {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #94a3b8;
  }

  .cvs-loading-step.active { color: #4f46e5; font-weight: 600; }
  .cvs-loading-step.done   { color: #16a34a; }

  .cvs-loading-step-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e2e8f0;
    flex-shrink: 0;
  }

  .cvs-loading-step.active .cvs-loading-step-dot { background: #4f46e5; }
  .cvs-loading-step.done   .cvs-loading-step-dot { background: #16a34a; }

  /* ─────────────────────────────────────────
     RESULTS
  ───────────────────────────────────────── */

  /* ── Score hero card ── */
  .cvs-score-hero {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    animation: cvs-fade 0.25s ease both;
  }

  .cvs-score-hero-top {
    padding: 22px 24px 20px;
    display: flex;
    align-items: center;
    gap: 22px;
  }

  /* SVG ring */
  .cvs-ring-wrap {
    position: relative;
    width: 96px;
    height: 96px;
    flex-shrink: 0;
  }

  .cvs-ring-wrap svg {
    transform: rotate(-90deg);
    width: 96px;
    height: 96px;
  }

  .cvs-ring-bg {
    fill: none;
    stroke: #f1f5f9;
    stroke-width: 8;
  }

  .cvs-ring-fill {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cvs-ring-label {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
  }

  .cvs-ring-num {
    font-size: 26px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -1px;
  }

  .cvs-ring-denom {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 600;
  }

  .cvs-score-meta { flex: 1; min-width: 0; }

  .cvs-score-verdict {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.4px;
    margin: 0 0 5px;
  }

  .cvs-score-tagline {
    font-size: 13px;
    color: #64748b;
    line-height: 1.6;
    margin: 0 0 12px;
  }

  .cvs-score-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .cvs-score-chip {
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 99px;
    letter-spacing: 0.02em;
  }

  /* score colour themes */
  .cvs-theme-great .cvs-ring-num         { color: #16a34a; }
  .cvs-theme-great .cvs-ring-fill        { stroke: #22c55e; }
  .cvs-theme-great .cvs-score-chip-main  { background: #dcfce7; color: #15803d; }

  .cvs-theme-good .cvs-ring-num          { color: #4f46e5; }
  .cvs-theme-good .cvs-ring-fill         { stroke: #4f46e5; }
  .cvs-theme-good .cvs-score-chip-main   { background: #eef2ff; color: #4338ca; }

  .cvs-theme-fair .cvs-ring-num          { color: #d97706; }
  .cvs-theme-fair .cvs-ring-fill         { stroke: #f59e0b; }
  .cvs-theme-fair .cvs-score-chip-main   { background: #fef3c7; color: #92400e; }

  .cvs-theme-low .cvs-ring-num           { color: #ef4444; }
  .cvs-theme-low .cvs-ring-fill          { stroke: #ef4444; }
  .cvs-theme-low .cvs-score-chip-main    { background: #fee2e2; color: #b91c1c; }

  /* ── Score divider ── */
  .cvs-score-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 0 24px;
  }

  /* ── Quick stats strip ── */
  .cvs-quick-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 14px 24px 16px;
    gap: 0;
  }

  .cvs-quick-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 0;
    position: relative;
  }

  .cvs-quick-stat + .cvs-quick-stat::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    height: 60%;
    width: 1px;
    background: #f1f5f9;
  }

  .cvs-quick-stat-num {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1;
    letter-spacing: -0.5px;
  }

  .cvs-quick-stat-num.green { color: #16a34a; }
  .cvs-quick-stat-num.red   { color: #ef4444; }
  .cvs-quick-stat-num.amber { color: #d97706; }

  .cvs-quick-stat-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #94a3b8;
  }

  /* ── Section cards ── */
  .cvs-section-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    animation: cvs-fade 0.25s ease both;
  }

  .cvs-section-head {
    padding: 14px 20px 12px;
    border-bottom: 1px solid #f8fafc;
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .cvs-section-icon {
    font-size: 15px;
    flex-shrink: 0;
    line-height: 1;
  }

  .cvs-section-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    flex: 1;
    margin: 0;
  }

  .cvs-section-count {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 99px;
    background: #f1f5f9;
    color: #64748b;
  }

  .cvs-section-body {
    padding: 14px 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* ── Dimension bars ── */
  .cvs-dim-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .cvs-dim {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .cvs-dim-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .cvs-dim-name {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
  }

  .cvs-dim-score {
    font-size: 12px;
    font-weight: 700;
    color: #0f172a;
    min-width: 36px;
    text-align: right;
  }

  .cvs-dim-track {
    width: 100%;
    height: 6px;
    background: #f1f5f9;
    border-radius: 99px;
    overflow: hidden;
  }

  .cvs-dim-fill {
    height: 100%;
    border-radius: 99px;
    width: 0%;
    transition: width 1.1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* ── Issue items (what's good / not good) ── */
  .cvs-issue-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 13px;
    border-radius: 10px;
    border: 1px solid;
    animation: cvs-fade 0.2s ease both;
  }

  .cvs-issue-item.good {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  .cvs-issue-item.bad {
    background: #fff5f5;
    border-color: #fecaca;
  }

  .cvs-issue-item.improve {
    background: #fffbeb;
    border-color: #fde68a;
  }

  .cvs-issue-icon {
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 1px;
    line-height: 1;
  }

  .cvs-issue-content { flex: 1; min-width: 0; }

  .cvs-issue-title {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 2px;
    line-height: 1.4;
  }

  .cvs-issue-desc {
    font-size: 12px;
    color: #64748b;
    margin: 0;
    line-height: 1.55;
  }

  .cvs-issue-item.good .cvs-issue-title  { color: #15803d; }
  .cvs-issue-item.bad  .cvs-issue-title  { color: #b91c1c; }
  .cvs-issue-item.improve .cvs-issue-title { color: #92400e; }

  /* ── Quick wins list ── */
  .cvs-win-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 13px;
    border-radius: 10px;
    background: #fafbff;
    border: 1px solid #e8eaf6;
    animation: cvs-fade 0.2s ease both;
  }

  .cvs-win-num {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: #4f46e5;
    color: white;
    font-size: 10px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .cvs-win-content { flex: 1; }

  .cvs-win-title {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 2px;
  }

  .cvs-win-desc {
    font-size: 12px;
    color: #64748b;
    margin: 0;
    line-height: 1.55;
  }

  /* ── Keywords section ── */
  .cvs-keyword-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cvs-keyword {
    font-size: 12px;
    font-weight: 500;
    padding: 4px 11px;
    border-radius: 7px;
    border: 1px solid #e2e8f0;
    background: white;
    color: #374151;
  }

  .cvs-keyword.present {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #15803d;
    font-weight: 600;
  }

  .cvs-keyword.missing {
    background: #fff5f5;
    border-color: #fecaca;
    color: #b91c1c;
    text-decoration: line-through;
    opacity: 0.7;
  }

  /* ── Rescan button ── */
  .cvs-rescan-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 9px 20px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
    align-self: flex-end;
  }

  .cvs-rescan-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #374151;
  }

  /* ── Error ── */
  .cvs-error {
    font-size: 12px;
    color: #ef4444;
    background: #fff5f5;
    border: 1px solid #fee2e2;
    border-radius: 9px;
    padding: 10px 13px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  /* ── Empty state ── */
  .cvs-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 32px 0 20px;
    text-align: center;
  }

  .cvs-empty-icon {
    font-size: 28px;
    line-height: 1;
    margin-bottom: 4px;
  }

  .cvs-empty-title {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .cvs-empty-sub {
    font-size: 13px;
    color: #94a3b8;
    margin: 0;
    line-height: 1.6;
  }

  /* ── Responsive ── */
  @media (max-width: 680px) {
    .cvs-root          { padding: 20px 16px 40px; }
    .cvs-score-hero-top { flex-direction: column; align-items: flex-start; gap: 16px; }
    .cvs-quick-stats   { grid-template-columns: repeat(3, 1fr); }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function scoreTheme(score) {
  if (score >= 80) return { cls: "cvs-theme-great", verdict: "Strong CV",       tagline: "Your CV is in great shape — a few polishes will make it stand out further." };
  if (score >= 60) return { cls: "cvs-theme-good",  verdict: "Good CV",         tagline: "A solid foundation with clear opportunities to strengthen key areas." };
  if (score >= 40) return { cls: "cvs-theme-fair",  verdict: "Needs Work",      tagline: "There are several impactful improvements that could significantly lift your CV." };
  return                  { cls: "cvs-theme-low",   verdict: "Major Gaps",      tagline: "Your CV needs meaningful attention before it's ready for a competitive job search." };
}

function dimBarColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#4f46e5";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

const LOADING_STEPS = [
  "Reading your CV…",
  "Analysing structure & clarity…",
  "Checking impact language…",
  "Scoring dimensions…",
  "Generating improvements…",
];

const DIMENSIONS = [
  "Impact Language",
  "Quantified Results",
  "Skills Coverage",
  "ATS Compatibility",
  "Clarity & Format",
];

// ─────────────────────────────────────────────────────────────────────────────
// Claude API call
// ─────────────────────────────────────────────────────────────────────────────
async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const raw  = (data.content || []).map(b => b.text || "").join("").trim();
  return raw.replace(/```json|```/g, "").trim();
}

function buildScanPrompt(cvText) {
  return `You are a professional CV reviewer and career coach. Analyse this CV thoroughly and return ONLY a valid JSON object — no preamble, no markdown fences.

CV:
"""
${cvText}
"""

Return exactly this JSON shape:

{
  "overallScore": <integer 0–100>,
  "summary": "<2 clear sentences: what's strongest and what's holding it back>",
  "dimensions": [
    { "name": "Impact Language",    "score": <0–100>, "note": "<one specific observation>" },
    { "name": "Quantified Results", "score": <0–100>, "note": "<one specific observation>" },
    { "name": "Skills Coverage",    "score": <0–100>, "note": "<one specific observation>" },
    { "name": "ATS Compatibility",  "score": <0–100>, "note": "<one specific observation>" },
    { "name": "Clarity & Format",   "score": <0–100>, "note": "<one specific observation>" }
  ],
  "strengths": [
    { "title": "<short strength title>", "detail": "<1–2 sentences explaining why this is strong>" }
  ],
  "weaknesses": [
    { "title": "<short weakness title>", "detail": "<1–2 sentences explaining the specific problem>" }
  ],
  "quickWins": [
    { "title": "<actionable fix title>", "detail": "<exact instruction — what to add, change, or remove>" }
  ],
  "keywords": {
    "present": ["<keyword found in CV>"],
    "missing": ["<important keyword not found>"]
  },
  "stats": {
    "bulletCount": <integer — estimated number of bullet points>,
    "actionVerbPct": <integer 0–100 — % of bullets starting with strong action verbs>,
    "quantifiedPct": <integer 0–100 — % of bullets with numbers/metrics>
  }
}

Rules:
- overallScore: honest weighted average across dimensions. Do NOT inflate.
- strengths: 2–4 items, things genuinely done well
- weaknesses: 2–4 items, real problems not vague advice
- quickWins: 3–5 items, each must be a concrete, immediately actionable instruction
- keywords.present: 5–10 strong keywords already in the CV
- keywords.missing: 4–8 common professional keywords absent from this CV
- All fields required, no nulls, no empty arrays`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// Animated score ring
function ScoreRing({ score, theme }) {
  const ringRef     = useRef(null);
  const circumference = 2 * Math.PI * 40; // r=40

  useEffect(() => {
    if (ringRef.current) {
      setTimeout(() => {
        if (ringRef.current) {
          ringRef.current.style.strokeDashoffset =
            circumference - (score / 100) * circumference;
        }
      }, 80);
    }
  }, [score]);

  return (
    <div className="cvs-ring-wrap">
      <svg viewBox="0 0 96 96">
        <circle className="cvs-ring-bg"   cx="48" cy="48" r="40" />
        <circle
          ref={ringRef}
          className="cvs-ring-fill"
          cx="48" cy="48" r="40"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      <div className="cvs-ring-label">
        <span className="cvs-ring-num">{score}</span>
        <span className="cvs-ring-denom">/100</span>
      </div>
    </div>
  );
}

// Animated dimension bars
function DimensionBars({ dimensions }) {
  const refs = useRef([]);

  useEffect(() => {
    dimensions.forEach((dim, i) => {
      if (refs.current[i]) {
        setTimeout(() => {
          if (refs.current[i]) {
            refs.current[i].style.width       = `${dim.score}%`;
            refs.current[i].style.background  = dimBarColor(dim.score);
          }
        }, 80 + i * 60);
      }
    });
  }, [dimensions]);

  return (
    <div className="cvs-dim-list">
      {dimensions.map((dim, i) => (
        <div key={dim.name} className="cvs-dim" style={{ animationDelay: `${i * 40}ms` }}>
          <div className="cvs-dim-top">
            <span className="cvs-dim-name">{dim.name}</span>
            <span className="cvs-dim-score">{dim.score}/100</span>
          </div>
          <div className="cvs-dim-track">
            <div ref={el => { refs.current[i] = el; }} className="cvs-dim-fill" />
          </div>
          {dim.note && (
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "1px 0 0", lineHeight: 1.5 }}>
              {dim.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function CvScanner() {
  const [cvText,      setCvText]      = useState("");
  const [fileName,    setFileName]    = useState("");
  const [dragOver,    setDragOver]    = useState(false);
  const [scanning,    setScanning]    = useState(false);
  const [loadStep,    setLoadStep]    = useState(0);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState("");
  const fileInputRef                   = useRef(null);
  const stepTimer                      = useRef(null);

  const charCount = cvText.length;
  const charGood  = charCount >= 800;
  const charClass = charCount === 0 ? "" : charGood ? "good" : "warn";

  // ── File reading ──
  const readFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setCvText(e.target.result);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFileName("");
    setCvText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Animated loading steps ──
  const startStepCycle = () => {
    setLoadStep(0);
    let step = 0;
    stepTimer.current = setInterval(() => {
      step = Math.min(step + 1, LOADING_STEPS.length - 1);
      setLoadStep(step);
    }, 900);
  };

  const stopStepCycle = () => {
    if (stepTimer.current) clearInterval(stepTimer.current);
  };

  // ── Scan ──
  const handleScan = async () => {
    if (!cvText.trim()) return;
    setScanning(true);
    setResult(null);
    setError("");
    startStepCycle();

    try {
      const raw    = await callClaude(buildScanPrompt(cvText));
      const parsed = JSON.parse(raw);
      stopStepCycle();
      setResult(parsed);
    } catch {
      stopStepCycle();
      setError("Something went wrong analysing your CV. Please check it contains readable text and try again.");
    } finally {
      setScanning(false);
    }
  };

  const handleRescan = () => {
    setResult(null);
    setError("");
  };

  // ── Render: Results ──
  if (result) {
    const {
      overallScore,
      summary,
      dimensions = [],
      strengths  = [],
      weaknesses = [],
      quickWins  = [],
      keywords   = { present: [], missing: [] },
      stats      = {},
    } = result;

    const theme = scoreTheme(overallScore);

    return (
      <>
        <style>{styles}</style>
        <div className="cvs-root">
          <div className="cvs-inner">

            {/* Topbar */}
            <div className="cvs-topbar">
              <div className="cvs-topbar-left">
                <h1>CV Scanner</h1>
                <p>Scan complete — {fileName || "pasted CV"}</p>
              </div>
              <button className="cvs-rescan-btn" onClick={handleRescan}>
                ↺ Scan a different CV
              </button>
            </div>

            {/* ── Score hero ── */}
            <div className={`cvs-score-hero ${theme.cls}`} style={{ animationDelay: "0ms" }}>
              <div className="cvs-score-hero-top">
                <ScoreRing score={overallScore} theme={theme} />
                <div className="cvs-score-meta">
                  <p className="cvs-score-verdict">{theme.verdict}</p>
                  <p className="cvs-score-tagline">{summary}</p>
                  <div className="cvs-score-chips">
                    <span className={`cvs-score-chip cvs-score-chip-main`}>
                      {overallScore}/100 overall
                    </span>
                    {stats.actionVerbPct !== undefined && (
                      <span className="cvs-score-chip" style={{
                        background: "#f1f5f9", color: "#475569"
                      }}>
                        {stats.actionVerbPct}% action verbs
                      </span>
                    )}
                    {stats.quantifiedPct !== undefined && (
                      <span className="cvs-score-chip" style={{
                        background: "#f1f5f9", color: "#475569"
                      }}>
                        {stats.quantifiedPct}% quantified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick stats strip */}
              {(stats.bulletCount || stats.actionVerbPct || stats.quantifiedPct) && (
                <>
                  <div className="cvs-score-divider" />
                  <div className="cvs-quick-stats">
                    <div className="cvs-quick-stat">
                      <span className="cvs-quick-stat-num">{stats.bulletCount ?? "—"}</span>
                      <span className="cvs-quick-stat-label">Bullets</span>
                    </div>
                    <div className="cvs-quick-stat">
                      <span className={`cvs-quick-stat-num ${stats.actionVerbPct >= 70 ? "green" : stats.actionVerbPct >= 40 ? "amber" : "red"}`}>
                        {stats.actionVerbPct ?? "—"}%
                      </span>
                      <span className="cvs-quick-stat-label">Action Verbs</span>
                    </div>
                    <div className="cvs-quick-stat">
                      <span className={`cvs-quick-stat-num ${stats.quantifiedPct >= 50 ? "green" : stats.quantifiedPct >= 25 ? "amber" : "red"}`}>
                        {stats.quantifiedPct ?? "—"}%
                      </span>
                      <span className="cvs-quick-stat-label">Quantified</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── Dimension scores ── */}
            <div className="cvs-section-card" style={{ animationDelay: "40ms" }}>
              <div className="cvs-section-head">
                <span className="cvs-section-icon">📊</span>
                <p className="cvs-section-title">Score Breakdown</p>
              </div>
              <div className="cvs-section-body">
                <DimensionBars dimensions={dimensions} />
              </div>
            </div>

            {/* ── What's good ── */}
            {strengths.length > 0 && (
              <div className="cvs-section-card" style={{ animationDelay: "80ms" }}>
                <div className="cvs-section-head">
                  <span className="cvs-section-icon">✅</span>
                  <p className="cvs-section-title">What's Working</p>
                  <span className="cvs-section-count">{strengths.length}</span>
                </div>
                <div className="cvs-section-body">
                  {strengths.map((s, i) => (
                    <div key={i} className="cvs-issue-item good" style={{ animationDelay: `${i * 40}ms` }}>
                      <span className="cvs-issue-icon">✓</span>
                      <div className="cvs-issue-content">
                        <p className="cvs-issue-title">{s.title}</p>
                        <p className="cvs-issue-desc">{s.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── What's not good ── */}
            {weaknesses.length > 0 && (
              <div className="cvs-section-card" style={{ animationDelay: "120ms" }}>
                <div className="cvs-section-head">
                  <span className="cvs-section-icon">⚠️</span>
                  <p className="cvs-section-title">What Needs Fixing</p>
                  <span className="cvs-section-count">{weaknesses.length}</span>
                </div>
                <div className="cvs-section-body">
                  {weaknesses.map((w, i) => (
                    <div key={i} className="cvs-issue-item bad" style={{ animationDelay: `${i * 40}ms` }}>
                      <span className="cvs-issue-icon">✕</span>
                      <div className="cvs-issue-content">
                        <p className="cvs-issue-title">{w.title}</p>
                        <p className="cvs-issue-desc">{w.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Quick wins ── */}
            {quickWins.length > 0 && (
              <div className="cvs-section-card" style={{ animationDelay: "160ms" }}>
                <div className="cvs-section-head">
                  <span className="cvs-section-icon">⚡</span>
                  <p className="cvs-section-title">Quick Wins</p>
                  <span className="cvs-section-count">{quickWins.length} fixes</span>
                </div>
                <div className="cvs-section-body">
                  {quickWins.map((w, i) => (
                    <div key={i} className="cvs-win-item" style={{ animationDelay: `${i * 40}ms` }}>
                      <span className="cvs-win-num">{i + 1}</span>
                      <div className="cvs-win-content">
                        <p className="cvs-win-title">{w.title}</p>
                        <p className="cvs-win-desc">{w.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Keywords ── */}
            {(keywords.present?.length > 0 || keywords.missing?.length > 0) && (
              <div className="cvs-section-card" style={{ animationDelay: "200ms" }}>
                <div className="cvs-section-head">
                  <span className="cvs-section-icon">🏷</span>
                  <p className="cvs-section-title">Keyword Analysis</p>
                </div>
                <div className="cvs-section-body">
                  {keywords.present?.length > 0 && (
                    <>
                      <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 6px" }}>
                        Present ✓
                      </p>
                      <div className="cvs-keyword-wrap" style={{ marginBottom: "12px" }}>
                        {keywords.present.map((kw, i) => (
                          <span key={i} className="cvs-keyword present">{kw}</span>
                        ))}
                      </div>
                    </>
                  )}
                  {keywords.missing?.length > 0 && (
                    <>
                      <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#94a3b8", margin: "0 0 6px" }}>
                        Missing — consider adding
                      </p>
                      <div className="cvs-keyword-wrap">
                        {keywords.missing.map((kw, i) => (
                          <span key={i} className="cvs-keyword missing">{kw}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </>
    );
  }

  // ── Render: Loading ──
  if (scanning) {
    return (
      <>
        <style>{styles}</style>
        <div className="cvs-root">
          <div className="cvs-inner">
            <div className="cvs-topbar">
              <div className="cvs-topbar-left">
                <h1>CV Scanner</h1>
                <p>Analysing your CV…</p>
              </div>
            </div>
            <div className="cvs-loading-card">
              <div className="cvs-loading-ring" />
              <p className="cvs-loading-title">Scanning your CV</p>
              <p className="cvs-loading-sub">
                This takes about 10–15 seconds.<br />
                We're checking every section carefully.
              </p>
              <div className="cvs-loading-steps">
                {LOADING_STEPS.map((step, i) => (
                  <div
                    key={step}
                    className={`cvs-loading-step ${
                      i < loadStep ? "done" : i === loadStep ? "active" : ""
                    }`}
                  >
                    <div className="cvs-loading-step-dot" />
                    {i < loadStep ? `✓ ${step}` : step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Render: Input ──
  return (
    <>
      <style>{styles}</style>
      <div className="cvs-root">
        <div className="cvs-inner">

          {/* Topbar */}
          <div className="cvs-topbar">
            <div className="cvs-topbar-left">
              <h1>CV Scanner</h1>
              <p>Get an honest score and actionable improvements for your CV</p>
            </div>
          </div>

          {/* ── Step 1: Upload or paste ── */}
          <div className="cvs-card" style={{ animationDelay: "0ms" }}>
            <div className="cvs-card-head">
              <div className={`cvs-step-badge ${cvText ? "done" : ""}`}>
                {cvText ? "✓" : "1"}
              </div>
              <p className="cvs-card-title">Add your CV</p>
              <p className="cvs-card-sub">Upload a file or paste the text</p>
            </div>
            <div className="cvs-card-body">

              {/* Drop zone */}
              <div
                className={`cvs-upload-zone ${dragOver ? "drag-over" : ""} ${fileName ? "has-file" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  readFile(e.dataTransfer.files[0]);
                }}
                onClick={() => !fileName && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={(e) => readFile(e.target.files[0])}
                />

                <div className="cvs-upload-icon-wrap">
                  {fileName ? "📄" : "⬆"}
                </div>

                {fileName ? (
                  <>
                    <p className="cvs-upload-file-name">
                      {fileName}
                      <button className="cvs-clear-file" onClick={clearFile}>✕</button>
                    </p>
                    <p className="cvs-upload-sub">File loaded — text extracted below</p>
                  </>
                ) : (
                  <>
                    <p className="cvs-upload-title">Drop your CV here</p>
                    <p className="cvs-upload-sub">.txt, .pdf, .doc, or .docx</p>
                    <button
                      className="cvs-rescan-btn"
                      style={{ marginTop: "4px", position: "relative", zIndex: 2 }}
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      Browse file
                    </button>
                  </>
                )}
              </div>

              {/* OR */}
              <div className="cvs-or">
                <div className="cvs-or-line" />
                <span className="cvs-or-label">or paste text</span>
                <div className="cvs-or-line" />
              </div>

              {/* Paste textarea */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <textarea
                  className={`cvs-textarea ${cvText.trim() ? "has-content" : ""}`}
                  placeholder="Paste your full CV here — copy everything from Word, Google Docs, or a PDF. The more complete, the more accurate the scan."
                  value={cvText}
                  onChange={e => { setCvText(e.target.value); if (fileName) setFileName(""); }}
                />
                <div className="cvs-char-row">
                  <span className="cvs-char-hint">
                    {!charGood && charCount > 0
                      ? "Add more text for an accurate scan (aim for 800+ characters)"
                      : charGood
                      ? "Good length — ready to scan"
                      : "Paste your CV above to get started"}
                  </span>
                  <span className={`cvs-char-count ${charClass}`}>
                    {charCount > 0 ? `${charCount.toLocaleString()} chars` : ""}
                  </span>
                </div>
              </div>

              {error && (
                <div className="cvs-error">
                  <span>⚠</span> {error}
                </div>
              )}

              {/* Scan button */}
              <button
                className="cvs-scan-btn"
                disabled={!cvText.trim()}
                onClick={handleScan}
              >
                <span className="cvs-scan-btn-icon">✦</span>
                Scan My CV
              </button>

            </div>
          </div>

          {/* ── What you'll get ── */}
          {!cvText && (
            <div className="cvs-card" style={{ animationDelay: "60ms" }}>
              <div className="cvs-card-head">
                <p className="cvs-card-title">What you'll get</p>
              </div>
              <div className="cvs-card-body" style={{ gap: "8px" }}>
                {[
                  { icon: "🎯", title: "Overall score /100",       desc: "An honest, weighted score across five professional dimensions." },
                  { icon: "📊", title: "5-dimension breakdown",    desc: "Impact language, quantified results, skills, ATS compatibility, clarity." },
                  { icon: "✅", title: "What's working",           desc: "Concrete strengths identified in your CV — so you know what to keep." },
                  { icon: "⚠️", title: "What needs fixing",        desc: "Specific weaknesses with enough detail to act on immediately." },
                  { icon: "⚡", title: "Quick wins",               desc: "3–5 prioritised fixes ordered by impact — actionable, not generic." },
                  { icon: "🏷", title: "Keyword analysis",         desc: "Keywords present in your CV and important ones you're missing." },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "11px",
                      padding: "9px 0",
                      borderBottom: i < 5 ? "1px solid #f8fafc" : "none",
                    }}
                  >
                    <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", margin: "0 0 2px" }}>{item.title}</p>
                      <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.55 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
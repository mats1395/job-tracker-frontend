import { useState, useRef, useEffect } from "react";
import { useJobs } from "../hooks/useJobs"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap');

  .db-root {
    min-height: calc(100vh - 60px);
    background: #f0f4f8;
    font-family: 'Geist', system-ui, sans-serif;
    padding: 28px 24px;
  }

  .db-topbar {
    max-width: 1400px;
    margin: 0 auto 20px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .db-topbar-left h1 {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 3px;
    letter-spacing: -0.3px;
  }

  .db-topbar-left p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }

  .db-top-add {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #0f172a;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 9px 18px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: opacity 0.15s;
  }

  .db-top-add:hover { opacity: 0.85; }

  .db-stats {
    max-width: 1400px;
    margin: 0 auto 18px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }

  .db-stat {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 16px;
  }

  .db-stat-n {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.5px;
    line-height: 1;
    margin: 0 0 4px;
  }

  .db-stat-l {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #64748b;
    margin: 0;
  }

  .db-board {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    align-items: start;
  }

  @media (max-width: 1100px) {
    .db-board { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 720px) {
    .db-board { grid-template-columns: repeat(2, 1fr); }
    .db-root  { padding: 20px 16px; }
  }
  @media (max-width: 480px) {
    .db-board { grid-template-columns: 1fr; }
    .db-stats { grid-template-columns: repeat(2, 1fr); }
  }

  .db-col {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    transition: outline 0.1s;
  }

  .db-col.drag-over {
    outline: 2px dashed #4f46e5;
    outline-offset: -2px;
  }

  .db-col-head {
    padding: 12px 13px 10px;
    display: flex;
    align-items: center;
    gap: 7px;
    border-bottom: 1px solid #f1f5f9;
  }

  .db-col-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .db-col-lbl {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #0f172a;
    flex: 1;
  }

  .db-col-cnt {
    font-size: 11px;
    font-weight: 600;
    background: white;
    border: 1px solid #e2e8f0;
    color: #64748b;
    padding: 1px 8px;
    border-radius: 99px;
  }

  .db-col-body {
    padding: 7px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 60px;
  }

  /* ── Job Card ── */
  .db-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 12px;
    cursor: grab;
    border-left: 3px solid transparent;
    transition: box-shadow 0.15s, transform 0.15s;
    user-select: none;
  }

  .db-card:hover {
    box-shadow: 0 3px 10px rgba(0,0,0,0.07);
    transform: translateY(-1px);
  }

  .db-card:hover .db-card-followup-btn {
    opacity: 1;
  }

  .db-card.dragging {
    opacity: 0.5;
    cursor: grabbing;
  }

  .db-card-role {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .db-card-company {
    font-size: 12px;
    color: #64748b;
    margin: 0 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .db-card-tags {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }

  .db-card-tags:last-child {
    margin-bottom: 0;
  }

  .db-tag {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 5px;
    border: 1px solid;
  }

  .db-tag-salary   { background: #eaf3de; color: #3b6d11; border-color: #c0dd97; }
  .db-tag-easy     { background: #eaf3de; color: #3b6d11; border-color: #c0dd97; }
  .db-tag-medium   { background: #faeeda; color: #854f0b; border-color: #fac775; }
  .db-tag-hard     { background: #fcebeb; color: #a32d2d; border-color: #f7c1c1; }
  .db-tag-fulltime { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
  .db-tag-parttime { background: #faf5ff; color: #7e22ce; border-color: #e9d5ff; }
  .db-tag-deadline { background: #fff7ed; color: #c2410c; border-color: #fed7aa; }

  /* ── Follow-up button on card ── */
  .db-card-followup-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 5px 8px;
    border-radius: 7px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    font-size: 11px;
    font-weight: 600;
    color: #4f46e5;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
    opacity: 0;
    margin-top: 2px;
  }

  .db-card-followup-btn:hover {
    background: #eef2ff;
    border-color: #c7d2fe;
    color: #3730a3;
  }

  .db-add-card {
    width: 100%;
    border: 1px dashed #cbd5e1;
    border-radius: 10px;
    padding: 7px;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    color: #94a3b8;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
  }

  .db-add-card:hover {
    border-color: #4f46e5;
    color: #4f46e5;
    background: #eef2ff;
  }

  .db-empty {
    font-size: 12px;
    color: #cbd5e1;
    text-align: center;
    padding: 14px 8px;
  }

  .db-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #0f172a;
    color: white;
    padding: 8px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Geist', system-ui, sans-serif;
    opacity: 0;
    transition: opacity 0.25s;
    pointer-events: none;
    z-index: 999;
    white-space: nowrap;
  }

  .db-toast.show { opacity: 1; }

  /* ── Shared modal base ── */
  .db-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,0.5);
    backdrop-filter: blur(4px);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .db-modal {
    background: white;
    border-radius: 18px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.15);
    overflow: hidden;
  }

  .db-modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 17px 22px;
    border-bottom: 1px solid #f1f5f9;
  }

  .db-modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .db-modal-close {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 16px;
    font-family: 'Geist', system-ui, sans-serif;
    transition: background 0.15s;
  }

  .db-modal-close:hover { background: #f8fafc; }

  .db-modal-body {
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 13px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .db-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .db-field label {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
  }

  .db-field input,
  .db-field select,
  .db-field textarea {
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    padding: 9px 12px;
    font-size: 14px;
    color: #0f172a;
    font-family: 'Geist', system-ui, sans-serif;
    outline: none;
    background: white;
    width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }

  .db-field input:focus,
  .db-field select:focus,
  .db-field textarea:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.08);
  }

  .db-field input.error,
  .db-field textarea.error {
    border-color: #ef4444;
  }

  .db-field textarea {
    resize: none;
    height: 70px;
  }

  .db-field textarea.tall {
    height: 90px;
  }

  .db-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .db-modal-foot {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 13px 22px 18px;
    border-top: 1px solid #f1f5f9;
  }

  .db-btn-cancel {
    padding: 8px 16px;
    border-radius: 9px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: background 0.15s;
  }

  .db-btn-cancel:hover { background: #f8fafc; }

  .db-btn-save {
    padding: 8px 22px;
    border-radius: 9px;
    border: none;
    background: #0f172a;
    font-size: 13px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: opacity 0.15s;
  }

  .db-btn-save:hover { opacity: 0.85; }
  .db-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

  .db-req { color: #ef4444; margin-left: 2px; }

  /* ── Follow-up modal specific ── */
  .fu-modal { max-width: 520px; }

  .fu-job-banner {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 11px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .fu-job-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .fu-job-info { flex: 1; min-width: 0; }

  .fu-job-role {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .fu-job-meta {
    font-size: 11px;
    color: #64748b;
    margin: 0;
  }

  .fu-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 99px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .fu-days-badge {
    background: #eef2ff;
    color: #4f46e5;
    border: 1px solid #c7d2fe;
  }

  .fu-section-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #94a3b8;
    margin: 0;
  }

  .fu-optional-hint {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    margin-left: 4px;
  }

  .fu-optional-block {
    background: #fafbff;
    border: 1px solid #e8eaf6;
    border-radius: 10px;
    padding: 13px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .fu-optional-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #eef2ff;
    border: 1px solid #c7d2fe;
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 700;
    color: #4f46e5;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    align-self: flex-start;
  }

  .fu-optional-desc {
    font-size: 12px;
    color: #64748b;
    margin: 0 0 6px;
    line-height: 1.5;
  }

  .fu-tone-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .fu-tone-btn {
    padding: 8px 6px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
    text-align: center;
  }

  .fu-tone-btn:hover  { border-color: #a5b4fc; color: #4f46e5; background: #f5f3ff; }
  .fu-tone-btn.active { border-color: #4f46e5; background: #eef2ff; color: #4f46e5; }

  .fu-reason-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .fu-reason-btn {
    padding: 7px 6px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
    text-align: center;
    line-height: 1.3;
  }

  .fu-reason-btn:hover  { border-color: #a5b4fc; color: #4f46e5; background: #f5f3ff; }
  .fu-reason-btn.active { border-color: #4f46e5; background: #eef2ff; color: #4f46e5; }

  .fu-generate-btn {
    width: 100%;
    padding: 11px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #4f46e5, #6d28d9);
    font-size: 13px;
    font-weight: 700;
    color: white;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: opacity 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    letter-spacing: 0.01em;
  }

  .fu-generate-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
  .fu-generate-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* ── Result modal ── */
  .res-modal { max-width: 520px; }

  .res-modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 17px 22px;
    border-bottom: 1px solid #f1f5f9;
  }

  .res-modal-title-wrap { display: flex; align-items: center; gap: 9px; }

  .res-ai-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4f46e5, #6d28d9);
    box-shadow: 0 0 6px rgba(79,70,229,0.5);
    animation: pulse-dot 2s infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 6px rgba(79,70,229,0.5); }
    50%       { box-shadow: 0 0 12px rgba(79,70,229,0.9); }
  }

  .res-modal-body {
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-height: 65vh;
    overflow-y: auto;
  }

  .res-meta-row { display: flex; gap: 6px; flex-wrap: wrap; }

  .res-meta-chip {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    color: #64748b;
    background: #f8fafc;
  }

  .res-email-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
  }

  .res-email-subj {
    padding: 10px 14px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 12px;
    font-weight: 700;
    color: #374151;
    background: white;
  }

  .res-email-subj span { color: #64748b; font-weight: 400; }

  .res-email-body-text {
    padding: 14px;
    font-size: 13px;
    color: #374151;
    line-height: 1.7;
    white-space: pre-wrap;
    min-height: 120px;
  }

  .res-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    gap: 12px;
  }

  .res-loading-dots { display: flex; gap: 5px; }

  .res-loading-dots span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4f46e5;
    animation: bounce-dot 1.2s infinite ease-in-out;
  }

  .res-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .res-loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce-dot {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
    40%            { transform: scale(1);   opacity: 1;   }
  }

  .res-loading-text {
    font-size: 13px;
    color: #94a3b8;
    font-weight: 500;
  }

  .res-modal-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 13px 22px 18px;
    border-top: 1px solid #f1f5f9;
  }

  .res-back-btn {
    padding: 8px 14px;
    border-radius: 9px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .res-back-btn:hover { background: #f8fafc; }

  .res-copy-btn {
    padding: 8px 20px;
    border-radius: 9px;
    border: none;
    background: #0f172a;
    font-size: 13px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: opacity 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .res-copy-btn:hover { opacity: 0.85; }
  .res-copy-btn.copied { background: #16a34a; }

  .res-regen-btn {
    padding: 8px 14px;
    border-radius: 9px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 13px;
    font-weight: 500;
    color: #4f46e5;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
  }

  .res-regen-btn:hover { background: #eef2ff; border-color: #c7d2fe; }

  /* Streaming cursor */
  .stream-cursor {
    display: inline-block;
    width: 2px;
    height: 14px;
    background: #4f46e5;
    margin-left: 2px;
    vertical-align: middle;
    animation: blink 0.8s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  /* ── Job Detail Modal ── */
  .jd-modal {
    max-width: 480px;
  }

  /* ── Tabs ── */
  .jd-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid #f1f5f9;
    padding: 0 22px;
  }

  .jd-tab {
    padding: 11px 4px 10px;
    margin-right: 20px;
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: color 0.15s, border-color 0.15s;
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }

  .jd-tab:hover { color: #475569; }

  .jd-tab.active {
    color: #0f172a;
    border-bottom-color: #0f172a;
  }

  .jd-tab-ai-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4f46e5, #6d28d9);
    flex-shrink: 0;
  }

  .jd-hero {
    padding: 20px 22px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .jd-color-bar {
    width: 4px;
    border-radius: 99px;
    align-self: stretch;
    flex-shrink: 0;
    min-height: 48px;
  }

  .jd-hero-info { flex: 1; min-width: 0; }

  .jd-role {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 3px;
    letter-spacing: -0.3px;
  }

  .jd-company {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 10px;
    font-weight: 500;
  }

  .jd-tags { display: flex; gap: 5px; flex-wrap: wrap; }

  .jd-body {
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .jd-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 11px 0;
    border-bottom: 1px solid #f8fafc;
  }

  .jd-row:last-child { border-bottom: none; }

  .jd-row-label {
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    flex-shrink: 0;
    padding-top: 1px;
  }

  .jd-row-val {
    font-size: 13px;
    font-weight: 500;
    color: #0f172a;
    text-align: right;
    max-width: 65%;
  }

  .jd-notes-block {
    margin: 0 22px 18px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    border-radius: 10px;
    padding: 12px 14px;
  }

  .jd-notes-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #94a3b8;
    margin: 0 0 6px;
  }

  .jd-notes-text {
    font-size: 13px;
    color: #374151;
    line-height: 1.65;
    margin: 0;
    white-space: pre-wrap;
  }

  .jd-empty-notes {
    font-size: 13px;
    color: #cbd5e1;
    font-style: italic;
    margin: 0;
  }

  .jd-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 22px 18px;
    border-top: 1px solid #f1f5f9;
    gap: 8px;
  }

  .jd-followup-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 9px;
    border: 1px solid #c7d2fe;
    background: #eef2ff;
    font-size: 13px;
    font-weight: 600;
    color: #4f46e5;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
  }

  .jd-followup-btn:hover { background: #e0e7ff; border-color: #a5b4fc; }

  .jd-close-btn {
    padding: 8px 20px;
    border-radius: 9px;
    border: none;
    background: #0f172a;
    font-size: 13px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: opacity 0.15s;
  }

  .jd-close-btn:hover { opacity: 0.85; }

  .jd-link-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 500;
    color: #4f46e5;
    text-decoration: none;
    padding: 2px 0;
  }

  .jd-link-btn:hover { text-decoration: underline; }

  /* ── Delete button on card ── */
  .db-card-delete-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 5px 8px;
    border-radius: 7px;
    border: 1px solid #fee2e2;
    background: #fff5f5;
    font-size: 11px;
    font-weight: 600;
    color: #ef4444;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
    opacity: 0;
    margin-top: 4px;
  }

  .db-card:hover .db-card-delete-btn { opacity: 1; }
  .db-card-delete-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #b91c1c; }

  .fu-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }

  .fu-type-btn {
    padding: 9px 6px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
    text-align: center;
  }

  .fu-type-btn:hover  { border-color: #a5b4fc; color: #4f46e5; background: #f5f3ff; }
  .fu-type-btn.active { border-color: #4f46e5; background: #eef2ff; color: #4f46e5; }

  /* ───────────────────────────────────────────
     AI ANALYSIS TAB
  ─────────────────────────────────────────── */

  .ai-tab-body {
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-height: 62vh;
    overflow-y: auto;
  }

  /* Input area — paste JD */
  .ai-input-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ai-input-label {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ai-input-hint {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 400;
  }

  .ai-jd-textarea {
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 11px 13px;
    font-size: 13px;
    color: #0f172a;
    font-family: 'Geist', system-ui, sans-serif;
    outline: none;
    background: white;
    width: 100%;
    resize: none;
    height: 120px;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
    line-height: 1.6;
  }

  .ai-jd-textarea:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.08);
  }

  .ai-jd-textarea::placeholder { color: #cbd5e1; }

  .ai-url-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    padding: 9px 12px;
  }

  .ai-url-icon { font-size: 13px; flex-shrink: 0; }

  .ai-url-text {
    font-size: 12px;
    color: #64748b;
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ai-url-note {
    font-size: 11px;
    color: #94a3b8;
    font-style: italic;
  }

  .ai-analyse-btn {
    width: 100%;
    padding: 11px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #4f46e5, #6d28d9);
    font-size: 13px;
    font-weight: 700;
    color: white;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: opacity 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
  }

  .ai-analyse-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
  .ai-analyse-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .ai-profile-note {
    display: flex;
    align-items: center;
    gap: 7px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 8px 11px;
    font-size: 11px;
    color: #15803d;
    font-weight: 500;
  }

  .ai-profile-note-warn {
    background: #fffbeb;
    border-color: #fde68a;
    color: #92400e;
  }

  /* Loading state */
  .ai-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0 36px;
    gap: 14px;
  }

  .ai-loading-ring {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid #e2e8f0;
    border-top-color: #4f46e5;
    animation: spin-ring 0.8s linear infinite;
  }

  @keyframes spin-ring {
    to { transform: rotate(360deg); }
  }

  .ai-loading-label {
    font-size: 13px;
    color: #94a3b8;
    font-weight: 500;
  }

  /* ── Fit Score Card ── */
  .ai-score-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ai-score-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  .ai-score-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #94a3b8;
  }

  .ai-score-number {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1;
  }

  .ai-score-denom {
    font-size: 14px;
    font-weight: 500;
    color: #94a3b8;
  }

  .ai-score-verdict {
    font-size: 12px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 99px;
    letter-spacing: 0.03em;
  }

  .ai-score-bar-track {
    width: 100%;
    height: 8px;
    background: #e2e8f0;
    border-radius: 99px;
    overflow: hidden;
  }

  .ai-score-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
    width: 0%;
  }

  .ai-score-summary {
    font-size: 12px;
    color: #64748b;
    line-height: 1.6;
    margin: 0;
  }

  /* Score colour themes */
  .score-great .ai-score-number         { color: #16a34a; }
  .score-great .ai-score-verdict        { background: #dcfce7; color: #15803d; }
  .score-great .ai-score-bar-fill       { background: linear-gradient(90deg, #22c55e, #16a34a); }

  .score-good .ai-score-number          { color: #4f46e5; }
  .score-good .ai-score-verdict         { background: #eef2ff; color: #4338ca; }
  .score-good .ai-score-bar-fill        { background: linear-gradient(90deg, #6366f1, #4f46e5); }

  .score-fair .ai-score-number          { color: #d97706; }
  .score-fair .ai-score-verdict         { background: #fef3c7; color: #92400e; }
  .score-fair .ai-score-bar-fill        { background: linear-gradient(90deg, #fbbf24, #d97706); }

  .score-low .ai-score-number           { color: #ef4444; }
  .score-low .ai-score-verdict          { background: #fee2e2; color: #b91c1c; }
  .score-low .ai-score-bar-fill         { background: linear-gradient(90deg, #f87171, #ef4444); }

  /* ── Analysis sections ── */
  .ai-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ai-section-head {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .ai-section-icon {
    font-size: 14px;
    line-height: 1;
    flex-shrink: 0;
  }

  .ai-section-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #374151;
  }

  .ai-section-count {
    font-size: 10px;
    font-weight: 700;
    background: #f1f5f9;
    color: #64748b;
    padding: 1px 7px;
    border-radius: 99px;
    margin-left: auto;
  }

  /* Role breakdown prose */
  .ai-role-text {
    font-size: 13px;
    color: #374151;
    line-height: 1.65;
    margin: 0;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    border-radius: 10px;
    padding: 12px 14px;
  }

  /* Must-have / Nice-to-have items */
  .ai-checklist {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .ai-check-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: #374151;
    line-height: 1.5;
    padding: 7px 10px;
    border-radius: 8px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
  }

  .ai-check-icon {
    font-size: 13px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .ai-check-text { flex: 1; }

  .ai-check-match {
    font-size: 10px;
    font-weight: 700;
    padding: 1px 7px;
    border-radius: 99px;
    flex-shrink: 0;
    align-self: center;
  }

  .ai-check-match.match    { background: #dcfce7; color: #15803d; }
  .ai-check-match.no-match { background: #fee2e2; color: #b91c1c; }
  .ai-check-match.partial  { background: #fef3c7; color: #92400e; }

  /* Red flags */
  .ai-flag-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: #7f1d1d;
    line-height: 1.5;
    padding: 8px 10px;
    border-radius: 8px;
    background: #fff5f5;
    border: 1px solid #fee2e2;
  }

  .ai-no-flags {
    font-size: 13px;
    color: #15803d;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 9px 12px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  /* Keywords */
  .ai-keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .ai-keyword {
    font-size: 12px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: white;
    color: #374151;
    transition: all 0.15s;
  }

  .ai-keyword.matched {
    background: #eef2ff;
    border-color: #c7d2fe;
    color: #4338ca;
    font-weight: 600;
  }

  /* Re-analyse button */
  .ai-reanalyse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 9px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
    width: fit-content;
    align-self: flex-end;
  }

  .ai-reanalyse-btn:hover { background: #f8fafc; border-color: #cbd5e1; color: #374151; }

  /* Divider */
  .ai-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 2px 0;
  }
`;

const COLUMNS = [
  { id: "wishlist",  label: "Wishlist",  dot: "#94a3b8", border: "#94a3b8" },
  { id: "applied",   label: "Applied",   dot: "#4f46e5", border: "#4f46e5" },
  { id: "interview", label: "Interview", dot: "#f59e0b", border: "#f59e0b" },
  { id: "offer",     label: "Offer",     dot: "#22c55e", border: "#22c55e" },
  { id: "rejected",  label: "Rejected",  dot: "#ef4444", border: "#ef4444" },
];


const TONES   = ["Formal", "Friendly", "Assertive"];
const REASONS = ["Checking Status", "Share New Info", "Thank You"];

function diffClass(d) {
  return { Easy: "db-tag-easy", Medium: "db-tag-medium", Hard: "db-tag-hard" }[d] || "db-tag-medium";
}

function daysAgo(ts) {
  if (!ts) return null;
  return Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24));
}

function colMeta(statusId) {
  return COLUMNS.find(c => c.id === statusId) || COLUMNS[0];
}

function getProfileSkills() {
  try {
    const raw = localStorage.getItem("jobTrackerProfile");
    if (!raw) return null;
    const profile = JSON.parse(raw);
    return profile.skills || null;
  } catch {
    return null;
  }
}

function scoreTheme(score) {
  if (score >= 80) return { cls: "score-great", label: "Strong Fit" };
  if (score >= 60) return { cls: "score-good",  label: "Good Fit"   };
  if (score >= 40) return { cls: "score-fair",  label: "Partial Fit"};
  return               { cls: "score-low",   label: "Low Fit"    };
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, setToast) {
  setToast({ msg, show: true });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => setToast({ msg: "", show: false }), 2200);
}

// ── Job Card ──────────────────────────────────────────────────────────────────
function JobCard({ job, borderColor, onDragStart, onDragEnd, dragging, onFollowUp, onDetail, onDelete }) {
  const dragStarted = useRef(false);

  return (
    <div
      className={`db-card ${dragging ? "dragging" : ""}`}
      style={{ borderLeftColor: borderColor }}
      draggable
      onDragStart={(e) => { dragStarted.current = true; onDragStart(e, job._id); }}
      onDragEnd={(e)   => { onDragEnd(e); setTimeout(() => { dragStarted.current = false; }, 100); }}
      onClick={() => { if (!dragStarted.current) onDetail(job); }}
    >
      <p className="db-card-role">{job.role}</p>
      <p className="db-card-company">{job.company}</p>
      <div className="db-card-tags">
        {job.salary && <span className="db-tag db-tag-salary">{job.salary}</span>}
        {job.difficulty && (
          <span className={`db-tag ${diffClass(job.difficulty)}`}>{job.difficulty}</span>
        )}
        {job.jobType && (
          <span className={`db-tag ${job.jobType === "Full-time" ? "db-tag-fulltime" : "db-tag-parttime"}`}>
            {job.jobType}
          </span>
        )}
        {job.deadline && (
          <span className="db-tag db-tag-deadline">
            📅 {new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
        )}
      </div>
      {job.status !== "wishlist" && job.status !== "rejected" && (
        <button
          className="db-card-followup-btn"
          onClick={(e) => { e.stopPropagation(); onFollowUp(job); }}
        >
          ✉ Write Follow-Up
        </button>
      )}
      <button
        className="db-card-delete-btn"
        onClick={(e) => { e.stopPropagation(); onDelete(job._id); }}
      >
        ✕ Delete
      </button>
    </div>
  );
}

// ── Column ────────────────────────────────────────────────────────────────────
function Column({ col, jobs, draggingId, onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop, onAddClick, onFollowUp, onDetail, onDelete }) {
  return (
    <div
      className="db-col"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, col.id)}
    >
      <div className="db-col-head">
        <div className="db-col-dot" style={{ background: col.dot }} />
        <span className="db-col-lbl">{col.label}</span>
        <span className="db-col-cnt">{jobs.length}</span>
      </div>
      <div className="db-col-body">
        {jobs.length === 0 && <p className="db-empty">Drop cards here</p>}
        {jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            borderColor={col.border}
            dragging={draggingId === job.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onFollowUp={onFollowUp}
            onDetail={onDetail}
            onDelete={onDelete}
          />
        ))}
        <button className="db-add-card" onClick={() => onAddClick(col.id)}>
          + Add job
        </button>
      </div>
    </div>
  );
}

// ── Add Job Modal ─────────────────────────────────────────────────────────────
function AddJobModal({ onClose, onSave, defaultStatus }) {
  const [form, setForm] = useState({
    company: "", role: "", salary: "",
    difficulty: "Medium", status: defaultStatus || "wishlist",
    notes: "", jobType: "Full-time", deadline: "", url: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    const newErrors = {};
    if (!form.company.trim()) newErrors.company = true;
    if (!form.role.trim())    newErrors.role    = true;
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    onSave({ ...form, id: Date.now(), appliedAt: Date.now() });
    onClose();
  };

  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal" onClick={e => e.stopPropagation()}>
        <div className="db-modal-head">
          <h2 className="db-modal-title">Add new job</h2>
          <button className="db-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="db-modal-body">
          <div className="db-field">
            <label>Company <span className="db-req">*</span></label>
            <input
              className={errors.company ? "error" : ""}
              placeholder="e.g. Spotify"
              value={form.company}
              onChange={e => { set("company", e.target.value); setErrors(p => ({ ...p, company: false })); }}
            />
          </div>
          <div className="db-field">
            <label>Job title <span className="db-req">*</span></label>
            <input
              className={errors.role ? "error" : ""}
              placeholder="e.g. Frontend Engineer"
              value={form.role}
              onChange={e => { set("role", e.target.value); setErrors(p => ({ ...p, role: false })); }}
            />
          </div>

          <div className="db-field">
            <label>Job type</label>
            <div className="fu-type-grid">
              {["Full-time", "Part-time"].map(t => (
                <button
                  key={t}
                  className={`fu-type-btn ${form.jobType === t ? "active" : ""}`}
                  onClick={() => set("jobType", t)}
                >
                  {t === "Full-time" ? "💼 Full-time" : "⏱ Part-time"}
                </button>
              ))}
            </div>
          </div>

          <div className="db-field-row">
            <div className="db-field">
              <label>Salary</label>
              <input
                placeholder="e.g. $90k"
                value={form.salary}
                onChange={e => set("salary", e.target.value)}
              />
            </div>
            <div className="db-field">
              <label>Difficulty</label>
              <select value={form.difficulty} onChange={e => set("difficulty", e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div className="db-field-row">
            <div className="db-field">
              <label>Stage</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}>
                {COLUMNS.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="db-field">
              <label>Deadline <span style={{fontSize:"11px",color:"#94a3b8",fontWeight:400}}>— optional</span></label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => set("deadline", e.target.value)}
              />
            </div>
          </div>

          <div className="db-field">
            <label>Job posting URL <span style={{fontSize:"11px",color:"#94a3b8",fontWeight:400}}>— optional</span></label>
            <input
              type="url"
              placeholder="https://..."
              value={form.url}
              onChange={e => set("url", e.target.value)}
            />
          </div>

          <div className="db-field">
            <label>Notes</label>
            <textarea
              placeholder="Any notes about this application..."
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
            />
          </div>
        </div>
        <div className="db-modal-foot">
          <button className="db-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="db-btn-save" onClick={handleSave}>Save job</button>
        </div>
      </div>
    </div>
  );
}

// ── Follow-Up Form Modal ──────────────────────────────────────────────────────
function FollowUpModal({ job, onClose, onGenerate }) {
  const days   = daysAgo(job.appliedAt);
  const meta   = colMeta(job.status);

  const [tone,       setTone]       = useState("Friendly");
  const [reason,     setReason]     = useState("Checking Status");
  const [myMsg,      setMyMsg]      = useState("");
  const [theirReply, setTheirReply] = useState("");
  const [notes,      setNotes]      = useState("");

  const handleGenerate = () => {
    onGenerate({ job, tone, reason, myMsg, theirReply, notes, days });
  };

  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal fu-modal" onClick={e => e.stopPropagation()}>
        <div className="db-modal-head">
          <h2 className="db-modal-title">✉ Write Follow-Up Email</h2>
          <button className="db-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="db-modal-body">
          <div className="fu-job-banner">
            <div className="fu-job-dot" style={{ background: meta.dot }} />
            <div className="fu-job-info">
              <p className="fu-job-role">{job.role}</p>
              <p className="fu-job-meta">{job.company} · {meta.label}</p>
            </div>
            {days !== null && (
              <span className="fu-badge fu-days-badge">{days}d ago</span>
            )}
          </div>

          <div className="db-field">
            <label>Tone</label>
            <div className="fu-tone-grid">
              {TONES.map(t => (
                <button
                  key={t}
                  className={`fu-tone-btn ${tone === t ? "active" : ""}`}
                  onClick={() => setTone(t)}
                >
                  {t === "Formal" ? "🎩 Formal" : t === "Friendly" ? "👋 Friendly" : "💪 Assertive"}
                </button>
              ))}
            </div>
          </div>

          <div className="db-field">
            <label>Follow-up reason</label>
            <div className="fu-reason-grid">
              {REASONS.map(r => (
                <button
                  key={r}
                  className={`fu-reason-btn ${reason === r ? "active" : ""}`}
                  onClick={() => setReason(r)}
                >
                  {r === "Checking Status" ? "📋 Checking Status" : r === "Share New Info" ? "📢 Share New Info" : "🙏 Thank You"}
                </button>
              ))}
            </div>
          </div>

          <div className="fu-optional-block">
            <div className="fu-optional-tag">✨ Recommended</div>
            <p className="fu-optional-desc">
              Add context from your conversation to get a more personalized email — but feel free to skip this.
            </p>

            <div className="db-field">
              <label>My last message <span className="fu-optional-hint">— optional</span></label>
              <textarea
                className="tall"
                placeholder="Paste the last message you sent them..."
                value={myMsg}
                onChange={e => setMyMsg(e.target.value)}
              />
            </div>

            <div className="db-field">
              <label>Their reply <span className="fu-optional-hint">— optional</span></label>
              <textarea
                className="tall"
                placeholder="Paste their response if you received one..."
                value={theirReply}
                onChange={e => setTheirReply(e.target.value)}
              />
            </div>
          </div>

          <div className="db-field">
            <label>Extra context <span className="fu-optional-hint">— optional</span></label>
            <textarea
              placeholder="Anything else to mention? e.g. 'mention my portfolio update'"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button className="fu-generate-btn" onClick={handleGenerate}>
            <span>✦</span> Generate Follow-Up Email
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Result Modal ──────────────────────────────────────────────────────────────
function ResultModal({ params, onClose, onBack }) {
  const { job, tone, reason, myMsg, theirReply, notes, days } = params;

  const [loading,   setLoading]   = useState(true);
  const [subject,   setSubject]   = useState("");
  const [body,      setBody]      = useState("");
  const [streaming, setStreaming] = useState(false);
  const [copied,    setCopied]    = useState(false);
  const hasGenerated = useRef(false);

  const buildPrompt = () => {
    const contextParts = [];
    if (myMsg.trim())      contextParts.push(`My last message to them:\n"${myMsg.trim()}"`);
    if (theirReply.trim()) contextParts.push(`Their reply:\n"${theirReply.trim()}"`);
    if (notes.trim())      contextParts.push(`Extra context: ${notes.trim()}`);
    const contextBlock = contextParts.length > 0
      ? `\n\nConversation context:\n${contextParts.join("\n\n")}`
      : "";

    return `You are a professional job application email writer.

Write a follow-up email for a job application with these details:
- Role: ${job.role}
- Company: ${job.company}
- Application status: ${job.status}
- Days since applied: ${days !== null ? days : "unknown"}
- Tone: ${tone}
- Reason for follow-up: ${reason}${contextBlock}

Output ONLY a JSON object with exactly two keys:
{
  "subject": "...",
  "body": "..."
}

Requirements:
- Subject line: short, professional, specific to this role/company
- Body: concise (3-5 short paragraphs), warm sign-off, no placeholder text
- Match the tone: ${tone === "Formal" ? "professional and polished" : tone === "Friendly" ? "warm and approachable" : "confident and direct"}
- Reason context: ${reason === "Checking Status" ? "politely check on application progress" : reason === "Share New Info" ? "share a relevant update or achievement" : "express genuine gratitude"}
- If conversation context was provided, reference it naturally
- Do NOT include any preamble, just the JSON object`;
  };

  const generate = async () => {
    setLoading(true);
    setStreaming(false);
    setBody("");
    setSubject("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });

      const data  = await response.json();
      const raw   = (data.content || []).map(b => b.text || "").join("").trim();
      const clean = raw.replace(/```json|```/g, "").trim();

      let parsed;
      try { parsed = JSON.parse(clean); }
      catch { parsed = { subject: `Follow-up: ${job.role} at ${job.company}`, body: clean }; }

      setSubject(parsed.subject || "");
      setLoading(false);
      setStreaming(true);
      const fullBody = parsed.body || "";
      let i = 0;
      const chunk = () => {
        if (i < fullBody.length) {
          const step = Math.min(4, fullBody.length - i);
          setBody(fullBody.slice(0, i + step));
          i += step;
          setTimeout(chunk, 12);
        } else {
          setStreaming(false);
        }
      };
      chunk();
    } catch {
      setLoading(false);
      setStreaming(false);
      setSubject(`Follow-up: ${job.role} at ${job.company}`);
      setBody("Sorry, something went wrong generating your email. Please try again.");
    }
  };

  if (!hasGenerated.current) {
    hasGenerated.current = true;
    setTimeout(generate, 0);
  }

  const handleCopy = () => {
    const full = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal res-modal" onClick={e => e.stopPropagation()}>
        <div className="res-modal-head">
          <div className="res-modal-title-wrap">
            <div className="res-ai-dot" />
            <h2 className="db-modal-title">AI Follow-Up Email</h2>
          </div>
          <button className="db-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="res-modal-body">
          <div className="res-meta-row">
            <span className="res-meta-chip">{job.role} · {job.company}</span>
            <span className="res-meta-chip">{tone}</span>
            <span className="res-meta-chip">{reason}</span>
          </div>

          {loading ? (
            <div className="res-loading">
              <div className="res-loading-dots"><span /><span /><span /></div>
              <p className="res-loading-text">Writing your follow-up email…</p>
            </div>
          ) : (
            <div className="res-email-box">
              <div className="res-email-subj"><span>Subject: </span>{subject}</div>
              <div className="res-email-body-text">
                {body}
                {streaming && <span className="stream-cursor" />}
              </div>
            </div>
          )}
        </div>

        <div className="res-modal-foot">
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="res-back-btn" onClick={onBack}>← Edit</button>
            {!loading && (
              <button className="res-regen-btn" onClick={generate}>↺ Regenerate</button>
            )}
          </div>
          {!loading && (
            <button className={`res-copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
              {copied ? "✓ Copied!" : "Copy Email"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── AI Analysis Tab ────────────────────────────────────────────────────────────
function AIAnalysisTab({ job }) {
  const profileSkills = getProfileSkills();
  const hasProfile    = !!profileSkills;

  const [jdText,     setJdText]     = useState("");
  const [analysing,  setAnalysing]  = useState(false);
  const [result,     setResult]     = useState(null);  // null = not yet run
  const [error,      setError]      = useState("");
  const barRef                       = useRef(null);

  // Animate the score bar after result arrives
  useEffect(() => {
    if (result && barRef.current) {
      // small delay so the element is rendered first
      setTimeout(() => {
        if (barRef.current) barRef.current.style.width = `${result.fitScore}%`;
      }, 80);
    }
  }, [result]);

  const buildPrompt = () => {
    const skillsBlock = hasProfile
      ? `\n\nCandidate's profile skills from their profile page:\n${profileSkills}`
      : "\n\nNote: no profile skills available — score based on the job description alone, be balanced.";

    return `You are an expert career coach and recruiter analysing job fit.

Analyse this job description for the role of "${job.role}" at "${job.company}".

Job description:
"""
${jdText.trim()}
"""
${skillsBlock}

Return ONLY a valid JSON object with exactly this shape (no preamble, no markdown fences):
{
  "fitScore": <integer 0-100>,
  "summary": "<2-sentence overall fit summary>",
  "roleBreakdown": "<2-3 sentences describing the role, team, and day-to-day>",
  "mustHaves": [
    { "skill": "<requirement>", "match": "yes" | "partial" | "no" }
  ],
  "niceToHaves": [
    { "skill": "<requirement>", "match": "yes" | "partial" | "no" }
  ],
  "redFlags": ["<concern>"],
  "keywords": [
    { "word": "<keyword>", "matched": true | false }
  ]
}

Rules:
- mustHaves: 4-6 items, the non-negotiable requirements
- niceToHaves: 3-5 items, bonus skills/experience
- redFlags: 0-3 items; if none write []
- keywords: 8-12 important technical/domain keywords from the JD; mark matched:true only if the candidate's profile confirms it (or matched:false if no profile)
- fitScore: honest integer, cross-referenced with profile skills if available
- All fields required, no nulls`;
  };

  const runAnalysis = async () => {
    if (!jdText.trim()) return;
    setAnalysing(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });

      const data  = await response.json();
      const raw   = (data.content || []).map(b => b.text || "").join("").trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Something went wrong analysing the job. Please try again.");
    } finally {
      setAnalysing(false);
    }
  };

  const handleReanalyse = () => {
    setResult(null);
    // keep jdText so user can edit if needed
  };

  // ── Render: input state ──
  if (!result && !analysing) {
    return (
      <div className="ai-tab-body">
        {/* Profile status pill */}
        {hasProfile ? (
          <div className="ai-profile-note">
            ✓ Profile skills found — fit score will cross-reference your profile
          </div>
        ) : (
          <div className="ai-profile-note ai-profile-note-warn">
            ⚠ No profile skills found — add skills on your Profile page for a more accurate score
          </div>
        )}

        {/* URL row (informational — backend fetch coming later) */}
        {job.url && (
          <div className="ai-url-row">
            <span className="ai-url-icon">🔗</span>
            <span className="ai-url-text">{job.url}</span>
            <span className="ai-url-note">Auto-fetch coming soon</span>
          </div>
        )}

        {/* JD paste area */}
        <div className="ai-input-area">
          <div className="ai-input-label">
            Paste the job description
            <span className="ai-input-hint">
              {job.url ? "or copy from the posting above" : "copy from the job listing"}
            </span>
          </div>
          <textarea
            className="ai-jd-textarea"
            placeholder="Paste the full job description here — responsibilities, requirements, nice-to-haves..."
            value={jdText}
            onChange={e => setJdText(e.target.value)}
          />
        </div>

        {error && (
          <div style={{ fontSize: "12px", color: "#ef4444", background: "#fff5f5", border: "1px solid #fee2e2", borderRadius: "8px", padding: "9px 12px" }}>
            {error}
          </div>
        )}

        <button
          className="ai-analyse-btn"
          disabled={!jdText.trim()}
          onClick={runAnalysis}
        >
          <span>✦</span> Analyse Fit
        </button>
      </div>
    );
  }

  // ── Render: loading state ──
  if (analysing) {
    return (
      <div className="ai-tab-body">
        <div className="ai-loading">
          <div className="ai-loading-ring" />
          <p className="ai-loading-label">Analysing job fit…</p>
        </div>
      </div>
    );
  }

  // ── Render: results ──
  const { fitScore, summary, roleBreakdown, mustHaves = [], niceToHaves = [], redFlags = [], keywords = [] } = result;
  const theme = scoreTheme(fitScore);

  const matchLabel = (m) => {
    if (m === "yes")     return { cls: "match",    txt: "✓ Match"   };
    if (m === "partial") return { cls: "partial",  txt: "~ Partial" };
    return                      { cls: "no-match", txt: "✗ Missing" };
  };

  return (
    <div className="ai-tab-body">

      {/* ── Fit Score Card ── */}
      <div className={`ai-score-card ${theme.cls}`}>
        <div className="ai-score-top">
          <span className="ai-score-label">Fit Score</span>
          <span className="ai-score-verdict">{theme.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span className="ai-score-number">{fitScore}</span>
          <span className="ai-score-denom">/ 100</span>
        </div>
        <div className="ai-score-bar-track">
          <div className="ai-score-bar-fill" ref={barRef} />
        </div>
        <p className="ai-score-summary">{summary}</p>
      </div>

      <div className="ai-divider" />

      {/* ── Role Breakdown ── */}
      <div className="ai-section">
        <div className="ai-section-head">
          <span className="ai-section-icon">📋</span>
          <span className="ai-section-title">Role Breakdown</span>
        </div>
        <p className="ai-role-text">{roleBreakdown}</p>
      </div>

      {/* ── Must-Haves ── */}
      <div className="ai-section">
        <div className="ai-section-head">
          <span className="ai-section-icon">✅</span>
          <span className="ai-section-title">Must-Haves</span>
          <span className="ai-section-count">{mustHaves.length}</span>
        </div>
        <div className="ai-checklist">
          {mustHaves.map((item, i) => {
            const ml = matchLabel(item.match);
            return (
              <div key={i} className="ai-check-item">
                <span className="ai-check-icon">
                  {item.match === "yes" ? "✓" : item.match === "partial" ? "~" : "✗"}
                </span>
                <span className="ai-check-text">{item.skill}</span>
                {hasProfile && (
                  <span className={`ai-check-match ${ml.cls}`}>{ml.txt}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Nice-to-Haves ── */}
      <div className="ai-section">
        <div className="ai-section-head">
          <span className="ai-section-icon">⭐</span>
          <span className="ai-section-title">Nice-to-Haves</span>
          <span className="ai-section-count">{niceToHaves.length}</span>
        </div>
        <div className="ai-checklist">
          {niceToHaves.map((item, i) => {
            const ml = matchLabel(item.match);
            return (
              <div key={i} className="ai-check-item">
                <span className="ai-check-icon">
                  {item.match === "yes" ? "✓" : item.match === "partial" ? "~" : "✗"}
                </span>
                <span className="ai-check-text">{item.skill}</span>
                {hasProfile && (
                  <span className={`ai-check-match ${ml.cls}`}>{ml.txt}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Red Flags ── */}
      <div className="ai-section">
        <div className="ai-section-head">
          <span className="ai-section-icon">⚠️</span>
          <span className="ai-section-title">Red Flags</span>
          <span className="ai-section-count">{redFlags.length}</span>
        </div>
        {redFlags.length === 0 ? (
          <div className="ai-no-flags">
            <span>✓</span> No red flags detected
          </div>
        ) : (
          <div className="ai-checklist">
            {redFlags.map((flag, i) => (
              <div key={i} className="ai-flag-item">
                <span style={{ fontSize: "13px", flexShrink: 0 }}>⚠</span>
                <span>{flag}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Keywords ── */}
      <div className="ai-section">
        <div className="ai-section-head">
          <span className="ai-section-icon">🏷</span>
          <span className="ai-section-title">Key Terms</span>
        </div>
        <div className="ai-keywords">
          {keywords.map((kw, i) => (
            <span key={i} className={`ai-keyword ${kw.matched ? "matched" : ""}`}>
              {kw.word}
            </span>
          ))}
        </div>
      </div>

      {/* Re-analyse */}
      <button className="ai-reanalyse-btn" onClick={handleReanalyse}>
        ↺ Re-analyse with different JD
      </button>

    </div>
  );
}

// ── Job Detail Modal ──────────────────────────────────────────────────────────
function JobDetailModal({ job, onClose, onFollowUp }) {
  const meta = colMeta(job.status);
  const days = daysAgo(job.appliedAt);
  const [activeTab, setActiveTab] = useState("details");

  const rows = [
    { label: "Stage",      val: meta.label },
    { label: "Job type",   val: job.jobType    || "—" },
    { label: "Salary",     val: job.salary     || "—" },
    { label: "Difficulty", val: job.difficulty || "—" },
    { label: "Deadline",   val: job.deadline
        ? new Date(job.deadline).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })
        : "—" },
    { label: "Applied",    val: days !== null ? `${days} days ago` : "—" },
  ];

  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal jd-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="db-modal-head">
          <h2 className="db-modal-title">Job details</h2>
          <button className="db-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Hero — always visible */}
        <div className="jd-hero">
          <div className="jd-color-bar" style={{ background: meta.dot }} />
          <div className="jd-hero-info">
            <p className="jd-role">{job.role}</p>
            <p className="jd-company">{job.company}</p>
            <div className="jd-tags">
              {job.salary && (
                <span className="db-tag db-tag-salary">{job.salary}</span>
              )}
              {job.difficulty && (
                <span className={`db-tag ${diffClass(job.difficulty)}`}>
                  {job.difficulty}
                </span>
              )}
              <span className="db-tag" style={{
                background: "#f1f5f9", color: "#475569", borderColor: "#e2e8f0"
              }}>
                {meta.label}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="jd-tabs">
          <button
            className={`jd-tab ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`jd-tab ${activeTab === "analysis" ? "active" : ""}`}
            onClick={() => setActiveTab("analysis")}
          >
            <div className="jd-tab-ai-dot" />
            AI Analysis
          </button>
        </div>

        {/* Tab: Details */}
        {activeTab === "details" && (
          <>
            <div className="jd-body">
              {rows.map(r => (
                <div key={r.label} className="jd-row">
                  <span className="jd-row-label">{r.label}</span>
                  <span className="jd-row-val">{r.val}</span>
                </div>
              ))}
              {job.url && (
                <div className="jd-row">
                  <span className="jd-row-label">Posting</span>
                  <a className="jd-link-btn" href={job.url} target="_blank" rel="noreferrer">
                    View job ↗
                  </a>
                </div>
              )}
            </div>

            <div className="jd-notes-block">
              <p className="jd-notes-label">Notes</p>
              {job.notes?.trim()
                ? <p className="jd-notes-text">{job.notes}</p>
                : <p className="jd-empty-notes">No notes added for this job.</p>
              }
            </div>

            {/* Footer */}
            <div className="jd-footer">
              {job.status !== "wishlist" && job.status !== "rejected" ? (
                <button
                  className="jd-followup-btn"
                  onClick={() => { onClose(); onFollowUp(job); }}
                >
                  ✉ Write Follow-Up
                </button>
              ) : <div />}
              <button className="jd-close-btn" onClick={onClose}>Close</button>
            </div>
          </>
        )}

        {/* Tab: AI Analysis */}
        {activeTab === "analysis" && (
          <>
            <AIAnalysisTab job={job} />

            {/* Footer — always show close */}
            <div className="jd-footer">
              <div />
              <button className="jd-close-btn" onClick={onClose}>Close</button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { jobs, addJob, deleteJob, moveJob } = useJobs();
  const [modalOpen, setModalOpen]         = useState(false);
  const [detailJob, setDetailJob]         = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("wishlist");
  const [draggingId, setDraggingId]       = useState(null);
  const [toast, setToast]                 = useState({ msg: "", show: false });
  const [fuJob, setFuJob]                 = useState(null);
  const [fuParams, setFuParams]           = useState(null);
  const dragOverCol                        = useRef(null);

  const openModal = (status = "wishlist") => {
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const handleSave = (job) => {
    addJob(job);
    showToast("Job added ✓", setToast);
  };

  const openFollowUp  = (job) => { setFuJob(job); setFuParams(null); };
  const closeFollowUp = () => { setFuJob(null); setFuParams(null); };
  const handleGenerate = (params) => { setFuJob(null); setFuParams(params); };
  const backToForm     = () => { setFuJob(fuParams.job); setFuParams(null); };

  const onDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = () => {
    setDraggingId(null);
    document.querySelectorAll(".db-col").forEach(c => c.classList.remove("drag-over"));
    dragOverCol.current = null;
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const col = e.currentTarget;
    if (col !== dragOverCol.current) {
      document.querySelectorAll(".db-col").forEach(c => c.classList.remove("drag-over"));
      col.classList.add("drag-over");
      dragOverCol.current = col;
    }
  };

  const onDragLeave = (e) => {
    const col = e.currentTarget;
    if (!col.contains(e.relatedTarget)) {
      col.classList.remove("drag-over");
      if (dragOverCol.current === col) dragOverCol.current = null;
    }
  };

  const onDrop = (e, colId) => {
    e.preventDefault();
    document.querySelectorAll(".db-col").forEach(c => c.classList.remove("drag-over"));
    dragOverCol.current = null;
    if (draggingId === null) return;
    moveJob(draggingId, colId);
    showToast(`Moved to ${COLUMNS.find(c => c.id === colId)?.label}`, setToast);
    setDraggingId(null);
  };

  const handleDelete = (id) => {
    deleteJob(id);
    showToast("Job removed ✓", setToast);
  };

  const wishlist     = jobs.filter(j => j.status === "wishlist").length;
  const totalApplied = jobs.filter(j => j.status === "applied").length;
  const interviews   = jobs.filter(j => j.status === "interview").length;
  const offers       = jobs.filter(j => j.status === "offer").length;
  const rejected     = jobs.filter(j => j.status === "rejected").length;

  return (
    <>
      <style>{styles}</style>

      <div className="db-root">
        <div className="db-topbar">
          <div className="db-topbar-left">
            <h1>My job board</h1>
            <p>{jobs.length} job{jobs.length !== 1 ? "s" : ""} tracked across all stages</p>
          </div>
          <button className="db-top-add" onClick={() => openModal("wishlist")}>
            + Add job
          </button>
        </div>

        <div className="db-stats">
          {[
            { label: "Wishlist",     value: wishlist     },
            { label: "Applied",      value: totalApplied },
            { label: "Interviewing", value: interviews   },
            { label: "Offers",       value: offers       },
            { label: "Rejected",     value: rejected     },
          ].map(s => (
            <div key={s.label} className="db-stat">
              <p className="db-stat-n">{s.value}</p>
              <p className="db-stat-l">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="db-board">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              col={col}
              jobs={jobs.filter(j => j.status === col.id)}
              draggingId={draggingId}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onAddClick={openModal}
              onFollowUp={openFollowUp}
              onDetail={(job) => setDetailJob(job)}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {modalOpen && (
          <AddJobModal
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            defaultStatus={defaultStatus}
          />
        )}

        {fuJob && !fuParams && (
          <FollowUpModal
            job={fuJob}
            onClose={closeFollowUp}
            onGenerate={handleGenerate}
          />
        )}

        {detailJob && !fuJob && !fuParams && (
          <JobDetailModal
            job={detailJob}
            onClose={() => setDetailJob(null)}
            onFollowUp={(job) => { setDetailJob(null); openFollowUp(job); }}
          />
        )}

        {fuParams && (
          <ResultModal
            params={fuParams}
            onClose={closeFollowUp}
            onBack={backToForm}
          />
        )}

        <div className={`db-toast ${toast.show ? "show" : ""}`}>
          {toast.msg}
        </div>
      </div>
    </>
  );
}
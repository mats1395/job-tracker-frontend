import { useState, useEffect } from "react";
import { useJobs } from "../hooks/useJobs";

// ── Fake dashboard stats (replace with real props/context later) ──────────────


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap');

  /* ── Root ── */
  .pf-root {
    min-height: calc(100vh - 60px);
    background: #f0f4f8;
    font-family: 'Geist', system-ui, sans-serif;
    padding: 28px 24px;
  }

  .pf-inner {
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ── Page header ── */
  .pf-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .pf-topbar h1 {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.3px;
  }

  .pf-topbar p {
    font-size: 13px;
    color: #64748b;
    margin: 3px 0 0;
  }

  .pf-edit-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
  }

  .pf-edit-toggle:hover {
    border-color: #4f46e5;
    color: #4f46e5;
    background: #eef2ff;
  }

  .pf-edit-toggle.active {
    background: #0f172a;
    color: white;
    border-color: #0f172a;
  }

  /* ── Cards shared ── */
  .pf-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 22px 24px;
    animation: pf-fade-in 0.25s ease both;
  }

  @keyframes pf-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }

  .pf-card-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #94a3b8;
    margin: 0 0 16px;
  }

  /* ── Hero card ── */
  .pf-hero {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    flex-wrap: wrap;
  }

  .pf-avatar-wrap { position: relative; flex-shrink: 0; }

  .pf-avatar {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    background: linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    font-weight: 800;
    color: white;
    letter-spacing: -1px;
    user-select: none;
  }

  .pf-status-dot {
    position: absolute;
    bottom: -3px;
    right: -3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2.5px solid white;
  }

  .pf-hero-info { flex: 1; min-width: 0; }

  .pf-hero-name {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 3px;
    letter-spacing: -0.4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pf-hero-title {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 10px;
    font-weight: 500;
  }

  .pf-hero-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .pf-meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 3px 9px;
  }

  .pf-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 99px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pf-status-open     { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .pf-status-passive  { background: #fef9c3; color: #a16207; border: 1px solid #fde68a; }
  .pf-status-closed   { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }

  /* ── Stat strip ── */
  .pf-stats-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }

  .pf-stat {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 13px 14px;
    text-align: center;
    transition: background 0.15s;
  }

  .pf-stat:hover { background: #f1f5f9; }

  .pf-stat-n {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
    line-height: 1;
    margin: 0 0 4px;
  }

  .pf-stat-n.accent { color: #4f46e5; }
  .pf-stat-n.green  { color: #16a34a; }
  .pf-stat-n.amber  { color: #d97706; }
  .pf-stat-n.red    { color: #dc2626; }

  .pf-stat-l {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
    margin: 0;
  }

  /* ── Two-col layout ── */
  .pf-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  /* ── Search preferences ── */
  .pf-pref-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pf-pref-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .pf-pref-label {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    flex-shrink: 0;
  }

  .pf-pref-val {
    font-size: 13px;
    color: #0f172a;
    font-weight: 500;
    text-align: right;
  }

  .pf-pref-divider {
    flex: 1;
    height: 1px;
    background: #f1f5f9;
    margin: 0 8px;
  }

  .pf-work-chips {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }

  .pf-work-chip {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    color: #64748b;
    background: #f8fafc;
  }

  .pf-work-chip.selected {
    background: #eef2ff;
    border-color: #c7d2fe;
    color: #4f46e5;
  }

  /* ── Skills ── */
  .pf-skills-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .pf-skill-tag {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 11px;
    border-radius: 7px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    color: #374151;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: all 0.12s;
  }

  .pf-skill-tag:hover { background: #e2e8f0; }

  .pf-skill-remove {
    font-size: 13px;
    color: #94a3b8;
    cursor: pointer;
    line-height: 1;
    display: flex;
    align-items: center;
    transition: color 0.12s;
  }

  .pf-skill-remove:hover { color: #ef4444; }

  .pf-skill-add {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 11px;
    border-radius: 7px;
    border: 1px dashed #cbd5e1;
    background: none;
    color: #94a3b8;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
  }

  .pf-skill-add:hover {
    border-color: #4f46e5;
    color: #4f46e5;
    background: #eef2ff;
  }

  /* ── Bio ── */
  .pf-bio-text {
    font-size: 14px;
    color: #374151;
    line-height: 1.75;
    margin: 0;
    white-space: pre-wrap;
  }

  /* ── Links ── */
  .pf-links-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pf-link-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pf-link-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }

  .pf-link-label {
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    width: 70px;
    flex-shrink: 0;
  }

  .pf-link-val {
    font-size: 13px;
    color: #4f46e5;
    font-weight: 500;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: opacity 0.15s;
  }

  .pf-link-val:hover { opacity: 0.7; }

  .pf-link-empty {
    font-size: 13px;
    color: #cbd5e1;
    font-weight: 400;
    font-style: italic;
  }

  /* ── Edit mode inputs ── */
  .pf-input {
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    padding: 8px 11px;
    font-size: 13px;
    color: #0f172a;
    font-family: 'Geist', system-ui, sans-serif;
    outline: none;
    background: white;
    width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }

  .pf-input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.08);
  }

  .pf-input.large {
    font-size: 18px;
    font-weight: 700;
    padding: 9px 12px;
  }

  .pf-textarea {
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    padding: 10px 12px;
    font-size: 14px;
    color: #374151;
    font-family: 'Geist', system-ui, sans-serif;
    outline: none;
    background: white;
    width: 100%;
    resize: none;
    height: 100px;
    line-height: 1.75;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }

  .pf-textarea:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.08);
  }

  .pf-select {
    border: 1px solid #e2e8f0;
    border-radius: 9px;
    padding: 8px 11px;
    font-size: 13px;
    color: #0f172a;
    font-family: 'Geist', system-ui, sans-serif;
    outline: none;
    background: white;
    transition: border-color 0.15s, box-shadow 0.15s;
    cursor: pointer;
  }

  .pf-select:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.08);
  }

  .pf-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .pf-field label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
  }

  .pf-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  /* skill input row */
  .pf-skill-input-row {
    display: flex;
    gap: 6px;
    margin-top: 4px;
  }

  .pf-skill-input-row .pf-input {
    flex: 1;
  }

  .pf-btn-add-skill {
    padding: 8px 14px;
    border-radius: 9px;
    border: none;
    background: #0f172a;
    color: white;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    white-space: nowrap;
    transition: opacity 0.15s;
  }

  .pf-btn-add-skill:hover { opacity: 0.85; }

  /* ── Save bar ── */
  .pf-save-bar {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 14px 22px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    animation: pf-fade-in 0.2s ease both;
  }

  .pf-btn-discard {
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

  .pf-btn-discard:hover { background: #f8fafc; }

  .pf-btn-save {
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

  .pf-btn-save:hover { opacity: 0.85; }

  /* ── Edit mode highlight ── */
  .pf-card.editing {
    border-color: #c7d2fe;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.05);
  }

  /* ── Responsive ── */
  @media (max-width: 680px) {
    .pf-two-col    { grid-template-columns: 1fr; }
    .pf-stats-grid { grid-template-columns: repeat(3, 1fr); }
    .pf-root       { padding: 20px 16px; }
    .pf-hero-name  { font-size: 18px; }
  }

  @media (max-width: 420px) {
    .pf-stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

const WORK_TYPES   = ["Remote", "Hybrid", "On-site"];
const STATUS_OPTS  = ["Open to work", "Passively looking", "Not looking"];

const DEFAULT_PROFILE = {
  name:        "your_name..,",
  title:       "Senior Frontend Engineer",
  location:    "Oslo, Norway",
  email:       "alex@example.com",
  seekStatus:  "Open to work",
  targetRole:  "Frontend Engineer",
  targetSalary:"$120k – $150k",
  workTypes:   ["Remote", "Hybrid"],
  skills:      ["React", "TypeScript", "Figma", "Node.js", "Tailwind", "GraphQL"],
  bio:         "Frontend engineer with 5+ years building product-focused UIs. I care deeply about design systems, accessibility, and shipping things people actually enjoy using.\n\nCurrently exploring new opportunities at product-led companies where design and engineering work closely together.",
  linkedin:    "linkedin.com/in/alexjohnson",
  github:      "github.com/alexjohnson",
  portfolio:   "alexjohnson.dev",
};

function initials(name) {
  return name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function statusDotColor(s) {
  return s === "Open to work" ? "#22c55e" : s === "Passively looking" ? "#f59e0b" : "#94a3b8";
}

function statusBadgeClass(s) {
  return s === "Open to work" ? "pf-status-open" : s === "Passively looking" ? "pf-status-passive" : "pf-status-closed";
}

// ── Editable field helper ──────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="pf-field">
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
export default function Profile() {
  const { counts } = useJobs();

  const [editing, setEditing]       = useState(false);
  const [profile, setProfile]       = useState(() => {
    try {
      const saved = localStorage.getItem("jobTrackerProfile");
      return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
    } catch { return DEFAULT_PROFILE; }
  });
  const [draft,   setDraft]         = useState(profile);
  const [skillInput, setSkillInput] = useState("");

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const toggleWorkType = (wt) => {
    setDraft(d => ({
      ...d,
      workTypes: d.workTypes.includes(wt)
        ? d.workTypes.filter(w => w !== wt)
        : [...d.workTypes, wt],
    }));
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || draft.skills.includes(s)) return;
    setDraft(d => ({ ...d, skills: [...d.skills, s] }));
    setSkillInput("");
  };

  const removeSkill = (s) => setDraft(d => ({ ...d, skills: d.skills.filter(x => x !== s) }));

  const handleEdit = () => { setDraft(profile); setEditing(true); };

  const handleSave = () => {
  setProfile(draft);
  setEditing(false);
  try { localStorage.setItem("jobTrackerProfile", JSON.stringify(draft)); } catch {}
};

  const handleDiscard = () => { setDraft(profile); setEditing(false); };

  const p = editing ? draft : profile;

  const statItems = [
  { label: "Wishlist",    value: counts.wishlist,   cls: ""       },
  { label: "Applied",     value: counts.applied,    cls: "accent" },
  { label: "Interviews",  value: counts.interview,  cls: "amber"  },
  { label: "Offers",      value: counts.offer,      cls: "green"  },
  { label: "Rejected",    value: counts.rejected,   cls: "red"    },
];

  return (
    <>
      <style>{styles}</style>

      <div className="pf-root">
        <div className="pf-inner">

          {/* ── Top bar ── */}
          <div className="pf-topbar">
            <div>
              <h1>My profile</h1>
              <p>Your job search identity in one place</p>
            </div>
            {!editing ? (
              <button className="pf-edit-toggle" onClick={handleEdit}>
                ✎ Edit profile
              </button>
            ) : (
              <button className="pf-edit-toggle active" onClick={handleDiscard}>
                ✕ Cancel
              </button>
            )}
          </div>

          {/* ── Hero card ── */}
          <div className={`pf-card ${editing ? "editing" : ""}`} style={{ animationDelay: "0ms" }}>
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <div className="pf-avatar" style={{ flexShrink: 0 }}>
                    {initials(draft.name || "?")}
                  </div>
                  <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Field label="Full name">
                      <input
                        className="pf-input large"
                        value={draft.name}
                        onChange={e => set("name", e.target.value)}
                        placeholder="Your full name"
                      />
                    </Field>
                    <Field label="Job title / what you're looking for">
                      <input
                        className="pf-input"
                        value={draft.title}
                        onChange={e => set("title", e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                      />
                    </Field>
                  </div>
                </div>
                <div className="pf-field-row">
                  <Field label="Location">
                    <input
                      className="pf-input"
                      value={draft.location}
                      onChange={e => set("location", e.target.value)}
                      placeholder="City, Country"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      className="pf-input"
                      value={draft.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>
                <Field label="Job search status">
                  <select
                    className="pf-select"
                    value={draft.seekStatus}
                    onChange={e => set("seekStatus", e.target.value)}
                  >
                    {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
            ) : (
              <div className="pf-hero">
                <div className="pf-avatar-wrap">
                  <div className="pf-avatar">{initials(p.name)}</div>
                  <div className="pf-status-dot" style={{ background: statusDotColor(p.seekStatus) }} />
                </div>
                <div className="pf-hero-info">
                  <p className="pf-hero-name">{p.name}</p>
                  <p className="pf-hero-title">{p.title}</p>
                  <div className="pf-hero-meta">
                    <span className={`pf-status-badge ${statusBadgeClass(p.seekStatus)}`}>
                      {p.seekStatus === "Open to work" ? "● " : p.seekStatus === "Passively looking" ? "◐ " : "○ "}
                      {p.seekStatus}
                    </span>
                    {p.location && (
                      <span className="pf-meta-chip">📍 {p.location}</span>
                    )}
                    {p.email && (
                      <span className="pf-meta-chip">✉ {p.email}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Application stats ── */}
          <div className={`pf-card ${editing ? "editing" : ""}`} style={{ animationDelay: "40ms" }}>
            <p className="pf-card-title">Application overview</p>
            <div className="pf-stats-grid">
              {statItems.map(s => (
                <div key={s.label} className="pf-stat">
                  <p className={`pf-stat-n ${s.cls}`}>{s.value}</p>
                  <p className="pf-stat-l">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Two-col: Search prefs + Links ── */}
          <div className="pf-two-col">

            {/* Search preferences */}
            <div className={`pf-card ${editing ? "editing" : ""}`} style={{ animationDelay: "80ms" }}>
              <p className="pf-card-title">Search preferences</p>
              {editing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Field label="Target role">
                    <input
                      className="pf-input"
                      value={draft.targetRole}
                      onChange={e => set("targetRole", e.target.value)}
                      placeholder="e.g. Frontend Engineer"
                    />
                  </Field>
                  <Field label="Target salary">
                    <input
                      className="pf-input"
                      value={draft.targetSalary}
                      onChange={e => set("targetSalary", e.target.value)}
                      placeholder="e.g. $100k – $130k"
                    />
                  </Field>
                  <Field label="Work type">
                    <div className="pf-work-chips">
                      {WORK_TYPES.map(wt => (
                        <button
                          key={wt}
                          className={`pf-work-chip ${draft.workTypes.includes(wt) ? "selected" : ""}`}
                          style={{ cursor: "pointer", fontFamily: "inherit" }}
                          onClick={() => toggleWorkType(wt)}
                        >
                          {wt}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              ) : (
                <div className="pf-pref-grid">
                  {[
                    { label: "Target role",   val: p.targetRole   || "—" },
                    { label: "Salary range",  val: p.targetSalary || "—" },
                  ].map(row => (
                    <div key={row.label} className="pf-pref-row">
                      <span className="pf-pref-label">{row.label}</span>
                      <div className="pf-pref-divider" />
                      <span className="pf-pref-val">{row.val}</span>
                    </div>
                  ))}
                  <div className="pf-pref-row">
                    <span className="pf-pref-label">Work type</span>
                    <div className="pf-pref-divider" />
                    <div className="pf-work-chips" style={{ justifyContent: "flex-end" }}>
                      {p.workTypes.length > 0
                        ? p.workTypes.map(wt => (
                            <span key={wt} className="pf-work-chip selected">{wt}</span>
                          ))
                        : <span style={{ fontSize: "13px", color: "#cbd5e1", fontStyle: "italic" }}>None selected</span>
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Links */}
            <div className={`pf-card ${editing ? "editing" : ""}`} style={{ animationDelay: "80ms" }}>
              <p className="pf-card-title">Links</p>
              {editing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { key: "linkedin",  icon: "💼", label: "LinkedIn"  },
                    { key: "github",    icon: "🐙", label: "GitHub"    },
                    { key: "portfolio", icon: "🔗", label: "Portfolio" },
                  ].map(l => (
                    <Field key={l.key} label={l.label}>
                      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                        <span style={{ fontSize: "16px" }}>{l.icon}</span>
                        <input
                          className="pf-input"
                          value={draft[l.key]}
                          onChange={e => set(l.key, e.target.value)}
                          placeholder={`your ${l.label.toLowerCase()} url`}
                        />
                      </div>
                    </Field>
                  ))}
                </div>
              ) : (
                <div className="pf-links-list">
                  {[
                    { key: "linkedin",  icon: "💼", label: "LinkedIn"  },
                    { key: "github",    icon: "🐙", label: "GitHub"    },
                    { key: "portfolio", icon: "🔗", label: "Portfolio" },
                  ].map(l => (
                    <div key={l.key} className="pf-link-row">
                      <div className="pf-link-icon">{l.icon}</div>
                      <span className="pf-link-label">{l.label}</span>
                      {p[l.key] ? (
                        <a
                          className="pf-link-val"
                          href={`https://${p[l.key].replace(/^https?:\/\//, "")}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {p[l.key]}
                        </a>
                      ) : (
                        <span className="pf-link-empty">Not added</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Skills ── */}
          <div className={`pf-card ${editing ? "editing" : ""}`} style={{ animationDelay: "120ms" }}>
            <p className="pf-card-title">Skills & tools</p>
            <div className="pf-skills-wrap">
              {p.skills.map(s => (
                <span key={s} className="pf-skill-tag">
                  {s}
                  {editing && (
                    <span className="pf-skill-remove" onClick={() => removeSkill(s)}>×</span>
                  )}
                </span>
              ))}
              {!editing && p.skills.length === 0 && (
                <span style={{ fontSize: "13px", color: "#cbd5e1", fontStyle: "italic" }}>No skills added yet</span>
              )}
            </div>
            {editing && (
              <div className="pf-skill-input-row">
                <input
                  className="pf-input"
                  placeholder="Add a skill or tool…"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSkill()}
                />
                <button className="pf-btn-add-skill" onClick={addSkill}>Add</button>
              </div>
            )}
          </div>

          {/* ── Bio ── */}
          <div className={`pf-card ${editing ? "editing" : ""}`} style={{ animationDelay: "160ms" }}>
            <p className="pf-card-title">Bio / elevator pitch</p>
            {editing ? (
              <textarea
                className="pf-textarea"
                value={draft.bio}
                onChange={e => set("bio", e.target.value)}
                placeholder="Write a short summary about yourself, your background, and what you're looking for…"
              />
            ) : (
              <p className="pf-bio-text">
                {p.bio || <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>No bio added yet</span>}
              </p>
            )}
          </div>

          {/* ── Save bar (edit mode only) ── */}
          {editing && (
            <div className="pf-save-bar">
              <button className="pf-btn-discard" onClick={handleDiscard}>Discard changes</button>
              <button className="pf-btn-save" onClick={handleSave}>Save profile</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

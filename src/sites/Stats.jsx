import { useState } from "react";
import { useJobs } from "../hooks/useJobs";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap');

  .st-root {
    min-height: calc(100vh - 60px);
    background: #f0f4f8;
    font-family: 'Geist', system-ui, sans-serif;
    padding: 32px 24px;
  }

  .st-inner {
    max-width: 900px;
    margin: 0 auto;
  }

  /* ── Header ── */
  .st-header {
    margin-bottom: 28px;
  }

  .st-header h1 {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px;
    letter-spacing: -0.3px;
  }

  .st-header p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }

  /* ── Big 3 numbers ── */
  .st-big3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }

  .st-big-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 22px 24px;
    position: relative;
    overflow: hidden;
  }

  .st-big-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 16px 16px 0 0;
  }

  .st-big-card.indigo::before { background: #4f46e5; }
  .st-big-card.amber::before  { background: #f59e0b; }
  .st-big-card.green::before  { background: #22c55e; }

  .st-big-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #64748b;
    margin: 0 0 10px;
  }

  .st-big-num {
    font-size: 42px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -1.5px;
    line-height: 1;
    margin: 0 0 6px;
  }

  .st-big-card.indigo .st-big-num { color: #4f46e5; }
  .st-big-card.amber  .st-big-num { color: #d97706; }
  .st-big-card.green  .st-big-num { color: #16a34a; }

  .st-big-sub {
    font-size: 12px;
    color: #94a3b8;
    margin: 0;
  }

  /* ── Section title ── */
  .st-section-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.1px;
    margin: 0 0 12px;
  }

  /* ── Two col layout ── */
  .st-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  .st-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px 22px;
  }

  /* ── Stage breakdown ── */
  .st-stage-list {
    display: flex;
    flex-direction: column;
    gap: 11px;
  }

  .st-stage-row {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .st-stage-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .st-stage-name {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 500;
    color: #0f172a;
  }

  .st-stage-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .st-stage-count {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
  }

  .st-bar-track {
    height: 6px;
    background: #f1f5f9;
    border-radius: 99px;
    overflow: hidden;
  }

  .st-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Difficulty breakdown ── */
  .st-diff-list {
    display: flex;
    flex-direction: column;
    gap: 11px;
  }

  .st-diff-row {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .st-diff-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .st-diff-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 99px;
    border: 1px solid;
  }

  .diff-easy   { background: #eaf3de; color: #3b6d11; border-color: #c0dd97; }
  .diff-medium { background: #faeeda; color: #854f0b; border-color: #fac775; }
  .diff-hard   { background: #fcebeb; color: #a32d2d; border-color: #f7c1c1; }

  .st-diff-count {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
  }

  /* ── Activity heatmap ── */
  .st-full-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px 22px;
    margin-bottom: 12px;
  }

  .st-heatmap {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-top: 4px;
  }

  .st-heat-day-label {
    font-size: 10px;
    color: #94a3b8;
    text-align: center;
    font-weight: 500;
    padding-bottom: 4px;
  }

  .st-heat-cell {
    aspect-ratio: 1;
    border-radius: 4px;
    background: #f1f5f9;
    transition: background 0.2s;
    cursor: default;
    position: relative;
  }

  .st-heat-cell.level-1 { background: #c7d2fe; }
  .st-heat-cell.level-2 { background: #818cf8; }
  .st-heat-cell.level-3 { background: #4f46e5; }

  /* ── Tips section ── */
  .st-tips {
    background: #0f172a;
    border-radius: 16px;
    padding: 20px 22px;
    margin-bottom: 12px;
  }

  .st-tips-title {
    font-size: 13px;
    font-weight: 700;
    color: white;
    margin: 0 0 14px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .st-tips-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .st-tip {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 13px 14px;
  }

  .st-tip-icon {
    font-size: 18px;
    margin-bottom: 8px;
  }

  .st-tip-title {
    font-size: 13px;
    font-weight: 600;
    color: white;
    margin: 0 0 4px;
  }

  .st-tip-body {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    line-height: 1.6;
    margin: 0;
  }

  /* ── Empty state ── */
  .st-empty {
    text-align: center;
    padding: 40px 20px;
    color: #94a3b8;
    font-size: 14px;
  }

  .st-empty-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }

  .st-empty h3 {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 6px;
  }

  @media (max-width: 720px) {
    .st-big3    { grid-template-columns: 1fr; }
    .st-two-col { grid-template-columns: 1fr; }
    .st-tips-grid { grid-template-columns: 1fr; }
    .st-root { padding: 20px 16px; }
  }
`;

// ── Fake data — replace with real jobs from your backend later ────────────────
const FAKE_JOBS = [
  { id: 1, company: "Spotify",  role: "Product Designer",  status: "wishlist",  salary: "$90k",  difficulty: "Medium" },
  { id: 2, company: "Google",   role: "Frontend Engineer", status: "applied",   salary: "$140k", difficulty: "Hard"   },
  { id: 3, company: "Notion",   role: "UX Researcher",     status: "applied",   salary: "$95k",  difficulty: "Easy"   },
  { id: 4, company: "Linear",   role: "Full Stack Dev",    status: "interview", salary: "$120k", difficulty: "Hard"   },
  { id: 5, company: "Airbnb",   role: "Software Engineer", status: "offer",     salary: "$160k", difficulty: "Medium" },
  { id: 6, company: "Meta",     role: "Data Analyst",      status: "rejected",  salary: "$110k", difficulty: "Hard"   },
  { id: 7, company: "Figma",    role: "Design Engineer",   status: "applied",   salary: "$115k", difficulty: "Medium" },
  { id: 8, company: "Vercel",   role: "DX Engineer",       status: "interview", salary: "$130k", difficulty: "Hard"   },
];

const STAGES = [
  { id: "wishlist",  label: "Wishlist",  dot: "#94a3b8", bar: "#94a3b8" },
  { id: "applied",   label: "Applied",   dot: "#4f46e5", bar: "#4f46e5" },
  { id: "interview", label: "Interview", dot: "#f59e0b", bar: "#f59e0b" },
  { id: "offer",     label: "Offer",     dot: "#22c55e", bar: "#22c55e" },
  { id: "rejected",  label: "Rejected",  dot: "#ef4444", bar: "#ef4444" },
];

// ── Fake heatmap data — 4 weeks of activity ───────────────────────────────────


const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function heatLevel(v) {
  if (v === 0) return "";
  if (v === 1) return "level-1";
  if (v === 2) return "level-2";
  return "level-3";
}

export default function Stats() {
  const { jobs } = useJobs();

  const now = Date.now();
  const HEATMAP = Array.from({ length: 28 }, (_, i) => {
    const dayStart = now - (27 - i) * 86400000;
    const dayEnd   = dayStart + 86400000;
    return jobs.filter(j => j.appliedAt >= dayStart && j.appliedAt < dayEnd).length;
  });

  const totalTracked  = jobs.length;
  const totalApplied  = jobs.filter(j => j.status !== "wishlist").length;
  const interviews    = jobs.filter(j => j.status === "interview").length;
  const offers        = jobs.filter(j => j.status === "offer").length;
  const responseRate  = totalApplied > 0
    ? Math.round((interviews + offers) / totalApplied * 100)
    : 0;
  const activeJobs    = jobs.filter(j => !["rejected","offer"].includes(j.status)).length;

  const maxStage = Math.max(...STAGES.map(s => jobs.filter(j => j.status === s.id).length), 1);
  const maxDiff  = Math.max(
    jobs.filter(j => j.difficulty === "Easy").length,
    jobs.filter(j => j.difficulty === "Medium").length,
    jobs.filter(j => j.difficulty === "Hard").length,
    1
  );

  if (totalTracked === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="st-root">
          <div className="st-inner">
            <div className="st-empty">
              <div className="st-empty-icon">📊</div>
              <h3>No data yet</h3>
              <p>Add some jobs to your board to see your stats here.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="st-root">
        <div className="st-inner">

          {/* Header */}
          <div className="st-header">
            <h1>Your search stats</h1>
            <p>A clear picture of how your job search is going.</p>
          </div>

          {/* Big 3 */}
          <div className="st-big3">
            <div className="st-big-card indigo">
              <p className="st-big-label">Total applied</p>
              <p className="st-big-num">{totalApplied}</p>
              <p className="st-big-sub">out of {totalTracked} tracked</p>
            </div>
            <div className="st-big-card amber">
              <p className="st-big-label">Response rate</p>
              <p className="st-big-num">{responseRate}%</p>
              <p className="st-big-sub">{interviews + offers} replies received</p>
            </div>
            <div className="st-big-card green">
              <p className="st-big-label">Active</p>
              <p className="st-big-num">{activeJobs}</p>
              <p className="st-big-sub">still in play</p>
            </div>
          </div>

          {/* Stage + Difficulty */}
          <div className="st-two-col">

            {/* Stage breakdown */}
            <div className="st-card">
              <p className="st-section-title">Jobs by stage</p>
              <div className="st-stage-list">
                {STAGES.map(s => {
                  const count = jobs.filter(j => j.status === s.id).length;
                  const pct   = Math.round(count / maxStage * 100);
                  return (
                    <div key={s.id} className="st-stage-row">
                      <div className="st-stage-meta">
                        <span className="st-stage-name">
                          <span className="st-stage-dot" style={{ background: s.dot }} />
                          {s.label}
                        </span>
                        <span className="st-stage-count">{count}</span>
                      </div>
                      <div className="st-bar-track">
                        <div
                          className="st-bar-fill"
                          style={{ width: `${pct}%`, background: s.bar }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Difficulty breakdown */}
            <div className="st-card">
              <p className="st-section-title">Jobs by difficulty</p>
              <div className="st-diff-list">
                {["Easy","Medium","Hard"].map(d => {
                  const count = jobs.filter(j => j.difficulty === d).length;
                  const pct   = Math.round(count / maxDiff * 100);
                  const barColor = {
                    Easy:   "#639922",
                    Medium: "#ba7517",
                    Hard:   "#a32d2d",
                  }[d];
                  return (
                    <div key={d} className="st-diff-row">
                      <div className="st-diff-meta">
                        <span className={`st-diff-badge diff-${d.toLowerCase()}`}>{d}</span>
                        <span className="st-diff-count">{count} job{count !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="st-bar-track">
                        <div
                          className="st-bar-fill"
                          style={{ width: `${pct}%`, background: barColor }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Offer tally */}
                <div style={{
                  marginTop: 12,
                  paddingTop: 14,
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}>
                  {[
                    { label: "Interviews",  value: interviews, color: "#d97706" },
                    { label: "Offers",      value: offers,     color: "#16a34a" },
                    { label: "Rejected",    value: jobs.filter(j => j.status === "rejected").length, color: "#dc2626" },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "#64748b" }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity heatmap */}
          <div className="st-full-card">
            <p className="st-section-title">Application activity — last 4 weeks</p>
            <div className="st-heatmap">
              {DAY_LABELS.map(d => (
                <div key={d} className="st-heat-day-label">{d}</div>
              ))}
              {HEATMAP.map((v, i) => (
                <div key={i} className={`st-heat-cell ${heatLevel(v)}`} title={`${v} application${v !== 1 ? "s" : ""}`} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>Less</span>
              {["#f1f5f9","#c7d2fe","#818cf8","#4f46e5"].map((c,i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
              ))}
              <span style={{ fontSize: 11, color: "#94a3b8" }}>More</span>
            </div>
          </div>

          {/* Tips */}
          <div className="st-tips">
            <p className="st-tips-title">
              💡 Search tips
            </p>
            <div className="st-tips-grid">
              <div className="st-tip">
                <div className="st-tip-icon">🎯</div>
                <p className="st-tip-title">Target response rate</p>
                <p className="st-tip-body">A healthy response rate is 10–20%. Below that — improve your CV or target better-fit roles.</p>
              </div>
              <div className="st-tip">
                <div className="st-tip-icon">⏱️</div>
                <p className="st-tip-title">Follow up</p>
                <p className="st-tip-body">If you haven't heard back in 7 days, send a short follow-up. It increases callbacks by up to 30%.</p>
              </div>
              <div className="st-tip">
                <div className="st-tip-icon">📊</div>
                <p className="st-tip-title">Mix difficulty</p>
                <p className="st-tip-body">Apply to a mix of easy, medium, and hard roles. Don't put all your eggs in one basket.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
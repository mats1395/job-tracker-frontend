import { useState, useEffect } from "react"
import { Plus, ArrowRight, Bell, Sparkles, LayoutGrid, Star, Quote, Menu, X, Globe, GitBranch, Link, CheckCircle2, Send, Check, Zap, Shield, Lock } from "lucide-react"

// ─── CSS ──────────────────────────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #f0f4f8;
    --card:      #ffffff;
    --fg:        #0f172a;
    --muted:     #64748b;
    --border:    #e2e8f0;
    --primary:   #4f46e5;
    --primary-fg:#ffffff;
    --accent:    #312e81;
    --accent-fg: #ffffff;
    --chart1:    #f97316;
    font-family: 'Geist', system-ui, sans-serif;
  }

  body { background: var(--bg); color: var(--fg); }

  .hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
  .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }

  .nav-link {
    position: relative; font-size: 14px; font-weight: 500;
    color: var(--muted); text-decoration: none; transition: color 0.2s;
  }
  .nav-link::after {
    content: ''; position: absolute; left: 0; bottom: -4px;
    width: 0; height: 2px; background: var(--primary);
    transition: width 0.25s;
  }
  .nav-link:hover { color: var(--fg); }
  .nav-link:hover::after { width: 100%; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--fg); color: #fff;
    padding: 12px 28px; border-radius: 10px; border: none;
    font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
    box-shadow: 0 4px 14px rgba(15,23,42,0.15);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,0.2); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--card); color: var(--fg);
    padding: 12px 24px; border-radius: 10px;
    border: 1px solid var(--border);
    font-size: 15px; font-weight: 500; cursor: pointer; text-decoration: none;
    transition: background 0.2s, border-color 0.2s;
  }
  .btn-outline:hover { background: var(--bg); border-color: #c7d2fe; }

  .btn-ghost {
    background: none; border: none; cursor: pointer;
    font-size: 14px; font-weight: 500; color: var(--muted);
    padding: 8px 16px; border-radius: 8px; transition: color 0.2s, background 0.2s;
    text-decoration: none;
  }
  .btn-ghost:hover { color: var(--fg); background: var(--border); }

  .tag-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(79,70,229,0.1); color: var(--primary);
    border: 1px solid rgba(79,70,229,0.2);
    padding: 5px 14px; border-radius: 99px;
    font-size: 13px; font-weight: 500;
  }

  .section { padding: 80px 24px; }
  .section-inner { max-width: 1100px; margin: 0 auto; }
  .section-inner-sm { max-width: 720px; margin: 0 auto; }

  .section-heading {
    font-size: clamp(28px, 4vw, 46px);
    font-weight: 800; letter-spacing: -0.5px;
    color: var(--fg); line-height: 1.15; text-align: center;
    margin: 16px 0;
  }
  .section-sub {
    font-size: 17px; color: var(--muted);
    line-height: 1.7; text-align: center; max-width: 540px; margin: 0 auto 56px;
  }

  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }

  .ping {
    position: relative; display: inline-flex;
    width: 8px; height: 8px;
  }
  .ping::before {
    content: ''; position: absolute; inset: 0;
    border-radius: 50%; background: var(--primary);
    opacity: 0.75; animation: ping 1.5s ease-out infinite;
  }
  .ping::after {
    content: ''; position: relative; width: 8px; height: 8px;
    border-radius: 50%; background: var(--primary); display: block;
  }
  @keyframes ping {
    0% { transform: scale(1); opacity: 0.75; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  .faq-item {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden; margin-bottom: 10px;
    transition: box-shadow 0.2s;
  }
  .faq-item.open { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
  .faq-trigger {
    width: 100%; background: none; border: none; cursor: pointer;
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 24px; font-size: 15px; font-weight: 600;
    color: var(--fg); text-align: left; gap: 12px;
  }
  .faq-icon {
    font-size: 20px; color: var(--muted); flex-shrink: 0;
    transition: transform 0.25s; display: inline-block;
    font-style: normal; font-weight: 300;
  }
  .faq-icon.open { transform: rotate(45deg); }
  .faq-body {
    max-height: 0; overflow: hidden;
    transition: max-height 0.3s ease, padding 0.2s;
    font-size: 15px; color: var(--muted); line-height: 1.7;
    padding: 0 24px;
  }
  .faq-body.open { max-height: 200px; padding: 0 24px 20px; }

  /* ── Pricing section ── */
  .lp-pr-root {
    font-family: 'Geist', system-ui, sans-serif;
  }

  .lp-pr-hero {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 16px;
  }

  .lp-pr-billing-label {
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 12px;
  }

  .lp-pr-toggle-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 44px;
  }

  .lp-pr-toggle {
    display: inline-flex;
    background: white;
    border: 1px solid #e0e0ec;
    border-radius: 99px;
    padding: 4px;
    gap: 2px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  .lp-pr-toggle-btn {
    padding: 8px 24px;
    border-radius: 99px;
    border: none;
    background: none;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .lp-pr-toggle-btn.active {
    background: #4f46e5;
    color: white;
    box-shadow: 0 2px 8px rgba(79,70,229,0.35);
  }

  .lp-pr-save-badge {
    background: #fef3c7;
    color: #92400e;
    border-radius: 99px;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
  }

  .lp-pr-cards {
    max-width: 860px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    align-items: start;
  }

  @media (max-width: 700px) {
    .lp-pr-cards { grid-template-columns: 1fr; gap: 16px; }
    .desktop-only { display: none !important; }
    .section { padding: 60px 20px; }
  }
  @media (min-width: 769px) {
    .mobile-only { display: none !important; }
  }

  .lp-pr-card {
    background: white;
    border: 1px solid #e0e0ec;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
  }

  .lp-pr-card.free-card {
    border-radius: 20px 0 0 20px;
    border-right: none;
    padding-top: 28px;
    z-index: 1;
  }

  .lp-pr-card.featured {
    border: 2px solid #4f46e5;
    border-radius: 20px;
    box-shadow: 0 8px 48px rgba(79,70,229,0.18), 0 2px 12px rgba(0,0,0,0.08);
    z-index: 2;
  }

  .lp-pr-ribbon {
    background: #4f46e5;
    color: white;
    text-align: center;
    padding: 8px 16px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .lp-pr-card-head {
    padding: 28px 28px 22px;
    border-bottom: 1px solid #f1f1f7;
  }

  .lp-pr-plan-name {
    font-size: 28px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.5px;
    margin: 0 0 6px;
  }

  .lp-pr-plan-desc {
    font-size: 13px;
    color: #6b7280;
    margin: 0 0 22px;
    line-height: 1.55;
  }

  .lp-pr-price-row {
    display: flex;
    align-items: flex-end;
    gap: 1px;
    margin-bottom: 6px;
    line-height: 1;
  }

  .lp-pr-currency {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 6px;
  }

  .lp-pr-amount {
    font-size: 54px;
    font-weight: 900;
    color: #111827;
    letter-spacing: -3px;
    line-height: 1;
  }

  .lp-pr-period {
    font-size: 14px;
    color: #9ca3af;
    font-weight: 500;
    margin-bottom: 7px;
    padding-left: 3px;
    font-style: italic;
  }

  .lp-pr-yearly-note {
    font-size: 12px;
    font-weight: 600;
    color: #16a34a;
    margin-bottom: 16px;
    min-height: 18px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .lp-pr-btn-free {
    width: 100%;
    padding: 12px;
    border-radius: 11px;
    border: 1.5px solid #d1d5db;
    background: white;
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lp-pr-btn-free:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  .lp-pr-btn-pro {
    width: 100%;
    padding: 13px;
    border-radius: 11px;
    border: none;
    background: #f5c842;
    font-size: 14px;
    font-weight: 800;
    color: #111827;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 3px 12px rgba(245,200,66,0.4);
    text-decoration: none;
  }

  .lp-pr-btn-pro:hover {
    filter: brightness(0.96);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(245,200,66,0.5);
  }

  .lp-pr-card-body {
    padding: 22px 28px 28px;
  }

  .lp-pr-includes-note {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 18px;
  }

  .lp-pr-includes-note strong { font-weight: 700; }

  .lp-pr-section { margin-bottom: 18px; }
  .lp-pr-section:last-child { margin-bottom: 0; }

  .lp-pr-section-label {
    font-size: 11px;
    font-weight: 700;
    color: #9ca3af;
    margin: 0 0 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f1f7;
  }

  .lp-pr-features {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .lp-pr-feature {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .lp-pr-check {
    width: 19px;
    height: 19px;
    border-radius: 99px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .lp-pr-check.free {
    background: #f3f4f6;
    color: #9ca3af;
    border: 1.5px solid #e5e7eb;
  }

  .lp-pr-check.pro {
    background: #4f46e5;
    color: white;
  }

  .lp-pr-feature-text {
    font-size: 13px;
    color: #374151;
    line-height: 1.45;
    margin: 0;
  }

  .lp-pr-feature-text strong {
    color: #111827;
    font-weight: 700;
  }

  .lp-pr-coming-soon {
    font-size: 10px;
    font-weight: 700;
    background: #fef9c3;
    color: #854d0e;
    border: 1px solid #fde68a;
    border-radius: 4px;
    padding: 1px 5px;
    margin-left: 5px;
    vertical-align: middle;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .lp-pr-feature-sub {
    font-size: 11px;
    color: #9ca3af;
    margin: 2px 0 0;
    line-height: 1.4;
  }

  .lp-pr-trust {
    max-width: 860px;
    margin: 24px auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 28px;
    flex-wrap: wrap;
  }

  .lp-pr-trust-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
  }
`

function StyleTag() {
  return <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navStyle = {
    position: "sticky", top: 0, zIndex: 100,
    background: scrolled ? "rgba(240,244,248,0.92)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    borderBottom: scrolled ? "1px solid #e2e8f0" : "1px solid transparent",
    transition: "all 0.3s",
  }

  return (
    <header style={navStyle}>
      <nav style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>JT</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 20, color: "var(--fg)" }}>JobTrack</span>
          </a>

          <div className="desktop-only" style={{ display: "flex", gap: 36 }}>
            {[["How it works", "#how-it-works"], ["Features", "#features"], ["Pricing", "#pricing"], ["FAQ", "#faq"]].map(([l, href]) => (
              <a key={l} href={href} className="nav-link">{l}</a>
            ))}
          </div>

          <div className="desktop-only" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a href="/login" className="btn-ghost">Log in</a>
            <a href="/register" className="btn-primary" style={{ padding: "9px 20px", fontSize: 14 }}>
              Get started free
            </a>
          </div>

          <button
            className="mobile-only"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--fg)" }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-only" style={{ borderTop: "1px solid var(--border)", paddingBottom: 16 }}>
            {[["How it works", "#how-it-works"], ["Features", "#features"], ["Pricing", "#pricing"], ["FAQ", "#faq"]].map(([l, href]) => (
              <a key={l} href={href} onClick={() => setMenuOpen(false)} style={{
                display: "block", padding: "11px 4px",
                fontSize: 15, fontWeight: 500, color: "var(--muted)",
                textDecoration: "none", borderBottom: "1px solid var(--border)",
              }}>{l}</a>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 14 }}>
              <a href="/login" className="btn-outline" style={{ justifyContent: "center" }}>Log in</a>
              <a href="/register" className="btn-primary" style={{ justifyContent: "center" }}>Get started free</a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function JobCard({ company, role, location, variant = "default", showBadge = false }) {
  const bg = { default: "#f1f5f9", blue: "#eff6ff", amber: "#fffbeb", green: "#f0fdf4" }[variant]
  const border = { default: "transparent", blue: "#bfdbfe", amber: "#fde68a", green: "#bbf7d0" }[variant]
  return (
    <div className="hover-lift" style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "10px 12px", cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{role} at {company}</p>
          <p style={{ fontSize: 11, color: variant === "green" && showBadge ? "#16a34a" : "var(--muted)", marginTop: 2 }}>{location}</p>
        </div>
        {showBadge && <span style={{ fontSize: 10, fontWeight: 600, background: "#22c55e", color: "#fff", padding: "2px 6px", borderRadius: 4 }}>NEW</span>}
      </div>
    </div>
  )
}

function Hero() {
  const cols = [
    { label: "Saved", dot: "#94a3b8", count: 3, cards: [
      { company: "Stripe", role: "Senior Dev", location: "San Francisco" },
      { company: "Notion", role: "PM",          location: "Remote" },
    ]},
    { label: "Applied", dot: "#3b82f6", count: 4, cards: [
      { company: "Vercel", role: "Engineer", location: "Remote",   variant: "blue" },
      { company: "Figma",  role: "Designer", location: "New York", variant: "blue" },
    ]},
    { label: "Interviewing", dot: "#f59e0b", count: 2, cards: [
      { company: "Linear", role: "Lead", location: "Round 2", variant: "amber" },
    ]},
    { label: "Offer", dot: "#22c55e", count: 1, cards: [
      { company: "Airbnb", role: "SWE", location: "$185k", variant: "green", showBadge: true },
    ]},
  ]

  return (
    <section className="section" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <div className="section-inner" style={{ textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 99, padding: "6px 16px", marginBottom: 28 }}>
          <span className="ping" />
          <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>New: AI-powered follow-up emails</span>
        </div>

        <h1 style={{ fontSize: "clamp(36px, 6vw, 66px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, color: "var(--fg)", marginBottom: 24 }}>
          Know where every{" "}
          <span style={{ color: "var(--primary)", position: "relative" }}>
            job
            <svg style={{ position: "absolute", bottom: -6, left: 0, width: "100%", height: 12 }} viewBox="0 0 100 12" preserveAspectRatio="none">
              <path d="M0,8 Q25,0 50,8 T100,8" fill="none" stroke="#4f46e5" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>{" "}
          stands.
        </h1>

        <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 40px" }}>
          Stop losing track of your applications. Add jobs, track your progress, and never forget to follow up.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <a href="/register" className="btn-primary">Get started free <ArrowRight size={16} /></a>
          <a href="#how-it-works" className="btn-outline">See how it works</a>
        </div>

        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 52, flexWrap: "wrap" }}>
          {["Free forever", "No credit card"].map(t => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)" }}>
              <CheckCircle2 size={14} color="var(--primary)" /> {t}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 60 }}>
          <div style={{ display: "flex" }}>
            {["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6"].map((c,i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: c, border: "3px solid var(--bg)", marginLeft: i === 0 ? 0 : -10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                {["SM","JT","PK","LB","AK"][i]}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>
            <strong style={{ color: "var(--fg)" }}>2,400+</strong> job seekers already tracking
          </span>
        </div>

        {/* Browser mockup */}
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ position: "absolute", top: -20, left: -20, width: 100, height: 100, background: "rgba(79,70,229,0.08)", borderRadius: "50%", filter: "blur(24px)" }} />
          <div style={{ position: "absolute", bottom: -20, right: -20, width: 130, height: 130, background: "rgba(249,115,22,0.07)", borderRadius: "50%", filter: "blur(24px)" }} />
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.08)", position: "relative" }}>
            <div style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ff5f57","#febc2e","#28c840"].map((c,i) => <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
              </div>
              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div style={{ background: "var(--border)", borderRadius: 7, padding: "4px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--muted)" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>app.jobtrack.io</span>
                </div>
              </div>
            </div>
            <div style={{ padding: 24, background: "var(--bg)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              {cols.map(col => (
                <div key={col.label}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.dot }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{col.label}</span>
                    </div>
                    <span style={{ fontSize: 11, background: "var(--border)", color: "var(--muted)", padding: "1px 7px", borderRadius: 99, fontWeight: 600 }}>{col.count}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {col.cards.map((c, i) => <JobCard key={i} {...c} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: 1, icon: Plus,       title: "Add a job",            desc: "Paste a link or type it in manually. AI fills the details in 10 seconds." },
    { n: 2, icon: LayoutGrid, title: "Track your progress",  desc: "Drag cards as things move forward. Your board always reflects reality." },
    { n: 3, icon: Send,       title: "Follow up",            desc: "Get reminded after 7 days. One click generates a professional email." },
  ]
  return (
    <section id="how-it-works" className="section" style={{ background: "var(--card)" }}>
      <div className="section-inner" style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <span className="tag-pill">Simple by design</span>
        </div>
        <h2 className="section-heading">Three steps. That's it.</h2>
        <p className="section-sub">No complicated setup. No learning curve. Just start tracking.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, position: "relative" }}>
          <div className="desktop-only" style={{ position: "absolute", top: 28, left: "calc(16% + 28px)", right: "calc(16% + 28px)", height: 2, borderTop: "2px dashed rgba(79,70,229,0.25)", pointerEvents: "none" }} />
          {steps.map(s => (
            <div key={s.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, marginBottom: 24, boxShadow: "0 4px 16px rgba(79,70,229,0.3)" }}>{s.n}</div>
              <div className="card hover-lift" style={{ width: "100%", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(79,70,229,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <s.icon size={22} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const feats = [
    { icon: LayoutGrid, title: "Visual kanban board",  desc: "See every application at a glance. Drag and drop as things change. No more spreadsheet chaos.",   accent: "#3b82f6", accentBg: "#eff6ff" },
    { icon: Bell,       title: "Smart reminders",      desc: "Never forget to follow up. Get nudged after 7 days of silence. Stay on top of every opportunity.", accent: "#f59e0b", accentBg: "#fffbeb" },
    { icon: Sparkles,   title: "AI follow-up writer",  desc: "One click generates a professional follow-up email ready to send. Sound impressive, effortlessly.", accent: "#8b5cf6", accentBg: "#f5f3ff" },
  ]
  return (
    <section id="features" className="section">
      <div className="section-inner" style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <span className="tag-pill">Why JobTrack</span>
        </div>
        <h2 className="section-heading">Everything you need. Nothing you don't.</h2>
        <p className="section-sub">Built for job seekers who want to stay organised without the complexity.</p>
        <div className="grid-3">
          {feats.map(f => (
            <div key={f.title} className="card hover-lift" style={{ textAlign: "left" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: f.accentBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <f.icon size={26} color={f.accent} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { quote: "I used to have a messy spreadsheet with 80+ rows. JobTrack replaced it in 5 minutes and I actually enjoy tracking my applications now.", name: "Sarah M.",  role: "UX Designer",       initials: "SM", color: "#3b82f6" },
    { quote: "The follow-up email feature alone saved me hours. I got two callbacks from companies I had completely forgotten about.",                    name: "James T.",  role: "Software Engineer", initials: "JT", color: "#10b981" },
    { quote: "Finally a tracker that doesn't try to do everything. Clean, fast, and it just works. Exactly what I needed during my job search.",         name: "Priya K.",  role: "Product Manager",   initials: "PK", color: "#f59e0b" },
    { quote: "I went from total chaos to having a clear picture of every application within one evening. Genuinely impressed.",                          name: "Luca B.",   role: "Marketing Analyst", initials: "LB", color: "#ef4444" },
  ]
  return (
    <section className="section" style={{ background: "var(--card)" }}>
      <div className="section-inner" style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <span className="tag-pill">Testimonials</span>
        </div>
        <h2 className="section-heading">Job seekers love it.</h2>
        <p className="section-sub">Join thousands of people who've simplified their job search.</p>
        <div className="grid-2">
          {reviews.map(r => (
            <div key={r.name} className="card hover-lift" style={{ textAlign: "left", position: "relative" }}>
              <Quote style={{ position: "absolute", top: 20, right: 20, opacity: 0.08 }} size={32} />
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {[...Array(5)].map((_,i) => <Star key={i} size={16} fill="var(--chart1)" color="var(--chart1)" />)}
              </div>
              <p style={{ fontSize: 15, color: "var(--fg)", lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>"{r.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{r.initials}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>{r.name}</p>
                  <p style={{ fontSize: 13, color: "var(--muted)" }}>{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing section ──────────────────────────────────────────────────────────
const FREE_FEATURES = [
  { section: "Job Board", items: [
    { bold: "Unlimited", suffix: " job tracking" },
    { text: "Kanban board with drag & drop" },
    { text: "5 pipeline stages", sub: "Wishlist · Applied · Interview · Offer · Rejected" },
    { text: "Deadline & job type tags" },
    { text: "Job posting URL per card" },
    { text: "Basic stats overview" },
  ]},
]

const PRO_FEATURES = [
  { section: "Job Board", items: [
    { bold: "Unlimited", suffix: " job tracking" },
    { text: "Advanced filtering & sorting" },
    { text: "Bulk actions across cards" },
    { text: "Advanced analytics dashboard", sub: "Funnel breakdown · Response rate · Time-to-offer" },
    { text: "Weekly progress reports" },
  ]},
  { section: "AI Tools", items: [
    { bold: "30 AI follow-up emails", suffix: " / month", sub: "Tone & reason selector" },
    { bold: "CV gap analysis", suffix: " · 20/month", sub: "Paste a job description → see what your CV is missing" },
    { bold: "Smart follow-up reminders", sub: "\"It's been 7 days since you applied to Stripe — send a follow-up?\"" },
    { bold: "AI interview prep", comingSoon: true, sub: "Role-specific question generation" },
    { bold: "AI cover letter writer", comingSoon: true },
  ]},
]

function PrFeatureItem({ item, variant }) {
  return (
    <div className="lp-pr-feature">
      <div className={`lp-pr-check ${variant}`}>
        <Check size={10} strokeWidth={3} />
      </div>
      <div>
        <p className="lp-pr-feature-text">
          {item.bold ? <strong>{item.bold}</strong> : null}
          {item.suffix || ""}
          {!item.bold ? item.text : ""}
          {item.comingSoon && <span className="lp-pr-coming-soon">Soon</span>}
        </p>
        {item.sub && <p className="lp-pr-feature-sub">{item.sub}</p>}
      </div>
    </div>
  )
}

function PricingSection() {
  const [billing, setBilling] = useState("monthly")
  const isYearly = billing === "yearly"
  const proPrice = isYearly ? "7" : "9"

  return (
    <section id="pricing" className="section" style={{ background: "var(--bg)" }}>
      <div className="section-inner lp-pr-root">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <span className="tag-pill">Pricing</span>
        </div>
        <h2 className="section-heading">Simple, transparent pricing</h2>
        <p className="section-sub" style={{ marginBottom: 28 }}>
          Track for free, upgrade for AI. No hidden fees, cancel anytime.
        </p>

        {/* Toggle */}
        <div className="lp-pr-billing-label">Billing Period</div>
        <div className="lp-pr-toggle-wrap">
          <div className="lp-pr-toggle">
            <button className={`lp-pr-toggle-btn ${!isYearly ? "active" : ""}`} onClick={() => setBilling("monthly")}>
              Monthly
            </button>
            <button className={`lp-pr-toggle-btn ${isYearly ? "active" : ""}`} onClick={() => setBilling("yearly")}>
              Yearly <span className="lp-pr-save-badge">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="lp-pr-cards">

          {/* Free */}
          <div className="lp-pr-card free-card">
            <div className="lp-pr-card-head">
              <p className="lp-pr-plan-name">Free</p>
              <p className="lp-pr-plan-desc">Unlimited job tracking, forever free. No credit card, no catch.</p>
              <div className="lp-pr-price-row">
                <span className="lp-pr-currency">$</span>
                <span className="lp-pr-amount">0</span>
                <span className="lp-pr-period">/month</span>
              </div>
              <div className="lp-pr-yearly-note" />
              <a href="/register" className="lp-pr-btn-free">Sign Up for Free</a>
            </div>
            <div className="lp-pr-card-body">
              {FREE_FEATURES.map(s => (
                <div className="lp-pr-section" key={s.section}>
                  <p className="lp-pr-section-label">{s.section}</p>
                  <div className="lp-pr-features">
                    {s.items.map((item, i) => <PrFeatureItem key={i} item={item} variant="free" />)}
                  </div>
                </div>
              ))}
              <div className="lp-pr-section">
                <p className="lp-pr-section-label">AI Tools</p>
                <div style={{ background: "#fafafa", border: "1.5px dashed #e5e7eb", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, background: "#f3f4f6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#9ca3af" }}>
                    <Lock size={14} />
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.45 }}>
                    <strong style={{ color: "#6b7280", fontWeight: 600, display: "block", marginBottom: 2 }}>AI features are Pro only</strong>
                    Follow-up emails, CV gap analysis, smart reminders & more — upgrade to unlock.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pro */}
          <div className="lp-pr-card featured">
            <div className="lp-pr-ribbon">
              <Star size={10} fill="white" strokeWidth={0} /> Most Popular
            </div>
            <div className="lp-pr-card-head">
              <p className="lp-pr-plan-name">Pro</p>
              <p className="lp-pr-plan-desc">Unlock AI tools that actively help you land more interviews.</p>
              <div className="lp-pr-price-row">
                <span className="lp-pr-currency">$</span>
                <span className="lp-pr-amount">{proPrice}</span>
                <span className="lp-pr-period">/month</span>
              </div>
              <div className="lp-pr-yearly-note">
                {isYearly && <><Check size={12} strokeWidth={3} /> Billed $84/year — save $24</>}
              </div>
              <a href="/register?plan=pro" className="lp-pr-btn-pro">Get Pro Access</a>
            </div>
            <div className="lp-pr-card-body">
              <p className="lp-pr-includes-note">Everything in <strong>Free</strong>, plus:</p>
              {PRO_FEATURES.map(s => (
                <div className="lp-pr-section" key={s.section}>
                  <p className="lp-pr-section-label">{s.section}</p>
                  <div className="lp-pr-features">
                    {s.items.map((item, i) => <PrFeatureItem key={i} item={item} variant="pro" />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="lp-pr-trust">
          {[
            { icon: Shield, text: "Secure payment via Stripe" },
            { icon: Zap,    text: "Cancel anytime" },
            { icon: Check,  text: "No credit card required for Free" },
          ].map(({ icon: Icon, text }) => (
            <div className="lp-pr-trust-item" key={text}>
              <Icon size={13} /> {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: "Is JobTrack really free?",                   a: "Yes! JobTrack is free forever. We believe everyone deserves access to great job search tools. No credit card, no job cap, no catch." },
    { q: "Do I need to connect my LinkedIn or email?", a: "Nope. JobTrack works completely standalone. You manually add jobs. The AI follow-up writer generates email text for you to copy — we never touch your inbox." },
    { q: "How does the AI follow-up writer work?",     a: "Click the follow-up button on any job card. AI uses the company name, role, and date you applied to write a personalised email. Edit it if you want, then copy and send." },
    { q: "Can I use it on my phone?",                  a: "Absolutely. JobTrack is fully responsive and works great in any mobile browser." },
    { q: "What happens to my data?",                   a: "Your data is yours. We use industry-standard encryption and never sell your information. Export or delete everything at any time from your account settings." },
  ]
  return (
    <section id="faq" className="section">
      <div className="section-inner-sm" style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <span className="tag-pill">FAQ</span>
        </div>
        <h2 className="section-heading">Frequently asked questions</h2>
        <p className="section-sub" style={{ marginBottom: 40 }}>
          Can't find what you're looking for? <a href="#" style={{ color: "var(--primary)", fontWeight: 500 }}>Contact us</a>
        </p>
        <div>
          {faqs.map((f, i) => (
            <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
              <button className="faq-trigger" onClick={() => setOpen(open === i ? null : i)}>
                {f.q}
                <i className={`faq-icon ${open === i ? "open" : ""}`}>+</i>
              </button>
              <div className={`faq-body ${open === i ? "open" : ""}`}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  const gridSVG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  return (
    <section className="section" style={{ background: "var(--accent)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: gridSVG }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: 320, height: 320, background: "rgba(255,255,255,0.05)", borderRadius: "50%", filter: "blur(60px)", transform: "translate(-40%,-40%)" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 320, height: 320, background: "rgba(255,255,255,0.05)", borderRadius: "50%", filter: "blur(60px)", transform: "translate(40%,40%)" }} />
      <div className="section-inner" style={{ textAlign: "center", position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 99, padding: "5px 16px", marginBottom: 24 }}>
          <Sparkles size={14} color="#fff" />
          <span style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>Start in 30 seconds</span>
        </div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.2, marginBottom: 20 }}>
          Ready to take control of<br />your job search?
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", marginBottom: 36, lineHeight: 1.65 }}>
          Join 2,400+ job seekers who've already simplified their search with JobTrack.
        </p>
        <a href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "var(--fg)", padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", transition: "transform 0.2s, box-shadow 0.2s" }}
          onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.25)"; }}
          onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)"; }}
        >
          Create your free account <ArrowRight size={18} />
        </a>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
          {["No credit card required", "Free forever", "Cancel anytime"].map((t, i, arr) => (
            <span key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 8 }}>
              {t}{i < arr.length - 1 && <span style={{ opacity: 0.3 }}>|</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = {
    Product: [["Features","#features"],["How it works","#how-it-works"],["Pricing","#pricing"],["FAQ","#faq"]],
    Company: [["About","#"],["Blog","#"],["Careers","#"],["Contact","#"]],
    Legal:   [["Privacy Policy","#"],["Terms of Service","#"],["Cookie Policy","#"]],
  }
  const socials = [
    { icon: Globe,     label: "Twitter",  href: "#" },
    { icon: GitBranch, label: "GitHub",   href: "#" },
    { icon: Link,      label: "LinkedIn", href: "#" },
  ]
  return (
    <footer style={{ background: "var(--fg)", color: "rgba(255,255,255,0.6)", padding: "64px 24px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>JT</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 20, color: "#fff" }}>JobTrack</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, maxWidth: 220 }}>Built for job seekers who refuse to lose track. Simple, beautiful, and effective.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label} style={{ width: 38, height: 38, borderRadius: 8, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "background 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                  onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                ><s.icon size={16} /></a>
              ))}
            </div>
          </div>
          {Object.entries(cols).map(([title, links]) => (
            <div key={title}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>{title}</p>
              {links.map(([label, href]) => (
                <a key={label} href={href} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.color = "#fff"}
                  onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                >{label}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 13 }}>© 2026 JobTrack. All rights reserved.</p>
          <p style={{ fontSize: 13 }}>Made with care for job seekers everywhere.</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <StyleTag />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  )
}
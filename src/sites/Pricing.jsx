import { useState } from "react";
import { Check, Zap, Star, Shield, Lock } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&display=swap');

  .pr-root {
    min-height: calc(100vh - 60px);
    font-family: 'Geist', system-ui, sans-serif;
    background: #f4f4f9;
    padding: 64px 24px 80px;
  }

  /* ── Hero ── */
  .pr-hero {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 36px;
  }

  .pr-hero h1 {
    font-size: 48px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -1.5px;
    line-height: 1.1;
    margin: 0 0 0px;
  }

  .pr-hero h1 .purple {
    color: #5b4cf5;
  }

  /* ── Billing toggle ── */
  .pr-billing-label {
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 12px;
    letter-spacing: 0.01em;
  }

  .pr-toggle-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 52px;
  }

  .pr-toggle {
    display: inline-flex;
    background: white;
    border: 1px solid #e0e0ec;
    border-radius: 99px;
    padding: 4px;
    gap: 2px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  .pr-toggle-btn {
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

  .pr-toggle-btn.active {
    background: #5b4cf5;
    color: white;
    box-shadow: 0 2px 8px rgba(91,76,245,0.35);
  }

  .pr-save-badge {
    background: #fef3c7;
    color: #92400e;
    border-radius: 99px;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    letter-spacing: 0.03em;
  }

  /* ── Cards grid ── */
  .pr-cards {
    max-width: 860px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    align-items: start;
  }

  @media (max-width: 700px) {
    .pr-cards {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .pr-hero h1 { font-size: 34px; }
    .pr-card.featured { transform: none; }
  }

  /* ── Card base ── */
  .pr-card {
    background: white;
    border: 1px solid #e0e0ec;
    border-radius: 20px;
    overflow: hidden;
    transition: box-shadow 0.2s;
    position: relative;
  }

  .pr-card.free-card {
    border-radius: 20px 0 0 20px;
    border-right: none;
    padding-top: 32px;
    box-shadow: -2px 0 16px rgba(0,0,0,0.04);
    z-index: 1;
  }

  .pr-card.featured {
    border: 2px solid #5b4cf5;
    border-radius: 20px;
    box-shadow: 0 8px 48px rgba(91,76,245,0.18), 0 2px 12px rgba(0,0,0,0.08);
    z-index: 2;
    position: relative;
  }

  /* ── Featured ribbon ── */
  .pr-ribbon {
    background: #5b4cf5;
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

  /* ── Card header ── */
  .pr-card-head {
    padding: 28px 28px 24px;
    border-bottom: 1px solid #f1f1f7;
  }

  .pr-plan-name {
    font-size: 30px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -0.5px;
    margin: 0 0 6px;
  }

  .pr-plan-desc {
    font-size: 13px;
    color: #6b7280;
    margin: 0 0 24px;
    line-height: 1.55;
    max-width: 280px;
  }

  .pr-price-row {
    display: flex;
    align-items: flex-end;
    gap: 1px;
    margin-bottom: 18px;
    line-height: 1;
  }

  .pr-price-currency {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 6px;
  }

  .pr-price-amount {
    font-size: 58px;
    font-weight: 900;
    color: #111827;
    letter-spacing: -3px;
    line-height: 1;
  }

  .pr-price-suffix {
    font-size: 15px;
    color: #9ca3af;
    font-weight: 500;
    margin-bottom: 7px;
    padding-left: 3px;
    font-style: italic;
  }

  .pr-price-yearly-note {
    font-size: 12px;
    font-weight: 600;
    color: #16a34a;
    margin-bottom: 18px;
    margin-top: -10px;
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 18px;
  }

  /* ── CTA buttons ── */
  .pr-btn-free {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    border: 1.5px solid #d1d5db;
    background: white;
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
    letter-spacing: -0.1px;
  }

  .pr-btn-free:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  .pr-btn-pro {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: #f5c842;
    font-size: 15px;
    font-weight: 800;
    color: #111827;
    cursor: pointer;
    font-family: 'Geist', system-ui, sans-serif;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: -0.2px;
    box-shadow: 0 3px 12px rgba(245,200,66,0.4);
  }

  .pr-btn-pro:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(245,200,66,0.5);
    filter: brightness(0.97);
  }

  /* ── Feature sections ── */
  .pr-card-body {
    padding: 22px 28px 28px;
  }

  .pr-includes-note {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 18px;
  }

  .pr-includes-note strong {
    font-weight: 700;
  }

  .pr-section {
    margin-bottom: 20px;
  }

  .pr-section:last-child {
    margin-bottom: 0;
  }

  .pr-section-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: #9ca3af;
    margin: 0 0 11px;
    padding-bottom: 9px;
    border-bottom: 1px solid #f1f1f7;
  }

  .pr-features {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .pr-feature {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .pr-check {
    width: 20px;
    height: 20px;
    border-radius: 99px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 0px;
  }

  .pr-check.free {
    background: #f3f4f6;
    color: #9ca3af;
    border: 1.5px solid #e5e7eb;
  }

  .pr-check.pro {
    background: #5b4cf5;
    color: white;
  }

  /* Locked AI row on free plan */
  .pr-check.locked {
    background: #fef2f2;
    color: #fca5a5;
    border: 1.5px solid #fecaca;
  }

  .pr-feature.locked-row .pr-feature-text {
    color: #d1d5db;
    text-decoration: line-through;
    text-decoration-color: #e5e7eb;
  }

  .pr-lock-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    font-weight: 700;
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid #fecaca;
    border-radius: 4px;
    padding: 1px 5px;
    margin-left: 6px;
    vertical-align: middle;
    letter-spacing: 0.02em;
  }

  .pr-feature-text {
    font-size: 13px;
    color: #374151;
    line-height: 1.45;
    margin: 0;
  }

  .pr-feature-text strong {
    color: #111827;
    font-weight: 700;
  }

  .pr-coming-soon {
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

  .pr-feature-sub {
    font-size: 11px;
    color: #9ca3af;
    margin: 2px 0 0;
    line-height: 1.4;
  }

  .pr-feature-sub.locked-sub {
    color: #e5e7eb;
  }

  /* ── AI locked callout on free card ── */
  .pr-ai-locked {
    background: #fafafa;
    border: 1.5px dashed #e5e7eb;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pr-ai-locked-icon {
    width: 32px;
    height: 32px;
    background: #f3f4f6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #9ca3af;
  }

  .pr-ai-locked-text {
    font-size: 12px;
    color: #9ca3af;
    line-height: 1.45;
  }

  .pr-ai-locked-text strong {
    color: #6b7280;
    font-weight: 600;
    display: block;
    margin-bottom: 1px;
  }

  /* ── Trust strip ── */
  .pr-trust {
    max-width: 860px;
    margin: 28px auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
  }

  .pr-trust-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
  }
`;

const FREE_FEATURES = [
  {
    section: "Job Board",
    items: [
      { bold: "Unlimited", suffix: " job tracking" },
      { text: "Kanban board with drag & drop" },
      { text: "5 pipeline stages", sub: "Wishlist · Applied · Interview · Offer · Rejected" },
      { text: "Deadline & job type tags" },
      { text: "Job posting URL per card" },
      { text: "Basic stats overview" },
    ],
  },
];

const PRO_FEATURES = [
  {
    section: "Job Board",
    items: [
      { bold: "Unlimited", suffix: " job tracking" },
      { text: "Advanced filtering & sorting" },
      { text: "Bulk actions across cards" },
      { text: "Advanced analytics dashboard", sub: "Funnel breakdown · Response rate · Time-to-offer" },
      { text: "Weekly progress reports" },
    ],
  },
  {
    section: "AI Tools",
    items: [
      { bold: "30 AI follow-up emails", suffix: " / month", sub: "Tone & reason selector" },
      { bold: "CV gap analysis", suffix: " · 20/month", sub: "Paste a job description → see what your CV is missing" },
      { bold: "Smart follow-up reminders", sub: "\"It's been 7 days since you applied to Stripe — send a follow-up?\"" },
      { bold: "AI interview prep", comingSoon: true, sub: "Role-specific question generation" },
      { bold: "AI cover letter writer", comingSoon: true },
    ],
  },
];

function FeatureItem({ item, variant }) {
  return (
    <div className="pr-feature">
      <div className={`pr-check ${variant}`}>
        <Check size={11} strokeWidth={3} />
      </div>
      <div>
        <p className="pr-feature-text">
          {item.bold ? <strong>{item.bold}</strong> : null}
          {item.suffix || ""}
          {!item.bold ? item.text : ""}
          {item.comingSoon && <span className="pr-coming-soon">Soon</span>}
        </p>
        {item.sub && <p className="pr-feature-sub">{item.sub}</p>}
      </div>
    </div>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const isYearly = billing === "yearly";
  const proPrice = isYearly ? "7" : "9";

  return (
    <>
      <style>{styles}</style>
      <div className="pr-root">

        {/* Hero */}
        <div className="pr-hero">
          <h1>
            Track Smarter. <strong>More Interviews.</strong><br />
            <span className="purple">With a Little Help From AI.</span>
          </h1>
        </div>

        {/* Billing toggle */}
        <div className="pr-billing-label">Billing Period</div>
        <div className="pr-toggle-wrap">
          <div className="pr-toggle">
            <button
              className={`pr-toggle-btn ${!isYearly ? "active" : ""}`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              className={`pr-toggle-btn ${isYearly ? "active" : ""}`}
              onClick={() => setBilling("yearly")}
            >
              Yearly
              <span className="pr-save-badge">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="pr-cards">

          {/* Free */}
          <div className="pr-card free-card">
            <div className="pr-card-head">
              <p className="pr-plan-name">Free</p>
              <p className="pr-plan-desc">Unlimited job tracking, forever free. No credit card, no catch.</p>
              <div className="pr-price-row">
                <span className="pr-price-currency">$</span>
                <span className="pr-price-amount">0</span>
                <span className="pr-price-suffix">/month</span>
              </div>
              <div className="pr-price-yearly-note" />
              <button className="pr-btn-free">Current Plan</button>
            </div>
            <div className="pr-card-body">
              {FREE_FEATURES.map(s => (
                <div className="pr-section" key={s.section}>
                  <p className="pr-section-label">{s.section}</p>
                  <div className="pr-features">
                    {s.items.map((item, i) => (
                      <FeatureItem key={i} item={item} variant="free" />
                    ))}
                  </div>
                </div>
              ))}

              {/* AI locked block */}
              <div className="pr-section">
                <p className="pr-section-label">AI Tools</p>
                <div className="pr-ai-locked">
                  <div className="pr-ai-locked-icon">
                    <Lock size={15} />
                  </div>
                  <div className="pr-ai-locked-text">
                    <strong>AI features are Pro only</strong>
                    Follow-up emails, CV gap analysis, smart reminders & more — upgrade to unlock.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pro */}
          <div className="pr-card featured">
            <div className="pr-ribbon">
              <Star size={10} fill="white" strokeWidth={0} />
              Most Popular
            </div>
            <div className="pr-card-head">
              <p className="pr-plan-name">Pro</p>
              <p className="pr-plan-desc">Unlock AI tools that actively help you land more interviews.</p>
              <div className="pr-price-row">
                <span className="pr-price-currency">$</span>
                <span className="pr-price-amount">{proPrice}</span>
                <span className="pr-price-suffix">/month</span>
              </div>
              <div className="pr-price-yearly-note">
                {isYearly && <><Check size={12} strokeWidth={3} /> Billed $84/year — save $24</>}
              </div>
              <button className="pr-btn-pro">
                Get Pro Access
              </button>
            </div>
            <div className="pr-card-body">
              <p className="pr-includes-note">Everything in <strong>Free</strong>, plus:</p>
              {PRO_FEATURES.map(s => (
                <div className="pr-section" key={s.section}>
                  <p className="pr-section-label">{s.section}</p>
                  <div className="pr-features">
                    {s.items.map((item, i) => (
                      <FeatureItem key={i} item={item} variant="pro" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Trust strip */}
        <div className="pr-trust">
          {[
            { icon: Shield, text: "Secure payment via Stripe" },
            { icon: Zap,    text: "Cancel anytime" },
            { icon: Check,  text: "No credit card required for Free plan" },
          ].map(({ icon: Icon, text }) => (
            <div className="pr-trust-item" key={text}>
              <Icon size={13} />
              {text}
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
import { useState, useEffect, useCallback } from "react";

// ─── Fonts injected once ──────────────────────────────────────────────────────
const FONT_LINK = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap";

// ─── Default / empty CV state ─────────────────────────────────────────────────
const EMPTY_CV = {
  personal: {
    firstName: "", lastName: "", jobTitle: "", email: "", phone: "",
    location: "", linkedin: "", website: "",
  },
  summary: { text: "" },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
};

const EMPTY_EXP = () => ({
  id: crypto.randomUUID(), company: "", title: "", startDate: "",
  endDate: "", current: false, bullets: [""],
});
const EMPTY_EDU = () => ({
  id: crypto.randomUUID(), school: "", degree: "", field: "",
  startDate: "", endDate: "", grade: "",
});
const EMPTY_CERT = () => ({
  id: crypto.randomUUID(), name: "", issuer: "", date: "", url: "",
});
const EMPTY_PROJECT = () => ({
  id: crypto.randomUUID(), title: "", description: "", stack: "", url: "",
});
const EMPTY_LANG = () => ({
  id: crypto.randomUUID(), language: "", level: "B2",
});

const LANG_LEVELS = ["A1","A2","B1","B2","C1","C2","Native"];

const STEPS = [
  { id: "personal",        label: "Personal details",      icon: "👤" },
  { id: "summary",         label: "Summary",               icon: "📝" },
  { id: "experience",      label: "Work experience",       icon: "💼" },
  { id: "education",       label: "Education",             icon: "🎓" },
  { id: "skills",          label: "Skills",                icon: "⚡" },
  { id: "languages",       label: "Languages",             icon: "🌐" },
  { id: "certifications",  label: "Certifications",        icon: "🏅" },
  { id: "projects",        label: "Projects",              icon: "🚀" },
  { id: "finish",          label: "Finish",                icon: "✅" },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
@import url('${FONT_LINK}');

.cvb-root *{box-sizing:border-box;margin:0;padding:0;}
.cvb-root{
  font-family:'DM Sans',sans-serif;
  font-size:14px;
  color:#1a1a1a;
  background:#f4f2ee;
  min-height:100vh;
  display:flex;
  flex-direction:column;
}

/* ── Top nav ── */
.cvb-nav{
  background:#fff;
  border-bottom:1px solid #e5e2dc;
  padding:0 2rem;
  display:flex;
  align-items:center;
  gap:2rem;
  overflow-x:auto;
  scrollbar-width:none;
  position:sticky;
  top:0;
  z-index:100;
}
.cvb-nav::-webkit-scrollbar{display:none;}
.cvb-nav-step{
  display:flex;
  align-items:center;
  gap:6px;
  padding:1rem 0.25rem;
  border-bottom:2px solid transparent;
  cursor:pointer;
  white-space:nowrap;
  color:#888;
  font-size:13px;
  font-weight:500;
  transition:color 0.15s,border-color 0.15s;
  background:none;
  border-top:none;
  border-left:none;
  border-right:none;
}
.cvb-nav-step.active{color:#1a1a1a;border-bottom-color:#c8a96e;}
.cvb-nav-step.done{color:#4a7c59;}
.cvb-nav-icon{font-size:15px;}
.cvb-nav-num{
  width:18px;height:18px;border-radius:50%;
  background:#e5e2dc;color:#888;
  display:flex;align-items:center;justify-content:center;
  font-size:10px;font-weight:600;
  transition:background 0.15s,color 0.15s;
}
.cvb-nav-step.active .cvb-nav-num{background:#c8a96e;color:#fff;}
.cvb-nav-step.done .cvb-nav-num{background:#4a7c59;color:#fff;}

/* ── Main layout ── */
.cvb-body{
  display:flex;
  flex:1;
  gap:0;
  max-height:calc(100vh - 57px);
}

/* ── Form panel ── */
.cvb-form-panel{
  width:420px;
  flex-shrink:0;
  background:#fff;
  border-right:1px solid #e5e2dc;
  overflow-y:auto;
  padding:2rem 2rem 5rem;
  scrollbar-width:thin;
  scrollbar-color:#e5e2dc transparent;
}
.cvb-form-panel::-webkit-scrollbar{width:4px;}
.cvb-form-panel::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px;}

.cvb-step-title{
  font-family:'DM Serif Display',serif;
  font-size:24px;
  color:#1a1a1a;
  margin-bottom:4px;
}
.cvb-step-sub{font-size:13px;color:#888;margin-bottom:1.75rem;}

/* ── Fields ── */
.cvb-field{margin-bottom:1rem;}
.cvb-label{
  display:block;font-size:12px;font-weight:600;
  letter-spacing:0.05em;text-transform:uppercase;
  color:#888;margin-bottom:5px;
}
.cvb-input,.cvb-textarea,.cvb-select{
  width:100%;
  padding:9px 12px;
  border:1px solid #e0ddd8;
  border-radius:8px;
  font-family:'DM Sans',sans-serif;
  font-size:14px;
  color:#1a1a1a;
  background:#fdfcfb;
  transition:border-color 0.15s,box-shadow 0.15s;
  outline:none;
}
.cvb-input:focus,.cvb-textarea:focus,.cvb-select:focus{
  border-color:#c8a96e;
  box-shadow:0 0 0 3px rgba(200,169,110,0.15);
}
.cvb-textarea{resize:vertical;min-height:100px;line-height:1.6;}

.cvb-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.cvb-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}

/* ── Cards (experience / education etc.) ── */
.cvb-card{
  border:1px solid #e5e2dc;
  border-radius:12px;
  padding:1.25rem;
  margin-bottom:1rem;
  background:#fdfcfb;
  position:relative;
}
.cvb-card-header{
  display:flex;align-items:center;
  justify-content:space-between;margin-bottom:1rem;
}
.cvb-card-title{font-size:14px;font-weight:600;color:#1a1a1a;}
.cvb-card-del{
  background:none;border:none;cursor:pointer;
  color:#ccc;font-size:18px;line-height:1;
  padding:2px 4px;border-radius:4px;
  transition:color 0.15s;
}
.cvb-card-del:hover{color:#e05a5a;}

/* ── Checkbox / toggle ── */
.cvb-check-row{display:flex;align-items:center;gap:8px;margin-bottom:1rem;}
.cvb-check{width:16px;height:16px;accent-color:#c8a96e;cursor:pointer;}
.cvb-check-label{font-size:13px;color:#555;cursor:pointer;}

/* ── Bullets ── */
.cvb-bullet-row{display:flex;gap:6px;margin-bottom:6px;align-items:flex-start;}
.cvb-bullet-input{flex:1;}
.cvb-bullet-del{
  background:none;border:none;cursor:pointer;
  color:#ccc;font-size:16px;padding:8px 4px;
  line-height:1;transition:color 0.15s;flex-shrink:0;
}
.cvb-bullet-del:hover{color:#e05a5a;}

/* ── Add buttons ── */
.cvb-btn-add{
  display:flex;align-items:center;gap:6px;
  width:100%;padding:10px;border-radius:8px;
  border:1.5px dashed #ddd;background:none;
  color:#888;font-size:13px;font-family:'DM Sans',sans-serif;
  cursor:pointer;transition:border-color 0.15s,color 0.15s;
  justify-content:center;font-weight:500;
}
.cvb-btn-add:hover{border-color:#c8a96e;color:#c8a96e;}

/* ── Skills tags ── */
.cvb-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;}
.cvb-tag{
  display:flex;align-items:center;gap:4px;
  background:#f4f0e8;border:1px solid #e0d8c8;
  border-radius:20px;padding:4px 10px;
  font-size:13px;color:#5a4a2a;font-weight:500;
}
.cvb-tag-x{
  background:none;border:none;cursor:pointer;
  color:#b0a080;font-size:14px;line-height:1;padding:0;
  transition:color 0.15s;
}
.cvb-tag-x:hover{color:#c8a96e;}
.cvb-tag-input-row{display:flex;gap:8px;}
.cvb-tag-input-row .cvb-input{flex:1;}
.cvb-btn-sm{
  padding:9px 14px;border-radius:8px;
  background:#1a1a1a;color:#fff;border:none;
  font-family:'DM Sans',sans-serif;font-size:13px;
  font-weight:500;cursor:pointer;white-space:nowrap;
  transition:background 0.15s;
}
.cvb-btn-sm:hover{background:#333;}

/* ── Nav buttons ── */
.cvb-nav-btns{
  display:flex;justify-content:space-between;
  margin-top:2rem;padding-top:1.5rem;
  border-top:1px solid #eee;
}
.cvb-btn-prev{
  padding:10px 20px;border-radius:8px;border:1px solid #ddd;
  background:#fff;color:#555;font-family:'DM Sans',sans-serif;
  font-size:14px;font-weight:500;cursor:pointer;
  transition:background 0.15s;
}
.cvb-btn-prev:hover{background:#f5f5f5;}
.cvb-btn-next{
  padding:10px 24px;border-radius:8px;border:none;
  background:#1a1a1a;color:#fff;font-family:'DM Sans',sans-serif;
  font-size:14px;font-weight:500;cursor:pointer;
  transition:background 0.15s;
}
.cvb-btn-next:hover{background:#c8a96e;}
.cvb-btn-next.gold{background:#c8a96e;}
.cvb-btn-next.gold:hover{background:#b8923e;}

/* ── Preview panel ── */
.cvb-preview-panel{
  flex:1;overflow-y:auto;padding:2rem;
  scrollbar-width:thin;scrollbar-color:#e5e2dc transparent;
  background:#f4f2ee;
}
.cvb-preview-panel::-webkit-scrollbar{width:4px;}
.cvb-preview-panel::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px;}

.cvb-preview-label{
  font-size:11px;font-weight:600;letter-spacing:0.08em;
  text-transform:uppercase;color:#aaa;margin-bottom:1rem;
}

/* ── CV Document ── */
.cvb-doc{
  background:#fff;
  border:1px solid #e5e2dc;
  border-radius:8px;
  padding:2.5rem 2.5rem 3rem;
  max-width:640px;
  box-shadow:0 2px 12px rgba(0,0,0,0.06);
  font-family:'DM Sans',sans-serif;
  color:#1a1a1a;
}

.cvb-doc-name{
  font-family:'DM Serif Display',serif;
  font-size:30px;
  line-height:1.1;
  color:#1a1a1a;
}
.cvb-doc-title{
  font-size:14px;color:#888;margin-top:4px;margin-bottom:8px;
  font-weight:400;
}
.cvb-doc-contact{
  display:flex;flex-wrap:wrap;gap:4px 16px;
  font-size:12px;color:#666;margin-bottom:1.5rem;
  padding-bottom:1rem;
  border-bottom:2px solid #1a1a1a;
}
.cvb-doc-contact span{display:flex;align-items:center;gap:4px;}

.cvb-doc-section{margin-bottom:1.4rem;}
.cvb-doc-section-title{
  font-size:10px;font-weight:700;letter-spacing:0.12em;
  text-transform:uppercase;color:#c8a96e;
  margin-bottom:0.6rem;padding-bottom:3px;
  border-bottom:1px solid #e8dcc8;
}
.cvb-doc-entry{margin-bottom:0.9rem;}
.cvb-doc-entry-header{
  display:flex;justify-content:space-between;
  align-items:baseline;gap:8px;
}
.cvb-doc-entry-title{font-size:13px;font-weight:600;color:#1a1a1a;}
.cvb-doc-entry-date{font-size:11px;color:#aaa;white-space:nowrap;}
.cvb-doc-entry-sub{font-size:12px;color:#666;margin-top:1px;}
.cvb-doc-bullets{margin-top:5px;padding-left:14px;}
.cvb-doc-bullets li{font-size:12px;color:#444;line-height:1.6;margin-bottom:2px;}
.cvb-doc-summary{font-size:13px;color:#444;line-height:1.7;}

.cvb-doc-skills{display:flex;flex-wrap:wrap;gap:5px;}
.cvb-doc-skill-tag{
  font-size:11px;padding:3px 9px;border-radius:12px;
  background:#f4f0e8;color:#5a4a2a;border:1px solid #e0d8c8;
}
.cvb-doc-lang-row{display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;}
.cvb-doc-lang-level{color:#888;}

.cvb-placeholder{
  width:100%;height:3px;border-radius:2px;
  background:linear-gradient(90deg,#eee 0%,#f5f5f5 50%,#eee 100%);
  margin-bottom:4px;
}

/* ── Finish screen ── */
.cvb-finish{text-align:center;padding:2rem 0;}
.cvb-finish-icon{font-size:56px;margin-bottom:1rem;}
.cvb-finish-title{
  font-family:'DM Serif Display',serif;
  font-size:28px;color:#1a1a1a;margin-bottom:8px;
}
.cvb-finish-sub{font-size:14px;color:#888;margin-bottom:2rem;line-height:1.6;}
.cvb-finish-actions{display:flex;flex-direction:column;gap:10px;}
.cvb-btn-primary{
  padding:13px 24px;border-radius:10px;border:none;
  background:#1a1a1a;color:#fff;font-family:'DM Sans',sans-serif;
  font-size:14px;font-weight:600;cursor:pointer;
  transition:background 0.15s;
}
.cvb-btn-primary:hover{background:#c8a96e;}
.cvb-btn-secondary{
  padding:13px 24px;border-radius:10px;
  border:1px solid #ddd;background:#fff;
  color:#555;font-family:'DM Sans',sans-serif;
  font-size:14px;font-weight:500;cursor:pointer;
  transition:background 0.15s;
}
.cvb-btn-secondary:hover{background:#f5f5f5;}
.cvb-saved-badge{
  display:inline-flex;align-items:center;gap:6px;
  font-size:12px;color:#4a7c59;padding:4px 10px;
  background:#edf5f0;border-radius:20px;margin-bottom:1rem;
}
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return "";
  const [y, m] = d.split("-");
  if (!y) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return m ? `${months[parseInt(m) - 1]} ${y}` : y;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepPersonal({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });
  return (
    <>
      <div className="cvb-row">
        <div className="cvb-field">
          <label className="cvb-label">First name</label>
          <input className="cvb-input" value={data.firstName} onChange={set("firstName")} placeholder="Ola" />
        </div>
        <div className="cvb-field">
          <label className="cvb-label">Last name</label>
          <input className="cvb-input" value={data.lastName} onChange={set("lastName")} placeholder="Nordmann" />
        </div>
      </div>
      <div className="cvb-field">
        <label className="cvb-label">Professional title</label>
        <input className="cvb-input" value={data.jobTitle} onChange={set("jobTitle")} placeholder="Senior Product Designer" />
      </div>
      <div className="cvb-row">
        <div className="cvb-field">
          <label className="cvb-label">Email</label>
          <input className="cvb-input" type="email" value={data.email} onChange={set("email")} placeholder="ola@example.com" />
        </div>
        <div className="cvb-field">
          <label className="cvb-label">Phone</label>
          <input className="cvb-input" type="tel" value={data.phone} onChange={set("phone")} placeholder="+47 123 45 678" />
        </div>
      </div>
      <div className="cvb-field">
        <label className="cvb-label">Location</label>
        <input className="cvb-input" value={data.location} onChange={set("location")} placeholder="Oslo, Norway" />
      </div>
      <div className="cvb-field">
        <label className="cvb-label">LinkedIn URL</label>
        <input className="cvb-input" value={data.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/olanordmann" />
      </div>
      <div className="cvb-field">
        <label className="cvb-label">Website / portfolio</label>
        <input className="cvb-input" value={data.website} onChange={set("website")} placeholder="olanordmann.com" />
      </div>
    </>
  );
}

function StepSummary({ data, onChange }) {
  return (
    <div className="cvb-field">
      <label className="cvb-label">Professional summary</label>
      <textarea
        className="cvb-textarea"
        style={{ minHeight: 160 }}
        value={data.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="Write 2–4 sentences about who you are, your core expertise, and what you bring to a role. Keep it focused and specific."
      />
      <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
        {data.text.length} characters · aim for 300–600
      </div>
    </div>
  );
}

function StepExperience({ data, onChange }) {
  const add = () => onChange([...data, EMPTY_EXP()]);
  const remove = (id) => onChange(data.filter((e) => e.id !== id));
  const update = (id, patch) => onChange(data.map((e) => e.id === id ? { ...e, ...patch } : e));
  const addBullet = (id) => update(id, { bullets: [...data.find(e=>e.id===id).bullets, ""] });
  const removeBullet = (id, i) => {
    const exp = data.find(e=>e.id===id);
    update(id, { bullets: exp.bullets.filter((_,idx)=>idx!==i) });
  };
  const setBullet = (id, i, val) => {
    const exp = data.find(e=>e.id===id);
    const b = [...exp.bullets];
    b[i] = val;
    update(id, { bullets: b });
  };

  return (
    <>
      {data.map((exp) => (
        <div className="cvb-card" key={exp.id}>
          <div className="cvb-card-header">
            <span className="cvb-card-title">{exp.company || "New position"}</span>
            <button className="cvb-card-del" onClick={() => remove(exp.id)} title="Remove">×</button>
          </div>
          <div className="cvb-row">
            <div className="cvb-field">
              <label className="cvb-label">Job title</label>
              <input className="cvb-input" value={exp.title} onChange={e=>update(exp.id,{title:e.target.value})} placeholder="Product Designer" />
            </div>
            <div className="cvb-field">
              <label className="cvb-label">Company</label>
              <input className="cvb-input" value={exp.company} onChange={e=>update(exp.id,{company:e.target.value})} placeholder="Acme AS" />
            </div>
          </div>
          <div className="cvb-row">
            <div className="cvb-field">
              <label className="cvb-label">Start date</label>
              <input className="cvb-input" type="month" value={exp.startDate} onChange={e=>update(exp.id,{startDate:e.target.value})} />
            </div>
            <div className="cvb-field">
              <label className="cvb-label">End date</label>
              <input className="cvb-input" type="month" value={exp.endDate} onChange={e=>update(exp.id,{endDate:e.target.value})} disabled={exp.current} />
            </div>
          </div>
          <div className="cvb-check-row">
            <input
              className="cvb-check" type="checkbox" id={`cur-${exp.id}`}
              checked={exp.current} onChange={e=>update(exp.id,{current:e.target.checked,endDate:""})}
            />
            <label className="cvb-check-label" htmlFor={`cur-${exp.id}`}>I currently work here</label>
          </div>
          <div className="cvb-field">
            <label className="cvb-label">Key achievements / responsibilities</label>
            {exp.bullets.map((b, i) => (
              <div className="cvb-bullet-row" key={i}>
                <span style={{paddingTop:9,color:"#aaa",fontSize:16}}>•</span>
                <input
                  className="cvb-input cvb-bullet-input" value={b}
                  onChange={e=>setBullet(exp.id,i,e.target.value)}
                  placeholder="Describe a key achievement or responsibility…"
                />
                {exp.bullets.length > 1 && (
                  <button className="cvb-bullet-del" onClick={()=>removeBullet(exp.id,i)}>×</button>
                )}
              </div>
            ))}
            <button className="cvb-btn-add" style={{marginTop:4}} onClick={()=>addBullet(exp.id)}>
              + Add bullet point
            </button>
          </div>
        </div>
      ))}
      <button className="cvb-btn-add" onClick={add}>+ Add work experience</button>
    </>
  );
}

function StepEducation({ data, onChange }) {
  const add = () => onChange([...data, EMPTY_EDU()]);
  const remove = (id) => onChange(data.filter(e => e.id !== id));
  const update = (id, patch) => onChange(data.map(e => e.id === id ? { ...e, ...patch } : e));

  return (
    <>
      {data.map((edu) => (
        <div className="cvb-card" key={edu.id}>
          <div className="cvb-card-header">
            <span className="cvb-card-title">{edu.school || "New education"}</span>
            <button className="cvb-card-del" onClick={() => remove(edu.id)}>×</button>
          </div>
          <div className="cvb-field">
            <label className="cvb-label">School / university</label>
            <input className="cvb-input" value={edu.school} onChange={e=>update(edu.id,{school:e.target.value})} placeholder="University of Oslo" />
          </div>
          <div className="cvb-row">
            <div className="cvb-field">
              <label className="cvb-label">Degree</label>
              <input className="cvb-input" value={edu.degree} onChange={e=>update(edu.id,{degree:e.target.value})} placeholder="MSc" />
            </div>
            <div className="cvb-field">
              <label className="cvb-label">Field of study</label>
              <input className="cvb-input" value={edu.field} onChange={e=>update(edu.id,{field:e.target.value})} placeholder="Computer Science" />
            </div>
          </div>
          <div className="cvb-row">
            <div className="cvb-field">
              <label className="cvb-label">Start year</label>
              <input className="cvb-input" type="month" value={edu.startDate} onChange={e=>update(edu.id,{startDate:e.target.value})} />
            </div>
            <div className="cvb-field">
              <label className="cvb-label">End year</label>
              <input className="cvb-input" type="month" value={edu.endDate} onChange={e=>update(edu.id,{endDate:e.target.value})} />
            </div>
          </div>
          <div className="cvb-field">
            <label className="cvb-label">Grade / GPA <span style={{color:"#bbb",fontSize:11}}>(optional)</span></label>
            <input className="cvb-input" value={edu.grade} onChange={e=>update(edu.id,{grade:e.target.value})} placeholder="3.8 / 4.0 or A" />
          </div>
        </div>
      ))}
      <button className="cvb-btn-add" onClick={add}>+ Add education</button>
    </>
  );
}

function StepSkills({ data, onChange }) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !data.includes(trimmed)) onChange([...data, trimmed]);
    setInput("");
  };
  const remove = (s) => onChange(data.filter(x => x !== s));
  const onKey = (e) => { if (e.key === "Enter") { e.preventDefault(); add(); } };

  return (
    <>
      <div className="cvb-tags">
        {data.map(s => (
          <div className="cvb-tag" key={s}>
            {s}
            <button className="cvb-tag-x" onClick={() => remove(s)}>×</button>
          </div>
        ))}
        {data.length === 0 && <span style={{fontSize:13,color:"#bbb"}}>No skills added yet</span>}
      </div>
      <div className="cvb-tag-input-row">
        <input
          className="cvb-input" value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={onKey} placeholder="e.g. Figma, React, Python…"
        />
        <button className="cvb-btn-sm" onClick={add}>Add</button>
      </div>
      <div style={{fontSize:12,color:"#aaa",marginTop:8}}>Press Enter or click Add to add a skill</div>
    </>
  );
}

function StepLanguages({ data, onChange }) {
  const add = () => onChange([...data, EMPTY_LANG()]);
  const remove = (id) => onChange(data.filter(l => l.id !== id));
  const update = (id, patch) => onChange(data.map(l => l.id === id ? { ...l, ...patch } : l));

  return (
    <>
      {data.map(lang => (
        <div className="cvb-card" key={lang.id}>
          <div className="cvb-card-header">
            <span className="cvb-card-title">{lang.language || "New language"}</span>
            <button className="cvb-card-del" onClick={() => remove(lang.id)}>×</button>
          </div>
          <div className="cvb-row">
            <div className="cvb-field">
              <label className="cvb-label">Language</label>
              <input className="cvb-input" value={lang.language} onChange={e=>update(lang.id,{language:e.target.value})} placeholder="Norwegian" />
            </div>
            <div className="cvb-field">
              <label className="cvb-label">Level</label>
              <select className="cvb-select" value={lang.level} onChange={e=>update(lang.id,{level:e.target.value})}>
                {LANG_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
      <button className="cvb-btn-add" onClick={add}>+ Add language</button>
    </>
  );
}

function StepCertifications({ data, onChange }) {
  const add = () => onChange([...data, EMPTY_CERT()]);
  const remove = (id) => onChange(data.filter(c => c.id !== id));
  const update = (id, patch) => onChange(data.map(c => c.id === id ? { ...c, ...patch } : c));

  return (
    <>
      {data.map(cert => (
        <div className="cvb-card" key={cert.id}>
          <div className="cvb-card-header">
            <span className="cvb-card-title">{cert.name || "New certification"}</span>
            <button className="cvb-card-del" onClick={() => remove(cert.id)}>×</button>
          </div>
          <div className="cvb-field">
            <label className="cvb-label">Certification name</label>
            <input className="cvb-input" value={cert.name} onChange={e=>update(cert.id,{name:e.target.value})} placeholder="AWS Certified Solutions Architect" />
          </div>
          <div className="cvb-row">
            <div className="cvb-field">
              <label className="cvb-label">Issuing organization</label>
              <input className="cvb-input" value={cert.issuer} onChange={e=>update(cert.id,{issuer:e.target.value})} placeholder="Amazon Web Services" />
            </div>
            <div className="cvb-field">
              <label className="cvb-label">Date</label>
              <input className="cvb-input" type="month" value={cert.date} onChange={e=>update(cert.id,{date:e.target.value})} />
            </div>
          </div>
          <div className="cvb-field">
            <label className="cvb-label">Credential URL <span style={{color:"#bbb",fontSize:11}}>(optional)</span></label>
            <input className="cvb-input" value={cert.url} onChange={e=>update(cert.id,{url:e.target.value})} placeholder="https://..." />
          </div>
        </div>
      ))}
      <button className="cvb-btn-add" onClick={add}>+ Add certification</button>
    </>
  );
}

function StepProjects({ data, onChange }) {
  const add = () => onChange([...data, EMPTY_PROJECT()]);
  const remove = (id) => onChange(data.filter(p => p.id !== id));
  const update = (id, patch) => onChange(data.map(p => p.id === id ? { ...p, ...patch } : p));

  return (
    <>
      {data.map(proj => (
        <div className="cvb-card" key={proj.id}>
          <div className="cvb-card-header">
            <span className="cvb-card-title">{proj.title || "New project"}</span>
            <button className="cvb-card-del" onClick={() => remove(proj.id)}>×</button>
          </div>
          <div className="cvb-field">
            <label className="cvb-label">Project title</label>
            <input className="cvb-input" value={proj.title} onChange={e=>update(proj.id,{title:e.target.value})} placeholder="Job Tracker App" />
          </div>
          <div className="cvb-field">
            <label className="cvb-label">Description</label>
            <textarea className="cvb-textarea" style={{minHeight:80}} value={proj.description} onChange={e=>update(proj.id,{description:e.target.value})} placeholder="Briefly describe the project, your role, and the impact…" />
          </div>
          <div className="cvb-field">
            <label className="cvb-label">Tech stack</label>
            <input className="cvb-input" value={proj.stack} onChange={e=>update(proj.id,{stack:e.target.value})} placeholder="React, Node.js, PostgreSQL" />
          </div>
          <div className="cvb-field">
            <label className="cvb-label">Link <span style={{color:"#bbb",fontSize:11}}>(optional)</span></label>
            <input className="cvb-input" value={proj.url} onChange={e=>update(proj.id,{url:e.target.value})} placeholder="github.com/…" />
          </div>
        </div>
      ))}
      <button className="cvb-btn-add" onClick={add}>+ Add project</button>
    </>
  );
}

function StepFinish({ cv }) {
  const handlePrint = () => window.print();

  return (
    <div className="cvb-finish">
      <div className="cvb-finish-icon">🎉</div>
      <h2 className="cvb-finish-title">Your CV is ready!</h2>
      <p className="cvb-finish-sub">
        Your information has been saved automatically.<br />
        Use the live preview on the right to check everything looks great.
      </p>
      <div className="cvb-saved-badge">
        <span>✓</span> Saved to this device
      </div>
      <div className="cvb-finish-actions">
        <button className="cvb-btn-primary" onClick={handlePrint}>
          🖨️ Print / Save as PDF
        </button>
        <button
          className="cvb-btn-secondary"
          onClick={() => {
            const text = [
              `${cv.personal.firstName} ${cv.personal.lastName}`,
              cv.personal.jobTitle,
              cv.personal.email,
              cv.personal.phone,
              cv.personal.location,
              "",
              cv.summary.text,
              "",
              "EXPERIENCE",
              ...cv.experience.map(e =>
                `${e.title} at ${e.company} (${formatDate(e.startDate)} – ${e.current ? "Present" : formatDate(e.endDate)})\n` +
                e.bullets.filter(Boolean).map(b => `• ${b}`).join("\n")
              ),
              "",
              "EDUCATION",
              ...cv.education.map(e => `${e.degree} ${e.field} – ${e.school}`),
              "",
              "SKILLS",
              cv.skills.join(", "),
            ].join("\n");
            navigator.clipboard.writeText(text).catch(()=>{});
          }}
        >
          📋 Copy as plain text
        </button>
      </div>
    </div>
  );
}

// ─── Live CV preview ──────────────────────────────────────────────────────────
function CvPreview({ cv }) {
  const { personal: p, summary, experience, education, skills, languages, certifications, projects } = cv;
  const fullName = [p.firstName, p.lastName].filter(Boolean).join(" ") || "Your Name";
  const hasContact = p.email || p.phone || p.location || p.linkedin || p.website;

  return (
    <div className="cvb-doc">
      <div className="cvb-doc-name">{fullName}</div>
      {p.jobTitle && <div className="cvb-doc-title">{p.jobTitle}</div>}

      {hasContact && (
        <div className="cvb-doc-contact">
          {p.email    && <span>✉ {p.email}</span>}
          {p.phone    && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}
          {p.website  && <span>🌐 {p.website}</span>}
        </div>
      )}

      {summary.text && (
        <div className="cvb-doc-section">
          <div className="cvb-doc-section-title">Professional Summary</div>
          <div className="cvb-doc-summary">{summary.text}</div>
        </div>
      )}

      {experience.length > 0 && (
        <div className="cvb-doc-section">
          <div className="cvb-doc-section-title">Work Experience</div>
          {experience.map(exp => (
            <div className="cvb-doc-entry" key={exp.id}>
              <div className="cvb-doc-entry-header">
                <span className="cvb-doc-entry-title">{exp.title || "Job title"}{exp.company ? ` · ${exp.company}` : ""}</span>
                <span className="cvb-doc-entry-date">
                  {formatDate(exp.startDate)}{exp.startDate ? " – " : ""}{exp.current ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="cvb-doc-bullets">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="cvb-doc-section">
          <div className="cvb-doc-section-title">Education</div>
          {education.map(edu => (
            <div className="cvb-doc-entry" key={edu.id}>
              <div className="cvb-doc-entry-header">
                <span className="cvb-doc-entry-title">{[edu.degree, edu.field].filter(Boolean).join(" in ") || "Degree"}</span>
                <span className="cvb-doc-entry-date">
                  {formatDate(edu.startDate)}{edu.startDate && edu.endDate ? " – " : ""}{formatDate(edu.endDate)}
                </span>
              </div>
              <div className="cvb-doc-entry-sub">
                {edu.school}{edu.grade ? ` · ${edu.grade}` : ""}
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="cvb-doc-section">
          <div className="cvb-doc-section-title">Skills</div>
          <div className="cvb-doc-skills">
            {skills.map(s => <span className="cvb-doc-skill-tag" key={s}>{s}</span>)}
          </div>
        </div>
      )}

      {languages.length > 0 && (
        <div className="cvb-doc-section">
          <div className="cvb-doc-section-title">Languages</div>
          {languages.map(l => (
            <div className="cvb-doc-lang-row" key={l.id}>
              <span>{l.language || "Language"}</span>
              <span className="cvb-doc-lang-level">{l.level}</span>
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div className="cvb-doc-section">
          <div className="cvb-doc-section-title">Certifications</div>
          {certifications.map(c => (
            <div className="cvb-doc-entry" key={c.id}>
              <div className="cvb-doc-entry-header">
                <span className="cvb-doc-entry-title">{c.name || "Certification"}</span>
                <span className="cvb-doc-entry-date">{formatDate(c.date)}</span>
              </div>
              {c.issuer && <div className="cvb-doc-entry-sub">{c.issuer}</div>}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="cvb-doc-section">
          <div className="cvb-doc-section-title">Projects</div>
          {projects.map(proj => (
            <div className="cvb-doc-entry" key={proj.id}>
              <div className="cvb-doc-entry-header">
                <span className="cvb-doc-entry-title">{proj.title || "Project"}</span>
                {proj.url && <span className="cvb-doc-entry-date" style={{color:"#c8a96e"}}>{proj.url}</span>}
              </div>
              {proj.description && <div className="cvb-doc-entry-sub" style={{marginTop:3}}>{proj.description}</div>}
              {proj.stack && <div className="cvb-doc-entry-sub" style={{marginTop:2,color:"#aaa"}}>Stack: {proj.stack}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CvBuilder() {
  const [step, setStep] = useState(0);
  const [cv, setCv] = useState(() => {
    try {
      const saved = localStorage.getItem("jobtracker_cv");
      return saved ? JSON.parse(saved) : EMPTY_CV;
    } catch {
      return EMPTY_CV;
    }
  });

  // Auto-save on every change
  useEffect(() => {
    try { localStorage.setItem("jobtracker_cv", JSON.stringify(cv)); } catch {}
  }, [cv]);

  const updateSection = useCallback((section) => (value) => {
    setCv((prev) => ({ ...prev, [section]: value }));
  }, []);

  const STEP_CONTENT = [
    { title: "Personal details",    sub: "Let's start with the basics — who you are and how to reach you.",      node: <StepPersonal data={cv.personal} onChange={updateSection("personal")} /> },
    { title: "Professional summary", sub: "A short paragraph that introduces you and sets the tone.",             node: <StepSummary data={cv.summary} onChange={updateSection("summary")} /> },
    { title: "Work experience",      sub: "Add your jobs, most recent first. Use bullet points to describe achievements.", node: <StepExperience data={cv.experience} onChange={updateSection("experience")} /> },
    { title: "Education",            sub: "Add your degrees and qualifications.",                                   node: <StepEducation data={cv.education} onChange={updateSection("education")} /> },
    { title: "Skills",               sub: "Add technical skills, tools, and competencies as tags.",                node: <StepSkills data={cv.skills} onChange={updateSection("skills")} /> },
    { title: "Languages",            sub: "Which languages do you speak, and at what level?",                     node: <StepLanguages data={cv.languages} onChange={updateSection("languages")} /> },
    { title: "Certifications",       sub: "Courses, licences, or professional certificates.",                      node: <StepCertifications data={cv.certifications} onChange={updateSection("certifications")} /> },
    { title: "Projects",             sub: "Side projects, open source work, or portfolio pieces.",                 node: <StepProjects data={cv.projects} onChange={updateSection("projects")} /> },
    { title: "All done!",            sub: "",                                                                       node: <StepFinish cv={cv} /> },
  ];

  const current = STEP_CONTENT[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <>
      <style>{CSS}</style>
      <div className="cvb-root">
        {/* ── Top step nav ── */}
        <nav className="cvb-nav" role="navigation" aria-label="CV builder steps">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              className={`cvb-nav-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
              onClick={() => setStep(i)}
              aria-current={i === step ? "step" : undefined}
            >
              <span className="cvb-nav-num">{i < step ? "✓" : i + 1}</span>
              <span className="cvb-nav-icon">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Body ── */}
        <div className="cvb-body">
          {/* Form panel */}
          <section className="cvb-form-panel" aria-label="CV form">
            <h1 className="cvb-step-title">{current.title}</h1>
            {current.sub && <p className="cvb-step-sub">{current.sub}</p>}

            {current.node}

            {/* Prev / Next */}
            <div className="cvb-nav-btns">
              <button
                className="cvb-btn-prev"
                onClick={() => setStep(s => Math.max(0, s - 1))}
                style={{ visibility: isFirst ? "hidden" : "visible" }}
              >
                ← Back
              </button>
              {!isLast && (
                <button
                  className="cvb-btn-next"
                  onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                >
                  {step === STEPS.length - 2 ? "Finish →" : "Continue →"}
                </button>
              )}
            </div>
          </section>

          {/* Preview panel */}
          <aside className="cvb-preview-panel" aria-label="CV preview">
            <div className="cvb-preview-label">Live preview</div>
            <CvPreview cv={cv} />
          </aside>
        </div>
      </div>
    </>
  );
}
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const S = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8f8fc",
  },

  sidebar: {
    width: "228px",
    flexShrink: 0,
    background: "#fff",
    borderRight: "1px solid #ececf4",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "18px 16px",
  },

  logoLink: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    textDecoration: "none",
  },

  logoText: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1a1a2e",
    letterSpacing: "-0.2px",
    fontFamily: "'DM Sans', sans-serif",
  },

  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },

  container: {
    width: "100%",
    maxWidth: "360px",
  },

  heading: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 6px",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "-0.5px",
  },

  subheading: {
    fontSize: "15px",
    color: "#9090aa",
    margin: "0 0 28px",
    fontFamily: "'DM Sans', sans-serif",
  },

  btnMethod: {
    width: "100%",
    height: "46px",
    background: "#fff",
    border: "1.5px solid #e2e2f0",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1a1a2e",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "10px",
  },

  fieldWrap: {
    marginBottom: "14px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#4a4a6a",
    marginBottom: "6px",
    fontFamily: "'DM Sans', sans-serif",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    height: "46px",
    border: "1.5px solid #e2e2f0",
    borderRadius: "10px",
    padding: "0 14px",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1a1a2e",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.15s",
  },

  passwordHint: {
    fontSize: "12px",
    color: "#9090aa",
    marginTop: "5px",
    fontFamily: "'DM Sans', sans-serif",
  },

  passwordHintBold: {
    fontWeight: "600",
    color: "#4a4a6a",
  },

  btnPrimary: {
    width: "100%",
    height: "46px",
    background: "#5b4df0",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    marginTop: "6px",
    letterSpacing: "0.1px",
  },

  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    color: "#9090aa",
    fontFamily: "'DM Sans', sans-serif",
    padding: "0",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  footer: {
    marginTop: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  footerRow: {
    fontSize: "13px",
    color: "#9090aa",
    fontFamily: "'DM Sans', sans-serif",
    margin: 0,
  },

  footerLink: {
    color: "#5b4df0",
    textDecoration: "none",
    fontWeight: "500",
  },

  footerMuted: {
    fontSize: "12px",
    color: "#b0b0c8",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: "6px",
    lineHeight: "1.5",
  },

  footerBold: {
    fontWeight: "600",
    color: "#9090aa",
  },
};

/* ─── Icons ──────────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="#4a4a6a" strokeWidth="1.8" />
      <path d="M2 8l10 6 10-6" stroke="#4a4a6a" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="34" height="34" rx="8" fill="#5b4df0" />
      <path d="M10 22V13l7-4 7 4v9l-7 4-7-4z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      <circle cx="17" cy="17" r="2.5" fill="#fff" />
    </svg>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */
function Signup({ setUser }) {
  // "method" = initial screen, "email" = email form screen
  const [step, setStep]         = useState("method");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [inputFocus, setInputFocus] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const focusStyle = (field) =>
    inputFocus === field ? { borderColor: "#5b4df0" } : {};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Register
    await axios.post(
      `${API}/register`,
      {
        name,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    // Auto login
    await axios.post(
      `${API}/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    // Get logged in user
    const me = await axios.get(`${API}/auth/me`, {
      withCredentials: true,
    });

    localStorage.removeItem("jobtracker_onboarded");
    localStorage.setItem("user", JSON.stringify(me.data));
    setUser(me.data);

    navigate("/onboarding");
  } catch (err) {
    console.error(err);

    if (err.response?.data) {
      alert(
        typeof err.response.data === "string"
          ? err.response.data
          : "Registration failed."
      );
    } else {
      alert("Something went wrong.");
    }
  } finally {
    setLoading(false);
  }
};

  const handleGoogle = () => {
  window.location.href = `${API}/auth/google`;
};

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={S.page}>
        {/* ── Sidebar ── */}
        <aside style={S.sidebar}>
          <Link to="/" style={S.logoLink}>
            <LogoMark />
            <span style={S.logoText}>JobTracker</span>
          </Link>
        </aside>

        {/* ── Main ── */}
        <main style={S.main}>
          <div style={S.container}>

            {/* ── Step 1: choose method ── */}
            {step === "method" && (
              <>
                <h1 style={S.heading}>Sign Up for Free</h1>
                <p style={S.subheading}>Take control of your job search</p>

                {/* Continue with Email */}
                <button
                  onClick={() => setStep("email")}
                  style={{
                    ...S.btnMethod,
                    background: hoveredBtn === "email-btn" ? "#f5f5fc" : "#fff",
                    borderColor: hoveredBtn === "email-btn" ? "#c8c8e8" : "#e2e2f0",
                  }}
                  onMouseEnter={() => setHoveredBtn("email-btn")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <EmailIcon />
                  Continue with Email
                </button>

                {/* Continue with Google */}
                <button
                  onClick={handleGoogle}
                  style={{
                    ...S.btnMethod,
                    background: hoveredBtn === "google" ? "#f5f5fc" : "#fff",
                    borderColor: hoveredBtn === "google" ? "#c8c8e8" : "#e2e2f0",
                  }}
                  onMouseEnter={() => setHoveredBtn("google")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <div style={S.footer}>
                  <p style={S.footerRow}>
                    Already have an account?{" "}
                    <Link to="/login" style={S.footerLink}>Log in</Link>
                  </p>
                  <p style={S.footerMuted}>
                    By continuing, you agree to JobTracker's{" "}
                    <span style={S.footerBold}>Terms of Service</span>{" "}
                    and <span style={S.footerBold}>Privacy Policy</span>
                  </p>
                </div>
              </>
            )}

            {/* ── Step 2: email form ── */}
            {step === "email" && (
              <>
                {/* Back button */}
                <button
                  onClick={() => setStep("method")}
                  style={S.backBtn}
                >
                  ← Back
                </button>

                <h1 style={S.heading}>Sign Up for Free</h1>
                <p style={S.subheading}>Take control of your job search</p>

                {/* Name */}
                <div style={S.fieldWrap}>
                  <label style={S.label}>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    style={{ ...S.input, ...focusStyle("name") }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setInputFocus("name")}
                    onBlur={() => setInputFocus(null)}
                    autoComplete="name"
                    required
                  />
                </div>

                {/* Email */}
                <div style={S.fieldWrap}>
                  <label style={S.label}>Email</label>
                  <input
                    type="email"
                    placeholder="Your email"
                    style={{ ...S.input, ...focusStyle("email") }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setInputFocus("email")}
                    onBlur={() => setInputFocus(null)}
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Password */}
                <div style={S.fieldWrap}>
                  <label style={S.label}>Password</label>
                  <input
                    type="password"
                    placeholder="Your password"
                    style={{ ...S.input, ...focusStyle("password") }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setInputFocus("password")}
                    onBlur={() => setInputFocus(null)}
                    autoComplete="new-password"
                    required
                  />
                  <p style={S.passwordHint}>
                    <span style={S.passwordHintBold}>* At least:</span>{" "}
                    8 characters, 1 number, 1 upper, 1 lower
                  </p>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    ...S.btnPrimary,
                    background: hoveredBtn === "create" ? "#4a3de0" : "#5b4df0",
                    opacity: loading ? 0.75 : 1,
                  }}
                  onMouseEnter={() => setHoveredBtn("create")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  {loading ? "Creating account…" : "Create Account"}
                </button>

                <div style={S.footer}>
                  <p style={S.footerRow}>
                    Already have an account?{" "}
                    <Link to="/login" style={S.footerLink}>Log in</Link>
                  </p>
                  <p style={S.footerMuted}>
                    By continuing, you agree to JobTracker's{" "}
                    <span style={S.footerBold}>Terms of Service</span>{" "}
                    and <span style={S.footerBold}>Privacy Policy</span>
                  </p>
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </>
  );
}

export default Signup;
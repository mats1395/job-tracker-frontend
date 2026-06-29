import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, BarChart2, User, LogOut, Menu, X, Briefcase, Tag, FileText, ScanLine  } from "lucide-react";

const styles = `
  .app-navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid #e2e8f0;
    font-family: 'Geist', system-ui, sans-serif;
  }

  .app-navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .app-navbar-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .app-navbar-logo-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: #4f46e5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    color: white;
  }

  .app-navbar-logo-text {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.3px;
  }

  .app-navbar-links {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    justify-content: center;
  }

  .app-nav-link {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
  }

  .app-nav-link:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  .app-nav-link.active {
    background: #eef2ff;
    color: #4f46e5;
    font-weight: 600;
  }

  .app-navbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .app-avatar-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 5px 12px 5px 6px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }

  .app-avatar-btn:hover {
    background: #f8fafc;
    border-color: #c7d2fe;
  }

  .app-avatar {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: #4f46e5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: white;
  }

  .app-avatar-name {
    font-size: 13px;
    font-weight: 500;
    color: #0f172a;
  }

  /* Dropdown */
  .app-dropdown-wrapper {
    position: relative;
  }

  .app-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 6px;
    min-width: 180px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    z-index: 200;
  }

  .app-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    text-decoration: none;
    border: none;
    background: none;
    width: 100%;
    transition: background 0.15s;
  }

  .app-dropdown-item:hover {
    background: #f8fafc;
  }

  .app-dropdown-item.danger {
    color: #ef4444;
  }

  .app-dropdown-item.danger:hover {
    background: #fef2f2;
  }

  .app-dropdown-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 4px 0;
  }

  /* Mobile */
  .app-hamburger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    color: #0f172a;
    border-radius: 8px;
  }

  .app-mobile-menu {
    border-top: 1px solid #e2e8f0;
    padding: 10px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: white;
  }

  .app-mobile-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    text-decoration: none;
    transition: background 0.15s;
  }

  .app-mobile-link:hover, .app-mobile-link.active {
    background: #eef2ff;
    color: #4f46e5;
  }

  .app-mobile-divider {
    height: 1px;
    background: #f1f5f9;
    margin: 6px 0;
  }

  @media (max-width: 640px) {
    .app-navbar-links { display: none; }
    .app-navbar-right-links { display: none; }
    .app-hamburger { display: flex; }
  }
`;

export default function Navbar() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const navLinks = [
  { to: "/home",        label: "Dashboard", icon: LayoutGrid },
  { to: "/home/stats",  label: "Stats",     icon: BarChart2  },
  { to: "/home/profile",     label: "Profile",   icon: User       },
  { to: "/home/pricing",     label: "Pricing",   icon: Tag       },
  { to: "/home/cvbuilder",     label: "Cvbuilder",   icon: FileText },
  { to: "/home/cvscanner",     label: "Cvscanner",   icon: ScanLine       },
];

  return (
    <>
      <style>{styles}</style>
      <nav className="app-navbar">
        <div className="app-navbar-inner">

          {/* Logo */}
          <Link to="/home" className="app-navbar-logo">
            <div className="app-navbar-logo-icon">JT</div>
            <span className="app-navbar-logo-text">JobTrack</span>
          </Link>

          {/* Desktop nav links */}
          <div className="app-navbar-links">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`app-nav-link ${isActive(to) ? "active" : ""}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="app-navbar-right">

            {/* Avatar dropdown */}
            <div className="app-dropdown-wrapper">
              <button
                className="app-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="app-avatar">U</div>
                <span className="app-avatar-name">Account</span>
              </button>

              {dropdownOpen && (
                <div className="app-dropdown">
                  <Link
                    to="/home/profile"
                    className="app-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={15} />
                    Profile
                  </Link>
                  <div className="app-dropdown-divider" />
                  <button
                    className="app-dropdown-item danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    Log out
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="app-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="app-mobile-menu">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`app-mobile-link ${isActive(to) ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <div className="app-mobile-divider" />
            <Link
              to="/home/profile"
              className="app-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              <User size={16} />
              Profile
            </Link>
            <button
              className="app-mobile-link"
              style={{ border: "none", cursor: "pointer", color: "#ef4444", width: "100%", textAlign: "left" }}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
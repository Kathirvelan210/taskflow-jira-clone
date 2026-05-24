import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Topbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="tf-topbar">
      {/* Search */}
      <div className="flex-1 max-w-xs">
        <div className="relative">
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--tf-text-3)" }}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search anything..."
            readOnly
            className="tf-input"
            style={{ paddingLeft: 36, height: 34, borderRadius: 8, fontSize: "0.8125rem", cursor: "default" }}
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <button className="tf-icon-btn" title="Notifications">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path strokeLinecap="round" d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>

        {/* Dark mode toggle */}
        <button onClick={toggle} className="tf-icon-btn" title={dark ? "Switch to light mode" : "Switch to dark mode"}>
          {dark ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>

        {/* Avatar + dropdown */}
        <div className="relative ml-1" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="tf-avatar w-8 h-8 text-sm transition-all"
            style={{ boxShadow: open ? "0 0 0 2px #6366f1, 0 0 0 4px rgba(99,102,241,0.2)" : "none" }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </button>

          {open && (
            <div
              className="absolute right-0 top-11 w-56 rounded-xl overflow-hidden z-50"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--tf-border)",
                boxShadow: "var(--tf-shadow-lg)",
                animation: "tf-slideup 0.15s ease",
              }}
            >
              {/* User info */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--tf-border)" }}>
                <div className="flex items-center gap-3">
                  <div className="tf-avatar w-9 h-9 text-sm shrink-0">{user?.name?.[0]?.toUpperCase()}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--tf-text)" }}>{user?.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--tf-text-3)" }}>{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "var(--tf-text-2)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile settings
                </Link>
                <button
                  onClick={toggle}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "var(--tf-text-2)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-elevated)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {dark ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="5" /><path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                  )}
                  {dark ? "Light mode" : "Dark mode"}
                </button>
              </div>

              <div className="py-1" style={{ borderTop: "1px solid var(--tf-border)" }}>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition-colors"
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;

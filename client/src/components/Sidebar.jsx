import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: "/projects",
    label: "Projects",
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 7a2 2 0 012-2h3.172a2 2 0 011.414.586l1.828 1.828A2 2 0 0012.828 8H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      </svg>
    ),
  },
];

const Sidebar = ({ projects = [] }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { id: activeId } = useParams();

  return (
    <aside className="tf-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}
        >
          <span className="text-white font-black text-sm">TF</span>
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">TaskFlow</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#5a6490" }}>Project Management</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          style={{ margin: 0, width: "100%" }}
        >
          <div className="tf-avatar w-7 h-7 text-xs shrink-0">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: "rgba(255,255,255,0.85)" }}>{user?.name}</p>
            <p className="text-[10px] truncate" style={{ color: "#5a6490" }}>{user?.email}</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <p className="tf-label px-5 py-2" style={{ color: "#404870" }}>Menu</p>

        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}

        {projects.length > 0 && (
          <>
            <p className="tf-label px-5 pt-5 pb-2" style={{ color: "#404870" }}>Your Projects</p>
            {projects.map((p) => (
              <NavLink
                key={p._id}
                to={`/projects/${p._id}`}
                className={`sidebar-link${activeId === p._id ? " active" : ""}`}
              >
                <div
                  className="w-5 h-5 rounded-md text-white text-[10px] flex items-center justify-center font-bold shrink-0"
                  style={{ backgroundColor: p.color || "#6366f1" }}
                >
                  {p.name[0].toUpperCase()}
                </div>
                <span className="truncate">{p.name}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Bottom: Logout */}
      <div className="px-3 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="sidebar-link danger"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import StatsCard from "../components/StatsCard";
import Loader from "../components/Loader";
import { projectAPI, taskAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const formatDate = () => new Date().toLocaleDateString("en-US", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

const ProgressRow = ({ label, value, total, color }) => {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span style={{ color: "var(--tf-text-2)" }}>{label}</span>
        <span className="font-semibold" style={{ color: "var(--tf-text)" }}>{value}<span style={{ color: "var(--tf-text-3)" }}> / {total}</span></span>
      </div>
      <div className="tf-progress h-1.5">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projs } = await projectAPI.getAll();
        setProjects(projs);
        const results = await Promise.all(projs.map((p) => taskAPI.getByProject(p._id)));
        setAllTasks(results.flatMap((r) => r.data));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total      = allTasks.length;
  const done       = allTasks.filter((t) => t.status === "Done").length;
  const inProgress = allTasks.filter((t) => t.status === "In Progress").length;
  const review     = allTasks.filter((t) => t.status === "Review").length;
  const todo       = allTasks.filter((t) => t.status === "Todo").length;
  const completion = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <MainLayout>
      {loading ? <Loader /> : (
        <div className="p-6 space-y-6 max-w-7xl">

          {/* Page header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold leading-snug" style={{ color: "var(--tf-text)" }}>
                {getGreeting()}, {user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--tf-text-2)" }}>{formatDate()}</p>
            </div>
            <Link to="/projects" className="tf-btn tf-btn-primary tf-btn-sm shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </Link>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Projects"     value={projects.length} icon="📁" gradient="indigo"  />
            <StatsCard label="Total Issues" value={total}           icon="📋" gradient="violet"  />
            <StatsCard label="Completed"    value={done}            icon="✅" gradient="emerald" />
            <StatsCard label="In Progress"  value={inProgress}      icon="⚡" gradient="amber"   />
          </div>

          {/* Analytics row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Issue status */}
            <div className="tf-card p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>Issue Status</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                  {total} total
                </span>
              </div>
              <div className="space-y-4">
                <ProgressRow label="Done"        value={done}       total={total} color="bg-emerald-500" />
                <ProgressRow label="In Progress" value={inProgress} total={total} color="bg-indigo-500"  />
                <ProgressRow label="Review"      value={review}     total={total} color="bg-violet-500"  />
                <ProgressRow label="Todo"        value={todo}       total={total} color="bg-slate-400"   />
              </div>
            </div>

            {/* Priority & completion */}
            <div className="tf-card p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>Priority Breakdown</h3>
                <span className="text-xs" style={{ color: "var(--tf-text-3)" }}>All projects</span>
              </div>
              <div className="space-y-4">
                <ProgressRow label="High"   value={allTasks.filter(t => t.priority === "High").length}   total={total} color="bg-red-500"     />
                <ProgressRow label="Medium" value={allTasks.filter(t => t.priority === "Medium").length} total={total} color="bg-amber-400"   />
                <ProgressRow label="Low"    value={allTasks.filter(t => t.priority === "Low").length}    total={total} color="bg-emerald-500" />
              </div>
              <div className="mt-5 pt-4 flex items-end gap-2" style={{ borderTop: "1px solid var(--tf-border)" }}>
                <div>
                  <p className="text-4xl font-bold leading-none" style={{ color: "var(--tf-text)" }}>{completion}%</p>
                  <p className="text-xs mt-1" style={{ color: "var(--tf-text-2)" }}>overall completion</p>
                </div>
                <div className="flex-1 mb-1">
                  <div className="tf-progress h-2 rounded-full">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                      style={{ width: `${completion}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent projects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>Recent Projects</h3>
              <Link to="/projects" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                View all →
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="tf-card p-12 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
                  style={{ background: "var(--bg-elevated)" }}>
                  📁
                </div>
                <p className="font-medium mb-1" style={{ color: "var(--tf-text)" }}>No projects yet</p>
                <p className="text-sm mb-4" style={{ color: "var(--tf-text-2)" }}>Create your first project to get started</p>
                <Link to="/projects" className="tf-btn tf-btn-primary tf-btn-sm">
                  Create project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {projects.slice(0, 6).map((p) => {
                  const pt  = allTasks.filter((t) => t.project === p._id || t.project?._id === p._id);
                  const pd  = pt.filter((t) => t.status === "Done").length;
                  const pct = pt.length === 0 ? 0 : Math.round((pd / pt.length) * 100);
                  return (
                    <Link
                      key={p._id}
                      to={`/projects/${p._id}`}
                      className="tf-card p-4 block group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                      style={{ overflow: "visible" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-9 h-9 rounded-xl text-white text-sm font-bold flex items-center justify-center shrink-0"
                          style={{ backgroundColor: p.color || "#6366f1", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}
                        >
                          {p.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate group-hover:text-indigo-500 transition-colors"
                            style={{ color: "var(--tf-text)" }}>
                            {p.name}
                          </p>
                          <p className="text-xs" style={{ color: "var(--tf-text-3)" }}>{pt.length} issue{pt.length !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <div className="tf-progress h-1.5 mb-1.5">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                          style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs" style={{ color: "var(--tf-text-3)" }}>{pct}% complete</p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;

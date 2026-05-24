import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import { projectAPI } from "../services/api";

const PROJECT_TYPES  = ["Software", "Marketing", "Personal"];
const PROJECT_COLORS = ["#6366f1", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6", "#3b82f6"];
const TYPE_ICON      = { Software: "💻", Marketing: "📣", Personal: "👤" };

const ProjectModal = ({ project, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:       project?.name        || "",
    description: project?.description || "",
    type:       project?.type        || "Software",
    color:      project?.color       || "#6366f1",
    visibility: project?.visibility  || "Private",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="tf-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tf-modal max-w-md">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--tf-border)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--tf-text)" }}>
            {project ? "Edit project" : "New project"}
          </h3>
          <button onClick={onClose} className="tf-icon-btn w-8 h-8 rounded-lg text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Color */}
          <div>
            <label className="tf-label">Project color</label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    backgroundColor: c,
                    transform: form.color === c ? "scale(1.25)" : "scale(1)",
                    boxShadow: form.color === c ? `0 0 0 2px var(--bg-surface), 0 0 0 4px ${c}` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="tf-label">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="tf-input"
              placeholder="Project name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="tf-label">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="tf-input"
              placeholder="Add a description…"
            />
          </div>

          {/* Type + Visibility */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="tf-label">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="tf-input">
                {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="tf-label">Visibility</label>
              <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })} className="tf-input">
                <option>Private</option>
                <option>Public</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={onClose} className="tf-btn tf-btn-ghost tf-btn-sm">Cancel</button>
            <button type="submit" disabled={loading} className="tf-btn tf-btn-primary tf-btn-sm">
              {loading ? "Saving…" : project ? "Save changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects]  = useState([]);
  const [loading, setLoading]    = useState(true);
  const [modal, setModal]        = useState(null);
  const [search, setSearch]      = useState("");

  const fetchProjects = async () => {
    const { data } = await projectAPI.getAll();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSave = async (form) => {
    if (modal === "create") await projectAPI.create(form);
    else await projectAPI.update(modal._id, form);
    setModal(null);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    await projectAPI.delete(id);
    fetchProjects();
  };

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <MainLayout>
      {modal && <ProjectModal project={modal === "create" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}

      <div className="p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--tf-text)" }}>Projects</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--tf-text-2)" }}>
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={() => setModal("create")} className="tf-btn tf-btn-primary tf-btn-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New project
          </button>
        </div>

        {/* Search */}
        <div className="mb-5 relative max-w-xs">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--tf-text-3)" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="tf-input"
            style={{ paddingLeft: 36 }}
          />
        </div>

        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="tf-card p-16 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
              style={{ background: "var(--bg-elevated)" }}>
              📁
            </div>
            <p className="font-semibold mb-1" style={{ color: "var(--tf-text)" }}>No projects found</p>
            <p className="text-sm mb-5" style={{ color: "var(--tf-text-2)" }}>
              {search ? `No results for "${search}"` : "Create your first project to get started"}
            </p>
            {!search && (
              <button onClick={() => setModal("create")} className="tf-btn tf-btn-primary tf-btn-sm">
                Create project
              </button>
            )}
          </div>
        ) : (
          <div className="tf-card">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--tf-border)", background: "var(--bg-surface-alt)" }}>
                  {["Name", "Type", "Visibility", "Members", "Created", ""].map((h, i) => (
                    <th
                      key={i}
                      className={`text-left px-4 py-3 tf-label ${i > 1 && i < 4 ? "hidden md:table-cell" : ""} ${i === 3 || i === 4 ? "hidden lg:table-cell" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p._id}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid var(--tf-border)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-surface-alt)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl text-white text-sm font-bold flex items-center justify-center shrink-0"
                          style={{ backgroundColor: p.color || "#6366f1", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
                        >
                          {p.name[0].toUpperCase()}
                        </div>
                        <div>
                          <Link
                            to={`/projects/${p._id}`}
                            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline block"
                          >
                            {p.name}
                          </Link>
                          {p.description && (
                            <p className="text-xs truncate max-w-xs" style={{ color: "var(--tf-text-3)" }}>{p.description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3 hidden md:table-cell" style={{ color: "var(--tf-text-2)" }}>
                      <span className="flex items-center gap-1.5">
                        <span>{TYPE_ICON[p.type]}</span>{p.type}
                      </span>
                    </td>

                    {/* Visibility */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        p.visibility === "Public"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                          : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-700/30 dark:text-slate-400 dark:border-slate-600/30"
                      }`}>
                        {p.visibility}
                      </span>
                    </td>

                    {/* Members */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex -space-x-1.5">
                        {p.members?.slice(0, 4).map((m) => (
                          <div
                            key={m._id}
                            title={m.name}
                            className="tf-avatar w-6 h-6 text-xs border-2"
                            style={{ borderColor: "var(--bg-surface)", fontSize: 10 }}
                          >
                            {m.name[0].toUpperCase()}
                          </div>
                        ))}
                        {p.members?.length > 4 && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2"
                            style={{ background: "var(--bg-elevated)", color: "var(--tf-text-2)", borderColor: "var(--bg-surface)" }}
                          >
                            +{p.members.length - 4}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3 hidden lg:table-cell text-xs" style={{ color: "var(--tf-text-3)" }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          to={`/projects/${p._id}`}
                          className="tf-btn tf-btn-ghost tf-btn-sm text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                        >
                          Board
                        </Link>
                        <button
                          onClick={() => setModal(p)}
                          className="tf-btn tf-btn-ghost tf-btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="tf-btn tf-btn-sm text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Projects;

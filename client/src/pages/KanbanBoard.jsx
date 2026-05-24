import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import Badge from "../components/Badge";
import { taskAPI, projectAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const STATUSES   = ["Todo", "In Progress", "Review", "Done"];
const PRIORITIES = ["Low", "Medium", "High"];

const COL_CONFIG = {
  "Todo":        { accent: "#64748b", headerBg: "rgba(100,116,139,0.08)", dot: "bg-slate-400",   label: "text-slate-500 dark:text-slate-400"   },
  "In Progress": { accent: "#6366f1", headerBg: "rgba(99,102,241,0.08)",  dot: "bg-indigo-500",  label: "text-indigo-600 dark:text-indigo-400"  },
  "Review":      { accent: "#8b5cf6", headerBg: "rgba(139,92,246,0.08)",  dot: "bg-violet-500",  label: "text-violet-600 dark:text-violet-400"  },
  "Done":        { accent: "#10b981", headerBg: "rgba(16,185,129,0.08)",  dot: "bg-emerald-500", label: "text-emerald-600 dark:text-emerald-400" },
};

/* ── Issue Modal ── */
const IssueModal = ({ task, projectId, members, onClose, onSave }) => {
  const [form, setForm] = useState({
    title:      task?.title || "",
    description: task?.description || "",
    status:     task?.status || "Todo",
    priority:   task?.priority || "Medium",
    assignedTo: task?.assignedTo?._id || "",
    dueDate:    task?.dueDate ? task.dueDate.slice(0, 10) : "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...form, project: projectId });
    setLoading(false);
  };

  return (
    <div className="tf-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tf-modal max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--tf-border)" }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="tf-label" style={{ margin: 0 }}>{task ? "Edit Issue" : "Create Issue"}</span>
          </div>
          <button
            onClick={onClose}
            className="tf-icon-btn w-8 h-8 text-lg leading-none rounded-lg"
            style={{ fontSize: 20 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row">
            {/* Main content */}
            <div className="flex-1 px-6 py-5 space-y-4" style={{ borderRight: "1px solid var(--tf-border)" }}>
              <div>
                <label className="tf-label">Summary *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="tf-input"
                  placeholder="Issue summary…"
                />
              </div>
              <div>
                <label className="tf-label">Description</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="tf-input"
                  placeholder="Add a description…"
                />
              </div>
            </div>

            {/* Sidebar fields */}
            <div className="w-full md:w-52 px-5 py-5 space-y-4" style={{ background: "var(--bg-surface-alt)" }}>
              {[
                { label: "Status",   field: "status",   options: STATUSES   },
                { label: "Priority", field: "priority", options: PRIORITIES  },
              ].map(({ label, field, options }) => (
                <div key={field}>
                  <label className="tf-label">{label}</label>
                  <select
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="tf-input"
                  >
                    {options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="tf-label">Assignee</label>
                <select
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  className="tf-input"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="tf-label">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="tf-input"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 justify-end px-6 py-4" style={{ borderTop: "1px solid var(--tf-border)" }}>
            <button type="button" onClick={onClose} className="tf-btn tf-btn-ghost tf-btn-sm">Cancel</button>
            <button type="submit" disabled={loading} className="tf-btn tf-btn-primary tf-btn-sm">
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : task ? "Save changes" : "Create issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Members Panel ── */
const MembersPanel = ({ project, onAddMember, onRemoveMember, currentUserId }) => {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const isOwner = project?.createdBy?._id === currentUserId;

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onAddMember(email);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="tf-section-label">Members</span>
      <div className="flex -space-x-1.5">
        {project?.members?.map((m) => (
          <div key={m._id} className="relative group">
            <div
              title={m.name}
              className="tf-avatar w-7 h-7 text-xs border-2"
              style={{ borderColor: "var(--bg-surface)" }}
            >
              {m.name[0].toUpperCase()}
            </div>
            {isOwner && m._id !== currentUserId && (
              <button
                onClick={() => onRemoveMember(m._id)}
                className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center leading-none"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      {isOwner && (
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Invite by email"
            className="tf-input tf-btn-sm"
            style={{ width: 180, padding: "6px 10px" }}
          />
          <button type="submit" disabled={loading} className="tf-btn tf-btn-primary tf-btn-sm">
            {loading ? "…" : "Invite"}
          </button>
          {error && <span className="text-red-500 dark:text-red-400 text-xs">{error}</span>}
        </form>
      )}
    </div>
  );
};

/* ── Issue Card ── */
const IssueCard = ({ task, onEdit, onDelete, onDragStart }) => (
  <div
    draggable
    onDragStart={() => onDragStart(task)}
    onClick={() => onEdit(task)}
    className="issue-card mb-2 group"
  >
    <p className="text-sm leading-snug mb-2 font-medium" style={{ color: "var(--tf-text)" }}>{task.title}</p>
    {task.description && (
      <p className="text-xs mb-2 line-clamp-1" style={{ color: "var(--tf-text-2)" }}>{task.description}</p>
    )}
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge label={task.priority} type="priority" />
        {task.dueDate && (
          <span className="text-xs" style={{ color: "var(--tf-text-3)" }}>
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {task.assignedTo && (
          <div title={task.assignedTo.name} className="tf-avatar w-6 h-6 text-xs">
            {task.assignedTo.name[0].toUpperCase()}
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
          className="w-6 h-6 rounded flex items-center justify-center text-base leading-none opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          ×
        </button>
      </div>
    </div>
  </div>
);

/* ── Main Board ── */
const KanbanBoard = () => {
  const { id }       = useParams();
  const { user }     = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [dragTask, setDragTask]   = useState(null);
  const [dragOver, setDragOver]   = useState(null);

  const fetchData = async () => {
    const [{ data: proj }, { data: taskData }] = await Promise.all([
      projectAPI.getById(id),
      taskAPI.getByProject(id),
    ]);
    setProject(proj);
    setTasks(taskData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSave = async (form) => {
    if (modal === "create") await taskAPI.create(form);
    else await taskAPI.update(modal._id, form);
    setModal(null);
    fetchData();
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Delete this issue?")) return;
    await taskAPI.delete(taskId);
    fetchData();
  };

  const handleDrop = async (status) => {
    setDragOver(null);
    if (!dragTask || dragTask.status === status) return;
    await taskAPI.update(dragTask._id, { status });
    setDragTask(null);
    fetchData();
  };

  const handleAddMember    = async (email)    => { await projectAPI.addMember(id, email);       fetchData(); };
  const handleRemoveMember = async (memberId) => { await projectAPI.removeMember(id, memberId); fetchData(); };

  const byStatus = (s) => tasks.filter((t) => t.status === s);

  return (
    <MainLayout>
      {modal && (
        <IssueModal
          task={modal === "create" ? null : modal}
          projectId={id}
          members={project?.members || []}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {loading ? <Loader /> : (
        <div className="flex flex-col h-full">
          {/* Board header */}
          <div className="px-6 pt-5 pb-4 shrink-0" style={{ borderBottom: "1px solid var(--tf-border)", background: "var(--bg-surface)" }}>
            <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "var(--tf-text-3)" }}>
              <Link to="/projects" className="hover:text-indigo-500 transition-colors">Projects</Link>
              <span>/</span>
              <span className="font-medium" style={{ color: "var(--tf-text-2)" }}>{project?.name}</span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg text-white text-sm font-bold flex items-center justify-center"
                  style={{ backgroundColor: project?.color || "#6366f1", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}
                >
                  {project?.name?.[0]?.toUpperCase()}
                </div>
                <h1 className="text-lg font-bold" style={{ color: "var(--tf-text)" }}>{project?.name}</h1>
              </div>
              <button onClick={() => setModal("create")} className="tf-btn tf-btn-primary tf-btn-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create issue
              </button>
            </div>
            <div className="mt-3">
              <MembersPanel
                project={project}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                currentUserId={user?._id}
              />
            </div>
          </div>

          {/* Columns */}
          <div className="flex-1 overflow-x-auto p-6">
            <div className="flex gap-4 h-full min-w-max">
              {STATUSES.map((status) => {
                const cfg       = COL_CONFIG[status];
                const colTasks  = byStatus(status);
                return (
                  <div
                    key={status}
                    className={`kanban-col${dragOver === status ? " drag-over" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(status); }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={() => handleDrop(status)}
                  >
                    {/* Column header */}
                    <div
                      className="flex items-center justify-between px-3 py-3"
                      style={{ background: cfg.headerBg, borderBottom: `2px solid ${cfg.accent}` }}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${cfg.label}`}>{status}</span>
                      </div>
                      <span
                        className="text-xs font-bold min-w-5 h-5 rounded-full flex items-center justify-center px-1.5"
                        style={{ background: cfg.accent + "22", color: cfg.accent }}
                      >
                        {colTasks.length}
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="flex-1 p-2.5 overflow-y-auto space-y-0">
                      {colTasks.map((task) => (
                        <IssueCard
                          key={task._id}
                          task={task}
                          onEdit={setModal}
                          onDelete={handleDelete}
                          onDragStart={setDragTask}
                        />
                      ))}
                      <button
                        onClick={() => setModal("create")}
                        className="w-full text-left text-xs py-2 px-2 rounded-lg transition-colors mt-1 flex items-center gap-1"
                        style={{ color: "var(--tf-text-3)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--tf-text-2)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--tf-text-3)"; }}
                      >
                        <span className="text-base leading-none">+</span> Add issue
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default KanbanBoard;

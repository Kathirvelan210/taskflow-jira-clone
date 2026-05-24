const PRIORITY = {
  High:   { dot: "bg-red-500",     text: "text-red-600 dark:text-red-400",     bg: "bg-red-50 dark:bg-red-500/10",     border: "border-red-200 dark:border-red-500/20"   },
  Medium: { dot: "bg-amber-500",   text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20" },
  Low:    { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20" },
};

const STATUS = {
  "Todo":        { text: "text-slate-600 dark:text-slate-400",   bg: "bg-slate-50 dark:bg-slate-700/30",   border: "border-slate-200 dark:border-slate-600/30" },
  "In Progress": { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-200 dark:border-indigo-500/20" },
  "Review":      { text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10", border: "border-violet-200 dark:border-violet-500/20" },
  "Done":        { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20" },
};

const Badge = ({ label, type = "priority" }) => {
  if (type === "priority") {
    const s = PRIORITY[label];
    if (!s) return null;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
        {label}
      </span>
    );
  }

  const s = STATUS[label];
  if (!s) return null;
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wide ${s.bg} ${s.text} ${s.border}`}>
      {label}
    </span>
  );
};

export default Badge;

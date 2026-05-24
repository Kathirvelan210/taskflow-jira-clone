const GRADIENTS = {
  indigo:  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  violet:  "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
  emerald: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  amber:   "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  blue:    "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
};

const StatsCard = ({ label, value, icon, gradient = "indigo" }) => (
  <div className="tf-card p-5 flex items-center gap-4 group hover:shadow-md transition-all duration-200" style={{ overflow: "visible" }}>
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-200 group-hover:scale-110"
      style={{ background: GRADIENTS[gradient], boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="tf-label">{label}</p>
      <p className="text-2xl font-bold mt-0.5 leading-none" style={{ color: "var(--tf-text)" }}>{value}</p>
    </div>
  </div>
);

export default StatsCard;

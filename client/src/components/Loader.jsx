const Loader = () => (
  <div className="flex flex-col items-center justify-center h-64 gap-3">
    <div className="tf-spinner" />
    <p className="text-xs font-medium" style={{ color: "var(--tf-text-3)" }}>Loading…</p>
  </div>
);

export default Loader;

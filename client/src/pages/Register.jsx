import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  "Visual Kanban boards & drag-drop",
  "Team collaboration & member invites",
  "Sprint planning & issue tracking",
  "Analytics & progress reports",
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 4 ? 1 : form.password.length < 7 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"][strength];
  const strengthColors = ["", "bg-red-400", "bg-amber-400", "bg-emerald-500"];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-page)" }}>
      {/* Left branding panel */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col"
        style={{ background: "linear-gradient(145deg, #1a1040 0%, #2d1b69 45%, #4c1d95 75%, #5b21b6 100%)" }}
      >
        <div className="absolute top-1/4 -left-16 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.18), transparent)" }} />
        <div className="absolute bottom-1/3 right-8 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18), transparent)" }} />

        <div className="relative z-10 flex flex-col h-full px-10 py-10 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <span className="text-white font-black text-base">TF</span>
            </div>
            <span className="text-white font-bold text-lg">TaskFlow</span>
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
              ✨
            </div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Join thousands<br />of teams today
            </h2>
            <p className="text-base mb-8 leading-relaxed" style={{ color: "rgba(196,181,253,0.85)" }}>
              Create your free account and start<br />managing projects like a pro.
            </p>
            <ul className="space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "rgba(221,214,254,0.9)" }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}>
                    <svg className="w-3 h-3" style={{ color: "#34d399" }} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs" style={{ color: "rgba(167,139,250,0.4)" }}>
            © 2026 TaskFlow · Free forever, upgrade anytime
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-10"
        style={{ backgroundColor: "var(--bg-surface-alt)" }}
      >
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <span className="text-white font-black text-sm">TF</span>
          </div>
          <span className="font-bold text-lg" style={{ color: "var(--tf-text)" }}>TaskFlow</span>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-1 leading-tight" style={{ color: "var(--tf-text)" }}>
            Create your account
          </h1>
          <p className="text-sm mb-7" style={{ color: "var(--tf-text-2)" }}>
            Get started with TaskFlow for free
          </p>

          {serverError && (
            <div className="rounded-lg px-4 py-3 text-sm mb-5 flex items-start gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="tf-label">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                className={`tf-input${errors.name ? " tf-input-err" : ""}`}
                placeholder="Your full name"
              />
              {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="tf-label">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                className={`tf-input${errors.email ? " tf-input-err" : ""}`}
                placeholder="you@company.com"
              />
              {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="tf-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
                  className={`tf-input${errors.password ? " tf-input-err" : ""}`}
                  style={{ paddingRight: 48 }}
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                  style={{ color: "var(--tf-text-2)" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${strength >= i ? strengthColors[strength] : "bg-gray-200 dark:bg-white/10"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium" style={{ color: "var(--tf-text-3)" }}>{strengthLabel}</span>
                </div>
              )}
              {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="tf-label">Confirm password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: "" }); }}
                className={`tf-input${errors.confirmPassword ? " tf-input-err" : ""}`}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="tf-btn tf-btn-primary w-full"
              style={{ padding: "11px 16px" }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : "Create account"}
            </button>
          </form>

          <p className="text-sm mt-6 text-center" style={{ color: "var(--tf-text-2)" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

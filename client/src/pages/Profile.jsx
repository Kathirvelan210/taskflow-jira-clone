import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const validate = {
  name:     (v) => v.trim().length < 2 ? "Name must be at least 2 characters" : "",
  email:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address",
  password: (v) => v.length < 6 ? "Password must be at least 6 characters" : "",
};

const InputField = ({ label, type = "text", value, onChange, error, placeholder }) => (
  <div>
    <label className="tf-label">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`tf-input${error ? " tf-input-err" : ""}`}
    />
    {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const Alert = ({ type, msg }) => {
  if (!msg) return null;
  const isSuccess = type === "success";
  return (
    <div className={`rounded-lg px-4 py-3 text-sm flex items-center gap-2 border ${
      isSuccess
        ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
        : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
    }`}>
      {isSuccess ? (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
      {msg}
    </div>
  );
};

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [profile, setProfile]             = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileStatus, setProfileStatus] = useState({ type: "", msg: "" });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwords, setPasswords]         = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordStatus, setPasswordStatus] = useState({ type: "", msg: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const validateProfile = () => {
    const errs = {};
    const nameErr  = validate.name(profile.name);
    const emailErr = validate.email(profile.email);
    if (nameErr)  errs.name  = nameErr;
    if (emailErr) errs.email = emailErr;
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePasswords = () => {
    const errs = {};
    if (!passwords.currentPassword) errs.currentPassword = "Current password is required";
    const newErr = validate.password(passwords.newPassword);
    if (newErr) errs.newPassword = newErr;
    if (passwords.newPassword !== passwords.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setProfileLoading(true);
    setProfileStatus({ type: "", msg: "" });
    try {
      const { data } = await authAPI.updateProfile(profile);
      updateUser(data);
      setProfileStatus({ type: "success", msg: "Profile updated successfully!" });
    } catch (err) {
      setProfileStatus({ type: "error", msg: err.response?.data?.message || "Update failed" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    setPasswordLoading(true);
    setPasswordStatus({ type: "", msg: "" });
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswordStatus({ type: "success", msg: "Password changed successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordStatus({ type: "error", msg: err.response?.data?.message || "Failed to change password" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const PasswordInput = ({ label, field, showKey }) => (
    <div>
      <label className="tf-label">{label}</label>
      <div className="relative">
        <input
          type={showPasswords[showKey] ? "text" : "password"}
          value={passwords[field]}
          onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
          className={`tf-input${passwordErrors[field] ? " tf-input-err" : ""}`}
          style={{ paddingRight: 48 }}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPasswords((s) => ({ ...s, [showKey]: !s[showKey] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
          style={{ color: "var(--tf-text-2)" }}
        >
          {showPasswords[showKey] ? "Hide" : "Show"}
        </button>
      </div>
      {passwordErrors[field] && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{passwordErrors[field]}</p>}
    </div>
  );

  return (
    <MainLayout>
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold" style={{ color: "var(--tf-text)" }}>Profile settings</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--tf-text-2)" }}>Manage your account information</p>
        </div>

        {/* Avatar hero card */}
        <div className="tf-card mb-4">
          <div
            className="h-20 relative"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)" }}
          />
          <div className="px-6 pb-5 -mt-8">
            <div
              className="tf-avatar w-16 h-16 text-2xl border-4 mb-3"
              style={{ borderColor: "var(--bg-surface)", boxShadow: "var(--tf-shadow-md)" }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <p className="font-bold text-base" style={{ color: "var(--tf-text)" }}>{user?.name}</p>
            <p className="text-sm" style={{ color: "var(--tf-text-2)" }}>{user?.email}</p>
          </div>
        </div>

        {/* Profile form */}
        <div className="tf-card mb-4">
          <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--tf-border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>Account information</h2>
          </div>
          <form onSubmit={handleProfileSubmit} className="px-6 py-5 space-y-4">
            <Alert type={profileStatus.type} msg={profileStatus.msg} />
            <InputField
              label="Full name"
              value={profile.name}
              onChange={(e) => { setProfile({ ...profile, name: e.target.value }); setProfileErrors({ ...profileErrors, name: "" }); }}
              error={profileErrors.name}
              placeholder="Your full name"
            />
            <InputField
              label="Email address"
              type="email"
              value={profile.email}
              onChange={(e) => { setProfile({ ...profile, email: e.target.value }); setProfileErrors({ ...profileErrors, email: "" }); }}
              error={profileErrors.email}
              placeholder="your@email.com"
            />
            <div className="flex justify-end">
              <button type="submit" disabled={profileLoading} className="tf-btn tf-btn-primary tf-btn-sm">
                {profileLoading ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Password form */}
        <div className="tf-card">
          <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--tf-border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>Change password</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--tf-text-3)" }}>Password must be at least 6 characters</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="px-6 py-5 space-y-4">
            <Alert type={passwordStatus.type} msg={passwordStatus.msg} />
            <PasswordInput label="Current password"     field="currentPassword" showKey="current" />
            <PasswordInput label="New password"         field="newPassword"     showKey="new"     />
            <PasswordInput label="Confirm new password" field="confirmPassword" showKey="confirm" />
            <div className="flex justify-end">
              <button type="submit" disabled={passwordLoading} className="tf-btn tf-btn-primary tf-btn-sm">
                {passwordLoading ? "Updating…" : "Update password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;

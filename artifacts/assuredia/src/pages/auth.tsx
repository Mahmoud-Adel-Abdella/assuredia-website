import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup";
  const [isSignup, setIsSignup] = useState(initialMode);

  // --- added state and logic ---
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
if (isSignup) {
  const res = await api.post("/auth/signup", {
    clientName: companyName,   // ← تم التعديل
    email,
    password,
  });
  localStorage.setItem("token", res.data.token);
}else {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
    }
    navigate("/dashboard");
  } catch (err: any) {
    setError(err.response?.data?.error || "Authentication failed");
  } finally {
    setLoading(false);
  }
};
  // --- end added logic ---

  return (
    <div className="h-screen bg-[#f8fafc] dark:bg-[#020817] text-[#0f172a] dark:text-white lg:grid lg:grid-cols-[1fr_460px] overflow-hidden">

      {/* Left Branding Section - hidden on mobile */}
      <div className="hidden lg:flex relative flex-col justify-between pt-8 pb-8 px-10 border-r border-slate-200 dark:border-white/10 h-screen
        bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(37,99,235,0.08),transparent_35%)]
        dark:bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(37,99,235,0.15),transparent_35%)]">

        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] bg-[linear-gradient(rgba(0,0,0,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Top: Logo + Hero */}
        <div className="relative z-10">
          <a href="#" className="flex shrink-0 items-center gap-3 mb-8">
            <span className="flex h-[80px] w-[80px] shrink-0 items-center justify-center">
              <img
                src="/native-logo.png"
                alt=""
                className="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                draggable={false}
              />
            </span>
            <span className="leading-none">
              <span className="block text-[28px] font-extrabold tracking-[0.10em] text-[#06185a] dark:text-white">
                ASSURE<span className="text-[#12b9aa]">DIA</span>
              </span>
              <span className="mt-0.5 block text-center text-[12px] font-semibold tracking-[0.06em] text-[#3d4f7c] dark:text-white/60">
                Detect. <span className="text-[#0c56d9] dark:text-[#4a8af5]">|</span> Inform. <span className="text-[#0c56d9] dark:text-[#4a8af5]">|</span> Act.
              </span>
            </span>
          </a>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-2 text-sm text-teal-600 dark:text-teal-300 mb-6 backdrop-blur-xl">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Continuous QA Monitoring
            </div>

            <h2 className="text-5xl xl:text-6xl font-black leading-tight tracking-tight mb-6">
              Always  <span className="text-[#12b9aa]">On.</span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                Quality Assured.
              </span>
            </h2>

            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
              Monitor systems, detect failures, and act instantly with
              enterprise-grade QA automation and real-time insights.
            </p>
          </div>
        </div>

        {/* Middle: Feature list */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
            Automated UI & API tests running 24/7
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
            Instant Telegram alerts on failure detection
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
            AI-powered failure analysis & summaries
          </div>
        </div>

        {/* Bottom: Metrics */}
        <div className="relative z-10 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-5 shadow-lg">
            <p className="text-slate-400 text-xs mb-2">System Uptime</p>
            <h3 className="text-3xl font-bold text-teal-500 dark:text-teal-400">99.98%</h3>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-5 shadow-lg">
            <p className="text-slate-400 text-xs mb-2">Active Monitoring</p>
            <h3 className="text-3xl font-bold text-blue-500 dark:text-blue-400">24/7</h3>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl p-5 shadow-lg">
            <p className="text-slate-400 text-xs mb-2">Alerts Response</p>
            <h3 className="text-3xl font-bold text-slate-700 dark:text-white">&lt; 1m</h3>
          </div>
        </div>
      </div>

      {/* Right Auth Section */}
      <div className="relative flex items-center justify-center h-screen px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.06),transparent_35%)] dark:bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),transparent_35%)]" />

        <div className="relative w-full max-w-[420px] rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] backdrop-blur-2xl p-5 shadow-xl dark:shadow-[0_0_80px_rgba(2,132,199,0.15)]">

          {/* Logo - mobile only */}
          <div className="flex lg:hidden justify-center mb-5">
            <a href="#" className="flex shrink-0 items-center gap-3">
              <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center">
                <img
                  src="/logo-dark.png"
                  alt=""
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              </span>
              <span className="leading-none">
                <span className="block text-[22px] font-extrabold tracking-[0.10em] text-[#06185a] dark:text-white">
                  ASSURE<span className="text-[#12b9aa]">DIA</span>
                </span>
                <span className="mt-0.5 block text-center text-[11px] font-semibold tracking-[0.06em] text-[#3d4f7c] dark:text-white/60">
                  Detect. <span className="text-[#0c56d9] dark:text-[#4a8af5]">|</span> Inform. <span className="text-[#0c56d9] dark:text-[#4a8af5]">|</span> Act.
                </span>
              </span>
            </a>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-2xl p-1 mb-4 border border-slate-200 dark:border-white/5">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
                !isSignup
                  ? "bg-gradient-to-r from-blue-600 to-teal-500 shadow-lg text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
                isSignup
                  ? "bg-gradient-to-r from-blue-600 to-teal-500 shadow-lg text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-1">
              {isSignup ? "Create Workspace" : "Welcome back"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isSignup
                ? "Start monitoring your systems in minutes."
                : "Access your monitoring dashboard securely."}
            </p>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2.5 font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition text-sm">
              Google
            </button>
            <button className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2.5 font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition text-sm">
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            <span className="text-xs text-slate-400">or continue with email</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>

          {/* Form with onSubmit */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium mb-1.5 text-slate-600 dark:text-slate-300">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Acme Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required={isSignup}
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#172033] px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-600 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#172033] px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Password</label>
                {!isSignup && (
                  <button type="button" className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#172033] px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <input type="checkbox" className="rounded border-slate-300 dark:border-white/20" />
                Remember me
              </label>
              <div className="flex items-center gap-1.5 text-teal-500 dark:text-teal-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Secure Login
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 py-3 font-semibold text-base text-white shadow-[0_10px_40px_rgba(37,99,235,0.35)] hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
            >
              {loading
                ? isSignup
                  ? "Creating account..."
                  : "Logging in..."
                : isSignup
                ? "Create Account"
                : "Access Dashboard"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center text-slate-500 dark:text-slate-400 text-xs">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="ml-1.5 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium"
            >
              {isSignup ? "Log In" : "Create Workspace"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
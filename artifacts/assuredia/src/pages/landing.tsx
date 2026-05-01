import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, ChevronDown, Play, Sun, Moon, Monitor, Bell, CheckCircle2, Activity, Brain, Cloud, Send, TrendingUp } from "lucide-react";
import logoUrl from "@assets/e2a4684a-979c-4de9-be72-c3624b6dcb8c_1777651437482.png";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lp-theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("lp-theme", theme);
  }, [theme]);

  return { theme, toggle: () => setTheme(t => t === "light" ? "dark" : "light") };
}

function NavDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#0B5ED7] dark:hover:text-[#14B8A6] transition-colors">
      {label}
      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
    </button>
  );
}

function ProcessCard({ step, title, desc, children, active }: {
  step: string; title: string; desc: string; children: React.ReactNode; active?: boolean;
}) {
  return (
    <div className={`relative flex flex-col p-3.5 rounded-xl border text-center w-[140px] shrink-0 shadow-sm transition-all
      ${active
        ? "bg-white dark:bg-[#0d1b3e] border-[#3b82f6]/40 dark:border-[#3b82f6]/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
        : "bg-white dark:bg-[#111c3a] border-slate-200/80 dark:border-slate-700/50"
      }`}>
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1">{step}</p>
      <p className="text-[11px] font-bold text-slate-800 dark:text-white mb-0.5">{title}</p>
      <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-tight mb-2.5">{desc}</p>
      <div className="flex items-center justify-center h-16">{children}</div>
    </div>
  );
}

function BrowserMockup() {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600/50 shadow-sm bg-white dark:bg-slate-800">
      <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
      </div>
      <div className="p-2 space-y-1">
        <div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded w-3/4" />
        <div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded w-1/2" />
        <div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded w-2/3" />
      </div>
      <div className="absolute bottom-1 right-1">
        <div className="w-5 h-5 rounded-full bg-[#14B8A6] flex items-center justify-center shadow">
          <CheckCircle2 className="w-3 h-3 text-white" />
        </div>
      </div>
    </div>
  );
}

function DashedArrow({ direction = "right" }: { direction?: "right" | "up" | "down" | "left" }) {
  const svgProps = direction === "right" || direction === "left"
    ? { width: 32, height: 16 }
    : { width: 16, height: 32 };

  const path = direction === "right"
    ? "M2 8 H30 M24 4 L30 8 L24 12"
    : direction === "left"
    ? "M30 8 H2 M8 4 L2 8 L8 12"
    : direction === "down"
    ? "M8 2 V30 M4 24 L8 30 L12 24"
    : "M8 30 V2 M4 8 L8 2 L12 8";

  return (
    <svg width={svgProps.width} height={svgProps.height} viewBox={`0 0 ${svgProps.width} ${svgProps.height}`} fill="none">
      <path d={path} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UptimeLine() {
  return (
    <svg width="80" height="20" viewBox="0 0 80 20" fill="none">
      <path d="M0 14 L10 14 L15 6 L20 16 L25 10 L30 14 L40 14 L45 8 L50 14 L60 14 L65 5 L70 14 L80 14"
        stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Landing() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? "dark bg-[#070d1f]" : "bg-white"}`}>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors ${
        isDark
          ? "bg-[#070d1f]/90 backdrop-blur border-white/5"
          : "bg-white/90 backdrop-blur border-slate-200/80"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img src={logoUrl} alt="Assuredia" className="h-8 w-auto" />
            <div>
              <span className="font-extrabold text-base tracking-wide">
                <span className="text-[#0B5ED7]">ASSURE</span>
                <span className={isDark ? "text-white" : "text-slate-900"}>DIA</span>
              </span>
              <p className="text-[9px] tracking-widest text-slate-400 dark:text-slate-500 -mt-0.5 font-medium">
                — Detect. Inform. Action. —
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            <NavDropdown label="Product" />
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#0B5ED7] dark:hover:text-[#14B8A6] transition-colors">Features</a>
            <NavDropdown label="Solutions" />
            <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#0B5ED7] dark:hover:text-[#14B8A6] transition-colors">Pricing</a>
            <NavDropdown label="Resources" />
            <a href="#" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#0B5ED7] dark:hover:text-[#14B8A6] transition-colors">About</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-white/10"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link href="/dashboard">
              <button className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                isDark
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}>
                Log In
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="text-sm font-semibold px-5 py-2 rounded-lg bg-[#0B5ED7] hover:bg-[#0a52c0] text-white transition-colors shadow-sm shadow-[#0B5ED7]/30">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`pt-[60px] min-h-screen flex flex-col transition-colors ${
        isDark
          ? "bg-gradient-to-br from-[#070d1f] via-[#0a1530] to-[#070d1f]"
          : "bg-gradient-to-br from-[#f0f6ff] via-white to-[#f5fbfb]"
      }`}>
        {/* Background effects */}
        {isDark && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-[#0B5ED7]/5 blur-3xl" />
            <div className="absolute bottom-40 right-1/4 w-80 h-80 rounded-full bg-[#14B8A6]/5 blur-3xl" />
            {/* Dot grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "30px 30px"
            }} />
          </div>
        )}
        {!isDark && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#e8f2ff]/40 to-transparent" />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-6 flex-1 flex flex-col">
          <div className="flex-1 flex items-center py-12 gap-12">
            {/* Left column */}
            <div className="flex-1 max-w-lg">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-7 border ${
                isDark
                  ? "bg-[#14B8A6]/10 border-[#14B8A6]/30 text-[#14B8A6]"
                  : "bg-[#14B8A6]/10 border-[#14B8A6]/20 text-[#0f9688]"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
                Continuous QA Monitoring
              </div>

              {/* Headline */}
              <h1 className={`text-5xl xl:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5 ${
                isDark ? "text-white" : "text-[#0d1b3e]"
              }`}>
                Always On.<br />
                <span className="bg-gradient-to-r from-[#14B8A6] to-[#0ea5e9] bg-clip-text text-transparent">
                  Quality Assured.
                </span>
              </h1>

              <p className={`text-base leading-relaxed mb-8 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                Detect issues early. Inform instantly.<br />
                Take action with confidence.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <button className="flex items-center gap-2 px-6 py-3 bg-[#0B5ED7] hover:bg-[#0a52c0] text-white font-semibold rounded-lg text-sm transition-all shadow-lg shadow-[#0B5ED7]/25 hover:shadow-[#0B5ED7]/40 hover:-translate-y-px">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <button className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg text-sm border transition-all ${
                  isDark
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isDark ? "bg-white/10 border border-white/20" : "bg-slate-100 border border-slate-200"
                  }`}>
                    <Play className="h-2.5 w-2.5 ml-0.5" fill="currentColor" />
                  </div>
                  View Demo
                </button>
              </div>
            </div>

            {/* Right column — 4-step process diagram */}
            <div className="flex-1 flex flex-col items-center gap-0 relative">
              {/* Top row: cards 1 & 2 */}
              <div className="flex items-center gap-1">
                <div className="relative">
                  <ProcessCard step="1. Test" title="Test" desc="Automated UI & API tests run 24/7">
                    <div className="relative w-full px-1">
                      <BrowserMockup />
                    </div>
                  </ProcessCard>
                </div>
                <DashedArrow direction="right" />
                <ProcessCard step="2. Detect" title="Detect" desc="Issues detected in real-time" active>
                  <div className="w-10 h-10 rounded-full bg-[#0B5ED7] flex items-center justify-center shadow-lg shadow-[#0B5ED7]/30">
                    <span className="text-white font-bold text-lg">!</span>
                  </div>
                </ProcessCard>
                <DashedArrow direction="right" />
                <ProcessCard step="3. Inform" title="Inform" desc="Instant alerts with rich context">
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative">
                      <Bell className="w-8 h-8 text-[#0B5ED7] dark:text-[#60a5fa]" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">1</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-[#0B5ED7] dark:text-[#60a5fa]" />
                      <span className={`text-[10px] font-medium ${isDark ? "text-slate-400" : "text-slate-400"}`}>+</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center ${isDark ? "bg-slate-700" : "bg-slate-100"}`}>
                        <TrendingUp className="w-2.5 h-2.5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </ProcessCard>
                <DashedArrow direction="right" />
                <ProcessCard step="4. Action" title="Action" desc="Resolve faster with insights & automation">
                  <div className="w-10 h-10 rounded-full bg-[#14B8A6]/15 border border-[#14B8A6]/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-[#14B8A6]" />
                  </div>
                </ProcessCard>
              </div>

              {/* Curved arrows row */}
              <div className="flex w-full px-6 justify-between items-center h-8">
                <svg width="100%" height="32" viewBox="0 0 640 32" fill="none" preserveAspectRatio="none">
                  <path d="M40 4 C100 4 540 4 600 4" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />
                  <path d="M40 4 L40 28" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />
                  <path d="M600 4 L600 28" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round" />
                  <polygon points="36,22 40,30 44,22" fill="#3b82f6" opacity="0.7" />
                  <polygon points="596,22 600,30 604,22" fill="#3b82f6" opacity="0.7" />
                </svg>
              </div>
            </div>
          </div>

          {/* System Status Bar */}
          <div className={`flex items-center justify-center gap-4 py-4 border-t text-sm ${
            isDark ? "border-white/5 text-slate-400" : "border-slate-200/80 text-slate-500"
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse shadow-[0_0_6px_rgba(20,184,166,0.7)]" />
              <span className="text-xs font-medium">System Status</span>
            </div>
            <span className="text-[#14B8A6] text-xs font-semibold">All Systems Operational</span>
            <UptimeLine />
            <span className="text-xs font-semibold">99.98% Uptime</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-10 px-6 transition-colors ${
        isDark ? "bg-[#0a1120] border-t border-b border-white/5" : "bg-slate-50/80 border-t border-b border-slate-200/80"
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Brain className="w-5 h-5" />,
                title: "AI-Powered Insights",
                desc: "Smart analysis and self-healing capabilities to keep your tests resilient and up to date.",
                color: "text-[#0B5ED7]",
                bg: isDark ? "bg-[#0B5ED7]/10" : "bg-[#0B5ED7]/10",
              },
              {
                icon: <Monitor className="w-5 h-5" />,
                title: "24/7 Monitoring",
                desc: "Round-the-clock monitoring across all environments to ensure system stability.",
                color: "text-[#14B8A6]",
                bg: isDark ? "bg-[#14B8A6]/10" : "bg-[#14B8A6]/10",
              },
              {
                icon: <Send className="w-5 h-5" />,
                title: "Instant Notifications",
                desc: "Real-time alerts via Telegram with rich details and screenshots for faster response.",
                color: "text-[#0B5ED7]",
                bg: isDark ? "bg-[#0B5ED7]/10" : "bg-[#0B5ED7]/10",
              },
              {
                icon: <Cloud className="w-5 h-5" />,
                title: "Scalable & Reliable",
                desc: "Built with Docker and AWS for high availability, scalability, and performance.",
                color: "text-[#14B8A6]",
                bg: isDark ? "bg-[#14B8A6]/10" : "bg-[#14B8A6]/10",
              },
            ].map((f, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center shrink-0 ${f.color}`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className={`text-sm font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>{f.title}</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies + CTA */}
      <section className={`py-8 px-6 transition-colors ${isDark ? "bg-[#070d1f]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-stretch">
          {/* Tech logos */}
          <div className={`flex-1 flex flex-col justify-center p-6 rounded-2xl border ${
            isDark ? "bg-[#0a1120] border-white/5" : "bg-slate-50 border-slate-200"
          }`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              Built with best-in-class technologies
            </p>
            <div className="flex flex-wrap items-center gap-5">
              {/* Java */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold ${isDark ? "bg-white/5" : "bg-white border border-slate-200"}`}>
                  <span style={{ color: "#f89820" }}>J</span>
                </div>
                <span className={`text-[9px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Java</span>
              </div>
              {/* Selenium */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${isDark ? "bg-white/5" : "bg-white border border-slate-200"}`}>
                  <span style={{ color: "#43b02a" }}>Se</span>
                </div>
                <span className={`text-[9px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Selenium</span>
              </div>
              {/* REST */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[9px] font-bold ${isDark ? "bg-white/5" : "bg-white border border-slate-200"}`}>
                  <span className={isDark ? "text-white" : "text-slate-700"}>REST</span>
                </div>
                <span className={`text-[9px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Assured</span>
              </div>
              {/* n8n */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${isDark ? "bg-white/5" : "bg-white border border-slate-200"}`}>
                  <span style={{ color: "#ea4b71" }}>n8n</span>
                </div>
                <span className={`text-[9px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>n8n</span>
              </div>
              {/* AWS */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${isDark ? "bg-white/5" : "bg-white border border-slate-200"}`}>
                  <span style={{ color: "#ff9900" }}>aws</span>
                </div>
                <span className={`text-[9px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>AWS</span>
              </div>
              {/* Docker */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${isDark ? "bg-white/5" : "bg-white border border-slate-200"}`}>
                  <span style={{ color: "#2496ed" }}>D</span>
                </div>
                <span className={`text-[9px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>Docker</span>
              </div>
              {/* AI */}
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[9px] font-bold ${isDark ? "bg-white/5" : "bg-white border border-slate-200"}`}>
                  <span className={isDark ? "text-white" : "text-slate-700"}>AI</span>
                </div>
                <span className={`text-[9px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>AI Integration</span>
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div className={`md:w-80 p-6 rounded-2xl border flex flex-col justify-between ${
            isDark ? "bg-[#0a1120] border-white/5" : "bg-slate-50 border-slate-200"
          }`}>
            <div>
              <p className={`text-sm font-semibold leading-snug mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Everything you need to ensure quality, reliability, and confidence in every release.
              </p>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Get started in minutes. No credit card required.
              </p>
            </div>
            <div className={`mt-4 rounded-xl overflow-hidden border ${isDark ? "border-white/5 bg-[#0d1b3e]" : "border-slate-200 bg-white"} p-3`}>
              {/* Mini dashboard illustration */}
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {[
                  { label: "97.3%", color: "text-[#14B8A6]" },
                  { label: "1,835", color: isDark ? "text-white" : "text-slate-800" },
                  { label: "42", color: "text-red-400" },
                ].map((m, i) => (
                  <div key={i} className={`rounded-lg p-1.5 text-center ${isDark ? "bg-white/5" : "bg-slate-50 border border-slate-100"}`}>
                    <div className={`text-xs font-bold ${m.color}`}>{m.label}</div>
                    <div className={`text-[8px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      {["Success", "Tests", "Issues"][i]}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`h-14 rounded-lg flex items-center justify-center ${isDark ? "bg-white/5" : "bg-slate-50 border border-slate-100"}`}>
                <svg width="100%" height="40" viewBox="0 0 200 40">
                  <polyline points="0,35 20,30 40,20 60,25 80,10 100,15 120,22 140,18 160,25 180,12 200,20"
                    fill="none" stroke="#0B5ED7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="0,38 20,36 40,34 60,37 80,32 100,35 120,30 140,33 160,31 180,34 200,32"
                    fill="none" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={`py-20 px-6 transition-colors ${
        isDark ? "bg-[#0a1120]" : "bg-slate-50"
      }`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-extrabold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Simple, Transparent Pricing
            </h2>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Start free. Scale as you grow.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                name: "Professional", price: "$299", period: "/mo",
                desc: "For growing engineering teams.",
                features: ["Up to 50 monitored clients", "Real-time Slack/Discord alerts", "30-day data retention", "Standard support"],
                cta: "Start Free Trial", featured: false,
              },
              {
                name: "Enterprise", price: "$899", period: "/mo",
                desc: "For mission-critical deployments.",
                features: ["Unlimited monitored clients", "Custom webhook integrations", "1-year data retention", "Dedicated success manager", "SSO & Advanced Security"],
                cta: "Contact Sales", featured: true,
              },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 border transition-all ${
                plan.featured
                  ? "bg-[#0B5ED7] border-[#0B5ED7] text-white shadow-xl shadow-[#0B5ED7]/20"
                  : isDark
                    ? "bg-[#0d1528] border-white/10 text-white"
                    : "bg-white border-slate-200 text-slate-900"
              }`}>
                {plan.featured && (
                  <div className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white mb-3 uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.featured ? "text-white" : isDark ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                <p className={`text-xs mb-5 ${plan.featured ? "text-blue-100" : isDark ? "text-slate-400" : "text-slate-500"}`}>{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-extrabold ${plan.featured ? "text-white" : isDark ? "text-white" : "text-slate-900"}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.featured ? "text-blue-100" : isDark ? "text-slate-400" : "text-slate-400"}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-7">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.featured ? "text-white" : "text-[#14B8A6]"}`} />
                      <span className={plan.featured ? "text-blue-50" : isDark ? "text-slate-300" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  plan.featured
                    ? "bg-white text-[#0B5ED7] hover:bg-blue-50"
                    : isDark
                      ? "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200"
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-10 px-6 border-t transition-colors ${
        isDark ? "bg-[#070d1f] border-white/5" : "bg-white border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 opacity-60">
            <img src={logoUrl} alt="Assuredia" className="h-6 w-auto" />
            <span className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>Assuredia</span>
          </div>
          <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            © 2025 Assuredia QA Monitoring. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

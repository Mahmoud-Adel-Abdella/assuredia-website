import { Link } from "react-router-dom"; // تغيير من wouter إلى react-router-dom
import {
  Activity,
  ArrowRight,
  Bell,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  Cloud,
  ImageIcon,
  LineChart,
  Moon,
  Play,
  Send,
  Sun,
} from "lucide-react";
import { useAppTheme } from "@/context/ThemeContext";
import logoTransparentUrl from "/native-logo.png";

const navItems = [
  { label: "Product", href: "#product", dropdown: true },
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#solutions", dropdown: true },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources", dropdown: true },
  { label: "About", href: "#about" },
];

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Insights",
    description:
      "Smart analysis and self-healing capabilities to keep your tests resilient and up to date.",
  },
  {
    icon: LineChart,
    title: "24/7 Monitoring",
    description:
      "Round-the-clock monitoring across all environments to ensure system stability.",
  },
  {
    icon: Send,
    title: "Instant Notifications",
    description:
      "Real-time alerts via Telegram with rich details and screenshots for faster response.",
  },
  {
    icon: Cloud,
    title: "Scalable & Reliable",
    description:
      "Built with Docker and AWS for high availability, scalability, and performance.",
  },
];

const technologies = [
  { label: "Java", mark: "J", color: "#f06b22" },
  { label: "Selenium", mark: "Se", color: "#39b54a" },
  { label: "Assured", mark: "REST", color: "#0b1746" },
  { label: "n8n", mark: "n8n", color: "#ea4b71" },
  { label: "AWS", mark: "aws", color: "#ff9900" },
  { label: "Docker", mark: "D", color: "#2496ed" },
  { label: "AI Integration", mark: "AI", color: "#315bff" },
];

function NavLink({ item }: { item: (typeof navItems)[number] }) {
  return (
    <a
      href={item.href}
      className="flex items-center gap-1.5 text-[15px] font-semibold text-[#06185a] transition hover:text-[#095ee8] dark:text-white/90 dark:hover:text-[#20d6c1]"
    >
      {item.label}
      {item.dropdown ? <ChevronDown className="h-4 w-4" /> : null}
    </a>
  );
}

function Brand() {
  return (
    <a href="#product" className="flex shrink-0 items-center gap-3">
      <span className="flex h-[80px] w-[80px] shrink-0 items-center justify-center" aria-hidden="true">
        <img
          src={logoTransparentUrl}
          alt=""
          className="h-full w-full object-contain"
          style={{ imageRendering: "auto" }}
          draggable={false}
        />
      </span>
      <span className="hidden leading-none min-[560px]:block">
        <span className="block text-[28px] font-extrabold tracking-[0.10em] text-[#06185a] dark:text-white">
          ASSURE<span className="text-[#12b9aa]">DIA</span>
        </span>
        <span className="mt-0.5 block text-center text-[12px] font-semibold tracking-[0.06em] text-[#3d4f7c] dark:text-white/60">
          Detect. <span className="text-[#0c56d9] dark:text-[#4a8af5]">|</span> Inform. <span className="text-[#0c56d9] dark:text-[#4a8af5]">|</span> Act.
        </span>
      </span>
    </a>
  );
}

function BrowserTile({ variant = "test" }: { variant?: "test" | "action" }) {
  return (
    <div className="relative h-[88px] w-[110px] rounded-[8px] border border-[#b4c8e4] bg-gradient-to-b from-white to-[#f7faff] shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(37,99,235,0.10),0_12px_24px_rgba(14,38,92,0.06)] dark:border-white/10 dark:bg-[#0b1a34] dark:from-[#0b1a34] dark:to-[#0b1a34] dark:shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
      <div className="flex h-[18px] items-center gap-[5px] rounded-t-[8px] bg-gradient-to-r from-[#4a6ec5] to-[#3b5eb3] px-3 dark:from-[#2d4e9a] dark:to-[#365cad]">
        <span className="h-[5px] w-[5px] rounded-full bg-white/80" />
        <span className="h-[5px] w-[5px] rounded-full bg-white/80" />
        <span className="h-[5px] w-[5px] rounded-full bg-white/80" />
      </div>
      <div className="space-y-[6px] px-3 py-3">
        <span className="block h-[5px] w-full rounded-full bg-[#dae3f1] dark:bg-white/10" />
        <span className="block h-[5px] w-3/4 rounded-full bg-[#dae3f1] dark:bg-white/10" />
        {variant === "test" ? (
          <span className="block h-[5px] w-1/2 rounded-full bg-[#dae3f1] dark:bg-white/10" />
        ) : null}
      </div>
      <div className="absolute -bottom-[6px] -right-[6px] flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#14d4c6] to-[#0fa89b] text-white shadow-[0_2px_6px_rgba(20,184,166,0.35),0_6px_16px_rgba(20,184,166,0.20)]">
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  children,
  className = "",
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`group relative z-10 flex min-h-[260px] shrink-0 flex-col rounded-[14px] border border-[#cad6ea] bg-gradient-to-b from-white to-[#f6f9ff] p-6 shadow-[0_0_0_1px_rgba(14,38,92,0.03),0_1px_3px_rgba(0,0,0,0.05),0_6px_16px_rgba(14,38,92,0.07),0_20px_44px_rgba(14,38,92,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(14,38,92,0.04),0_2px_4px_rgba(0,0,0,0.06),0_10px_24px_rgba(14,38,92,0.09),0_28px_56px_rgba(14,38,92,0.08)] dark:border-white/[0.08] dark:bg-[#0a1428]/90 dark:from-[#0a1428]/90 dark:to-[#0a1428]/90 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_12px_32px_rgba(0,0,0,0.3)] ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-gradient-to-br from-[#12b9aa] to-[#0ea396] text-[12px] font-bold text-white shadow-[0_2px_6px_rgba(18,185,170,0.30),0_6px_16px_rgba(18,185,170,0.15)]">
          {number}
        </span>
        <h3 className="text-[15px] font-bold tracking-[-0.01em] text-[#051340] dark:text-white">
          {title}
        </h3>
      </div>
      <p className="mt-3 text-[12px] font-medium leading-[1.6] text-[#3a4d78] dark:text-white/70">
        {description}
      </p>
      <div className="mt-auto flex justify-center pt-5">{children}</div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-[14px] bg-gradient-to-t from-[#e8f0fd]/70 via-[#f0f6ff]/30 to-transparent dark:from-[#0d1e3d]/40 dark:via-transparent" />
    </article>
  );
}

/* CSS-in-JS style for the animated connector */
const connectorKeyframes = `
@keyframes flowDot {
  0% { transform: translateX(0); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}
@keyframes detectPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(49,91,255,0.3); }
  50% { box-shadow: 0 0 0 8px rgba(49,91,255,0); }
}
`;

function ConnectorArrow() {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 flex items-center" style={{ left: "calc(100% - 2px)", width: "calc(var(--gap, 20px) + 4px)", zIndex: 5 }}>
      <div className="relative h-[1px] w-full">
        <div className="absolute inset-0 border-t-[2px] border-dashed border-[#94b0d8] dark:border-white/15" />
        <div
          className="absolute top-[-3px] h-[7px] w-[7px] rounded-full bg-[#12b9aa] shadow-[0_0_6px_rgba(18,185,170,0.5)]"
          style={{ animation: "flowDot 2.2s ease-in-out infinite" }}
        />
      </div>
      <svg className="absolute -right-[5px] top-1/2 -translate-y-1/2 h-[8px] w-[6px] text-[#7a9ac4] dark:text-white/20" viewBox="0 0 6 8" fill="currentColor">
        <path d="M0 0L6 4L0 8Z" />
      </svg>
    </div>
  );
}

function ProcessFlow() {
  return (
    <div className="relative mx-auto flex w-full max-w-[780px] items-center justify-center overflow-visible">
      <style>{connectorKeyframes}</style>
      <div className="grid w-full grid-cols-4 items-stretch gap-4" style={{ "--gap": "16px" } as React.CSSProperties}>
        {/* Step 1: Test */}
        <div className="relative">
          <StepCard number="1" title="Test" description="Automated UI & API tests run 24/7">
            <BrowserTile />
          </StepCard>
          <ConnectorArrow />
        </div>

        {/* Step 2: Detect */}
        <div className="relative">
          <StepCard number="2" title="Detect" description="Issues detected in real-time">
            <div className="relative mx-auto flex h-[100px] w-[100px] items-center justify-center">
              <span className="absolute h-[100px] w-[100px] rounded-full border border-[#0d5dff]/15 dark:border-[#0d5dff]/10" />
              <span className="absolute h-[80px] w-[80px] rounded-full border border-[#0d5dff]/20 dark:border-[#0d5dff]/15" />
              <span className="absolute h-[60px] w-[60px] rounded-full border border-[#0d5dff]/30 bg-[#0d5dff]/[0.06] dark:bg-[#0d5dff]/[0.08]" />
              <span
                className="absolute h-[44px] w-[44px] rounded-full bg-gradient-to-br from-[#3b6aff] to-[#2448cc] shadow-[0_0_24px_rgba(49,91,255,0.45)]"
                style={{ animation: "detectPulse 2.5s ease-in-out infinite" }}
              />
              <span className="relative text-[26px] font-extrabold leading-none text-white">!</span>
            </div>
          </StepCard>
          <ConnectorArrow />
        </div>

        {/* Step 3: Inform */}
        <div className="relative">
          <StepCard number="3" title="Inform" description="Instant alerts with rich context" className="overflow-hidden">
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#eef3fc] dark:bg-[#111f3d]">
                <Bell className="h-[32px] w-[32px] fill-[#315bff] stroke-[#315bff]" />
                <span className="absolute -right-1 top-0 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#ff3f54] text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(255,63,84,0.35)]">
                  1
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#1490ff] to-[#0c6fdf] text-white shadow-[0_4px_12px_rgba(12,141,255,0.25)]">
                  <Send className="h-3.5 w-3.5 fill-white/30" />
                </span>
                <span className="text-base font-light text-[#9babc4] dark:text-white/40">+</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#12b9aa]/50 bg-[#12b9aa]/[0.06] text-[#12b9aa]">
                  <ImageIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </StepCard>
          <ConnectorArrow />
        </div>

        {/* Step 4: Action */}
        <div className="relative">
          <StepCard number="4" title="Action" description="Resolve faster with insights & automation">
            <BrowserTile variant="action" />
          </StepCard>
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="mx-auto mt-5 flex h-[52px] w-full max-w-[700px] items-center justify-between gap-5 rounded-[12px] border border-[#c4d3ea] bg-gradient-to-b from-white/95 to-[#f4f8ff]/95 px-6 text-[#06185a] shadow-[0_0_0_1px_rgba(14,38,92,0.03),0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(14,38,92,0.06),0_16px_36px_rgba(14,38,92,0.05)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0b1427]/80 dark:from-[#0b1427]/80 dark:to-[#0b1427]/80 dark:text-white/90 dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-[10px] w-[10px]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#12b9aa] opacity-40" />
          <span className="relative inline-flex h-[10px] w-[10px] rounded-full bg-[#12b9aa] shadow-[0_0_8px_rgba(18,185,170,0.5)]" />
        </span>
        <span className="text-[13px] font-semibold text-[#2c3e64] dark:text-white/70">System Status</span>
      </div>
      <span className="h-5 w-px bg-[#c4d3ea] dark:bg-white/10" />
      <span className="text-[13px] font-semibold text-[#00957f]">All Systems Operational</span>
      <span className="h-5 w-px bg-[#c4d3ea] dark:bg-white/10" />
      <Activity className="h-5 w-16 stroke-[#12b9aa]" strokeWidth={1.5} />
      <span className="h-5 w-px bg-[#c4d3ea] dark:bg-white/10" />
      <span className="text-[13px] font-semibold tracking-[-0.01em]">
        <span className="text-[#08bfa9]">99.98%</span>
        <span className="ml-1 font-medium text-[#4a6185] dark:text-white/60">Uptime</span>
      </span>
    </div>
  );
}

function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-0 top-[108px] h-[128px] w-[128px] opacity-70 [background-image:radial-gradient(circle,#1599ff_1px,transparent_1.3px)] [background-size:16px_16px] dark:opacity-55" />
      <svg className="absolute inset-x-0 bottom-[250px] h-[190px] w-full opacity-50 dark:opacity-40" viewBox="0 0 1600 190" fill="none" preserveAspectRatio="none">
        {Array.from({ length: 18 }).map((_, index) => (
          <path
            key={index}
            d={`M-40 ${126 + index * 5}C138 ${46 + index * 3} 264 ${160 + index * 2} 420 ${120 + index * 4}C654 ${61 + index * 4} 770 ${95 + index * 2} 930 ${118 + index * 3}C1150 ${150 + index * 2} 1372 ${142 - index * 2} 1640 ${20 + index * 5}`}
            stroke="url(#waveStroke)"
            strokeWidth=".8"
          />
        ))}
        <defs>
          <linearGradient id="waveStroke" x1="0" y1="0" x2="1600" y2="0">
            <stop stopColor="#0b7cff" />
            <stop offset=".5" stopColor="#66d4ff" stopOpacity=".25" />
            <stop offset="1" stopColor="#0989ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_72%_10%,rgba(0,154,255,0.14),transparent_34%),radial-gradient(circle_at_92%_36%,rgba(18,185,170,0.12),transparent_28%)] dark:bg-[radial-gradient(circle_at_70%_8%,rgba(9,94,232,0.18),transparent_34%),radial-gradient(circle_at_88%_34%,rgba(18,185,170,0.13),transparent_30%)]" />
    </div>
  );
}

function FeatureRail() {
  return (
    <section id="features" className="relative z-10 mx-auto w-full max-w-[1500px] px-6">
      <div className="grid grid-cols-1 rounded-[12px] border border-[#d8e6f5] bg-white/86 shadow-[0_18px_40px_rgba(14,38,92,0.06)] backdrop-blur dark:border-white/12 dark:bg-[#0a1428]/88 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className={`flex items-center gap-5 px-9 py-6 ${
                index > 0 ? "border-t border-[#d8e6f5] dark:border-white/12 md:border-l md:border-t-0" : ""
              }`}
            >
              <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border border-[#d6e4fb] bg-[#eef5ff] text-[#315bff] dark:border-white/10 dark:bg-white/5">
                <Icon className="h-11 w-11" strokeWidth={1.9} />
              </div>
              <div>
                <h2 className="text-[16px] font-extrabold text-[#06185a] dark:text-white">{feature.title}</h2>
                <p className="mt-2 text-[14px] font-medium leading-6 text-[#0a1f63]/82 dark:text-white/82">
                  {feature.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TechnologyPanel() {
  return (
    <section id="resources" className="relative z-10 mx-auto grid w-full max-w-[1500px] gap-4 px-6 pb-7 pt-4 lg:grid-cols-[1.25fr_.95fr]">
      <div className="grid overflow-hidden rounded-[12px] border border-[#d8e6f5] bg-white/86 shadow-[0_18px_40px_rgba(14,38,92,0.06)] backdrop-blur dark:border-white/12 dark:bg-[#0a1428]/88 md:grid-cols-[170px_1fr]">
        <div className="flex items-center border-b border-[#e0ebf7] px-6 py-5 dark:border-white/10 md:border-b-0 md:border-r">
          <h2 className="text-[16px] font-extrabold leading-7 text-[#06185a] dark:text-white">
            Built with
            <br />
            best-in-class
            <br />
            technologies
          </h2>
        </div>
        <div className="grid grid-cols-3 items-center gap-4 px-7 py-5 sm:grid-cols-4 lg:grid-cols-7">
          {technologies.map((tech) => (
            <div key={tech.label} className="flex min-w-0 flex-col items-center gap-1.5 text-center">
              <div
                className="flex h-12 min-w-12 items-center justify-center rounded-lg text-[24px] font-extrabold"
                style={{ color: tech.color }}
              >
                {tech.mark}
              </div>
              <span className="text-[13px] font-medium leading-tight text-[#06185a] dark:text-white/86">{tech.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[12px] border border-[#d8e6f5] bg-white/86 px-7 py-6 shadow-[0_18px_40px_rgba(14,38,92,0.06)] backdrop-blur dark:border-white/12 dark:bg-[#0a1428]/88">
        <h2 className="relative z-10 max-w-[360px] text-[14px] font-bold leading-6 text-[#06185a] dark:text-white">
          Everything you need to ensure quality, reliability, and confidence in every release.
        </h2>
        <div className="absolute bottom-0 right-4 flex h-[116px] w-[330px] items-end justify-end opacity-85">
          <div className="mr-3 flex items-end gap-2">
            <span className="h-9 w-6 rounded-t bg-[#3dd5d0]" />
            <span className="h-14 w-6 rounded-t bg-[#1c80ff]" />
            <span className="h-20 w-6 rounded-t bg-[#46d6ff]" />
            <span className="h-28 w-6 rounded-t bg-[#1f5fff]" />
          </div>
          <div className="relative h-[100px] w-[170px] rounded-t-[8px] border border-[#1d62d8] bg-[#eaf4ff] dark:bg-[#0c2456]">
            <div className="h-5 rounded-t-[8px] bg-[#2c65dc]" />
            <div className="grid grid-cols-2 gap-2 p-3">
              <span className="h-8 rounded bg-white dark:bg-white/10" />
              <span className="h-8 rounded bg-white dark:bg-white/10" />
              <span className="h-8 rounded bg-white dark:bg-white/10" />
              <span className="h-8 rounded bg-white dark:bg-white/10" />
            </div>
            <span className="absolute -bottom-6 right-0 h-16 w-16 rounded-full border-[7px] border-[#284d91] bg-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="bg-[#f7fbff] px-6 py-20 dark:bg-[#061024]">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#12b9aa]">Pricing</p>
        <h2 className="mt-3 text-4xl font-extrabold text-[#06185a] dark:text-white">Simple, Transparent Pricing</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-[#0a1f63]/70 dark:text-white/70">
          Start free, then scale monitoring across clients, releases, and environments.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            ["Professional", "$299", "For growing engineering teams."],
            ["Enterprise", "$899", "For mission-critical QA operations."],
          ].map(([name, price, description], index) => (
            <article
              key={name}
              className={`rounded-[12px] border p-8 text-left ${
                index === 1
                  ? "border-[#095ee8] bg-[#095ee8] text-white shadow-[0_20px_50px_rgba(9,94,232,0.24)]"
                  : "border-[#d8e6f5] bg-white text-[#06185a] dark:border-white/12 dark:bg-[#0a1428] dark:text-white"
              }`}
            >
              <h3 className="text-2xl font-extrabold">{name}</h3>
              <p className={`mt-2 text-sm font-medium ${index === 1 ? "text-white/76" : "text-[#0a1f63]/70 dark:text-white/70"}`}>
                {description}
              </p>
              <div className="mt-7 flex items-end gap-1">
                <span className="text-5xl font-extrabold">{price}</span>
                <span className={`pb-2 text-base ${index === 1 ? "text-white/78" : "text-[#0a1f63]/62 dark:text-white/62"}`}>/mo</span>
              </div>
              <ul className="mt-7 space-y-3 text-sm font-semibold">
                {["Real-time alerts", "Execution history", "Dashboard insights", "Priority support"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 ${index === 1 ? "text-white" : "text-[#12b9aa]"}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const { theme, toggleTheme } = useAppTheme();
  const isDark = theme === "dark";

  return (
    <main className="min-h-screen overflow-hidden bg-white font-sans text-[#06185a] antialiased dark:bg-[#030814] dark:text-white">
      <section
        id="product"
        className="relative min-h-screen bg-[#f7fbff] pb-5 pt-[170px] dark:bg-[#030814] lg:pt-[148px]"
      >
        <HeroBackground />

        <button
          type="button"
          onClick={toggleTheme}
          className="fixed right-4 top-[118px] z-50 flex h-[50px] w-[50px] items-center justify-center rounded-full border border-[#2468ff]/45 bg-white/80 text-[#06185a] shadow-[0_14px_34px_rgba(9,94,232,0.18)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#12b9aa] dark:border-[#3568e8]/60 dark:bg-[#081427]/84 dark:text-white sm:right-6 lg:right-8 lg:top-[122px]"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <header className="absolute inset-x-0 top-0 z-30">
          <div className="mx-auto flex h-[108px] max-w-[1500px] items-center justify-between px-6">
            <Brand />

            <nav className="hidden items-center gap-7 lg:flex xl:gap-10" aria-label="Main navigation">
              {navItems.map((item) => (
                <NavLink key={item.label} item={item} />
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link
                to="/auth"
                className="hidden h-[52px] items-center whitespace-nowrap rounded-[8px] border border-[#2468ff]/55 px-6 text-[16px] font-bold text-[#06185a] transition hover:border-[#12b9aa] dark:text-white sm:flex"
              >
                Log In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="flex h-[52px] items-center whitespace-nowrap rounded-[8px] bg-[linear-gradient(100deg,#095eff,#12b9aa)] px-6 text-[16px] font-bold text-white shadow-[0_13px_30px_rgba(9,94,232,0.22)] transition hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
          <nav className="mx-auto flex max-w-[1500px] gap-5 overflow-x-auto px-6 pb-3 text-sm font-bold text-[#06185a] dark:text-white/90 lg:hidden" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="shrink-0">
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-8 px-6 lg:grid-cols-[.72fr_1.28fr]">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[#12b9aa]/40 bg-white/70 px-4 py-2 text-[13px] font-bold text-[#06185a] shadow-[0_8px_24px_rgba(14,38,92,0.06)] dark:border-[#12b9aa]/50 dark:bg-[#081427]/85 dark:text-white">
        <span className="relative flex h-[10px] w-[10px]">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#12b9aa] opacity-40" />
          <span className="relative inline-flex h-[10px] w-[10px] rounded-full bg-[#12b9aa] shadow-[0_0_8px_rgba(18,185,170,0.5)]" />
        </span>
              Continuous QA Monitoring
            </div>

            <h2 className="text-5xl xl:text-6xl font-black leading-tight tracking-tight mb-6">
              Always <span className="text-[#12b9aa]">On.</span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                Quality Assured.
              </span>
            </h2>  
            <div className="mt-8 flex flex-wrap gap-5">
              <Link
                to="/auth?mode=signup"
                className="flex h-[58px] items-center gap-5 rounded-[8px] bg-[linear-gradient(100deg,#095eff,#12b9aa)] px-8 text-[17px] font-bold text-white shadow-[0_14px_34px_rgba(9,94,232,0.24)] transition hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <ProcessFlow />
            <StatusBar />
          </div>
        </div>

        <div className="relative z-10 mt-7 lg:hidden">
          <div className="mx-6 rounded-[12px] border border-[#d8e6f5] bg-white/84 p-5 dark:border-white/12 dark:bg-[#0a1428]/88">
            <div className="grid gap-4 sm:grid-cols-2">
              {["1. Test", "2. Detect", "3. Inform", "4. Action"].map((step) => (
                <div key={step} className="rounded-[8px] border border-[#d8e6f5] p-4 text-sm font-extrabold dark:border-white/12">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7">
          <FeatureRail />
          <TechnologyPanel />
        </div>
      </section>

      <section id="solutions" className="bg-white px-6 py-20 dark:bg-[#050d1d]">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#12b9aa]">Solutions</p>
          <h2 className="mt-3 text-4xl font-extrabold text-[#06185a] dark:text-white">Release confidence for every team</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-[#0a1f63]/70 dark:text-white/70">
            Monitor UI flows, API checks, client environments, and action workflows from one operational command center.
          </p>
        </div>
      </section>

      <PricingSection />

      <section id="about" className="bg-white px-6 py-16 dark:bg-[#050d1d]">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-6 border-t border-[#d8e6f5] pt-10 dark:border-white/12 md:flex-row">
          <Brand />
          <p className="text-sm font-medium text-[#0a1f63]/62 dark:text-white/62">
            © 2026 Assuredia QA Monitoring. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}
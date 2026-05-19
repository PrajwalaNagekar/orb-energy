import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, LineChart, HardHat, Building2, Sun, ShieldCheck, Cpu } from "lucide-react";

const apps = [
  {
    to: "/m/customer/splash",
    title: "User App",
    desc: "For Orb Energy customers — track output, savings and impact.",
    icon: LineChart,
    accent: "from-emerald-500 to-teal-600",
    chip: "iOS · Android" },
  {
    to: "/m/tech/splash",
    title: "Technician App",
    desc: "For field engineers — jobs, diagnostics and offline workflows.",
    icon: HardHat,
    accent: "from-orange-500 to-rose-500",
    chip: "Field-ready" },
  {
    to: "/admin/login",
    title: "Admin Panel",
    desc: "For Orb operations — fleet health, customers and analytics.",
    icon: Building2,
    accent: "from-sky-500 to-indigo-600",
    chip: "Web · 2FA" },
] as const;

const pillars = [
  { i: Cpu, l: "Edge IoT" },
  { i: Sparkles, l: "Orb-AI" },
  { i: ShieldCheck, l: "Zero-trust" },
  { i: Sun, l: "Panel-level" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 flex flex-col">
      {/* Decorative gradient orbs (subtle, premium) */}
      <div className="pointer-events-none absolute top-[-200px] right-[-200px] h-[480px] w-[480px] rounded-full bg-emerald-300/30 blur-[120px]" />
      <div className="pointer-events-none absolute top-[100px] left-[-200px] h-[400px] w-[400px] rounded-full bg-sky-300/30 blur-[120px]" />

      <header className="relative px-6 lg:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.55)]">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Orb.Energy</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Unified Ecosystem</span>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          124 sites · 38 MW live
        </span>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
              <Sparkles className="h-3 w-3" /> Powered by Orb-AI v4.2
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight">
              Choose your{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                application
              </span>
            </h1>
            <p className="mt-4 text-slate-600 text-base md:text-lg">
              One unified solar platform · three tailored experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {apps.map((app) => (
              <Link
                key={app.to}
                to={app.to}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 hover:border-slate-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300"
              >
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${app.accent} flex items-center justify-center shadow-lg mb-6`}>
                  <app.icon className="h-7 w-7 text-white" strokeWidth={2.25} />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-2xl font-bold tracking-tight">{app.title}</h2>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">{app.chip}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{app.desc}</p>
                <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:gap-3 transition-all">
                  Open <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>

          {/* Pillars strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pillars.map((p) => (
              <span key={p.l} className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3.5 py-1.5 text-[12px] font-medium text-slate-700 shadow-sm">
                <p.i className="h-3.5 w-3.5 text-emerald-600" /> {p.l}
              </span>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative px-6 py-6 text-center text-xs text-slate-500">
        © 2026 Orb Energy · Unified Solar Ecosystem
      </footer>
    </div>
  );
}

export default Landing;

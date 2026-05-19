import { Link } from "react-router-dom";
import { Wrench, ArrowRight, WifiOff, ClipboardCheck, Sparkles, Shield } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";

function TechWelcome() {
  return (
    <MobileFrame tone="navy" statusBarDark={false}>
      {/* Ambient gradient + grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.45),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative flex-1 flex flex-col px-6 pt-4">
        {/* Brand row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.5)]">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-semibold tracking-tight">Orb.Field</span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-white/55">Technician OS · v3.2</span>
            </div>
          </div>
          <div className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
          </div>
        </div>

        {/* Brand wordmark block */}
        <div className="mt-6">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.22em] text-orange-400">Field operations</span>
          <p className="mt-2 text-[12px] text-white/65">Authorised technician access. GPS &amp; activity audited.</p>
        </div>

        {/* Headline */}
        <h1 className="mt-6 text-[30px] leading-[1.05] font-serif tracking-tight">
          Field intelligence,<br />
          <span className="text-orange-400">engineered for solar.</span>
        </h1>
        <p className="mt-2.5 text-[13px] text-white/65 leading-relaxed">
          Smart dispatch · guided diagnostics · offline‑first capture.
        </p>

        {/* Feature pills */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Pill icon={<Sparkles className="h-3.5 w-3.5" />} t="Orb-AI" />
          <Pill icon={<WifiOff className="h-3.5 w-3.5" />} t="Offline" />
          <Pill icon={<ClipboardCheck className="h-3.5 w-3.5" />} t="Guided" />
        </div>

        <div className="flex-1" />

        {/* CTAs */}
        <div className="space-y-2.5 pb-4">
          <Link
            to="/m/tech/login"
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-[15px] font-bold py-4 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.7)]"
          >
            Sign in with Tech ID <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/m/tech/signup"
            className="block w-full text-center rounded-2xl bg-white/10 backdrop-blur border border-white/15 text-white text-[14px] font-semibold py-3.5"
          >
            Request technician access
          </Link>
          <p className="text-center text-[10px] text-white/45 pt-1 inline-flex items-center justify-center gap-1 w-full">
            <Shield className="h-3 w-3" /> Authorised personnel · GPS &amp; activity logged
          </p>
        </div>
      </div>
    </MobileFrame>
  );
}

function Pill({ icon, t }: { icon: React.ReactNode; t: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 px-2 py-2 flex items-center justify-center gap-1.5 text-white/85">
      <span className="text-orange-400">{icon}</span>
      <span className="text-[11px] font-semibold">{t}</span>
    </div>
  );
}

export default TechWelcome;
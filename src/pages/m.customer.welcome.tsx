import { Link } from "react-router-dom";
import { Sun, ArrowRight, Leaf, Zap, TrendingUp } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";

function Welcome() {
  return (
    <MobileFrame tone="navy" statusBarDark={false}>
      {/* Subtle ambient glows — no yellow */}
      <div className="absolute top-20 -right-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -left-20 h-60 w-60 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />

      <div className="relative flex-1 flex flex-col px-6 pt-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.45)]">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold tracking-tight">Orb.Energy</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/55">Customer</span>
          </div>
        </div>

        {/* Hero — premium emerald orb */}
        <div className="mt-10 mx-auto relative h-40 w-40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300 via-teal-500 to-sky-600 shadow-[0_0_80px_rgba(20,184,166,0.55)]" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-emerald-200/70 to-teal-400/70 backdrop-blur" />
          <div className="absolute inset-7 rounded-full bg-gradient-to-br from-white/90 to-emerald-100" />
          <Sun className="absolute inset-0 m-auto h-12 w-12 text-teal-700" />
        </div>

        <h1 className="mt-8 text-[34px] leading-[1.05] font-serif tracking-tight">
          Your solar,<br />
          <span className="bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-transparent">intelligently managed.</span>
        </h1>
        <p className="mt-3 text-[15px] text-white/70 leading-relaxed">
          Live output, savings and panel health for your Orb solar system.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Pill icon={<Zap className="h-3 w-3" />} label="Live telemetry" />
          <Pill icon={<TrendingUp className="h-3 w-3" />} label="ROI tracking" />
          <Pill icon={<Leaf className="h-3 w-3" />} label="Eco impact" />
        </div>

        <div className="flex-1 min-h-8" />

        <div className="space-y-3 pt-6 pb-4">
          <Link
            to="/m/customer/signup"
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[15px] font-bold py-4 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.7)]"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/m/customer/login"
            className="block w-full text-center rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white text-[15px] font-semibold py-4"
          >
            I already have an account
          </Link>
          <p className="text-center text-[11px] text-white/50 pt-1">
            By continuing you agree to Terms &amp; Privacy.
          </p>
        </div>
      </div>
    </MobileFrame>
  );
}

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 px-3 py-1.5 text-[11px] font-medium text-white/85">
      {icon} {label}
    </span>
  );
}

export default Welcome;
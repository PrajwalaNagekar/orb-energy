import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";

function TechOtp() {
  const navigate = useNavigate();
  const { p } = Object.fromEntries(new URLSearchParams(useLocation().search));
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [seconds, setSeconds] = useState(28);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handle = (i: number, v: string) => {
    const c = v.slice(-1).replace(/\D/g, "");
    const next = [...digits];
    next[i] = c;
    setDigits(next);
    if (c && i < 5) refs.current[i + 1]?.focus();
  };

  const filled = digits.every((d) => d.length === 1);

  return (
    <MobileFrame tone="navy" statusBarDark={false}>
      <div className="absolute top-0 inset-x-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.35),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <header className="relative px-6 pt-2 pb-2 flex items-center">
        <Link to="/m/tech/login" className="h-9 w-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          <ArrowLeft className="h-4 w-4 text-white" />
        </Link>
        <div className="ml-auto flex items-center gap-2 text-white/80">
          <Wrench className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-[12px] font-semibold">Orb.Field</span>
        </div>
      </header>

      <div className="relative px-6 flex-1 flex flex-col">
        {/* Animated badge */}
        <div className="mt-6 mx-auto relative">
          <div className="absolute inset-0 rounded-3xl bg-orange-500/30 blur-2xl animate-pulse" />
          <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-[0_20px_40px_-15px_rgba(249,115,22,0.7)]">
            <ShieldCheck className="h-10 w-10 text-white" />
            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-500 border-2 border-[#0a1428] flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>
        </div>

        <h1 className="mt-7 text-center text-[26px] leading-[1.15] font-serif text-white">
          Verify your<br />Technician ID
        </h1>
        <p className="mt-2 text-center text-[13px] text-white/60">
          We sent a 6‑digit code to your registered device for{" "}
          <span className="font-semibold text-orange-300">{p || "ORB-T-1248"}</span>
        </p>

        {/* OTP boxes */}
        <div className="mt-7 flex items-center justify-center gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              onChange={(e) => handle(i, e.target.value)}
              inputMode="numeric"
              maxLength={1}
              className={`h-14 w-11 text-center text-[22px] font-semibold rounded-2xl bg-white/[0.06] border outline-none transition-all ${d ? "border-orange-400 text-white shadow-[0_0_0_3px_rgba(249,115,22,0.18)]" : "border-white/15 text-white/85"}`}
            />
          ))}
        </div>

        {/* Resend */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[12px] text-white/55">
          {seconds > 0 ? (
            <span>Resend code in <span className="text-orange-300 font-semibold">0:{seconds.toString().padStart(2, "0")}</span></span>
          ) : (
            <button onClick={() => setSeconds(28)} className="text-orange-400 font-semibold">Resend code</button>
          )}
        </div>

        <div className="mt-4 mx-auto rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-[10px] text-white/55 inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          GPS captured · Device fingerprint registered
        </div>

        <div className="flex-1" />

        <button
          disabled={!filled}
          onClick={() => navigate("/m/tech")}
          className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 text-white text-[15px] font-bold py-4 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.7)]"
        >
          Verify &amp; clock in
        </button>

        <button
          onClick={() => { const filled = ["1","2","3","4","5","6"]; setDigits(filled); setTimeout(() => navigate("/m/tech"), 200); }}
          className="mt-2 mb-2 w-full text-center text-[12px] text-white/60 underline"
        >
          Skip (demo)
        </button>
      </div>
    </MobileFrame>
  );
}

export default TechOtp;

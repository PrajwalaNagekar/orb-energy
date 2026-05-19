import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MessageSquareLock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";

function Otp() {
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
    <MobileFrame tone="white">
      <header className="px-6 pt-2 pb-2 flex items-center">
        <Link to="/m/customer/login" className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
          <ArrowLeft className="h-4 w-4 text-slate-700" />
        </Link>
      </header>

      <div className="px-6 flex-1 flex flex-col overflow-hidden">
        {/* Compact icon block — no overlap */}
        <div className="mt-6 mx-auto relative shrink-0">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_15px_30px_-12px_rgba(16,185,129,0.55)]">
            <MessageSquareLock className="h-9 w-9 text-white" />
          </div>
          <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-4 ring-white animate-pulse" />
        </div>

        <h1 className="mt-5 text-center text-[22px] leading-[1.2] font-serif text-slate-900">
          Check your messages
        </h1>
        <p className="mt-1.5 text-center text-[13px] text-slate-600">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-slate-900">+91 {p || "98765 43210"}</span>
        </p>

        {/* OTP boxes */}
        <div className="mt-6 grid grid-cols-6 gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              inputMode="numeric"
              onChange={(e) => handle(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus(); }}
              className={`aspect-square text-center text-[20px] font-bold rounded-2xl outline-none transition-all ${
                d
                  ? "bg-emerald-50 border-2 border-emerald-500 text-slate-900"
                  : "bg-slate-50 border-2 border-slate-200 text-slate-900 focus:border-emerald-500"
              }`}
            />
          ))}
        </div>

        <div className="flex-1 min-h-4" />

        <button
          disabled={!filled}
          onClick={() => navigate("/m/customer")}
          className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 text-[15px] font-bold py-4 shadow-[0_10px_24px_-10px_rgba(16,185,129,0.55)]"
        >
          Verify &amp; continue
        </button>

        <p className="mt-3 mb-4 text-center text-[13px] text-slate-600">
          Didn&apos;t get it?{" "}
          {seconds > 0 ? (
            <span>Resend in <span className="font-bold text-slate-900 tabular-nums">{seconds}s</span></span>
          ) : (
            <button onClick={() => setSeconds(30)} className="font-bold text-emerald-700">Resend code</button>
          )}
        </p>
      </div>
    </MobileFrame>
  );
}

export default Otp;

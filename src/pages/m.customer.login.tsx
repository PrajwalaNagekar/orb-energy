import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sun, IdCard, Check } from "lucide-react";
import { useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";

function Login() {
  const nav = useNavigate();
  const [customerId, setCustomerId] = useState("ORB-IN-2024-0142");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"id" | "phone">("id");

  // Mock validation: ORB-XX-YYYY-NNNN
  const idValid = /^ORB-[A-Z]{2}-\d{4}-\d{3,4}$/i.test(customerId.trim());
  const phoneValid = phone.replace(/\s/g, "").length >= 10;

  return (
    <MobileFrame tone="white">
      {/* Cooler hero band — emerald, less yellow */}
      <div className="relative px-6 pt-2 pb-8 bg-gradient-to-br from-[#0f2027] via-[#1f4068] to-emerald-700 text-white rounded-b-[2rem] -mt-1">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-400/30 blur-3xl pointer-events-none" />
        <div className="relative flex items-center justify-between pt-2">
          <Link to="/m/customer/welcome" className="h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 text-white" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
              <Sun className="h-4 w-4 text-white" />
            </div>
            <span className="text-[13px] font-semibold">Orb.Energy</span>
          </div>
        </div>

        <h1 className="relative mt-7 text-[26px] leading-[1.15] font-serif">
          Welcome back,<br />sunshine.
        </h1>
        <p className="relative mt-2 text-[13px] text-white/75">
          {step === "id"
            ? "Enter your Orb Customer ID to continue."
            : "We'll text a verification code to your registered phone."}
        </p>

        {/* Step indicator */}
        <div className="relative mt-4 flex items-center gap-2 text-[10px] uppercase tracking-wider">
          <Step n={1} label="Customer ID" active={step === "id"} done={step === "phone"} />
          <span className="h-px w-6 bg-white/30" />
          <Step n={2} label="Phone OTP" active={step === "phone"} done={false} />
        </div>
      </div>

      {/* Form */}
      <div className="px-6 pt-6 flex-1 flex flex-col">
        {step === "id" ? (
          <>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.14em]">Orb Customer ID</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border-2 border-slate-200 focus-within:border-emerald-500 bg-white px-4 py-4 transition-colors">
              <IdCard className="h-4 w-4 text-emerald-600" />
              <input
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value.toUpperCase())}
                placeholder="ORB-IN-2024-0142"
                className="flex-1 outline-none bg-transparent text-[16px] tracking-wider font-mono text-slate-900"
              />
              {idValid && <Check className="h-4 w-4 text-emerald-600" />}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Find your ID on your Orb welcome email or installation handover.
            </p>

            <div className="flex-1" />

            <button
              disabled={!idValid}
              onClick={() => setStep("phone")}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 text-[15px] font-bold py-4 shadow-[0_10px_24px_-10px_rgba(16,185,129,0.55)]"
            >
              Continue
            </button>

            <p className="mt-4 mb-2 text-center text-[13px] text-slate-600">
              New here?{" "}
              <Link to="/m/customer/signup" className="font-bold text-emerald-700">Create an account</Link>
            </p>
          </>
        ) : (
          <>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <div className="text-[12px] text-emerald-900 font-medium flex-1">
                Customer ID verified · <span className="font-mono">{customerId}</span>
              </div>
              <button onClick={() => setStep("id")} className="text-[11px] font-semibold text-emerald-700">Change</button>
            </div>

            <label className="mt-5 text-[11px] font-bold text-slate-500 uppercase tracking-[0.14em]">Mobile number</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border-2 border-slate-200 focus-within:border-emerald-500 bg-white px-4 py-4 transition-colors">
              <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                <span className="text-[16px]">🇮🇳</span>
                <span className="text-slate-800 font-semibold text-[15px]">+91</span>
              </div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="numeric"
                placeholder="98765 43210"
                className="flex-1 outline-none bg-transparent text-[17px] tracking-wide text-slate-900"
              />
            </div>

            <div className="flex-1" />

            <button
              disabled={!phoneValid}
              onClick={() => nav(`/m/customer/otp?p=${encodeURIComponent(phone)}`)}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 text-[15px] font-bold py-4 shadow-[0_10px_24px_-10px_rgba(16,185,129,0.55)]"
            >
              Send OTP
            </button>
          </>
        )}
      </div>
    </MobileFrame>
  );
}

function Step({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 ${active || done ? "text-white" : "text-white/45"}`}>
      <span
        className={`h-5 w-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${
          done ? "bg-emerald-500 text-white" : active ? "bg-white text-emerald-700" : "bg-white/15"
        }`}
      >
        {done ? "✓" : n}
      </span>
      <span className="font-semibold">{label}</span>
    </div>
  );
}

export default Login;

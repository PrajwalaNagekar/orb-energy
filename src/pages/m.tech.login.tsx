import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, IdCard, Lock, Wrench, Fingerprint, Eye, EyeOff, ChevronDown } from "lucide-react";
import { useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";

function TechLogin() {
  const nav = useNavigate();
  const [techId, setTechId] = useState("ORB-T-1248");
  const [pin, setPin] = useState("•••••");
  const [region, setRegion] = useState("Chennai South");
  const [showPin, setShowPin] = useState(false);
  const valid = techId.length >= 4 && pin.length >= 4;

  return (
    <MobileFrame tone="navy" statusBarDark={false}>
      {/* Background art */}
      <div className="absolute top-0 inset-x-0 h-80 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.4),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <header className="relative px-6 pt-2 pb-2 flex items-center justify-between">
        <Link to="/m/tech/welcome" className="h-9 w-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          <ArrowLeft className="h-4 w-4 text-white" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-orange-500 flex items-center justify-center">
            <Wrench className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[13px] font-semibold text-white">Orb.Field</span>
        </div>
      </header>

      <div className="relative px-6 flex-1 flex flex-col pb-4">
        <div className="mt-3">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.22em] text-orange-400">Technician portal</span>
          <h1 className="mt-1.5 text-[22px] leading-[1.15] font-serif text-white">
            Clock in, get to work.
          </h1>
          <p className="mt-1 text-[12px] text-white/65">
            Use your Orb Technician ID and field PIN.
          </p>
        </div>

        <div className="mt-3 space-y-2">
          <TechField
            icon={<IdCard className="h-4 w-4" />}
            label="Technician ID"
            value={techId}
            onChange={setTechId}
          />
          <TechField
            icon={<Lock className="h-4 w-4" />}
            label="Field PIN"
            value={pin}
            onChange={setPin}
            type={showPin ? "text" : "password"}
            trailing={
              <button onClick={() => setShowPin((v) => !v)} className="text-white/55">
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <div>
            <label className="block text-[10px] font-bold text-white/55 uppercase tracking-[0.14em] mb-1">Service region</label>
            <button className="w-full flex items-center justify-between rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-2.5 text-[13.5px] text-white">
              <span>{region}</span>
              <ChevronDown className="h-4 w-4 text-white/55" />
            </button>
          </div>
        </div>

        <button className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-2 text-[12px] font-semibold text-white/80">
          <Fingerprint className="h-4 w-4 text-orange-400" /> Use biometric · last login 2h ago
        </button>

        <div className="flex-1 min-h-2" />

        <button
          disabled={!valid}
          onClick={() => nav(`/m/tech/otp?p=${encodeURIComponent(techId)}`)}
          className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 text-white text-[15px] font-bold py-3.5 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.7)]"
        >
          Verify &amp; continue
        </button>

        <p className="mt-2 text-center text-[12px] text-white/65">
          New technician?{" "}
          <Link to="/m/tech/signup" className="font-bold text-orange-400">Request access</Link>
        </p>
      </div>
    </MobileFrame>
  );
}

function TechField({ icon, label, value, onChange, type = "text", trailing }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string; trailing?: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-white/55 uppercase tracking-[0.14em] mb-1.5">{label}</label>
      <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] border border-white/10 focus-within:border-orange-400 px-4 py-3.5 transition-colors">
        <span className="text-orange-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 outline-none bg-transparent text-[15px] text-white placeholder:text-white/30"
        />
        {trailing}
      </div>
    </div>
  );
}

export default TechLogin;

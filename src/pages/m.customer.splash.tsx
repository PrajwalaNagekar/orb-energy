import { useNavigate } from "react-router-dom";
import { Sun } from "lucide-react";
import { useEffect } from "react";
import { MobileFrame } from "@/components/MobileFrame";

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/m/customer/welcome"), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <MobileFrame tone="sunset" statusBarDark={false}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,200,100,0.45),transparent_55%)] pointer-events-none" />
      <div className="relative flex-1 flex flex-col items-center justify-between px-6 pt-16 pb-20">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 shadow-[0_0_80px_rgba(251,176,59,0.7)] animate-pulse" />
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-amber-200 to-orange-400 flex items-center justify-center">
              <Sun className="h-12 w-12 text-[#1a0f2e]" />
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-1 w-6 -translate-y-1/2 rounded-full bg-amber-200/80"
                style={{ transform: `translate(-50%,-50%) rotate(${i * 45}deg) translateX(78px)` }}
              />
            ))}
          </div>

          <h1 className="mt-10 text-[40px] font-serif tracking-tight bg-gradient-to-r from-amber-200 via-orange-200 to-amber-100 bg-clip-text text-transparent">
            Orb.Energy
          </h1>
          <p className="mt-2 text-[13px] uppercase tracking-[0.3em] text-white/60">Unified Solar</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="h-1 w-32 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-300 to-orange-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: "60%" }} />
          </div>
          <span className="text-[11px] text-white/45">Powering up your dashboard…</span>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(180%); }
        }
      `}</style>
    </MobileFrame>
  );
}

export default Splash;

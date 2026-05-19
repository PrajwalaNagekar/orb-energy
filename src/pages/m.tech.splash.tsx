import { useNavigate } from "react-router-dom";
import { Wrench } from "lucide-react";
import { useEffect } from "react";
import { MobileFrame } from "@/components/MobileFrame";

function TechSplash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/m/tech/welcome"), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <MobileFrame tone="navy" statusBarDark={false}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(249,115,22,0.45),transparent_55%)] pointer-events-none" />
      <div className="relative flex-1 flex flex-col items-center justify-between px-6 pt-16 pb-20">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-orange-400 to-amber-600 shadow-[0_0_80px_rgba(249,115,22,0.7)] animate-pulse rotate-6" />
            <div className="absolute inset-3 rounded-[1.6rem] bg-gradient-to-br from-orange-300 to-amber-500 flex items-center justify-center -rotate-6">
              <Wrench className="h-12 w-12 text-[#1a0f2e]" />
            </div>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="mt-10 text-[40px] font-serif tracking-tight bg-gradient-to-r from-amber-200 via-orange-200 to-amber-100 bg-clip-text text-transparent">
            Orb.Field
          </h1>
          <p className="mt-2 text-[13px] uppercase tracking-[0.3em] text-white/60">Technician</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="h-1 w-32 rounded-full bg-white/15 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-amber-300 to-orange-500 rounded-full animate-[loadingT_2s_ease-in-out_infinite]" />
          </div>
          <span className="text-[11px] text-white/45">Syncing routes &amp; jobs…</span>
        </div>
      </div>
      <style>{`
        @keyframes loadingT {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(220%); }
        }
      `}</style>
    </MobileFrame>
  );
}

export default TechSplash;

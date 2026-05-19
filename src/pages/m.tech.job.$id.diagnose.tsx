import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Camera, PenLine, Package, ArrowRight, WifiOff, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

const steps = [
  { t: "Visual inspection", done: true },
  { t: "Voltage at MPPT 1", done: true, v: "412 V · OK" },
  { t: "Voltage at MPPT 2", done: true, v: "0 V · FAIL" },
  { t: "Replace PCB-A2", done: false },
  { t: "Re-test & sign-off", done: false },
];

function Diagnose() {
  const { id } = useParams();
  return (
    <MobileShell theme="tech">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to={`/m/tech/job/${id}`} className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">{id}</p>
          <h1 className="text-lg font-semibold">Diagnostics</h1>
        </div>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-amber-600"><WifiOff className="h-3 w-3" /> Offline</div>
      </header>

      <div className="px-5 space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-3/5 bg-orange-500" />
          </div>
          <span className="font-semibold">3/5</span>
        </div>

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Checklist</p>
        <div className="space-y-1.5">
          {steps.map((s, i) => (
            <div key={i} className={`rounded-xl p-3 flex items-center gap-3 ${s.done ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"}`}>
              <CheckCircle2 className={`h-5 w-5 shrink-0 ${s.done ? "text-emerald-600" : "text-slate-300"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${s.done ? "text-slate-700 dark:text-slate-200 line-through" : "text-slate-900 dark:text-white"}`}>{s.t}</p>
                {s.v && <p className={`text-[11px] mt-0.5 ${s.v.includes("FAIL") ? "text-rose-600 font-semibold" : "text-slate-500"}`}>{s.v}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-3">
          <p className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold inline-flex items-center gap-1"><Sparkles className="h-3 w-3" /> Orb-AI</p>
          <p className="text-xs text-amber-900 dark:text-amber-100 mt-1">MPPT-2 string voltage = 0. PCB-A2 failure confirmed at 92% confidence.</p>
        </div>

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-3">Field capture</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { i: Camera, l: "Photo", c: "bg-sky-500" },
            { i: PenLine, l: "Sign", c: "bg-violet-500" },
            { i: Package, l: "Parts", c: "bg-amber-500" },
          ].map((a) => (
            <button key={a.l} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex flex-col items-center gap-1.5">
              <div className={`h-9 w-9 rounded-lg ${a.c} flex items-center justify-center`}><a.i className="h-4 w-4 text-white" /></div>
              <span className="text-[10px] font-semibold">{a.l}</span>
            </button>
          ))}
        </div>

        <Link to={`/m/tech/job/${id}/complete`} className="mt-3 block w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm py-3.5 text-center inline-flex items-center justify-center gap-2">
          Continue <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="text-[10px] text-center text-slate-500">3 actions queued · auto-sync when online</p>
      </div>
    </MobileShell>
  );
}

export default Diagnose;

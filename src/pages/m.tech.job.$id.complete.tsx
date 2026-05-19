import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, PenLine, Camera } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

function Complete() {
  const { id } = useParams();
  return (
    <MobileShell theme="tech">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to={`/m/tech/job/${id}/diagnose`} className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Complete job</h1>
      </header>

      <div className="px-5 space-y-4">
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-4 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">All checks passed</p>
            <p className="text-[11px] text-emerald-700/80">Output restored to 100%.</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Work summary</p>
          <textarea
            className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-sm border border-slate-200 dark:border-slate-700 outline-none resize-none"
            rows={4}
            defaultValue="Replaced PCB-A2 on inverter MPPT-2 string. Voltage restored from 0V → 414V. System running normally."
          />
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Parts used</p>
          <div className="flex items-center justify-between text-sm">
            <span>PCB-A2 inverter board</span>
            <span className="font-semibold">× 1</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col items-center gap-2">
            <Camera className="h-5 w-5 text-sky-500" />
            <span className="text-xs font-semibold">3 photos</span>
          </button>
          <button className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col items-center gap-2">
            <PenLine className="h-5 w-5 text-violet-500" />
            <span className="text-xs font-semibold">Customer sign</span>
          </button>
        </div>

        <Link to="/m/tech" className="block w-full rounded-xl bg-emerald-500 text-white font-semibold text-sm py-3.5 text-center">
          Submit & sync
        </Link>
      </div>
    </MobileShell>
  );
}

export default Complete;

import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Wrench, Camera, Package, AlertTriangle, ChevronRight, User } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

function JobDetail() {
  const { id } = useParams();
  return (
    <MobileShell theme="tech">
      <div className="bg-slate-900 text-white px-5 pt-12 pb-5">
        <div className="flex items-center gap-2">
          <Link to="/m/tech" className="p-1 -ml-1"><ArrowLeft className="h-4 w-4" /></Link>
          <p className="text-xs font-semibold">{id} · Apollo Hospitals</p>
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2 text-[10px]">
            <span className="bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded">P1</span>
            <span className="text-white/60 inline-flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> SLA 38m</span>
          </div>
          <p className="text-base font-semibold mt-1.5">Replace inverter PCB</p>
          <p className="text-[11px] text-white/60 mt-0.5 inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> Chennai · Block C, Roof 4</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="rounded-lg bg-emerald-500 text-white text-xs font-semibold py-2 inline-flex items-center justify-center gap-1.5"><Phone className="h-3 w-3" /> Call site</button>
          <button className="rounded-lg bg-white/10 text-white text-xs font-semibold py-2 inline-flex items-center justify-center gap-1.5"><MapPin className="h-3 w-3" /> Navigate</button>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Site contact</p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center"><User className="h-4 w-4 text-slate-500" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Suresh Kumar</p>
              <p className="text-[11px] text-slate-500">Facilities · +91 98xxx xxx21</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Reported issue</p>
          <p className="text-sm">Inverter MPPT-2 string showing 0V since 06:42. Auto-detected by Orb-AI. Customer notified.</p>
        </div>

        <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-3">
          <p className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">Orb-AI suggestion</p>
          <p className="text-xs text-amber-900 dark:text-amber-100 mt-1">PCB-A2 failure confirmed at 92% confidence. Spare in van bin #4.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link to={`/m/tech/job/${id}/diagnose`} className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
            <div>
              <Wrench className="h-5 w-5 text-amber-500 mb-2" />
              <p className="text-sm font-semibold">Diagnostics</p>
              <p className="text-[11px] text-slate-500">5 steps</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>
          <Link to="/m/tech/parts" className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
            <div>
              <Package className="h-5 w-5 text-violet-500 mb-2" />
              <p className="text-sm font-semibold">Parts</p>
              <p className="text-[11px] text-slate-500">Van inventory</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>
        </div>

        <Link to={`/m/tech/job/${id}/diagnose`} className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm py-3.5 text-center">
          Start job
        </Link>
      </div>
    </MobileShell>
  );
}

export default JobDetail;

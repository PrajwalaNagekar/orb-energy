import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, ChevronRight, MapPin } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

const items = [
  { id: "JOB-7821", t: "Replace inverter PCB", c: "Apollo Hospitals", a: "Chennai", sla: "38m", reason: "Hospital critical load · backup running on diesel" },
  { id: "JOB-7799", t: "Earth-fault investigation", c: "Mahindra Plant", a: "Pune", sla: "1h 12m", reason: "Customer escalated · 2nd visit" },
];

function Escalations() {
  return (
    <MobileShell theme="tech">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/tech" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Escalations</h1>
        <span className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full bg-rose-100 text-rose-700">{items.length}</span>
      </header>

      <div className="px-5 space-y-3">
        {items.map((j) => (
          <Link key={j.id} to={`/m/tech/job/${j.id}`} className="block rounded-2xl bg-white dark:bg-slate-800 border-l-4 border-rose-500 border-y border-r border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center"><AlertTriangle className="h-5 w-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">P1 · ESCALATED</span>
                  <span className="text-[10px] text-rose-600 font-semibold">SLA {j.sla}</span>
                </div>
                <p className="text-sm font-semibold mt-1.5">{j.t}</p>
                <p className="text-[11px] text-slate-500 inline-flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {j.c} · {j.a}</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 italic">"{j.reason}"</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </MobileShell>
  );
}

export default Escalations;

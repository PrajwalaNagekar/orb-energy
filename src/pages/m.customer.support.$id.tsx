import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, MessageCircle } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

const steps = [
  { t: "Ticket created", d: "Auto-detected by Orb-AI", done: true, time: "Mon 09:12" },
  { t: "Diagnosed", d: "Soiling — cleaning needed", done: true, time: "Mon 09:13" },
  { t: "Technician assigned", d: "Arjun M. · Level 2", done: true, time: "Mon 11:40" },
  { t: "Visit scheduled", d: "Friday · 11:00", done: true, time: "Mon 11:42" },
  { t: "On-site", d: "—", done: false },
  { t: "Resolved", d: "—", done: false },
];

function Ticket() {
  const { id } = useParams();
  return (
    <MobileShell theme="customer">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/customer/support" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Ticket</p>
          <h1 className="text-lg font-semibold">{id}</h1>
        </div>
        <span className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">SCHEDULED</span>
      </header>

      <div className="px-5">
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-sm font-semibold">Panel C-12 cleaning</p>
          <p className="text-[11px] text-slate-500 mt-1">Output drop of 28% detected. Cleaning will restore performance.</p>
        </div>

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-5 mb-2">Progress</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  {s.done ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                  {i < steps.length - 1 && <div className={`w-px flex-1 ${s.done ? "bg-emerald-300" : "bg-slate-200"}`} />}
                </div>
                <div className="pb-3 flex-1">
                  <p className={`text-sm font-medium ${s.done ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>{s.t}</p>
                  <p className="text-[11px] text-slate-500">{s.d} {s.time && `· ${s.time}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="mt-5 w-full rounded-xl bg-emerald-500 text-white font-semibold text-sm py-3.5 inline-flex items-center justify-center gap-2">
          <MessageCircle className="h-4 w-4" /> Message technician
        </button>
      </div>
    </MobileShell>
  );
}

export default Ticket;

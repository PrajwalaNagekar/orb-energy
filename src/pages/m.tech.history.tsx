import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, MapPin, Star } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

const history = [
  { id: "JOB-7820", c: "Wipro Campus", t: "Quarterly inspection", date: "Yesterday", rating: 5 },
  { id: "JOB-7819", c: "Axis Bank HQ", t: "Inverter firmware update", date: "Yesterday", rating: 5 },
  { id: "JOB-7815", c: "Jubilant Foods", t: "Panel replacement × 2", date: "30 Aug", rating: 4 },
  { id: "JOB-7812", c: "DLF Cyber City", t: "BMS reset", date: "29 Aug", rating: 5 },
  { id: "JOB-7808", c: "Mahindra Plant", t: "Earth-fault diagnosis", date: "28 Aug", rating: 5 },
];

function History() {
  return (
    <MobileShell theme="tech">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/tech" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">History</h1>
      </header>

      <div className="px-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { k: "142", l: "Closed" },
            { k: "98%", l: "SLA" },
            { k: "4.9", l: "Rating" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <div className="text-base font-bold">{s.k}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-5 mb-2">Recent</p>
        <div className="space-y-2">
          {history.map((h) => (
            <div key={h.id} className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle2 className="h-4 w-4" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{h.t}</p>
                <p className="text-[11px] text-slate-500 inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {h.c}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{h.id} · {h.date}</p>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: h.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-500" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}

export default History;

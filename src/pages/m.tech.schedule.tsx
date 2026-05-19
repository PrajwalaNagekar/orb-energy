import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

const days = [
  { d: "Mon", n: 9, today: false },
  { d: "Tue", n: 10, today: true },
  { d: "Wed", n: 11, today: false },
  { d: "Thu", n: 12, today: false },
  { d: "Fri", n: 13, today: false },
  { d: "Sat", n: 14, today: false },
  { d: "Sun", n: 15, today: false },
];

const slots = [
  { time: "09:00", t: "Travel to Apollo", c: "bg-slate-100 text-slate-600", dur: "45m" },
  { time: "10:30", t: "JOB-7821 · Replace PCB", c: "bg-rose-100 text-rose-700", dur: "1h 30m" },
  { time: "12:00", t: "JOB-7822 · Cleaning 84 panels", c: "bg-amber-100 text-amber-700", dur: "2h" },
  { time: "14:30", t: "JOB-7823 · Output drop", c: "bg-rose-100 text-rose-700", dur: "1h" },
  { time: "16:00", t: "Lunch & paperwork", c: "bg-slate-100 text-slate-600", dur: "45m" },
  { time: "17:00", t: "JOB-7820 · Inspection", c: "bg-slate-100 text-slate-700", dur: "1h" },
];

function Schedule() {
  return (
    <MobileShell theme="tech">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/tech" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Schedule</h1>
        <Calendar className="ml-auto h-4 w-4 text-slate-400" />
      </header>

      <div className="px-5">
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">September 2026</p>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => (
            <button key={d.n} className={`rounded-xl py-2.5 ${d.today ? "bg-orange-500 text-white" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"}`}>
              <p className="text-[9px] uppercase tracking-wider">{d.d}</p>
              <p className="text-base font-bold mt-0.5">{d.n}</p>
            </button>
          ))}
        </div>

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-5 mb-2">Today · 6 slots</p>
        <div className="space-y-2">
          {slots.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-12 shrink-0 text-right">
                <p className="text-xs font-semibold text-slate-500">{s.time}</p>
              </div>
              <div className={`flex-1 rounded-xl p-3 ${s.c}`}>
                <p className="text-sm font-semibold">{s.t}</p>
                <p className="text-[10px] mt-0.5 opacity-80 inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {s.dur}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}

export default Schedule;

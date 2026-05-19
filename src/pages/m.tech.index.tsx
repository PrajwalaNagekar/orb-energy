import { Link } from "react-router-dom";
import { MapPin, Clock, ChevronRight, AlertTriangle, Wifi, Sparkles, TrendingUp, Navigation, IdCard } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useTechProfile } from "@/lib/tech-profile";

function TechJobsWrap() {
  return (
    <MobileShell theme="tech">
      <TechJobs />
    </MobileShell>
  );
}

const jobs = [
  { id: "JOB-7821", p: "P1", t: "Replace inverter PCB", c: "Apollo Hospitals", a: "Chennai · 2.4 km", e: "10:30", urgent: true },
  { id: "JOB-7822", p: "P2", t: "Panel cleaning · 84 units", c: "InfoEdge Tower", a: "Noida · 6.1 km", e: "12:00" },
  { id: "JOB-7823", p: "P1", t: "Investigate output drop", c: "Godrej Logistics", a: "Pune · 14 km", e: "14:30" },
  { id: "JOB-7824", p: "P3", t: "Quarterly inspection", c: "Tata Coffee Estates", a: "Coorg", e: "Tomorrow" },
  { id: "JOB-7825", p: "P2", t: "Battery diagnostics", c: "Reliance Mart", a: "Mumbai · 22 km", e: "Tomorrow" },
];

// Operational chart data - completion rate over last 7 days
const trend = [82, 88, 95, 91, 96, 98, 99];
const workload = [
  { d: "Mon", v: 4 }, { d: "Tue", v: 6 }, { d: "Wed", v: 5 }, { d: "Thu", v: 7 }, { d: "Fri", v: 5 }, { d: "Sat", v: 3 }, { d: "Sun", v: 0 },
];

function TechJobs() {
  const { profile } = useTechProfile();
  const openP1 = jobs.filter((j) => j.p === "P1").length;
  const utilisation = Math.round((jobs.length / profile.maxJobsPerDay) * 100);
  const earnings = jobs.length * 1640;

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-amber-600 text-white px-5 pt-12 pb-7 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[11px] text-white/85">Good morning</p>
            <p className="text-base font-semibold">{profile.name} · {profile.level} Tech</p>
            <p className="mt-0.5 text-[10px] text-white/75 inline-flex items-center gap-1 font-mono">
              <IdCard className="h-3 w-3" /> {profile.techId}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/30 backdrop-blur rounded-full px-2 py-1 border border-emerald-300/20">
            <Wifi className="h-3 w-3" />
            <span className="text-[10px] font-semibold">Online</span>
          </div>
        </div>
        <div className="relative mt-5 grid grid-cols-3 gap-2.5">
          {[
            { k: jobs.length.toString(), v: "Jobs" },
            { k: `${profile.slaPct}%`, v: "SLA" },
            { k: `₹ ${(earnings/1000).toFixed(1)}k`, v: "Today" },
          ].map((s) => (
            <div key={s.v} className="bg-white/15 backdrop-blur rounded-xl p-2.5 border border-white/15">
              <div className="text-xl font-bold">{s.k}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/85">{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation banner */}
      <div className="px-5 mt-3">
        <Link to="/m/tech/escalations" className="rounded-2xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900 p-3.5 flex items-center gap-3 shadow-md">
          <div className="h-9 w-9 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0"><Sparkles className="h-4 w-4" /></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">2 escalations need attention</p>
            <p className="text-[11px] text-slate-500">SLA at risk · tap to triage</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
        </Link>
      </div>

      {/* Operational KPI strip */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Day utilisation</p>
            <span className="text-[10px] font-bold text-orange-600">{utilisation}%</span>
          </div>
          <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ width: `${Math.min(utilisation,100)}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5">{jobs.length} of {profile.maxJobsPerDay} max jobs</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Critical (P1)</p>
            <span className={`text-[10px] font-bold ${openP1 > 1 ? "text-rose-600" : "text-emerald-600"}`}>{openP1} open</span>
          </div>
          <div className="mt-2 flex items-end gap-0.5 h-8">
            {workload.map((w, i) => (
              <div key={i} className="flex-1 bg-orange-500/80 rounded-sm" style={{ height: `${(w.v/7)*100}%` }} title={`${w.d}: ${w.v}`} />
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Last 7 days workload</p>
        </div>
      </div>

      {/* Completion trend */}
      <div className="px-5 mt-3">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Completion rate · 7 days</p>
              <p className="text-2xl font-bold mt-1">{trend[trend.length-1]}%</p>
            </div>
            <div className="text-right text-emerald-400">
              <TrendingUp className="h-5 w-5 ml-auto" />
              <p className="text-[10px] mt-1">+17 pts</p>
            </div>
          </div>
          <Sparkline data={trend} />
        </div>
      </div>

      {/* Route summary */}
      <div className="px-5 mt-3">
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center text-white"><Navigation className="h-4 w-4" /></div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Optimised route ready</p>
            <p className="text-[11px] text-slate-500">5 stops · 44.7 km · est. 6h 40m</p>
          </div>
          <button className="text-[11px] font-bold text-sky-600">Open</button>
        </div>
      </div>

      {/* Dispatch list */}
      <div className="px-5 mt-5 space-y-2.5 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Today's dispatch</p>
          <span className="text-[10px] text-slate-400">{jobs.length} jobs</span>
        </div>
        {jobs.map((j) => (
          <Link
            key={j.id}
            to={`/m/tech/job/${j.id}`}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex items-start gap-3 border-l-4"
            style={{ borderLeftColor: j.p === "P1" ? "#ef4444" : j.p === "P2" ? "#f59e0b" : "#94a3b8" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${j.p === "P1" ? "bg-rose-100 text-rose-700" : j.p === "P2" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{j.p}</span>
                {j.urgent && <span className="text-[10px] text-rose-600 inline-flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> SLA 38m</span>}
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{j.t}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{j.c}</p>
              <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{j.a}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{j.e}</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </Link>
        ))}
      </div>
    </>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-3 w-full h-16">
      <defs>
        <linearGradient id="trendG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,100 ${pts} 100,100`} fill="url(#trendG)" stroke="none" />
      <polyline points={pts} fill="none" stroke="#34d399" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default TechJobsWrap;

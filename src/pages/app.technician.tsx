import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, ChevronRight, CheckCircle2, Camera, PenLine, Package, Phone, AlertTriangle, Wrench, Briefcase, User, Wifi, WifiOff, ArrowRight } from "lucide-react";

function TechnicianApp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-5xl flex items-center justify-between mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Back to ecosystem
        </Link>
        <div className="text-xs text-slate-500">Technician App · Live preview</div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Phone 1 — Job dispatch */}
        <PhoneFrame label="Today's jobs">
          <div className="bg-gradient-to-b from-orange-500 via-amber-500 to-amber-600 text-white px-5 pt-12 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-white/80">Good morning</p>
                <p className="text-base font-semibold">Arjun Mehta · L2 Tech</p>
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/30 backdrop-blur rounded-full px-2 py-1">
                <Wifi className="h-3 w-3" />
                <span className="text-[10px] font-semibold">Online</span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { k: "5", v: "Jobs" },
                { k: "98%", v: "SLA" },
                { k: "₹ 8.2k", v: "Earnings" },
              ].map((s) => (
                <div key={s.v} className="bg-white/15 backdrop-blur rounded-xl p-2.5">
                  <div className="text-xl font-bold">{s.k}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/70">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-5 -mt-3 space-y-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-2">Next dispatch</div>
            {[
              { p: "P1", t: "Replace inverter PCB", c: "Apollo Hospitals", a: "Chennai · 2.4 km", e: "10:30", urgent: true },
              { p: "P2", t: "Panel cleaning · 84 units", c: "InfoEdge Tower", a: "Noida · 6.1 km", e: "12:00" },
              { p: "P1", t: "Investigate output drop", c: "Godrej Logistics", a: "Pune · 14 km", e: "14:30" },
              { p: "P3", t: "Quarterly inspection", c: "Tata Coffee Estates", a: "Coorg", e: "Tomorrow" },
            ].map((j, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4 flex items-start gap-3 border-l-4" style={{ borderLeftColor: j.p === "P1" ? "#ef4444" : j.p === "P2" ? "#f59e0b" : "#94a3b8" }}>
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
              </div>
            ))}
          </div>
          <BottomNav active="jobs" />
        </PhoneFrame>

        {/* Phone 2 — Job detail / diagnostic */}
        <PhoneFrame label="Diagnostic workflow">
          <div className="bg-slate-900 text-white px-5 pt-12 pb-5">
            <div className="flex items-center gap-2">
              <button className="p-1 -ml-1"><ArrowLeft className="h-4 w-4" /></button>
              <p className="text-xs font-semibold">JOB-7821 · Apollo Hospitals</p>
              <div className="ml-auto flex items-center gap-1 text-[10px] text-amber-300"><WifiOff className="h-3 w-3" /> Offline</div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded">P1</span>
                <span className="text-white/60">SLA 38m · escalated</span>
              </div>
              <p className="text-base font-semibold mt-1.5">Replace inverter PCB</p>
              <p className="text-[11px] text-white/60 mt-0.5 inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> Chennai · Block C, Roof 4</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="rounded-lg bg-emerald-500 text-white text-xs font-semibold py-2 inline-flex items-center justify-center gap-1.5"><Phone className="h-3 w-3" /> Call site</button>
              <button className="rounded-lg bg-white/10 text-white text-xs font-semibold py-2 inline-flex items-center justify-center gap-1.5"><MapPin className="h-3 w-3" /> Navigate</button>
            </div>
          </div>

          <div className="px-5 py-4 space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Diagnostic checklist</p>
              <div className="mt-2 space-y-1.5">
                {[
                  { t: "Visual inspection", done: true },
                  { t: "Voltage at MPPT 1", done: true, v: "412 V · OK" },
                  { t: "Voltage at MPPT 2", done: true, v: "0 V · FAIL" },
                  { t: "Replace PCB-A2", done: false },
                  { t: "Re-test & sign-off", done: false },
                ].map((s, i) => (
                  <div key={i} className={`rounded-lg p-2.5 flex items-center gap-3 ${s.done ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-slate-50 dark:bg-slate-800"}`}>
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${s.done ? "text-emerald-600" : "text-slate-300"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${s.done ? "text-slate-700 dark:text-slate-200 line-through" : "text-slate-900 dark:text-white"}`}>{s.t}</p>
                      {s.v && <p className={`text-[10px] mt-0.5 ${s.v.includes("FAIL") ? "text-rose-600 font-semibold" : "text-slate-500"}`}>{s.v}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-3">
              <p className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">Orb-AI suggestion</p>
              <p className="text-xs text-amber-900 dark:text-amber-100 mt-1">MPPT-2 string voltage = 0. PCB-A2 failure confirmed at 92% confidence. Spare part in van bin #4.</p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Field capture</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { i: Camera, l: "Photo", c: "bg-sky-500" },
                  { i: PenLine, l: "Sign", c: "bg-violet-500" },
                  { i: Package, l: "Parts", c: "bg-amber-500" },
                ].map((a) => (
                  <button key={a.l} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex flex-col items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className={`h-8 w-8 rounded-lg ${a.c} flex items-center justify-center`}><a.i className="h-4 w-4 text-white" /></div>
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">{a.l}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm py-3 inline-flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
              Complete & sync <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-[10px] text-center text-slate-500">3 actions queued · auto-sync when online</p>
          </div>
          <BottomNav active="job" />
        </PhoneFrame>
      </div>
    </div>
  );
}

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[330px] h-[680px] rounded-[3rem] border-[12px] border-slate-900 bg-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 h-6 w-28 rounded-full bg-slate-900" />
        <div className="h-full w-full overflow-y-auto bg-white dark:bg-slate-900 scrollbar-hide">{children}</div>
      </div>
      <div className="mt-3 text-xs text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function BottomNav({ active }: { active: string }) {
  const items = [
    { k: "jobs", i: Briefcase, l: "Jobs" },
    { k: "job", i: Wrench, l: "Active" },
    { k: "parts", i: Package, l: "Parts" },
    { k: "me", i: User, l: "Me" },
  ];
  return (
    <div className="sticky bottom-0 mt-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around">
      {items.map((it) => (
        <button key={it.k} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${active === it.k ? "text-orange-500" : "text-slate-400"}`}>
          <it.i className="h-4 w-4" />
          <span className="text-[9px] font-medium">{it.l}</span>
        </button>
      ))}
    </div>
  );
}

export default TechnicianApp;
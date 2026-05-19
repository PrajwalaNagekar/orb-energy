import { Link, Outlet , useLocation } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Info, CheckCircle2, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useScenario } from "@/lib/scenario";
import { useMemo } from "react";

type Alert = {
  id: string;
  sev: "high" | "med" | "info" | "ok";
  t: string;
  d: string;
  action: string;
  time: string;
};

const ALL: Alert[] = [
  { id: "AL-2041", sev: "high", t: "Panel C-12 underperforming", d: "Output 38% below expected this morning.", action: "Cleaning visit scheduled for Friday.", time: "12 min ago" },
  { id: "AL-2040", sev: "med", t: "Inverter MPPT-2 voltage low", d: "Voltage dropped to 264 V (expected 320 V).", action: "Technician dispatched, ETA 2 hours.", time: "2 hr ago" },
  { id: "AL-2039", sev: "med", t: "Soiling detected on Panel A-08", d: "Hazy haze + dust accumulation.", action: "Add to next monthly clean.", time: "5 hr ago" },
  { id: "AL-2038", sev: "info", t: "Monthly report ready", d: "August 2026 summary is available.", action: "Tap to download PDF.", time: "Yesterday" },
  { id: "AL-2037", sev: "ok", t: "Panel A-04 cleaning complete", d: "Output restored to 100%.", action: "No action needed.", time: "2 days ago" },
  { id: "AL-2036", sev: "info", t: "Firmware update available", d: "Inverter v3.2 ready to install.", action: "Will install during next low-output window.", time: "3 days ago" },
];

const styles = {
  high: { c: "bg-rose-100 text-rose-600 dark:bg-rose-950/40", icon: AlertTriangle, badge: "bg-rose-600 text-white", label: "Urgent" },
  med: { c: "bg-amber-100 text-amber-600 dark:bg-amber-950/40", icon: AlertTriangle, badge: "bg-amber-500 text-white", label: "Action soon" },
  info: { c: "bg-sky-100 text-sky-600 dark:bg-sky-950/40", icon: Info, badge: "bg-sky-500 text-white", label: "Info" },
  ok: { c: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40", icon: CheckCircle2, badge: "bg-emerald-500 text-white", label: "Resolved" } } as const;

function Alerts() {
  const pathname = useLocation().pathname;
  const isChild = pathname !== "/m/customer/alerts" && pathname.startsWith("/m/customer/alerts/");
  if (isChild) return <Outlet />;
  return (
    <MobileShell theme="customer">
      <Inner />
    </MobileShell>
  );
}

function Inner() {
  const { scenario: s } = useScenario();
  const visible = useMemo(() => {
    let pool = ALL;
    if (s.key === "sunny") pool = ALL.filter((a) => a.sev === "info" || a.sev === "ok");
    else if (s.key === "cloudy") pool = ALL.filter((a) => a.sev !== "high");
    return pool;
  }, [s.key]);
  const newCount = visible.filter((a) => a.sev === "high" || a.sev === "med").length;
  return (
    <>
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/customer" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Smart Alerts</h1>
        {newCount > 0 && <span className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full bg-rose-100 text-rose-700">{newCount} new</span>}
      </header>

      <div className="px-5 space-y-2">
        {visible.length === 0 && (
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-5 text-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mt-2">All systems healthy</p>
            <p className="text-xs text-emerald-600/80 mt-1">No alerts at this time.</p>
          </div>
        )}
        {visible.map((a) => {
          const st = styles[a.sev];
          return (
            <Link
              key={a.id}
              to={`/m/customer/alerts/${a.id}`}
              className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 flex items-start gap-3 active:scale-[0.99] transition"
            >
              <div className={`h-10 w-10 rounded-xl ${st.c} flex items-center justify-center shrink-0`}>
                <st.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${st.badge}`}>{st.label}</span>
                  <span className="text-[9px] font-mono text-slate-400">{a.id}</span>
                  <p className="text-[10px] text-slate-400 ml-auto">{a.time}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{a.t}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a.d}</p>
                <p className="text-xs text-slate-700 dark:text-slate-200 mt-1.5 font-medium">→ {a.action}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default Alerts;
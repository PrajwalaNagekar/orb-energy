import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Info, CheckCircle2, Receipt, Wrench, ChevronRight, BellOff } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useState } from "react";

type Item = {
  i: typeof AlertTriangle; c: string; t: string; d: string; time: string;
  link?: { to: string; params?: Record<string, string>; label: string };
  detail: string;
};

const groups: { when: string; items: Item[] }[] = [
  {
    when: "Today",
    items: [
      {
        i: AlertTriangle, c: "bg-rose-100 text-rose-600",
        t: "Panel C-12 alert", d: "Output 28% below expected.", time: "12 min",
        link: { to: "/m/customer/alerts/$id", params: { id: "AL-2041" }, label: "Open ticket" },
        detail: "Auto-detected by Orb-AI · severity P1 · technician Arjun M. dispatched · ETA 2 hrs." },
      {
        i: Wrench, c: "bg-amber-100 text-amber-600",
        t: "Cleaning scheduled", d: "Friday 11:00 — Arjun M.", time: "2 hr",
        link: { to: "/m/customer/support", label: "View visit" },
        detail: "On-site visit booked under Care+ plan. Includes panel wash, IV-curve check, and gateway firmware sync." },
    ] },
  {
    when: "This week",
    items: [
      {
        i: Receipt, c: "bg-violet-100 text-violet-600",
        t: "August invoice ready", d: "₹ 1,240 due 5 Sep.", time: "Mon",
        link: { to: "/m/customer/bills", label: "Pay now" },
        detail: "Net-metering credit ₹ 380 applied. Auto-pay scheduled if no action by 4 Sep." },
      {
        i: Info, c: "bg-sky-100 text-sky-600",
        t: "Firmware v3.2 available", d: "Inverter update ready.", time: "Sun",
        link: { to: "/m/customer/alerts/$id", params: { id: "AL-2036" }, label: "Review update" },
        detail: "Adds +0.6% MPPT efficiency · auto-installs Sun 02:30 IST · zero downtime." },
      {
        i: CheckCircle2, c: "bg-emerald-100 text-emerald-600",
        t: "Panel A-04 restored", d: "Cleaning complete.", time: "Sat",
        link: { to: "/m/customer/panels/$id", params: { id: "P-004" }, label: "View panel" },
        detail: "Output back to 100% of expected. Verified via post-clean IV scan by Orb-AI." },
    ] },
];

function Notifications() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <MobileShell theme="customer">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/customer" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Notifications</h1>
        <button className="ml-auto text-xs text-emerald-600 font-semibold">Mark all read</button>
      </header>

      <div className="px-5 space-y-5 pb-8">
        {groups.map((g) => (
          <div key={g.when}>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">{g.when}</p>
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700 overflow-hidden">
              {g.items.map((it, i) => {
                const key = `${g.when}-${i}`;
                const isOpen = open === key;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setOpen(isOpen ? null : key)}
                      className="w-full flex items-start gap-3 p-3.5 text-left active:bg-slate-50 dark:active:bg-slate-700/30"
                    >
                      <div className={`h-9 w-9 rounded-xl ${it.c} flex items-center justify-center shrink-0`}><it.i className="h-4 w-4" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{it.t}</p>
                        <p className="text-[11px] text-slate-500">{it.d}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{it.time}</span>
                      <ChevronRight className={`h-4 w-4 text-slate-400 shrink-0 mt-1 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3.5 pt-0 -mt-2 ml-12">
                        <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-snug">{it.detail}</p>
                        {it.link && (
                          <Link
                            to={`/m/customer/alerts/${(it.link.params as { id: string }).id}`}
                            className="inline-block mt-2 text-[11px] font-semibold text-emerald-600"
                          >
                            {it.link.label} →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <button className="w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 py-3 text-xs text-slate-500 inline-flex items-center justify-center gap-2">
          <BellOff className="h-3.5 w-3.5" /> Snooze non-urgent for 24 hr
        </button>
      </div>
    </MobileShell>
  );
}

export default Notifications;

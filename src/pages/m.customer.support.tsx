import { Link } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, Wrench, Sparkles, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

const tickets = [
  { id: "SR-7821", t: "Panel C-12 cleaning", st: "Scheduled", c: "bg-amber-100 text-amber-700", time: "Fri 11:00" },
  { id: "SR-7710", t: "Inverter inspection", st: "Resolved", c: "bg-emerald-100 text-emerald-700", time: "12 Aug" },
];

function Support() {
  return (
    <MobileShell theme="customer">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/customer" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Support</h1>
      </header>

      <div className="px-5">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5">
          <p className="text-base font-semibold">Need help?</p>
          <p className="text-xs text-white/80 mt-1">Average response time · 4 minutes</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="rounded-xl bg-white/15 backdrop-blur py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-1.5"><MessageCircle className="h-4 w-4" /> Chat</button>
            <button className="rounded-xl bg-white text-emerald-700 py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-1.5"><Phone className="h-4 w-4" /> Call</button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link to="/m/customer/support" className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
            <Wrench className="h-5 w-5 text-amber-500 mb-2" />
            <p className="text-sm font-semibold">Request service</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Cleaning, repair, inspection</p>
          </Link>
          <Link to="/m/customer/support" className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
            <Sparkles className="h-5 w-5 text-violet-500 mb-2" />
            <p className="text-sm font-semibold">Ask Orb-AI</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Instant smart answers</p>
          </Link>
        </div>

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-6 mb-2">My tickets</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {tickets.map((t) => (
            <Link key={t.id} to={`/m/customer/support/${t.id}`} className="flex items-center gap-3 p-3.5">
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.t}</p>
                <p className="text-[11px] text-slate-500">{t.id} · {t.time}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.c}`}>{t.st}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}

export default Support;

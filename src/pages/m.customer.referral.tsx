import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Share2, Gift } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

function Referral() {
  return (
    <MobileShell theme="customer">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/customer" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Refer & earn</h1>
      </header>

      <div className="px-5">
        <div className="rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-white p-6 text-center">
          <Gift className="h-10 w-10 mx-auto mb-3" />
          <p className="text-2xl font-bold leading-tight">Earn ₹ 5,000<br />for every friend you refer</p>
          <p className="text-xs text-white/80 mt-2">They get ₹ 5,000 off their installation too.</p>
        </div>

        <div className="mt-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">Your code</p>
          <div className="mt-2 flex items-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-xl px-4 py-3">
            <span className="flex-1 font-mono text-base font-bold tracking-wider">ROHAN-2026</span>
            <button className="p-1.5"><Copy className="h-4 w-4 text-slate-500" /></button>
          </div>
          <button className="mt-3 w-full rounded-xl bg-violet-500 text-white font-semibold text-sm py-3 inline-flex items-center justify-center gap-2">
            <Share2 className="h-4 w-4" /> Share code
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          {[
            { k: "4", l: "Referred" },
            { k: "2", l: "Installed" },
            { k: "₹ 10,000", l: "Earned" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <div className="text-base font-bold">{s.k}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-6 mb-2">Recent referrals</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {[
            { n: "Priya M.", s: "Installed", c: "text-emerald-600", a: "+ ₹ 5,000" },
            { n: "Karan S.", s: "Installed", c: "text-emerald-600", a: "+ ₹ 5,000" },
            { n: "Ananya P.", s: "Site survey", c: "text-amber-600", a: "Pending" },
            { n: "Vikram R.", s: "Quote sent", c: "text-sky-600", a: "Pending" },
          ].map((r) => (
            <div key={r.n} className="flex items-center gap-3 p-3.5">
              <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold">{r.n[0]}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{r.n}</p>
                <p className={`text-[11px] ${r.c}`}>{r.s}</p>
              </div>
              <span className="text-sm font-semibold">{r.a}</span>
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}

export default Referral;

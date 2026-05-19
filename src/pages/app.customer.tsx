import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Sun, TrendingUp, Leaf, Zap, ChevronRight, Home, BarChart3, Sparkles, User, Battery, Cloud, AlertCircle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const hourly = [
  { t: 6, v: 0.2 }, { t: 8, v: 1.8 }, { t: 9, v: 3.4 }, { t: 10, v: 4.6 },
  { t: 11, v: 5.2 }, { t: 12, v: 5.8 }, { t: 13, v: 5.4 }, { t: 14, v: 4.8 },
  { t: 15, v: 3.6 }, { t: 16, v: 2.2 }, { t: 17, v: 0.8 }, { t: 18, v: 0.1 },
];

function CustomerApp() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-5xl flex items-center justify-between mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to ecosystem
        </Link>
        <div className="text-xs text-slate-500">Customer App · Live preview</div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Phone 1 — Home */}
        <PhoneFrame label="Home">
          <div className="bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 text-white px-5 pt-12 pb-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-amber-300/20 blur-2xl" />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-[11px] text-white/70">Good afternoon</p>
                <p className="text-base font-semibold">Rohan Sharma</p>
              </div>
              <div className="relative h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-emerald-600" />
              </div>
            </div>
            <div className="mt-7 relative">
              <p className="text-[11px] uppercase tracking-wider text-white/70">Today's output</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl font-bold tracking-tight">28.4</span>
                <span className="text-base text-white/80">kWh</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/20 backdrop-blur rounded-full px-2 py-0.5">
                  <TrendingUp className="h-3 w-3" /> +12% vs yesterday
                </span>
                <span className="text-[11px] text-white/60 inline-flex items-center gap-1">
                  <Cloud className="h-3 w-3" /> Clear sky
                </span>
              </div>
              <ResponsiveContainer width="100%" height={70} className="mt-4">
                <AreaChart data={hourly}>
                  <defs>
                    <linearGradient id="cust1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fde68a" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#fde68a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#fef3c7" strokeWidth={2} fill="url(#cust1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="px-5 -mt-5 space-y-3 relative">
            {/* Panel grid card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider">Live panel grid</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">19 of 20 healthy</p>
                </div>
                <button className="text-[11px] font-semibold text-emerald-600 inline-flex items-center gap-1">View <ChevronRight className="h-3 w-3" /></button>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded relative ${
                      i === 7 ? "bg-rose-500" : "bg-gradient-to-br from-amber-300 to-amber-500"
                    }`}
                  >
                    {i === 7 && <AlertCircle className="absolute inset-0 m-auto h-3 w-3 text-white" />}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-amber-400" /> Healthy</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-rose-500" /> Issue</span>
              </div>
            </div>

            {/* Smart alert */}
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-rose-500 flex items-center justify-center shrink-0">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-rose-900 dark:text-rose-200">Panel P-1042 — output drop 62%</p>
                <p className="text-[11px] text-rose-700/80 dark:text-rose-300/70 mt-0.5">Likely shading. Technician auto-dispatched.</p>
              </div>
            </div>

            {/* ROI */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">Lifetime savings</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">₹ 4,28,400</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { k: "4.2 yrs", v: "Payback" },
                  { k: "12,840", v: "kWh saved" },
                  { k: "₹ 1,820", v: "This month" },
                ].map((s) => (
                  <div key={s.v} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{s.k}</div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-wider">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <BottomNav active="home" />
        </PhoneFrame>

        {/* Phone 2 — Impact */}
        <PhoneFrame label="Impact & ROI">
          <div className="bg-gradient-to-b from-teal-600 to-emerald-700 text-white px-5 pt-12 pb-6">
            <div className="flex items-center gap-2">
              <Link to="." className="p-1 -ml-1"><ArrowLeft className="h-4 w-4" /></Link>
              <p className="text-sm font-semibold">Environmental impact</p>
            </div>
            <p className="text-[11px] text-white/70 mt-1">Your contribution this year</p>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-[11px] text-white/70">CO₂ offset</p>
                <p className="text-4xl font-bold tracking-tight">8.2 <span className="text-base">t</span></p>
              </div>
              <div className="h-16 w-16 rounded-full border-[6px] border-amber-300/40 border-t-amber-300 animate-pulse" />
            </div>
          </div>
          <div className="px-5 -mt-3 space-y-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 grid grid-cols-3 gap-3">
              {[
                { i: Leaf, k: "1,240", v: "Trees", c: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
                { i: Zap, k: "12.8 MWh", v: "Generated", c: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
                { i: Cloud, k: "−4.2 t", v: "Coal saved", c: "text-sky-600 bg-sky-50 dark:bg-sky-950/40" },
              ].map((m) => (
                <div key={m.v} className="text-center">
                  <div className={`h-9 w-9 mx-auto rounded-lg flex items-center justify-center ${m.c}`}>
                    <m.i className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-bold mt-2 text-slate-900 dark:text-white">{m.k}</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500">{m.v}</div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Monthly generation</p>
              <p className="text-[10px] text-slate-500">kWh, last 6 months</p>
              <div className="mt-3 flex items-end gap-2 h-24">
                {[62, 78, 94, 110, 128, 142].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                    <div className="w-full rounded-t bg-gradient-to-t from-emerald-500 to-amber-400" style={{ height: `${(h / 142) * 80}px` }} />
                    <span className="text-[9px] text-slate-500">{["Jun","Jul","Aug","Sep","Oct","Nov"][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
              <Sparkles className="h-4 w-4 mb-2" />
              <p className="text-xs font-semibold">Orb-AI insight</p>
              <p className="text-[11px] text-white/90 mt-1">Tomorrow's forecast: 32 kWh — clear sky bonus expected.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 flex items-center gap-3">
              <Battery className="h-5 w-5 text-emerald-600" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Battery</p>
                <p className="text-[10px] text-slate-500">Charged at 87% · 6.4 kWh stored</p>
              </div>
              <div className="text-base font-bold text-emerald-600">87%</div>
            </div>
          </div>
          <BottomNav active="impact" />
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
        <div className="h-full w-full overflow-y-auto bg-white dark:bg-slate-900 scrollbar-hide">
          {children}
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function BottomNav({ active }: { active: string }) {
  const items = [
    { k: "home", i: Home, l: "Home" },
    { k: "panels", i: Sun, l: "Panels" },
    { k: "impact", i: BarChart3, l: "Impact" },
    { k: "ai", i: Sparkles, l: "Orb-AI" },
    { k: "me", i: User, l: "Me" },
  ];
  return (
    <div className="sticky bottom-0 mt-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around">
      {items.map((it) => (
        <button key={it.k} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${active === it.k ? "text-emerald-600" : "text-slate-400"}`}>
          <it.i className="h-4 w-4" />
          <span className="text-[9px] font-medium">{it.l}</span>
        </button>
      ))}
    </div>
  );
}

export default CustomerApp;
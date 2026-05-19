import { Link } from "react-router-dom";
import { Bell, Sun, TrendingUp, TrendingDown, Leaf, Zap, ChevronRight, Sparkles, Cloud, Battery, ShieldCheck } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { MobileShell } from "@/components/MobileShell";
import { AskOrbAI } from "@/components/AskOrbAI";
import { useScenario, inr } from "@/lib/scenario";

function CustomerHome() {
  return (
    <MobileShell theme="customer">
      <Inner />
    </MobileShell>
  );
}

function Inner() {
  const { scenario: s } = useScenario();
  const up = s.vsYesterdayPct >= 0;
  const Trend = up ? TrendingUp : TrendingDown;
  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white px-5 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-amber-300/20 blur-2xl" />
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-xs text-white/70">Good afternoon</p>
            <p className="text-base font-semibold">Rohan Sharma</p>
          </div>
          <Link to="/m/customer/notifications" className="relative h-9 w-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
            <Bell className="h-4 w-4" />
            {s.alertCounts.critical + s.alertCounts.warning > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-emerald-600" />
            )}
          </Link>
        </div>
        <div className="mt-7 relative">
          <p className="text-[11px] uppercase tracking-wider text-white/70">Today's output</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl font-bold tracking-tight">{s.todayKwh.toFixed(1)}</span>
            <span className="text-base text-white/80">kWh</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/20 backdrop-blur rounded-full px-2 py-0.5">
              <Trend className="h-3 w-3" /> {up ? "+" : ""}{s.vsYesterdayPct}% vs yesterday
            </span>
            <span className="text-[11px] text-white/70">Peak {s.peakKw.toFixed(1)} kW · {s.peakTime}</span>
          </div>
        </div>
        <div className="mt-5 h-20 -mx-2">
          <ResponsiveContainer>
            <AreaChart data={s.hourly} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a7f3d0" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#a7f3d0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area dataKey="expected" stroke="#ffffff80" strokeDasharray="3 3" strokeWidth={1} fill="transparent" />
              <Area dataKey="v" stroke="#a7f3d0" strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Health score card — full visibility, sits below hero with safe spacing */}
      <div className="px-5 mt-3">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-300/40 dark:shadow-none flex items-center gap-4 border border-slate-200/60 dark:border-slate-700">
          <div className="relative h-14 w-14 shrink-0">
            <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200 dark:text-slate-700" />
              <circle
                cx="18" cy="18" r="15.9" fill="none" strokeWidth="3" strokeLinecap="round"
                stroke={s.healthScore >= 90 ? "#10b981" : s.healthScore >= 75 ? "#f59e0b" : "#ef4444"}
                strokeDasharray={`${s.healthScore} 100`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white">{s.healthScore}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">System health</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 truncate">{s.healthyPanels} of {s.totalPanels} panels healthy</p>
          </div>
          <Link to="/m/customer/panels" className="text-emerald-600 text-xs font-semibold inline-flex items-center gap-0.5 shrink-0">
            View <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="px-5 mt-3">
        <div className="grid grid-cols-3 gap-2 bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700">
          {[
            { v: inr(s.savedTodayInr), l: "Saved today", i: TrendingUp, c: "text-emerald-600" },
            { v: `${s.co2KgToday.toFixed(1)} kg`, l: "CO₂ avoided", i: Leaf, c: "text-teal-600" },
            { v: `${s.peakKw.toFixed(1)} kW`, l: "Peak", i: Zap, c: "text-amber-600" },
          ].map((k) => (
            <div key={k.l} className="text-center">
              <k.i className={`h-4 w-4 mx-auto ${k.c}`} />
              <div className="text-sm font-bold mt-1 text-slate-900 dark:text-white">{k.v}</div>
              <div className="text-[10px] text-slate-500">{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 mt-6 grid grid-cols-4 gap-3">
        {[
          { i: Sun, l: "Panels", to: "/m/customer/panels", c: "bg-amber-100 text-amber-600" },
          { i: Zap, l: "Energy", to: "/m/customer/energy", c: "bg-emerald-100 text-emerald-600" },
          { i: ShieldCheck, l: "ROI", to: "/m/customer/bills", c: "bg-sky-100 text-sky-600" },
          { i: Bell, l: "Alerts", to: "/m/customer/alerts", c: "bg-rose-100 text-rose-600" },
        ].map((a) => (
          <Link key={a.l} to={a.to} className="flex flex-col items-center gap-1.5">
            <div className={`h-12 w-12 rounded-2xl ${a.c} flex items-center justify-center`}>
              <a.i className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium text-slate-700 dark:text-slate-200">{a.l}</span>
          </Link>
        ))}
      </div>

      {/* AI insight — live Orb-AI */}
      <div className="px-5 mt-6">
        <AskOrbAI
          persona="customer"
          context={`Today output ${s.todayKwh} kWh; vs yesterday ${s.vsYesterdayPct}%; peak ${s.peakKw} kW at ${s.peakTime}; battery ${s.battery}%; weather ${s.weather}; ${s.healthyPanels}/${s.totalPanels} panels healthy.`}
          suggestions={[
            "Why did output drop today?",
            "How much did I save this week?",
            "Should I export to grid now?",
          ]}
        />
      </div>

      {/* Live status */}
      <div className="px-5 mt-6">
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Live</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {[
            { i: Cloud, l: "Weather", v: s.weather, c: "text-sky-500" },
            { i: Battery, l: "Battery", v: `${s.battery}% · ${s.batteryState}`, c: "text-emerald-500" },
            { i: Zap, l: "Grid export", v: `${s.gridExportKw.toFixed(1)} kW out`, c: "text-amber-500" },
          ].map((r) => (
            <div key={r.l} className="flex items-center gap-3 p-3.5">
              <r.i className={`h-4 w-4 ${r.c}`} />
              <div className="flex-1">
                <p className="text-xs text-slate-500">{r.l}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{r.v}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-6" />
    </>
  );
}

export default CustomerHome;
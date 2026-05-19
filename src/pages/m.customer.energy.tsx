import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Calendar } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import { MobileShell } from "@/components/MobileShell";
import { useState } from "react";
import { useScenario, inr } from "@/lib/scenario";

function Energy() {
  return (
    <MobileShell theme="customer">
      <Inner />
    </MobileShell>
  );
}

function Inner() {
  const { scenario: s } = useScenario();
  const [range, setRange] = useState<"day" | "week" | "month">("week");
  const data = range === "day" ? s.hourly.map((h) => ({ d: `${h.t}h`, v: h.v })) : range === "week" ? s.week : s.month;
  const total = range === "day" ? s.todayKwh : range === "week" ? s.week.reduce((a, b) => a + b.v, 0) : s.month.reduce((a, b) => a + b.v, 0);
  return (
    <>
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/customer" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Energy & Trends</h1>
      </header>

      <div className="px-5">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5">
          <p className="text-[11px] uppercase tracking-wider text-white/70">This {range}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold">{total.toFixed(0)}</span>
            <span className="text-sm text-white/80">kWh</span>
          </div>
          <div className="mt-1 inline-flex items-center gap-1 text-[11px] bg-white/20 rounded-full px-2 py-0.5">
            <TrendingUp className="h-3 w-3" /> {s.vsYesterdayPct >= 0 ? "+" : ""}{s.vsYesterdayPct}% vs last {range}
          </div>
        </div>

        <div className="mt-4 inline-flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 text-xs">
          {(["day", "week", "month"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-full font-medium capitalize ${range === r ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500"}`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="mt-4 h-56 bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700">
          <ResponsiveContainer>
            {range === "day" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="eg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip />
                <Area dataKey="v" stroke="#10b981" strokeWidth={2} fill="url(#eg)" />
              </AreaChart>
            ) : (
              <BarChart data={data}>
                <XAxis dataKey="d" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip cursor={{ fill: "#10b98118" }} />
                <Bar dataKey="v" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { k: inr(s.monthSavingsInr), l: "Saved this month" },
            { k: `${s.monthCo2Kg} kg`, l: "CO₂ avoided" },
            { k: `${s.treesEquivalent}`, l: "Trees equivalent" },
            { k: `${s.efficiencyPct}%`, l: "System efficiency" },
          ].map((it) => (
            <div key={it.l} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-xl font-bold text-slate-900 dark:text-white">{it.k}</div>
              <div className="text-[11px] text-slate-500 mt-1">{it.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Recent days</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
            {s.week.slice().reverse().map((d) => (
              <div key={d.d} className="flex items-center justify-between p-3.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{d.d}</span>
                <span className="text-sm font-semibold text-emerald-600">{d.v.toFixed(1)} kWh</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-6" />
      </div>
    </>
  );
}

export default Energy;
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Sun, Sparkles, Wrench, Activity, Cpu, Zap, Thermometer,
  Gauge, Calendar, Share2, MapPin, BatteryCharging, Wifi } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import { MobileShell } from "@/components/MobileShell";
import { useScenario } from "@/lib/scenario";
import { useCustomerProfile } from "@/lib/customer-profile";
import { useMemo } from "react";

// Stable seeded pseudo-random
function seed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
  return () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 0xffffffff; };
}

function PanelDetail() {
  const { id } = useParams();
  const { scenario } = useScenario();
  const { profile } = useCustomerProfile();

  // Derive panel state from scenario + id
  const data = useMemo(() => {
    const rnd = seed(id + scenario.key);
    const isFault = rnd() < 0.06;
    const isWarn = !isFault && rnd() < 0.18;
    const status = scenario.key === "underperforming" && (isWarn || isFault)
      ? (isFault ? "fault" : "warn")
      : isFault ? "warn" : isWarn ? "warn" : "ok";

    const expectedW = 425;
    const factor = status === "fault" ? 0.0 : status === "warn" ? 0.62 + rnd() * 0.1 : 0.92 + rnd() * 0.06;
    const actualW = Math.round(expectedW * factor);

    const hourly = Array.from({ length: 24 }, (_, h) => {
      const x = h - 12.5;
      const base = expectedW * Math.exp(-(x * x) / 12);
      const v = Math.max(0, base * factor + (rnd() - 0.5) * 18);
      return { t: h, v: Math.round(v), e: Math.round(Math.max(0, base)) };
    });

    const week = Array.from({ length: 7 }, (_, i) => ({
      d: ["M","T","W","T","F","S","S"][i],
      v: Math.round((expectedW * 6) * factor * (0.85 + rnd() * 0.3)) / 1000 }));

    const ivCurve = Array.from({ length: 21 }, (_, i) => {
      const v = i * 2;
      const isc = 9.6 * factor;
      const voc = 41.2;
      const cur = i === 0 ? isc : v >= voc ? 0 : isc * (1 - Math.pow(v / voc, 12));
      return { v, i: +cur.toFixed(2), p: +(v * cur).toFixed(1) };
    });

    return { status, expectedW, actualW, hourly, week, ivCurve, factor };
  }, [id, scenario.key]);

  const statusMetaMap = {
    ok: { chip: "bg-emerald-500", label: "HEALTHY", soft: "from-emerald-500 to-teal-600" },
    warn: { chip: "bg-amber-500", label: "WARN", soft: "from-amber-400 to-orange-500" },
    fault: { chip: "bg-rose-600", label: "FAULT", soft: "from-rose-500 to-rose-700" } } as const;
  const statusMeta = statusMetaMap[data.status as keyof typeof statusMetaMap];

  return (
    <MobileShell theme="customer">
      <header className="px-5 pt-12 pb-3 flex items-center gap-3">
        <Link to="/m/customer/panels" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">{profile.customerId} · Panel</p>
          <h1 className="text-base font-semibold leading-tight">{id}</h1>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded text-white ${statusMeta.chip}`}>{statusMeta.label}</span>
        <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 ml-1"><Share2 className="h-4 w-4" /></button>
      </header>

      <div className="px-5 pb-8 space-y-4">
        {/* Live output hero */}
        <div className={`rounded-2xl bg-gradient-to-br ${statusMeta.soft} text-white p-5`}>
          <div className="flex items-center gap-2"><Sun className="h-4 w-4" /><span className="text-[11px] uppercase tracking-wider text-white/80">Live output</span><span className="ml-auto text-[10px] text-white/70 inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> 1s cadence</span></div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-bold">{data.actualW}</span>
            <span className="text-sm text-white/80">W · expected {data.expectedW} W</span>
          </div>
          <div className="mt-3 h-20 -mx-2">
            <ResponsiveContainer>
              <AreaChart data={data.hourly}>
                <defs>
                  <linearGradient id="actual" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#fff" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area dataKey="e" stroke="#ffffff77" strokeDasharray="3 3" strokeWidth={1.5} fill="transparent" />
                <Area dataKey="v" stroke="#fff" strokeWidth={2} fill="url(#actual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-white/70 -mt-1"><span>00:00</span><span>12:00</span><span>23:59</span></div>
        </div>

        {/* Telemetry grid */}
        <div className="grid grid-cols-3 gap-2">
          <Tele i={Thermometer} l="Cell temp" v="32.1°C" sub="amb 28°C" />
          <Tele i={Zap} l="Vmpp" v="41.2 V" sub="Voc 47.8" />
          <Tele i={Activity} l="Impp" v={`${(7.6 * data.factor).toFixed(1)} A`} sub="Isc 9.6" />
          <Tele i={Gauge} l="Efficiency" v={`${Math.round(21.4 * data.factor * 10) / 10}%`} sub="STC 21.4%" />
          <Tele i={Cpu} l="Optimizer" v="OK" sub="MPPT-3" />
          <Tele i={Calendar} l="Last clean" v="94 d" sub="due in 6d" />
        </div>

        {/* IV curve */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">IV / Power curve</p>
            <span className="text-[10px] text-slate-400 font-mono">@ STC · 1000 W/m²</span>
          </div>
          <div className="h-28 -mx-1">
            <ResponsiveContainer>
              <LineChart data={data.ivCurve}>
                <XAxis dataKey="v" hide />
                <YAxis hide />
                <Line dataKey="i" stroke="#10b981" strokeWidth={2} dot={false} name="Current" />
                <Line dataKey="p" stroke="#f59e0b" strokeWidth={2} dot={false} name="Power" yAxisId={0} />
                <ReferenceLine x={34} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "Vmpp", position: "top", fontSize: 9, fill: "#64748b" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-3 text-[10px] text-slate-500 mt-1">
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Current (A)</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Power (W)</span>
          </div>
        </div>

        {/* 7-day */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">7-day generation (kWh)</p>
            <span className="text-[10px] text-emerald-600 font-bold">{(data.week.reduce((a,b)=>a+b.v,0)).toFixed(1)} kWh</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-20">
            {data.week.map((w, i) => {
              const max = Math.max(...data.week.map(x=>x.v));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300" style={{ height: `${(w.v / max) * 100}%` }} />
                  <span className="text-[9px] text-slate-400">{w.d}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI diagnosis */}
        {data.status !== "ok" && (
          <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-700">Orb-AI diagnosis · 89% conf.</span>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-100 font-medium">
              {data.status === "fault"
                ? "No DC current detected on string. Likely bypass diode failure or disconnected MC4. Field visit required."
                : "Soiling pattern matches dust accumulation > 90 days. Cleaning recommended within 6 days."}
            </p>
          </div>
        )}

        {/* Hardware spec */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Hardware</p>
          <Spec l="Model" v="Orb Mono PERC 425W" />
          <Spec l="Serial" v={`SN-${id}-2024`} />
          <Spec l="Inverter" v="Orb X3 · MPPT-3" />
          <Spec l="Tilt / Azimuth" v="18° / 184° SW" />
          <Spec l="Installed" v="18 Mar 2024" />
          <Spec l="Warranty" v="21 yrs left" />
        </div>

        {/* Connectivity */}
        <div className="grid grid-cols-3 gap-2">
          <MiniBadge i={Wifi} l="Gateway" v="online" tone="ok" />
          <MiniBadge i={BatteryCharging} l="Battery" v="84%" tone="ok" />
          <MiniBadge i={MapPin} l="Roof" v="A · row 3" tone="info" />
        </div>

        <Link to="/m/customer/support" className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-white font-semibold py-3.5">
          <Wrench className="h-4 w-4" /> Request service
        </Link>

        <p className="text-[10px] text-center text-slate-400">Telemetry from gateway GW-7842 · synced to admin {profile.customerId}</p>
      </div>
    </MobileShell>
  );
}

function Tele({ i: I, l, v, sub }: { i: typeof Sun; l: string; v: string; sub: string }) {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5">
      <I className="h-3.5 w-3.5 text-slate-400" />
      <p className="text-[15px] font-bold text-slate-900 dark:text-white mt-1 leading-tight">{v}</p>
      <p className="text-[9px] text-slate-500">{l}</p>
      <p className="text-[9px] text-slate-400 font-mono">{sub}</p>
    </div>
  );
}

function Spec({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <span className="text-[11px] text-slate-500">{l}</span>
      <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-100 font-mono">{v}</span>
    </div>
  );
}

function MiniBadge({ i: I, l, v, tone }: { i: typeof Wifi; l: string; v: string; tone: "ok" | "info" }) {
  const c = tone === "ok" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-sky-50 text-sky-700 border-sky-200";
  return (
    <div className={`rounded-xl border p-2 text-center ${c}`}>
      <I className="h-3.5 w-3.5 mx-auto" />
      <p className="text-[9px] mt-0.5 opacity-70">{l}</p>
      <p className="text-[11px] font-bold">{v}</p>
    </div>
  );
}

export default PanelDetail;

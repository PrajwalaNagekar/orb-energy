import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, AlertTriangle, Info, CheckCircle2, Activity, Clock, Wrench, Sparkles,
  Cpu, Thermometer, Zap, MapPin, FileText, Phone, Share2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, ReferenceLine } from "recharts";
import { MobileShell } from "@/components/MobileShell";
import { useCustomerProfile } from "@/lib/customer-profile";

type Detail = {
  id: string;
  sev: "high" | "med" | "info" | "ok";
  title: string;
  subtitle: string;
  panel?: string;
  metric: { label: string; actual: string; expected: string; deltaPct: number };
  rootCause: string;
  aiDiagnosis: string;
  aiConfidence: number;
  recommendedAction: string;
  estCost: string;
  slaHours: number;
  timeline: { t: string; e: string; by: string }[];
  signal: number[];
  related?: string[];
};

const REGISTRY: Record<string, Detail> = {
  "AL-2041": {
    id: "AL-2041", sev: "high", title: "Panel C-12 underperforming", subtitle: "Output 38% below expected this morning",
    panel: "P-012",
    metric: { label: "Live output", actual: "0.26 kW", expected: "0.42 kW", deltaPct: -38 },
    rootCause: "Localised soiling + micro-shading from adjacent vent stack.",
    aiDiagnosis: "Pattern matches dust accumulation post-90 days. IV-curve shift consistent with bypass-diode bypass on string 3.",
    aiConfidence: 92,
    recommendedAction: "On-site cleaning + thermal scan of bypass diode.",
    estCost: "Covered under Care+ plan",
    slaHours: 24,
    timeline: [
      { t: "12 min ago", e: "Auto-detected by Orb-AI · severity raised to P1", by: "Orb-AI" },
      { t: "10 min ago", e: "Ticket JOB-7821 created", by: "Dispatch" },
      { t: "6 min ago", e: "Assigned to Arjun Mehta · T-12", by: "Routing engine" },
      { t: "Now", e: "Customer notified", by: "System" },
    ],
    signal: [0.42, 0.41, 0.4, 0.32, 0.28, 0.26, 0.27, 0.26],
    related: ["AL-2039"] },
  "AL-2040": {
    id: "AL-2040", sev: "med", title: "Inverter MPPT-2 voltage low", subtitle: "Voltage dropped to 264 V (expected 320 V)",
    panel: "INV-X3",
    metric: { label: "MPPT-2 Vdc", actual: "264 V", expected: "320 V", deltaPct: -17 },
    rootCause: "Likely DC string connector degradation between strings 4–6.",
    aiDiagnosis: "Voltage sag follows temperature curve — consistent with a high-resistance MC4 connector. No arc-fault detected (yet).",
    aiConfidence: 84,
    recommendedAction: "Re-torque DC connectors, replace MC4 pair if oxidation found.",
    estCost: "₹ 0 (warranty)",
    slaHours: 8,
    timeline: [
      { t: "2 hr ago", e: "Threshold breach detected", by: "Orb-AI" },
      { t: "1 hr 50", e: "Cross-checked against weather telemetry", by: "Orb-AI" },
      { t: "1 hr 30", e: "Technician dispatched", by: "Dispatch" },
    ],
    signal: [320, 318, 312, 298, 286, 274, 268, 264] },
  "AL-2039": {
    id: "AL-2039", sev: "med", title: "Soiling detected on Panel A-08", subtitle: "Dust accumulation crossed 12% threshold",
    panel: "P-008",
    metric: { label: "Soiling index", actual: "13.4%", expected: "< 12%", deltaPct: -8 },
    rootCause: "Seasonal pollen + post-construction dust from neighbouring rooftop.",
    aiDiagnosis: "Soiling rate trending +0.4%/day. Without intervention, A-08 will lose ~₹ 180/month in generation.",
    aiConfidence: 79,
    recommendedAction: "Bundle into next monthly clean (4 days away).",
    estCost: "Included in plan",
    slaHours: 96,
    timeline: [
      { t: "5 hr ago", e: "Soiling threshold crossed", by: "Orb-AI" },
      { t: "5 hr ago", e: "Queued for next maintenance window", by: "Scheduler" },
    ],
    signal: [10.1, 10.6, 11.2, 11.8, 12.4, 12.9, 13.2, 13.4] },
  "AL-2038": {
    id: "AL-2038", sev: "info", title: "Monthly report ready", subtitle: "August 2026 summary available",
    metric: { label: "Generation this month", actual: "612 kWh", expected: "580 kWh", deltaPct: 5.5 },
    rootCause: "—",
    aiDiagnosis: "Above-forecast yield driven by 4 extra clear-sky days vs 5-yr average.",
    aiConfidence: 96,
    recommendedAction: "Download PDF, share with your accountant for net-metering credit.",
    estCost: "Free",
    slaHours: 0,
    timeline: [{ t: "Yesterday", e: "Report compiled & signed", by: "Orb-AI · v3.2" }],
    signal: [400, 460, 500, 540, 560, 580, 600, 612] },
  "AL-2037": {
    id: "AL-2037", sev: "ok", title: "Panel A-04 cleaning complete", subtitle: "Output restored to 100% of expected",
    panel: "P-004",
    metric: { label: "Post-clean output", actual: "0.43 kW", expected: "0.42 kW", deltaPct: 2 },
    rootCause: "Soiling removed during scheduled visit.",
    aiDiagnosis: "IV curve back inside healthy band. No further action needed.",
    aiConfidence: 99,
    recommendedAction: "No action needed.",
    estCost: "—",
    slaHours: 0,
    timeline: [
      { t: "2 days ago", e: "Cleaning visit completed by Arjun Mehta", by: "Field service" },
      { t: "2 days ago", e: "AI verified restoration", by: "Orb-AI" },
    ],
    signal: [0.28, 0.27, 0.3, 0.34, 0.39, 0.42, 0.43, 0.43] },
  "AL-2036": {
    id: "AL-2036", sev: "info", title: "Firmware update available", subtitle: "Inverter v3.2 ready to install",
    panel: "INV-X3",
    metric: { label: "Current firmware", actual: "v3.1.4", expected: "v3.2.0", deltaPct: 0 },
    rootCause: "Vendor released MPPT efficiency improvement (+0.6%).",
    aiDiagnosis: "Update is non-breaking. Will auto-install during the next low-output window (Sun, 02:30 IST).",
    aiConfidence: 100,
    recommendedAction: "Approve auto-install or schedule manually.",
    estCost: "Free",
    slaHours: 0,
    timeline: [{ t: "3 days ago", e: "Firmware bundle staged on gateway", by: "OTA service" }],
    signal: [1, 1, 1, 1, 1, 1, 1, 1] } };

const sevStyle = {
  high: { ring: "ring-rose-500", chip: "bg-rose-600", text: "text-rose-600", soft: "bg-rose-50 dark:bg-rose-950/30", label: "P1 · Urgent" },
  med:  { ring: "ring-amber-500", chip: "bg-amber-500", text: "text-amber-600", soft: "bg-amber-50 dark:bg-amber-950/30", label: "P2 · Action soon" },
  info: { ring: "ring-sky-500",   chip: "bg-sky-500",   text: "text-sky-600",   soft: "bg-sky-50 dark:bg-sky-950/30",     label: "Info" },
  ok:   { ring: "ring-emerald-500", chip: "bg-emerald-500", text: "text-emerald-600", soft: "bg-emerald-50 dark:bg-emerald-950/30", label: "Resolved" } } as const;

function AlertDetail() {
  const { id } = useParams();
  const safeId = id ?? "";
  const d = REGISTRY[safeId];
  return (
    <MobileShell theme="customer">
      {!d ? <Empty id={safeId} /> : <Body d={d} />}
    </MobileShell>
  );
}

function Empty({ id }: { id: string }) {
  return (
    <div className="px-5 pt-12">
      <Link to="/m/customer/alerts" className="inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <p className="mt-6 text-sm">Alert <span className="font-mono">{id}</span> not found.</p>
    </div>
  );
}

function Body({ d }: { d: Detail }) {
  const st = sevStyle[d.sev];
  const { profile } = useCustomerProfile();
  const trend = d.signal.map((v, i) => ({ t: i, v }));
  const Icon = d.sev === "ok" ? CheckCircle2 : d.sev === "info" ? Info : AlertTriangle;
  return (
    <>
      <header className="px-5 pt-12 pb-3 flex items-center gap-3">
        <Link to="/m/customer/alerts" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono text-slate-400">{d.id} · {profile.customerId}</p>
          <h1 className="text-base font-semibold leading-tight truncate">{d.title}</h1>
        </div>
        <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800"><Share2 className="h-4 w-4" /></button>
      </header>

      <div className="px-5 pb-8 space-y-4">
        {/* Hero status */}
        <div className={`rounded-2xl p-4 ring-1 ${st.ring} ${st.soft}`}>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 ${st.chip} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
              <Icon className="h-3 w-3" /> {st.label}
            </span>
            <span className="text-[10px] text-slate-500 ml-auto inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> SLA {d.slaHours}h
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">{d.subtitle}</p>
          {d.panel && (
            <Link to={`/m/customer/panels/${d.panel}`} className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 underline">
              <MapPin className="h-3 w-3" /> {d.panel} · Roof A
            </Link>
          )}
        </div>

        {/* Live metric */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold inline-flex items-center gap-1.5"><Activity className="h-3 w-3" /> {d.metric.label}</p>
            <span className={`text-[10px] font-bold ${d.metric.deltaPct < 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {d.metric.deltaPct > 0 ? "+" : ""}{d.metric.deltaPct}%
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{d.metric.actual}</span>
            <span className="text-xs text-slate-500">vs expected {d.metric.expected}</span>
          </div>
          <div className="h-16 -mx-1 mt-2">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id={`g-${d.id}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={d.metric.deltaPct < 0 ? "#f43f5e" : "#10b981"} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={d.metric.deltaPct < 0 ? "#f43f5e" : "#10b981"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area dataKey="v" stroke={d.metric.deltaPct < 0 ? "#f43f5e" : "#10b981"} strokeWidth={2} fill={`url(#g-${d.id})`} />
                <ReferenceLine y={d.signal[0]} stroke="#94a3b8" strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Last 8 samples · 1 min cadence · Gateway GW-7842</p>
        </div>

        {/* AI diagnosis */}
        <div className="rounded-2xl border border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-violet-950/30 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-violet-700">Orb-AI diagnosis · {d.aiConfidence}% confidence</span>
          </div>
          <p className="text-sm text-slate-800 dark:text-slate-100 font-medium leading-snug">{d.aiDiagnosis}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg bg-white/70 dark:bg-slate-900/40 p-2">
              <p className="text-slate-500">Root cause</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">{d.rootCause}</p>
            </div>
            <div className="rounded-lg bg-white/70 dark:bg-slate-900/40 p-2">
              <p className="text-slate-500">Estimated cost</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{d.estCost}</p>
            </div>
          </div>
        </div>

        {/* Telemetry chips */}
        <div className="grid grid-cols-3 gap-2">
          <Chip i={Cpu} l="Gateway" v="online" tone="ok" />
          <Chip i={Thermometer} l="Cell temp" v="32.1°C" tone="ok" />
          <Chip i={Zap} l="Grid" v="exporting" tone="ok" />
        </div>

        {/* Action */}
        <div className="rounded-2xl bg-slate-900 text-white p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Recommended action</p>
          <p className="text-sm font-semibold mt-1">{d.recommendedAction}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link to="/m/customer/support" className="rounded-xl bg-emerald-500 text-white text-xs font-semibold py-2.5 inline-flex items-center justify-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" /> Approve & dispatch
            </Link>
            <button className="rounded-xl bg-white/10 text-white text-xs font-semibold py-2.5 inline-flex items-center justify-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Call expert
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Timeline</p>
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            {d.timeline.map((tl, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`h-2 w-2 rounded-full ${i === 0 ? st.chip : "bg-slate-300"}`} />
                  {i < d.timeline.length - 1 && <span className="flex-1 w-px bg-slate-200 dark:bg-slate-700 mt-1" />}
                </div>
                <div className="flex-1 pb-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-tight">{tl.e}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tl.t} · {tl.by}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin link footer */}
        <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
          <FileText className="h-3.5 w-3.5" />
          Synced to admin ticket <span className="font-mono">{d.id}</span> · viewable by your account manager.
        </div>
      </div>
    </>
  );
}

function Chip({ i: I, l, v, tone }: { i: typeof Cpu; l: string; v: string; tone: "ok" | "warn" }) {
  return (
    <div className={`rounded-xl border p-2 text-center ${tone === "ok" ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30" : "border-amber-200 bg-amber-50"}`}>
      <I className={`h-4 w-4 mx-auto ${tone === "ok" ? "text-emerald-600" : "text-amber-600"}`} />
      <p className="text-[10px] text-slate-500 mt-1">{l}</p>
      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100">{v}</p>
    </div>
  );
}

export default AlertDetail;
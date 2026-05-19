import { Link, useParams } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { anomalyClusters } from "@/lib/admin-data";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  CheckCircle2,
  Wrench,
  Calendar,
  Users,
  Boxes,
  Sparkles,
  ShieldAlert,
  Radio,
  ArrowRight,
  Activity,
  Cpu } from "lucide-react";
import { toast } from "sonner";
import { KpiCard } from "@/components/KpiCard";

const trendIcon = { rising: TrendingUp, falling: TrendingDown, steady: Minus };

// Stable per-cluster metadata derived from the cluster record so the page
// reads like a real Orb-AI investigation report.
function buildSparkline(seed: number, trend: "rising" | "falling" | "steady") {
  const base = [12, 14, 13, 15, 17, 16, 19, 21, 24, 26, 28, 30];
  return base.map((v, i) => {
    if (trend === "rising") return Math.round((v + seed * 0.4) * (1 + i * 0.04));
    if (trend === "falling") return Math.max(2, Math.round((v + seed * 0.3) * (1 - i * 0.04)));
    return Math.round((v + seed * 0.35) * (1 + Math.sin(i) * 0.05));
  });
}

const playbooks: Record<string, { steps: string[]; sla: string; squad: string; parts: string[]; root: string[] }> = {
  Inverter: {
    steps: [
      "Pull MPPT trace logs for last 14 days from affected inverters",
      "Confirm capacitor bank ESR > 0.6Ω via field tester",
      "Schedule bulk PCB rev 3.2 swap during low-output window (11pm–4am)",
      "Re-flash firmware to 4.21-LTS post-swap and verify auto-handshake",
    ],
    sla: "P1 · 48h intervention",
    squad: "Inverter L2 squad · 4 techs",
    parts: ["SKU-PCB32 ×14", "SKU-DIODE ×4"],
    root: ["Capacitor ESR drift", "Firmware <4.20 lacks thermal de-rate", "PCB rev 3.1 known-issue"] },
  Soiling: {
    steps: [
      "Cross-reference irradiance-vs-output ratio drop > 8%",
      "Dispatch cleaning crews to affected coastal sites",
      "Raise cleaning cadence from 30d → 14d in monsoon belt",
      "Update site profile thresholds in Rules Engine",
    ],
    sla: "P2 · 7d intervention",
    squad: "Cleaning vendor · O&M",
    parts: ["SKU-CLEAN ×9"],
    root: ["Pre-monsoon dust ramp", "Coastal salt-fog deposition"] },
  Connectivity: {
    steps: [
      "Activate dual-SIM failover on affected GW-114 gateways",
      "Open ticket with carrier (Region NW) for backhaul SLA",
      "Buffer telemetry locally up to 48h via store-and-forward",
      "Replace any GW-114 with modem error rate > 2%",
    ],
    sla: "P2 · 24h intervention",
    squad: "Network L1 squad",
    parts: ["SKU-GW114 ×2"],
    root: ["LTE carrier outages", "Modem firmware quirk on rev A"] },
  "PV Module": {
    steps: [
      "Thermal IR inspection on next planned visit",
      "Mark micro-cracked modules with QR for warranty claim",
      "Re-string optimisers around degraded modules",
      "Open vendor RMA for cohort under 10y warranty",
    ],
    sla: "P3 · 30d intervention",
    squad: "Module diagnostics squad",
    parts: ["SKU-DIODE ×4"],
    root: ["Hail micro-cracks (Mar 14 storm)", "Cohort manufacturing variance"] } };

function ClusterDetail() {
  const { id } = useParams();
  const cluster = anomalyClusters.find((c) => c.id === id);
  if (!cluster) {
    return (
      <PageShell title="Cluster not found" subtitle="This cluster may have been resolved or merged.">
        <Button asChild><Link to="/admin/clusters">Back to clusters</Link></Button>
      </PageShell>
    );
  }

  const TrendIcon = trendIcon[cluster.trend];
  const playbook = playbooks[cluster.category] ?? playbooks.Inverter;
  const series = buildSparkline(cluster.alerts, cluster.trend);

  const accept = () => toast.success(`Playbook accepted · dispatched to ${playbook.squad}`);
  const escalate = () => toast.success(`Cluster ${cluster.id} escalated to engineering review`);
  const snooze = () => toast(`Cluster ${cluster.id} snoozed for 24h`);

  return (
    <PageShell
      title={`${cluster.category} cluster · ${cluster.id}`}
      subtitle={cluster.cause}
    >
      <div className="flex items-center gap-2 -mt-2">
        <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
          <Link to="/admin/clusters"><ArrowLeft className="h-3 w-3 mr-1" /> All clusters</Link>
        </Button>
        <StatusBadge status={cluster.severity} />
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <TrendIcon className="h-3 w-3" /> {cluster.trend}
        </span>
        <span className="text-[11px] text-muted-foreground">First seen {cluster.firstSeen}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Grouped alerts" value={String(cluster.alerts)} icon={<Radio className="h-4 w-4" />} accent="warning" />
        <KpiCard label="Affected sites" value={String(cluster.sites.length)} icon={<Activity className="h-4 w-4" />} accent="info" />
        <KpiCard label="Cluster confidence" value="92%" icon={<Cpu className="h-4 w-4" />} accent="success" hint="Orb-AI v2.1" />
        <KpiCard label="SLA window" value={playbook.sla} icon={<ShieldAlert className="h-4 w-4" />} accent="warning" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left: alert volume + root cause */}
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Alert volume · last 12 days</h3>
            <span className="text-[11px] text-muted-foreground">Trend: {cluster.trend}</span>
          </div>
          <Sparkline data={series} />

          <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mt-5">Likely root causes</h4>
          <ul className="mt-2 space-y-1.5">
            {playbook.root.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{r}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 mt-5">
            <p className="text-[11px] uppercase tracking-wider text-primary font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Orb-AI recommendation
            </p>
            <p className="text-sm mt-1">{cluster.recommendation}</p>
          </div>
        </Card>

        {/* Right: dispatch summary */}
        <Card className="p-5 space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
              <Users className="h-3 w-3" /> Suggested squad
            </p>
            <p className="text-sm font-semibold mt-1">{playbook.squad}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
              <Boxes className="h-3 w-3" /> Parts required
            </p>
            <ul className="mt-1 space-y-1">
              {playbook.parts.map((p) => (
                <li key={p} className="text-sm font-mono">{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Recommended window
            </p>
            <p className="text-sm mt-1">Next 48–72h · low-output band</p>
          </div>
        </Card>
      </div>

      {/* Action items */}
      <Card className="p-5">
        <h3 className="font-semibold flex items-center gap-2"><Wrench className="h-4 w-4" /> Recommended action items</h3>
        <ol className="mt-3 space-y-2">
          {playbook.steps.map((s, i) => (
            <li key={s} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <span className="h-6 w-6 shrink-0 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-sm flex-1 pt-0.5">{s}</span>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast.success(`Step ${i + 1} marked done`)}>
                <CheckCircle2 className="h-3 w-3 mr-1" /> Mark done
              </Button>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-2 mt-5">
          <Button onClick={accept}><Sparkles className="h-3.5 w-3.5 mr-1.5" /> Accept playbook &amp; dispatch</Button>
          <Button variant="outline" onClick={escalate}><ShieldAlert className="h-3.5 w-3.5 mr-1.5" /> Escalate to engineering</Button>
          <Button variant="ghost" onClick={snooze}>Snooze 24h</Button>
          <Button variant="ghost" asChild><Link to="/alerts">View raw alerts <ArrowRight className="h-3 w-3 ml-1" /></Link></Button>
        </div>
      </Card>

      {/* Affected sites */}
      <Card className="p-5">
        <h3 className="font-semibold">Affected sites ({cluster.sites.length})</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          {cluster.sites.map((s, i) => (
            <div key={s} className="rounded-lg border border-border p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{s}</p>
                <p className="text-[11px] text-muted-foreground">{2 + i} alerts in cluster</p>
              </div>
              <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                <Link to="/panels">Open <ArrowRight className="h-3 w-3 ml-1" /></Link>
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-3 w-full h-24">
      <defs>
        <linearGradient id="cdg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,100 ${pts} 100,100`} fill="url(#cdg)" stroke="none" />
      <polyline points={pts} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default ClusterDetail;

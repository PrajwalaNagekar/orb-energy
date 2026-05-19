import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { ingestion, ingestionThroughput } from "@/lib/admin-data";
import { Cpu, Radio, Database, Workflow, ShieldCheck, Activity } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tip = { contentStyle: { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 } };

const statusTone = {
  operational: "text-success bg-success/10 border-success/20",
  degraded: "text-warning-foreground bg-warning/15 border-warning/30",
  outage: "text-destructive bg-destructive/10 border-destructive/20" } as const;

const layerIcons: Record<string, typeof Cpu> = {
  "MQTT Broker (primary)": Radio,
  "Time-series DB": Database,
  "Event Bus": Workflow,
  "Rules Engine": Workflow,
  "Stream Processor": Activity,
  "Secure OTA": ShieldCheck,
  "Edge Gateway Fleet": Cpu,
  "Identity (mTLS)": ShieldCheck };

function IoT() {
  return (
    <PageShell
      title="IoT Edge & Ingestion"
      subtitle="Per-panel sensors → Gateway → MQTT → Time-series DB → Event Bus → Rules → Stream Processor"
    >
      {/* Architecture flow */}
      <Card className="p-5">
        <h3 className="font-semibold">Data plane architecture</h3>
        <p className="text-xs text-muted-foreground mt-0.5 mb-4">Orb Energy edge-to-cloud pipeline</p>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          {[
            "Sensors", "Gateway", "Secure OTA", "mTLS Identity", "MQTT", "Stream Processor",
            "Time-series DB", "Event Bus", "Rules Engine", "Asset Registry", "Workflow Engine", "Orb-AI",
          ].map((n, i, arr) => (
            <span key={n} className="inline-flex items-center gap-2">
              <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 font-medium">{n}</span>
              {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">MQTT throughput · 24h</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ingestionThroughput}>
              <defs>
                <linearGradient id="mqttG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" fontSize={10} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip {...tip} />
              <Area type="monotone" dataKey="mqtt" name="msg/s (k)" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#mqttG)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Event bus throughput · 24h</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ingestionThroughput}>
              <defs>
                <linearGradient id="evG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-5)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-5)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" fontSize={10} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip {...tip} />
              <Area type="monotone" dataKey="events" name="evt/s (k)" stroke="var(--color-chart-5)" strokeWidth={2} fill="url(#evG)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Service health</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {ingestion.map((m) => {
            const Icon = layerIcons[m.name] ?? Cpu;
            return (
              <div key={m.name} className="rounded-xl border border-border/60 p-4 hover:shadow-[var(--shadow-elevated)] transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase rounded-full border px-2 py-0.5 ${statusTone[m.status]}`}>{m.status}</span>
                </div>
                <p className="text-sm font-semibold mt-3">{m.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{m.detail}</p>
                <div className="mt-3 grid grid-cols-3 gap-1 text-[11px]">
                  <div>
                    <p className="text-muted-foreground">Tput</p>
                    <p className="font-semibold tabular-nums">{m.throughput}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Latency</p>
                    <p className="font-semibold tabular-nums">{m.latency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uptime</p>
                    <p className="font-semibold tabular-nums">{m.uptime}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </PageShell>
  );
}

export default IoT;

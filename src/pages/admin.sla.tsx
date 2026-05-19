import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/KpiCard";
import { slaWeekly, slaByRegion, techniciansFull, adminAlerts } from "@/lib/admin-data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { ShieldCheck, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

const tip = { contentStyle: { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }, labelStyle: { color: "var(--color-muted-foreground)", fontSize: 11 } };

function SLA() {
  const avgSla = (slaWeekly.reduce((a, d) => a + d.actual, 0) / slaWeekly.length).toFixed(1);
  const opened = slaWeekly.reduce((a, d) => a + d.opened, 0);
  const closed = slaWeekly.reduce((a, d) => a + d.closed, 0);
  const avgMttr = Math.round(slaWeekly.reduce((a, d) => a + d.mttr, 0) / slaWeekly.length);

  return (
    <PageShell title="SLA & Service Analytics" subtitle="Compliance, response & resolution telemetry · last 7 days">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="SLA compliance" value={`${avgSla}%`} delta="+0.6%" trend="up" accent="success" icon={<ShieldCheck className="h-4 w-4" />} hint="Target 95%" />
        <KpiCard label="Avg MTTR" value={`${Math.floor(avgMttr / 60)}h ${avgMttr % 60}m`} delta="−18m" trend="down" accent="info" icon={<Clock className="h-4 w-4" />} hint="Mean time to resolve" />
        <KpiCard label="Issues opened" value={`${opened}`} delta="−12%" trend="down" accent="warning" icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Issues closed" value={`${closed}`} delta="+8%" trend="up" accent="success" icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <h3 className="font-semibold">SLA target vs actual</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Daily compliance %</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={slaWeekly}>
              <defs>
                <linearGradient id="slaG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[90, 100]} stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip {...tip} />
              <Area type="monotone" dataKey="target" stroke="var(--color-muted-foreground)" strokeDasharray="4 4" fill="transparent" />
              <Area type="monotone" dataKey="actual" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#slaG)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">SLA by region</h3>
          <div className="space-y-3">
            {slaByRegion.map((r) => (
              <div key={r.region}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{r.region}</span>
                  <span className="tabular-nums font-semibold">{r.sla}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[image:var(--gradient-eco)]" style={{ width: `${r.sla}%` }} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{r.jobs} jobs · MTTR {r.mttr}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold">Open vs closed (daily)</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Workflow throughput</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={slaWeekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip {...tip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="opened" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="closed" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">MTTR trend (minutes)</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Lower is better</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={slaWeekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip {...tip} />
              <Line type="monotone" dataKey="mttr" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Technician performance</h3>
          <div className="space-y-3">
            {techniciansFull.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[image:var(--gradient-eco)] flex items-center justify-center text-[11px] font-semibold text-white">
                  {t.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate">{t.name}</span>
                    <span className="tabular-nums font-semibold">{t.sla}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-success" style={{ width: `${t.sla}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t.region} · {t.jobs}/{t.capacity} jobs · {t.utilization}% util</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Active incidents</h3>
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {adminAlerts.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-3 rounded-lg border border-border/60 p-3 hover:bg-muted/30">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><StatusBadge status={a.severity} /><span className="font-mono text-[10px] text-muted-foreground">{a.id}</span></div>
                  <p className="text-sm font-medium mt-1 truncate">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground">{a.site} · {a.time}</p>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs">Resolve</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default SLA;

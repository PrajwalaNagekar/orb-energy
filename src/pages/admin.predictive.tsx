import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/KpiCard";
import { predictions } from "@/lib/admin-data";
import { Brain, AlertTriangle, Calendar, IndianRupee } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

const tip = { contentStyle: { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 } };

function Predictive() {
  const [selected, setSelected] = useState(predictions[0]);
  const totalSaved = predictions.reduce((a, p) => a + (p.cost.later - p.cost.now), 0);

  return (
    <PageShell title="Predictive Maintenance" subtitle="Orb-AI Predictive v3.4 · 14–30 day horizon · early-fault interception">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Predicted faults" value={`${predictions.length}`} icon={<Brain className="h-4 w-4" />} accent="warning" hint="Next 30 days" />
        <KpiCard label="Critical (≤7d)" value={`${predictions.filter((p) => p.daysToFailure <= 7).length}`} icon={<AlertTriangle className="h-4 w-4" />} accent="warning" />
        <KpiCard label="Avg confidence" value={`${Math.round(predictions.reduce((a, p) => a + p.confidence, 0) / predictions.length)}%`} icon={<Brain className="h-4 w-4" />} accent="info" />
        <KpiCard label="Forecast savings" value={`₹ ${(totalSaved / 1000).toFixed(0)}k`} icon={<IndianRupee className="h-4 w-4" />} accent="success" hint="vs reactive cost" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Predictions queue</h3>
          <div className="space-y-2">
            {predictions.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full text-left rounded-lg border p-3 transition-colors ${selected.id === p.id ? "border-primary/40 bg-primary/5" : "border-border/60 hover:bg-muted/40"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">{p.id}</span>
                  <span className="text-[10px] font-bold text-warning-foreground bg-warning/15 px-1.5 py-0.5 rounded uppercase">
                    {p.daysToFailure}d
                  </span>
                </div>
                <p className="text-sm font-medium mt-1">{p.fault}</p>
                <p className="text-[11px] text-muted-foreground">{p.asset} · {p.site}</p>
                <div className="h-1 bg-muted rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-info" style={{ width: `${p.confidence}%` }} />
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-2 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{selected.id}</p>
              <h3 className="font-semibold mt-0.5">{selected.fault}</h3>
              <p className="text-sm text-muted-foreground">{selected.asset} · {selected.site}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold tabular-nums">{selected.confidence}%</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">confidence</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Window</p>
              <p className="text-sm font-semibold mt-0.5 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {selected.windowStart} – {selected.windowEnd}</p>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Cost now</p>
              <p className="text-sm font-semibold mt-0.5 text-success">₹ {selected.cost.now.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Cost if reactive</p>
              <p className="text-sm font-semibold mt-0.5 text-destructive">₹ {selected.cost.later.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Risk trajectory</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={selected.riskTrend.map((v, i) => ({ d: `D-${selected.riskTrend.length - i}`, risk: v }))}>
                <defs>
                  <linearGradient id="riskG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-4)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" fontSize={10} stroke="var(--color-muted-foreground)" />
                <YAxis fontSize={11} stroke="var(--color-muted-foreground)" domain={[0, 100]} />
                <Tooltip {...tip} />
                <Area type="monotone" dataKey="risk" stroke="var(--color-chart-4)" strokeWidth={2.5} fill="url(#riskG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={() => toast.success("Maintenance scheduled", { description: `${selected.id} · window ${selected.windowStart}` })}>
              Schedule intervention
            </Button>
            <Button variant="outline" onClick={() => toast.info("Snoozed for 24h")}>Snooze</Button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default Predictive;

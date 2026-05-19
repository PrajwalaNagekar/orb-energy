import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Filter, Grid3x3, MapPin, Thermometer, Zap } from "lucide-react";
import { panels, energyTrend, type PanelStatus } from "@/lib/mock-data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { cn } from "@/lib/utils";

const statusColor: Record<PanelStatus, string> = {
  healthy: "bg-success/15 border-success/30 text-success hover:bg-success/25",
  warning: "bg-warning/20 border-warning/40 text-warning-foreground hover:bg-warning/30",
  critical: "bg-destructive/15 border-destructive/40 text-destructive hover:bg-destructive/25 animate-pulse" };

function PanelsPage() {
  const [filter, setFilter] = useState<PanelStatus | "all">("all");
  const [selected, setSelected] = useState<typeof panels[0] | null>(null);
  const list = panels.filter((p) => filter === "all" || p.status === filter);
  const counts = {
    all: panels.length,
    healthy: panels.filter((p) => p.status === "healthy").length,
    warning: panels.filter((p) => p.status === "warning").length,
    critical: panels.filter((p) => p.status === "critical").length };

  return (
    <PageShell
      title="Panel Monitoring"
      subtitle={`${list.length} panels · live IoT telemetry`}
      actions={
        <>
          <Button variant="outline" size="sm"><MapPin className="h-3.5 w-3.5 mr-1.5" /> Map view</Button>
          <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5 mr-1.5" /> Filters</Button>
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        {(["all", "healthy", "warning", "critical"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize",
              filter === k ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"
            )}
          >
            {k} <span className="ml-1 opacity-70">{counts[k]}</span>
          </button>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Grid3x3 className="h-4 w-4" /> Fleet grid</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Click any panel for telemetry detail</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-success" /> Healthy</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-warning" /> Warning</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-destructive" /> Critical</span>
          </div>
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-1.5">
          {list.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              title={`${p.id} · ${p.output}W · ${p.status}`}
              className={cn("aspect-square rounded-md border-2 transition-all flex items-center justify-center text-[9px] font-mono font-medium", statusColor[p.status])}
            >
              {p.id.slice(2)}
            </button>
          ))}
        </div>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  Panel {selected.id}
                  <StatusBadge status={selected.status} />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/60 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Zap className="h-3 w-3" /> Output</div>
                    <p className="text-xl font-semibold mt-1">{selected.output}<span className="text-sm text-muted-foreground ml-1">W</span></p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Thermometer className="h-3 w-3" /> Temp</div>
                    <p className="text-xl font-semibold mt-1">{selected.temp}<span className="text-sm text-muted-foreground ml-1">°C</span></p>
                  </div>
                </div>
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Site</p>
                  <p className="font-medium">{selected.site}</p>
                </div>
                <div>
                  <p className="text-xs font-medium mb-2">Output trend (24h)</p>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={energyTrend}>
                      <defs>
                        <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="t" fontSize={10} tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" />
                      <Tooltip />
                      <Area dataKey="today" stroke="var(--color-chart-3)" strokeWidth={2} fill="url(#pg)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {selected.status !== "healthy" && (
                  <div className="rounded-lg bg-warning/10 border border-warning/20 p-3">
                    <p className="text-xs font-semibold text-warning-foreground mb-1">Orb-AI recommendation</p>
                    <p className="text-xs text-foreground/80">
                      {selected.status === "critical"
                        ? "Output dropped 62%. Likely cell failure — dispatch L1 technician within 4 hours."
                        : "Soiling pattern detected. Schedule cleaning during next maintenance window."}
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">Create job</Button>
                  <Button variant="outline" className="flex-1" size="sm">View history</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

export default PanelsPage;

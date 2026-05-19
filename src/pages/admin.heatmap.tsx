import { Link } from "react-router-dom";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { heatmapMatrix, sites, fleetKpis } from "@/lib/admin-data";
import { Map, Filter, Maximize2 } from "lucide-react";

function colourFor(v: number) {
  // 0..0.4 healthy (green), 0.4..0.7 warning (amber), 0.7..1 critical (red)
  if (v < 0.4) return `oklch(0.65 0.16 155 / ${0.25 + v * 1.6})`;
  if (v < 0.7) return `oklch(0.75 0.18 75 / ${0.35 + v})`;
  return `oklch(0.6 0.22 25 / ${0.45 + v * 0.55})`;
}

function Heatmap() {
  const [selected, setSelected] = useState<{ site: string; hour: number; v: number } | null>(null);

  return (
    <PageShell
      title="Fleet-wide Health Heatmap"
      subtitle={`${fleetKpis.sitesOnline} sites · ${fleetKpis.panelsOnline.toLocaleString()} panels · live anomaly density`}
      actions={
        <>
          <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5 mr-1.5" /> Filter region</Button>
          <Button size="sm"><Maximize2 className="h-3.5 w-3.5 mr-1.5" /> Full screen</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { k: "Healthy", v: sites.filter((s) => s.health === "healthy").length, tone: "text-success bg-success/10" },
          { k: "Warning", v: sites.filter((s) => s.health === "warning").length, tone: "text-warning-foreground bg-warning/15" },
          { k: "Critical", v: sites.filter((s) => s.health === "critical").length, tone: "text-destructive bg-destructive/10" },
          { k: "Avg uptime", v: `${(sites.reduce((a, s) => a + s.uptime, 0) / sites.length).toFixed(2)}%`, tone: "text-info bg-info/10" },
        ].map((s) => (
          <Card key={s.k} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{s.k}</p>
              <p className="text-2xl font-semibold tabular-nums mt-1">{s.v}</p>
            </div>
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.tone}`}>
              <Map className="h-5 w-5" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold">Anomaly density · sites × hour</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Aggregated last 24h · click any cell to drill down</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>Healthy</span>
            <div className="flex gap-0.5">
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
                <div key={v} className="h-3 w-5 rounded-sm" style={{ background: colourFor(v) }} />
              ))}
            </div>
            <span>Critical</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[160px_1fr] gap-3">
              <div className="flex items-end pb-2"><span className="text-[10px] text-muted-foreground">Site \ Hour</span></div>
              <div className="grid" style={{ gridTemplateColumns: "repeat(24, 1fr)" }}>
                {Array.from({ length: 24 }).map((_, h) => (
                  <span key={h} className="text-[10px] text-muted-foreground text-center">{h}</span>
                ))}
              </div>
              {heatmapMatrix.flatMap((row) => [
                <div key={row.site + "-l"} className="flex items-center gap-2 text-xs">
                  <StatusBadge status={row.health} />
                  <span className="font-medium truncate">{row.site}</span>
                </div>,
                <div key={row.site + "-c"} className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(24, 1fr)" }}>
                  {row.cells.map((v, h) => (
                    <button
                      key={h}
                      onClick={() => setSelected({ site: row.site, hour: h, v })}
                      title={`${row.site} · ${h}:00 · ${Math.round(v * 100)}%`}
                      className="aspect-square rounded-sm border border-transparent hover:border-foreground/40 transition-all"
                      style={{ background: colourFor(v) }}
                    />
                  ))}
                </div>,
              ])}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Site directory</h3>
          <div className="space-y-2">
            {sites.map((s) => (
              <Link key={s.id} to="/customers" className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 hover:bg-muted/40 transition-colors">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">{s.region} · {s.panels} panels · {s.output}/{s.capacity} kW</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={s.health} />
                  <p className="text-[11px] text-muted-foreground tabular-nums mt-1">{s.uptime}% uptime</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">Cell inspector</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-4">Click a cell on the heatmap to see deep telemetry.</p>
          {selected ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-border/60 p-3">
                <p className="text-xs text-muted-foreground">Site · Hour</p>
                <p className="text-base font-semibold">{selected.site} · {selected.hour}:00</p>
              </div>
              <div className="rounded-lg border border-border/60 p-3">
                <p className="text-xs text-muted-foreground">Anomaly density</p>
                <p className="text-2xl font-bold tabular-nums">{Math.round(selected.v * 100)}%</p>
                <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                  <div className="h-full" style={{ width: `${selected.v * 100}%`, background: colourFor(selected.v) }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="text-[11px] text-muted-foreground">Affected panels</p>
                  <p className="text-base font-semibold tabular-nums">{Math.round(selected.v * 14)}</p>
                </div>
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="text-[11px] text-muted-foreground">Confidence</p>
                  <p className="text-base font-semibold tabular-nums">{Math.round(80 + selected.v * 18)}%</p>
                </div>
              </div>
              <Button size="sm" className="w-full" asChild><Link to="/alerts">Open related alerts</Link></Button>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No cell selected.
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}

export default Heatmap;

import { Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { anomalyClusters } from "@/lib/admin-data";
import { TrendingUp, TrendingDown, Minus, Radio, ArrowRight } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";

const trendIcon = { rising: TrendingUp, falling: TrendingDown, steady: Minus };

function Clusters() {
  const total = anomalyClusters.reduce((a, c) => a + c.alerts, 0);
  const rising = anomalyClusters.filter((c) => c.trend === "rising").length;

  return (
    <PageShell
      title="Anomaly Clustering"
      subtitle="Orb-AI Cluster Engine v2.1 · grouped fault patterns across the fleet"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Active clusters" value={`${anomalyClusters.length}`} icon={<Radio className="h-4 w-4" />} accent="info" />
        <KpiCard label="Total grouped alerts" value={`${total}`} icon={<Radio className="h-4 w-4" />} accent="warning" />
        <KpiCard label="Rising clusters" value={`${rising}`} icon={<TrendingUp className="h-4 w-4" />} accent="warning" hint="Need attention" />
        <KpiCard label="Cluster confidence" value="88%" accent="success" icon={<Radio className="h-4 w-4" />} hint="Model v2.1" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {anomalyClusters.map((c) => {
          const TrendIcon = trendIcon[c.trend];
          return (
            <Card key={c.id} className="p-5 hover:shadow-[var(--shadow-elevated)] transition-shadow">
              <Link to={`/admin/clusters/${c.id}`} className="block">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">{c.id}</span>
                      <StatusBadge status={c.severity} />
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <TrendIcon className="h-3 w-3" /> {c.trend}
                      </span>
                    </div>
                    <h3 className="font-semibold mt-1">{c.category}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{c.cause}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-3xl font-bold tabular-nums">{c.alerts}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">alerts</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Affected sites</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {c.sites.map((s) => (
                        <span key={s} className="text-[11px] rounded-full bg-muted px-2 py-0.5">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg bg-primary/5 border border-primary/15 p-3 mt-2">
                    <p className="text-[11px] uppercase tracking-wider text-primary font-semibold">Orb-AI recommendation</p>
                    <p className="text-sm mt-1">{c.recommendation}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>First seen {c.firstSeen}</span>
                  <span className="inline-flex items-center gap-1 text-primary font-semibold">
                    Open detail <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

export default Clusters;

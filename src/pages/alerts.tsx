import { PageShell } from "@/components/PageShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { alerts } from "@/lib/mock-data";
import { Sparkles, UserPlus, Check } from "lucide-react";

function AlertsPage() {
  return (
    <PageShell
      title="Alerts"
      subtitle="Real-time anomaly stream with Orb-AI recommendations"
      actions={<><Button variant="outline" size="sm">All severities</Button><Button size="sm">Bulk acknowledge</Button></>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: "Critical", v: 3, c: "text-destructive bg-destructive/10" },
          { l: "Warning", v: 14, c: "text-warning-foreground bg-warning/15" },
          { l: "Info", v: 6, c: "text-info bg-info/10" },
          { l: "Avg time-to-action", v: "1m 48s", c: "text-success bg-success/10" },
        ].map((s) => (
          <Card key={s.l} className="p-4 flex items-center justify-between">
            <div><p className="text-xs text-muted-foreground">{s.l}</p><p className="text-2xl font-semibold mt-1">{s.v}</p></div>
            <div className={`h-10 w-10 rounded-lg ${s.c}`} />
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {alerts.map((a) => (
          <Card key={a.id} className="p-4">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={a.severity} />
                  <span className="text-xs text-muted-foreground font-mono">{a.id}</span>
                  <span className="text-xs text-muted-foreground">· {a.time}</span>
                </div>
                <h3 className="font-semibold mt-2">{a.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {a.site} · Panel <span className="font-mono">{a.panel}</span>
                </p>
                <div className="mt-3 rounded-lg bg-accent/40 border border-accent p-3 flex gap-2">
                  <Sparkles className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-success">Orb-AI recommendation</p>
                    <p className="text-sm mt-0.5">{a.ai}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button size="sm"><UserPlus className="h-3.5 w-3.5 mr-1.5" /> Assign technician</Button>
                <Button variant="outline" size="sm"><Check className="h-3.5 w-3.5 mr-1.5" /> Acknowledge</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

export default AlertsPage;

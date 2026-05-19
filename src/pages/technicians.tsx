import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { technicians } from "@/lib/mock-data";
import { Wrench } from "lucide-react";

function TechPage() {
  return (
    <PageShell title="Technicians" subtitle="Field workforce · live status">
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-3">Technician</th>
              <th className="text-left font-medium px-4 py-3">Region</th>
              <th className="text-left font-medium px-4 py-3">Open jobs</th>
              <th className="text-left font-medium px-4 py-3">SLA</th>
              <th className="text-left font-medium px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {technicians.map((t) => (
              <tr key={t.id} className="border-t border-border/60 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[image:var(--gradient-eco)] flex items-center justify-center text-xs font-semibold text-white">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{t.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{t.region}</td>
                <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><Wrench className="h-3.5 w-3.5 text-muted-foreground" /> {t.jobs}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success" style={{ width: `${t.sla}%` }} />
                    </div>
                    <span className="text-xs tabular-nums">{t.sla}%</span>
                  </div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={t.status === "Available" ? "healthy" : t.status === "On site" ? "warning" : "info"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}

export default TechPage;

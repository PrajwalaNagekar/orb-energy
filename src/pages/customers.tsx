import { PageShell } from "@/components/PageShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { customers, energyTrend } from "@/lib/mock-data";
import { Building2, Zap, Receipt, AlertTriangle, Sun, TrendingUp, Phone, FileText } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useState } from "react";

function CustomersPage() {
  const [selectedId, setSelectedId] = useState(customers[0].id);
  const c = customers.find((x) => x.id === selectedId)!;

  return (
    <PageShell title="Customer 360" subtitle="Unified view of every Orb Energy customer">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <Card className="p-2 h-fit">
          {customers.map((cust) => (
            <button
              key={cust.id}
              onClick={() => setSelectedId(cust.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedId === cust.id ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50 border border-transparent"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{cust.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cust.sites} sites · {cust.panels} panels</p>
                </div>
                <StatusBadge status={cust.status} />
              </div>
            </button>
          ))}
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[image:var(--gradient-eco)] flex items-center justify-center text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{c.name}</h2>
                  <p className="text-xs text-muted-foreground">{c.id} · Enterprise · Active since 2023</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Phone className="h-3.5 w-3.5 mr-1.5" /> Contact</Button>
                <Button size="sm"><FileText className="h-3.5 w-3.5 mr-1.5" /> Contract</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              {[
                { l: "System health", v: `${c.health}%`, i: Sun, color: c.health > 90 ? "text-success" : c.health > 80 ? "text-warning-foreground" : "text-destructive" },
                { l: "Active panels", v: c.panels.toString(), i: Zap, color: "text-info" },
                { l: "Monthly billing", v: c.mrr, i: Receipt, color: "text-primary" },
                { l: "Open alerts", v: c.status === "healthy" ? "0" : c.status === "warning" ? "2" : "4", i: AlertTriangle, color: c.status === "healthy" ? "text-success" : "text-destructive" },
              ].map((m) => (
                <div key={m.l} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><m.i className={`h-3.5 w-3.5 ${m.color}`} /> {m.l}</div>
                  <p className={`text-xl font-semibold mt-1 ${m.color}`}>{m.v}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 p-5">
              <h3 className="font-semibold">Energy generated — 24h</h3>
              <p className="text-xs text-muted-foreground mt-0.5 mb-3">All sites combined</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={energyTrend}>
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" fontSize={11} tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" />
                  <Tooltip />
                  <Area dataKey="today" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#cg)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-success" /> ROI snapshot</h3>
              <div className="space-y-3 mt-4">
                <div><p className="text-xs text-muted-foreground">Lifetime savings</p><p className="text-lg font-semibold">₹ 84.2 L</p></div>
                <div><p className="text-xs text-muted-foreground">Payback period</p><p className="text-lg font-semibold">3.8 yrs</p></div>
                <div><p className="text-xs text-muted-foreground">CO₂ offset YTD</p><p className="text-lg font-semibold">142 t</p></div>
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="font-semibold mb-3">Service & alert history</h3>
            <div className="space-y-2">
              {[
                { d: "Apr 24", t: "Quarterly inspection completed", k: "service" },
                { d: "Apr 18", t: "Inverter PCB replaced — Site 2", k: "service" },
                { d: "Apr 11", t: "Soiling alert resolved", k: "alert" },
                { d: "Mar 30", t: "Payment received · ₹ 1,08,000", k: "billing" },
              ].map((e) => (
                <div key={e.t} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
                  <span className="text-xs text-muted-foreground w-16 tabular-nums">{e.d}</span>
                  <span className="flex-1 text-sm">{e.t}</span>
                  <StatusBadge status={e.k === "alert" ? "warning" : "healthy"} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

export default CustomersPage;

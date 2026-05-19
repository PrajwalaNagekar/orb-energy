import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/KpiCard";
import { sitesComparison, fleetHealth, technicians, alerts as alertsData } from "@/lib/mock-data";
import { ShieldCheck, Activity, Package, Receipt, Download, Radio, Power, AlertTriangle, Bell, MessageSquare, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const heatmap = Array.from({ length: 7 * 24 }).map(() => Math.random());

const quickActions = [
  { id: "broadcast", label: "Broadcast alert", icon: Radio, tone: "bg-info/15 text-info" },
  { id: "remote", label: "Remote restart inverter", icon: Power, tone: "bg-warning/15 text-warning-foreground" },
  { id: "dispatch", label: "Mass-dispatch crew", icon: AlertTriangle, tone: "bg-destructive/15 text-destructive" },
  { id: "notify", label: "Notify customers", icon: Bell, tone: "bg-success/15 text-success" },
  { id: "message", label: "Open ops chat", icon: MessageSquare, tone: "bg-primary/15 text-primary" },
  { id: "shed", label: "Load-shed schedule", icon: Zap, tone: "bg-solar/15 text-solar-foreground" },
];

function AdminPage() {
  const [tab, setTab] = useState<"overview" | "sla" | "inventory">("overview");
  const [busy, setBusy] = useState<string | null>(null);

  const run = (id: string, label: string) => {
    setBusy(id);
    setTimeout(() => {
      setBusy(null);
      alert(`✓ ${label} executed`);
    }, 700);
  };

  return (
    <PageShell
      title="Admin Command Centre"
      subtitle="Fleet-wide operations & SLA control"
      actions={
        <>
          <Button size="sm" variant="outline" onClick={() => alert("Report exported to /reports")}><Download className="h-3.5 w-3.5 mr-1.5" /> Export report</Button>
          <Button size="sm" onClick={() => alert("Incident bridge opened — paging on-call")}> <AlertTriangle className="h-3.5 w-3.5 mr-1.5" /> Open incident</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="SLA compliance" value="98.4%" delta="+0.6%" icon={<ShieldCheck className="h-4 w-4" />} accent="success" />
        <KpiCard label="MTTR" value="2h 14m" delta="−18m" icon={<Activity className="h-4 w-4" />} accent="info" />
        <KpiCard label="Inventory in stock" value="1,284" hint="Across 6 warehouses" icon={<Package className="h-4 w-4" />} accent="primary" />
        <KpiCard label="Monthly revenue" value="₹ 3.2 Cr" delta="+12%" icon={<Receipt className="h-4 w-4" />} accent="solar" />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Quick actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((a) => (
            <button
              key={a.id}
              disabled={busy === a.id}
              onClick={() => run(a.id, a.label)}
              className="rounded-xl border border-border/60 p-3 hover:border-primary/40 hover:bg-muted/40 transition-colors text-left disabled:opacity-50"
            >
              <div className={`h-9 w-9 rounded-lg ${a.tone} flex items-center justify-center mb-2`}>
                <a.icon className="h-4 w-4" />
              </div>
              <p className="text-xs font-semibold leading-tight">{busy === a.id ? "Running…" : a.label}</p>
            </button>
          ))}
        </div>
      </Card>

      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(["overview", "sla", "inventory"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize ${tab === t ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            {t === "sla" ? "SLA & incidents" : t}
          </button>
        ))}
      </div>

      {tab === "overview" && (<>

      <Card className="p-5">
        <h3 className="font-semibold">Fleet health heatmap</h3>
        <p className="text-xs text-muted-foreground mt-0.5 mb-4">Past 7 days · 24-hour intensity (panel anomaly density)</p>
        <div className="flex gap-3">
          <div className="flex flex-col justify-around text-[10px] text-muted-foreground py-1 pr-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-24 gap-0.5 flex-1" style={{ gridTemplateColumns: "repeat(24, 1fr)" }}>
            {heatmap.map((v, i) => (
              <div
                key={i}
                title={`${Math.round(v * 100)}% load`}
                className="aspect-square rounded-sm"
                style={{ background: `oklch(0.65 ${0.05 + v * 0.18} ${155 - v * 80} / ${0.15 + v * 0.85})` }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-muted-foreground">
          <span>Low</span>
          <div className="flex gap-0.5">
            {[0.2, 0.4, 0.6, 0.8, 1].map((o) => (
              <div key={o} className="h-3 w-4 rounded-sm" style={{ background: `oklch(0.65 0.16 ${155 - o * 80} / ${o})` }} />
            ))}
          </div>
          <span>High</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold">Service analytics — by site</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Output vs target this week</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sitesComparison} layout="vertical" barCategoryGap={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" fontSize={11} width={100} />
              <Tooltip />
              <Bar dataKey="output" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">Technician performance</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">SLA score this week</p>
          <div className="space-y-3">
            {technicians.map((t) => (
              <div key={t.id}>
                <div className="flex items-center justify-between text-sm">
                  <span>{t.name}</span>
                  <span className="font-semibold tabular-nums">{t.sla}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[image:var(--gradient-eco)]" style={{ width: `${t.sla}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Weekly fleet status</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={fleetHealth}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" />
            <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
            <Tooltip />
            <Bar dataKey="healthy" stackId="a" fill="var(--color-chart-1)" />
            <Bar dataKey="warning" stackId="a" fill="var(--color-chart-3)" />
            <Bar dataKey="critical" stackId="a" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      </>)}

      {tab === "sla" && (
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Active incidents</h3>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-3 py-2">ID</th>
                  <th className="text-left font-medium px-3 py-2">Site</th>
                  <th className="text-left font-medium px-3 py-2">Issue</th>
                  <th className="text-left font-medium px-3 py-2">Opened</th>
                  <th className="text-right font-medium px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {alertsData.slice(0, 5).map((a) => (
                  <tr key={a.id} className="border-t border-border/60">
                    <td className="px-3 py-2.5 font-mono text-xs">{a.id}</td>
                    <td className="px-3 py-2.5">{a.site}</td>
                    <td className="px-3 py-2.5 font-medium">{a.title}</td>
                    <td className="px-3 py-2.5 text-muted-foreground text-xs">{a.time}</td>
                    <td className="px-3 py-2.5 text-right">
                      <Button size="sm" className="h-7 text-xs" onClick={() => alert(`Resolved ${a.id}`)}>Resolve</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "inventory" && (
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Warehouse inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { wh: "Bengaluru WH", stock: 412, low: 3 },
              { wh: "Pune WH", stock: 286, low: 1 },
              { wh: "Chennai WH", stock: 198, low: 5 },
              { wh: "Hyderabad WH", stock: 184, low: 0 },
              { wh: "Mumbai WH", stock: 124, low: 2 },
              { wh: "Delhi WH", stock: 80, low: 4 },
            ].map((w) => (
              <div key={w.wh} className="rounded-xl border border-border/60 p-4">
                <p className="text-xs text-muted-foreground">{w.wh}</p>
                <p className="text-2xl font-bold tabular-nums mt-1">{w.stock}</p>
                <p className="text-[11px] text-muted-foreground">parts in stock</p>
                {w.low > 0 ? (
                  <p className="mt-2 text-[10px] font-bold text-warning-foreground bg-warning/15 inline-block px-1.5 py-0.5 rounded uppercase">{w.low} low-stock SKUs</p>
                ) : (
                  <p className="mt-2 text-[10px] font-bold text-success bg-success/15 inline-block px-1.5 py-0.5 rounded uppercase">All stocked</p>
                )}
                <Button size="sm" variant="outline" className="mt-3 h-7 text-xs w-full" onClick={() => alert(`Reorder requested for ${w.wh}`)}>Reorder</Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageShell>
  );
}

export default AdminPage;

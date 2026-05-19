import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/KpiCard";
import { inventory, techniciansFull } from "@/lib/admin-data";
import { Package, AlertTriangle, Truck, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

const tip = { contentStyle: { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 } };

function Inv() {
  const [reordering, setReordering] = useState<string | null>(null);
  const lowStock = inventory.filter((s) => s.stock < s.reorder);
  const totalUnits = inventory.reduce((a, s) => a + s.stock, 0);

  const reorder = (id: string, name: string) => {
    setReordering(id);
    setTimeout(() => {
      setReordering(null);
      toast.success("Reorder PO created", { description: `${name} · ETA 4 business days` });
    }, 700);
  };

  return (
    <PageShell title="Inventory & Technician Planning" subtitle="Spare parts, capacity planning and skills-based deployment">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total units in stock" value={totalUnits.toLocaleString()} icon={<Package className="h-4 w-4" />} accent="info" hint="Across 6 warehouses" />
        <KpiCard label="Low-stock SKUs" value={`${lowStock.length}`} icon={<AlertTriangle className="h-4 w-4" />} accent="warning" hint="Below reorder point" />
        <KpiCard label="Open POs" value="9" icon={<Truck className="h-4 w-4" />} accent="primary" hint="₹ 28.4 L in flight" />
        <KpiCard label="Active technicians" value={`${techniciansFull.filter((t) => t.status !== "Off duty").length}`} icon={<Users className="h-4 w-4" />} accent="success" hint={`${techniciansFull.length} on roster`} />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold">Spare parts inventory</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Live · grouped by SKU</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => toast.success("Inventory CSV exported")}>Export CSV</Button>
        </div>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2 font-medium">SKU</th>
                <th className="text-left px-3 py-2 font-medium">Item</th>
                <th className="text-left px-3 py-2 font-medium">Warehouse</th>
                <th className="text-right px-3 py-2 font-medium">Stock</th>
                <th className="text-right px-3 py-2 font-medium">Reorder pt</th>
                <th className="text-right px-3 py-2 font-medium">Burn / mo</th>
                <th className="text-right px-3 py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((s) => {
                const low = s.stock < s.reorder;
                return (
                  <tr key={s.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-mono text-xs">{s.id}</td>
                    <td className="px-3 py-2.5 font-medium">{s.name}<br /><span className="text-[10px] text-muted-foreground">{s.category}</span></td>
                    <td className="px-3 py-2.5 text-muted-foreground">{s.warehouse}</td>
                    <td className={`px-3 py-2.5 text-right tabular-nums font-semibold ${low ? "text-warning-foreground" : ""}`}>{s.stock}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{s.reorder}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{s.monthlyBurn}</td>
                    <td className="px-3 py-2.5 text-right">
                      <Button size="sm" variant={low ? "default" : "outline"} className="h-7 text-xs" disabled={reordering === s.id} onClick={() => reorder(s.id, s.name)}>
                        {reordering === s.id ? "Ordering…" : low ? "Reorder" : "Order"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Burn vs stock (top SKUs)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={inventory.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="id" fontSize={10} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip {...tip} />
              <Bar dataKey="stock" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="monthlyBurn" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Technician capacity by region</h3>
          <div className="space-y-3">
            {techniciansFull.map((t) => (
              <div key={t.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{t.name} <span className="text-[11px] text-muted-foreground font-normal">· {t.region}</span></span>
                  <span className="tabular-nums text-xs">{t.jobs}/{t.capacity}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                  <div className={`h-full ${t.utilization > 80 ? "bg-destructive" : t.utilization > 60 ? "bg-warning" : "bg-success"}`} style={{ width: `${t.utilization}%` }} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">Skills: {t.skills.join(" · ")}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default Inv;

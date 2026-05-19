import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/KpiCard";
import { customers } from "@/lib/mock-data";
import { Receipt, Download, Search, FileText, CreditCard, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const monthly = [
  { m: "Apr", revenue: 24, outstanding: 3 },
  { m: "May", revenue: 26, outstanding: 4 },
  { m: "Jun", revenue: 28, outstanding: 2 },
  { m: "Jul", revenue: 30, outstanding: 5 },
  { m: "Aug", revenue: 31, outstanding: 3 },
  { m: "Sep", revenue: 32, outstanding: 2 },
];

type InvoiceStatus = "paid" | "due" | "overdue";
const invoices: { id: string; customer: string; amount: string; due: string; status: InvoiceStatus }[] = [
  { id: "INV-90142", customer: "Tata Coffee Estates", amount: "₹ 1,42,000", due: "Sep 28, 2026", status: "paid" },
  { id: "INV-90141", customer: "Apollo Hospitals", amount: "₹ 1,08,000", due: "Sep 25, 2026", status: "overdue" },
  { id: "INV-90140", customer: "Manipal University", amount: "₹ 2,40,000", due: "Sep 30, 2026", status: "due" },
  { id: "INV-90139", customer: "Godrej Logistics", amount: "₹ 3,18,000", due: "Sep 22, 2026", status: "paid" },
  { id: "INV-90138", customer: "InfoEdge Tower", amount: "₹ 62,500", due: "Sep 20, 2026", status: "paid" },
  { id: "INV-90137", customer: "Reliance Mart", amount: "₹ 84,200", due: "Oct 02, 2026", status: "due" },
];

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-success/15 text-success",
  due: "bg-info/15 text-info",
  overdue: "bg-destructive/15 text-destructive" };

function BillingPage() {
  const [tab, setTab] = useState<"invoices" | "subscriptions" | "payouts">("invoices");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | InvoiceStatus>("all");

  const filtered = useMemo(
    () =>
      invoices.filter(
        (i) =>
          (filter === "all" || i.status === filter) &&
          (q === "" || i.customer.toLowerCase().includes(q.toLowerCase()) || i.id.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, filter],
  );

  return (
    <PageShell
      title="Billing"
      subtitle="Invoices, subscriptions and payouts"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => alert("CSV export started — check downloads")}><Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV</Button>
          <Button size="sm" onClick={() => alert("New invoice draft created")}><FileText className="h-3.5 w-3.5 mr-1.5" /> New invoice</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Monthly revenue" value="₹ 32.4 L" delta="+8.1%" icon={<Receipt className="h-4 w-4" />} accent="success" />
        <KpiCard label="Outstanding" value="₹ 4.2 L" delta="−12%" icon={<AlertCircle className="h-4 w-4" />} accent="warning" />
        <KpiCard label="Avg days to pay" value="11.4 d" delta="−1.2 d" icon={<Clock className="h-4 w-4" />} accent="info" />
        <KpiCard label="Active contracts" value="124" delta="+6" icon={<CreditCard className="h-4 w-4" />} accent="primary" />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Revenue vs outstanding (₹ Lakhs)</h3>
        <p className="text-xs text-muted-foreground mt-0.5 mb-4">Last 6 months</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip />
            <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outstanding" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["invoices", "subscriptions", "payouts"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize ${tab === t ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invoices…" className="pl-8 h-8 w-56 text-xs" />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value as never)} className="h-8 text-xs rounded-md border border-border bg-background px-2">
              <option value="all">All status</option>
              <option value="paid">Paid</option>
              <option value="due">Due</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {tab === "invoices" && (
          <div className="overflow-hidden rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-3 py-2">Invoice</th>
                  <th className="text-left font-medium px-3 py-2">Customer</th>
                  <th className="text-left font-medium px-3 py-2">Amount</th>
                  <th className="text-left font-medium px-3 py-2">Due</th>
                  <th className="text-left font-medium px-3 py-2">Status</th>
                  <th className="text-right font-medium px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="px-3 py-2.5 font-mono text-xs">{i.id}</td>
                    <td className="px-3 py-2.5 font-medium">{i.customer}</td>
                    <td className="px-3 py-2.5 tabular-nums">{i.amount}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{i.due}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${statusStyles[i.status]}`}>
                        {i.status === "paid" && <CheckCircle2 className="h-3 w-3" />}
                        {i.status === "overdue" && <AlertCircle className="h-3 w-3" />}
                        {i.status === "due" && <Clock className="h-3 w-3" />}
                        {i.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Button variant="ghost" size="sm" onClick={() => alert(`Opening ${i.id}`)} className="h-7 text-xs">View</Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground text-sm">No invoices match your filter</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "subscriptions" && (
          <div className="space-y-2">
            {customers.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3 hover:border-primary/40">
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.sites} sites · {c.panels} panels · billed monthly</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums text-sm">{c.mrr}</p>
                  <p className="text-[10px] uppercase tracking-wider text-success">Active</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "payouts" && (
          <div className="rounded-lg border border-border/60 p-6 text-center">
            <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Next payout: <span className="tabular-nums">₹ 28.6 L</span></p>
            <p className="text-xs text-muted-foreground mt-1">Settles to HDFC ****4421 on Oct 03, 2026</p>
            <Button size="sm" className="mt-3" onClick={() => alert("Payout schedule opened")}>View schedule</Button>
          </div>
        )}
      </Card>
    </PageShell>
  );
}

export default BillingPage;

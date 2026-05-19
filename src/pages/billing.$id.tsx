import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { invoices } from "@/lib/admin-data";
import { ArrowLeft, Download, Send, CheckCircle2, FileText, AlertCircle, Clock } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";

const statusTone: Record<string, string> = {
  Paid: "bg-success/10 text-success",
  Pending: "bg-info/10 text-info",
  Overdue: "bg-destructive/10 text-destructive",
  Disputed: "bg-warning/15 text-warning-foreground" };

function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const inv = invoices.find((i) => i.id === id);
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [paid, setPaid] = useState(false);

  if (!inv) {
    return (
      <PageShell title="Invoice not found">
        <EmptyState
          title={`Invoice ${id} not found`}
          description="It may have been removed or the link is incorrect."
          action={<Button asChild><Link to="/billing">Back to billing</Link></Button>}
        />
      </PageShell>
    );
  }

  const lineItems = [
    { desc: "Care+ subscription · monthly", qty: 1, rate: Math.round(inv.amount * 0.7), total: Math.round(inv.amount * 0.7) },
    { desc: "Spare parts (PCB rev 3.2)", qty: 1, rate: Math.round(inv.amount * 0.18), total: Math.round(inv.amount * 0.18) },
    { desc: "On-site labour · 2 visits", qty: 2, rate: Math.round(inv.amount * 0.06), total: Math.round(inv.amount * 0.12) },
  ];
  const subtotal = lineItems.reduce((a, l) => a + l.total, 0);
  const tax = Math.round(subtotal * 0.18);

  const status = paid ? "Paid" : inv.status;

  return (
    <PageShell
      title={inv.id}
      subtitle={`${inv.customer} · ${inv.customerId}`}
      actions={
        <>
          <Button asChild variant="outline" size="sm"><Link to="/billing"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back</Link></Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("PDF generated", { description: `${inv.id}.pdf` })}>
            <Download className="h-3.5 w-3.5 mr-1.5" /> Download PDF
          </Button>
          <Button size="sm" onClick={() => toast.success("Reminder sent to customer")}>
            <Send className="h-3.5 w-3.5 mr-1.5" /> Send reminder
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between border-b border-border pb-4 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Bill to</p>
              <p className="text-base font-semibold mt-1">{inv.customer}</p>
              <p className="text-xs text-muted-foreground">{inv.customerId} · India</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Status</p>
              <span className={`inline-flex items-center gap-1 mt-1 text-[11px] font-bold uppercase px-2 py-0.5 rounded ${statusTone[status]}`}>
                {status === "Paid" && <CheckCircle2 className="h-3 w-3" />}
                {status === "Overdue" && <AlertCircle className="h-3 w-3" />}
                {status === "Pending" && <Clock className="h-3 w-3" />}
                {status}
              </span>
              <p className="text-[11px] text-muted-foreground mt-2">Due {inv.due}</p>
              <p className="text-[11px] text-muted-foreground">Issued {inv.issued}</p>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="text-left font-medium pb-2">Description</th>
                <th className="text-right font-medium pb-2 w-16">Qty</th>
                <th className="text-right font-medium pb-2 w-32">Rate</th>
                <th className="text-right font-medium pb-2 w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((l) => (
                <tr key={l.desc} className="border-t border-border/60">
                  <td className="py-2.5">{l.desc}</td>
                  <td className="py-2.5 text-right tabular-nums">{l.qty}</td>
                  <td className="py-2.5 text-right tabular-nums">₹ {l.rate.toLocaleString()}</td>
                  <td className="py-2.5 text-right tabular-nums font-medium">₹ {l.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 ml-auto w-64 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">₹ {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST 18%</span><span className="tabular-nums">₹ {tax.toLocaleString()}</span></div>
            <div className="flex justify-between border-t border-border pt-1 font-semibold"><span>Total</span><span className="tabular-nums">₹ {(subtotal + tax).toLocaleString()}</span></div>
          </div>
        </Card>

        <div className="space-y-3">
          <Card className="p-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Actions</p>
            <div className="space-y-2">
              <Button className="w-full" disabled={status === "Paid"} onClick={() => setConfirmPaid(true)}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark as paid
              </Button>
              <Button variant="outline" className="w-full" onClick={() => toast.success("Credit note draft created")}>
                <FileText className="h-3.5 w-3.5 mr-1.5" /> Issue credit note
              </Button>
              <Button variant="outline" className="w-full" onClick={() => { toast.success("Invoice voided"); navigate("/billing"); }}>
                Void invoice
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Timeline</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /><span>{inv.issued} · Invoice issued</span></div>
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /><span>{inv.issued} · Sent to customer</span></div>
              {status === "Paid" && <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-success" /><span>Today · Payment received</span></div>}
              {status === "Overdue" && <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-destructive" /><span>{inv.due} · Past due</span></div>}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmPaid}
        onOpenChange={setConfirmPaid}
        title="Mark invoice as paid?"
        description={`This will mark ${inv.id} (${"₹ " + inv.amount.toLocaleString()}) as paid and notify the customer.`}
        confirmLabel="Mark as paid"
        onConfirm={() => { setPaid(true); toast.success("Invoice marked as paid"); }}
      />
    </PageShell>
  );
}

export default InvoiceDetail;

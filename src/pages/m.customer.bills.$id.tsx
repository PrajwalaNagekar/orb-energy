import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

function BillDetail() {
  const { id } = useParams();
  return (
    <MobileShell theme="customer">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/customer/bills" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Invoice</h1>
        <button className="ml-auto p-2"><Share2 className="h-4 w-4 text-slate-500" /></button>
      </header>

      <div className="px-5">
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Invoice</p>
              <p className="text-base font-bold">{id}</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 rounded bg-amber-100 text-amber-700">DUE</span>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 space-y-2 text-sm">
            <Row k="Service period" v="1–31 August 2026" />
            <Row k="Energy generated" v="742 kWh" />
            <Row k="Self-consumed" v="612 kWh" />
            <Row k="Exported to grid" v="130 kWh" />
            <Row k="O&M charge" v="₹ 1,240" />
            <Row k="Grid credit" v="− ₹ 0" />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm text-slate-500">Amount due</span>
            <span className="text-2xl font-bold">₹ 1,240</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-4">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">You saved</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">₹ 4,820 this month</p>
          <p className="text-[11px] text-emerald-700/80 mt-1">vs grid-only electricity at ₹ 8.10/unit</p>
        </div>

        <button className="mt-4 w-full rounded-xl bg-emerald-500 text-white font-semibold text-sm py-3.5">Pay ₹ 1,240</button>
        <button className="mt-2 w-full rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm py-3 inline-flex items-center justify-center gap-2">
          <Download className="h-4 w-4" /> Download PDF
        </button>
      </div>
    </MobileShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{k}</span>
      <span className="font-medium text-slate-900 dark:text-white">{v}</span>
    </div>
  );
}

export default BillDetail;
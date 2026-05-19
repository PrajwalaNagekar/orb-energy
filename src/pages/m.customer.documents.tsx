import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, ShieldCheck, FileSignature, FileBarChart, Receipt } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useCustomerProfile } from "@/lib/customer-profile";

const docs = [
  { i: FileSignature, t: "Installation contract", d: "Signed 18 Mar 2024 · 14 pages", size: "1.2 MB", tag: "Active" },
  { i: ShieldCheck,   t: "Performance warranty",  d: "25-year linear · Orb Mono PERC", size: "480 KB", tag: "Active" },
  { i: ShieldCheck,   t: "Inverter warranty",     d: "10 + 5 yrs (extended)", size: "320 KB", tag: "Active" },
  { i: FileBarChart,  t: "Net-metering certificate", d: "MSEDCL · 14.4 kWp sanctioned", size: "210 KB", tag: "Verified" },
  { i: FileBarChart,  t: "Subsidy disbursement",  d: "PM-KUSUM · ₹ 78,000 received", size: "95 KB",  tag: "Closed" },
  { i: Receipt,       t: "Annual statement 2025", d: "Generation, savings, tax view", size: "640 KB", tag: "FY24-25" },
  { i: FileText,      t: "Service log book",      d: "12 visits · auto-compiled", size: "1.8 MB", tag: "Live" },
];

function Documents() {
  const { profile } = useCustomerProfile();
  return (
    <MobileShell theme="customer">
      <header className="px-5 pt-12 pb-3 flex items-center gap-3">
        <Link to="/m/customer/profile" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">{profile.customerId}</p>
          <h1 className="text-base font-semibold leading-tight">Documents & Contracts</h1>
        </div>
      </header>

      <div className="px-5 pb-8">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/60">Vault</p>
          <p className="text-sm font-semibold mt-1">All documents are e-signed and verifiable on chain.</p>
          <p className="text-[10px] text-white/60 mt-2 font-mono">SHA-256 ledger · last sync {new Date(profile.syncedAt).toLocaleDateString()}</p>
        </div>

        <div className="mt-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {docs.map((d) => (
            <button key={d.t} className="w-full flex items-center gap-3 p-3.5 text-left active:bg-slate-50 dark:active:bg-slate-700/30">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <d.i className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{d.t}</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">{d.tag}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{d.d}</p>
                <p className="text-[10px] text-slate-400 font-mono">{d.size}</p>
              </div>
              <Download className="h-4 w-4 text-slate-400" />
            </button>
          ))}
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-4">
          Documents are mirrored from Orb Admin Console · ticket workflow {profile.customerId}
        </p>
      </div>
    </MobileShell>
  );
}

export default Documents;

import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Wallet, TrendingUp, Calendar, Target } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { MobileShell } from "@/components/MobileShell";
import { useScenario, inr } from "@/lib/scenario";

const bills = [
  { id: "INV-2608", m: "Aug 2026", amt: 1240, paid: false, due: "5 Sep" },
  { id: "INV-2507", m: "Jul 2026", amt: 1180, paid: true },
  { id: "INV-2406", m: "Jun 2026", amt: 1320, paid: true },
];

function Bills() {
  return (
    <MobileShell theme="customer">
      <Inner />
    </MobileShell>
  );
}

function Inner() {
  const { scenario: s } = useScenario();
  // Build ROI cumulative series from monthly savings curve
  const cum: { m: string; cumulative: number }[] = [];
  let acc = 0;
  s.monthly.forEach((row) => {
    acc += row.bill;
    cum.push({ m: row.m, cumulative: Math.round(acc) });
  });
  return (
    <>
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/customer" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">ROI & Bills</h1>
      </header>

      <div className="px-5 space-y-5">
        {/* Lifetime earnings hero */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <p className="text-[11px] uppercase tracking-wider text-white/80">Lifetime earnings</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold">{inr(s.lifetimeEarningsInr)}</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] text-white/70">Payback</p>
              <p className="text-sm font-bold">{s.paybackYears} yrs</p>
            </div>
            <div>
              <p className="text-[10px] text-white/70">Monthly avg</p>
              <p className="text-sm font-bold">{inr(s.monthlyAvgInr)}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/70">Annual proj</p>
              <p className="text-sm font-bold">{inr(s.annualProjectionInr)}</p>
            </div>
          </div>
        </div>

        {/* Monthly comparison chart */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-white inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" /> Monthly savings
            </p>
            <span className="text-[11px] text-slate-500">12 months</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer>
              <BarChart data={s.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f015" />
                <XAxis dataKey="m" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip cursor={{ fill: "#10b98118" }} formatter={(v) => `₹ ${v}`} />
                <Bar dataKey="bill" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lifetime projection */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-white inline-flex items-center gap-2">
              <Target className="h-4 w-4 text-sky-600" /> Annual projection
            </p>
            <span className="text-[11px] text-slate-500">cumulative</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer>
              <LineChart data={cum}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f015" />
                <XAxis dataKey="m" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip formatter={(v) => `₹ ${v}`} />
                <Line dataKey="cumulative" stroke="#0284c7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outstanding bill */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-wider text-white/80">Outstanding</p>
            <Wallet className="h-4 w-4 text-white/80" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold">{inr(1240)}</span>
          </div>
          <p className="text-[11px] text-white/80 mt-1">Due 5 September · INV-2608</p>
          <button className="mt-4 w-full rounded-xl bg-white text-violet-700 font-semibold text-sm py-2.5">Pay now</button>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Recent invoices</p>
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
            {bills.map((b) => (
              <Link key={b.id} to={`/m/customer/bills/${b.id}`} className="flex items-center gap-3 p-3.5">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{b.m}</p>
                  <p className="text-[11px] text-slate-500">{b.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{inr(b.amt)}</p>
                  <p className={`text-[10px] font-semibold ${b.paid ? "text-emerald-600" : "text-amber-600"}`}>{b.paid ? "Paid" : `Due ${b.due}`}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Environmental impact callout */}
        <Link to="/m/customer/impact" className="block rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/80">Environmental impact</p>
              <p className="text-sm font-semibold mt-0.5">{s.monthCo2Kg} kg CO₂ offset · {s.treesEquivalent} trees</p>
            </div>
            <ChevronRight className="h-5 w-5" />
          </div>
        </Link>

        <div className="flex items-center gap-2 pb-4 text-[11px] text-slate-500">
          <TrendingUp className="h-3 w-3" />
          Charts respond to current scenario · tap the icon (bottom-right)
        </div>
      </div>
    </>
  );
}

export default Bills;
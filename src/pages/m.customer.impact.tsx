import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, TreePine, Car, Lightbulb, Globe, Award } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useScenario } from "@/lib/scenario";

function Impact() {
  return (
    <MobileShell theme="customer">
      <Inner />
    </MobileShell>
  );
}

function Inner() {
  const { scenario: s } = useScenario();
  const lifetimeCo2 = Math.round(s.monthCo2Kg * 36); // ~3 years
  const carKm = Math.round(lifetimeCo2 * 4.6); // 1 kg CO2 ≈ 4.6 km driven
  const bulbHours = Math.round(s.monthKwh * 100); // 10W bulb hours equivalent
  return (
    <>
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/customer/bills" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Environmental Impact</h1>
      </header>

      <div className="px-5 space-y-4">
        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-600 to-green-700 text-white p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <Globe className="h-5 w-5 text-white/80" />
          <p className="text-[11px] uppercase tracking-wider text-white/80 mt-3">CO₂ offset this month</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl font-bold">{s.monthCo2Kg}</span>
            <span className="text-base text-white/80">kg</span>
          </div>
          <p className="text-xs text-white/80 mt-2">
            Equivalent to planting <span className="font-bold text-white">{s.treesEquivalent} trees</span> this month
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card icon={TreePine} c="bg-emerald-100 text-emerald-700" v={`${s.treesEquivalent}`} l="Trees planted" sub="this month" />
          <Card icon={Leaf} c="bg-teal-100 text-teal-700" v={`${lifetimeCo2}`} l="kg CO₂" sub="lifetime offset" />
          <Card icon={Car} c="bg-sky-100 text-sky-700" v={`${carKm.toLocaleString("en-IN")}`} l="km not driven" sub="equivalent" />
          <Card icon={Lightbulb} c="bg-amber-100 text-amber-700" v={`${(bulbHours / 1000).toFixed(0)}k`} l="LED hours" sub="powered" />
        </div>

        {/* Community contribution */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-amber-600" />
            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-200">Your community contribution</p>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            You're in the <span className="font-bold text-emerald-600">top 12%</span> of Orb Energy customers in Bengaluru for monthly clean-energy generation.
          </p>
          <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${Math.min(100, s.healthScore + 5)}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-slate-500">
            <span>0</span><span>Top 1%</span>
          </div>
        </div>

        {/* Story strip */}
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-4">
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold uppercase tracking-wider">Did you know?</p>
          <p className="text-sm text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
            Your solar system has prevented enough CO₂ this month to offset a round-trip flight from Bengaluru to Delhi.
          </p>
        </div>

        <div className="h-6" />
      </div>
    </>
  );
}

function Card({ icon: Icon, c, v, l, sub }: { icon: React.ElementType; c: string; v: string; l: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
      <div className={`h-9 w-9 rounded-xl ${c} flex items-center justify-center mb-3`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{v}</div>
      <div className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-0.5">{l}</div>
      <div className="text-[10px] text-slate-500">{sub}</div>
    </div>
  );
}

export default Impact;
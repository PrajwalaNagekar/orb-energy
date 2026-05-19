import { Link } from "react-router-dom";
import { ArrowLeft, Shield, KeyRound, Fingerprint, Smartphone, Eye, Database, History, MapPin } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useCustomerProfile } from "@/lib/customer-profile";
import { useState } from "react";

function Privacy() {
  const { profile } = useCustomerProfile();
  const [biometric, setBiometric] = useState(true);
  const [twofa, setTwofa] = useState(true);
  const [share, setShare] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [location, setLocation] = useState(true);

  return (
    <MobileShell theme="customer">
      <header className="px-5 pt-12 pb-3 flex items-center gap-3">
        <Link to="/m/customer/profile" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">{profile.customerId}</p>
          <h1 className="text-base font-semibold leading-tight">Privacy & Security</h1>
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5">
          <Shield className="h-6 w-6" />
          <p className="text-base font-semibold mt-2">Account secure</p>
          <p className="text-[11px] text-white/80 mt-1">2FA enabled · biometric lock active · last sign-in from Pune, MH · 2 hr ago</p>
        </div>

        <Section title="Authentication">
          <Row i={KeyRound} l="Change password" sub="Last changed 47 days ago" action="Update" />
          <Toggle label="Biometric login (Face/Fingerprint)" icon={Fingerprint} value={biometric} onChange={setBiometric} />
          <Toggle label="Two-factor authentication" icon={Smartphone} value={twofa} onChange={setTwofa} />
        </Section>

        <Section title="Data & sharing">
          <Toggle label="Share generation data with grid" icon={Database} value={share} onChange={setShare} />
          <Toggle label="Anonymous usage analytics" icon={Eye} value={analytics} onChange={setAnalytics} />
          <Toggle label="Location for service routing" icon={MapPin} value={location} onChange={setLocation} />
        </Section>

        <Section title="Activity">
          <Row i={History} l="Sign-in history" sub="6 sessions · 3 devices" action="View" />
          <Row i={Database} l="Download my data" sub="GDPR / DPDP export · ZIP" action="Request" />
          <Row i={Shield} l="Trusted devices" sub="iPhone 15 Pro · iPad Air" action="Manage" />
        </Section>

        <button className="w-full rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 font-semibold text-sm py-3">
          Delete account
        </button>

        <p className="text-[10px] text-center text-slate-400">
          Encrypted end-to-end · audit log available to admin {profile.accountManager}
        </p>
      </div>
    </MobileShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">{title}</p>
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
        {children}
      </div>
    </div>
  );
}

function Toggle({ label, icon: I, value, onChange }: { label: string; icon: typeof Shield; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="w-full flex items-center gap-3 p-3.5 text-left">
      <I className="h-4 w-4 text-slate-500" />
      <span className="text-sm flex-1">{label}</span>
      <span className={`relative h-6 w-10 rounded-full transition-colors ${value ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}

function Row({ i: I, l, sub, action }: { i: typeof Shield; l: string; sub: string; action: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-3.5 text-left">
      <I className="h-4 w-4 text-slate-500" />
      <div className="flex-1">
        <p className="text-sm font-medium">{l}</p>
        <p className="text-[10px] text-slate-500">{sub}</p>
      </div>
      <span className="text-[11px] font-semibold text-emerald-600">{action}</span>
    </button>
  );
}

export default Privacy;
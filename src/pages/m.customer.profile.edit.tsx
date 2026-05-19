import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Lock } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useCustomerProfile } from "@/lib/customer-profile";
import { useState } from "react";

function EditProfile() {
  const { profile, update } = useCustomerProfile();
  const navigate = useNavigate();
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm({ ...form, [k]: v });

  const save = () => {
    update(form);
    setSaved(true);
    setTimeout(() => navigate("/m/customer/profile"), 600);
  };

  return (
    <MobileShell theme="customer">
      <header className="px-5 pt-12 pb-3 flex items-center gap-3">
        <Link to="/m/customer/profile" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Edit profile</h1>
        <button onClick={save} className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          {saved ? "Saved ✓" : <><Save className="h-3.5 w-3.5" /> Save</>}
        </button>
      </header>

      <div className="px-5 pb-8 space-y-5">
        {/* Read-only IDs */}
        <Section title="Identity (read-only)">
          <Locked label="Orb Customer ID" value={profile.customerId} hint="System-issued · join key with admin & technician" />
          <Locked label="Plan" value={profile.plan} hint="Change via Orb Admin Console" />
          <Locked label="Account manager" value={profile.accountManager} />
        </Section>

        <Section title="Personal">
          <Field label="Full name" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="Email" value={form.email} onChange={(v) => set("email", v)} type="email" />
          <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} type="tel" />
        </Section>

        <Section title="Site address">
          <Field label="Address" value={form.address} onChange={(v) => set("address", v)} />
          <div className="grid grid-cols-2 gap-2">
            <Field label="City" value={form.city} onChange={(v) => set("city", v)} />
            <Field label="Pincode" value={form.pincode} onChange={(v) => set("pincode", v)} />
          </div>
        </Section>

        <Section title="System (read-only)">
          <Locked label="System size" value={`${form.systemKwp} kWp`} hint="Configured by Orb engineering" />
          <Locked label="Panel count" value={String(form.panelCount)} />
          <Locked label="Inverter model" value={form.inverterModel} />
          <Locked label="Install date" value={form.installDate} />
          <p className="text-[10px] text-slate-400 px-1">System specs are managed by Orb Admin and cannot be edited here. Contact your account manager for changes.</p>
        </Section>

        <button onClick={save} className="w-full rounded-xl bg-emerald-500 text-white font-semibold py-3.5 text-sm">
          {saved ? "Saved · syncing to admin…" : "Save & sync to Orb Admin"}
        </button>
        <p className="text-[10px] text-center text-slate-400">
          Changes are queued to admin · config v{profile.configVersion} → v{profile.configVersion + 1}
        </p>
      </div>
    </MobileShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">{title}</p>
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 space-y-3">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-slate-100 dark:bg-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </label>
  );
}

function Locked({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-700 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
        <Lock className="h-2.5 w-2.5" /> {label}
      </p>
      <p className="text-sm font-mono font-semibold text-slate-800 dark:text-slate-100">{value}</p>
      {hint && <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>}
    </div>
  );
}

export default EditProfile;
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, IdCard, User, Mail, Phone, MapPin, Truck, Lock } from "lucide-react";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useTechProfile } from "@/lib/tech-profile";

function TechProfileEdit() {
  const { profile, update } = useTechProfile();
  const navigate = useNavigate();
  const [form, setForm] = useState(profile);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((p) => ({ ...p, [k]: v }));

  const save = () => {
    update(form);
    navigate("/m/tech/profile");
  };

  return (
    <MobileShell theme="tech">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <Link to="/m/tech/profile" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Edit profile</h1>
        <button onClick={save} className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-orange-500 text-white px-3 py-1.5 text-xs font-semibold">
          <Save className="h-3.5 w-3.5" /> Save
        </button>
      </header>

      <div className="px-5 py-5 pb-12 space-y-5">
        {/* Locked Tech ID */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Identity</p>
          <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
            <IdCard className="h-4 w-4 text-orange-500" />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Technician ID · admin-issued</p>
              <p className="text-[14px] font-mono font-semibold">{form.techId}</p>
            </div>
            <Lock className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* Editable fields */}
        <Group title="Personal">
          <Field icon={<User className="h-4 w-4" />} label="Full name" value={form.name} onChange={(v) => set("name", v)} />
          <Field icon={<Mail className="h-4 w-4" />} label="Email" value={form.email} onChange={(v) => set("email", v)} />
          <Field icon={<Phone className="h-4 w-4" />} label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
        </Group>

        <Group title="Field assignment">
          <Field icon={<MapPin className="h-4 w-4" />} label="Region" value={form.region} onChange={(v) => set("region", v)} />
          <Field icon={<MapPin className="h-4 w-4" />} label="Home base" value={form.homeBase} onChange={(v) => set("homeBase", v)} />
          <Field icon={<Truck className="h-4 w-4" />} label="Van ID" value={form.vanId} onChange={(v) => set("vanId", v)} />
        </Group>

        <Group title="Skills (comma separated)">
          <textarea
            className="w-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 text-sm outline-none focus:border-orange-400"
            rows={3}
            value={form.skills.join(", ")}
            onChange={(e) => set("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          />
        </Group>

        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3.5 text-[11px] text-amber-800 dark:text-amber-200">
          Changes sync to the Admin Panel using your Technician ID. Dispatch zone, certifications and shift remain admin-controlled.
        </div>

        <button onClick={save} className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm py-4">
          Save &amp; sync to admin
        </button>
      </div>
    </MobileShell>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Field({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-orange-400 px-4 py-3 transition-colors">
        <span className="text-orange-500">{icon}</span>
        <input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 outline-none bg-transparent text-[14px]" />
      </div>
    </div>
  );
}

export default TechProfileEdit;

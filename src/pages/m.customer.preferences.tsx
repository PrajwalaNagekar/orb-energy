import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Globe, Moon, Sun, Volume2, Zap, Mail, MessageSquare, Smartphone } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useCustomerProfile } from "@/lib/customer-profile";
import { useState } from "react";

function Preferences() {
  const { profile } = useCustomerProfile();
  const [units, setUnits] = useState<"kWh" | "MJ">("kWh");
  const [currency, setCurrency] = useState("INR");
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [lang, setLang] = useState("English");
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [whatsapp, setWhatsapp] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [auto, setAuto] = useState(true);

  return (
    <MobileShell theme="customer">
      <header className="px-5 pt-12 pb-3 flex items-center gap-3">
        <Link to="/m/customer/profile" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">{profile.customerId}</p>
          <h1 className="text-base font-semibold leading-tight">Preferences</h1>
        </div>
      </header>

      <div className="px-5 pb-8 space-y-5">
        <Section title="Display">
          <Picker label="Units" icon={Zap} value={units} options={["kWh", "MJ"]} onChange={(v) => setUnits(v as "kWh" | "MJ")} />
          <Picker label="Currency" icon={Globe} value={currency} options={["INR", "USD", "EUR", "AED"]} onChange={setCurrency} />
          <Picker label="Theme" icon={theme === "dark" ? Moon : Sun} value={theme} options={["system", "light", "dark"]} onChange={(v) => setTheme(v as "system" | "light" | "dark")} />
          <Picker label="Language" icon={Globe} value={lang} options={["English", "हिन्दी", "मराठी", "தமிழ்"]} onChange={setLang} />
        </Section>

        <Section title="Notification channels">
          <Toggle label="Push notifications" icon={Smartphone} value={push} onChange={setPush} />
          <Toggle label="Email alerts" icon={Mail} value={email} onChange={setEmail} />
          <Toggle label="SMS (urgent only)" icon={MessageSquare} value={sms} onChange={setSms} />
          <Toggle label="WhatsApp updates" icon={MessageSquare} value={whatsapp} onChange={setWhatsapp} />
        </Section>

        <Section title="Behaviour">
          <Toggle label="Haptic feedback" icon={Volume2} value={haptics} onChange={setHaptics} />
          <Toggle label="Auto-approve routine maintenance" icon={Bell} value={auto} onChange={setAuto} />
        </Section>

        <p className="text-[10px] text-center text-slate-400">
          Preferences sync to Orb Cloud and override admin defaults for {profile.customerId}.
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

function Toggle({ label, icon: I, value, onChange }: { label: string; icon: typeof Bell; value: boolean; onChange: (v: boolean) => void }) {
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

function Picker({ label, icon: I, value, options, onChange }: { label: string; icon: typeof Bell; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3 p-3.5">
      <I className="h-4 w-4 text-slate-500" />
      <span className="text-sm flex-1">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="text-xs bg-slate-100 dark:bg-slate-700 rounded-lg px-2 py-1.5 outline-none">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default Preferences;
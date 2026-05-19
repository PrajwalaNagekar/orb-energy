import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, Plug, Users as UsersIcon, Palette, KeyRound, Trash2, Plus } from "lucide-react";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team & roles", icon: UsersIcon },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "api", label: "API keys", icon: KeyRound },
] as const;

type Section = (typeof sections)[number]["id"];

function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");
  return (
    <PageShell title="Settings" subtitle="Workspace, team and integration preferences">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
        <Card className="p-2 h-fit">
          <nav className="flex lg:flex-col gap-0.5 overflow-x-auto">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm whitespace-nowrap ${
                  active === s.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                }`}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </button>
            ))}
          </nav>
        </Card>

        <div>
          {active === "profile" && <ProfilePanel />}
          {active === "notifications" && <NotificationsPanel />}
          {active === "team" && <TeamPanel />}
          {active === "security" && <SecurityPanel />}
          {active === "integrations" && <IntegrationsPanel />}
          {active === "appearance" && <AppearancePanel />}
          {active === "api" && <ApiPanel />}
        </div>
      </div>
    </PageShell>
  );
}

function Panel({ title, desc, children, action }: { title: string; desc: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

function ProfilePanel() {
  const [name, setName] = useState("Shreya Anand");
  const [email, setEmail] = useState("shreya@orb.energy");
  const [role] = useState("Operations Lead");
  return (
    <Panel
      title="Profile"
      desc="Your personal information"
      action={<Button size="sm" onClick={() => alert("Profile saved ✓")}>Save changes</Button>}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-full bg-[image:var(--gradient-eco)] flex items-center justify-center text-xl font-semibold text-white">SA</div>
        <div>
          <Button size="sm" variant="outline" onClick={() => alert("Photo upload")}>Change photo</Button>
          <p className="text-xs text-muted-foreground mt-1">PNG/JPG up to 2 MB</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full name" value={name} onChange={setName} />
        <Field label="Email" value={email} onChange={setEmail} />
        <Field label="Role" value={role} onChange={() => {}} disabled />
        <Field label="Phone" value="+91 98765 43210" onChange={() => {}} />
      </div>
    </Panel>
  );
}

function NotificationsPanel() {
  const [opts, setOpts] = useState({
    critical: true, sla: true, billing: true, weekly: false, ai: true });
  const toggle = (k: keyof typeof opts) => setOpts({ ...opts, [k]: !opts[k] });
  return (
    <Panel title="Notifications" desc="What you're alerted about and where">
      <div className="space-y-3">
        {[
          { k: "critical", l: "Critical alerts", d: "Immediate panel/inverter failures" },
          { k: "sla", l: "SLA breaches", d: "When jobs cross response/repair SLA" },
          { k: "billing", l: "Billing events", d: "New invoices, failed payments, payouts" },
          { k: "weekly", l: "Weekly digest", d: "Monday morning fleet summary" },
          { k: "ai", l: "Orb-AI insights", d: "Predictions and recommendations" },
        ].map((o) => (
          <div key={o.k} className="flex items-center justify-between rounded-lg border border-border/60 p-3.5">
            <div>
              <p className="font-medium text-sm">{o.l}</p>
              <p className="text-xs text-muted-foreground">{o.d}</p>
            </div>
            <Switch checked={opts[o.k as keyof typeof opts]} onCheckedChange={() => toggle(o.k as keyof typeof opts)} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TeamPanel() {
  const team = [
    { n: "Shreya Anand", r: "Operations Lead", e: "shreya@orb.energy" },
    { n: "Rahul Verma", r: "Admin", e: "rahul@orb.energy" },
    { n: "Priya Nair", r: "Tech Manager", e: "priya@orb.energy" },
    { n: "Vikram Shah", r: "Finance", e: "vikram@orb.energy" },
  ];
  return (
    <Panel
      title="Team & roles"
      desc="Manage workspace members"
      action={<Button size="sm" onClick={() => alert("Invite dialog")}> <Plus className="h-3.5 w-3.5 mr-1" /> Invite</Button>}
    >
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-3 py-2">Member</th>
              <th className="text-left font-medium px-3 py-2">Role</th>
              <th className="text-left font-medium px-3 py-2 hidden md:table-cell">Email</th>
              <th className="text-right font-medium px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {team.map((m) => (
              <tr key={m.e} className="border-t border-border/60">
                <td className="px-3 py-2.5 font-medium">{m.n}</td>
                <td className="px-3 py-2.5">
                  <select defaultValue={m.r} className="text-xs rounded border border-border bg-background px-2 py-1">
                    <option>Operations Lead</option>
                    <option>Admin</option>
                    <option>Tech Manager</option>
                    <option>Finance</option>
                    <option>Read-only</option>
                  </select>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground text-xs hidden md:table-cell">{m.e}</td>
                <td className="px-3 py-2.5 text-right">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => alert(`Remove ${m.n}?`)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function SecurityPanel() {
  const [mfa, setMfa] = useState(true);
  return (
    <Panel title="Security" desc="Authentication and access controls">
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-border/60 p-3.5">
          <div>
            <p className="font-medium text-sm">Two-factor authentication</p>
            <p className="text-xs text-muted-foreground">Require TOTP code at every sign-in</p>
          </div>
          <Switch checked={mfa} onCheckedChange={setMfa} />
        </div>
        <div className="rounded-lg border border-border/60 p-3.5">
          <p className="font-medium text-sm">Change password</p>
          <p className="text-xs text-muted-foreground mb-3">Last changed 42 days ago</p>
          <Button size="sm" variant="outline" onClick={() => alert("Password reset email sent")}>Send reset email</Button>
        </div>
        <div className="rounded-lg border border-border/60 p-3.5">
          <p className="font-medium text-sm mb-2">Active sessions</p>
          {[
            { d: "MacBook Pro · Chrome", l: "Bengaluru · this device", c: true },
            { d: "iPhone 15 · Safari", l: "Bengaluru · 2 hours ago" },
          ].map((s) => (
            <div key={s.d} className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-medium">{s.d} {s.c && <span className="text-[10px] text-success ml-1">CURRENT</span>}</p>
                <p className="text-xs text-muted-foreground">{s.l}</p>
              </div>
              {!s.c && <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => alert(`Signed out ${s.d}`)}>Sign out</Button>}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function IntegrationsPanel() {
  const items = [
    { n: "Slack", d: "Send alerts to #ops-fleet", on: true },
    { n: "Microsoft Teams", d: "Channel notifications", on: false },
    { n: "Zoho Books", d: "Sync invoices & customers", on: true },
    { n: "ServiceNow", d: "Push tickets to ITSM", on: false },
    { n: "WhatsApp Business", d: "Customer notifications", on: true },
  ];
  return (
    <Panel title="Integrations" desc="Connect Orb with your stack">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((i) => (
          <div key={i.n} className="rounded-lg border border-border/60 p-3.5 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{i.n}</p>
              <p className="text-xs text-muted-foreground">{i.d}</p>
            </div>
            <Button size="sm" variant={i.on ? "outline" : "default"} className="h-7 text-xs" onClick={() => alert(`${i.on ? "Disconnect" : "Connect"} ${i.n}`)}>
              {i.on ? "Connected" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function AppearancePanel() {
  const [theme, setTheme] = useState("system");
  return (
    <Panel title="Appearance" desc="Theme, density and language">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Theme</p>
          <div className="grid grid-cols-3 gap-2">
            {["light", "dark", "system"].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded-lg border p-3 text-sm capitalize ${theme === t ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Default landing</p>
          <select className="text-sm rounded-md border border-border bg-background px-3 py-2 w-full md:w-64">
            <option>Executive Dashboard</option>
            <option>Command Centre</option>
            <option>Alerts</option>
          </select>
        </div>
      </div>
    </Panel>
  );
}

function ApiPanel() {
  return (
    <Panel
      title="API keys"
      desc="Programmatic access to Orb fleet data"
      action={<Button size="sm" onClick={() => alert("New API key generated — copy now")}> <Plus className="h-3.5 w-3.5 mr-1" /> New key</Button>}
    >
      <div className="space-y-2">
        {[
          { n: "Production · BI dashboard", k: "orb_live_••••••••2491", c: "Sep 12, 2026" },
          { n: "Staging · webhook test", k: "orb_test_••••••••0832", c: "Aug 28, 2026" },
        ].map((k) => (
          <div key={k.k} className="flex items-center justify-between rounded-lg border border-border/60 p-3.5">
            <div>
              <p className="font-medium text-sm">{k.n}</p>
              <p className="text-xs text-muted-foreground font-mono">{k.k} · created {k.c}</p>
            </div>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => alert(`Revoke ${k.n}?`)}>Revoke</Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Field({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <Input value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="mt-1" />
    </div>
  );
}

export default SettingsPage;

import { Link } from "react-router-dom";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Sparkles, CheckCircle2, Info } from "lucide-react";
import { adminAlerts } from "@/lib/admin-data";
import { toast } from "sonner";

const groups = [
  { label: "Today", items: adminAlerts.slice(0, 3) },
  { label: "Yesterday", items: adminAlerts.slice(3, 5) },
  { label: "Earlier", items: adminAlerts.slice(5) },
];

const sevIcon = { critical: AlertTriangle, warning: Sparkles, info: Info } as const;
const sevTone = {
  critical: "text-destructive bg-destructive/10",
  warning: "text-warning-foreground bg-warning/15",
  info: "text-info bg-info/10" } as const;

function Notifications() {
  const [read, setRead] = useState<Record<string, boolean>>({});
  const markAll = () => {
    const next: Record<string, boolean> = {};
    adminAlerts.forEach((a) => (next[a.id] = true));
    setRead(next);
    toast.success("All notifications marked as read");
  };

  return (
    <PageShell
      title="Notifications"
      subtitle="Live operational events from across the fleet"
      actions={<Button size="sm" variant="outline" onClick={markAll}>Mark all as read</Button>}
    >
      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">{g.label}</p>
            <div className="space-y-2">
              {g.items.length === 0 && (
                <Card className="p-4 text-center text-xs text-muted-foreground">No notifications</Card>
              )}
              {g.items.map((a) => {
                const Icon = sevIcon[a.severity];
                const isRead = read[a.id];
                return (
                  <Card key={a.id} className={`p-4 flex items-start gap-3 ${isRead ? "opacity-60" : ""}`}>
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${sevTone[a.severity]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{a.title}</p>
                        {!isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.site} · {a.time} · {a.detail}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { setRead((r) => ({ ...r, [a.id]: true })); toast("Marked as read"); }}>
                        {isRead ? <CheckCircle2 className="h-3.5 w-3.5" /> : "Mark read"}
                      </Button>
                      <Button asChild size="sm" className="h-8 text-xs">
                        <Link to="/alerts">Open</Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Card className="p-5 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Notification preferences</p>
            <p className="text-xs text-muted-foreground">Configure channels, severity thresholds, and quiet hours.</p>
          </div>
          <Button asChild size="sm" variant="outline"><Link to="/settings">Open settings</Link></Button>
        </div>
      </Card>
    </PageShell>
  );
}

export default Notifications;

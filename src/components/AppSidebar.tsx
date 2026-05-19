import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Grid3x3, Users, Bell, Briefcase, Wrench, Receipt, BarChart3,
  Sparkles, Settings, ShieldCheck, Sun, Map, Activity, Package, Cpu, Workflow,
  Zap, Brain, Radio, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useAdminAuth } from "@/lib/admin-auth";
import { toast } from "sonner";

const ops = [
  { title: "Dashboard", url: "/admin-console", icon: LayoutDashboard },
  { title: "Fleet Heatmap", url: "/admin/heatmap", icon: Map },
  { title: "Panels", url: "/panels", icon: Grid3x3 },
  { title: "Customer 360", url: "/customers", icon: Users },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Smart Actions", url: "/admin/actions", icon: Zap },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  { title: "Technicians", url: "/technicians", icon: Wrench },
  { title: "Workflow Engine", url: "/admin/workflow", icon: Workflow },
];
const intel = [
  { title: "Orb-AI Layer", url: "/ai-insights", icon: Sparkles },
  { title: "Forecasting", url: "/admin/forecast", icon: Activity },
  { title: "Predictive", url: "/admin/predictive", icon: Brain },
  { title: "Anomaly Clusters", url: "/admin/clusters", icon: Radio },
];
const platform = [
  { title: "SLA & Service", url: "/admin/sla", icon: ShieldCheck },
  { title: "Inventory", url: "/admin/inventory", icon: Package },
  { title: "IoT & Edge", url: "/admin/iot", icon: Cpu },
  { title: "Billing", url: "/billing", icon: Receipt },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Command Centre", url: "/admin", icon: ShieldCheck },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useLocation().pathname;
  const { user, signOut } = useAdminAuth();
  const nav = useNavigate();

  const isActive = (u: string) => {
    if (u === "/admin-console") return path === "/admin-console";
    if (u === "/admin") return path === "/admin";
    return path === u || path.startsWith(u + "/");
  };

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out", { description: "Session ended securely." });
    nav("/admin/login");
  };

  const renderItems = (items: typeof ops) =>
    items.map((item) => (
      <SidebarMenuItem key={item.url}>
        <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
          <Link to={item.url} className="flex items-center gap-3">
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm">{item.title}</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/admin-console" className="flex items-center gap-2.5 px-2 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-solar)] shadow-sm">
            <Sun className="h-5 w-5 text-solar-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-sidebar-foreground">Orb Energy</span>
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Admin Console</span>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent><SidebarMenu>{renderItems(ops)}</SidebarMenu></SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Orb-AI Intelligence</SidebarGroupLabel>
          <SidebarGroupContent><SidebarMenu>{renderItems(intel)}</SidebarMenu></SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent><SidebarMenu>{renderItems(platform)}</SidebarMenu></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent/50 p-2">
              <div className="h-8 w-8 rounded-full bg-[image:var(--gradient-eco)] flex items-center justify-center text-xs font-semibold text-white">
                {user?.name?.split(" ").map((s) => s[0]).join("").slice(0, 2) || "OP"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name || "Operator"}</p>
                <p className="text-[10px] text-sidebar-foreground/60 truncate">{user?.role || "—"}</p>
              </div>
              <button onClick={handleSignOut} title="Sign out" className="h-7 w-7 rounded-md hover:bg-sidebar-accent flex items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button onClick={handleSignOut} title="Sign out" className="mx-auto h-8 w-8 rounded-md hover:bg-sidebar-accent flex items-center justify-center text-sidebar-foreground/70">
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

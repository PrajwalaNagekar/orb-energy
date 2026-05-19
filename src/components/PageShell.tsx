import { ReactNode } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageShell({ title, subtitle, actions, children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <span>Orb Energy</span>
          <ChevronDown className="h-3 w-3" />
          <span className="text-foreground font-medium">{title}</span>
        </div>
        <div className="flex-1" />
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search panels, sites, customers…" className="pl-9 h-9 bg-muted/40 border-transparent focus-visible:bg-background" />
        </div>
        <button className="relative h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-destructive">3</Badge>
        </button>
        <div className="h-8 w-8 rounded-full bg-[image:var(--gradient-eco)] flex items-center justify-center text-xs font-semibold text-white">SA</div>
      </header>
      <div className="flex-1 p-4 lg:p-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}

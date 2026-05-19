import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

export function EmptyState({
  title = "Nothing here yet",
  description,
  action,
  icon,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <FileQuestion className="h-6 w-6" />}
      </div>
      <p className="text-sm font-semibold">{title}</p>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function MobileNotFound({ title, backTo, backLabel = "Go back" }: { title: string; backTo: string; backLabel?: string }) {
  return (
    <div className="px-5 pt-16 pb-8">
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-6 text-center">
        <FileQuestion className="h-8 w-8 mx-auto text-slate-400" />
        <p className="text-sm font-semibold mt-3">{title}</p>
        <p className="text-xs text-slate-500 mt-1">It may have been resolved or removed.</p>
        <Link
          to={backTo}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-500 text-white text-xs font-semibold px-4 py-2 mt-4"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}

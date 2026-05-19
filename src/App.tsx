import { Suspense, lazy, type ComponentType } from "react";
import { Routes, Route, Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { AdminAuthProvider } from "@/lib/admin-auth";
import { AdminGuard } from "@/components/AdminGuard";
import { MobileProviders } from "@/components/MobileProviders";

// ---------------------------------------------------------------------------
// File-based route discovery — every .tsx file under src/pages/ becomes a
// route. Filenames mirror the old TanStack convention:
//   index.tsx              -> /
//   foo.tsx                -> /foo
//   foo.bar.tsx            -> /foo/bar
//   foo.$id.tsx            -> /foo/:id
//   foo.index.tsx          -> /foo (index of a parent layout)
// ---------------------------------------------------------------------------
type Mod = { default: ComponentType };
const modules = import.meta.glob<Mod>("./pages/*.tsx", { eager: true });

function fileToPath(file: string): string {
  // file looks like "./pages/m.customer.alerts.$id.tsx"
  const base = file.replace(/^\.\/pages\//, "").replace(/\.tsx$/, "");
  if (base === "index") return "/";
  const segs = base.split(".").map((s) => (s.startsWith("$") ? `:${s.slice(1)}` : s));
  if (segs[segs.length - 1] === "index") segs.pop();
  return "/" + segs.join("/");
}

type Node = {
  path: string;
  component: ComponentType | null;
  children: Map<string, Node>;
};

function makeNode(path: string): Node {
  return { path, component: null, children: new Map() };
}

// Build a tree keyed by full path so parent → child nesting works automatically.
const root: Node = makeNode("");
const entries = Object.entries(modules)
  .map(([file, mod]) => ({ file, mod, path: fileToPath(file) }))
  // longest paths last so parents register before children
  .sort((a, b) => a.path.length - b.path.length);

for (const { mod, path } of entries) {
  if (path === "/") {
    root.component = mod.default;
    continue;
  }
  const parts = path.slice(1).split("/");
  let node = root;
  let curr = "";
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    curr = i === 0 ? "/" + seg : curr + "/" + seg;
    if (!node.children.has(seg)) node.children.set(seg, makeNode(curr));
    node = node.children.get(seg)!;
  }
  node.component = mod.default;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

const PassthroughLayout = () => <Outlet />;

function renderNode(node: Node, segName: string): React.ReactNode {
  const childRoutes: React.ReactNode[] = [];
  for (const [name, child] of node.children) {
    childRoutes.push(renderNode(child, name));
  }

  // Root level
  if (segName === "") {
    const result: React.ReactNode[] = [...childRoutes];
    if (node.component) {
      const C = node.component;
      result.unshift(<Route key="__index" index element={<C />} />);
    }
    return result;
  }

  // Leaf
  if (node.children.size === 0) {
    const C = node.component ?? NotFound;
    return <Route key={node.path} path={segName} element={<C />} />;
  }

  // Branch — always use a passthrough layout so child routes render via Outlet.
  // If this node also has its own component, expose it as an index route.
  const indexRoute = node.component
    ? (() => {
        const C = node.component!;
        return <Route key={node.path + "__index"} index element={<C />} />;
      })()
    : null;
  return (
    <Route key={node.path} path={segName} element={<PassthroughLayout />}>
      {indexRoute}
      {childRoutes}
    </Route>
  );
}

// Shells (admin vs mobile vs plain), driven by current pathname — mirrors the
// original __root.tsx logic.
const ADMIN_PATHS = [
  "/admin-console",
  "/panels", "/customers", "/alerts", "/jobs", "/technicians",
  "/ai-insights", "/admin", "/reports", "/billing", "/settings",
];
const ADMIN_PUBLIC = ["/admin/login"];

function Shell({ children }: { children: React.ReactNode }) {
  const path = useLocation().pathname;
  const isAdminPublic = ADMIN_PUBLIC.some((p) => path === p || path.startsWith(p + "/"));
  const isAdmin = !isAdminPublic && ADMIN_PATHS.some((p) => path === p || path.startsWith(p + "/"));
  const isMobile = path.startsWith("/m/");

  if (isAdminPublic) {
    return (
      <AdminAuthProvider>
        <div className="min-h-screen w-full bg-background">
          {children}
          <Toaster position="top-center" richColors />
        </div>
      </AdminAuthProvider>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-background">
        {isMobile ? <MobileProviders>{children}</MobileProviders> : children}
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <AdminAuthProvider>
      <AdminGuard>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <main className="flex-1 min-w-0">{children}</main>
            <Toaster position="top-center" richColors />
          </div>
        </SidebarProvider>
      </AdminGuard>
    </AdminAuthProvider>
  );
}

export default function App() {
  // Render the route tree once.
  const tree = renderNode(root, "");
  return (
    <Shell>
      <Suspense fallback={null}>
        <Routes>
          {tree}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Shell>
  );
}

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AdminUser {
  username: string;
  name: string;
  role: string;
  loggedAt: number;
}

interface Ctx {
  user: AdminUser | null;
  signIn: (u: AdminUser) => void;
  signOut: () => void;
}

const AdminAuthCtx = createContext<Ctx | null>(null);
const KEY = "orb-admin-session";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const signIn = (u: AdminUser) => {
    setUser(u);
    try { sessionStorage.setItem(KEY, JSON.stringify(u)); } catch {}
  };
  const signOut = () => {
    setUser(null);
    try { sessionStorage.removeItem(KEY); } catch {}
  };

  return <AdminAuthCtx.Provider value={{ user, signIn, signOut }}>{children}</AdminAuthCtx.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthCtx);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}

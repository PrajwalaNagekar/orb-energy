import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/lib/admin-auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAdminAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) nav("/admin/login");
  }, [user, nav]);

  if (!user) return null;
  return <>{children}</>;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Shared technician profile store.
 * Persists to localStorage under `orb.tech.profile` so the
 * Admin Panel (src/routes/technicians.tsx) can read/write the same record.
 * The unique technician ID is the join key across the Technician App and Admin Panel.
 *
 * Admin → Tech sync flow:
 *   1. Admin updates skills / region / certifications / dispatch zone
 *   2. configVersion increments + syncedAt updated
 *   3. Tech app's MobileShell reads on mount and merges new config
 */
export type TechProfile = {
  techId: string;          // Orb-issued unique ID, e.g. ORB-T-1248
  name: string;
  email: string;
  phone: string;
  level: "L1" | "L2" | "L3";
  region: string;
  homeBase: string;
  vanId: string;            // Service vehicle assignment
  joinedDate: string;       // ISO yyyy-mm-dd
  certifications: string[];
  skills: string[];
  supervisor: string;
  shift: "Day" | "Night" | "Rotational";
  // Admin-controlled
  dispatchZone: string;
  maxJobsPerDay: number;
  // Sync state
  syncedAt: string;
  configVersion: number;
  // Performance (admin-readable)
  jobsClosed: number;
  slaPct: number;
  rating: number;
};

const DEFAULT: TechProfile = {
  techId: "ORB-T-1248",
  name: "Arjun Mehta",
  email: "arjun.mehta@orb-energy.in",
  phone: "+91 99887 12345",
  level: "L2",
  region: "Chennai South",
  homeBase: "OMR Service Hub",
  vanId: "VAN-TN-04-2218",
  joinedDate: "2023-08-14",
  certifications: ["Inverter L2", "Roof safety", "Earth-fault analysis", "MC4 termination"],
  skills: ["Inverters", "BMS reset", "Optimisers", "Diagnostics"],
  supervisor: "Priya Nair · T-08",
  shift: "Day",
  dispatchZone: "TN-South · 30 km radius",
  maxJobsPerDay: 6,
  syncedAt: new Date().toISOString(),
  configVersion: 7,
  jobsClosed: 142,
  slaPct: 98,
  rating: 4.9,
};

const KEY = "orb.tech.profile";

function load(): TechProfile {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

type Ctx = {
  profile: TechProfile;
  update: (patch: Partial<TechProfile>) => void;
  reset: () => void;
};

const TechProfileContext = createContext<Ctx | null>(null);

export function TechProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<TechProfile>(DEFAULT);

  useEffect(() => {
    setProfile(load());
  }, []);

  const update = (patch: Partial<TechProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch, syncedAt: new Date().toISOString() };
      try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const reset = () => {
    setProfile(DEFAULT);
    try { window.localStorage.removeItem(KEY); } catch {}
  };

  return (
    <TechProfileContext.Provider value={{ profile, update, reset }}>
      {children}
    </TechProfileContext.Provider>
  );
}

export function useTechProfile() {
  const ctx = useContext(TechProfileContext);
  if (!ctx) throw new Error("useTechProfile must be used within TechProfileProvider");
  return ctx;
}

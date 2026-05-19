import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Shared customer profile store.
 * Persists to localStorage under `orb.customer.profile` so the
 * "admin panel" view (src/routes/customer-app.tsx, /customers) can
 * read/write the same record. The unique customer ID is the join key
 * across the Customer App, Technician App, and Admin Panel.
 */
export type CustomerProfile = {
  customerId: string;        // Orb-issued unique ID, e.g. ORB-IN-2024-0142
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  systemKwp: number;
  panelCount: number;
  inverterModel: string;
  installDate: string;       // ISO yyyy-mm-dd
  warrantyYears: number;
  plan: "Essential" | "Care+" | "Care Pro";
  accountManager: string;
  // Sync state
  syncedAt: string;          // last admin sync ISO
  configVersion: number;     // incremented by admin panel
};

const DEFAULT: CustomerProfile = {
  customerId: "ORB-IN-2024-0142",
  name: "Rohan Sharma",
  email: "rohan.sharma@example.com",
  phone: "+91 98765 43210",
  address: "B-204, Skyline Residency, Baner Road",
  city: "Pune, MH",
  pincode: "411045",
  systemKwp: 14.4,
  panelCount: 36,
  inverterModel: "Orb Inverter X3 · 15kW",
  installDate: "2024-03-18",
  warrantyYears: 21,
  plan: "Care+",
  accountManager: "Priya Nair · T-08",
  syncedAt: new Date().toISOString(),
  configVersion: 12,
};

const KEY = "orb.customer.profile";

function load(): CustomerProfile {
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
  profile: CustomerProfile;
  update: (patch: Partial<CustomerProfile>) => void;
  reset: () => void;
};

const CustomerProfileContext = createContext<Ctx | null>(null);

export function CustomerProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile>(DEFAULT);

  useEffect(() => {
    setProfile(load());
  }, []);

  const update = (patch: Partial<CustomerProfile>) => {
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
    <CustomerProfileContext.Provider value={{ profile, update, reset }}>
      {children}
    </CustomerProfileContext.Provider>
  );
}

export function useCustomerProfile() {
  const ctx = useContext(CustomerProfileContext);
  if (!ctx) throw new Error("useCustomerProfile must be used within CustomerProfileProvider");
  return ctx;
}

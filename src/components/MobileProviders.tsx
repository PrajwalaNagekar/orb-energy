import type { ReactNode } from "react";
import { CustomerProfileProvider } from "@/lib/customer-profile";
import { TechProfileProvider } from "@/lib/tech-profile";
import { ScenarioProvider } from "@/lib/scenario";

/**
 * Wraps all /m/* routes once at the root so navigating between
 * sibling mobile routes does not unmount the profile / scenario
 * providers (no glitch / blank state on edit, no tab-bar jump).
 */
export function MobileProviders({ children }: { children: ReactNode }) {
  return (
    <CustomerProfileProvider>
      <TechProfileProvider>
        <ScenarioProvider>{children}</ScenarioProvider>
      </TechProfileProvider>
    </CustomerProfileProvider>
  );
}

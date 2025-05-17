"use client";

import { ToastProvider } from "@/components/ui/toast-provider";
import { CompanyContextProvider } from "@/context/company-context";
import { ProfileProvider } from "@/context/profile-context";
import QueryProvider from "@/lib/QueryProvider";
import { createContext } from "react";

// Optional: Create a context to track hydration status
export const HydrationContext = createContext<boolean>(false);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // This will only run on client-side
  return (
    <HydrationContext.Provider value={true}>
      <QueryProvider>
        <ToastProvider>
          <CompanyContextProvider>
            <ProfileProvider>
              {children}
            </ProfileProvider>
          </CompanyContextProvider>
        </ToastProvider>
      </QueryProvider>
    </HydrationContext.Provider>
  );
}
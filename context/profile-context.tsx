"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@/hooks/use-user";
import { useCompanyContext } from "./company-context";

interface ProfileContextType {
  completedTabs: Record<string, boolean>;
  markTabCompleted: (tabId: string) => void;
  markTabUncompleted: (tabId: string) => void;
  calculateCompletionPercentage: () => number;
  profileCompletionPercentage: number;
}

// List of all profile tabs
const PROFILE_TABS = [
  "profile",
  "business",
  "team",
  "fundraising",
  "traction",
  "stack",
  "promote",
  "reports",
  "reviews",
  "match"
];

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [completedTabs, setCompletedTabs] = useState<Record<string, boolean>>({});
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);
  const { user } = useUser();
  
  // Calculate percentage when completed tabs change
  useEffect(() => {
    const newPercentage = calculateCompletionPercentage();
    setProfileCompletionPercentage(newPercentage);
  }, [completedTabs]);

  const markTabCompleted = (tabId: string) => {
    if (!PROFILE_TABS.includes(tabId)) return;
    
    setCompletedTabs(prev => ({
      ...prev,
      [tabId]: true
    }));
  };

  const markTabUncompleted = (tabId: string) => {
    if (!PROFILE_TABS.includes(tabId)) return;
    
    setCompletedTabs(prev => {
      const updated = { ...prev };
      delete updated[tabId];
      return updated;
    });
  };

  const calculateCompletionPercentage = () => {
    if (PROFILE_TABS.length === 0) return 0;
    
    const completedCount = PROFILE_TABS.filter(tab => completedTabs[tab]).length;
    return Math.round((completedCount / PROFILE_TABS.length) * 100);
  };

  return (
    <ProfileContext.Provider
      value={{
        completedTabs,
        markTabCompleted,
        markTabUncompleted,
        calculateCompletionPercentage,
        profileCompletionPercentage
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}
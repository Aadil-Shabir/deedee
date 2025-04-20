"use client";

import { Sidebar } from "@/app/components/layout/sidebar";
import { Header } from "@/app/components/layout/header";
import { ProfileProgress } from "@/app/components/layout/profile-progress";
import { useState } from "react";

export default function CompanyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [completionPercentage, setCompletionPercentage] = useState(0);

  return (
    <div className="flex h-screen bg-zinc-900">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        <Header />
        <ProfileProgress completionPercentage={completionPercentage} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 
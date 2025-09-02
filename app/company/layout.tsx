"use client";

import { Sidebar } from "@/app/components/layout/sidebar";
import { Header } from "@/app/components/layout/header";
import { usePathname } from "next/navigation";

export default function CompanyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isProfilePage = pathname?.match(
    /^\/company\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  );

  if (isProfilePage) {
    return <div className="min-h-screen bg-zinc-900">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-zinc-900">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { AdminSidebar } from "@/components/admin/sidebar";


// import { AdminSidebar } from "@/components/admin/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 transition-all duration-300 md:ml-64">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
} 
import type React from "react";
import { AdminSidebar } from "@/components/admin/sidebar";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen bg-background overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-64">
                <div className="flex-1 overflow-auto">
                    <div className="h-full w-full max-w-full">{children}</div>
                </div>
            </main>
        </div>
    );
}

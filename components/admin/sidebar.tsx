"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, BarChart2, Book, FileText, Folder, Users, Settings, Shield } from "lucide-react";

const sidebarItems = [
    { name: "Dashboard", icon: BarChart2, href: "/admin", isActive: true },
    { name: "Investors", icon: Users, href: "/admin/investors", isActive: true },
    { name: "Courses", icon: Book, href: "/admin/courses", isActive: false, comingSoon: true },
    { name: "Templates", icon: FileText, href: "/admin/templates", isActive: false, comingSoon: true },
    { name: "Resources", icon: Folder, href: "/admin/resources", isActive: false, comingSoon: true },
    { name: "Settings", icon: Settings, href: "/admin/settings", isActive: false, comingSoon: true },
];

export function AdminSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Sidebar Toggle */}
            <Button
                variant="ghost"
                className="fixed top-4 left-4 z-50 md:hidden bg-[#0f172a] text-white hover:bg-[#1e293b]"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f172a] text-white transition-transform duration-300 ease-in-out transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
                                <Shield className="h-4 w-4" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Admin Panel</h2>
                                <p className="text-xs text-slate-400">Management Dashboard</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="md:hidden text-white hover:bg-slate-700"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isCurrentPage = pathname === item.href;
                            const isClickable = item.isActive;

                            // If the item is not active (coming soon), render as a div instead of Link
                            if (!isClickable) {
                                return (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between p-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60 transition-all duration-200"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium text-sm">{item.name}</span>
                                        </div>
                                        {item.comingSoon && (
                                            <Badge
                                                variant="secondary"
                                                className="text-[10px] bg-slate-600 text-slate-200 hover:bg-slate-600 border-slate-500"
                                            >
                                                Coming Soon
                                            </Badge>
                                        )}
                                    </div>
                                );
                            }

                            // Render active/clickable items as Links
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                                        isCurrentPage
                                            ? "bg-purple-900 text-white shadow-lg"
                                            : "text-gray-300 hover:bg-purple-800/50 hover:text-white"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)} // Close on mobile after click
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-700">
                        <p className="text-xs text-slate-400">Admin Dashboard v1.0</p>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}
        </>
    );
}

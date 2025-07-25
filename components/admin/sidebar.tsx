"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Menu,
    X,
    BarChart2,
    Book,
    FileText,
    Folder,
    Users,
    Settings,
    Shield,
    ChevronDown,
    ChevronRight,
    UserCheck,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const sidebarItems = [
    { name: "Dashboard", icon: BarChart2, href: "/admin", isActive: true },
    {
        name: "Investor Firms",
        icon: Users,
        href: "/admin/investors/firms",
        isActive: true,
        hasSubmenu: true,
        submenu: [
            { name: "Upload Data", href: "/admin/investors/firms/upload", isActive: true },
            { name: "View All", href: "/admin/investors/firms", isActive: true },
        ],
    },
    {
        name: "Investor Contacts",
        icon: UserCheck,
        href: "/admin/investors/contacts",
        isActive: true,
        hasSubmenu: true,
        submenu: [
            { name: "Upload Data", href: "/admin/investors/contacts/upload", isActive: true },
            { name: "View All", href: "/admin/investors/contacts", isActive: true },
        ],
    },
    { name: "Courses", icon: Book, href: "/admin/courses", isActive: false, comingSoon: true },
    { name: "Templates", icon: FileText, href: "/admin/templates", isActive: false, comingSoon: true },
    { name: "Resources", icon: Folder, href: "/admin/resources", isActive: false, comingSoon: true },
    { name: "Settings", icon: Settings, href: "/admin/settings", isActive: false, comingSoon: true },
];

export function AdminSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

    const toggleSubmenu = (itemName: string) => {
        setOpenSubmenus((prev) =>
            prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName]
        );
    };

    // Auto-open submenu if current page is in submenu
    useEffect(() => {
        sidebarItems.forEach((item) => {
            if (item.hasSubmenu && item.submenu) {
                const isSubmenuActive = item.submenu.some((subItem) => pathname === subItem.href);
                if (isSubmenuActive && !openSubmenus.includes(item.name)) {
                    setOpenSubmenus((prev) => [...prev, item.name]);
                }
            }
        });
    }, [pathname]);

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
                } md:translate-x-0 flex flex-col`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white flex-shrink-0">
                            <Shield className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xl font-bold truncate">Admin Panel</h2>
                            <p className="text-xs text-slate-400 truncate">Management Dashboard</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="md:hidden text-white hover:bg-slate-700 flex-shrink-0"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isCurrentPage = pathname === item.href;
                        const isClickable = item.isActive;
                        const hasSubmenu = item.hasSubmenu && item.submenu;
                        const isSubmenuOpen = openSubmenus.includes(item.name);
                        const isSubmenuActive =
                            hasSubmenu && item.submenu?.some((subItem) => pathname === subItem.href);

                        // If the item is not active (coming soon), render as a div instead of Link
                        if (!isClickable) {
                            return (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between p-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60 transition-all duration-200"
                                >
                                    <div className="flex items-center space-x-3 min-w-0">
                                        <Icon className="h-5 w-5 flex-shrink-0" />
                                        <span className="font-medium truncate">{item.name}</span>
                                    </div>
                                    {item.comingSoon && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs bg-slate-600 text-slate-200 hover:bg-slate-600 border-slate-500 flex-shrink-0"
                                        >
                                            Coming Soon
                                        </Badge>
                                    )}
                                </div>
                            );
                        }

                        // Render items with submenu
                        if (hasSubmenu) {
                            return (
                                <Collapsible
                                    key={item.name}
                                    open={isSubmenuOpen}
                                    onOpenChange={() => toggleSubmenu(item.name)}
                                >
                                    <CollapsibleTrigger asChild>
                                        <div
                                            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                                                isCurrentPage || isSubmenuActive
                                                    ? "bg-purple-900 text-white shadow-lg"
                                                    : "text-gray-300 hover:bg-purple-800/50 hover:text-white"
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 min-w-0">
                                                <Icon className="h-5 w-5 flex-shrink-0" />
                                                <span className="font-medium truncate">{item.name}</span>
                                            </div>
                                            <div className="flex-shrink-0 transition-transform duration-200">
                                                {isSubmenuOpen ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-1 mt-1">
                                        <div className="ml-6 space-y-1 border-l border-slate-700 pl-4">
                                            {item.submenu?.map((subItem) => {
                                                const isSubCurrentPage = pathname === subItem.href;
                                                const isSubClickable = subItem.isActive;

                                                if (!isSubClickable) {
                                                    return (
                                                        <div
                                                            key={subItem.name}
                                                            className="flex items-center justify-between p-2 rounded-lg text-gray-400 cursor-not-allowed opacity-60 transition-all duration-200"
                                                        >
                                                            <span className="text-sm font-medium truncate">
                                                                {subItem.name}
                                                            </span>
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs bg-slate-600 text-slate-200 hover:bg-slate-600 border-slate-500 flex-shrink-0"
                                                            >
                                                                Coming Soon
                                                            </Badge>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <Link
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        className={`block p-2 rounded-lg transition-all duration-200 ${
                                                            isSubCurrentPage
                                                                ? "bg-purple-800 text-white shadow-md"
                                                                : "text-gray-400 hover:bg-purple-800/30 hover:text-white"
                                                        }`}
                                                        onClick={() => setIsSidebarOpen(false)} // Close on mobile after click
                                                    >
                                                        <span className="text-sm font-medium truncate">
                                                            {subItem.name}
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        }

                        // Render regular clickable items as Links
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
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <span className="font-medium truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 flex-shrink-0">
                    <p className="text-xs text-slate-400 truncate">Admin Dashboard v1.0</p>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}
        </>
    );
}

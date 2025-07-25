"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  Menu,
  X,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  Settings,
  Search,
  UserCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";

const sidebarItems = [
  { name: "Basecamp", icon: BarChart2, href: "/investor/basecamp" },
  { name: "Profile", icon: UserCircle, href: "/investor/profile" },
  { name: "Portfolio", icon: Briefcase, href: "/investor/portfolio" },
  { name: "Dealflow", icon: FileText, href: "/investor/dealflow" },
  { name: "Pulse", icon: Users, href: "/investor/pulse" },
  { name: "learning", icon: Calendar, href: "/investor/learning" },
  { name: "Files", icon: DollarSign, href: "/investor/files" },
  { name: "Settings", icon: Settings, href: "/investor/settings" },
];

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-zinc-900">
      {/* Mobile Sidebar Toggle */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-zinc-800 p-2 rounded-md"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f1729] text-white transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-violet-400">DeeDee</h2>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-violet-700/30 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center">
                <span className="text-sm font-semibold">AI</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">ahmad.ali.000507</p>
                <p className="text-xs text-zinc-400">Goodboy Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300 md:ml-64">
      <Toaster />
        {children}
      </main>
    </div>
  );
} 
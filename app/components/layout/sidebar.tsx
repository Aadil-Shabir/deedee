"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Layout,
  UserCircle,
  Users,
  Calendar,
  FileText,
  SendHorizontal,
  BookOpen,
  Settings,
  User
} from "lucide-react";
import Image from "next/image";

const sidebarLinks = [
  {
    name: "Basecamp",
    href: "/company/basecamp",
    icon: Layout
  },
  {
    name: "Profile",
    href: "/company/profile",
    icon: UserCircle
  },
  {
    name: "Relationships",
    href: "/company/relationships",
    icon: Users
  },
  {
    name: "Pulse",
    href: "/company/pulse",
    icon: Calendar
  },
  {
    name: "Files",
    href: "/company/files",
    icon: FileText
  },
  {
    name: "Updates",
    href: "/company/updates",
    icon: SendHorizontal
  },
  {
    name: "Learning",
    href: "/company/learning",
    icon: BookOpen
  },
  {
    name: "Settings",
    href: "/company/settings",
    icon: Settings
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-[#121218] flex flex-col border-r border-zinc-800">
      <div className="px-4 py-3">
        <div className="relative h-10 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-10 pl-10 pr-4 rounded-md bg-zinc-900 border-none text-zinc-300 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          />
        </div>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname.includes(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md group transition-colors ${
                isActive
                  ? "bg-zinc-800/40 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-100"
              }`}
            >
              <link.icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-400"
                }`}
              />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-3 m-2 mt-auto rounded-md bg-zinc-800/30 flex items-center">
        <div className="flex-shrink-0 mr-3 bg-zinc-700 rounded-full overflow-hidden">
          <User className="h-8 w-8 p-1 text-zinc-300" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-200 truncate">
            ahmad.ali.000507
          </p>
        </div>
      </div>
    </div>
  );
} 
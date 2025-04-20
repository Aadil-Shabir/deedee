"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Info } from "lucide-react";

interface HeaderProps {
  userName?: string;
}

export function Header({ userName = "ahmad.ali.000507" }: HeaderProps) {
  return (
    <header className="bg-[#121218] border-b border-zinc-800">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <Link href="/company/basecamp" className="text-2xl font-bold text-white">
            DeeDee
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="flex items-center px-4 py-2 text-sm bg-zinc-800/50 rounded-md text-zinc-100">
              Goodboy Indonesia
              <ChevronDown className="ml-2 h-4 w-4 text-zinc-400" />
            </button>
          </div>
          
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Upgrade
          </Button>
          
          <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-full">
            <div className="flex-shrink-0 h-8 w-8 bg-zinc-700 rounded-full overflow-hidden flex items-center justify-center">
              <span className="text-zinc-300 text-sm">A</span>
            </div>
            <span className="text-sm text-zinc-200">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
} 
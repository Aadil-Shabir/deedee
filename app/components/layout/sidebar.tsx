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
  User,
  ChevronDown,
  Menu,
  X,
  BarChart3,
  HelpCircle,
  LogOut
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
    name: "Score Card",
    href: "/company/score-card",
    icon: BarChart3
  },
  {
    name: "Settings",
    href: "/company/settings",
    icon: Settings
  }
];

function SidebarContent({ className, closeMobileMenu }: { className?: string; closeMobileMenu?: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userName, setUserName] = useState("User");
  const [companyName, setCompanyName] = useState("Goodboy Indonesia");

  // Handle user logout
  const handleLogout = async () => {
    try {
      // Import dynamically to avoid server-side issues
      const { createClient } = await import('@/supabase/supabase');
      const supabase = createClient();
      
      // Sign out the user
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        return;
      }
      
      // Redirect to login page after successful logout
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Load user profile data when user object is available
  useEffect(() => {
    if (user) {
      // Set user name from metadata or email
      const firstName = user.user_metadata?.first_name;
      const lastName = user.user_metadata?.last_name;
      if (firstName && lastName) {
        setUserName(`${firstName} ${lastName}`);
      } else if (user.email) {
        // Use email username if no name is available
        setUserName(user.email.split('@')[0]);
      }

      // Get profile picture from Supabase if available
      const fetchProfilePicture = async () => {
        try {
          // Import dynamically to avoid server-side issues
          const { createClient } = await import('@/supabase/supabase');
          const supabase = createClient();
          
          // Fetch user profile data that might contain profile picture URL
          const { data, error } = await supabase
            .from('profiles')
            .select('profile_picture_url')
            .eq('id', user.id)
            .maybeSingle();
            
          if (data?.profile_picture_url) {
            setProfilePicture(data.profile_picture_url);
          }
        } catch (error) {
          console.error('Error fetching profile picture:', error);
        }
      };
      
      fetchProfilePicture();
    }
  }, [user]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userName) return 'U';
    const parts = userName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return userName.charAt(0).toUpperCase();
  };

  // Handle clicks in mobile mode
  const handleNavLinkClick = () => {
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <div className={cn("h-full flex flex-col bg-[#121218]", className)}>
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
              onClick={handleNavLinkClick}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-full cursor-pointer hover:bg-zinc-800/50 transition-colors w-full">
              <div className="flex-shrink-0 h-8 w-8 bg-zinc-700 rounded-full overflow-hidden flex items-center justify-center">
                {profilePicture ? (
                  <Image 
                    src={profilePicture} 
                    alt={userName}
                    width={32} 
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-zinc-300 text-sm">{getUserInitials()}</span>
                )}
              </div>
              <span className="text-sm text-zinc-200 truncate">{userName}</span>
              <ChevronDown className="h-4 w-4 text-zinc-400 ml-auto flex-shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-800 border-zinc-700 text-zinc-100">
            <DropdownMenuLabel>
              <div className="flex flex-col py-1">
                <span className="font-medium">{userName}</span>
                <span className="text-xs text-zinc-400">{companyName}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <DropdownMenuItem 
              className="hover:bg-zinc-700 text-red-400 hover:text-red-300 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-zinc-800/90 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600"
            >
              <Menu className="h-5 w-5 text-zinc-200" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r border-zinc-800 bg-[#121218] w-[280px]">
            <SidebarContent closeMobileMenu={closeMobileMenu} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen w-64 border-r border-zinc-800 sticky top-0 left-0">
        <SidebarContent />
      </div>
    </>
  );
}
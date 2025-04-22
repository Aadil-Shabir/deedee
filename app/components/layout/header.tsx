"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Info, UserCircle, Settings, HelpCircle, LogOut } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/hooks/use-user";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
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
            .single();
            
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
          
          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 bg-zinc-800/30 px-3 py-2 rounded-full cursor-pointer hover:bg-zinc-800/50 transition-colors">
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
                <span className="text-sm text-zinc-200">{userName}</span>
                <ChevronDown className="h-4 w-4 text-zinc-400" />
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
    </header>
  );
} 
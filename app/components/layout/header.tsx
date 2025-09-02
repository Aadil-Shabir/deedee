"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Info, UserCircle, Settings, HelpCircle, LogOut, PlusCircle } from "lucide-react";
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
import { createClient } from "@/supabase/supabase";
import { useCompanyContext } from "@/context/company-context";

interface Company {
  id: string;
  company_name: string;
  logo_url?: string | null;
}

export function Header() {
  const { user } = useUser();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userName, setUserName] = useState("User");
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  
  // Access company context (if available)
  const companyContext = useCompanyContext();
  const activeCompanyId = companyContext?.activeCompanyId;
  const companies = companyContext?.allUserCompanies || [];

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

  // Handle company switch
  const handleCompanySwitch = async (company: Company) => {
    if (companyContext) {
      // Use context method if available
      companyContext.setActiveCompanyId(company.id);
    } else {
      try {
        const { createClient } = await import('@/supabase/supabase');
        const supabase = createClient();
        
        // Update active company in database directly
        if (user) {
          await supabase
            .from('companies')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', company.id);
          
          // Reload the page to refresh data with the new company context
          window.location.reload();
        }
      } catch (error) {
        console.error('Error switching company:', error);
      }
    }
  };

  // Navigate to create new company page
  const handleCreateNewCompany = () => {
    if (companyContext) {
      // Use context method if available
      companyContext.createNewCompany();
    } else {
      // Fallback to URL-based approach
      window.location.href = '/company/profile?action=new';
    }
  };

  // Load user profile data when user object is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const { createClient } = await import('@/supabase/supabase');
        const supabase = createClient();
        
        // Fetch user profile data that might contain profile picture URL
        const { data: profileData } = await supabase
          .from('profiles')
          .select('profile_picture_url')
          .eq('id', user.id)
          .single();
          
        if (profileData?.profile_picture_url) {
          setProfilePicture(profileData.profile_picture_url);
        }
        
        setIsLoadingCompanies(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoadingCompanies(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  // Make sure the active company is updated whenever it changes
  useEffect(() => {
    if (companyContext?.activeCompanyId) {
      setIsLoadingCompanies(false);
    }
  }, [companyContext?.activeCompanyId]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userName) return 'U';
    const parts = userName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return userName.charAt(0).toUpperCase();
  };
  
  // Find active company
  const activeCompany = companies.find(company => company.id === activeCompanyId) || 
                         (companies.length > 0 ? companies[0] : null);
  
  // Get company name to display
  const companyName = activeCompany ? activeCompany.company_name : "No Company";

  return (
    <header className="bg-[#121218] border-b border-zinc-800">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <Link href="/company/basecamp" className="text-2xl font-bold text-white">
            DeeDee
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Company Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center px-4 py-2 text-sm bg-zinc-800/50 rounded-md text-zinc-100">
                {isLoadingCompanies ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    {activeCompany?.logo_url && (
                      <div className="h-5 w-5 rounded-full overflow-hidden mr-2">
                        <Image 
                          src={activeCompany.logo_url} 
                          alt={companyName}
                          width={20} 
                          height={20}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    {companyName}
                    <ChevronDown className="ml-2 h-4 w-4 text-zinc-400" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-800 border-zinc-700 text-zinc-100">
              <DropdownMenuLabel className="text-xs text-zinc-400">
                Your Companies
              </DropdownMenuLabel>
              
              {/* List of companies */}
              {companies.map(company => (
                <DropdownMenuItem 
                  key={company.id}
                  className={`hover:bg-zinc-700 cursor-pointer ${
                    activeCompanyId === company.id ? 'bg-zinc-700/50' : ''
                  }`}
                  onClick={() => handleCompanySwitch(company)}
                >
                  <div className="flex items-center w-full">
                    {company.logo_url ? (
                      <div className="h-5 w-5 rounded-full overflow-hidden mr-2">
                        <Image 
                          src={company.logo_url} 
                          alt={company.company_name}
                          width={20} 
                          height={20}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-zinc-700 mr-2 flex items-center justify-center">
                        <span className="text-xs">{company.company_name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="flex-1 truncate">{company.company_name}</span>
                    {activeCompanyId === company.id && (
                      <span className="h-2 w-2 bg-primary rounded-full ml-2" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator className="bg-zinc-700" />
              
              {/* Create new company option */}
              <DropdownMenuItem 
                className="hover:bg-zinc-700 cursor-pointer text-primary"
                onClick={handleCreateNewCompany}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Create New Company</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Upgrade
          </Button>
          <Link href={`/company/${activeCompanyId}`}>
          <Button className="bg-primary hover:bg-primary/90 text-white">
           Public View
          </Button>
          </Link>
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
              <Link href="/company/profile">
                <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
              </Link>
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
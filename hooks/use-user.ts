// hooks/useUser.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/supabase/supabase';
import { User } from '@supabase/supabase-js';

const supabase = createClient();

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function getUser() {
      // First, get the current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', session ? 'Found session' : 'No session');
      
      // Update state based on current session
      setUser(session?.user || null);
      setLoading(false); // Always set loading to false after initial check
      
      // Set up listener for future auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('Auth state changed:', _event, session ? 'has session' : 'no session');
        setUser(session?.user || null);
        // Loading is already false at this point
      });
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
    
    getUser();
  }, []);
  
  return { user, loading };
}
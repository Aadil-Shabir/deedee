// hooks/useUser.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/supabase';
import { User } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Set up listener for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
    
    getUser();
  }, []);
  
  return { user, loading };
}
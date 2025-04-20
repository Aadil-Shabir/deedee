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
      // Set up listener for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('session', session);
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
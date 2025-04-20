'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from '@/supabase/supabase';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const authenticateUser = async () => {
      if (!code) {
        router.push('/auth/signin');
        return;
      }

      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) throw error;
        
        // Get user data to determine role
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');
        
        // Get role from user_roles table
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        // Redirect based on role
        if (roleData?.role === 'admin') {
          router.push('/admin');
        } else if (roleData?.role === 'founder') {
          router.push('/company/basecamp');
        } else {
          router.push('/investor');
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/auth/signin');
      }
    };

    authenticateUser();
  }, [code, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Completing Sign In</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}

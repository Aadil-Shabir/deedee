'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/supabase/server'

export async function login({email, password}: {email: string, password: string}) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Get the user role to determine where to redirect
    const role = data.user?.user_metadata?.role || 'founder'
    
    revalidatePath('/', 'layout')
    
    // Redirect based on the actual role (founder or investor)
    // regardless of their intent (seller/buyer vs founder/investor)
    if (role === 'founder') {
      return { success: true, redirectTo: '/company/basecamp' }
    } else if (role === 'investor') {
      return { success: true, redirectTo: '/investor/basecamp' }
    } else {
      return { success: true, redirectTo: '/company/basecamp' } // Default fallback
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during sign in' }
  }
}

export async function signup({
  email, 
  password, 
  firstName, 
  lastName, 
  role,
  
}: {
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  role: 'founder' | 'investor' | 'seller' | 'buyer',
  
}) {
  const supabase = await createClient()

  try {
    // Map the selected role to the actual role assignment
    // Founder/Seller -> 'founder', Investor/Buyer -> 'investor'
    const actualRole = (role === 'founder' || role === 'seller') ? 'founder' : 'investor';
    
    // Prepare user metadata
    const userMetadata = {
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      role: actualRole,
      intent: role, 
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      account_status: 'pending_verification'
    };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata
      }
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // If user was created successfully
    if (data.user) {
      const userId = data.user.id;

      // Insert into user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          { 
            user_id: userId, 
            role: actualRole,
            // created_at: new Date().toISOString() 
          },
        ])

        console.log('Role error:', roleError); 

      if (roleError) {
        return { success: false, error: roleError.message }
      }

      

      
      // Could also insert additional user profile data in a profile table if needed
      if (role === 'founder' || role === 'seller') {
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              first_name:firstName,
              last_name:lastName,
              email,
              intent:role,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (profileError) {
          console.log('Profile error:', profileError);
          return { success: false, error: profileError.message }
        }
      } else if (role === 'investor' || role === 'buyer') {
        
        const { error: investorProfileError } = await supabase
          .from('investor_profiles')
          .insert([
            {
              id: userId,
              first_name:firstName,
              last_name:lastName,
              email,
              intent:role, 
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (investorProfileError) {
          console.log('Investor profile error:', investorProfileError);
          return { success: false, error: investorProfileError.message }
        }
      }
      
      revalidatePath('/', 'layout')
      
      // Return success and redirectTo instead of directly redirecting
      return { 
        success: true, 
        redirectTo: '/auth/signin',
        message: 'Account created successfully. Please check your email to confirm your account.'
      }
    }
    
    return { success: false, error: 'Failed to create account' }
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred during sign up' }
  }
}
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create a response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if available
  await supabase.auth.getSession()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  // Skip role check on auth routes
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return response
  }

  // If path is the root, redirect based on role
  if (request.nextUrl.pathname === '/') {
    if (!user) {
      // Not logged in, redirect to sign in
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    
    // Check role and redirect accordingly
    const role = user.user_metadata?.role || 'founder' // Default to founder if no role

    if (role === 'investor') {
      return NextResponse.redirect(new URL('/investor/basecamp', request.url))
    } else {
      return NextResponse.redirect(new URL('/company/basecamp', request.url))
    }
  }

  // Protected routes that need authentication
  const protectedPaths = ['/company/', '/investor/']
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  if (isProtectedPath && !user) {
    // Redirect to sign in if accessing protected routes without authentication
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Check if user is accessing the correct route based on their role
  if (user && user.user_metadata?.role) {
    const role = user.user_metadata.role
    
    // Investor trying to access company routes
    if (role === 'investor' && request.nextUrl.pathname.startsWith('/company/')) {
      return NextResponse.redirect(new URL('/investor/basecamp', request.url))
    }
    
    // Founder trying to access investor routes
    if (role === 'founder' && request.nextUrl.pathname.startsWith('/investor/')) {
      return NextResponse.redirect(new URL('/company/basecamp', request.url))
    }
  }

  return response
}
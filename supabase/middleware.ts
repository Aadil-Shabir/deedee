import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()
 
  // print url
  console.log("url", request.nextUrl.pathname)
  console.log("user", user)
  // if user logs in using linked_oidc auth instead of auth/callback do it 
  if (
    !user
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/auth/signin'
    return NextResponse.redirect(url)
  }

  console.log("user", user)

  // fetch role from user_role table
  const role = user.user_metadata.role;

  
  // check for admin routes
  if( request.nextUrl.pathname.startsWith('/admin')){
    if(role !== 'admin'){
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    } else {
      return supabaseResponse;
    }
  }

  // check for investor routes
  if( request.nextUrl.pathname.startsWith('/investor')){
    if(role !== 'investor'){
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    } else {
      return supabaseResponse;
    }
  }

  // check for founder routes
  if( request.nextUrl.pathname.startsWith('/company')){
    if(role !== 'founder'){
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    } else {
      return supabaseResponse;
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
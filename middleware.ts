import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get user's subscription status
  let subscriptionStatus = null
  let userEmail = null
  if (session?.user) {
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_status, trial_started_at, email')
      .eq('id', session.user.id)
      .single()
    
    subscriptionStatus = userData?.subscription_status
    userEmail = userData?.email
  }

  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/settings', '/payment/success']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Define routes that should redirect to dashboard if user is authenticated
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Handle protected routes
  if (isProtectedRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Special case for omshah484@gmail.com - bypass subscription check
    if (userEmail === 'omshah484@gmail.com') {
      return res
    }

    // Check subscription status for protected routes
    if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trial') {
      return NextResponse.redirect(new URL('/subscription', request.url))
    }
  }

  // Handle auth routes (login/register)
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/payment/success',
    '/login',
    '/register',
  ],
}
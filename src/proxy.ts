import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true'
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('session')

  if (!sessionCookie?.value) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const session = await verifyToken(sessionCookie.value)

  if (!session) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('session')
    return response
  }

  if (pathname.startsWith('/admin')) {
    if (session.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname.startsWith('/rca/')) {
    const id = pathname.split('/')[2]
    if (session.role !== 'admin' && session.userId !== id) {
      return NextResponse.redirect(new URL(`/rca/${session.userId}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/rca/:path*', '/admin/:path*'],
}

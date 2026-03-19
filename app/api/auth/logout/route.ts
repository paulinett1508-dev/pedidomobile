import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const origin = new URL(request.url).origin
  const response = NextResponse.redirect(`${origin}/login`)
  response.cookies.delete('session')
  return response
}

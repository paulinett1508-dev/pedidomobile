import { NextResponse } from 'next/server'
import { verifyLogin, createToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { id, password } = await request.json() as { id: string; password: string }

    if (!id || !password) {
      return NextResponse.json({ error: 'Campos obrigatórios' }, { status: 400 })
    }

    const session = await verifyLogin(id.trim(), password)

    if (!session) {
      return NextResponse.json({ error: 'Matrícula ou senha inválidos' }, { status: 401 })
    }

    const token = await createToken(session)
    const redirectTo = session.role === 'admin' ? '/admin' : `/rca/${session.userId}`

    const response = NextResponse.json({ ok: true, role: session.role, redirectTo })
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

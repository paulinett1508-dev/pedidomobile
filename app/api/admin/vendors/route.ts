import { NextResponse } from 'next/server'
import { getUsers, saveUsers } from '@/lib/users'

export async function GET() {
  try {
    const users = await getUsers()
    return NextResponse.json(users.vendors)
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { id, nome } = await request.json() as { id: string; nome: string }

    if (!id || !nome) {
      return NextResponse.json({ error: 'id e nome são obrigatórios' }, { status: 400 })
    }

    const users = await getUsers()

    if (users.vendors.find(v => v.id === id)) {
      return NextResponse.json({ error: 'Matrícula já cadastrada' }, { status: 409 })
    }

    users.vendors.push({ id: id.trim(), nome: nome.trim() })
    await saveUsers(users)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

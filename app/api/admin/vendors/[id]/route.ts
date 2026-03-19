import { NextResponse } from 'next/server'
import { getUsers, saveUsers } from '@/lib/users'

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const users = await getUsers()
    const idx = users.vendors.findIndex(v => v.id === params.id)

    if (idx === -1) {
      return NextResponse.json({ error: 'Vendedor não encontrado' }, { status: 404 })
    }

    users.vendors.splice(idx, 1)
    await saveUsers(users)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

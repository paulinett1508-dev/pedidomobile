import { NextResponse } from 'next/server'
import { getUsers, saveUsers, hashPassword } from '@/lib/users'

export async function PATCH(request: Request) {
  try {
    const { type, newPassword } = await request.json() as {
      type: 'vendor' | 'admin'
      newPassword: string
    }

    if (!type || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const users = await getUsers()
    const hash = await hashPassword(newPassword)

    if (type === 'vendor') {
      users.vendorPasswordHash = hash
    } else {
      users.adminPasswordHash = hash
    }

    await saveUsers(users)

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[api/admin/password]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

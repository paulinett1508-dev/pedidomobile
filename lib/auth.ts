import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { getUsers } from './users'
import type { SessionPayload } from './types'

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not set')
  return new TextEncoder().encode(secret)
}

export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function verifyLogin(id: string, password: string): Promise<SessionPayload | null> {
  const users = await getUsers()

  if (id === 'admin') {
    const valid = await bcrypt.compare(password, users.adminPasswordHash)
    if (!valid) return null
    return { userId: 'admin', role: 'admin' }
  }

  const vendor = users.vendors.find(v => v.id === id)
  if (!vendor) return null

  const valid = await bcrypt.compare(password, users.vendorPasswordHash)
  if (!valid) return null

  return { userId: id, role: 'vendor' }
}

import fs from 'fs/promises'
import path from 'path'
import bcrypt from 'bcryptjs'
import type { UsersFile } from './types'

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json')
const BLOB_PREFIX = 'pedidomobile-users'

/** Finds any BLOB_READ_WRITE_TOKEN* variant set by Vercel when connecting a store */
function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN
  const key = Object.keys(process.env).find(k => k.startsWith('BLOB_READ_WRITE_TOKEN'))
  return key ? process.env[key] : undefined
}

async function readLocalUsers(): Promise<UsersFile> {
  const raw = await fs.readFile(USERS_PATH, 'utf-8')
  return JSON.parse(raw) as UsersFile
}

export async function getUsers(): Promise<UsersFile> {
  const token = getBlobToken()
  if (!token) return readLocalUsers()

  try {
    const { list } = await import('@vercel/blob')
    const { blobs } = await list({ prefix: BLOB_PREFIX, token })
    if (blobs.length > 0) {
      // sort by uploadedAt descending — get the most recent
      blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      const res = await fetch(blobs[0].url)
      if (res.ok) return await res.json() as UsersFile
    }
  } catch (err) {
    console.error('[users] getUsers error:', err instanceof Error ? err.message : err)
  }

  return readLocalUsers()
}

export async function saveUsers(data: UsersFile): Promise<void> {
  const token = getBlobToken()

  if (!token) {
    await fs.writeFile(USERS_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return
  }

  const { put, list, del } = await import('@vercel/blob')

  // Delete all existing blobs for this prefix before writing a fresh one
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX, token })
    if (blobs.length > 0) {
      await del(blobs.map(b => b.url), { token })
    }
  } catch (err) {
    console.error('[users] del error (non-fatal):', err instanceof Error ? err.message : err)
  }

  // Put without addRandomSuffix restriction — Vercel appends a suffix automatically
  const result = await put(BLOB_PREFIX, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json',
    token,
  })
  console.log('[users] saved to blob:', result.url)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

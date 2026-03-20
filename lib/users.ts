import fs from 'fs/promises'
import path from 'path'
import bcrypt from 'bcryptjs'
import type { UsersFile } from './types'

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json')
const BLOB_KEY = 'users.json'

/** Finds any BLOB_READ_WRITE_TOKEN_* variant set by Vercel when connecting a store */
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
    const { blobs } = await list({ prefix: BLOB_KEY, token })
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url)
      if (res.ok) return await res.json() as UsersFile
    }
  } catch (err) {
    console.error('[users] getUsers error:', err)
  }

  return readLocalUsers()
}

export async function saveUsers(data: UsersFile): Promise<void> {
  const token = getBlobToken()

  if (!token) {
    // Local dev — write to file directly
    await fs.writeFile(USERS_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return
  }

  const { put, list, del } = await import('@vercel/blob')

  // Remove existing blob before re-uploading
  try {
    const { blobs } = await list({ prefix: BLOB_KEY, token })
    if (blobs.length > 0) {
      await del(blobs.map(b => b.url), { token })
    }
  } catch (err) {
    console.error('[users] del error (non-fatal):', err)
  }

  await put(BLOB_KEY, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    token,
  })
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

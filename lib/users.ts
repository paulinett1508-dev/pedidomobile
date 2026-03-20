import fs from 'fs/promises'
import path from 'path'
import bcrypt from 'bcryptjs'
import type { UsersFile } from './types'

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json')
const BLOB_KEY = 'users.json'

function isProduction() {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

async function readLocalUsers(): Promise<UsersFile> {
  const raw = await fs.readFile(USERS_PATH, 'utf-8')
  return JSON.parse(raw) as UsersFile
}

export async function getUsers(): Promise<UsersFile> {
  if (!isProduction()) {
    return readLocalUsers()
  }

  try {
    const { list } = await import('@vercel/blob')
    const { blobs } = await list({ prefix: BLOB_KEY })
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url)
      return await res.json() as UsersFile
    }
  } catch (err) {
    console.error('[users] getUsers error:', err)
  }

  // First deploy: seed from the bundled users.json
  return readLocalUsers()
}

export async function saveUsers(data: UsersFile): Promise<void> {
  if (!isProduction()) {
    await fs.writeFile(USERS_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return
  }

  const { put, list, del } = await import('@vercel/blob')

  // Delete existing blob before re-uploading (blob doesn't overwrite by default)
  try {
    const { blobs } = await list({ prefix: BLOB_KEY })
    if (blobs.length > 0) {
      await del(blobs[0].url)
    }
  } catch (err) {
    console.error('[users] del error (non-fatal):', err)
  }

  await put(BLOB_KEY, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  })
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

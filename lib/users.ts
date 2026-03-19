import fs from 'fs/promises'
import path from 'path'
import bcrypt from 'bcryptjs'
import type { UsersFile } from './types'

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json')

export async function getUsers(): Promise<UsersFile> {
  const raw = await fs.readFile(USERS_PATH, 'utf-8')
  return JSON.parse(raw) as UsersFile
}

export async function saveUsers(data: UsersFile): Promise<void> {
  await fs.writeFile(USERS_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

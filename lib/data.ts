import type { RcaMeta, PedidoItem } from './types'

const REGISTRY: Record<string, RcaMeta> = {
  '031': { id: '031', representada: '031 - THEODORO F SOBRAL E CIA LTDA (CASA)' },
  '132': { id: '132', representada: '132 - RCA 132' },
  '200': { id: '200', representada: '200 - RCA 200' },
  '216': { id: '216', representada: '216 - RCA 216' },
  '217': { id: '217', representada: '217 - RCA 217' },
  '224': { id: '224', representada: '224 - JC LIMA REPRESENTAÇÕES LTDA (GRV GUSTAVO)' },
  '225': { id: '225', representada: '225 - RCA 225' },
  '227': { id: '227', representada: '227 - RCA 227' },
  '231': { id: '231', representada: '231 - RCA 231' },
  '237': { id: '237', representada: '237 - RCA 237' },
  '240': { id: '240', representada: '240 - RCA 240' },
  '245': { id: '245', representada: '245 - RCA 245' },
  '248': { id: '248', representada: '248 - RCA 248' },
  '251': { id: '251', representada: '251 - RCA 251' },
  '252': { id: '252', representada: '252 - RCA 252' },
  '254': { id: '254', representada: '254 - RCA 254' },
  '256': { id: '256', representada: '256 - RCA 256' },
  '257': { id: '257', representada: '257 - RCA 257' },
  '258': { id: '258', representada: '258 - RCA 258' },
  '259': { id: '259', representada: '259 - RCA 259' },
  '260': { id: '260', representada: '260 - RCA 260' },
}

export function getRcaMeta(id: string): RcaMeta | null {
  return REGISTRY[id] ?? null
}

export function getAllRcaIds(): string[] {
  return Object.keys(REGISTRY)
}

export async function getRcaData(id: string): Promise<PedidoItem[] | null> {
  if (!REGISTRY[id]) return null
  try {
    const data = await import(`../data/rca-${id}.json`)
    return data.default as PedidoItem[]
  } catch {
    return null
  }
}

import type { RcaMeta, PedidoItem } from './types'

const REGISTRY: Record<string, RcaMeta> = {
  '224': {
    id: '224',
    vendedor: 'Júlio Cesar Lima dos Santos',
    representada: 'JC Lima Representações Ltda (GRV Gustavo)',
  },
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

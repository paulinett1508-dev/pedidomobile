import type { RcaMeta, PedidoItem } from './types'

const REGISTRY: Record<string, RcaMeta> = {
  '031': { id: '031', representada: 'THEODORO F SOBRAL E CIA LTDA' },
  '132': { id: '132', representada: 'AVANTEPHARMA REPRESENTAÇÕES LTDA.' },
  '200': { id: '200', representada: 'CORDEIRO & FERREIRA LTDA - ME' },
  '216': { id: '216', representada: 'ACS SERVICOS E SOLUCOES FINANCEIRAS LTDA' },
  '217': { id: '217', representada: 'JACIARA RAMOS SANTOS' },
  '224': { id: '224', representada: 'JC LIMA REPRESENTAÇÕES LTDA' },
  '225': { id: '225', representada: 'PEDRA REPRESENTAÇOES LTDA' },
  '227': { id: '227', representada: 'PRIMAVERA REPRESENTAÇÃO EM MEDICAMENTOS LTDA' },
  '231': { id: '231', representada: 'DAVID JOSÉ DA ROCHA NORONHA ME' },
  '237': { id: '237', representada: 'L. REP DE MAT ODONTO-MEDICO-HOSPITALARES LTDA' },
  '240': { id: '240', representada: 'NELIO N DE SOUZA REPRESENTACOES EIRELI' },
  '245': { id: '245', representada: 'RAMACHI REPRESENTACOES LTDA' },
  '248': { id: '248', representada: 'JPA PROMOÇÕES DE VENDAS LTDA' },
  '251': { id: '251', representada: 'A CAETANO REPRESENTAÇOES ME' },
  '252': { id: '252', representada: 'JH REPRESENTACOES LTDA' },
  '254': { id: '254', representada: 'ALEX VANDO TARQUINIO DE ARAUJO - ME' },
  '256': { id: '256', representada: 'SC FARMA REPRESENTAÇÕES LTDA' },
  '257': { id: '257', representada: 'MARCILIO MENDES DE FREITAS JUNIOR' },
  '258': { id: '258', representada: 'AWFARMA REPRESENTAÇÕES LTDA' },
  '259': { id: '259', representada: 'EDIVALDO B RODRIGUES REPRESENTACOES' },
  '260': { id: '260', representada: 'LEONILDO PEREIRA BRANDAO REPRESENTACOES' },
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

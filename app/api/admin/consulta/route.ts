import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/session'
import { getAllRcaIds, getRcaData, getRcaMeta } from '@/lib/data'

export interface PedidoRow {
  rcaId:        string
  representada: string
  pedido:       string
  data:         string
  situacao:     string
  cliente:      string
  municipio:    string
  estado:       string
  totalLiquido: number
  itens:        number
}

export async function GET(req: NextRequest) {
  // Admin only — check session cookie
  const token = req.cookies.get('session')?.value
  const session = token ? await verifyToken(token) : null
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const rcaFilter     = searchParams.get('rca')       ?? ''
  const situacao      = searchParams.get('situacao')  ?? ''
  const estado        = searchParams.get('estado')    ?? ''
  const search        = searchParams.get('search')    ?? ''
  const dataInicio    = searchParams.get('dataInicio') ?? ''
  const dataFim       = searchParams.get('dataFim')    ?? ''

  const ids = rcaFilter ? [rcaFilter] : getAllRcaIds()

  // Load all requested RCA data in parallel
  const allData = await Promise.all(ids.map(id => getRcaData(id)))

  // Build per-pedido rows (composite key rcaId+pedido, take first item for header fields)
  const pedidoMap = new Map<string, PedidoRow>()

  allData.forEach((items, i) => {
    if (!items) return
    const rcaId = ids[i]
    const meta  = getRcaMeta(rcaId)

    for (const item of items) {
      // Date filter (item.data = dd/mm/yyyy)
      if (dataInicio || dataFim) {
        const [d, m, y] = item.data.split('/')
        const itemDate  = `${y}-${m}-${d}`
        if (dataInicio && itemDate < dataInicio) continue
        if (dataFim    && itemDate > dataFim)    continue
      }

      if (situacao && item.situacao !== situacao) continue
      if (estado   && item.estado   !== estado)   continue
      if (search) {
        const q = search.toLowerCase()
        const matches =
          item.cliente.toLowerCase().includes(q)   ||
          item.produto.toLowerCase().includes(q)   ||
          item.pedido.includes(q)                  ||
          item.codCliente.includes(q)              ||
          item.municipio.toLowerCase().includes(q)
        if (!matches) continue
      }

      const key = `${rcaId}-${item.pedido}`
      if (pedidoMap.has(key)) {
        pedidoMap.get(key)!.itens += 1
      } else {
        pedidoMap.set(key, {
          rcaId,
          representada: meta?.representada ?? rcaId,
          pedido:       item.pedido,
          data:         item.data,
          situacao:     item.situacao,
          cliente:      item.cliente,
          municipio:    item.municipio,
          estado:       item.estado,
          totalLiquido: item.totalLiquido,
          itens:        1,
        })
      }
    }
  })

  const rows = Array.from(pedidoMap.values())
  // Sort by data desc (dd/mm/yyyy → parse for comparison)
  rows.sort((a, b) => {
    const toTs = (d: string) => {
      const [dd, mm, yy] = d.split('/')
      return new Date(`${yy}-${mm}-${dd}`).getTime()
    }
    return toTs(b.data) - toTs(a.data)
  })

  return NextResponse.json({ rows, total: rows.length })
}

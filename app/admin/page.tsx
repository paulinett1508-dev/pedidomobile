import { getAllRcaIds, getRcaData } from '@/lib/data'
import AdminClientShell from '@/components/admin/AdminClientShell'
import type { SituacaoStat } from '@/components/admin/AdminOverview'

export default async function AdminPage() {
  const ids = getAllRcaIds()

  // Load all RCA data and compute real situação breakdown
  const allData = await Promise.all(ids.map(id => getRcaData(id)))

  // Count unique pedidos per situação (pedido key = rcaId + '-' + pedido to avoid cross-RCA collisions)
  const pedidoSit = new Map<string, string>()
  allData.forEach((items, i) => {
    if (!items) return
    const rcaId = ids[i]
    for (const item of items) {
      const key = `${rcaId}-${item.pedido}`
      if (!pedidoSit.has(key)) pedidoSit.set(key, item.situacao)
    }
  })

  const counts: Record<string, number> = {}
  for (const sit of Array.from(pedidoSit.values())) {
    counts[sit] = (counts[sit] ?? 0) + 1
  }
  const total = pedidoSit.size

  const COLOR: Record<string, string> = {
    Faturado:  'var(--accent)',
    Pendente:  'var(--amber)',
    Cancelado: 'var(--danger)',
  }

  const situacao: SituacaoStat[] = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      label,
      count,
      pct: total ? Math.round((count / total) * 100) : 0,
      color: COLOR[label] ?? 'var(--muted)',
    }))

  return <AdminClientShell situacao={situacao} />
}

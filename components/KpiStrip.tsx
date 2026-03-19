import type { PedidoItem } from '@/lib/types'

interface KpiStripProps {
  items: PedidoItem[]
  filtered: PedidoItem[]
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

function fmtInt(n: number) {
  return n.toLocaleString('pt-BR')
}

export default function KpiStrip({ items, filtered }: KpiStripProps) {
  const totalItems = filtered.length
  const totalQtde = filtered.reduce((s, i) => s + i.qtde, 0)
  const totalValor = filtered.reduce((s, i) => s + i.total, 0)
  const totalPedidos = new Set(filtered.map(i => i.pedido)).size
  const totalClientes = new Set(filtered.map(i => i.codCliente)).size
  const totalProdutos = new Set(filtered.map(i => i.produto)).size

  const isFiltered = filtered.length !== items.length

  const kpis = [
    { label: 'Itens', value: fmtInt(totalItems), accent: false },
    { label: 'Qtde Total', value: fmtInt(totalQtde), accent: true },
    { label: 'Valor Total', value: `R$ ${fmt(totalValor)}`, accent: false, amber: true },
    { label: 'Pedidos', value: fmtInt(totalPedidos), accent: false },
    { label: 'Clientes', value: fmtInt(totalClientes), accent: false },
    { label: 'Produtos', value: fmtInt(totalProdutos), accent: false },
  ]

  return (
    <div className="mb-4">
      {isFiltered && (
        <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
          Exibindo {totalItems} de {items.length} itens
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {kpis.map(k => (
          <div
            key={k.label}
            className="rounded-xl p-3 flex flex-col gap-1"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
              {k.label}
            </span>
            <span
              className="text-base font-bold leading-tight"
              style={{ color: k.amber ? 'var(--amber)' : k.accent ? 'var(--accent)' : 'var(--text)' }}
            >
              {k.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import type { PedidoItem } from '@/lib/types'

interface MiniChartsProps {
  items: PedidoItem[]
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

function TopList({
  title,
  data,
  valueKey,
  valueLabel,
  isAmount,
}: {
  title: string
  data: { label: string; value: number }[]
  valueKey: string
  valueLabel: string
  isAmount?: boolean
}) {
  const max = data[0]?.value ?? 1
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--amber)' }}>
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {data.slice(0, 5).map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="truncate max-w-[60%]" style={{ color: 'var(--text)' }}>
                {item.label}
              </span>
              <span style={{ color: isAmount ? 'var(--amber)' : 'var(--accent)' }}>
                {isAmount ? `R$ ${fmt(item.value)}` : item.value.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'var(--surface2)' }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  background: isAmount ? 'var(--amber)' : 'var(--accent)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MiniCharts({ items }: MiniChartsProps) {
  const byCliente = Object.entries(
    items.reduce<Record<string, number>>((acc, i) => {
      acc[i.cliente] = (acc[i.cliente] ?? 0) + i.total
      return acc
    }, {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  const byProduto = Object.entries(
    items.reduce<Record<string, number>>((acc, i) => {
      acc[i.produto] = (acc[i.produto] ?? 0) + i.qtde
      return acc
    }, {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="hidden md:grid grid-cols-2 gap-4 mb-4">
      <TopList
        title="Top Clientes por Valor"
        data={byCliente}
        valueKey="total"
        valueLabel="valor"
        isAmount
      />
      <TopList
        title="Top Produtos por Qtde"
        data={byProduto}
        valueKey="qtde"
        valueLabel="qtde"
      />
    </div>
  )
}

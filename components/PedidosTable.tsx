'use client'

import { useState } from 'react'
import type { PedidoItem } from '@/lib/types'

interface PedidosTableProps {
  items: PedidoItem[]
}

type SortKey = keyof PedidoItem
type SortDir = 'asc' | 'desc'

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

export default function PedidosTable({ items }: PedidosTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('pedido')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...items].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv), 'pt-BR')
    return sortDir === 'asc' ? cmp : -cmp
  })

  const cols: { key: SortKey; label: string }[] = [
    { key: 'pedido', label: 'Pedido' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'produto', label: 'Produto' },
    { key: 'qtde', label: 'Qtde' },
    { key: 'preco', label: 'Preço' },
    { key: 'total', label: 'Total' },
  ]

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span style={{ opacity: 0.3 }}>↕</span>
    return <span style={{ color: 'var(--accent)' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--muted)' }}>
        Nenhum item encontrado
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div
        className="hidden md:block rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {cols.map(c => (
                  <th
                    key={c.key}
                    onClick={() => handleSort(c.key)}
                    className="px-4 py-3 text-left font-semibold cursor-pointer select-none whitespace-nowrap"
                    style={{ color: 'var(--highlight)', borderBottom: '1px solid var(--border)' }}
                  >
                    {c.label} <SortIcon col={c.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((item, idx) => (
                <tr
                  key={`${item.pedido}-${idx}`}
                  style={{
                    background: idx % 2 === 0 ? 'var(--surface)' : 'var(--bg)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <td className="px-4 py-3 font-mono font-medium" style={{ color: 'var(--accent)' }}>
                    #{item.pedido}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text)' }}>
                    {item.cliente}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>
                    {item.produto}
                  </td>
                  <td className="px-4 py-3 text-right font-medium" style={{ color: 'var(--accent)' }}>
                    {item.qtde.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right" style={{ color: 'var(--amber)' }}>
                    R$ {fmt(item.preco)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--amber)' }}>
                    R$ {fmt(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--surface2)', borderTop: '2px solid var(--border)' }}>
                <td colSpan={3} className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--muted)' }}>
                  {items.length} itens
                </td>
                <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--accent)' }}>
                  {sorted.reduce((s, i) => s + i.qtde, 0).toLocaleString('pt-BR')}
                </td>
                <td />
                <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--amber)' }}>
                  R$ {fmt(sorted.reduce((s, i) => s + i.total, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="flex md:hidden flex-col gap-3">
        {sorted.map((item, idx) => (
          <div
            key={`${item.pedido}-${idx}`}
            className="rounded-xl p-4"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderLeft: '4px solid var(--accent)',
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-mono font-semibold" style={{ color: 'var(--accent)' }}>
                #{item.pedido}
              </span>
              <span className="font-bold" style={{ color: 'var(--amber)' }}>
                R$ {fmt(item.total)}
              </span>
            </div>
            <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text)' }}>
              {item.cliente}
            </p>
            <p className="text-xs mb-2 leading-snug" style={{ color: 'var(--muted)' }}>
              {item.produto}
            </p>
            <div className="flex gap-4 text-xs">
              <span>
                <span style={{ color: 'var(--muted)' }}>Qtde: </span>
                <span className="font-medium" style={{ color: 'var(--accent)' }}>
                  {item.qtde.toLocaleString('pt-BR')}
                </span>
              </span>
              <span>
                <span style={{ color: 'var(--muted)' }}>Preço: </span>
                <span style={{ color: 'var(--amber)' }}>R$ {fmt(item.preco)}/un</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

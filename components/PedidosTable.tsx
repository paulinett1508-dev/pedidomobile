'use client'

import { useState } from 'react'
import type { PedidoItem } from '@/lib/types'

interface PedidosTableProps {
  items: PedidoItem[]
}

type SortKey = 'pedido' | 'data' | 'cliente' | 'municipio' | 'produto' | 'qtde' | 'preco' | 'total' | 'tabelaPreco' | 'planoPagto'
type SortDir = 'asc' | 'desc'

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

function situacaoBadge(s: string) {
  const map: Record<string, string> = {
    'Faturado':  'var(--accent)',
    'Cancelado': 'var(--danger)',
    'Pendente':  'var(--amber)',
  }
  return map[s] ?? 'var(--muted)'
}

export default function PedidosTable({ items }: PedidosTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('pedido')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...items].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'pedido') cmp = Number(a.pedido) - Number(b.pedido)
    else if (sortKey === 'qtde' || sortKey === 'preco' || sortKey === 'total') cmp = a[sortKey] - b[sortKey]
    else if (sortKey === 'data') cmp = a.data.split('/').reverse().join('').localeCompare(b.data.split('/').reverse().join(''))
    else cmp = String(a[sortKey]).localeCompare(String(b[sortKey]), 'pt-BR')
    return sortDir === 'asc' ? cmp : -cmp
  })

  const cols: { key: SortKey; label: string }[] = [
    { key: 'pedido',      label: 'Pedido'      },
    { key: 'data',        label: 'Data'        },
    { key: 'cliente',     label: 'Cliente'     },
    { key: 'municipio',   label: 'Mun./UF'     },
    { key: 'produto',     label: 'Produto'     },
    { key: 'tabelaPreco', label: 'Tabela'      },
    { key: 'planoPagto',  label: 'Plano Pagto' },
    { key: 'qtde',        label: 'Qtde'        },
    { key: 'preco',       label: 'Preço'       },
    { key: 'total',       label: 'Total'       },
  ]

  function Arrow({ col }: { col: SortKey }) {
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
      <div className="hidden md:block rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                {cols.map(c => (
                  <th
                    key={c.key}
                    onClick={() => handleSort(c.key)}
                    className="px-3 py-3 text-left font-semibold cursor-pointer select-none whitespace-nowrap"
                    style={{ color: 'var(--highlight)', borderBottom: '1px solid var(--border)' }}
                  >
                    {c.label} <Arrow col={c.key} />
                  </th>
                ))}
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap"
                    style={{ color: 'var(--highlight)', borderBottom: '1px solid var(--border)' }}>
                  Situação
                </th>
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
                  <td className="px-3 py-2.5 font-mono font-medium" style={{ color: 'var(--accent)' }}>
                    #{item.pedido}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap font-mono text-xs" style={{ color: 'var(--muted)' }}>
                    {item.data}
                  </td>
                  <td className="px-3 py-2.5 max-w-48 truncate" style={{ color: 'var(--text)' }} title={item.cliente}>
                    {item.cliente}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs" style={{ color: 'var(--muted)' }}>
                    {item.municipio}{item.estado ? ` · ${item.estado}` : ''}
                  </td>
                  <td className="px-3 py-2.5 max-w-52 truncate" style={{ color: 'var(--muted)' }} title={item.produto}>
                    {item.produto}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs" style={{ color: 'var(--highlight)' }}>
                    {item.tabelaPreco}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs" style={{ color: 'var(--muted)' }}>
                    {item.planoPagto}
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium" style={{ color: 'var(--accent)' }}>
                    {item.qtde.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-3 py-2.5 text-right" style={{ color: 'var(--amber)' }}>
                    R$ {fmt(item.preco)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold" style={{ color: 'var(--amber)' }}>
                    R$ {fmt(item.total)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                      style={{ color: situacaoBadge(item.situacao), background: 'var(--surface2)' }}
                    >
                      {item.situacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--surface2)', borderTop: '2px solid var(--border)' }}>
                <td colSpan={7} className="px-3 py-2.5 text-xs font-medium" style={{ color: 'var(--muted)' }}>
                  {items.length} itens · {new Set(items.map(i => i.pedido)).size} pedidos
                </td>
                <td className="px-3 py-2.5 text-right font-bold" style={{ color: 'var(--accent)' }}>
                  {sorted.reduce((s, i) => s + i.qtde, 0).toLocaleString('pt-BR')}
                </td>
                <td />
                <td className="px-3 py-2.5 text-right font-bold" style={{ color: 'var(--amber)' }}>
                  R$ {fmt(sorted.reduce((s, i) => s + i.total, 0))}
                </td>
                <td />
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
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold" style={{ color: 'var(--accent)' }}>
                  #{item.pedido}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ color: situacaoBadge(item.situacao), background: 'var(--surface2)' }}
                >
                  {item.situacao}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm" style={{ color: 'var(--amber)' }}>
                  R$ {fmt(item.total)}
                </span>
                <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{item.data}</p>
              </div>
            </div>
            <p className="text-sm font-medium mb-0.5 truncate" style={{ color: 'var(--text)' }}>
              {item.cliente}
            </p>
            <p className="text-xs mb-1 leading-snug" style={{ color: 'var(--muted)' }}>
              {item.produto}
            </p>
            <div className="flex gap-3 text-xs mb-2">
              {item.tabelaPreco && (
                <span style={{ color: 'var(--highlight)' }}>{item.tabelaPreco}</span>
              )}
              {item.planoPagto && (
                <span style={{ color: 'var(--muted)' }}>{item.planoPagto}</span>
              )}
            </div>
            <div className="flex gap-4 text-xs">
              <span style={{ color: 'var(--muted)' }}>
                {item.municipio}{item.estado ? ` · ${item.estado}` : ''}
              </span>
              <span>
                <span style={{ color: 'var(--muted)' }}>Qtde: </span>
                <span className="font-medium" style={{ color: 'var(--accent)' }}>
                  {item.qtde.toLocaleString('pt-BR')} {item.unidade}
                </span>
              </span>
              <span style={{ color: 'var(--amber)' }}>R$ {fmt(item.preco)}/un</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

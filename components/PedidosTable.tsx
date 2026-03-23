'use client'

import { useState, useMemo } from 'react'
import type { PedidoItem, RcaMeta } from '@/lib/types'
import PedidoModal from './PedidoModal'
import ExportButtons from './ExportButtons'

interface PedidosTableProps {
  items: PedidoItem[]
  allItems: PedidoItem[]
  meta: RcaMeta
}

interface PedidoGroup {
  header: PedidoItem
  qtdeTotal: number
  totalItens: number
}

type SortKey = 'pedido' | 'data' | 'cliente' | 'municipio' | 'tabelaPreco' | 'planoPagto' | 'itens' | 'qtde' | 'total'
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

export default function PedidosTable({ items, allItems, meta }: PedidosTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('pedido')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selectedPedido, setSelectedPedido] = useState<string | null>(null)

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  // Agrupa itens por pedido — 1 entrada por pedido distinto
  const grouped = useMemo<PedidoGroup[]>(() => {
    const map = new Map<string, PedidoGroup>()
    for (const item of items) {
      if (!map.has(item.pedido)) {
        map.set(item.pedido, { header: item, qtdeTotal: 0, totalItens: 0 })
      }
      const g = map.get(item.pedido)!
      g.qtdeTotal += item.qtde
      g.totalItens += 1
    }
    return Array.from(map.values())
  }, [items])

  const sorted = [...grouped].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'pedido')      cmp = Number(a.header.pedido) - Number(b.header.pedido)
    else if (sortKey === 'data')   cmp = a.header.data.split('/').reverse().join('').localeCompare(b.header.data.split('/').reverse().join(''))
    else if (sortKey === 'qtde')   cmp = a.qtdeTotal - b.qtdeTotal
    else if (sortKey === 'total')  cmp = a.header.totalLiquido - b.header.totalLiquido
    else if (sortKey === 'itens')  cmp = a.totalItens - b.totalItens
    else cmp = String(a.header[sortKey as keyof PedidoItem]).localeCompare(String(b.header[sortKey as keyof PedidoItem]), 'pt-BR')
    return sortDir === 'asc' ? cmp : -cmp
  })

  const cols: { key: SortKey; label: string }[] = [
    { key: 'pedido',      label: 'Pedido'      },
    { key: 'data',        label: 'Data'        },
    { key: 'cliente',     label: 'Cliente'     },
    { key: 'municipio',   label: 'Mun./UF'     },
    { key: 'tabelaPreco', label: 'Tabela'      },
    { key: 'planoPagto',  label: 'Plano Pagto' },
    { key: 'itens',       label: 'Itens'       },
    { key: 'qtde',        label: 'Qtde Total'  },
    { key: 'total',       label: 'Total'       },
  ]

  function Arrow({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span style={{ opacity: 0.3 }}>↕</span>
    return <span style={{ color: 'var(--accent)' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const EXPORT_HEADERS = ['Pedido', 'Data', 'Situação', 'Cliente', 'Município', 'UF', 'Tabela', 'Plano Pagto', 'Itens', 'Qtde Total', 'Total Líquido (R$)']
  function getExportRows() {
    return sorted.map(({ header, qtdeTotal, totalItens }) => [
      `#${header.pedido}`,
      header.data,
      header.situacao,
      header.cliente,
      header.municipio,
      header.estado,
      header.tabelaPreco,
      header.planoPagto,
      totalItens,
      qtdeTotal,
      header.totalLiquido,
    ])
  }

  if (grouped.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--muted)' }}>
        Nenhum pedido encontrado
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
                    className="px-2 py-2.5 text-left font-semibold cursor-pointer select-none whitespace-nowrap text-xs"
                    style={{ color: 'var(--highlight)', borderBottom: '1px solid var(--border)' }}
                  >
                    {c.label} <Arrow col={c.key} />
                  </th>
                ))}
                <th className="px-2 py-2.5 text-left font-semibold whitespace-nowrap text-xs"
                    style={{ color: 'var(--highlight)', borderBottom: '1px solid var(--border)' }}>
                  Situação
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(({ header, qtdeTotal, totalItens }, idx) => (
                <tr
                  key={header.pedido}
                  style={{
                    background: idx % 2 === 0 ? 'var(--surface)' : 'var(--bg)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <td className="px-2 py-2">
                    <button
                      onClick={() => setSelectedPedido(header.pedido)}
                      className="font-mono font-medium text-xs underline-offset-2 hover:underline transition-opacity hover:opacity-80"
                      style={{ color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                      aria-label={`Ver detalhes do pedido ${header.pedido}`}
                    >
                      #{header.pedido}
                    </button>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap font-mono text-xs" style={{ color: 'var(--muted)' }}>
                    {header.data}
                  </td>
                  <td className="px-2 py-2 text-xs" style={{ color: 'var(--text)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={header.cliente}>
                    {header.cliente}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs" style={{ color: 'var(--muted)' }}>
                    {header.municipio && header.estado ? `${header.municipio} · ${header.estado}` : header.municipio || header.estado || '—'}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs" style={{ color: 'var(--highlight)' }}>
                    {header.tabelaPreco}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-xs" style={{ color: 'var(--muted)' }}>
                    {header.planoPagto}
                  </td>
                  <td className="px-2 py-2 text-right text-xs" style={{ color: 'var(--muted)' }}>
                    {totalItens}
                  </td>
                  <td className="px-2 py-2 text-right text-xs font-medium" style={{ color: 'var(--accent)' }}>
                    {qtdeTotal.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-2 py-2 text-right text-xs font-bold" style={{ color: 'var(--amber)' }}>
                    R$ {fmt(header.totalLiquido)}
                  </td>
                  <td className="px-2 py-2">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap"
                      style={{ color: situacaoBadge(header.situacao), background: 'var(--surface2)' }}
                    >
                      {header.situacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--surface2)', borderTop: '2px solid var(--border)' }}>
                <td colSpan={3} className="px-2 py-2 text-xs font-medium" style={{ color: 'var(--muted)' }}>
                  {grouped.length} pedidos · {items.length} itens
                </td>
                <td colSpan={3} className="px-2 py-2">
                  <ExportButtons
                    filename={`pedidos-${meta.id}`}
                    pdfTitle={`Pedidos — ${meta.representada ?? `RCA ${meta.id}`}`}
                    pdfSubtitle={`${grouped.length} pedidos · ${items.length} itens`}
                    sheetName="Pedidos"
                    headers={EXPORT_HEADERS}
                    getRows={getExportRows}
                  />
                </td>
                <td className="px-2 py-2 text-right text-xs font-medium" style={{ color: 'var(--muted)' }}>
                  {sorted.reduce((s, g) => s + g.totalItens, 0)}
                </td>
                <td className="px-2 py-2 text-right text-xs font-bold" style={{ color: 'var(--accent)' }}>
                  {sorted.reduce((s, g) => s + g.qtdeTotal, 0).toLocaleString('pt-BR')}
                </td>
                <td className="px-2 py-2 text-right text-xs font-bold" style={{ color: 'var(--amber)' }}>
                  R$ {fmt(sorted.reduce((s, g) => s + g.header.totalLiquido, 0))}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Mobile export */}
      <div className="flex md:hidden items-center justify-between py-2">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{grouped.length} pedidos</span>
        <ExportButtons
          filename={`pedidos-${meta.id}`}
          pdfTitle={`Pedidos — ${meta.representada ?? `RCA ${meta.id}`}`}
          pdfSubtitle={`${grouped.length} pedidos`}
          sheetName="Pedidos"
          headers={EXPORT_HEADERS}
          getRows={getExportRows}
        />
      </div>

      {/* Mobile cards */}
      <div className="flex md:hidden flex-col gap-3">
        {sorted.map(({ header, qtdeTotal, totalItens }, idx) => (
          <div
            key={header.pedido}
            className="rounded-xl p-4"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderLeft: '4px solid var(--accent)',
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPedido(header.pedido)}
                  className="font-mono font-semibold underline-offset-2 hover:underline"
                  style={{ color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                  aria-label={`Ver detalhes do pedido ${header.pedido}`}
                >
                  #{header.pedido}
                </button>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ color: situacaoBadge(header.situacao), background: 'var(--surface2)' }}
                >
                  {header.situacao}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm" style={{ color: 'var(--amber)' }}>
                  R$ {fmt(header.totalLiquido)}
                </span>
                <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{header.data}</p>
              </div>
            </div>
            <p className="text-sm font-medium mb-0.5 truncate" style={{ color: 'var(--text)' }}>
              {header.cliente}
            </p>
            <div className="flex gap-3 text-xs mb-1">
              {header.tabelaPreco && (
                <span style={{ color: 'var(--highlight)' }}>{header.tabelaPreco}</span>
              )}
              {header.planoPagto && (
                <span style={{ color: 'var(--muted)' }}>{header.planoPagto}</span>
              )}
            </div>
            <div className="flex gap-4 text-xs">
              <span style={{ color: 'var(--muted)' }}>
                {header.municipio}{header.estado ? ` · ${header.estado}` : ''}
              </span>
              <span>
                <span style={{ color: 'var(--muted)' }}>Qtde: </span>
                <span className="font-medium" style={{ color: 'var(--accent)' }}>
                  {qtdeTotal.toLocaleString('pt-BR')}
                </span>
              </span>
              <span style={{ color: 'var(--muted)' }}>
                {totalItens} {totalItens === 1 ? 'item' : 'itens'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedPedido && (
        <PedidoModal
          items={allItems.filter(i => i.pedido === selectedPedido)}
          meta={meta}
          onClose={() => setSelectedPedido(null)}
        />
      )}
    </>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { PedidoItem, RcaMeta } from '@/lib/types'
import ExportButtons from './ExportButtons'

interface PedidoModalProps {
  items: PedidoItem[]
  meta: RcaMeta
  onClose: () => void
}

function SituacaoBadge({ situacao }: { situacao: string }) {
  let color: string
  if (situacao === 'Faturado') {
    color = 'var(--accent)'
  } else if (situacao === 'Cancelado') {
    color = 'var(--danger)'
  } else if (situacao === 'Pendente') {
    color = 'var(--amber)'
  } else {
    color = 'var(--muted)'
  }

  return (
    <span
      style={{
        color,
        border: `1px solid ${color}`,
        borderRadius: '9999px',
        padding: '2px 10px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.03em',
        display: 'inline-block',
      }}
    >
      {situacao}
    </span>
  )
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

export default function PedidoModal({ items, meta, onClose }: PedidoModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const header = items.length > 0 ? items[0] : null

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Pedido-${header?.pedido ?? 'XXX'}`,
  })

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // ESC key closes modal
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  if (!items.length || !header) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      {/* Modal container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Pedido ${header?.pedido}`}
        className="relative flex flex-col w-full h-full md:h-auto md:max-w-4xl md:rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface)', maxHeight: '100dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal header (sticky, non-scrollable) ── */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface2)',
          }}
        >
          {/* Left: pedido number + badge */}
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="font-mono font-bold text-lg truncate"
              style={{ color: 'var(--text)' }}
            >
              Pedido #{header.pedido}
            </span>
            <SituacaoBadge situacao={header.situacao} />
          </div>

          {/* Right: PDF + Excel + close */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <ExportButtons
              size="md"
              filename={`pedido-${header?.pedido ?? 'XXX'}`}
              pdfTitle={`Pedido #${header?.pedido ?? 'XXX'} — ${meta.representada}`}
              pdfSubtitle={`Cliente: ${header?.cliente ?? ''} · Data: ${header?.data ?? ''}`}
              sheetName={`Pedido ${header?.pedido ?? ''}`}
              headers={['#', 'Código', 'Produto', 'Unidade', 'Qtde', 'Preço Unit.', 'Desconto', 'Total']}
              getRows={() => items.map((item, i) => [
                i + 1,
                item.codigo,
                item.produto,
                item.unidade,
                item.qtde,
                item.preco,
                item.desconto > 0 ? `${item.desconto}%` : '',
                item.total,
              ])}
            />
            <button
              onClick={() => handlePrint()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                background: 'var(--accent)',
                color: '#fff',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Salvar PDF
            </button>

            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-opacity hover:opacity-70"
              style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
              aria-label="Fechar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Print area */}
          <div ref={contentRef} data-print-area className="p-4 md:p-6 space-y-5">

            {/* ── Emitente + Destinatário ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emitente */}
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: 'var(--muted)' }}
                >
                  Emitente
                </p>
                <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                  {meta.representada}
                </p>
              </div>

              {/* Destinatário */}
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: 'var(--muted)' }}
                >
                  Destinatário
                </p>
                <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                  {header.cliente}
                </p>
                {header.clienteFantasia && header.clienteFantasia !== header.cliente && (
                  <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                    {header.clienteFantasia}
                  </p>
                )}
                <p className="text-xs mt-1 font-mono" style={{ color: 'var(--muted)' }}>
                  CNPJ: {header.codCliente}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  {header.municipio} / {header.estado}
                </p>
              </div>
            </div>

            {/* ── Info bar ── */}
            <div
              className="flex flex-wrap gap-x-6 gap-y-2 rounded-xl px-4 py-3"
              style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
            >
              <InfoChip label="Data" value={header.data} />
              {header.dataEntrega && (
                <InfoChip label="Entrega" value={header.dataEntrega} />
              )}
              <InfoChip label="Tabela" value={header.tabelaPreco} />
              <InfoChip label="Plano Pagto" value={header.planoPagto} />
              {header.ordemCompra && (
                <InfoChip label="Ordem de Compra" value={header.ordemCompra} />
              )}
            </div>

            {/* ── Items table ── */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--border)' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ background: 'var(--surface2)' }}>
                      {['#', 'Código', 'Produto', 'Unidade', 'Qtde', 'Preço Unit.', 'Desconto', 'Total'].map(
                        (col, i) => (
                          <th
                            key={col}
                            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${
                              i >= 4 ? 'text-right' : 'text-left'
                            }`}
                            style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}
                          >
                            {col}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr
                        key={idx}
                        style={{
                          background: idx % 2 === 0 ? 'var(--surface)' : 'var(--surface2)',
                        }}
                      >
                        <td
                          className="px-3 py-2 tabular-nums"
                          style={{ color: 'var(--muted)' }}
                        >
                          {idx + 1}
                        </td>
                        <td
                          className="px-3 py-2 font-mono text-xs"
                          style={{ color: 'var(--text)' }}
                        >
                          {item.codigo}
                        </td>
                        <td
                          className="px-3 py-2"
                          style={{ color: 'var(--text)', minWidth: '180px' }}
                        >
                          {item.produto}
                        </td>
                        <td
                          className="px-3 py-2 text-center"
                          style={{ color: 'var(--muted)' }}
                        >
                          {item.unidade}
                        </td>
                        <td
                          className="px-3 py-2 text-right font-semibold tabular-nums"
                          style={{ color: 'var(--accent)' }}
                        >
                          {item.qtde}
                        </td>
                        <td
                          className="px-3 py-2 text-right tabular-nums whitespace-nowrap"
                          style={{ color: 'var(--amber)' }}
                        >
                          R$ {fmt(item.preco)}
                        </td>
                        <td
                          className="px-3 py-2 text-right tabular-nums"
                          style={{ color: item.desconto > 0 ? 'var(--amber)' : 'var(--muted)' }}
                        >
                          {item.desconto > 0 ? `${item.desconto}%` : '—'}
                        </td>
                        <td
                          className="px-3 py-2 text-right font-bold tabular-nums whitespace-nowrap"
                          style={{ color: 'var(--amber)' }}
                        >
                          R$ {fmt(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Totals ── */}
            <div className="flex flex-col items-end gap-1 pr-1">
              <div className="flex items-center gap-4">
                <span className="text-sm" style={{ color: 'var(--muted)' }}>
                  Total Bruto
                </span>
                <span
                  className="font-mono tabular-nums text-sm"
                  style={{ color: 'var(--amber)', minWidth: '110px', textAlign: 'right' }}
                >
                  R$ {fmt(header.totalBruto)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  Total Líquido
                </span>
                <span
                  className="font-mono tabular-nums font-bold text-base"
                  style={{ color: 'var(--amber)', minWidth: '110px', textAlign: 'right' }}
                >
                  R$ {fmt(header.totalLiquido)}
                </span>
              </div>
            </div>

            {/* ── Observações ── */}
            {header.observacoes && (
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: 'var(--muted)' }}
                >
                  Observações
                </p>
                <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text)' }}>
                  {header.observacoes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs" style={{ color: 'var(--muted)' }}>
        {label}
      </span>
      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
        {value}
      </span>
    </div>
  )
}

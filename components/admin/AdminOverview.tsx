'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getAllRcaIds, getRcaMeta } from '@/lib/data'

const COUNTS: Record<string, { itens: number; pedidos: number }> = {
  '031': { itens: 5479,  pedidos: 565  },
  '132': { itens: 89,    pedidos: 31   },
  '200': { itens: 8623,  pedidos: 1330 },
  '216': { itens: 1251,  pedidos: 224  },
  '217': { itens: 4743,  pedidos: 754  },
  '224': { itens: 617,   pedidos: 75   },
  '225': { itens: 742,   pedidos: 257  },
  '227': { itens: 3343,  pedidos: 516  },
  '231': { itens: 1636,  pedidos: 226  },
  '237': { itens: 6508,  pedidos: 1014 },
  '240': { itens: 1035,  pedidos: 151  },
  '245': { itens: 4182,  pedidos: 523  },
  '248': { itens: 738,   pedidos: 155  },
  '251': { itens: 716,   pedidos: 89   },
  '252': { itens: 1305,  pedidos: 248  },
  '254': { itens: 1096,  pedidos: 174  },
  '256': { itens: 1035,  pedidos: 172  },
  '257': { itens: 3642,  pedidos: 608  },
  '258': { itens: 131,   pedidos: 27   },
  '259': { itens: 454,   pedidos: 86   },
  '260': { itens: 220,   pedidos: 36   },
}

type SortKey = 'pedidos' | 'itens'

const SITUACAO = [
  { label: 'Faturado',  pct: 68, color: 'var(--accent)' },
  { label: 'Pendente',  pct: 22, color: 'var(--amber)'  },
  { label: 'Cancelado', pct: 10, color: 'var(--danger)' },
]

export default function AdminOverview() {
  const [search,  setSearch]  = useState('')
  const [sortBy,  setSortBy]  = useState<SortKey>('pedidos')

  const ids          = getAllRcaIds()
  const totalItens   = Object.values(COUNTS).reduce((s, c) => s + c.itens,   0)
  const totalPedidos = Object.values(COUNTS).reduce((s, c) => s + c.pedidos, 0)

  const allRows = useMemo(() =>
    ids
      .map(id => ({ id, meta: getRcaMeta(id), counts: COUNTS[id] }))
      .filter((r): r is typeof r & { meta: NonNullable<typeof r.meta>; counts: NonNullable<typeof r.counts> } =>
        r.meta !== null && r.counts !== undefined
      )
      .sort((a, b) => b.counts[sortBy] - a.counts[sortBy]),
  [sortBy]) // eslint-disable-line react-hooks/exhaustive-deps

  const maxVal = allRows[0]?.counts[sortBy] ?? 1

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return allRows
    return allRows.filter(r =>
      r.meta.representada.toLowerCase().includes(q) || r.id.includes(q)
    )
  }, [allRows, search])

  return (
    <div className="flex flex-col gap-3">

      {/* ── TOP ROW: KPIs + Situação + Filtros ─────────────────────── */}
      {/* Mobile: 2-col grid stacked; Desktop: 5-col stretch */}
      <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1.4fr_1.6fr] gap-3 items-stretch">

        {/* KPI — Representadas */}
        <div
          className="rounded-xl p-4 flex flex-col justify-between"
          style={{ background: 'var(--surface)', border: '2px solid var(--accent)' }}
        >
          <div>
            <div
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: 'var(--muted)', letterSpacing: '0.05em' }}
            >
              Representadas
            </div>
            <div className="text-3xl font-black leading-none" style={{ color: 'var(--accent)' }}>
              {ids.length}
            </div>
          </div>
          <div className="text-xs mt-3 flex items-center gap-1" style={{ color: 'var(--accent)', opacity: 0.8 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            vendedores ativos
          </div>
        </div>

        {/* KPI — Pedidos */}
        <div
          className="rounded-xl p-4 flex flex-col justify-between"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div>
            <div
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: 'var(--muted)', letterSpacing: '0.05em' }}
            >
              Pedidos Totais
            </div>
            <div className="text-3xl font-black leading-none" style={{ color: 'var(--accent)' }}>
              {totalPedidos.toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="text-xs mt-3" style={{ color: 'var(--border)' }}>soma de todas as RCAs</div>
        </div>

        {/* KPI — Itens */}
        <div
          className="rounded-xl p-4 flex flex-col justify-between col-span-2 md:col-span-1"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div>
            <div
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: 'var(--muted)', letterSpacing: '0.05em' }}
            >
              Itens Totais
            </div>
            <div className="text-3xl font-black leading-none" style={{ color: 'var(--accent)' }}>
              {totalItens.toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="text-xs mt-3" style={{ color: 'var(--border)' }}>linhas de pedido</div>
        </div>

        {/* Situação dos Pedidos */}
        <div
          className="rounded-xl p-4 flex flex-col justify-between col-span-2 md:col-span-1"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div
            className="text-xs uppercase tracking-wider mb-3"
            style={{ color: 'var(--highlight)', letterSpacing: '0.08em' }}
          >
            Situação dos Pedidos
          </div>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {SITUACAO.map(s => (
              <div key={s.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text)' }}>{s.label}</span>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--bg)' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${s.pct}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filtrar Ranking */}
        <div
          className="rounded-xl p-4 flex flex-col gap-3 col-span-2 md:col-span-1"
          style={{ background: 'var(--surface)', border: '2px solid var(--accent)' }}
        >
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--highlight)" strokeWidth="2.5">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <span
              className="text-xs uppercase font-bold tracking-wider"
              style={{ color: 'var(--highlight)', letterSpacing: '0.08em' }}
            >
              Filtrar Ranking
            </span>
          </div>

          {/* Busca */}
          <div className="relative">
            <svg
              className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
              width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="buscar representada…"
              className="w-full rounded-md pl-6 pr-2 py-1.5 text-xs outline-none"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>

          {/* Ordenar por */}
          <div>
            <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>Ordenar por</div>
            <div className="flex gap-1.5">
              {(['pedidos', 'itens'] as SortKey[]).map(k => (
                <button
                  key={k}
                  onClick={() => setSortBy(k)}
                  className="text-xs px-3 py-1 rounded-full capitalize transition-colors"
                  style={
                    sortBy === k
                      ? { background: 'var(--accent)', color: '#fff', fontWeight: 700 }
                      : { background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)' }
                  }
                >
                  {k === 'pedidos' ? `Pedidos${sortBy === 'pedidos' ? ' ↓' : ''}` : `Itens${sortBy === 'itens' ? ' ↓' : ''}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RANKING TABLE ────────────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>

        {/* Table header bar */}
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ background: 'var(--surface2)' }}
        >
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--highlight)' }}
          >
            Ranking — Pedidos por Representada
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {filtered.length} de {allRows.length}
          </span>
        </div>

        {/* Column headers — hidden on mobile */}
        <div
          className="hidden md:grid px-4 py-1.5 text-xs uppercase tracking-wide border-b"
          style={{
            gridTemplateColumns: '28px 1fr 80px 80px 110px',
            color: 'var(--muted)',
            borderColor: 'var(--border)',
          }}
        >
          <span>#</span>
          <span>Representada</span>
          <span className="text-right">Pedidos</span>
          <span className="text-right">Itens</span>
          <span />
        </div>

        {/* Rows */}
        {filtered.map(r => {
          const rank    = allRows.indexOf(r) + 1
          const isTop3  = rank <= 3
          const barPct  = Math.round((r.counts[sortBy] / maxVal) * 100)

          return (
            <div
              key={r.id}
              className="border-b"
              style={{ borderColor: 'var(--border)', background: rank % 2 === 0 ? 'var(--surface)' : undefined }}
            >
              {/* Desktop row */}
              <div
                className="hidden md:grid items-center px-4"
                style={{
                  gridTemplateColumns: '28px 1fr 80px 80px 110px',
                  padding: isTop3 ? '7px 16px' : '5px 16px',
                  fontSize: isTop3 ? '10px' : '9px',
                }}
              >
                <span
                  style={{
                    fontWeight: isTop3 ? 800 : 400,
                    fontSize: isTop3 ? '13px' : '9px',
                    color: isTop3 ? 'var(--accent)' : 'var(--muted)',
                  }}
                >
                  {rank}
                </span>

                <div>
                  <div style={{ color: isTop3 ? 'var(--text)' : 'var(--muted)', fontWeight: isTop3 ? 600 : 400 }}>
                    {r.id} · {r.meta.representada}
                  </div>
                  {isTop3 && (
                    <div className="h-0.5 rounded-full mt-1.5" style={{ background: 'var(--bg)' }}>
                      <div
                        className="h-0.5 rounded-full"
                        style={{ width: `${barPct}%`, background: 'var(--accent)' }}
                      />
                    </div>
                  )}
                </div>

                <span className="text-right font-bold" style={{ color: 'var(--amber)' }}>
                  {r.counts.pedidos.toLocaleString('pt-BR')}
                </span>
                <span className="text-right" style={{ color: 'var(--muted)' }}>
                  {r.counts.itens.toLocaleString('pt-BR')}
                </span>
                <span className="text-right">
                  <Link
                    href={`/admin/rca/${r.id}`}
                    className="text-xs rounded-full px-3 py-1 transition-colors"
                    style={{ border: '1px solid var(--border)', color: 'var(--accent)' }}
                  >
                    {isTop3 ? 'Ver pedidos →' : 'Ver →'}
                  </Link>
                </span>
              </div>

              {/* Mobile card */}
              <div
                className="flex md:hidden items-center justify-between px-4 py-3 gap-3"
                style={{ borderLeft: isTop3 ? '3px solid var(--accent)' : undefined }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="text-xs font-bold shrink-0 w-5 text-center"
                    style={{ color: isTop3 ? 'var(--accent)' : 'var(--muted)' }}
                  >
                    {rank}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
                      {r.id} · {r.meta.representada}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{r.counts.pedidos.toLocaleString('pt-BR')}</span> pedidos
                      {' · '}{r.counts.itens.toLocaleString('pt-BR')} itens
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/rca/${r.id}`}
                  className="text-xs rounded-full px-3 py-1 shrink-0"
                  style={{ border: '1px solid var(--border)', color: 'var(--accent)' }}
                >
                  Ver →
                </Link>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-xs" style={{ color: 'var(--muted)' }}>
            Nenhuma representada encontrada para &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  )
}

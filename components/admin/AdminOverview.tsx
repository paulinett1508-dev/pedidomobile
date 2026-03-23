'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getAllRcaIds, getRcaMeta } from '@/lib/data'
import ExportButtons from '@/components/ExportButtons'

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

type SortKey = 'matricula' | 'nome' | 'pedidos' | 'itens'
type SortDir = 'asc' | 'desc'

export interface SituacaoStat {
  label: string
  count: number
  pct: number
  color: string
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="inline-flex flex-col ml-1" style={{ opacity: active ? 1 : 0.3, lineHeight: 1 }}>
      <svg
        width="8" height="5" viewBox="0 0 8 5" fill="currentColor"
        style={{ color: active && dir === 'asc' ? 'var(--accent)' : 'var(--muted)', display: 'block' }}
      >
        <path d="M4 0L8 5H0L4 0Z"/>
      </svg>
      <svg
        width="8" height="5" viewBox="0 0 8 5" fill="currentColor"
        style={{ color: active && dir === 'desc' ? 'var(--accent)' : 'var(--muted)', display: 'block', marginTop: '2px' }}
      >
        <path d="M4 5L0 0H8L4 5Z"/>
      </svg>
    </span>
  )
}

export default function AdminOverview({ situacao }: { situacao: SituacaoStat[] }) {
  const [search,  setSearch]  = useState('')
  const [sortBy,  setSortBy]  = useState<SortKey>('pedidos')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const ids          = getAllRcaIds()
  const totalItens   = Object.values(COUNTS).reduce((s, c) => s + c.itens,   0)
  const totalPedidos = Object.values(COUNTS).reduce((s, c) => s + c.pedidos, 0)

  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDir(key === 'matricula' || key === 'nome' ? 'asc' : 'desc')
    }
  }

  const allRows = useMemo(() => {
    const rows = ids
      .map(id => ({ id, meta: getRcaMeta(id), counts: COUNTS[id] }))
      .filter((r): r is typeof r & { meta: NonNullable<typeof r.meta>; counts: NonNullable<typeof r.counts> } =>
        r.meta !== null && r.counts !== undefined
      )

    rows.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'matricula') cmp = a.id.localeCompare(b.id)
      else if (sortBy === 'nome')    cmp = a.meta.representada.localeCompare(b.meta.representada, 'pt-BR')
      else if (sortBy === 'pedidos') cmp = a.counts.pedidos - b.counts.pedidos
      else if (sortBy === 'itens')   cmp = a.counts.itens   - b.counts.itens
      return sortDir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [sortBy, sortDir]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return allRows
    return allRows.filter(r =>
      r.meta.representada.toLowerCase().includes(q) || r.id.includes(q)
    )
  }, [allRows, search])

  const COLS: { key: SortKey | null; label: string; align: 'left' | 'right'; width: string }[] = [
    { key: null,        label: '#',           align: 'left',  width: '36px'  },
    { key: 'matricula', label: 'Matrícula',   align: 'left',  width: '80px'  },
    { key: 'nome',      label: 'Representada', align: 'left', width: '1fr'   },
    { key: 'pedidos',   label: 'Pedidos',     align: 'right', width: '90px'  },
    { key: 'itens',     label: 'Itens',       align: 'right', width: '90px'  },
    { key: null,        label: '',            align: 'right', width: '36px'  },
  ]
  const gridCols = COLS.map(c => c.width).join(' ')

  return (
    <div className="flex flex-col gap-3">

      {/* ── TOP ROW: KPIs + Situação + Filtros ─────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1.4fr_1.6fr] gap-3 items-stretch">

        {/* KPI — Representadas */}
        <div
          className="rounded-xl p-4 flex flex-col justify-between"
          style={{ background: 'var(--surface)', border: '2px solid var(--accent)' }}
        >
          <div>
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
              Representadas
            </div>
            <div className="text-3xl font-black leading-none" style={{ color: 'var(--accent)' }}>
              {ids.length}
            </div>
          </div>
          <div className="text-xs mt-3 flex items-center gap-1" style={{ color: 'var(--accent)', opacity: 0.8 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
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
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
              Pedidos Totais
            </div>
            <div className="text-3xl font-black leading-none" style={{ color: 'var(--accent)' }}>
              {totalPedidos.toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="text-xs mt-3" style={{ color: 'var(--muted)', opacity: 0.6 }}>soma de todas as RCAs</div>
        </div>

        {/* KPI — Itens */}
        <div
          className="rounded-xl p-4 flex flex-col justify-between col-span-2 md:col-span-1"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div>
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
              Itens Totais
            </div>
            <div className="text-3xl font-black leading-none" style={{ color: 'var(--accent)' }}>
              {totalItens.toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="text-xs mt-3" style={{ color: 'var(--muted)', opacity: 0.6 }}>linhas de pedido</div>
        </div>

        {/* Situação dos Pedidos */}
        <div
          className="rounded-xl p-4 flex flex-col justify-between col-span-2 md:col-span-1"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--highlight)' }}>
            Situação dos Pedidos
          </div>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {situacao.map(s => (
              <div key={s.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text)' }}>{s.label}</span>
                  <span className="text-xs font-bold" style={{ color: s.color }}>
                    {s.count.toLocaleString('pt-BR')} <span style={{ opacity: 0.7 }}>({s.pct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--bg)' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
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
            <span className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--highlight)' }}>
              Filtrar Ranking
            </span>
          </div>

          <div className="relative">
            <svg
              className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
              width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="buscar representada…"
              className="w-full rounded-md pl-6 pr-2 py-1.5 text-xs outline-none"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <p className="text-xs" style={{ color: 'var(--muted)', opacity: 0.7 }}>
            Clique nas colunas da tabela para ordenar ↑↓
          </p>
        </div>
      </div>

      {/* ── RANKING TABLE ────────────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>

        {/* Title bar */}
        <div
          className="px-5 py-3 flex items-center justify-between gap-3"
          style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}
        >
          <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--highlight)' }}>
            Representadas
          </span>
          <div className="flex items-center gap-3">
            <ExportButtons
              filename="representadas"
              pdfTitle="Ranking de Representadas"
              pdfSubtitle={`${filtered.length} representadas · dados até 31/12/2025`}
              sheetName="Representadas"
              headers={['Matrícula', 'Representada', 'Pedidos', 'Itens']}
              getRows={() => filtered.map(r => [r.id, r.meta.representada, r.counts.pedidos, r.counts.itens])}
            />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {filtered.length} de {allRows.length}
            </span>
          </div>
        </div>

        {/* Column headers (desktop) */}
        <div
          className="hidden md:grid items-center px-5 py-2"
          style={{
            gridTemplateColumns: gridCols,
            background: 'var(--surface2)',
            borderBottom: '2px solid var(--border)',
          }}
        >
          {COLS.map((col, i) => (
            <div
              key={i}
              className={`flex items-center gap-0.5 select-none ${col.align === 'right' ? 'justify-end' : ''} ${col.key ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={() => col.key && handleSort(col.key)}
              style={{ color: sortBy === col.key ? 'var(--accent)' : 'var(--muted)' }}
            >
              <span className="text-xs font-semibold uppercase tracking-wide">{col.label}</span>
              {col.key && <SortIcon active={sortBy === col.key} dir={sortDir} />}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((r, idx) => {
          const rank = allRows.indexOf(r) + 1
          return (
            <div
              key={r.id}
              style={{
                borderBottom: '1px solid var(--border)',
                background: idx % 2 === 0 ? 'var(--surface)' : undefined,
              }}
            >
              {/* Desktop row */}
              <Link
                href={`/admin/rca/${r.id}`}
                className="hidden md:grid items-center px-5 py-3 group transition-colors hover:bg-[var(--surface2)]"
                style={{ gridTemplateColumns: gridCols }}
              >
                <span className="text-sm font-bold" style={{ color: 'var(--muted)' }}>
                  {rank}
                </span>
                <span className="text-sm font-mono font-semibold" style={{ color: 'var(--accent)' }}>
                  {r.id}
                </span>
                <span
                  className="text-sm font-medium group-hover:underline truncate pr-4"
                  style={{ color: 'var(--text)' }}
                >
                  {r.meta.representada}
                </span>
                <span className="text-sm font-bold text-right" style={{ color: 'var(--amber)' }}>
                  {r.counts.pedidos.toLocaleString('pt-BR')}
                </span>
                <span className="text-sm text-right" style={{ color: 'var(--muted)' }}>
                  {r.counts.itens.toLocaleString('pt-BR')}
                </span>
                <span className="text-right text-sm" style={{ color: 'var(--accent)', opacity: 0.5 }}>→</span>
              </Link>

              {/* Mobile card */}
              <Link
                href={`/admin/rca/${r.id}`}
                className="flex md:hidden items-center justify-between px-4 py-3 gap-3"
                style={{ borderLeft: '3px solid var(--border)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-bold shrink-0 w-6 text-center" style={{ color: 'var(--muted)' }}>
                    {rank}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-semibold" style={{ color: 'var(--accent)' }}>{r.id}</p>
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                      {r.meta.representada}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{r.counts.pedidos.toLocaleString('pt-BR')}</span> pedidos
                      {' · '}{r.counts.itens.toLocaleString('pt-BR')} itens
                    </p>
                  </div>
                </div>
                <span className="text-sm shrink-0" style={{ color: 'var(--accent)' }}>→</span>
              </Link>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--muted)' }}>
            Nenhuma representada encontrada para &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  )
}

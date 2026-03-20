'use client'

import { useState, useMemo } from 'react'
import type { PedidoItem, RcaMeta } from '@/lib/types'
import KpiStrip from './KpiStrip'
import MiniCharts from './MiniCharts'
import FilterBar, { type Filters } from './FilterBar'
import PedidosTable from './PedidosTable'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'

interface DashboardProps {
  meta: RcaMeta
  items: PedidoItem[]
  isAdmin?: boolean
}

export default function Dashboard({ meta, items, isAdmin }: DashboardProps) {
  const [filters, setFilters] = useState<Filters>({ search: '', cliente: '', pedido: '', situacao: '', estado: '', tabelaPreco: '', planoPagto: '' })

  const filtered = useMemo(() => {
    return items.filter(item => {
      if (filters.cliente     && item.cliente     !== filters.cliente)     return false
      if (filters.pedido      && item.pedido      !== filters.pedido)      return false
      if (filters.situacao    && item.situacao    !== filters.situacao)    return false
      if (filters.estado      && item.estado      !== filters.estado)      return false
      if (filters.tabelaPreco && item.tabelaPreco !== filters.tabelaPreco) return false
      if (filters.planoPagto  && item.planoPagto  !== filters.planoPagto)  return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        return (
          item.cliente.toLowerCase().includes(q)   ||
          item.produto.toLowerCase().includes(q)   ||
          item.pedido.includes(q)                  ||
          item.codCliente.includes(q)              ||
          item.municipio.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [items, filters])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 px-4 py-3"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-md px-1.5 py-1 shrink-0">
              <Logo size="sm" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight" style={{ color: 'var(--accent)' }}>
                Pedido Mobile
              </p>
              <p className="text-xs leading-tight" style={{ color: 'var(--muted)' }}>
                Sistema de Consultas de Pedidos até 31/12/2025
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <span
                className="px-2 py-1 rounded text-xs font-bold tracking-wide"
                style={{ background: 'var(--amber)', color: '#000' }}
              >
                VISÃO ADMIN
              </span>
            )}
            <ThemeToggle />
            {isAdmin ? (
              <a
                href="/admin"
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                style={{ background: 'var(--surface2)', color: 'var(--highlight)' }}
              >
                ← Voltar ao painel
              </a>
            ) : (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile vendor info sub-header */}
      <div
        className="md:hidden px-4 py-2 flex items-center gap-2"
        style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'var(--accent)', color: '#fff' }}>
          RCA {meta.id}
        </span>
        <span className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
          {meta.vendedor ?? meta.representada}
        </span>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Aviso de sistema somente leitura */}
        <div
          className="flex gap-3 rounded-xl px-4 py-3 mb-5 text-sm leading-snug"
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--amber)',
            color: 'var(--text)',
          }}
        >
          <span className="mt-0.5 shrink-0" style={{ color: 'var(--amber)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </span>
          <p>
            <strong style={{ color: 'var(--amber)' }}>Sistema apenas para consultas.</strong>{' '}
            Não vale para inserção de pedidos ou alterações pertinentes. Todos os pedidos listados são herdados do sistema anterior, encerrado em 31/12/2025. Caso necessite, solicite uma auditoria com a gerência comercial do Laboratório Sobral.
          </p>
        </div>

        <KpiStrip items={items} filtered={filtered} />
        <MiniCharts items={filtered} />
        <FilterBar items={items} filters={filters} onChange={setFilters} />
        <PedidosTable items={filtered} />

        <footer className="mt-10 flex justify-center pb-4 opacity-40">
          <img src="/logo_sobral.svg" alt="Laboratório Sobral" className="h-8" />
        </footer>
      </main>
    </div>
  )
}

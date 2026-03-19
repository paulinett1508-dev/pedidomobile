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
}

export default function Dashboard({ meta, items }: DashboardProps) {
  const [filters, setFilters] = useState<Filters>({ search: '', cliente: '', pedido: '' })

  const filtered = useMemo(() => {
    return items.filter(item => {
      if (filters.cliente && item.cliente !== filters.cliente) return false
      if (filters.pedido && item.pedido !== filters.pedido) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        return (
          item.cliente.toLowerCase().includes(q) ||
          item.produto.toLowerCase().includes(q) ||
          item.pedido.includes(q) ||
          item.codCliente.includes(q)
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
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="hidden md:block">
              <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
                RCA {meta.id}
              </p>
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text)' }}>
                {meta.vendedor}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
            >
              Sair
            </button>
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
          {meta.vendedor}
        </span>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <KpiStrip items={items} filtered={filtered} />
        <MiniCharts items={filtered} />
        <FilterBar items={items} filters={filters} onChange={setFilters} />
        <PedidosTable items={filtered} />
      </main>
    </div>
  )
}

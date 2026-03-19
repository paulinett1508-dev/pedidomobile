'use client'

import { useState } from 'react'
import type { PedidoItem } from '@/lib/types'

export interface Filters {
  search: string
  cliente: string
  pedido: string
}

interface FilterBarProps {
  items: PedidoItem[]
  filters: Filters
  onChange: (f: Filters) => void
}

export default function FilterBar({ items, filters, onChange }: FilterBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const clientes = Array.from(new Set(items.map(i => i.cliente))).sort()
  const pedidos = Array.from(new Set(items.map(i => i.pedido))).sort()

  const activeCount = [filters.cliente, filters.pedido].filter(Boolean).length

  function clear() {
    onChange({ search: '', cliente: '', pedido: '' })
    setDrawerOpen(false)
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Buscar cliente, produto, pedido..."
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          className="flex-1 min-w-48 px-3 py-2 rounded-lg text-sm outline-none focus:ring-1"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
        <select
          value={filters.cliente}
          onChange={e => onChange({ ...filters, cliente: e.target.value })}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: filters.cliente ? 'var(--text)' : 'var(--muted)',
          }}
        >
          <option value="">Todos os clientes</option>
          {clientes.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filters.pedido}
          onChange={e => onChange({ ...filters, pedido: e.target.value })}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: filters.pedido ? 'var(--text)' : 'var(--muted)',
          }}
        >
          <option value="">Todos os pedidos</option>
          {pedidos.map(p => (
            <option key={p} value={p}>#{p}</option>
          ))}
        </select>
        {(filters.search || filters.cliente || filters.pedido) && (
          <button
            onClick={clear}
            className="px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-80"
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
          >
            Limpar
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 whitespace-nowrap"
          style={{
            background: activeCount > 0 ? 'var(--accent)' : 'var(--surface)',
            border: '1px solid var(--border)',
            color: activeCount > 0 ? '#fff' : 'var(--text)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="12" y1="18" x2="12" y2="18"/>
          </svg>
          Filtrar{activeCount > 0 ? ` · ${activeCount}` : ''}
        </button>
      </div>

      {/* Bottom Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="relative rounded-t-2xl p-6 flex flex-col gap-4"
            style={{ background: 'var(--surface)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold" style={{ color: 'var(--text)' }}>Filtros</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full"
                style={{ background: 'var(--surface2)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                Cliente
              </label>
              <select
                value={filters.cliente}
                onChange={e => onChange({ ...filters, cliente: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              >
                <option value="">Todos os clientes</option>
                {clientes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
                Pedido
              </label>
              <select
                value={filters.pedido}
                onChange={e => onChange({ ...filters, pedido: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              >
                <option value="">Todos os pedidos</option>
                {pedidos.map(p => (
                  <option key={p} value={p}>#{p}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={clear}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
              >
                Limpar
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useState } from 'react'
import type { PedidoItem } from '@/lib/types'

export interface Filters {
  search:      string
  cliente:     string
  pedido:      string
  situacao:    string
  estado:      string
  tabelaPreco: string
  planoPagto:  string
  dataInicio:  string
  dataFim:     string
}

interface FilterBarProps {
  items:    PedidoItem[]
  filters:  Filters
  onChange: (f: Filters) => void
}

function SelectField({
  label, value, options, placeholder, onChange,
}: {
  label: string
  value: string
  options: string[]
  placeholder: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
        style={{
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function FilterBar({ items, filters, onChange }: FilterBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const clientes    = Array.from(new Set(items.map(i => i.cliente))).sort()
  const pedidos     = Array.from(new Set(items.map(i => i.pedido))).sort((a, b) => Number(a) - Number(b))
  const situacoes   = Array.from(new Set(items.map(i => i.situacao).filter(Boolean))).sort()
  const estados     = Array.from(new Set(items.map(i => i.estado).filter(Boolean))).sort()
  const tabelas     = Array.from(new Set(items.map(i => i.tabelaPreco).filter(Boolean))).sort()
  const planos      = Array.from(new Set(items.map(i => i.planoPagto).filter(Boolean))).sort()

  const activeCount = [filters.cliente, filters.pedido, filters.situacao, filters.estado, filters.tabelaPreco, filters.planoPagto, filters.dataInicio, filters.dataFim].filter(Boolean).length

  function clear() {
    onChange({ search: '', cliente: '', pedido: '', situacao: '', estado: '', tabelaPreco: '', planoPagto: '', dataInicio: '', dataFim: '' })
    setDrawerOpen(false)
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Buscar pedido, cliente, produto, município..."
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          className="flex-1 min-w-52 px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${filters.search ? 'var(--amber)' : 'var(--border)'}`,
            color: 'var(--text)',
          }}
        />
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            title="De:"
            value={filters.dataInicio}
            onChange={e => onChange({ ...filters, dataInicio: e.target.value })}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${filters.dataInicio ? 'var(--amber)' : 'var(--border)'}`,
              color: filters.dataInicio ? 'var(--text)' : 'var(--muted)',
            }}
          />
          <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>até</span>
          <input
            type="date"
            title="Até:"
            value={filters.dataFim}
            onChange={e => onChange({ ...filters, dataFim: e.target.value })}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--surface)',
              border: `1px solid ${filters.dataFim ? 'var(--amber)' : 'var(--border)'}`,
              color: filters.dataFim ? 'var(--text)' : 'var(--muted)',
            }}
          />
        </div>
        <select
          value={filters.situacao}
          onChange={e => onChange({ ...filters, situacao: e.target.value })}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${filters.situacao ? 'var(--amber)' : 'var(--border)'}`,
            color: filters.situacao ? 'var(--text)' : 'var(--muted)',
          }}
        >
          <option value="">Situação</option>
          {situacoes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filters.estado}
          onChange={e => onChange({ ...filters, estado: e.target.value })}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${filters.estado ? 'var(--amber)' : 'var(--border)'}`,
            color: filters.estado ? 'var(--text)' : 'var(--muted)',
          }}
        >
          <option value="">UF</option>
          {estados.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filters.tabelaPreco}
          onChange={e => onChange({ ...filters, tabelaPreco: e.target.value })}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${filters.tabelaPreco ? 'var(--amber)' : 'var(--border)'}`,
            color: filters.tabelaPreco ? 'var(--text)' : 'var(--muted)',
          }}
        >
          <option value="">Tabela de Preço</option>
          {tabelas.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={filters.planoPagto}
          onChange={e => onChange({ ...filters, planoPagto: e.target.value })}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${filters.planoPagto ? 'var(--amber)' : 'var(--border)'}`,
            color: filters.planoPagto ? 'var(--text)' : 'var(--muted)',
          }}
        >
          <option value="">Plano de Pagto.</option>
          {planos.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filters.cliente}
          onChange={e => onChange({ ...filters, cliente: e.target.value })}
          className="px-3 py-2 rounded-lg text-sm outline-none max-w-56"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${filters.cliente ? 'var(--amber)' : 'var(--border)'}`,
            color: filters.cliente ? 'var(--text)' : 'var(--muted)',
          }}
        >
          <option value="">Todos os clientes</option>
          {clientes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filters.pedido}
          onChange={e => onChange({ ...filters, pedido: e.target.value })}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${filters.pedido ? 'var(--amber)' : 'var(--border)'}`,
            color: filters.pedido ? 'var(--text)' : 'var(--muted)',
          }}
        >
          <option value="">Todos os pedidos</option>
          {pedidos.map(p => <option key={p} value={p}>#{p}</option>)}
        </select>
        {(filters.search || activeCount > 0) && (
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
          className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 whitespace-nowrap shrink-0"
          style={{
            background: activeCount > 0 ? 'var(--amber)' : 'var(--surface)',
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
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div
            className="relative rounded-t-2xl p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
            style={{ background: 'var(--surface)' }}
          >
            <div className="flex items-center justify-between">
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
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Período</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={filters.dataInicio}
                  onChange={e => onChange({ ...filters, dataInicio: e.target.value })}
                  className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{
                    background: 'var(--surface2)',
                    border: `1px solid ${filters.dataInicio ? 'var(--amber)' : 'var(--border)'}`,
                    color: 'var(--text)',
                  }}
                />
                <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>até</span>
                <input
                  type="date"
                  value={filters.dataFim}
                  onChange={e => onChange({ ...filters, dataFim: e.target.value })}
                  className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{
                    background: 'var(--surface2)',
                    border: `1px solid ${filters.dataFim ? 'var(--amber)' : 'var(--border)'}`,
                    color: 'var(--text)',
                  }}
                />
              </div>
            </div>
            <SelectField label="Situação" value={filters.situacao} options={situacoes}
              placeholder="Todas as situações" onChange={v => onChange({ ...filters, situacao: v })} />
            <SelectField label="Estado (UF)" value={filters.estado} options={estados}
              placeholder="Todos os estados" onChange={v => onChange({ ...filters, estado: v })} />
            <SelectField label="Tabela de Preço" value={filters.tabelaPreco} options={tabelas}
              placeholder="Todas as tabelas" onChange={v => onChange({ ...filters, tabelaPreco: v })} />
            <SelectField label="Plano de Pagamento" value={filters.planoPagto} options={planos}
              placeholder="Todos os planos" onChange={v => onChange({ ...filters, planoPagto: v })} />
            <SelectField label="Cliente" value={filters.cliente} options={clientes}
              placeholder="Todos os clientes" onChange={v => onChange({ ...filters, cliente: v })} />
            <SelectField label="Pedido" value={filters.pedido} options={pedidos.map(p => p)}
              placeholder="Todos os pedidos" onChange={v => onChange({ ...filters, pedido: v })} />

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
                style={{ background: 'var(--amber)', color: '#fff' }}
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

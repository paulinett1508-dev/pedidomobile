'use client'

import { useState, useCallback } from 'react'
import type { PedidoRow } from '@/app/api/admin/consulta/route'

const RCA_IDS = [
  '031','132','200','216','217','224','225','227','231','237',
  '240','245','248','251','252','254','256','257','258','259','260',
]

const SITUACOES = ['Faturado', 'Pendente', 'Cancelado']

const SIT_COLOR: Record<string, string> = {
  Faturado:  'var(--accent)',
  Pendente:  'var(--amber)',
  Cancelado: 'var(--danger)',
}

function inputStyle(active: boolean) {
  return {
    background: 'var(--surface)',
    border: `1px solid ${active ? 'var(--amber)' : 'var(--border)'}`,
    color: active ? 'var(--text)' : 'var(--muted)',
  }
}

export default function ConsultasOperacionais() {
  const [rca, setRca]             = useState('')
  const [situacao, setSituacao]   = useState('')
  const [estado, setEstado]       = useState('')
  const [search, setSearch]       = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim]     = useState('')

  const [rows, setRows]       = useState<PedidoRow[] | null>(null)
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const runQuery = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (rca)        params.set('rca', rca)
      if (situacao)   params.set('situacao', situacao)
      if (estado)     params.set('estado', estado)
      if (search)     params.set('search', search)
      if (dataInicio) params.set('dataInicio', dataInicio)
      if (dataFim)    params.set('dataFim', dataFim)

      const res = await fetch(`/api/admin/consulta?${params}`)
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      const data = await res.json() as { rows: PedidoRow[]; total: number }
      setRows(data.rows)
      setTotal(data.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [rca, situacao, estado, search, dataInicio, dataFim])

  function clearFilters() {
    setRca(''); setSituacao(''); setEstado('')
    setSearch(''); setDataInicio(''); setDataFim('')
    setRows(null); setTotal(0); setError('')
  }

  const fieldCls = 'px-3 py-2 rounded-lg text-sm outline-none'

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>
          Consultas Operacionais
        </h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Pesquise pedidos em todas as representadas com filtros combinados.
        </p>
      </div>

      {/* Filter panel */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Row 1 — search + date range */}
        <div className="flex flex-wrap gap-3 mb-3">
          <input
            type="text"
            placeholder="Buscar pedido, cliente, produto, município..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`${fieldCls} flex-1 min-w-52`}
            style={{ background: 'var(--surface)', border: `1px solid ${search ? 'var(--amber)' : 'var(--border)'}`, color: 'var(--text)' }}
          />
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              title="De:"
              value={dataInicio}
              onChange={e => setDataInicio(e.target.value)}
              className={fieldCls}
              style={inputStyle(!!dataInicio)}
            />
            <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>até</span>
            <input
              type="date"
              title="Até:"
              value={dataFim}
              onChange={e => setDataFim(e.target.value)}
              className={fieldCls}
              style={inputStyle(!!dataFim)}
            />
          </div>
        </div>

        {/* Row 2 — dropdowns */}
        <div className="flex flex-wrap gap-3 items-end">
          <select
            value={rca}
            onChange={e => setRca(e.target.value)}
            className={fieldCls}
            style={inputStyle(!!rca)}
          >
            <option value="">Todas as representadas</option>
            {RCA_IDS.map(id => (
              <option key={id} value={id}>RCA {id}</option>
            ))}
          </select>

          <select
            value={situacao}
            onChange={e => setSituacao(e.target.value)}
            className={fieldCls}
            style={inputStyle(!!situacao)}
          >
            <option value="">Todas as situações</option>
            {SITUACOES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="UF (ex: PI)"
            value={estado}
            onChange={e => setEstado(e.target.value.toUpperCase().slice(0, 2))}
            className={`${fieldCls} w-28`}
            style={inputStyle(!!estado)}
          />

          <div className="flex gap-2 ml-auto">
            {(rca || situacao || estado || search || dataInicio || dataFim) && (
              <button
                onClick={clearFilters}
                className={`${fieldCls}`}
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
              >
                Limpar
              </button>
            )}
            <button
              onClick={runQuery}
              disabled={loading}
              className={`${fieldCls} font-semibold px-5`}
              style={{
                background: loading ? 'var(--surface2)' : 'var(--accent)',
                color: loading ? 'var(--muted)' : '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Consultando...' : 'Consultar'}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-lg px-4 py-3 mb-4 text-sm"
          style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)' }}
        >
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-lg animate-pulse"
              style={{ background: 'var(--surface)', opacity: 1 - i * 0.1 }}
            />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && rows !== null && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
              {total === 0
                ? 'Nenhum pedido encontrado'
                : `${total.toLocaleString('pt-BR')} pedido${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          {total > 0 && (
            <>
              {/* Desktop table */}
              <div
                className="hidden md:block rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border)' }}
              >
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ background: 'var(--surface2)' }}>
                      {['Pedido', 'Data', 'Representada', 'Cliente', 'Município/UF', 'Itens', 'Total Líquido', 'Situação'].map(col => (
                        <th
                          key={col}
                          className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide"
                          style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={`${row.rcaId}-${row.pedido}-${i}`}
                        style={{
                          background: i % 2 === 0 ? 'var(--surface)' : 'transparent',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--accent)' }}>
                          #{row.pedido}
                        </td>
                        <td className="px-4 py-3" style={{ color: 'var(--text)' }}>
                          {row.data}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>
                          <span className="font-mono" style={{ color: 'var(--accent)' }}>
                            {row.rcaId}
                          </span>
                          {' '}
                          {row.representada}
                        </td>
                        <td className="px-4 py-3 max-w-52 truncate" style={{ color: 'var(--text)' }}>
                          {row.cliente}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted)' }}>
                          {row.municipio} / {row.estado}
                        </td>
                        <td className="px-4 py-3 text-center" style={{ color: 'var(--text)' }}>
                          {row.itens}
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--amber)' }}>
                          {row.totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              background: `${SIT_COLOR[row.situacao] ?? 'var(--muted)'}22`,
                              color: SIT_COLOR[row.situacao] ?? 'var(--muted)',
                            }}
                          >
                            {row.situacao}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden flex flex-col gap-3">
                {rows.map((row, i) => (
                  <div
                    key={`${row.rcaId}-${row.pedido}-${i}`}
                    className="rounded-xl p-4"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderLeft: `3px solid ${SIT_COLOR[row.situacao] ?? 'var(--muted)'}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-mono font-bold text-sm" style={{ color: 'var(--accent)' }}>
                          #{row.pedido}
                        </span>
                        <span className="text-xs ml-2" style={{ color: 'var(--muted)' }}>{row.data}</span>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium shrink-0"
                        style={{
                          background: `${SIT_COLOR[row.situacao] ?? 'var(--muted)'}22`,
                          color: SIT_COLOR[row.situacao] ?? 'var(--muted)',
                        }}
                      >
                        {row.situacao}
                      </span>
                    </div>
                    <p className="text-xs mb-1 truncate" style={{ color: 'var(--muted)' }}>
                      <span className="font-mono" style={{ color: 'var(--accent)' }}>{row.rcaId}</span>
                      {' '}{row.representada}
                    </p>
                    <p className="text-sm font-medium truncate mb-1" style={{ color: 'var(--text)' }}>
                      {row.cliente}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        {row.municipio} / {row.estado} · {row.itens} iten{row.itens !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--amber)' }}>
                        R$ {row.totalLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Empty state before first query */}
      {!loading && rows === null && (
        <div
          className="rounded-xl p-10 flex flex-col items-center gap-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Configure os filtros acima e clique em <strong>Consultar</strong>.
          </p>
        </div>
      )}
    </div>
  )
}

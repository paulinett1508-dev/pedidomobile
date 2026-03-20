import type { PedidoItem, RcaMeta } from '@/lib/types'

interface Props {
  meta: RcaMeta
  items: PedidoItem[]
}

function parseDateBR(s: string): Date | null {
  const [d, m, y] = s.split('/')
  if (!d || !m || !y) return null
  return new Date(Number(y), Number(m) - 1, Number(d))
}

export default function RcaSummaryHeader({ meta, items }: Props) {
  // Derived stats — computed once on the server
  const pedidosUnicos   = new Set(items.map(i => i.pedido))
  const clientesUnicos  = new Set(items.map(i => i.codCliente))
  const municipios      = new Set(items.map(i => i.municipio).filter(Boolean))
  const estados         = new Set(items.map(i => i.estado).filter(Boolean))

  // Valor total: sum totalLiquido per unique pedido
  const pedidoValorMap = new Map<string, number>()
  for (const i of items) {
    if (!pedidoValorMap.has(i.pedido)) pedidoValorMap.set(i.pedido, i.totalLiquido)
  }
  const valorTotal = Array.from(pedidoValorMap.values()).reduce((s, v) => s + v, 0)

  // Período: min/max data
  const datas = items.map(i => parseDateBR(i.data)).filter((d): d is Date => d !== null)
  const dataMin = datas.length ? new Date(Math.min(...datas.map(d => d.getTime()))) : null
  const dataMax = datas.length ? new Date(Math.max(...datas.map(d => d.getTime()))) : null
  const fmtDate = (d: Date) => d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })

  // Situação breakdown
  const sitCount = { Faturado: 0, Pendente: 0, Cancelado: 0, Outros: 0 }
  // count by unique pedido+situacao
  const pedidoSit = new Map<string, string>()
  for (const item of items) {
    if (!pedidoSit.has(item.pedido)) pedidoSit.set(item.pedido, item.situacao)
  }
  for (const sit of Array.from(pedidoSit.values())) {
    if (sit === 'Faturado')  sitCount.Faturado++
    else if (sit === 'Pendente')  sitCount.Pendente++
    else if (sit === 'Cancelado') sitCount.Cancelado++
    else sitCount.Outros++
  }
  const totalSit = pedidoSit.size

  // Top 5 produtos por quantidade total
  const prodQtde = new Map<string, number>()
  for (const item of items) {
    prodQtde.set(item.produto, (prodQtde.get(item.produto) ?? 0) + item.qtde)
  }
  const topProdutos = Array.from(prodQtde.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const maxProdQtde = topProdutos[0]?.[1] ?? 1

  const fmtValor = (v: number) =>
    v >= 1_000_000
      ? `R$ ${(v / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`
      : `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  return (
    <div
      className="rounded-xl mb-4 overflow-hidden"
      style={{ border: '1px solid var(--border)' }}
    >
      {/* Cabeçalho da representada */}
      <div
        className="px-5 py-4 flex items-start justify-between gap-4"
        style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{ background: 'var(--accent)', color: '#fff', fontWeight: 700 }}
            >
              RCA {meta.id}
            </span>
            {dataMin && dataMax && (
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                {fmtDate(dataMin)} → {fmtDate(dataMax)}
              </span>
            )}
          </div>
          <h2 className="text-base font-bold leading-snug" style={{ color: 'var(--text)' }}>
            {meta.representada}
          </h2>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl font-black" style={{ color: 'var(--amber)' }}>
            {fmtValor(valorTotal)}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>valor total est.</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0" style={{ '--tw-divide-opacity': 1, borderColor: 'var(--border)' } as React.CSSProperties}>
        {[
          { label: 'Pedidos',   value: pedidosUnicos.size.toLocaleString('pt-BR'),  color: 'var(--accent)' },
          { label: 'Clientes',  value: clientesUnicos.size.toLocaleString('pt-BR'), color: 'var(--accent)' },
          { label: 'Municípios', value: municipios.size.toLocaleString('pt-BR'),    color: 'var(--highlight)' },
          { label: 'Estados',   value: estados.size.toLocaleString('pt-BR'),        color: 'var(--highlight)' },
        ].map(s => (
          <div key={s.label} className="px-4 py-3 flex flex-col gap-0.5" style={{ background: 'var(--surface)' }}>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</span>
            <span className="text-2xl font-black leading-none" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Situação + Top Produtos */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderTop: '1px solid var(--border)', borderColor: 'var(--border)' } as React.CSSProperties}>

        {/* Situação */}
        <div className="px-4 py-3" style={{ background: 'var(--surface)' }}>
          <p className="text-xs uppercase tracking-wider mb-2.5" style={{ color: 'var(--muted)' }}>Situação dos Pedidos</p>
          <div className="flex flex-col gap-2">
            {([
              { key: 'Faturado',  count: sitCount.Faturado,  color: 'var(--accent)' },
              { key: 'Pendente',  count: sitCount.Pendente,  color: 'var(--amber)' },
              { key: 'Cancelado', count: sitCount.Cancelado, color: 'var(--danger)' },
              ...(sitCount.Outros > 0 ? [{ key: 'Outros', count: sitCount.Outros, color: 'var(--muted)' }] : []),
            ] as { key: string; count: number; color: string }[]).map(s => (
              <div key={s.key} className="flex items-center gap-2">
                <span className="text-xs w-16 shrink-0" style={{ color: 'var(--text)' }}>{s.key}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg)' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${totalSit ? Math.round((s.count / totalSit) * 100) : 0}%`, background: s.color }}
                  />
                </div>
                <span className="text-xs font-bold w-8 text-right shrink-0" style={{ color: s.color }}>
                  {s.count}
                </span>
                <span className="text-xs w-8 text-right shrink-0" style={{ color: 'var(--muted)' }}>
                  {totalSit ? `${Math.round((s.count / totalSit) * 100)}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Produtos */}
        <div className="px-4 py-3" style={{ background: 'var(--surface)' }}>
          <p className="text-xs uppercase tracking-wider mb-2.5" style={{ color: 'var(--muted)' }}>Top 5 Produtos (por qtde)</p>
          <div className="flex flex-col gap-2">
            {topProdutos.map(([nome, qtde]) => (
              <div key={nome} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate" style={{ color: 'var(--text)' }}>{nome}</p>
                  <div className="h-1 rounded-full mt-0.5" style={{ background: 'var(--bg)' }}>
                    <div
                      className="h-1 rounded-full"
                      style={{ width: `${Math.round((qtde / maxProdQtde) * 100)}%`, background: 'var(--accent)' }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold shrink-0" style={{ color: 'var(--amber)' }}>
                  {qtde.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

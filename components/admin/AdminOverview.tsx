'use client'

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

export default function AdminOverview() {
  const ids = getAllRcaIds()
  const totalItens   = Object.values(COUNTS).reduce((s, c) => s + c.itens,   0)
  const totalPedidos = Object.values(COUNTS).reduce((s, c) => s + c.pedidos, 0)

  return (
    <div>
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-6">
        <h2
          className="text-xl"
          style={{ color: '#E8F3EE', fontFamily: 'var(--font-serif)', fontWeight: 400 }}
        >
          Representadas
        </h2>
        <p
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: '#6B9E85', letterSpacing: '0.08em' }}
        >
          {ids.length} reps · {totalItens.toLocaleString('pt-BR')} itens · {totalPedidos.toLocaleString('pt-BR')} pedidos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ids.map(id => {
          const meta   = getRcaMeta(id)
          const counts = COUNTS[id]
          if (!meta) return null
          return (
            <div
              key={id}
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{ background: '#111A14', border: '1px solid #1E2A23' }}
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className="text-sm font-medium leading-snug"
                  style={{ color: '#E8F3EE' }}
                >
                  {meta.representada}
                </p>
                <span
                  className="font-mono text-xs shrink-0 mt-0.5"
                  style={{ color: '#6B9E85' }}
                >
                  {id}
                </span>
              </div>

              {counts && (
                <p className="font-mono text-xs" style={{ color: '#6B9E85' }}>
                  {counts.itens.toLocaleString('pt-BR')} itens · {counts.pedidos.toLocaleString('pt-BR')} pedidos
                </p>
              )}

              <Link
                href={`/admin/rca/${id}`}
                className="block text-center py-2 rounded-lg text-xs font-medium transition-colors"
                style={{
                  border: '1px solid #1E2A23',
                  color: '#6B9E85',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#2ECC8A'
                  el.style.color = '#2ECC8A'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#1E2A23'
                  el.style.color = '#6B9E85'
                }}
              >
                Ver relatório
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllRcaIds, getRcaMeta } from '@/lib/data'

interface VendorCard {
  id: string
  nome: string
  representada: string
}

export default function AdminOverview() {
  const [cards, setCards] = useState<VendorCard[]>([])

  useEffect(() => {
    const ids = getAllRcaIds()
    const result = ids.flatMap(id => {
      const meta = getRcaMeta(id)
      if (!meta) return []
      return [{ id: meta.id, nome: meta.vendedor, representada: meta.representada }]
    })
    setCards(result)
  }, [])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
        Visão Geral
      </h2>

      {cards.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>
          Nenhum RCA cadastrado
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map(c => (
            <div
              key={c.id}
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="font-mono text-xs px-2 py-1 rounded shrink-0 mt-0.5"
                  style={{ background: 'var(--surface2)', color: 'var(--accent)' }}
                >
                  {c.id}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text)' }}>
                    {c.nome}
                  </p>
                  <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--muted)' }}>
                    {c.representada}
                  </p>
                </div>
              </div>

              <Link
                href={`/admin/rca/${c.id}`}
                className="block text-center py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Ver relatório
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

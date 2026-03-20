'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import VendorForm from './VendorForm'

interface Vendor {
  id: string
  nome: string
}

export default function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/vendors')
      const data = await res.json() as Vendor[]
      setVendors(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleDelete(id: string) {
    setDeleting(true)
    try {
      await fetch(`/api/admin/vendors/${id}`, { method: 'DELETE' })
      await load()
    } finally {
      setDeleting(false)
      setConfirmDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
        Carregando...
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h2
          className="text-xl"
          style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)', fontWeight: 400 }}
        >
          Vendedores
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}
        >
          + Novo Vendedor
        </button>
      </div>

      {vendors.length === 0 ? (
        <p className="font-mono text-xs text-center py-12 uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
          Nenhum vendedor cadastrado
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {vendors.map(v => (
            <div
              key={v.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl gap-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="font-mono text-xs shrink-0"
                  style={{ color: 'var(--muted)' }}
                >
                  {v.id}
                </span>
                <span className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                  {v.nome}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/rca/${v.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:[border-color:var(--accent)] hover:[color:var(--accent)]"
                  style={{ border: '1px solid var(--border)', color: 'var(--muted)', background: 'transparent' }}
                >
                  Ver relatório
                </Link>
                <button
                  onClick={() => setConfirmDelete(v.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ border: '1px solid var(--danger)', color: 'var(--danger)', background: 'transparent', opacity: 0.7 }}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <VendorForm
          onSuccess={() => { setShowForm(false); load() }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <h3 className="font-medium" style={{ color: 'var(--text)' }}>Confirmar remoção</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Remover o vendedor de matrícula{' '}
              <strong className="font-mono" style={{ color: 'var(--text)' }}>{confirmDelete}</strong>?
              {' '}Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-70"
                style={{ border: '1px solid var(--border)', color: 'var(--muted)', background: 'transparent' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-opacity hover:opacity-80"
                style={{ background: 'var(--danger)', color: '#fff' }}
              >
                {deleting ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

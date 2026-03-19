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
    return <div className="py-8 text-center text-sm" style={{ color: 'var(--muted)' }}>Carregando...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
          Vendedores
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          + Novo Vendedor
        </button>
      </div>

      {vendors.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>
          Nenhum vendedor cadastrado
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {vendors.map(v => (
            <div
              key={v.id}
              className="flex items-center justify-between p-4 rounded-xl gap-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="font-mono text-xs px-2 py-1 rounded shrink-0"
                  style={{ background: 'var(--surface2)', color: 'var(--accent)' }}
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
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ background: 'var(--surface2)', color: 'var(--highlight)' }}
                >
                  Ver relatório
                </Link>
                <button
                  onClick={() => setConfirmDelete(v.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                  style={{ background: 'var(--surface2)', color: 'var(--danger)' }}
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
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDelete(null)} />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: 'var(--surface)' }}
          >
            <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Confirmar remoção</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Remover o vendedor de matrícula <strong style={{ color: 'var(--text)' }}>{confirmDelete}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
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

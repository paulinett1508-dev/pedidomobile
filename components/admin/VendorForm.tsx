'use client'

import { useState } from 'react'

interface VendorFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function VendorForm({ onSuccess, onCancel }: VendorFormProps) {
  const [id, setId] = useState('')
  const [nome, setNome] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id.trim(), nome: nome.trim() }),
      })
      const data = await res.json() as { error?: string }

      if (!res.ok) {
        setError(data.error ?? 'Erro ao salvar')
      } else {
        onSuccess()
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div
        className="relative w-full max-w-md rounded-2xl p-6 flex flex-col gap-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div>
          <h2
            className="text-lg"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)', fontWeight: 400 }}
          >
            Novo Vendedor
          </h2>
          <p className="text-xs font-mono mt-0.5 uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
            Cadastro de representada
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
              Matrícula
            </label>
            <input
              type="text"
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder="ex: 225"
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none font-mono"
              style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
              Razão Social
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Nome da representada"
              required
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>

          {error && (
            <p className="text-xs font-mono" style={{ color: 'var(--danger)' }}>{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-70"
              style={{ border: '1px solid var(--border)', color: 'var(--muted)', background: 'transparent' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

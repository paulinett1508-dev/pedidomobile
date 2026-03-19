'use client'

import { useState } from 'react'

interface PasswordSectionProps {
  title: string
  info: string
  pwd: string
  setPwd: (v: string) => void
  pwd2: string
  setPwd2: (v: string) => void
  msg: { ok: boolean; text: string } | null
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function PasswordSection({
  title,
  info,
  pwd,
  setPwd,
  pwd2,
  setPwd2,
  msg,
  loading,
  onSubmit,
}: PasswordSectionProps) {
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div>
        <h3 className="font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{title}</h3>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>{info}</p>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
          Nova senha
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--muted)' }}
            tabIndex={-1}
          >
            <EyeIcon open={show} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
          Confirmar senha
        </label>
        <div className="relative">
          <input
            type={show2 ? 'text' : 'password'}
            value={pwd2}
            onChange={e => setPwd2(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
          <button
            type="button"
            onClick={() => setShow2(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--muted)' }}
            tabIndex={-1}
          >
            <EyeIcon open={show2} />
          </button>
        </div>
      </div>

      {msg && (
        <p className="text-sm" style={{ color: msg.ok ? 'var(--accent)' : 'var(--danger)' }}>
          {msg.text}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="py-2.5 rounded-lg text-sm font-medium disabled:opacity-60 transition-opacity hover:opacity-80"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        {loading ? 'Salvando...' : 'Salvar senha'}
      </button>
    </form>
  )
}

export default function PasswordForm() {
  const [vendorPwd, setVendorPwd] = useState('')
  const [vendorPwd2, setVendorPwd2] = useState('')
  const [adminPwd, setAdminPwd] = useState('')
  const [adminPwd2, setAdminPwd2] = useState('')
  const [vendorMsg, setVendorMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [adminMsg, setAdminMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [loadingV, setLoadingV] = useState(false)
  const [loadingA, setLoadingA] = useState(false)

  async function handleVendor(e: React.FormEvent) {
    e.preventDefault()
    if (vendorPwd !== vendorPwd2) {
      setVendorMsg({ ok: false, text: 'As senhas não coincidem' })
      return
    }
    setLoadingV(true)
    setVendorMsg(null)
    try {
      const res = await fetch('/api/admin/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'vendor', newPassword: vendorPwd }),
      })
      if (res.ok) {
        setVendorMsg({ ok: true, text: 'Senha dos vendedores atualizada!' })
        setVendorPwd('')
        setVendorPwd2('')
      } else {
        const d = await res.json() as { error?: string }
        setVendorMsg({ ok: false, text: d.error ?? 'Erro ao salvar' })
      }
    } catch {
      setVendorMsg({ ok: false, text: 'Erro de conexão' })
    } finally {
      setLoadingV(false)
    }
  }

  async function handleAdmin(e: React.FormEvent) {
    e.preventDefault()
    if (adminPwd !== adminPwd2) {
      setAdminMsg({ ok: false, text: 'As senhas não coincidem' })
      return
    }
    setLoadingA(true)
    setAdminMsg(null)
    try {
      const res = await fetch('/api/admin/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'admin', newPassword: adminPwd }),
      })
      if (res.ok) {
        setAdminMsg({ ok: true, text: 'Senha do gerente atualizada!' })
        setAdminPwd('')
        setAdminPwd2('')
      } else {
        const d = await res.json() as { error?: string }
        setAdminMsg({ ok: false, text: d.error ?? 'Erro ao salvar' })
      }
    } catch {
      setAdminMsg({ ok: false, text: 'Erro de conexão' })
    } finally {
      setLoadingA(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Senhas</h2>

      <PasswordSection
        title="Senha dos Vendedores"
        info="Altera a senha única usada por todos os vendedores."
        pwd={vendorPwd}
        setPwd={setVendorPwd}
        pwd2={vendorPwd2}
        setPwd2={setVendorPwd2}
        msg={vendorMsg}
        loading={loadingV}
        onSubmit={handleVendor}
      />

      <PasswordSection
        title="Senha do Gerente"
        info="Altera a senha de acesso ao painel administrativo."
        pwd={adminPwd}
        setPwd={setAdminPwd}
        pwd2={adminPwd2}
        setPwd2={setAdminPwd2}
        msg={adminMsg}
        loading={loadingA}
        onSubmit={handleAdmin}
      />
    </div>
  )
}

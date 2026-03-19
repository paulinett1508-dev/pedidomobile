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
        <input
          type="password"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>
          Confirmar senha
        </label>
        <input
          type="password"
          value={pwd2}
          onChange={e => setPwd2(e.target.value)}
          required
          minLength={6}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
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

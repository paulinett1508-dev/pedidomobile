'use client'

import Logo from '../Logo'
import ThemeToggle from '../ThemeToggle'

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection: string
  onSectionChange: (s: string) => void
}

const sections = [
  {
    id: 'overview',
    label: 'Visão Geral',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    id: 'vendors',
    label: 'Vendedores',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'passwords',
    label: 'Senhas',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
]

export default function AdminLayout({ children, activeSection, onSectionChange }: AdminLayoutProps) {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'var(--bg)' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 shrink-0 min-h-screen sticky top-0"
        style={{ background: '#0D1117', borderRight: '1px solid #1E2A23' }}
      >
        {/* Logo */}
        <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderBottom: '1px solid #1E2A23' }}>
          <div className="bg-white rounded px-1 py-0.5 shrink-0">
            <Logo size="sm" />
          </div>
          <div>
            <p className="text-xs font-bold leading-tight" style={{ color: '#E8F3EE' }}>Pedido Mobile</p>
            <p className="text-xs leading-tight" style={{ color: '#6B9E85' }}>Gerência</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          <p
            className="px-2 pb-2 text-xs font-mono uppercase tracking-widest"
            style={{ color: '#6B9E85', letterSpacing: '0.1em' }}
          >
            Painel
          </p>
          {sections.map(s => {
            const active = activeSection === s.id
            return (
              <button
                key={s.id}
                onClick={() => onSectionChange(s.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left relative"
                style={{
                  background: active ? 'rgba(46,204,138,0.06)' : 'transparent',
                  color: active ? '#E8F3EE' : '#6B9E85',
                  borderLeft: active ? '2px solid #2ECC8A' : '2px solid transparent',
                }}
              >
                <span style={{ color: active ? '#2ECC8A' : '#6B9E85', flexShrink: 0 }}>{s.icon}</span>
                {s.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #1E2A23' }}>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
            style={{ background: 'transparent', color: '#6B9E85', border: '1px solid #1E2A23' }}
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0">
        {/* Mobile header */}
        <header
          className="md:hidden sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
          style={{ background: '#0D1117', borderBottom: '1px solid #1E2A23' }}
        >
          <div className="flex items-center gap-2">
            <div className="bg-white rounded px-1 py-0.5">
              <Logo size="sm" />
            </div>
            <span className="text-xs font-bold" style={{ color: '#E8F3EE' }}>Gerência</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ color: '#6B9E85', border: '1px solid #1E2A23' }}
            >
              Sair
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ background: '#0D1117', borderTop: '1px solid #1E2A23' }}
      >
        {sections.map(s => {
          const active = activeSection === s.id
          return (
            <button
              key={s.id}
              onClick={() => onSectionChange(s.id)}
              className="flex-1 flex flex-col items-center py-2.5 gap-1 text-xs font-medium transition-colors"
              style={{ color: active ? '#2ECC8A' : '#6B9E85' }}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

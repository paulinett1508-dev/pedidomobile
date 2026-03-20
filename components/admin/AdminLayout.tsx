'use client'

import Logo from '../Logo'
import ThemeToggle from '../ThemeToggle'

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection: string
  onSectionChange: (s: string) => void
}

const NAV_GROUPS = [
  {
    label: 'Painel',
    items: [
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
        id: 'consultas',
        label: 'Consultas',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Configurações',
    items: [
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
    ],
  },
]

// Flat list for mobile bottom nav (Painel items only — Configurações ficam fora do bottom nav)
const MOBILE_NAV = NAV_GROUPS.flatMap(g => g.items)

export default function AdminLayout({ children, activeSection, onSectionChange }: AdminLayoutProps) {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'var(--bg)' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--amber-subtle)' }}
      >
        {/* Logo */}
        <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderBottom: '2px solid var(--amber-outline)' }}>
          <div className="rounded px-1 py-0.5 shrink-0" style={{ background: '#fff', outline: '2px solid var(--amber-outline)', outlineOffset: '1px' }}>
            <Logo size="sm" />
          </div>
          <div>
            <p className="text-xs font-bold leading-tight" style={{ color: 'var(--amber)' }}>Pedido Mobile</p>
            <p className="text-xs leading-tight" style={{ color: 'var(--muted)' }}>Gerência</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-4 overflow-y-auto">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p
                className="px-2 pb-1.5 text-xs font-mono uppercase tracking-widest"
                style={{ color: 'var(--amber)', opacity: 0.8, letterSpacing: '0.1em' }}
              >
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map(s => {
                  const active = activeSection === s.id
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSectionChange(s.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left"
                      style={{
                        background: active ? 'var(--amber-glow)' : 'transparent',
                        color: active ? 'var(--text)' : 'var(--muted)',
                        borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                      }}
                    >
                      <span style={{ color: active ? 'var(--accent)' : 'var(--muted)', flexShrink: 0 }}>{s.icon}</span>
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '2px solid var(--amber-outline)' }}>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
            style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' }}
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
          style={{ background: 'var(--surface)', borderBottom: '2px solid var(--amber-outline)' }}
        >
          <div className="flex items-center gap-2">
            <div className="rounded px-1 py-0.5" style={{ background: '#fff', outline: '2px solid var(--amber-outline)', outlineOffset: '1px' }}>
              <Logo size="sm" />
            </div>
            <span className="text-xs font-bold" style={{ color: 'var(--amber)' }}>Gerência</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              Sair
            </button>
          </div>
        </header>

        <main className="flex-1 w-full px-4 py-6">
          {children}
          <footer className="mt-10 flex flex-col items-center gap-2 pb-6" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <img src="/logo_sobral.svg" alt="Laboratório Sobral" className="h-16 opacity-70" />
            <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
              © {new Date().getFullYear()} Laboratório Sobral. Todos os direitos reservados.
            </p>
            <p className="text-xs text-center" style={{ color: 'var(--muted)', opacity: 0.6 }}>
              Sistema de consulta de pedidos — dados encerrados em 31/12/2025.
            </p>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ background: 'var(--surface)', borderTop: '2px solid var(--amber-outline)' }}
      >
        {MOBILE_NAV.map(s => {
          const active = activeSection === s.id
          return (
            <button
              key={s.id}
              onClick={() => onSectionChange(s.id)}
              className="flex-1 flex flex-col items-center py-2.5 gap-1 text-xs font-medium transition-colors"
              style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}
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
